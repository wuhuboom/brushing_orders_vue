<template>
  <div class="bg-[#f8f8f8]">
    <HeaderTop1></HeaderTop1>
    <!-- <van-tabs color="#007513" class="mt-[10px]"  @change="swichTab" v-model:active="active">
      <van-tab :title="$t('全部')"></van-tab>
      <van-tab :title="$t('待办')"></van-tab>
      <van-tab :title="$t('完成')"></van-tab>
    </van-tabs> -->
    <div
      class="bg-white mt-[10px] flex justify-between items-center py-[15px] px-[30px] text-[#6B7280]"
    >
      <div class="tab" :class="{ active: active === 0 }" @click="swichTab(0)">
        {{ $t("全部") }}
      </div>
      <div class="tab" :class="{ active: active === 1 }" @click="swichTab(1)">
        {{ $t("待办") }}
      </div>
      <div class="tab" :class="{ active: active === 2 }" @click="swichTab(2)">
        {{ $t("完成") }}
      </div>
    </div>
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
                class="w-full flex flex-col mb-6 bg-[#fff] border-[1px] border-[#eee] p-3 box-border rounded-xl"
              >
                <div class="w-full flex justify-between items-center">
                  <div class="text-[#666] text-sm">
                    {{ item.createTime }}
                  </div>
                  <div
                    class="text-xs p-1 rounded"
                    :class="
                      item.status == '2'
                        ? 'bg-[#999] text-[#000]'
                        : item.status == '1'
                        ? 'bg-[#F56C6C] text-white'
                        : 'bg-[#206645] text-white'
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
                <div class="w-full flex mt-[8px]">
                  <div class="mr-2 w-[20%]" style="width: 4rem">
                    <img :src="VITE_API_IMG_URL + item.coverUrl" alt="" />
                  </div>
                  <div class="w-[80%] flex flex-col h-[3rem] justify-between">
                    <div>
                      <div
                        class="text-[#000] text-sm font-semibold whitespace-nowrap text-ellipsis overflow-hidden"
                      >
                        {{ item.goodsName }}1111
                      </div>
                      <div class="grid grid-cols-4 mt-2">
                        <div class="col-span-2 flex flex-col">
                          <!-- <div class="text-xs text-[#666] font-medium">
                                                    {{$t('总金额')}}
                                                </div> -->
                          <div
                            class="text-[16px] text-[var(--main-color)] font-semibold"
                          >
                            {{ item.price }} {{ $t("美元") }}
                          </div>
                        </div>
                        <!-- <div class="col-span-2 flex flex-col">
                                                <div class="text-xs text-[#666] font-medium">
                                                    {{$t("佣金")}}
                                                </div>
                                                <div class="mt-1 text-sm text-[var(--main-color)] font-semibold">
                                                    {{item.commission}} {{$t('美元')}}
                                                </div>
                                            </div> -->
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="w-full h-[1px] my-4"
                  style="border-bottom: 2px solid #f9f9f9"
                ></div>
                <div class="flex mt-2 justify-between">
                  <div class="col-span-2 flex flex-col">
                    <div class="text-xs text-[#666] font-medium">
                      {{ $t("总金额") }}
                    </div>
                    <div
                      class="text-[16px] text-[#000] pt-[5px]"
                    >
                      {{ item.price }} {{ $t("美元") }}
                    </div>
                  </div>
                  <div class="col-span-2 flex flex-col">
                    <div class="text-xs text-[#666] font-medium">
                      {{ $t("佣金") }}
                    </div>
                    <div
                      class="mt-1 text-sm text-[#000] pt-[5px]"
                    >
                      {{ item.commission }} {{ $t("美元") }}
                    </div>
                  </div>
                </div>

                <div
                  class="flex justify-end items-center mt-5"
                  v-if="item.status == '2'"
                >
                  <van-button
                    color="#206645"
                    @click="submit(item)"
                    size="small"
                    >{{ $t("提交") }}</van-button
                  >
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
      :title="''"
      :show-confirm-button="false"
    >
      <div class="w-[5rem] mx-auto pt-10" style="width: 6rem; z-index: 999">
        <img :src="VITE_API_IMG_URL + goodsData.coverUrl" alt="" />
      </div>
      <div class="w-full mt-[-3rem] pt-[4rem] text-[#000] p-4 rounded-lg">
        <div class="w-[100%] mx-auto text-center text-sm font-semibold">
          {{ goodsData.goodsName }}
        </div>
        <div class="flex w-full items-center pt-4 pb-4 mt-4">
          <div
            class="w-[50%] mr-2 flex flex-col py-4 bg-[#d8d8d8] justify-center items-center"
          >
            <div class="text-[#000] font-semibold">{{ $t("总金额") }}</div>
            <div class="text-xs text-[#000] mt-1">
              {{ goodsData.price }}{{ $t("美元") }}
            </div>
          </div>
          <div
            class="w-[50%] mr-2 flex flex-col py-4 bg-[#d8d8d8] justify-center items-center"
          >
            <div class="text-[#000] font-semibold">{{ $t("佣金") }}</div>
            <div class="text-xs text-[#000] mt-1">
              {{ goodsData.commission }}{{ $t("美元") }}
            </div>
          </div>
        </div>
        <div class="bg-[#d8d8d8] p-4">
          <div class="flex justify-between items-center box-border">
            <div class="text-[#000] text-sm">{{ $t("创建时间") }}</div>
            <div class="text-[#000] text-sm font-bold">
              {{ goodsData.createTime }}
            </div>
          </div>
          <div class="flex justify-between items-center box-border">
            <div class="text-[#000] text-sm">{{ $t("编号") }}</div>
            <div class="text-[#000] text-sm font-bold">
              {{ goodsData.createTime }}
            </div>
          </div>
        </div>
        <div class="w-full mt-4">
          <van-button color="#007513" class="w-full" @click="submitVal">{{
            $t("提交")
          }}</van-button>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import HeaderTop1 from "@/components/HeaderTop1.vue";
import { onMounted, ref, reactive } from "vue";
import { getOrderInfos, submitOrder } from "../../api/apis";
import {
  showLoadingToast,
  closeToast,
  showFailToast,
  showSuccessToast,
} from "vant";
import { useI18n } from "vue-i18n";
const VITE_API_IMG_URL = import.meta.env.VITE_API_IMG_URL;
const { t } = useI18n();
const active = ref(0);
const list = ref([]);
const show = ref(false);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const goodsData = ref({});
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
  submitOrder(goodsData.value.id).then((res) => {
    showSuccessToast(t("提交成功"));
    onRefresh();
    if (res.code == 201) {
      goodsData.value = res.data;
    } else {
      show.value = false;
    }
  });
};

const swichTab = (value) => {
  active.value = value;
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
<style scoped>
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
</style>
