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
import { getCustomerService } from '../api/apis';
const showCenter = ref(false);
const customerList = ref([])
// 更符合Vue3习惯的暴露方式
const open = async() =>{
  showCenter.value = true
  let res = await getCustomerService();
  customerList.value = res.data
  console.log(customerList.value)
}
const close = () => (showCenter.value = false);

const jump = (url) =>{
  window.open(url)
}

defineExpose({
  open,
  close // 新增关闭方法
});
</script>
