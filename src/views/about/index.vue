<template>
  <div class="about-page min-h-screen bg-[#eef2fb]">
    <PageTopBar :title="$t('about')" show-back @click-left="onClickLeft" />

    <div class="about-page__body">
      <section class="about-page__card rich-content" v-html="aboutUsEn"></section>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getConfigByLang} from "../../api/apis"
import { useCommonStore } from '@/store/modules/common';
const aboutUsEn = ref('')
const commonStore = useCommonStore();
const parLang = computed(() => {
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang; 
});
const getGetGlobalConfig = async() =>{
    let res = await getConfigByLang({ lang: parLang.value });
    aboutUsEn.value = res?.data?.aboutUs ?? '';
}
onMounted(() =>{
    getGetGlobalConfig();
})

const onClickLeft = () => history.back();
</script>

<style scoped>
.about-page__body {
  padding: 92px 20px 32px;
}

.about-page__card {
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
