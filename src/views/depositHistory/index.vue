<template>
    <div class="deposit-history-page min-h-screen bg-[#F5F8F7]">
        <PageTopBar
            :title="$t('order_history')"
            show-back
            @click-left="onClickLeft"
        />

        <div class="px-[20px] pt-[84px] pb-[28px]">
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
                        <span class="data-list-loading__dot"></span>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useUserStore } from "@/store/modules/user";
import { getDeposit } from "../../api/apis";
import { formatWithTimezone } from "../../util/utils";

const userStore = useUserStore();
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const list = ref([]);
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

const onRefresh = () => reloadList(true);

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
    reloadList(false);
});
</script>

<style scoped>

.deposit-history-page :deep(.van-pull-refresh__head),
.deposit-history-page :deep(.van-pull-refresh__loading),
.deposit-history-page :deep(.van-pull-refresh__text) {
    display: none !important;
    height: 0 !important;
    line-height: 0 !important;
    opacity: 0 !important;
    overflow: hidden !important;
}

.deposit-history-page :deep(.van-pull-refresh__track) {
    transform: translate3d(0, 0, 0) !important;
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
    animation: data-list-loading-pulse 1.05s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
}

.data-list-loading__dot::after {
    background: #1aa24e;
    transform: scale(0.62);
    animation: data-list-loading-core 1.05s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
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
    color: #23a455;
    font-size: 14px;
    line-height: 26px;
    font-weight: 600;
}

.record-status {
    padding: 4px 12px;
    border-radius: 999px;
    background: #e8f3eb;
    color: #23a455;
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
</style>


<style>
.deposit-history-page .van-list__loading,
.deposit-history-page .van-list__loading > .van-loading,
.deposit-history-page .van-list__loading .van-loading__spinner,
.deposit-history-page .van-list__loading .van-loading__text {
    display: none !important;
}
</style>
