<template>
  <div class="container w-full min-h-[100vh] bg-[#ecf7ff]" @scroll="handleScroll">
	<van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
	  <van-nav-bar
	    :title="$t('登出')"
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
	  :title="$t('登出')"
	  fixed
	  left-arrow
	  @click-left="onClickLeft"
	>
	  <template #left>
		<img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
	  </template>
	</van-nav-bar>
    <div class="w-full p-6 mt-8 box-border flex flex-col ">
	  <div class="w-full mt-10 text-center ml-[25%]">
		  <img class="w-[50%]" src="@/static/images/base/icon-36.png"/>
	  </div>
	  <div class="py-2 mt-10 text-center text-xl font-bold text-black">
	  	 {{ $t("退出文案1") }}
	  </div>
	  <div class="text-xs text-center text-[#4b4c5a] mt-3 mb-5">
	  		 {{ $t("退出文案2") }} 
	  </div>
	  
      <div class=" flex flex-col mt-4">
        <div
		  @click="onClickLeft()"
          class="text-center p-[20px] my-1.5 rounded-2.5 box-border border-[1px] border-[#000] bg-[#000]"
		>
          <div 
			class="text-center text-white text-base font-medium"
		  >
            {{ $t('退出文案3') }}
          </div>
		</div>
		<div
		  @click="out()"
		  class="text-center p-[20px] my-1.5 rounded-2.5 box-border border-[1px] border-[#000] bg-[#fff]"
		>
		  <div 
			class="text-center text-black text-base font-medium"
		  >
		    {{ $t('退出文案4') }}
		  </div>
		</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useUserStore } from '../../store/modules/user';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from "vue-router";
import { useCommonStore } from "../../store/modules/common";
import { getStaticImageUrl } from "../../util/utils";
const userStore = useUserStore()
const router = useRouter();
const commonStore = useCommonStore();
const navBarShow = ref(false);
const toPage = (path) => {
  router.push({
    path: path,
  });
};
onMounted(() => {
  userStore.getUserInfo()
})

function out(item) {
  userStore.logout();
}


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

<style scoped>
.current{
	background-color: #000;
}
</style>