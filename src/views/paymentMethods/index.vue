<template>
  <div v-if="ready" class="w-full min-h-[100vh] bg-[#fff]" @scroll="handleScroll">
	<van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
	  <van-nav-bar
	    :title="$t('付款方式')"
	    fixed
	    left-arrow
	    @click-left="onClickLeft"
	  >
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
	         v-model="form.wallet"
	         :placeholder="$t('钱包')"
	       />
	     </van-cell-group>
	   </div>
	   <div class="w-full mt-4 overflow-hidden bg-[#f9f9f9]  border-[1px] border-[#e6e6e6] py-1 pt-4">
	     <div class="ml-6 font-bold text-base">
	   	 {{$t('网络') }}
	     </div>
	     <van-cell-group inset>
	      <!-- <van-field
			type="text"
	         v-model="form.withdrawType"
	         :placeholder="$t('网络')"
	       /> -->
			<el-select
			  v-model="form.network"
			  size="large"
			  :placeholder="$t('网络')"
			 >
			<el-option
			  v-for="item in typeRef"
			  :key="item.value"
			  :label="item.label"
			  :value="item.value">
			</el-option>
			 </el-select>
	     </van-cell-group>
	   </div>
	   <div class="w-full mt-4 overflow-hidden bg-[#f9f9f9]  border-[1px] border-[#e6e6e6] py-1 pt-4">
	     <div class="ml-6 font-bold text-base">
	   	 {{$t('地址') }}
	     </div>
	     <van-cell-group inset>
	       <van-field
	   	  type="text"
	         v-model="form.address"
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
	      class="w-full text-white text-2xl font-semibold mx-auto py-4 rounded-lg flex items-center justify-center bg-[#ff8100]"
	    >
	      <div>{{ $t("更新") }}</div>
	    </div>
	  </div>	
	</div>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import { addWithdrawalMethod, getWallet, addWallet } from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  showToast
} from "vant";
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();
const ready = ref(false); 
const form = reactive({
  id: null,
  wallet: "",
  address: "",
  network: "",
});

const typeRef = reactive([
	{value: "BTC",label: 'BTC'},
	{value: "ETH",label: 'ETH'},
	{value: "ERC-USDT ",label: 'ERC-USDT '},
	{value: "TRC-USDT",label: 'TRC-USDT'}
])
const navBarShow = ref(false);
const submitForm = async () => {
  if (!form.wallet) return showToast(t("请输入钱包名称"));
  if (!form.network) return showToast(t("请输入网络"));
  if (!form.address) return showToast(t("请输入地址"));
  let res = await addWallet(form);
  showToast(t("添加成功"))
  // router.push({ path: "/my" });
  // history.back()
};

const onClickLeft = () => history.back();
onMounted(() => {
  getWallet().then((res) => {
	if(res.data){
		form.wallet = res.data.wallet;
		form.address = res.data.address;
		form.network = res.data.network;
		form.id = res.data.id;
	}
	ready.value = true;
  });
  // await userStore.getUserInfo();
  // form.withdrawName = userStore.userInfo.withdrawName;
  // form.withdrawAddress = userStore.userInfo.withdrawAddress;
  // form.withdrawType = userStore.userInfo.withdrawType;
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
:deep(.el-select--large .el-select__wrapper){
	padding: 8px 8px;
	border: 0px;
	box-shadow: 0px 0px 0px 0px;
	background: #f8f8f8;
}
</style>
