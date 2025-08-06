<template>
  <div class="w-full min-h-[100vh] bg-[#f4f4f5]">
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
                <div class="mt-2 text-xs text-[#000] font-light" v-html="item.descriptionZh">
                    
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
