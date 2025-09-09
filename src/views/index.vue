<template>
  <div class="bg-[#f1f1f1]">
    <HeaderTop></HeaderTop>
    <!-- <div class="w-full relative">
      <div class="pb-4 pt-4 absolute top-5 w-full" style="z-index: 2">
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

      <img
        class="w-full h-[200px] object-cover"
        src="@/static/images/bg.png"
        alt=""
      />
    </div> -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item>
        <img
          src="https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/marriott/1710172513828575829.png"
          class="w-5 h-5"
          alt="icon"
        />
      </van-swipe-item>
      <van-swipe-item>
        <img
          src="https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/marriott/1710172531651592383.png"
          class="w-5 h-5"
          alt="icon"
        />
      </van-swipe-item>
      <van-swipe-item>
        <img
          src="https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/marriott/171017253950534437.png"
          class="w-5 h-5"
          alt="icon"
        />
      </van-swipe-item>
    </van-swipe>
    <div class="w-full mt-[5px]">
      <van-notice-bar color="#000" background="#fff" :text="pureNoticeContent">
        <template #left-icon>
          <img src="@/static/images/notice.png" class="w-7 h-7" alt="icon" />
        </template>
      </van-notice-bar>
    </div>
    <!-- 菜单列表 -->
    <div class="py-4 pb-2">
      <div
        class="flex justify-between items-center text-black w-[90%] mx-auto mt-2"
      >
        <div class="text-base font-bold">
          Menu
          <span class="text-[#ff9662]">List</span>
          <div class="text-xs">MARRIOT BONVOY</div>
        </div>
      </div>
      <div class="items-con flex p-4 pl-3 pr-3 font-light overflow-x-scroll">
        <div
          class="flex flex-col items-center justify-around box-border p-2 pl-4 pr-4 text-[#fff]"
          :style="{
            borderRadius: '10px',
            background: `url(${item.icon_bg}) 0px 0px / 140px 100px no-repeat`,
          }"
          v-for="(item, index) in items"
          :key="index"
          @click="goTo(item.route)"
        >
          <div class="w-[120px] h-[80px] flex justify-start items-end">
            <img
              class="w-6 h-6 mr-2"
              :src="item.icon"
              alt=""
            />
            <span class="whitespace-nowrap text-xs mt-1 pb-1">{{$t(item.name)}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 产品介绍 -->
    <div class="py-4 pb-2">
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
              {{item.name}}
            </span>
          </van-swipe-item>
      </van-swipe>
      </div>
      
    </div>

    <div class="relati mb-[50px]">
      <!-- 员工等级 -->
      <div class="w-full mx-auto">
        <div class="w-[90%] mx-auto">
          <div class="flex justify-between pt-4 pb-2 text-base text-black">
            <div class="w-[35%] font-bold">{{ $t("员工等级") }}</div>
            <div
              @click="toVips"
              class="w-[65%] font-normal text-xs text-[var(--main-color)] text-right flex justify-end items-center"
            >
              <div class="mr-[3px]">{{ $t("查看更多") }}</div>
              <!-- <van-icon name="arrow" color="#4CAF50" /> -->
              <img class="w-5 ml-2" src="@/static/images/more1.png" alt="" />
            </div>
          </div>
        </div>
        <!-- <div class="items-con flex overflow-x-scroll p-4">
          <div
            v-for="item in levelList"
            class="vip-item flex flex-col box-border rounded-xl p-4 mr-3"
            :style="{
              background: `url(${bgMap[item.nameEn]}) 0px 0px / 140px 100px no-repeat`,
            }"
          >
            <div class="flex justify-between items-start">
              <div class="font-bold text-lg">
                <p class="mt-4 text-[var(--main-color)]">
                  {{ $t(item.nameZh) }}
                </p>
              </div>

              <img class="w-14" :src="bgMapStart[item.nameEn]" alt="" />
            </div>
            <div class="w-[260px] text-xs mt-2 text-black">
              <p
                class="w-[260px] text-xs mt-2 text-black"
                v-html="item.descriptionEn"
              ></p>
            </div>
          </div>
        </div> -->

        <div class="items-con flex overflow-x-scroll p-4">
          <div
              class="flex flex-col box-border rounded-xl p-4 mr-3"
              :class="userInfo.levelId == item.id?'text-[#fff]':'text-[#0C2D54]'"
              v-for="item in levelList"
              :key="item.id"
              :style="{
                background: userInfo.levelId == item.id
                  ? `url(${vip_bg2}) no-repeat center/100% 100%`
                  : `url(${vip_bg1}) no-repeat center/100% 100%`
              }"
            >
            <img class="w-16 h-16" :src="bgMapStart[item.nameEn]" alt="">
            <div class="font-bold text-[16px]">{{ $t(item.nameZh) }}</div>
            <div class="w-36">
              <div class="w-32 text-xs mt-3 font-light " v-html="item.descriptionEn"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 菜单列表 -->
      <!-- <div class="w-[95%] rounded-xl mx-auto flex flex-col">
        <div class="pt-4 pr-4 pl-4 text-sm text-black">
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
      </div> -->
<!-- 
      <div class="w-full bg-[#F0F9FF] mb-[30px]">
        <div class="test-[#333] text-center text-sm p-4 mb-3">
          Business Partner
        </div>
        <img class="w-[90%] mx-auto" src="@/static/images/b.png" alt="" />
      </div>
      <img class="w-full" src="@/static/images/a.png" alt="" /> -->

      <!-- <img class="w-full" src="@/static/images/b.png" alt="" /> -->
    </div>

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
import { getLevel, getNoticeList,userGetInfo } from "../api/apis";
import { useRouter } from "vue-router";
const tradePasswordRef = ref(null);
const ContactUsRef = ref(null);
const userInfo = ref({})
const vip_bg1 = new URL("@/static/images/vip_bg1.png", import.meta.url).href;
const vip_bg2 = new URL("@/static/images/vip_bg2.png", import.meta.url).href;

const bgMap = {
  VIP1: new URL("@/static/images/vip_bg1.png", import.meta.url).href,
  VIP2: new URL("@/static/images/vip_bg1.png", import.meta.url).href,
  VIP3: new URL("@/static/images/vip_bg1.png", import.meta.url).href,
  VIP4: new URL("@/static/images/vip_bg2.png", import.meta.url).href,
};
const bgMapStart = {
  VIP1: 'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135431630339970.png',
  VIP2: 'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135444978440962.png',
  VIP3: 'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135461467660218.png',
  VIP4: 'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135471230297283.png',
};

const vanList = [
  {
    name:'Pan Pacific',
    img:'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385275613579878400.png'
  },
  {
    name:'Holiday Inn Express & Suites At Seaworld',
    img:'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385266569653821440.png'
  },
  {
    name:'Hilton City Santa Fe',
    img:'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385266668555509760.png'
  },
  {
    name:'Mowbray Court Hotel',
    img:'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385277575801118720.png'
  },
  {
    name:'Biz Cevahir Hotel Sultanahmet',
    img:'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385287369291243520.png'
  },
   {
    name:'Country Mile Escape',
    img:'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385269376146513920.png'
  },
  {
    name:'Di-Ann City Centre Hotel',
    img:'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385264768284139520.png'
  },
  {
    name:'Campus Boutique Hotel',
    img:'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/hotel/202402145385271272391352320.png'
  }
]


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
  } else if(path == "/server") {
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

window.addEventListener('updateTrade', (e) => {
    getUserGetInfo();
})

const getUserGetInfo = () =>{
  userGetInfo().then((res) => {
      userInfo.value = res.data
    });
}

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

.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 360px;
  text-align: center;
  background-color: #39a9ed;
}
.my-swipe .van-swipe-item img {
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
}
</style>
