<template>
  <div class="w-full bg-[#fff] pl-4 pr-4">
    <van-nav-bar
      :title="$t('卡片管理')"
      fixed
      left-arrow
      class="shadow"
      @click-left="onClickLeft"
    />
    <!-- <div>
      <div class="text-[16px] text-[#000] mb-4 mt-20">
        {{ $t("Add Wallet address") }}
      </div>
      <div class="text-[14px] text-[#9CA3AF]">
        Dear user, please enter your TRC- 20/ERC-20 address. Do not enter your
        bank account information or password.
      </div>
    </div> -->
    <div class="text-[#4B5563] font-semibold mt-20 pl-[8px]">
      {{ $t("账户名称") }}
    </div>
    <div
      class="w-full mt-2 overflow-hidden"
      style="border-bottom: 1px solid #e5e7eb"
    >
      <van-field
        v-model="form.accountName"
        label=""
        :placeholder="$t('请输入账户名称')"
        label-align="top"
        size="large"
      />
    </div>
    <div class="text-[#4B5563]font-semibold mt-5 pl-[8px]">
      {{ $t("钱包名称") }}
    </div>
    <div
      class="w-full mt-2 overflow-hidden"
      style="border-bottom: 1px solid #e5e7eb"
    >
      <van-field
        v-model="form.walletName"
        label=""
        :placeholder="$t('请输入钱包名称')"
        label-align="top"
        size="large"
      />
    </div>
    <div class="text-[#4B5563] font-semibold mt-5 pl-[8px]">
      {{ $t("钱包地址") }}
    </div>
    <div
      class="w-full mt-2 overflow-hidden"
      style="border-bottom: 1px solid #e5e7eb"
    >
      <van-field
        v-model="form.walletAddress"
        label=""
        :placeholder="$t('请输入钱包地址')"
        label-align="top"
        size="large"
      />
    </div>
    <!-- <div class="text-[#4B5563] mt-5 pl-[8px]">
      {{ $t("Account Type") }}
    </div>
    <div
      class="flex justify-between items-center w-full mt-2 overflow-hidden pb-[20px]"
      style="border-bottom: 1px solid #e5e7eb"
      @click="showPicker = true"
    >
      <div class="pl-[7px]">{{ type== 1 ? "银行卡" : "钱包" }}</div>
      <van-icon name="arrow-down" />
    </div> -->
    <div class="w-full mt-10">
      <van-button
        color=""
        class="w-full"
        size="large"
        style="
            background: linear-gradient(135deg, #002D72, #0a4da2);
            color: #fff;
          "
        @click="submitForm"
        >{{ $t("提交") }}</van-button
      >
    </div>

    <van-popup
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
    </van-popup>
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
  accountName: "",
  walletName: "",
  walletAddress: "",
});
const pickerValue = ref(["1"]);
const type = ref(1);
const columns = [
  { text: "银行卡 ", value: "1" },
  { text: "钱包", value: "2" },
];
const submitForm = async () => {
  let query = {
    type: 1,
    withdrawalTypeId:1,
  };
  if(route.query.id) {
    query.id = Number(route.query.id)
  }
  if (!form.accountName) return showToast(t("请输入账户名称"));
  if (!form.walletName) return showToast(t("请输入钱包名称"));
  if (!form.walletAddress) return showToast(t("请输入钱包地址"));
  query.accountName = form.accountName;
  query.walletName = form.walletName;
  query.walletAddress = form.walletAddress;

  let res = await addWalletBank(query);
  if(Number(route.query.id)) {
    showToast(t("修改成功"));
  } else {
    showToast(t("添加成功"));
  }
  
  router.push({ path: "/cardList" });
};

const onConfirm = ({ selectedValues, selectedOptions }) => {
  showPicker.value = false;
  pickerValue.value = selectedValues;
  type.value = Number(selectedOptions[0].value);
};
const selectType = () => {
  showPicker.value = true;
};

const onClickLeft = () => {
  router.push({ path: "/cardList" });
};
const getgetBankWallet = async () => {
  let res = await getBankWallet({ id: route.query.id });
  form.accountName = res.data.accountName;
  form.walletName = res.data.walletName;
  form.walletAddress = res.data.walletAddress;
  //   const form = reactive({
  //   name: "",
  //   bankCode: "",
  //   bankCard: "",
  //   walletType: "",
  //   walletAddress: "",
  // });
};
onMounted(async () => {
  if (route.query.id) {
    getgetBankWallet();
  }
//   await userStore.getUserInfo();
//   form.withdrawName = userStore.userInfo.withdrawName;
//   form.walletAddress = userStore.userInfo.withdrawAddress;
//   form.withdrawType = userStore.userInfo.withdrawType;
});
</script>
