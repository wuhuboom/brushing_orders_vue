<template>
  <div>
    <Header view="market" :label="$t('入金')"></Header>
    <div
        class="flex items-center bg-gray h-[52px] rounded-full p-1 text-base w-full mt-4"
      >
        <div
          v-for="item in menus"
          class="flex-1 flex items-center justify-center h-full rounded-full"
          :class="
            selectMenu === item.value ? 'text-blue bg-[#FBFCFD]' : ' opacity-30'
          "
          @click="handleChangeMenu(item.value)"
        >
          <p>{{ item.label }}</p>
        </div>
      </div>
    <el-form status-icon label-width="auto" class="w-full mt-8">
      <!-- <p class="text-sm opacity-50 mb-5" v-if="selectMenu != 'crypto'">
        * 電匯請諮詢在線客服，獲取轉賬憑證後提交申請
      </p> -->
      <el-icon size="24" class="" v-if="setp != 1" @click="changeSetp">
        <Back />
      </el-icon>
      <el-form-item
        :label="$t('选择网络')"
        prop="email"
        label-position="top"
        @click="openSelectCoinNet"
        v-if="selectMenu === 'crypto' && setp === 1"
      >
        <el-input
          v-model="selectCurrency"
          type="text"
          autocomplete="off"
          size="large"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item
        :label="$t('入金金额')"
        prop="email"
        label-position="top"
        v-if="selectMenu !== 'crypto' || setp === 2"
      >
        <div class="w-full">
          <el-input
            v-model="params.amount"
            type="text"
            :placeholder="$t('*入金最低为{amount}USDT', {
              amount: minDeposit,
            })"
            autocomplete="off"
            @input="handleNumberInput"
            size="large"
          />
        </div>
        <!-- <p class="text-sm opacity-50 mt-1.5">
          {{
            $t("*入金最低为{amount}USDT", {
              amount: currencySelect.minDepositAmount,
            })
          }}
        </p> -->
      </el-form-item>
      <div class="w-full flex justify-between items-center " v-if="selectMenu == 'bank'" @click="onClickService">
        <div class="text-red-500">{{$t('充值前,请联系客服')}}</div>
        <div class="flex items-center text-[#3E71DE]">{{$t('联系客服')}}
          <el-icon size="14">
                <ArrowRight />
          </el-icon>
        </div>
      </div>
      <div class="w-full relative h-[40px] bg-gray rounded-full my-[30px] mx-0" v-if="selectMenu == 'bank'">
        <div class="leading-[40px] pl-[15px] opacity-50 text-[14px]">{{$t('支付币种')}}</div>
        <div
          class="flex items-center absolute font-medium right-5 top-1/2 -translate-y-1/2"
          @click="showSelect"
        >
          <img
            v-if="currencySelect.icon"
            class="w-[24px] h-[24px] mr-2"
            :src="currencySelect.icon"
            alt=""
          />
          <span class="pr-2 text-[16px]">{{ currencySelect.currency }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
      </div>

      <!-- <div > -->
        <!-- <div
          class="flex flex-col border border-[#3E71DE] rounded-md px-2 bg-[#F6F7F9]"
        >
          <div class="flex items-center py-4 gap-4 text-[14px]">
            <div class="flex-1 leading-normal opacity-60">
              {{ $t("收款银行") }}
            </div>
            <div class="flex items-center gap-4 ml-auto">
              <div class="text-sm font-medium">
                {{ bankInfo.bankName ? bankInfo.bankName : "--" }}
              </div>
            </div>
          </div>
          <div class="flex items-center py-4 gap-4 text-[14px]">
            <div class="flex-1 leading-normal opacity-60">
              {{ $t("开户银行") }}
            </div>
            <div class="flex items-center gap-4 ml-auto">
              <div class="text-sm font-medium">
                {{ bankInfo.address ? bankInfo.address : "--" }}
              </div>
            </div>
          </div>
          <div class="flex items-center py-4 gap-4 text-[14px]">
            <div class="flex-1 leading-normal opacity-60">
              {{ $t("收款人姓名") }}
            </div>
            <div class="flex items-center gap-4 ml-auto">
              <div class="text-sm font-medium">
                {{ bankInfo.name ? bankInfo.name : "--" }}
              </div>
            </div>
          </div>
          <div class="flex items-center py-4 gap-4 text-[14px]">
            <div class="flex-1 leading-normal opacity-60">
              {{ $t("收款卡号") }}
            </div>
            <div
              class="flex items-center gap-4 ml-auto"
              @click="copyContent(bankInfo.bankNumber)"
            >
              <img
                src="../../static/images/copy1.png"
                class="w-[20px] h-[20px]"
                alt=""
              />
            </div>
          </div>
          <div class="flex items-center pb-4 gap-4 text-[14px]">
            <div class="flex-1 leading-normal underline">
              {{ bankInfo.bankNumber ? bankInfo.bankNumber : "--" }}
            </div>
          </div>
        </div> -->
        <!-- <div class="flex items-center py-4 gap-4 text-[16px] text-[#3E71DE]">
          <div class="flex-1 leading-normal">{{ $t("到账金额") }}</div>
          <div class="flex items-center gap-4 ml-auto">
            <div class="text-sm font-medium">{{ netAmount }} USDT</div>
          </div>
        </div> -->
        <div class="flex items-center pb-4 gap-4 text-[14px]" v-if="selectMenu == 'bank'">
          <div class="flex-1 leading-normal opacity-80">{{ $t("汇率") }}</div>
          <div class="flex items-center gap-4 ml-auto">
            <div class="text-sm font-medium">
              1{{ userStore.userInfo.currency }}={{ rate
              }}{{ currencySelect.currency }}
            </div>
          </div>
        </div>
      <!-- </div> -->
      <el-form-item
        :label="$t('地址')"
        prop="email"
        label-position="top"
        v-if="selectMenu === 'crypto' && setp === 1"
      >
        <!-- <el-input v-model="params.address" type="text" autocomplete="off" size="large" /> -->
        <!-- 新增二维码显示区域 -->
        <div
          class="mt-1 flex flex-col justify-center max-w-[260px]"
          v-if="params.address"
        >
          <vue-qrcode
            :value="params.address"
            :options="{ width: 260, margin: 0 }"
            class="p-0"
          />
          <div
            class="text-base flex items-center gap-1 mt-1.5"
            @click="copyContent(params.address)"
          >
            {{ params.address }}<el-icon><DocumentCopy /></el-icon>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        prop="email"
        label-position="top"
        v-if="selectMenu !== 'crypto' || setp === 2"
      >
        <el-form-item
          :label="$t('入金凭证')"
          prop="username"
          label-position="top"
          class="flex-1"
        >
          <el-upload
            class="avatar-uploader"
            :action="$uploadUrl"
            :show-file-list="false"
            :headers="{ Authorization: userStore.token }"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="params.uploadVoucher"
              :src="params.uploadVoucher"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form-item>
    </el-form>
    <div
      class="w-full relative -right-5"
      v-if="selectMenu === 'crypto' && setp === 1"
      @click="changeSetp"
    >
      <div
        class="text-base mt-10 bg-blue px-5 flex items-center h-12 rounded-l-2.5 text-white button-bg"
      >
        <div>{{ $t("下一步") }}</div>
        <el-icon class="ml-auto" size="20">
          <Right />
        </el-icon>
      </div>
    </div>
    <div
      @click="onClickService"
      v-if="selectMenu !== 'crypto' || setp !== 1"
      class="w-full text-center text-[#3E71DE] text-[14px] mt-10"
    >
      {{ $t("已充值？联系客服") }}
    </div>
    <div
      @click="submit"
      class="w-full relative -right-5 mb-10 mt-3"
      v-if="selectMenu !== 'crypto' || setp !== 1"
    >
      <div
        class="text-base bg-blue px-5 flex items-center h-12 rounded-l-2.5 text-white button-bg"
      >
        <div>{{ $t("完成") }}</div>
        <el-icon class="ml-auto" size="20">
          <Check />
        </el-icon>
      </div>
    </div>
    <SelectCoinNet
      ref="selectCoinNetRef"
      :list="currencyList"
      v-model="selectCurrency"
    ></SelectCoinNet>
    <SelectCurrency
      ref="SelectCurrencyRef"
      :list="currencyList"
      v-model="bankId"
    ></SelectCurrency>
  </div>
</template>
<script setup>
import Header from "@/components/Header.vue";
import SelectCoinNet from "./components/SelectCoinNet.vue";
import SelectCurrency from "./components/SelectCurrency.vue";
import VueQrcode from "@chenfengyuan/vue-qrcode"; // 新增导入
import { computed, onMounted, reactive, ref, watch } from "vue";
import { copyContent } from "@/util/utils.js";
import BigNumber from "bignumber.js";
import {
  reqDeposite,
  reqGetCurrencyConfig,
  getConversionRate,
  ucDepositList,
} from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";
import { useCommonStore } from "../../store/modules/common";
import { useRouter } from "vue-router";
const router = useRouter();
const { t } = useI18n();
const selectMenu = ref("crypto");
// const bankInfo = ref({});
const rate = ref(0);
const bankId = ref("");
const setp = ref(1);
const userStore = useUserStore();
const commonStore = useCommonStore();
const minDeposit = computed(() => {
  return commonStore.setting.leastRechargeAmount;
});
const menus = computed(() => [
  {
    label: t("数字货币"),
    value: "crypto",
  },
  {
    label: t("银行卡"),
    value: "bank",
  },
]);

const params = reactive({
  address: "",
  coin: "",
  amount: "",
  uploadVoucher: "",
  uploadNumber: "",
  mode: 1,
});
const currencyList = ref([]);
const selectCurrency = ref("");
const selectCoinNetRef = ref(null);
const SelectCurrencyRef = ref(null);
const handleNumberInput = (val) => {
  // 只保留数字和一个小数点
  let formatted = val
    .replace(/[^\d.]/g, "") // 先去掉非数字和小数点
    .replace(/^0+(\d)/, "$1") // 去掉开头多余的0
    .replace(/\.{2,}/g, ".") // 替换多个连续点为一个点
    .replace(/^(\d*\.\d*).*$/, "$1"); // 只允许一个点
  params.amount = formatted;
};

watch(selectCurrency, (newVal, oldVal) => {
  if (newVal) {
    const data = currencyList.value.find((item) => item.label === newVal);
    params.address = data.address;
    console.log(data);
    params.uploadNumber = data.network;
  }
});

watch(bankId, (newVal, oldVal) => {
  if (newVal) {
    getRate();
    // getbankCards();
  }
});

function getRate() {
  let params = {
    fromCurrency: userStore.userInfo.currency,
    toCurrency: currencySelect.value.currency,
  };
  getConversionRate(params).then((res) => {
    rate.value = res.data;
  });
}

function getbankCards() {
  let params = {
    type: 1,
    countryCoin: currencySelect.value.currency,
  };
  ucDepositList(params).then((res) => {
    bankInfo.value = res.data.records[0] || {
      bankName: "",
      name: "",
      bankNumber: "",
    };
    console.log(bankInfo.value);
  });
}

const currencySelect = computed(() => {
  const data =
    selectMenu.value == "bank"
      ? currencyList.value.find((item) => item.id === bankId.value)
      : currencyList.value.find((item) => item.label === selectCurrency.value);
  return data ? data : { icon: "", currency: "" };
});

const netAmount = computed(() => {
  return params.amount
    ? new BigNumber(params.amount / rate.value || 0).toFixed(2)
    : "--";
});

onMounted(() => {
  getCurrencyConfig();
});

function getCurrencyConfig() {
  currencyList.value = [];
  reqGetCurrencyConfig({ type: selectMenu.value == "crypto" ? 2 : 1 }).then(
    (res) => {
      if (selectMenu.value == "crypto") {
        res.data.forEach((item) => {
          let temp = {
            label: "",
            currency: item.currency,
            network: "",
            icon: item.icon,
          };
          item.tradingNetwork = JSON.parse(item.tradingNetwork);
          Object.keys(item.tradingNetwork).forEach((key) => {
            currencyList.value.push({
              ...temp,
              label: `${key}-${temp.currency}`,
              network: key,
              address: item.tradingNetwork[key],
              minDepositAmount: item.minDepositAmount,
            });
          });
          selectCurrency.value = currencyList.value[0].label;
        });
      } else {
        currencyList.value = res.data;
        bankId.value = currencyList.value[0].id;
        console.log(currencyList.value);
      }
    }
  );
}

function handleChangeMenu(value) {
  setp.value = 1;
  params.uploadVoucher = "";
  params.amount = "";
  selectMenu.value = value;
  getCurrencyConfig();
}

function changeSetp() {
  setp.value = setp.value === 1 ? 2 : 1;
}

function openSelectCoinNet() {
  selectCoinNetRef.value.open();
}

function handleAvatarSuccess(response, file, fileList) {
  console.log("handleAvatarSuccess", response);
  params.uploadVoucher = response.data;
}
function beforeAvatarUpload(file) {}

function showSelect() {
  SelectCurrencyRef.value.open();
}

function onClickService() {
  router.push({
    path: "/user/service",
  });
}

function toBack() {
  router.back();
}

function submit() {
  if (Number(params.amount) <= 0) {
    ElMessage({ message: t("请输入充值金额"), type: "error" });
    return;
  }
  if (!params.uploadVoucher) {
    ElMessage({ message: t("请上传凭证"), type: "error" });
    return;
  }
  if (Number(params.amount) < Number(minDeposit.value)) {
    ElMessage({
      message: t("最低充值金额为{amount}", {
        amount: minDeposit.value,
      }),
      type: "error",
    });
    return;
  }
  const data = {
    amount: Number(params.amount),
    uploadVoucher: params.uploadVoucher,
    mode: selectMenu.value === "crypto" ? 1 : 2,
  };
  if (selectMenu.value === "crypto") {
    const obj = currencyList.value.find(
      (item) => item.label === selectCurrency.value
    );
    data.coin = obj.currency;
    data.uploadNumber = obj.network;
  } else {
    data.coin = currencySelect.value.currency;
    data.rate = rate.value;
    // data.uploadBank = bankInfo.value.bankName;
    // data.uploadName = bankInfo.value.name;
    // data.uploadNumber = bankInfo.value.bankNumber;
  }
  reqDeposite(data).then((res) => {
    ElMessage({ message: t("提交成功"), type: "success" });
    router.push({
      path: "/user/depositList",
    });
  });
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 100%;
}

.el-form-item__content {
  width: 100%;
}

.avatar-uploader {
  width: 100% !important;
  height: 100%;
  border: 2px solid #3d3d3d !important;
  border-radius: 10px;
  max-height: 120px;
}

:deep(.el-upload) {
  width: 100% !important;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 116px;
  text-align: center;
}

.avatar {
  max-width: 100%;
  height: 116px;
  object-fit: contain;
}
</style>
