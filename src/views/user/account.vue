<template>
  <div class="flex flex-col">
    <Header view="market" :label="$t('我的账户')"></Header>
    <div class="flex flex-col items-center pb-3">
      <div class="h-24 w-24 shadow-xl rounded-full mt-11 relative" @click="">
        <el-upload
          class="avatar-uploader h-24 w-24"
          :action="$uploadUrl"
          :headers="{ Authorization: userStore.token }"
          :show-file-list="false"
          :on-success="handleSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="userStore.userInfo.avatar"
            :src="avatar"
            class="avatar rounded-full overflow-hidden"
          />
           <img v-else  src="@/static/images/logo.png" alt="" class="w-full h-full rounded-full overflow-hidden" />
           <div class="bg-base avatar-edit-wrap">
            <el-icon size="15"><EditPen /></el-icon>
           </div>
        </el-upload>
      </div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="w-full mt-10"
      >
        <el-form-item prop="username" label-position="top">
          <el-input
            v-model="ruleForm.nickname"
            type="text"
            autocomplete="off"
            size="large"
          />
        </el-form-item>
      </el-form>
      <div
        v-for="(item, index) in menu"
        :key="item.title"
        class="flex items-center py-4 gap-4 w-full text-base"
        :style="`border-bottom: ${
          index < menu.length - 1 ? '1px solid hsla(0, 0%, 92.9%, .46);' : ''
        }`"
        @click="onClickMenu(item)"
      >
        <div class="flex-1 leading-normal">{{ item.title }}</div>
        <div class="flex items-center gap-4 ml-auto">
          <div v-if="item.leftTitle" class="opacity-30">
            {{ item.leftTitle }}
          </div>
          <el-icon class="opacity-30" size="20">
            <ArrowRight />
          </el-icon>
        </div>
      </div>
      <div @click="edit" class="w-full relative -right-5">
        <div
          class="text-base mt-10 bg-blue px-5 flex items-center h-12 rounded-l-2.5 text-white button-bg"
        >
          <div>{{ $t("完成") }}</div>
          <el-icon class="ml-auto" size="20"><Select /></el-icon>
        </div>
      </div>
      <div @click="handleLogout" class="w-full relative -left-5">
        <div
          class="text-base mt-4 mr-10 bg-red px-5 flex items-center h-12 rounded-r-2.5 text-white button-bg"
        >
          <!-- <el-icon size="20"><Select /></el-icon> -->
          <img src="@/static/images/out.png" alt="" class="h-8 w-8">
          <div class="ml-auto">{{ $t("退出") }}</div>
        </div>
      </div>
    </div>
    <Logout ref="logoutRef"></Logout>
  </div>
</template>
<script setup>
import Header from "@/components/Header.vue";
import Logout from "./components/Logout.vue";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { reqRegister } from "@/api/apis";
import { areas } from "../../config/area";
import { reqEditNickname, reqSendCode,updateAvatar } from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
const router = useRouter();
const { t } = useI18n();
const ruleFormRef = ref(null);
const userStore = useUserStore();
const avatar = ref(userStore.userInfo.avatar)
const logoutRef = ref(null);
const ruleForm = reactive({
  nickname: userStore.userInfo?.nickname,
});

const menu = [
  { title: t("修改密码"), url: "/user/changePassword" },
  { title: t("隐私政策"), url: "/user/privacy" },
];

function submitForm(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!");
      ruleForm.nickname = ruleForm.email;
      reqRegister(ruleForm).then((res) => {
        ElMessage({ message: t("注册成功"), type: "success" });
        router.push("/account/login");
      });
    } else {
      console.log("error submit!");
    }
  });
}

function edit() {
  if (userStore.userInfo?.nickname !== ruleForm.nickname) {
    reqEditNickname(ruleForm).then((res) => {
      ElMessage({ message: t("修改成功"), type: "success" });
    });
  }
}

function onClickMenu(item) {
  router.push({
    path: item.url,
  });
}

function handleLogout() {
  logoutRef.value.open();
}

function handleSuccess(response, file, fileList) {
    console.log(response.data)
    getUpdateAvatar(response.data)
}

function getUpdateAvatar(avatarUrl) {
    let params = {
      url:avatarUrl
    }
    updateAvatar(params).then(res =>{
        ElMessage({ message: t("修改成功"), type: "success" });
        avatar.value = avatarUrl
    })
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
.avatar-edit-wrap {
  position: absolute;
  width: 22px;
  height: 22px;
  border-radius: 5px;
  left: 50%;
  margin-left: -11px;
  bottom: -11px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
}

.bg-base {
  background-color: #0065ff !important;
}
.avatar {
  width: 96px;
  height: 96px;
}
</style>
