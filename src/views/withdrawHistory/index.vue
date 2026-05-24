<template>
    <div class="withdraw-history-page">
        <PageTopBar :title="$t('history')" show-back @click-left="onClickLeft" />

        <main class="history-content">
            <div class="history-tabs">
                <button
                    class="history-tab"
                    :class="{ active: orderActive === 0 }"
                    type="button"
                    @click="changeOrder(0)"
                >
                    {{ $t("all") }}
                </button>
                <button
                    class="history-tab"
                    :class="{ active: orderActive === 1 }"
                    type="button"
                    @click="changeOrder(1)"
                >
                    {{ $t("pending") }}
                </button>
                <button
                    class="history-tab"
                    :class="{ active: orderActive === 2 }"
                    type="button"
                    @click="changeOrder(2)"
                >
                    {{ $t("completed") }}
                </button>
            </div>
            <van-pull-refresh
                v-model="refreshing"
                :disabled="!pullRefreshEnabled"
                :pulling-text="' '"
                :loosing-text="' '"
                :loading-text="' '"
                @refresh="onRefresh"
                @touchstart.passive="onRefreshTouchStart"
                @touchmove.passive="onRefreshTouchMove"
            >
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
                            <div class="record-card__row record-card__row--top">
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
                            <div
                                class="record-card__row record-card__row--bottom"
                            >
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
                        <div class="data-list-loading__wave" aria-hidden="true">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </main>
    </div>
</template>

<script setup>
import PageTopBar from "@/components/PageTopBar.vue";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { getWithdrawals } from "../../api/apis";
import { formatWithTimezone } from "../../util/utils";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";

const orderActive = ref(0);
const list = ref([]);
const refreshing = ref(false);
const pullRefreshEnabled = ref(false);
const finished = ref(false);
const loading = ref(false);
const userStore = useUserStore();
const { t } = useI18n();

const getRootScrollTop = () => {
    const app = document.getElementById("app");
    return Math.max(
        window.pageYOffset || 0,
        document.documentElement?.scrollTop || 0,
        document.body?.scrollTop || 0,
        app?.scrollTop || 0,
    );
};

const isAtPageTop = () => getRootScrollTop() <= 1;

const syncPullRefreshState = () => {
    pullRefreshEnabled.value = isAtPageTop() && !loading.value;
};

const onRefreshTouchStart = () => {
    pullRefreshEnabled.value = isAtPageTop() && !loading.value;
};

const onRefreshTouchMove = () => {
    if (!isAtPageTop()) {
        pullRefreshEnabled.value = false;
    }
};

const query = reactive({
    pageNum: 1,
    pageSize: 10,
    status: "",
});

const statusText = (status) => {
    if (status == 1) return t("pending");
    if (status == 0) return t("confirmed");
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

const onRefresh = async () => {
    if (!isAtPageTop()) {
        refreshing.value = false;
        pullRefreshEnabled.value = false;
        return;
    }
    await reloadList(true);
    pullRefreshEnabled.value = false;
};

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
    if (value === 0) {
        query.status = "";
    } else if (value === 1) {
        query.status = "1";
    } else {
        query.status = "0";
    }
    reloadList(false);
};

onMounted(() => {
    syncPullRefreshState();
    window.addEventListener("scroll", syncPullRefreshState, { passive: true });
    document.getElementById("app")?.addEventListener("scroll", syncPullRefreshState, { passive: true });
    reloadList(false);
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", syncPullRefreshState);
    document.getElementById("app")?.removeEventListener("scroll", syncPullRefreshState);
});
</script>

<style scoped>
.withdraw-history-page {
    min-height: 100vh;
    background: #f1f4fb;
    color: #101010;
}

.history-topbar {
    position: relative;
    height: 104px;
    background: #050505;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
}

.history-topbar__back {
    position: absolute;
    left: 25px;
    top: 50%;
    width: 29px;
    height: 29px;
    border: 0;
    background: transparent;
    transform: translateY(-50%) rotate(45deg);
    border-left: 5px solid #ffffff;
    border-bottom: 5px solid #ffffff;
    border-radius: 2px;
}

.history-topbar__title {
    color: #ffffff;
    font-size: 30px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0.5px;
}

.history-content {
    padding: 20px 20px 40px;
}

.history-tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-bottom: 23px;
}

.history-tab {
    height: 71px;
    border: 0;
    border-radius: 12px;
    background: #ffffff;
    color: #6d7788;
    font-size: 14px;
    line-height: 1;
    font-weight: 500;
    text-align: center;
}

.history-tab.active {
    background: #2e63e8;
    color: #ffffff;
}

.record-card {
    min-height: 170px;
    padding: 28px 24px 29px;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: none;
}

.record-card + .record-card {
    margin-top: 15px;
}

.record-card__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
}

.record-card__row--bottom {
    margin-top: 34px;
}

.record-amount {
    color: #2c66e9;
    font-size: 30px;
    line-height: 1;
    font-weight: 800;
    white-space: nowrap;
}

.record-status {
    height: 53px;
    min-width: 150px;
    padding: 0 12px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 26px;
    line-height: 1;
    font-weight: 800;
    white-space: nowrap;
}

.record-status.is-approved {
    background: #008e45;
}

.record-status.is-reviewing {
    background: #ef4444;
}

.record-status.is-rejected {
    background: #ef4444;
}

.record-order,
.record-time {
    color: #6d7788;
    font-size: 26px;
    line-height: 1.15;
    font-weight: 500;
}

.record-order {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.record-time {
    flex-shrink: 0;
    text-align: right;
}

.withdraw-history-page :deep(.van-pull-refresh__head),
.withdraw-history-page :deep(.van-pull-refresh__loading),
.withdraw-history-page :deep(.van-pull-refresh__text),
.withdraw-history-page :deep(.van-list__loading),
.withdraw-history-page :deep(.van-list__loading .van-loading),
.withdraw-history-page :deep(.van-list__loading .van-loading__spinner),
.withdraw-history-page :deep(.van-list__loading .van-loading__text) {
    display: none !important;
    height: 0 !important;
    line-height: 0 !important;
    opacity: 0 !important;
    overflow: hidden !important;
}

.withdraw-history-page :deep(.van-pull-refresh__track) {
    transform: translate3d(0, 0, 0) !important;
}

.data-list-loading {
    display: flex;
    align-items: center;
    justify-content: center;
}

.data-list-loading--full {
    width: 100%;
    min-height: calc(100vh - 220px);
    min-height: calc(100dvh - 220px);
}

.data-list-loading--inline {
    min-height: 72px;
}

.data-list-loading__wave {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 4px;
    width: 68px;
    height: 44px;
    padding-bottom: 6px;
}

.data-list-loading__wave::before {
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

.data-list-loading__wave span {
    position: relative;
    z-index: 1;
    display: block;
    width: 4px;
    height: 16px;
    border-radius: 999px;
    background: linear-gradient(
        180deg,
        #8af3ff 0%,
        #4b97ff 34%,
        #2f7bff 68%,
        #3543ec 100%
    );
    box-shadow: 0 5px 12px rgba(47, 123, 255, 0.22);
    transform-origin: center bottom;
    animation: withdraw-loading-wave 1s ease-in-out infinite;
}

.data-list-loading__wave span:nth-child(1) {
    height: 12px;
    animation-delay: -0.36s;
}

.data-list-loading__wave span:nth-child(2) {
    height: 18px;
    animation-delay: -0.24s;
}

.data-list-loading__wave span:nth-child(3) {
    height: 26px;
    animation-delay: -0.12s;
}

.data-list-loading__wave span:nth-child(4) {
    width: 5px;
    height: 34px;
    animation-delay: 0s;
}

.data-list-loading__wave span:nth-child(5) {
    height: 26px;
    animation-delay: 0.12s;
}

.data-list-loading__wave span:nth-child(6) {
    height: 18px;
    animation-delay: 0.24s;
}

.data-list-loading__wave span:nth-child(7) {
    height: 12px;
    animation-delay: 0.36s;
}

@keyframes withdraw-loading-wave {
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

@media (max-width: 430px) {
    .history-topbar {
        height: 104px;
    }

    .history-topbar__back {
        left: 20px;
        width: 20px;
        height: 20px;
        border-left-width: 4px;
        border-bottom-width: 4px;
    }

    .history-topbar__title {
        font-size: 30px;
    }

    .history-content {
        padding: 10px 20px 40px;
    }

    .history-tabs {
        gap: 8px;
        margin-bottom: 11px;
    }

    .history-tab {
        height: 36px;
        border-radius: 6px;
        font-size: 14px;
    }

    .record-card {
        min-height: 85px;
        padding: 14px 12px 15px;
        border-radius: 6px;
    }

    .record-card + .record-card {
        margin-top: 8px;
    }

    .record-card__row--bottom {
        margin-top: 17px;
    }

    .record-amount {
        font-size: 14px;
    }

    .record-status {
        height: 27px;
        min-width: 75px;
        border-radius: 6px;
        font-size: 12px;
        padding: 6px;
    }

    .record-order,
    .record-time {
        font-size: 12px;
    }
}


.withdraw-history-page :deep(.page-top-bar) {
    position: sticky;
    top: 0;
    left: auto !important;
    right: auto !important;
    width: 100% !important;
    max-width: none !important;
    transform: none !important;
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
