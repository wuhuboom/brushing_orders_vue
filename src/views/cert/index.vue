<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]">
    <div class="container w-full min-h-[100vh] bg-white">
      <!-- <van-nav-bar
        :title="$t('证书')"
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
          {{ $t('证书')}}
        </div>
      </div>
      <div class="w-full p-6 box-border flex flex-col font-montserrat text-[#333] mt-10">
        <div v-html="certificateEn"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getGlobalConfig} from "../../api/apis"
const certificateEn = ref('');
const getGetGlobalConfig = async() =>{
    let res = await getGlobalConfig();
    certificateEn.value = res.data.certificateEn
}


onMounted(() =>{
    getGetGlobalConfig();
})

const onClickLeft = () => history.back();
</script>
