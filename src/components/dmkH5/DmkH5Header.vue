<template>
  <div class="nsg-header nsg-header--h5 w-full text-white dmk-h5-header">
    <div class="w-full">
      <div
        class="nsg-header__inner w-full bg-black p-4 flex justify-between items-center"
      >
        <img
          src="/nsg16/logo.png"
          class="nsg-header__logo w-14 cursor-pointer"
          alt=""
          @click="openPath('/')"
        />
        <span class="nsg-header__tagline">Nexavanta Search Group</span>
        <div class="ml-6 flex justify-start items-center">
          <slot name="actions" />
          <template v-if="isAuthenticated">
            <div
              class="nsg-gradient-button nsg-header__start w-28 rounded-full bg-[var(--main-color)] cursor-pointer text-center py-2 text-black text-sm"
              @click="openPath('/starting')"
            >
              {{ $t("das.dmk.startWork") }}
            </div>
            <div
              class="ml-2 cursor-pointer"
              @click="openMenu"
            >
              <img
                :src="avatar"
                class="nsg-header__avatar w-12 h-12 rounded-full object-cover"
                alt=""
              />
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
    </div>

    <van-popup
      v-if="isAuthenticated"
      v-model:show="menuOpen"
      position="top"
      round
      closeable
      overlay-class="nsg-h5-profile-overlay"
      :style="{ background: 'rgba(50, 50, 50, 0.9)', minHeight: '30%' }"
      class="dmk-h5-profile-popup"
    >
      <div class="nsg-h5-profile-title">{{ $t("das.dmk.personalProfile") }}</div>
      <div class="nsg-h5-profile-content">
        <section class="nsg-h5-profile-identity">
          <img
            :src="avatar"
            class="nsg-h5-profile-avatar"
            alt=""
            @error="avatarFailed = true"
          />
          <div class="nsg-h5-profile-identity__copy">
            <div class="nsg-h5-profile-name">
              <strong>{{ displayName }}</strong>
              <NsgVipBadge :label="levelName" />
            </div>
            <div class="nsg-h5-profile-invite">
              {{ $t("das.dmk.invitationCode") }}:
              <b>{{ userInfo.inviteCode || "—" }}</b>
              <img src="/nsg16/profile-copy.png" class="nsg-copy-asset" alt="" />
            </div>
          </div>
        </section>

        <section class="nsg-h5-profile-summary">
          <div class="nsg-h5-profile-metrics">
            <div>
              <span>{{ $t("das.dmk.walletAmount") }}</span>
              <strong>{{ money(userInfo.totalBalance ?? userInfo.balance) }} {{ $t("das.dmk.currencyUsd") }}</strong>
            </div>
            <div>
              <span>{{ $t("das.dmk.pendingAmount") }}</span>
              <strong>{{ money(pendingAmount) }} {{ $t("das.dmk.currencyUsd") }}</strong>
            </div>
            <div>
              <span>{{ $t("das.dmk.anniversaryBonus") }}</span>
              <strong>{{ money(anniversaryBonus) }} {{ $t("das.dmk.currencyUsd") }}</strong>
            </div>
            <div>
              <span>{{ $t("das.records.commission") }}</span>
              <strong>{{ money(userInfo.commission) }} {{ $t("das.dmk.currencyUsd") }}</strong>
            </div>
          </div>
          <div class="nsg-h5-profile-credit">
            <div><span>{{ $t("das.profile.credit") }}</span><b>{{ creditPercent }}%</b></div>
            <DmkCreditRunner :percentage="creditPercent" compact />
          </div>
        </section>

        <button class="nsg-h5-profile-about" type="button" @click="openPath('/about')">{{ $t("das.dmk.about") }}</button>

        <section class="nsg-h5-profile-menu">
          <button
            class="nsg-h5-profile-menu__title"
            type="button"
            @click="profileExpanded = !profileExpanded"
          >
            <span>{{ $t("das.dmk.profile") }}</span>
            <img src="/nsg16/profile-chevron.png" class="nsg-menu-chevron" :class="{ 'is-open': profileExpanded }" alt="" />
          </button>
          <div
            v-if="profileExpanded"
            class="nsg-h5-profile-menu__body"
          >
            <div class="nsg-h5-profile-links">
              <button
                v-for="item in profileItems"
                :key="item.labelKey"
                type="button"
                :class="{ 'is-danger': item.red }"
                @click="openItem(item)"
              >
                <img :src="`/nsg16/menu-${item.iconName}.png`" alt="" />
                <span>{{ $t(item.labelKey) }}</span>
              </button>
            </div>
            <div class="nsg-h5-profile-services">
              <h2>{{ $t("das.dmk.coreService") }}</h2>
              <div>
                <button
                  v-for="service in services"
                  :key="service.nameKey"
                  type="button"
                  :disabled="service.disabled"
                  @click="openPath(service.path)"
                >
                  <strong>{{ $t(service.nameKey) }}</strong>
                  <span>{{ $t(service.copyKey) }}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import NsgVipBadge from "@/components/nsg/NsgVipBadge.vue";
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
  levelName,
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
