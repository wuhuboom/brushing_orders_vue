<template>
  <div class="container w-full min-h-[100vh] bg-[#fffff]" @scroll="handleScroll">
	<van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
	  <van-nav-bar
	    :title="$t('客服')"
	    fixed
	    left-arrow
	    @click-left="onClickLeft"
	  >
	<!-- 	<template #left>
	  	  <img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
	    </template> -->
	  </van-nav-bar>
	</van-sticky>
	<HeaderTop></HeaderTop>
	<van-nav-bar
	  class="pos"
	  :title="$t('客服')"
	  fixed
	  left-arrow
	  @click-left="onClickLeft"
	>
	 <!-- <template #left>
		<img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
	  </template> -->
	</van-nav-bar>
	<div v-if="ready">
		<div v-if="!errorMsg">
			<div class="bg-[#000c30] p-5 text-center text-base font-bold text-white">
				 {{ $t("客服文案1") }}
			</div>
			<div class="w-full p-6 box-border flex flex-col ">
			  <div class="text-xs text-center text-[#4b4c5a] mt-1">
				 {{ $t("客服文案2") }} 
			  </div>
			  <div class=" flex flex-col mt-4">
			    <div
				  v-for="item in customerList"
				  @click="jump(item.linkUrl)"
			      class="flex items-center rounded-2.5 justify-between p-4 my-1 box-border border-[1px] border-[#e6e6e6] bg-[#ff8100]"
			    >
			      <div class="flex items-center text-white text-base font-medium">
			        {{ item.name }}
			      </div>
				  <!-- <img class="" src="@/static/images/base/right-white.png" style="width:22px" /> -->
				<van-icon class="w-[20px]" style="float: left;" name="arrow" size='22'></van-icon>
			    </div>
			  </div>
			<!--  <div class="py-1 mt-6 text-xl font-bold text-black ">
			  	 {{ $t("客服文案3") }}
			  </div>
			  
			  <div class="text-xs text-[#4b4c5a] mt-1">
			    {{ $t("客服文案4") }} 
			  </div> -->
			</div>
		</div>
		<div v-else> 
			<div class="bg-[#7c7c7c] p-5 text-center text-base font-bold text-white">
				 {{ errorMsg }}
			</div>
		</div>
	</div>
	
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from '../../store/modules/user';
import { computed, onMounted, ref } from 'vue';
import { getCustomerService } from '../../api/apis';
import { useCommonStore } from "../../store/modules/common";
import { errorMessages } from "../../api/errorCodeMap";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const commonStore = useCommonStore();
const userStore = useUserStore()
const router = useRouter();
const navBarShow = ref(false);
const customerList = ref([])
const ready = ref(false) 
const errorMsg = ref('')
const toPage = (path) => {
  router.push({
    path: path,
  });
};
onMounted(() => {
  userStore.getUserInfo()
  getCustomer()
})
const getCustomer = async() =>{
  // let res = await getCustomerService({lang: commonStore.clientLang});
  // customerList.value = res.data
  // ready.value = true
  
  await getCustomerService()
   .then((res) => {
  		customerList.value = res.data
  		ready.value = true
   })
   .catch((err) => {
    	if (err.code == 920) {
    	errorMsg.value = t(errorMessages[err.code])
    	ready.value = true
    	}  
   });
}

const jump = (url) =>{
  window.open(url)
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
