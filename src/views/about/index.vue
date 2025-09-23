<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]">
    <div class="container w-full min-h-[100vh] bg-white">
      <!-- <van-nav-bar
        :title="$t('关于')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      /> -->
      <div class="flex items-center relative bg-[#000]">
        <!-- 左侧箭头 -->
        <div class="absolute left-3" @click="onClickLeft">
          <van-icon name="arrow-left" color="#fff" size="22px" />
        </div>
        <!-- 中间标题 -->
        <div class="mx-auto text-white text-[18px] py-[20px]">
          {{ $t('关于')}}
        </div>
      </div>
      <div class="w-full p-6 box-border flex flex-col font-montserrat text-[#333]">
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
