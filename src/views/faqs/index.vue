<template>
  <div class="w-full min-h-[100vh] bg-[#ffff]">
    <div class="container w-full min-h-[100vh] bg-white">
      <van-nav-bar
        :title="$t('常见问题解答')"
        fixed
        left-arrow
        class="shadow"
        @click-left="onClickLeft"
      />
      <div class="mt-[70px] text-[#333333] text-[14px] leading-[30px] px-[20px] pb-[20px]">
        <p v-for="(item, index) in aboutSections" :key="index" class="mt-[13px]">{{$t(item.key)}}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getConfigByLang} from "../../api/apis"
import { useCommonStore } from '@/store/modules/common';
const faqEn = ref('')
const commonStore = useCommonStore();
const parLang = computed(() => {
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang; 
});
// const getGetGlobalConfig = async() =>{
//     let res = await getConfigByLang({ lang: parLang.value });
//     faqEn.value = res?.data?.faq ?? '';
// }
const aboutSections = [
  { type: 'title', key: 'FAQS.title1' },
  { type: 'title', key: 'FAQS.title2' },
  { type: 'title', key: 'FAQS.title3' },
  { type: 'title', key: 'FAQS.title4' },
  { type: 'title', key: 'FAQS.title5' },
  { type: 'title', key: 'FAQS.title6' },
  { type: 'title', key: 'FAQS.title7' },
  { type: 'title', key: 'FAQS.title8' },
  { type: 'title', key: 'FAQS.title9' },
  { type: 'title', key: 'FAQS.title10' },
  { type: 'title', key: 'FAQS.title11' },
  { type: 'title', key: 'FAQS.title12' },
  { type: 'title', key: 'FAQS.title13' },
  { type: 'title', key: 'FAQS.title14' },
  { type: 'title', key: 'FAQS.title15' },
  { type: 'title', key: 'FAQS.title16' },
  { type: 'title', key: 'FAQS.title17' },
  { type: 'title', key: 'FAQS.title18' },
  { type: 'title', key: 'FAQS.title19' },
  { type: 'title', key: 'FAQS.title20' },
  { type: 'title', key: 'FAQS.title21' },
  { type: 'title', key: 'FAQS.title22' },
  { type: 'title', key: 'FAQS.title23' },
  { type: 'title', key: 'FAQS.title24' },
  { type: 'title', key: 'FAQS.title25' },
  { type: 'title', key: 'FAQS.title26' },
  { type: 'title', key: 'FAQS.title27' },
  { type: 'title', key: 'FAQS.title28' },
  { type: 'title', key: 'FAQS.title29' },
  { type: 'title', key: 'FAQS.title30' },
  { type: 'title', key: 'FAQS.title31' },
  { type: 'title', key: 'FAQS.title32' },
  { type: 'title', key: 'FAQS.title33' },
  { type: 'title', key: 'FAQS.title34' },
  { type: 'title', key: 'FAQS.title35' },
  { type: 'title', key: 'FAQS.title36' },
  { type: 'title', key: 'FAQS.title37' },
  { type: 'title', key: 'FAQS.title38' },
  { type: 'title', key: 'FAQS.title39' },
  { type: 'title', key: 'FAQS.title40' },
  { type: 'title', key: 'FAQS.title41' },
]
onMounted(() =>{
})

const onClickLeft = () => history.back();
</script>
