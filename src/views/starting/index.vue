<template>
  <div class="startBg">
    <div class="flex items-center relative ">
      <!-- 左侧箭头 -->
      <!-- <div class="absolute left-3" @click="toLogin">
        <van-icon name="arrow-left" color="#fff" size="24px" />
      </div> -->
      <!-- 中间标题 -->
      <div class="mx-auto text-white text-[22px] py-[24px] ">{{$t('开始')}}</div>
    </div>
    <div class="w-full px-[20px]">
      <div class="bg-[#fff] rounded-[20px] overflow-hidden mt-[20px]">
        <div class="flex bg-[#6B4D51] h-[36px] items-center">
          <div class="flex-1 text-center text-[#fff]">{{$t('任务总计')}}</div>
          <div class="flex-1 text-center text-[#fff]">{{$t('任务完成')}}</div>
        </div>
        <div class="flex h-[36px] items-center font-bold border-b border-[#E6E6E6] ">
          <div class="flex-1 text-center text-[#000] ">{{ orderCount }}</div>
          <div class="flex-1 text-center text-[#000]">{{ userInfo.dealCount }}</div>
        </div>
        <div class="flex h-[36px] items-center px-[20px] border-b border-[#E6E6E6]">
          <div class="flex-1 text-[#6B4D51] ">{{ $t("钱包余额") }}</div>
          <div class="flex-1 text-right text-[#6B4D51]">{{ userInfo.balance }} USD</div>
        </div>
        <div class="flex h-[36px] items-center px-[20px] border-b border-[#E6E6E6]">
          <div class="flex-1  text-[#6B4D51] ">{{ $t("当日佣金") }}</div>
          <div class="flex-1  text-right text-[#000]">{{ userInfo.commission }} USD</div>
        </div>
        <div class="flex h-[36px] items-center px-[20px]">
          <div class="flex-1  text-[#6B4D51] ">{{ $t("持有金额") }}</div>
          <div class="flex-1  text-right text-[#6B4D51]">{{ userInfo.frozenBalance }} USD</div>
        </div>
      </div>
      <div class="startBen h-[315px] mt-[20px] px-[10px]">
        <div class="flex flex-col px-5 py-5 box-border rounded-xl">
          <div class="flex flex-col box-border rounded-xl">
            <div
              class="w-full grid grid-cols-3 gap-x-px gap-y-1 justify-center"
            >
              <template v-for="(item, index) in goodsList" :key="index">
                <div
                  class="grid-span-3 text-[#666666] text-center text-xs font-normal w-[92px] h-[86px]"
                >
                  <div
                    class="overflow-hidden w-[92px] h-[86px]"
                    style="
                      background-image: radial-gradient(
                        circle at 100% 0%,
                        #3f3d9d 0%,
                        #6763d3 106%
                      );
                      border-radius: 8px;
                      box-sizing: border-box;
                    "
                  >
                    <div class="overflow-hidden">
                      <!-- <img
                        :src="`${url}${getImageByIndex(index)}`"
                        class="w-[100px] h-[100px] lg:w-[296px] lg:h-[296px]"
                        alt=""
                      /> -->
                      <!-- <van-image
                        fit="fill"
                        :src="`${url}${getImageByIndex(index)}`"
                      /> -->
                      <img
                        :src="`${url}${item.coverUrl}`"
                        class="w-[103px] h-[103px]"
                        style="border-radius: 8px"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div
          class="mt-5 flex justify-center items-center text-[#fff] text-base h-[49px] bg-[linear-gradient(102deg,#90474B_0%,#694D51_100%)] rounded-[20px]"
          @click="handleClick"
        >
         <img class="w-[24px] h-[24px] mr-[15px]" src="../../static/images/start1.png" alt="">
          {{$t('开始')}}
          
        </div>
      <!-- <div class="bg-[#fff] p-[16px] rounded-[8px] mt-[16px] mx-[20px]">
        <div class="text-[#4B5563] text-[12px] pb-[4px]">
          {{ $t("钱包余额") }}
        </div>
        <div class="flex justify-between">
          <div class="text-[#000000] text-[16px] font-bold">
            {{ userInfo.balance }} USD
          </div>
          <div class="text-[#6B7280] text-[12px]">
            {{ $t("佣金将在此处添加") }}
          </div>
        </div>
      </div>
      <div class="bg-[#fff] p-[16px] rounded-[8px] mt-[16px] mx-[20px]">
        <div class="text-[#4B5563] text-[12px] pb-[4px]">
          {{ $t("当日佣金") }}
        </div>
        <div class="flex justify-between">
          <div class="text-[#000000] text-[16px] font-bold">
            {{ userInfo.commission }} USD
          </div>
          <div class="text-[#6B7280] text-[12px]">
            {{ $t("每日赚取佣金") }}
          </div>
        </div>
      </div>
      <div class="bg-[#fff] p-[16px] rounded-[8px] mt-[16px] mx-[20px]">
        <div class="text-[#4B5563] text-[12px] pb-[4px]">
          {{ $t("持有金额") }}
        </div>
        <div class="flex justify-between">
          <div class="text-[#000000] text-[16px] font-bold">
            {{ userInfo.frozenBalance }} USD
          </div>
          <div class="text-[#6B7280] text-[12px]">
            {{ $t("如有疑问，请联系客服") }}
          </div>
        </div>
      </div> -->
      <div class="w-full relative">
        <div class="mx-auto pt-[16px]">
          <div class="">
            <div class="flex flex-col p-4 box-border relative rounded-[10px]">
              <div class="mb-1 text-base text-[#fff] text-[16px]">
                {{ $t("start.notice.str") }}
              </div>
              <div class="text-[#fff] text-[14px]">
                {{ $t("start.notice.desc1.str") }}
                {{ TradeInfor?.workTimeStart || "--:--" }} -
                {{ TradeInfor?.workTimeEnd || "--:--" }} <br />
                {{ $t("start.notice.desc2.str") }}
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6 pb-4"></div>
      </div>

      <!-- <div
      class="w-full grid grid-cols-2 rounded-xl gap-4 p-2 border-[3px] border-[#f1894c] shadow-sm"
    >
      <div
        class="col-span-2 pb-2 border-b-[1px] border-dashed border-[#888] flex flex-col text-center"
      >
        <img
          src="@/static/images/icon-25.png"
          class="w-10 h-10 mx-auto"
          alt=""
        />
        <div class="text-sm mt-4 text-[#00bea3]">{{ $t("当日佣金") }}</div>
        <div class="text-xl font-semibold text-black my-1">
          {{ userInfo.commission }} USD
        </div>
        <div class="text-sm text-[#black]">{{ $t("每日赚取佣金") }}</div>
      </div>
      <div class="col-span-1 flex flex-col text-cente px-3 rounded-xl">
        <div class="w-full">
          <img
            src="@/static/images/icon-26.png"
            class="w-10 h-10 mx-auto"
            alt=""
          />
          <div class="w-full text-base text-center font-bold mt-1 text-[#000]">
            {{ $t("钱包余额") }}
          </div>
          <div class="text-base text-center font-semibold text-black my-1">
            {{ userInfo.balance }} USD
          </div>
          <div class="text-sm text-[#000] text-center">
            {{ $t("佣金将在此处添加") }}
          </div>
        </div>
      </div>
      <div class="col-span-1 flex flex-col text-cente px-3 rounded-xl">
        <div class="w-full">
          <img
            src="@/static/images/icon-27.png"
            class="w-10 h-10 mx-auto"
            alt=""
          />
          <div class="w-full text-base text-center font-bold mt-1 text-[#000]">
            {{ $t("持有金额") }}
          </div>
          <div class="text-base text-center font-semibold text-black my-1">
            {{ userInfo.frozenBalance }} USD
          </div>
          <div class="text-sm text-[#000] text-center">
            {{ $t("如有疑问，请联系客服") }}
          </div>
        </div>
      </div>
    </div> -->

      <Footer name="/starting"></Footer>
      <!-- <van-popup
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
      </van-popup> -->
      <van-dialog
        v-model:show="showProcessing"
        class="order-dialog processing-dialog"
        :show-confirm-button="false"
        :close-on-click-overlay="false"
        :close-on-popstate="false"
        :aria-label="$t('start.processing.title')"
      >
        <div class="processing-content">
          <h2 class="processing-title">
            <span class="processing-dot" aria-hidden="true"></span>
            {{ $t('start.processing.title') }}
          </h2>
          <div class="processing-progress-label">
            <span>{{ $t('start.processing.progress') }}</span>
            <strong>{{ processingProgress }}%</strong>
          </div>
          <div
            class="processing-progress"
            role="progressbar"
            :aria-label="$t('start.processing.progress')"
            :aria-valuenow="processingProgress"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div class="processing-progress-fill" :style="{ width: `${processingProgress}%` }"></div>
          </div>
          <ol class="processing-steps">
            <li
              v-for="(step, index) in processingSteps"
              :key="step.label"
              class="processing-step"
              :class="{ 'is-active': processingStep === index }"
              :aria-current="processingStep === index ? 'step' : undefined"
            >
              <span class="processing-step-icon" aria-hidden="true">{{ step.icon }}</span>
              <span>{{ $t(step.label) }}</span>
            </li>
          </ol>
        </div>
      </van-dialog>
      <MatchedOrderDialog
        v-model:show="showCenter"
        :order="goods"
        @submit="submitForm"
      />
      <van-popup
        v-model:show="showImg"
        round
        :style="{ width: '80%', background: 'transparent' }"
      >
        <img
          @click="closeImg"
          class="w-[100%] mb-5"
          src="../../static/images/super.png"
          alt=""
        />
        <van-button color="rgb(10, 77, 162)" round class="w-full" @click="closeImg"
          >OK</van-button
        >
        <!-- <img
        @click="closeImg"
        class="w-[30px] h-[30px] m-auto"
        src="../../static/images/cloed.png"
        alt=""
      /> -->
      </van-popup>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, onUnmounted } from "vue";
import HeaderTop from "@/components/HeaderTop.vue";
import Footer from "@/components/Footer.vue";
import MatchedOrderDialog from "@/components/MatchedOrderDialog.vue";
import {
  showFailToast,
  showSuccessToast,
  showToast,
} from "vant";
import { useI18n } from "vue-i18n";
import {
  userGetInfo,
  getGoodsList,
  getGoodsListTwo,
  createOrder,
  submitOrder,
  getTradeConfig,
} from "../../api/apis";
const url = window.g.VITE_API_IMG_URL;
const userStore = useUserStore();
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
import { errorMessages } from "../../api/errorCodeMap";
const userImg = new URL("@/static/images/userImg.png", import.meta.url).href;
const router = useRouter();
const { t } = useI18n();
const userInfo = ref({});
const avatarUrl = ref("");

let timer = null;
const goodsList = ref([]);
const showCenter = ref(false);
const showProcessing = ref(false);
const processingProgress = ref(0);
const processingStep = computed(() => Math.min(Math.floor(processingProgress.value / 20), 4));
const processingSteps = [
  { icon: "⚡", label: "start.processing.initiating" },
  { icon: "🔍", label: "start.processing.marketplaces" },
  { icon: "🏪", label: "start.processing.businesses" },
  { icon: "📦", label: "start.processing.found" },
  { icon: "✅", label: "start.processing.success" },
];
let processingTimer = null;
let processingFinishTimer = null;
let orderReady = false;
let isUnmounted = false;

const stopProcessing = () => {
  clearInterval(processingTimer);
  clearTimeout(processingFinishTimer);
  processingTimer = null;
  processingFinishTimer = null;
  showProcessing.value = false;
};
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

const toLogin = () =>{
  router.replace({ path: "/projectspage" });
}

const getImageByIndex = (i) => {
  if (i === 4) return null; // 第 5 项是“开始按钮”，不用图
  const realIndex = i < 5 ? i : i - 1;
  console.log(goodsList.value[realIndex]?.coverUrl);
  return goodsList.value[realIndex]?.coverUrl || "";
};

// 抢单
const handleClick = () => {
  // if (
  //   userInfo.value.cardNumber == userInfo.value.dealCount &&
  //   userInfo.value.dealCount != 0
  // ) {
  //   showImg.value = true;
  //   // 2. 延时 2 秒后关闭图片，并继续创建订单
  //   // setTimeout(() => {
  //   //   showImg.value = false;
  //   //   doCreateOrder();
  //   // }, 2000);

  //   return;
  // }
  // 不满足条件时，直接创建订单
  doCreateOrder();
};

const closeImg = () => {
  showImg.value = false;
};

const doCreateOrder = () => {
  if (showProcessing.value || showCenter.value) return;
  processingProgress.value = 0;
  orderReady = false;
  showProcessing.value = true;
  processingTimer = setInterval(() => {
    // 接口成功前停留在搜索阶段，不能提前显示找到订单或匹配成功。
    const limit = orderReady ? 100 : 59;
    processingProgress.value = Math.min(processingProgress.value + 1, limit);
    if (processingProgress.value === 100) {
      clearInterval(processingTimer);
      processingTimer = null;
      processingFinishTimer = setTimeout(() => {
        stopProcessing();
        showCenter.value = true;
      }, 350);
    }
  }, 30);

  createOrder()
    .catch((err) => {
      // 907 已返回待处理订单，继续使用这笔订单完成动画和展示。
      if (err.code == 907 && err.data?.id != null) {
        return { data: err.data };
      }
      throw err;
    })
    .then((res) => {
      if (isUnmounted) return;
      goods.value = res.data;
      orderReady = true;
      userGetInfoMethods();
    })
    .catch((err) => {
      if (isUnmounted) return;
      stopProcessing();
      if (err.code == 2000) {
         showImg.value = true;
        // 2. 延时 2 秒后关闭图片，并继续创建订单
        setTimeout(() => {
          showImg.value = false;
        }, 2000);
      }else if(err.code == 909){
        showToast( `User has filled in ${err.data} pieces of data. please contact Customer Service to apply for resetting account`);
      } else {
        showToast(t(errorMessages[err.code]));
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
const TradeInfor = ref({});
const tradeConfig = async () => {
  let res = await getTradeConfig();
  TradeInfor.value = res.data;
};

onUnmounted(() => {
  isUnmounted = true;
  stopProcessing();
  // 清除定时器，防止组件卸载后还在请求
  if (timer) clearTimeout(timer);
});

const userLevel = ref('')
const userGetInfoMethods = () => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    avatarUrl.value = `${url}${res.data.userLevel.icon}`;
    orderCount.value = res.data.userLevel.orderCount;
    userLevel.value = res.data.userLevel.nameEn
  });
};

const orderCount = ref(0);
onMounted(() => {
  getList();
  userGetInfoMethods();
  tradeConfig();
});
</script>
<style scoped>
.startBg {
  width: 100%;
  height: 100%; /* 高度可以根据需求设置 */
  background-image: url("@/static/images/startBg.png");
  background-repeat: no-repeat; /* 不平铺 */
  background-position: center center; /* 图片居中 */
  background-size: 100% 100%; /* 使用原始大小展示 */
}
.startBen {
  width: 100%;
  background-image: url(@/static/images/start.png);
  background-size: 100% 100%;
  /* margin: 0 20px 0 20px; */
}
:deep(.order-dialog) {
  top: 50%;
  width: calc(100% - 32px);
  max-width: 420px;
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  border: 1px solid #eedddd;
  border-radius: 32px;
  background: #fff;
  color: #2f1d1d;
  font-family: Arial, "PingFang SC", sans-serif;
  box-shadow: 0 20px 48px rgba(75, 18, 18, 0.24);
}
.processing-content {
  padding: 30px 22px 28px;
}
.processing-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.7px;
}
.processing-dot {
  flex: 0 0 11px;
  height: 11px;
  border-radius: 50%;
  background: #bf494d;
}
.processing-progress-label {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 24px 3px 8px;
  color: #866565;
  font-size: 15px;
  line-height: 1.4;
}
.processing-progress-label strong {
  color: #c44b50;
  font-weight: 600;
}
.processing-progress {
  height: 8px;
  margin: 0 2px;
  overflow: hidden;
  border-radius: 20px;
  background: #f0e4e4;
}
.processing-progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #e16b6e, #bb4549);
  transition: width 30ms linear;
}
.processing-steps {
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}
.processing-step {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 12px 10px;
  border: 1px solid #eddfdf;
  border-radius: 14px;
  background: #fbf8f8;
  color: #594949;
  font-size: 16px;
  line-height: 1.35;
  transition: background-color 180ms, border-color 180ms, box-shadow 180ms, color 180ms;
}
.processing-step.is-active {
  border-color: #f2979c;
  background: #fff2f3;
  color: #aa3035;
  box-shadow: 0 6px 15px rgba(186, 68, 73, 0.12);
  font-weight: 600;
}
.processing-step-icon {
  flex-shrink: 0;
  font-size: 18px;
}
@media (max-width: 374px) {
  .processing-content {
    padding-right: 16px;
    padding-left: 16px;
  }
  .processing-title {
    font-size: 21px;
  }
  .processing-step {
    font-size: 14px;
  }
}
</style>
