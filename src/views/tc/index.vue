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
      <div class="mt-10" v-html="registerProtocolEn">

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
