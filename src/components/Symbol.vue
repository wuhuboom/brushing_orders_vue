<template>
    <div ref="symbolRef" class="w-full grid grid-cols-10 text-[#777E90] text-base h-[76px]" @click="handleChangeSymbol">
        <div class="flex items-center justify-start col-span-4">
            <div class="w-[178px] text-center flex items-center">
                <img src="@/static/images/collect-active.png" alt="" class="w-6 h-6" v-if="isFavorite"
                    @click.stop="handleSetFavorite('delete')">
                <img src="@/static/images/collect.png" alt="" class="w-6 h-6" v-else
                    @click.stop="handleSetFavorite('add')">
                <div class="ml-4 flex items-center gap-2">
                    <img src="@/static/images/btc.png" alt="" class="w-8 h-8">
                    <div>
                        <div class="flex items-center gap-2">
                            <div class="text-lg font-bold text-[#666666]">{{ props.item.symbolShowName }}</div>
                        </div>
                        <div class="text-xs text-[#B1B5C3] mt-2 text-left">{{ props.item.symbolShowName }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-6 grid grid-cols-3 ">
            <div class="flex items-center justify-start text-base">{{ `$ ${props.item.price || 0}` }}</div>
            <div class="flex items-center justify-center gap-1">
                <div :class="getTextColor(props.item.rate)">{{ `${props.item.rate <= 0 ? '' : '+'}${props.item.rate ||
                    0}%` }}</div>
                        <img src="@/static/images/up.png" alt="" class="w-[14px] h-[14px]" v-if="props.item.rate > 0">
                        <img src="@/static/images/down.png" alt="" class="w-[14px] h-[14px]" v-else>
                </div>
                <div class="flex items-center justify-end relative">
                    <SmallKlineChart :data="props.item" :addValue="'hot'" :history="history"></SmallKlineChart>
                </div>
            </div>
        </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useTradeStore } from '@/store/modules/trade';
import { reqAddUserSelectMarket, reqDeleteUserSelectMarket, reqGetMarketHistoryData, reqGetMarketNewData } from '../api/apis';
import BigNumber from 'bignumber.js';
import { getTextColor } from '../util/utils';
import SmallKlineChart from './SmallKlineChart.vue';
import WebSocketClient from "@/util/websocket.js";
import { useMarketStore } from '../store/modules/market';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});
const tradeStore = useTradeStore()
const marketStore = useMarketStore()
const nowMarketDetail = computed(() => marketStore.allMarketObjects[props.item.symbol])
const isFavorite = computed(() => tradeStore.userSelectMarketList.find(i => i.symbol === props.item.symbol))
const history = ref([])

watch(nowMarketDetail, (newVal, oldVal) => {
    if (newVal) {
        props.item.sellPrice = newVal.sellPrice
        props.item.price = props.item.sellPrice
        props.item.buyPrice = newVal.buyPrice
        props.item.rate = new BigNumber(props.item.price).minus(props.item.lastClosePrice).dividedBy(props.item.lastClosePrice).multipliedBy(100).toFixed(2)
        if (props.item.rate === 'NaN') {
            props.item.rate = 0
        }
        props.item.high = newVal.high
        props.item.low = newVal.low
        props.item.open = newVal.open
    }
})


// 设置收藏
function handleSetFavorite(type) {
    if (type === 'add') {
        reqAddUserSelectMarket({ symbol: props.item.symbol }).then(res => {
            tradeStore.getUserSelectMarketList()
        })
    } else {
        reqDeleteUserSelectMarket({ symbol: props.item.symbol }).then(res => {
            tradeStore.getUserSelectMarketList()
        })
    }
}

// 使用 Intersection Observer API 检测元素首次出现在视口中
const symbolRef = ref(null);

onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                WebSocketClient.start(props.item.symbol)
                reqGetMarketNewData({ symbol: props.item.symbol }).then(res => {

                    const data = res.data
                    props.item.sellPrice = data[1].close ? data[1].close : 0
                    props.item.price = props.item.sellPrice
                    props.item.buyPrice = data[1].price2 ? data[1].price2 : 0
                    props.item.lastClosePrice = data[0].close ? data[0].close : 0
                    props.item.rate = new BigNumber(props.item.price).minus(props.item.lastClosePrice).dividedBy(props.item.lastClosePrice).multipliedBy(100).toFixed(2)
                    if (props.item.rate === 'NaN') {
                        props.item.rate = 0
                    }
                    props.item.high = data[1].high
                    props.item.low = data[1].low
                    props.item.open = data[1].open
                })
                getKlineHistory()
                observer.unobserve(entry.target);
            }
        });
    });

    if (symbolRef.value) {
        observer.observe(symbolRef.value);
    }
});

onUnmounted(() => {
    WebSocketClient.closeSymbol(props.item.symbol)
});

function getKlineHistory() {
    let data = {
        type: 'kline',
        period: 1,
        symbol: props.item.symbol,
        init: 1,
        end: 0,
    };
    reqGetMarketHistoryData(data).then(res => {
        for (let i = 0; i < res.length; i++) {
            let values = {};
            values.close = Number(res[i][4]);
            values.high = Number(res[i][2]);
            values.low = Number(res[i][3]);
            values.open = Number(res[i][1]);
            values.volume = Number(res[i][5]);
            values.timestamp = Number(res[i][0]) * 1000;
            history.value.push(values);
        }
    })
}

function handleChangeSymbol() {
    tradeStore.setSymbol(props.item.symbol)
}
</script>