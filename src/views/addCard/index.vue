<template>
  <div class="add-card-page min-h-screen bg-[#eef2fb]">
    <PageTopBar :title="$t('bank_card_management')" show-back @click-left="onClickLeft" />
    <div class="add-card-page__body">
    <div class="add-card-page__header-card">
      <div class="add-card-page__header-title">{{ $t("add_bank_card") }}</div>
      <div class="add-card-page__header-desc">{{ $t("bank_card_management") }}</div>
    </div>
    <div class="field-title mt-8">
      {{ $t("bank_name") }}
    </div>
    <div
      class="field-box"
    >
      <img class="field-icon" src="../../static/images/code.png" alt="">
      <van-field
        v-model="form.bankCode"
        label=""
        :placeholder="$t('please_enter_bank_name')"
        label-align="top"
        class="custom-field"
      />
    </div>
    <div class="field-title">
      {{ $t("name") }}
    </div>
    <div
      class="field-box"
    >
     <img class="field-icon" src="../../static/images/name.png" alt="">
      <van-field
        v-model="form.name"
        label=""
        :placeholder="$t('please_enter_name')"
        label-align="top"
        class="custom-field"
      />
    </div>
    <div class="field-title">
      {{ $t("bank_account") }}
    </div>
    <div
      class="field-box"
    >
      <img class="field-icon" src="../../static/images/accout.png" alt="">
      <van-field
        v-model="form.bankCard"
        label=""
        :placeholder="$t('please_enter_bank_account')"
        label-align="top"
        class="custom-field"
      />
    </div>
    <div class="field-title">
      {{ $t("account_type") }}
    </div>
    <div
      class="field-box"
    >
      <van-field
        v-model="form.bankType"
        label=""
        :placeholder="$t('please_enter_account_type')"
        label-align="top"
        class="custom-field"
      />
    </div>
    <!-- <div
      class="flex justify-between items-center w-full mt-2 overflow-hidden pb-[20px]"
      style="border-bottom: 1px solid #e5e7eb"
      @click="showPicker = true"
    >
      <div class="pl-[7px]">{{ type== 1 ? "银行卡" : "wallet" }}</div>
      <van-icon name="arrow-down" />
    </div> -->
    <div class="w-full mt-10">
      <van-button
        class="submit-btn w-full"
        @click="submitForm"
        >{{ $t("submit") }}</van-button
      >
    </div>
    </div>

    <!-- <van-popup
      v-model:show="showPicker"
      position="bottom"
      :style="{
        position: 'fixed !important',
        height: '30%',
        background: '#fff',
        borderRadius: '12px',
        bottom: '0px',
      }"
    >
      <van-picker
        style="height: 200px"
        :model-value="pickerValue"
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup> -->
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import { addWalletBank, getBankWallet } from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { showToast } from "@/util/message";
import { Bottom } from "@element-plus/icons-vue";
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const showPicker = ref(false);
const form = reactive({
  name: "",
  bankCode: "",
  bankCard: "",
  bankType: "",
});
const pickerValue = ref(["1"]);
const type = ref(1);
// const columns = [
//   { text: "银行卡 ", value: "1" },
//   { text: "wallet", value: "2" },
// ];
const submitForm = async () => {
  // 表单校验
  if (!form.name) return showToast(t("please_enter_name"));
  if (!form.bankCode) return showToast(t("please_enter_bank_code"));
  if (!form.bankCard) return showToast(t("please_enter_bank_account"));
  if (!form.bankType) return showToast(t("please_enter_account_type"));
  // 构造请求参数
  const query = {
    type: 1,
    name: form.name,
    bankCode: form.bankCode,
    bankCard: form.bankCard,
    bankType: form.bankType,
  };
  // 如果是edit模式（存在 id）
  if (route.query.id) {
    query.id = Number(route.query.id);
  }
  let res = await addWalletBank(query);
  if (Number(route.query.id)) {
    showToast(t("modification_successful"));
  } else {
    showToast(t("added_successfully"));
  }
  router.push({ path: "/cardList" });
};
// const onConfirm = ({ selectedValues, selectedOptions }) => {
//   showPicker.value = false;
//   pickerValue.value = selectedValues;
//   type.value = Number(selectedOptions[0].value)
// };
// const selectType = () => {
//   showPicker.value = true;
// };
const onClickLeft = () => {
  router.push({ path: "/cardList" });
};
const getgetBankWallet = async () => {
  let res = await getBankWallet({ id: route.query.id });
  form.name = res.data.name;
  form.bankCode = res.data.bankCode;
  form.bankCard = res.data.bankCard;
  form.bankType = res.data.bankType;
};
onMounted(async () => {
  if (route.query.id) {
    getgetBankWallet();
  }
  await userStore.getUserInfo();
  form.withdrawName = userStore.userInfo.withdrawName;
  form.withdrawAddress = userStore.userInfo.withdrawAddress;
  form.withdrawType = userStore.userInfo.withdrawType;
});
</script>
<style scoped>
.add-card-page__body {
  padding: 92px 20px 36px;
}

.add-card-page__header-card {
  position: relative;
  overflow: hidden;
  padding: 28px 26px 30px;
  border-radius: 18px;
  background: linear-gradient(90deg, #2d49a6 0%, #4485f5 100%);
  color: #ffffff;
}

.add-card-page__header-card::before,
.add-card-page__header-card::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.add-card-page__header-card::before {
  top: -34px;
  right: -10px;
  width: 150px;
  height: 150px;
}

.add-card-page__header-card::after {
  right: 92px;
  bottom: -48px;
  width: 188px;
  height: 188px;
}

.add-card-page__header-title,
.add-card-page__header-desc {
  position: relative;
  z-index: 1;
}

.add-card-page__header-title {
  font-size: 24px;
  font-weight: 700;
}

.add-card-page__header-desc {
  margin-top: 8px;
  font-size: 14px;
  opacity: 0.9;
}

.field-title {
  margin: 24px 0 12px;
  color: #121212;
  font-size: 18px;
  font-weight: 500;
}

.field-box {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 94px;
  padding: 0 20px;
  border: 1px solid #d8e0ee;
  border-radius: 18px;
  background: #ffffff;
}

.field-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
}

.custom-field {
  flex: 1;
  padding: 0;
  background: transparent;
}

.add-card-page :deep(.custom-field.van-cell) {
  padding: 0;
  background: transparent;
}

.add-card-page :deep(.custom-field .van-field__body) {
  min-height: 94px;
}

.add-card-page :deep(.custom-field .van-field__control) {
  color: #111827;
  font-size: 18px;
}

.add-card-page :deep(.custom-field .van-field__control::placeholder) {
  color: #9aa3b2;
}

.submit-btn {
  height: 58px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(90deg, #3b45df 0%, #3a4be7 100%);
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
}
</style>
