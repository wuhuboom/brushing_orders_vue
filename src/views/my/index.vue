<template>
  <DmkPcAccountShell active="personal">
    <div>
      <div class="w-full flex justify-between items-center">
        <div class="flex justify-start items-center">
          <img :src="avatar" class="w-14 h-14 rounded-full overflow-hidden object-cover" alt="" @error="avatarFailed = true" />
          <span class="text-3xl ml-4 font-semibold">{{ displayName }}</span>
        </div>
        <img :src="pcLevelIcon" class="w-12" alt="" />
      </div>
      <div class="mt-4 text-lg">{{ $t("das.dmk.invitationCode") }}: {{ userInfo.inviteCode || "—" }}</div>
      <div class="w-full flex justify-start items-center text-lg mt-4">
        <div class="whitespace-nowrap">{{ $t("das.dmk.creditScore") }}:</div>
        <div class="dmk-credit-score-bar w-full ml-2">
          <DmkCreditRunner :percentage="creditPercent" />
        </div>
      </div>
      <div class="w-full py-4 text-lg flex justify-between items-center">
        <div class="col-span-1"><p>{{ $t("das.dmk.walletAmount") }}</p><p class="mt-2 text-2xl">{{ money(userInfo.totalBalance ?? userInfo.balance) }} {{ $t("das.dmk.currencyUsd") }}</p></div>
        <div class="col-span-1"><p>{{ $t("das.dmk.pendingAmount") }}</p><p class="mt-2 text-2xl">{{ money(pcPendingAmount) }} {{ $t("das.dmk.currencyUsd") }}</p></div>
        <div class="col-span-1"><p>{{ $t("das.dmk.anniversaryBonus") }}</p><p class="mt-2 text-2xl">{{ money(pcAnniversaryBonus) }} {{ $t("das.dmk.currencyUsd") }}</p></div>
        <div class="col-span-1"><p>{{ $t("das.dmk.commission") }}</p><p class="mt-2 text-2xl">{{ money(userInfo.commission) }} {{ $t("das.dmk.currencyUsd") }}</p></div>
      </div>
    </div>
  </DmkPcAccountShell>
  <DmkH5Layout class="dmk-mobile-current" :menu-initially-open="true" :profile-initially-open="true">
    <DmkH5HomeContent />
  </DmkH5Layout>
</template>

<script setup>
import DmkPcAccountShell from "@/components/dmkPc/DmkPcAccountShell.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import DmkH5HomeContent from "@/components/dmkH5/DmkH5HomeContent.vue";
import DmkCreditRunner from "@/components/dmk/DmkCreditRunner.vue";
import { computed, onMounted, ref } from "vue";
import { showToast } from "vant";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/store/modules/user";
import { userGetInfo } from "@/api/apis";
import { setWithdrawalCredential } from "@/utils/withdrawalCredential";
import { safePush } from "@/utils/navigation";

const router = useRouter();
const { t: tCopy } = useI18n();
const store = useUserStore();
const userInfo = ref(store.userInfo || {});
const base = window.g?.VITE_API_IMG_URL || "";
const avatarFailed = ref(false);
const withdrawalPasswordDialog = ref(null);

const avatarPath = computed(() => String(userInfo.value.avatar ?? "").trim());
const defaultAvatar = computed(() => "/dmk/assets/avatar.png");
const hasCustomAvatar = computed(() => {
  const path = avatarPath.value;
  return Boolean(
    path &&
      !["null", "undefined"].includes(path.toLowerCase()) &&
      !avatarFailed.value,
  );
});
const avatar = computed(() => {
  const path = avatarPath.value;
  if (!hasCustomAvatar.value) {
    return defaultAvatar.value;
  }
  return /^https?:/i.test(path) ? path : `${base}${path}`;
});

const displayName = computed(() => userInfo.value.username || "—");
const initials = computed(() => {
  const name = displayName.value === "—" ? "M" : displayName.value;
  return name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
});

const money = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const creditPercent = computed(() => {
  const value = Number(userInfo.value.creditScore);
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
});
const pcPendingAmount = computed(() =>
  userInfo.value.frozenBalance ??
  userInfo.value.pendingAmount ??
  userInfo.value.freezeAmount ??
  userInfo.value.frozenAmount ??
  userInfo.value.frozen ??
  0,
);
const pcAnniversaryBonus = computed(() =>
  userInfo.value.anniversaryBonus ?? userInfo.value.bonus ?? userInfo.value.rewardAmount ?? 0,
);
const pcLevelIcon = computed(() => {
  const path =
    userInfo.value.userLevel?.icon ??
    userInfo.value.memberLevel?.icon ??
    userInfo.value.levelIcon ??
    userInfo.value.vipIcon;
  if (path) return /^https?:/i.test(String(path)) ? path : `${base}${path}`;
  const level = Math.min(4, Math.max(1, Number(userInfo.value.levelId || userInfo.value.vipId || 1)));
  return `/dmk/assets/vip${level}.png`;
});


const fallbackCopy = (value) => {
  const input = document.createElement("input");
  input.value = value;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(input);
  if (!copied) throw new Error("copy failed");
};

const copyReferralCode = async () => {
  const value = String(userInfo.value.inviteCode || "").trim();
  if (!value) return;
  try {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value);
      } catch (_) {
        fallbackCopy(value);
      }
    } else {
      fallbackCopy(value);
    }
    showToast(tCopy("das.profile.copySuccess"));
  } catch (_) {
    showToast(tCopy("das.profile.copyFailed"));
  }
};

const sections = [
  {
    title: "das.profileGroups.profile",
    items: [
      {
        label: "das.page.accountInfo",
        icon: "user",
        tone: "sage",
        path: "/profileItem",
      },
      {
        label: "das.profileGroups.bindWallet",
        icon: "wallet",
        tone: "coral",
        path: "/paymentMethods",
      },
    ],
  },
  {
    title: "das.profileGroups.financial",
    items: [
      {
        label: "das.page.deposit",
        icon: "deposit",
        tone: "sage",
        path: "/deposit",
      },
      {
        label: "das.page.withdraw",
        icon: "withdraw",
        tone: "coral",
        path: "/withdraw",
      },
    ],
  },
  {
    title: "das.profileGroups.other",
    items: [
      {
        label: "das.page.notifications",
        icon: "bell",
        tone: "cream",
        path: "/notice",
      },
      {
        label: "das.page.language",
        icon: "globe",
        tone: "coral",
        path: "/setting/language",
      },
      {
        label: "das.profile.logout",
        icon: "logout",
        tone: "grey",
        action: "logout",
      },
    ],
  },
];

const openMenuItem = async (item) => {
  if (item.action === "logout") {
    await store.logout();
    return;
  }
  if (item.path === "/paymentMethods") {
    withdrawalPasswordDialog.value?.open();
    return;
  }
  safePush(router, item.path);
};

const openWithdrawalAccounts = (token) => {
  setWithdrawalCredential(token);
  safePush(router, "/paymentMethods");
};

onMounted(async () => {
  try {
    userInfo.value = (await userGetInfo()).data || {};
    avatarFailed.value = false;
    store.setUserInfo(userInfo.value);
  } catch {}
});
</script>

<style scoped>
.dmk-credit-score-bar :deep(.dmk-credit-runner__track) {
  top: 24px;
}

.profile-page {
  background: #e9eee1;
}
.profile-backdrop {
  min-height: 100vh;
  padding-bottom: 22px;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  color: #17382d;
  background:
    url("@/static/das/bg-profile.png") top center/100% 100% no-repeat,
    linear-gradient(180deg, #102f24 0 34%, #dfe7d6 58%, #eef1e4 100%);
}
.profile-backdrop > :not(.profile-ambient) {
  position: relative;
  z-index: 2;
}
.profile-ambient {
  position: absolute;
  z-index: 0;
  display: block;
  width: 430px;
  height: 430px;
  border-radius: 50%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  pointer-events: none;
  mix-blend-mode: normal;
}
.ambient-sage-left {
  top: 150px;
  left: -235px;
  background-image: url("@/static/das/glow-sage.png");
  /*opacity: 0.5;*/
}
.ambient-coral-top {
  width: 360px;
  height: 360px;
  top: -175px;
  right: -142px;
  background-image: url("@/static/das/glow-coral-strong.png");
  /*opacity: 0.34;*/
}
.ambient-sage-right {
    width: 320px;
        height: 320px;
        top: 210px;
        right: -188px;
  background-image: url("@/static/das/glow-sage-soft.png");
  /*opacity: 0.48;*/
}
.ambient-coral-mid {
  width: 390px;
  height: 390px;
  top: 705px;
  left: -245px;
  background-image: url("@/static/das/glow-coral-soft.png");
  /*opacity: 0.34;*/
}

.profile-top {
  height: 112px;
  padding: 34px 27px 16px 31px;
  display: flex;
  align-items: flex-start;
  background: transparent;
  color: #f7f5ec;
}
.profile-brand {
  width: 43px;
  height: 48px;
  padding: 5px 6px;
  border: 0;
  border-radius: 7px;
  background: rgba(14, 48, 35, 0.55);
  box-shadow: 0 4px 18px rgba(6, 27, 20, 0.16);
}
.profile-brand img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.profile-top__actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 11px;
}
.profile-contact {
  min-width: 116px;
  height: 42px;
  padding: 0 23px;
  border: 1px solid rgba(247, 245, 236, 0.46);
  border-radius: 999px;
  background: rgba(247, 245, 236, 0.13);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 10px 24px rgba(14, 42, 31, 0.12);
  backdrop-filter: blur(10px);
}
.profile-initials {
  width: 42px;
  height: 42px;
  border: 1px solid #dc947f;
  border-radius: 50%;
  background: rgba(20, 57, 44, 0.28);
  color: #f7f5ec;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(8px);
}

.profile-head {
  padding: 1px 0 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-avatar {
  width: 112px;
  height: 112px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  filter: drop-shadow(0 10px 17px rgba(8, 37, 27, 0.18));
}
.edit-avatar {
  margin-top: 11px;
  padding: 11px 24px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  background: rgba(238, 242, 229, 0.84);
  color: #17382d;
  font-weight: 700;
  box-shadow: 0 12px 24px rgba(12, 48, 35, 0.12);
  backdrop-filter: blur(10px);
}
.edit-avatar__icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.profile-card {
  margin: 10px 26px 44px;
  padding: 0;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.92);
  border-radius: 27px;
  background:
    url("@/static/das/card-hello.png") center/cover no-repeat,
    linear-gradient(110deg, #f7f5e9, #eef1d9);
  box-shadow: 0 24px 48px rgba(20, 57, 44, 0.12);
}
.profile-card__glow {
  position: absolute;
  z-index: 0;
  width: 175px;
      height: 175px;
      top: -50px;
      right: -20px;
  border-radius: 50%;
  background: url("@/static/das/glow-gold.png") center/cover no-repeat;
  /*opacity: 0.3;*/
  mix-blend-mode: multiply;
  pointer-events: none;
}
.profile-card::after {
  content: "";
  position: absolute;
  z-index: 0;
  width: 260px;
  height: 260px;
  left: 50%;
  bottom: -190px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: url("@/static/das/glow-gold.png") center/cover no-repeat;
  opacity: 0.12;
  mix-blend-mode: multiply;
  pointer-events: none;
}
.profile-card__content {
  position: relative;
  z-index: 1;
  padding: 29px 24px 25px;
}
.eyebrow {
  color: #898b80;
  font-size: 12px;
  letter-spacing: 0.18em;
}
.profile-card__heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.profile-card h1 {
  max-width: 210px;
  margin: 6px 0 22px;
  font-size: 25px;
  line-height: 1.1;
  overflow-wrap: anywhere;
  font-weight: 600;
}
.profile-tier {
  margin-top: -2px;
  padding: 9px 15px;
  border-radius: 999px;
  background: #14392c;
  color: #e0bb57;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  white-space: nowrap;
  box-shadow: 0 7px 16px rgba(20, 57, 44, 0.12);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.profile-tier img {
  width: 13px;
  height: 13px;
  object-fit: contain;
}
.profile-stats {
  display: grid;
  grid-template-columns: 1fr 1.13fr 1.05fr;
}
.profile-stats > div {
  min-width: 0;
  padding-right: 10px;
}
.profile-stats > div + div {
  padding-left: 12px;
  border-left: 1px solid rgba(23, 56, 45, 0.18);
}
.profile-stats small {
  display: block;
  color: #8f9188;
  font-size: 10px;
  line-height: 1.25;
}
.profile-stats small > span {
  display: block;
  margin: 0;
}
.profile-stats strong {
  display: block;
  margin-top: 8px;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.referral-value {
  min-width: 0;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 7px;
}
.referral-value strong {
  min-width: 0;
  margin-top: 0;
}
.copy-code {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  padding: 3px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  opacity: 0.55;
}
.copy-code img {
  width: 14px;
  height: 14px;
  object-fit: contain;
}
.copy-code:active {
  transform: scale(0.92);
}
.credit {
  margin-top: 25px;
  padding-top: 18px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  position: relative;
  border-top: 1px solid rgba(23, 56, 45, 0.14);
  font-size: 12px;
  color: #757b73;
}
.credit-track {
  height: 9px;
  overflow: hidden;
  position: relative;
  border-radius: 999px;
  background: rgba(178, 196, 169, 0.55);
  box-shadow: inset 0 1px 2px rgba(25, 69, 51, 0.12);
}
.credit-fill {
  height: 100%;
  display: block;
  position: relative;
  overflow: hidden;
  transform-origin: left center;
  border-radius: inherit;
  background: linear-gradient(90deg, #83ab77 0%, #a9bb74 46%, #e9b83e 100%);
  box-shadow: 0 0 14px rgba(231, 185, 66, 0.24);
  animation: credit-reveal 0.9s cubic-bezier(0.2, 0.7, 0.25, 1) both;
}
.credit-fill::after {
  content: "";
  position: absolute;
  top: -4px;
  bottom: -4px;
  left: -55%;
  width: 42%;
  transform: skewX(-22deg);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.22),
    rgba(255, 247, 197, 0.8),
    rgba(255, 255, 255, 0.18),
    transparent
  );
  animation: credit-sweep 1.9s linear infinite;
}
@keyframes credit-reveal {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
@keyframes credit-sweep {
  0% {
    left: -55%;
  }
  62%,
  100% {
    left: 125%;
  }
}

.profile-section {
  margin: 0 23px 27px;
  position: relative;
}
.profile-section h2 {
  width: fit-content;
  margin: 0 0 8px 5px;
  padding: 6px 17px;
  border-radius: 999px;
  background: #14392c;
  color: #f5c1b6;
  font-size: 10px;
  letter-spacing: 0.2em;
  box-shadow: 0 6px 15px rgba(20, 57, 44, 0.08);
}
.profile-section button {
  width: 100%;
  height: 76px;
  margin-top: 9px;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 46px 1fr auto;
  align-items: center;
  gap: 13px;
  border: 2px solid rgba(255, 255, 255, 0.94);
  border-radius: 24px;
  color: #17382d;
  text-align: left;
  box-shadow: 0 12px 26px rgba(22, 61, 46, 0.07);
  backdrop-filter: blur(8px);
}
.profile-section button.sage {
  background:
    url("@/static/das/card-sage-1.png") center/cover no-repeat,
    rgba(236, 243, 228, 0.86);
}
.profile-section button.coral {
  background:
    url("@/static/das/card-coral-1.png") center/cover no-repeat,
    rgba(249, 231, 224, 0.86);
}
.profile-section button.cream {
  background:
    url("@/static/das/card-cream-1.png") center/cover no-repeat,
    rgba(244, 243, 224, 0.86);
}
.profile-section button.grey {
  background:
    url("@/static/das/card-grey-1.png") center/cover no-repeat,
    rgba(237, 238, 232, 0.88);
}
.menu-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(202, 218, 193, 0.65);
}
.menu-icon img{
  width: 22px;
  height: 22px;
}

.coral .menu-icon {
  background: rgba(243, 196, 183, 0.58);
}
.profile-section button b {
  font-size: 16px;
}
.arrow {
  width: 13px;
  height: 13px;
  object-fit: contain;
  opacity: 0.48;
}
.profile-copyright {
  text-align: center;
  color: #9aa397;
  font-size: 10px;
}

@media (max-width: 380px) {
  .profile-top {
    padding-inline: 23px;
  }
  .profile-card {
    margin-inline: 22px;
  }
  .profile-card__content {
    padding-inline: 20px;
  }
  .profile-contact {
    min-width: 104px;
    padding-inline: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .credit-fill,
  .credit-fill::after {
    animation: none;
  }
}
</style>
