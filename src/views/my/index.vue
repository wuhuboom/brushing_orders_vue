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
          <img src="/psybir/back.png" alt="" />
        </button>
        <h2>{{ $t("das.profile.myProfile") }}</h2>
      </section>
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
                  uploading ? "das.common.loading" : "das.profile.changeAvatar",
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
              </button>
            </div>
          </div>
        </div>
        <div class="profile-card__vip">
          <strong>VIP{{ currentLevelNumber }}</strong
          ><img :src="currentLevelIcon" alt="" />
        </div>
        <div class="profile-stats">
          <div class="profile-stat">
            <span>{{ $t("das.profile.totalBalance") }}</span
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
      </section>
      <section class="psy-profile-shortcuts">
        <button
          v-for="item in [
            { label: 'das.page.vip', icon: 'vipcenter', path: '/vips' },
            { label: 'das.page.activities', icon: 'activity', path: '/event' },
            sections[0].items[1],
            sections[0].items[0],
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
          :class="{
            'certificate-shortcut--loading':
              item.path === '/cert' && certificateRequestPending,
          }"
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
        ><strong>{{ creditLabel }}%</strong>
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
import { defaultAvatarForUser } from "@/utils/avatar";
import { memberLevelMatchesUser } from "@/utils/memberLevel";
import avatarFallback from "@/static/psybir/avatar-male.png";
import femaleAvatarFallback from "@/static/psybir/avatar-female.png";
import vip1 from "@/static/psybir/vip-1.png";
import vip2 from "@/static/psybir/vip-2.png";
import vip3 from "@/static/psybir/vip-3.png";
import vip4 from "@/static/psybir/vip-4.png";
import vip5 from "@/static/psybir/vip-5.png";

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

const openMenuItem = async (item) => {
  if (item.path === "/cert") {
    if (certificateRequestPending.value) return;
    certificateRequestPending.value = true;
    const currentPath = router.currentRoute.value.fullPath;
    let config = {};
    try {
      config = (await getCertificateConfig()).data || {};
    } catch (_) {
      // Keep certificate access unchanged if the configuration is unavailable.
    } finally {
      certificateRequestPending.value = false;
    }
    if (router.currentRoute.value.fullPath !== currentPath) return;
    if (Number(config.certificateSwitch) === 1) {
      certificateMessage.value = config.certificateTip || "";
      certificateDialogVisible.value = true;
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
  width: 49px;
  height: 49px;
  place-items: center;
  border-radius: 15px;
  background: rgb(130 133 250 / 12%);
  color: #b3b0ff;
}
.psy-profile-shortcuts button.certificate-shortcut--loading {
  color: #b3b0ff !important;
}
:global(.van-overlay.certificate-access-overlay) {
  background: rgb(3 4 12 / 76%) !important;
  backdrop-filter: blur(6px);
}
:global(.van-dialog.certificate-access-dialog) {
  top: 50%;
  width: min(380px, calc(100vw - 40px));
  border: 1px solid rgb(164 157 255 / 20%);
  border-radius: 24px !important;
  background: radial-gradient(ellipse at 50% 0, #292544, #191b27 65%);
  box-shadow:
    0 28px 90px #0009,
    0 0 48px rgb(110 94 224 / 10%);
}
:global(.certificate-access-dialog .van-dialog__footer) {
  display: none;
}
.certificate-access {
  position: relative;
  box-sizing: border-box;
  max-height: calc(100dvh - 48px);
  padding: 32px 26px 26px;
  overflow-y: auto;
  text-align: center;
}
.certificate-access__close {
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid rgb(181 174 255 / 10%);
  border-radius: 50%;
  background: rgb(255 255 255 / 4%);
  color: #a9adc3;
  cursor: pointer;
}
.certificate-access__icon {
  display: grid;
  width: 68px;
  height: 68px;
  margin: 0 auto 20px;
  place-items: center;
  border: 1px solid rgb(169 156 255 / 28%);
  border-radius: 22px;
  background: linear-gradient(145deg, #7167ca55, #5144a92b);
  box-shadow:
    0 8px 30px #7863e51f,
    inset 0 1px 0 #ffffff14;
}
.certificate-access__icon img {
  width: 42px !important;
  height: 42px !important;
}
.certificate-access h2 {
  margin: 0 0 12px;
  color: #f4f1ff;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
}
.certificate-access p {
  max-height: min(32vh, 224px);
  margin: 0 0 26px;
  overflow-y: auto;
  color: #c2c4da;
  font-size: 15px;
  line-height: 1.8;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
.certificate-access__confirm {
  display: flex;
  width: 100%;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 18px;
  border: 1px solid #ffffff14;
  border-radius: 14px;
  background: var(--psy-gradient);
  box-shadow: 0 6px 20px #6b5ce833;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}
.certificate-access__confirm:hover {
  filter: brightness(1.08);
}
.certificate-access__confirm:active {
  filter: brightness(0.95);
}
.certificate-access button:focus-visible {
  outline: 2px solid #c4bdff;
  outline-offset: 3px;
}
</style>
