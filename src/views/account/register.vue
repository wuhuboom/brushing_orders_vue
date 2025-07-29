<template>
  <div class="flex flex-col w-full h-[100vh] bg bg-cover bg-center">
    <div class="flex flex-col items-center pt-6 pb-3">
      <img
        src="@/static/images/account-lang.png"
        alt=""
        class="w-5 h-5 self-end mb-4"
        @click="handleChangeLang"
      />
      <img
        src="@/static/images/logo.png"
        alt=""
        class="w-[50%] lg:w-[300px] mx-auto"
      />
      <div class="text-3xl font-semibold mt-6 text-main-bg">
        {{ $t("报名") }}
      </div>
      <div class="text-center text-xs text-white pt-4">
        {{ $t("为旧金山和爱丁堡各地的客户提供服务") }}
      </div>
      <!-- <div class="w-full mt-5">
                <Tabs :menus="accountTypeList" :selectMenu="accountType" @change="handleChangeType"></Tabs>
            </div> -->
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="w-full mt-4"
      >
        <el-form-item label="" prop="email" label-position="top">
          <el-input
            v-model="ruleForm.email"
            :placeholder="$t('用户名')"
            type="text"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="email" label-position="top">
          <el-input
            v-model="ruleForm.email"
            :placeholder="$t('密码')"
            type="text"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="email" label-position="top">
          <el-input
            v-model="ruleForm.email"
            :placeholder="$t('确认密码')"
            type="text"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="email" label-position="top">
          <el-input
            v-model="ruleForm.email"
            :placeholder="$t('电话')"
            type="text"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="email" label-position="top">
          <el-input
            v-model="ruleForm.email"
            :placeholder="$t('交易密码')"
            type="text"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="email" label-position="top">
          <el-input
            v-model="ruleForm.email"
            :placeholder="$t('性别')"
            disabled
            type="text"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="email" label-position="top">
          <el-input
            v-model="ruleForm.email"
            :placeholder="$t('邀请码')"
            type="text"
            autocomplete="off"
            size="large"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div @click="sendCode" class="w-full" size="large" round>
        <div
          class="w-full text-white text-lg font-semibold mx-auto py-3 rounded-lg flex items-center justify-center bg-green"
        >
          <div>{{ $t("登记") }}</div>
        </div>
      </div>

      <div
        class="w-full mt-4 text-sm text-white text-center pt-2"
        @click="toLogin"
      >
        <p class="text-sm text-center w-full pb-2" @click="toRegister">
            {{ $t("已有账户?")
            }}<span class="text-white">{{ $t("立即登录") }}</span>
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
import { reqSendCodeToEmail, reqSendCodeToPhone } from "../../api/apis";
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
const ruleForm = reactive({
  email: "",
});
const select = ref("US +1");
const rules = computed(() => {
  return {};
});
const accountType = ref(1);
const accountTypeList = computed(() => [
  {
    label: t("邮箱"),
    value: 1,
  },
  {
    label: t("手机号"),
    value: 2,
  },
]);

const onInput = () => {
  ruleForm.email = formatPhoneNumber(ruleForm.email);
};
function toLogin() {
  router.push("/account/login");
}

function sendCode() {
  ruleForm.email = ruleForm.email.replace(/\s+/g, "");
  if (accountType.value === 1) {
    if (!ruleForm.email) return ElMessage.error(t("请输入邮箱"));
    // 增加验证是否是正确邮箱地址
    if (!ruleForm.email.includes("@"))
      return ElMessage.error(t("请输入正确的邮箱地址"));
    reqSendCodeToEmail({ email: ruleForm.email, biz: "ureg" }).then((res) => {
      ElMessage({ message: t("验证码发送成功"), type: "success" });
      router.push({
        path: "/account/setPassword",
        query: { email: ruleForm.email, type: 1 },
      });
    });
  } else {
    if (!ruleForm.email) return ElMessage.error(t("请输入手机号"));
    // 手机号码需要时纯数字
    if (!/^[0-9]*$/.test(ruleForm.email))
      return ElMessage.error(t("请输入正确的手机号"));
    const country = areas.find((item) => item.label === select.value);
    reqSendCodeToPhone(`${country.value}${ruleForm.email}`).then((res) => {
      ElMessage({ message: t("验证码发送成功"), type: "success" });

      router.push({
        path: "/account/setPassword",
        query: {
          phone: `${country.value}${ruleForm.email}`,
          type: 2,
          country: country.area,
        },
      });
    });
  }
}

function handleChangeLang() {
  langRef.value.open();
}

function handleChangeType(value) {
  accountType.value = value;
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
