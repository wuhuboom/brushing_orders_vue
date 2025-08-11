<template>
  <div>
    <HeaderTop></HeaderTop>
    <div class="w-full relative">
      <div class="pb-4 pt-4 absolute top-5 w-full" style="z-index: 2">
        <div class="w-[90%] mx-auto">
          <div class="w-full overflow-hidden rounded-full">
            <!-- <van-notice-bar
              color="#fff"
              left-icon="bell"
              background="#007513"
              :text="pureNoticeContent"
            /> -->
            <van-notice-bar
              color="#fff"
              background="#007513"
              :text="pureNoticeContent"
            >
              <template #left-icon>
                <img
                  src="@/static/images/notice.png"
                  class="w-5 h-5"
                  alt="icon"
                />
              </template>
            </van-notice-bar>
          </div>
        </div>
        <div class="mx-auto pt-5">
          <div
            class="text-center text-2xl lg:text-5xl font-semibold text-white"
          >
          {{$t("我们通过数字营销")}}
          {{$t("帮助小型企业盈利")}}
          </div>
        </div>
        <div class="flex justify-center items-center mt-5">
          <div
            class="text-white mr-1 px-4 py-1 bg-[var(--main-color)] text-sm text-center"
          >
            {{ $t("雇佣我们") }}
          </div>
          <div
            class="text-white ml-1 px-4 py-1 bg-[var(--main-color)] text-sm text-center"
          >
            {{ $t("与我们合作") }}
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
                bgMap[item.nameEn]
              }) 0 0 / 100% 100% no-repeat`,
            }"
          >
            <div class="flex justify-between items-start">
              <div class="font-bold text-lg">
                <p class="mt-4 text-[var(--main-color)]">
                  {{ $t(item.nameZh) }}
                </p>
              </div>
              <img class="w-24" :src="bgMapStart[item.nameEn]" alt="" />
            </div>
            <div class="w-[260px] text-xs mt-2 text-black" >
              <p class="w-[260px] text-xs mt-2 text-black" v-html="item.descriptionEn"></p>
            </div>
          </div>
        </div>
      </div>
      <img class="w-full" src="@/static/images/a.png" alt="" />
      <img class="w-full" src="@/static/images/b.png" alt="" />
    </div>

    <!-- 行情结束 -->
    <Footer name="/"></Footer>
    <tradePassword ref="tradePasswordRef"></tradePassword>
  </div>
</template>
<script setup>
import Footer from "@/components/Footer.vue";
import HeaderTop from "@/components/HeaderTop.vue";
import tradePassword from "@/components/tradePassword.vue";
import { onMounted, ref ,reactive,computed } from "vue";
import { getLevel,getNoticeList } from "../api/apis";
import { useRouter } from "vue-router";
const tradePasswordRef = ref(null);

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
    tradePasswordRef.value.open(2);
  } else if (path == "/profile") {
    tradePasswordRef.value.open(3);
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
  levelList.value.forEach(item => {
     if (item.descriptionEn) {
      // 把 ● 包到带 class 的 span 里（注意：这里保留了 ●）
      item.descriptionEn = item.descriptionEn.replace(/(●|•|&#8226;|&#9679;)/g, '<span class="small-dot">●</span>');
    }
  });
};

const query = reactive({
  pageNum: 1,
  pageSize: 10,
});
const noticeContent  = ref('')

const getData = async () => {
  const res = await getNoticeList(query); // 你自己的接口
  console.log(res)
  noticeContent.value = res.rows.length>0? res.rows[0].noticeContent :'';
  

}

// 计算属性，去除所有HTML标签
const pureNoticeContent = computed(() => {
  return noticeContent.value.replace(/<\/?[^>]+(>|$)/g, "")
})




onMounted(() => {
  level();
  getData()
});
</script>
<style>
.small-dot {
  font-size: 8px;       /* 调整大小 */
  line-height: 1;
  vertical-align: middle;
  display: inline-block; /* 保证可以控制尺寸/对齐 */
  /* 如需更细微缩放也可用 transform: scale(0.8); */
}
</style>
