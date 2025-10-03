<template>
  <div class="register flex flex-col w-full h-[100vh] bg bg-cover">
    <div class="flex items-center relative h-[44px] bg-transparent mt-[10px]">
      <!-- 左侧箭头 -->
      <div class="absolute left-3" @click="toLogin">
        <van-icon name="arrow-left" color="#fff" size="24px" />
      </div>
      <!-- 中间标题 -->
      <div class="mx-auto text-white text-[22px]">{{$t('register')}}</div>
    </div>
    <div>
    </div>
    <div class="pl-[35px]">
      <div class="text-[22px] font-semibold mt-6 text-[#fff]">
       {{$t('创建你的账户')}}
      </div>
      <div class=" text-xs text-[#94A3B8] pt-4">
        {{$t('登录 / 注册，享受最佳的管理体验')}}
      </div>
    </div>
    <div class="flex flex-col items-center pb-3">
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
      /> -->
      <!-- <div class="text-3xl font-semibold mt-6 text-main-bg">
        {{ $t("报名") }}
      </div>
      <div class="text-center text-xs text-white pt-4">
        {{ $t("为旧金山和爱丁堡各地的客户提供服务") }}
      </div> -->
      <!-- <img
        src="@/static/images/logo.png"
        alt=""
        class="w-[180px] mx-auto"
      /> -->
      <!-- <div class="text-xl text-[#fff] font-semibold text-center py-4 pt-5">
        {{ $t("注册1") }}
      </div> -->
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="w-full p-8"
      >
        <el-form-item label="" prop="username" label-position="top">
          <el-input
            v-model="ruleForm.username"
            :placeholder="$t('用户名')"
            type="text"
            autocomplete="off"
            size="large"
          >
          <template #prefix>
            <img class="w-[22px]" src="@/static/images/user1.png" alt="">
          </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="phone" label-position="top">
          <el-input
            v-model="ruleForm.phone"
            :placeholder="$t('电话')"
            type="text"
            autocomplete="off"
            size="large"
          >
           <template #prefix>
            <img class="w-[22px]" src="@/static/images/phone.png" alt="">
          </template>
          </el-input>
        </el-form-item>

        <el-form-item label="" prop="password" label-position="top">
          <el-input
            v-model="ruleForm.password"
            :placeholder="$t('密码')"
            type="password"
            autocomplete="off"
            size="large"
          >
            <template #prefix>
            <img class="w-[22px]" src="@/static/images/password.png" alt="">
          </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="agentPassword" label-position="top">
          <el-input
            v-model="agentPassword"
            :placeholder="$t('确认密码')"
            type="password"
            autocomplete="off"
            size="large"
          >
            <template #prefix>
            <img class="w-[22px]" src="@/static/images/password.png" alt="">
          </template>
          </el-input>
        </el-form-item>
        
        <!-- <el-form-item label="" prop="tradePassword" label-position="top">
          <el-input
            v-model="ruleForm.tradePassword"
            :placeholder="$t('交易密码')"
            type="text"
            autocomplete="off"
            size="large"
          >
            <template #prefix>
            <img class="w-[22px]" src="@/static/images/tradePassword.png" alt="">
          </template>
          </el-input>
        </el-form-item> -->
       
        <el-form-item label="" prop="inviteCode" label-position="top">
          <el-input
            v-model="ruleForm.inviteCode"
            :placeholder="$t('邀请码')"
            type="text"
            autocomplete="off"
            size="large"
          >
           <template #prefix>
            <img class="w-[22px]" src="@/static/images/user.png" alt="">
          </template>
          </el-input>
        </el-form-item>
         <div
          class="w-full mb-4 py-3 flex justify-between items-center h-[49px] rounded-[25px]"
          style="background: #fff !important"
        >
          <div class="text-[#000] text-base font-bold pl-[15px]">
            {{ $t("性别") }}
          </div>
          <van-radio-group v-model="ruleForm.sex" direction="horizontal">
            <van-radio :name="1" checked-color="#ff9662">{{
              $t("男")
            }}
            <template #icon="props">
              <img class="img-icon w-[22px] h-[22px]" :src="props.checked ? check : check1" />
            </template>
            </van-radio>
            <van-radio :name="2" checked-color="#ff9662">
              {{
              $t("女")
            }}
             <template #icon="props">
              <img class="img-icon w-[22px] h-[22px]" :src="props.checked ? check : check1" />
            </template></van-radio>
          </van-radio-group>
        </div>
        <div
          class="w-full mb-4 py-3 flex justify-center items-center rounded-md h-[57px] pl-[15px]"
          
        >
          <van-checkbox checked-color="#F09F39" v-model="checked">
            <span class="text-[#fff] text-[16px]">{{ $t("我同意") }}</span>
            <span
              class="ml-2 text-[#fff] text-[16px] underline"
              @click="jump"
              >{{ $t("条款和条件") }}</span
            >
          </van-checkbox>
        </div>

        <div @click="sendCode" class="w-full" size="large" round>
          <div
            class="w-full mt-5 text-white text-lg font-semibold mx-auto py-3 rounded-[28px] flex items-center justify-center bg-[#F09F39]"
          >
            <div>{{ $t("登记") }}</div>
            <!-- <img class="w-[22px] ml-4" src="@/static/images/back1.png" alt=""> -->
          </div>
        </div>
      </el-form>
      <!-- <div class="w-full mt-10" @click="toLogin">
        <p class="text-center w-full pb-2" @click="toRegister">
          {{ $t("已有账户?")}}
          <span class="text-[#fff] underline text-[18px]">{{
            $t("立即登录")
          }}</span>
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
const check = new URL("@/static/images/checked.png", import.meta.url).href;
const check1 = new URL("@/static/images/checked1.png", import.meta.url).href;
import {
  showLoadingToast,
  closeToast,
  showFailToast,
  showSuccessToast,
  showToast,
} from "vant";
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
const checked = ref(true);
const ruleForm = reactive({
  username: "",
  password: "",
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
  if (!ruleForm.password) return showToast(t("请输入密码"));
  if (!agentPassword.value) return showToast(t("请输入确认密码"));
  if (agentPassword.value != ruleForm.password)
    return showToast(t("两次密码不一致"));
  // if (!ruleForm.phone) return ElMessage.error(t("请输入电话"));
  if (!/^[0-9]*$/.test(ruleForm.phone))
    return showToast(t("请输入正确电话号码"));
  // if (!ruleForm.tradePassword) return showToast(t("请输入交易密码"));
  if (!ruleForm.inviteCode) return showToast(t("请输入邀请码"));
  register(ruleForm).then((res) => {
    showToast(t("注册成功"));
    router.push({
      path: "/account/login",
    });
  });
}

function handleChangeLang() {
  langRef.value.open();
}
const jump = () => {
  router.push({
    path: "/tc",
  });
};
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
