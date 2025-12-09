<template>
  <div>
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
        <div class="flex items-center" >
          <img src="@/static/images/service.png" alt="" class="w-6 h-6 mr-3" />
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
import { useUserStore } from '@/store/modules/user';
import md5 from "crypto-js/md5"; // 安装 crypto-js: npm install crypto-js
import { getCustomerService,userGetInfo } from '../api/apis';
const showCenter = ref(false);
const customerList = ref([])
const userStore = useUserStore();
// 更符合Vue3习惯的暴露方式
const open = async() =>{
  showCenter.value = true
  let res = await getCustomerService();
  getUserGetInfo()
  customerList.value = res.data
  console.log(customerList.value)
}
const close = () => (showCenter.value = false);

const jump = (url) =>{
  const finalUrl = buildKefuUrl(url, userInfo.value.username);
  console.log(finalUrl)
  window.open(finalUrl)
}


function buildKefuUrl(baseUrl, username) {
  const visitorId = crypto.randomUUID(); // 每次都不同！

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

defineExpose({
  open,
  close // 新增关闭方法
});
</script>
