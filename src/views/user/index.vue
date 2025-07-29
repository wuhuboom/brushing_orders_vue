<template>
  <div class="pt-5">
    <div>
      <div class="flex items-center gap-4">
        <div class="h-14 min-w-14 shadow-xl rounded-full overflow-hidden">
          <img :src="userStore.userInfo.avatar?userStore.userInfo.avatar:logo" alt="" class="w-[57px] h-[57px] rounded-full overflow-hidden">
        </div>
        <p class="text-blue text-xl" @click="toLogin" v-if="!userStore.token">{{ $t('立即登录')  }}</p>
        <div v-if="userStore.token" class="flex-1">
          <div class="text-[22px] leading-normal font-bold line-clamp-1">{{ displayName }}</div>
          <div class=" leading-normal opacity-50 text-[15px]">{{ `${$t('编号：')}${userStore.userInfo.id}` }}</div>
        </div>
        <div class="ml-auto flex items-center gap-1 text-blue px-3 py-2 rounded-2.5"
          style="background-color: rgba(0,101,255,.1);" @click="handleChangeAccountType" v-if="userStore.token">
          <el-icon size="16">
            <Switch />
          </el-icon>
          <div>{{ userStore.accountType === 'REAL' ? $t('真实账户') : $t('模拟账户') }}</div>
        </div>
      </div>
      <div class="assets-bg rounded-[20px] px-5 pt-5 pb-[50px] relative text-white text-base mt-6">
        <div class="flex items-center">
          <div>{{ $t('净值') }}</div>
          <div class="ml-auto opacity-60">{{ $t('400X') }}</div>
        </div>
        <div class="text-3xl mt-2.5"><span class="text-sm">$</span>{{ totalAssets }}</div>
        <div class="absolute flex items-center text-black gap-6 w-5/6 -translate-x-1/2 left-1/2 -bottom-6 text-[13px]"
          v-if="userStore.accountType === 'REAL'">
          <div class="flex-1 bg-white flex items-center justify-center h-12 rounded-2xl shadow-lg gap-2" @click="toRecharge">
            <img src="@/static/images/deposit.png" alt="" class="h-4">
            <p>{{ $t('入金') }}</p>
          </div>
          <div class="flex-1 bg-white flex items-center justify-center h-12 rounded-2xl shadow-lg gap-2" @click="toWithdraw">
            <img src="@/static/images/withdraw.png" alt="" class="h-4">
            <p>{{ $t('出金') }}</p>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4 text-base mt-[50px]">
        <div v-for="item in menu" :key="item.title" class="flex flex-col">

          <div class="leading-normal opacity-30">{{ item.title }}</div>
          <div v-for="listItem, index in item.list" :key="item.title" class="flex items-center py-4 gap-4"
            :style="`border-bottom: ${index < item.list.length - 1 ? '1px solid hsla(0, 0%, 92.9%, .46);' : ''}`"
            @click="onClickMenu(listItem)">
            <img :src="getStaticImageUrl(listItem.icon)" alt="" class="w-10 h-10">
            <div class="flex-1 leading-normal ">{{ listItem.title }}</div>
            <div class="flex items-center gap-4 ml-auto">
              <div v-if="listItem.leftTitle" class="opacity-30"> {{ listItem.leftTitle }}</div>
              <el-icon class="opacity-30" size="20">
                <ArrowRight />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer name="/user"></Footer>
    <Lang ref="langRef"></Lang>
    <ChangeAccountType ref="changeAccountTypeRef"></ChangeAccountType>
  </div>

</template>
<script setup>
import Footer from '@/components/Footer.vue'
import Lang from '@/components/Lang.vue'
import ChangeAccountType from './components/ChangeAccountType.vue';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BigNumber from 'bignumber.js';
import { useUserStore } from '../../store/modules/user';
import { useCommonStore } from '../../store/modules/common';
import { copyContent, getStaticImageUrl } from '../../util/utils';
import logo from '@/static/images/logo.png'
import { useRouter } from 'vue-router';
const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const commonStore = useCommonStore()
const langRef = ref(null)
const changeAccountTypeRef = ref(null)

onMounted(() => {
  userStore.getUserBalance()
  userStore.getUserInfo()
})

const menu = computed(() => [
  {
    title: t('通用'),
    list: [
      { title: t('我的账户'), url: '/user/account', icon: 'user-mine.png' },
      { title: t('实名认证'), url: '/user/realname', icon: 'user-safari.png',leftTitle:isRealNamed,callback: toRealName },
      { title: t('钱包'), url: '/user/wallet', icon: 'user-wallet.png' },
      { title: t('邀请好友'), icon: 'user-invite.png', leftTitle: userStore.userInfo.promotionCode, callback: onClickInvite },
      { title: t('消息通知'), icon: 'user-message.png', url: '/user/notification' },
      { title: t('客户服务'), icon: 'user-service.png', callback: onClickService }
    ]
  },
  {
    title: t('设置'),
    list: [
      { title: t('语言'), icon: 'user-lang.png', leftTitle: commonStore.clientLang, callback: onClickLang },
      // { title: t('主题') }
    ]
  },
])



function onClickService() {
  router.push({
    path: '/user/service'
  })
}

function onClickInvite() {
  copyContent(userStore.userInfo.promotionCode)
}

function onClickMenu(item) {
  if (item.callback) return item.callback()
  router.push({
    path: item.url
  })
}

function onClickLang() {
  langRef.value.open()
}

function handleChangeAccountType() {
  changeAccountTypeRef.value.open()
}

function toRealName(){
  console.log(userStore.userInfo.isRealNamed)
  if(userStore.userInfo.isRealNamed === 'UN_REAL_NAMED' || userStore.userInfo.isRealNamed === 'REAL_NAME_FAILED'){
    router.push({
      path: '/user/realname'
    })
  } else if(userStore.userInfo.isRealNamed == 'REAL_NAMED') {
    ElMessage({ message: t("已实名成功"), type: "success" });
  }
}

function toLogin() {
  router.push({
    path: '/account/login'
  })
}
const displayName = computed(() => {
  const name = userStore.userInfo.nickname || ''
  return name.length > 10 ? name.substring(0, 9) + '...' : name
})


const totalAssets = computed(() =>{
  return new BigNumber(userStore.assets.totalAssets || 0).toFixed(2)
})

const isRealNamed = computed(() =>{
  return userStore.userInfo.isRealNamed=='REAL_NAMED'?t('已认证'):''
})

function toRecharge() {
  router.push({
    path: '/user/deposit'
  })
}

function toWithdraw() {
  router.push({
    path: '/user/withdraw'
  })
}
</script>
<style scoped>
.assets-bg {
  background-color: #0065FF;
  background-image: url("@/static/images/block-bg.png");
  background-size: 100% auto;
}
</style>