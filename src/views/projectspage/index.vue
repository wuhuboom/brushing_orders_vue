<template>
  <div>
    <div class="flex items-center relative bg-[#fff]">
      <!-- 左侧箭头 -->
      <!-- <div class="absolute left-3" @click="onClickLeft">
        <van-icon name="arrow-left" color="#fff" size="24px" />
      </div> -->
      <!-- 中间标题 -->
      <div class="mx-auto text-[#000] text-[22px] py-[12px]">{{ $t("menu") }}</div>
    </div>
    <van-tabs
      color="var(--theme-primary)"
      v-if="shopListArr.length > 0"
      @change="swichTab"
      v-model:active="active"
    >
      <van-tab :title="$t('all')"></van-tab>
      <van-tab
        v-for="item in shopListArr"
        :key="item.id"
        :title="'VIP' + item.vipLevel"
      ></van-tab>
    </van-tabs>
    <div class="h-[80vh] overflow-y-scroll px-[20px] mt-[16px]">
      <div
        class="w-full px-2 py-6 box-border flex bg-[#f1f4eb] border-[1px] rounded-[10px] mb-[7px]"
        v-for="item in shopList"
        :key="item.id"
        @click="goToDetail(item)"
      >
        <img
          :src="VITE_API_IMG_URL + item.icon"
          class="w-[68px] h-[68px] mr-[20px]"
          alt=""
        />
        <div>
          <div class="text-[20px] text-[#333] flex items-end">
            {{ item.name }}
            <span
              class="bg-gradient-to-r from-[#fecb2e] to-[#fca322] text-[#fff] text-[12px] w-[35px] h-[20px] flex justify-center items-top rounded-[10px] ml-[10px]"
              >vip{{ item.vipLevel }}</span
            >
          </div>
          <div class="text-[12px] text-[#666]">
            {{ $t("available_balance_colon") }}
            <span v-if="item.maxMoney == 0">≥{{ item.minMoney }} USDT </span>
            <span v-else>{{ item.minMoney }}USDT-{{ item.maxMoney }}USDT</span>
          </div>
          <div class="text-[12px] text-[#8aabd2]">
            {{ $t("commissions_colon") }}
            <span class="text-[#ec3838]">{{ item.commissionPercentage }}%</span>
          </div>
        </div>
      </div>
    </div>

    <Footer name="/projectspage"></Footer>
  </div>
</template>

<script setup>
import HeaderTop from "@/components/HeaderTop.vue";
import { onMounted, ref, reactive } from "vue";
import { getShopList, getShopListVipLevel } from "../../api/apis";
import { showSuccessToast, showFailToast } from "@/util/message";
import { useI18n } from "vue-i18n";
import { formatWithTimezone } from "../../util/utils";
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
import { errorMessages } from "../../api/errorCodeMap";
const router = useRouter();
const userStore = useUserStore();
const VITE_API_IMG_URL = window.g.VITE_API_IMG_URL
  ? window.g.VITE_API_IMG_URL
  : import.meta.env.VITE_API_IMG_URL; // 兜底默认值
const shopList = ref([]);
const shopListArr = ref([]);
const active = ref(0);
const getShopArr = async () => {
  let res = await getShopList();
  shopListArr.value = res.data; // 保存原始数据
  shopList.value = res.data; // 默认显示all
};

const swichTab = () => {
  // 从原始数据中过滤
  const list = shopListArr.value.filter(
    (item) => item.vipLevel === active.value
  );

  // 如果有结果 → 用过滤结果，否则 → 显示all
  shopList.value = list.length ? list : shopListArr.value;
};
const goToDetail = (item) => {
  let qurey = {
    vipLevel: item.vipLevel,
  };
  getShopListVipLevel(qurey).then((res) => {
    if (res.data) {
      router.push({
        path: "/starting",
      });
    } else {
      showFailToast('You do not have permission')
    }
  });
};
onMounted(() => {
  getShopArr();
});
</script>
<style scoped></style>
