<template>
  <div class="flex flex-col w-full h-[100vh] bg bg-cover bg-center p-5">
    <div class="flex flex-col items-center pt-6 pb-3">
      <img
        src="@/static/images/account-lang.png"
        alt=""
        class="w-5 h-5 self-end mb-4 mt-4"
        @click="handleChangeLang"
      />
      <img
        src="@/static/images/logo.png"
        alt=""
        class="w-[50%] lg:w-[300px] mx-auto"
      />
      <div class="text-3xl text-main-bg font-semibold text-center py-4 pt-12">
        {{ $t("登入") }}
      </div>
      <div class="text-center text-sm text-main-bg pb-4">
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
        <el-form-item prop="" label-position="top">
          <el-input
            v-model="ruleForm.username"
            type="text"
            :placeholder="$t('用户名/电话')"
            autocomplete="off"
            size="large"
          />
        </el-form-item>
        <el-form-item class="relative w-full">
          <el-input
            v-model="ruleForm.password"
            :placeholder="$t('密码')"
            type="password"
            autocomplete="off"
            size="large"
            show-password
          />
        </el-form-item>
        <el-form-item label-position="top" class="relative w-full">
          <template class="w-full" #label>
            <div class="flex items-center w-full">
              <!-- <div class="text-sm">{{ $t("密码") }}</div> -->
              <div class="ml-auto text-white" @click="customer">
                {{ $t("忘记密码") }}
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
          class="w-full text-white text-lg font-semibold mx-auto py-3 rounded-lg flex items-center justify-center bg-green"
        >
          <div>{{ $t("登录") }}</div>
        </div>
      </div>
      <div class="w-full mt-4 text-sm text-white text-center pt-2">
        <p class="text-sm text-center w-full pb-2" @click="toRegister">
          {{ $t("还没有账户?")
          }}<span class="text-white">{{ $t("立即注册") }}</span>
        </p>

        <div class="text-sm text-center w-full" @click="customer">
          {{ $t("无法登录?")
          }}<span class="text-white">{{ $t("请联系我们的用户支持") }}</span>
        </div>
      </div>
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
  if (!ruleForm.username) return ElMessage.error(t("请输入用户名/电话"));
  if (!ruleForm.password) return ElMessage.error(t("请输入密码"));
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

const customer = () =>{
  ContactUsRef.value.open();
}
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
