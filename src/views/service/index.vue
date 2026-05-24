<template>
  <div class="service-page min-h-[100vh]">
    <div class="service-page__hero relative">
      <div class="topfpnts">
        <div class="titles">{{$t('customer_service_center')}}</div>
        <div class="casftr">{{$t('online_customer_service_time')}}: {{ TradeInfor?.workTimeStart || "--:--" }} -
                {{ TradeInfor?.workTimeEnd || "--:--" }} <br /></div>
      </div>
      <img src="@/static/images/servicebg.png" alt="" />
    </div>
    <div class="service-page__menu flex flex-col rounded mt-[10px]">
      <div
        @click="customer"
        class="service-page__menu-item flex items-center justify-between p-4 box-border bg-[#fff]"
      >
        <div class="flex items-center">
          <!-- <img src="@/static/images/setting.png" class="w-4 h-4 mr-2" alt="" /> -->
          <div class="text-[#333] text-[14px]">{{ $t("customer.str2") }}</div>
        </div>
        <van-icon name="arrow" color="#999" size="18px" />
      </div>
      <div
        @click="help"
        class="service-page__menu-item flex items-center justify-between p-4 box-border mt-[10px] bg-[#fff]"
      >
        <div class="flex items-center">
          <!-- <img src="@/static/images/setting.png" class="w-4 h-4 mr-2" alt="" /> -->
          <div class="text-[#333] text-[14px]">{{ $t("help") }}</div>
        </div>
        <van-icon name="arrow" color="#999" size="18px" />
      </div>
    </div>
    <ContactUs ref="ContactUsRef"></ContactUs>
    <Footer name="/service"></Footer>
  </div>
</template>
<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Lang from "@/components/Lang.vue";
import ContactUs from "@/components/ContactUs.vue";
import { getStaticImageUrl } from "@/util/utils.js";
import { useI18n } from "vue-i18n";
import { showToast } from "@/util/message";
import { getTradeConfig } from "../../api/apis";
import { useCommonStore } from "@/store/modules/common";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { checkWorkTimeLocal } from "../../util/utils";
const ContactUsRef = ref(null);
const { locale, t } = useI18n();
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

const help = () =>{
  router.push("/faqs");
}

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
