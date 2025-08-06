<template>
  <div>
    <HeaderTop></HeaderTop>
    <div class="w-full bg-[#f8f8f8] relative">
      <div class="w-full h-full py-5">
        <div
          class="flex w-[90%] mx-auto justify-between mt-4 mb-4 items-center"
        >
          <div class="flex">
            <img
              style="width: 50px; height: 50px; border-radius: 50%"
              src="@/static/images/user2.png"
              alt=""
            />
            <div class="flex items-center pl-2">
              <div class="text-black font-semibold">Hi, {{userInfo.username}}</div>
            </div>
          </div>
          <div class="text-black font-semibold">VIP{{ userInfo.levelId }}</div>
        </div>
      </div>
      <div class="w-[100%] px-4 mx-auto">
        <div class="grid grid-cols-1 gap-3">
          <div
            class="w-full col-span-1 flex p-3 box-border rounded-xl bg-[#fff] border-[1px] border-[#EDEDEE]"
          >
            <div class="w-full flex justify-between">
              <div class="flex items-center">
                <img
                  class="w-10 h-10 mr-3"
                  src="@/static/images/icon-21.png"
                  alt=""
                />
                <div class="flex flex-col justify-around">
                  <div class="text-[#000] text-sm font-bold mb-1">
                    {{$t('钱包余额')}}
                  </div>
                  <div class="text-[#999] text-[10px]">
                    {{$t('佣金将在此处添加')}}
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-end text-right">
                <div class="text-sm text-[var(--main-color)] font-bold mb-1">
                  {{ userInfo.balance }}
                </div>
                <div class="text-[#999] text-xs">usd</div>
              </div>
            </div>
          </div>
          <div
            class="w-full col-span-1 flex p-3 box-border rounded-xl bg-[#fff] border-[1px] border-[#EDEDEE]"
          >
            <div class="w-full flex justify-between">
              <div class="flex items-center">
                <img
                  class="w-10 h-10 mr-3"
                  src="@/static/images/icon-22.png"
                  alt=""
                />
                <div class="flex flex-col justify-around">
                  <div class="text-[#000] text-sm font-bold mb-1">
                    {{$t('持有金额')}}
                  </div>
                  <div class="text-[#999] text-[10px]">
                    {{$t('如有疑问，请联系客服')}}
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-end text-right">
                <div class="text-sm text-[var(--main-color)] font-bold mb-1">
                   {{ userInfo.totalBalance }}
                </div>
                <div class="text-[#999] text-xs">usd</div>
              </div>
            </div>
          </div>
          <div
            class="w-full col-span-1 flex p-3 box-border rounded-xl bg-[#fff] border-[1px] border-[#EDEDEE]"
          >
            <div class="w-full flex justify-between">
              <div class="flex items-center">
                <img
                  class="w-10 h-10 mr-3"
                  src="@/static/images/icon-20.png"
                  alt=""
                />
                <div class="flex flex-col justify-around">
                  <div class="text-[#000] text-sm font-bold mb-1">
                    {{$t('当日佣金')}}
                  </div>
                  <div class="text-[#999] text-[10px]">
                     {{$t('每日赚取佣金')}}
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-end text-right">
                <div class="text-sm text-[var(--main-color)] font-bold mb-1">
                  {{ userInfo.commission }}
                </div>
                <div class="text-[#999] text-xs">usd</div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5 flex justify-between text-black font-bold text-base">
          <div>Start Optimization</div>
          <div>
            <span class="text-[var(--main-color)]">21</span>/<span>40</span>
          </div>
        </div>
        <div class="mt-5 flex flex-col p-4 box-border bg-[#f1f1f1] rounded-xl">
          <div class="mt-5 flex flex-col box-border bg-[#f1f1f1] rounded-xl">
            <div class="w-full grid grid-cols-3 gap-6">
              <div
                class="grid-span-1 text-[#666666] text-center text-xs font-normal"
              >
                <div
                  class="p-2 overflow-hidden"
                  style="
                    background-image: radial-gradient(
                      circle at 100% 0%,
                      rgb(247, 247, 247) 0%,
                      rgb(252, 252, 252) 106%
                    );
                    border-radius: 8px;
                  "
                >
                  <div class="overflow-hidden">
                    <img
                      src="https://bigwnew.oss-ap-northeast-1.aliyuncs.com/nextleft/202501246635190013342556160.png"
                      class="w-[100px] h-[100px] lg:w-[296px] lg:h-[296px]"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div
                class="grid-span-1 text-[#666666] text-center text-xs font-normal"
              >
                <div
                  class="p-2 overflow-hidden"
                  style="
                    background-image: radial-gradient(
                      circle at 100% 0%,
                      rgb(247, 247, 247) 0%,
                      rgb(252, 252, 252) 106%
                    );
                    border-radius: 8px;
                  "
                >
                  <div class="overflow-hidden">
                    <img
                      src="https://bigwnew.oss-ap-northeast-1.aliyuncs.com/nextleft/202501246635190013342556160.png"
                      class="w-[100px] h-[100px] lg:w-[296px] lg:h-[296px]"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div
                class="grid-span-1 text-[#666666] text-center text-xs font-normal"
              >
                <div
                  class="p-2 overflow-hidden"
                  style="
                    background-image: radial-gradient(
                      circle at 100% 0%,
                      rgb(247, 247, 247) 0%,
                      rgb(252, 252, 252) 106%
                    );
                    border-radius: 8px;
                  "
                >
                  <div class="overflow-hidden">
                    <img
                      src="https://bigwnew.oss-ap-northeast-1.aliyuncs.com/nextleft/202501246635190013342556160.png"
                      class="w-[100px] h-[100px] lg:w-[296px] lg:h-[296px]"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div
                class="grid-span-1 text-[#666666] text-center text-xs font-normal"
              >
                <div
                  class="p-2 overflow-hidden"
                  style="
                    background-image: radial-gradient(
                      circle at 100% 0%,
                      rgb(247, 247, 247) 0%,
                      rgb(252, 252, 252) 106%
                    );
                    border-radius: 8px;
                  "
                >
                  <div class="overflow-hidden">
                    <img
                      src="https://bigwnew.oss-ap-northeast-1.aliyuncs.com/nextleft/202501246635190013342556160.png"
                      class="w-[100px] h-[100px] lg:w-[296px] lg:h-[296px]"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div class="grid-span-1 text-center text-xs font-normal">
                <div
                  class="flex items-center justify-center overflow-hidden rounded-xl bg-cover text-lg text-white font-medium relative"
                >
                  <div class="overflow-hidden">
                    <img
                      src="@/static/images/start-button.png"
                      class="w-[100%] shadow"
                      alt=""
                    />
                    <div class="absolute"></div>
                  </div>
                </div>
              </div>
              <div
                class="grid-span-1 text-[#666666] text-center text-xs font-normal"
              >
                <div
                  class="p-2 overflow-hidden"
                  style="
                    background-image: radial-gradient(
                      circle at 100% 0%,
                      rgb(247, 247, 247) 0%,
                      rgb(252, 252, 252) 106%
                    );
                    border-radius: 8px;
                  "
                >
                  <div class="overflow-hidden">
                    <img
                      src="https://bigwnew.oss-ap-northeast-1.aliyuncs.com/nextleft/202501246635190013342556160.png"
                      class="w-[100px] h-[100px] lg:w-[296px] lg:h-[296px]"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-[90%] mx-auto pt-5">
        <div class="mt-4 rounded-lg bg-[#f5f5f5]">
          <div class="flex flex-col p-4 box-border relative rounded-xl">
            <div class="mb-2 text-black text-base font-bold">Notice</div>
            <div class="text-black text-sm font-light">
              Online Support Hours 10:00 - 22:59 <br />
              Please contact online support for your assistance!
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 pb-4"></div>
    </div>

    <Footer name="/starting"></Footer>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import HeaderTop from "@/components/HeaderTop.vue";
import Footer from "@/components/Footer.vue";
import { userGetInfo } from "../../api/apis";
const url = import.meta.env.VITE_API_IMG_URL;
const userInfo = ref({});
const avatarUrl = ref("");

onMounted(() => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    avatarUrl.value = `${url}${res.data.userLevel.icon}`;
    console.log(userInfo.value);
  });
});
</script>
