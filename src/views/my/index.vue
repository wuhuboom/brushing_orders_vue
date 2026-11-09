<template>
  <main class="das-page profile-page">
    <HeaderTop />
    <div class="profile-main">
      <section class="profile-heading">
        <button
          class="profile-back"
          type="button"
          :aria-label="$t('das.common.back')"
          @click="safeBack(router, '/')"
        >
          <img class="poetic-back-arrow" src="/poetic/arrow-right.png" alt="" />
        </button>
        <h2>{{ $t("das.profile.myProfile") }}</h2>
      </section>
      <div class="poetic-profile-identity">
        <section class="profile-avatar-block">
          <AvatarUpload
            @updated="
              userInfo = $event;
              avatarFailed = false;
            "
          >
            <template #default="{ open, uploading }">
              <button
                class="my-profile-avatar profile-avatar"
                type="button"
                :disabled="uploading"
                @click="open"
              >
                <ProfileAvatar
                  :src="avatar"
                  alt=""
                  @error="avatarFailed = true"
                /></button
              ><button
                class="profile-edit-image"
                type="button"
                :disabled="uploading"
                @click="open"
              >
                <span>{{
                  $t(
                    uploading
                      ? "das.common.loading"
                      : "das.profile.changeAvatar",
                  )
                }}</span>
                <img src="/psybir/chevron-right.png" alt="" />
              </button>
            </template>
          </AvatarUpload>
        </section>
        <section class="profile-card">
          <div class="profile-card__hello">
            <span>{{ $t("das.profile.hello") }},</span
            ><strong>{{ displayName }}</strong>
            <div class="profile-referral-inline">
              <span>{{ $t("das.profile.referralCode") }}</span>
              <div class="profile-referral-inline__value">
                <b>{{ userInfo.inviteCode || "—" }}</b
                ><button
                  v-if="userInfo.inviteCode"
                  type="button"
                  :aria-label="$t('das.profile.copyReferral')"
                  @click="copyReferralCode"
                >
                  <img src="/psybir/copy.png" alt="" />
                  <span>{{ $t("das.profile.copyReferral") }}</span>
                </button>
              </div>
            </div>
          </div>
          <button
            class="poetic-profile-support"
            type="button"
            @click="safePush(router, '/contact')"
          >
            <PoeticGlyph name="support" /><span>{{
              $t("das.auth.support")
            }}</span>
          </button>
          <div class="profile-card__vip">
            <strong>VIP {{ currentLevelNumber }}</strong>
          </div>
        </section>
      </div>
      <section class="poetic-profile-balance">
        <div class="profile-stats">
          <div class="profile-stat">
            <span
              >{{ $t("das.profile.totalBalance") }}
              <PoeticGlyph name="eye" /></span
            ><strong>{{
              money(userInfo.totalBalance ?? userInfo.balance)
            }}</strong>
          </div>
          <div class="profile-stat">
            <span>{{ $t("das.profile.todayProfit") }} (USD)</span
            ><strong>{{ money(userInfo.commission) }}</strong>
          </div>
          <div class="profile-stat">
            <span>{{ $t("das.product.totalCommission") }} (USD)</span
            ><strong>{{
              money(userInfo.totalCommission ?? userInfo.totalProfit)
            }}</strong>
          </div>
        </div>
        <div class="poetic-profile-finance">
          <button
            v-for="item in sections[0].items"
            :key="item.path"
            type="button"
            @click="openMenuItem(item)"
          >
            <DasIcon :name="item.icon" /><span>{{ $t(item.label) }}</span>
          </button>
        </div>
      </section>
      <h2 class="poetic-section-title">{{ $t("das.profileGroups.other") }}</h2>
      <section class="psy-profile-shortcuts">
        <button
          v-for="item in [
            { label: 'das.page.vip', icon: 'vipcenter', path: '/vips' },
            { label: 'das.page.activities', icon: 'activity', path: '/event' },
            { label: 'das.home.terms', icon: 'terms', path: '/clause' },
            {
              label: 'das.home.certificate',
              icon: 'certificate',
              path: '/cert',
            },
            { label: 'das.home.faqs', icon: 'faq', path: '/faqs' },
            { label: 'das.page.about', icon: 'about', path: '/about' },
          ]"
          :key="item.path"
          type="button"
          :disabled="item.path === '/cert' && certificateRequestPending"
          :aria-busy="item.path === '/cert' && certificateRequestPending"
          @click="openMenuItem(item)"
        >
          <span
            v-if="item.path === '/cert' && certificateRequestPending"
            class="certificate-shortcut__loading"
            aria-hidden="true"
          >
            <VanLoading size="24px" color="currentColor" />
          </span>
          <DasIcon v-else :name="item.icon" />
          <span>{{
            $t(
              item.path === "/cert" && certificateRequestPending
                ? "das.common.loading"
                : item.label,
            )
          }}</span>
        </button>
      </section>
      <div class="profile-credit">
        <span>{{ $t("das.profile.credit") }}:</span
        ><i><b :style="{ width: creditPercent + '%' }"></b></i
        ><strong>({{ creditLabel }}/100)</strong>
        <div class="poetic-credit-detail">
          <PoeticGlyph name="shield" />
          <div>
            <b>VIP {{ currentLevelNumber }}</b
            ><span
              v-if="currentLevel.description"
              v-html="currentLevel.description"
            ></span
            ><span v-else
              >{{ $t("das.profile.credit") }}: {{ creditLabel }}%</span
            >
          </div>
        </div>
      </div>
      <section
        v-for="section in [sections[1], sections[2]]"
        :key="section.title"
        class="profile-section"
      >
        <h2>{{ $t(section.title) }}</h2>
        <div class="profile-menu">
          <button
            v-for="item in section.items"
            :key="item.label"
            class="profile-menu__row"
            type="button"
            @click="openMenuItem(item)"
          >
            <span class="profile-menu__icon"><DasIcon :name="item.icon" /></span
            ><b>{{ $t(item.label) }}</b
            ><img
              class="profile-menu__arrow"
              src="/psybir/chevron-right.png"
              alt=""
            />
          </button>
        </div>
      </section>
      <footer class="profile-footer">{{ $t("das.common.copyright") }}</footer>
    </div>
    <WithdrawalPasswordDialog
      ref="withdrawalPasswordDialog"
      @verified="openWithdrawalAccounts"
    />
    <van-dialog
      v-model:show="certificateDialogVisible"
      class="certificate-access-dialog"
      overlay-class="certificate-access-overlay"
      teleport="body"
      aria-labelledby="certificate-access-title"
      aria-describedby="certificate-access-message"
      :show-confirm-button="false"
      close-on-click-overlay
      @keydown.esc="certificateDialogVisible = false"
    >
      <div
        class="certificate-access"
        @keydown.esc="certificateDialogVisible = false"
      >
        <button
          class="certificate-access__close"
          type="button"
          :aria-label="$t('das.common.close')"
          @click="certificateDialogVisible = false"
        >
          <van-icon name="cross" />
        </button>
        <div class="certificate-access__icon" aria-hidden="true">
          <DasIcon name="certificate" />
        </div>
        <h2 id="certificate-access-title">{{ $t("das.page.certificate") }}</h2>
        <p id="certificate-access-message">{{ certificateMessage }}</p>
        <button
          class="certificate-access__confirm"
          type="button"
          @click="certificateDialogVisible = false"
        >
          {{ $t("das.common.confirm") }}
          <van-icon name="arrow" aria-hidden="true" />
        </button>
      </div>
    </van-dialog>
  </main>
</template>

<script setup>
import PoeticGlyph from "@/components/PoeticGlyph.vue";
import { computed, onMounted, ref } from "vue";
import { Loading as VanLoading, showToast } from "vant";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/store/modules/user";
import { getCertificateConfig, getLevel, userGetInfo } from "@/api/apis";
import DasIcon from "@/components/DasIcon.vue";
import HeaderTop from "@/components/HeaderTop.vue";
import ProfileAvatar from "@/components/ProfileAvatar.vue";
import AvatarUpload from "@/components/AvatarUpload.vue";
import WithdrawalPasswordDialog from "@/components/WithdrawalPasswordDialog.vue";
import { setWithdrawalCredential } from "@/utils/withdrawalCredential";
import { safeBack, safePush } from "@/utils/navigation";
import { defaultAvatarForUser, resolveProfileImageUrl } from "@/utils/avatar";
import { memberLevelMatchesUser } from "@/utils/memberLevel";
import avatarFallback from "@/static/psybir/avatar-male.png";
import femaleAvatarFallback from "@/static/psybir/avatar-female.png";

const router = useRouter();
const { t: tCopy } = useI18n();
const store = useUserStore();
const userInfo = ref(store.userInfo || {});
const base = window.g?.VITE_API_IMG_URL || "";
const avatarFailed = ref(false);
const withdrawalPasswordDialog = ref(null);
const certificateRequestPending = ref(false);
const certificateDialogVisible = ref(false);
const certificateMessage = ref("");
const levels = ref([]);

const defaultAvatar = computed(() =>
  defaultAvatarForUser(userInfo.value, {
    male: avatarFallback,
    female: femaleAvatarFallback,
  }),
);
const avatar = computed(() => {
  if (avatarFailed.value) return defaultAvatar.value;
  return (
    resolveProfileImageUrl(userInfo.value.avatar, base) || defaultAvatar.value
  );
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

const openMenuItem = async (item) => {
  if (item.path === "/cert") {
    if (certificateRequestPending.value) return;
    certificateRequestPending.value = true;
    const currentPath = router.currentRoute.value.fullPath;
    let config = {};
    try {
      config = (await getCertificateConfig()).data || {};
    } catch (_) {
      if (router.currentRoute.value.fullPath === currentPath) {
        showToast(tCopy("das.common.requestFailed"));
      }
      return;
    } finally {
      certificateRequestPending.value = false;
    }
    if (router.currentRoute.value.fullPath !== currentPath) return;
    if (
      [1, "1"].includes(config.certificateSwitch) &&
      typeof config.certificateTip === "string" &&
      config.certificateTip.trim()
    ) {
      certificateMessage.value = config.certificateTip;
      certificateDialogVisible.value = true;
      return;
    }
    if (![0, "0"].includes(config.certificateSwitch)) {
      showToast(tCopy("das.common.requestFailed"));
      return;
    }
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
.certificate-shortcut__loading {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  color: var(--poetic-purple);
}
:global(.van-overlay.certificate-access-overlay) {
  background: #0009;
}
:global(.van-dialog.certificate-access-dialog) {
  top: 50%;
  width: min(360px, calc(100vw - 38px));
  border: 1px solid var(--bp-line);
  border-radius: 10px !important;
  background: #fff;
  color: var(--poetic-ink);
  box-shadow: 0 16px 48px #2020201a;
}
.certificate-access {
  position: relative;
  max-height: calc(100dvh - 48px);
  padding: 28px 24px 24px;
  overflow-y: auto;
  text-align: center;
}
.certificate-access__close {
  position: absolute;
  top: 10px;
  right: 10px;
  display: grid;
  width: 30px;
  height: 30px;
  padding: 0;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: var(--poetic-paper);
  color: var(--poetic-muted);
  cursor: pointer;
}
.certificate-access__icon img {
  display: block;
  width: 50px;
  height: 50px;
  margin: 0 auto 18px;
  object-fit: contain;
}
.certificate-access h2 {
  margin: 0 0 14px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}
.certificate-access p {
  max-height: min(38vh, 240px);
  margin: 0 0 24px;
  overflow-y: auto;
  color: var(--poetic-muted);
  font-size: 14px;
  line-height: 1.8;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
.certificate-access__confirm {
  display: flex;
  width: 100%;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 12px;
  border: 0;
  border-radius: 5px;
  background: var(--poetic-gradient);
  color: #fff;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
.certificate-access__confirm:active {
  filter: brightness(0.95);
}
.certificate-access button:focus-visible {
  outline: 2px solid var(--poetic-purple);
  outline-offset: 3px;
}
</style>
