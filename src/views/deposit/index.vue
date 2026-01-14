<template>
  <div class="w-full bg-[#f1f1f1] min-h-[100vh] h-full">
    <!-- <van-sticky type="primary">
      <van-nav-bar
        :title="$t('定金')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky> -->
    <div
      class="relative bg-gradient-to-r from-[#a04149]  to-[#6a4d52] flex items-center justify-center h-[56px] px-[16px]"
    >
      <div class="absolute left-[16px]">
        <van-icon
          name="arrow-left"
          color="#fff"
          size="22px"
          @click="onClickLeft"
        />
      </div>
      <div class="text-base text-[#FFFFFF] font-medium">{{ $t("定金") }}</div>
      <div class="absolute right-[16px] text-base text-[#fff]" @click="toHistory">{{$t('Withdrawal.History')}}</div>
    </div>
    <div
      class="flex flex-col justify-between p-4 box-border mt-[-2px] bg-gradient-to-r from-[#a04149]  to-[#6a4d52]"
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
          {{ userInfo.balance }}
        </div>
        <div class="text-white text-sm flex items-center ml-2 pt-[12px]">
          {{ $t("美元") }}
        </div>
      </div>
    </div>
    <div class="w-full pl-5 pr-5 mt-[20px]">
        <!-- <van-button
          color="#002D72"
          style="
            background: linear-gradient(135deg, #002D72, #0a4da2);
            color: #fff;
          "
          @click="getWithdrawal"
          class="w-full"
          >{{ $t("提取") }}</van-button
        > -->

        <van-button color="" style="
            background: linear-gradient(135deg, #a04149, #6a4d52);
            color: #fff;
          "   class="w-full" @click="customer">{{
          $t("联系客服")
        }}</van-button>


      </div>

    <!-- <div
      class="bg-white mt-[65px] flex justify-between items-center text-[#6B7280]"
    >
      <div class="tab" :class="{ active: active === 0 }" @click="swichTab(0)">
        {{ $t("定金") }}
      </div>
      <div class="tab" :class="{ active: active === 1 }" @click="swichTab(1)">
        {{ $t("历史") }}
      </div>
    </div> -->
     <!-- <van-tabs color="#ff497c" class="mt-[85px]"  @change="swichTab" v-model:active="active">
      <van-tab :title="$t('定金')"></van-tab>
      <van-tab :title="$t('历史')"></van-tab>
    </van-tabs>

    <div v-if="active === 0">
      <div class="p-4 mt-[10px] box-border flex flex-col">
        <div
          class="flex flex-col justify-between p-4 box-border rounded-xl bg-[#ff497c] bg-cover shadow"
          style="
            background-size: 100% 100%;
          "
        >
          <div class="text-[#fff] opacity-70 text-sm font-semibold">
            {{ $t("账户金额") }}
          </div>
          <div class="flex mt-[20px] mb-[5px]">
            <div class="text-[#fff] text-3xl font-bold flex items-center">
              {{ userInfo.balance }} <span class="text-white text-sm font-bold flex items-center ml-2 pt-[12px]">USD</span>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full mt-2 pl-5 pr-5">
        <van-button color="#000" round  class="w-full" @click="customer">{{
          $t("联系客服")
        }}</van-button>
      </div>
    </div>
    <div v-else>
      <div class="w-full  pt-6 box-border flex flex-col">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            :finished-text="$t('没有更多了')"
            @load="onLoad"
          >
            <van-cell v-for="item in list" :key="item" :title="item">
              <div
                class="w-full mb-4 bg-[#fff] rounded-lg flex flex-col p-3"
              >
                <div class="flex justify-between">
                  <div class="text-sm font-semibold text-[#999]">
                    {{ item.code }}
                  </div>
                </div>
                <div
                  class="flex text-base text-[#000] font-semibold items-center my-[15px] "
                >
                  <span class="pr-[5px]">{{ $t("美元") }}</span>{{ item.amout }}
                </div>
                <div class="flex justify-between">
                  <div class="text-sm font-normal text-[#999]">
                    {{ formatWithTimezone(item.createTime,userStore.zoneActive.tzName)  }}
                  </div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </div>
    </div> -->
    <ContactUs ref="ContactUsRef"></ContactUs>
  </div>
</template>
<script setup>
const bgImage = new URL("@/static/images/bg-3.png", import.meta.url).href;
import { onMounted, reactive, ref } from "vue";
import { useUserStore } from "@/store/modules/user";
import { getDeposit, userGetInfo,getTradeConfig,getRechargeAddress } from "../../api/apis";
import {formatWithTimezone,checkWorkTimeLocal} from "../../util/utils"
import ContactUs from "@/components/ContactUs.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { showToast } from "vant";
const { t } = useI18n();
const router = useRouter();
const active = ref(0);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const userStore = useUserStore();
const ContactUsRef = ref(null);
const userInfo = ref({});
const swichTab = (value) => {
  active.value = value;
  if (active.value == 1) {
    onRefresh();
  }
};
const list = ref([]);
const query = reactive({
  pageNum: 1,
  pageSize: 10,
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
    let res = await getDeposit(query);
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
const customer = () => {
  const time = checkWorkTimeLocal(TradeInfor.value.workTimeStart, TradeInfor.value.workTimeEnd,userStore.zoneActive.tzName);;
  
  console.log(AddressInfor.value)
  if(Object.keys(AddressInfor.value).length > 0) {
     router.push({ path: "/address" });
  } else {
    if(time) {
      ContactUsRef.value.open();
    } else {
      showToast(t("supportHours"))
    }
  }
 
};
const TradeInfor = ref({})
const tradeConfig = async () => {
  let res = await getTradeConfig();
  TradeInfor.value = res.data;
};

const toHistory = () =>{
  router.push({ path: "/depositHistory" });
}

const AddressInfor = ref({})
const getGetRechargeAddress = async () =>{
    let res = await getRechargeAddress()
    AddressInfor.value = res.data[0]
}
onMounted(() => {
  tradeConfig()
  getGetRechargeAddress()
  userGetInfo().then((res) => {
    userInfo.value = res.data;
  });
});
const onClickLeft = () => history.back();
</script>
<style scoped>
.tab {
  position: relative;
  padding-bottom: 5px; /* 给伪元素留点空间 */
  cursor: pointer;
  width: 50%;
  height: 100%;
  padding: 15px 0;
  text-align: center;
  /* padding-bottom: 10px; */
}

.tab.active {
  color: #206645;
  border-bottom: 2px solid #206645;
}

.tab.active::after {
  background-color: #206645; /* 激活状态的下划线颜色 */
}
</style>
