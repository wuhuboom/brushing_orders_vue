<template>
  <div class="w-full bg-[#f7f7f7]">
    <div class="py-[20px] bg-[#000]">
      <img class="w-[124px] pl-[16px]" src="@/static/images/logo1.png" alt="" />
    </div>
    <div
      style="
        background: linear-gradient(to right, #ED3C47, #FF9061);
        box-sizing: border-box;
      "
      class="pb-[24px] px-[16px]"
    > 
    <div class="flex justify-between pt-[19px]">
      <div class="flex">
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
          <div class="ml-[11px]">
            <div class="text-[#fff] text-[20px]">{{ userInfo.username }}</div>
            <div class="userLevelBg">
              {{ userLevel }}
            </div>
          </div>
      </div>
      <div class="text-[#fff] text-[14px]">
          {{ $t("信用评分") }}:{{ userInfo.creditScore }}%
      </div>
    </div>
    <div class="flex justify-between mt-[20px]">
      <div class="flex-1 bg-gradient-to-b from-[#FFF4E3] to-[#FFFFFF] p-[13px] rounded-[8px]">
        <div class="pb-[16px] text-[#333] text-[12px]">{{$t('my.str1')}}</div>
        <div class="text-[#FF7D01] text-[14px] font-bold">{{ userInfo.balance }} USD</div>
      </div>
      <div class="flex-1 bg-gradient-to-b from-[#E5FFF5] to-[#FFFFFF] p-[13px] rounded-[8px] ml-[13px]">
        <div class="pb-[16px] text-[#22C55E] text-[12px]">{{$t('my.str2')}}</div>
        <div class="text-[#22C55E] text-[14px] font-bold">{{ userInfo.commission }} USD</div>
      </div>
    </div>
    </div>
    <div class="bg-[#FF7546] w-[95%] mx-auto rounded-[8px] px-[16px] py-[17px] mt-[9px]">
      <div class="pb-[8px] text-[#fff] text-[12px]">
        {{ $t("邀请码") }}:
      </div>
      <div class="flex justify-between">
        <span class="text-[24px] text-[#fff]">{{ userInfo.inviteCode }}</span>
            <img
              class="w-[24px] h-[24px] ml-2"
              @click="copyContent(userInfo.inviteCode)"
              src="@/static/images/copy.png"
              alt=""
            />
      </div>
    </div>
    <div class="flex justify-between w-[95%] mx-auto mt-[11px]">
      <div class="bg-[#1D1D1D] flex-1 rounded-[8px]" @click="goTo('/withdraw')">
        <div class="flex justify-center items-center h-[44px] ">
          <img class="w-[24px]" src="@/static/images/Withdraw.png" alt="">
         <span class="text-[#fff] pl-[8px]">{{$t('提款')}}</span>
        </div>
      </div>
      <div style="background: linear-gradient(to right, #ED3C47 , #FF9061);" @click="goTo('/deposit')" class="flex-1 rounded-[8px] ml-[10px]">
        <div class="flex justify-center items-center h-[44px] ">
          <img class="w-[24px]" src="@/static/images/deposit.png" alt="">
         <span class="text-[#fff] pl-[8px]">{{$t('定金')}}</span>
        </div>
      </div>
    </div>
    


    <div class=" overflow-y-scroll bg-white w-[95%] mx-auto flex flex-col pb-6 mt-[21px] rounded-[8px]">
      <div class="flex flex-col w-[90%] mx-auto">
        <!-- <div class="mt-4 mb-4 text-[#1F2937] text-base font-semibold">
          {{ $t("我的详细信息") }}
        </div> -->
        <div class="flex flex-col  rounded bg-[#fff]">
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
        
      </div>
      <div
          @click="logout"
          class="w-[75%] mx-auto h-[50px] flex  items-center justify-center border border-[#707070]  bold text-[#666666] text-[16px] mt-[32px] rounded-[30px]"
        >
          <!-- <img class="w-[20px] h-[20px] mr-[50px] ml-[83px]" src="@/static/images/logout.png" alt=""> -->
          {{ $t("登出") }}
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
import {
  userGetInfo,
  checkTradePassword,
  getTradeConfig,
} from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";
import { showConfirmDialog, showToast } from "vant";
import { checkWorkTimeLocal } from "../../util/utils";
import Footer from "@/components/Footer.vue";
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
  router.push(path);
  // if (path == "/notifications") {
  //   // tradePasswordRef.value.open(2);
  //   router.push("/withdraw");
  // } else if (path == "/profile") {
  //   // tradePasswordRef.value.open(3);
  //   router.push("/deposit");
  // } else if(path == "/customer") {
  //   customer()
  //   // router.push(path);
  // }
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
  langRef.value.open();
  // router.push({
  //   path: "/language",
  // });
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
<style scoped>
  .userLevelBg {
    width: 55px;
    height: 28px;
    background-image: url(@/static/images/userLevelBg.png);
    background-size: 100% 100%;
    font-size: 11px;
    color: #333333;
    padding-left: 23px;
    line-height: 28px;
    font-weight: bold;
    margin-top: 4px;
  }
</style>
