<template>
  <div class="w-full">
    <!-- <HeaderTop></HeaderTop> -->
    <!-- <van-nav-bar
        :title="$t('我的')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      /> -->
    <div class="py-[20px]">
      <img class="w-[278px] pl-[16px]" src="@/static/images/logo1.png" alt="" />
    </div>
    <div
      style="
        background: linear-gradient(to bottom, #002d72, #0a4da2);
        box-sizing: border-box;
      "
      class="pb-[24px]"
    >
      <div class="flex items-center justify-between px-[16px] py-[20px]">
        <div class="text-[#fff] text-[20px]">{{ userInfo.username }}</div>
        <div class="relative  border-[2px] border-[#fff] rounded-[50%]">
          <span
            style="z-index: 99"
            class="bg-[#F59E0B] text-white text-[12px] px-2 py-[2px] rounded-full absolute bottom-[-8px] right-[-5px]"
            >{{ userLevel }}</span
          >
          <!-- 接口还没返回 avatar 字段（请求中） -->
          <div
            v-if="userInfo.avatar === undefined"
            class="w-[52px] h-[52px] mx-auto rounded-full bg-gray-200 animate-pulse"
          ></div>

          <!-- 接口返回 null / 空字符串 → 直接显示默认头像（不会闪） -->
          <img
            v-else-if="!userInfo.avatar"
            :src="userImg"
            class="w-[52px] h-[52px] mx-auto rounded-full object-cover"
            alt=""
          />

          <!-- 接口返回头像 URL → 直接渲染用户头像；加载失败再回退到默认头像 -->
          <img
            v-else
            :src="userInfo.avatar"
            class="w-[52px] h-[52px] mx-auto rounded-full object-cover"
            alt=""
            @error="(e) => (e.target.src = userImg)"
          />
        </div>
      </div>
      <div class="flex items-end justify-between px-[16px]">
        <div>
          <div class="text-[#C5DEFF]">{{ $t("邀请码") }}:</div>
          <div class="text-[#fff] flex items-center pt-[4px]">
            <span>{{ userInfo.inviteCode }}</span>
            <img
              class="w-[16px] h-[16px] ml-2"
              @click="copyContent(userInfo.inviteCode)"
              src="@/static/images/copy.png"
              alt=""
            />
          </div>
        </div>
        <div class="text-[#8CE563]">
          {{ $t("信用评分") }}:{{ userInfo.creditScore }}%
        </div>
      </div>
    </div>
    <div
      class="w-[90%] mx-auto mt-[16px] p-[16px] flex justify-between items-center bg-[#E6F0FF] rounded-[12px]"
    >
      <div>
        <div class="text-[14px] text-[#6B7280]">{{$t('my.str1')}}</div>
        <div class="text-[20px] text-[#002D72] font-bold pt-[4px] pb-[8px]">
          {{ userInfo.balance }} USD
        </div>
        <div class="text-[#6B7280] text-[14px]">
          {{$t('my.str2')}}:
          <span class="text-[#09499B]">{{ userInfo.commission }} USD</span>
        </div>
      </div>
      <img class="w-[103px]" src="@/static/images/myBg.png" alt="" />
    </div>
    <div>
      <div class="w-full px-4 py-8 grid grid-cols-3 gap-3">
          <div
            class="flex flex-col w-full justify-center rounded-lg items-start text-center box-border text-[#2A2A2A]"
            v-for="(item, index) in items"
            :key="index"
            @click="goTo(item.route)"
          >
            <div class="w-full">
              <img class="mx-auto w-[48px] h-[48px]" :src="item.icon" alt="" />
            </div>
            <span class="mx-auto text-center text-xs mt-1 whitespace-nowrap">
              {{ $t(item.name) }}
            </span>
          </div>
        </div>
    </div>

    <div class="w-full  overflow-y-scroll bg-white flex flex-col pb-6">
      <div class="flex flex-col w-[90%] mx-auto">
        <div class="mt-4 mb-4 text-[#1F2937] text-base font-semibold">
          {{ $t("我的详细信息") }}
        </div>
        <div class="flex flex-col shadow rounded bg-[#fff]">
          <div
            @click="toPage('/profileItem')"
            class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
          >
            <div class="flex items-center">
              <img
                src="@/static/images/EditPersonal.png"
                class="w-6 h-6 mr-3"
                alt=""
              />
              <div class="text-[#1a1a1a] text-sm">{{ $t("个人信息") }}</div>
            </div>
            <!-- <img
              class="w-[22px] h-[22px]"
              src="@/static/images/more1.png"
              alt=""
            /> -->
            <van-icon name="arrow" color="#9CA3AF" size="18px" />
          </div>
          <div
            @click="payMethod"
            class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
          >
            <div class="flex items-center">
              <img
                src="@/static/images/LinkCard.png"
                class="w-6 h-6 mr-3"
                alt=""
              />
              <div class="text-[#1a1a1a] text-sm">{{ $t("付款方式") }}</div>
            </div>
            <!-- <img
              class="w-[22px] h-[22px]"
              src="@/static/images/more1.png"
              alt=""
            /> -->
            <van-icon name="arrow" color="#9CA3AF" size="18px" />
          </div>
        </div>
        <div class="mt-4 mb-4 text-[#1F2937] text-base font-semibold">
          {{ $t("其他") }}
        </div>
        <div class="flex flex-col shadow rounded bg-[#fff]">
          <!-- <div
            @click="customer"
            class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
          >
            <div class="flex items-center">
              <img
                src="@/static/images/ContactUs.png"
                class="w-6 h-6 mr-3"
                alt=""
              />
              <div class="text-[#1a1a1a] text-sm">{{ $t("联系我们") }}</div>
            </div>
            <img
              class="w-[22px] h-[22px]"
              src="@/static/images/more1.png"
              alt=""
            />
          </div> -->
          <div
            @click="toPage('/notice')"
            class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
          >
            <div class="flex items-center">
              <img
                src="@/static/images/Notifications.png"
                class="w-6 h-6 mr-3"
                alt=""
              />
              <div class="text-[#1a1a1a] text-sm">{{ $t("通知") }}</div>
            </div>
            <!-- <img
              class="w-[22px] h-[22px]"
              src="@/static/images/more1.png"
              alt=""
            /> -->
            <van-icon name="arrow" color="#9CA3AF" size="18px" />
          </div>
          <div
            @click="handleChangeLang"
            class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
          >
            <div class="flex items-center">
              <img src="@/static/images/lang.png" class="w-6 h-6 mr-3" alt="" />
              <div class="text-[#1a1a1a] text-sm">{{ $t("更改语言") }}</div>
            </div>
            <!-- <img
              class="w-[22px] h-[22px]"
              src="@/static/images/more1.png"
              alt=""
            /> -->
            <van-icon name="arrow" color="#9CA3AF" size="18px" />
          </div>
        </div>
        <div
          @click="logout"
          class="w-full h-[50px] flex items-center  bg-[#FF4D4F] bold text-white text-[16px] mt-[32px] rounded-[30px]"
        >
          <img class="w-[20px] h-[20px] mr-[50px] ml-[83px]" src="@/static/images/logout.png" alt="">
          {{ $t("登出") }}
        </div>
      </div>
    </div>

    <ContactUs ref="ContactUsRef"></ContactUs>
    <tradePassword ref="tradePasswordRef"></tradePassword>
    <Lang ref="langRef"></Lang>
    <Footer name="/my"></Footer>
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
import Lang from "@/components/Lang.vue";
import Footer from "@/components/Footer.vue";
import {
  userGetInfo,
  checkTradePassword,
  getTradeConfig,
} from "../../api/apis";
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
import { onMounted, ref, watch } from "vue";
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
  const time = checkWorkTimeLocal(
    TradeInfor.value.workTimeStart,
    TradeInfor.value.workTimeEnd,
    userStore.zoneActive.tzName
  );
  if (time) {
    router.push('/customer');
    // ContactUsRef.value.open();
  } else {
    showToast(t("supportHours"));
  }
};
const logout = () => {
  showConfirmDialog({
    title: t("退出"),
    message: t("确定要退出?"),
    confirmButtonText: t("确定"), // ✅ 添加翻译
    cancelButtonText: t("取消"), // ✅ 添加翻译
    confirmButtonColor: "#007513", // 确认按钮颜色（红色示例）
  })
    .then(() => {
      userStore.logout();
    })
    .catch(() => {
      // on cancel
    });
};
const items = [
  {
    name: "提款",
    icon: new URL("@/static/images/withdraw.png", import.meta.url).href,
    route: "/notifications",
  },
  {
    name: "定金",
    icon: new URL("@/static/images/deposit.png", import.meta.url).href,
    route: "/profile",
  },
  {
    name: "客服",
    icon: new URL("@/static/images/service.png", import.meta.url).href,
    route: "/customer",
  },
];

function goTo(path) {
  if (path == "/notifications") {
    // tradePasswordRef.value.open(2);
    router.push("/withdraw");
  } else if (path == "/profile") {
    // tradePasswordRef.value.open(3);
    router.push("/deposit");
  } else if(path == "/customer") {
    customer()
    // router.push(path);
  }
}

const payMethod = () => {
  // show.value = true;
  // tradePasswordRef.value.open(1);
  router.push({
    path: '/cardList',
    query:{
      type:1
    }
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
  // langRef.value.open();
  router.push({
    path: "/language",
  });
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

const TradeInfor = ref({});
const tradeConfig = async () => {
  let res = await getTradeConfig();
  TradeInfor.value = res.data;
};

const codeUrl = ref("");
const getFullDomain = () => {
  const fullDomain =
    window.location.origin +
    "/#/account/register?code=" +
    userInfo.value.inviteCode;
  console.log(fullDomain);
  codeUrl.value = fullDomain;
};

const userLevel = ref({});
onMounted(() => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    avatarUrl.value = `${url}${res.data.userLevel.icon}`;
    userLevel.value = res.data.userLevel.nameEn
    getFullDomain();
  });

  tradeConfig();
});
</script>
