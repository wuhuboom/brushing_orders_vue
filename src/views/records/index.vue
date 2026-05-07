<template>
    <div class="records-page min-h-[100vh] bg-[#f5faf6] text-[#111]">
        <PageTopBar :title="$t('task_center')" />

        <main class="px-[16px] pb-[88px] pt-[88px]">
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

                <section class="mt-[12px] flex gap-[8px]">
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
                        <div
                            class="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-[6px] bg-[#f2f4f2]"
                        >
                            <img
                                v-if="getCoverUrl(item.coverUrl)"
                                class="h-full w-full object-cover"
                                :src="getCoverUrl(item.coverUrl)"
                                alt=""
                            />
                            <span
                                class="status-dot"
                                :class="statusMeta(item.status).dotClass"
                            ></span>
                        </div>

                        <div class="min-w-0 flex-1 px-[12px]">
                            <div
                                class="truncate text-[14px] font-medium leading-[19px]"
                            >
                                {{ item.goodsName || "--" }}
                            </div>
                            <div
                                class="mt-[6px] text-[12px] leading-[16px] text-[#48564d]"
                            >
                                {{ $t("price") }}:${{ formatMoney(item.price) }}
                            </div>
                            <div
                                class="mt-[5px] text-[12px] leading-[16px] text-[#111]"
                            >
                                {{ $t("commission") }}:
                                <span class="font-medium text-[#159947]">
                                    +${{ formatMoney(item.commission) }}
                                </span>
                            </div>
                        </div>

                        <button
                            class="grab-btn"
                            :class="statusMeta(item.status).buttonClass"
                            :disabled="!isOrderSubmittable(item.status)"
                            type="button"
                            @click="handleOrderAction(item)"
                        >
                            {{ statusMeta(item.status).label }}
                        </button>
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
                        <span class="records-list-loading__dot"></span>
                    </div>
                </div>
            </div>
        </main>
        <TaskOrderDialog
            v-model="show"
            :title="$t('complete_the_order')"
            :step="submitStep"
            :step-labels="taskStepLabels"
            :product-name="goodsData.goodsName"
            :cover-url="getCoverUrl(goodsData.coverUrl)"
            :amount-label="$t('order_amount')"
            :amount-text="`$${formatMoney(goodsData.price)}`"
            :commission-label="$t('commission')"
            :commission-text="`+$${formatMoney(goodsData.commission)}`"
            :success-message="$t('task_completed_successfully')"
            :show-warning="showInsufficientWarning"
            :warning-text="$t('insufficient_balance_please')"
            :warning-action-text="$t('recharge')"
            :action-text="
                submitStep === 2
                    ? $t('complete_the_order')
                    : $t('continue_tasks')
            "
            :action-loading="submitStep === 2 && isSubmitting"
            :action-disabled="submitStep === 2 && isSubmitting"
            @back="show = false"
            @closed="resetSubmitDialog"
            @primary="submitStep === 2 ? submitVal() : (show = false)"
            @warning-action="goRecharge"
        >
            <template #panel="{ step }">
                <div v-if="step === 2" class="record-task-panel">
                    <div class="record-task-panel__heading">
                        {{ $t("place_order") }}
                    </div>
                    <div class="record-order-card">
                        <div class="record-order-card__label">
                            {{ $t("order_id") }}
                        </div>
                        <div class="record-order-card__id">
                            #{{ goodsData.orderNo }}
                        </div>
                    </div>
                    <div class="record-order-card__time">
                        {{ $t("creation_at_colon") }}
                        {{
                            formatWithTimezone(
                                goodsData.createTime,
                                userStore.zoneActive.tzName,
                            )
                        }}
                    </div>
                </div>
            </template>
        </TaskOrderDialog>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { showFailToast, showSuccessToast } from "@/util/message";
import { useI18n } from "vue-i18n";

import PageTopBar from "@/components/PageTopBar.vue";
import TaskOrderDialog from "@/components/TaskOrderDialog.vue";
import { getOrderInfos, submitOrder } from "@/api/apis";
import { useUserStore } from "@/store/modules/user";
import { errorMessages } from "@/api/errorCodeMap";
import { formatWithTimezone } from "@/util/utils";

const router = useRouter();
const userStore = useUserStore();
const VITE_API_IMG_URL = window.g?.VITE_API_IMG_URL || "";
const { t } = useI18n();

const active = ref(-1);
const list = ref([]);
const show = ref(false);
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
        };
    }

    if (value === "1") {
        return {
            label: t("record_status_frozen"),
            dotClass: "status-dot--frozen",
            buttonClass: "grab-btn--frozen",
        };
    }

    return {
        label: t("record_status_to_submit"),
        dotClass: "status-dot--pending",
        buttonClass: "grab-btn--pending",
    };
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
    show.value = true;
}

function isOrderSubmittable(status) {
    return String(status) === "2";
}

function handleOrderAction(item) {
    if (!isOrderSubmittable(item.status)) return;

    submit(item);
}

async function submitVal() {
    if (isSubmitting.value) return;
    showInsufficientWarning.value = false;
    isSubmitting.value = true;

    setTimeout(async () => {
        try {
            const res = await submitOrder(goodsData.value.id);
            showSuccessToast(t("mission_submitted_completed"));
            await resetAndLoad();
            if (res.code == 201) {
                goodsData.value = res.data;
            }
            submitStep.value = 3;
        } catch (err) {
            if (err.code == 916) {
                showInsufficientWarning.value = true;
            } else {
                showFailToast(t(errorMessages[err.code]));
            }
        } finally {
            isSubmitting.value = false;
        }
    }, 1000);
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
    routeScrollElement?.removeEventListener("scroll", handleRouteScroll);
    window.removeEventListener("scroll", handleRouteScroll);
});
</script>

<style scoped>
.records-page {
    font-family: "Montserrat", "Poppins", sans-serif;
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

.records-list-loading__dot {
    position: relative;
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 999px;
    background: var(--theme-primary);
}

.records-list-loading__dot::before,
.records-list-loading__dot::after {
    position: absolute;
    inset: 0;
    content: "";
    border-radius: inherit;
}

.records-list-loading__dot::before {
    background: var(--theme-loading-pulse);
    animation: records-loading-pulse 1.05s cubic-bezier(0.25, 0.1, 0.25, 1)
        infinite;
}

.records-list-loading__dot::after {
    background: var(--theme-primary);
    transform: scale(0.62);
    animation: records-loading-core 1.05s cubic-bezier(0.25, 0.1, 0.25, 1)
        infinite;
}

@keyframes records-loading-pulse {
    0% {
        transform: scale(0.55);
        opacity: 0.95;
    }
    38% {
        transform: scale(2.35);
        opacity: 0.72;
    }
    72% {
        transform: scale(2.95);
        opacity: 0.12;
    }
    100% {
        transform: scale(0.55);
        opacity: 0.95;
    }
}

@keyframes records-loading-core {
    0%,
    100% {
        transform: scale(0.58);
        opacity: 0.98;
    }
    45% {
        transform: scale(0.42);
        opacity: 0.78;
    }
    70% {
        transform: scale(0.1);
        opacity: 0.35;
    }
}

.record-tab {
    height: 32px;
    min-width: 60px;
    border: 1px solid #d9eadf;
    border-radius: 999px;
    background: #fff;
    color: #6b806f;
    font-size: 12px;
    font-weight: 500;
}

.record-tab--active {
    border-color: var(--theme-green-defalut);
    background: var(--theme-green-defalut);
    color: #fff;
}

.task-card {
    position: relative;
    display: flex;
    min-height: 95px;
    align-items: center;
    border: 1px solid #d9eadf;
    border-radius: 12px;
    background: #fff;
    padding: 11px 12px;
    box-shadow: 0 8px 20px rgba(19, 93, 43, 0.05);
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
    height: 34px;
    min-width: 88px;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
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
</style>
