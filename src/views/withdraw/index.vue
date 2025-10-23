<template>
  <div class="w-full bg-[#fff] min-h-[100vh] h-full withdraw">
    <!-- <van-sticky type="primary">
      <van-nav-bar
        :title="$t('提取')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky> -->
    <div class="flex items-center relative bg-[#000]">
      <!-- 左侧箭头 -->
      <div class="absolute left-3" @click="onClickLeft">
        <van-icon name="arrow-left" color="#fff" size="24px" />
      </div>
      <!-- 中间标题 -->
      <div class="mx-auto text-white text-[22px] py-[24px]">
        {{ $t("提取") }}
      </div>
    </div>
    <div
      class="bg-white mt-[5px] flex justify-between items-center py-[10px] text-[#6B7280]"
    >
      <div
        class="tab w-[50%]"
        :class="{ active: active === 0 }"
        @click="swichTab(0)"
      >
        {{ $t("提取") }}
      </div>
      <div
        class="tab w-[50%]"
        :class="{ active: active === 1 }"
        @click="swichTab(1)"
      >
        {{ $t("历史") }}
      </div>
    </div>

    <!-- <van-tabs
      color="#000"
      @change="swichTab"
      v-model:active="active"
    >
      <van-tab :title="$t('提取')"></van-tab>
      <van-tab :title="$t('历史')"></van-tab>
    </van-tabs> -->
    <div class="h-[10px] bg-[#fff]"></div>
    <div v-if="active === 0">
      <div class="p-4 box-border flex flex-col">
        <div
          class="flex flex-col justify-between p-4 box-border rounded-xl bg-[url(@/static/images/bg3.png)] bg-cover shadow mb-4"
          style="background-size: 100% 100%"
        >
          <div class="text-white text-sm pt-[10px]">
            {{ $t("账户金额") }}
          </div>
          <div class="flex mt-4 mb-[30px]">
            <div
              class="text-white font-bold text-[34px] text-bold flex items-center"
            >
              {{ amount }}
            </div>
            <!-- <div
              class="text-white font-bold text-sm flex items-center ml-1 pt-[12px]"
            >
              {{ $t("美元") }}
            </div> -->
          </div>
          <div class="text-white text-[14px] pt-4">
            {{ $t("您将在一小时内收到提款") }}
          </div>
        </div>
      </div>
      <div class="px-[14px]">
        <div class="pb-[8px]">Receiving Bank Card</div>
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
              v-if="bankItem.type == 1"
            >
              {{ bankItem.bankCode }}
              <span class="pl-[5px]">{{
                formatBankCard(bankItem.bankCard)
              }}</span>
            </div>
            <div class="text-[12px] text-[#6B7280] pt-[5px]" v-else>
              {{ bankItem.walletType }}
              <span class="pl-[5px]">{{ bankItem.walletAddress }}</span>
            </div>
          </div>
          <div class="flex items-center" @click="toList">
            <div class="text-[#2563EB] text-[12px] mr-[8px]">Manage</div>
            <van-icon name="arrow" color="#9CA3AF" size="16px" />
          </div>
        </div>
      </div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="w-full p-4"
      >
        <el-form-item prop="amount" label-position="top">
          <div class="text-[14px] text-[#1F2937] pb-[6px]">
            {{ $t("提款金额") }}
          </div>
          <el-input
            v-model="ruleForm.amount"
            type="number"
            :placeholder="$t('提款金额')"
            autocomplete="off"
            size="large"
          >
            <!-- <template #append>
              <el-button
                type="primary"
                class="router"
                style="background: #ff9662; border-color: #ff9662;height: 100%;color: #fff;"
                @click="All"
              >
                {{ $t("全部") }}
              </el-button>
            </template> -->
          </el-input>
        </el-form-item>
        <!-- <el-form-item label-position="top">
          <el-input
            v-model="ruleForm.tradePassword"
            :placeholder="$t('交易密码')"
            type="password"
            autocomplete="off"
            size="large"
            show-password
          />
        </el-form-item> -->
      </el-form>
      <div class="w-full pl-5 pr-5 mb-[50px]">
        <van-button color="#000" @click="getWithdrawal" class="w-full">{{
          $t("提取")
        }}</van-button>
      </div>
    </div>
    <div class="w-[90%] mx-auto" v-else>
      <div class="flex justify-start mb-[16px] mt-[24px]">
        <div
          class="px-[16px] py-[6px] rounded-[15px] mr-[10px]"
          :class="orderActive == 0 ? 'bg-[#DCFCE7] text-[#166534]' : ''"
          @click="changeOrder(0)"
        >
          {{ $t("待审核") }}
        </div>
        <div
          class="px-[16px] py-[6px] rounded-[15px] mr-[10px]"
          :class="orderActive == 1 ? 'bg-[#DCFCE7] text-[#166534]' : ''"
          @click="changeOrder(1)"
        >
          {{ $t("审核成功") }}
        </div>
        <div
          class="px-[16px] py-[6px] rounded-[15px] mr-[10px]"
          :class="orderActive == 2 ? 'bg-[#DCFCE7] text-[#166534]' : ''"
          @click="changeOrder(2)"
        >
          {{ $t("审核拒绝") }}
        </div>
      </div>

      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('没有更多了')"
          @load="onLoad"
        >
          <van-cell v-for="item in list" :key="item" :title="item">
            <div
              class="bg-[#fff] flex justify-between items-center px-[16px] py-[16px] rounded-[10px]"
              :class="
                item.status == 0
                  ? 'activetab'
                  : item.status == 1
                  ? 'activetab1'
                  : item.status == 2
                  ? 'activetab2'
                  : ''
              "
            >
              <div class="flex flex-col">
                <div class="text-[#111827] text-[16px] pb-[12px]">
                  -{{ item.amount }}USD
                </div>
                <div class="text-[#6B7280] text-[12px]">
                  {{
                    formatWithTimezone(
                      item.applicationTime,
                      userStore.zoneActive.tzName
                    )
                  }}
                </div>
              </div>
              <div
                :class="
                  item.status == 0
                    ? 'text-[#15803D]'
                    : item.status == 1
                    ? 'text-[#D97706]'
                    : 'text-[#B91C1C]'
                "
              >
                {{
                  item.status == 0
                    ? $t("通过")
                    : item.status == 1
                    ? $t("待审核")
                    : $t("拒绝")
                }}
              </div>
            </div>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
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
  getUserBankWallet,
} from "../../api/apis";
import { formatWithTimezone } from "../../util/utils";
import { useUserStore } from "@/store/modules/user";
import { showSuccessToast, showToast } from "vant";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const router = useRouter();
const orderActive = ref(0);
const active = ref(0);
const list = ref([]);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const amount = ref("");
const userStore = useUserStore();
const userInfo = ref({});
const { t } = useI18n();
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  status: "1",
});
const onRefresh = async () => {
  refreshing.value = true;
  finished.value = false;
  query.pageNum = 1;
  list.value = [];
  await loadData();
  refreshing.value = false;
};
const onLoad = async () => {
  if (finished.value || loading.value) return;
  loading.value = true;
  await loadData();
  loading.value = false;
};
const loadData = async () => {
  try {
    let res = await getWithdrawals(query);
    const data = res.rows;
    if (data.length < query.pageSize) {
      finished.value = true;
    } else {
      query.pageNum++;
    }

    list.value.push(...data);
  } catch (error) {
    console.error("加载失败", error);
    finished.value = true; // 避免无限加载
  }
};
const onClickLeft = () => history.back();
const ruleForm = reactive({
  amount: "",
  // tradePassword: "",
});

const formatBankCard = (card) => {
  console.log(card);
  if (!card) return "";
  const str = String(card).replace(/\s+/g, ""); // 去掉空格
  const prefix = str.slice(0, 4);
  const suffix = str.slice(-4);
  return `${prefix} **** **** ${suffix}`;
};

const All = () => {
  console.log(amount.value);
  ruleForm.amount = amount.value;
};
const swichTab = (value) => {
  active.value = value;
  if (active.value == 1) {
    onRefresh();
  }
};
const toList = () => {
  router.push({ path: "/cardList" });
};
const getWithdrawal = () => {
  console.log(bankItem.id);
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

  // if (!ruleForm.tradePassword) return showToast(t("请输入交易密码"));
  let query = ruleForm;
  query.walletId = bankItem.value.id;

  withdrawal(ruleForm).then((res) => {
    showSuccessToast(t("提现成功"));
    // router.push({ path: "/my" });
    swichTab(1);
  });
};
const changeOrder = (value) => {
  orderActive.value = value;
  if (orderActive.value == 0) {
    query.status = "1";
  } else if (orderActive.value == 1) {
    query.status = "0";
  } else {
    query.status = "2";
  }
  onRefresh();
};
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
  console.log(userStore.userWallerType);
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

window.addEventListener("updateTrade", (e) => {
  userGetInfoMethods();
});
const userGetInfoMethods = () => {
  userGetInfo().then((res) => {
    amount.value = res.data.balance;
    ruleForm.amount = amount.value;
    userInfo.value = res.data;
  });
};

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

onMounted(() => {
  tradeConfig();
  userGetInfoMethods();
  getgetUserBankWallet();
});
</script>
<style>
.withdraw .el-input__wrapper {
  border: 1px solid #e5e7eb;
}
.van-tabs--card > .van-tabs__wrap {
  line-height: 40px !important;
  height: 40px !important;
}
.van-tab {
  line-height: 40px !important;
}
</style>
<style scoped>
.router {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.tab {
  position: relative;
  padding-bottom: 5px; /* 给伪元素留点空间 */
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  padding-bottom: 12px;
}

.tab::after {
  content: "";
  position: absolute;
  left: 50%; /* 基准点放在中间 */
  bottom: 0;
  width: 100%; /* 下划线宽度 */
  height: 2px;
  text-align: center;
  background-color: transparent;
  transform: translateX(-50%); /* 往左移一半，居中 */
  transition: all 0.3s;
}

.tab.active {
  color: #000000;
}

.tab.active::after {
  background-color: #000; /* 激活状态的下划线颜色 */
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
