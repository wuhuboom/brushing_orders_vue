<template>
  <div>
    <HeaderTop></HeaderTop>
    <div class="w-full bg-[#f8f8f8] relative">
      <div class="w-full h-full py-5">
        <div
          class="flex w-[90%] mx-auto justify-between mt-4 mb-4 items-center"
        >
          <div class="flex">
            <img
              style="width: 50px; height: 50px; border-radius: 50%"
              src="@/static/images/user2.png"
              alt=""
            />
            <div class="flex items-center pl-2">
              <div class="text-black font-semibold">
                Hi, {{ userInfo.username }}
              </div>
            </div>
          </div>
          <div class="text-black font-semibold">VIP{{ userInfo.levelId }}</div>
        </div>
      </div>
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
                  <div class="text-[#000] text-sm font-bold mb-1">
                    {{ $t("钱包余额") }}
                  </div>
                  <div class="text-[#999] text-[10px]">
                    {{ $t("佣金将在此处添加") }}
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-end text-right">
                <div class="text-sm text-[var(--main-color)] font-bold mb-1">
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
                  <div class="text-[#000] text-sm font-bold mb-1">
                    {{ $t("持有金额") }}
                  </div>
                  <div class="text-[#999] text-[10px]">
                    {{ $t("如有疑问，请联系客服") }}
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-end text-right">
                <div class="text-sm text-[var(--main-color)] font-bold mb-1">
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
                  src="@/static/images/icon-20.png"
                  alt=""
                />
                <div class="flex flex-col justify-around">
                  <div class="text-[#000] text-sm font-bold mb-1">
                    {{ $t("当日佣金") }}
                  </div>
                  <div class="text-[#999] text-[10px]">
                    {{ $t("每日赚取佣金") }}
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-end text-right">
                <div class="text-sm text-[var(--main-color)] font-bold mb-1">
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
            <span class="text-[var(--main-color)]">{{ userInfo.dealCount }}</span>/<span>{{orderCount}}</span>
          </div>
        </div>
        <div class="mt-5 flex flex-col p-4 box-border bg-[#f1f1f1] rounded-xl">
          <div class="mt-5 flex flex-col box-border bg-[#f1f1f1] rounded-xl">
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
                      background-image: radial-gradient(
                        circle at 100% 0%,
                        rgb(247, 247, 247) 0%,
                        rgb(252, 252, 252) 106%
                      );
                      border-radius: 8px;
                    "
                  >
                    <div class="overflow-hidden">
                      <!-- <img
                        :src="`${url}${getImageByIndex(index)}`"
                        class="w-[100px] h-[100px] lg:w-[296px] lg:h-[296px]"
                        alt=""
                      /> -->
                      <van-image
                        fit="contain"
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
      <div class="w-[90%] mx-auto pt-5">
        <div class="mt-4 rounded-lg bg-[#f5f5f5]">
          <div class="flex flex-col p-4 box-border relative rounded-xl">
            <div class="mb-2  text-base font-bold" style="color: black;">Notice</div>
            <div class="text-black text-sm ">
              Online Support Hours 10:00 - 22:59 <br />
              Please contact online support for your assistance!
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 pb-4"></div>
    </div>
    <Footer name="/starting"></Footer>
    <van-popup
      v-model:show="showCenter"
      round
      closeable
      :style="{ width:'80%' }"
    >
      <div class="w-[5rem] mx-auto mt-6">
        <van-image
          width="6rem"
          height="6rem"
          fit="contain"
          :src="url+goods.coverUrl"
        />
      </div>
      <div class="w-full mt-[-3rem] pt-[4rem] text-[#000] p-4 rounded-lg">
        <div class="w-[100%] mx-auto text-center text-sm font-semibold">
          {{goods.goodsName}}
        </div>
        <div class="flex w-full items-center pt-4 pb-4 mt-4">
          <div
            class="w-[50%] mr-2 flex flex-col py-4 bg-[#d8d8d8] justify-center items-center"
          >
            <div class="text-[#000] font-semibold">{{$t('价格')}}</div>
            <div class="text-xs text-[#000] mt-1">
              <span class="text-sm mr-1 text-[#000] font-semibold">{{goods.price}}</span>
              USD
            </div>
          </div>
          <div
            class="w-[50%] mr-2 flex flex-col py-4 bg-[#d8d8d8] justify-center items-center"
          >
            <div class="text-[#000] font-semibold">{{ $t('佣金') }}</div>
            <div class="text-xs text-[#000] mt-1">
              <span class="text-sm mr-1 text-[#000] font-semibold">{{goods.commission}}</span>
              USD
            </div>
          </div>
        </div>
        <div class="bg-[#d8d8d8] p-4">
          <div class="flex justify-between items-center box-border">
            <div class="text-[#000] text-sm">{{$t('创建时间')}}</div>
            <div class="text-[#000] text-sm font-bold">{{ formatWithTimezone(goods.createTime,userStore.zoneActive.tzName)  }}</div>
          </div>
          <div class="flex justify-between items-center box-border mt-2">
            <div class="whitespace-nowrap text-[#000] text-sm">
              {{$t('编号')}}
            </div>
            <div class="text-[#000] text-xs font-bold">
              {{goods.orderNo}}
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
      round
      :style="{ width:'80%',background: 'transparent' }"
    >
      <img class="w-[100%]" src="../../static/images/super.png" alt="">
    </van-popup>
  </div>
</template>
<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import HeaderTop from "@/components/HeaderTop.vue";
import Footer from "@/components/Footer.vue";
import { showLoadingToast,closeToast,showFailToast,showSuccessToast   } from 'vant';
import { useI18n } from "vue-i18n";
import {formatWithTimezone}  from '../../util/utils'
import {
  userGetInfo,
  getGoodsList,
  createOrder,
  submitOrder,
} from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();
const url = window.g.VITE_API_IMG_URL;
const { t } = useI18n();
const userInfo = ref({});
const avatarUrl = ref("");
const showImg = ref(false);


let timer = null;
const goodsList = ref([]);
const showCenter = ref(false);
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
  console.log(goodsList.value[realIndex]?.coverUrl);
  return goodsList.value[realIndex]?.coverUrl || "";
};

// 抢单
const handleClick = () => {
  if(userInfo.value.cardNumber == userInfo.value.dealCount) {
    showImg.value = true;
    // 2. 延时 2 秒后关闭图片，并继续创建订单
    setTimeout(() => {
      showImg.value = false;
      doCreateOrder();
    }, 2000);

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
      showSuccessToast(t("创建成功"));
      showCenter.value = true;
      goods.value = res.data;
    })
    .catch((err) => {
      console.log(err);
      closeToast();
      showFailToast(err.msg || "创建失败");
    });
};

const submitForm = () => {
  submitOrder(goods.value.id).then((res)=>{
        showSuccessToast(t("提交成功"));
        if(res.code == 201) {
           goods.value =  res.data
        } else {
            showCenter.value = false;
        }
    })
};

onUnmounted(() => {
  // 清除定时器，防止组件卸载后还在请求
  if (timer) clearTimeout(timer);
});

const orderCount = ref(0)
onMounted(() => {
  getList();
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    avatarUrl.value = `${url}${res.data.userLevel.icon}`;
    orderCount.value = res.data.userLevel.orderCount
  });
});
</script>