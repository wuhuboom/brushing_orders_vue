<template>
  <div class="my-bor w-full flex flex-col pb-6 pt-[10px]">
     <van-nav-bar
        :title="$t('我的')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    <div class="flex justify-between px-[17px] mb-[5px] mt-[45px]">
      <div>
        <div class="text-[#000] text-[14px] pb-[3px]">hi,{{ userInfo.username }}</div>
        <div class="text-[#6A7187] text-[12px]">
          <span>{{ $t("邀请码") }}:</span>{{ userInfo.inviteCode }}
        </div>
      </div>
      <div class="flex items-center">
        <div
          @click="customer"
          class="bg-[#f0f9f8] border border-[#A0DBD1] rounded-[18px] h-[36px] w-[93px] flex justify-center items-center text-[12px]"
        >
          <img class="w-[18px] mr-[4px]" src="@/static/images/my5.png" alt="" />
          <span class="text-[#12A58C]">{{ $t("联系我们") }}</span>
        </div>
        <!-- <img
          :src="userInfo.avatar == null ? userImg : userInfo.avatar"
          class="w-[35px] h-[35spx] rounded-full ml-[5px]"
          alt=""
        /> -->
        <!-- 接口还没返回 avatar 字段（请求中） -->
        <div
          v-if="userInfo.avatar === undefined"
          class="w-[35px] h-[35px] rounded-full ml-[5px] bg-gray-200 animate-pulse"
        ></div>

        <!-- 接口返回 null / 空字符串 → 直接显示默认头像（不会闪） -->
        <img
          v-else-if="!userInfo.avatar"
          :src="userImg"
          class="w-[35px] h-[35px] rounded-full ml-[5px] object-cover"
          alt="默认头像"
        />

        <!-- 接口返回头像 URL → 直接渲染用户头像；加载失败再回退到默认头像 -->
        <img
          v-else
          :src="userInfo.avatar"
          class="w-[35px] h-[35px] rounded-full ml-[5px] object-cover"
          alt="用户头像"
          @error="e => e.target.src = userImg"
        />
      </div>
    </div>
    <div
      class="h-[197px] w-full px-[30px] py-[17px]"
      :style="{
        backgroundImage: `url(${bg5})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center'
      }"
    >
      <div class="flex justify-between">
        <div class="text-[#fff] text-[24px]">
          <div class="pt-[10px] pb-[10px]" style="font-family: Helvetica">{{ userInfo.balance }} <span class="text-[14px]">USD</span> </div>
          <div class="text-[#A1FFC1] text-[12px]">{{ $t("钱包余额") }}</div>
        </div>
        <div>
          <img class="w-[34px]" src="@/static/images/vip11.png" alt="" />
          <span class="text-[#EEBB69]">{{userLevel}}</span>
        </div>
      </div>
      <div class="flex justify-between items-end mt-[10px]">
        <div class="pb-[10px]">
          <div class="text-[#A1FFC1] text-[12px]">
            {{ $t("当日佣金") }}
          </div>
          <div class="text-[#FFFFFF] text-[14px] pt-[5px]">{{ userInfo.commission }}<span class="text-[12px] pl-1">USD</span></div>
        </div>
        <div
         @click="payMethod"
          class="w-[calc(100%-52%)] h-[48px] bg-[#000] text-[#fff] flex justify-center items-center rounded-[12px] mr-[-20px] mt-[45px]"
        >
          + Bind Wallet
        </div>
      </div>
    </div>
    <div style="border: 1px solid rgba(1,198,166,0.2);border-radius: 12px;" class="bg-[rgba(1,198,166,0.2)] mx-[17px] px-[21px]">
      <div
        class="flex items-center justify-start text-[#000] text-[12px] pt-[14px] pb-[12px]"
      >
        <div class="text-[10px] mr-2">{{ $t("信用评分") }}:</div>
        <div class="text-[#000] text-[10px] ml-1">
          {{ userInfo.creditScore }}%
        </div>
      </div>
      <div class="flex-auto pb-[14px]">
          <van-progress
            color="#01C6A6"
            :percentage="userInfo.creditScore"
            :show-pivot="false"
            stroke-width="8"
          />
        </div>
    </div>

    <!-- 提取 -->
    <div class="flex flex-col w-[90%] mx-auto mt-[14px]">
      <div class="flex flex-col rounded-xl bg-[#F7F9FC]">
        <div
          class="flex items-center justify-between p-4 pl-2"
          @click="toPage('/deposit')"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center text-[#38415F] text-sm font-medium">
              <img
                class="w-[32px] h-[32px] mr-[12px]"
                src="@/static/images/img1.png"
                alt=""
              />
              {{ $t("定金") }}
            </div>
            <van-icon name="arrow" color="#E8EAED" size="18px" />
          </div>
        </div>
        <div class="h-[1px] bg-[#E8EAED] mx-[20px]"></div>
        <div
          class="flex items-center justify-between p-4 pl-2"
          @click="toPage('/withdraw')"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center text-[#38415F] text-sm font-medium">
              <img
                class="w-[32px] h-[32px] mr-[12px]"
                src="@/static/images/img2.png"
                alt=""
              />
              {{ $t("提取") }}
            </div>
            <van-icon name="arrow" color="#E8EAED" size="18px" />
          </div>
        </div>
      </div>
    </div>
    <!-- 个人信息 -->
    <div class="flex flex-col w-[90%] mx-auto">
      <div class="mt-4 mb-4 text-[#83899B] text-[14px]">
       Accounts
      </div>
      <div class="flex flex-col rounded-xl bg-[#F7F9FC]">
        <div
          class="flex items-center justify-between p-4 pl-2"
         @click="toPage('/profileItem')"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center text-[#38415F] text-sm font-medium">
              <img
                class="w-[23px] h-[23px] mr-[12px]"
                src="@/static/images/img3.png"
                alt=""
              />
              {{ $t("个人信息") }}
            </div>
            <van-icon name="arrow" color="#E8EAED" size="18px" />
          </div>
        </div>
        <div class="h-[1px] bg-[#E8EAED] mx-[20px]"></div>
        <div
          class="flex items-center justify-between p-4 pl-2"
          @click="payMethod"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center text-[#38415F] text-sm font-medium">
              <img
                class="w-[23px] h-[23px] mr-[12px]"
                src="@/static/images/img4.png"
                alt=""
              />
               {{ $t("付款方式") }}
            </div>
            <van-icon name="arrow" color="#E8EAED" size="18px" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col w-[90%] mx-auto mt-[15px]">
      <div class="flex flex-col rounded-xl bg-[#F7F9FC]">
        <div
          class="flex items-center justify-between p-4 pl-2"
          @click="toPage('/notice')"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center text-[#38415F] text-sm font-medium">
              <img
                class="w-[23px] h-[23px] mr-[12px]"
                src="@/static/images/img5.png"
                alt=""
              />
              {{ $t("通知") }}
            </div>
            <van-icon name="arrow" color="#E8EAED" size="18px" />
          </div>
        </div>
        <div class="h-[1px] bg-[#E8EAED] mx-[20px]"></div>
        <div
          class="flex items-center justify-between p-4 pl-2"
          @click="logout"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center text-[#38415F] text-sm font-medium">
              <img
                class="w-[23px] h-[23px] mr-[12px]"
                src="@/static/images/img6.png"
                alt=""
              />
              {{ $t("登出") }}
            </div>
            <van-icon name="arrow" color="#E8EAED" size="18px" />
          </div>
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

// function handleChangeLang() {
//   langRef.value.open();
// }

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

const userLevel = ref('')

onMounted(() => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    avatarUrl.value = `${url}${res.data.userLevel.icon}`;
    userLevel.value = res.data.userLevel.nameEn
    console.log(userInfo.value);
  });
  tradeConfig();
});
</script>
