<template>
    <div class="home-page min-h-screen bg-white">
        <div class="mx-auto flex w-full flex-col">
            <SkyeOdellHome>
                <template #reward>
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
    { key: "event", label: "event", route: "/event", icon: quickIconEvent },
    {
        key: "withdraw",
        label: "withdrawal",
        route: "/withdraw",
        icon: quickIconWithdraw,
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
        key: "certificate",
        label: "certificate",
        route: "/cert",
        icon: quickIconCertificate,
    },
    { key: "faqs", label: "faqs", route: "/faqs", icon: quickIconFaqs },
    {
        key: "service",
        label: "service",
        route: "/customer",
        icon: quickIconService,
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
    background: #f4f7ff;
}

.home-link-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 23px 6px;
    border: 0;
    border-radius: 0;
    background: #fff;
    padding: 8px 0 3px;
    box-shadow: none;
}

.home-link-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    min-width: 0;
    border: 0;
    background: transparent;
    padding: 0;
}

.home-link-icon {
    display: flex;
    height: 54px;
    width: 54px;
    align-items: center;
    justify-content: center;
}

.home-link-icon img {
    display: block;
    height: 54px;
    width: 54px;
    object-fit: contain;
}

.home-link-label {
    color: #0f172a;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.08;
    text-align: center;
    letter-spacing: -0.02em;
}

@media (max-width: 360px) {
    .home-link-grid {
        gap: 21px 4px;
    }
    .home-link-icon {
        width: 50px;
        height: 50px;
    }
    .home-link-label {
        font-size: 13px;
    }
}
</style>
