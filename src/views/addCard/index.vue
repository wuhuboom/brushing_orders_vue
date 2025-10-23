<template>
  <div class="w-full bg-[#f4f4f5] pl-4 pr-4">
    <van-nav-bar
      :title="$t('Bank Card Management')"
      fixed
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="text-[16px] text-[#000] mb-4 mt-20">
      {{ $t("Add Bank Card") }}
    </div>
    <div class="text-[#4B5563] font-semibold mt-10 pl-[8px]">
      {{ $t("Bank Code") }}
    </div>
    <div
      class="w-full mt-2 overflow-hidden"
      style="border-bottom: 1px solid #e5e7eb"
    >
      <van-field
        v-model="form.bankCode"
        label=""
        :placeholder="$t('Please enter bank code')"
        label-align="top"
        size="large"
      />
    </div>
    <div class="text-[#4B5563] font-semibold mt-5 pl-[8px]">
      {{ $t("Bank Name") }}
    </div>
    <div
      class="w-full mt-2 overflow-hidden"
      style="border-bottom: 1px solid #e5e7eb"
    >
      <van-field
        v-model="form.name"
        label=""
        :placeholder="$t('Please enter recipient name')"
        label-align="top"
        size="large"
      />
    </div>
    <div class="text-[#4B5563] font-semibold mt-5 pl-[8px]">
      {{ $t("Bank Account") }}
    </div>
    <div
      class="w-full mt-2 overflow-hidden"
      style="border-bottom: 1px solid #e5e7eb"
    >
      <van-field
        v-model="form.bankCard"
        label=""
        :placeholder="$t('Please enter recipient account')"
        label-align="top"
        size="large"
      />
    </div>
    <div class="text-[#4B5563] font-semibold mt-5 pl-[8px]">
      {{ $t("Account Type") }}
    </div>
    <div
      class="w-full mt-2 overflow-hidden"
      style="border-bottom: 1px solid #e5e7eb"
    >
      <van-field
        v-model="form.bankType"
        label=""
        :placeholder="$t('Please enter Account Type')"
        label-align="top"
        size="large"
      />
    </div>
    <!-- <div
      class="flex justify-between items-center w-full mt-2 overflow-hidden pb-[20px]"
      style="border-bottom: 1px solid #e5e7eb"
      @click="showPicker = true"
    >
      <div class="pl-[7px]">{{ type== 1 ? "银行卡" : "钱包" }}</div>
      <van-icon name="arrow-down" />
    </div> -->
    <div class="w-full mt-10">
      <van-button
        color="#F09F39"
        class="w-full"
        size="large"
        @click="submitForm"
        >{{ $t("更新") }}</van-button
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
import { showToast } from "vant";
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
//   { text: "钱包", value: "2" },
// ];
const submitForm = async () => {
  // 表单校验
  if (!form.name) return showToast(t("请输入姓名"));
  if (!form.bankCode) return showToast(t("请输入银行编码"));
  if (!form.bankCard) return showToast(t("请输入银行卡号"));
  if (!form.bankType) return showToast(t("请输入账户类型"));
  // 构造请求参数
  const query = {
    type: 1,
    name: form.name,
    bankCode: form.bankCode,
    bankCard: form.bankCard,
    bankType: form.bankType,
  };
  // 如果是编辑模式（存在 id）
  if (route.query.id) {
    query.id = Number(route.query.id);
  }
  let res = await addWalletBank(query);
  if (Number(route.query.id)) {
    showToast(t("修改成功"));
  } else {
    showToast(t("添加成功"));
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
