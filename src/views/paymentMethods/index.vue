<template>
  <div class="payment-method-page min-h-screen bg-[#eef2fb]">
    <PageTopBar :title="$t('wallet_management')" show-back :right-text="$t('history')" @click-left="onClickLeft" @click-right="goHistory" />

    <div class="payment-method-page__body">
      <section class="payment-method-page__amount-card">
        <div class="payment-method-page__amount-label">{{ $t("account_amount") }}</div>
        <div class="payment-method-page__amount-value">{{ accountAmountText }}</div>
      </section>

      <div class="payment-method-page__form">
        <div class="field-group">
          <div class="field-title">{{ $t("wallet_name") }}</div>
          <div class="field-box field-box--select">
            <van-field
              v-model="form.withdrawName"
              label=""
:placeholder="$t('please_enter_wallet_name')"
              label-align="top"
              class="custom-field"
            />
            <img class="select-arrow" src="@/static/images/wallet-select-arrow.png" alt="" />
          </div>
        </div>

        <div class="field-group">
          <div class="field-title">{{ $t("network") }}</div>
          <div class="field-box">
            <van-field
              v-model="form.withdrawType"
              label=""
:placeholder="$t('please_enter_network')"
              label-align="top"
              class="custom-field"
            />
          </div>
        </div>

        <div class="field-group">
          <div class="field-title">{{ $t("wallet_address") }}</div>
          <div class="field-box">
            <van-field
              v-model="form.withdrawAddress"
              label=""
:placeholder="$t('please_enter_wallet_address')"
              label-align="top"
              class="custom-field"
            />
          </div>
        </div>

        <div class="notice-text">
          {{ $t("withdrawal_within_hour") }}
        </div>

        <van-button
          class="submit-btn"
          :class="{ 'submit-btn--active': isFormReady }"
          block
          @click="submitForm"
        >
          {{ $t("confirm") }}
        </van-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import PageTopBar from "@/components/PageTopBar.vue";
import { computed, onMounted, reactive } from "vue";
import { addWithdrawalMethod } from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { showToast } from "@/util/message";
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();
const form = reactive({
  withdrawName: "",
  withdrawAddress: "",
  withdrawType: "",
});
const accountAmountText = computed(() => {
  const amount = Number(userStore.userInfo?.balance || 0);
  return amount.toFixed(2);
});
const isFormReady = computed(
  () =>
    !!String(form.withdrawName || "").trim() &&
    !!String(form.withdrawAddress || "").trim() &&
    !!String(form.withdrawType || "").trim(),
);
const submitForm = async () => {
  if (!form.withdrawName) return showToast(t("please_enter_wallet_name"));
  if (!form.withdrawType) return showToast(t("please_enter_network"));
  if (!form.withdrawAddress) return showToast(t("please_enter_address"));
  await addWithdrawalMethod(form);
  showToast(t("added_successfully"));
  router.push({ path: "/my" });
};

const onClickLeft = () => {
  router.push({ path: "/my" });
};
const goHistory = () => {
  router.push({ path: "/withdrawHistory" });
};
onMounted(async () => {
  await userStore.getUserInfo();
  form.withdrawName = userStore.userInfo.withdrawName;
  form.withdrawAddress = userStore.userInfo.withdrawAddress;
  form.withdrawType = userStore.userInfo.withdrawType;
});
</script>

<style scoped>
.payment-method-page {
  min-height: 100vh;
  background: #eef2fb;
  color: #0f1115;
}

.wallet-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: 80px;
  display: grid;
  grid-template-columns: 50px minmax(0, 1fr) 74px;
  align-items: center;
  background: #000;
  color: #fff;
}

@media (min-width: 768px) {
  .wallet-header {
    left: 50%;
    right: auto;
    width: var(--app-pc-max-width, 375px);
    transform: translateX(-50%);
  }
}

.wallet-back,
.wallet-history {
  height: 100%;
  border: 0;
  background: transparent;
  color: #fff;
  padding: 0;
}

.wallet-back {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wallet-back span {
  width: 21px;
  height: 21px;
  border-left: 4px solid #fff;
  border-bottom: 4px solid #fff;
  transform: rotate(45deg);
  border-radius: 2px;
  margin-left: 8px;
}

.wallet-title {
  min-width: 0;
  text-align: center;
  color: #fff;
  font-size: 21px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wallet-history {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
  font-weight: 600;
  white-space: nowrap;
}

.payment-method-page__body {
  padding: 100px 19px 40px;
}

.payment-method-page__amount-card {
  position: relative;
  overflow: hidden;
  height: 126px;
  padding: 22px 18px;
  border-radius: 8px;
  background: #2d5ddb url("@/static/images/wallet-amount-card-bg.png") center / cover no-repeat;
  box-sizing: border-box;
}

.payment-method-page__amount-label,
.payment-method-page__amount-value {
  position: relative;
  z-index: 1;
  color: #fff;
}

.payment-method-page__amount-label {
  font-size: 21px;
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: 0;
}

.payment-method-page__amount-value {
  margin-top: 19px;
  font-size: 34px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.payment-method-page__form {
  margin-top: 28px;
}

.field-group + .field-group {
  margin-top: 22px;
}

.field-title {
  margin-bottom: 10px;
  color: #0f1115;
  font-size: 19px;
  line-height: 1.2;
  font-weight: 500;
}

.field-box {
  display: flex;
  align-items: center;
  min-height: 58px;
  padding: 0 16px;
  border: 1px solid #d8e0ee;
  border-radius: 9px;
  background: #fff;
  box-sizing: border-box;
}

.field-box--select {
  padding-right: 18px;
}

.select-arrow {
  width: 18px;
  height: 12px;
  object-fit: contain;
  flex: 0 0 auto;
  margin-left: 10px;
}

.custom-field {
  flex: 1;
  min-width: 0;
  padding: 0;
  background: transparent;
}

.payment-method-page :deep(.custom-field.van-cell) {
  padding: 0;
  background: transparent;
}

.payment-method-page :deep(.custom-field.van-cell::after) {
  display: none;
}

.payment-method-page :deep(.custom-field .van-field__body) {
  min-height: 58px;
}

.payment-method-page :deep(.custom-field .van-field__control) {
  width: 100%;
  color: #111827;
  font-size: 19px;
  line-height: 1.2;
  min-height: 24px;
  font-weight: 400;
}

.payment-method-page :deep(.custom-field .van-field__control::placeholder) {
  color: #596375;
  opacity: 1;
}

.notice-text {
  margin: 35px 4px 0;
  color: #2f63f3;
  font-size: 19px;
  line-height: 1.35;
  font-weight: 400;
}

.submit-btn {
  margin-top: 31px;
  height: 58px;
  border: none;
  border-radius: 9px;
  background: #3442e6;
  color: #fff;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.submit-btn--active {
  background: #3442e6;
  box-shadow: none;
  color: #fff;
}
</style>
