<template>
  <div class="updataPass container w-full min-h-[100vh] bg-white">
    <van-sticky type="primary">
      <van-nav-bar
        :title="$t('更新密码')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
    <div class="w-full  mt-6  box-border flex flex-col">
      <div class="w-full mt-12 flex flex-col">
        <div class="w-full">
          <van-cell-group inset>
            <van-field
              label-align="top"
              label-width="150"
              type="password"
              v-model="ruleForm.oldPassword"
              :label="$t('旧密码')"
              :placeholder="$t('旧密码')"
            />
          </van-cell-group>
        </div>
        <div class="w-full">
          <van-cell-group inset>
            <van-field
            label-align="top"
              label-width="150"
              v-model="ruleForm.newPassword"
              :label="$t('新密码')"
              type="password"
              :placeholder="$t('新密码')"
            />
          </van-cell-group>
        </div>
        <div class="w-full ">
          <van-cell-group inset>
            <van-field
            label-align="top"
              label-width="150"
              v-model="agentNewPassword"
              :label="$t('确认密码')"
              type="password"
              :placeholder="$t('确认密码')"

            />
          </van-cell-group>
        </div>
      </div>
      <div class="w-[85%] mx-auto mt-4">
        <van-button color="#206645" class="w-full" @click="submitForm">{{ $t("更新") }}</van-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref,reactive } from "vue";
const onClickLeft = () => router.replace('/profileItem');
import { showLoadingToast,closeToast,showFailToast,showSuccessToast   } from 'vant';
import { editPassword } from "../../api/apis";
import { useRouter } from "vue-router";
const router = useRouter();
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const agentNewPassword = ref('');
const ruleForm = reactive({
  oldPassword: "",
  newPassword: "",
});
const submitForm = async () => {
  if (!ruleForm.oldPassword) return showFailToast(t("请输入旧密码"));
  if (!ruleForm.newPassword) return showFailToast(t("请输入新密码"));
  // 校验密码长度 6-18 位
  if (ruleForm.newPassword.length < 6 || ruleForm.newPassword.length > 18) {
    return showFailToast(t("密码长度需为 6-18 位"));
  }
  if (ruleForm.newPassword !== agentNewPassword.value) {
    return showFailToast(t("两次密码不一致"));
  }
  let res = await editPassword(ruleForm);
  showSuccessToast(t("修改成功"));
  router.push({ path: "/profileItem" });
};
</script>
