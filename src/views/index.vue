<template>
  <div>
    <!-- <HeaderTop></HeaderTop> -->
    <div class="py-[20px]">
      <img class="w-[278px] pl-[16px]" src="@/static/images/logo1.png" alt="" />
    </div>
    <div
      class="w-full h-[352px] text-[#fff] relative"

    >
     <video
        src="https://www.directagents.com/wp-content/uploads/2025/06/Sequence-04_5_compressed_v2.mp4"
        autoplay
        muted
        loop
        playsinline
        class="w-full h-[352px] object-cover"
      ></video>
      <div class="absolute top-0 left-0 p-[24px]">
        <p class="flex flex-col text-[36px] font-roboto pt-[20px]">
        <span class="pb-[26px]">{{$t('index.str1')}}</span>
        <span class="pb-[26px]">{{$t('index.str2')}}</span>
        <span>{{$t('index.str3')}}</span>
      </p>
      <p class="flex flex-col text-[20px] pt-[70px]">
        <span class="pb-[20px]">{{$t('index.str4')}}</span>
        <span>{{$t('index.str5')}}</span>
      </p>
      </div>
      
    </div>
    <div class="relative bg-white">
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
      <!-- 员工等级 -->
      <div class="w-full mx-auto">
        <div class="w-[90%] mx-auto">
          <div
            class="flex justify-between pt-4 pb-2 text-base text-[#002D72] font-semibold"
          >
            <div class="w-[35%]">{{ $t("员工等级") }}</div>
            <div
              @click="toVips"
              class="w-[65%] font-normal text-xs text-[#5F5F5F] text-right flex justify-end items-center"
            >
              <div>{{ $t("查看更多") }}</div>
              <!-- <img class="w-5 ml-2" src="@/static/images/more1.png" alt="" /> -->
            </div>
          </div>
        </div>
        <div class="flex overflow-x-scroll p-4">
          <div
            v-for="item in levelList"
            class="flex flex-col box-border rounded-xl p-4 bg-[#F2F7FF] mr-3"
            :style="{
              background: `url(${bgMap[item.nameEn]}) 0 0 / 100% 100% no-repeat`,
            }"
          >
            <div class="flex justify-between items-start pt-[13px]">
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
              class="w-[260px] text-xs text-black pt-[3px]"
              style="line-height: 19px"
            >
              <p>{{$t('index.str12')}} .{{item.commissionRatio}}%</p>
              <p>{{$t('index.str12')}} . {{item.commissionRatio}}% {{$t('index.str13')}}. {{item.orderCount}} {{$t('index.str14')}}</p>
              <p class="w-[260px] text-xs mt-2 text-black" v-html="item.description"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-[25px] w-full we">
      <p class="text-[#002D72] text-[20px] text-base">
        {{$t('index.str6')}}
      </p>
      <p class="text-[#4B5563] pt-[10px]">
        {{$t('index.str7')}}
      </p>
      <img class="w-full mt-[15px]" src="@/static/images/index1bg.png" alt="" />
    </div>
    <div
      class="p-[25px] w-full"
      style="border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb"
    >
      <p class="text-[#002D72] text-[20px] text-base">
        {{$t('index.str8')}}
      </p>
      <p class="text-[#4B5563] pt-[10px]">
        {{$t('index.str9')}}
      </p>
      <img class="w-full mt-[15px]" src="@/static/images/index2bg.png" alt="" />
    </div>
    <div class="p-[25px] w-full">
      <p class="text-[#002D72] text-[20px] text-base">
       {{$t('index.str10')}}
      </p>
      <p class="text-[#4B5563] pt-[10px]">
        {{$t('index.str11')}}
      </p>
      <img class="w-full mt-[15px]" src="@/static/images/index3bg.png" alt="" />
    </div>
    <div class="w-full px-[17px]">
      <img class="w-full" src="@/static/images/a.png" alt=""></img>
    </div>
   <img class="w-full" src="@/static/images/b.png" alt=""></img>
    

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
  VIP1: "#3647B4",
  VIP2: "#B43694",
  VIP3: "#1061C0",
  VIP4: "#BC3217",
  VIP5: "#754705",
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
    name: "客服",
    icon: new URL("@/static/images/icon-8.png", import.meta.url).href,
    route: "/customer",
  },
];

function goTo(path) {
  console.log(path)
  if (path == "/notifications") {
    // tradePasswordRef.value.open(2);
    router.push("/withdraw");
  } else if (path == "/profile") {
    // tradePasswordRef.value.open(3);
    router.push("/deposit");
  } else if(path == '/customer'){
    customer()
  } else {
    router.push(path);
  }
}
function toVips() {
  router.push("/vips");
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

onMounted(() => {
  level();
  // getData();
  tradeConfig()
  // lotteryConfig()
  userStore.getUserInfo();
  //  wheelRef.value.open();
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
</style>
