<template>
  <div class="login-con flex flex-col w-full h-[100vh] bg bg-cover bg-center p-5">
    <div class="fixed right-5 h-9 flex items-center justify-center">
      <!-- <div
        class="flex items-center ml-2 overflow-hidden bg-[var(--main-color)] px-3 py-2 rounded-full box-border text-white leading-none"
        style="line-height: 1"
      > -->
        <img
          src="@/static/images/cur.png"
          alt=""
          class="w-[35px] h-[35px] block object-contain"
          @click="customer"
        />
        <!-- <div class="ml-2 uppercase font-bold leading-none" style="margin-top: -2px;">{{lang}}</div> -->
      <!-- </div> -->
    </div>

    <div class="flex flex-col items-center pt-10 mt-[50px] pb-3">
      <img
        src="@/static/images/logo.png"
        alt=""
        class="w-[180px] mx-auto"
      />
      <div class="text-xl text-[#fff] font-semibold text-center py-4 pt-5">
        {{ $t("登入") }}
      </div>
      <!-- <div class="text-center text-sm text-main-bg pb-4">
        {{ $t("输入您的用户名和密码以访问") }}
      </div> -->

      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="w-[95%] mt-4"
      >
        <el-form-item prop="" label-position="left">
          <el-input
            v-model="ruleForm.username"
            type="text"
            :placeholder="$t('用户名/电话')"
            autocomplete="off"
            size="large"
            class="bg-transparent"
          >
          <template #prefix>
            <div class="text-black">{{$t('用户名/电话')}}</div>
          </template>
          </el-input>
        </el-form-item>
        <el-form-item class="relative w-full">
          <el-input
            v-model="ruleForm.password"
            :placeholder="$t('密码')"
            type="password"
            autocomplete="off"
            size="large"
            show-password
          >
          <template #prefix>
            <div class="text-black">{{$t('密码')}}</div>
          </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div @click="submitForm(ruleFormRef)" class="w-[95%] pb-[10px]" size="large" round>
        <div
          class="w-full text-white text-lg font-semibold mx-auto py-3 rounded-lg flex items-center justify-center bg-[#000]"
        >
          <div>{{ $t("登录") }}</div>
        </div>
      </div>
    </div>
    <div class="w-full mt-4 text-sm text-white text-center pt-2">
        <p class="text-sm text-center w-full pb-2 opacity-60" @click="customer">
          <span class="text-white">{{ $t("忘记密码?") }}</span>
        </p>
    </div>
    <div class="w-full mt-4 text-sm text-white text-center pt-2">
        <p class="text-sm text-center w-full pb-2" @click="toRegister">
          <!-- {{ $t("还没有账户?")}} -->
          <span class="text-white underline">{{ $t("立即注册") }}</span>
        </p>

        <!-- <div class="text-sm text-center w-full" @click="customer">
          {{ $t("无法登录?")
          }}<span class="text-white">{{ $t("请联系我们的用户支持") }}</span>
        </div> -->
    </div>
    <Lang ref="langRef"></Lang>
    <ContactUs ref="ContactUsRef"></ContactUs>
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
});

onUnmounted(() => {
  document.getElementById("app").style.background = "transparent";
});

const router = useRouter();
const { t } = useI18n();
const ruleFormRef = ref(null);
const userStore = useUserStore();
const langRef = ref(null);
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
        userStore.setToken(`Bearer ${res.data.token}`);
        userStore.setUserInfo(res.data.user);
        setUserRemind();
        router.push({ path: "/" });
      });
      //   if (this)
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
</style>
