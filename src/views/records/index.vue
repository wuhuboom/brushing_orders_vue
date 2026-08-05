<template>
    <div class="records-page min-h-[100vh] bg-[#eef2f8] text-[#111]">
        <MainTabTopBar :title="$t('orders')" />

        <main class="records-main px-[16px] pb-[88px] pt-[114px]">
            <div
                ref="refreshZoneRef"
                class="records-refresh-zone"
                @touchstart="onTouchStart"
                @touchmove="onTouchMove"
                @touchend="onTouchEnd"
                @touchcancel="onTouchEnd"
            >
                <div
                    v-if="pullDistance > 0 || refreshing"
                    class="records-refresh-tip"
                    :style="{ height: `${refreshing ? 36 : pullDistance}px` }"
                >
                    {{
                        refreshing
                            ? $t("ui_refreshing")
                            : $t("ui_pull_to_refresh")
                    }}
                </div>
                <section
                    class="task-summary flex h-[39px] items-center justify-between rounded-[7px] border border-[#c5e7ce] bg-[#eaf8ee] px-[14px] text-[12px]"
                >
                    <div class="text-[#153f20]">
                        {{ $t("today_tasks") }}:
                        <span class="text-[#159947]">{{ completedCount }}</span>
                        /
                        <span class="text-[#159947]">{{ dailyLimit }}</span>
                        {{ $t("completed") }}
                    </div>
                    <!-- <div class="text-[10px] text-[#d78b00]">
                        {{ $t("resets_in") }} {{ resetTime }}
                    </div> -->
                </section>

                <section class="records-tabs mt-[10px] flex gap-[8px]">
                    <button
                        v-for="tab in tabs"
                        :key="tab.value"
                        type="button"
                        class="record-tab px-[10px]"
                        :class="{ 'record-tab--active': active === tab.value }"
                        @click="swichTab(tab.value)"
                    >
                        {{ tab.label }}
                    </button>
                </section>
            </div>

            <div class="records-touch-area mt-[12px]">
                <div class="records-list space-y-[12px]">
                    <article
                        v-for="item in list"
                        :key="item.id || item.orderNo"
                        class="task-card"
                    >
                        <div class="task-card__head">
                            <div class="task-card__time">
                                {{
                                    formatWithTimezone(
                                        item.createTime,
                                        userStore.zoneActive.tzName,
                                    )
                                }}
                            </div>
                            <div
                                class="task-card__status"
                                :class="statusMeta(item.status).pillClass"
                            >
                                {{ statusMeta(item.status).label }}
                            </div>
                        </div>

                        <div class="task-card__body">
                            <div
                                class="task-card__cover relative overflow-hidden rounded-[6px] bg-[#f2f4f2]"
                            >
                                <img
                                    v-if="getCoverUrl(item.coverUrl)"
                                    class="h-full w-full object-cover"
                                    :src="getCoverUrl(item.coverUrl)"
                                    alt=""
                                />
                            </div>

                            <div class="min-w-0 flex-1">
                                <div
                                    class="truncate text-[14px] font-medium leading-[19px]"
                                >
                                    {{ item.goodsName || "--" }}
                                </div>
                                <div class="task-card__subtitle">
                                    {{
                                        item.goodsDesc || item.goodsName || "--"
                                    }}
                                </div>
                                <div class="task-card__price">
                                    USD {{ formatMoney(item.price) }}
                                </div>
                            </div>
                        </div>

                        <div class="task-card__foot">
                            <div class="task-card__metrics">
                                <div class="task-card__metric">
                                    <div class="task-card__metric-label">
                                        {{ $t("order_amount") }}
                                    </div>
                                    <div class="task-card__metric-value">
                                        USD {{ formatMoney(orderAmount(item)) }}
                                    </div>
                                </div>
                                <div class="task-card__metric">
                                    <div class="task-card__metric-label">
                                        {{ $t("commission") }}
                                    </div>
                                    <div class="task-card__metric-value">
                                        USD {{ formatMoney(item.commission) }}
                                    </div>
                                </div>
                            </div>

                            <button
                                v-if="isOrderSubmittable(item.status)"
                                class="grab-btn"
                                :class="statusMeta(item.status).buttonClass"
                                type="button"
                                @click="handleOrderAction(item)"
                            >
                                {{ statusMeta(item.status).actionText }}
                            </button>
                        </div>
                    </article>

                    <div
                        v-if="!list.length && finished"
                        class="rounded-[12px] border border-[#cfe9d5] bg-white px-[16px] py-[28px] text-center text-[13px] text-[#6b8b73]"
                    >
                        {{ $t("no_more") }}
                    </div>

                    <div
                        v-if="list.length && finished && !loading"
                        class="py-[16px] text-center text-[13px] text-[#8b9b8e]"
                    >
                        {{ $t("no_more") }}
                    </div>

                    <div
                        v-if="loading"
                        class="records-list-loading"
                        :class="{
                            'records-list-loading--full': !list.length,
                            'records-list-loading--inline': list.length,
                        }"
                    >
                        <div class="records-list-loading__wave" aria-hidden="true">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <MissionGifLoadingScreen
            :visible="isMissionOpening || isMissionSubmitLoading"
        />
        <MissionSubmissionPopup
            v-model="show"
            :product-name="
                goodsData.goodsName || 'NIKE Dunk Low Retro Men\'s Shoe'
            "
            :cover-url="getCoverUrl(goodsData.coverUrl)"
            :score-text="goodsData.score || goodsData.rate || '4.9'"
            :review-text="recordReviewText"
            :price-text="formatMoney(goodsData.price)"
            :total-amount-text="formatMoney(orderAmount(goodsData))"
            :commission-text="formatMoney(goodsData.commission)"
            :create-time-text="recordCreateTimeText"
            :order-no-text="goodsData.orderNo || '--'"
            :submitting="isSubmitting"
            @back="show = false"
            @submit="submitVal"
        />
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { showFailToast, showSuccessToast } from "@/util/message";
import { useI18n } from "vue-i18n";

import MainTabTopBar from "@/components/MainTabTopBar.vue";
import MissionSubmissionPopup from "@/components/MissionSubmissionPopup.vue";
import MissionGifLoadingScreen from "@/components/MissionGifLoadingScreen.vue";
import { getOrderInfos, submitOrder } from "@/api/apis";
import { useUserStore } from "@/store/modules/user";
import { errorMessages } from "@/api/errorCodeMap";
import { formatWithTimezone } from "@/util/utils";

const router = useRouter();
const userStore = useUserStore();
const VITE_API_IMG_URL = window.g?.VITE_API_IMG_URL || "";
const { t } = useI18n();

const missionOpenLoadingSeconds = Number(
    import.meta.env.PROD
        ? window.g?.VITE_MISSION_OPEN_LOADING_SECONDS
        : import.meta.env.VITE_MISSION_OPEN_LOADING_SECONDS,
);
const missionOpenLoadingDuration =
    Number.isFinite(missionOpenLoadingSeconds) &&
    missionOpenLoadingSeconds >= 0
        ? missionOpenLoadingSeconds * 1000
        : 3000;
const missionSubmitLoadingSeconds = Number(
    import.meta.env.PROD
        ? window.g?.VITE_MISSION_SUBMIT_LOADING_SECONDS
        : import.meta.env.VITE_MISSION_SUBMIT_LOADING_SECONDS,
);
const missionSubmitLoadingDuration =
    Number.isFinite(missionSubmitLoadingSeconds) &&
    missionSubmitLoadingSeconds >= 0
        ? missionSubmitLoadingSeconds * 1000
        : 3000;
const missionOpenGifLoadingEnabled = !["false", "0", "off", "no"].includes(
    String(
        import.meta.env.PROD
            ? window.g?.VITE_MISSION_OPEN_GIF_LOADING_ENABLED ?? "true"
            : import.meta.env.VITE_MISSION_OPEN_GIF_LOADING_ENABLED ?? "true",
    ).toLowerCase(),
);
const missionSubmitGifLoadingEnabled = ![
    "false",
    "0",
    "off",
    "no",
].includes(
    String(
        import.meta.env.PROD
            ? window.g?.VITE_MISSION_SUBMIT_GIF_LOADING_ENABLED ?? "true"
            : import.meta.env.VITE_MISSION_SUBMIT_GIF_LOADING_ENABLED ?? "true",
    ).toLowerCase(),
);

const active = ref(-1);
const list = ref([]);
const show = ref(false);
const isMissionOpening = ref(false);
const isMissionSubmitLoading = ref(false);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const pullDistance = ref(0);
const goodsData = ref({});
const isSubmitting = ref(false);
const resetTime = ref("14:23:08");
const submitStep = ref(2);
const showInsufficientWarning = ref(false);
const pullThreshold = 62;
const refreshZoneRef = ref(null);
let touchStartY = 0;
let pullRefreshReady = false;
let routeScrollElement = null;
let listLoadToken = 0;
let missionOpeningTimer = null;
let missionSubmitLoadingTimer = null;

const query = reactive({
    pageNum: 1,
    pageSize: 10,
    status: "",
});

const tabs = computed(() => [
    { label: t("all"), value: -1 },
    { label: t("pending"), value: 2 },
    { label: t("completed"), value: 0 },
]);

const taskStepLabels = computed(() => [
    t("accept_task"),
    t("place_order"),
    t("submit_proof"),
]);

const recordReviewText = computed(() => {
    const count =
        goodsData.value?.reviewCount ??
        goodsData.value?.commentCount ??
        goodsData.value?.saleCount ??
        123;
    return `${count} ${t("reviews")}`;
});

const recordCreateTimeText = computed(() => {
    if (!goodsData.value?.createTime) return "2025-06-15 19:38:44";
    return formatWithTimezone(
        goodsData.value.createTime,
        userStore.zoneActive.tzName,
    );
});

const completedCount = computed(() =>
    Number(userStore.userInfo?.dealCount || 0),
);

const dailyLimit = computed(
    () => userStore.userInfo?.userLevel?.orderCount || 20,
);

function getCoverUrl(url) {
    if (!url) return "";
    if (/^https?:\/\//.test(url)) return url;
    return `${VITE_API_IMG_URL}${url}`;
}

function formatMoney(value) {
    return Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function statusMeta(status) {
    const value = String(status);

    if (value === "0") {
        return {
            label: t("record_status_completed"),
            dotClass: "status-dot--done",
            buttonClass: "grab-btn--completed",
            pillClass: "task-card__status--completed",
            actionText: t("record_status_completed"),
        };
    }

    if (value === "1") {
        return {
            label: t("record_status_frozen"),
            dotClass: "status-dot--frozen",
            buttonClass: "grab-btn--frozen",
            pillClass: "task-card__status--frozen",
            actionText: t("record_status_frozen"),
        };
    }

    return {
        label: t("pending"),
        dotClass: "status-dot--pending",
        buttonClass: "grab-btn--pending",
        pillClass: "task-card__status--pending",
        actionText: t("record_status_to_submit"),
    };
}

function orderAmount(item) {
    return item?.orderAmount ?? item?.amount ?? item?.price ?? 0;
}

async function resetAndLoad() {
    const token = ++listLoadToken;
    finished.value = false;
    loading.value = true;
    query.pageNum = 1;
    list.value = [];
    try {
        await userStore.getUserInfo({ force: true });
        if (token !== listLoadToken) return;
        await loadData({ force: true, token });
    } catch (error) {
        if (token === listLoadToken) {
            finished.value = true;
        }
    } finally {
        if (token === listLoadToken) {
            loading.value = false;
        }
    }
}

async function onRefresh() {
    if (refreshing.value) return;
    refreshing.value = true;
    await resetAndLoad();
    refreshing.value = false;
    pullDistance.value = 0;
}

async function loadData(options = {}) {
    const { force = false, token = listLoadToken } = options;
    if ((!force && loading.value) || finished.value) return;

    loading.value = true;
    try {
        const res = await getOrderInfos({ ...query });
        if (token !== listLoadToken) return;
        const data = Array.isArray(res?.rows) ? res.rows : [];
        list.value.push(...data);
        finished.value = data.length < query.pageSize;
        if (!finished.value) query.pageNum += 1;
    } catch (error) {
        if (token === listLoadToken) {
            finished.value = true;
        }
    } finally {
        if (token === listLoadToken) {
            loading.value = false;
        }
    }
}

function maybeLoadNextPage() {
    if (loading.value || finished.value) return;
    const scrollElement =
        routeScrollElement || document.getElementById("router-view");
    const scrollTop =
        scrollElement?.scrollTop ??
        window.pageYOffset ??
        document.documentElement.scrollTop ??
        0;
    const viewportHeight =
        scrollElement?.clientHeight || window.innerHeight || 0;
    const pageHeight =
        scrollElement?.scrollHeight ||
        document.documentElement.scrollHeight ||
        0;

    if (scrollTop + viewportHeight >= pageHeight - 120) {
        loadData();
    }
}

function handleRouteScroll() {
    if (!isAtPullRefreshTop()) {
        pullRefreshReady = false;
        pullDistance.value = 0;
    }
    maybeLoadNextPage();
}

function isAtPullRefreshTop() {
    const zone = refreshZoneRef.value;
    if (!zone) return false;
    const rect = zone.getBoundingClientRect();
    const frameRect = document
        .querySelector(".app-frame")
        ?.getBoundingClientRect();
    const frameTop = frameRect?.top || 0;
    return rect.top >= frameTop + 70 && rect.top <= frameTop + 92;
}

function onTouchStart(event) {
    pullDistance.value = 0;
    pullRefreshReady = isAtPullRefreshTop();
    touchStartY = event.touches?.[0]?.clientY || 0;
}

function onTouchMove(event) {
    if (!pullRefreshReady || refreshing.value) return;
    const currentY = event.touches?.[0]?.clientY || 0;
    const delta = currentY - touchStartY;
    if (delta <= 0 || !isAtPullRefreshTop()) {
        pullRefreshReady = false;
        pullDistance.value = 0;
        return;
    }
    pullDistance.value = Math.min(delta * 0.45, 76);
}

function onTouchEnd() {
    if (!pullRefreshReady) {
        pullDistance.value = 0;
        return;
    }
    pullRefreshReady = false;
    if (pullDistance.value >= pullThreshold) {
        onRefresh();
        return;
    }
    pullDistance.value = 0;
}

function submit(item) {
    goodsData.value = item;
    submitStep.value = 2;
    showInsufficientWarning.value = false;
    if (!missionOpenGifLoadingEnabled) {
        show.value = true;
        return;
    }
    isMissionOpening.value = true;
    missionOpeningTimer = setTimeout(() => {
        isMissionOpening.value = false;
        show.value = true;
        missionOpeningTimer = null;
    }, missionOpenLoadingDuration);
}

function isOrderSubmittable(status) {
    return String(status) === "2";
}

function handleOrderAction(item) {
    if (!isOrderSubmittable(item.status)) return;

    submit(item);
}

async function executeSubmit() {
    showInsufficientWarning.value = false;
    try {
        const res = await submitOrder(goodsData.value.id);
        showSuccessToast(t("mission_submitted_completed"));
        await resetAndLoad();
        if (res.code == 201) {
            goodsData.value = res.data;
        }
        show.value = false;
    } catch (err) {
        if (err.code == 916) {
            showInsufficientWarning.value = true;
        } else {
            showFailToast(t(errorMessages[err.code]));
        }
    } finally {
        isSubmitting.value = false;
    }
}

async function submitVal() {
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    if (!missionSubmitGifLoadingEnabled) {
        executeSubmit();
        return;
    }

    isMissionSubmitLoading.value = true;
    missionSubmitLoadingTimer = setTimeout(() => {
        isMissionSubmitLoading.value = false;
        missionSubmitLoadingTimer = null;
        executeSubmit();
    }, missionSubmitLoadingDuration);
}

function resetSubmitDialog() {
    submitStep.value = 2;
    showInsufficientWarning.value = false;
}

function goRecharge() {
    router.push("/deposit");
}

function swichTab(index) {
    if (active.value === index) return;
    active.value = index;
    query.status = index === -1 ? "" : index;
    resetAndLoad();
}

onMounted(() => {
    resetAndLoad();
    routeScrollElement = document.getElementById("router-view");
    routeScrollElement?.addEventListener("scroll", handleRouteScroll, {
        passive: true,
    });
    window.addEventListener("scroll", handleRouteScroll, { passive: true });
});

onUnmounted(() => {
    if (missionOpeningTimer) clearTimeout(missionOpeningTimer);
    if (missionSubmitLoadingTimer) clearTimeout(missionSubmitLoadingTimer);
    routeScrollElement?.removeEventListener("scroll", handleRouteScroll);
    window.removeEventListener("scroll", handleRouteScroll);
});
</script>

<style scoped>
.task-card__head,
.task-card__body,
.task-card__foot,
.task-card__metrics {
    display: flex;
}

.task-card__head,
.task-card__foot {
    align-items: center;
    justify-content: space-between;
}

.task-card__body {
    margin-top: 20px;
    gap: 12px;
}

.task-card__foot {
    margin-top: 28px;
    gap: 12px;
}

.task-card__cover {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    border-radius: 12px;
}

.task-card__time {
    color: #69758a;
    font-size: 15px;
    line-height: 22px;
}

.task-card__status {
    min-width: 102px;
    height: 24px;
    padding: 0 14px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
}

.task-card__status--pending,
.task-card__status--frozen {
    background: #ff4947;
}

.task-card__status--completed {
    background: #3d4ce4;
}

.task-card__subtitle {
    margin-top: 8px;
    color: #717b8f;
    font-size: 14px;
    line-height: 20px;
}

.task-card__price {
    margin-top: 10px;
    color: #3552ea;
    font-size: 18px;
    line-height: 24px;
    font-weight: 700;
}

.task-card__metrics {
    gap: 22px;
    min-width: 0;
}

.task-card__metric-label {
    color: #69758a;
    font-size: 14px;
    line-height: 18px;
    white-space: nowrap;
}

.task-card__metric-value {
    margin-top: 8px;
    color: #000;
    font-size: 15px;
    line-height: 20px;
    font-weight: 500;
    white-space: nowrap;
}
@media (max-width: 767px) {
    .records-main {
        width: 100% !important;
        max-width: none !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
}

@media (min-width: 768px) {
    .records-main {
        max-width: var(--app-pc-max-width, 375px);
        margin: 0 auto;
    }
}
</style>

<style scoped>
.records-page {
    font-family: "Montserrat", "Poppins", sans-serif;
}

.records-page :deep(.page-top-bar) {
    height: 104px;
    padding-top: 0;
    background: #151515;
}

.records-page :deep(.page-top-bar::before) {
    background: #151515 url("@/static/images/auth/algofy-register-hero.png")
        center top / cover no-repeat;
    opacity: 1;
}

.records-page :deep(.page-top-bar__title) {
    align-items: flex-end;
    padding-top: 0;
    padding-bottom: 20px;
    font-size: 16px;
    line-height: 20px;
    font-weight: 800;
    letter-spacing: 0.03em;
}

.records-page :deep(.page-top-bar__side) {
    align-items: flex-start;
    padding-top: 34px;
}

.records-main {
    max-width: none;
    margin: 0;
}

.records-refresh-zone,
.records-touch-area {
    position: relative;
}

.records-refresh-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: #6b8b73;
    font-size: 12px;
    transition: height 0.16s ease;
}

.records-list-loading {
    display: flex;
    align-items: center;
    justify-content: center;
}

.records-list-loading--full {
    width: 100%;
    min-height: calc(100vh - 180px);
    min-height: calc(100dvh - 180px);
    background: #fff;
}

.records-list-loading--inline {
    min-height: 72px;
}

.records-list-loading__wave {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 4px;
    width: 68px;
    height: 44px;
    padding-bottom: 6px;
}

.records-list-loading__wave::before {
    content: "";
    position: absolute;
    left: 8px;
    right: 8px;
    bottom: 4px;
    height: 8px;
    border-radius: 999px;
    background: linear-gradient(
        90deg,
        rgba(138, 243, 255, 0.06) 0%,
        rgba(75, 151, 255, 0.18) 50%,
        rgba(53, 67, 236, 0.06) 100%
    );
}

.records-list-loading__wave span {
    position: relative;
    z-index: 1;
    display: block;
    width: 4px;
    height: 16px;
    border-radius: 999px;
    background: linear-gradient(180deg, #8af3ff 0%, #4b97ff 34%, #2f7bff 68%, #3543ec 100%);
    box-shadow: 0 5px 12px rgba(47, 123, 255, 0.22);
    transform-origin: center bottom;
    animation: records-loading-wave 1s ease-in-out infinite;
}

.records-list-loading__wave span:nth-child(1) {
    height: 12px;
    animation-delay: -0.36s;
}

.records-list-loading__wave span:nth-child(2) {
    height: 18px;
    animation-delay: -0.24s;
}

.records-list-loading__wave span:nth-child(3) {
    height: 26px;
    animation-delay: -0.12s;
}

.records-list-loading__wave span:nth-child(4) {
    width: 5px;
    height: 34px;
    animation-delay: 0s;
}

.records-list-loading__wave span:nth-child(5) {
    height: 26px;
    animation-delay: 0.12s;
}

.records-list-loading__wave span:nth-child(6) {
    height: 18px;
    animation-delay: 0.24s;
}

.records-list-loading__wave span:nth-child(7) {
    height: 12px;
    animation-delay: 0.36s;
}

@keyframes records-loading-wave {
    0%,
    100% {
        transform: scaleY(0.58);
        opacity: 0.5;
    }
    50% {
        transform: scaleY(1.16);
        opacity: 1;
    }
}

.record-tab {
    height: 36px;
    flex: 1;
    min-width: 0;
    border: 0;
    border-radius: 10px;
    background: #fff;
    color: #69758a;
    font-size: 15px;
    font-weight: 700;
    box-shadow: none;
}

.record-tab--active {
    background: #2f63e8;
    color: #fff;
}

.task-card {
    position: relative;
    display: block;
    min-height: 218px;
    border: 0;
    border-radius: 14px;
    background: #fff;
    padding: 20px 17px 18px;
    box-shadow: 0 2px 6px rgba(20, 30, 50, 0.04);
}

.status-dot {
    position: absolute;
    left: -6px;
    top: -6px;
    display: block;
    height: 18px;
    width: 18px;
    border-radius: 999px;
}

.status-dot::after {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 6px;
    width: 6px;
    content: "";
    transform: translate(-50%, -50%);
    border-radius: 999px;
    background: #fff;
}

.status-dot--done {
    background: var(--records-status-completed-dot);
}

.status-dot--pending {
    background: var(--records-status-pending-dot);
}

.status-dot--frozen {
    background: var(--records-status-frozen-dot);
}

.grab-btn {
    display: flex;
    height: 36px;
    /*min-width: 133px;*/
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    white-space: nowrap;
}

.grab-btn:disabled {
    cursor: default;
    pointer-events: none;
    opacity: 1;
}

.grab-btn--pending {
    background: var(--records-status-pending-bg);
    box-shadow: 0 8px 16px var(--records-status-pending-shadow);
}

.grab-btn--completed {
    background: var(--records-status-completed-bg);
    box-shadow: 0 8px 16px var(--records-status-completed-shadow);
}

.grab-btn--frozen {
    background: var(--records-status-frozen-bg);
    box-shadow: 0 8px 16px var(--records-status-frozen-shadow);
}

.record-task-dialog {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
    box-sizing: border-box;
    background: #f4faf5;
    padding-bottom: 24px;
}

.record-task-dialog__header {
    position: sticky;
    top: 0;
    z-index: 5;
    display: flex;
    min-height: 76px;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #dcecdf;
    background: #fff;
    padding: 18px 18px 14px;
}

.record-task-dialog__back {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
}

.record-task-dialog__title {
    color: #1c261d;
    font-size: 18px;
    font-weight: 600;
}

.record-stepper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background: #fff;
    padding: 22px 16px 20px;
}

.record-step {
    display: flex;
    width: 86px;
    flex-direction: column;
    align-items: center;
}

.record-step__circle {
    display: flex;
    width: 38px;
    height: 38px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #dcebe0;
    color: #8caa94;
    font-size: 13px;
    font-weight: 600;
}

.record-step__label {
    margin-top: 10px;
    color: #88a089;
    font-size: 13px;
    line-height: 1.2;
    text-align: center;
}

.record-step--active .record-step__circle,
.record-step--done .record-step__circle {
    background: var(--theme-primary);
    color: #fff;
}

.record-step--active .record-step__label,
.record-step--done .record-step__label {
    color: #1f9c47;
}

.record-stepper__line {
    flex: 1;
    min-width: 34px;
    max-width: 78px;
    height: 3px;
    margin-top: 18px;
    border-radius: 999px;
    background: #dcebe0;
}

.record-stepper__line--done {
    background: #9cd3ac;
}

.record-product-card,
.record-task-panel,
.record-task-warning,
.record-task-success {
    margin: 16px 16px 0;
}

.record-product-card {
    display: flex;
    gap: 14px;
    border-radius: 18px;
    background: #fff;
    padding: 16px;
    box-shadow: 0 8px 20px rgba(38, 126, 61, 0.08);
}

.record-product-card__thumb {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 12px;
    background: #f1f4f1;
}

.record-product-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.record-product-card__content {
    min-width: 0;
    flex: 1;
    padding-top: 4px;
}

.record-product-card__name {
    color: #172217;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.35;
}

.record-product-card__meta {
    margin-top: 10px;
    color: #668368;
    font-size: 12px;
    line-height: 1.2;
}

.record-product-card__meta span {
    color: #2a3c2d;
}

.record-product-card__meta--accent {
    font-size: 13px;
}

.record-product-card__meta--accent,
.record-product-card__meta--accent span {
    color: #18a647;
}

.record-task-panel {
    border-radius: 18px;
    background: #fff;
    padding: 20px 18px;
    box-shadow: 0 8px 20px rgba(38, 126, 61, 0.08);
}

.record-task-panel__heading {
    color: #1c261d;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
}

.record-order-card {
    margin-top: 18px;
    border: 1px solid #b8debf;
    border-radius: 16px;
    background: #f3fbf5;
    padding: 18px;
    text-align: center;
}

.record-order-card__label {
    color: #495e4b;
    font-size: 16px;
}

.record-order-card__id {
    margin-top: 12px;
    color: #17a445;
    font-size: 17px;
    font-weight: 600;
    word-break: break-all;
}

.record-order-card__time {
    margin-top: 22px;
    color: #6a7e6b;
    font-size: 14px;
    line-height: 1.5;
    text-align: center;
}

.record-task-warning {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid #efb7b3;
    border-radius: 14px;
    background: #fff4f3;
    padding: 14px 16px;
    color: #d23f36;
    font-size: 14px;
    line-height: 1.3;
}

.record-task-warning__link {
    border: 0;
    background: transparent;
    padding: 0;
    color: #24a44b;
    font-weight: 600;
}

.record-task-success {
    display: flex;
    min-height: 280px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 16px 10px;
}

.record-task-success__icon {
    display: flex;
    width: 112px;
    height: 112px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.record-task-success__text {
    margin-top: 14px;
    color: #199f45;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
}

.record-task-dialog__footer {
    padding: 20px 16px 28px;
}

.record-task-action {
    width: 100%;
    height: 62px;
    border: 0;
    border-radius: 16px;
    background: var(--theme-button-gradient-vertical);
    box-shadow: 0 12px 24px var(--theme-button-shadow);
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.record-task-action:disabled {
    opacity: 0.7;
}

.record-task-action--loading {
    pointer-events: none;
}

.record-task-action__spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.45);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: record-action-spin 0.75s linear infinite;
}

@keyframes record-action-spin {
    to {
        transform: rotate(360deg);
    }
}

.record-task-action--small {
    display: block;
    width: 246px;
    max-width: 100%;
    margin: 0 auto;
}

:deep(.van-dialog__content) {
    height: 100%;
    overflow: hidden;
}

:deep(.van-dialog) {
    left: 50% !important;
    top: 0 !important;
    width: min(100vw, var(--app-pc-max-width, 375px)) !important;
    max-width: min(100vw, var(--app-pc-max-width, 375px)) !important;
    height: 100vh !important;
    height: 100dvh !important;
    margin: 0 !important;
    border-radius: 0 !important;
    transform: translate3d(-50%, 0, 0) !important;
}

@media (min-width: 768px) {
    :global(.record-order-dialog-overlay) {
        left: 50% !important;
        width: var(--app-pc-max-width, 375px) !important;
        transform: translateX(-50%) !important;
    }

    :global(.record-order-dialog) {
        left: 50% !important;
        width: var(--app-pc-max-width, 375px) !important;
        max-width: var(--app-pc-max-width, 375px) !important;
        transform: translate3d(-50%, 0, 0) !important;
    }
}

:global(.van-dialog.task-order-dialog-panel--mobile) {
    left: 0 !important;
    right: 0 !important;
    top: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    min-width: 100vw !important;
    height: 100vh !important;
    height: 100dvh !important;
    transform: none !important;
}

:global(.van-overlay.task-order-dialog-overlay--mobile) {
    left: 0 !important;
    right: 0 !important;
    top: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    height: 100dvh !important;
    transform: none !important;
}

@media (max-width: 360px) {
    .record-step {
        width: 78px;
    }

    .record-product-card__thumb {
        width: 82px;
        height: 82px;
    }
}

/* ALGOFY orders design restoration */
.records-page {
    min-height: 100vh !important;
    background: #eef2f8 !important;
    color: #111111 !important;
}

.records-page :deep(.page-top-bar) {
    height: 104px !important;
    padding-top: 0 !important;
    grid-template-columns: 72px minmax(0, 1fr) 72px !important;
    background: #171717 !important;
}

.records-page :deep(.page-top-bar::before) {
    background:
        linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 0%,
            rgba(18, 18, 18, 0.12) 100%
        ),
        #171717 url("@/static/images/auth/algofy-register-hero.png") center
            top / cover no-repeat !important;
    opacity: 1 !important;
}

.records-page :deep(.page-top-bar__title) {
    align-items: flex-end !important;
    padding-bottom: 19px !important;
    color: #ffffff !important;
    font-size: 15px !important;
    line-height: 20px !important;
    font-weight: 800 !important;
    letter-spacing: 0.055em !important;
}

.records-page main {
    padding: var(--main-tab-top-bar-height, 104px) 16px 96px !important;
}

.records-refresh-zone {
    padding-top: 0 !important;
}

.records-refresh-tip {
    color: #7a8495 !important;
}

.task-summary {
    display: none !important;
}

.records-page section.mt-\[12px\] {
    margin-top: 0 !important;
    gap: 8px !important;
}

.record-tab {
    flex: 1 1 0 !important;
    height: 36px !important;
    min-width: 0 !important;
    border: 0 !important;
    border-radius: 8px !important;
    background: #ffffff !important;
    color: #69758a !important;
    font-size: 14px !important;
    line-height: 18px !important;
    font-weight: 700 !important;
    box-shadow: none !important;
}

.record-tab--active {
    background: #2f62e9 !important;
    color: #ffffff !important;
}

.records-touch-area {
    margin-top: 12px !important;
}

.records-list {
    display: flex !important;
    flex-direction: column !important;
    gap: 16px !important;
}

.records-list.space-y-\[12px\] > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0 !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}

.task-card {
    display: block !important;
    width: 100% !important;
    min-height: 0 !important;
    padding: 18px 17px 18px !important;
    border: 0 !important;
    border-radius: 12px !important;
    background: #ffffff !important;
    box-shadow: 0 2px 7px rgba(29, 42, 70, 0.06) !important;
}

.task-card__head {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
}

.task-card__time {
    color: #69758a !important;
    font-size: 15px !important;
    line-height: 20px !important;
    font-weight: 500 !important;
}

.task-card__status {
    min-width: 92px !important;
    height: 24px !important;
    padding: 0 15px !important;
    border-radius: 999px !important;
    color: #ffffff !important;
    font-size: 15px !important;
    line-height: 20px !important;
    font-weight: 500 !important;
}

.task-card__status--pending,
.task-card__status--frozen {
    background: #f34848 !important;
}

.task-card__status--completed {
    background: #3345e5 !important;
}

.task-card__body {
    display: flex !important;
    align-items: flex-start !important;
    gap: 12px !important;
    margin-top: 22px !important;
}

.task-card__cover {
    width: 80px !important;
    height: 80px !important;
    flex: 0 0 80px !important;
    border-radius: 8px !important;
    background: #f2f4f7 !important;
}

.task-card__cover img {
    object-fit: cover !important;
}

.task-card__body .min-w-0 {
    padding-top: 0 !important;
}

.task-card__body .truncate {
    max-width: 100% !important;
    color: #050505 !important;
    font-size: 15px !important;
    line-height: 20px !important;
    font-weight: 500 !important;
    letter-spacing: 0.01em !important;
}

.task-card__subtitle {
    margin-top: 7px !important;
    color: #717b8e !important;
    font-size: 13px !important;
    line-height: 17px !important;
    font-weight: 500 !important;
}

.task-card__price {
    margin-top: 9px !important;
    color: #2f62e9 !important;
    font-size: 15px !important;
    line-height: 20px !important;
    font-weight: 800 !important;
}

.task-card__foot {
    display: flex !important;
    align-items: flex-end !important;
    justify-content: space-between !important;
    gap: 10px !important;
    margin-top: 26px !important;
}

.task-card__metrics {
    display: flex !important;
    min-width: 0 !important;
    flex: 1 1 auto !important;
    gap: 28px !important;
}

.task-card__metric {
    min-width: 0 !important;
}

.task-card__metric-label {
    color: #717b8e !important;
    font-size: 13px !important;
    line-height: 17px !important;
    font-weight: 500 !important;
    white-space: nowrap !important;
}

.task-card__metric-value {
    margin-top: 8px !important;
    color: #050505 !important;
    font-size: 15px !important;
    line-height: 20px !important;
    font-weight: 500 !important;
    white-space: nowrap !important;
}

.grab-btn {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex: 0 0 auto !important;
    /*width: 133px !important;
    min-width: 133px !important;*/
    height: 36px !important;
    border: 0 !important;
    border-radius: 8px !important;
    color: #ffffff !important;
    font-size: 15px !important;
    line-height: 20px !important;
    font-weight: 500 !important;
    box-shadow: none !important;
}

.grab-btn--pending {
    background: #2f62e9 !important;
}

.grab-btn--completed {
    background: #3345e5 !important;
}

.grab-btn--frozen {
    background: #f34848 !important;
}

@media (min-width: 420px) {
    .records-page :deep(.page-top-bar::before) {
        background:
            linear-gradient(
                180deg,
                rgba(0, 0, 0, 0) 0%,
                rgba(18, 18, 18, 0.12) 100%
            ),
            #171717 url("@/static/images/auth/algofy-register-hero.png") center
                top / cover no-repeat !important;
    }
}
@media (max-width: 767px) {
    .records-main {
        width: 100% !important;
        max-width: none !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
}


/* records pc width final override */
@media (min-width: 768px) {
    .records-main {
        max-width: var(--app-pc-max-width, 375px);
        margin: 0 auto;
    }
}
</style>
