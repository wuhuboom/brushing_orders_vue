<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]">
    <div
      class="w-full p-6 box-border flex flex-col font-montserrat text-[#666]"
    >
      <van-nav-bar
        :title="$t('条款协议')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="mt-[30px] text-[#333333] text-[14px] leading-[30px]">
        <p class="mt-[13px]">{{$t('tc.title1')}}</p>
        <p class="mt-[13px]">{{$t('tc.title2')}}</p>
        <p class="mt-[13px]">{{$t('tc.title3')}}</p>
        <p class="mt-[13px]">{{$t('tc.title4')}}</p>
        <p class="mt-[13px]">{{$t('tc.title5')}}</p>
        <p class="mt-[13px]">{{$t('tc.title6')}}</p>
        <p class="mt-[13px]">{{$t('tc.title7')}}</p>
        <p class="mt-[13px]">{{$t('tc.title8')}}</p>
        <p class="mt-[13px]">{{$t('tc.title9')}}</p>
        <p class="mt-[13px]">{{$t('tc.title10')}}</p>
        <p class="mt-[13px]">{{$t('tc.title11')}}</p>
        <p class="mt-[13px]">{{$t('tc.title12')}}</p>
        <p class="mt-[13px]">{{$t('tc.title13')}}</p>
        <p class="mt-[13px]">{{$t('tc.title14')}}</p>
        <p class="mt-[13px]">{{$t('tc.title15')}}</p>
        <p class="mt-[13px]">{{$t('tc.title16')}}</p>
        <p class="mt-[13px]">{{$t('tc.title17')}}</p>
        <p class="mt-[13px]">{{$t('tc.title18')}}</p>
        <p class="mt-[13px]">{{$t('tc.title19')}}</p>
        <p class="mt-[13px]">{{$t('tc.title20')}}</p>
        <p class="mt-[13px]">{{$t('tc.title21')}}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getConfigByLang} from "../../api/apis"
import { useCommonStore } from '@/store/modules/common';
const onClickLeft = () => history.back();
const registerProtocolEn = ref('');
const commonStore = useCommonStore();
const parLang = computed(() => {
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang; 
});
const getGetGlobalConfig = async() =>{
    let res = await getConfigByLang({ lang: parLang.value });
    registerProtocolEn.value = res?.data?.registerProtocol ?? '';
    console.log("res",res)
}
onMounted(() =>{
    getGetGlobalConfig();
})
</script>
