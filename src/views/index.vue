<template>
  <div class="flex flex-col w-full h-[100vh] bg bg-cover bg-center p-3">
 
    <div class="flex flex-col items-center  pb-1 py-8">
	  <img
        src="@/static/images/login_logo.png"
        alt=""
        class="w-[40%] lg:w-[300px] mt-10 pt-20"
      />
	  <div class="text-2xl text-main-bg text-center py-6 pt-24">
	  		  {{ $t("企业名") }}
	  </div>
	  <div class="text-sm pb-8">
	  	{{ $t("开始创建你的账户")}}
	  </div>
	  
	  
    </div>
	<div class="fixed bottom-16 left-0 right-0 py-8 w-[90%] ml-[5%]">
			  <div @click="toRegister()" class="w-full" size="large" round>
			    <div
			      class="w-full text-white text-2xl font-semibold mx-auto py-5 rounded-lg flex items-center justify-center bg-black"
			    >
			      <div>{{ $t("创建账户") }}</div>
			    </div>
			  </div>
			  <div @click="toLogin()" class="w-full" size="large" round>
			    <div
			      class="w-full text-black text-2xl font-semibold mx-auto py-5 rounded-lg flex items-center justify-center my-4 bg-white border border-[#000]"
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

onMounted(() => {
  document.getElementById("app").style.background = "#fff";
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
</style>
