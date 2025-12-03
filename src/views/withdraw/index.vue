<template>
  <div class="w-full bg-[#f9f9f9] min-h-[100vh] h-full withdraw">
    <div
      class="relative bg-gradient-to-r from-[#002D72] to-[#0A4DA2] flex items-center justify-center h-[56px] px-[16px]"
    >
      <div class="absolute left-[16px]">
        <van-icon
          name="arrow-left"
          color="#fff"
          size="22px"
          @click="onClickLeft"
        />
      </div>
      <div class="text-base text-[#FFFFFF] font-medium">{{ $t("提取") }}</div>
      <div class="absolute right-[16px] text-base text-[#fff]" @click="toHistory">{{$t('Withdrawal.History')}}</div>
    </div>
    <div
      class="flex flex-col justify-between p-4 box-border mt-[-2px] bg-gradient-to-r from-[#002D72] to-[#0A4DA2]"
    >
      <div class="w-full flex justify-end mb-[10px]" @click="refresh">
        <img
          class="w-[24px] h-[24px]"
          src="../../static/images/shuaxin.png"
          alt=""
        />
      </div>
      <div class="text-white text-center text-sm">
        {{ $t("账户金额") }}
      </div>
      <div class="flex mt-[8px] mb-[12px] justify-center">
        <div class="text-white text-3xl flex items-center">
          {{ amount }}
        </div>
        <div class="text-white text-sm flex items-center ml-2 pt-[12px]">
          {{ $t("美元") }}
        </div>
      </div>
    </div>

    <div class="px-[20px]">
      <div class="text-[#4B5563] font-semibold mt-5 pl-[5px]">
        {{ $t('提款金额') }}
      </div>
      <div
        class="w-full mt-2 overflow-hidden relative"
        style="border-bottom: 1px dashed #D1D5DB"
      > 
        <div class="absolute top-[12px] text-[20px]">$</div>
        <van-field
          v-model="ruleForm.amount"
          label=""
          style="font-size: 14px;"
          :placeholder="$t('Please enter recipient name')"
          label-align="top"
          size="large"
        />
        <div class="absolute right-0 top-[13px] text-[12px] text-[#2563EB]"  @click="All">{{ $t("全部") }}</div>
      </div>
      <div class="mt-[4px] text-[12px] text-[#71757C]">{{ $t("您将在一小时内收到提款") }}</div>
      <div class="mt-[10px]">
        <div class="pb-[8px] text-[14px] mt-[30px] mb-[10px] font-semibold">Receiving Bank Card</div>
        <div v-if="bankWallet.length == 0">
          <div
            @click="addType(1)"
            class="flex items-center border border-[#E5E7EB] p-[17px] rounded-[8px]"
          >
            <img src="@/static/images/add.png" alt="" />
            <div class="pl-[16px]">
              <div class="text-[14px] text-[#111827]">Bank Card</div>
              <div class="text-[12px] text-[#6B7280] pt-[5px]">
                No bank card added yet
              </div>
            </div>
          </div>
          <div
            @click="addType(2)"
            class="flex items-center border border-[#E5E7EB] p-[17px] rounded-[8px] mt-[8px]"
          >
            <img src="@/static/images/add.png" alt="" />
            <div class="pl-[16px]">
              <div class="text-[14px] text-[#111827]">Wallet</div>
              <div class="text-[12px] text-[#6B7280] pt-[5px]">
                No bank card added yet
              </div>
            </div>
          </div>
        </div>
        <!-- 有卡号的情况 -->
        <div
          v-else
          class="flex items-center justify-between border border-[#E5E7EB] p-[17px] rounded-[8px] mt-[8px]"
        >
          <div>
            <div class="text-[14px] text-[#111827]">{{ bankItem.name }}</div>
            <div
              class="text-[12px] text-[#6B7280] pt-[5px]"
              v-if="bankItem.type == 0"
            >
              {{ bankItem.accountHolder }}
              <span class="pl-[5px]">{{
                formatBankCard(bankItem.bankAccount)
              }}</span>
            </div>
            <div class="text-[12px] text-[#6B7280] pt-[5px] w-]" v-else>
              {{ bankItem.walletType }}
              <span class="pl-[5px] w-[80%] break-all">{{
                bankItem.walletAddress
              }}</span>
            </div>
          </div>
          <div class="flex items-center" @click="toList">
            <div class="text-[#2563EB] text-[12px] mr-[8px]">Manage</div>
            <van-icon name="arrow" color="#9CA3AF" size="16px" />
          </div>
        </div>
      </div>
      <div class="text-[#4B5563] font-semibold mt-5 pl-[5px]">
        {{ $t('交易密码') }}
      </div>
      <div
        class="w-full mt-[20px] overflow-hidden relative"
      > 
        <van-password-input
          :value="ruleForm.tradePassword"
          :mask="false"
          :gutter="10"
          :focused="showKeyboard"
          @focus="showKeyboard = true"
        />
      </div>
    </div>
    <div class="w-full pl-5 pr-5 mt-[20px]">
        <van-button
          color="#002D72"
          style="
            background: linear-gradient(135deg, #002D72, #0a4da2);
            color: #fff;
          "
          @click="getWithdrawal"
          class="w-full"
          >{{ $t("提取") }}</van-button
        >
      </div>

    <!-- 数字键盘 -->
    <van-number-keyboard
      v-model="ruleForm.tradePassword"
      :show="showKeyboard"
      @blur="showKeyboard = false"
    />
  </div>
</template>
<script setup>
const bgImage = new URL("@/static/images/bg-3.png", import.meta.url).href;
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {
  getWithdrawals,
  withdrawal,
  getTradeConfig,
  userGetInfo,
  getUserBankWallet
} from "../../api/apis";
import { formatWithTimezone } from "../../util/utils";
import { useUserStore } from "@/store/modules/user";
import { showSuccessToast, showToast } from "vant";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const showKeyboard = ref(false)
const router = useRouter();
const amount = ref("");
const userStore = useUserStore();
const userInfo = ref({});
const { t } = useI18n();

const formatBankCard = (card) => {
  console.log(card);
  if (!card) return "";
  const str = String(card).replace(/\s+/g, ""); // 去掉空格
  const prefix = str.slice(0, 4);
  const suffix = str.slice(-4);
  return `${prefix} **** **** ${suffix}`;
};

const onClickLeft = ()=>{
  router.replace({
    path:"/my"
  })
};
const ruleForm = reactive({
  amount: 0,
  tradePassword: "",
  walletId:""
});
const addType = (type) => {
  if (type == 1) {
    router.push({
      path: "/addCard",
    });
  } else {
    router.push({
      path: "/addWallet",
    });
  }
};

const All = () => {
  console.log(amount.value);
  ruleForm.amount = amount.value;
};
const getWithdrawal = () => {
  if (!bankItem.value.id) {
    router.push({ path: "/addCard" });
    return false;
  }
  if (!ruleForm.amount) return showToast(t("请输入金额"));
  if (
    ruleForm.amount < TradeInfor.value.minWithdrawAmount ||
    ruleForm.amount > TradeInfor.value.maxWithdrawAmount
  )
    return showToast(
      t("rechargeLimit", {
        min: TradeInfor.value.minWithdrawAmount,
        max: TradeInfor.value.maxWithdrawAmount,
      })
    );
  if (!ruleForm.tradePassword) return showToast(t("请输入交易密码"));
  // if (!userInfo.value.withdrawAddress) {
  //   router.push({ path: "/paymentMethods" });
  //   return false;
  // }
 ruleForm.walletId =Number(bankItem.value.withdrawalTypeId)
  
  withdrawal(ruleForm).then((res) => {
    showSuccessToast(t("提现成功"));
    // router.push({ path: "/my" });
  });
};
const toHistory =() =>{
   router.push({ path: "/withdrawHistory" });
}
const TradeInfor = ref({});

const tradeConfig = async () => {
  let res = await getTradeConfig();
  TradeInfor.value = res.data;
};
const bankItem = ref("");
const bankWallet = ref([]);
const getgetUserBankWallet = async () => {
  let res = await getUserBankWallet();
  bankWallet.value = res.data;
  if (
    userStore.userWallerType &&
    typeof userStore.userWallerType === "object" &&
    !Array.isArray(userStore.userWallerType) &&
    Object.keys(userStore.userWallerType).length > 0
  ) {
    bankItem.value = userStore.userWallerType;
  } else {
    bankItem.value = res.data[0];
  }
  console.log(bankItem.value);
};

const refresh = () =>{
  tradeConfig();
  getgetUserBankWallet()
  ruleForm.amount = 0;
  ruleForm.tradePassword = ''
}
const toList = () => {
  router.push({
    path: "/cardList",
    query: {
      type: 2,
    },
  });
};

onMounted(() => {
  tradeConfig();
  getgetUserBankWallet()
  userGetInfo().then((res) => {
    amount.value = res.data.balance;
    // ruleForm.amount = amount.value;
    userInfo.value = res.data;
  });
});
</script>
<style>
.withdraw .el-input__wrapper {
  border: 1px solid #666;
}
</style>
<style scoped>
.router {
  border-top-right-radius: 8px; /* 右上角圆角 */
  border-bottom-right-radius: 8px; /* 右下角圆角 */
  border-top-left-radius: 0; /* 左上角不圆 */
  border-bottom-left-radius: 0; /* 左下角不圆 */
}
.tab {
  position: relative;
  padding-bottom: 5px; /* 给伪元素留点空间 */
  cursor: pointer;
}

.tab::after {
  content: "";
  position: absolute;
  left: 50%; /* 基准点放在中间 */
  bottom: 0;
  width: 80%; /* 下划线宽度 */
  height: 2px;
  background-color: transparent;
  transform: translateX(-50%); /* 往左移一半，居中 */
  transition: all 0.3s;
}

.tab.active {
  color: #206645;
}

.tab.active::after {
  background-color: #206645; /* 激活状态的下划线颜色 */
}
.activetab {
  box-shadow: 0px 1px 2px 0px #dcfce7;
}
.activetab1 {
  box-shadow: 0px 1px 2px 0px #d97706;
}
.activetab2 {
  box-shadow: 0px 1px 2px 0px #206645;
}
</style>
