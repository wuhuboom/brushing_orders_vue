<template>
  <div class="w-full min-h-[100vh] bg-[#fff]">
    <van-nav-bar
      :title="$t('Bank Card Management')"
      fixed
      left-arrow
      @click-left="onClickLeft"
    />
    <div
      class="mt-[80px] px-[20px] flex justify-between items-center mb-[16px]"
    >
      <div>My Bank Cards</div>
      <!-- <van-icon name="deletes-o" color="#EF4444" size="24px" /> -->
    </div>
    <div
      class="flex items-center mx-[20px] border border-[#EEEEEE] p-[17px] rounded-[20px] mt-[32px]"
      :class="activeValue == item.id ? 'active' : ''"
      v-for="(item, index) in bankWallet"
      :key="index"
      @click="selectEmits(item.id, item.type)"
    >
      <img
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
      />
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
            @click="toWallet(item)"
          />
          <img
            @click="toWallet(item)"
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
              class="text-[12px] text-[#FF3E3E]"
              @click="toDetail(item.id, item.type)"
            >
              Edit
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
              class="text-[12px] text-[#FF3E3E] flex-shrink-0 cursor-pointer"
              @click="toDetail(item.id, item.type)"
            >
              Edit
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-[90%] mt-10 fixed bottom-[37px] left-1/2 -translate-x-1/2">
      <van-button
        color="#000000"
        v-if="showCardBtn"
        class="w-full"
        size="large"
        @click="addBank(1)"
      >
        <van-icon name="plus" class="pr-[20px]" />{{
          $t("Add Bank Card")
        }}</van-button
      >
      <div class="h-[20px]"></div>
      <van-button
        v-if="showWalletBtn"
        color="#F09F39"
        class="w-full"
        size="large"
        @click="addBank(2)"
      >
        <van-icon name="plus" class="pr-[20px]" />{{
          $t("Add Wallet ")
        }}</van-button
      >
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import { getUserBankWallet } from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { showToast } from "vant";
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();
const activeValue = ref(0);
const showCardBtn = ref(true);
const showWalletBtn = ref(true);
const form = reactive({
  withdrawName: "",
  withdrawAddress: "",
  withdrawType: "",
});
const submitForm = async () => {
  if (!form.withdrawName) return showToast(t("请输入钱包名称"));
  if (!form.withdrawAddress) return showToast(t("请输入网络"));
  if (!form.withdrawAddress) return showToast(t("请输入地址"));
  let res = await addWithdrawalMethod(form);
  showToast(t("添加成功"));
  router.push({ path: "/my" });
};

const onClickLeft = () => {
  router.push({ path: "/my" });
};
const addBank = (type) => {
  if (type == 1) {
    router.push({ path: "/addCard" });
  } else {
    router.push({ path: "/addWallet" });
  }
};
const toWallet = (item) => {
  userStore.setuserWallerType(item);
  router.push({ path: "/withdraw", query: item });
};
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

  activeValue.value = res.data.length != 0 ? res.data[0].id : 0;
};
const selectEmits = (id, type) => {
  activeValue.value = id;
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
