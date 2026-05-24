<template>
    <div class="notice-page">
        <PageTopBar
            :title="$t('message_center')"
            show-back
            @click-left="onClickLeft"
        />

        <div class="notice-body">
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
                        <div class="notice-row" @click="goDetail(item)">
                            <div class="notice-row__dot"></div>
                            <div class="notice-row__main">
                                <div class="notice-row__title">
                                    {{
                                        item.noticeTitle ||
                                        resolveType(item).label
                                    }}
                                </div>
                                <div class="notice-row__time">
                                    {{ relativeTime(item.createTime) }}
                                </div>
                            </div>
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
import PageTopBar from "@/components/PageTopBar.vue";
import { useCommonStore } from "@/store/modules/common";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const commonStore = useCommonStore();
const router = useRouter();

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
        return { label: t("withdrawal") };
    }
    if (/task|mission|order|commission|submit|created/.test(text)) {
        return { label: t("task") };
    }
    if (/deposit|recharge|top up/.test(text)) {
        return { label: t("recharge") };
    }
    return { label: t("system") };
};

function relativeTime(time) {
    if (!time) return "";
    const date = new Date(time);
    const diff = Date.now() - date.getTime();
    const minutes = Math.max(0, Math.floor(diff / 60000));
    if (minutes < 1) return "Now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h ago`;
    const days = Math.floor(hours / 24);
    return `${days} d ago`;
}

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
        const data = Array.isArray(res?.rows) ? res.rows : [];
        if (data.length < query.pageSize) {
            finished.value = true;
        } else {
            query.pageNum++;
        }
        list.value.push(...data);
    } catch (error) {
        finished.value = true;
    }
};

const goDetail = (item) => {
    router.push({
        path: "/noticeDetail",
        query: {
            id: item.noticeId,
        },
    });
};

onMounted(() => {
    onLoad();
});

const onClickLeft = () => history.back();
</script>

<style scoped>
.notice-page {
    min-height: 100vh;
    background: #edf1f9;
}

.notice-row {
    display: flex;
    align-items: flex-start;
    gap: 18px;
    padding: 28px 22px 30px;
    background: #ffffff;
    border-bottom: 14px solid #edf1f9;
}

.notice-row__dot {
    width: 8px;
    height: 8px;
    margin-top: 10px;
    border-radius: 999px;
    background: #2f8dea;
    flex-shrink: 0;
}

.notice-row__main {
    min-width: 0;
    flex: 1;
}

.notice-row__title {
    color: #111319;
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 14px;
    color: #000000;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.notice-row__time {
    margin-top: 9px;
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 14px;
    color: #4b5563;
    line-height: 23px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}
</style>
