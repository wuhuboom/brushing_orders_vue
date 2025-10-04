<template>
  <div class="bg-[#fff]">
    <div
        class="w-full flex justify-between shadow-md items-center px-4 py-2 box-border bg-[#000]"
      >
        <div class="w-[var(--header-logo-width)]" @click="jump">
          <img class="w-[32px] h-[32px]" src="@/static/images/logo.png" alt="" />
        </div>
        <div class="flex justify-start items-center">
           <img
            src="@/static/images/ENImg.png"
            class="w-[22px]"
            alt=""
            @click="handleChangeLang"
          />
          <img
            src="@/static/images/myImg.png"
            class="w-[22px] ml-[16px]"
            alt=""
            @click="toMy"
          />
        </div>
    </div>
    
    <div class="h-[333px]">
      <van-swipe class="my-swipe h-[333px]"  :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="item in bannerArr" :key="item.id">
          <img
          :src="VITE_API_IMG_URL+item.imageUrl"
          alt="background"
          class="absolute inset-0 w-full h-[333px]"
        />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="w-full ">
        <van-notice-bar
          color="#000"
          background="#fff"
          :text="pureNoticeContent"
        >
          <template #left-icon>
            <img src="@/static/images/notice.png" class="w-5 h-5" alt="icon" />
          </template>
        </van-notice-bar>
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
        <h2 class="text-[20px] font-semibold">{{$t('员工等级')}}</h2>
        <span class="text-[14px] text-[#F89C0D] cursor-pointer font-bold" @click="toVips">{{$t('查看更多')}}</span>
      </div>
      <div class="swiper-container" v-if="ready">
        <swiper
          :modules="[EffectCoverflow, Pagination]"
          effect="coverflow"
          grab-cursor="true"
          centered-slides="true"
          slides-per-view="auto"
          :observer="true"
          :observe-parents="true"
          :space-between="40"
          :looped-slides="levelList.length" 
          :initial-slide="0"
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
          :autoplay="{
            delay: 1000,          // 每隔 3 秒切换
            disableOnInteraction: false // 用户滑动后仍然继续自动播放
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
                <!-- <div v-html="item.descriptionEn"></div> -->
                 <div>{{ t('commissionInfo', { rate: item.rate, tasks: item.tasks }) }}</div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
        <!-- 自定义分页指示器 -->
        <div class="custom-pagination mt-[31px]  flex justify-center space-x-2"></div>
      </div>
    </div>
    <div >
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
    <Lang ref="langRef"></Lang>
  </div>
</template>
<script setup>
import Footer from "@/components/Footer.vue";
import HeaderTop from "@/components/HeaderTop.vue";
import ContactUs from "@/components/ContactUs.vue";
import tradePassword from "@/components/tradePassword.vue";
import { onMounted, onUnmounted,ref, reactive, nextTick,onActivated,onDeactivated,computed  } from "vue";
import { getLevel, getNoticeList, userGetInfo,bannerList,getTradeConfig } from "../api/apis";
import { useRouter,useRoute } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
const langRef = ref(null);
const userStore = useUserStore();
const { t } = useI18n();
const tradePasswordRef = ref(null);
const ContactUsRef = ref(null);
const userInfo = ref({});
const swiperInstance = ref(null)
import { Swiper, SwiperSlide } from "swiper/vue";
const VITE_API_IMG_URL = window.g.VITE_API_IMG_URL;
import { checkWorkTimeLocal } from "../util/utils";
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
    // tradePasswordRef.value.open(2);
    
  router.push({
    path: '/withdraw',
  });
  } else if (path == "/profile") {
    // tradePasswordRef.value.open(3);
    router.push({
    path: '/deposit',
  });
  } else if (path == "/server") {
    // ContactUsRef.value.open();
    const time = checkWorkTimeLocal(TradeInfor.value.workTimeStart, TradeInfor.value.workTimeEnd,userStore.zoneActive.tzName);
    if(time) {
      ContactUsRef.value.open();
    } else {
      showToast(
        t("supportHours", {
          start: TradeInfor.value.workTimeStart,
          end: TradeInfor.value.workTimeEnd
        })
      )
    }
  } else {
    router.push(path);
    sessionStorage.setItem("fromRoute", path);
  }
}
function toVips() {
  router.push("/vips");
   sessionStorage.setItem("fromRoute", '/vips');
}
const levelList = ref([
  {
    nameEn:'VIP1',
    rate:'0.50%',
    tasks:40,
    // descriptionEn:t('commissionInfo', { rate: '0.50%', tasks: 40 }),
    bg:new URL("@/static/images/bgImages1.png", import.meta.url).href
  },
  {
    nameEn:'VIP2',
    rate:'1%',
    tasks:40,
    // descriptionEn:t('commissionInfo', { rate: '1%', tasks: 40 }),
    bg:new URL("@/static/images/bgImages2.png", import.meta.url).href
  },
  {
    nameEn:'VIP3',
    rate:'1.50%',
    tasks:40,
    // descriptionEn:t('commissionInfo', { rate: '1.5%', tasks: 40 }),
    bg:new URL("@/static/images/bgImages3.png", import.meta.url).href
  },
  {
    nameEn:'VIP4',
    rate:'2.50%',
    tasks:40,
    // descriptionEn:t('commissionInfo', { rate: '2.50%', tasks: 40 }),
    bg:new URL("@/static/images/bgImages4.png", import.meta.url).href
  }
]);
const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
  setTimeout(() => {
    swiper.update();          // 重新计算 slide 尺寸和 loop
    swiper.slideToLoop(1, 0); // 修复左侧留白
  }, 50); // 延迟一帧，保证 DOM 尺寸正确
}
const ready = ref(true);
// const level = async () => {
//   let res = await getLevel();
//   levelList.value = res.data;
//   levelList.value.forEach((item) => {
//     if (item.descriptionEn) {
//       // 把 ● 包到带 class 的 span 里（注意：这里保留了 ●）
//       item.descriptionEn = item.descriptionEn.replace(
//         /(●|•|&#8226;|&#9679;)/g,
//         '<span class="small-dot">●</span>'
//       );
//     }
//   });
//   levelList.value = levelList.value.map((item, index) => {
//     return {
//       ...item,
//       bg: bgImages[index % bgImages.length] // 按顺序循环使用
//     };
//   });
//   ready.value = true;
//   // 等数据渲染完
//   await nextTick()
//   // 确保 swiper 已经初始化
//    if (swiperInstance.value) {
//     swiperInstance.value.slideToLoop(1, 0) // 再切换到第一个
//     // setTimeout(() => {
//       swiperInstance.value.slideToLoop(0, 0) // 再切换到第一个
//     // },1000)
    
//   }
// };
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

const updateHandler = () => {
  getUserGetInfo();
};
const getUserGetInfo = () => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
  });
};
const STORAGE_KEY = "ListPageScrollY"; // 本地缓存 key
const scrollTop = ref(0)
let container;

function handleScroll() {
  scrollTop.value = container.scrollTop;
}

const bannerArr = ref([])
const getbannerList = async () => {
  const res = await bannerList(); // 你自己的接口
  bannerArr.value = res.data;
}
const TradeInfor = ref({})
const tradeConfig = async () => {
  let res = await getTradeConfig();
  TradeInfor.value = res.data;
};
const toMy = ()=>{
  router.push({ path: "/my" });
}
function handleChangeLang() {
  langRef.value.open();
}

// 计算属性，去除所有HTML标签
const pureNoticeContent = computed(() => {
  return noticeContent.value.replace(/<\/?[^>]+(>|$)/g, "");
});
onMounted(() =>{
  window.addEventListener("updateTrade", updateHandler);
})
// 回到页面时恢复滚动位置
onActivated (() => {
  const fromRoute = sessionStorage.getItem("fromRoute");
  sessionStorage.removeItem("fromRoute"); // 用完删除
  const scrollY = sessionStorage.getItem(STORAGE_KEY);
  window.addEventListener("updateTrade", updateHandler);
  if (scrollY && fromRoute) {
    container.scrollTo(0, +scrollY); // 容器滚动
  }
  container = document.getElementById("router-view");
  if (container) container.addEventListener("scroll", handleScroll);
  getData();
  getUserGetInfo();
  getbannerList()
  tradeConfig();
  // level();
});
onUnmounted(() => {
  window.removeEventListener("updateTrade", updateHandler);
  if (container) container.removeEventListener("scroll", handleScroll);
});
onDeactivated(() => {
  // 组件被缓存但离开时
  window.removeEventListener("updateTrade", updateHandler);
  // 离开页面时记录滚动位置
  sessionStorage.setItem(STORAGE_KEY, scrollTop.value);
});

</script>
<style>
.swiper-container {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 30px;
}

.mySwiper {
  width: 100%;
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 285px !important; /* 卡片宽度 */
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
