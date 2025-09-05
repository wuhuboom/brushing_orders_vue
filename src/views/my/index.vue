<template>
  <div class="my-bor w-full flex flex-col pb-6 bg-[#f1f1f1]">
    <van-nav-bar
      :title="$t('我的')"
      fixed
      left-arrow
      @click-left="onClickLeft"
    />
    <div
      class="w-[90%] mt-[90px] mx-auto flex flex-col rounded-xl bg-[url(@/static/images/profile_bg2.png)] bg-cover"
    >
      <div class="w-full mx-auto p-4 box-border flex flex-col relative">
        <img
          :src="bgMapStart[userInfo.levelId - 1]"
          class="w-[6rem] h-[6rem] absolute top-[-2rem] right-2"
          alt=""
        />
        <div class="flex pl-1 pr-1">
          <img
            :src="userInfo.avatar == null ? userImg : userInfo.avatar"
            class="w-[4rem] h-[4rem] mr-4"
            alt=""
          />
          <div class="flex flex-col justify-start">
            <div class="flex items-center">
              <div class="text-[#fff] font-semibold text-lg">
                {{ userInfo.username }}
              </div>
            </div>
          </div>
        </div>
        <div class="text-[#fff] text-xs whitespace-nowrap mt-2">
          <span class="opacity-50">{{ $t("邀请码") }}:</span>
          <span class="text-[#fff] font-semibold">{{
            userInfo.inviteCode
          }}</span>
        </div>
        <div class="mt-3 w-full flex flex-col items-center pl-1 pr-1">
          <div class="w-full flex justify-between">
            <div class="text-[#fff] text-xs whitespace-nowrap">
              <span class="opacity-50"> {{ $t("信用评分") }}: </span>
            </div>
            <div class="ml-2 text-xs text-[#fff] font-semibold">
              {{ userInfo.creditScore }}%
            </div>
          </div>
          <div class="w-full mt-2">
            <van-progress
              color="#ff9662"
              :percentage="userInfo.creditScore"
              :show-pivot="false"
              stroke-width="8"
            />
          </div>
        </div>
      </div>
      <div
        class="w-full flex items-center pt-4 pb-4 box-border overflow-hidden"
      >
        <div class="w-[50%] flex flex-col justify-center items-center">
          <div class="text-[#fff] text-sm font-semibold opacity-70">
            {{ $t("钱包余额") }}
          </div>
          <div class="text-xs text-[#fff] mt-1">
            <span class="text-sm font-semibold">{{
              userInfo.totalBalance
            }}</span>
            <span class="opacity-80 ml-1">USD</span>
          </div>
        </div>
        <div class="w-[1px] h-8 bg-[#EBEBEB]"></div>
        <div class="w-[50%] flex flex-col justify-center items-center">
          <div class="text-[#fff] text-sm font-semibold opacity-70">
            {{ $t("当日佣金") }}
          </div>
          <div class="text-xs text-[#fff] mt-1">
            <span class="text-sm font-semibold">652500.84</span>
            <span class="opacity-80 ml-1">USD</span>
          </div>
        </div>
      </div>
    </div>
     <div class="flex flex-col w-[90%] mx-auto mt-2">
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
            <van-icon name="arrow" color="#206645" size="18px" />
          </div>
          <div
            @click="toPage('/withdraw')"
            class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
          >
            <div class="flex items-center">
              <img src="@/static/images/Withdrawal2.png" class="w-6 h-6 mr-3" alt="" />
              <div class="text-[#1a1a1a] text-sm">{{ $t("提取") }}</div>
            </div>
            <van-icon name="arrow" color="#206645" size="18px" />
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
            <van-icon name="arrow" color="#206645" size="18px" />
          </div>
          <div
            @click="payMethod"
            class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
          >
            <div class="flex items-center">
              <img src="@/static/images/Withdrawal2.png" class="w-6 h-6 mr-3" alt="" />
              <div class="text-[#1a1a1a] text-sm">{{ $t("付款方式") }}</div>
            </div>
            <van-icon name="arrow" color="#206645" size="18px" />
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
              <img src="@/static/images/Notifications.png" class="w-6 h-6 mr-3" alt="" />
              <div class="text-[#1a1a1a] text-sm">{{ $t("联系我们") }}</div>
            </div>
            <van-icon name="arrow" color="#206645" size="18px" />
          </div>
          <div
            @click="toPage('/notice')"
            class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
          >
            <div class="flex items-center">
              <img src="@/static/images/ContactUs.png" class="w-6 h-6 mr-3" alt="" />
              <div class="text-[#1a1a1a] text-sm">{{ $t("通知") }}</div>
            </div>
            <van-icon name="arrow" color="#206645" size="18px" />
          </div>
        </div>
        <div
        @click="logout"
        class="w-full h-[50px] flex items-center justify-center bg-[#000000] bold text-white text-[16px]  mt-[32px]"
      >
        {{ $t("登出") }}
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
import { userGetInfo, checkTradePassword } from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";
import { showConfirmDialog, showToast } from "vant";
const langRef = ref(null);
const { t } = useI18n();
const ContactUsRef = ref(null);
const tradePasswordRef = ref(null);
const userImg = new URL("@/static/images/userImg.png", import.meta.url).href;
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { copyContent } from "../../util/utils";
const userStore = useUserStore();
const url = window.g.VITE_API_IMG_URL;
const router = useRouter();
const userInfo = ref({});
const avatarUrl = ref("");

const bgMapStart = [
  "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135431630339970.png",
  "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135431630339970.png",
  "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135461467660218.png",
  "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135471230297283.png",
];
const toPage = (path) => {
  router.push({
    path: path,
  });
};
const customer = () => {
  ContactUsRef.value.open();
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
  tradePasswordRef.value.open(1);
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

const copy = (text) => {};
onMounted(() => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    avatarUrl.value = `${url}${res.data.userLevel.icon}`;
    console.log(userInfo.value);
  });
});
</script>
