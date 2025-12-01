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
    <div class="relative flex items-center justify-center h-[56px] px-[16px]">
      <div class="absolute left-[16px]">
        <van-icon
          name="arrow-left"
          color="#000"
          size="22px"
          @click="onClickLeft"
        />
      </div>
      <div class="text-base text-[#000000] font-medium">
        {{ $t("deposit.title") }}
      </div>
      <!-- <div class="absolute right-[16px] text-base text-[#fff]">History</div> -->
    </div>
    <div>
      <div class="w-full px-[16px]  pt-6 box-border flex flex-col">
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
                style="box-shadow: 0px 1px 2px 0px #f3f4f6"
              >
                <div class="flex justify-between">
                  <div class="text-sm font-semibold text-[#999]">
                    {{ item.orderNumber }}
                  </div>
                </div>
                <div
                  class="flex text-[16px] text-[#002D72] font-semibold items-center my-[15px] "
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
const TradeInfor = ref({})
const tradeConfig = async () => {
  let res = await getTradeConfig();
  TradeInfor.value = res.data;
};

onMounted(() => {
  tradeConfig();
  onRefresh();
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
