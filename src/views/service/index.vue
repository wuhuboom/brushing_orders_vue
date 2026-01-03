<template>
  <div class="bg-[#f8f8f8] h-[100vh]">
    <div class="relative">
      <div class="topfpnts">
        <div class="titles">Customer Service Center</div>
        <div class="casftr">Online customer service time 07:00-23:00（UK）</div>
      </div>
      <img src="@/static/images/servicebg.png" alt="" />
    </div>
    <div class="flex flex-col rounded bg-[#fff] mt-[10px]">
      <div
        @click="customer"
        class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#F0F0F0]"
      >
        <div class="flex items-center">
          <!-- <img src="@/static/images/setting.png" class="w-4 h-4 mr-2" alt="" /> -->
          <div class="text-[#333] text-[12px]">{{ $t("customer.str2") }}</div>
        </div>
        <van-icon name="arrow" color="#999" size="18px" />
      </div>
    </div>
    <ContactUs ref="ContactUsRef"></ContactUs>
    <Footer name="/"></Footer>
  </div>
</template>
<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Lang from "@/components/Lang.vue";
import ContactUs from "@/components/ContactUs.vue";
import { getStaticImageUrl } from "@/util/utils.js";
import { useI18n } from "vue-i18n";
import { getTradeConfig } from "../../api/apis";
import { useCommonStore } from "@/store/modules/common";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { checkWorkTimeLocal } from "../../util/utils";
const ContactUsRef = ref(null);
const { locale } = useI18n();
const router = useRouter();
const userStore = useUserStore();

const TradeInfor = ref({});
const tradeConfig = async () => {
  let res = await getTradeConfig();
  TradeInfor.value = res.data;
};
const customer = () => {
  const time = checkWorkTimeLocal(
    TradeInfor.value.workTimeStart,
    TradeInfor.value.workTimeEnd,
    userStore.zoneActive.tzName
  );
  if (time) {
    ContactUsRef.value.open();
  } else {
    showToast(t("supportHours"));
  }
};

onMounted(() => {
  tradeConfig();
});
</script>
<style scoped>
.topfpnts {
  box-sizing: border-box;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  top: 1.33333rem;
}
.titles {
  color: #6a4d52;
  font-size: 28px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
.casftr {
  color: #6a4d52;
  font-size: 12px;
  text-align: center;
}
</style>
