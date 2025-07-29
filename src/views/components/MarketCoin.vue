<template>
    <div ref="symbolRef" class=" w-full flex items-center gap-[15px]" @click.stop="toChart">
        <div class="flex-1">
            <p class="">{{ marketData.symbolShowName }}</p>
            <p class="text-[10px] opacity-50  leading-4">{{ nowTime }}</p>
        </div>
        <div class="flex flex-col items-center w-[65px]">
            <p class="" :class="rate > 0 ? 'text-up' : 'text-down'">{{ marketData.sellPrice }}</p>
            <p class="text-[10px] opacity-50  leading-4">{{ marketData.lowPrice }}</p>
        </div>
        <div class="flex flex-col items-center w-[65px]">
            <p class="" :class="rate > 0 ? 'text-up' : 'text-down'">{{ marketData.buyPrice }}</p>
            <p class="text-[10px] opacity-50 leading-4">{{ marketData.highPrice }}</p>
        </div>
        <div class="flex flex-col items-center w-[65px] h-[25px] justify-center text-white rounded-md text-xs"
            :class="rate > 0 ? 'bg-up' : 'bg-down'">{{ `${rate > 0 ?'+':''}${rate}` }}</div>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import WebSocketClient from '@/util/websocket.js';
import { useMarketStore } from '../../store/modules/market';
import { useRouter } from 'vue-router';
import { useTradeStore } from '../../store/modules/trade';
const props = defineProps({
    data: {
        type: Object,
        required: true,
    }
});
const marketStore = useMarketStore();
const tradeStore = useTradeStore()
const symbolRef = ref(null);
const router = useRouter();

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

// 获取现在的时分秒，一秒更新一次
const nowTime = computed(() => {
    // 1744026777891转成时分秒
    if (marketStore.currentTime) {
        const time = new Date(marketStore.currentTime)
        return time.toLocaleTimeString()
    }
})

onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                WebSocketClient.start(props.data.symbol)
                observer.unobserve(entry.target);
            }
        });
    });

    if (symbolRef.value) {
        observer.observe(symbolRef.value);
    }
});

onUnmounted(() => {
    WebSocketClient.closeSymbol(props.data.symbol)
});

function toChart() {
    tradeStore.setSymbol(marketData.value.symbol)
    router.push({
        path: '/index/chart',
        query: {
            symbol: props.data.symbol,
            highPrice:props.data.highPrice,
            lowPrice:props.data.lowPrice,
        }
    })
}
</script>