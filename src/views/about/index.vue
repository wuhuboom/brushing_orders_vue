<template>
  <div class="w-full min-h-[100vh] bg-[#fff]">
    <div class="container w-full min-h-[100vh] bg-white">
      <PageTopBar :title="$t('about')" show-back @click-left="onClickLeft" />
      <div class="w-full pt-[85px] p-6 box-border flex flex-col font-montserrat text-[#333]">
        <div v-html="aboutUsEn"></div>
      </div>
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
