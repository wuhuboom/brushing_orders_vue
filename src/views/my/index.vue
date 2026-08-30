<template>
  <main class="das-page profile-page">
    <div class="my-shell">
      <HeaderTop />

      <section class="my-titlebar">
        <button
          class="my-back"
          type="button"
          :aria-label="$t('das.common.back')"
          @click="safeBack(router, '/')"
        >
          <img src="@/static/brain/back.png" alt="" />
        </button>
        <h1>{{ $t("das.profile.myProfile") }}</h1>
      </section>

      <section class="my-identity-card">
        <button
          class="my-profile-avatar"
          type="button"
          @click="safePush(router, '/profile')"
        >
          <ProfileAvatar :src="avatar" alt="" @error="avatarFailed = true" />
        </button>
        <div class="my-identity-card__copy">
          <strong>{{ displayName }}</strong>
          <span class="my-tier">
            <img :src="currentLevelIcon" alt="" />
            VIP {{ currentLevelNumber }}
          </span>
        </div>
      </section>

      <section class="my-summary-card">
        <div class="my-referral-panel">
          <div class="my-referral-panel__copy">
            <small>{{ $t("das.profile.referralCode") }}</small>
            <strong>{{ userInfo.inviteCode || "—" }}</strong>
          </div>
          <button
            v-if="userInfo.inviteCode"
            class="my-copy-button"
            type="button"
            :aria-label="$t('das.profile.copyReferral')"
            @click="copyReferralCode"
          >
            <img src="@/static/brain/copy.png" alt="" />
            <span>{{ $t("das.profile.copyReferral") }}</span>
          </button>
        </div>

        <div class="my-money-grid">
          <div class="my-money-card">
            <small>{{ $t("das.profile.todayProfit") }} (USD)</small>
            <strong>{{ money(userInfo.commission) }}</strong>
          </div>
          <div class="my-money-card">
            <small>{{ $t("das.profile.totalBalance") }} (USD)</small>
            <strong>{{
              money(userInfo.totalBalance ?? userInfo.balance)
            }}</strong>
          </div>
        </div>

        <div class="my-credit-panel">
          <img
            class="my-credit-panel__icon"
            src="@/static/brain/retention.png"
            alt=""
          />
          <div class="my-credit-panel__body">
            <div class="my-credit-panel__heading">
              <span>{{ $t("das.profile.credit") }}</span>
              <strong>{{ creditLabel }}%</strong>
            </div>
            <i class="my-credit-track">
              <b
                class="my-credit-fill"
                :style="{ width: `${creditPercent}%` }"
              ></b>
            </i>
          </div>
        </div>
      </section>

      <section
        v-for="section in sections"
        :key="section.title"
        class="my-menu-section"
      >
        <h2>{{ $t(section.title) }}</h2>
        <div class="my-menu-list">
          <button
            v-for="item in section.items"
            :key="item.label"
            type="button"
            @click="openMenuItem(item)"
          >
            <span class="my-menu-icon"><DasIcon :name="item.icon" /></span>
            <b>{{ $t(item.label) }}</b>
            <img
              class="my-menu-arrow"
              src="@/static/brain/chevron-right.png"
              alt=""
            />
          </button>
        </div>
      </section>
    </div>
    <WithdrawalPasswordDialog
      ref="withdrawalPasswordDialog"
      @verified="openWithdrawalAccounts"
    />
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { showToast } from "vant";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/store/modules/user";
import { getLevel, userGetInfo } from "@/api/apis";
import DasIcon from "@/components/DasIcon.vue";
import HeaderTop from "@/components/HeaderTop.vue";
import ProfileAvatar from "@/components/ProfileAvatar.vue";
import WithdrawalPasswordDialog from "@/components/WithdrawalPasswordDialog.vue";
import { setWithdrawalCredential } from "@/utils/withdrawalCredential";
import { safeBack, safePush } from "@/utils/navigation";
import { defaultAvatarForUser } from "@/utils/avatar";
import { memberLevelMatchesUser } from "@/utils/memberLevel";
import avatarFallback from "@/static/brain/avatar-male.png";
import femaleAvatarFallback from "@/static/brain/avatar-female.png";
import vip1 from "@/static/brain/vip-1.png";
import vip2 from "@/static/brain/vip-2.png";
import vip3 from "@/static/brain/vip-3.png";
import vip4 from "@/static/brain/vip-4.png";
import vip5 from "@/static/brain/vip-5.png";

const router = useRouter();
const { t: tCopy } = useI18n();
const store = useUserStore();
const userInfo = ref(store.userInfo || {});
const base = window.g?.VITE_API_IMG_URL || "";
const avatarFailed = ref(false);
const withdrawalPasswordDialog = ref(null);
const levels = ref([]);
const localLevelIcons = [vip1, vip2, vip3, vip4, vip5];

const avatarPath = computed(() => String(userInfo.value.avatar ?? "").trim());
const defaultAvatar = computed(() =>
  defaultAvatarForUser(userInfo.value, {
    male: avatarFallback,
    female: femaleAvatarFallback,
  }),
);
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
const currentLevel = computed(
  () =>
    levels.value.find((level) =>
      memberLevelMatchesUser(level, userInfo.value),
    ) ||
    userInfo.value.userLevel ||
    userInfo.value.memberLevel ||
    {},
);
const currentLevelNumber = computed(() => {
  const value = Number(
    currentLevel.value.level ??
      userInfo.value.userLevel?.level ??
      userInfo.value.levelId ??
      1,
  );
  return Number.isFinite(value) && value > 0 ? value : 1;
});
const currentLevelIcon = computed(() => {
  const path = String(currentLevel.value.icon || "").trim();
  if (path) {
    return /^(?:https?:|data:|blob:)/i.test(path)
      ? path
      : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  }
  const index = Math.max(0, Math.min(currentLevelNumber.value - 1, 4));
  return localLevelIcons[index];
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
const creditLabel = computed(() => {
  const value = creditPercent.value;
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
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
    title: "das.profileGroups.financial",
    items: [
      {
        label: "das.page.deposit",
        icon: "profile-deposit",
        tone: "sage",
        path: "/deposit",
      },
      {
        label: "das.page.withdraw",
        icon: "profile-withdraw",
        tone: "coral",
        path: "/withdraw",
      },
    ],
  },
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
        path: "/account/logout",
      },
    ],
  },
];

const openMenuItem = (item) => {
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
  const [userResult, levelResult] = await Promise.allSettled([
    userGetInfo(),
    getLevel(),
  ]);
  if (userResult.status === "fulfilled") {
    userInfo.value = userResult.value.data || {};
    avatarFailed.value = false;
    store.setUserInfo(userInfo.value);
  }
  if (levelResult.status === "fulfilled") {
    levels.value = levelResult.value.data || [];
  }
});
</script>

<style scoped>
.profile-page {
  background: #000105 !important;
  background-image: none !important;
}

.my-shell {
  --my-gutter: clamp(13px, 3vw, 28px);
  min-height: 100vh;
  padding-bottom: clamp(76px, 20.3vw, 80px);
  overflow: hidden;
  color: #f7f8fc;
  background: #000105;
}

.my-titlebar {
  height: clamp(56px, 14.72vw, 58px);
  position: relative;
  display: grid;
  place-items: center;
  border-bottom: 1px solid #121827;
  background: #000105;
}

.my-titlebar h1 {
  margin: 0;
  color: #f8f8fb;
  font-size: 18px;
  font-weight: 700;
  line-height: 22px;
}

.my-back {
  width: clamp(38px, 10.15vw, 40px);
  height: clamp(38px, 10.15vw, 40px);
  padding: 0;
  position: absolute;
  z-index: 2;
  top: 50%;
  left: var(--my-gutter);
  transform: translateY(-50%);
  border: 0;
  border-radius: 50%;
  background: transparent;
}

.my-back img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.my-identity-card {
  height: clamp(99px, 26.4vw, 104px);
  margin: clamp(14px, 3.8vw, 15px) calc(var(--my-gutter) + 1px) 0;
  padding: clamp(10px, 2.79vw, 11px) 14px;
  display: flex;
  align-items: center;
  gap: 13px;
  border-radius: 10px;
  background: #031022 url("@/static/brain/profile-banner.png") center / 100%
    100% no-repeat;
}

.my-profile-avatar {
  width: clamp(74px, 19.8vw, 78px);
  height: clamp(74px, 19.8vw, 78px);
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  filter: drop-shadow(0 0 12px rgba(0, 119, 255, 0.4));
}

.my-identity-card__copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.my-identity-card__copy > strong {
  max-width: min(42vw, 260px);
  overflow: hidden;
  color: #f8f8fb;
  font-size: 17px;
  font-weight: 500;
  line-height: 21px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-tier {
  height: clamp(21px, 5.58vw, 22px);
  margin-top: clamp(7px, 2.03vw, 8px);
  padding: 0 9px 0 6px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid #155aa9;
  border-radius: 999px;
  background: #091a39;
  color: #43a4ff;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
}

.my-tier img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.my-summary-card {
  height: clamp(229px, 60.9vw, 240px);
  margin: clamp(11px, 3.05vw, 12px) var(--my-gutter) 0;
  padding: clamp(9px, 2.54vw, 10px) 10px;
  overflow: hidden;
  border-radius: 10px;
  background: #071126;
}

.my-referral-panel {
  height: clamp(59px, 15.74vw, 62px);
  padding: 9px 10px 8px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 9px;
  background: #070c18;
}

.my-referral-panel__copy {
  min-width: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
}

.my-referral-panel small,
.my-money-card small {
  display: block;
  color: #9299aa;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
}

.my-referral-panel__copy strong {
  max-width: 100%;
  margin-top: 4px;
  overflow: hidden;
  color: #078dff;
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-copy-button {
  width: auto;
  min-width: max-content;
  height: clamp(32px, 8.63vw, 34px);
  flex: 0 0 auto;
  padding: 0 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid #0b65ed;
  border-radius: 6px;
  background: linear-gradient(110deg, #0747b9, #075fdc);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  box-shadow: none;
}

.my-copy-button img {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  object-fit: contain;
}

.my-money-grid {
  height: clamp(66px, 17.51vw, 69px);
  margin-top: clamp(10px, 2.79vw, 11px);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.my-money-card {
  min-width: 0;
  padding: 11px 14px 9px;
  border-radius: 9px;
  background: #070c18;
}

.my-money-card small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-money-card strong {
  display: block;
  margin-top: 7px;
  overflow: hidden;
  color: #f8f8fb;
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-credit-panel {
  height: clamp(66px, 17.51vw, 69px);
  margin-top: clamp(8px, 2.28vw, 9px);
  padding: 8px 10px 8px 6px;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  align-items: center;
  gap: 4px;
  border-radius: 9px;
  background: #070c18;
}

.my-credit-panel__icon {
  width: 42px;
  height: 42px;
  display: block;
  object-fit: contain;
}

.my-credit-panel__body {
  min-width: 0;
}

.my-credit-panel__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: #9299aa;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
}

.my-credit-panel__heading span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-credit-panel__heading strong {
  flex: 0 0 auto;
  color: #dce1ec;
  font-size: 12px;
  font-weight: 400;
}

.my-credit-track {
  height: 9px;
  margin-top: 7px;
  display: block;
  position: relative;
  border-radius: 999px;
  background: #202733;
}

.my-credit-fill {
  height: 100%;
  display: block;
  position: relative;
  overflow: hidden;
  transform-origin: left center;
  border-radius: inherit;
  background: linear-gradient(90deg, #075dff 0%, #03d8e8 100%);
  animation: my-credit-reveal 0.9s cubic-bezier(0.2, 0.7, 0.25, 1) both;
}

.my-credit-fill::before {
  content: "";
  width: 6px;
  height: 6px;
  position: absolute;
  top: 50%;
  right: 2px;
  transform: translateY(-50%);
  border-radius: 50%;
  background: #dffcff;
  box-shadow: 0 0 5px #79f2ff;
}

.my-credit-fill::after {
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
    rgba(255, 255, 255, 0.18),
    rgba(218, 251, 255, 0.85),
    rgba(255, 255, 255, 0.16),
    transparent
  );
  animation: my-credit-sweep 1.9s linear infinite;
}

@keyframes my-credit-reveal {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes my-credit-sweep {
  0% {
    left: -55%;
  }
  62%,
  100% {
    left: 125%;
  }
}

.my-menu-section {
  margin: clamp(13px, 3.55vw, 14px) var(--my-gutter) 0;
}

.my-menu-section + .my-menu-section {
  margin-top: clamp(16px, 4.32vw, 17px);
}

.my-menu-section:last-of-type {
  margin-top: clamp(22px, 5.84vw, 23px);
}

.my-menu-section h2 {
  margin: 0 4px clamp(15px, 4.06vw, 16px);
  color: #e8ebf2;
  font-size: clamp(14px, 3.8vw, 15px);
  font-weight: 400;
  line-height: clamp(17px, 4.57vw, 18px);
}

.my-menu-list {
  overflow: hidden;
  border-radius: 9px;
  background: #09101b;
}

.my-menu-list button {
  width: 100%;
  height: clamp(61px, 16.24vw, 64px);
  margin: 0;
  padding: 0 13px;
  display: grid;
  grid-template-columns: clamp(32px, 8.63vw, 34px) minmax(0, 1fr) 18px;
  align-items: center;
  gap: 12px;
  border: 0;
  border-bottom: 1px solid #19212e;
  border-radius: 0;
  background: #09101b;
  color: #e9ebf1;
  text-align: left;
  box-shadow: none;
}

.my-menu-list button:last-child {
  border-bottom: 0;
}

.my-menu-icon,
.my-menu-icon :deep(.das-icon) {
  width: clamp(32px, 8.63vw, 34px);
  height: clamp(32px, 8.63vw, 34px);
  display: block;
}

.my-menu-list button b {
  min-width: 0;
  overflow: hidden;
  color: #e9ebf1;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-menu-arrow {
  width: 18px;
  height: 18px;
  display: block;
  object-fit: contain;
  opacity: 0.72;
}

@media (max-width: 360px) {
  .my-summary-card {
    padding-inline: 8px;
  }

  .my-money-card {
    padding-inline: 10px;
  }
}

@media (min-width: 760px) {
  .my-shell {
    background: #000105;
  }

  .my-identity-card {
    background-color: #031022;
    background-position: right center;
    background-size: auto 100%;
  }

  .my-identity-card,
  .my-summary-card,
  .my-menu-section {
    margin-right: var(--my-gutter);
    margin-left: var(--my-gutter);
  }
}

@media (prefers-reduced-motion: reduce) {
  .my-credit-fill,
  .my-credit-fill::after {
    animation: none;
  }
}
</style>
