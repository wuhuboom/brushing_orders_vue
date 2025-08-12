<template>
  <div class="w-full min-h-[100vh] bg-white">
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
        <div class="w-full mb-4 p-4 rounded-lg bg-[#e8f7ec] flex items-center" v-for="item in levelList">
            <div class="flex mr-4 w-20">
                <img :src="bgMapStart[item.nameEn]" alt="">
            </div>
            <div class="flex flex-col flex-1">
                <div class="flex items-center">
                    <div class="text-base text-[#000] font-semibold mr-2">{{item.nameEn}}</div>
                    <van-tag round type="primary" color="#007513" v-if="userStore.userInfo.levelId == item.id">{{$t('当前等级')}}</van-tag>
                     <div class="text-sm text-[var(--main-color)] font-semibold mr-2 underline" @click="toUpgrade" v-if="userStore.userInfo.levelId != item.id">{{$t('立即升级')}}</div>
                </div>
                <div class="mt-2 text-[var(--main-color)] text-sm font-semibold">
                    {{item.price}}{{$t('美元')}}
                </div>
                <div class="mt-2 text-xs text-[#000] font-light" v-html="item.descriptionEn">
                    
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { getLevel } from "../../api/apis";
import { useUserStore } from '../../store/modules/user';
import { showToast } from 'vant';
import { useI18n } from "vue-i18n";
const userStore = useUserStore()
const { t } = useI18n();
const bgMapStart = {
  VIP1: 'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/172232700615694005.png',
  VIP2: 'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722327038574353214.png',
  VIP3: 'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/172232706362679225.png',
  VIP4: 'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722327102801555071.png',
  VIP5: 'https://bigw-in1.oss-ap-northeast-1.aliyuncs.com/icrossing/1722342635975654072.png',
};
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
const toUpgrade = () =>{
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
</style>
