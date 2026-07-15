<template>
  <div class="flex flex-col w-full h-[100vh] bg bg-cover bg-center p-3">
   <!-- <div class="fixed top-2 right-5 h-9 flex items-center justify-center">
      <div
        class="flex items-center ml-2 overflow-hidden bg-[var(--main-color)] px-3 py-2 rounded-full box-border text-white leading-none"
        style="line-height: 1"
      >
        <img
          src="@/static/images/lang-white.png"
          alt=""
          class="w-5 h-5 block object-contain"
          @click="handleChangeLang"
        />
        <div class="ml-2 uppercase font-bold leading-none" style="margin-top: -2px;">{{lang}}</div>
      </div>
    </div> -->

    <div class="flex flex-col items-center  mt-5 pb-3">
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
			<div class="font-semibold pb-2">{{ $t("用户名/电话") }}</div>
		    <el-form-item prop="" label-position="top">
		      <el-input
		        v-model="ruleForm.username"
		        type="text"
		        autocomplete="off"
		        size="large"
		      />
		    </el-form-item>
			<div class="font-semibold pb-2">{{ $t("密码") }}</div>
		    <el-form-item class="relative w-full">
		      <el-input
		        v-model="ruleForm.password"
		        type="password"
		        autocomplete="off"
		        size="large"
		        show-password
		      />
		    </el-form-item>
		    <el-form-item label-position="top" class="relative w-full">
		      <template class="w-full" #label>
		        <div class="flex items-center w-full">
		          <div class="text-sm" @click="customer">{{ $t("忘记密码") }}</div>
		          <div class="ml-auto " >
		            <!-- {{ $t("记住密码") }} -->
					<van-checkbox checked-color='#000' class='' v-model="checked">
					  <span class='text-[#000]  text-sm'>{{$t('记住密码')}}</span>
					</van-checkbox>
		          </div>
		        </div>
		      </template>
		    </el-form-item>
		    <!-- <el-form-item>
		      <div class="text-center w-full opacity-50" @click="toRegister">
		        {{ $t("新用户?")
		        }}<span class="text-blue-600">{{ $t("立即加入") }}</span>
		      </div>
		    </el-form-item> -->
		  </el-form>
		  <div @click="submitForm(ruleFormRef)" class="w-full" size="large" round>
		    <div
		      class="w-full text-white text-2xl font-semibold mx-auto py-5 rounded-lg flex items-center justify-center bg-black"
		    >
		      <div>{{ $t("登录") }}</div>
		    </div>
		  </div>
		  <div class="w-full mt-4 text-sm  text-center pt-2">
		    <p class="text-sm text-center w-full pb-2" @click="toRegister">
		      {{ $t("还没有账户?")
		      }} <span class="underline font-semibold">{{ $t("立即注册") }}</span>
		    </p>
		  
		    <div class="text-sm text-center w-full pt-12" @click="customer">
		      {{ $t("无法登录?")
		      }} <span class="underline font-bold">{{ $t("请联系我们的用户支持") }}</span>
		    </div>
		  </div>
	  </div>
    </div>
    <Lang ref="langRef"></Lang>
    <ContactUs ref="ContactUsRef"></ContactUs>
	<van-dialog v-model:show="showError" closeable :title="''" :show-confirm-button="false">
	    <div class="text-center py-8 px-4">
			<img class="w-[24%] lg:w-[300px] mx-auto pb-5" src="@/static/images/login/icon-1.png"/>
			<div class="text-2xl font-semibold">
				{{ $t("认证失败")}}
			</div>
			<div class="text-sm pb-8">
				{{ $t("失败理由")}}
			</div>
			<div @click="submitErr()" class="w-[100%] px-[15%]" size="large" round>
			  <div
			    class="w-full text-white text-xl font-semibold mx-auto py-3 rounded flex items-center justify-center bg-black"
			  >
			    <div>{{ $t("再试一次") }}</div>
			  </div>
			</div>
		</div>
	</van-dialog>
	
	<van-dialog v-model:show="showSuccess" closeable :title="''" :show-confirm-button="false">
	    <div class="text-center py-8 px-4">
			<img class="w-[24%] lg:w-[300px] mx-auto pb-5" src="@/static/images/login/icon-2.png"/>
			<div class="text-2xl font-semibold">
				{{ $t("认证成功")}}
			</div>
			<div class="text-sm pb-8">
				{{ $t("成功理由")}}
			</div>
			<div @click="submitJump()" class="w-[100%] px-[15%]" size="large" round>
			  <div
			    class="w-full text-white text-xl font-semibold mx-auto py-3 rounded flex items-center justify-center bg-black"
			  >
			    <div>{{ $t("继续") }}</div>
			  </div>
			</div>
		</div>
	</van-dialog>
  </div>
</template>
<script setup>
import Lang from "@/components/Lang.vue";
import Tabs from "@/components/Tabs.vue";
import { useUserStore } from "@/store/modules/user";
import ContactUs from "@/components/ContactUs.vue";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { showLoadingToast,closeToast,showFailToast,showSuccessToast,showToast   } from 'vant';
import { useCommonStore } from '@/store/modules/common';
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { setUserRemind } from "../../common/remind";
import { login } from "../../api/apis";
import { areas } from "@/config/area";
import { formatPhoneNumber } from "../../util/utils";
const ContactUsRef = ref(null);

onMounted(() => {
  document.getElementById("app").style.background = "#fff";
  checked.value = localStorage.getItem("checked")=='false'? false:true
  if(checked.value){
	  ruleForm.username = localStorage.getItem('username')
	  ruleForm.password = localStorage.getItem('password')
  }
});

onUnmounted(() => {
  document.getElementById("app").style.background = "transparent";
});

const router = useRouter();
const { t } = useI18n();
const ruleFormRef = ref(null);
const checked = ref(true);
const userStore = useUserStore();
const langRef = ref(null);
const showError = ref(false);
const showSuccess = ref(false);
const ruleForm = reactive({
  email: "",
  password: "",
});
const commonStore = useCommonStore();
const lang = computed(() => commonStore.clientLang);
const select = ref("US +1");
const rules = computed(() => {
  return {};
});

function toForget() {
  router.push({ path: "/account/forget", query: { type: accountType.value } });
}

function toRegister() {
  router.push({ path: "/account/register" });
}

const submit = (item) => {
    goodsData.value = item;
    show.value = true
}

const submitErr= () => {
	ruleForm.username = '';
	ruleForm.password = '';
	showError.value = false;
}

const submitJump= () => {
	router.push({ path: "/" });
	showSuccess.value = false;
}

function submitForm(formEl) {
  // if (!ruleForm.email) return accountType.value === 1 ? ElMessage.error(t("请输入邮箱")) : ElMessage.error(t("请输入手机号"));
  // 统一清除空格
  if (!ruleForm.username) return showToast(t('请输入用户名/电话'));
  if (!ruleForm.password) return showToast(t('请输入密码'));
  
  
  formEl.validate((valid) => {
    if (valid) {
      let data = {
        username: ruleForm.username,
        password: ruleForm.password,
      };
      login(data).then((res) => {
		let info = {
			name: ruleForm.username
		}
		if(checked.value){
			localStorage.setItem('checked', true)
			localStorage.setItem('username', ruleForm.username)
			localStorage.setItem('password', ruleForm.password)
		}else{
			localStorage.setItem('checked', false)
			localStorage.setItem('username', '')
			localStorage.setItem('password', '')
		}
		if(res.code == 200){
			userStore.setToken(`Bearer ${res.data.token}`);
			userStore.setUserInfo(res.data.info);
			showSuccess.value = true
		}else{
			showError.value = true
		}
		  
        // userStore.setToken(`Bearer ${res.data.token}`);
        // userStore.setUserInfo(res.data.info);
        // router.push({ path: "/" });
      });
    } else {
      console.log("error submit!");
    }
  });
}

function handleChangeLang() {
  langRef.value.open();
}

const customer = () => {
  ContactUsRef.value.open();
};
</script>

<style scoped>
.earn-bg {
  background-image: url(@/static/images/earn-bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.button-bg {
  background-image: url(@/static/images/block-bg.png);
  background-size: 100% auto;
  background-repeat: no-repeat;
}

:deep(.el-form-item__label) {
  width: 100%;
}

:deep(.el-input-group__prepend) {
  box-shadow: none !important;
  background-color: transparent !important;
  box-shadow: 0 0 0 2px #3d3d3d !important;
}

:deep(.el-select__wrapper) {
  box-shadow: none !important;
  background-color: transparent !important;
}
:deep(.el-form-item__label){
	padding: 0 0;
}
:deep(.van-popup__close-icon--top-right) {
  display: none !important;
}
.panel{
	background-color: #fff;
	margin: 60px 0px 0px 0;
	width: 100%;
	padding: 20px;
}
</style>
