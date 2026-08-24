<template>
  <div
    class="w-full flex justify-between items-center max-w-[1200px] mx-auto text-white dmk-header-scope dmk-site-scope"
  >
    <div class="w-full py-4 hidden lg:block">
      <div class="w-full flex justify-between items-center">
        <img
          src="/dmk/assets/logo.png"
          class="w-20 cursor-pointer"
          alt=""
          @click="openPath('/')"
        />
        <div class="flex justify-end items-center text-lg">
          <div
            class="ml-6 cursor-pointer"
            @click="openPath('/about')"
          >
            {{ $t("das.dmk.about") }}
          </div>
          <div
            class="ml-6 flex justify-start items-center cursor-pointer"
            @click="profileOpen = !profileOpen"
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
                class="w-32 rounded-full bg-[#46444c] cursor-pointer text-center py-2 text-white"
                @click="openPath('/starting')"
              >
                {{ $t("das.dmk.startWork") }}
              </div>
              <div class="ml-6">
                <img
                  :src="avatar"
                  class="w-12 h-12 rounded-full cursor-pointer object-cover"
                  alt=""
                  @error="avatarFailed = true"
                  @click="openPath('/my')"
                />
              </div>
            </div>
          </template>
          <div
            v-else
            class="ml-6 w-36 rounded-full bg-[#46444c] hover:bg-[var(--main-color)] text-center cursor-pointer hover:text-black py-2"
            @click="openPath('/account/login')"
          >
            {{ $t("das.dmk.login") }}
          </div>
        </div>
      </div>

      <div class="pc">
        <van-popup v-model:show="profileOpen" position="top">
          <div class="w-full">
            <div
              class="text-white w-full flex justify-between items-start"
            >
              <div class="w-[200px]">
                {{ $t("das.dmk.profile") }}
              </div>
              <div
                class="w-full flex-1 grid grid-cols-4 gap-4 gap-x-8"
              >
                <div
                  v-for="item in profileItems"
                  :key="item.labelKey"
                  class="col-span-1 flex justify-between items-center cursor-pointer hover:text-[var(--main-color)]"
                  @click="openItem(item)"
                >
                  <span
                    :class="item.red ? 'text-[red]' : ''"
                    >{{ $t(item.labelKey) }}</span
                  >
                  <img
                    src="/dmk/assets/xie.png"
                    class="w-6"
                    alt=""
                  />
                </div>
                <div
                  class="col-span-4 h-[2px] bg-[#6b6b6b]"
                ></div>
              </div>
            </div>
            <div
              class="text-white mt-4 w-full flex justify-between items-start"
            >
              <div class="w-[200px]">
                {{ $t("das.dmk.coreService") }}
              </div>
              <div
                class="w-full flex-1 grid grid-cols-3 gap-4"
              >
                <div
                  v-for="service in services"
                  :key="service.nameKey"
                  class="col-span-1 cursor-pointer"
                  @click="openPath(service.path)"
                >
                  <p>{{ $t(service.nameKey) }}</p>
                  <p class="text-xs text-[#6b6b6b]">
                    {{ $t(service.copyKey) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDmkHeader } from "@/components/dmk/useDmkHeader.js";
import { ref } from "vue";

const props = defineProps({
  authenticated: { type: Boolean, default: undefined },
});
const profileOpen = ref(false);
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
