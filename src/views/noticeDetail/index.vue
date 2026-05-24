<template>
    <div class="notice-detail-page min-h-screen bg-[#eef2fb]">
        <PageTopBar
            :title="incomeGuide.noticeTitle"
            show-back
            @click-left="onClickLeft"
        />

        <div class="notice-detail-page__body">
            <article
                class="notice-detail-page__card rich-content"
                v-html="incomeGuide.noticeContent"
            ></article>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { getNotice, getNoticeByLang } from "../../api/apis";
import { useRouter, useRoute } from "vue-router";
import { useCommonStore } from "@/store/modules/common";
const commonStore = useCommonStore();

const router = useRouter();
const route = useRoute();
const parLang = computed(() => {
    const mapped = commonStore.getValueByKey(commonStore.lang);
    return mapped ?? commonStore.lang;
});

console.log(route);
const incomeGuide = ref({});
const getGetGlobalConfig = async () => {
    let params = {
        id: route.query.id,
        lang: parLang.value,
    };
    let res = await getNoticeByLang(params);
    incomeGuide.value = res.data;
};
onMounted(() => {
    getGetGlobalConfig();
});
const onClickLeft = () => history.back();
</script>

<style scoped>
.notice-detail-page__body {
    padding: 18px 20px 32px;
}

.notice-detail-page__card {
    padding: 22px 18px;
    border-radius: 22px;
    background: #ffffff;
    color: #5f6877;
    box-shadow: 0 10px 30px rgba(18, 25, 38, 0.04);
}

.rich-content :deep(*) {
    box-sizing: border-box;
}

.rich-content :deep(p),
.rich-content :deep(li) {
    margin: 0 0 12px;
    color: #5f6877;
    font-size: 14px;
    line-height: 1.8;
}

.rich-content :deep(p:last-child),
.rich-content :deep(li:last-child) {
    margin-bottom: 0;
}

.rich-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
}

.rich-content :deep(h1),
.rich-content :deep(h2),
.rich-content :deep(h3),
.rich-content :deep(h4) {
    margin: 0 0 14px;
    color: #121826;
    font-weight: 700;
}
</style>
