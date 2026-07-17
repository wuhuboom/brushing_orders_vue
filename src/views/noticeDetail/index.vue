<template>
  <div class="container bg-[#ecf4ff] w-full min-h-[100vh]" @scroll="handleScroll">
    <van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
      <van-nav-bar
        :title="incomeGuide.noticeTitle"
        fixed
        left-arrow
        @click-left="onClickLeft"
      >
    	<template #left>
      	  <img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <HeaderTop></HeaderTop>
    <van-nav-bar
      class="pos"
      :title="incomeGuide.noticeTitle"
      fixed
      left-arrow
      @click-left="onClickLeft"
    >
      <template #left>
    	<img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
      </template>
    </van-nav-bar>
    <div class="w-full p-6 box-border flex flex-col font-montserrat text-[#666]">
       
     <div class="mt-3 w-full box-border flex flex-col  text-[#666]" v-html="incomeGuide.noticeContent"></div>
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
const navBarShow = ref(false);
const getGetGlobalConfig = async() =>{
    let params = {
        id:route.query.id
    }
    let res = await getNotice(params);
    incomeGuide.value = res.data
}
function handleScroll(e) { 
  const scrollTop = e.target.scrollTop
  if(scrollTop> 90){
	  navBarShow.value = true
  }else{
	  navBarShow.value = false
  }
}
onMounted(() =>{
    getGetGlobalConfig();
})
const onClickLeft = () => history.back();
</script>