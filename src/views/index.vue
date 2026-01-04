<template>
  <div>
    <!-- <HeaderTop></HeaderTop> -->
     <div class="w-[100%] h-[40px] border bottom-1 px-[10px] py-[3px] shadow-[3px_3px_6px_rgba(68,93,158,0.11)]">
      <img class="w-[34px] h-[30px]" src="@/static/images/logos.jpg" alt="">
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
            class="flex justify-between pt-4 pb-2 text-base text-[#000] font-semibold"
          >
            <div class="w-[100%]">{{ $t("Platform introduction") }}</div>
            <!-- <div
              @click="toVips"
              class="w-[65%] font-normal text-xs text-[#5F5F5F] text-right flex justify-end items-center"
            >
              <div>{{ $t("查看更多") }}</div>
            </div> -->
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 px-[10px]">
          <div v-for="(item, index) in itemsArr"  @click="goTo(item.route)" :key="index">
            <img class="w-[180px] h-[140px]" :src="item.icon" alt="">
            <div class="text-[14px] text-[#333] pt-[5px] mb-[10px]">{{$t(item.name)}}</div>
            <!-- <div class="text-[12px] text-[#999]">Platform profile</div> -->
          </div>
        </div>
      </div>
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
  
  // {
  //   name: "事件",
  //   icon: new URL("@/static/images/icon-3.png", import.meta.url).href,
  //   route: "/event",
  // },
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
  // {
  //   name: "条款及细则", // 用于 $t('收入指南')
  //   icon: new URL("@/static/images/icon-2.png", import.meta.url).href,
  //   route: "/clause",
  // },
  // {
  //   name: "证书",
  //   icon: new URL("@/static/images/icon-4.png", import.meta.url).href,
  //   route: "/cert",
  // },
  // {
  //   name: "常见问题解答",
  //   icon: new URL("@/static/images/icon-6.png", import.meta.url).href,
  //   route: "/faqs",
  // },
  {
    name: "客服",
    icon: new URL("@/static/images/icon-8.png", import.meta.url).href,
    route: "/customer",
  },
  {
    name: "vips", // 用于 $t('收入指南')
    icon: new URL("@/static/images/icon-0.png", import.meta.url).href,
    route: "/vips",
  },
];

const itemsArr = [
  
  {
    name: "事件",
    icon: new URL("@/static/images/pro1.png", import.meta.url).href,
    route: "/event",
  },
  // {
  //   name: "提款",
  //   icon: new URL("@/static/images/icon-5.png", import.meta.url).href,
  //   route: "/notifications",
  // },
  // {
  //   name: "定金",
  //   icon: new URL("@/static/images/icon-7.png", import.meta.url).href,
  //   route: "/profile",
  // },
  {
    name: "条款及细则", // 用于 $t('收入指南')
    icon: new URL("@/static/images/pro2.png", import.meta.url).href,
    route: "/clause",
  },
  {
    name: "证书",
    icon: new URL("@/static/images/pro3.png", import.meta.url).href,
    route: "/cert",
  },
  {
    name: "常见问题解答",
    icon: new URL("@/static/images/pro4.png", import.meta.url).href,
    route: "/faqs",
  },
  // {
  //   name: "客服",
  //   icon: new URL("@/static/images/icon-8.png", import.meta.url).href,
  //   route: "/customer",
  // },
  // {
  //   name: "Invitation", // 用于 $t('收入指南')
  //   icon: new URL("@/static/images/icon-0.png", import.meta.url).href,
  //   route: "/guide",
  // },
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
