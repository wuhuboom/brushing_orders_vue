<template>
    <div class="home-page min-h-screen bg-[#f5faf6]">
        <div class="mx-auto flex w-full flex-col pb-[110px] pt-[76px]">
            <WelcomeSummary
                :eyebrow="$t('home_welcome_back')"
                :title="displayName"
                notice-count=""
                @notice="goToQuick('/notice')"
            />

            <HomeBannerCarousel
                class="mx-4 mt-3"
                :fallback-title="$t('home_start_earning_today')"
            />

            <HomeWalletCard
                class="mx-4 mt-4"
                :title="$t('home_my_wallet')"
                :balance-label="$t('home_balance_usdt')"
                :today-label="$t('home_today_s_earnings')"
                :total-label="$t('home_total_earnings')"
                :vip-label="vipLabel"
                :balance="walletBalance"
                :today-earnings="todayEarnings"
                :total-earnings="totalEarnings"
            />

            <section class="home-ticker mx-4 mt-4">
                <div class="home-ticker__icon">
                    <img :src="noticeVolumeIcon" alt="" />
                </div>
                <div class="home-ticker__content">
                    <div
                        class="home-ticker__marquee"
                        v-html="noticeMarqueeHtml"
                    ></div>
                </div>
            </section>

            <section class="home-link-grid mx-4 mt-4">
                <button
                    v-for="item in quickLinks"
                    :key="item.key"
                    type="button"
                    class="flex flex-col items-center gap-2"
                    @click="goToQuick(item.route)"
                >
                    <div class="home-link-icon">
                        <img :src="item.icon" alt="" />
                    </div>
                    <span
                        class="text-center text-[12px] font-semibold leading-[1.15] text-[#121f16]"
                    >
                        {{ $t(item.label) }}
                    </span>
                </button>
            </section>

            <section class="home-banner mx-4 mt-4">
                <div>
                    <div
                        class="text-[18px] font-extrabold leading-[1.15] text-white"
                    >
                        {{ $t("home_start_earning_now") }}
                        <img
                            class="home-banner-title-icon"
                            :src="bannerTitleIcon"
                            alt=""
                        />
                    </div>
                    <div
                        class="mt-2 text-[13px] font-semibold leading-[1.25] text-white/90"
                    >
                        {{ $t("home_complete_tasks_to_get_commission") }}
                    </div>
                </div>
                <button
                    class="home-banner-btn"
                    type="button"
                    @click="goToQuick('/starting')"
                >
                    {{ $t("home_go") }} &rarr;
                </button>
            </section>

            <section class="home-income-strip mx-4 mt-4">
                <div
                    class="flex items-center gap-2 text-[14px] font-semibold text-[#214f89]"
                >
                    <img
                        class="home-income-strip__icon"
                        :src="incomeTrendIcon"
                        alt=""
                    />
                    <span>{{
                        $t("home_daily_income_updated_in_real_time")
                    }}</span>
                </div>
                <img
                    class="home-income-strip__flash"
                    :src="incomeFlashIcon"
                    alt=""
                />
            </section>

            <section v-if="recommendedTasks.length" class="mx-4 mt-4">
                <div class="mb-3 flex items-center justify-between">
                    <div class="text-[16px] font-extrabold text-[#142819]">
                        <span aria-hidden="true">&#128293;</span>
                        {{ $t("home_recommended_tasks") }}
                    </div>
                    <button
                        type="button"
                        class="text-[14px] font-bold text-[#1ea74c]"
                        @click="goToQuick('/records')"
                    >
                        {{ $t("home_view_all") }}
                    </button>
                </div>

                <div class="space-y-3">
                    <article
                        v-for="task in recommendedTasks"
                        :key="task.id"
                        class="home-task-card"
                        :class="{ 'home-task-card--vip': task.vip }"
                    >
                        <div
                            class="relative h-[76px] w-[76px] overflow-hidden rounded-[14px] bg-[#f5f7f5]"
                        >
                            <img
                                :src="task.image"
                                :alt="task.name"
                                class="h-full w-full object-cover"
                            />
                            <span v-if="task.vip" class="home-task-vip-badge"
                                >VIP</span
                            >
                        </div>
                        <div class="min-w-0 flex-1">
                            <div
                                class="truncate text-[15px] font-extrabold text-[#141d14]"
                            >
                                {{ task.name }}
                            </div>
                            <div class="mt-1 text-[13px] text-[#6f7d70]">
                                {{ $t("price") }}:
                                <span class="font-bold text-[#2f402f]"
                                    >${{ formatMoney(task.price) }}</span
                                >
                            </div>
                            <div class="mt-1 text-[13px] text-[#6f7d70]">
                                {{ $t("commission") }}:
                                <span class="font-extrabold text-[#1ea74c]"
                                    >+${{ formatMoney(task.commission) }}</span
                                >
                            </div>
                        </div>
                        <button
                            type="button"
                            class="home-task-btn"
                            @click="goToQuick('/starting')"
                        >
                            {{ $t("home_grab_order") }}
                        </button>
                    </article>
                </div>
            </section>

            <section class="home-upgrade-card mx-4 mt-4">
                <div>
                    <div class="text-[15px] font-extrabold text-[#9e6a00]">
                        {{ $t("home_upgrade_vip_to_unlock_more_tasks") }}
                    </div>
                    <div class="mt-1 text-[13px] text-[#d08f1d]">
                        {{ $t("home_higher_level_higher_earnings") }}
                    </div>
                </div>
                <img src="@/static/images/home/golb.png" />
            </section>

            <section class="home-partner-card mx-4 mt-5">
                <div
                    class="rounded-t-[16px] bg-[linear-gradient(147.76deg,rgba(52,199,110,1),rgba(20,130,60,1)_100%)] px-4 py-5 text-white"
                >
                    <div
                        class="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/90"
                    >
                        <div
                            class="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/16 text-[20px] leading-none"
                        >
                            <img src="@/static/images/home/ansia.png" />
                        </div>
                        <span>{{ $t("home_featured_partner") }}</span>
                    </div>
                    <div class="mt-4 text-[18px] font-extrabold">
                        {{ $t("home_partner_company") }}
                    </div>
                    <div class="mt-2 text-[13px] text-white/95">
                        "{{ $t("home_partner_tagline") }}"
                    </div>
                    <p class="mt-4 text-[12px] leading-[1.55] text-white/92">
                        {{ $t("home_partner_description") }}
                    </p>
                </div>

                <div class="bg-white px-4 py-4">
                    <div class="flex flex-wrap gap-2">
                        <span
                            v-for="tag in partnerTags"
                            :key="tag"
                            class="home-partner-tag"
                            >{{ $t(tag) }}</span
                        >
                    </div>
                </div>

                <div class="home-partner-cta">
                    <div class="home-partner-cta__content">
                        <div class="home-partner-cta__title">
                            {{ $t("home_stop_blending_in") }}
                        </div>
                        <div class="home-partner-cta__desc">
                            {{ $t("home_got_a_project_contact_us_now") }} →
                        </div>
                    </div>
                    <button type="button" class="home-call-btn">
                        <img src="@/static/images/home/phone.png" />
                        <span>{{ $t("home_call_now") }}</span>
                    </button>
                </div>

                <div class="bg-white px-4 py-4">
                    <div class="text-[12px] font-extrabold text-[#1c2d1f]">
                        <span aria-hidden="true">&#10024;</span>
                        {{ $t("home_why_choose_so_services") }}
                    </div>
                    <ul class="mt-3 space-y-2">
                        <li
                            v-for="reason in partnerReasons"
                            :key="reason"
                            class="flex items-start gap-2 text-[15px] text-[#203022]"
                        >
                            <img
                                src="@/static/images/home/checkg.png"
                                class="mt-[2px] h-[16px] w-[16px] shrink-0"
                            />
                            <span class="leading-[20px]">{{ $t(reason) }}</span>
                        </li>
                    </ul>
                </div>

                <div
                    class="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#e2efe5] bg-[#f6fbf7] px-4 py-4 text-[13px] text-[#5c7863]"
                >
                    <img src="@/static/images/home/human2.png" />
                    <div class="flex items-center">
                        <img src="@/static/images/home/start.png" />
                        <img src="@/static/images/home/start.png" />
                        <img src="@/static/images/home/start.png" />
                        <img src="@/static/images/home/start.png" />
                        <img src="@/static/images/home/start.png" />
                    </div>
                    <span class="font-extrabold text-[#16311d]">5.0</span>
                    <div class="text-[#648C6E]">
                        <div>
                            <span aria-hidden="true">&bull;</span>
                            <span>{{ $t("home_real_reviews") }}</span>
                            <span aria-hidden="true">&bull;</span>
                        </div>
                        <div>
                            <span>{{ $t("home_trustedex_certified") }}</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import HomeBannerCarousel from "@/components/home/HomeBannerCarousel.vue";
import HomeWalletCard from "@/components/home/HomeWalletCard.vue";
import WelcomeSummary from "@/components/home/WelcomeSummary.vue";
import { getNoticeList, getOrderInfos, getTradeConfig } from "../api/apis";
import { useUserStore } from "@/store/modules/user";

const router = useRouter();
const userStore = useUserStore();

const tradeInfo = ref({});
const orderList = ref([]);
const notices = ref([]);
const imageBaseUrl = window.g.VITE_API_IMG_URL || "";

const quickIconIncome = new URL(
    "@/static/images/home-quick-income.png",
    import.meta.url,
).href;
const quickIconService = new URL(
    "@/static/images/home-quick-service.png",
    import.meta.url,
).href;
const quickIconDeposit = new URL(
    "@/static/images/home-quick-deposit.png",
    import.meta.url,
).href;
const quickIconTerms = new URL(
    "@/static/images/home-quick-terms.png",
    import.meta.url,
).href;
const quickIconEvent = new URL(
    "@/static/images/home-quick-event.png",
    import.meta.url,
).href;
const quickIconCertificate = new URL(
    "@/static/images/home-quick-certificate.png",
    import.meta.url,
).href;
const quickIconWithdraw = new URL(
    "@/static/images/home-quick-withdraw.png",
    import.meta.url,
).href;
const quickIconFaqs = new URL(
    "@/static/images/home-quick-faqs.png",
    import.meta.url,
).href;
const noticeVolumeIcon = new URL(
    "@/static/images/home-notice-volume.png",
    import.meta.url,
).href;
const incomeTrendIcon = new URL(
    "@/static/images/home-income-trend.png",
    import.meta.url,
).href;
const incomeFlashIcon = new URL(
    "@/static/images/home-income-flash.png",
    import.meta.url,
).href;
const bannerTitleIcon = new URL(
    "@/static/images/home-vip-crown-large.png",
    import.meta.url,
).href;

const quickLinks = [
    {
        key: "income_guide",
        label: "income_guide",
        route: "/guide",
        icon: quickIconIncome,
    },
    {
        key: "service",
        label: "service",
        route: "/customer",
        icon: quickIconService,
    },
    {
        key: "deposit",
        label: "deposit",
        route: "/deposit",
        icon: quickIconDeposit,
    },
    {
        key: "terms",
        label: "terms_and_conditions",
        route: "/clause",
        icon: quickIconTerms,
    },
    {
        key: "event",
        label: "event",
        route: "/event",
        icon: quickIconEvent,
    },
    {
        key: "certificate",
        label: "certificate",
        route: "/cert",
        icon: quickIconCertificate,
    },
    {
        key: "withdraw",
        label: "withdrawal",
        route: "/withdraw",
        icon: quickIconWithdraw,
    },
    {
        key: "faqs",
        label: "faqs",
        route: "/faqs",
        icon: quickIconFaqs,
    },
];

const partnerTags = [
    "home_content_creation",
    "home_digital_marketing",
    "home_technical_writing",
    "home_web_dev",
    "home_seo",
];

const partnerReasons = [
    "home_service_reason_1",
    "home_service_reason_2",
    "home_service_reason_3",
    "home_service_reason_4",
];

const displayName = computed(
    () => userStore.userInfo?.username || "ShopReward",
);
const vipLabel = computed(
    () =>
        userStore.userInfo?.userLevel?.nameEn ||
        tradeInfo.value?.vipName ||
        "VIP 2",
);
const walletBalance = computed(() => Number(userStore.userInfo?.balance || 0));
const todayEarnings = computed(() =>
    Number(userStore.userInfo?.commission || 0),
);
const totalEarnings = computed(() =>
    Number(
        userStore.userInfo?.allCommission || userStore.userInfo?.balance || 0,
    ),
);
const noticeMarqueeHtml = computed(() => {
    if (!notices.value.length) return "";
    return notices.value
        .map((item) => item.noticeContent)
        .join("&nbsp;&nbsp;&nbsp;&nbsp;");
});

const recommendedTasks = computed(() => {
    if (!orderList.value.length) return [];
    return orderList.value.slice(0, 3).map((item, index) => ({
        id: item.id || item.orderNo || `order-${index}`,
        name: item.goodsName || "Task",
        price: Number(item.price || 0),
        commission: Number(item.commission || 0),
        image: item.coverUrl ? `${imageBaseUrl}${item.coverUrl}` : "",
        vip: item.status === 1 || item.status === "1",
    }));
});

function formatMoney(value) {
    return Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function goToQuick(path) {
    if (path === "/withdraw") {
        router.push({
            path: "/withdraw",
            query: { type: 1 },
        });
        return;
    }
    router.push(path);
}

async function getHomeGoods() {
    try {
        const res = await getOrderInfos({ pageNum: 1, pageSize: 3 });
        orderList.value = Array.isArray(res?.rows) ? res.rows : [];
    } catch (error) {
        orderList.value = [];
    }
}

async function getTradeInfo() {
    try {
        const res = await getTradeConfig();
        tradeInfo.value = res?.data || {};
    } catch (error) {
        tradeInfo.value = {};
    }
}

async function getHomeNotices() {
    try {
        const res = await getNoticeList({ pageNum: 1, pageSize: 10 });
        notices.value = Array.isArray(res?.rows)
            ? res.rows.filter((item) => item.noticeContent)
            : [];
    } catch (error) {
        notices.value = [];
    }
}

onMounted(async () => {
    if (userStore.token) {
        if (!userStore.userInfo?.username) {
            try {
                await userStore.getUserInfo();
            } catch (error) {
                return;
            }
        }
        await Promise.allSettled([
            getHomeGoods(),
            getTradeInfo(),
            getHomeNotices(),
        ]);
    }
});
</script>

<style scoped>
.home-page {
    background: #f5faf6;
}

.home-notice-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 9999px;
    background: linear-gradient(180deg, #eefaf1 0%, #d8f0df 100%);
    border: 1px solid #cde9d4;
}

.home-notice-dot {
    position: absolute;
    top: -2px;
    right: -1px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9999px;
    background: #ff5f61;
    color: #fff;
    font-size: 11px;
    font-weight: 800;
    line-height: 18px;
    text-align: center;
}

.home-hero-card,
.home-wallet-card,
.home-banner,
.home-task-card,
.home-partner-card,
.home-link-grid,
.home-income-strip,
.home-upgrade-card,
.home-ticker {
    border: 1px solid #d4ecd8;
    box-shadow: 0 8px 22px rgba(34, 125, 58, 0.06);
}

.home-hero-card {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    background: linear-gradient(145deg, #1a9b42 0%, #138938 100%);
    padding: 22px 18px 56px;
}

.home-hero-card::before,
.home-hero-card::after,
.home-wallet-card::before,
.home-wallet-card::after {
    content: "";
    position: absolute;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.08);
}

.home-hero-card::before {
    right: 24px;
    top: -12px;
    width: 88px;
    height: 88px;
}

.home-hero-card::after {
    right: 26px;
    bottom: -22px;
    width: 70px;
    height: 70px;
}

.home-hero-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 0;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.24);
    padding: 10px 16px;
    color: #fff;
    font-size: 14px;
    font-weight: 800;
}

.home-hero-next {
    position: absolute;
    right: 14px;
    top: 66px;
    z-index: 2;
    display: flex;
    height: 42px;
    width: 42px;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 9999px;
    background: rgba(0, 0, 0, 0.18);
}

.home-hero-rocket {
    position: absolute;
    right: 42px;
    top: 32px;
    z-index: 1;
}

.home-hero-dots {
    position: absolute;
    right: 18px;
    bottom: 18px;
    display: flex;
    gap: 6px;
}

.home-hero-dot {
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.4);
}

.home-hero-dot--active {
    width: 18px;
    background: rgba(255, 255, 255, 0.95);
}

.home-wallet-card {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    background: linear-gradient(145deg, #188f40 0%, #23b75b 100%);
    padding: 20px 20px 22px;
}

.home-wallet-card::before {
    right: -16px;
    top: 18px;
    width: 86px;
    height: 86px;
}

.home-wallet-card::after {
    left: -18px;
    bottom: -28px;
    width: 94px;
    height: 94px;
}

.home-vip-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.22);
    padding: 6px 12px;
    color: #fff3c2;
    font-size: 13px;
    font-weight: 800;
}

.home-ticker {
    display: flex;
    align-items: center;
    gap: 12px;
    overflow: hidden;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.72);
    padding: 0 13px 0 10px;
}

.home-ticker__icon {
    display: flex;
    flex: 0 0 26px;
    width: 26px;
    height: 26px;
    align-items: center;
    justify-content: center;
}

.home-ticker__icon img {
    display: block;
    height: 18px;
    width: 22px;
    object-fit: contain;
}

.home-ticker__content {
    position: relative;
    display: flex;
    height: 42px;
    align-items: center;
    min-width: 0;
    flex: 1;
    overflow: hidden;
}

.home-ticker__marquee {
    display: inline-block;
    min-width: 100%;
    white-space: nowrap;
    color: #133d21;
    font-size: 14px;
    animation: home-ticker-marquee 18s linear infinite;
}

@keyframes home-ticker-marquee {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(-100%);
    }
}

.home-link-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px 10px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.86);
    padding: 18px 14px;
}

.home-link-icon {
    display: flex;
    height: 44px;
    width: 44px;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
}

.home-link-icon img {
    display: block;
    height: 44px;
    width: 44px;
    object-fit: contain;
}

.home-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-radius: 14px;
    background: linear-gradient(145deg, #1eb14f 0%, #17a143 100%);
    padding: 16px 18px;
}

.home-banner-title-icon {
    display: inline-block;
    height: 18px;
    width: 18px;
    margin-left: 4px;
    vertical-align: -2px;
    object-fit: contain;
}

.home-banner-btn {
    border: 0;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.24);
    min-width: 62px;
    padding: 9px 14px;
    color: #fff;
    font-size: 13px;
    line-height: 1.2;
    font-weight: 800;
}

.home-income-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 14px;
    background: linear-gradient(180deg, #edf6ff 0%, #e6f2ff 100%);
    padding: 12px 14px;
}

.home-income-strip__icon,
.home-income-strip__flash {
    display: block;
    width: 16px;
    height: 16px;
    object-fit: contain;
}

.home-income-strip__flash {
    flex: 0 0 16px;
}

.home-task-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.9);
    padding: 12px;
}

.home-task-card--vip {
    border-color: #8bcf95;
}

.home-task-vip-badge {
    position: absolute;
    left: 6px;
    top: 6px;
    border-radius: 9999px;
    background: #ffcf54;
    padding: 2px 8px;
    color: #6a4200;
    font-size: 11px;
    font-weight: 900;
}

.home-task-btn {
    border: 0;
    border-radius: 12px;
    background: #1ea74c;
    padding: 12px 14px;
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    box-shadow: 0 10px 18px rgba(30, 167, 76, 0.18);
}

.home-upgrade-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-radius: 18px;
    background: linear-gradient(180deg, #fff2c7 0%, #ffebb1 100%);
    padding: 16px 16px;
}

.home-partner-card {
    overflow: hidden;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.9);
}

.home-partner-tag {
    border-radius: 20px;
    background: rgba(225, 245, 230, 1);
    padding: 6px 12px;
    color: #34a54f;
    font-size: 12px;
    font-weight: 400;
}

.home-partner-cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    background: #d8f2df;
    padding: 13px 18px;
}

.home-partner-cta__content {
    min-width: 0;
    flex: 1;
}

.home-partner-cta__title {
    color: #146432;
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: -0.2px;
    white-space: nowrap;
}

.home-partner-cta__desc {
    margin-top: 6px;
    color: #648c6e;
    font-size: 11px;
    line-height: 20px;
}

.home-call-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 85px;
    height: 50px;
    border: 0;
    border-radius: 14px;
    background: #1ea74c;
    color: #fff;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
}

.home-call-btn span {
    font-size: 11px;
}
.home-call-btn img {
    width: 13px;
    height: 13px;
    object-fit: contain;
}
</style>
