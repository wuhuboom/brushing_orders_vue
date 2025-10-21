<template>
  <div class="w-full min-h-[100vh] bg-[#fff] pl-4 pr-4">
    <van-nav-bar
      :title="$t('付款方式')"
      fixed
      left-arrow
      class="border"
      @click-left="onClickLeft"
    />
    <div class="text-[14px] text-[#666666] mb-4 mt-[75px]">
      {{
        $t(
          "尊敬的用户，请填写您的BTC-20/ETH-20地址。请勿输入您的银行账户信息和密码。"
        )
      }}
    </div>
    <div class="text-[#111827] font-semibold mt-10">
      {{ $t("钱包") }}
    </div>
    <div class="w-full mt-2 overflow-hidden">
      <van-field
        v-model="form.withdrawName"
        label=""
        :placeholder="$t('钱包')"
        label-align="top"
      />
    </div>
    <div class="text-[#111827] font-semibold mt-5">
      {{ $t("网络") }}
    </div>
    <div class="w-full mt-2 overflow-hidden">
      <van-field
        v-model="form.withdrawType"
        label=""
        :placeholder='$t("网络")'
        label-align="top"
      />
    </div>
    <div class="text-[#111827] font-semibold mt-5">
      {{ $t("地址") }}
    </div>
    <div class="w-full mt-2 overflow-hidden">
      <van-field
        v-model="form.withdrawAddress"
        label=""
        :placeholder='$t("地址")'
        label-align="top"
      />
    </div>
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%]">
      <van-button  class="w-full" style="background: linear-gradient(135deg, #002D72, #0A4DA2);color: #fff;" @click="submitForm">
        {{ $t("更新") }}
      </van-button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import { addWithdrawalMethod } from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  showToast
} from "vant";
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();
const form = reactive({
  withdrawName: "",
  withdrawAddress: "",
  withdrawType: "",
});
const submitForm = async () => {
  if (!form.withdrawName) return showToast(t("请输入钱包名称"));
  if (!form.withdrawAddress) return showToast(t("请输入网络"));
  if (!form.withdrawAddress) return showToast(t("请输入地址"));
  let res = await addWithdrawalMethod(form);
  showToast(t("添加成功"))
  router.push({ path: "/my" });
};

const onClickLeft = () => {
  router.push({ path: "/my" });
};
onMounted(async () => {
  await userStore.getUserInfo();
  form.withdrawName = userStore.userInfo.withdrawName;
  form.withdrawAddress = userStore.userInfo.withdrawAddress;
  form.withdrawType = userStore.userInfo.withdrawType;
});
</script>
