<template>
  <div class="container w-full min-h-[100vh] bg-white">
    <van-sticky type="primary">
      <van-nav-bar
        :title="$t('修改信息')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
    <div class="w-full p-6 box-border flex flex-col mt-10">
      <div class="flex flex-col bg-[#e8f7ec]">
        <div
          class="flex items-center justify-between p-4 box-border border-b-[2px] border-[#fff]"
          @click="toPage('/profile')"
        >
          <div class="flex items-center text-black text-sm font-medium">
            {{ $t("修改个人信息") }}
          </div>
          <van-icon name="arrow" size="22px" />
        </div>
        <div
          class="flex items-center justify-between p-4 box-border border-b-[2px] border-[#fff]"
        >
          <div class="flex items-center text-black text-sm font-medium">
            {{ $t("用户名") }}
          </div>
          <div class="text-[#666] text-sm font-medium">用户名称</div>
        </div>
        <div
          class="flex items-center justify-between p-4 box-border border-b-[2px] border-[#fff]"
        >
          <div class="flex items-center text-black text-sm font-medium">
            {{ $t("电话") }}
          </div>
          <div class="text-[#666] text-sm font-medium">1111</div>
        </div>
      </div>
      <div class="mt-4 flex flex-col bg-[#e8f7ec]">
        <div
          class="flex items-center justify-between p-4 box-border border-b-[2px] border-[#fff]"
          @click="toPage('/updatePassword')"
        >
          <div class="flex items-center text-black text-sm font-medium">
            {{ $t("更新密码") }}
          </div>
          <van-icon name="arrow" size="18px" />
        </div>
        <div
          class="flex items-center justify-between p-4 box-border border-b-[2px] border-[#fff]"
          @click="toPage('/updateTransactionPassword')"
          >
          <div class="flex items-center text-black text-sm font-medium">
            {{ $t("更新交易密码") }}
          </div>
          <van-icon name="arrow" size="18px" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const toPage = (path) => {
  router.push({
    path: path,
  });
};
const onClickLeft = () => history.back();
</script>
