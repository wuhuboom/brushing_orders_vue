<template>
  <div class="w-full min-h-[100vh] bg-[#F9FAFB]">
    <div
      class="w-full p-6 box-border flex flex-col font-montserrat text-[#666]"
    >
      <van-nav-bar
        :title="$t('员工等级')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="w-full mt-10 box-border flex flex-col">
        <div class="w-full mb-4 border bg-white rounded-xl shadow flex justify-between p-3" v-for="item in levelList">
          <img class="w-16 h-16" :src="bgMapStart[item.nameEn]" alt="">
          <div class="flex flex-col w-[73%]">
            <div class="flex items-center">
              <div class="text-base text-[#333] font-semibold mr-2">{{item.nameEn}}</div>
              <van-tag round type="primary" color="#ff9662" text-color="#fff" size="medium" v-if="userStore.userInfo.levelId == item.id">{{$t('当前等级')}}</van-tag>
              <div @click="toUpgrade(item.id)" v-if="userStore.userInfo.levelId < item.id" class="text-sm text-[#ff9662] font-semibold mr-2 underline">Upgrade now</div>
            </div>
            <div class="mt-2 text-[#ff9662] text-sm font-semibold">{{`USD ${item.price}`}}</div>
          </div>
        </div>
      </div>
      <!-- <div class="w-full mt-10 box-border flex flex-col">
        <div class="w-full mb-4 p-4 rounded-lg bg-[#fff] flex items-center shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),_0px_0px_0px_0px_rgba(0,0,0,0),_0px_0px_0px_0px_rgba(0,0,0,0)]" v-for="item in levelList">
            <div class="flex flex-col flex-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <img :src="bgMapStart[item.nameEn]" class="w-[48px] h-[48px] mr-[6px]" alt="">
                      <div class="text-base text-[#000] font-semibold mr-2">{{item.nameEn}}</div>
                    </div>
                    <div class="w-[93px] h-[36px] flex justify-center items-center  rounded-md text-white" @click="toUpgrade(item.id)" :class="userStore.userInfo.levelId == item.id?'bg-[#9333EA]':'bg-[#206645]'">{{userStore.userInfo.levelId == item.id?$t('当前等级'):`USD ${item.price}`}}</div>
                </div>
                <div class="mt-2 text-xs text-[#000] font-light custom-html" v-html="item.descriptionEn">
              
                </div>
            </div>
        </div>
      </div> -->
    </div>
    <ContactUs ref="ContactUsRef"></ContactUs>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { getLevel } from "../../api/apis";
import { useUserStore } from '../../store/modules/user';
import ContactUs from "@/components/ContactUs.vue";
import { showToast } from 'vant';
import { useI18n } from "vue-i18n";
const userStore = useUserStore();
const ContactUsRef = ref(null);
const { t } = useI18n();
const more = new URL("@/static/images/more10.png", import.meta.url).href;

// const bgMapStart = {
//   VIP1: new URL("@/static/images/vips1.png", import.meta.url).href,
//   VIP2: new URL("@/static/images/vips2.png", import.meta.url).href,
//   VIP3: new URL("@/static/images/vips3.png", import.meta.url).href,
//   VIP4: new URL("@/static/images/vips4.png", import.meta.url).href,
//   VIP5: new URL("@/static/images/vips5.png", import.meta.url).href,
// };
const bgMapStart = {
  VIP1: 'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135431630339970.png',
  VIP2: 'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135444978440962.png',
  VIP3: 'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135461467660218.png',
  VIP4: 'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/rcc/1683135471230297283.png',
  // VIP5: new URL("@/static/images/bg_vipStart4.png", import.meta.url).href,
};
const levelList = ref([]);
const level = async () => {
  let res = await getLevel();
  levelList.value = res.data;
  levelList.value.forEach(item => {
     if (item.descriptionEn) {
      // 把 ● 包到带 class 的 span 里（注意：这里保留了 ●）
      item.descriptionEn = item.descriptionEn.replace(/(●|•|&#8226;|&#9679;)/g, `<img src="${more}" class="inline-block w-[11px] h-[11px] mr-2" />`);
    }
  });
  
};
const toUpgrade = (id) =>{
  if(userStore.userInfo.levelId == id) {
    return false
  }
  
// showToast(t('联系客服'));
ContactUsRef.value.open();
}
onMounted(() => {
  userStore.getUserInfo()
  level();
  console.log(userStore.userInfo)
});
const onClickLeft = () => history.back();
</script>
<style>
.small-dot {
  font-size: 8px;       /* 调整大小 */
  line-height: 1;
  vertical-align: middle;
  display: inline-block; /* 保证可以控制尺寸/对齐 */
  /* 如需更细微缩放也可用 transform: scale(0.8); */
}
.custom-html p{
  line-height: 20px;
  padding-bottom: 5px;
  font-family: Inter, Inter;
  font-weight: 400;
  font-size: 14px;
  color: #4B5563;
}

.custom-html li{
  line-height: 20px;
  padding-bottom: 5px;
  font-family: Inter, Inter;
  font-weight: 400;
  font-size: 12px;
  color: #4B5563;
}

</style>
