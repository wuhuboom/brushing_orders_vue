<template>
    <div class="notice-page">
        <PageTopBar
            :title="$t('notification')"
            show-back
            @click-left="onClickLeft"
        >
            <template #right>
                <!-- <span class="notice-nav__right">✓ {{ $t("all_read") }}</span> -->
            </template>
        </PageTopBar>

        <div class="notice-body">
            <section class="notice-hero">
                <div class="notice-hero__icon-wrap">
                    <van-icon name="bell" class="notice-hero__icon" />
                    <span class="notice-hero__count">{{ unreadCount }}</span>
                </div>
                <div class="notice-hero__content">
                    <div class="notice-hero__title">
                        {{
                            $t("unread_notifications_count", {
                                count: unreadCount,
                            })
                        }}
                    </div>
                    <div class="notice-hero__desc">
                        {{ $t("tap_notification_mark_read") }}
                    </div>
                </div>
            </section>

            <div class="notice-tags">
                <div class="notice-tag notice-tag--active">
                    {{ $t("all") }}
                    <span class="numcount">{{ unreadCount }}</span>
                </div>
                <!-- <span class="notice-tag">{{ $t("announcement") }} {{ announcementCount }}</span>
        <span class="notice-tag">{{ $t("task") }} {{ taskCount }}</span>
        <span class="notice-tag">{{ $t("withdrawal") }} {{ withdrawCount }}</span> -->
            </div>

            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    :finished-text="$t('no_more')"
                    @load="onLoad"
                >
                    <template
                        v-for="(item, index) in list"
                        :key="
                            item.noticeId || item.id || item.createTime || index
                        "
                    >
                        <div class="notice-card" @click="goDetail(item)">
                            <span class="notice-card__dot"></span>
                            <div
                                class="notice-card__icon"
                                :class="`type-${resolveType(item).type}`"
                            >
                                <van-icon :name="resolveType(item).icon" />
                            </div>
                            <div class="notice-card__main">
                                <div class="notice-card__top">
                                    <span
                                        class="notice-card__badge"
                                        :class="`type-${resolveType(item).type}`"
                                        >{{ resolveType(item).label }}</span
                                    >
                                    <span class="notice-card__time">{{
                                        formatNoticeTime(item.createTime)
                                    }}</span>
                                </div>
                                <div class="notice-card__title">
                                    {{ item.noticeTitle }}
                                </div>
                                <div class="notice-card__desc">
                                    {{ getPlainText(item.noticeContent) }}
                                </div>
                            </div>
                            <!-- <van-icon
                                name="delete-o"
                                class="notice-card__side-icon"
                            /> -->
                        </div>
                    </template>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { getNoticeListByLang } from "../../api/apis";
import { useRouter } from "vue-router";
import { formatWithTimezone } from "../../util/utils";
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from "@/store/modules/common";
import { useI18n } from "vue-i18n";

const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();
const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const commonStore = useCommonStore();

const parLang = computed(() => {
    const mapped = commonStore.getValueByKey(commonStore.lang);
    return mapped ?? commonStore.lang;
});

const query = reactive({
    pageNum: 1,
    pageSize: 10,
    lang: parLang.value,
});

const getPlainText = (html = "") => {
    if (typeof window === "undefined") {
        return String(html || "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
};

const resolveType = (item) => {
    const text =
        `${item?.noticeTitle || ""} ${getPlainText(item?.noticeContent || "")}`.toLowerCase();
    if (/withdraw|withdrawal/.test(text)) {
        return {
            type: "withdraw",
            label: t("withdrawal").toUpperCase(),
            icon: "chart-trending-o",
        };
    }
    if (/task|mission|order|commission/.test(text)) {
        return {
            type: "task",
            label: t("task").toUpperCase(),
            icon: "checked",
        };
    }
    if (/announcement|welcome|notice|system/.test(text)) {
        return {
            type: "announcement",
            label: t("announcement").toUpperCase(),
            icon: "volume-o",
        };
    }
    if (/deposit|recharge|top up/.test(text)) {
        return {
            type: "deposit",
            label: t("recharge").toUpperCase(),
            icon: "gift-o",
        };
    }
    return {
        type: "system",
        label: t("system").toUpperCase(),
        icon: "warning-o",
    };
};

const unreadCount = computed(() => list.value.length);
const announcementCount = computed(
    () =>
        list.value.filter((item) => resolveType(item).type === "announcement")
            .length,
);
const taskCount = computed(
    () => list.value.filter((item) => resolveType(item).type === "task").length,
);
const withdrawCount = computed(
    () =>
        list.value.filter((item) => resolveType(item).type === "withdraw")
            .length,
);

const formatNoticeTime = (time) => {
    if (!time) return "";
    return formatWithTimezone(time, userStore.zoneActive.tzName);
};

const onRefresh = async () => {
    refreshing.value = true;
    finished.value = false;
    query.pageNum = 1;
    list.value = [];
    await loadData();
    refreshing.value = false;
};

const onLoad = async () => {
    if (finished.value || loading.value) return;
    loading.value = true;
    await loadData();
    loading.value = false;
};

const loadData = async () => {
    try {
        const res = await getNoticeListByLang(query);
        const data = res.rows;
        if (data.length < query.pageSize) {
            finished.value = true;
        } else {
            query.pageNum++;
        }
        list.value.push(...data);
    } catch (error) {
        console.error("鍔犺浇澶辫触", error);
        finished.value = true;
    }
};

const goDetail = (item) => {
    // router.push({
    //     path: "/noticeDetail",
    //     query: {
    //         id: item.noticeId,
    //     },
    // });
};

onMounted(() => {
    onLoad();
});

const onClickLeft = () => history.back();
</script>

<style scoped>
.notice-page {
    min-height: 100vh;
    background: #edf4ef;
}

.notice-body {
    padding: 74px 16px 24px;
}

.notice-nav__right {
    color: #28a14d;
    font-size: 12px;
    line-height: 18px;
}

.notice-hero {
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 18px;
    padding: 14px 14px;
    background: var(--theme-button-gradient);
    color: #fff;
    box-shadow: 0 14px 28px rgba(31, 132, 64, 0.16);
}

.notice-hero__icon-wrap {
    position: relative;
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.14);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.notice-hero__icon {
    font-size: 22px;
}

.notice-hero__count {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    border-radius: 999px;
    background: #ff5a5a;
    color: #fff;
    font-size: 11px;
    line-height: 18px;
    text-align: center;
}

.notice-hero__title {
    font-size: 17px;
    line-height: 24px;
    font-weight: 500;
}

.notice-hero__desc {
    margin-top: 4px;
    font-size: 12px;
    line-height: 18px;
    color: rgba(255, 255, 255, 0.84);
}

.notice-tags {
    display: flex;
    gap: 8px;
    margin: 14px 0;
    overflow-x: auto;
    padding-bottom: 4px;
}

.notice-tag {
    white-space: nowrap;
    border-radius: 999px;
    padding: 8px 14px;
    border: 1px solid #d7e8da;
    background: #fff;
    color: #6c876f;
    font-size: 13px;
    line-height: 18px;
}

.notice-tag--active {
    border-radius: 20px;
    box-shadow: 0px 3px 8px 0px rgba(34, 160, 80, 0.22);
    background: linear-gradient(
        153.74deg,
        rgba(52, 190, 100, 1) 0%,
        rgba(20, 140, 65, 1) 100%
    );
    color: #fff;
}

.numcount {
    /* span */
    padding: 0 10px;
    transform: rotate(-0.29deg);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.35);
    margin-left: 5px;
}

.notice-card {
    position: relative;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 14px 12px 14px 16px;
    margin-bottom: 12px;
    border-radius: 18px;
    border: 1px solid #d7e9da;
    background: #f7fbf7;
    box-shadow: 0 10px 24px rgba(29, 82, 44, 0.05);
}

.notice-card__dot {
    position: absolute;
    left: 6px;
    top: 18px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #38b85c;
}

.notice-card__icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
}

.notice-card__icon.type-withdraw,
.notice-card__badge.type-withdraw {
    background: #fff3df;
    color: #e3a044;
}

.notice-card__icon.type-task,
.notice-card__badge.type-task {
    background: #e9f7eb;
    color: #2ca24d;
}

.notice-card__icon.type-announcement,
.notice-card__badge.type-announcement {
    background: #e9f1ff;
    color: #3c83f2;
}

.notice-card__icon.type-deposit,
.notice-card__badge.type-deposit {
    background: #f3ebff;
    color: #8758de;
}

.notice-card__icon.type-system,
.notice-card__badge.type-system {
    background: #ffe9e9;
    color: #f25f5f;
}

.notice-card__main {
    flex: 1;
    min-width: 0;
}

.notice-card__top {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
}

.notice-card__badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 10px;
    line-height: 14px;
    font-weight: 600;
}

.notice-card__time {
    color: #a6b5a7;
    font-size: 11px;
    line-height: 16px;
}

.notice-card__title {
    margin-top: 8px;
    color: #1f2b1f;
    font-size: 16px;
    line-height: 22px;
    font-weight: 500;
}

.notice-card__desc {
    margin-top: 8px;
    color: #728b74;
    font-size: 13px;
    line-height: 20px;
    /*display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;*/
}

.notice-card__side-icon {
    color: #c4d1c5;
    font-size: 16px;
    margin-top: 2px;
}

:deep(.notice-nav .van-nav-bar) {
    background: #fff;
}

:deep(.notice-nav .van-nav-bar__title) {
    color: #1f2b1f;
    font-size: 18px;
    font-weight: 500;
}

:deep(.notice-nav .van-icon-arrow-left) {
    color: #28a14d;
    font-size: 22px;
}
</style>
