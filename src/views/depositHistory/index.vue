<template>
    <div class="deposit-history-page min-h-screen bg-[#F5F8F7]">
        <PageTopBar
            :title="$t('order_history')"
            show-back
            @click-left="onClickLeft"
        />

        <div class="px-[20px] pt-[14px] pb-[28px]">
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
                        :key="item.id || item.code || item.createTime"
                    >
                        <div class="record-card">
                            <div class="record-card__top">
                                <div class="record-amount">
                                    +$<span>{{ item.amout }}</span>
                                </div>
                                <div class="record-status">
                                    {{ $t("confirmed") }}
                                </div>
                            </div>
                            <div class="record-card__bottom">
                                <div class="record-order">{{ item.code }}</div>
                                <div class="record-time">
                                    {{
                                        formatWithTimezone(
                                            item.createTime,
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
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useUserStore } from "@/store/modules/user";
import { getDeposit } from "../../api/apis";
import { formatWithTimezone } from "../../util/utils";

const userStore = useUserStore();
const refreshing = ref(false);
const pullRefreshEnabled = ref(false);
const finished = ref(false);
const loading = ref(false);
const list = ref([]);

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
});

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
        const res = await getDeposit(query);
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
.deposit-history-page :deep(.van-pull-refresh__head) {
    color: #9aa5b5;
    font-size: 13px;
}

.deposit-history-page :deep(.van-list__loading) {
    display: none !important;
}

.deposit-history-page :deep(.van-list__loading .van-loading),
.deposit-history-page :deep(.van-list__loading .van-loading__spinner),
.deposit-history-page :deep(.van-list__loading .van-loading__text) {
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
    animation: data-list-loading-wave 1s ease-in-out infinite;
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

@keyframes data-list-loading-wave {
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

.page-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    height: 64px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #dce9df;
}

.page-header__left {
    position: absolute;
    left: 18px;
    top: 0;
    height: 64px;
    display: flex;
    align-items: center;
}

.page-header__title {
    color: #22342b;
    font-size: 18px;
    font-weight: 500;
}

@media (min-width: 768px) {
    .page-header {
        left: 50%;
        right: auto;
        width: 100%;
        max-width: var(--app-pc-max-width, 375px);
        transform: translateX(-50%);
    }
}

.record-card {
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 8px 18px rgba(177, 203, 186, 0.16);
    padding: 18px 20px;
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
    margin-top: 12px;
}

.record-amount {
    color: var(--theme-primary);
    font-size: 14px;
    line-height: 26px;
    font-weight: 600;
}

.record-status {
    padding: 4px 12px;
    border-radius: 999px;
    background: #e8f3eb;
    color: var(--theme-primary);
    font-size: 11px;
    line-height: 20px;
}

.record-order,
.record-time {
    color: #97aa9d;
    font-size: 11px;
    line-height: 20px;
}

.record-order {
    flex: 1;
    min-width: 0;
    word-break: break-all;
}

.record-time {
    text-align: right;
    flex-shrink: 0;
}


.deposit-history-page :deep(.page-top-bar) {
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
.deposit-history-page .van-list__loading,
.deposit-history-page .van-list__loading > .van-loading,
.deposit-history-page .van-list__loading .van-loading__spinner,
.deposit-history-page .van-list__loading .van-loading__text {
    display: none !important;
}
</style>
