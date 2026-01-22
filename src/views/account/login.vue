<template>
  <div class="login-con flex flex-col w-full h-[100vh] bg-[#F7F7F7]">
    <div class="flex justify-end bg-[#000] text-[#fff] py-[12px] px-[16px]">
      <div class="flex" @click="handleChangeLang">
        <img class="w-[20px] h-[20px]" src="@/static/images/lang-white.png" alt="">
        <div class="pl-[5px]">{{locale.toUpperCase()}}({{locale.toUpperCase()}})</div>
      </div>
    </div>
    <img
        src="@/static/images/loginBg.png"
        alt=""
    />
    <div class="flex bg-[#000] text-[#fff] text-[14px]">
      <div class="flex-1 text-center py-[12px]  border-b-[5px] " :class="type==1?'border-b-[#FF7D01]':'border-b-[#000]'" @click="tab(1)">
        {{$t('登录')}}

      </div>
      <div class="flex-1 text-center py-[12px]  border-b-[5px]" :class="type==2?'border-b-[#FF7D01]':'border-b-[#000]'" @click="tab(2)">{{$t('注册')}}</div>
    </div>

    <div v-if="type==1">
      <div class="flex flex-col items-center pb-3">
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
              <div class="flex items-center justify-end w-full">
                <div class="text-[#4E4E4E]" @click="customer">
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
            class="w-full text-white text-lg font-semibold mx-auto py-3 rounded-[8px] flex items-center justify-center bg-gradient-to-r from-[#FF9500] to-[#FF7A00]"
          >
            <div>{{ $t("登录") }}</div>
          </div>
        </div>
        <div class="w-full mt-4 text-sm text-white text-center pt-2">
          <p class="text-sm text-center w-full pb-2 text-[#6B7280]" @click="toRegister">
            {{ $t("还没有账户?")
            }}<span class="text-[#FF9500]">{{ $t("立即注册") }}</span>
          </p>
          <img class="w-[70px] fixed bottom-[100px] right-[10px]" @click="customer"  src="@/static/images/server.png" alt="">
        </div>
      </div>
      <div class="w-full mt-4 text-sm text-white text-center pt-2">
        <p class="text-sm text-center w-full pb-2" @click="toRegister">
        </p>
      </div>
    </div>
    <div v-else>
      <register v-model="type" ></register>
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
import register from "./register.vue";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {
  showToast,
} from "vant";
import { useCommonStore } from "@/store/modules/common";
import { useRouter,useRoute } from "vue-router";
import { setUserRemind } from "../../common/remind";
import { login, getTradeConfig } from "../../api/apis";
import { areas } from "@/config/area";
import { checkWorkTimeLocal } from "../../util/utils";
const ContactUsRef = ref(null);
const type = ref(1);

const tab = (index) =>{
  type.value = index;
  ruleForm.username = '';
  ruleForm.password = '';
  localStorage.removeItem("register")
  localStorage.removeItem("agentPassword")
}
function handleChangeLang() {
  langRef.value.open();
}


onMounted(() => {
  document.getElementById("app").style.background = "#fff";
});

onUnmounted(() => {
  document.getElementById("app").style.background = "transparent";
});

const router = useRouter();
const route = useRoute();
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
  // router.push({ path: "/account/register" });
  type.value = 2;
  localStorage.removeItem("register")
  localStorage.removeItem("agentPassword")
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
  if(route.query.type ==2) {
    type.value = 2
  }
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
