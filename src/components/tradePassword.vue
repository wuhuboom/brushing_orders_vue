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
        {{ $t("交易密码") }}
      </div>
      <div class="w-full mt-2 overflow-hidden shadow">
        <van-field
          v-model="tradePassword"
          label=""
          type="password"
          :placeholder="$t('交易密码')"
          label-align="top"
        />
      </div>
      <div class="w-full mt-4">
        <van-button
          color="#206645"
          class="w-full"
          @click="submitTradePassword"
          >{{ $t("提交") }}</van-button
        >
      </div>
    </van-popup>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { checkTradePassword } from "../api/apis";
import { showToast   } from 'vant';
const router = useRouter();
const show = ref(false);
const tradePassword = ref("");
const type = ref(null);
// 更符合Vue3习惯的暴露方式
const open = async (v) => {
  type.value = v;
  show.value = true;
};

const submitTradePassword = async () => {
  if (!tradePassword.value) return showToast(t("请输入交易密码"));
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
