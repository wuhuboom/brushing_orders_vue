<template>
  <div class="w-full min-h-[100vh] bg-[#ecf7ff]" @scroll="handleScroll">
	<van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
	  <van-nav-bar
	    :title="$t('付款方式')"
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
	  :title="$t('付款方式')"
	  fixed
	  left-arrow
	  @click-left="onClickLeft"
	>
	  <template #left>
		<img class="rotate-180" src="@/static/images/base/right.png" style="width:22px" />
	  </template>
	</van-nav-bar>
   <div class="p-4 box-border mb-2 flex flex-col">
	   <div class="text-xs pl-5 pr-5 text-[#333] mb-4 mt-8">
	     {{
	       $t(
	         "尊敬的用户，请填写您的TRC-20/ERC-20地址。请勿输入您的银行账户信息和密码。"
	       )
	     }}
	   </div>
	   <div class="w-full overflow-hidden bg-[#f9f9f9]  border-[1px] border-[#e6e6e6] py-1 pt-4">
	     <div class="ml-6 font-bold text-base">
	   	 {{$t('钱包') }}
	     </div>
	     <van-cell-group inset>
	       <van-field
	   	  type="text"
	         v-model="form.withdrawName"
	         :placeholder="$t('钱包')"
	       />
	     </van-cell-group>
	   </div>
	   <div class="w-full mt-4 overflow-hidden bg-[#f9f9f9]  border-[1px] border-[#e6e6e6] py-1 pt-4">
	     <div class="ml-6 font-bold text-base">
	   	 {{$t('网络') }}
	     </div>
	     <van-cell-group inset>
	       <van-field
	   	  type="text"
	         v-model="form.withdrawType"
	         :placeholder="$t('网络')"
	       />
	     </van-cell-group>
	   </div>
	   <div class="w-full mt-4 overflow-hidden bg-[#f9f9f9]  border-[1px] border-[#e6e6e6] py-1 pt-4">
	     <div class="ml-6 font-bold text-base">
	   	 {{$t('地址') }}
	     </div>
	     <van-cell-group inset>
	       <van-field
	   	  type="text"
	         v-model="form.withdrawAddress"
	         :placeholder="$t('地址')"
	       />
	     </van-cell-group>
	   </div>
	</div>
	
	
	
  <!--  <div class="w-full mt-10">
      <van-button color="#007513" class="w-full" @click="submitForm">{{
        $t("更新")
      }}</van-button>
    </div> -->
	<div class="w-full pl-4 pr-4 mt-10 mb-12">
	  <div @click="submitForm" class="w-full" size="large" round>
	    <div
	      class="w-full text-white text-2xl font-semibold mx-auto py-4 rounded-lg flex items-center justify-center bg-black"
	    >
	      <div>{{ $t("更新") }}</div>
	    </div>
	  </div>	
	</div>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import { addWithdrawalMethod } from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  showToast
} from "vant";
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();
const form = reactive({
  withdrawName: "",
  withdrawAddress: "",
  withdrawType: "",
});
const navBarShow = ref(false);
const submitForm = async () => {
  if (!form.withdrawName) return showToast(t("请输入钱包名称"));
  if (!form.withdrawAddress) return showToast(t("请输入网络"));
  if (!form.withdrawAddress) return showToast(t("请输入地址"));
  let res = await addWithdrawalMethod(form);
  showToast(t("添加成功"))
  router.push({ path: "/my" });
};

const onClickLeft = () => history.back();
onMounted(async () => {
  await userStore.getUserInfo();
  form.withdrawName = userStore.userInfo.withdrawName;
  form.withdrawAddress = userStore.userInfo.withdrawAddress;
  form.withdrawType = userStore.userInfo.withdrawType;
});

function handleScroll(e) { 
  const scrollTop = e.target.scrollTop
  if(scrollTop> 90){
	  navBarShow.value = true
  }else{
	  navBarShow.value = false
  }
}
</script>

<style scoped>
:deep(.van-cell){
	padding: 6px 8px !important;
}
</style>
