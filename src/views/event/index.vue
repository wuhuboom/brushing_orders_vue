<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]">
     <van-nav-bar
        :title="$t('事件')"
        fixed
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="w-full mt-10 box-border flex flex-col font-montserrat text-[#333]">
      <div v-html="latestEventEn"></div>
        
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getGlobalConfig} from "../../api/apis"
const latestEventEn = ref('')
const getGetGlobalConfig = async() =>{
    let res = await getGlobalConfig();
    latestEventEn.value = res.data.latestEventEn
    console.log(latestEventEn.value)
}
onMounted(() =>{
    getGetGlobalConfig();
})

const onClickLeft = () => history.back();
</script>
