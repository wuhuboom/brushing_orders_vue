<template>
  <div class="w-full text-white dmk-h5-header dmk-header-scope">
    <div class="w-full">
      <div
        class="w-full bg-black p-4 flex justify-between items-center"
      >
        <img
          src="/dmk/assets/logo.png"
          class="w-14 cursor-pointer"
          alt=""
          @click="openPath('/')"
        />
        <div class="ml-6 flex justify-start items-center">
          <template v-if="isAuthenticated">
            <div
              class="w-28 rounded-full bg-[var(--main-color)] cursor-pointer text-center py-2 text-black text-sm"
              @click="openPath('/starting')"
            >
              {{ $t("das.dmk.startWork") }}
            </div>
            <div
              class="ml-2 cursor-pointer"
              @click="openMenu"
            >
              <img
                src="/dmk/assets/menu.png"
                class="w-12 h-12 rounded-full"
                alt=""
              />
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
    </div>

    <van-popup
      v-if="isAuthenticated"
      v-model:show="menuOpen"
      position="top"
      round
      closeable
      :style="{ background: 'rgba(50, 50, 50, 0.9)', minHeight: '30%' }"
      class="dmk-h5-profile-popup"
    >
      <div class="w-full p-4 text-white">
        <div
          class="w-full flex flex-col justify-center items-center pt-10"
        >
          <img
            :src="avatar"
            class="w-20 h-20 rounded-full object-cover"
            alt=""
            @error="avatarFailed = true"
          />
          <div class="text-lg">{{ displayName }}</div>
          <div class="mt-2 text-sm">
            {{ $t("das.dmk.invitationCode") }}:
            {{ userInfo.inviteCode || "—" }}
          </div>
          <div class="mt-2 text-sm">
            {{ $t("das.profile.credit") }}:
          </div>
          <div class="w-[80%] mt-2">
            <DmkCreditRunner :percentage="creditPercent" compact />
          </div>
          <div
            class="w-full border-y-[1px] py-4 text-sm text-center border-[#636363] mt-4 grid grid-cols-2 place-content-center"
          >
            <div class="col-span-1">
              <p>{{ $t("das.dmk.walletAmount") }}</p>
              <p class="mt-2">
                {{ money(userInfo.totalBalance ?? userInfo.balance) }}
                {{ $t("das.dmk.currencyUsd") }}
              </p>
            </div>

            <div class="col-span-1">
              <p>{{ $t("das.dmk.anniversaryBonus") }}</p>
              <p class="mt-2">
                {{ money(anniversaryBonus) }} {{ $t("das.dmk.currencyUsd") }}
              </p>
            </div>
            <div class="h-[20px] col-span-2"></div>
            <div class="col-span-1">
              <p>{{ $t("das.dmk.pendingAmount") }}</p>
              <p class="mt-2">
                {{ money(pendingAmount) }} {{ $t("das.dmk.currencyUsd") }}
              </p>
            </div>
            <div class="col-span-1">
              <p>{{ $t("das.records.commission") }}</p>
              <p class="mt-2">
                {{ money(userInfo.commission) }} {{ $t("das.dmk.currencyUsd") }}
              </p>
            </div>
          </div>
          <div
            class="w-full mt-4 text-center flex justify-center items-center cursor-pointer"
            @click="openPath('/about')"
          >
            <span class="text-lg">{{
              $t("das.dmk.about")
            }}</span>
          </div>
          <div
            class="w-full mt-4 text-center flex items-center border-b-[2px] pb-2"
            :class="
              profileExpanded
                ? 'justify-between border-[var(--main-color)]'
                : 'justify-center border-transparent'
            "
            @click="profileExpanded = !profileExpanded"
          >
            <span class="text-lg">{{
              $t("das.dmk.profile")
            }}</span>
            <van-icon
              :name="profileExpanded ? 'arrow-up' : 'arrow-down'"
              class="ml-2"
            />
          </div>
          <div
            v-if="profileExpanded"
            class="w-full mt-4 px-4"
          >
            <div class="w-full grid grid-cols-2 gap-4">
              <div
                v-for="item in profileItems"
                :key="item.labelKey"
                class="col-span-1 flex justify-between items-center cursor-pointer"
                @click="openItem(item)"
              >
                <span
                  :class="item.red ? 'text-[red]' : ''"
                  >{{ $t(item.labelKey) }}</span
                >
                <img
                  src="/dmk/assets/xie.png"
                  class="w-4"
                  alt=""
                />
              </div>
              <div
                class="col-span-2 h-[2px] bg-[#6b6b6b]"
              ></div>
            </div>
            <div class="text-white mt-4 w-full">
              <div class="w-full">
                {{ $t("das.dmk.coreService") }}
              </div>
              <div
                class="w-full flex-1 grid grid-cols-1 gap-4"
              >
                <div
                  v-for="service in services"
                  :key="service.nameKey"
                  class="col-span-1 cursor-pointer"
                  @click="openPath(service.path)"
                >
                  <p>{{ $t(service.nameKey) }}</p>
                  <p class="text-sm text-[#979797]">
                    {{ $t(service.copyKey) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import DmkCreditRunner from "@/components/dmk/DmkCreditRunner.vue";
import { useDmkHeader } from "@/components/dmk/useDmkHeader.js";
import { useUserStore } from "@/store/modules/user";
import { ref, watch } from "vue";

const props = defineProps({
  authenticated: { type: Boolean, default: undefined },
  menuInitiallyOpen: { type: Boolean, default: false },
  profileInitiallyOpen: { type: Boolean, default: false },
});

const menuOpen = ref(props.menuInitiallyOpen);
const profileExpanded = ref(props.profileInitiallyOpen);
const store = useUserStore();
const openMenu = () => {
  store.getUserInfo();
  menuOpen.value = true;
};
const {
  profileItems,
  services,
  avatarFailed,
  isAuthenticated,
  userInfo,
  avatar,
  displayName,
  creditPercent,
  pendingAmount,
  anniversaryBonus,
  money,
  openPath,
  openItem,
} = useDmkHeader(props, () => {
  menuOpen.value = false;
});
watch(menuOpen, (open) => {
  if (!open) profileExpanded.value = false;
});
</script>

<style scoped>
.dmk-h5-header {
  position: sticky;
  top: 0;
  z-index: 100;
}
:deep(.dmk-h5-profile-popup) {
  color: #fff;
}
:deep(.dmk-h5-profile-popup .van-popup__close-icon) {
  color: #fff;
}
</style>
