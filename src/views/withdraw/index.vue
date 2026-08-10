<template>
  <div v-if="ready" class="w-full min-h-[100vh] h-full withdraw  bg-[#ffffff]" @scroll="handleScroll">
	<van-sticky type="primary" style="z-index: 999" v-show="navBarShow">
	  <van-nav-bar
	    :title="$t('提取')"
	    fixed
	    left-arrow
	    @click-left="onClickLeft"
	  >
	  </van-nav-bar>
	</van-sticky>
	<HeaderTop></HeaderTop>
	<van-nav-bar
	  class="pos"
	  :title="$t('提取')"
	  fixed
	  left-arrow
	  @click-left="onClickLeft"
	>
	</van-nav-bar>

    <div class="mt-2">
	  <div class="p-4 box-border mb-2 flex flex-col">
	    <div
	      class="flex flex-col justify-between p-4 pl-8 box-border bg-[#6a8abb] box-shadow rounded-[6px]"
	    >
	      <div class="w-full flex items-center justify-between">
			<div class="text-black text-base font-bold">
			  {{ $t("账户金额") }}
			</div>
			<div class="flex items-center justify-between" @click="toPage('/withdrawRecords')">
			  <img class="w-6 mr-1" style="float: left;" src="@/static/images/base/icon-23.png"/>
			  <div class="text-[#000] text-base font-bold underline" style="float: left;">
			    {{ $t("历史") }}
			  </div>
			</div>
			<!-- <div>
			  {{ $t("账户金额") }}
			</div> -->
		  </div>
	      <div class="flex mt-4">
	        <div class="text-black text-2xl font-bold flex items-center">
	          {{ totalBalance }}
	        </div>
	        <div
	          class="text-black text-2xl font-bold flex items-center ml-2 "
	        >
	          {{ $t("美元") }}
	        </div>
	      </div>
	      <div
	        class="text-white opacity-70 text-xs font-semibold pt-8 pb-2"
	      >
	        {{ $t("您将在一小时内收到提款") }}
	      </div>
	    </div>
	  </div>
	  
	  <div class="mx-4 bg-[#6a8abb] py-1 rounded-[6px]">
		<div class="py-2 px-6  border-b-[1px] border-[#fff]">
			<div class="py-2 flex items-center justify-between">
			  <div class="flex items-center justify-between">
			    <div class="text-[#000] text-base font-bold">
			      {{ $t("有效金额") }}
			    </div>
			  </div>
			 <div class="text-[#000] text-xl font-normal">
			  	{{ amount }} {{ $t("美元") }}
			  </div>	
			</div>
		</div>
		<div class="py-2 px-6">
			<div class="py-2 flex items-center justify-between">
			  <div class="flex items-center justify-between">
			    <div class="text-[#000] text-base font-bold">
			      {{ $t("冻结金额") }}
			    </div>
			  </div>
			  <div class="text-[#000] text-xl font-normal">
			  	{{ frozenBalance }} {{ $t("美元") }}
			  </div>	
			</div>
		</div>
	  </div>
	  
	  <div class="p-4 font-bold text-base text-black ">
	    {{ $t("提款金额") }}  
	  </div>
	  <el-form
	    ref="ruleFormRef"
	    :model="ruleForm"
	    status-icon
	    :rules="rules"
	    label-width="auto"
	    class="w-full  px-4"
	  >
		<el-form-item
		  :label="$t('withdrawalAccount')"
		  prop="amount"
		  label-position="top"
		  class="p-4 bg-[#f9f9f9] border-[#e9ebe9] border-[1px] font-bold"
		>
		  <div v-if="walletInfo.id" @click="toPage('/paymentMethods')" class="w-full">
			  <p class="text-xl text-[#ff8100]">{{walletInfo.network}}</p>
			  <p>{{$t('钱包') }}: {{walletInfo.wallet}}</p>
			  <p>{{$t('地址') }}: {{walletInfo.address}}</p>
		  </div>
		  <el-input
		    v-else
		    type="number"
		    autocomplete="off"
		    size="large"
			readonly
			@click="toPage('/paymentMethods')"
		  >
		    <template #suffix>
		      
			  <img style="float: right;" class="w-[20px]" src="@/static/images/base/right.png"/>
		    </template>
		  </el-input>
		</el-form-item>
	    <el-form-item
	      :label="$t('提款金额')"
	      prop="amount"
	      label-position="top"
		  class="p-4 bg-[#f9f9f9] border-[#e9ebe9] border-[1px] font-bold"
	    >
	      <el-input
	        v-model="ruleForm.amount"
	        type="number"
	        :placeholder="$t('提款金额')"
	        autocomplete="off"
	        size="large"
	      >
	        <template #suffix>
	          <el-button
	            type="primary"
				class="all"
	            @click="All"
	            size="default"
	            >{{ $t("全部") }}</el-button
	          >
	        </template>
	      </el-input>
	    </el-form-item>
	    <el-form-item 
		  :label="$t('交易密码')" 
		  label-position="top"
		  class="p-4 bg-[#f9f9f9] border-[#e9ebe9] border-[1px] font-bold"
		>
	      <el-input
	        v-model="ruleForm.tradePassword"
	        :placeholder="$t('交易密码')"
	        :type="isPwd ? 'password' : 'text'"
	        autocomplete="off"
	        size="large"
	      >
	        <template #suffix>
	          <van-icon
			    size="28px"
	            :name="isPwd ? 'eye' : 'eye-o'"
	            @click="isPwd = !isPwd"
	          />
	        </template>
	      </el-input>
		  
	    </el-form-item>
	  </el-form>
	  
	  <div class="w-full pl-5 pr-5 mt-8 mb-12">
		<div @click="getWithdrawal" class="w-full" size="large" round>
		  <div
		    class="w-full text-white text-2xl font-semibold mx-auto py-4 rounded-lg flex items-center justify-center bg-[#ff8100]"
		  >
		    <div>{{ $t("提取") }}</div>
		  </div>
		</div>
	  </div>
    </div>
  </div>
</template>
<script setup>
const bgImage = new URL("@/static/images/bg-3.png", import.meta.url).href;
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { getWithdrawals, withdrawal, getTradeConfig,userGetInfo, getWallet } from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import {formatWithTimezone} from '../../util/utils'
import {
  showLoadingToast,
  closeToast,
  showFailToast,
  showSuccessToast,
  showToast
} from "vant";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const router = useRouter();
const orderActive = ref(0);
const active = ref(0);
const list = ref([]);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const amount = ref("");
const totalBalance = ref("");
const frozenBalance = ref("");
const isPwd = ref(true)
const userStore = useUserStore();
const ready = ref(false);
const { t } = useI18n();
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  status: "1",
});
const navBarShow = ref(false);
const onClickLeft = () => history.back();
const ruleForm = reactive({
  amount: "",
  tradePassword: "",
  walletId: null
});

const toPage = (path) => {
  router.push({
    path: path,
  });
};

const All = () => {
  // console.log(amount.value);
  ruleForm.amount = amount.value;
};
const getWithdrawal = () => {
  if (!ruleForm.amount) return showToast(t('请输入金额'));
  if (!ruleForm.tradePassword) return showToast(t('请输入交易密码'));
  ruleForm.walletId = walletInfo.value.id;
  withdrawal(ruleForm).then((res) => {
    showSuccessToast(t("提现成功"));
	ruleForm.amount = ''
	ruleForm.tradePassword = ''
    // router.push({ path: "/my" });
  });
};
const TradeInfor = ref({});

const tradeConfig = async () => {
  let res = await getTradeConfig();
  TradeInfor.value = res.data;
};

// const walletInfo = ref({
// 	withdrawName:null,
// 	withdrawAddress:null,
// 	withdrawType:null
// });
onMounted( () => {
  tradeConfig();
  userGetInfo().then((res) => {
    amount.value = res.data.balance;
    // ruleForm.amount = amount.value;
	frozenBalance.value = res.data.frozenBalance;
	totalBalance.value = res.data.totalBalance;
	
	// walletInfo.withdrawName = res.data.withdrawName;
	// walletInfo.withdrawAddress = res.data.withdrawAddress;
	// walletInfo.withdrawType = res.data.withdrawType;
	
  });
  getUserWallet();
});

// const bankItem = ref("");
// const bankWallet = ref([]);
const walletInfo = ref({
	id: null,
	wallet: "",
	address: "",
	network: "",
});

const getUserWallet = async () => {
    let res = await getWallet();
	if(res.data){
		walletInfo.value = res.data
	}
	
	ready.value = true;
    // bankWallet.value = res.data || [];
};

function handleScroll(e) { 
  const scrollTop = e.target.scrollTop
  if(scrollTop> 90){
	  navBarShow.value = true
  }else{
	  navBarShow.value = false
  }
}
</script>
<style>
.withdraw .el-input__wrapper {
  /* border: 1px solid #005713; */
  border: 0px !important;
  box-shadow: none !important;
  padding: 0 0;
}
.el-form-item__label{
	margin-bottom: 0;
}
.all{
	border-radius: 0;
	background-color: #ff8100;
	border-color: #ff8100;
	padding: 0px 10px;
	height: 24px;
}
</style>
