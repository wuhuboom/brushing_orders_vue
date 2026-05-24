<template>
  <div class="productmsg-page min-h-screen bg-[#eef2fb]">
    <PageTopBar :title="$t(route.query.id)" show-back @click-left="onClickLeft" />

    <div class="productmsg-page__body">
      <section class="productmsg-page__card">
        {{ route.query.name }}
      </section>
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

<style scoped>
.productmsg-page__body {
  padding: 92px 20px 32px;
}

.productmsg-page__card {
  padding: 22px 18px;
  border-radius: 22px;
  background: #ffffff;
  color: #121826;
  font-size: 16px;
  line-height: 1.7;
  box-shadow: 0 10px 30px rgba(18, 25, 38, 0.04);
}
</style>
