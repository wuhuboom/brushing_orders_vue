<template>
  <div class="w-full min-h-[100vh] bg-[#F9FAFB]">
    <div class="flex items-center relative bg-[#000]">
      <!-- 左侧箭头 -->
      <div class="absolute left-3" @click="onClickLeft">
        <van-icon name="arrow-left" color="#fff" size="22px" />
      </div>
      <!-- 中间标题 -->
      <div class="mx-auto text-white text-[18px] py-[24px]">Vips</div>
    </div>
    <img src="@/static/images/vipBg.png" class="w-full" alt="">
     <div class="w-full h-full">
    <!-- 顶部导航 -->
    <div class="flex justify-between items-center px-[16px] bg-white sticky top-0 z-10">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="px-4 py-2 cursor-pointer border-b-4 text-[14px] py-[16px]"
        :class="activeTab === index 
          ? 'text-[#D4AF36] font-bold border-yellow-500' 
          : 'text-gray-500 border-transparent'"
        @click="scrollTo(index)"
      >
        {{ tab }}
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="p-4  bg-[#F9F4EB]">
      <div
        v-for="(tab, index) in levelList"
        :key="index"
        :ref="el => sectionRefs[index] = el"
        class="h-[248px]  rounded-[6px] mb-[18px] "
        style="overflow: hidden;"
        :style="getTabStyle(index)"
      >
        <div class="h-[14px]" :style="getBgStyle(index)"></div>
        <div class="flex justify-between px-[13px] pt-[33px]">
          <div class="text-[20px] text-[#13284B]" style="font-weight: bold;" :class="index==4?'text-[#fff]':''">{{tab.nameEn}} Guest Card</div>
          <div class="w-[40px] h-[40px] flex justify-center items-center text-[14px]" style="border-radius: 50%;font-weight: bold;"  :style="getStyle(index)">{{tab.nameEn}}</div>
        </div>
        <div class="text-[16px] text-[#13284B] px-[13px] pt-[15px]" style="font-weight: bold;" :class="index==4?'text-[#fff]':''">Member Beneﬁts</div>
        <div class="text-[#364150] text-[12px] px-[13px] pt-[15px]" :class="index==4?'text-[#fff]':''" style="line-height: 18px;">{{ t('commissionInfo', { rate: tab.commissionRatio+'%', tasks: tab.orderCount }) }}</div>
        <!-- <div v-html="tab.descriptionEn" class="text-[#364150] text-[12px] px-[13px] pt-[15px]" :class="index==4?'text-[#fff]':''" style="line-height: 18px;"></div> -->
      </div>
    </div>
  </div>
    <!-- <div
      class="w-full p-6 box-border flex flex-col font-montserrat text-[#666]"
    >
      <div class="w-full mt-10 box-border flex flex-col">
        <div
          class="w-full mb-4 border bg-white rounded-xl shadow flex justify-between p-3"
          v-for="item in levelList"
        >
          <img class="w-16 h-16" :src="bgMapStart[item.nameEn]" alt="" />
          <div class="flex flex-col w-[73%]">
            <div class="flex items-center">
              <div class="text-base text-[#333] font-semibold mr-2">
                {{ item.nameEn }}
              </div>
              <van-tag
                round
                type="primary"
                color="#ff9662"
                text-color="#fff"
                size="medium"
                v-if="userStore.userInfo.levelId == item.id"
                >{{ $t("当前等级") }}</van-tag
              >
              <div
                @click="toUpgrade(item.id)"
                v-if="userStore.userInfo.levelId < item.id"
                class="text-sm text-[#ff9662] font-semibold mr-2 underline"
              >
                Upgrade now
              </div>
            </div>
            <div class="mt-2 text-[#ff9662] text-sm font-semibold">
              {{ `USD ${item.price}` }}
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <ContactUs ref="ContactUsRef"></ContactUs>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { getLevel } from "../../api/apis";
import { useUserStore } from "../../store/modules/user";
import ContactUs from "@/components/ContactUs.vue";
import { showToast } from "vant";
import { useI18n } from "vue-i18n";
const userStore = useUserStore();
const ContactUsRef = ref(null);
const { t } = useI18n();
const more = new URL("@/static/images/more10.png", import.meta.url).href;
const bgMapStart = {
  VIP1: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135431630339970.png",
  VIP2: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135444978440962.png",
  VIP3: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135461467660218.png",
  VIP4: "https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135471230297283.png",
  // VIP5: new URL("@/static/images/bg_vipStart4.png", import.meta.url).href,
};
const levelList = ref([]);
const level = async () => {
  let res = await getLevel();
  levelList.value = res.data;

  levelList.value.forEach((item) => {
    tabs.value.push(item.nameEn)
    if (item.descriptionEn) {
      // 把 ● 包到带 class 的 span 里（注意：这里保留了 ●）
      item.descriptionEn = item.descriptionEn.replace(
        /(●|•|&#8226;|&#9679;)/g,
        `<img src="${more}" class="inline-block w-[11px] h-[11px] mr-2" />`
      );
    }
  });
};
const toUpgrade = (id) => {
  if (userStore.userInfo.levelId == id) {
    return false;
  }

  // showToast(t('联系客服'));
  ContactUsRef.value.open();
};
const tabs = ref([]);
const activeTab = ref(0);
const sectionRefs = ref([]);

// 点击 tab 滚动到对应区域
const scrollTo = (index) => {
  activeTab.value = index;
  const el = sectionRefs.value[index];
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    // 等滚动结束，再往下挪 tab 的高度
    setTimeout(() => {
      window.scrollBy({
        top: -60, // tab 高度（比如 60px，根据你的导航高度改）
        behavior: "smooth"
      });
    }, 300);
  }
};
// 根据不同 tab.id 返回不同的 style
const getTabStyle = (id) => {
  console.log(id)
    if (id === 0) return { background: "#fff", color: "#000" };
    if (id === 1) return { background: "#D4d6Dc", color: "#fff" };
    if (id === 2) return { background: "#EDE2BF", color: "#fff" };
    if (id === 3) return { background: "linear-gradient( 90deg, #CFD2D8 0%, #9FA5AF 100%)", color: "#fff" };
    if (id === 4) return { background: "linear-gradient( 99deg, #6A7484 0%, #49556C 100%)", color: "#fff" };
  
  return { backgroundColor: "transparent", color: "#6b7280" };
};

// 根据不同 tab.id 返回不同的 style
const getStyle = (id) => {
    if (id === 0) return { background: "#E4E6EB", color: "#4B5462" };
    if (id === 1) return { background: "#E4E6EB", color: "#4B5462" };
    if (id === 2) return { background: "#CEB04E", color: "#fff" };
    if (id === 3) return { background: "#6C727F", color: "#fff" };
    if (id === 4) return { background: "#143C90", color: "#93C5FD" };
  
  return { backgroundColor: "transparent", color: "#6b7280" };
};
// 根据不同 tab.id 返回不同的 style
const getBgStyle = (id) => {
    if (id === 0) return { background: "#9DA3AE",  };
    if (id === 1) return { background: "#9DA3AE", };
    if (id === 2) return { background: "#CEB04E", };
    if (id === 3) return { background: "#6C727F",  };
  
  return { backgroundColor: "transparent", color: "#6b7280" };
};


onMounted(() => {
  userStore.getUserInfo();
  level();
  console.log(userStore.userInfo);
});
const onClickLeft = () => history.back();
</script>
<style>
.small-dot {
  font-size: 8px; /* 调整大小 */
  line-height: 1;
  vertical-align: middle;
  display: inline-block; /* 保证可以控制尺寸/对齐 */
  /* 如需更细微缩放也可用 transform: scale(0.8); */
}
.custom-html p {
  line-height: 20px;
  padding-bottom: 5px;
  font-family: Inter, Inter;
  font-weight: 400;
  font-size: 14px;
  color: #4b5563;
}

.custom-html li {
  line-height: 20px;
  padding-bottom: 5px;
  font-family: Inter, Inter;
  font-weight: 400;
  font-size: 12px;
  color: #4b5563;
}
</style>
