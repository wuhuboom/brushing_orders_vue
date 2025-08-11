<template>
  <div class="container w-full min-h-[100vh] bg-white">
    <van-sticky type="primary">
      <van-nav-bar
        :title="$t('更新密码')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
    <div class="w-full pl-6 mt-6 pr-6 box-border flex flex-col">
      <div class="w-full mt-12 flex flex-col">
        <div class="w-full overflow-hidden bg-[#e8f7ec] py-2">
          <van-cell-group inset>
            <van-field
              label-width="150"
              v-model="ruleForm.oldPassword"
              :label="$t('旧密码')"
              :placeholder="$t('旧密码')"
              input-align="right"
            />
          </van-cell-group>
        </div>
        <div class="w-full mt-2 overflow-hidden bg-[#e8f7ec] py-2">
          <van-cell-group inset>
            <van-field
              label-width="150"
              v-model="ruleForm.newPassword"
              :label="$t('新密码')"
              :placeholder="$t('新密码')"
              input-align="right"
            />
          </van-cell-group>
        </div>
        <div class="w-full mt-2 overflow-hidden bg-[#e8f7ec] py-2">
          <van-cell-group inset>
            <van-field
              label-width="150"
              v-model="agentNewPassword"
              :label="$t('确认密码')"
              :placeholder="$t('确认密码')"
              input-align="right"
            />
          </van-cell-group>
        </div>
      </div>
      <div class="w-full mt-4">
        <van-button color="#007513" class="w-full" @click="submitForm">{{ $t("更新") }}</van-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref,reactive } from "vue";
const onClickLeft = () => history.back();
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
const submitForm = async() =>{
  if (!ruleForm.oldPassword) return showFailToast(t("请输入旧密码"));
  if (!ruleForm.newPassword) return showFailToast(t("请输入新密码"));
  if (ruleForm.newPassword != agentNewPassword.value) return showFailToast(t("两次密码不一致"));
  let res = await editPassword(ruleForm);
  showSuccessToast(t("修改成功"))
  router.push({ path: "/profileItem" });

}
</script>
