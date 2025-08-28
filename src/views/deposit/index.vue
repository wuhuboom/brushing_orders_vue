<template>
  <div class="w-full bg-[#f8f8f8] min-h-[100vh] h-full">
    <van-sticky type="primary">
      <van-nav-bar
        :title="$t('定金')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>

    <div
      class="bg-white mt-[65px] flex justify-between items-center text-[#6B7280]"
    >
      <div class="tab" :class="{ active: active === 0 }" @click="swichTab(0)">
        {{ $t("定金") }}
      </div>
      <div class="tab" :class="{ active: active === 1 }" @click="swichTab(1)">
        {{ $t("历史") }}
      </div>
    </div>

    <div v-if="active === 0">
      <div class="p-4 box-border flex flex-col">
        <div
          class="flex flex-col justify-between items-center p-4 box-border rounded-[10px]"
          :style="{
            background: `#fff`,
          }"
        >
          <div class="text-[#757575] opacity-70 text-sm font-semibold">
            {{ $t("账户金额") }}
          </div>
          <div class="flex mt-[2px]">
            <div class="text-[#206645] text-3xl font-bold flex items-center">
              {{ userInfo.balance }}
            </div>
            <!-- <div
              class="text-[#757575] text-sm font-bold flex items-center ml-2 pt-[12px]"
            >
              {{ $t("美元") }}
            </div> -->
          </div>
        </div>
      </div>
      <div class="w-full mt-2 pl-5 pr-5">
        <van-button color="#206645" class="w-full" @click="customer">{{
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
                  <div class="text-sm  text-[#757575]">
                    {{ item.code }}
                  </div>
                </div>
                <div
                  class="flex text-base text-[#206645] font-semibold items-center my-[5px] "
                >
                  {{ item.amout }}{{ $t("美元") }}
                </div>
                <div class="flex justify-between">
                  <div class="text-sm font-normal text-[#757575]">
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
import { getDeposit, userGetInfo } from "../../api/apis";
import {formatWithTimezone} from "../../util/utils"
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
  ContactUsRef.value.open();
};
onMounted(() => {
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
