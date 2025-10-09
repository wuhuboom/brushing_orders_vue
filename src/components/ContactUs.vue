<template>
  <div>
    <van-dialog
    v-model:show="showCenter"
    :showConfirmButton="false"
    closeOnClickOverlay
    cancelButtonColor="#ff9662"
    width="95%"
  >
    <div class="flex flex-col rounded-xl overflow-hidden bg-white">
      <div
        v-for="item in customerList"
        @click="jump(item.linkUrl)"
        class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#eef2f4]"
      >
        <div class="flex items-center">
          <img
            :src="item.iconUrl ? VITE_API_IMG_URL + item.iconUrl : defaultImg"
            alt=""
            class="w-[40px] h-[40px] mr-3"
          />
          <div class="flex items-center text-[14px]">{{ item.name }}</div>
        </div>
        <van-icon name="arrow" color="#1658b6" size="16px" />
      </div>
      <div
       @click="copyContent(emailAddressInfo)"
        class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#eef2f4]"
      >
        <div class="flex items-center" >
          <img src="@/static/images/emailAddress.png" alt="" class="w-[40px] h-[40px] mr-3" />
          <div class="flex items-center text-[14px]">{{ emailAddressInfo }}</div>
        </div>
        <van-icon name="arrow" color="#1658b6" size="16px" />
      </div>
    </div>
    <div class="w-full flex items-center justify-center pt-3 pb-3" @click="close">
      <span class="text-sm text-[#ff9662]">{{$t('取消')}}</span>
    </div>
  </van-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { tr } from "element-plus/es/locales.mjs";
import { copyContent } from "../util/utils";
import md5 from "crypto-js/md5"; // 安装 crypto-js: npm install crypto-js
import { getCustomerService,userGetInfo,getEmailAddress } from '../api/apis';
const defaultImg = new URL('@/static/images/service.png', import.meta.url).href;
const showCenter = ref(false);
const customerList = ref([])
const VITE_API_IMG_URL = window.g.VITE_API_IMG_URL;
// 更符合Vue3习惯的暴露方式
const open = async() =>{
  showCenter.value = true
  emailAddress()
  let res = await getCustomerService();
  customerList.value = res.data
  getUserGetInfo()
  console.log(customerList.value)
}

const emailAddressInfo = ref({})
const emailAddress = async() =>{
  let res = await getEmailAddress();
  console.log(res)
  emailAddressInfo.value = res.data

}


const userInfo = ref({})
const getUserGetInfo = () => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
  });
};

const close = () => (showCenter.value = false);

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

defineExpose({
  open,
  close // 新增关闭方法
});
</script>
