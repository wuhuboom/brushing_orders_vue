<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]">
    <div class="container w-full min-h-[100vh] bg-white">
      <van-nav-bar
        :title="$t('证书')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="w-full p-6 box-border flex flex-col font-montserrat text-[#333]">
        <div v-html="certificateEn"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getGlobalConfig} from "../../api/apis"
const certificateEn = ref('')
const getGetGlobalConfig = async() =>{
    let res = await getGlobalConfig();
    certificateEn.value = res.data.certificateEn
}
onMounted(() =>{
    getGetGlobalConfig();
})

const onClickLeft = () => history.back();
</script>
