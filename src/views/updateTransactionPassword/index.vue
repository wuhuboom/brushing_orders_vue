<template>
  <div class="updataPass container w-full min-h-[100vh] bg-[#F5F5F5]">
    <van-sticky type="primary">
      <van-nav-bar
        :title="$t('更新交易密码')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
    <div class="w-full mt-6  box-border flex flex-col">
      <div class="w-full mt-12 flex flex-col">
        <div class="w-full">
          <van-cell-group inset>
            <van-field
              label-align="top"
              label-width="150"
              v-model="ruleForm.oldTradePassword"
              label=""
              type="password"
              :placeholder="$t('旧密码')"
              
            />
          </van-cell-group>
        </div>
        <div class="w-full">
          <van-cell-group inset>
            <van-field
              label-align="top"
              label-width="150"
              type="password"
              v-model="ruleForm.newTradePassword"
              label=""
              :placeholder="$t('新密码')"
              
            />
          </van-cell-group>
        </div>
        <div class="w-full">
          <van-cell-group inset>
            <van-field
              label-align="top"
              label-width="150"
              type="password"
              v-model="agentNewPassword"
              label=""
              :placeholder="$t('确认密码')"
            />
          </van-cell-group>
        </div>
      </div>
      <div class="w-[90%] fixed bottom-[30px] left-1/2 -translate-x-1/2 mt-4">
        <van-button color="#000" size="large" class="w-full" @click="submitForm">{{ $t("更新") }}</van-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref,reactive } from "vue";
import { editTradePassword } from "../../api/apis";
import { showLoadingToast,closeToast,showFailToast,showSuccessToast   } from 'vant';
import { useRouter } from "vue-router";
const router = useRouter();
const agentNewPassword = ref('');
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const ruleForm = reactive({
  oldTradePassword: "",
  newTradePassword: "",
});
const onClickLeft = () => router.replace('/profileItem');
const submitForm = async () => {
  if (!ruleForm.oldTradePassword) return showFailToast(t("请输入旧密码"));
  if (!ruleForm.newTradePassword) return showFailToast(t("请输入新密码"));

  // 校验密码长度 6-18 位
  if (ruleForm.newTradePassword.length < 6 || ruleForm.newTradePassword.length > 18) {
    return showFailToast(t("密码长度需为 6-18 位"));
  }

  if (ruleForm.newTradePassword !== agentNewPassword.value) {
    return showFailToast(t("两次密码不一致"));
  }

  let res = await editTradePassword(ruleForm);
  showSuccessToast(t("修改成功"));
  router.push({ path: "/profileItem" });
};
</script>
