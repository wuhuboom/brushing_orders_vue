<template>
  <div class="w-full h-[100vh] overflow-y-scroll bg-white flex flex-col pb-6">
    <HeaderTop></HeaderTop>
    <div class="w-full py-6">
      <div class="w-[90%] mx-auto">
        <div class="w-[12rem] mx-auto relative" style="z-index: 99">
          <img
            :src="avatarUrl"
            class="w-[6rem] h-[6rem] mx-auto rounded-full"
            alt=""
          />
        </div>
        <div
          class="w-full p-4 mt-[-3rem] pb-10 relative"
          :style="{
            background: `url(${bgImage}) 0 0 / 100% 100% no-repeat`,
          }"
        >
          <div class="text-white text-center absolute top-5 right-5">
            <img
              src="https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/172232700615694005.png"
              class="w-12"
              alt=""
            />
            <p class="text-[#fff] text-sm font-semibold">
              VIP{{ userInfo.levelId }}
            </p>
          </div>
          <div class="w-full text-center mt-[2rem]">
            <div class="flex text-white text-lg flex-col">
              <p class="text-2xl font-bold text-white">
                {{ userInfo.username }}
              </p>
              <p class="text-xs flex justify-center items-center">
                <span>{{ $t("邀请码") }}:: </span>
                <span>{{ userInfo.inviteCode }}</span>
                <img
                  src="@/static/images/copy.png"
                  class="w-4 h-4 ml-2"
                  alt=""
                />
              </p>
            </div>
          </div>
          <div
            class="w-full mt-3 flex justify-start items-center pl-1 pr-1 text-white"
          >
            <div class="text-[10px] mr-2">{{ $t("信用评分") }}:</div>
            <div class="flex-auto">
              <van-progress
                color="rgb(137, 206, 79)"
                :percentage="userInfo.creditScore"
                :show-pivot="false"
                stroke-width="8"
              />
            </div>
            <div class="text-white text-[10px] ml-1">
              {{ userInfo.creditScore }}%
            </div>
          </div>
          <div
            class="w-full flex items-center pt-4 pb-4 text-center box-border overflow-hidden mt-4"
          >
            <div class="w-[50%] flex flex-col justify-center items-center">
              <div class="text-[#fff] text-[12px]">
                {{ $t("钱包余额") }}
                <div>(USD)</div>
              </div>
              <div class="text-xs text-[#fff] mt-1">
                <span class="text-base font-semibold">{{
                  userInfo.totalBalance
                }}</span>
              </div>
            </div>
            <div class="w-[1px] h-8 bg-[#fff]"></div>
            <div class="w-[50%] flex flex-col justify-center items-center">
              <div class="text-[#fff] text-[12px]">
                {{ $t("当日佣金") }}
                <div>(USD)</div>
              </div>
              <div class="text-xs text-[#fff] mt-1">
                <span class="text-base font-semibold">{{
                  userInfo.commission
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的财务 -->
    <div class="flex flex-col w-[90%] mx-auto mt-2">
      <div class="mt-4 mb-4 text-[var(--main-color)] text-base font-semibold">
        {{ $t("我的财务") }}
      </div>
      <div class="flex flex-col rounded-xl bg-[#fff]">
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
          @click="toPage('/deposit')"
        >
          <div class="flex items-center justify-between w-full">
            <div class="text-[#000] text-sm font-medium">
              {{ $t("定金") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
          @click="toPage('/withdraw')"
        >
          <div class="flex items-center justify-between w-full">
            <div class="text-[#000] text-sm font-medium">
              {{ $t("提取") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
      </div>
    </div>

    <!-- 我的详细信息 -->
    <div class="flex flex-col w-[90%] mx-auto mt-2">
      <div class="mt-4 mb-4 text-[var(--main-color)] text-base font-semibold">
        {{ $t("我的详细信息") }}
      </div>
      <div class="flex flex-col rounded-xl bg-[#fff]">
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
          @click="toPage('/profileItem')"
        >
          <div class="flex items-center justify-between w-full">
            <div class="text-[#000] text-sm font-medium">
              {{ $t("个人信息") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
          @click="payMethod"
        >
          <div class="flex items-center justify-between w-full">
            <div class="text-[#000] text-sm font-medium">
              {{ $t("付款方式") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
      </div>
    </div>

    <!-- 其他 -->
    <div class="flex flex-col w-[90%] mx-auto mt-2">
      <div class="mt-4 mb-4 text-[var(--main-color)] text-base font-semibold">
        {{ $t("其他") }}
      </div>
      <div class="flex flex-col rounded-xl bg-[#fff]">
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
          @click="customer"
        >
          <div class="flex items-center justify-between w-full">
            <div class="text-[#000] text-sm font-medium">
              {{ $t("联系我们") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
        >
          <div class="flex items-center justify-between w-full">
            <div class="text-[#000] text-sm font-medium">
              {{ $t("通知") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
          @click="logout"
        >
          <div class="flex items-center justify-between w-full">
            <div class="text-[#000] text-sm font-medium">
              {{ $t("登出") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
        >
          <div class="flex items-center justify-between w-full">
            <div class="text-[#000] text-sm font-medium">
              {{ $t("更改语言") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
      </div>
    </div>
    <ContactUs ref="ContactUsRef"></ContactUs>
    <tradePassword ref="tradePasswordRef"></tradePassword>
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
import { showConfirmDialog } from "vant";
const { t } = useI18n();
const ContactUsRef = ref(null);
const tradePasswordRef = ref(null);
const bgImage = new URL("@/static/images/profile_bg1.png", import.meta.url)
  .href;
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const userStore = useUserStore();
const url = import.meta.env.VITE_API_IMG_URL;
const router = useRouter();
const userInfo = ref({});
const avatarUrl = ref("");
// const show = ref(false);
// const tradePassword = ref("");
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
    title: "退出",
    message: t("确定要退出?"),
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
  if (!tradePassword.value) return ElMessage.error(t("请输入交易密码"));
  console.log(tradePassword.value);
  let ruleForm = {
    tradePassword: tradePassword.value,
  };
  let res = await checkTradePassword(ruleForm);
  router.push({
    path: "/paymentMethods",
  });
};

onMounted(() => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    avatarUrl.value = `${url}${res.data.userLevel.icon}`;
    console.log(userInfo.value);
  });
});
</script>
