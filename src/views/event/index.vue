<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]">
     <van-nav-bar
        :title="$t('事件')"
        fixed
        left-arrow
        class="shadow"
        @click-left="onClickLeft"
    />
    <div class="w-full mt-[65px] box-border flex flex-col font-montserrat text-[#333]">
      <div v-html="latestEventEn"></div>
        
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
