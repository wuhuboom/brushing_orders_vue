<template>
    <div>
        <Header showTabs>
            
        </Header>
        <div class="assets-bg rounded-[20px] p-5 relative text-white mt-6">
            <div class="flex items-center gap-2 w-max px-2.5 py-1.5 rounded-md"
                style="background-color: rgba(255, 255, 255, 0.4);" @click="toHome">
                <div>{{ detail.symbolShowName }}</div>
                <el-icon size="20">
                    <CaretBottom />
                </el-icon>
                <!-- <div class="ml-auto opacity-60">{{ $t('400X') }}</div> -->
            </div>
            <div class="flex items-center mt-4">
                <div class="text-[32px] leading-[45px]">{{ detail.sellPrice }}</div>
                <div class=" self-end ml-auto opacity-50">{{ nowTime }}</div>
            </div>

        </div>
        <KlineChart></KlineChart>
        <div class="flex flex-wrap">
            <div class="flex-1"><span class=" opacity-50 text-[15px]">{{ $t('高') }}</span><span class="ml-2">$</span><span
                    class="text-[21px] ml-1">{{ highPrice }}</span></div>
            <!-- <div><span class=" opacity-50 text-[15px]">总量</span><span class="ml-2">$</span><span
                    class="text-[21px] ml-1">{{ detail.value }}</span></div> -->
            <div class="flex-1"><span class=" opacity-50 text-[15px]">{{ $t('低') }}</span><span class="ml-2">$</span><span
                    class="text-[21px] ml-1">{{ lowPrice }}</span></div>
        </div>
        <div class="flex items-center gap-8 text-white text-xl mt-[30px]" v-if="tradeStore.tradeType === 'NORMAL'">
            <div class="flex-1 bg-red flex items-center justify-center h-[51px] rounded-2xl" @click="toPrice('sell')">{{ $t('卖出') }}</div>
            <div class="flex-1 bg-blue flex items-center justify-center h-[51px] rounded-2xl" @click="toPrice('buy')">{{ $t('买入') }}</div>
        </div>
        <div class="flex items-center gap-8 text-white text-xl mt-[30px]" v-else>
            <div class="flex-1  bg-blue flex items-center justify-center h-[51px] rounded-2xl" @click="toPrice('buy')">{{ $t('看涨') }}</div>
            <div class="flex-1 bg-red  flex items-center justify-center h-[51px] rounded-2xl" @click="toPrice('sell')">{{ $t('看跌') }}</div>
        </div>
    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
import KlineChart from '@/components/KlineChart.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useTradeStore } from '../../store/modules/trade';
import { useRouter } from 'vue-router';
import { useMarketStore } from '../../store/modules/market';

const route = useRoute()
const router = useRouter()
const tradeStore = useTradeStore()
const marketStore = useMarketStore()
const detail = computed(() => {
    return tradeStore.detail
})
const highPrice = ref('')
const lowPrice = ref('')

onMounted(() => {
    tradeStore.setSymbol(route.query.symbol)
    tradeStore.getSymbolDetail()
    highPrice.value = route.query.highPrice
    lowPrice.value = route.query.lowPrice
})

function toHome() {
    router.push({
        path: '/'
    })
}

function toPrice(type) {
    if(tradeStore.tradeType === 'NORMAL'){
        router.push({
            path: '/index/price',
            query: {
                type: type
            }
        })
        return
    }else{
        router.push({
            path: '/index/second',
            query: {
                type: type,
            }
        })
    }
}

const nowTime = computed(() => {
    // 1744026777891转成时分秒
    if (marketStore.currentTime) {
        const time = new Date(marketStore.currentTime)
        return time.toLocaleTimeString()
    }
})

</script>

<style scoped>
.assets-bg {
    background-color: #0065FF;
    background-image: url("@/static/images/block-bg.png");
    background-size: 100% auto;
}
</style>