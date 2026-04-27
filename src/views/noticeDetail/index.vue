<template>
  <div class="container bg-white w-full min-h-[100vh]">
    
    <div class="w-full p-6 box-border flex flex-col font-montserrat text-[#666]">
        <PageTopBar :title="incomeGuide.noticeTitle" show-back @click-left="onClickLeft" />
     <div class="pt-[65px] w-full box-border flex flex-col  text-[#666]" v-html="incomeGuide.noticeContent"></div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getNotice,getNoticeByLang} from "../../api/apis"
import { useRouter ,useRoute } from "vue-router";
import { useCommonStore } from '@/store/modules/common';
const commonStore = useCommonStore();

const router = useRouter();
const route = useRoute();
// 把 store 的 lang（如 'zhTW'）映射成真正传给后端的语言码（如 'zh_tw'）
const parLang = computed(() => {
  // 假设你的 store 里实现了 getter：getValueByKey(key) => value|null
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang; // 映射不到就用原值兜底
});

console.log(route)
const incomeGuide = ref({})
const getGetGlobalConfig = async() =>{
    let params = {
        id:route.query.id,
        lang: parLang.value
    }
    let res = await getNoticeByLang(params);
    incomeGuide.value = res.data
}
onMounted(() =>{
    getGetGlobalConfig();
})
const onClickLeft = () => history.back();
</script>
