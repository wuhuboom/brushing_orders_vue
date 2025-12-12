<template>
  <div class="bg-[#002d72]">
    <div class="h-[40px] bg-[#002d72]"></div>
    <div class="w-full bg-[#002d72] starting">
      <!-- <HeaderTop></HeaderTop> -->

      <div class="startBen h-[520px] mt-[33px] px-[20px]">
        <div class="flex justify-start text-[#FFFFFF]">
          <div>
            <!-- 接口还没返回 avatar 字段（请求中） -->
            <div
              v-if="userInfo.avatar === undefined"
              class="w-[48px] h-[48px] rounded-full ml-[5px] bg-gray-200 animate-pulse"
            ></div>

            <!-- 接口返回 null / 空字符串 → 直接显示默认头像（不会闪） -->
            <img
              v-else-if="!userInfo.avatar"
              :src="userImg"
              class="w-[48px] h-[48px] rounded-full ml-[5px] object-cover"
              alt=""
            />

            <!-- 接口返回头像 URL → 直接渲染用户头像；加载失败再回退到默认头像 -->
            <img
              v-else
              :src="userInfo.avatar"
              class="w-[48px] h-[48px] rounded-full ml-[5px] object-cover"
              alt=""
              @error="(e) => (e.target.src = userImg)"
            />
          </div>
          <div class="pl-[16px]">
            <div class="text-[16px] pb-[5px]">Hi, {{ userInfo.username }}</div>
            <div
              class="bg-[#E6EDF8] text-[#002D72] font-bold text-[14px] w-[46px] text-center rounded-[4px]"
            >
              {{ userLevel }}
            </div>
          </div>
        </div>
        <!-- 刷单 -->
        <div class="mt-[167px] flex justify-center text-[#fff]">
          <span>({{ userInfo.taskProgress }}</span
          >/<span>{{ orderCount }})</span>
        </div>
        <div class="flex flex-col px-6 py-5 box-border rounded-xl">
          <div class="flex flex-col box-border rounded-xl">
            <div
              class="w-full grid grid-cols-3 gap-x-px gap-y-1 justify-center"
            >
              <template v-for="(item, index) in totalCount" :key="index">
                <div
                  v-if="index === 4"
                  class="grid-span-1 text-center text-xs font-normal"
                  @click="handleClick"
                >
                  <div
                    class="flex items-center justify-center overflow-hidden rounded-xl bg-cover text-lg text-white font-medium relative w-[89px] h-[76px]"
                  >
                    <div class="overflow-hidden">
                      <img
                        src="@/static/images/start-button.png"
                        class="w-[100%] shadow"
                        alt=""
                      />
                      <div class="absolute"></div>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="grid-span-3 text-[#666666] text-center text-xs font-normal w-[89px] h-[76px]"
                >
                  <div
                    class="overflow-hidden w-[89px] h-[76px]"
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
                      <van-image
                        fit="fill"
                        :src="`${url}${getImageByIndex(index)}`"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-[#fff] p-[16px] rounded-[8px] mt-[16px] mx-[20px]">
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
            {{ userInfo.todayCommission }} USD
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
      </div>
      <div class="w-full bg-[#002d72] relative px-[20px]">
        <div class="mx-auto pt-[16px]">
          <div class="rounded-lg bg-[#fff]">
            <div class="flex flex-col p-4 box-border relative rounded-[10px]">
              <div class="mb-1 text-base text-[#000000] text-[16px]">
                {{ $t("start.notice.str") }}
              </div>
              <div class="text-[#4B5563] text-[14px]">
                {{ $t("start.notice.desc1.str") }}
                {{ TradeInfor?.tradeTimeRange?.[0] ?? "--:--" }} -
                {{ TradeInfor?.tradeTimeRange?.[1] ?? "--:--" }} <br />
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
        v-model:show="showCenter"
        closeable
        :title="''"
        :style="{ width: '80%', background: '#002d72' }"
        :show-confirm-button="false"
      >
        <div class="w-[60px] h-[125px] mx-auto mt-[24px]" style="width: 60px">
          <img :src="url + goods.productImage" alt="" />
        </div>
        <div
          class="w-full mt-[-3rem] pt-[23px] text-[#fff]"
          style="border-top: 1px solid #33578e"
        >
          <div class="w-[100%] mx-auto text-[18px] font-semibold p-[20px]">
            {{ goods.productTitle }}
          </div>
          <div
            class="flex justify-start p-[20px]"
            style="
              border-top: 1px solid #33578e;
              border-bottom: 1px solid #33578e;
            "
          >
            <img
              class="w-[24px] h-[24px]"
              src="@/static/images/price.png"
              alt=""
            />
            <div class="pl-[12px] w-[100%]">
              <div class="flex justify-between w-[100%] text-[16px] pb-[8px]">
                <div class="text-[#D1D5DB]">{{ $t("总金额") }}</div>
                <div class="text-[#fff] font-bold">
                  {{ goods.amount }}{{ $t("美元") }}
                </div>
              </div>
              <div class="flex justify-between w-[100%] text-[16px]">
                <div class="text-[#D1D5DB]">{{ $t("佣金") }}</div>
                <div class="text-[#FF9500] font-bold">
                  {{ goods.rebate }}{{ $t("美元") }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex justify-start p-[20px]"
            style="border-bottom: 1px solid #33578e"
          >
            <img
              class="w-[24px] h-[24px]"
              src="@/static/images/price.png"
              alt=""
            />
            <div class="pl-[12px] w-[100%]">
              <div class="flex justify-between w-[100%] text-[16px] pb-[8px]">
                <div class="text-[#D1D5DB]">{{ $t("创建时间") }}</div>
                <div class="text-[#fff] font-bold text-[14px]">
                  {{
                    formatWithTimezone(
                      goods.createTime,
                      userStore.zoneActive.tzName
                    )
                  }}
                </div>
              </div>
              <div class="flex justify-between w-[100%] text-[16px]">
                <div class="text-[#D1D5DB]">{{ $t("编号") }}</div>
                <div class="text-[#fff] text-[14px]">
                  {{ goods.orderNumber }}
                </div>
              </div>
            </div>
          </div>

          <div class="w-[90%] mx-auto mt-4 pb-[20px]">
            <van-button
              color="#FF9500"
              class="w-full"
              @click.prevent="submitForm"
              >{{ $t("提交") }}</van-button
            >
          </div>
        </div>
      </van-dialog>
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
        <van-button color="#ff497c" round class="w-full" @click="closeImg"
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
import { onMounted, ref, onUnmounted } from "vue";
import HeaderTop from "@/components/HeaderTop.vue";
import Footer from "@/components/Footer.vue";
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
  getGoodsList,
  createOrder,
  submitOrder,
  getTradeConfig,
} from "../../api/apis";
const url = window.g.VITE_API_IMG_URL;
const userStore = useUserStore();
import { formatWithTimezone } from "../../util/utils";
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
const showImg = ref(false);
const goods = ref({});
const totalCount = ref(0); // 插入一个“开始按钮”
const getList = async () => {
  // let res = await getGoodsList();
  // goodsList.value = res.data;
  try {
    const res = await getGoodsList();
    goodsList.value = res.data;
    totalCount.value = goodsList.value.length + 1; // 插入一个“开始按钮”
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
  console.log(goodsList.value[realIndex]?.image);
  return goodsList.value[realIndex]?.image || "";
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
      closeToast();
      if (err.code == 2000) {
         showImg.value = true;
        // 2. 延时 2 秒后关闭图片，并继续创建订单
        setTimeout(() => {
          showImg.value = false;
        }, 2000);
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
  // 清除定时器，防止组件卸载后还在请求
  if (timer) clearTimeout(timer);
});

const userLevel = ref({});
const userGetInfoMethods = () => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    avatarUrl.value = `${url}${res.data.memberLevel.icon}`;
    orderCount.value = res.data.memberLevel.orderCountPerDay;
    userLevel.value = res.data.memberLevel.name;
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
.starting {
  width: 100%;
  height: 100vh; /* 高度可以根据需求设置 */
  background-image: url("@/static/images/startBg.png");
  background-repeat: no-repeat; /* 不平铺 */
  background-position: center center; /* 图片居中 */
  background-size: 100% 100%; /* 使用原始大小展示 */
}
.startBen {
  width: 100%;
  background-image: url(@/static/images/start.png);
  background-size: 100% 100%;
}
</style>
