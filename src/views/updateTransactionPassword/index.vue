<template>
  <div class="container w-full min-h-[100vh] bg-white">
    <van-sticky type="primary">
      <van-nav-bar
        :title="$t('更新交易密码')"
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
              v-model="ruleForm.oldTradePassword"
              :label="$t('旧密码')"
              placeholder="旧密码"
              input-align="right"
            />
          </van-cell-group>
        </div>
        <div class="w-full mt-2 overflow-hidden bg-[#e8f7ec] py-2">
          <van-cell-group inset>
            <van-field
              label-width="150"
              v-model="ruleForm.newTradePassword"
              :label="$t('新密码')"
              placeholder="新密码"
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
              placeholder="确认密码"
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
import { editTradePassword } from "../../api/apis";
import { useRouter } from "vue-router";
const router = useRouter();
const agentNewPassword = ref('');
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const ruleForm = reactive({
  oldTradePassword: "",
  newTradePassword: "",
});
const onClickLeft = () => history.back();
const submitForm = async() =>{
  if (!ruleForm.oldTradePassword) return ElMessage.error(t("请输入旧密码"));
  if (!ruleForm.newTradePassword) return ElMessage.error(t("请输入新密码"));
  if (ruleForm.newTradePassword != agentNewPassword.value) return ElMessage.error(t("两次密码不一致"));
  let res = await editTradePassword(ruleForm);
  ElMessage({ message: t("修改成功"), type: "success" });
  router.push({ path: "/profileItem" });
}
</script>
