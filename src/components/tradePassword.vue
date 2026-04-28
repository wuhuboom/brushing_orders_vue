<template>
  <div>
    <van-popup
      v-model:show="show"
      closeable
      position="bottom"
      class="p-5"
      :style="{ height: '30%' }"
    >
      <div class="text-[#666] font-semibold text-base pl-4 mt-10">
        {{ $t("transaction_password") }}
      </div>
      <div class="w-full mt-2 overflow-hidden shadow">
        <van-field
          v-model="tradePassword"
          label=""
          type="password"
          :placeholder="$t('transaction_password')"
          label-align="top"
        />
      </div>
      <div class="w-full mt-4">
        <van-button
          color="var(--theme-primary)"
          class="w-full"
          @click="submitTradePassword"
          >{{ $t("submit") }}</van-button
        >
      </div>
    </van-popup>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { checkTradePassword } from "../api/apis";
import { showToast } from "@/util/message";
import { useI18n } from "vue-i18n";
const router = useRouter();
const { t } = useI18n();
const show = ref(false);
const tradePassword = ref("");
const type = ref(null);
// 更符合Vue3习惯的暴露方式
const open = async (v) => {
  type.value = v;
  show.value = true;
};

const submitTradePassword = async () => {
  if (!tradePassword.value) return showToast(t("please_enter_transaction_password"));
  let ruleForm = {
    tradePassword: tradePassword.value,
  };
  let res = await checkTradePassword(ruleForm);
  let path =  type.value ==1?'/paymentMethods':type.value == 2?"withdraw":'deposit';
  router.push({
    path: path,
  });
};
const close = () => (show.value = false);

defineExpose({
  open,
  close, // 新增关闭方法
});
</script>
