<template>
    <div ref="symbolRef" class="rounded-2xl bg-white py-[5px]" style="box-shadow: 0px 3px 8px 0 rgba(0,0,0,.16);"
        @click.prevent="toChart">
        <p class="mb-2 pl-[5px]">{{ marketData.symbolShowName }}</p>
        <SmallKlineChart :data="marketData" :history="history" class="px-[2px]"></SmallKlineChart>
        <div class="flex items-center">
            <div class="flex-1 flex flex-col items-center">
                <p class="text-[9px] opacity-50 leading-3" >{{ $t('买') }}</p>
                <p class=" text-[11px] text-red leading-4" :class="rate > 0 ? 'text-up' : 'text-down'">{{ marketData.sellPrice }}</p>
            </div>
            <div class="flex-1 flex flex-col items-center">
                <p class="text-[9px] opacity-50 leading-3" >{{ $t('卖') }}</p>
                <p class="text-[11px] text-red leading-4" :class="rate > 0 ? 'text-up' : 'text-down'">{{ marketData.buyPrice }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import SmallKlineChart from '@/components/SmallKlineChart.vue'
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { reqGetMarketHistoryData } from '../../api/apis';
import WebSocketClient from '@/util/websocket.js';
import { useRouter } from 'vue-router';
import { useMarketStore } from '../../store/modules/market';
import { useTradeStore } from '../../store/modules/trade';
const props = defineProps({
    data: {
        type: Object,
        required: true,
    }
});

const router = useRouter();
const symbolRef = ref(null);
const history = ref([]);
const marketStore = useMarketStore();
const tradeStore = useTradeStore()

const marketData = computed(() => {
    const market = marketStore.allMarketObjects[props.data.symbol]
    return market ? {
        ...props.data,
        sellPrice: market.sellPrice,
        buyPrice: market.buyPrice
    } : props.data
})

// 涨跌幅
const rate = computed(() => {
    if (marketData.value.lastClosePrice && marketData.value.sellPrice) {
        return ((marketData.value.sellPrice - marketData.value.lastClosePrice) / marketData.value.buyPrice * 100).toFixed(2)
    }
})

onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                WebSocketClient.start(marketData.value.symbol)
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
    WebSocketClient.closeSymbol(marketData.value.symbol)
});

function getKlineHistory() {
    let data = {
        type: 'kline',
        period: 1,
        symbol: marketData.value.symbol,
        init: 1,
        end: 0,
        pageSize: 100
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

function toChart() {
    tradeStore.setSymbol(marketData.value.symbol)
    router.push({
        path: '/index/chart',
        query: {
            symbol: marketData.value.symbol,
            highPrice:props.data.highPrice,
            lowPrice:props.data.lowPrice,
        }
    })
}
</script>