<template>
  <div class="flex flex-col w-full h-[100vh] bg bg-cover bg-center p-3">
    <div class="flex flex-col items-center mt-6 pb-1">
	  <div class="text-2xl text-main-bg text-center py-6 pt-12">
	  		  {{ $t("欢迎") }}
	  </div>
	  <img
	    src="@/static/images/logo.png"
	    alt=""
	    class="w-[70%] lg:w-[300px] mx-auto"
	  />
	  <div class="panel">
		  <div class="text-3xl text-center text-main-bg font-semibold  py-4">
		    {{ $t("登入") }}
		  </div>
		  <div class="text-sm text-center text-main-bg pb-4 text-[#828794]">
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
			<div class="font-semibold pb-2">{{ $t("用户名") }}<span class="ml-1">*</span></div>
		    <el-form-item label="" prop="username" label-position="top">
		      <el-input
		        v-model="ruleForm.username"
		        type="text"
		        autocomplete="off"
		        size="large"
		      >
		      </el-input>
		    </el-form-item>
			<div class="font-semibold pb-2">{{ $t("密码") }}<span class="ml-1">*</span></div>
		    <el-form-item label="" prop="password" label-position="top">
		      <el-input
		        v-model="ruleForm.password"
		        type="password"
		        autocomplete="off"
		        size="large"
		      >
		      </el-input>
		    </el-form-item>
			<div class="font-semibold pb-2">{{ $t("确认密码") }}<span class="ml-1">*</span></div>
		    <el-form-item label="" prop="agentPassword" label-position="top">
		      <el-input
		        v-model="agentPassword"
		        type="password"
		        autocomplete="off"
		        size="large"
		      >
		      </el-input>
		    </el-form-item>
			<div class="font-semibold pb-2">{{ $t("电话") }}<span class="ml-1">*</span></div>
		   <!-- <el-form-item label="" prop="phone" label-position="top">
		      <el-input
		        v-model="ruleForm.phone"
		        type="text"
		        autocomplete="off"
		        size="large"
		      >
		      </el-input>
		    </el-form-item> -->
			<el-form-item label="" prop="phone" label-position="top">
			  <div class="border-[1px] border el-input pl-2 bg-[#f9f9f9]">
				<div class="bg-[#f9f9f9] w-[50px] h-[50px] flex items-center justify-center" @click.stop="togglePopup">
					<img :src="selectedCountry.flag" class="flag-img" alt="">
						<img v-if="showPopup" src="@/static/images/base/top.png" style="width:12px" />
						<img v-else class="rotate-90" src="@/static/images/base/right.png" style="width:12px" />
				</div>
				<input type="text" v-model="ruleForm.phone" @input=""
				  class="flex-1  h-[50px]  pl-4 text-base"  />  
			  </div>
			  
				
			  <div v-if="showPopup" class="country-popup" ref="popupRef">
			        <!-- 过滤后的完整国家列表 -->
			        <div class="country-scroll">
			          <div
			            class="country-item"
			            v-for="item in allCountryList"
			            :key="item.dial"
			            @click="selectCountry(item)"
			          >
			            <img class="item-flag" :src="item.flag" alt="">
			            <span class="name">{{ item.name }}</span>
			            <span class="code">+{{ item.dial }}</span>
			          </div>
			        </div>
			  </div>
			  
			</el-form-item>
			<div class="font-semibold pb-2">{{ $t("邮箱") }}<span class="ml-1">*</span></div>
			<el-form-item label="" prop="email" label-position="top">
			  <el-input
			    v-model="ruleForm.email"
			    type="text"
			    autocomplete="off"
			    size="large"
			  >
			  </el-input>
			</el-form-item>
			<div class="font-semibold pb-2">{{ $t("交易密码") }}<span class="ml-1">*</span></div>
		    <el-form-item label="" prop="tradePassword" label-position="top">
		      <el-input
		        v-model="ruleForm.tradePassword"
				type="password"
		        autocomplete="off"
		        size="large"
		      >
		      </el-input>
		    </el-form-item>
			
			<div class="font-semibold pb-2">{{ $t("性别") }}<span class="ml-1">*</span></div>
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
		      class="w-full text-white text-2xl font-semibold mx-auto py-5 rounded-xl flex items-center justify-center bg-[#ff8100]"
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
  email: ""
});

// 弹窗DOM
const popupRef = ref(null)
// 弹窗显示状态
const showPopup = ref(false)
// 密码显隐
const pwdVisible = ref(false)

// 默认选中：加拿大
const selectedCountry = ref({
  name: 'Canada',
  dial: '1',
  flag: 'https://flagcdn.com/w40/ca.png'
})

// ====================== 完整全球国家/地区区号数据 ======================
const allCountryList = ref([
  // 亚洲
  { name: 'China', dial: '86', flag: 'https://flagcdn.com/w40/cn.png' },
  { name: 'Japan', dial: '81', flag: 'https://flagcdn.com/w40/jp.png' },
  { name: 'South Korea', dial: '82', flag: 'https://flagcdn.com/w40/kr.png' },
  { name: 'Thailand', dial: '66', flag: 'https://flagcdn.com/w40/th.png' },
  { name: 'Singapore', dial: '65', flag: 'https://flagcdn.com/w40/sg.png' },
  { name: 'Malaysia', dial: '60', flag: 'https://flagcdn.com/w40/my.png' },
  { name: 'Vietnam', dial: '84', flag: 'https://flagcdn.com/w40/vn.png' },
  { name: 'Indonesia', dial: '62', flag: 'https://flagcdn.com/w40/id.png' },
  { name: 'Philippines', dial: '63', flag: 'https://flagcdn.com/w40/ph.png' },
  { name: 'India', dial: '91', flag: 'https://flagcdn.com/w40/in.png' },
  { name: 'Pakistan', dial: '92', flag: 'https://flagcdn.com/w40/pk.png' },
  { name: 'United Arab Emirates', dial: '971', flag: 'https://flagcdn.com/w40/ae.png' },
  { name: 'Saudi Arabia', dial: '966', flag: 'https://flagcdn.com/w40/sa.png' },
  { name: 'Turkey', dial: '90', flag: 'https://flagcdn.com/w40/tr.png' },
  { name: 'Israel', dial: '972', flag: 'https://flagcdn.com/w40/il.png' },
  // 欧洲
  { name: 'United Kingdom', dial: '44', flag: 'https://flagcdn.com/w40/gb.png' },
  { name: 'Germany', dial: '49', flag: 'https://flagcdn.com/w40/de.png' },
  { name: 'France', dial: '33', flag: 'https://flagcdn.com/w40/fr.png' },
  { name: 'Italy', dial: '39', flag: 'https://flagcdn.com/w40/it.png' },
  { name: 'Spain', dial: '34', flag: 'https://flagcdn.com/w40/es.png' },
  { name: 'Portugal', dial: '351', flag: 'https://flagcdn.com/w40/pt.png' },
  { name: 'Russia', dial: '7', flag: 'https://flagcdn.com/w40/ru.png' },
  { name: 'Malta', dial: '356', flag: 'https://flagcdn.com/w40/mt.png' },
  // 非洲（截图内全部地区）
  { name: 'Mali', dial: '223', flag: 'https://flagcdn.com/w40/ml.png' },
  { name: 'Mauritania (موريتانيا)', dial: '222', flag: 'https://flagcdn.com/w40/mr.png' },
  { name: 'Mauritius (Moris)', dial: '230', flag: 'https://flagcdn.com/w40/mu.png' },
  { name: 'Mayotte', dial: '262', flag: 'https://flagcdn.com/w40/yt.png' },
  // 大洋洲 & 海岛领地
  { name: 'Marshall Islands', dial: '692', flag: 'https://flagcdn.com/w40/mh.png' },
  { name: 'Martinique', dial: '596', flag: 'https://flagcdn.com/w40/mq.png' },
  { name: 'Australia', dial: '61', flag: 'https://flagcdn.com/w40/au.png' },
  { name: 'New Zealand', dial: '64', flag: 'https://flagcdn.com/w40/nz.png' },
  // 美洲
  { name: 'United States', dial: '1', flag: 'https://flagcdn.com/w40/us.png' },
  { name: 'Canada', dial: '1', flag: 'https://flagcdn.com/w40/ca.png' },
  { name: 'Brazil', dial: '55', flag: 'https://flagcdn.com/w40/br.png' },
  { name: 'Mexico', dial: '52', flag: 'https://flagcdn.com/w40/mx.png' },
  { name: 'Argentina', dial: '54', flag: 'https://flagcdn.com/w40/ar.png' },
  { name: 'Chile', dial: '56', flag: 'https://flagcdn.com/w40/cl.png' },
  { name: 'Colombia', dial: '57', flag: 'https://flagcdn.com/w40/co.png' }
])

// 切换下拉弹窗
const togglePopup = () => {
  showPopup.value = !showPopup.value
}

// 选中国家
const selectCountry = (item) => {
  selectedCountry.value = item
  showPopup.value = false
}

// 点击空白区域关闭弹窗
const closePopupByBlank = (e) => {
  if (showPopup.value && popupRef.value && !popupRef.value.contains(e.target)) {

    showPopup.value = false
  }
}

const rules = computed(() => {
  return {};
});

function toLogin() {
  router.push("/account/login");
}
const emailReg = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
function sendCode() {
  if (!ruleForm.username) return showToast(t("请输入用户名"));
  if (!ruleForm.password) return showToast(t("请输入密码"));
  if (!agentPassword.value) return showToast(t("请输入确认密码"));
  if (!agentPassword.value) return showToast(t("请输入确认密码"));
  if (agentPassword.value != ruleForm.password)
    return showToast(t("两次密码不一致"));
  // if (!ruleForm.phone) return ElMessage.error(t("请输入电话"));
  if (!/^[0-9]*$/.test(ruleForm.phone))
    return showToast(t("请输入正确电话号码"));
  if(ruleForm.email){
	if (!/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(ruleForm.email))
	  return showToast(t("请输入正确邮箱"));
  }
 
  if (!ruleForm.tradePassword) return showToast(t("请输入交易密码"));
  if (!ruleForm.inviteCode) return showToast(t("请输入邀请码"));
  let param = JSON.parse(JSON.stringify(ruleForm))
  param.phone = selectedCountry.value.dial + ruleForm.phone
  // ruleForm.phone = selectedCountry.value.dial + ruleForm.phone
  register(param).then((res) => {
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

onMounted(() => {
  document.addEventListener('click', closePopupByBlank)
})
onUnmounted(() => {
  document.removeEventListener('click', closePopupByBlank)
})
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
	/* background-color: #fff; */
	margin: 30px 0px 0px 0;
	width: 100%;
	padding: 20px;
}
/* 这里需要修改id为123的盒子的父级盒子的宽度 */


.page-wrap {
  width: 100%;
  min-height: 100vh;
  background-color: #FFD046;
  padding: 40px 20px;
}

/* 手机号输入外层容器 */
.phone-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 4px;
  margin-bottom: 32px;
}
.country-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 12px;
  border-right: 1px solid #eeeeee;
  cursor: pointer;
}
.flag-img {
  width: 34px;
  margin-right: 4px;
  height: 21px;
  object-fit: cover;
}
.arrow {
  font-size: 12px;
  color: #666666;
}
.phone-input {
  flex: 1;
  padding: 16px 14px;
  border: none;
  outline: none;
  font-size: 20px;
}
.phone-input::placeholder {
  color: #999999;
}

/* 国家下拉弹窗 */
.country-popup {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.12);
  z-index: 999;
}
.search-input {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid #eee;
  outline: none;
  font-size: 18px;
}
.country-scroll {
  max-height: 420px;
  overflow-y: auto;
}
.country-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  font-size: 16px;
}
.country-item:hover {
  background-color: #f6f6f6;
}
.item-flag {
  width: 30px;
  height: 22px;
  object-fit: cover;
}
.name {
  flex: 1;
}
.code {
  color: #333333;
}

/* 密码输入框 */
.pwd-input-wrap {
  position: relative;
  background: #ffffff;
  border-radius: 4px;
}
.pwd-input {
  width: 100%;
  padding: 16px 14px;
  padding-right: 55px;
  border: none;
  outline: none;
  font-size: 20px;
}
.pwd-input::placeholder {
  color: #999999;
}
.eye-icon {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 26px;
  color: #666;
  cursor: pointer;
}
/deep/ .el-input{
	border-color: #000000;
	border-radius: 6px !important;
}
/deep/ .el-input__wrapper{
	border-color: #000000;
	border: 1px solid #000;
	box-shadow: inherit !important;
	border-radius: 6px !important;
}
/deep/ .el-select__wrapper{
	border-color: #000000;
	border: 1px solid #000;
	box-shadow: inherit !important;
	border-radius: 6px !important;
}
/deep/ .el-select__caret{
	color: #000;
}
</style>
