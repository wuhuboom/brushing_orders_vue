<template>
  <div class="flex flex-col w-full h-[100vh] bg bg-cover bg-center"  v-if="ready">
 
    <div class="flex flex-col items-center  pb-1 py-5 my-20">
	  <img
        src="@/static/images/logo.png"
        alt=""
        class="w-[70%] lg:w-[300px] py-5"
      />
    </div>
	<div class=" py-6 w-full  headBg inline-block text-center text-[#fff]">
      <div class="text-[20px] leading-tight m-8 mt-20 ">
		  {{ $t("index_label1") }}
	  </div>
	  <div class="text-xs m-6 ">
	    {{ $t("index_label2") }}
	  </div>	  
	
	  <div @click="toRegister()" class="w-[80%] ml-[10%]  mt-20 " size="large" round>
	    <div
	      class="w-full text-white text-2xl font-semibold mx-auto py-4 rounded-lg flex items-center justify-center bg-[#ff8100]"
	    >
	      <div>{{ $t("创建账户") }}</div>
	    </div>
	  </div>
	  <div @click="toLogin()" class="w-[80%] ml-[10%] mb-8" size="large" round>
	    <div
	      class="w-full text-white text-2xl font-semibold mx-auto py-4 rounded-lg flex items-center justify-center my-4 bg-[#6e7482]"
	    >
	      <div>{{ $t("登录") }}</div>
	    </div>
	  </div>		  
	</div>
  </div>
</template>
<script setup>
import Tabs from "@/components/Tabs.vue";
import { useUserStore } from "@/store/modules/user";
import ContactUs from "@/components/ContactUs.vue";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { showLoadingToast,closeToast,showFailToast,showSuccessToast,showToast   } from 'vant';
import { useCommonStore } from '@/store/modules/common';
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
const ContactUsRef = ref(null);
const ready = ref(false) 
const userStore = useUserStore();

onMounted(() => {
  document.getElementById("app").style.background = "#fff";

	if( userStore.token){
		router.push({ path: "/home" });
	}else{
		ready.value = true
	}
});

onUnmounted(() => {
  document.getElementById("app").style.background = "transparent";
});

const router = useRouter();
const { t } = useI18n();
const rules = computed(() => {
  return {};
});

const toRegister= () => {
	router.push({ path: "/account/register" });
}

const toLogin= () => {
	router.push({ path: "/account/login" });
}

</script>

<style scoped>
.headBg{
	/* background-image: linear-gradient(to right, #243c5e, #0d1f3b, #243c5e); */
	
  background-image: url(@/static/images/home/Frame-68.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
