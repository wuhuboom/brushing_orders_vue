<template>
    <div class="withdraw-history-page min-h-screen bg-[#F5F8F7]">
        <PageTopBar
            :title="$t('withdraw_history')"
            show-back
            @click-left="onClickLeft"
        />

        <div class="tab-bar-wrap">
            <div class="tab-bar">
                <div
                    class="history-tab"
                    :class="{ active: orderActive === 0 }"
                    @click="changeOrder(0)"
                >
                    {{ $t("reviewing") }}
                </div>
                <div
                    class="history-tab"
                    :class="{ active: orderActive === 1 }"
                    @click="changeOrder(1)"
                >
                    {{ $t("success") }}
                </div>
                <div
                    class="history-tab"
                    :class="{ active: orderActive === 2 }"
                    @click="changeOrder(2)"
                >
                    {{ $t("reject") }}
                </div>
            </div>
        </div>

        <div class="px-[20px] pt-[16px] pb-[28px]">
            <van-pull-refresh
                v-model="refreshing"
                :pulling-text="' '"
                :loosing-text="' '"
                :loading-text="' '"
                :success-text="' '"
                @refresh="onRefresh"
            >
                <template #normal></template>
                <template #pulling></template>
                <template #loosing></template>
                <template #loading></template>
                <template #success></template>
                <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    :finished-text="$t('no_more')"
                    :loading-text="' '"
                    @load="onLoad"
                >
                    <template #loading></template>
                    <template
                        v-for="item in list"
                        :key="
                            item.id || item.orderNumber || item.applicationTime
                        "
                    >
                        <div class="record-card">
                            <div class="record-card__top">
                                <div class="record-amount">
                                    {{ formatAmount(item.amount) }}
                                </div>
                                <div
                                    class="record-status"
                                    :class="statusClass(item.status)"
                                >
                                    {{ statusText(item.status) }}
                                </div>
                            </div>
                            <div class="record-card__bottom">
                                <div class="record-order">
                                    {{ item.code }}
                                </div>
                                <div class="record-time">
                                    {{
                                        formatWithTimezone(
                                            item.applicationTime,
                                            userStore.zoneActive.tzName,
                                        )
                                    }}
                                </div>
                            </div>
                        </div>
                    </template>
                    <div
                        v-if="loading"
                        class="data-list-loading data-list-loading--custom"
                        :class="{
                            'data-list-loading--full': !list.length,
                            'data-list-loading--inline': list.length,
                        }"
                    >
                        <span class="data-list-loading__dot"></span>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { getWithdrawals } from "../../api/apis";
import { formatWithTimezone } from "../../util/utils";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";

const orderActive = ref(0);
const list = ref([]);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const userStore = useUserStore();
const { t } = useI18n();
const query = reactive({
    pageNum: 1,
    pageSize: 10,
    status: "1",
});

const statusText = (status) => {
    // if (status === 0) return t("confirmed");
    if (status == 1) return t("reviewing");
    if (status == 0) return t("success");
    return t("rejected");
};

const statusClass = (status) => {
    if (status == 0) return "is-approved";
    if (status == 1) return "is-reviewing";
    return "is-rejected";
};

const formatAmount = (amount) => {
    const numeric = Number(amount || 0);
    const prefix = numeric >= 0 ? "+" : "-";
    return `${prefix}$${Math.abs(numeric)}`;
};

const reloadList = async (showRefresh = false) => {
    if (showRefresh) {
        refreshing.value = true;
    }
    finished.value = false;
    loading.value = true;
    query.pageNum = 1;
    list.value = [];
    await loadData();
    loading.value = false;
    if (showRefresh) {
        refreshing.value = false;
    }
};

const onRefresh = () => reloadList(true);

const onLoad = async () => {
    if (finished.value) return;
    loading.value = true;
    await loadData();
    loading.value = false;
};

const loadData = async () => {
    try {
        const res = await getWithdrawals(query);
        const data = res.rows || [];
        if (data.length < query.pageSize) {
            finished.value = true;
        } else {
            query.pageNum++;
        }
        list.value.push(...data);
    } catch (error) {
        console.error("加载失败", error);
        finished.value = true;
    }
};

const onClickLeft = () => history.back();

const changeOrder = (value) => {
    orderActive.value = value;
    if (orderActive.value === 0) {
        query.status = "1";
    } else if (orderActive.value === 1) {
        query.status = "0";
    } else {
        query.status = "2";
    }
    reloadList(false);
};

onMounted(() => {
    reloadList(false);
});
</script>

<style scoped>
.withdraw-history-page :deep(.van-pull-refresh__head),
.withdraw-history-page :deep(.van-pull-refresh__loading),
.withdraw-history-page :deep(.van-pull-refresh__text) {
    display: none !important;
    height: 0 !important;
    line-height: 0 !important;
    opacity: 0 !important;
    overflow: hidden !important;
}

.withdraw-history-page :deep(.van-pull-refresh__track) {
    transform: translate3d(0, 0, 0) !important;
}

.withdraw-history-page :deep(.van-list__loading) {
    display: none !important;
}

.withdraw-history-page :deep(.van-list__loading .van-loading),
.withdraw-history-page :deep(.van-list__loading .van-loading__spinner),
.withdraw-history-page :deep(.van-list__loading .van-loading__text) {
    display: none !important;
}

.data-list-loading {
    display: flex;
    align-items: center;
    justify-content: center;
}

.data-list-loading--full {
    width: 100%;
    min-height: calc(100vh - 180px);
    min-height: calc(100dvh - 180px);
    background: #fff;
}

.data-list-loading--inline {
    min-height: 72px;
}

.data-list-loading__dot {
    position: relative;
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 999px;
    background: #1aa24e;
}

.data-list-loading__dot::before,
.data-list-loading__dot::after {
    position: absolute;
    inset: 0;
    content: "";
    border-radius: inherit;
}

.data-list-loading__dot::before {
    background: rgba(26, 162, 78, 0.78);
    animation: data-list-loading-pulse 1.05s cubic-bezier(0.25, 0.1, 0.25, 1)
        infinite;
}

.data-list-loading__dot::after {
    background: #1aa24e;
    transform: scale(0.62);
    animation: data-list-loading-core 1.05s cubic-bezier(0.25, 0.1, 0.25, 1)
        infinite;
}

@keyframes data-list-loading-pulse {
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

@keyframes data-list-loading-core {
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

.withdraw-history-page :deep(.van-nav-bar) {
    background: #ffffff;
}

.withdraw-history-page :deep(.van-nav-bar__title) {
    color: #24352d;
    font-size: 20px;
    font-weight: 500;
}

.withdraw-history-page :deep(.van-nav-bar .van-icon) {
    color: #23a455;
}

.withdraw-history-page :deep(.van-nav-bar::after) {
    border-bottom: 1px solid #dbe9df;
}

.tab-bar-wrap {
    padding-top: 53px;
    background: #ffffff;
}

.tab-bar {
    position: sticky;
    top: 53px;
    z-index: 9;
    display: flex;
    align-items: center;
    background: #ffffff;
    border-bottom: 1px solid #dce9df;
}

.history-tab {
    position: relative;
    flex: 1;
    text-align: center;
    padding: 16px 8px 13px;
    color: #8aa18f;
    font-size: 14px;
    line-height: 22px;
    font-weight: 500;
}

.history-tab.active {
    color: #23a455;
}

.history-tab.active::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 96px;
    max-width: 68%;
    height: 3px;
    transform: translateX(-50%);
    background: #23a455;
    border-radius: 999px;
}

.record-card {
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 8px 18px rgba(177, 203, 186, 0.12);
    padding: 18px 18px 16px;
}

.record-card + .record-card {
    margin-top: 16px;
}

.record-card__top,
.record-card__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.record-card__bottom {
    margin-top: 14px;
}

.record-amount {
    color: #23a455;
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
}

.record-status {
    padding: 4px 13px;
    border-radius: 999px;
    font-size: 11px;
    line-height: 18px;
    font-weight: 500;
}

.record-status.is-approved {
    background: #e8f3eb;
    color: #23a455;
}

.record-status.is-reviewing {
    background: #eef3ff;
    color: #3f7cff;
}

.record-status.is-rejected {
    background: #fff1f1;
    color: #ef5350;
}

.record-order,
.record-time {
    color: #97aa9d;
    font-size: 11px;
    line-height: 18px;
}

.record-order {
    flex: 1;
    min-width: 0;
    word-break: break-all;
}

.record-time {
    flex-shrink: 0;
    text-align: right;
}
</style>

<style>
.withdraw-history-page .van-list__loading,
.withdraw-history-page .van-list__loading > .van-loading,
.withdraw-history-page .van-list__loading .van-loading__spinner,
.withdraw-history-page .van-list__loading .van-loading__text {
    display: none !important;
}
</style>
