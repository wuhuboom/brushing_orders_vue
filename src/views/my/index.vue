<template>
  <div class="w-full min-h-[100vh] bg-[#1f2732]">
    <HeaderTop></HeaderTop>
     <!-- <van-nav-bar
        :title="$t('我的')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      /> -->
    <div class="w-full h-[100vh] overflow-y-scroll bg-white flex flex-col pb-6">
      <div class="w-full pb-6 pt-2">
        <div class="w-[90%] mx-auto" @click="onClickLeft">
          <img class="w-8 cursor-pointer" src="@/static/images/back.png" alt="">
        </div>
        <div class="w-[90%] mx-auto">
          <div class="w-[12rem] mx-auto relative" style="z-index: 99;">
            <!-- 接口还没返回 avatar 字段（请求中） -->
              <div
                v-if="userInfo.avatar === undefined"
                class="w-[6rem] h-[6rem] mx-auto  rounded-full bg-gray-200 animate-pulse"
              ></div>

              <!-- 接口返回 null / 空字符串 → 直接显示默认头像（不会闪） -->
              <img
                v-else-if="!userInfo.avatar"
                :src="userImg"
                class="w-[6rem] h-[6rem] mx-auto  rounded-full object-cover"
                alt="默认头像"
              />

              <!-- 接口返回头像 URL → 直接渲染用户头像；加载失败再回退到默认头像 -->
              <img
                v-else
                :src="userInfo.avatar"
                class="w-[6rem] h-[6rem] mx-auto  rounded-full  object-cover"
                alt="用户头像"
                @error="e => e.target.src = userImg"
              />
          </div>
          <div class="w-full rounded-lg p-4 mt-[-3rem] pb-10 bg-[#1f2732] relative">
            <div class="text-white text-center absolute top-5 right-5">
              <img class="w-12" :src="bgMapStart[userLevel]" alt="">
              <p class="text-[#fff] text-sm font-semibold">{{userLevel}}</p>
            </div>
            <div class="w-full text-center mt-[2rem]">
              <div class="flex text-white text-lg flex-col">
                <p class="text-2xl font-bold text-white">{{ userInfo.username }}</p>
                <p class="text-xs flex justify-center items-center">
                  <span class="">{{ $t("邀请码") }}:</span>
                  <span>{{ userInfo.inviteCode }}</span>
                  <img class="w-4 h-4 ml-2" src="@/static/images/copy.png" alt="">
                </p>
              </div>
            </div>
            <div class="w-full mt-3 flex justify-start items-center pl-1 pr-1 text-white">
              <div class="text-[10px] mr-2">{{ $t("信用评分") }}:</div>
              <div class="flex-auto">
                <van-progress
                  color="#01C6A6"
                  :percentage="userInfo.creditScore"
                  :show-pivot="false"
                  stroke-width="8"
                />
              </div>
              <div class="text-white text-[10px] ml-1">{{ userInfo.creditScore }}%</div>
            </div>
            <div class="w-full flex items-center pt-4 pb-4 text-center box-border mt-4">
            <div class="w-[50%] flex flex-col justify-center items-center">
              <div class="text-[#fff] text-[12px]">
               {{ $t("当日佣金") }} <div>(USD)</div>
              </div>
              <div class="text-xs text-[#fff] mt-1">
                <span class="text-base font-semibold">{{ userInfo.commission }}</span>
              </div>
            </div>
            <div class="w-[1px] h-8 bg-[#fff]"></div>
            <div class="w-[50%] flex flex-col justify-center items-center">
              <div class="text-[#fff] text-[12px]">
                {{ $t("钱包余额") }} <div>(USD)</div>
              </div>
              <div class="text-xs text-[#fff] mt-1">
                <span class="text-base font-semibold">{{ userInfo.balance }}</span>
              </div>
            </div>
          </div>
          </div>
          
        </div>
      </div>
      <div class="flex flex-col w-[90%] mx-auto">
      <!-- 我的财务 -->
        <div class="mt-4 mb-4 text-[#1a1a1a] text-base font-semibold">
          {{ $t("我的财务") }}
        </div>
        <div class="flex flex-col shadow rounded bg-[#fff]">
          <div
            @click="toPage('/deposit')"
            class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
          >
            <div class="flex items-center">
              <img src="@/static/images/Deposit.png" class="w-6 h-6 mr-3" alt="" />
              <div class="text-[#1a1a1a] text-sm">{{ $t("定金") }}</div>
            </div>
            <img class="w-[22px] h-[22px]" src="@/static/images/more1.png" alt="">
            <!-- <van-icon name="arrow" color="#206645" size="18px" /> -->
          </div>
          <div
            @click="toPage('/withdraw')"
            class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
          >
            <div class="flex items-center">
              <img src="@/static/images/Withdrawal.png" class="w-6 h-6 mr-3" alt="" />
              <div class="text-[#1a1a1a] text-sm">{{ $t("提取") }}</div>
            </div>
            <img class="w-[22px] h-[22px]" src="@/static/images/more1.png" alt="">
            <!-- <van-icon name="arrow" color="#206645" size="18px" /> -->
          </div>
        </div>
        <div class="mt-4 mb-4 text-[#1a1a1a] text-base font-semibold">
          {{ $t("我的详细信息") }}
        </div>
        <div class="flex flex-col shadow rounded bg-[#fff]">
          <div
            @click="toPage('/profileItem')"
            class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
          >
            <div class="flex items-center">
              <img src="@/static/images/EditPersonal.png" class="w-6 h-6 mr-3" alt="" />
              <div class="text-[#1a1a1a] text-sm">{{ $t("个人信息") }}</div>
            </div>
            <img class="w-[22px] h-[22px]" src="@/static/images/more1.png" alt="">
            <!-- <van-icon name="arrow" color="#206645" size="18px" /> -->
          </div>
          <div
            @click="payMethod"
            class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
          >
            <div class="flex items-center">
              <img src="@/static/images/LinkCard.png" class="w-6 h-6 mr-3" alt="" />
              <div class="text-[#1a1a1a] text-sm">{{ $t("付款方式") }}</div>
            </div>
            <img class="w-[22px] h-[22px]" src="@/static/images/more1.png" alt="">
            <!-- <van-icon name="arrow" color="#206645" size="18px" /> -->
          </div>
        </div>
        <div class="mt-4 mb-4 text-[#1a1a1a] text-base font-semibold">
          {{ $t("其他") }}
        </div>
        <div class="flex flex-col shadow rounded bg-[#fff]">
          <div
            @click="customer"
            class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
          >
            <div class="flex items-center">
              <img src="@/static/images/ContactUs.png" class="w-6 h-6 mr-3" alt="" />
              <div class="text-[#1a1a1a] text-sm">{{ $t("联系我们") }}</div>
            </div>
            <img class="w-[22px] h-[22px]" src="@/static/images/more1.png" alt="">
            <!-- <van-icon name="arrow" color="#206645" size="18px" /> -->
          </div>
          <div
            @click="toPage('/notice')"
            class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
          >
            <div class="flex items-center">
              <img src="@/static/images/Notifications.png" class="w-6 h-6 mr-3" alt="" />
              <div class="text-[#1a1a1a] text-sm">{{ $t("通知") }}</div>
            </div>
            <van-icon name="arrow" color="#206645" size="18px" />
          </div>
          <div
            @click="handleChangeLang"
            class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
          >
            <div class="flex items-center">
              <img src="@/static/images/lang.png" class="w-6 h-6 mr-3" alt="" />
              <div class="text-[#1a1a1a] text-sm">{{ $t("更改语言") }}</div>
            </div>
            <img class="w-[22px] h-[22px]" src="@/static/images/more1.png" alt="">
            <!-- <van-icon name="arrow" color="#206645" size="18px" /> -->
          </div>
        </div>
        <div
        @click="logout"
        class="w-full h-[50px] flex items-center justify-center bg-[#ff497c] bold text-white text-[16px]  mt-[32px]"
      >
        {{ $t("登出") }}
      </div>

    </div>

    </div>

    <ContactUs ref="ContactUsRef"></ContactUs>
    <tradePassword ref="tradePasswordRef"></tradePassword>
    <Lang ref="langRef"></Lang>
    <!-- <van-popup
      v-model:show="show"
      closeable
      position="bottom"
      class="p-5"
      :style="{ height: '30%' }"
    >
      <div class="text-[#666] font-semibold text-base pl-4 mt-10">
        {{ $t("交易密码") }}
      </div>
      <div class="w-full mt-2 overflow-hidden shadow">
        <van-field
          v-model="tradePassword"
          label=""
          placeholder="交易密码"
          label-align="top"
        />
      </div>
      <div class="w-full mt-4">
        <van-button color="#007513" class="w-full" @click="submitTradePassword">{{ $t("提交") }}</van-button>
      </div>

    </van-popup> -->
  </div>
</template>
<script setup>
import ContactUs from "@/components/ContactUs.vue";
import tradePassword from "@/components/tradePassword.vue";
import HeaderTop from "@/components/HeaderTop.vue";
import { userGetInfo, checkTradePassword,getTradeConfig } from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";
import { showConfirmDialog, showToast } from "vant";
import { checkWorkTimeLocal } from "../../util/utils";
const langRef = ref(null);
const { t } = useI18n();
const ContactUsRef = ref(null);
const tradePasswordRef = ref(null);
const userImg = new URL("@/static/images/userImg.png", import.meta.url).href;
const bg5 = new URL("@/static/images/bg5.png", import.meta.url).href;
import { onMounted, ref,watch  } from "vue";
import { useRouter } from "vue-router";
import { copyContent } from "../../util/utils";
const userStore = useUserStore();
const url = window.g.VITE_API_IMG_URL;
const router = useRouter();
const userInfo = ref({});
const avatarUrl = ref("");

// const bgMapStart = [
//   new URL("@/static/images/bg_vipStart0.png", import.meta.url).href,
//   new URL("@/static/images/bg_vipStart1.png", import.meta.url).href,
//   new URL("@/static/images/bg_vipStart2.png", import.meta.url).href,
//   new URL("@/static/images/bg_vipStart3.png", import.meta.url).href,
//   new URL("@/static/images/bg_vipStart4.png", import.meta.url).href,
// ];

const bgMapStart = {
  VIP1: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/172232700615694005.png",
  VIP2: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722327038574353214.png",
  VIP3: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/172232706362679225.png",
  VIP4: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722327102801555071.png",
  VIP5: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722342635975654072.png",
};
const toPage = (path) => {
  router.push({
    path: path,
  });
};
const customer = () => {
  const time = checkWorkTimeLocal(TradeInfor.value.workTimeStart, TradeInfor.value.workTimeEnd,userStore.zoneActive.tzName);
  if(time) {
     ContactUsRef.value.open();
  } else {
     showToast(t("supportHours"))
  }
};
const logout = () => {
  showConfirmDialog({
    title: t("退出"),
    message: t("确定要退出?"),
    confirmButtonColor: "#007513", // 确认按钮颜色（红色示例）
  })
    .then(() => {
      userStore.logout();
    })
    .catch(() => {
      // on cancel
    });
};

const payMethod = () => {
  // show.value = true;
  // tradePasswordRef.value.open(1);
  router.push({
    path: "/paymentMethods",
  });
};
const submitTradePassword = async () => {
  if (!tradePassword.value) return showToast(t("请输入交易密码"));
  console.log(tradePassword.value);
  let ruleForm = {
    tradePassword: tradePassword.value,
  };
  let res = await checkTradePassword(ruleForm);
  router.push({
    path: "/paymentMethods",
  });
};

function handleChangeLang() {
  langRef.value.open();
}

const onClickLeft = () => {
  router.replace({
    path: "/",
  });
};


const loading = ref(true);
const finalSrc = ref("");

// 只在 userInfo.avatar 第一次变化时处理
watch(
  () => userInfo.value.avatar,
  (val) => {
    if (!val) {
      // 接口返回 null 或空 → 用默认头像
      finalSrc.value = userImg;
      loading.value = false;
    } else {
      // 有头像地址 → 尝试加载一次
      finalSrc.value = val;
      loading.value = true;
    }
  },
  { immediate: true }
);

const onLoad = () => {
  loading.value = false;
};

const onError = () => {
  finalSrc.value = userImg;
  loading.value = false;
};

const TradeInfor = ref({})
const tradeConfig = async () => {
  let res = await getTradeConfig();
  TradeInfor.value = res.data;
};


const userLevel = ref({})
onMounted(() => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    avatarUrl.value = `${url}${res.data.userLevel.icon}`;
    userLevel.value = res.data.userLevel.nameEn;
    console.log(userInfo.value);
  });
  tradeConfig();
});
</script>
