<template>
    <div>
        <Header></Header>
        <div class="flex items-center mt-5">
            <p class="text-xl">{{ detail.symbolShowName }}</p>
            <p class="ml-auto text-3xl text-red">{{ detail.sellPrice }}</p>
        </div>
        <div class="flex items-center bg-gray h-[50px] rounded-full p-1 mt-2.5 text-base">
            <div v-for="item in menus" class="flex-1 flex items-center justify-center h-full rounded-full"
                :class="selectMenu === item.value ? 'text-blue bg-[#FBFCFD]' : ' opacity-30'"
                @click="handleChangeMenu(item.value)">
                <p>{{ item.label }}</p>
            </div>
        </div>
        <div class="flex flex-col gap-5 my-5">
            <Number :prefix="$t('价格')" :lastPrefix="`(${route.query.type === 'sell' ? '>=' : '<='}${detail.sellPrice})`"
                v-if="selectMenu === 'limit'" v-model="params.price">
            </Number>
            <Number :prefix="$t('手数')" :lastPrefix="`(${detail.minShare}-${detail.maxShare})`" v-model="params.amount">
            </Number>
            <Number :prefix="$t('止损')" showSet :isSet="isSetStopLoss" v-model="params.stopLoss" @changeIsSet="handleChangeIsSetStopLoss"></Number>
            <Number :prefix="$t('止盈')" showSet :isSet="isSetStopProfit" v-model="params.stopProfit" @changeIsSet="handleChangeIsSetStopProfit"></Number>
        </div>

        <div class="flex flex-col gap-4 mb-[50px]">
            <div class="flex items-center">
                <p class=" opacity-50">{{ $t('倍数') }}</p>
                <p class="ml-auto text-lg">400X</p>
            </div>
            <div class="flex items-center">
                <p class=" opacity-50">{{ $t('保证金') }}</p>
                <p class="ml-auto text-lg">{{ estimateCost }}</p>
            </div>
            <div class="flex items-center">
                <p class=" opacity-50">{{ $t('余额') }}</p>
                <p class="ml-auto text-lg">{{ balance }}</p>
            </div>
            <!-- <div class="flex items-center">
                <p class=" opacity-50">交易后预付款比</p>
                <p class="ml-auto text-lg">400X</p>
            </div> -->
        </div>
        <div class="flex-1 bg-red flex items-center justify-center h-[51px] rounded-2xl text-white text-lg"
            v-if="type === 'sell'" @click="submit">{{ $t('卖出') }}
        </div>
        <div class="flex-1 bg-blue flex items-center justify-center h-[51px] rounded-2xl text-white text-lg"
            @click="submit" v-else>{{ $t('买入') }}
        </div>
        <OpenSuccess ref="openSuccessRef" :openType="selectMenu" :type="type" :share="params.amount" />
    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
import Number from '@/components/Number.vue'
import OpenSuccess from './components/OpenSuccess.vue';
import { useTradeStore } from '../../store/modules/trade';
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../../store/modules/user';
import { reqLimitOrder, reqMarketOrder } from '../../api/apis';
import { useI18n } from 'vue-i18n';
import BigNumber from 'bignumber.js';
import WebSocketClient from '@/util/websocket.js';

const userStore = useUserStore()
const { t } = useI18n()
const route = useRoute()
const type = route.query.type
const selectMenu = ref('market')
const openSuccessRef = ref(null);
const menus = computed(()=>[
    {
        label: t('市价'),
        value: 'market',
        query: {
            order: 0,
            type2: 1
        }
    },
    {
        label: t('挂单'),
        value: 'limit',
        query: {
            order: 0,
            type2: 5
        }
    }
])
const tradeStore = useTradeStore()
const detail = computed(() => tradeStore.detail)
const balance = computed(() => {
    return new BigNumber(userStore.assets.balance).toFixed(2);
})
const params = reactive({
    price: '',
    amount: '',
    stopLoss: '',
    stopProfit: ''
})
const isSetStopLoss = ref(false)
const isSetStopProfit = ref(false)

onMounted(() => {
    params.amount = detail.value.minShare
    WebSocketClient.start(detail.value.symbol)
})

onUnmounted(() => {
    WebSocketClient.closeSymbol(detail.value.symbol)
})

const estimateCost = computed(() => {
    const amount = params.amount; // 添加对params.amount的依赖
    const shareNumber = detail.value.shareNumber; // 添加对detail.value.shareNumber的依赖
    const cost = new BigNumber(amount).multipliedBy(shareNumber).toFixed();
    return cost === 'NaN' ? 0 : cost;
});

function handleChangeMenu(value) {
    selectMenu.value = value
    if (selectMenu.value === 'limit') {
        params.price = detail.value.sellPrice
    }
}

function handleSubmitOrder() {
    openSuccessRef.value.open()
}

function handleChangeIsSetStopLoss(value) {
    isSetStopLoss.value = value
    if (isSetStopLoss.value) {
        params.stopLoss = detail.value.sellPrice
    }else {
        params.stopLoss = ''
    }
}

function handleChangeIsSetStopProfit(value) {
    isSetStopProfit.value = value
    if (isSetStopProfit.value) {
        params.stopProfit = detail.value.sellPrice
    }  else {
        params.stopProfit = ''
    }
}

function submit() {
    let data = {
        "isSecondContract": "NORMAL",
        "direction": type === 'sell'? 'DOWN' : 'UP',
        "share": params.amount,
        "symbol": detail.value.symbol,
        "stopLossPrice": params.stopLoss === 0 ? null : params.stopLoss,
        "stopProfitPrice": params.stopProfit === 0 ? null : params.stopProfit
    }
    if (selectMenu.value === 'market') {
        data = {
            ...data,
            "orderType":'MARKET'
        }
        reqMarketOrder(data).then(res => {
            ElMessage({ message: t('交易成功'), type: "success" })
            userStore.setUserBalance(res.data.ucAccountDTO)
            handleSubmitOrder()
        })
    } else {
        data = {
            ...data,
            "orderType":'ENTRUST',
            "openPrice": params.price,
            "orderDirect": type ==='sell'? 1 : 0
        }
        reqLimitOrder(data).then(res => {
            ElMessage({ message: t('挂单成功'), type: "success" })
            handleSubmitOrder()
        })
    }
}
</script>

<style scoped></style>