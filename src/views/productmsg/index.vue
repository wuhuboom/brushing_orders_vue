<template>
  <div class="w-full min-h-[100vh] bg-[#ffff]">
    <div class="container w-full min-h-[100vh] bg-white">
      <van-nav-bar
        :title="$t(route.query.id)"
        fixed
        left-arrow
        class="shadow"
        @click-left="onClickLeft"
      />
      <div class="w-full mt-[35px] p-6 box-border flex flex-col font-montserrat text-[#333]">
        <!-- <div v-html="">{{  }}</div> -->
         {{route.query.name}}
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getConfigByLang} from "../../api/apis"
import { useCommonStore } from '@/store/modules/common';
import { useRoute } from "vue-router";
const faqEn = ref('')
const route = useRoute();
const commonStore = useCommonStore();
const parLang = computed(() => {
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang; 
});
// const getGetGlobalConfig = async() =>{
//     let res = await getConfigByLang({ lang: parLang.value });
//     faqEn.value = res?.data?.faq ?? '';
// }
onMounted(() =>{
    // getGetGlobalConfig();
    console.log(route.query)
})

const onClickLeft = () => history.back();
</script>
