<template>
  <div class="w-full bg-[#fff] pl-4 pr-4">
    <PageTopBar :title="$t('bank_card_management')" show-back @click-left="onClickLeft" />
    <div class="text-[16px] text-[#000] mb-4 pt-20">
      {{ $t("add_bank_card") }}
    </div>
    <div class="text-[#4B5563] font-semibold mt-10 pl-[8px]">
      {{ $t("bank_name") }}
    </div>
    <div
      class="w-full mt-2 flex justify-start items-center overflow-hidden rounded-[8px]"
      style="border: 1px solid #EEEEEE"
    >
      <img class="w-[20px] h-[20px] ml-[17px]" src="../../static/images/code.png" alt="">
      <van-field
        v-model="form.bankCode"
        label=""
        :placeholder="$t('please_enter_bank_name')"
        label-align="top"
        size="large"
      />
    </div>
    <div class="text-[#4B5563] font-semibold mt-5 pl-[8px]">
      {{ $t("name") }}
    </div>
    <div
      class="w-full flex justify-start items-center mt-2 overflow-hidden"
      style="border-bottom: 1px solid #e5e7eb"
    >
     <img class="w-[20px] h-[20px] ml-[17px]" src="../../static/images/name.png" alt="">
      <van-field
        v-model="form.name"
        label=""
        :placeholder="$t('please_enter_name')"
        label-align="top"
        size="large"
      />
    </div>
    <div class="text-[#4B5563] font-semibold mt-5 pl-[8px]">
      {{ $t("bank_account") }}
    </div>
    <div
      class="w-full flex justify-start items-center  mt-2 overflow-hidden"
      style="border-bottom: 1px solid #e5e7eb"
    >
      <img class="w-[20px] h-[20px] ml-[17px]" src="../../static/images/accout.png" alt="">
      <van-field
        v-model="form.bankCard"
        label=""
        :placeholder="$t('please_enter_bank_account')"
        label-align="top"
        size="large"
      />
    </div>
    <div class="text-[#4B5563] font-semibold mt-5 pl-[8px]">
      {{ $t("account_type") }}
    </div>
    <div
      class="w-full mt-2 overflow-hidden"
      style="border-bottom: 1px solid #e5e7eb"
    >
      <van-field
        v-model="form.bankType"
        label=""
        :placeholder="$t('please_enter_account_type')"
        label-align="top"
        size="large"
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
        color=""
        class="w-full"
        style="
            background: var(--theme-button-gradient);
            color: #fff;
          "
        @click="submitForm"
        >{{ $t("submit") }}</van-button
      >
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
