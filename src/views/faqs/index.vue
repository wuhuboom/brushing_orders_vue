<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]">
    <div class="container w-full min-h-[100vh] bg-white">
      <van-nav-bar
        :title="$t('常见问题解答')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="w-full p-6 box-border flex flex-col font-montserrat text-[#333]">
        <div v-html="faqEn"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getGlobalConfig} from "../../api/apis"
const faqEn = ref('')
const getGetGlobalConfig = async() =>{
    let res = await getGlobalConfig();
    faqEn.value = res.data.faqEn
}
onMounted(() =>{
    getGetGlobalConfig();
})

const onClickLeft = () => history.back();
</script>
