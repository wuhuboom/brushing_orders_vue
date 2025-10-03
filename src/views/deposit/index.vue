<template>
  <div class="w-full bg-[#fff] min-h-[100vh] h-full">
    <!-- <van-sticky type="primary">
      <van-nav-bar
        :title="$t('定金')"
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
      <div class="mx-auto text-white text-[22px] py-[24px]">{{$t('定金')}}</div>
    </div>

    <!-- <van-tabs color="#ff9662" class="mt-[45px]"  @change="swichTab" v-model:active="active">
      <van-tab :title="$t('定金')"></van-tab>
      <van-tab :title="$t('历史')"></van-tab>
    </van-tabs> -->
    <div
      class="bg-white  flex justify-between items-center py-[15px]  text-[#757575]"
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
          class="flex flex-col justify-between p-4 box-border rounded-xl bg-[url(@/static/images/bg3.png)] bg-cover shadow"
          style="
            background-size: 100% 100%;
          "
        >
          <div class="text-[#fff] opacity-70 text-sm font-semibold">
            {{ $t("账户金额") }}
          </div>
          <div class="flex mt-[10px] mb-[5px]">
            <div class="text-[#fff] text-3xl font-bold flex items-center">
              {{ userInfo.balance }}
            </div>
          </div>
        </div>
      </div>
      <div class="w-full mt-2 pl-5 pr-5">
        <van-button color="#000" size="large" class="w-full" @click="customer">{{
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
                class="w-full pl-[16px] mb-4 rounded-lg flex flex-col p-3"
                style="border-bottom: 2px solid #f5f5f5;"
              >
                <div class="flex justify-between">
                  <div class="text-[14px]  text-[#757575] ">
                    {{ item.code }}
                  </div>
                </div>
                <div class="text-[#000] text-[18px] font-semibold py-[10px]">+{{ item.amout }}</div>
                <!-- <div class="w-full flex items-center justify-between mt-2"> -->
                  <div class="text-[#9E9E9E] text-sm">
                    {{ formatWithTimezone(item.createTime,userStore.zoneActive.tzName)  }}
                  </div>
                  
                <!-- </div> -->
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
    <ContactUs ref="ContactUsRef"></ContactUs>
  </div>
</template>
<script setup>
const bgImage = new URL("@/static/images/bg-3.png", import.meta.url).href;
import { onMounted, reactive, ref } from "vue";
import { useUserStore } from "@/store/modules/user";
import { getDeposit, userGetInfo,getTradeConfig } from "../../api/apis";
import {formatWithTimezone,checkWorkTimeLocal} from "../../util/utils"
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
const { t } = useI18n();
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
    // console.error("加载失败", error);
    finished.value = true; // 避免无限加载
  }
};
const customer = () => {
  const time = checkWorkTimeLocal(TradeInfor.value.workTimeStart, TradeInfor.value.workTimeEnd,userStore.zoneActive.tzName);;
  if(time) {
     ContactUsRef.value.open();
  } else {
    showToast(
        t("supportHours", {
          start: TradeInfor.value.workTimeStart,
          end: TradeInfor.value.workTimeEnd
        })
      )

  }
};
const TradeInfor = ref({})
const tradeConfig = async () => {
  let res = await getTradeConfig();
  TradeInfor.value = res.data;
};
window.addEventListener('updateTrade', (e) => {
    getUserGetInfo();
})
const getUserGetInfo = () => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
  });
}
onMounted(() => {
  getUserGetInfo()
  tradeConfig()
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
  font-size: 16px;
  /* padding-bottom: 10px; */
}

.tab.active {
  color: #000;
  font-weight: bold;
  border-bottom: 2px solid #000000 ;
}

.tab.active::after {
  background-color: #000000; /* 激活状态的下划线颜色 */
}
</style>
