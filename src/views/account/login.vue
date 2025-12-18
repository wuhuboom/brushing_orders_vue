<template>
  <div class="login-con flex flex-col w-full h-[100vh] bg-[#fff]">
    <img
        src="@/static/images/loginBg.png"
        alt=""
      />
    <div class="h-[30px] rounded-tl-[20px] rounded-tr-[20px] mt-[-30px] bg-[#fff]"></div>
    <!-- <div class="fixed top-2 right-5 h-9 flex items-center justify-center">
      <div
        class="flex ml-2 overflow-hidden bg-[#ff497c] p-2 rounded-full box-border text-white text-sm"
        @click="handleChangeLang"
      >
        <img
          src="@/static/images/lang-white.png"
          alt=""
          class="w-5 h-5 block object-contain"
        />
        <div class="ml-2 uppercase font-bold">{{commonStore.lang}}</div>
      </div>
    </div> -->

    <div class="flex flex-col items-center pb-3">
      <!-- <div class="text-5xl text-[#ff497c] font-semibold text-center py-4">
        Sign In
      </div> -->
      <!-- <div class="text-center text-[24px] text-[#FA8B26] pt-[25px]">{{$t('注册即可免费获得 20 美元')}}</div> -->

      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="w-[90%] mt-10"
      >
        <el-form-item prop="" :label="$t('用户名')+'*'"  label-position="top">
          <el-input
            v-model.trim="ruleForm.username"
            type="text"
            :placeholder="$t('用户名')"
            autocomplete="off"
            size="large"
          >
            <!-- <template #prefix>
              <img class="w-[18px]" src="@/static/images/user.png" alt="" />
            </template> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="" :label="$t('密码')+'*'" label-position="top"  class="relative w-full">
          <el-input
            v-model="ruleForm.password"
            :placeholder="$t('密码')"
            type="password"
            autocomplete="off"
            size="large"
            show-password
          >
            <!-- <template #prefix>
              <img class="w-[18px]" src="@/static/images/word.png" alt="" />
            </template> -->
          </el-input>
        </el-form-item>
        <el-form-item label-position="top" class="relative w-full">
          <template class="w-full" #label>
            <div class="flex items-center w-full">
              <div class="text-[#334155]" @click="customer">
                {{ $t("忘记密码") }}?
              </div>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <div
        @click="submitForm(ruleFormRef)"
        class="w-[90%] pb-[10px]"
        size="large"
        round
      >
        <div
          class="w-full text-white text-lg font-semibold mx-auto py-3 rounded-[8px] flex items-center justify-center bg-[#1E3A8A]"
        >
          <div>{{ $t("登录") }}</div>
        </div>
      </div>
      <div class="w-full mt-4 text-sm text-white text-center pt-2">
        <p class="text-sm text-center w-full pb-2 text-[#9CA3AF]" @click="toRegister">
          {{ $t("还没有账户?")
          }}<span class="text-[#38BDF8]">{{ $t("立即注册") }}</span>
        </p>
        <div style="border: 1px solid #fff;" class="flex justify-center items-center w-[40%] py-[1px] mx-auto my-[10px]" @click="customer">
          <img src="@/static/images/LiveChat.png" class="w-[29px] h-[29px] mr-[3px]" alt="">
          
          {{ $t("live.chat.str") }}
        </div>

        <!-- <div class="text-sm text-center w-full" @click="customer">
          {{ $t("无法登录?")
          }}<span class="text-white">{{ $t("请联系我们的用户支持") }}</span>
        </div> -->
      </div>
    </div>
    <div class="w-full mt-4 text-sm text-white text-center pt-2">
      <p class="text-sm text-center w-full pb-2" @click="toRegister">
        <!-- {{ $t("还没有账户?")}} -->
        <!-- <span class="text-white underline">{{ $t("立即注册") }}</span> -->
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
import {
  showLoadingToast,
  closeToast,
  showFailToast,
  showSuccessToast,
  showToast,
} from "vant";
import { useCommonStore } from "@/store/modules/common";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { setUserRemind } from "../../common/remind";
import { login, getTradeConfig } from "../../api/apis";
import { areas } from "@/config/area";
import { checkWorkTimeLocal } from "../../util/utils";
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
  if (!ruleForm.username) return showToast(t("请输入用户名/电话"));
  if (!ruleForm.password) return showToast(t("请输入密码"));
  formEl.validate((valid) => {
    if (valid) {
      let data = {
        username: ruleForm.username,
        password: ruleForm.password,
      };
      login(data).then((res) => {
        userStore.setToken(`Bearer ${res.data.token}`);
        userStore.setUserInfo(res.data.info);
        // setUserRemind();
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

const TradeInfor = ref({});
const tradeConfig = async () => {
  let res = await getTradeConfig();
  TradeInfor.value = res.data;
};

const customer = () => {
  const time = checkWorkTimeLocal(
    TradeInfor.value.workTimeStart,
    TradeInfor.value.workTimeEnd,
    userStore.zoneActive.tzName
  );
  if (time) {
    ContactUsRef.value.open();
  } else {
    showToast(t("supportHours"));
  }
};
onMounted(() => {
  tradeConfig();
});
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
