<template>
  <div class="w-full min-h-[100vh] bg-[#fff]">
    
    <div class="w-full p-6 box-border flex flex-col font-montserrat text-[#666]">
        <van-nav-bar
        :title="$t('收入指南')"
        fixed
        left-arrow
        class="shadow"
        @click-left="onClickLeft"
    />
     <div v-html="incomeGuideEn" class="mt-[65px]"></div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useCommonStore } from '@/store/modules/common';
import {getConfigByLang} from "../../api/apis"
const incomeGuideEn = ref('')
const commonStore = useCommonStore();

// 把 store 的 lang（如 'zhTW'）映射成真正传给后端的语言码（如 'zh_tw'）
const parLang = computed(() => {
  // 假设你的 store 里实现了 getter：getValueByKey(key) => value|null
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang; // 映射不到就用原值兜底
});



const getGetGlobalConfig = async() =>{
  console.log("parLang",parLang);
  
    // 这里一定要用 .value
    let res = await getConfigByLang({ lang: parLang.value });
    incomeGuideEn.value = res?.data?.incomeGuideEn ?? '';
}
onMounted(() =>{
    getGetGlobalConfig();
})
const onClickLeft = () => history.back();
</script>