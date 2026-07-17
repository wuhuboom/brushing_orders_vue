<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]" @scroll="handleScroll">
	<van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
	  <van-nav-bar
	    :title="$t('证书')"
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
	  :title="$t('证书')"
	  fixed
	  left-arrow
	  @click-left="onClickLeft"
	>
	  <template #left>
		<img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
	  </template>
	</van-nav-bar>
    <div class="container w-full min-h-[100vh] bg-[#f4f4f5]">
      <div class="w-full p-6 box-border flex flex-col font-montserrat text-[#333] mt-10">
        <div v-html="certificateEn"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getGlobalConfig} from "../../api/apis"
const navBarShow = ref(false);
const certificateEn = ref('')
const getGetGlobalConfig = async() =>{
    let res = await getGlobalConfig();
    certificateEn.value = res.data.certificateEn
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
