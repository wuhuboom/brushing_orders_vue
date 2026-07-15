<template>
  <div class="flex flex-col w-full h-[100vh] bg bg-cover bg-center p-3">
    <div class="flex flex-col items-center mt-5 pb-3">
     <!-- <img
        src="@/static/images/account-lang.png"
        alt=""
        class="w-5 h-5 self-end mb-4"
        @click="handleChangeLang"
      /> -->
	  <div class="text-2xl text-main-bg text-center py-6 pt-12">
	  		  {{ $t("欢迎") }}
	  </div>
	  <img
	    src="@/static/images/login_logo.png"
	    alt=""
	    class="w-[24%] lg:w-[300px] mx-auto"
	  />
	  <div class="panel">
		  <div class="text-3xl text-main-bg font-semibold  py-4">
		    {{ $t("登入") }}
		  </div>
		  <div class="text-sm text-main-bg pb-4">
		    {{ $t("输入您的用户名和密码以访问") }}
		  </div>
		  <el-form
		    ref="ruleFormRef"
		    :model="ruleForm"
		    status-icon
		    :rules="rules"
		    label-width="auto"
		    class="w-full mt-4"
		  >
			<div class="font-semibold pb-2">{{ $t("用户名") }}</div>
		    <el-form-item label="" prop="username" label-position="top">
		      <el-input
		        v-model="ruleForm.username"
		        type="text"
		        autocomplete="off"
		        size="large"
		      >
		      </el-input>
		    </el-form-item>
			<div class="font-semibold pb-2">{{ $t("密码") }}</div>
		    <el-form-item label="" prop="password" label-position="top">
		      <el-input
		        v-model="ruleForm.password"
		        type="password"
		        autocomplete="off"
		        size="large"
		      >
		      </el-input>
		    </el-form-item>
			<div class="font-semibold pb-2">{{ $t("确认密码") }}</div>
		    <el-form-item label="" prop="agentPassword" label-position="top">
		      <el-input
		        v-model="agentPassword"
		        type="password"
		        autocomplete="off"
		        size="large"
		      >
		      </el-input>
		    </el-form-item>
			<div class="font-semibold pb-2">{{ $t("电话") }}</div>
		    <el-form-item label="" prop="phone" label-position="top">
		      <el-input
		        v-model="ruleForm.phone"
		        type="text"
		        autocomplete="off"
		        size="large"
		      >
		      </el-input>
		    </el-form-item>
			<div class="font-semibold pb-2">{{ $t("交易密码") }}</div>
		    <el-form-item label="" prop="tradePassword" label-position="top">
		      <el-input
		        v-model="ruleForm.tradePassword"
		        type="text"
		        autocomplete="off"
		        size="large"
		      >
		      </el-input>
		    </el-form-item>
			
			<div class="font-semibold pb-2">{{ $t("性别") }}</div>
			<el-form-item label="" prop="sex" label-position="top">
			  <el-select
			    v-model="ruleForm.sex"
				size="large"
				placeholder=''
			  >
				<el-option
			        v-for="item in sexRef"
			        :key="item.value"
			        :label="item.label"
			        :value="item.value">
				</el-option>
			<!--  <el-option :value="1">{{ $t("男") }}</el-option>
			  <el-option :value="2">{{ $t("女") }}</el-option> -->
			  </el-select>
			</el-form-item>
		  <!--  <div
		      class="w-full flex items-center justify-between p-4 mb-4 py-3 bg-[#fff] rounded-md"
		    >
		      <div class="text-sm pl-2 text-[#999]">{{ $t("性别") }}</div>
		      <van-radio-group v-model="ruleForm.sex" direction="horizontal">
		        <van-radio :name="1" checked-color="#000">{{ $t("男") }}</van-radio>
		        <van-radio :name="2" checked-color="#000">{{ $t("女") }}</van-radio>
		      </van-radio-group>
		    </div> -->
			<div class="font-semibold pb-2">{{ $t("邀请码") }}</div>
		    <el-form-item label="" prop="inviteCode" label-position="top">
		      <el-input
		        v-model="ruleForm.inviteCode"
		        type="text"
		        autocomplete="off"
		        size="large"
		      >
		      </el-input>
		    </el-form-item>
		  </el-form>
		  <van-checkbox checked-color='#000' class='pb-6' v-model="checked">
		    <span class='text-[#000] font-semibold text-sm'>{{$t('我同意')}}</span>
		    <span class="ml-2 text-[#000] text-sm underline font-bold" @click='jump'>{{$t('条款和条件')}}</span>
		  </van-checkbox>
		  <div @click="sendCode" class="w-full" size="large" round>
		    <div
		      class="w-full text-white text-2xl font-semibold mx-auto py-5 rounded flex items-center justify-center bg-black"
		    >
		      <div>{{ $t("登记") }}</div>
		    </div>
		  </div>
		  
		  <div
		    class="w-full mt-4 text-sm text-black text-center pt-2"
		    @click="toLogin"
		  >
		    <p class="text-sm text-center w-full pb-2" @click="toRegister">
		      {{ $t("已有账户?")
		      }} <span class="text-black underline">{{ $t("立即登录") }}</span>
		    </p>
		  </div>
	  </div>
    </div>
    <Lang ref="langRef"></Lang>
  </div>
</template>
<script setup>
import Lang from "@/components/Lang.vue";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Tabs from "@/components/Tabs.vue";
import { register } from "../../api/apis";
import { areas } from "@/config/area";
import { formatPhoneNumber } from "../../util/utils";
import { showLoadingToast,closeToast,showFailToast,showSuccessToast,showToast   } from 'vant';
onMounted(() => {
  document.getElementById("app").style.background = "#fff";
});

onUnmounted(() => {
  document.getElementById("app").style.background = "transparent";
});

const router = useRouter();
const { t } = useI18n();
const ruleFormRef = ref(null);
const langRef = ref(null);
const agentPassword = ref("");
const checked = ref(true)
const sexRef = reactive([
	{value: 1,label: t("男")},
	{value: 2,label: t("女")}
])
const ruleForm = reactive({
  username: "",
  password: "",
  tradePassword: "",
  phone: "",
  sex: null,
  inviteCode: "",
});
const rules = computed(() => {
  return {};
});
function toLogin() {
  router.push("/account/login");
}

function sendCode() {
  if (!ruleForm.username) return showToast(t("请输入用户名"));
  if (!ruleForm.password) return showToast(t("请输入密码"));
  if (!agentPassword.value) return showToast(t("请输入确认密码"));
  if (agentPassword.value != ruleForm.password)
    return showToast(t("两次密码不一致"));
  // if (!ruleForm.phone) return ElMessage.error(t("请输入电话"));
  if (!/^[0-9]*$/.test(ruleForm.phone))
    return showToast(t("请输入正确电话号码"));
  if (!ruleForm.tradePassword) return showToast(t("请输入交易密码"));
  if (!ruleForm.inviteCode) return showToast(t("请输入邀请码"));
  register(ruleForm).then((res) => {
    showToast(t("注册成功"))
    router.push({
      path: "/account/login",
    });
  });
}

function handleChangeLang() {
  langRef.value.open();
}
const jump = () =>{
  router.push({
      path: "/tc",
    });
}
</script>

<style scoped>
.earn-bg {
  background-image: url(@/static/images/earn-bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

:deep(.el-input-group__append) {
  background-color: #3040f0 !important;
  color: #fff !important;
}

.button-bg {
  background-image: url(@/static/images/block-bg.png);
  background-size: 100% auto;
  background-repeat: no-repeat;
}

:deep(.el-input-group__prepend) {
  box-shadow: none !important;
  background-color: transparent !important;
  box-shadow: 0 0 0 2px #3d3d3d !important;
}

:deep(.el-select__wrapper) {
/*  box-shadow: none !important;
  background-color: transparent !important; */
  line-height: 45px !important;
  height: 45px !important;
  box-shadow: 0 0 0 1px #e6e6e6 !important;
  border-radius: 0!important;
  background-color: #f9f9f9 !important;
}
:deep(.el-form-item__label){
	padding: 0 0;
}
:deep(.el-select--large){
    height: 40px !important;
	line-height: 40px !important;
}
.panel{
	background-color: #fff;
	margin: 60px 0px 0px 0;
	width: 100%;
	padding: 20px;
}
/* 这里需要修改id为123的盒子的父级盒子的宽度 */
</style>
