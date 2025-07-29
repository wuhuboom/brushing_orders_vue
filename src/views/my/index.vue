<template>
  <div class="w-full h-[100vh] overflow-y-scroll bg-white flex flex-col pb-6">
    <HeaderTop></HeaderTop>
    <div class="w-full py-6">
      <div class="w-[90%] mx-auto">
        <div class="w-[12rem] mx-auto relative" style="z-index: 99">
          <img
            src="https://bigwnew.oss-ap-northeast-1.aliyuncs.com/msr/175158136029064048.jpg"
            class="w-[6rem] h-[6rem] mx-auto rounded-full"
            alt=""
          />
        </div>
        <div
          class="w-full p-4 mt-[-3rem] pb-10 relative"
          :style="{
            background: `url(${bgImage}) 0 0 / 100% 100% no-repeat`,
          }"
        >
          <div class="text-white text-center absolute top-5 right-5">
            <img
              src="https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/172232700615694005.png"
              class="w-12"
              alt=""
            />
            <p class="text-[#fff] text-sm font-semibold">VIP1</p>
          </div>
          <div class="w-full text-center mt-[2rem]">
            <div class="flex text-white text-lg flex-col">
              <p class="text-2xl font-bold text-white">mao1</p>
              <p class="text-xs flex justify-center items-center">
                <span>{{$t('邀请码')}}:: </span>
                <span>N34BFL</span>
                <img
                  src="@/static/images/copy.png"
                  class="w-4 h-4 ml-2"
                  alt=""
                />
              </p>
            </div>
          </div>
          <div
            class="w-full mt-3 flex justify-start items-center pl-1 pr-1 text-white"
          >
            <div class="text-[10px] mr-2">{{$t('信用评分')}}:</div>
            <div class="flex-auto"></div>
            <div class="text-white text-[10px] ml-1">100%</div>
          </div>
          <div
            class="w-full flex items-center pt-4 pb-4 text-center box-border overflow-hidden mt-4"
          >
            <div class="w-[50%] flex flex-col justify-center items-center">
              <div class="text-[#fff] text-[12px]">
                {{$t('钱包余额')}}
                <div>(USD)</div>
              </div>
              <div class="text-xs text-[#fff] mt-1">
                <span class="text-base font-semibold">0</span>
              </div>
            </div>
            <div class="w-[1px] h-8 bg-[#fff]"></div>
            <div class="w-[50%] flex flex-col justify-center items-center">
              <div class="text-[#fff] text-[12px]">
                {{$t('今天委员会')}}
                <div>(USD)</div>
              </div>
              <div class="text-xs text-[#fff] mt-1">
                <span class="text-base font-semibold">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的财务 -->
    <div class="flex flex-col w-[90%] mx-auto mt-2">
      <div class="mt-4 mb-4 text-[var(--main-color)] text-base font-semibold">
        {{ $t("我的财务") }}
      </div>
      <div class="flex flex-col rounded-xl bg-[#fff]">
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
          @click="toPage('/deposit')"
        >
          <div class="flex items-center justify-between w-full" >
            <div class="text-[#000] text-sm font-medium">
              {{ $t("定金") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
        >
          <div class="flex items-center justify-between w-full">
            <div class="text-[#000] text-sm font-medium">
              {{ $t("提取") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
      </div>
    </div>

    <!-- 我的详细信息 -->
    <div class="flex flex-col w-[90%] mx-auto mt-2">
      <div class="mt-4 mb-4 text-[var(--main-color)] text-base font-semibold">
        {{ $t("我的详细信息") }}
      </div>
      <div class="flex flex-col rounded-xl bg-[#fff]">
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
        >
          <div class="flex items-center justify-between w-full">
            <div class="text-[#000] text-sm font-medium">
              {{ $t("个人信息") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
        >
          <div class="flex items-center justify-between w-full">
            <div class="text-[#000] text-sm font-medium">
              {{ $t("付款方式") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
      </div>
    </div>

    <!-- 其他 -->
     <div class="flex flex-col w-[90%] mx-auto mt-2">
      <div class="mt-4 mb-4 text-[var(--main-color)] text-base font-semibold">
        {{ $t("其他") }}
      </div>
      <div class="flex flex-col rounded-xl bg-[#fff]">
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
        >
          <div class="flex items-center justify-between w-full">
            <div class="text-[#000] text-sm font-medium">
              {{ $t("联系我们") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
        >
          <div class="flex items-center justify-between w-full">
            <div class="text-[#000] text-sm font-medium">
              {{ $t("通知") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
        >
          <div class="flex items-center justify-between w-full">
            <div class="text-[#000] text-sm font-medium">
              {{ $t("登出") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
        <div
          class="flex items-center justify-between p-4 pl-2 box-border border-b-[1px] border-[#ccc]"
        >
          <div class="flex items-center justify-between w-full">
            <div class="text-[#000] text-sm font-medium">
              {{ $t("更改语言") }}
            </div>
            <van-icon name="arrow" size="22px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import HeaderTop from "@/components/HeaderTop.vue";
const bgImage = new URL("@/static/images/profile_bg1.png", import.meta.url)
  .href;
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter()
const toPage = (path) =>{
    router.push({
        path: path
    }) 
}
</script>
