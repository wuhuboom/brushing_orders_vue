<template>
  <div class="payment-method-page min-h-screen bg-[#F5F8F7]">
    <PageTopBar :title="$t('payment_method')" show-back @click-left="onClickLeft" />

    <div class="pt-[78px] pb-[36px]">
      <div class="hero-card">
        <div class="hero-icon-wrap">
          <van-icon name="balance-o" size="34" color="#fff" />
        </div>
        <div class="hero-content">
          <div class="hero-title">{{ $t("bind_withdrawal_account") }}</div>
          <div class="hero-desc">
            {{
              $t(
                'dear_user_please_enter_your_btc_20_eth_20_address_do_not_enter_your_bank_account_information_or_password'
              )
            }}
          </div>
        </div>
      </div>

      <div class="px-[26px] mt-[26px]">
        <div class="field-group">
          <div class="field-label">
            <van-icon name="coupon-o" size="16" />
            <span>{{ $t('wallet') }}</span>
          </div>
          <van-field
            v-model="form.withdrawName"
            label=""
            :placeholder="$t('wallet')"
            label-align="top"
            class="custom-field"
          />
        </div>

        <div class="field-group">
          <div class="field-label">
            <van-icon name="contact-o" size="16" />
            <span>{{ $t('network') }}</span>
          </div>
          <van-field
            v-model="form.withdrawType"
            label=""
            :placeholder="$t('network')"
            label-align="top"
            class="custom-field"
          />
        </div>

        <div class="field-group">
          <div class="field-label">
            <van-icon name="balance-list-o" size="16" />
            <span>{{ $t('address') }}</span>
          </div>
          <van-field
            v-model="form.withdrawAddress"
            label=""
            :placeholder="$t('address')"
            label-align="top"
            class="custom-field"
          />
        </div>

        <div class="notice-card">
          <van-icon name="shield-o" size="18" color="#C0A34A" />
          <div class="notice-text">
            {{ $t("account_encrypted_notice") }}
          </div>
        </div>

        <div class="mt-[30px]">
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
  </div>
</template>
<script setup>
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
const isFormReady = computed(
  () =>
    !!String(form.withdrawName || "").trim() &&
    !!String(form.withdrawAddress || "").trim() &&
    !!String(form.withdrawType || "").trim(),
);
const submitForm = async () => {
  if (!form.withdrawName) return showToast(t("please_enter_wallet_name"));
  if (!form.withdrawAddress) return showToast(t("please_enter_network"));
  if (!form.withdrawAddress) return showToast(t("please_enter_address"));
  let res = await addWithdrawalMethod(form);
  showToast(t("added_successfully"));
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

<style scoped>
.payment-method-page :deep(.van-nav-bar) {
  background: #ffffff;
}

.payment-method-page :deep(.van-nav-bar__title) {
  color: #24352d;
  font-size: 20px;
  font-weight: 500;
}

.payment-method-page :deep(.van-nav-bar .van-icon) {
  color: #23a455;
}

.payment-method-page :deep(.van-nav-bar::after) {
  border-bottom: 1px solid #dbe9df;
}

.hero-card {
  background: linear-gradient(135deg, #1e9c48 0%, #16863d 100%);
  padding: 30px 28px 24px;
  display: flex;
  gap: 18px;
  align-items: flex-start;
}

.hero-icon-wrap {
  width: 62px;
  height: 62px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hero-content {
  min-width: 0;
  flex: 1;
}

.hero-title {
  color: #ffffff;
  font-size: 18px;
  line-height: 25px;
  font-weight: 500;
}

.hero-desc {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 14px;
  line-height: 22px;
}

.field-group + .field-group {
  margin-top: 18px;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4f9664;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 10px;
}

.custom-field {
  border: 1px solid #cfe5d5;
  border-radius: 16px;
  background: #ffffff;
  padding: 14px 16px;
}

.payment-method-page :deep(.custom-field .van-field__control) {
  color: #24352d;
  font-size: 16px;
  min-height: 24px;
}

.payment-method-page :deep(.custom-field .van-field__control::placeholder) {
  color: #98a39d;
}

.notice-card {
  margin-top: 34px;
  padding: 18px 20px;
  border-radius: 16px;
  background: #e8f3eb;
  border: 1px solid #cfe5d5;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.notice-text {
  color: #6f8f78;
  font-size: 14px;
  line-height: 24px;
}

.submit-btn {
  height: 56px;
  border: none;
  border-radius: 16px;
  background: #cfe8d5;
  color: #5c9369;
  font-size: 16px;
  font-weight: 500;
}

.submit-btn--active {
  background: linear-gradient(180deg, #2fc867 0%, #159c42 100%);
  box-shadow: 0 14px 24px rgba(33, 150, 72, 0.2);
  color: #ffffff;
}
</style>
