<template>
  <div>
    <!-- <HeaderTop></HeaderTop> -->
    <!-- <div class="py-[20px]">
      <img class="w-[278px] pl-[16px]" src="@/static/images/logo1.png" alt="" />
    </div> -->
    <div
      class="w-full  text-[#fff] relative "
    >
     <video
        src="https://onlinesalesadvisors.com/wp-content/uploads/2023/07/shutterstock_7847272.mp4"
        autoplay
        muted
        loop
        playsinline
        class="w-full h-[800px] object-cover"
      ></video>
      <div class="absolute top-0 left-0 p-[24px] h-[100%] elementor-background-overlay" >
        <img class="w-[200px] pl-[16px] pt-[29px]" src="@/static/images/logo1.png" alt="" />
        <div class="p-[24px] w-[200px]">
          <p class="flex flex-col text-[30px] font-roboto pt-[20px] leading-[40px]">
            <span class="">{{$t('index.str1')}}</span>
            <span class="text-[#FF9500] font-bold">{{$t('index.str2')}}</span>
          </p>
        </div>
        <p class="text-[#fff] text-[14px] px-[16px]  leading-[25px]">{{$t('index.str3')}}</p>
        <div class="flex justify-between px-[20px] pt-[43px] pb-[52px]">
          <div class="bg-[#1A1410] p-[17px] rounded-[8px] w-[166px]">
            <div class="text-[#FF9500] text-[24px] pb-[14px]">25%</div>
            <div class="text-[#fff] text-[12px]">{{$t('index.str4')}}</div>
          </div>
          <div class="bg-[#1A1410] p-[17px] rounded-[8px] w-[166px]">
            <div class="text-[#FF9500] text-[24px] pb-[14px]">35%</div>
            <div class="text-[#fff] text-[12px]">{{$t('index.str5')}}</div>
          </div>
        </div>
        </div>
      
      <!-- <p class="flex flex-col text-[20px] pt-[70px]">
        <span class="pb-[20px]">{{$t('index.str4')}}</span>
        <span>{{$t('index.str5')}}</span>
      </p> -->
      
    </div>
    <div class="relative bg-[#F7F7F7]">
      <!-- 菜单列表 -->
      <div class="w-[95%] rounded-xl mx-auto flex flex-col">
        <!-- <div class="p-4 text-lg font-semibold text-black">
          {{ $t("菜单列表") }}
        </div> -->
        <div class="w-full px-4 py-8 grid grid-cols-4 gap-4">
          <div
            class="flex flex-col w-full rounded-lg items-start text-center box-border text-[#2A2A2A]"
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
    </div>
     <!-- 员工等级 -->
      <div class="w-full mx-auto bg-gradient-to-b from-[#FFF8F0] to-[#FFFFFF]">
        <div class="text-center">
          <div class="text-[26px] text-[#2D1810] font-bold pb-[8px] pt-[29px]">{{$t('VIP 会员')}}</div>
          <div class="text-[#666666] text-[14px]">{{$t('解锁专属权益和高级服务')}}</div>
        </div>
        <div class="flex overflow-x-scroll p-4">
          <div
            v-for="item in levelList"
            class="flex flex-col box-border rounded-xl p-4 bg-[#F2F7FF] mr-3"
            :style="{
              background: `url(${bgMap[item.nameEn]}) 0 0 / 100% 100% no-repeat`,
            }"
          >
            <div class="flex justify-between items-start pb-[15px] pl-[8px]">
              <div class="font-bold text-lg">
                <p
                  :style="{
                    color: textMap[item.nameEn],
                  }"
                >
                  {{ item.nameEn }}
                </p>
              </div>
              <!-- <img class="w-24" :src="bgMapStart[item.name]" alt="" /> -->
            </div>
            <div
              class="w-[260px] text-xs text-[#fff] pt-[3px] pl-[8px]"
              style="line-height: 19px"
            >
              <p class="pb-[12px] pt-[13px]">{{$t('index.str12')}} .{{item.commissionRatio}}%</p>
              <p>{{$t('index.str12')}} . {{item.commissionRatio}}% {{$t('index.str13')}}. {{item.orderCount}} {{$t('index.str14')}}</p>
              <p class="w-[260px] text-xs mt-2 text-black" v-html="item.description"></p>
            </div>
          </div>
        </div>
        <div
            @click="toVips"
            class="w-[90%] mt-[20px] text-white text-lg font-semibold mx-auto py-3 rounded-[8px] flex items-center justify-center bg-gradient-to-r from-[#FF9500] to-[#FF7A00]"
          >
            <div>{{ $t("升级会员") }}</div>
          </div>
      </div>
    <div class="p-[25px] w-full we">
      <p class="text-[#2D1810] text-[26px] text-base text-center font-bold w-[150px] m-auto leading-[30px]">
        {{$t('index.str6')}}
      </p>
      <p class="text-[#666666] text-center pt-[10px]">
        {{$t('index.str7')}}
      </p>
      <div class="elementor-wrapper">
        <video
          src="https://onlinesalesadvisors.com/wp-content/uploads/2023/07/IMG_0-1.mp4"
          autoplay
          muted
          loop
          playsinline
          class="w-full h-[240px] object-cover"
        ></video>

      </div>
      
      <!-- <img class="w-full mt-[15px]" src="@/static/images/index1bg.png" alt="" /> -->
    </div>
    <div
      class="p-[25px] w-full bg-gradient-to-r from-[#000] to-[#1C1C1C]"
      style="border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb"
    >
      <p class="text-[#fff] text-center text-[26px] text-base pb-[43px] pt-[20px]">
        {{$t('index.str8')}}
      </p>
      <p class="text-[#fff] text-center pt-[10px]">
        {{$t('index.str9')}}
      </p>
      <img class="w-full mt-[15px]" src="@/static/images/index2bg.png" alt="" />
    </div>
    <div class="bg-[#000] mt-[-1px] pt-[76px] text-[#fff]">
      <div class="flex justify-center">
        <img class="w-[40px] h-[40px] ml-[16px]" src="@/static/images/down1bg.png" alt="">
        <img class="w-[40px] h-[40px] ml-[16px]" src="@/static/images/down2bg.png" alt="">
        <img class="w-[40px] h-[40px] ml-[16px]" src="@/static/images/down3bg.png" alt="">
        <img class="w-[40px] h-[40px] ml-[16px]" src="@/static/images/down4bg.png" alt="">
      </div>
      <div class="flex justify-center mt-[19px]">
        <img class="w-[16px] h-[16px] mt-[2px]" src="@/static/images/address.png" alt="">
        <span>Phoenix AZ</span>
      </div>
      <div class="mt-[22px] text-[#666666] text-center">Powered by WebionAuze</div>
      <div class="mt-[22px] text-[#666666] text-center pb-[58px]">All rights Reserved - <span>OSA 2023 </span></div>
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
import { onMounted, ref, reactive, computed,onActivated,onDeactivated,onUnmounted,defineOptions } from "vue";
import { checkWorkTimeLocal } from "../util/utils";
import { showSuccessToast, showToast } from "vant";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import {
  getLevel,
  getTradeConfig,
  getNoticeList,
  getUserDraws,
  getLotteryConfig,
} from "../api/apis";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from "@/store/modules/common";
const userStore = useUserStore();
const tradePasswordRef = ref(null);
const commonStore = useCommonStore();
const parLang = computed(() => {
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang;
});
console.log(parLang.value)
defineOptions({
  name: "ListPage"
})
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

const textMap = {
  VIP1: "#fff",
  VIP2: "#2D1810",
  VIP3: "#8B6914",
  VIP4: "#0077B6",
  VIP5: "#FFFFFF",
};
const customer = () => {
  const time = checkWorkTimeLocal(
    TradeInfor.value.workTimeStart, 
    TradeInfor.value.workTimeEnd,
    userStore.zoneActive.tzName
  );
  if (time) {
    router.push('/customer');
    // ContactUsRef.value.open();
  } else {
    showToast(t("supportHours"));
  }
};

const TradeInfor = ref({});
const tradeConfig = async () => {
  let res = await getTradeConfig();
  TradeInfor.value = res.data;
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
    route: "/tc",
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
    name: "客服",
    icon: new URL("@/static/images/icon-8.png", import.meta.url).href,
    route: "/customer",
  },
];

function goTo(path) {
  console.log(path)
  if (path == "/notifications") {
    // tradePasswordRef.value.open(2);
    router.push({
      path:'/withdraw',
      query:{
        type:1
      }
    });
    sessionStorage.setItem("fromRoute", '/withdraw');
  } else if (path == "/profile") {
    // tradePasswordRef.value.open(3);
    router.push("/deposit");
    sessionStorage.setItem("fromRoute", '/deposit');
  }  else {
    router.push(path);
    sessionStorage.setItem("fromRoute", path);
  }
}
function toVips() {
  router.push("/vips");
  sessionStorage.setItem("fromRoute", '/vips');
}
const levelList = ref([]);
const level = async () => {
  // { lang: parLang.value }
  let res = await getLevel();
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

const userDraws = async () => {
  let res = await getUserDraws();
  console.log(res);
  if (res.code == 200) {
    wheelRef.value.open();
  }
};

// const query = reactive({
//   pageNum: 1,
//   pageSize: 10,
// });
// const noticeContent = ref("");

// const getData = async () => {
//   const res = await getNoticeList(query); // 你自己的接口
//   console.log(res);
//   noticeContent.value = res.rows.length > 0 ? res.rows[0].noticeContent : "";
// };

// // 计算属性，去除所有HTML标签
// const pureNoticeContent = computed(() => {
//   return noticeContent.value.replace(/<\/?[^>]+(>|$)/g, "");
// });
// 获取转盘配置
const lotteryConfig = async () => {
  try {
    const res = await getLotteryConfig();
    userDraws();
  } catch (err) {
    console.log(9999);
    console.error("获取转盘配置失败:", err);
  }
};

const STORAGE_KEY = "ListPageScrollY"; // 本地缓存 key
const scrollTop = ref(0)
let container;

function handleScroll() {
  scrollTop.value = container.scrollTop;
  console.log(scrollTop.value)
}

onMounted(() => {
  level();
  // getData();
  tradeConfig()
  // lotteryConfig()
  userStore.getUserInfo();
  //  wheelRef.value.open();
});
// 回到页面时恢复滚动位置
onActivated (() => {
  const fromRoute = sessionStorage.getItem("fromRoute");
  console.log(fromRoute)
  sessionStorage.removeItem("fromRoute"); // 用完删除
  const scrollY = sessionStorage.getItem(STORAGE_KEY);
  if (scrollY && fromRoute) {
    container.scrollTo(0, +scrollY); // 容器滚动
  }
  container = document.getElementById("router-view");
  if (container) container.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  if (container) container.removeEventListener("scroll", handleScroll);
});
onDeactivated(() => {
  // 离开页面时记录滚动位置
  sessionStorage.setItem(STORAGE_KEY, scrollTop.value);
});
</script>
<style scoped>
.small-dot {
  font-size: 8px; /* 调整大小 */
  line-height: 1;
  vertical-align: middle;
  display: inline-block; /* 保证可以控制尺寸/对齐 */
  /* 如需更细微缩放也可用 transform: scale(0.8); */
}
.we {
  background: url("../static/images/indexbg1.png") no-repeat center / 100% 100%;
  font-family: "Roboto, Bold";
}
.elementor-background-overlay {
    background-color: transparent;
    background-image: linear-gradient(215deg, #000000 15%, #252525 80%);
    opacity: 0.84;
    transition: background 0.3s, border-radius 0.3s, opacity 0.3s;
}
.elementor-wrapper video {
    background-color: #000;
    border: none;
    display: flex;
    height: 100%;
    width: 90%;
    margin: 20px auto;
    
}
</style>
