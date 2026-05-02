<template>
    <div class="home-page min-h-screen bg-white">
        <div class="mx-auto flex w-full flex-col">
            <SkyeOdellHome>
                <template #reward>
                    <HomeWalletCard
                        class="skye-slot-wallet"
                        :title="$t('home_my_wallet')"
                        :balance-label="$t('home_balance_usdt')"
                        :today-label="$t('home_today_s_earnings')"
                        :total-label="$t('home_total_earnings')"
                        :vip-label="vipLabel"
                        :balance="walletBalance"
                        :today-earnings="todayEarnings"
                        :total-earnings="totalEarnings"
                    />

                    <section class="home-ticker skye-slot-ticker">
                        <div class="home-ticker__icon">
                            <img :src="noticeVolumeIcon" alt="" />
                        </div>
                        <div class="home-ticker__content">
                            <div
                                class="home-ticker__marquee"
                                v-if="noticeMarqueeText"
                            >
                                <span class="home-ticker__marquee-text">{{
                                    noticeMarqueeText
                                }}</span>
                                <span
                                    class="home-ticker__marquee-text"
                                    aria-hidden="true"
                                    >{{ noticeMarqueeText }}</span
                                >
                            </div>
                            <div class="home-ticker__marquee" v-else></div>
                        </div>
                    </section>

                    <section class="home-link-grid skye-slot-grid">
                        <button
                            v-for="item in quickLinks"
                            :key="item.key"
                            type="button"
                            class="home-link-item"
                            @click="goToQuick(item.route)"
                        >
                            <div class="home-link-icon">
                                <img :src="item.icon" alt="" />
                            </div>
                            <span class="home-link-label">
                                {{ $t(item.label) }}
                            </span>
                        </button>
                    </section>
                </template>
            </SkyeOdellHome>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import HomeWalletCard from "@/components/home/HomeWalletCard.vue";
import SkyeOdellHome from "@/components/home/SkyeOdellHome.vue";
import {
    getNoticeList,
    getTradeConfig,
    getNoticeListByLang,
} from "../api/apis";
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from "@/store/modules/common";

const router = useRouter();
const userStore = useUserStore();

const tradeInfo = ref({});
const notices = ref([]);
const commonStore = useCommonStore();

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
const parLang = computed(() => {
    const mapped = commonStore.getValueByKey(commonStore.lang);
    return mapped ?? commonStore.lang;
});
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
const NOTICE_GAP = "      ";

function formatNoticeContent(content) {
    return String(content || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

const noticeMarqueeText = computed(() => {
    const items = notices.value
        .map((item) => formatNoticeContent(item.noticeContent))
        .filter(Boolean);
    return items.join(NOTICE_GAP);
});

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
        const res = await getNoticeListByLang({
            pageNum: 1,
            pageSize: 10,
            lang: parLang.value,
        });
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
        await Promise.allSettled([getTradeInfo(), getHomeNotices()]);
    }
});
</script>

<style scoped>
.home-page {
    background: #ffffff;
}

.skye-slot-wallet {
    margin: 0;
}

.skye-slot-ticker,
.skye-slot-grid {
    margin-top: 12px;
}

.home-ticker {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
    border: 1px solid #d4ecd8;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.72);
    padding: 0 11px 0 8px;
    box-shadow: 0 8px 22px rgba(34, 125, 58, 0.06);
}

.home-ticker__icon {
    display: flex;
    flex: 0 0 22px;
    width: 22px;
    height: 22px;
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
    height: 33px;
    align-items: center;
    min-width: 0;
    flex: 1;
    overflow: hidden;
}

.home-ticker__marquee {
    display: inline-flex;
    align-items: center;
    min-width: max-content;
    white-space: nowrap;
    gap: 40px;
    color: #133d21;
    font-size: 12px;
    animation: home-ticker-marquee 20s linear infinite;
    will-change: transform;
}

.home-ticker__marquee-text {
    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;
    white-space: nowrap;
}

@keyframes home-ticker-marquee {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(calc(-50% - 20px));
    }
}

.home-link-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px 10px;
    border: 1px solid #d4ecd8;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.86);
    padding: 18px 10px 17px;
    box-shadow: 0 8px 22px rgba(34, 125, 58, 0.06);
}

.home-link-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-width: 0;
    border: 0;
    background: transparent;
    padding: 0;
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

.home-link-label {
    color: #121f16;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.1;
    text-align: center;
}

@media (max-width: 360px) {
    .home-link-grid {
        gap: 16px 8px;
        padding-left: 8px;
        padding-right: 8px;
    }

    .home-link-label {
        font-size: 11px;
    }
}
</style>
