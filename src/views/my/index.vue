<template>
    <div class="my-page min-h-[100vh] bg-[#f5faf6] pb-[118px] text-[#111]">
        <PageTopBar :title="$t('my')" />

        <main class="px-[16px] pt-[85px] pb-[16px]">
            <section
                class="profile-hero relative overflow-hidden rounded-[18px] bg-gradient-to-br from-[#333C37] to-[#4A6565] px-[20px] py-[24px] text-white"
            >
                <div class="hero-bubble hero-bubble--top"></div>
                <div class="hero-bubble hero-bubble--bottom"></div>

                <div class="relative z-[1] flex items-center">
                    <div class="avatar-ring">
                        <div
                            v-if="userInfo.avatar === undefined"
                            class="h-full w-full animate-pulse rounded-full bg-white/20"
                        ></div>
                        <img
                            v-else-if="userInfo.avatar"
                            :src="userInfo.avatar"
                            class="h-full w-full rounded-full object-cover"
                            :alt="$t('user_avatar')"
                            @error="(e) => (e.target.src = userImg)"
                        />
                        <img
                            v-else
                            :src="myIcons.user"
                            class="avatar-fallback h-[27px] w-[27px]"
                            :alt="$t('default_avatar')"
                        />
                    </div>

                    <div class="ml-[15px] min-w-0">
                        <div class="flex items-center">
                            <div
                                class="max-w-[150px] truncate text-[22px] font-medium leading-[26px]"
                            >
                                {{ $t("hi") }},{{ userInfo.username || "--" }}
                            </div>
                            <div
                                class="ml-[8px] rounded-full bg-white/25 px-[10px] py-[4px] text-[11px] font-bold"
                            >
                                {{ userLevel || "VIP1" }}
                            </div>
                        </div>
                        <div class="mt-[8px] text-[13px] text-white/80">
                            {{ $t("my_profile_welcome") }}
                        </div>
                    </div>
                </div>

                <div
                    class="relative z-[1] mt-[18px] rounded-[10px] bg-white/18 px-[14px] py-[12px]"
                >
                    <div
                        class="flex items-center justify-between text-[12px] text-white/90"
                    >
                        <div class="flex items-center">
                            <img
                                :src="myIcons.topy"
                                class="mr-[6px] h-[14px] w-[14px]"
                            />
                            {{ $t("credit_score") }}
                        </div>
                        <div>{{ creditScoreDisplay }}</div>
                    </div>
                    <div class="mt-[10px] h-[4px] rounded-full bg-white/20">
                        <div
                            class="credit-progress-bar h-full rounded-full bg-white"
                            :style="{ width: creditScorePercent }"
                        ></div>
                    </div>
                </div>
            </section>

            <section class="mt-[18px] grid grid-cols-2 gap-[10px]">
                <div class="info-card">
                    <div class="tracking-title">
                        {{ $t("member_invitation_code") }}
                    </div>
                    <div
                        class="mt-[14px] truncate text-[15px] font-medium tracking-[4px] text-[#159947]"
                    >
                        {{ userInfo.inviteCode || "--" }}
                    </div>
                    <button
                        class="copy-btn"
                        type="button"
                        @click="
                            copyContent(userInfo.inviteCode, {
                                duration: 4,
                            })
                        "
                    >
                        <img
                            :src="myIcons.copy"
                            class="mr-[6px] h-[14px] w-[14px]"
                            alt=""
                        />
                        {{ $t("copy_code") }}
                    </button>
                </div>

                <div class="info-card">
                    <div class="tracking-title">{{ $t("wallet_balance") }}</div>
                    <div
                        class="mt-[5px] text-[20px] font-medium leading-[24px]"
                    >
                        {{ walletBalance }}
                    </div>
                    <div class="text-[11px] text-[#159947]">
                        {{ $t("rebate") }}:{{ rebateAmount }}
                    </div>
                    <div class="wallet-actions flex gap-[7px] mt-[8px]">
                        <button
                            class="wallet-btn wallet-btn--primary"
                            type="button"
                            @click="toPage('/deposit')"
                        >
                            {{ $t("deposit") }}
                        </button>
                        <button
                            class="wallet-btn"
                            type="button"
                            @click="toPage('/withdraw')"
                        >
                            {{ $t("withdraw") }}
                        </button>
                    </div>
                </div>
            </section>

            <section
                class="menu-card mt-[16px] overflow-hidden rounded-[13px] border border-[#cfe9d5] bg-white"
            >
                <div
                    v-for="item in menuItems"
                    :key="item.title"
                    class="menu-row"
                    @click="item.action"
                >
                    <div class="menu-icon">
                        <img
                            :src="item.icon"
                            class="h-[18px] w-[18px]"
                            alt=""
                        />
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="text-[16px] leading-[20px] text-[#1b261e]">
                            {{ item.title }}
                        </div>
                        <div
                            class="mt-[4px] truncate text-[12px] leading-[16px] text-[#5b8064]"
                        >
                            {{ item.desc }}
                        </div>
                    </div>
                    <van-icon name="arrow" size="16" color="#5f8067" />
                </div>
            </section>

            <button class="logout-btn" type="button" @click="logout">
                <img
                    :src="myIcons.logout"
                    class="mr-[8px] h-[17px] w-[17px]"
                    alt=""
                />
                {{ $t("log_out") }}
            </button>
        </main>
        <ContactUs ref="ContactUsRef"></ContactUs>
        <tradePassword ref="tradePasswordRef"></tradePassword>
        <Lang ref="langRef"></Lang>
        <van-popup
            v-if="!isPc"
            v-model:show="showLogoutPopup"
            position="bottom"
            class="logout-sheet"
            overlay-class="logout-sheet-overlay"
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
} from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showToast } from "@/util/message";

import ContactUs from "@/components/ContactUs.vue";
import Lang from "@/components/Lang.vue";
import tradePassword from "@/components/tradePassword.vue";
import { checkWorkTimeLocal, copyContent } from "@/util/utils";
import { getTradeConfig, userGetInfo } from "@/api/apis";
import { useUserStore } from "@/store/modules/user";

const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();
const userImg = new URL("@/static/images/userImg2.png", import.meta.url).href;

const langRef = ref(null);
const ContactUsRef = ref(null);
const tradePasswordRef = ref(null);
const userInfo = ref({});
const userLevel = ref("");
const TradeInfor = ref({});
const showLogoutPopup = ref(false);
const isPc = ref(false);

const myIcons = {
    user: new URL("@/static/images/user-mine.png", import.meta.url).href,
    copy: new URL("@/static/images/copy.png", import.meta.url).href,
    topy: new URL("@/static/images/topy.png", import.meta.url).href,
    profile: new URL("@/static/images/user-mine2.png", import.meta.url).href,
    wallet: new URL("@/static/images/user-wallet.png", import.meta.url).href,
    message: new URL("@/static/images/user-message.png", import.meta.url).href,
    card: new URL("@/static/images/LinkCard.png", import.meta.url).href,
    service: new URL("@/static/images/user-service.png", import.meta.url).href,
    logout: new URL("@/static/images/log-out.png", import.meta.url).href,
};

const walletBalance = computed(() => {
    const value =
        userInfo.value.totalBalance ??
        Number(userInfo.value?.balance || 0) +
            Number(userInfo.value?.frozenBalance || 0);
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
const creditScorePercent = computed(() => `${creditScore.value}%`);

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
    {
        title: t("contact_customer_service"),
        desc: t("get_help_resolve_issues"),
        icon: myIcons.service,
        action: () => toPage("/customer"),
    },
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

function updateHandler() {
    getUserGetInfo();
}

function getUserGetInfo() {
    userGetInfo().then((res) => {
        userInfo.value = res.data || {};
        userLevel.value = res.data?.userLevel?.nameEn || "";
        userStore.setUserInfo(userInfo.value);
    });
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

onActivated(() => {
    window.addEventListener("updateTrade", updateHandler);
});

onUnmounted(() => {
    window.removeEventListener("updateTrade", updateHandler);
    window.removeEventListener("resize", updateDeviceMode);
});

onDeactivated(() => {
    window.removeEventListener("updateTrade", updateHandler);
});
</script>

<style scoped>
.my-page {
    font-family: "Montserrat", "Poppins", sans-serif;
}

.profile-hero {
    min-height: 193px;
}

.credit-progress-bar {
    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-bubble {
    position: absolute;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.08);
}

.hero-bubble--top {
    right: -24px;
    top: -36px;
    height: 112px;
    width: 112px;
}

.hero-bubble--bottom {
    bottom: -42px;
    left: -36px;
    height: 106px;
    width: 106px;
}

.avatar-ring {
    display: flex;
    height: 62px;
    width: 62px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 9999px;
    /*border: 2px solid rgba(255, 255, 255, 0.45);*/
    background: rgba(255, 255, 255, 0.12);
}

.info-card {
    display: flex;
    flex-direction: column;
    min-height: 141px;
    border: 1px solid #cfe9d5;
    border-radius: 14px;
    background: #fff;
    padding: 18px 13px;
}

.tracking-title {
    color: #5c7c63;
    font-size: 10px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.copy-btn {
    margin-top: auto;
    display: flex;
    height: 32px;
    width: 100%;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    background: var(--theme-green-defalut);
    color: #fff;
    font-size: 12px;
    font-weight: 500;
}

.copy-btn img {
    filter: brightness(0) invert(1);
}

.wallet-actions {
    /*margin-top: auto;*/
}

.wallet-btn {
    display: flex;
    height: 32px;
    flex: 1;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    background: var(--theme-primary-soft);
    color: var(--theme-primary-text);
    font-size: 12px;
    font-weight: 500;
}

.wallet-btn--primary {
    background: var(--theme-green-defalut);
    color: #fff;
}

.menu-row {
    display: flex;
    min-height: 73px;
    align-items: center;
    border-bottom: 1px solid #d9eadf;
    padding: 14px 16px;
}

.menu-row:last-child {
    border-bottom: 0;
}

.menu-icon {
    margin-right: 14px;
    display: flex;
    height: 42px;
    width: 42px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 11px;
    background: #edf8f0;
}

.logout-btn {
    margin-top: 16px;
    display: flex;
    height: 54px;
    width: 100%;
    align-items: center;
    justify-content: center;
    border: 1px solid #f0c9c3;
    border-radius: 13px;
    background: #fff7f5;
    color: #df392d;
    font-size: 15px;
    font-weight: 500;
}

.logout-sheet {
    width: 100%;
    max-width: var(--app-pc-max-width, 375px);
    left: 50% !important;
    transform: translateX(-50%) !important;
    border-radius: 20px 20px 0 0;
    padding: 39px 22px 36px;
    background: #ffffff;
    box-sizing: border-box;
}

:global(.logout-sheet-overlay) {
    background: rgba(0, 0, 0, 0.42);
    backdrop-filter: blur(4px);
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
    transform: translate3d(-50%, 100%, 0) !important;
}

:global(.logout-sheet-slide-enter-to),
:global(.logout-sheet-slide-leave-from) {
    opacity: 1;
    transform: translate3d(-50%, 0, 0) !important;
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
    background:var(--theme-primary);
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
    color: #D37703;
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
</style>
