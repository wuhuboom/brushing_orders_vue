<template>
  <div>
    <HeaderTop></HeaderTop>
    <!-- <div class="w-full h-[400px] relative">
      <div class="pb-4 pt-4 absolute top-5 w-full h-[400px]" style="z-index: 2">
        <div class="mx-auto pt-5">
          <div
            class="text-center text-2xl lg:text-5xl font-semibold text-white"
          >
            {{ $t("我们通过数字营销") }}
            {{ $t("帮助小型企业盈利") }}
          </div>
        </div>
      </div>
      <div class="w-full absolute bottom-0 overflow-hidden">
        <van-notice-bar
          color="#fff"
          background="rgba(0,0,0,0.5)"
          :text="pureNoticeContent"
        >
          <template #left-icon>
            <img src="@/static/images/notice.png" class="w-5 h-5" alt="icon" />
          </template>
        </van-notice-bar>
      </div>
      <video class="w-full h-[400px] object-cover" src="https://videos.pexels.com/video-files/1448735/1448735-uhd_4096_2160_24fps.mp4" autoplay muted loop playsinline></video>
    </div> -->
    <div class="relative bg-white">
      <!-- 菜单列表 -->
      <div class="w-[95%] rounded-xl mx-auto flex flex-col">
        <div class="p-4 text-lg font-semibold text-black">
          {{ $t("菜单列表") }}
        </div>
        <div class="w-full p-4 grid grid-cols-4 gap-4">
          <div
            class="flex flex-col w-full justify-center rounded-lg items-start text-center box-border text-[#000]"
            v-for="(item, index) in items"
            :key="index"
            @click="goTo(item.route)"
          >
            <div class="w-full">
              <img class="mx-auto w-12 h-12" :src="item.icon" alt="" />
            </div>
            <span class="mx-auto text-center text-xs mt-1 whitespace-nowrap">
              {{ $t(item.name) }}
            </span>
          </div>
        </div>
      </div>
      <!-- 员工等级 -->
      <div class="bg-[#e9e9e9] w-full mx-auto">
        <div class="w-[90%] mx-auto">
          <div
            class="flex justify-between pt-4 pb-2 text-base text-black font-semibold"
          >
            <div class="w-[35%]">{{$t('员工等级')}}</div>
            <div
              @click="toVips"
              class="w-[65%] font-normal text-xs text-[var(--main-color)] text-right flex justify-end items-center"
            >
              <div>{{$t('查看更多')}}</div>
              <img class="w-5 ml-2" src="@/static/images/more1.png" alt="" />
            </div>
          </div>
        </div>
        <div class="items-con flex overflow-x-scroll p-4">
          <div
            v-for="item in levelList"
            class="vip-item flex flex-col box-border rounded-xl p-4 bg-[#F2F7FF] mr-3"
            :style="{
              background: `url(${
                bgMap[item.name]
              }) 0 0 / 100% 100% no-repeat`,
            }"
          >
            <div class="flex justify-between items-start">
              <div class="font-bold text-lg">
                <p class="mt-4 text-[var(--main-color)]">
                  {{ item.name }}
                </p>
              </div>
              <img class="w-24" :src="bgMapStart[item.name]" alt="" />
            </div>
            <div class="w-[260px] text-xs mt-2 text-black" >
              <p class="w-[260px] text-xs mt-2 text-black" v-html="item.description"></p>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="w-full bg-[#F0F9FF] mb-[30px]">
        <div class="test-[#333] text-center text-sm p-4 mb-3">Business Partner</div>
        <img class="w-[90%] mx-auto" src="@/static/images/b.png" alt="" /> 
      </div> -->
      <!-- <img class="w-full" src="@/static/images/a.png" alt="" /> -->

      
      <!-- <img class="w-full" src="@/static/images/b.png" alt="" /> -->
    </div>
    <div class="w-full py-14 bg-[#f1894c]">

    </div>

    <!-- 行情结束 -->
    <Footer name="/"></Footer>
    <tradePassword ref="tradePasswordRef"></tradePassword>
    <wheel ref="wheelRef"></wheel>
  </div>
</template>
<script setup>
import Footer from "@/components/Footer.vue";
import HeaderTop from "@/components/HeaderTop.vue";
import tradePassword from "@/components/tradePassword.vue";
import wheel from "@/components/wheel.vue";
import { onMounted, ref, reactive, computed } from "vue";
import { getLevel,getLevelByLang, getNoticeList,getUserDraws,getLotteryConfig } from "../api/apis";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from '@/store/modules/common';
const userStore = useUserStore();
const tradePasswordRef = ref(null);
const commonStore = useCommonStore();
const parLang = computed(() => {
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang; 
});
const wheelRef = ref(null);
const borderMap = {
  VIP1: "#FDE68A",
  VIP2: "#93C5FD",
  VIP3: "#C4B5FD",
  VIP4: "#6EE7B7",
  VIP5: "#FBCFE8",
};

const bgMap = {
  VIP1: new URL("@/static/images/bg_vip1.png", import.meta.url).href,
  VIP2: new URL("@/static/images/bg_vip2.png", import.meta.url).href,
  VIP3: new URL("@/static/images/bg_vip3.png", import.meta.url).href,
  VIP4: new URL("@/static/images/bg_vip4.png", import.meta.url).href,
  VIP5: new URL("@/static/images/bg_vip5.png", import.meta.url).href,
};
const bgMapStart = {
  VIP1: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/172232700615694005.png",
  VIP2: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722327038574353214.png",
  VIP3: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/172232706362679225.png",
  VIP4: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722327102801555071.png",
  VIP5: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722342635975654072.png",
};

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
    name: "条款及细则", // 用于 $t('收入指南')
    icon: new URL("@/static/images/icon-2.png", import.meta.url).href,
    route: "/clause",
  },
  {
    name: "证书",
    icon: new URL("@/static/images/icon-4.png", import.meta.url).href,
    route: "/cert",
  },
  {
    name: "常见问题解答",
    icon: new URL("@/static/images/icon-6.png", import.meta.url).href,
    route: "/faqs",
  },
  {
    name: "关于",
    icon: new URL("@/static/images/icon-8.png", import.meta.url).href,
    route: "/about",
  },
];

function goTo(path) {
  if (path == "/notifications") {
    // tradePasswordRef.value.open(2);
    router.push('/withdraw');
  } else if (path == "/profile") {
    // tradePasswordRef.value.open(3);
    router.push('/deposit');
  } else {
    router.push(path);
  }
}
function toVips() {
  router.push("/vips");
}
const levelList = ref([]);
const level = async () => {
  let res = await getLevelByLang({ lang: parLang.value });
  // let res = await getLevel();
  levelList.value = res.data;
  levelList.value.forEach((item) => {
    if (item.description) {
      // 把 ● 包到带 class 的 span 里（注意：这里保留了 ●）
      item.description = item.description.replace(
        /(●|•|&#8226;|&#9679;)/g,
        '<span class="small-dot">●</span>'
      );
    }
  });
};

const userDraws =async () =>{
  let res = await getUserDraws();
  console.log(res)
  if(res.code ==200) {
    wheelRef.value.open();
  }
}

const query = reactive({
  pageNum: 1,
  pageSize: 10,
});
const noticeContent = ref("");

const getData = async () => {
  const res = await getNoticeList(query); // 你自己的接口
  console.log(res);
  noticeContent.value = res.rows.length > 0 ? res.rows[0].noticeContent : "";
};

// 计算属性，去除所有HTML标签
const pureNoticeContent = computed(() => {
  return noticeContent.value.replace(/<\/?[^>]+(>|$)/g, "");
});
// 获取转盘配置
const lotteryConfig = async () => {
  try {
    const res = await getLotteryConfig();
    userDraws()
  } catch (err) {
    console.log(9999)
    console.error("获取转盘配置失败:", err);
  }
};

onMounted(() => {
  level();
  getData();
  
  lotteryConfig()
  userStore.getUserInfo();
  //  wheelRef.value.open();
  
    
});
</script>
<style>
.small-dot {
  font-size: 8px; /* 调整大小 */
  line-height: 1;
  vertical-align: middle;
  display: inline-block; /* 保证可以控制尺寸/对齐 */
  /* 如需更细微缩放也可用 transform: scale(0.8); */
}
</style>
