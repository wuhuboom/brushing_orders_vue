<template>
  <div class="container w-full min-h-[100vh] bg-[#f3f3f3]">
    <van-sticky type="primary">
      <van-nav-bar
        :title="$t('修改信息')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
    <div class="w-full p-6 box-border flex flex-col mt-10">
      <div class="flex flex-col bg-[#fff] rounded-[20px]">
        <div
          class="flex items-center justify-between py-4 mx-[15px] box-border border-b-[1px] border-[#f3f3f3]"
          @click="toPage('/profile')"
        >
          <div class="flex items-center text-black text-sm font-medium">
            {{ $t("修改个人信息") }}
          </div>
          <van-icon name="arrow" color="#206645" size="18px" />
        </div>
        <div
          class="flex items-center justify-between py-4 mx-[15px] box-border border-b-[1px] border-[#f3f3f3]"
        >
          <div class="flex items-center text-[#666] text-sm">
            {{ $t("用户名") }}
          </div>
          <div class="text-black text-sm ">{{userStore.userInfo.username}}</div>
        </div>
        <div
          class="flex items-center justify-between py-4 mx-[15px] box-border border-b-[1px] border-[#f3f3f3]"
        >
          <div class="flex items-center text-[#666] text-sm">
            {{ $t("电话") }}
          </div>
          <div class="text-black text-sm ">{{userStore.userInfo.phone}}</div>
        </div>
      </div>
      <div class="mt-4 flex flex-col bg-[#fff] rounded-[20px]">
        <div
          class="flex items-center justify-between p-4 box-border border-b-[2px] border-[#fff]"
          @click="toPage('/updatePassword')"
        >
          <div class="flex items-center text-black text-sm ">
            {{ $t("更新密码") }}
          </div>
          <van-icon name="arrow" color="#206645" size="18px" />
        </div>
        <div
          class="flex items-center justify-between p-4 box-border border-b-[2px] border-[#fff]"
          @click="toPage('/updateTransactionPassword')"
          >
          <div class="flex items-center text-black  text-sm">
            {{ $t("更新交易密码") }}
          </div>
          <van-icon name="arrow" color="#206645" size="18px" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from '../../store/modules/user';
import { computed, onMounted, ref } from 'vue';
const userStore = useUserStore()
const router = useRouter();
const toPage = (path) => {
  router.push({
    path: path,
  });
};
onMounted(() => {
  userStore.getUserInfo()
})
  const onClickLeft = () => router.replace('/my');
</script>
