<template>
    <div>
        <Header view="market" :label="$t('钱包')"></Header>
        <div class="assets-bg rounded-[20px] px-5 pt-5 pb-6 relative text-white text-base mt-6">
            <div class="flex items-center">
                <div>{{ $t('余额') }}</div>
                <!-- <div class="ml-auto opacity-60">{{ $t('400X') }}</div> -->
            </div>
            <div class="text-3xl mt-2.5"><span class="text-sm">$</span>{{ balance }}</div>
        </div>
        <div class="flex items-center justify-between mt-5">
            <div v-for="item in menus" class="flex flex-col items-center" @click="toMenu(item)">
                <img :src="getStaticImageUrl(item.icon)" alt="" class=" h-16 w-16">
                <p class="mt-1.5">{{ $t(item.label) }}</p>
            </div>
        </div>
        <!-- <div class="flex items-center mt-9" @click="toQuotation">
            <p class="text-lg">交易记录</p>
            <el-icon class="ml-auto text-blue" size="18">
                <ArrowRightBold />
            </el-icon>
        </div>
        <div v-if="tradeList.length > 0">

        </div>
        <img src="@/static/images/order.png" alt="" class=" w-52 m-auto" v-else> -->
        <div class="flex items-center mt-9" @click="toDepositList">
            <p class="text-lg">{{ $t('出入金记录') }}</p>
            <el-icon class="ml-auto text-blue" size="18">
                <ArrowRightBold />
            </el-icon>
        </div>
        <!-- <div v-if="walletList.length > 0">

        </div>
        <img src="@/static/images/order.png" alt="" class=" w-52 m-auto" v-else> -->
    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
import { getStaticImageUrl } from '@/util/utils'
import { useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import BigNumber from 'bignumber.js';
import { useUserStore } from '../../store/modules/user';
const menus = [
    {
        label: '入金',
        icon: 'wallet-recharge.png',
        to: '/user/deposit'
    },
    {
        label: '出金',
        icon: 'wallet-withdraw.png',
        to: '/user/withdraw'
    },
    {
        label: '加密钱包',
        icon: 'wallet-wallet.png',
        to: '/user/crypto'
    },
    {
        label: '银行卡',
        icon: 'wallet-bank.png',
        to: '/user/bank'
    },
]

const balance = computed(() =>{
  return new BigNumber(userStore.assets.balance || 0).toFixed(2)
})


const userStore = useUserStore()
const router = useRouter()
const tradeList = []
const walletList = []

function toMenu(item) {
    if (item.to) {
        router.push({
            path: item.to
        })
    }
}

function toDepositList() {
  router.push({
    path: '/user/depositList'
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