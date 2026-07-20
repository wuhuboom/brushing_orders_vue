<template>
  <div class="w-full min-h-[100vh] bg-[#e6e6e6]" @scroll="handleScroll">
	<van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
	  <van-nav-bar
	    :title="$t('条款及细则')"
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
	  :title="$t('条款及细则')"
	  fixed
	  left-arrow
	  @click-left="onClickLeft"
	>
	  <template #left>
		<img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
	  </template>
	</van-nav-bar>
    <div class="container w-full min-h-[100vh] bg-[#e6e6e6]">
      
      <div class="w-full mt-4 p-6 box-border flex flex-col font-montserrat text-[#333]">
        <div v-html="termsEn"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getGlobalConfig} from "../../api/apis"
import { useCommonStore } from "../../store/modules/common";
const commonStore = useCommonStore();
const termsEn = ref('')
const navBarShow = ref(false);
const getGetGlobalConfig = async() =>{
    let res = await getGlobalConfig({lang: commonStore.clientLang});
    termsEn.value = res.data.terms
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
