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
          <img
            class="poetic-back-arrow"
            src="/design500/back-white.png"
            alt=""
          />
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
                :class="{ 'profile-avatar--design': avatar === avatarFallback }"
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
                <img src="/design500/pencil.png" alt="" />
              </button>
            </template>
          </AvatarUpload>
        </section>
        <section class="profile-card">
          <div class="profile-card__hello">
            <span>{{ $t("das.profile.hello") }},</span
            ><strong
              >{{ displayName
              }}<img
                class="profile-name-check"
                src="/design500/current-check.png"
                alt=""
            /></strong>
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
            <img src="/design500/vip-star.png" alt="" /><strong
              >VIP {{ currentLevelNumber }}</strong
            >
          </div>
        </section>
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
              <img src="/design500/copy.png" alt="" />
              <span>{{ $t("das.profile.copyReferral") }}</span>
            </button>
          </div>
        </div>
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
          @click="openMenuItem(item)"
        >
          <DasIcon :name="item.icon" /><span>{{ $t(item.label) }}</span>
        </button>
      </section>
      <div class="profile-credit">
        <span>{{ $t("das.profile.credit") }}:</span
        ><i><b :style="{ width: creditPercent + '%' }"></b></i
        ><strong>{{ creditLabel }}<small>/100</small></strong>
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
        <div class="profile-credit__scale" aria-hidden="true">
          <span>0</span><span>50</span><span>85</span><span>100</span>
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
              src="/design500/chevron.png"
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
import PoeticGlyph from "@/components/PoeticGlyph.vue";
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
import { defaultAvatarForUser, resolveProfileImageUrl } from "@/utils/avatar";
import { memberLevelMatchesUser } from "@/utils/memberLevel";
import avatarFallback from "/design500/avatar-male-square.png";
import femaleAvatarFallback from "@/static/psybir/avatar-female.png";

const router = useRouter();
const { t: tCopy } = useI18n();
const store = useUserStore();
const userInfo = ref(store.userInfo || {});
const base = window.g?.VITE_API_IMG_URL || "";
const avatarFailed = ref(false);
const withdrawalPasswordDialog = ref(null);
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
