<template>
  <div class="bg-[#f5f5f5] records">
    <HeaderTop></HeaderTop>
    <van-tabs color="#ff9662" @change="swichTab" v-model:active="active">
      <van-tab :title="$t('全部')"></van-tab>
      <van-tab :title="$t('待办')"></van-tab>
      <van-tab :title="$t('完成')"></van-tab>
    </van-tabs>
    <div class="h-[80vh] overflow-y-scroll">
      <div class="w-full pl-6 pr-6 pt-6 box-border flex flex-col">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            :finished-text="$t('没有更多了')"
            @load="onLoad"
          >
            <van-cell v-for="item in list" :key="item" :title="item">
              <div>
                <div class="w-full flex justify-between items-center mb-2">
                  <div class="text-[#999] text-sm font-medium">
                    {{
                      formatWithTimezone(
                        item.createTime,
                        userStore.zoneActive.tzName
                      )
                    }}
                  </div>
                  <div
                    class="text-white text-xs rounded p-1 bg-[#ff9662] font-medium"
                    :class="Number(item.status) === 2?'bg-[#7E8FA2]':'bg-[#ff9662]'"
                  >
                    {{
                      Number(item.status) == 0
                        ? $t("已完成")
                        : Number(item.status) == 1
                        ? $t("冻结")
                        : $t("待提交")
                    }}
                  </div>
                </div>
                <div
                  class="w-full flex flex-col mb-6 bg-[#fff] overflow-hidden rounded-xl p-3 box-border"
                  style="border: 1px solid rgb(240, 240, 240)"
                >
                  <div class="flex">
                    <div
                      class="w-[6rem] h-[6rem] overflow-hidden rounded-md flex-shrink-0 mr-4"
                    >
                      <img
                        :src="VITE_API_IMG_URL + item.coverUrl"
                        class="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div class="flex flex-col h-[6rem] justify-between">
                      <div class="flex flex-col">
                        <div
                          class="text-[#999] text-base font-semibold whitespace-nowrap w-[52vw] overflow-hidden text-ellipsis"
                        >
                          {{ item.goodsName }}
                        </div>
                        <div class="text-[#999] text-sm mt-2">
                          <span class="pr-[5px]">{{ $t("美元") }}</span
                          >{{ item.price }}
                        </div>
                      </div>
                      <van-rate
                        v-model="value"
                        :size="20"
                        color="#ffd21e"
                        void-icon="star"
                        void-color="#eee"
                      />
                    </div>
                  </div>
                  <div class="mt-5 grid grid-cols-4 gap-2">
                    <div class="col-span-2 flex flex-col">
                      <div class="text-xs text-[#999] font-medium">
                        {{ $t("总金额") }}
                      </div>
                      <div class="mt-2 text-sm text-[#ff9662] font-semibold">
                        {{ item.price }} {{ $t("美元") }}
                      </div>
                    </div>
                    <div class="col-span-2 flex flex-col">
                      <div class="text-xs text-[#999] font-medium">
                        {{ $t("佣金") }}
                      </div>
                      <div class="mt-2 text-sm text-[#ff9662] font-semibold">
                        {{ item.commission }} {{ $t("美元") }}
                      </div>
                    </div>
                    <div
                      class="col-span-4 flex justify-end items-center mt-2"
                      v-if="item.status == '2'"
                    >
                      <van-button
                        color="#ff9662"
                        size="small"
                        @click="submit(item)"
                        >{{ $t("提交") }}</van-button
                      >
                    </div>
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
      closeable
      :title="$t('提交1')"
      :show-confirm-button="false"
    >
      <div class="flex flex-col p-3 box-border mt-3">
        <div
          class="flex border-b-[1px] border-[#e5e7eb] pb-4"
          style="width: 6rem"
        >
          <div
            class="w-[6rem] h-[6rem] overflow-hidden rounded-md flex-shrink-0 mr-4"
          >
            <img
              :src="VITE_API_IMG_URL + goodsData.coverUrl"
              class="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div class="flex flex-col h-[6rem] justify-between">
            <div class="flex flex-col">
              <div
                class="text-[#666] w-44 whitespace-nowrap overflow-hidden text-ellipsis text-sm font-semibold"
              >
                {{ goodsData.goodsName }}
              </div>
              <div class="text-[#666] text-sm mt-2 font-semibold">
                USD {{ goodsData.price }}
              </div>
            </div>
            <van-rate
              v-model="value"
              :size="20"
              color="#ffd21e"
              void-icon="star"
              void-color="#eee"
            />
          </div>
        </div>
        <div
          class="flex items-center pt-4 pb-4 box-border border-b-[1px] border-[#e5e7eb]"
        >
          <div
            class="w-[50%] flex flex-col border-r-[1px] border-[#e5e7eb] justify-center items-center"
          >
            <div class="text-[#333] font-semibold">
              {{ $t("总金额") }}
            </div>
            <div class="text-xs text-[#999] mt-1">
              USD
              <span class="text-sm text-[#ff9662] font-semibold">{{
                goodsData.price
              }}</span>
            </div>
          </div>
          <div
            class="w-[50%] flex flex-col border-[#e5e7eb] justify-center items-center"
          >
            <div class="text-[#333] font-semibold">
              {{ $t("佣金") }}
            </div>
            <div class="text-xs text-[#999] mt-1">
              USD
              <span class="text-sm text-[#ff9662] font-semibold">{{
                goodsData.commission
              }}</span>
            </div>
          </div>
        </div>
        <div
          class="flex justify-between items-center pt-4 pb-4 box-border border-b-[1px] border-[#e5e7eb]"
        >
          <div class="text-[#666] text-sm">{{ $t("创建时间") }}</div>
          <div class="text-[#333] text-sm font-bold">
            {{
              formatWithTimezone(
                goodsData.createTime,
                userStore.zoneActive.tzName
              )
            }}
          </div>
        </div>
        <div
          class="flex justify-between items-center pt-4 pb-4 box-border border-b-[1px] border-[#e5e7eb]"
        >
          <div class="text-[#666] text-sm">{{ $t("编号") }}</div>
          <div class="text-[#ff9662] text-xs font-bold">
             {{ goodsData.orderNo }}
          </div>
        </div>
        <div class="w-full mt-4">
          <van-button color="#ff9662" round class="w-full" @click="submitVal">{{
            $t("提交")
          }}</van-button>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import HeaderTop from "@/components/HeaderTop.vue";
import { onMounted, ref, reactive } from "vue";
import { getOrderInfos, submitOrder } from "../../api/apis";
import {
  showLoadingToast,
  closeToast,
  showFailToast,
  showSuccessToast,
} from "vant";
import { useI18n } from "vue-i18n";
import { formatWithTimezone } from "../../util/utils";
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
const router = useRouter();
const userStore = useUserStore();
const VITE_API_IMG_URL = window.g.VITE_API_IMG_URL;
const { t } = useI18n();
const active = ref(0);
const list = ref([]);
const show = ref(false);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const goodsData = ref({});
const value = ref(5);
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  status: "",
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
    let res = await getOrderInfos(query);
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
const submit = (item) => {
  goodsData.value = item;
  show.value = true;
};

const submitVal = () => {
  submitOrder(goodsData.value.id)
    .then((res) => {
      showSuccessToast(t("提交成功"));
      onRefresh();
      if (res.code == 201) {
        goodsData.value = res.data;
      } else {
        show.value = false;
      }
    })
    .catch((err) => {
      if (err.code == 916) {
        router.push("/deposit");
      } else {
        ElMessage({ message: err.status, type: "error" });
      }
    });
};

const swichTab = () => {
  console.log(active.value);
  if (active.value == 0) {
    query.status = "";
  } else if (active.value == 1) {
    query.status = 2;
  } else {
    query.status = 0;
  }
  onRefresh();
};
onMounted(() => {
  onLoad();
});
</script>
<style scoped></style>
