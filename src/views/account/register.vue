<template>
  <div class="register flex flex-col w-full h-[100vh] bg-[#fff] px-[5px]">
    <!-- <van-nav-bar
        :title="$t('注册')"
        fixed
        left-arrow
        @click-left="toLogin"
      /> -->
      <div class="pl-[20px] pt-[15px] text-[#1E3A8A] text-[14px]" @click="toLogin">
        <van-icon name="arrow-left" />
      {{$t('返回')}}
      </div>
      
    <div class="flex flex-col items-center pb-3 mt-5">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="w-full p-5"
      >
        <el-form-item  prop="username"  label-position="top">
          <el-input
            v-model="ruleForm.username"
            :placeholder="$t('用户名')"
            type="text"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label-position="top">
          <el-input
            v-model="ruleForm.password"
            :placeholder="$t('密码')"
            type="password"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item  prop="agentPassword" label-position="top">
          <el-input
            v-model="agentPassword"
            :placeholder="$t('确认密码')"
            type="password"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item  prop="phone" label-position="top">
          <el-input
            v-model="ruleForm.phone"
            :placeholder="$t('电话')"
            type="text"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item> -->
        <el-form-item  prop="tradePassword" label-position="top">
          <el-input
            v-model="ruleForm.tradePassword"
            :placeholder="$t('交易密码')"
            type="text"
            maxlength="6"
            autocomplete="off"
            size="large"
            @input="ruleForm.tradePassword = ruleForm.tradePassword.replace(/\D/g, '')"
          >
          </el-input>
        </el-form-item>
        <div class="w-full mb-4 py-3 bg-[#fff] rounded-md pl-[10px]">
          <div class="text-sm pb-5 text-[#333]">{{ $t("性别") }}</div>
          <van-radio-group
            shape="dot"
            v-model="ruleForm.sex"
            direction="horizontal"
          >
            <van-radio :name="1" checked-color="#6a4d52">{{
              $t("男")
            }}</van-radio>
            <van-radio :name="2" checked-color="#6a4d52">{{
              $t("女")
            }}</van-radio>
          </van-radio-group>
        </div>
        <el-form-item  prop="inviteCode" label-position="top">
          <el-input
            v-model="ruleForm.inviteCode"
            :placeholder="$t('邀请码')"
            type="text"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <van-checkbox checked-color="#6a4d52" v-model="checked" shape="square">
          <span class="text-[#6a4d52] text-sm">{{ $t("我同意") }}</span>
          <span class="ml-2 text-[#6a4d52] text-sm" @click="jump">{{
            $t("条款和条件")
          }}</span>
        </van-checkbox>
        <div @click="sendCode" class="w-full" size="large" round>
          <div
            class="w-full mt-5 text-white text-lg font-semibold mx-auto py-3 rounded-[8px] flex items-center justify-center bg-[#6a4d52]"
          >
            <div>{{ $t("登记") }}</div>
            <!-- <img class="w-[22px] ml-4" src="@/static/images/back1.png" alt=""> -->
          </div>
        </div>
      </el-form>
      <!-- <div class="w-full text-sm" @click="toLogin">
        <p class="text-sm text-center w-full pb-2" @click="toRegister">
          {{ $t("已有账户?")}}
          <span class="text-[#f1894c]">{{ $t("已经有账号了吗？去登录") }}</span>
        </p>
      </div> -->
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
import {
  showLoadingToast,
  closeToast,
  showFailToast,
  showSuccessToast,
  showToast,
} from "vant";

onUnmounted(() => {
  document.getElementById("app").style.background = "transparent";
});

const onUsernameInput = (val) => {
  ruleForm.username = val.replace(/[^a-zA-Z0-9]/g, '')
}

const router = useRouter();
const { t } = useI18n();
const ruleFormRef = ref(null);
const langRef = ref(null);
const agentPassword = ref("");
const checked = ref(true);
const ruleForm = reactive({
  username: "",
  password: "",
  tradePassword: "",
  phone: "",
  sex: 1,
  inviteCode: "",
});
const rules = computed(() => {
  return {};
});
function toLogin() {
  router.replace("/account/login");
}

function sendCode() {
  if (!ruleForm.username) return showToast(t("请输入用户名"));
  const reg = /^[A-Za-z0-9]+$/;
  if (!reg.test(ruleForm.username)) {
    return showToast(t("用户名输入空格或特殊符号"));
  }
  if (!ruleForm.password) {
    return showToast(t("请输入6位数字密码"));
  }
  if (!agentPassword.value) return showToast(t("请输入确认密码"));
  if (agentPassword.value != ruleForm.password)
    return showToast(t("两次密码不一致"));
  // if (!/^[0-9]*$/.test(ruleForm.phone))
  //   return showToast(t("请输入正确电话号码"));
  if (!/^\d{6}$/.test(ruleForm.tradePassword)) {
    return showToast(t("请输入6位数字的交易密码"));
  }
  if (!ruleForm.inviteCode) return showToast(t("请输入邀请码"));
  if (!checked.value) return showToast(t("请勾选用户协议"));
  register(ruleForm).then((res) => {
    showToast(t("注册成功"));
    router.push({
      path: "/account/login",
    });
  });
}

function getHashParam(key) {
  const hash = window.location.hash;
  const queryString = hash.includes("?") ? hash.split("?")[1] : "";
  const params = new URLSearchParams(queryString);
  return params.get(key);
}
function handleChangeLang() {
  langRef.value.open();
}
const jump = () => {
  router.push({
    path: "/tc",
  });
};
onMounted(() => {
  document.getElementById("app").style.background = "#fff";
  const code = getHashParam("code");
  ruleForm.inviteCode = code;
});
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
  box-shadow: none !important;
  background-color: transparent !important;
}

/* 这里需要修改id为123的盒子的父级盒子的宽度 */
</style>
