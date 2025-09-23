<template>
  <div style="min-height: 100vh;" class="bg-[#151514]">
    <!-- <HeaderTop></HeaderTop> -->
    <div class="flex items-center relative  bg-[#000] ">
      <!-- 左侧箭头 -->
      <!-- <div class="absolute left-3" @click="toLogin">
        <van-icon name="arrow-left" color="#fff" size="24px" />
      </div> -->
      <!-- 中间标题 -->
      <div class="mx-auto text-white text-[22px] py-[24px] ">Starting</div>
    </div>
    <div class="bg-[#151514] px-[16px]">
      <div class="w-full mx-auto rounded-b-[20px]">
      <div class="w-full h-full py-5">
        <div class="flex justify-between mt-4 mb-4 items-center">
          <div class="flex">
            <div class="flex items-center pl-2">
              <img
                :src="userInfo.avatar == null ? userImg : userInfo.avatar"
                class="w-[65px] h-[65px] mr-[8px]"
                alt=""
              />
              <div class="text-[#fff]">
                <div class="text-[14px]">Hi, {{ userInfo.username }}</div>
                <div class="flex justify-start items-center mt-[15px]">
                  <div
                    class="text-[#000] text-[12px] w-[40px] h-[20px] flex justify-center items-center bg-[#FACC15] rounded-[2] mr-[10px]"
                  >
                    VIP{{ userInfo.levelId }}
                  </div>
                  <span>Welcome back</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-full bg-[#1F1F1F] relative pt-[20px] pb-[21px] px-[7px] rounded-[8px]"
    >
      <div class="max-w-4xl mx-auto flex justify-between text-gray-400">
        <!-- Wallet Balance -->
        <div class="flex-1">
          <p class="text-[12px] text-[#B2B2B2]">Wallet Balance</p>
          <p class="text-[20px] text-[#CEB04E] mt-1">{{ userInfo.balance }}</p>
        </div>

        <!-- 分隔线 -->
        <div class="w-px bg-gray-600 mx-4"></div>

        <!-- Hold Amount -->
        <div class="flex-1">
          <p class="text-[12px] text-[#B2B2B2]">Hold Amount</p>
          <p class="text-[20px] text-[#CEB04E] mt-1">
            {{ userInfo.frozenBalance }}
          </p>
        </div>

        <!-- 分隔线 -->
        <div class="w-px bg-gray-600 mx-4"></div>

        <!-- Commission -->
        <div class="flex-1">
          <p class="text-[12px] text-[#B2B2B2]">Commission</p>
          <p class="text-[20px] text-[#CEB04E] mt-1">
            {{ userInfo.commission }}
          </p>
        </div>
      </div>
    </div>
    <div class="w-full bg-[#151514] relative">
      <div class="w-[100%] mx-auto">
        <div
          style="border: 1px solid #ceb04e"
          class="mt-5 flex flex-col box-border rounded-xl"
        >
          <div class="w-full grid grid-cols-3">
            <template v-for="(item, index) in goodsList" :key="index">
              <div
                class="m-[7px] w-[103px] h-[103px]"
                style="border: 1px dashed #5a5a5a"
              >
                <img
                  :src="`${url}${item.coverUrl}`"
                  class="w-[103px] h-[103px]"
                  style="border-radius: 8px"
                  alt=""
                />
              </div>
            </template>
          </div>
        </div>

        <div
          class="mt-5 flex justify-center items-center text-[#fff] text-base h-[60px] bg-[#F09F39] rounded-[20px]"
          @click="handleClick"
        >
          Start
          <span class="pl-2">({{ userInfo.dealCount }}</span
          >/<span>{{ orderCount }})</span>
        </div>
      </div>
      <div class="mx-auto">
        <div class="mt-4 rounded-lg">
          <div class="flex flex-col p-4 box-border relative rounded-[10px]">
            <div class="mb-1 text-base" style="color: #f77115">Notice:</div>
            <div class="text-[#A5A5A5] text-[12px]">
              Online Support Hours 10:00 - 22:59 <br />
              Please contact online support for your assistance!
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 pb-4"></div>
    </div>
    </div>
    <Footer name="/starting"></Footer>
    <van-popup
      v-model:show="showCenter"
      round
      closeable
      :style="{ width: '80%' }"
    >
      <div class="w-[5rem] mx-auto mt-6">
        <van-image
          width="6rem"
          height="6rem"
          fit="contain"
          :src="url + goods.coverUrl"
        />
      </div>
      <div class="w-full mt-[-3rem] pt-[4rem] text-[#000] p-4 rounded-lg">
        <div class="w-[100%] mx-auto text-center text-sm font-semibold">
          {{ goods.goodsName }}
        </div>
        <div class="flex w-full items-center pt-4 pb-4 mt-4">
          <div
            class="w-[50%] mr-2 flex flex-col py-4 bg-[#d8d8d8] justify-center items-center"
          >
            <div class="text-[#000] font-semibold">{{ $t("价格") }}</div>
            <div class="text-xs text-[#000] mt-1">
              <span class="text-sm mr-1 text-[#000] font-semibold">{{
                goods.price
              }}</span>
              USD
            </div>
          </div>
          <div
            class="w-[50%] mr-2 flex flex-col py-4 bg-[#d8d8d8] justify-center items-center"
          >
            <div class="text-[#000] font-semibold">{{ $t("佣金") }}</div>
            <div class="text-xs text-[#000] mt-1">
              <span class="text-sm mr-1 text-[#000] font-semibold">{{
                goods.commission
              }}</span>
              USD
            </div>
          </div>
        </div>
        <div class="bg-[#d8d8d8] p-4">
          <div class="flex justify-between items-center box-border">
            <div class="text-[#000] text-sm">{{ $t("创建时间") }}</div>
            <div class="text-[#000] text-sm font-bold">
              {{
                formatWithTimezone(
                  goods.createTime,
                  userStore.zoneActive.tzName
                )
              }}
            </div>
          </div>
          <div class="flex justify-between items-center box-border mt-2">
            <div class="whitespace-nowrap text-[#000] text-sm">
              {{ $t("编号") }}
            </div>
            <div class="text-[#000] text-xs font-bold">
              {{ goods.orderNo }}
            </div>
          </div>
        </div>
        <div class="w-full mt-4">
          <van-button color="#007513" class="w-full" @click="submitForm">{{
            $t("提交")
          }}</van-button>
        </div>
      </div>
    </van-popup>
    <van-popup
      v-model:show="showImg"
      closeable
      round
      :style="{ width: '80%', background: 'transparent' }"
    >
      <img class="w-[100%]" src="../../static/images/super.png" alt="" />
    </van-popup>
  </div>
</template>
<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import HeaderTop from "@/components/HeaderTop.vue";
import Footer from "@/components/Footer.vue";
const userImg = new URL("@/static/images/userImg.png", import.meta.url).href;
import {
  showLoadingToast,
  closeToast,
  showFailToast,
  showSuccessToast,
  showToast,
} from "vant";
import { useI18n } from "vue-i18n";
import {
  userGetInfo,
  getGoodsListTwo,
  createOrder,
  submitOrder,
} from "../../api/apis";
const url = window.g.VITE_API_IMG_URL;
const userStore = useUserStore();
import { formatWithTimezone } from "../../util/utils";
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
import { errorMessages } from "../../api/errorCodeMap";
const router = useRouter();
const { t } = useI18n();
const userInfo = ref({});
const avatarUrl = ref("");

let timer = null;
const goodsList = ref([]);
const showCenter = ref(false);
const showImg = ref(false);
const goods = ref({});
const totalCount = ref(0); // 插入一个“开始按钮”
const getList = async () => {
  // let res = await getGoodsList();
  // goodsList.value = res.data;
  try {
    const res = await getGoodsListTwo();
    goodsList.value = res.data;
    // totalCount.value = goodsList.value.length + 1; // 插入一个“开始按钮”
  } catch (e) {
    console.error("获取商品列表失败:", e);
  } finally {
    // 每次请求完成后再等 10 秒再发下一次，避免堆积
    timer = setTimeout(getList, 10000);
  }
};

const getImageByIndex = (i) => {
  if (i === 4) return null; // 第 5 项是“开始按钮”，不用图
  const realIndex = i < 5 ? i : i - 1;
  console.log(goodsList.value[realIndex]?.coverUrl);
  return goodsList.value[realIndex]?.coverUrl || "";
};

// 抢单
const handleClick = () => {
  if (
    userInfo.value.cardNumber == userInfo.value.dealCount &&
    userInfo.value.dealCount != 0
  ) {
    showImg.value = true;
    // 2. 延时 2 秒后关闭图片，并继续创建订单
    // setTimeout(() => {
    //   showImg.value = false;
    //   doCreateOrder();
    // }, 2000);

    return;
  }
  // 不满足条件时，直接创建订单
  doCreateOrder();
};

const doCreateOrder = () => {
  showLoadingToast({
    message: t("创建中..."),
    forbidClick: true,
    duration: 0,
  });

  createOrder()
    .then((res) => {
      closeToast();
      showToast(t("创建成功"));
      showCenter.value = true;
      userGetInfoMethods();
      goods.value = res.data;
    })
    .catch((err) => {
      console.log(errorMessages[err.code]);
      closeToast();
      if (err.code == 906) {
        showToast("Transaction failed");
      } else {
        showToast(t(errorMessages[err.code] || "创建失败"));
      }
    });
};

const submitForm = () => {
  submitOrder(goods.value.id)
    .then((res) => {
      showSuccessToast(t("提交成功"));
      userGetInfoMethods();
      if (res.code == 201) {
        goods.value = res.data;
      } else {
        showCenter.value = false;
      }
    })
    .catch((err) => {
      if (err.code == 916) {
        router.push("/deposit");
      }
      if (err.code == 906) {
        if (userInfo.value.balance <= 0) {
          showToast("Transaction failed");
        } else {
          showToast(t(errorMessages[err.code] || "Failed to create"));
        }
      } else {
        showToast(t(errorMessages[err.code] || "Failed to create"));
      }
    });
};
const toMy = () => {
  router.push({ path: "/my" });
};

onUnmounted(() => {
  // 清除定时器，防止组件卸载后还在请求
  if (timer) clearTimeout(timer);
});

const userGetInfoMethods = () => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    avatarUrl.value = `${url}${res.data.userLevel.icon}`;
    orderCount.value = res.data.userLevel.orderCount;
  });
};

const orderCount = ref(0);
onMounted(() => {
  getList();
  userGetInfoMethods();
});
</script>
