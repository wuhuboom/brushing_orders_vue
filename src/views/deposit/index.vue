<template>
  <div class="w-full bg-white min-h-[100vh] h-full">
    <van-sticky type="primary">
      <van-nav-bar
        :title="$t('定金')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>

    <div class="mt-10">
      <van-tabs color="#007513" background="#f4f4f5" @change="swichTab" v-model:active="active">
        <van-tab :title="$t('定金')">
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
                  {{userInfo.balance}}
                </div>
                <div
                  class="text-white text-sm font-bold flex items-center ml-2 pt-[12px]"
                >
                  {{ $t("美元") }}
                </div>
              </div>
            </div>
          </div>
          <div class="w-full mt-2 pl-5 pr-5">
            <van-button color="#007513" class="w-full" @click="customer">{{
              $t("联系客服")
            }}</van-button>
          </div>
        </van-tab>
        <van-tab :title="$t('历史')">
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
                    class="w-full mb-4 bg-[#e8f7ec] rounded-lg flex flex-col p-3"
                  >
                    <div class="flex justify-between">
                      <div class="text-sm font-semibold text-[#999]">
                        {{ item.code }}
                      </div>
                    </div>
                    <div
                      class="flex text-base text-[#000] font-semibold items-center mt-3"
                    >
                      {{ item.amout }}{{ $t("美元") }}
                    </div>
                    <div class="flex justify-between mt-3">
                      <div class="text-sm font-normal text-[#999]">
                        {{ item.createTime }}
                      </div>
                    </div>
                  </div>
                </van-cell>
              </van-list>
            </van-pull-refresh>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <ContactUs ref="ContactUsRef"></ContactUs>
  </div>
</template>
<script setup>
const bgImage = new URL("@/static/images/bg-3.png", import.meta.url).href;
import { onMounted, reactive, ref } from "vue";
import { useUserStore } from "@/store/modules/user";
import { getDeposit,userGetInfo } from "../../api/apis";
const active = ref(0);
const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);
const userStore = useUserStore();
const ContactUsRef = ref(null);
const userInfo = ref({})
const swichTab = () => {
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
