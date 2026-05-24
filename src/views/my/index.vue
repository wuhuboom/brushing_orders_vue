<template>
    <div class="my-page">
        <MainTabTopBar :title="$t('my')" />

        <AppLoadingScreen :visible="isAvatarUploading" />

        <van-uploader
            ref="uploaderRef"
            v-model="fileList"
            :after-read="afterRead"
            reupload
            max-count="1"
            class="hidden-uploader"
        />

        <main class="my-page__main">
            <section class="my-hero">
                <div class="my-hero__badge">
                    <img :src="currentVipBadgeIcon" alt="" />
                    <span>{{ displayVipLevel }}</span>
                </div>

                <div class="my-hero__avatar-wrap">
                    <div class="my-hero__avatar-shell">
                        <div
                            v-if="userInfo.avatar === undefined"
                            class="my-hero__avatar-loading"
                        ></div>
                        <img
                            v-else
                            :src="displayAvatar"
                            class="my-hero__avatarImg"
                            :alt="userInfo.avatar ? $t('user_avatar') : $t('default_avatar')"
                            @error="(e) => (e.target.src = defaultAvatar)"
                        />
                    </div>
                    <button class="my-hero__edit" type="button" @click="triggerUploader">
                        <img :src="myIcons.edit" alt="" />
                    </button>
                </div>

                <div class="my-hero__name">
                    {{ userInfo.username || "--" }}
                </div>

                <div class="my-hero__row my-hero__row--referral">
                    <span class="my-hero__label"
                        >{{ $t("my_referral_code") }}:</span
                    >
                    <button
                        class="my-hero__code"
                        type="button"
                        @click="
                            copyContent(userInfo.inviteCode, { duration: 4 })
                        "
                    >
                        {{ userInfo.inviteCode || "--" }}
                    </button>
                    <button
                        class="my-hero__copy-btn"
                        type="button"
                        @click="
                            copyContent(userInfo.inviteCode, { duration: 4 })
                        "
                    >
                        <img :src="myIcons.copy" alt="" />
                    </button>
                </div>

                <div class="my-hero__row my-hero__row--score">
                    <span class="my-hero__label"
                        >{{ $t("credit_score") }}:</span
                    >
                    <span class="my-hero__score-value">{{
                        creditScoreDisplay
                    }}</span>
                </div>

                <div class="my-hero__progress">
                    <div class="my-hero__progress-track">
                        <div
                            class="my-hero__progress-fill"
                            :style="{ width: `${safeAnimatedCreditScore}%` }"
                        ></div>
                    </div>
                </div>

                <div class="my-hero__stats">
                    <div class="my-stat">
                        <div class="my-stat__label">
                            {{ $t("wallet_amount") }}
                        </div>
                        <div class="my-stat__value">
                            <span>{{ walletBalance }}</span>
                            <em>USD</em>
                        </div>
                    </div>
                    <div class="my-stat my-stat--divider">
                        <div class="my-stat__label">
                            {{ $t("todays_commission") }}
                        </div>
                        <div class="my-stat__value">
                            <span>{{ rebateAmount }}</span>
                            <em>USD</em>
                        </div>
                    </div>
                </div>
            </section>

            <section class="my-menu-card">
                <div
                    v-for="item in menuItems"
                    :key="item.title"
                    class="my-menu-row"
                    @click="item.action"
                >
                    <div class="my-menu-row__icon">
                        <img :src="item.icon" alt="" />
                    </div>
                    <div class="my-menu-row__content">
                        <div class="my-menu-row__title">{{ item.title }}</div>
                        <div class="my-menu-row__desc">{{ item.desc }}</div>
                    </div>
                </div>
            </section>

            <button class="my-logout" type="button" @click="logout">
                <img :src="myIcons.logout" alt="" />
                <span>{{ $t("log_out") }}</span>
            </button>
        </main>

        <ContactUs ref="ContactUsRef"></ContactUs>
        <tradePassword ref="tradePasswordRef"></tradePassword>
        <Lang ref="langRef"></Lang>

        <van-popup
            v-if="!isPc"
            v-model:show="showLogoutPopup"
            position="bottom"
            class="logout-sheet logout-sheet--mobile"
            overlay-class="logout-sheet-overlay logout-sheet-overlay--mobile"
            transition="logout-sheet-slide"
            round
        >
            <div class="logout-sheet__icon">
                <img :src="myIcons.logout" alt="" />
            </div>
            <div class="logout-sheet__title">{{ $t("log_out") }}</div>
            <div class="logout-sheet__desc">
                {{ $t("logout_confirm_desc_1") }}<br />
                {{ $t("logout_confirm_desc_2") }}
            </div>
            <button
                class="logout-sheet__confirm"
                type="button"
                @click="confirmLogout"
            >
                <img :src="myIcons.logout" alt="" />
                {{ $t("confirm_log_out") }}
            </button>
            <button
                class="logout-sheet__cancel"
                type="button"
                @click="showLogoutPopup = false"
            >
                {{ $t("cancel") }}
            </button>
        </van-popup>

        <transition name="logout-desktop-fade">
            <div
                v-if="isPc && showLogoutPopup"
                class="logout-desktop-layer"
                @click.self="showLogoutPopup = false"
            >
                <div class="logout-desktop-card">
                    <div class="logout-sheet__icon">
                        <img :src="myIcons.logout" alt="" />
                    </div>
                    <div class="logout-sheet__title">{{ $t("log_out") }}</div>
                    <div class="logout-sheet__desc">
                        {{ $t("logout_confirm_desc_1") }}<br />
                        {{ $t("logout_confirm_desc_2") }}
                    </div>
                    <button
                        class="logout-sheet__confirm"
                        type="button"
                        @click="confirmLogout"
                    >
                        <img :src="myIcons.logout" alt="" />
                        {{ $t("confirm_log_out") }}
                    </button>
                    <button
                        class="logout-sheet__cancel"
                        type="button"
                        @click="showLogoutPopup = false"
                    >
                        {{ $t("cancel") }}
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import {
    computed,
    onActivated,
    onDeactivated,
    onMounted,
    onUnmounted,
    ref,
    watch,
} from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showToast, showSuccessToast } from "@/util/message";

import MainTabTopBar from "@/components/MainTabTopBar.vue";
import ContactUs from "@/components/ContactUs.vue";
import Lang from "@/components/Lang.vue";
import tradePassword from "@/components/tradePassword.vue";
import AppLoadingScreen from "@/components/AppLoadingScreen.vue";
import { checkWorkTimeLocal, copyContent } from "@/util/utils";
import { getTradeConfig, updateAvatar, upload } from "@/api/apis";
import { useUserStore } from "@/store/modules/user";

const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();

const defaultAvatar = new URL(
    "@/static/images/my-design/my-default-avatar.png",
    import.meta.url,
).href;

const langRef = ref(null);
const ContactUsRef = ref(null);
const tradePasswordRef = ref(null);
const uploaderRef = ref(null);
const fileList = ref([]);
const userInfo = ref({});
const userLevel = ref("");
const TradeInfor = ref({});
const showLogoutPopup = ref(false);
const isPc = ref(false);
const animatedCreditScore = ref(0);
let creditScoreAnimationFrame = 0;
const VITE_API_IMG_URL = window.g?.VITE_API_IMG_URL || "";
const isAvatarUploading = ref(false);
const avatarVersion = ref(0);

const myIcons = {
    edit: new URL("@/static/images/my-design/my-edit-icon.png", import.meta.url)
        .href,
    copy: new URL("@/static/images/my-design/my-copy-icon.png", import.meta.url)
        .href,
    profile: new URL(
        "@/static/images/my-design/my-menu-profile.png",
        import.meta.url,
    ).href,
    wallet: new URL(
        "@/static/images/my-design/my-menu-payment.png",
        import.meta.url,
    ).href,
    message: new URL(
        "@/static/images/my-design/my-menu-message.png",
        import.meta.url,
    ).href,
    card: new URL("@/static/images/my-design/my-menu-link.png", import.meta.url)
        .href,
    service: new URL(
        "@/static/images/my-design/my-menu-service.png",
        import.meta.url,
    ).href,
    logout: new URL(
        "@/static/images/my-design/my-logout-icon.png",
        import.meta.url,
    ).href,
    level1: new URL("@/static/images/vip_design/vip1.png", import.meta.url)
        .href,
    level2: new URL("@/static/images/vip_design/vip2.png", import.meta.url)
        .href,
    level3: new URL("@/static/images/vip_design/vip3.png", import.meta.url)
        .href,
    level4: new URL("@/static/images/vip_design/vip4.png", import.meta.url)
        .href,
    level5: new URL("@/static/images/vip_design/vip5.png", import.meta.url)
        .href,
    levelDefault: new URL(
        "@/static/images/my-design/my-vip-badge.png",
        import.meta.url,
    ).href,
};

const walletBalance = computed(() => {
    const value =
        userInfo.value.totalBalance ??
        Number(userInfo.value?.balance || 0) +
            Number(
                userInfo.value?.frozenBalance ??
                    userInfo.value?.freezeAmount ??
                    0,
            );
    return Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
});

const rebateAmount = computed(() =>
    Number(userInfo.value?.commission || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }),
);

const creditScore = computed(() => {
    const rawScore = Number(userInfo.value?.creditScore ?? 0);
    if (!Number.isFinite(rawScore)) return 0;
    return Math.min(100, Math.max(0, rawScore));
});

const creditScoreDisplay = computed(() => `${Math.round(creditScore.value)}%`);
const safeAnimatedCreditScore = computed(() =>
    Math.min(100, Math.max(0, Math.round(Number(animatedCreditScore.value || 0)))),
);

const displayVipLevel = computed(() => {
    const raw =
        `${userLevel.value || userInfo.value?.userLevel?.nameEn || "VIP1"}`
            .trim()
            .replace(/\s+/g, " ");
    const matched = raw.match(/^VIP\s*(\d+)$/i);
    if (matched) return `VIP ${matched[1]}`;
    return raw || "VIP 1";
});

const currentVipLevelNumber = computed(() => {
    const matched = `${userLevel.value || userInfo.value?.userLevel?.nameEn || ""}`.match(
        /\d+/,
    );
    return matched ? Number(matched[0]) : 0;
});


const previewAvatar = computed(() => {
    if (fileList.value?.[0]?.url) return fileList.value[0].url;
    return displayAvatar.value;
});

const withAvatarCacheBust = (url) => {
    if (!url || url.startsWith("data:")) return url || defaultAvatar;
    if (!avatarVersion.value) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}avatar_v=${avatarVersion.value}`;
};

const displayAvatar = computed(() =>
    withAvatarCacheBust(userInfo.value?.avatar || userStore.userInfo?.avatar || defaultAvatar),
);

const triggerUploader = () => {
    const input = uploaderRef.value?.$el?.querySelector('input[type="file"]');
    if (input) input.click();
};

const normalizeAvatarUrl = (avatar) => {
    if (!avatar) return "";
    if (/^https?:\/\//i.test(avatar) || avatar.startsWith("data:")) return avatar;
    return `${VITE_API_IMG_URL}${avatar}`;
};

const afterRead = async (file) => {
    isAvatarUploading.value = true;
    try {
        const uploadRes = await upload({ file: file.file });
        if (uploadRes.code !== 200) {
            showSuccessToast(uploadRes.msg || t("image_upload_failed"));
            fileList.value = [{ url: previewAvatar.value }];
            return;
        }

        const fullAvatar = normalizeAvatarUrl(uploadRes.fileName);
        fileList.value = [{ url: fullAvatar }];

        const updateRes = await updateAvatar({ avatar: fullAvatar });
        if (updateRes.code === 200) {
            showSuccessToast(t("avatar_updated_successfully"));
            avatarVersion.value = Date.now();
            userStore.setUserInfo({ ...(userStore.userInfo || {}), avatar: fullAvatar });
            const freshInfo = await userStore.getUserInfo({ force: true }).catch(() => null);
            userInfo.value = { ...(freshInfo || userInfo.value || {}), avatar: fullAvatar };
            userStore.setUserInfo({ ...(freshInfo || userStore.userInfo || {}), avatar: fullAvatar });
            userLevel.value = userInfo.value?.userLevel?.nameEn || userLevel.value || "";
            fileList.value = [{ url: withAvatarCacheBust(fullAvatar) }];
        } else {
            showSuccessToast(updateRes.msg || t("avatar_update_failed"));
        }
    } catch (error) {
        showSuccessToast(t("network_error"));
        fileList.value = [{ url: previewAvatar.value }];
    } finally {
        isAvatarUploading.value = false;
    }
};

const currentVipBadgeIcon = computed(() => {
    switch (currentVipLevelNumber.value) {
        case 1:
            return myIcons.level1;
        case 2:
            return myIcons.level2;
        case 3:
            return myIcons.level3;
        case 4:
            return myIcons.level4;
        case 5:
            return myIcons.level5;
        default:
            return myIcons.levelDefault;
    }
});

const menuItems = computed(() => [
    {
        title: t("personal_profile"),
        desc: t("manage_basic_information"),
        icon: myIcons.profile,
        action: () => toPage("/profileItem"),
    },
    // {
    //     title: t("payment_methods"),
    //     desc: t("configure_recharge_withdrawal"),
    //     icon: myIcons.wallet,
    //     action: () => toPage("/paymentMethods"),
    // },
    {
        title: t("message_center"),
        desc: t("system_notifications_announcements"),
        icon: myIcons.message,
        action: () => toPage("/notice"),
    },
    {
        title: t("link_your_bank_card"),
        desc: t("bind_bank_card_for_withdrawals"),
        icon: myIcons.card,
        action: () => router.push({ path: "/cardList", query: { type: 1 } }),
    },
    // {
    //     title: t("contact_customer_service"),
    //     desc: t("get_help_resolve_issues"),
    //     icon: myIcons.service,
    //     action: customer,
    // },
]);

function toPage(path) {
    router.push({ path });
}

function customer() {
    const time = checkWorkTimeLocal(
        TradeInfor.value.workTimeStart,
        TradeInfor.value.workTimeEnd,
        userStore.zoneActive.tzName,
    );

    if (time) {
        ContactUsRef.value.open();
        return;
    }

    showToast(
        t("supportHours", {
            start: TradeInfor.value.workTimeStart,
            end: TradeInfor.value.workTimeEnd,
        }),
    );
}

function logout() {
    showLogoutPopup.value = true;
}

function confirmLogout() {
    showLogoutPopup.value = false;
    userStore.logout();
}

function updateDeviceMode() {
    isPc.value = window.matchMedia("(min-width: 768px)").matches;
}

function animateCreditScore(targetValue) {
    const endValue = Math.min(100, Math.max(0, Number(targetValue || 0)));
    const startValue = Number(animatedCreditScore.value || 0);
    const duration = 960;
    const startAt = performance.now();

    if (creditScoreAnimationFrame) {
        cancelAnimationFrame(creditScoreAnimationFrame);
    }

    const step = (now) => {
        const progress = Math.min((now - startAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        animatedCreditScore.value = Math.round(
            startValue + (endValue - startValue) * eased,
        );

        if (progress < 1) {
            creditScoreAnimationFrame = requestAnimationFrame(step);
            return;
        }

        animatedCreditScore.value = endValue;
        creditScoreAnimationFrame = 0;
    };

    creditScoreAnimationFrame = requestAnimationFrame(step);
}

function updateHandler() {
    getUserGetInfo({ force: true });
}

function syncUserInfo(info = {}) {
    userInfo.value = info || {};
    userLevel.value = info?.userLevel?.nameEn || "";
    fileList.value = [{ url: userInfo.value.avatar || defaultAvatar }];
}

async function getUserGetInfo(options = {}) {
    const info = await userStore.getUserInfo(options);
    syncUserInfo(info);
    return info;
}

async function tradeConfig() {
    const res = await getTradeConfig();
    TradeInfor.value = res.data || {};
}

onMounted(() => {
    window.addEventListener("updateTrade", updateHandler);
    window.addEventListener("resize", updateDeviceMode);
    updateDeviceMode();
    getUserGetInfo();
    tradeConfig();
});

watch(
    creditScore,
    (value) => {
        animateCreditScore(value);
    },
    { immediate: true },
);

onActivated(() => {
    window.addEventListener("updateTrade", updateHandler);
});

onUnmounted(() => {
    window.removeEventListener("updateTrade", updateHandler);
    window.removeEventListener("resize", updateDeviceMode);
    if (creditScoreAnimationFrame) {
        cancelAnimationFrame(creditScoreAnimationFrame);
    }
});

onDeactivated(() => {
    window.removeEventListener("updateTrade", updateHandler);
});
</script>

<style scoped>
.my-page {
    min-height: 100vh;
    padding-bottom: 118px;
    background: #eef0f5;
    color: #111111;
    font-family: "Montserrat", "Poppins", sans-serif;
}

.my-page__main {
    padding: var(--main-tab-top-bar-height, 104px) 15px 16px;
}

.my-hero {
    position: relative;
    min-height: 365px;
    padding: 22px 24px 24px;
    border-radius: 16px;
    background: #3545e8 url("@/static/images/my-design/my-hero-bg.png") center /
        cover no-repeat;
    color: #ffffff;
    overflow: hidden;
}

.my-hero__badge {
    position: absolute;
    top: 20px;
    right: 24px;
    text-align: center;
}

.my-hero__badge img {
    width: 44px;
    height: 44px;
    display: block;
    object-fit: contain;
    margin: 0 auto;
}

.my-hero__badge span {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    line-height: 1;
    font-weight: 500;
}

.my-hero__avatarImg {
    width: 98px;
    height: 98px;
}

.my-hero__avatar-wrap {
    position: relative;
    width: 110px;
    margin: 18px auto 0;
}

.my-hero__avatar-shell {
    width: 98px;
    height: 98px;
    border-radius: 50%;
    overflow: hidden;
}

.my-hero__avatar,
.my-hero__avatar-loading {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    border-radius: 50%;
}

.my-hero__avatar-loading {
    background: rgba(255, 255, 255, 0.2);
    animation: pulse 1.6s ease-in-out infinite;
}

@keyframes pulse {
    0%,
    100% {
        opacity: 0.45;
    }
    50% {
        opacity: 0.8;
    }
}

.my-hero__edit {
    position: absolute;
    right: 10px;
    bottom: 1px;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    background: transparent;
}

.my-hero__edit img {
    width: 100%;
    height: 100%;
    display: block;
}

.my-hero__name {
    margin-top: 13px;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 24px;
    color: #ffffff;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.my-hero__row {
    display: flex;
    align-items: center;
}

.my-hero__row--referral {
    justify-content: center;
    gap: 10px;
    margin-top: 28px;
}

.my-hero__label {
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.my-hero__code {
    min-width: 83px;
    padding: 8px 2px 10px 4px;
    border: 0;
    border-radius: 8px;
    background: #34ca5d;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 14px;
    color: #ffffff;
    line-height: 20px;
    text-align: cebter;
    font-style: normal;
    text-transform: none;
}

.my-hero__copy-btn {
    width: 16px;
    height: 16px;
    padding: 0;
    border: 0;
    background: transparent;
}

.my-hero__copy-btn img {
    width: 100%;
    height: 100%;
    display: block;
}

.my-hero__row--score {
    justify-content: space-between;
    margin-top: 20px;
}

.my-hero__score-value {
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 14px;
    color: #ffffff;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.my-hero__progress {
    margin-top: 16px;
}

.my-hero__progress-track {
    position: relative;
    height: 8px !important;
    border-radius: 999px !important;
    overflow: hidden !important;
    background: rgba(255, 255, 255, 0.26);
    box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.12);
}

.my-hero__progress-fill {
    position: relative;
    height: 100%;
    border-radius: 999px !important;
    overflow: hidden;
    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    background: linear-gradient(
        90deg,
        #63f27b 0%,
        #33d45d 48%,
        #1ebf50 100%
    ) !important;
    box-shadow: 0 0 16px rgba(51, 212, 93, 0.28);
}

.my-hero__progress-fill::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
        110deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.32) 36%,
        rgba(255, 255, 255, 0.58) 50%,
        rgba(255, 255, 255, 0.18) 64%,
        rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-100%);
    animation: my-progress-shimmer 1.8s ease-in-out infinite;
}

@keyframes my-progress-shimmer {
    100% {
        transform: translateX(100%);
    }
}

.my-hero__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 30px;
}

.my-stat {
    /*padding: 0 12px;*/
    text-align: center;
}

.my-stat--divider {
    border-left: 4px dashed rgba(255, 255, 255, 0.18);
}

.my-stat__label {
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 12px;
    color: #ffffff;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.my-stat__value {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 10px;
    margin-top: 18px;
}

.my-stat__value span {
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 20px;
    color: #ffffff;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.my-stat__value em {
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 14px;
    color: #ffffff;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.my-menu-card {
    margin-top: 16px;
    background: #ffffff;
    border-radius: 18px;
    overflow: hidden;
}

.my-menu-row {
    display: flex;
    align-items: center;
    min-height: 74px;
    padding: 0 18px;
    border-bottom: 1px solid #edf0f5;
    box-sizing: border-box;
}

.my-menu-row:last-child {
    border-bottom: 0;
}

.my-menu-row__icon {
    flex: 0 0 58px;
    width: 40px;
    height: 40px;
    margin-right: 18px;
}

.my-menu-row__icon img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
}

.my-menu-row__content {
    min-width: 0;
}

.my-menu-row__title {
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 14px;
    color: #000000;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.my-menu-row__desc {
    margin-top: 4px;
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 12px;
    color: #6b7280;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.my-logout {
    width: 100%;
    height: 52px;
    margin-top: 16px;
    border: 0;
    border-radius: 18px;
    background: #f8edee;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 14px;
    color: #ef5350;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.my-logout img {
    width: 20px;
    height: 20px;
}

.logout-sheet {
    width: 100%;
    max-width: var(--app-pc-max-width, 375px);
    left: 50% !important;
    transform: translateX(-50%) !important;
    border-radius: 20px 20px 0 0;
    padding: 39px 22px calc(36px + env(safe-area-inset-bottom, 0px));
    background: #ffffff;
    box-sizing: border-box;
}

.logout-sheet--mobile {
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    min-width: 100vw !important;
    transform: none !important;
}

:global(.logout-sheet-overlay) {
    background: rgba(0, 0, 0, 0.42);
    backdrop-filter: blur(4px);
}

:global(.logout-sheet-overlay--mobile) {
    left: 0 !important;
    right: 0 !important;
    top: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    height: 100dvh !important;
}

:global(.logout-sheet-slide-enter-active),
:global(.logout-sheet-slide-leave-active) {
    transition:
        transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.24s ease;
}

:global(.logout-sheet-slide-enter-from),
:global(.logout-sheet-slide-leave-to) {
    opacity: 0;
    transform: translate3d(0, 100%, 0) !important;
}

:global(.logout-sheet-slide-enter-to),
:global(.logout-sheet-slide-leave-from) {
    opacity: 1;
    transform: translate3d(0, 0, 0) !important;
}

.logout-sheet__icon {
    width: 78px;
    height: 78px;
    margin: 0 auto;
    border-radius: 50%;
    border: 1px dashed #ffb0aa;
    background: #fff4f2;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logout-sheet__icon img {
    width: 26px;
    height: 26px;
}

.logout-sheet__title {
    margin-top: 18px;
    text-align: center;
    color: #101522;
    font-size: 20px;
    line-height: 26px;
    font-weight: 700;
}

.logout-sheet__desc {
    margin-top: 16px;
    text-align: center;
    color: #62806b;
    font-size: 13px;
    line-height: 22px;
}

.logout-sheet__confirm,
.logout-sheet__cancel {
    width: 100%;
    height: 59px;
    border-radius: 12px;
    font-size: 17px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logout-sheet__confirm {
    margin-top: 26px;
    background: var(--theme-primary);
    color: #ffffff;
}

.logout-sheet__confirm img {
    width: 22px;
    height: 22px;
    margin-right: 10px;
    filter: brightness(0) invert(1);
}

.logout-sheet__cancel {
    margin-top: 18px;
    color: #d37703;
    border: 1px solid rgba(211, 119, 3, 1);
    border-radius: 14px;
    background: rgba(211, 119, 3, 0.12);
}

.logout-desktop-layer {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 50%;
    z-index: 3000;
    width: var(--app-pc-max-width, 375px);
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.42);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
}

.logout-desktop-card {
    width: 100%;
    max-width: calc(var(--app-pc-max-width, 375px) - 32px);
    border-radius: 18px;
    background: #ffffff;
    padding: 34px 22px 28px;
    box-sizing: border-box;
}

.logout-desktop-fade-enter-active,
.logout-desktop-fade-leave-active {
    transition: opacity 0.22s ease;
}

.logout-desktop-fade-enter-active .logout-desktop-card,
.logout-desktop-fade-leave-active .logout-desktop-card {
    transition:
        transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.22s ease;
}

.logout-desktop-fade-enter-from,
.logout-desktop-fade-leave-to {
    opacity: 0;
}

.logout-desktop-fade-enter-from .logout-desktop-card,
.logout-desktop-fade-leave-to .logout-desktop-card {
    opacity: 0;
    transform: translateY(14px) scale(0.96);
}

.hidden-uploader {
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
}

.hidden-uploader :deep(.van-uploader__wrapper),
.hidden-uploader :deep(.van-uploader__upload) {
    width: 1px;
    height: 1px;
}
</style>
