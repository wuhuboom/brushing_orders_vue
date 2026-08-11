<template>
  <div class="w-full min-h-[100vh] h-full bg-[#e6e6e6]" @scroll="handleScroll">
	<van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
	  <van-nav-bar
	    :title="$t('事件')"
	    fixed
	    left-arrow
	    @click-left="onClickLeft"
	  >
	  </van-nav-bar>
	</van-sticky>
	<HeaderTop></HeaderTop>
	<van-nav-bar
	  class="pos"
	  :title="$t('事件')"
	  fixed
	  left-arrow
	  @click-left="onClickLeft"
	>
	</van-nav-bar>
     
    <div class="w-full mt-4 p-6 box-border flex flex-col font-montserrat text-[#333]">
      <div v-html="latestEventEn"></div>
        
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getGlobalConfig} from "../../api/apis"
import { useCommonStore } from "../../store/modules/common";
const commonStore = useCommonStore();
const latestEventEn = ref('')
const navBarShow = ref(false);
const getGetGlobalConfig = async() =>{
    let res = await getGlobalConfig({lang: commonStore.clientLang});
    latestEventEn.value = res.data.latestEvent
    // console.log(latestEvent.value)
}
onMounted(() =>{
    getGetGlobalConfig();
})

function handleScroll(e) { 
  const scrollTop = e.target.scrollTop
  if(scrollTop> 90){
	  navBarShow.value = true
  }else{
	  navBarShow.value = false
  }
}
const onClickLeft = () => history.back();
</script>
