<template>
  <div
    ref="headerElement"
    class="nsg-header nsg-header--pc w-full text-white"
  >
    <div class="nsg-header__viewport w-full py-4 hidden lg:block">
      <div class="nsg-header__inner w-full flex justify-between items-center">
        <img
          src="/nsg16/logo.png"
          class="nsg-header__logo w-20 cursor-pointer"
          alt=""
          @click="openPath('/')"
        />
        <div class="nsg-header__nav flex justify-end items-center text-lg">
          <div
            class="nsg-header__link ml-6 cursor-pointer"
            @click="openPath('/')"
          >
            {{ $t("das.nav.home") }}
          </div>
          <div
            class="nsg-header__link ml-6 cursor-pointer"
            @click="openPath('/about')"
          >
            {{ $t("das.dmk.about") }}
          </div>
          <div
            class="nsg-header__link ml-6 flex justify-start items-center cursor-pointer"
            ref="profileTrigger"
            @click="toggleProfile"
          >
            <span>{{ $t("das.dmk.profile") }}</span>
            <van-icon
              :name="profileOpen ? 'arrow-up' : 'arrow-down'"
              class="ml-2"
            />
          </div>
          <template v-if="isAuthenticated">
            <div
              class="ml-6 flex justify-start items-center"
            >
              <div
                class="nsg-gradient-button nsg-header__start w-32 rounded-full bg-[#46444c] cursor-pointer text-center py-2 text-white"
                @click="openPath('/starting')"
              >
                {{ $t("das.dmk.startWork") }}
              </div>
              <div class="ml-6">
                <img
                  :src="avatar"
                  class="nsg-header__avatar w-12 h-12 rounded-full cursor-pointer object-cover"
                  alt=""
                  @error="avatarFailed = true"
                  @click="openPath('/my')"
                />
              </div>
            </div>
          </template>
          <div
            v-else
            class="nsg-header__guest ml-6 w-36 rounded-full bg-[#46444c] hover:bg-[var(--main-color)] text-center cursor-pointer hover:text-black py-2"
            @click="openPath('/account/login')"
          >
          <span>{{ $t("das.dmk.startWork") }}</span>
            <img src="/nsg16/profile-placeholder.png" class="nsg-header__avatar" alt="" />
          </div>
        </div>
      </div>

      <div class="pc">
        <van-popup v-model:show="profileOpen" position="top" class="nsg-profile-menu" :style="menuPosition">
          <section>
            <h2>{{ $t("das.dmk.profile") }}</h2>
            <div class="nsg-profile-menu__links">
              <button v-for="item in profileItems" :key="item.labelKey" type="button" :class="{ 'is-logout': item.red }" @click="openItem(item)">
                <span>{{ $t(item.labelKey) }}</span><span aria-hidden="true">↗</span>
              </button>
            </div>
          </section>
          <section class="nsg-profile-menu__services">
            <h2>{{ $t("das.dmk.coreService") }}</h2>
            <div>
              <button v-for="service in services" :key="service.nameKey" type="button" :disabled="service.disabled" @click="openPath(service.path)">
                <strong>{{ $t(service.nameKey) }}</strong><span>{{ $t(service.copyKey) }}</span>
              </button>
            </div>
          </section>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDmkHeader } from "@/components/dmk/useDmkHeader.js";
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  authenticated: { type: Boolean, default: undefined },
});
const profileOpen = ref(false);
const headerElement = ref(null);
const profileTrigger = ref(null);
const menuPosition = ref({});
const alignProfileMenu = () => {
  if (!profileTrigger.value || !headerElement.value) return;
  const width = Math.min(848, window.innerWidth - 48);
  const right = profileTrigger.value.getBoundingClientRect().right;
  menuPosition.value = {
    left: `${Math.max(24, Math.min(right - width, window.innerWidth - width - 24))}px`,
    top: `${headerElement.value.getBoundingClientRect().bottom}px`,
  };
};
const toggleProfile = () => {
  alignProfileMenu();
  profileOpen.value = !profileOpen.value;
};
onMounted(() => window.addEventListener("resize", alignProfileMenu));
onBeforeUnmount(() => window.removeEventListener("resize", alignProfileMenu));
const {
  profileItems,
  services,
  avatarFailed,
  isAuthenticated,
  avatar,
  openPath,
  openItem,
} = useDmkHeader(props, () => {
  profileOpen.value = false;
});
</script>
