<template>
  <div class="w-full min-h-[100vh] bg-[#f7f7f7]">
     <van-nav-bar
        :title="$t('事件')"
        fixed
        left-arrow
        class="shadow"
        @click-left="onClickLeft"
    />
    <div class="mt-[45px] w-full text-center flex flex-col items-center justify-center  vipsBg" >
        <p class="pb-[8px] text-[20px] text-[#2D1810] font-bold">{{$t('event.title1')}} </p>
        <p class="text-[#2D1810] text-[12px]">{{$t('event.title2')}}</p>
    </div>
    <div class="px-[16px] mt-[16px]">
      <div class="grid grid-cols-4 gap-4 text-center place-items-center bg-[#2D1810] text-[11px] text-[#fff] py-[5px] px-[10px]">
        <div>{{$t('event.title3')}}</div>
        <div>{{$t('event.title4')}}</div>
        <div>{{$t('event.title5')}}</div>
        <div>{{$t('event.title6')}}</div>
      </div>
      <div class="bg-[#fff] px-[10px]">
        <div v-for="item in vipsArr" class="grid grid-cols-4 gap-4 text-center place-items-center text-[11px] text-[#000] py-[5px] px-[10px]" style="border-bottom: 1px solid #D0D0D0;">
          <div>
            <img class="w-[15px] h-[15px]" src="@/static/images/star.png" alt="">
            VIP{{item.str1}}
          </div>
          <div>{{item.str2}}%</div>
          <div><span>{{item.str3}}</span> {{$t('event.str')}}</div>
          <div>USD{{item.str4}}</div>
        </div>
      </div>
      <div class="text-[14px] text-[#2D1810] pt-[20px]">
        {{$t('event.content1')}}
      </div>
      <div class="text-[12px] text-[#374151] pt-[14px]">
        {{$t('event.content2')}}
      </div>
      <div class="text-[14px] text-[#2D1810] pt-[16px]">
        {{$t('event.content3')}}
      </div>
      <div class="text-[12px] text-[#374151] pt-[14px]">
        {{$t('event.content4')}}
      </div>
      <div class="text-[12px] text-[#374151] ">
        {{$t('event.content5')}}
      </div>
      <div class="text-[12px] text-[#374151] ">
        {{$t('event.content6')}}
      </div>
      <div class="text-[12px] text-[#374151]">
        {{$t('event.content7')}}
      </div>
      <div class="text-[14px] text-[#2D1810] pt-[16px]">
        {{$t('event.content8')}}
      </div>
      
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useCommonStore } from '@/store/modules/common';
import {getConfigByLang} from "../../api/apis"
const latestEventEn = ref('')
const commonStore = useCommonStore();
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const parLang = computed(() => {
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang; 
});


const getGetGlobalConfig = async() =>{
    let res = await getConfigByLang({ lang: parLang.value });
    latestEventEn.value = res?.data?.latestEvent ?? '';
    console.log(latestEventEn.value)
}
const vipsArr = [
  {
    str1:1,
    str2:0.5,
    str3:40,
    str4:'100-499'
  },
  {
    str1:2,
    str2:1.0,
    str3:45,
    str4:'500-1599'
  },
  {
    str1:3,
    str2:1.5,
    str3:50,
    str4:'1600-5499'
  },
  {
    str1:4,
    str2:2.0,
    str3:55,
    str4:'5500-9999'
  },
  {
    str1:5,
    str2:2.5,
    str3:60,
    str4:`10000-${t('event.str1')}`
  }
]
onMounted(() =>{
    getGetGlobalConfig();
})

const onClickLeft = () => history.back();
</script>
<style scoped>
  .vipsBg {
   background: url(../../static/images/eventBg.png) no-repeat center;
  background-size: cover;
  height: 80px;
}
</style>
