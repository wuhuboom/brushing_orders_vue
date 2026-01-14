<template>
  <div class="w-full min-h-[100vh] bg-[#fff]">
    <van-nav-bar
      :title="$t('交易所')"
      fixed
      left-arrow
      @click-left="onClickLeft"
    />
    <div
      class="mt-[80px] px-[20px] flex justify-between items-center mb-[16px]"
    >
      <div>{{$t('我的交易所')}}</div>
      <!-- <van-icon name="deletes-o" color="#EF4444" size="24px" /> -->
    </div>
    <div
      class="flex items-center mx-[20px] border border-[#EEEEEE] p-[17px] rounded-[20px] mt-[32px]"
      :class="activeValue == item.id ? 'active' : ''"
      v-for="(item, index) in bankWallet"
      :key="index"
      @click="selectEmits(item)"
    >
      <!-- <img
        v-if="item.type == 1"
        class="w-[40px] h-[40px] items-center mr-[12px]"
        src="../../static/images/card1.png"
        alt=""
      />
      <img
        v-else
        class="w-[40px] h-[40px] items-center mr-[12px]"
        src="../../static/images/walletCard.png"
        alt=""
      /> -->
      <div class="w-full">
        <div class="w-full flex justify-between">
          <div class="text-[16px] text-[#212121]" v-if="item.type == 1">
            {{ item.bankCode }}
          </div>
          <div class="text-[16px] text-[#212121]" v-else>{{ item.name }}</div>
          <img
            v-if="activeValue != item.id"
            class="w-[22px] h-[22px]"
            src="../../static/images/active.png"
            alt=""
          />
          <img
            v-else
            class="w-[22px] h-[22px]"
            src="../../static/images/active1.png"
            alt=""
          />
        </div>
        <div v-if="item.type == 1">
          <div class="text-[14px] text-[#757575] py-[5px]">{{ item.name }}</div>
          <div class="text-[14px] text-[#757575] flex justify-between">
            <div>
              {{ item.bankCard }}
            </div>
            <div
              style="text-align: right"
              class="text-[12px] text-[#FF3E3E] w-[60px] h-[30px]"
              @click.stop="customer"
            >
            <!-- @click.stop="toDetail(item.id, item.type)" -->
              {{$t('编辑')}}
            </div>
          </div>
        </div>
        <div v-else>
          <div class="text-[14px] text-[#757575] py-[5px]">
            {{ item.walletType }}
          </div>
          <div
            class="text-[14px] text-[#757575] flex justify-between items-start"
          >
            <div class="w-[80%] break-all leading-[20px]">
              {{ item.walletAddress }}
            </div>
            <div
              style="text-align: right"
              class="text-[12px] text-[#FF3E3E] flex-shrink-0 cursor-pointer w-[60px] h-[30px]"
              @click.stop="customer"
              
            >
            <!-- @click.stop="toDetail(item.id, item.type)" -->
              {{$t('编辑')}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-[90%] mt-10 fixed bottom-[37px] left-1/2 -translate-x-1/2">
      <!-- <van-button
        color="#000000"
        v-if="showCardBtn"
        class="w-full"
        size="large"
        @click="addBank(1)"
      >
        <van-icon name="plus" class="pr-[20px]" />{{
          $t("添加银行卡")
        }}</van-button
      > -->
      <div class="h-[20px]"></div>
      <van-button
        v-if="showWalletBtn"
        color="#6a4d52"
        class="w-full"
        size="large"
        @click="addBank(2)"
      >
        <van-icon name="plus" class="pr-[20px]" />{{
          $t("添加钱包")
        }}</van-button
      >
    </div>
    <ContactUs ref="ContactUsRef"></ContactUs>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import { getUserBankWallet,getTradeConfig } from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { showToast } from "vant";
import {formatWithTimezone,checkWorkTimeLocal} from "../../util/utils"
const ContactUsRef = ref(null);
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const activeValue = ref(0);
const showCardBtn = ref(true);
const showWalletBtn = ref(true);
const form = reactive({
  withdrawName: "",
  withdrawAddress: "",
  withdrawType: "",
});

const TradeInfor = ref({})
const tradeConfig = async () => {
  let res = await getTradeConfig();
  TradeInfor.value = res.data;
}; 
const customer = () => {
  console.log(222)
  // const time = checkWorkTimeLocal(TradeInfor.value.workTimeStart, TradeInfor.value.workTimeEnd,userStore.zoneActive.tzName);;
  // if(time) {
  //    ContactUsRef.value.open();
  // } else {
  //   showToast(t("supportHours"))
  // }
  ContactUsRef.value.open();
};


const onClickLeft = () => {
  if (route.query.type == 1) {
    router.push({ path: "/my" });
  } else {
    router.push({ path: "/withdraw",query:{
      type:route.query.fromType
    } });
  }
};
const addBank = (type) => {
  if (type == 1) {
    router.push({ path: "/addCard" });
  } else {
    router.push({ path: "/addWallet" });
  }
};
// const toWallet = (item) => {
//   userStore.setuserWallerType(item);
//   router.push({ path: "/withdraw", query: item });
// };
const bankWallet = ref([]);
const getgetUserBankWallet = async () => {
  let res = await getUserBankWallet();
  bankWallet.value = res.data;
  bankWallet.value.forEach((item) => {
    if (item.type == 1) {
      showCardBtn.value = false;
    }
    if (item.type == 2) {
      showWalletBtn.value = false;
    }
  });

  if (
    userStore.userWallerType &&
    typeof userStore.userWallerType === "object" &&
    !Array.isArray(userStore.userWallerType) &&
    Object.keys(userStore.userWallerType).length > 0
  ) {
    activeValue.value = userStore.userWallerType.id;
  } else {
    activeValue.value = res.data.length != 0 ? res.data[0].id : 0;
  }
};
const selectEmits = (item) => {
  activeValue.value = item.id;
  userStore.setuserWallerType(item);
  // console.log(item)
  if (route.query.type == 1) {
    // router.push({ path: "/my" });
  } else {
    router.push({ path: "/withdraw", query: item });
  }
};
const toDetail = (id, type) => {
  if (type == 1) {
    router.push({
      path: "/addCard",
      query: {
        id: id,
      },
    });
  } else {
    router.push({
      path: "/addWallet",
      query: {
        id: id,
      },
    });
  }
};

onMounted(async () => {
  getgetUserBankWallet();
  tradeConfig();
  await userStore.getUserInfo();
  form.withdrawName = userStore.userInfo.withdrawName;
  form.withdrawAddress = userStore.userInfo.withdrawAddress;
  form.withdrawType = userStore.userInfo.withdrawType;
});
</script>
<style scoped>
.active {
  background: linear-gradient(to right, #ffffff, #fff6f0);
  border: 1px solid #fbdabb;
}
</style>
