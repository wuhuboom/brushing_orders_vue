<template>
  <div class="container bg-white w-full min-h-[100vh]">
    
    <div class="w-full p-6 box-border flex flex-col font-montserrat text-[#666]">
        <van-nav-bar
        :title="incomeGuide.noticeTitle"
        fixed
        left-arrow
        @click-left="onClickLeft"
    />
     <div class="mt-10 w-full box-border flex flex-col  text-[#666]" v-html="incomeGuide.noticeContent"></div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getNotice} from "../../api/apis"
import { useRouter ,useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

console.log(route)
const incomeGuide = ref({})
const getGetGlobalConfig = async() =>{
    let params = {
        id:route.query.id
    }
    let res = await getNotice(params);
    incomeGuide.value = res.data
}
onMounted(() =>{
    getGetGlobalConfig();
})
const onClickLeft = () => history.back();
</script>