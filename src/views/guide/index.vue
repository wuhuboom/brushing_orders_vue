<template>
  <div class="w-full min-h-[100vh] bg-[#f7f7f7]">
    
    <div class="w-full p-6 box-border flex flex-col">
        <van-nav-bar
        :title="$t('收入指南')"
        fixed
        left-arrow
        class="shadow"
        @click-left="onClickLeft"
    />
    <div class="mt-[40px] text-[#000000]">
      <div class="text-[12px] text-[#000] pb-[10px]" style="border-bottom: 0.5px solid #E5E7EB;">{{$t('guide.content1')}}</div>
      <div class="text-[14px] mt-[18px]">{{$t('guide.title1')}}</div>
      <div class="text-[12px] text-[#000] py-[10px]">{{$t('guide.content2')}}</div>
    </div>
    <div class="bg-[#fff] rounded-[10px]" style="overflow: hidden;">
      <div class="text-center bg-[#2D1810] text-[#fff] py-[7px]">
        <div>{{$t('guide.title2')}}</div>
        <div>{{$t('guide.title3')}}</div>
      </div>
      <div v-for="item in guide" class="grid grid-cols-3 gap-3 px-[10px] text-[#000] pt-[15px] pb-[8px]" style="border-bottom: 1px solid #D0D0D0;">
        <div>{{$t('guide.title4')}}</div>
        <div>{{item.day}}{{$t('guide.title5')}}</div>
        <div class="text-right">USD{{item.money}}</div>
      </div>
      <div class="text-[#000] px-[5px] text-[12px] font-bold">{{$t('guide.title6')}}</div>
      <div class="text-[#4B5563] px-[5px] text-[10px] leading-4 py-[5px]">{{$t('guide.content3')}}</div>
      <div class="text-[#4B5563] px-[5px] text-[10px] leading-4 py-[5px]">{{$t('guide.content4')}}</div>
      <div class="text-[#FF7D01] px-[5px] text-[10px] leading-4 py-[5px] font-bold">{{$t('guide.content5')}}</div>
    </div>
    <div class="mt-[40px] text-[#000000]">
      <div class="text-[12px] text-[#000] pb-[10px]" style="border-bottom: 0.5px solid #E5E7EB;">{{$t('guide.content1')}}</div>
      <div class="text-[14px] mt-[18px]">{{$t('guide.title7')}}</div>
      <div class="text-[12px] text-[#000] py-[10px]">{{$t('guide.content6')}}</div>
    </div>
    <div class="guideBg">
      <div class="text-center bg-[#2D1810] text-[#fff] py-[7px]">
        <div>{{$t('guide.title2')}}</div>
        <div>{{$t('guide.title3')}}</div>
      </div>
      <div class="grid grid-cols-3 gap-3 px-[10px] py-[12px]">
        <div  v-for="item in guideArr">
          <div class="bg-[#fff] text-center">
            <div class="bg-[#2D1810] text-[#fff] text-[12px] font-bold">{{item.title}}</div>
            <div class="text-[12px] text-[#2D1810] py-[3px]">{{$t('guide.title16')}}</div>
            <div class="text-[#FF7D01] text-[9px] pb-[3px]">USD <span class="text-[14px] font-bold">{{ item.num }}</span></div>
            <div class="text-[12px] text-[#2D1810]">{{$t('guide.title17')}}</div>
            <div class="text-[#FF7D01] text-[9px] py-[3px]">USD <span class="text-[14px] font-bold">{{ item.num1 }}</span></div>
          </div>
        </div>
      </div>
      <div class="bg-[#FF7D01] text-[14px] font-bold text-center text-[#fff] px-[9px] py-[12px]">
        ={{$t('guide.title18')}}
      </div>
      <div class="grid grid-cols-2 gap-2 px-[10px] py-[12px]">
        <div  v-for="item in advanArr">
          <div class="bg-[#fff] text-center">
            <!-- <div class="bg-[#2D1810] text-[#fff] text-[12px] font-bold">{{item.title}}</div> -->
            <div class="text-[12px] text-[#2D1810] py-[3px] font-bold">{{$t('guide.title19')}}(USD)</div>
            <div class="text-[#FF7D01] text-[9px] pb-[3px]"><span class="text-[14px] font-bold">{{ item.num }}</span></div>
            <div class="text-[12px] text-[#2D1810]">{{$t('guide.title20')}}(USD)</div>
            <div class="text-[#FF7D01] text-[9px] py-[3px] font-bold"><span class="pr-[10px] ">{{ item.num1 }}%</span>{{$t('guide.title21')}}</div>
          </div>
        </div>
      </div>
      

    </div>
    <div class=" text-[#000000]">
      <div class="text-[14px] mt-[18px]">{{$t('guide.title23')}}</div>
      <div class="text-[12px] text-[#000] py-[10px]">{{$t('guide.content7')}}</div>
    </div>
    
    
    

    </div>
     
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useCommonStore } from '@/store/modules/common';
import {getConfigByLang} from "../../api/apis"
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const incomeGuideEn = ref('')
const commonStore = useCommonStore();

// 把 store 的 lang（如 'zhTW'）映射成真正传给后端的语言码（如 'zh_tw'）
const parLang = computed(() => {
  // 假设你的 store 里实现了 getter：getValueByKey(key) => value|null
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang; // 映射不到就用原值兜底
});

const guideArr =[
  {
    title: `${t('guide.title10')}`,
    num:100,
    num1:10
  },
  {
    title: `${t('guide.title11')}`,
    num:500,
    num1:60
  },
  {
    title: `${t('guide.title12')}`,
    num:1000,
    num1:120
  },
  {
    title: `${t('guide.title13')}`,
    num:1600,
    num1:200
  },
  {
    title: `${t('guide.title14')}`,
    num:5500,
    num1:1200
  },
  {
    title: `${t('guide.title15')}`,
    num:10000,
    num1:2400
  },
]

const advanArr = [
  {
    num:"1,500-9,999",
    num1:4
  },
  {
    num:"10,000-19,999",
    num1:8
  },
  {
    num:"20,000-49,999",
    num1:4
  },
  {
    num:`50,000- ${t('guide.title22')}`,
    num1:4
  }

]

const guide = [
  {
    day:2,
    money:130
  },
  {
    day:4,
    money:'1,200'
  },
  {
    day:7,
    money:'1,500'
  },
  {
    day:15,
    money:'1,800'
  },
  {
    day:30,
    money:'2,370'
  },
]


const getGetGlobalConfig = async() =>{
  console.log("parLang",parLang);
  
    // 这里一定要用 .value
    let res = await getConfigByLang({ lang: parLang.value });
    incomeGuideEn.value = res?.data?.incomeGuide ?? '';
}
onMounted(() =>{
    getGetGlobalConfig();
})
const onClickLeft = () => history.back();
</script>
<style scoped>
  .guideBg {
    width: 100%;
    background-image: url(@/static/images/guideBg.png);
    background-size: 100% 100%;
  }
</style>