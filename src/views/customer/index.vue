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
      <div class="text-[20px] text-[#fff] pb-[8px]">
        Contact Customer Service Center
      </div>
      <div class="text-[14px text-[#fff]">
        We provide professional support anytime
      </div>
      <div class="bg-gradient-to-b from-[#3F3D9D] to-[#6763D3]">
        <img src="" alt="" />
        <div>Online Customer Service</div>
        <div>
          Solve problems in real-time with customer service representatives
        </div>
        <div>
          Consult Now
          <van-icon
            name="arrow"
            color="#fff"
            size="22px"
            @click="onClickLeft"
          />
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
import { getCustomerService } from "@/api/apis";
const showCenter = ref(false);
const customerList = ref([]);
// 更符合Vue3习惯的暴露方式
const open = async () => {
  showCenter.value = true;
  let res = await getCustomerService();
  customerList.value = res.data;
  console.log(customerList.value);
};
const close = () => (showCenter.value = false);

const jump = (url) => {
  window.open(url);
};

defineExpose({
  open,
  close, // 新增关闭方法
});
</script>
