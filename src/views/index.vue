<template>
  <div>
    <HeaderTop></HeaderTop>
    <div class="w-full relative">
      <div class="pb-4 pt-4 absolute top-5 w-full" style="z-index: 2">
        <div class="w-[90%] mx-auto">
          <div class="w-full overflow-hidden rounded-full">
            <van-notice-bar
              color="#fff"
              left-icon="volume-o"
              background="#007513"
              text="无论我们能活多久，我们能够享受的只有无法分割的此刻，此外别无其他。"
            />
          </div>
        </div>
        <div class="w-[90%] mx-auto pt-5">
          <div
            class="text-center text-2xl lg:text-5xl font-semibold text-white"
          >
            <font dir="auto" style="vertical-align: inherit">
              <font dir="auto" style="vertical-align: inherit"
                >我们通过数字营销</font
              >
              <font dir="auto" style="vertical-align: inherit"
                >帮助小型企业盈利</font
              >
            </font>
          </div>
        </div>
        <div class="flex justify-center items-center mt-4">
          <div
            class="text-white mr-1 px-4 py-1 bg-[var(--main-color)] text-sm text-center"
          >
            雇佣我们
          </div>
          <div
            class="text-white ml-1 px-4 py-1 bg-[var(--main-color)] text-sm text-center"
          >
            与我们合作
          </div>
        </div>
      </div>

      <img src="@/static/images/bg.jpg" alt="" />
    </div>
    <div class="relative bg-white">
      <!-- 菜单列表 -->
      <div class="w-[95%] rounded-xl mx-auto flex flex-col">
        <div class="p-4 text-lg font-semibold text-black">
          {{ $t("菜单列表") }}
        </div>
        <div class="w-full p-6 grid grid-cols-4 gap-4">
          <div
            class="flex flex-col w-full justify-center rounded-lg items-start text-center box-border text-[#000]"
            v-for="(item, index) in items"
            :key="index"
            @click="goTo(item.route)"
          >
            <div class="w-full">
              <img class="mx-auto w-12 h-12" :src="item.icon" alt="" />
            </div>
            <span class="mx-auto text-center text-xs mt-1">
              {{ $t(item.name) }}
            </span>
          </div>
        </div>
      </div>
      <div class="bg-[#e8f7ec] w-full mx-auto">
        <div class="w-[90%] mx-auto">
          <div
            class="flex justify-between pt-4 pb-2 text-base text-black font-semibold"
          >
            <div class="w-[35%]">员工级别</div>
            <div
              class="w-[65%] font-normal text-xs text-[var(--main-color)] text-right flex justify-end items-center"
            >
              <div>查看更多</div>
              <img class="w-5 ml-2" src="@/static/images/more1.png" alt="" />
            </div>
          </div>
        </div>
        <div class="items-con flex overflow-x-scroll p-4">
          <div
            v-for="item in lever"
            class="vip-item flex flex-col box-border rounded-xl p-4 bg-[#F2F7FF] mr-3"
            :style="{
              background: `url(${item.bgImage}) 0 0 / 100% 100% no-repeat`,
            }"
          >
            <div class="flex justify-between items-start">
              <div class="font-bold text-lg">
                <p class="mt-4 text-[var(--main-color)]">{{ $t(item.name) }}</p>
              </div>
              <img class="w-24" :src="item.start" alt="" />
            </div>
            <div class="w-[260px] text-xs mt-2 text-black">
              <p v-html="item.con"></p>
            </div>
          </div>
        </div>
      </div>
      <img class="w-full" src="@/static/images/a.png" alt="" />
      <img class="w-full" src="@/static/images/b.png" alt="" />
    </div>

    <!-- 行情结束 -->
    <Footer name="/"></Footer>
  </div>
</template>
<script setup>
import Footer from "@/components/Footer.vue";
import HeaderTop from "@/components/HeaderTop.vue";
import { onMounted, ref } from "vue";
import { reqGetBannerList, reqGetHotCoinList } from "../api/apis";
import { useRouter } from "vue-router";
const bannerList = ref([]);
const hot = ref([]);
const router = useRouter();

const items = [
  {
    name: "收入指南", // 用于 $t('收入指南')
    icon: new URL("@/static/images/icon-0.png", import.meta.url).href,
    route: "/guide",
  },
  {
    name: "事件",
    icon: new URL("@/static/images/icon-3.png", import.meta.url).href,
    route: "/event",
  },
  {
    name: "提款",
    icon: new URL("@/static/images/icon-5.png", import.meta.url).href,
    route: "/notifications",
  },
  {
    name: "定金",
    icon: new URL("@/static/images/icon-7.png", import.meta.url).href,
    route: "/profile",
  },
  {
    name: "收入指南", // 用于 $t('收入指南')
    icon: new URL("@/static/images/icon-2.png", import.meta.url).href,
    route: "/income-guide",
  },
  {
    name: "事件",
    icon: new URL("@/static/images/icon-4.png", import.meta.url).href,
    route: "/events",
  },
  {
    name: "提款",
    icon: new URL("@/static/images/icon-6.png", import.meta.url).href,
    route: "/notifications",
  },
  {
    name: "定金",
    icon: new URL("@/static/images/icon-8.png", import.meta.url).href,
    route: "/profile",
  },
];

const lever = [
  {
    name: "VIP1",
    bgImage: new URL("@/static/images/bg_vip1.png", import.meta.url).href,
    start:
      "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/172232700615694005.png",
    con: `普通用户可获得通用数据收集访问权限。<br />
          ● 适用于大多数涉及轻度到中度使用的数据采集场景<br />
          ● 每件产品利润 0.5% - 每套 40 个任务<br />
          ● 每天最多 80 个优化任务<br />
          ● 无法访问其他高级功能`,
  },
  {
    name: "VIP2",
    bgImage: new URL("@/static/images/bg_vip2.png", import.meta.url).href,
    start:
      "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722327038574353214.png",
    con: `VIP 2 用户可以无限制使用平台的所有功能。根据我们的更新活动进行的存款可获得奖励 <br />
    ●每个任务 1% 的利润 - 每套优化产品 45 <br />
      ●更好的利润和权限 <br />
      ●VIP 2 用户每天最多可以提交 90 个任务 <br />
      ●完全访问所有其他高级功能 <br />
      ●登录 15 天后可以邀请下属`,
  },
  {
    name: "VIP3",
    bgImage: new URL("@/static/images/bg_vip3.png", import.meta.url).href,
    start:
      "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/172232706362679225.png",
    con: `VIP 3 用户可以无限制使用平台的所有功能。根据我们更新活动的存款可获得奖励<br />
    ●每个任务1.5%的利润 - 每套优化产品50个 <br />
          ●更好的利润和权限 <br />
          ●VIP 3用户每天最多可以提交100个任务 <br />
          ●完全访问所有其他高级功能 <br />
          ●升级到VIP 3后可以邀请下属`,
  },
  {
    name: "VIP4",
    bgImage: new URL("@/static/images/bg_vip4.png", import.meta.url).href,
    start:
      "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722327102801555071.png",
    con: `VIP 4 用户可以无限制使用平台的所有功能。根据我们的更新活动进行的存款可获得奖励<br />
    ●每个任务 2% 的利润 - 每套优化产品 55<br />
          ●更好的利润和权限 <br />
          ●VIP 4 用户每天最多可以提交 110 个任务 <br />
          ●完全访问所有其他高级功能 <br />
          ●升级到 VIP 4 后可以邀请下属`,
  },
  {
    name: "VIP5",
    bgImage: new URL("@/static/images/bg_vip1.png", import.meta.url).href,
    start:
      "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722342635975654072.png",
    con: `
    VIP 5 用户可以无限制使用平台的所有功能。根据我们的更新活动进行的存款可获得奖励 <br />
    ●每个任务 2.5% 的利润 - 每套优化产品 60 个 <br />
        ●更好的利润和权限 <br />
        ●VIP 5 用户每天最多可以提交 120 个任务 <br />
        ●完全访问所有其他高级功能 <br />
        ●升级到 VIP 5 后可以邀请下属`,
  },
];
function goTo(path) {
  router.push(path);
}
onMounted(() => {});
</script>
<style scoped></style>
