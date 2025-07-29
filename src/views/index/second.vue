<template>
    <div>
        <Header :label="$t('秒合约')"></Header>
        <div class="flex items-center mt-5">
            <p class="text-xl">{{ detail.symbolShowName }}</p>
            <p class="ml-auto text-3xl text-red">{{ detail.sellPrice }}</p>
        </div>
        <div class="flex flex-col gap-5 my-5">
            <el-select v-model="selectTradeConfigId" :placeholder="$t('选择周期')" size="large" style="width: 100%">
                <el-option v-for="item in tradeConfig" :key="item.times" :label="item.times" :value="item.id" />
            </el-select>
            <Number :prefix="$t('数量')" :lastPrefix="`(${$t('最低')}：${selectTradeConfigData.minMoney || 0})`"
                v-model="params.amount">
            </Number>
        </div>

        <div class="flex flex-col gap-4 mb-[50px]">
            <div class="flex items-center">
                <p class=" opacity-50">{{ $t('预计收益') }}</p>
                <p class="ml-auto text-lg">{{ profit }}</p>
            </div>
            <div class="flex items-center">
                <p class=" opacity-50">{{ $t('余额') }}</p>
                <p class="ml-auto text-lg">{{ balance }}</p>
            </div>
            <div class="flex items-center">
                <p class=" opacity-50">{{ $t('手续费') }}</p>
                <p class="ml-auto text-lg">{{ fee }}</p>
            </div>
        </div>
        <div class="flex-1 bg-red flex items-center justify-center h-[51px] rounded-2xl text-white text-lg"
            v-if="type === 'sell'" @click="submit">{{ $t('看跌') }}
        </div>
        <div class="flex-1 bg-blue flex items-center justify-center h-[51px] rounded-2xl text-white text-lg"
            @click="submit" v-else>{{ $t('看涨') }}
        </div>
        <SecondResult ref="secondResultRef" :data="nowDetail"/>

    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
import Number from '@/components/Number.vue'
import SecondResult from './components/SecondResult.vue';
import { useTradeStore } from '../../store/modules/trade';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../../store/modules/user';
import { reqGetOrderList, reqGetPositionDetail, reqGetTradeConfig, reqLimitOrder, reqMarketOrder } from '../../api/apis';
import { useI18n } from 'vue-i18n';
import BigNumber from 'bignumber.js';
import WebSocketClient from '@/util/websocket.js';

const userStore = useUserStore()
const { t } = useI18n()
const route = useRoute()
const type = route.query.type
const selectMenu = ref('market')
const secondResultRef = ref(null);
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
const tradeConfig = ref([])
const selectTradeConfigId = ref(null)
const selectTradeConfigData = computed(() => {
    return tradeConfig.value.find(item => item.id === selectTradeConfigId.value) || {};
})
const nowDetail = ref({})

onMounted(() => {
    // params.amount = detail.value.minShare
    window.addEventListener('updateTrade', updateData)
    WebSocketClient.start(detail.value.symbol)
    getTradeConfig()
    getPositionList()
})

onUnmounted(() => {
    window.removeEventListener('updateTrade', updateData)
    WebSocketClient.closeSymbol(detail.value.symbol)
})

const fee = computed(() => {
    const amount = params.amount; // 添加对params.amount的依赖
    const openFee = detail.value.openFee; // 添加对detail.value.shareNumber的依赖
    const cost = new BigNumber(amount).multipliedBy(openFee).div(100).toFixed();
    return cost === 'NaN' ? 0 : cost;
});

// 预计盈利
const profit = computed(() => {
    const profit1 = new BigNumber(params.amount).times(selectTradeConfigData.value.exchangeRate).div(100).toFixed(2);
    const profit2 = new BigNumber(params.amount).times(selectTradeConfigData.value.odds).div(100).toFixed(2);
    if(selectTradeConfigData.value.exchangeRate == selectTradeConfigData.value.odds) return profit1  === 'NaN'? 0 : profit1;
    if(selectTradeConfigData.value.odds <= 0) return profit1  === 'NaN'? 0 : profit1;
    return `${profit1  === 'NaN'? 0 : profit1} - ${profit2  === 'NaN'? '' : profit2}`
})

function handleSubmitOrder() {
    secondResultRef.value.open()
}

// 自定义数值转换函数
function safeNumber(value) {
  const num = new BigNumber(value).toFixed();
  return isNaN(num) ? 0 : num;
}

function submit() {
    // if(safeNumber(params.amount) > safeNumber(balance.value)) return ElMessage({ message: t('余额不足'), type: "warning" });
    // if(safeNumber(params.amount) < safeNumber(selectTradeConfigData.value.minMoney)) return ElMessage({ message:t('最低交易金额为{amount}',{amount:selectTradeConfigData.value.minMoney}), type: "warning" });
    let data = {
        "isSecondContract": "SECOND",
        "direction": type === 'sell' ? 'DOWN' : 'UP',
        "share": params.amount,
        "symbol": detail.value.symbol,
        "configId": selectTradeConfigId.value,
        "orderType": 'MARKET',
        "shareNumber": 1
    }
    reqMarketOrder(data).then(res => {
        ElMessage({ message: t('交易成功'), type: "success" })
        userStore.setUserBalance(res.data.ucAccountDTO)
        // handleSubmitOrder()
        getPositionList()
    })
}

function getTradeConfig() {
    reqGetTradeConfig({
        isSecondContract: 'SECOND'
    }).then(res => {
        tradeConfig.value = res.data;
        tradeConfig.value.forEach(item => {
            item.times = formatExchangeTime(item.exchangeTime)
        })
        selectTradeConfigId.value = res.data[0].id;
        params.amount = res.data[0].minMoney;
    })
}

function formatExchangeTime(seconds) {
    if (seconds >= 3600) {
        const hours = seconds / 3600;
        return hours % 1 === 0 ? hours + ' h' : hours.toFixed(2) + ' h';
    } else if (seconds >= 600) {
        const minutes = seconds / 60;
        return minutes % 1 === 0 ? minutes + ' min' : minutes.toFixed(2) + ' min';
    } else {
        return seconds % 1 === 0 ? seconds + ' s' : seconds.toFixed(2) + ' s';
    }
}


function getPositionList() {
    reqGetOrderList({
        symbol: detail.value.symbol,
        isSecondContract: 'SECOND'
    }).then(res => {
        if(res.data.length > 0){
            nowDetail.value = res.data[0]
            handleSubmitOrder()
        }
    })
}

function updateData(data) {
    
    if(data.detail[2] && data.detail[2]== nowDetail.value.id) {
        reqGetPositionDetail({
            id : nowDetail.value.id
        }).then(res => {
            nowDetail.value = res.data
        })
    }
}
</script>

<style scoped>
:deep(.el-select__wrapper){
    box-shadow:  none;
    background-color: #EDEDED75;
    height: 50px;
    font-size: 16px;
}
</style>