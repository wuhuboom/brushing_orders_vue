<template>
  <div class="bg-[#f7f7f7] record">
    <!-- <HeaderTop></HeaderTop> -->
    <div class="py-[20px] bg-[#000] mb-[20px]">
      <img class="w-[124px] pl-[16px]" src="@/static/images/logo1.png" alt="" />
    </div>
    <div class="flex justify-start ml-[16px]">
      <div
        class="text-[14px] px-[16px] py-[6px] rounded-[30px] mr-[12px]"
        :class="active == -1 ? 'nav-active' : 'nav'"
        @click="swichTab(-1)"
      >
        {{ $t("全部") }}
      </div>
      <div
        class="text-[14px] px-[16px] py-[6px] rounded-[30px] mr-[12px]"
        :class="active == 2 ? 'nav-active' : 'nav'"
        @click="swichTab(2)"
      >
        {{ $t("待办") }}
      </div>
      <div
        class="text-[14px] px-[16px] py-[6px] rounded-[30px] mr-[12px]"
        :class="active == 0 ? 'nav-active' : 'nav'"
        @click="swichTab(0)"
      >
        {{ $t("完成") }}
      </div>
    </div>
    <!-- <div class="bg-[#f3f3f4]">
      <van-tabs color="#ff497c" @change="swichTab" v-model:active="active">
      <van-tab :title="$t('全部')"></van-tab>
      <van-tab :title="$t('待办')"></van-tab>
      <van-tab :title="$t('完成')"></van-tab>
    </van-tabs>

    </div> -->

    <div class="h-[80vh] overflow-y-scroll">
      <div class="w-full px-2 pt-6 box-border flex flex-col">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            :finished-text="$t('没有更多了')"
            @load="onLoad"
          >
            <van-cell v-for="item in list" :key="item" :title="item">
              <div
                class="w-full flex flex-col mb-6 bg-[#fff] shadow-[0px_1px_2px_1px_rgba(0,0,0,0.05)] p-[16px] box-border rounded-xl"
              >
                <div class="w-full">
                  <div class="mr-2 w-[100%] flex justify-between">
                    <img
                      class="w-[60px] h-[60px]"
                      :src="VITE_API_IMG_URL + item.coverUrl"
                      alt=""
                    />
                    <!-- <div
                      class="text-xs p-1 font-medium rounded h-[24px]"
                      :class="
                        item.status == '2'
                          ? 'bg-[#FFEDD5] text-[#EA580C]'
                          : item.status == '1'
                          ? 'bg-[#FFEDD5] text-[#EA580C]'
                          : 'bg-[#DCFCE7] text-[#16A34A]'
                      "
                    >
                      {{
                        item.status == "0"
                          ? $t("已完成")
                          : item.status == "1"
                          ? $t("冻结")
                          : $t("待提交")
                      }}
                    </div> -->
                  </div>
                  <div class="w-[80%] flex flex-col h-[3rem] justify-between">
                    <div>
                      <div
                        class="text-[#000] text-[14px] pt-[15px] whitespace-nowrap text-ellipsis overflow-hidden"
                      >
                        {{ item.goodsName }}
                      </div>
                      <div class="flex items-center pt-[10px] pb-[5px]">
                        <div class="text-[14px] text-[#000] pr-[6px]">
                          {{ $t("总金额") }}
                        </div>
                        <div class="text-[14px] text-[#002D72] font-semibold">
                          {{ item.price }} {{ $t("美元") }}
                        </div>
                      </div>
                      <div class="flex">
                        <div class="text-[14px] text-[#000] pr-[6px]">
                          {{ $t("佣金") }}
                        </div>
                        <div class="text-[14px] text-[#002D72] font-semibold">
                          {{ item.commission }} {{ $t("美元") }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="w-full h-[1px] my-4"
                  style="border-bottom: 1px dashed rgb(255, 255, 255)"
                ></div>
                <div class="w-full flex justify-between items-center pt-[15px]">
                  <div class="text-[#6B7280] text-sm">
                    <!-- {{item.createTime}} -->
                    {{
                      formatWithTimezone(
                        item.createTime,
                        userStore.zoneActive.tzName
                      )
                    }}
                  </div>
                </div>
                <div
                  class="flex justify-end items-center mt-2"
                  v-if="item.status == '2'"
                >
                  <van-button
                    color="#fff"
                    @click="submit(item)"
                    size="small"
                    style="
                      color: #ff7d01;
                      border: 1px solid #ff7d01;
                      width: 88px;
                      height: 24px;
                    "
                    >{{ $t("提交") }}</van-button
                  >
                </div>
                <div v-else class="flex justify-end items-center mt-2">
                  <div
                    class="text-xs p-1 font-medium text-center rounded h-[24px] w-[88px]"
                    :class="
                      item.status == '2'
                        ? 'bg-[#FFEDD5] text-[#EA580C]'
                        : item.status == '1'
                        ? 'bg-[#FFEDD5] text-[#EA580C]'
                        : 'bg-[#10B981] text-[#fff]'
                    "
                  >
                    {{
                      item.status == "0"
                        ? $t("已完成")
                        : item.status == "1"
                        ? $t("冻结")
                        : $t("待提交")
                    }}
                  </div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
    <Footer name="/records"></Footer>
    <van-dialog
      v-model:show="show"
      :title="''"
      close-on-click-overlay
      :style="{ background: 'rgba(0, 0, 0, 0)', width: '95%' }"
      :show-confirm-button="false"
    >
      <!-- <img class="fixed top-[-200px] z-[-1]" src="@/static/images/dialogBg1.png" alt="" /> -->

      <div class="dialog-bg">
        <div
          class="w-[100%] mx-auto text-[18px] font-semibold text-center px-[40px] pt-[140px]"
        >
          {{ goodsData.goodsName }}
        </div>
        <div class="w-[60px] mx-auto pb-[20px] pt-[20px]">
          <!-- <img class="w-[56px] h-[56px]" :src="url + goodsData.coverUrl" alt="" /> -->
          <img :src="VITE_API_IMG_URL + goodsData.coverUrl" alt="" />
        </div>
        <div class="w-full mt-[-3rem] pt-[23px] text-[#fff] px-[20px]">
          <div class="flex justify-start pb-[23px]">
            <div class="w-[100%]">
              <div
                class="flex justify-between w-[100%] text-[16px] pt-[20px] pb-[10px] px-[18px]"
                style="border-bottom: 1px solid rgba(156, 163, 175, 0.2)"
              >
                <div class="text-[#000] text-[12px]">{{ $t("总金额") }}</div>
                <div class="text-[#000] text-[14px] font-bold">
                  {{ goodsData.price }}{{ $t("美元") }}
                </div>
              </div>
              <div
                class="flex justify-between w-[100%] text-[16px] pt-[20px] pb-[10px] px-[18px]"
                style="border-bottom: 1px solid rgba(156, 163, 175, 0.2)"
              >
                <div class="text-[#000] text-[12px]">{{ $t("佣金") }}</div>
                <div class="text-[#FF9500] text-[14px] font-bold">
                  {{ goodsData.commission }}{{ $t("美元") }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-start pb-[23px]">
            <div class="w-[100%]">
              <div
                class="flex justify-between w-[100%] text-[16px] pb-[10px] px-[18px]"
                style="border-bottom: 1px solid rgba(156, 163, 175, 0.2)"
              >
                <div class="text-[#000] text-[12px]">{{ $t("创建时间") }}</div>
                <div class="text-[#968E9C] font-bold text-[12px]">
                  {{
                    formatWithTimezone(
                      goodsData.createTime,
                      userStore.zoneActive.tzName
                    )
                  }}
                </div>
              </div>
              <div
                class="flex justify-between w-[100%] text-[16px] pt-[20px] pb-[10px] px-[18px]"
                style="border-bottom: 1px solid rgba(156, 163, 175, 0.2)"
              >
                <div class="text-[#000] text-[12px]">{{ $t("编号") }}</div>
                <div class="text-[#968E9C] text-[12px]">
                  {{ goodsData.orderNo }}
                </div>
              </div>
            </div>
          </div>

          <div class="w-[70%] mx-auto mt-4 pb-[60px]">
            <van-button
              color="#FF7D01"
              :loading="isSubmitting"
              :disabled="isSubmitting"
              class="w-full"
              round
              @click.prevent="submitVal"
              >{{ $t("提交") }}</van-button
            >
          </div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import HeaderTop from "@/components/HeaderTop.vue";
import { onMounted, ref, reactive } from "vue";
import Footer from "@/components/Footer.vue";
import { getOrderInfos, submitOrder } from "../../api/apis";
import {
  showLoadingToast,
  closeToast,
  showFailToast,
  showToast,
  showSuccessToast,
} from "vant";
import { useI18n } from "vue-i18n";
import { formatWithTimezone } from "../../util/utils";
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
import { errorMessages } from "../../api/errorCodeMap";
const router = useRouter();
const userStore = useUserStore();
const VITE_API_IMG_URL = window.g.VITE_API_IMG_URL;
const { t } = useI18n();
const active = ref(-1);
const list = ref([]);
const show = ref(false);
const isRefreshing = ref(false);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const goodsData = ref({});
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  status: "",
});

const swichTab = (index) => {
  active.value = index;
  // console.log(active.value);
  if (active.value == -1) {
    console.log(active.value)
    query.status = '';
  } else {
    query.status = index
  }
  onRefresh();
};

const onRefresh = async () => {
  isRefreshing.value = true;
  refreshing.value = true;
  finished.value = false;
  query.pageNum = 1;
  list.value = [];
  await loadData();
  refreshing.value = false;
  isRefreshing.value = false;
};
const onLoad = async () => {
 if (finished.value || isRefreshing.value) {
    loading.value = false;   // 👈 关键
    return;
  }
  loading.value = true;
  await loadData();
  loading.value = false;
};
const loadData = async () => {
  try {
    let res = await getOrderInfos(query);
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
const submit = (item) => {
  goodsData.value = item;
  show.value = true;
};

const isSubmitting = ref(false); // 防重提交标志

const submitVal = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  // 延迟 2 秒触发请求
  setTimeout(async () => {
    try {
      const res = await submitOrder(goodsData.value.id);
      showSuccessToast(t("提交成功"));
      onRefresh();
      if (res.code == 201) {
        goodsData.value = res.data;
      } else {
        show.value = false;
      }
    } catch (err) {
      if (err.code == 916) {
        router.push("/deposit");
      } else {
        // showFailToast(err.status)
        showFailToast(t(errorMessages[err.code]));
        // ElMessage({ message: err.status, type: "error" });
      }
    } finally {
      isSubmitting.value = false;
    }
  }, 1000); // 2000 毫秒 = 2 秒
};


onMounted(() => {
  onLoad();
});
</script>
<style scoped>
.nav-active {
  background: #ff7d01;
  color: #fff;
}
.nav {
  background: #f7f7f7;
  color: #6b7280;
  border: 1px solid #e8e8e8;
}
</style>
<style>
.dialog-bg {
  width: 100%;
  min-height: 300px; /* 必须有高度 */
  background: url("@/static/images/dialogBg.png") no-repeat center center;
  background-size: 100% 100%;
  /* position: relative;
  position: fixed; */
}
</style>
