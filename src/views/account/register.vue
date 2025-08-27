<template>
  <div class="register flex flex-col w-full h-[100vh] bg-[#F5F7FA] p-5">
    <van-nav-bar
        :title="$t('注册')"
        fixed
        left-arrow
        @click-left="toLogin"
      />
    <div class="flex flex-col items-center pt-6 pb-3 mt-5">
      <!-- <img
        src="@/static/images/account-lang.png"
        alt=""
        class="w-5 h-5 self-end mb-4"
        @click="handleChangeLang"
      /> -->
      <!-- <img
        src="@/static/images/logo.png"
        alt=""
        class="w-[50%] lg:w-[300px] mx-auto"
      />
      <div class="text-3xl font-semibold mt-6 text-main-bg">
        {{ $t("报名") }}
      </div>
      <div class="text-center text-xs text-white pt-4">
        {{ $t("为旧金山和爱丁堡各地的客户提供服务") }}
      </div> -->
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="w-full bg-[#ffffff] p-5"
      >
        <el-form-item :label="$t('用户名')" prop="username" label-position="top">
          <el-input
            v-model="ruleForm.username"
            :placeholder="$t('用户名')"
            type="text"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('密码')" prop="password" label-position="top">
          <el-input
            v-model="ruleForm.password"
            :placeholder="$t('密码')"
            type="password"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('确认密码')" prop="agentPassword" label-position="top">
          <el-input
            v-model="agentPassword"
            :placeholder="$t('确认密码')"
            type="password"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('电话')" prop="phone" label-position="top">
          <el-input
            v-model="ruleForm.phone"
            :placeholder="$t('电话')"
            type="text"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('交易密码')" prop="tradePassword" label-position="top">
          <el-input
            v-model="ruleForm.tradePassword"
            :placeholder="$t('交易密码')"
            type="text"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <div
          class="w-full mb-4 py-3  bg-[#fff] rounded-md"
        >
          <div class="text-sm  pb-5 text-[#333]">{{ $t("性别") }}</div>
          <van-radio-group shape="dot" v-model="ruleForm.sex" direction="horizontal">
            <van-radio :name="1" checked-color="#4070f7">{{ $t("男") }}</van-radio>
            <van-radio :name="2" checked-color="#4070f7">{{ $t("女") }}</van-radio>
          </van-radio-group>
        </div>
        <el-form-item :label="$t('邀请码')" prop="inviteCode" label-position="top">
          <el-input
            v-model="ruleForm.inviteCode"
            :placeholder="$t('邀请码')"
            type="text"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <van-checkbox checked-color='#4070f7' v-model="checked">
          <span class='text-[#4B5563]  text-sm'>{{$t('我同意')}}</span>
          <span class="ml-2 text-[#206645] text-sm underline" @click='jump'>{{$t('条款和条件')}}</span>
        </van-checkbox>
        <div @click="sendCode" class="w-full" size="large" round>
          <div
            class="w-full mt-5 text-white text-lg font-semibold mx-auto py-3 rounded-lg flex items-center justify-center bg-[#206645]"
          >
            <div>{{ $t("登记") }}</div>
            <img class="w-[22px] ml-4" src="@/static/images/back1.png" alt="">
          </div>
        </div>
      </el-form>
      <div
        class="w-full mt-4 text-sm"
        @click="toLogin"
      >
        <p class="text-sm text-center w-full pb-2" @click="toRegister">
          <!-- {{ $t("已有账户?")}} -->
          <span class="text-[#206645]">{{ $t("立即登录") }}</span>
        </p>
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
  if (!ruleForm.username) return ElMessage.error(t("请输入用户名"));
  if (!ruleForm.password) return ElMessage.error(t("请输入密码"));
  if (!agentPassword.value) return ElMessage.error(t("请输入确认密码"));
  if (agentPassword.value != ruleForm.password)
    return ElMessage.error(t("两次密码不一致"));
  // if (!ruleForm.phone) return ElMessage.error(t("请输入电话"));
  if (!/^[0-9]*$/.test(ruleForm.phone))
    return ElMessage.error(t("请输入正确电话号码"));
  if (!ruleForm.tradePassword) return ElMessage.error(t("请输入交易密码"));
  if (!ruleForm.inviteCode) return ElMessage.error(t("请输入邀请码"));
  register(ruleForm).then((res) => {
    ElMessage({ message: t("注册成功"), type: "success" });
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
  box-shadow: none !important;
  background-color: transparent !important;
}

/* 这里需要修改id为123的盒子的父级盒子的宽度 */
</style>
