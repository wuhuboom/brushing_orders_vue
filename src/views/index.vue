<template>
  <div class="bg-[#fff]">
    <div
      class="relative h-[521px] w-full rounded-b-[40px]"
      style="overflow: hidden"
    >
      <img
        src="@/static/images/indexBg.png"
        alt="background"
        class="absolute inset-0 w-full h-[521px] object-cover"
      />
      <!-- 顶部导航栏 -->
      <div
        class="flex items-center justify-center relative h-[44px] bg-transparent text-white px-4"
      >
        <!-- 右边菜单按钮 -->
        <div class="absolute right-4">
          <img
            @click="toMy"
            src="@/static/images/user3.png"
            class="w-[22px] h-[22px]"
          />
        </div>
      </div>
      <!-- 下面内容 -->
      <!-- <div class="absolute bottom-6 w-full px-4 text-white">
        <div class="bg-[rgba(0,0,0,0.5)] rounded-xl p-4 flex items-center">
          <div
            class="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-3"
          >
            <span class="text-[#F4A300] font-bold">SUG</span>
          </div>
          <div class="text-sm leading-5">
            <p class="text-[20px]">OUR CUSTOMERS SOLD</p>
            <p class="text-[20px] text-[#D4AF37] font-bold text-lg">
              $1,000,000,000
            </p>
            <p class="text-[20px]">ON AMAZON LAST YEAR</p>
          </div>
        </div>
      </div> -->
    </div>

    <!-- 菜单列表 -->
    <div class="w-[95%] rounded-xl mt-[21px] mx-auto flex flex-col">
      <!-- <div class="pt-4 pr-4 pl-4 text-sm text-black">
          {{ $t("菜单列表") }}
        </div> -->
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

    <!-- 产品介绍   -->
    <div class="p-4">
      <!-- 标题 -->
      <div class="flex justify-between items-center mb-[25px]">
        <h2 class="text-[20px] font-semibold">Employee level</h2>
        <span class="text-[14px] text-[#F89C0D] cursor-pointer" @click="toVips">View More</span>
      </div>
      <!-- 轮播 -->
      <van-swipe
        class="my-swipe"
        :show-indicators="false"
        :width="290"
        :initial-swipe="1"
        @change="onChange"
      >
        <van-swipe-item
          v-for="(item, index) in cards"
          :key="index"
          class="transition-all duration-300"
          :class="current === index ? 'scale-100' : 'scale-90 opacity-70'"
        >
          <div
            class="relative w-[285px] h-[333px] rounded-[15px] overflow-hidden shadow-xl"
          >
            <!-- 背景图 -->
            <img :src="item.bg" alt="" class="w-full h-full object-cover" />
            <!-- 遮罩层 -->
            <div class="absolute inset-0 bg-black/40"></div>
            <!-- 内容 -->
            <div class="absolute inset-0 p-5 flex flex-col text-white">
              <img
                @click="toMy"
                src="@/static/images/logowhite.png"
                class="w-[30px] h-[30px] mt-[20px]"
              />
              <h3 class="text-[20px] font-bold mb-[21px] pt-[13px]">
                {{ item.title }}
              </h3>
              <ul class="space-y-2 text-sm leading-snug">
                <li
                  v-for="(line, i) in item.content"
                  :key="i"
                  class="flex items-start"
                >
                  <span class="text-[14px] leading-[1] mr-2">•</span>
                  <span>{{ line }}</span>
                </li>
              </ul>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
      <!-- 自定义指示器 -->
      <div class="flex justify-center mt-4 space-x-2">
        <span
          v-for="(item, i) in cards"
          :key="i"
          class="h-1 w-[50px] bg-gray-300"
          :class="current === i ? 'bg-orange-500' : 'bg-gray-300'"
        ></span>
      </div>
    </div>

    <div class="mt-[10px]">
      <img  src="@/static/images/a.png" alt="" />
      <img  class="w-[90%] mt-[-60px]  mx-auto" src="@/static/images/b.png" alt="" />
      <img  class="w-[90%] mt-[20px] mx-auto" src="@/static/images/c.png" alt="" />
      <img  class="w-[90%] mt-[20px] mx-auto" src="@/static/images/d.png" alt="" />
    </div>
    <!-- 产品介绍 -->
    <!-- <div class="py-4 pb-2">
      <div
        class="flex justify-between items-center text-black w-[90%] mx-auto mt-2 mb-3"
      >
        <div class="text-base font-bold">
          Welcome to New Hotels
          <div class="text-xs">Celebrate spring in style.</div>
        </div>
      </div>
      <div class="px-[10px]">
        <van-swipe
          :autoplay="1500"
          :show-indicators="false"
          :loop="false"
          :width="170"
        >
          <van-swipe-item
            v-for="item in vanList"
            :key="item"
            class="relative pr-[10px]"
          >
            <van-image
              width="160px"
              height="210px"
              fit="cover"
              :src="item.img"
            />
            <span class="absolute left-2 bottom-2 text-white text-sm">
              {{ item.name }}
            </span>
          </van-swipe-item>
        </van-swipe>
      </div>
    </div> -->
    <!-- 行情结束 -->
    <Footer name="/"></Footer>
    <tradePassword ref="tradePasswordRef"></tradePassword>
    <ContactUs ref="ContactUsRef"></ContactUs>
  </div>
</template>
<script setup>
import Footer from "@/components/Footer.vue";
import HeaderTop from "@/components/HeaderTop.vue";
import ContactUs from "@/components/ContactUs.vue";
import tradePassword from "@/components/tradePassword.vue";
import { onMounted, ref, reactive, computed } from "vue";
import { getLevel, getNoticeList, userGetInfo } from "../api/apis";
import { useRouter } from "vue-router";
const tradePasswordRef = ref(null);
const ContactUsRef = ref(null);
const userInfo = ref({});
const vip_bg1 = new URL("@/static/images/vip_bg1.png", import.meta.url).href;
const vip_bg2 = new URL("@/static/images/vip_bg2.png", import.meta.url).href;

const bgMap = {
  VIP1: new URL("@/static/images/vip_bg1.png", import.meta.url).href,
  VIP2: new URL("@/static/images/vip_bg1.png", import.meta.url).href,
  VIP3: new URL("@/static/images/vip_bg1.png", import.meta.url).href,
  VIP4: new URL("@/static/images/vip_bg2.png", import.meta.url).href,
};
const bgMapStart = {
  VIP1: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135431630339970.png",
  VIP2: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135444978440962.png",
  VIP3: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135461467660218.png",
  VIP4: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135471230297283.png",
};

const vanList = [
  {
    name: "Pan Pacific",
    img: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385275613579878400.png",
  },
  {
    name: "Holiday Inn Express & Suites At Seaworld",
    img: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385266569653821440.png",
  },
  {
    name: "Hilton City Santa Fe",
    img: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385266668555509760.png",
  },
  {
    name: "Mowbray Court Hotel",
    img: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385277575801118720.png",
  },
  {
    name: "Biz Cevahir Hotel Sultanahmet",
    img: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385287369291243520.png",
  },
  {
    name: "Country Mile Escape",
    img: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385269376146513920.png",
  },
  {
    name: "Di-Ann City Centre Hotel",
    img: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385264768284139520.png",
  },
  {
    name: "Campus Boutique Hotel",
    img: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385271272391352320.png",
  },
];

const current = ref(1);

const cards = ref([
  {
    title: "VIP1",
    bg: "https://picsum.photos/id/1011/400/300",
    content: [
      "Normal users receive general purpose data collection access.",
      "Suitable for most data capture scenarios",
      "Profit of 0.5% per product - 40 mission per set",
      "Up to 80 optimise mission per day",
    ],
  },
  {
    title: "VIP2",
    bg: "https://picsum.photos/id/1015/400/300",
    content: [
      "Higher profit margin: 1% per product",
      "Up to 100 missions per set",
      "Exclusive advanced data capture tools",
    ],
  },
  {
    title: "VIP3",
    bg: "https://picsum.photos/id/1016/400/300",
    content: [
      "Exclusive access for premium members",
      "Up to 200 missions per set",
      "Customised data optimisation",
    ],
  },
  {
    title: "VIP4",
    bg: "https://picsum.photos/id/1016/400/300",
    content: [
      "Exclusive access for premium members",
      "Up to 200 missions per set",
      "Customised data optimisation",
    ],
  },
]);

const onChange = (index) => {
  current.value = index;
};

const router = useRouter();

const items = [
  {
    name: "客服", // 用于 $t('收入指南')
    icon: new URL("@/static/images/service1.png", import.meta.url).href,
    icon_bg: new URL("@/static/images/icon_bg1.png", import.meta.url).href,
    route: "/server",
  },
  {
    name: "事件",
    icon: new URL("@/static/images/Event.png", import.meta.url).href,
    icon_bg: new URL("@/static/images/icon_bg2.png", import.meta.url).href,
    route: "/event",
  },
  {
    name: "提款",
    icon: new URL("@/static/images/Withdrawal.png", import.meta.url).href,
    icon_bg: new URL("@/static/images/icon_bg3.png", import.meta.url).href,
    route: "/notifications",
  },
  {
    name: "定金",
    icon: new URL("@/static/images/Deposit1.png", import.meta.url).href,
    icon_bg: new URL("@/static/images/icon_bg4.png", import.meta.url).href,
    route: "/profile",
  },
  {
    name: "条款及细则", // 用于 $t('收入指南')
    icon: new URL("@/static/images/T&C.png", import.meta.url).href,
    icon_bg: new URL("@/static/images/icon_bg5.png", import.meta.url).href,
    route: "/clause",
  },
  {
    name: "证书",
    icon: new URL("@/static/images/Certificate.png", import.meta.url).href,
    icon_bg: new URL("@/static/images/icon_bg1.png", import.meta.url).href,
    route: "/cert",
  },
  {
    name: "常见问题解答",
    icon: new URL("@/static/images/FAQs.png", import.meta.url).href,
    icon_bg: new URL("@/static/images/icon_bg2.png", import.meta.url).href,
    route: "/faqs",
  },
  {
    name: "关于",
    icon: new URL("@/static/images/About.png", import.meta.url).href,
    icon_bg: new URL("@/static/images/icon_bg3.png", import.meta.url).href,
    route: "/about",
  },
];

function goTo(path) {
  if (path == "/notifications") {
    tradePasswordRef.value.open(2);
  } else if (path == "/profile") {
    tradePasswordRef.value.open(3);
  } else if (path == "/server") {
    ContactUsRef.value.open();
  } else {
    router.push(path);
  }
}
function toVips() {
  router.push("/vips");
}
const levelList = ref([]);
const level = async () => {
  let res = await getLevel();
  levelList.value = res.data;
  levelList.value.forEach((item) => {
    if (item.descriptionEn) {
      // 把 ● 包到带 class 的 span 里（注意：这里保留了 ●）
      item.descriptionEn = item.descriptionEn.replace(
        /(●|•|&#8226;|&#9679;)/g,
        '<span class="small-dot">●</span>'
      );
    }
  });
};
const toMy = () => {
  router.push({ path: "/my" });
};

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

window.addEventListener("updateTrade", (e) => {
  getUserGetInfo();
});

const getUserGetInfo = () => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
  });
};

onMounted(() => {
  level();
  getData();
  getUserGetInfo();
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

.my-swipe {
  width: 100%;
  padding: 0 50px;
  box-sizing: border-box;
}

/* .my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 360px;
  text-align: center;
  background-color: #39a9ed;
} */
/* .my-swipe .van-swipe-item img {
  width: 100%;
  height: 100%;
}
.my-swipe2 .van-swipe-item {
  width: 160px;
  height: 210px;
}
.my-swipe2 .van-swipe-item img {
  width: 100%;
  height: 100%;
} */
</style>
