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
          @click="openMenuItem(item)"
        >
          <DasIcon :name="item.icon" /><span>{{ $t(item.label) }}</span>
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
