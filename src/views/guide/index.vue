<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]">
    
    <div class="w-full p-6 box-border flex flex-col font-montserrat text-[#666]">
        <van-nav-bar
        :title="$t('收入指南')"
        fixed
        left-arrow
        @click-left="onClickLeft"
    />
     <div v-html="incomeGuideEn"></div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getGlobalConfig} from "../../api/apis"
const incomeGuideEn = ref('')
const getGetGlobalConfig = async() =>{
    let res = await getGlobalConfig();
    incomeGuideEn.value = res.data.incomeGuideEn
}
onMounted(() =>{
    getGetGlobalConfig();
})
const onClickLeft = () => history.back();
</script>