<template>
  <van-dialog v-model:show="showCenter" :showConfirmButton="false" show-cancel-button cancelButtonColor="#005713">
    <div class="flex flex-col rounded-xl overflow-hidden bg-white">
      <div
        class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#eef2f4]"
      >
        <div class="flex items-center">
          <img src="@/static/images/service.png" alt="" class="w-6 h-6 mr-3" />
          <div class="flex items-center">{{ $t("在线客服") }}</div>
        </div>
        <van-icon name="arrow" size="18px" />
      </div>
      <div
        class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#eef2f4]"
      >
        <div class="flex items-center">
          <img src="@/static/images/service.png" alt="" class="w-6 h-6 mr-3" />
          <div class="flex items-center">{{ $t("电报客户服务") }}</div>
        </div>
        <van-icon name="arrow" size="16px" />
      </div>
    </div>
  </van-dialog>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { tr } from "element-plus/es/locales.mjs";

const showCenter = ref(false);
// 更符合Vue3习惯的暴露方式
const open = () => (showCenter.value = true);
const close = () => (showCenter.value = false);

defineExpose({
  open,
  close // 新增关闭方法
});
</script>
