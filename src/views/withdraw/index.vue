<template>
  <div class="w-full bg-[#f9f9f9] min-h-[100vh] h-full withdraw">
    <van-sticky type="primary">
      <van-nav-bar
        :title="$t('提取')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
    <div
      class="bg-white mt-[65px] flex justify-between items-center py-[15px] px-[73px] text-[#6B7280]"
    >
      <div class="tab" :class="{ active: active === 0 }" @click="swichTab(0)">
        {{ $t("提取") }}
      </div>
      <div class="tab" :class="{ active: active === 1 }" @click="swichTab(1)">
        {{ $t("历史") }}
      </div>
    </div>
    <div v-if="active === 0">
      <div class="p-4 box-border flex flex-col">
        <div
          class="flex flex-col justify-between p-4 box-border rounded-[15px]"
          :style="{
            background: 'linear-gradient( 180deg, #206645 0%, #1A533A 100%)',
          }"
        >
          <div class="text-white opacity-70 text-sm">
            {{ $t("账户金额") }}
          </div>
          <div class="flex mt-4">
            <div class="text-white text-3xl  flex items-center">
              {{ amount }}
            </div>
            <div
              class="text-white text-sm flex items-center ml-2 pt-[12px]"
            >
              {{ $t("美元") }}
            </div>
          </div>
          <div class="text-white opacity-70 text-xs pt-4 pb-2">
            {{ $t("您将在一小时内收到提款") }}
          </div>
        </div>
      </div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="w-full mt-4 p-4"
      >
        <el-form-item
          :label="$t('提款金额')"
          prop="amount"
          label-position="top"
        >
          <el-input
            v-model="ruleForm.amount"
            type="number"
            :placeholder="$t('提款金额')"
            autocomplete="off"
            size="large"
           
          >
            <template #append>
              <el-button
                type="primary"
                class="router"
                style="background: #206645; border-color: #005713;height: 100%;color: #fff;"
                @click="All"
              >
                {{ $t("全部") }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('交易密码')" label-position="top">
          <el-input
            v-model="ruleForm.tradePassword"
            :placeholder="$t('交易密码')"
            type="password"
            autocomplete="off"
            size="large"
            show-password
          />
        </el-form-item>
      </el-form>
      <div class="w-full pl-5 pr-5">
        <van-button color="#206645" @click="getWithdrawal" class="w-full">{{
          $t("提取")
        }}</van-button>
      </div>
    </div>
    <div class="w-[90%] mx-auto" v-else>
      <div class="flex justify-start mb-[16px] mt-[24px]">
        <div class="bg-[#F3F4F6] px-[16px] py-[6px] rounded-[15px] mr-[10px]" :class="orderActive==0?'bg-[#DCFCE7] text-[#166534]':''" @click="changeOrder(0)">{{$t('待审核')}}</div>
        <div class="bg-[#F3F4F6] px-[16px] py-[6px] rounded-[15px] mr-[10px]" :class="orderActive==1?'bg-[#DCFCE7] text-[#166534]':''" @click="changeOrder(1)">{{$t('审核成功')}}</div>
        <div class="bg-[#F3F4F6] px-[16px] py-[6px] rounded-[15px] mr-[10px]" :class="orderActive==2?'bg-[#DCFCE7] text-[#166534]':''" @click="changeOrder(2)">{{$t('审核拒绝')}}</div>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
              v-model:loading="loading"
              :finished="finished"
              :finished-text="$t('没有更多了')"
              @load="onLoad"
            >
              <van-cell v-for="item in list" :key="item" :title="item">
                <div class="bg-[#fff] flex justify-between items-center px-[16px] py-[16px] rounded-[10px] " :class="item.status==0?'activetab':item.status==1?'activetab1':item.status==2?'activetab2':''">
                  <div class="flex flex-col">
                    <div class="text-[#111827] text-[16px] pb-[4px]">-{{ item.amount }}USD</div>
                    <div class="text-[#6B7280] text-[12px]"> {{ formatWithTimezone(item.applicationTime,userStore.zoneActive.tzName)  }}</div>
                  </div>
                  <div :class="item.status==0?'text-[#15803D ]':item.status==1?'text-[#D97706]':'text-[#B91C1C]'">
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
} from "../../api/apis";
import {formatWithTimezone} from "../../util/utils"
import { useUserStore } from "@/store/modules/user";
import {
  showLoadingToast,
  closeToast,
  showFailToast,
  showSuccessToast,
  showToast
} from "vant";
import { useI18n } from "vue-i18n";
const orderActive = ref(0);
const active = ref(0);
const list = ref([]);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const amount = ref("");
const userStore = useUserStore();
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
  tradePassword: "",
});

const All = () => {
  console.log(amount.value);
  ruleForm.amount = amount.value;
};
const swichTab = (value) => {
  console.log(11);
  active.value = value;
  if (active.value == 1) {
    onRefresh();
  }
};
const getWithdrawal = () => {
  if (!ruleForm.amount) return showToast(t('请输入金额'));
  if (!ruleForm.tradePassword) return showToast(t('请输入交易密码'));
  withdrawal(ruleForm).then((res) => {
    showSuccessToast(t("提现成功"));
    router.push({ path: "/my" });
  });
};
const changeOrder = (value) => {
  orderActive.value = value
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

onMounted(() => {
  tradeConfig();
  userGetInfo().then((res) => {
    amount.value = res.data.balance;
    ruleForm.amount = amount.value;
  });
});
</script>
<style>
.withdraw .el-input__wrapper {
  border: 1px solid #E5E7EB;
}
</style>
<style scoped>
.router {
  border-top-right-radius: 8px;   /* 右上角圆角 */
border-bottom-right-radius: 8px; /* 右下角圆角 */
border-top-left-radius: 0;      /* 左上角不圆 */
border-bottom-left-radius: 0;   /* 左下角不圆 */
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
  box-shadow: 0px 1px 2px 0px #DCFCE7;
}
.activetab1 {
  box-shadow: 0px 1px 2px 0px #D97706;
}
.activetab2 {
  box-shadow: 0px 1px 2px 0px #206645;
}
</style>
