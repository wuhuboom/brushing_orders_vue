<template>
  <div class="w-full min-h-[100vh] bg-[#fff]">
    <div class="container w-full min-h-[100vh] bg-white">
      <van-nav-bar
        :title="$t('证书')"
        fixed
        class="shadow"
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="w-full p-6 box-border flex flex-col font-montserrat text-[#333] mt-[85px]">
        <div v-html="certificateEn"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getConfigByLang} from "../../api/apis"
import { useCommonStore } from '@/store/modules/common';
const certificateEn = ref('')
const commonStore = useCommonStore();
const parLang = computed(() => {
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang; 
});
const getGetGlobalConfig = async() =>{
    let res = await getConfigByLang({ lang: 'en' });
    certificateEn.value = res?.data?.certificateContent?? '';
}
onMounted(() =>{
    getGetGlobalConfig();
})

const onClickLeft = () => history.back();
</script>
