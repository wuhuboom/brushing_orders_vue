<template>
  <div class="w-full min-h-[100vh]">
    <div
      class="w-full  box-border flex flex-col font-montserrat text-[#666]"
    >
      <van-nav-bar
        :title="$t('员工等级')"
        fixed
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="mt-[60px] w-full text-center py-[24px] text-[24px] text-[#fff]" style="
        background: linear-gradient(to right, #002d72, #0a4da2);
        box-sizing: border-box;
      ">
        <p class="pb-[20px]">{{$t('vips.str1')}} </p>
        <p>{{$t('vips.str2')}}</p>
      </div>
      <div class="w-full py-6 box-border flex flex-col">
        <div class="w-full mb-4 p-4 rounded-lg bg-[#fff] flex items-center shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),_0px_0px_0px_0px_rgba(0,0,0,0),_0px_0px_0px_0px_rgba(0,0,0,0)]" v-for="item in levelList">
            <div class="flex flex-col flex-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center pl-[15px]">
                      <img :src="bgMapStart[item.nameEn]" class="w-[48px] h-[48px] mr-[6px]" alt="">
                      <div class="text-base text-[20px] text-[#1F2937] font-semibold mr-2">{{item.nameEn}}{{$t('vips.str3')}}</div>
                    </div>
                    <!-- <div class="w-[93px] h-[36px] flex justify-center items-center  rounded-md text-white" @click="toUpgrade(item.id)" :class="userStore.userInfo.levelId == item.id?'bg-[#9333EA]':'bg-[#206645]'">{{userStore.userInfo.levelId == item.id?$t('当前等级'):`USD ${item.price}`}}</div> -->
                </div>
                <div class="mt-2 text-xs text-[#4B5563] font-light custom-html" v-html="item.description">
              
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { getLevel,getLevelByLang } from "../../api/apis";
import { useUserStore } from '../../store/modules/user';
import { showToast } from 'vant';
import { useI18n } from "vue-i18n";
import { useCommonStore } from '@/store/modules/common';
const userStore = useUserStore()
const commonStore = useCommonStore();
const parLang = computed(() => {
  const mapped = commonStore.getValueByKey(commonStore.lang);
  return mapped ?? commonStore.lang; 
});
const { t } = useI18n();
const more = new URL("@/static/images/more10.png", import.meta.url).href;

const bgMapStart = {
  VIP1: new URL("@/static/images/vip11.png", import.meta.url).href,
  VIP2: new URL("@/static/images/vip11.png", import.meta.url).href,
  VIP3: new URL("@/static/images/vip11.png", import.meta.url).href,
  VIP4: new URL("@/static/images/vip11.png", import.meta.url).href,
  VIP5: new URL("@/static/images/vip11.png", import.meta.url).href,
};
const levelList = ref([]);
const level = async () => {
  
 let res = await getLevel({ lang: parLang.value });
  levelList.value = res.data;
  levelList.value.forEach(item => {
     if (item.description) {
      // 把 ● 包到带 class 的 span 里（注意：这里保留了 ●）
      item.description = item.description.replace(/(●|•|&#8226;|&#9679;)/g, `<img src="${more}" class="inline-block w-[11px] h-[11px] mr-2" />`);
    }
  });
  
};
const toUpgrade = (id) =>{
  if(userStore.userInfo.levelId == id) {
    return false
  }
  
showToast(t('联系客服'));
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
.custom-html {
  padding: 0 20px 0 73px;
}
.custom-html,
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
