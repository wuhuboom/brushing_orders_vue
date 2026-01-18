<template>
  <div class="my-bor w-full flex flex-col pb-6 bg-[#fff]">
    <div
      class="w-full mx-auto p-4 box-border flex flex-col relative bg-gradient-to-r from-[#F2F1ED] to-[#FAF9F6] "
    >
      <div class="flex justify-end  pt-[30px]" >
        <img class="w-[21px] h-[21px]" @click="toPage('/notice')" src="@/static/images/notic.png" alt="">
      </div>
      <div class="flex pl-1 pr-1">
        <!-- 接口还没返回 avatar 字段（请求中） -->
        <div
          v-if="userInfo.avatar === undefined"
          class="w-[60px] h-[60px] rounded-full ml-[5px] bg-gray-200 animate-pulse"
        ></div>

        <!-- 接口返回 null / 空字符串 → 直接显示默认头像（不会闪） -->
        <img
          v-else-if="!userInfo.avatar"
          :src="userImg"
          class="w-[60px] h-[60px] rounded-full ml-[5px] object-cover"
          :alt="$t('默认头像')"
        />

        <!-- 接口返回头像 URL → 直接渲染用户头像；加载失败再回退到默认头像 -->
        <img
          v-else
          :src="userInfo.avatar"
          class="w-[60px] h-[60px] rounded-full ml-[5px] object-cover"
          :alt="$t('用户头像')"
          @error="e => e.target.src = userImg"
        />
        <div class="flex flex-col justify-start ml-[10px] mt-[5px]">
          <div class="flex items-center">
            <div class="text-[#6B7280] font-semibold text-[18px]">
              {{ userInfo.username }}
            </div>
            <div
              class="h-[15px] w-[35px] flex justify-center items-center bg-[#FACC15] text-[#fff] text-[12px] ml-[3px] mt-[3px]"
              style="border-radius: 2px"
            >
              {{userLevel}}
            </div>
          </div>
          <div class="flex mt-[10px] text-[#6B7280] text-[12px]" @click="copyContent(userInfo.inviteCode)">
            {{$t('邀请码')}}
            {{ userInfo.inviteCode }}
          
          </div>
        </div>
      </div>
      <div class='text-[#6B7280] flex justify-between items-center mt-[10px]'>
        <div>
          <div class='font-medium mb-[10px]'>{{$t('我的账户')}}</div>
          <div class='text-[14px]'>USD <span class='font-medium'>{{ Number(userInfo?.balance || 0) + Number(userInfo?.frozenBalance || 0) }}</span></div>
        </div>
        <div class="flex mr-[20px]">
          <div @click="toPage('/deposit')">
            <img class='w-[45px] h-[45px]' src="@/static/images/cunkuan_app.png" alt="">
            <p class='text-[10px]'>{{$t('定金')}}</p>
          </div>
          <div class='ml-[30px]' @click="toPage('/withdraw')">
            <img class='w-[45px] h-[45px] text-center' src="@/static/images/cunkuan.png" alt="">
            <p class='text-[10px] text-center'>{{$t('提取')}}</p>
          </div>

        </div>
      </div>
    </div>
    <div class="w-[95%] rounded-xl mt-[21px] mx-auto flex flex-col">
      <!-- <div class="pt-4 pr-4 pl-4 text-sm text-black">
          {{ $t("菜单列表") }}
        </div> -->
      <div class="w-full p-4 grid grid-cols-4 gap-4">
        <div
          class="flex flex-col w-full justify-center rounded-lg items-start text-center box-border text-[#000]"
          v-for="(item, index) in items"
          :key="index"
          @click="goTo(item.route)"
        >
          <div class="w-full">
            <img class="w-[31px] h-[31px] mx-auto" :src="item.icon" alt="" />
          </div>
          <span class="mx-auto text-center text-xs mt-1 whitespace-nowrap">
            {{ $t(item.name) }}
          </span>
        </div>
      </div>
    </div>

    <!-- <div
      class="pb-[20px] w-[90%] mx-auto px-[22px] pt-[13px] mt-[18px]"
      style="
        box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
        border-radius: 20px;
      "
    >
      <div class="text-[#333333] text-[14px] font-bold">
        {{$t('邀请码')}}
      </div>
      <div class="text-[#333] text-[24px] font-bold text-center mb-[12px] mt-[16px]">
        {{ userInfo.inviteCode }}
      </div>
      <div
        class="flex w-[145px] h-[30px] justify-center items-center text-[10px] text-[#004990] mx-auto"
        style="border: 1px solid #004990; border-radius: 16px"
        @click="copyContent(userInfo.inviteCode)"
      >
        <img src="@/static/images/Copy.png" class="w-[19px] h-[19px]" alt="" />
        {{$t('复制邀请码')}}
      </div>
    </div> -->

    <!-- <div
      class="pb-[20px] w-[90%] mx-auto px-[22px] pt-[13px] mt-[18px]"
      style="
        box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
        border-radius: 20px;
      "
    >
      <div class="text-[#333333] text-[14px] font-bold">
        {{$t('钱包余额')}}
      </div>
      <div class="text-[#333] text-[24px] font-bold pt-[10px]">
        {{
              userInfo.totalBalance
            }}USD
      </div>
      <div class="text-[#666] text-[12px] mt-[25px]">
       {{ $t("当日佣金") }}
      </div>
      <div class="text-[#B3A369] font-bold text-[16px]  pt-[5px]">
        {{ userInfo.commission }}USD
      </div>
      <div class="text-[#fff] flex justify-between mt-[20px]">
        <div class="bg-[#000000] w-[138px] h-[44px] flex justify-center items-center" @click="toPage('/deposit')">{{$t('定金')}}</div>
        <div class="bg-[#B3A369] w-[138px] h-[44px] flex justify-center items-center" @click="toPage('/withdraw')">{{$t('提取')}}</div>
      </div>


    </div> -->

    <div class="flex flex-col w-[90%] mx-auto mt-2">
      <!-- 我的财务 -->
      <!-- <div class="mt-4 mb-4 text-[#1a1a1a] text-base font-semibold">
        {{ $t("我的财务") }}
      </div>
      <div class="flex flex-col shadow rounded bg-[#fff]">
        <div
          @click="toPage('/deposit')"
          class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
        >
          <div class="flex items-center">
            <img
              src="@/static/images/Deposit.png"
              class="w-6 h-6 mr-3"
              alt=""
            />
            <div class="text-[#1a1a1a] text-sm">{{ $t("定金") }}</div>
          </div>
          <van-icon name="arrow" color="#206645" size="18px" />
        </div>
        <div
          @click="toPage('/withdraw')"
          class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
        >
          <div class="flex items-center">
            <img
              src="@/static/images/Withdrawal2.png"
              class="w-6 h-6 mr-3"
              alt=""
            />
            <div class="text-[#1a1a1a] text-sm">{{ $t("提取") }}</div>
          </div>
          <van-icon name="arrow" color="#206645" size="18px" />
        </div>
      </div> -->
      <!-- <div class="mt-4 mb-4 text-[#1a1a1a] text-base font-semibold">
        {{ $t("我的详细信息") }}
      </div> -->
      <div class="flex flex-col  rounded bg-[#fff]">
        <div
          @click="toPage('/profileItem')"
          class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
        >
          <div class="flex items-center">
            <img
              src="@/static/images/Personal.png"
              class="w-4 h-4 mr-2"
              alt=""
            />
            <div class="text-[#333]  text-[12px]">{{ $t("个人信息") }}</div>
          </div>
          <van-icon name="arrow" color="#999" size="18px" />
        </div>
        <div
          @click="payMethod(1)"
          class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
        >
          <div class="flex items-center">
            <img
              src="@/static/images/Deposit1.png"
              class="w-4 h-4 mr-2"
              alt=""
            />
            <div class="text-[#333]  text-[12px]">{{ $t("充值记录") }}</div>
          </div>
          <van-icon name="arrow" color="#999" size="18px" />
        </div>
        <div
          @click="payMethod(2)"
          class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
        >
          <div class="flex items-center">
            <img
              src="@/static/images/Withdrawal1.png"
              class="w-4 h-4 mr-2"
              alt=""
            />
            <div class="text-[#333]  text-[12px]">{{ $t("提现记录") }}</div>
          </div>
          <van-icon name="arrow" color="#999" size="18px" />
        </div>
      </div>
      <!-- <div class="mt-4 mb-4 text-[#1a1a1a] text-base font-semibold">
        {{ $t("其他") }}
      </div> -->
      <div class="flex flex-col  rounded bg-[#fff]">
        <div
          @click="payMethod(3)"
          class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
        >
          <div class="flex items-center">
            <img
              src="@/static/images/setting.png"
              class="w-4 h-4 mr-2"
              alt=""
            />
            <div class="text-[#333]  text-[12px]">{{ $t("设置") }}</div>
          </div>
          <van-icon name="arrow" color="#999" size="18px" />
        </div>
      </div>
      <!-- <div
        @click="logout"
        class="w-full h-[50px] flex items-center justify-center bg-[#000000] bold text-white text-[16px] mt-[32px]"
      >
        {{ $t("登出") }}
      </div> -->
    </div>
    <Footer name="/my"></Footer>
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
import Footer from "@/components/Footer.vue";
const userImg = new URL("@/static/images/userImg.png", import.meta.url).href;
import { onMounted,onUnmounted,ref,onDeactivated,onActivated } from "vue";
import { useRouter } from "vue-router";
import { copyContent } from "../../util/utils";
const userStore = useUserStore();
const url = window.g.VITE_API_IMG_URL;
const router = useRouter();
const userInfo = ref({});
const avatarUrl = ref("");

const bgMapStart = [
  "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135431630339970.png",
  "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135444978440962.png",
  "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135461467660218.png",
  "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135471230297283.png",
];
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
    showToast(
        t("supportHours", {
          start: TradeInfor.value.workTimeStart,
          end: TradeInfor.value.workTimeEnd
        })
      )
  }
};
const logout = () => {
  showConfirmDialog({
    title: t("退出"),
    message: t("确定要退出?"),
    confirmButtonColor: "#ff9663", // 确认按钮颜色（红色示例）
  })
    .then(() => {
      userStore.logout();
    })
    .catch(() => {
      // on cancel
    });
};

const payMethod = (type) => {
  if(type == 1) {
    router.push({
      path: '/depositHistory',
      query:{
        type:1
      }
    });
  } else if(type ==2) {
    router.push({
      path: '/withdrawHistory',
      query:{
        type:1
      }
    });
  } else {
    router.push({
      path: '/setting'
    });
  }
  
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

const updateHandler = () => {
  getUserGetInfo();
};

const userLevel = ref('')
const getUserGetInfo = () => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    avatarUrl.value = `${url}${res.data.userLevel.icon}`;
    userLevel.value = res.data.userLevel.nameEn
    console.log(userInfo.value);
  });
};
const TradeInfor = ref({})
const tradeConfig = async () => {
  let res = await getTradeConfig();
  TradeInfor.value = res.data;
};

const items = [
  // {
  //   name: "事件",
  //   icon: new URL("@/static/images/record.png", import.meta.url).href,
  //   icon_bg: new URL("@/static/images/record.png", import.meta.url).href,
  //   route: "/event",
  // },
  {
    name: "团队",
    icon: new URL("@/static/images/teams1.png", import.meta.url).href,
    route: "/Teams",
  },
  {
    name: "提款",
    icon: new URL("@/static/images/wallet11.png", import.meta.url).href,
    icon_bg: new URL("@/static/images/icon_bg3.png", import.meta.url).href,
    route: "/notifications",
  },
  {
    name: "定金",
    icon: new URL("@/static/images/fried.png", import.meta.url).href,
    icon_bg: new URL("@/static/images/icon_bg4.png", import.meta.url).href,
    route: "/profile",
  },
  {
    name: "邀请好友", // 用于 $t('收入指南')
    icon: new URL("@/static/images/icon-134.png", import.meta.url).href,
    icon_bg: new URL("@/static/images/icon_bg1.png", import.meta.url).href,
    route: "/invite_friends",
  },
];
function goTo(path) {
  console.log(path)
  if (path == "/notifications") {
    // tradePasswordRef.value.open(2);
    router.push("/withdraw");
  } else if (path == "/profile") {
    // tradePasswordRef.value.open(3);
    router.push("/deposit");
  } else if(path == '/invite_friends'){
    // customer()
    router.push({
      path: '/invite_friends',
      query: {
        code: userInfo.value.inviteCode,
      }
    });
  } else {
    router.push(path);
  }
}
onMounted(() => {
  window.addEventListener("updateTrade", updateHandler);
  getUserGetInfo();
  tradeConfig()
});
onActivated(() => {
  // keep-alive 返回时也要重新绑定
  window.addEventListener("updateTrade", updateHandler);
});
onUnmounted(() => {
  window.removeEventListener("updateTrade", updateHandler);
});
onDeactivated(() => {
  // 组件被缓存但离开时
  window.removeEventListener("updateTrade", updateHandler);
});
</script>
