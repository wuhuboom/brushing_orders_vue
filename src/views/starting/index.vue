<template>
  <div class="bg-[#f5f5f5]">
    <!-- <HeaderTop></HeaderTop> -->
      <div class="w-full flex justify-between items-center bg-[#fff] px-[15px] py-[8px]">
        <img
          src="@/static/images/logo.png"
          class="w-[80px]"
          @click="jump"
          alt=""
        />
        <img
          src="@/static/images/me.png"
          class="w-[32px] h-[32px]"
          alt=""
          @click="toMy"
        />
      </div>
    <!-- <div class="w-full h-full py-5">
        <div class="flex justify-between mt-4 mb-4 items-center">
          <div class="flex">
            <div class="flex items-center pl-2">
              <div class="text-[#000]">
                <div class="text-xl">Hi, {{ userInfo.username }}</div>
                <div
                  class="text-[#000] text-sm text-inherits pt-2"
                >
                  Welcome back
                </div>
              </div>
            </div>
          </div>
          <div
            class="text-[#000] w-[62px] h-[36px] flex justify-center items-center bg-[rgba(255,255,255,0.2)] rounded-[20px]"
          >
            VIP{{ userInfo.levelId }}
          </div>
        </div>
    </div> -->
    <div class="flex justify-between mb-4 items-center w-[90%] mx-auto mt-5">
      <div class="flex">
        <img
          :src="userInfo.avatar==null?userImg:userInfo.avatar"
          class="w-[45px] h-[45px] rounded-full mr-3"
          alt=""
        />
        <div class="flex items-center">
          <div class="text-black font-semibold">Hi, {{ userInfo.username }}</div>
          <img src="../../static/images/welcome.png" class="w-5 ml-2" alt="">
        </div>

      </div>
      <div class="text-black font-semibold">VIP{{ userInfo.levelId }}</div>
    </div>

    <div class="w-full bg-[#f8f8f8] relative pt-[4px]">
      <div class="w-[100%] px-4 mx-auto">
        <div class="grid grid-cols-1 gap-3">
          <div
            class="w-full col-span-1 flex p-3 box-border rounded-xl bg-[#fff] border-[1px] border-[#EDEDEE]"
          >
            <div class="w-full flex justify-between">
              <div class="flex items-center">
                <img
                  class="w-10 h-10 mr-3"
                  src="@/static/images/icon-21.png"
                  alt=""
                />
                <div class="flex flex-col justify-around">
                  <div class="text-[#000] text-sm mb-1">
                    {{ $t("钱包余额") }}
                  </div>
                  <div class="text-[#999] text-[10px]">
                    {{ $t("佣金将在此处添加") }}
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-end text-right">
                <div class="text-sm text-[#ff9662] font-bold mb-1">
                  {{ userInfo.balance }}
                </div>
                <div class="text-[#999] text-xs">USD</div>
              </div>
            </div>
          </div>
          <div
            class="w-full col-span-1 flex p-3 box-border rounded-xl bg-[#fff] border-[1px] border-[#EDEDEE]"
          >
            <div class="w-full flex justify-between">
              <div class="flex items-center">
                <img
                  class="w-10 h-10 mr-3"
                  src="@/static/images/icon-22.png"
                  alt=""
                />
                <div class="flex flex-col justify-around">
                  <div class="text-[#000] text-sm mb-1">
                    {{ $t("持有金额") }}
                  </div>
                  <div class="text-[#999] text-[10px]">
                    {{ $t("如有疑问，请联系客服") }}
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-end text-right">
                <div class="text-sm text-[#ff9662] font-bold mb-1">
                  {{ userInfo.frozenBalance }}
                </div>
                <div class="text-[#999] text-xs">USD</div>
              </div>
            </div>
          </div>
          <div
            class="w-full col-span-1 flex p-3 box-border rounded-xl bg-[#fff] border-[1px] border-[#EDEDEE]"
          >
            <div class="w-full flex justify-between">
              <div class="flex items-center">
                <img
                  class="w-10 h-10 mr-3"
                  src="@/static/images/icon-22.png"
                  alt=""
                />
                <div class="flex flex-col justify-around">
                  <div class="text-[#000] text-sm mb-1">
                    {{ $t("当日佣金") }}
                  </div>
                  <div class="text-[#999] text-[10px]">
                    {{ $t("每日赚取佣金") }}
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-end text-right">
                <div class="text-sm text-[#ff9662] font-bold mb-1">
                  {{ userInfo.commission }}
                </div>
                <div class="text-[#999] text-xs">USD</div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5 flex justify-between text-black font-bold text-base">
          <div>Start Optimization</div>
          <div>
            <span class="text-[#ff9662]">{{
              userInfo.dealCount
            }}</span
            >/<span>{{ orderCount }}</span>
          </div>
        </div>
        <div class="mt-5 flex flex-col shadow p-4 box-border bg-white rounded-xl">
          <div class="mt-5 flex flex-col box-border  rounded-xl">
            <div class="w-full grid grid-cols-3 gap-6">
              <template v-for="(item, index) in totalCount" :key="index">
                <div
                  v-if="index === 4"
                  class="grid-span-1 text-center text-xs font-normal"
                  @click="handleClick"
                >
                  <div
                    class="flex items-center justify-center overflow-hidden rounded-xl bg-cover text-lg text-white font-medium relative"
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
                  class="grid-span-1 text-[#666666] text-center text-xs font-normal"
                >
                  <div
                    class="p-2 overflow-hidden"
                    style="
                      background-image: radial-gradient(circle at 100% 0%, rgb(247, 247, 247) 0%, rgb(252, 252, 252) 106%); border-radius: 8px;
                    "
                  >
                    <div class="rounded-xl overflow-hidden">
                      <img class="w-20 h-20 lg:w-[273px] lg:h-[273px] object-cover" :src="`${url}${getImageByIndex(index)}`" alt="">
                    </div>
                     <div class="text-xs whitespace-nowrap w-20 lg:w-[273px] mt-1 overflow-hidden text-ellipsis">{{getImageByIndexName(index)}}</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- <div
          class="mt-5 flex justify-center items-center text-black text-base h-[60px] bg-[#FACC15] rounded-[20px]"
          @click="handleClick"
        >
          Start
          <span class="pl-2">({{ userInfo.dealCount }}</span
          >/<span>{{ orderCount }})</span>
        </div> -->
      </div>
      <div class="w-[90%] mx-auto pt-5">
        <div class="w-[90%] h-10 rounded-xl mx-auto bg-[#E7E7E7]"></div>
        <div class="mt-[-1.5rem] flex flex-col shadow p-4 box-border relative rounded-xl bg-[#fff]">
          <!-- <div class="flex flex-col box-border relative rounded-[10px]"> -->
            <div class="mb-2 text-black text-base font-bold">Notice</div>
            <div class="text-black text-sm font-light">
              Online Support Hours 10:00 - 22:59 <br />
              Please contact online support for your assistance!
            </div>
          <!-- </div> -->
        </div>
      </div>
      <div class="mt-6 pb-4"></div>
    </div>
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
              :src="url + goods.coverUrl"
              class="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div class="flex flex-col h-[6rem] justify-between">
            <div class="flex flex-col">
              <div
                class="text-[#666] w-44 whitespace-nowrap overflow-hidden text-ellipsis text-sm font-semibold"
              >
                {{ goods.goodsName }}
              </div>
              <div class="text-[#666] text-sm mt-2 font-semibold">
                USD {{ goods.price }}
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
                goods.price
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
                goods.commission
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
                goods.createTime,
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
             {{ goods.orderNo }}
          </div>
        </div>
        <div class="w-full mt-4">
          <van-button color="#ff9662" round class="w-full" @click="submitForm">{{
            $t("提交")
          }}</van-button>
        </div>
      </div>
    </van-dialog>


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
const userImg = new URL("@/static/images/userImg.png", import.meta.url)
  .href;
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
} from "../../api/apis";
const url = window.g.VITE_API_IMG_URL;
const value = ref(5);
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
const jump = () => {
  router.replace('/')
  
}

const getImageByIndex = (i) => {
  if (i === 4) return null; // 第 5 项是“开始按钮”，不用图
  const realIndex = i < 5 ? i : i - 1;
  console.log(goodsList.value[realIndex]?.coverUrl);
  return goodsList.value[realIndex]?.coverUrl || "";
};
const getImageByIndexName = (i) => {
  if (i === 4) return null; // 第 5 项是“开始按钮”，不用图
  const realIndex = i < 5 ? i : i - 1;
  return goodsList.value[realIndex]?.name || "";
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

window.addEventListener('updateTrade', (e) => {
    userGetInfoMethods();
})
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
