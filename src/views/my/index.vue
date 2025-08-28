<template>
  <div class="my-bor w-full flex flex-col pb-6">
     <van-nav-bar
        :title="$t('我的')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    <div
      class="mt-[45px]"
      style="background: linear-gradient(180deg, #206645 0%, #2e8b57 100%)"
    >
      <div class="flex justify-between items-center p-[23px]">
        <img
          :src="userInfo.avatar"
          class="w-[60px] h-[60px] rounded-full"
          alt=""
        />
        <img :src="bgMapStart[userInfo.levelId - 1]" class="w-12" alt="" />
      </div>
      <div class="text-white text-[24px] px-[23px] pb-[8px]">
        {{ userInfo.username }}
      </div>
      <div class="text-white text-[14px] px-[23px]" @click="copyContent(userInfo.inviteCode)">
        <span>{{ $t("邀请码") }}:</span>{{ userInfo.inviteCode }}
      </div>
      <div class="px-[23px]">
        <div class="flex items-center justify-between text-white text-[14px] mt-5">
          <div class="text-[10px] mr-2">{{ $t("信用评分") }}:</div>
          <div class="text-white text-[10px] ml-1">
              {{ userInfo.creditScore }}%
          </div>
        </div>
        <div class="flex-auto">
          <van-progress
            color="rgb(137, 206, 79)"
            :percentage="userInfo.creditScore"
            :show-pivot="false"
            stroke-width="8"
          />
        </div>
        <div class="border-t border-white/30 h-1 mt-5"></div>
        <div
            class="w-full flex items-center  pb-4 text-center box-border overflow-hidden mt-2"
          >
            <div class="w-[50%] flex flex-col justify-center items-center">
              <div class="text-[#fff] text-[12px]">
                {{ $t("钱包余额") }}
              </div>
              <div class="text-xs text-[#fff] mt-1">
                <span class="text-base font-semibold">{{
                  userInfo.totalBalance
                }}USD</span>
              </div>
            </div>
            <div class="border-l h-[80px] border-white/30"></div>
            <div class="w-[50%] flex flex-col justify-center items-center">
              <div class="text-[#fff] text-[12px]">
                {{ $t("当日佣金") }}
              </div>
              <div class="text-xs text-[#fff] mt-1">
                <span class="text-base font-semibold">{{
                  userInfo.commission
                }}USD</span>
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
      <div class="flex items-center justify-between">
        <div class="px-[60px] py-[16px] bg-[#F9FAFB] rounded flex flex-col items-center"  @click="toPage('/deposit')">
          <img class="w-[32px]" src="@/static/images/qian.png" alt="">
          <div class="pt-[8px]">{{ $t("定金") }}</div>
        </div>
        <div class="px-[60px] py-[16px] bg-[#F9FAFB] rounded flex flex-col items-center" @click="toPage('/withdraw')">
          <img class="w-[32px]" src="@/static/images/qian1.png" alt="">
          <div class="pt-[8px]">{{ $t("提取") }}</div>
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
          class="flex items-center justify-between p-4 pl-2 box-border bg-[#F9FAFB] rounded-xl"
          @click="toPage('/profileItem')"
        >
          <div class="flex items-center justify-between w-full ">
            <div class="flex text-[#000] text-sm font-medium ">
              <img class="w-[18px] mr-[12px]" src="@/static/images/my1.png" alt="">
              {{ $t("个人信息") }}
            </div>
            <van-icon name="arrow" color="#206645" size="18px" />
          </div>
        </div>
        <div
          class="flex items-center justify-between p-4 pl-2 box-border bg-[#F9FAFB] rounded-xl mt-3"
          @click="payMethod"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex text-[#000] text-sm font-medium ">
              <img class="w-[18px] mr-[12px]" src="@/static/images/my2.png" alt="">
               {{ $t("付款方式") }}
            </div>
            <van-icon name="arrow" color="#206645" size="18px" />
          </div>
        </div>
        <div
          class="flex items-center justify-between p-4 pl-2 box-border bg-[#F9FAFB] rounded-xl mt-3"
          @click="customer"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex text-[#000] text-sm font-medium ">
              <img class="w-[18px] mr-[12px]" src="@/static/images/my3.png" alt="">
               {{ $t("联系我们") }}
            </div>
            <van-icon name="arrow" color="#206645" size="18px" />
          </div>
        </div>
        <div
          class="flex items-center justify-between p-4 pl-2 box-border bg-[#F9FAFB] rounded-xl mt-3"
          @click="toPage('/notice')"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex text-[#000] text-sm font-medium ">
              <img class="w-[18px] mr-[12px]" src="@/static/images/my4.png" alt="">
               {{ $t("通知") }}
            </div>
            <van-icon name="arrow" color="#206645" size="18px" />
          </div>
        </div>
        <!-- <div
          class="flex items-center justify-between p-4 pl-2 box-border bg-[#F9FAFB] rounded-xl mt-3"
          @click="handleChangeLang"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex text-[#000] text-sm font-medium ">
              <img class="w-[18px] mr-[12px]" src="@/static/images/my4.png" alt="">
               {{ $t("更改语言") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div> -->
      </div>
      <div @click="logout" class="w-full h-[40px] flex items-center justify-center bg-[#000000] rounded-xl text-white mt-[32px]">{{ $t("登出") }}</div>
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
import { showConfirmDialog } from "vant";
const langRef = ref(null);
const { t } = useI18n();
const ContactUsRef = ref(null);
const tradePasswordRef = ref(null);
const bgImage = new URL("@/static/images/profile_bg1.png", import.meta.url)
  .href;
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { copyContent } from "../../util/utils";
const userStore = useUserStore();
const url = import.meta.env.VITE_API_IMG_URL;
const router = useRouter();
const userInfo = ref({});
const avatarUrl = ref("");

const bgMapStart = [
  new URL("@/static/images/bg_vipStart0.png", import.meta.url).href,
  new URL("@/static/images/bg_vipStart1.png", import.meta.url).href,
  new URL("@/static/images/bg_vipStart2.png", import.meta.url).href,
  new URL("@/static/images/bg_vipStart3.png", import.meta.url).href,
  new URL("@/static/images/bg_vipStart4.png", import.meta.url).href,
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

function handleChangeLang() {
  langRef.value.open();
}

const onClickLeft = () =>{
  router.replace({
    path:"/"
  })
}

const copy = (text) => {};
onMounted(() => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    avatarUrl.value = `${url}${res.data.userLevel.icon}`;
    console.log(userInfo.value);
  });
});
</script>
