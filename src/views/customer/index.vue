<template>
  <div class="min-h-[100vh] bg-gradient-to-r from-[#002D72] to-[#0A4DA2]">
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
    <div class="px-[24px] pt-[24px]">
      <div class="text-[20px] text-[#fff] pb-[8px] font-bold">
        {{ $t("customer.str") }}
      </div>
      <div class="text-[14px text-[#fff]">
        {{ $t("customer.str1") }}
      </div>
      <div
        class="bg-gradient-to-b text-[#fff] from-[#3F3D9D] to-[#6763D3] rounded-[12px] p-[20px] mt-[24px]"
        v-for="item in customerList"
        @click="jump(item.linkUrl)"
      >
        <img
          class="w-[40px] h-[40px] mb-[6px]"
          src="../../static/images/customer.png"
          alt=""
        />
        <div class="text-[16px] font-bold mt-[2px]">
          {{ item.name }}
        </div>
        <div class="text-[12px]">
          {{ $t("customer.str3") }}
        </div>
        <div class="flex items-center text-[14px] justify-end text-right">
          {{ $t("customer.str4") }}
          <van-icon
            name="arrow"
            color="#fff"
            size="16px"
          />
        </div>
      </div>
      <div
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
      </div>
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
import { onMounted, ref } from "vue";
import { tr } from "element-plus/es/locales.mjs";
import { getCustomerService,getEmailAddress,userGetInfo } from "@/api/apis";
const showCenter = ref(false);
import md5 from "crypto-js/md5"; // 安装 crypto-js: npm install crypto-js
import { copyContent } from "@/util/utils";
const customerList = ref([]);
// 更符合Vue3习惯的暴露方式
const open = async () => {
  showCenter.value = true;
  let res = await getCustomerService();
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
  url.searchParams.set("visitor_id", visitorId);
  url.searchParams.set("visitor_name", username);

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
