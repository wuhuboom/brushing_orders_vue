<template>
  <div class="startBg">
    <!-- <div class="flex items-center relative "> -->
      <!-- 左侧箭头 -->
      <!-- <div class="absolute left-3" @click="toLogin">
        <van-icon name="arrow-left" color="#fff" size="24px" />
      </div> -->
      <!-- 中间标题 -->
      <!-- <div class="mx-auto text-white text-[22px] py-[24px] ">{{$t('开始')}}</div>
    </div> -->
    <div class="w-full bg-[#000] flex justify-between p-[8px]">
      <img class="w-[124px]" src="@/static/images/logo1.png" alt="">
      <div class="text-[12px] text-right">
        <span class="text-[#fff]">{{ $t("钱包余额") }}</span>
        <div class="text-[#FF7D01]">{{ userInfo.balance }} USD</div>
      </div>

    </div>
    <div class="w-full px-[20px]">
      <div class="bg-[#fff] rounded-[20px] overflow-hidden mt-[20px]">
        <div class="flex bg-[#FF7D01] h-[36px] items-center">
          <div class="flex-1 text-center text-[#fff]">{{$t('任务总计')}}</div>
          <div class="flex-1 text-center text-[#fff]">{{$t('任务完成')}}</div>
        </div>
        <div class="flex h-[36px] items-center font-bold border-b border-[#E6E6E6] ">
          <div class="flex-1 text-center text-[#000] ">{{ orderCount }}</div>
          <div class="flex-1 text-center text-[#000]">{{ userInfo.dealCount }}</div>
        </div>
        <!-- <div class="flex h-[36px] items-center px-[20px] border-b border-[#E6E6E6]">
          <div class="flex-1 text-[#6B4D51] ">{{ $t("钱包余额") }}</div>
          <div class="flex-1 text-right text-[#6B4D51]">{{ userInfo.balance }} USD</div>
        </div> -->
        <div class="flex h-[36px] items-center px-[20px] border-b border-[#E6E6E6]">
          <div class="flex-1  text-[#6B4D51] ">{{ $t("当日佣金") }}</div>
          <div class="flex-1  text-right text-[#000]">{{ userInfo.commission }} USD</div>
        </div>
        <div class="flex h-[36px] items-center px-[20px] pb-[10px]">
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
          class="mt-[10px] flex justify-center items-center text-[#fff] text-base h-[49px] bg-[linear-gradient(180deg,#FF9500_0%,#FF7A00_100%)] rounded-[10px]"
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
        <div class="mx-auto pt-[80px]">
          <div class="">
            <div class="flex flex-col box-border relative rounded-[10px]">
              <!-- <div class="mb-1 text-base text-[#4B5563] text-[16px]">
                {{ $t("start.notice.str") }}
              </div> -->
              <div class="text-[#4B5563] text-center text-[14px] font-bold">
                {{ $t("start.notice.desc1.str") }}
                <span class="text-[#FF7D01] pt-[10px]">{{ TradeInfor?.workTimeStart || "--:--" }} -</span>
                <span class="text-[#FF7D01]">{{ TradeInfor?.workTimeEnd || "--:--" }} <br /></span>
                
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
      <!-- <van-dialog
        v-model:show="showCenter"
        :title="''"
        closeable
        :style="{ width: '80%', background: '#fff' }"
        :show-confirm-button="false"
      >

        <div class="w-[100%] mx-auto text-[18px] font-semibold text-center p-[20px] pt-[60px]">
              {{ goods.goodsName }}
        </div>
        <div class="w-[60px]  mx-auto pb-[20px]">
          <img class="w-[56px] h-[56px]" :src="url + goods.coverUrl" alt="" />
        </div>
        <div
          class="w-full mt-[-3rem] pt-[23px] text-[#fff]"
        >
          <div
            class="flex justify-start pb-[23px]"
          >
            <div class=" w-[100%]">
              <div class="flex justify-between w-[100%] text-[16px] pt-[20px] pb-[10px] px-[18px]" style="border-bottom: 1px solid #9CA3AF">
                <div class="text-[#000] text-[12px]">{{ $t("总金额") }}</div>
                <div class="text-[#000] text-[14px] font-bold">
                  {{ goods.price }}{{ $t("美元") }}
                </div>
              </div>
              <div class="flex justify-between w-[100%] text-[16px] pt-[20px] pb-[10px] px-[18px]" style="border-bottom: 1px solid #9CA3AF">
                <div class="text-[#000] text-[12px]">{{ $t("佣金") }}</div>
                <div class="text-[#FF9500] text-[14px] font-bold">
                  {{ goods.commission }}{{ $t("美元") }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex justify-start pb-[23px]"
          >
            <div class="w-[100%]">
              <div class="flex justify-between w-[100%] text-[16px] pb-[10px] px-[18px]" style="border-bottom: 1px solid #9CA3AF">
                <div class="text-[#000] text-[12px]">{{ $t("创建时间") }}</div>
                <div class="text-[#968E9C]  font-bold text-[12px]">
                  {{
                    formatWithTimezone(
                      goods.createTime,
                      userStore.zoneActive.tzName
                    )
                  }}
                </div>
              </div>
              <div class="flex justify-between w-[100%] text-[16px] pt-[20px] pb-[10px] px-[18px]" style="border-bottom: 1px solid #9CA3AF">
                <div class="text-[#000] text-[12px]">{{ $t("编号") }}</div>
                <div class="text-[#968E9C] text-[12px]">
                  {{ goods.orderNo }}
                </div>
              </div>
            </div>
          </div>

          <div class="w-[70%] mx-auto mt-4 pb-[20px]">
            <van-button
              color="#6F4D50"
              class="w-full"
              round
              @click.prevent="submitForm"
              >{{ $t("提交") }}</van-button
            >
          </div>
        </div>
      </van-dialog> -->

      <van-dialog
      v-model:show="showCenter"
      :title="''"
      close-on-click-overlay
      :style="{ background: 'rgba(0, 0, 0, 0)',width:'95%' }"
      :show-confirm-button="false"
    >  
    <!-- <img class="fixed top-[-200px] z-[-1]" src="@/static/images/dialogBg1.png" alt="" /> -->
      
      <div class="dialog-bg">
        <div
          class="w-[100%] mx-auto text-[18px] font-semibold text-center px-[40px] pt-[140px]"
        >
          {{ goods.goodsName }}
        </div>
        <div class="w-[60px] mx-auto pb-[20px] pt-[20px]">
          <!-- <img class="w-[56px] h-[56px]" :src="url + goodsData.coverUrl" alt="" /> -->
          <img :src="url + goods.coverUrl" alt="" />
        </div>
        <div class="w-full mt-[-3rem] pt-[23px] text-[#fff]  px-[20px]">
          <div class="flex justify-start pb-[23px]">
            <div class="w-[100%]">
              <div
                class="flex justify-between w-[100%] text-[16px] pt-[20px] pb-[10px] px-[18px]"
                style="border-bottom: 1px solid rgba(156, 163, 175, 0.2)"
              >
                <div class="text-[#000] text-[12px]">{{ $t("总金额") }}</div>
                <div class="text-[#000] text-[14px] font-bold">
                  {{ goods.price }}{{ $t("美元") }}
                </div>
              </div>
              <div
                class="flex justify-between w-[100%] text-[16px] pt-[20px] pb-[10px] px-[18px]"
                style="border-bottom: 1px solid rgba(156, 163, 175, 0.2)"
              >
                <div class="text-[#000] text-[12px]">{{ $t("佣金") }}</div>
                <div class="text-[#FF9500] text-[14px] font-bold">
                  {{ goods.commission }}{{ $t("美元") }}
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
                      goods.createTime,
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
                  {{ goods.orderNo }}
                </div>
              </div>
            </div>
          </div>

          <div class="w-[70%] mx-auto mt-4 pb-[60px]">
            <van-button color="#FF7D01" class="w-full" @click="submitForm">{{
              $t("提交")
            }}</van-button>
          </div>
        </div>
      </div>
    </van-dialog>

      <van-popup
        v-model:show="showImg"
        round
        :style="{ width: '100%', background: 'transparent' }"
      >
        <!-- <img
          @click="closeImg"
          class="w-[100%] mb-5"
          src="../../static/images/super.png"
          alt=""
        /> -->
        <div class="superBg flex flex-col items-center justify-center">
          <img class="w-[145px] h-[38px] mx-auto" src="@/static/images/logo3.png" alt="">
          <img class="w-[260px] mx-auto" src="@/static/images/super1.png" alt="">
          <div class="superStr">{{$t('super.str1')}}</div>
          <div class="superStr1 py-[5px]">{{$t('super.str2')}}</div>
          <div class="superStr2 text-[#333333] text-center w-[80%] "> {{$t('super.str3')}}<span class="text-[#FF8C00] font-bold">{{$t('super.str4')}}</span> {{$t('super.str5')}}<span class="text-[#FF8C00]">{{$t('super.str6')}}</span></div>
          <div class="text-[12px] text-[#fff] superBtn my-[15px] py-[3px]">
            <div>{{$t('super.str7')}}</div>
            <div>{{$t('super.str8')}}</div>
          </div>
          <div class="text-[#666] text-[10px] text-center">{{$t('super.str9')}}</div>
 
        </div>
        <!-- <van-button color="rgb(10, 77, 162)" round class="w-full" @click="closeImg"
          >OK</van-button
        > -->
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
  getGoodsListTwo,
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
  background-image: url("@/static/images/start.png");
  background-repeat: no-repeat; /* 不平铺 */
  background-position: center center; /* 图片居中 */
  background-size: 100% 100%; /* 使用原始大小展示 */
  /* padding-top: 100px; */
}
.startBen {
  width: 100%;
  background-image: url(@/static/images/startBg.gif);
  background-size: 100% 100%;
  /* margin: 0 20px 0 20px; */
}
.superBg {
  width: 100%;
  height: 496px;
  background-image: url(@/static/images/super.png);
  background-size: 100% 100%;
}
.superStr {
  font-family: Alimama ShuHeiTi, Alimama ShuHeiTi;
  font-weight: bold;
  font-size: 30px;
  color: #FF7D01;
  line-height: 36px;
  text-align: center;
  font-style: normal;
  text-transform: none;
}
.superStr1 {
  font-family: SourceHanSansSC-Bold, SourceHanSansSC-Bold;
  font-weight: normal;
  font-size: 18px;
  color: #FF5500;
  line-height: 28px;
  text-align: center;
  font-style: normal;
  text-transform: none;
}
.superBtn {
  background: linear-gradient( 90deg, #FF8C00 0%, #FF6B00 100%);
  box-shadow: 0px 4px 16px 1px rgba(255,140,0,0.3);
  border-radius: 8px 8px 8px 8px;
  text-align: center;
  width: 85%;
}
</style>
