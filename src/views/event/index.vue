<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]">
     <van-nav-bar
        :title="$t('事件')"
        fixed
        left-arrow
        class="shadow"
        @click-left="onClickLeft"
    />
    <div class="mt-[45px] w-full text-center flex flex-col items-center justify-center text-[24px] text-[#2D1810] vipsBg font-bold" >
        <p class="pb-[20px]">{{$t('vips.str1')}} </p>
        <p>{{$t('vips.str2')}}</p>
      </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useCommonStore } from '@/store/modules/common';
import {getConfigByLang} from "../../api/apis"
const latestEventEn = ref('')
const commonStore = useCommonStore();

const parLang = computed(() => {
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang; 
});


const getGetGlobalConfig = async() =>{
    let res = await getConfigByLang({ lang: parLang.value });
    latestEventEn.value = res?.data?.latestEvent ?? '';
    console.log(latestEventEn.value)
}
onMounted(() =>{
    getGetGlobalConfig();
})

const onClickLeft = () => history.back();
</script>
<style scoped>
  .vipsBg {
   background: url(../../static/images/vipBg.png) no-repeat center;
  background-size: cover;
  height: 130px;
}
</style>
