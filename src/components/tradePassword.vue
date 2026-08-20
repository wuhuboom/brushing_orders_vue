<template>
  <van-popup
    v-model:show="show"
    round
    closeable
    position="bottom"
    class="trade-popup"
    ><form class="trade-inner" novalidate @invalid.capture.prevent @submit.prevent="submit">
      <h2>{{ $t("das.form.enterTradePassword") }}</h2>
      <input
        v-model="password"
        type="password"
        inputmode="numeric"
        autocomplete="off"
      /><button type="submit">{{ $t("das.form.verify") }}</button>
    </form></van-popup
  >
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { useI18n } from "vue-i18n";
import { checkTradePassword } from "@/api/apis";
import { safePush } from "@/utils/navigation";
const router = useRouter(),
  { t } = useI18n(),
  show = ref(false),
  password = ref(""),
  type = ref();
const open = (v) => {
  type.value = v;
  show.value = true;
};
const close = () => (show.value = false);
const submit = async () => {
  if (!password.value) return showToast(t("das.auth.required"));
  const res = await checkTradePassword({ tradePassword: password.value });
  if (res.data) sessionStorage.setItem("dasWithdrawalToken", res.data);
  password.value = "";
  close();
  safePush(
    router,
    type.value === 1
      ? "/paymentMethods"
      : type.value === 2
        ? "/withdraw"
        : "/deposit",
  );
};
defineExpose({ open, close });
</script>
<style scoped>
.trade-popup {
  width: min(100%, var(--das-app-max-width));
  left: 50%;
  transform: translateX(-50%);
  background: #f7f5ec;
}
.trade-inner {
  padding: 42px 28px max(30px, env(safe-area-inset-bottom));
  color: #17382d;
}
.trade-inner h2 {
  margin: 0 0 18px;
  text-align: center;
}
.trade-inner input {
  width: 100%;
  height: 54px;
  padding: 0 16px;
  border: 1px solid #d7d8d0;
  border-radius: 14px;
  background: white;
}
.trade-inner button {
  width: 100%;
  height: 50px;
  margin-top: 16px;
  border: 0;
  border-radius: 999px;
  background: #14392c;
  color: white;
  font-weight: 700;
}
</style>
