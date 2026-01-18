<template>
  <div class="min-h-[100vh] bg-[#f7f7f7]">
    <div
      class="relative bg-[#fff] flex items-center justify-center h-[56px] px-[16px]"
    >
      <div class="absolute left-[16px]">
        <van-icon
          name="arrow-left"
          color="#000"
          size="22px"
          @click="onClickLeft"
        />
      </div>
      <div class="text-base text-[#000000] font-medium">
        {{ $t("客服") }}
      </div>

      <!-- <div class="absolute right-[16px] text-base text-[#fff]">History</div> -->
    </div>
    <div class="px-[16px] pt-[24px]">
      <!-- <div class="text-[20px] text-[#fff] pb-[8px] font-bold">
        {{ $t("customer.str") }}
      </div>
      <div class="text-[14px text-[#fff]">
        {{ $t("customer.str1") }}
      </div> -->
      <div class="vipsBg">
        <div class="flex pt-[50px] pb-[3px]">
          <img class="w-[21px] h-[14px] mr-[6px]" src="@/static/images/24.png" alt="">
          <span class="hours"> {{$t('Customer.str1')}}</span>
        </div>
        <div class="text-[10px] text-[#333333]">{{$t('Customer.str')}}</div>

      </div>
      <div
        class="bg-[#fff] text-[#fff] rounded-[12px] p-[20px] mt-[24px] flex items-center justify-center"
        v-for="item in customerList"
        @click="jump(item.linkUrl)"
      >
        <img
          class="w-[40px] h-[40px] mr-[23px]"
          :src="VITE_API_IMG_URL+item.iconUrl"
          alt=""
        />
        <div>
          <div class="text-[16px] text-[#333333] mt-[2px] mb-[5px]">
            {{ item.name }}
          </div>
          <div class="text-[12px] text-[#999999]">
            {{ $t("customer.str3") }}
          </div>
        </div>
        <!-- <div class="flex items-center text-[14px] justify-end text-right">
          {{ $t("customer.str4") }}
          <van-icon
            name="arrow"
            color="#fff"
            size="16px"
          />
        </div> -->
      </div>
      <!-- <div
        class="bg-gradient-to-b text-[#fff] from-[#1E8C5F] to-[#4DB380] rounded-[12px] p-[20px] mt-[24px]"
        @click="copyContent(emailAddressInfo)"
      >
        <img
          class="w-[40px] h-[40px] mb-[6px]"
          src="../../static/images/email.png"
          alt=""
        />
        <div class="text-[16px] font-bold mt-[2px]">
          {{ $t("customer.str6") }}
        </div>
        <div class="text-[12px]">
          {{ $t("customer.str7") }}:{{emailAddressInfo}}
        </div>
        <div class="flex items-center text-[14px] justify-end text-right">
          {{ $t("customer.str5") }}
          <img class="w-[16px] h-[16px] ml-[4px]" src="../../static/images/copy.png" alt="">
        </div>
      </div> -->
    </div>

    <van-dialog
      v-model:show="showCenter"
      :showConfirmButton="false"
      closeOnClickOverlay
      cancelButtonColor="#005713"
      width="240px"
    >
      <div class="flex flex-col rounded-xl overflow-hidden bg-white">
        <div
          v-for="item in customerList"
          @click="jump(item.linkUrl)"
          class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#eef2f4]"
        >
          <div class="flex items-center">
            <img
              src="@/static/images/service.png"
              alt=""
              class="w-6 h-6 mr-3"
            />
            <div class="flex items-center">{{ item.name }}</div>
          </div>
          <van-icon name="arrow" color="#aeb4eb" size="18px" />
        </div>
      </div>
    </van-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref,computed } from "vue";
import { tr } from "element-plus/es/locales.mjs";
import { getCustomerService,getEmailAddress,userGetInfo,getCustomerServiceByLang } from "@/api/apis";
const showCenter = ref(false);
import { useUserStore } from '@/store/modules/user';
// import { useCommonStore } from "@/store/modules/common";
import md5 from "crypto-js/md5"; // 安装 crypto-js: npm install crypto-js
const VITE_API_IMG_URL = window.g.VITE_API_IMG_URL;
const userStore = useUserStore();
const parLang = computed(() => {
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang;
});
const customerList = ref([]);
// 更符合Vue3习惯的暴露方式
const open = async () => {
  showCenter.value = true;
  let res = await getCustomerServiceByLang( { lang: parLang.value });
  customerList.value = res.data;
  console.log(customerList.value);
};
const close = () => (showCenter.value = false);
const emailAddressInfo = ref({})
const emailAddress = async() =>{
  let res = await getEmailAddress();
  console.log(res)
  emailAddressInfo.value = res.data

}

const jump = (url) =>{
  const finalUrl = buildKefuUrl(url, userInfo.value.username);
  console.log(finalUrl)
  window.open(finalUrl)
}
function buildKefuUrl(baseUrl, username) {
  // 生成 visitor_id (用户名的 MD5)
  const visitorId = md5(username).toString();

  // 使用 URL 对象方便拼接参数
  const url = new URL(baseUrl);
  if (userStore.token){
    url.searchParams.set("visitor_id", visitorId);
    url.searchParams.set("visitor_name", username);
    console.log(visitorId)
  } 

  return url.toString();
}
const userInfo = ref({})
const getUserGetInfo = () => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
  });
};
const onClickLeft = () => history.back();
onMounted(async () => {
  emailAddress()
  getUserGetInfo()
  let res = await getCustomerService();
  customerList.value = res.data;
  console.log(customerList.value);
});

defineExpose({
  open,
  close, // 新增关闭方法
});
</script>
<style scoped>
  .vipsBg {
   background: url(../../static/images/customerBg.png) no-repeat center;
  background-size: cover;
  height: 130px;
  padding-left: 39px;
}
.hours {
  font-family: Gilroy, Gilroy;
  font-weight: 800;
  font-size: 20px;
  color: #000000;
  line-height: 14px;
  text-align: center;
  font-style: normal;
  text-transform: none;
}
</style>
