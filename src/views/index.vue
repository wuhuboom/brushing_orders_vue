<template>
  <div class="bg-[#fff]">
    <div
      class="relative h-[443px] w-full rounded-b-[40px]"
      style="overflow: hidden"
    >
      <img
        src="@/static/images/indexBg.png"
        alt="background"
        class="absolute inset-0 w-full h-[443px]"
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
    <div >
      <!-- 标题 -->
      <div class="flex justify-between items-center mb-[10px] p-4">
        <h2 class="text-[20px] font-semibold">Employee level</h2>
        <span class="text-[14px] text-[#F89C0D] cursor-pointer font-bold" @click="toVips">View More</span>
      </div>
      <div class="swiper-container">
        <swiper
          :modules="[EffectCoverflow, Pagination]"
          effect="coverflow"
          grab-cursor="true"
          centered-slides="true"
          slides-per-view="auto"
          :space-between="40"
          :looped-slides="levelList.length" 
          :initial-slide="1"
          :loop="true"
          :pagination="{
            el: '.custom-pagination',
            clickable: true,
          }"
          :coverflow-effect="{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false
          }"
          class="mySwiper"
           @swiper="onSwiper"
        >
          <swiper-slide v-for="(item, index) in levelList" :key="index">
            <div
              class="relative w-[285px] h-[190px] rounded-[15px] overflow-hidden shadow-xl"
            >
              <!-- 背景图 -->
              <img :src="item.bg" alt="" class="w-full h-full object-cover" />
              <!-- 遮罩层 -->
              <div class="absolute inset-0 "></div>
              <!-- 内容 -->
              <div class="absolute inset-0 p-5 flex flex-col text-white">
                <img class="w-[30px] h-[30px]" src="@/static/images/logowhite.png" alt="">
                <h3 class="text-[20px] font-bold mb-[21px] pt-[13px]">
                  {{ item.nameEn }}
                </h3>
                <div v-html="item.descriptionEn"></div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
        <!-- 自定义分页指示器 -->
        <div class="custom-pagination mt-[31px]  flex justify-center space-x-2"></div>
      </div>
    </div>
    <div class="">
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
import { onMounted, onUnmounted,ref, reactive, nextTick,onActivated,onDeactivated  } from "vue";
import { getLevel, getNoticeList, userGetInfo } from "../api/apis";
import { useRouter,useRoute } from "vue-router";
const tradePasswordRef = ref(null);
const ContactUsRef = ref(null);
const userInfo = ref({});
const swiperInstance = ref(null)
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination } from "swiper/modules";
// const vip_bg1 = new URL("@/static/images/vip_bg1.png", import.meta.url).href;
// const vip_bg2 = new URL("@/static/images/vip_bg2.png", import.meta.url).href;
defineOptions({
  name: "ListPage"
})
const bgImages  = [
  new URL("@/static/images/bgImages1.png", import.meta.url).href,
  new URL("@/static/images/bgImages2.png", import.meta.url).href,
  new URL("@/static/images/bgImages3.png", import.meta.url).href,
  new URL("@/static/images/bgImages4.png", import.meta.url).href,
];

const router = useRouter();
const route = useRoute();

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
    sessionStorage.setItem("fromRoute", path);
  }
}
function toVips() {
  router.push("/vips");
   sessionStorage.setItem("fromRoute", '/vips');
}
const levelList = ref([]);
function onSwiper(swiper) {
  swiperInstance.value = swiper
  level()
}
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
  levelList.value = levelList.value.map((item, index) => {
    return {
      ...item,
      bg: bgImages[index % bgImages.length] // 按顺序循环使用
    };
  });
  nextTick(() => {
    swiperInstance.value.slideToLoop(0, 0)
  })
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

window.addEventListener("updateTrade", (e) => {
  getUserGetInfo();
});

const getUserGetInfo = () => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
  });
};
const STORAGE_KEY = "ListPageScrollY"; // 本地缓存 key
const scrollTop = ref(0)
let container;
// 离开页面时记录滚动位置
onDeactivated(() => {
  sessionStorage.setItem(STORAGE_KEY, scrollTop.value);
});

// 回到页面时恢复滚动位置
onActivated(() => {
  const fromRoute = sessionStorage.getItem("fromRoute");
  sessionStorage.removeItem("fromRoute"); // 用完删除
  const scrollY = sessionStorage.getItem(STORAGE_KEY);
  if (scrollY && fromRoute) {
    container.scrollTo(0, +scrollY); // 容器滚动
  }
});

function handleScroll() {
  scrollTop.value = container.scrollTop;
}

onMounted(() => {
  container = document.getElementById("router-view");
  if (container) container.addEventListener("scroll", handleScroll);

  getData();
  getUserGetInfo();

});
onUnmounted(() => {
  if (container) container.removeEventListener("scroll", handleScroll);
});
</script>
<style>
.swiper-container {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 40px;
}

.mySwiper {
  width: 100%;
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 285px; /* 卡片宽度 */
  height: 190px; /* 卡片高度 */
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0.7; /* 默认偏暗 */
}

.swiper-slide-active {
  transform: scale(1.05); /* 中间放大 */
  opacity: 1 !important; /* 中间高亮 */
}

/* 自定义指示器样式 */
.custom-pagination .swiper-pagination-bullet {
  width: 50px;
  height: 3px;
  border-radius: 2px;
  background: #D8D8D8; /* 默认灰色 */
  opacity: 1;
  transition: all 0.3s ease;
}

.custom-pagination .swiper-pagination-bullet-active {
  background: #FE9A00; /* 选中橙色 */
}
</style>
