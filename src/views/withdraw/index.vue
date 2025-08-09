<template>
  <div class="w-full bg-white min-h-[100vh] h-full withdraw">
    <van-sticky type="primary">
      <van-nav-bar
        :title="$t('提取')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>

    <div class="mt-10">
      <van-tabs
        color="#007513"
        title-active-color="#007513"
        v-model:active="active"
        @change="swichTab"
      >
        <van-tab :title="$t('提取')">
          <div class="p-4 box-border flex flex-col">
            <div
              class="flex flex-col justify-between p-4 box-border"
              :style="{
                background: `url(${bgImage}) 0 0 / 100% 100% no-repeat`,
              }"
            >
              <div class="text-white opacity-70 text-sm font-semibold">
                {{ $t("账户金额") }}
              </div>
              <div class="flex mt-4">
                <div class="text-white text-3xl font-bold flex items-center">
                  {{ amount }}
                </div>
                <div
                  class="text-white text-sm font-bold flex items-center ml-2 pt-[12px]"
                >
                  {{ $t("美元") }}
                </div>
              </div>
              <div
                class="text-white opacity-70 text-sm font-semibold pt-4 pb-2"
              >
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
                type="text"
                :placeholder="$t('提款金额')"
                autocomplete="off"
                size="large"
              >
                <template #suffix>
                  <el-button
                    type="primary"
                    style="background: #005713"
                    @click="All"
                    size="default"
                    >全部</el-button
                  >
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

          <div class="w-full mt-6 p-5">
            <van-button color="#007513" @click="getWithdrawal" class="w-full">{{
              $t("提取")
            }}</van-button>
          </div>
        </van-tab>
        <van-tab :title="$t('历史')">
            <van-tabs
              v-model:active="orderActive"
              @change="changeOrder"
              color="#005713"
              title-active-color="#fff"
              type="card"
              class="m-6"
            >
              <van-tab :title="$t('待审核')"></van-tab>
              <van-tab :title="$t('审核成功')"></van-tab>
              <van-tab :title="$t('审核拒绝')"></van-tab>
            </van-tabs>
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
              v-model:loading="loading"
              :finished="finished"
              :finished-text="$t('没有更多了')"
              @load="onLoad"
            >
              <van-cell v-for="item in list" :key="item" :title="item">
                <div
                  class="shadow rounded-xl bg-[#e8f7ec] text-[#666] p-3 box-border flex flex-col m-2"
                >
                  <div
                    class="flex items-center justify-between font-medium pb-2 text-sm"
                  >
                    {{item.code}}
                  </div>
                  <div class="w-full h-[1px] bg-[#EBEBEB]"></div>
                  <div class="flex flex-col text-sm font-medium mt-2">
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("姓名") }}</div>
                      <div class="w-[50%] break-words">：{{item.username}}</div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("钱包地址") }}</div>
                      <div class="w-[50%] break-words">：{{item.withdrawAddress}}</div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("钱包名称") }}</div>
                      <div class="w-[50%] break-words">：{{item.withdrawType}}</div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("提现金额") }}</div>
                      <div class="w-[50%] break-words">：{{item.amount}}</div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("到账金额") }}</div>
                      <div class="w-[50%] break-words">：{{item.creditedAmount}}</div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("费率") }}</div>
                      <div class="w-[50%] break-words">：{{item.fee}}</div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("手续费") }}</div>
                      <div class="w-[50%] break-words">：
                        {{ (item.amount * TradeInfor.withdrawFeePercent / 100).toFixed(2) }}
                      </div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("状态") }}</div>
                      <div class="w-[50%] break-words">：{{item.status == 0?$t('通过'):item.status == 1?$t('待审核'):$t('拒绝')}}</div>
                    </div>
                    <div class="flex mt-1">
                      <div class="w-[50%]">{{ $t("创建时间") }}</div>
                      <div class="w-[50%] break-words">：{{item.applicationTime}}</div>
                    </div>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script setup>
const bgImage = new URL("@/static/images/bg-3.png", import.meta.url).href;
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {getWithdrawals,withdrawal,getTradeConfig} from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import { showLoadingToast,closeToast,showFailToast,showSuccessToast   } from 'vant';

const orderActive = ref(0)
const active = ref(0);
const list = ref([]);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const amount = ref('')
const userStore = useUserStore();
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  status:'1'
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
  ruleForm.money = amount.value;
};
const swichTab = () => {
  if (active.value == 1) {
    onRefresh();
  }
};
const getWithdrawal = () =>{
  if(!ruleForm.amount) return ElMessage.error(t("请输入金额"));
  if(!ruleForm.tradePassword) return ElMessage.error(t("请输入交易密码"));
   withdrawal(ruleForm).then(res =>{
    ElMessage({ message: t("提现成功"), type: "success" });
      router.push({ path: "/my" });
   })


}
const changeOrder = () =>{
  if(orderActive.value == 0) {
    query.status = '1'
  } else if (orderActive.value ==1) {
    query.status = '0'
  } else {
    query.status = '2'
  }
  onRefresh()
}
const TradeInfor = ref({})

const tradeConfig =async () =>{
  let res = await getTradeConfig()
  TradeInfor.value = res.data
}

onMounted(async () => {
  tradeConfig()
  await userStore.getUserInfo();
  amount.value = userStore.userInfo.balance;
})
</script>
<style>
.withdraw .el-input__wrapper {
  border: 1px solid #005713;
}
</style>
