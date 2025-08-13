<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]">
    <div class="container w-full min-h-[100vh] bg-white">
      <van-nav-bar
        :title="$t('关于')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="w-full mt-10 p-6 box-border flex flex-col font-montserrat text-[#333]">
        <div v-html="aboutUsEn"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getGlobalConfig} from "../../api/apis"
const aboutUsEn = ref('')
const getGetGlobalConfig = async() =>{
    let res = await getGlobalConfig();
    aboutUsEn.value = res.data.aboutUsEn
}
onMounted(() =>{
    getGetGlobalConfig();
})

const onClickLeft = () => history.back();
</script>
