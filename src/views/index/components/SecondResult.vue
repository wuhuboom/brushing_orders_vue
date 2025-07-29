<template>
    <el-drawer v-model="dialogVisible" :show-close="false" :modal="true" direction="btt" append-to-body size="auto"
        header-class="header">
        <template #header>
            <div>
                <div class="bg-gray w-8 h-8 flex items-center justify-center rounded-2.5" @click="close">
                    <el-icon>
                        <Close />
                    </el-icon>
                </div>
                <p class="text-[25px] mt-5 text-black">{{ detail.symbolShowName }}</p>
            </div>
        </template>
        <div class="flex items-center flex-col px-[15px] pb-[25px]">
            <div class="w-full flex items-center justify-center h-16 mb-4" style="background: linear-gradient(90deg, rgba(246, 247, 249, 0) 0%, #F6F7F9 50.61%, rgba(246, 247, 249, 0) 100%);
">
                <van-count-down :time="data.closeTime * 1000"  v-if="data.resultType === 0"/>
                <div :class="data.resultType === -1 ? 'text-red':'text-blue'" v-else class="flex flex-col items-center">
                    <p class="text-2xl">{{ `${data.resultType === -1?'-':'+'}${data.profit}` }}</p>
                    <p class="text-sm">{{ `${data.resultType === -1?'-':'+'}${ratioSize}` }}</p>
                </div>
            </div>
            <div class="w-full flex flex-col gap-4">
                <div class="flex w-full">
                    <p class=" opacity-50 text-xs">{{ $t('当前价格') }}</p>
                    <p class="ml-auto text-sm" v-if="data.resultType === 0">{{ detail.sellPrice }}</p>
                    <p class="ml-auto text-sm" v-else>{{ data.closePrice }}</p>
                </div>
                <div class="flex w-full" v-if="data.resultType === 0">
                    <p class=" opacity-50 text-xs">{{ $t('预计收益') }}</p>
                    <p class="ml-auto text-sm">{{ profit }}</p>
                </div>
                <div class="flex w-full">
                    <p class=" opacity-50 text-xs">{{ $t('金额') }}</p>
                    <p class="ml-auto text-sm">{{ data.share }}</p>
                </div>
                <div class="flex w-full">
                    <p class=" opacity-50 text-xs">{{ $t('方向') }}</p>
                    <p class="ml-auto text-sm bg-blue text-white px-2 rounded" v-if="data.direction === 'UP'">{{
                        $t('看涨')
                        }}</p>
                    <p class="ml-auto text-sm bg-red text-white px-2 rounded" v-else>{{ $t('看跌') }}</p>
                </div>
                <div class="flex w-full">
                    <p class=" opacity-50 text-xs">{{ $t('周期') }}</p>
                    <p class="ml-auto text-sm">{{ `${data.ratioDuration} s` }}</p>
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTradeStore } from '@/store/modules/trade';
import BigNumber from 'bignumber.js';

const dialogVisible = ref(false);
const tradeStore = useTradeStore();
const router = useRouter()
const detail = computed(() => tradeStore.detail)
const props = defineProps({
    data: {
        type: Object,
        default: {}
    }
});


// 更符合Vue3习惯的暴露方式
const open = () => (dialogVisible.value = true);
const close = () => (dialogVisible.value = false);

defineExpose({
    open,
    close // 新增关闭方法
});



// 预计盈利
const profit = computed(() => {
    
    const profit1 = new BigNumber(props.data.share).times(props.data.ratioSize).div(100).toFixed(2);
    const profit2 = new BigNumber(props.data.share).times(props.data.odds).div(100).toFixed(2);
    if(props.data.exchangeRate == props.data.odds) return profit1  === 'NaN'? 0 : profit1;
    if(props.data.odds <= 0) return profit1  === 'NaN'? 0 : profit1;
    return `${profit1} - ${profit2}`
})

// 盈亏百分比
const ratioSize = computed(() => {
    const ratioSize = new BigNumber(props.data.profit).div(props.data.share).times(100).toFixed(2);
    return `${ratioSize}%`
})

function toPosition() {
    router.push({
        path: '/position'
    })
}


</script>

<style scoped>
:deep(.el-drawer.btt) {
    border-top-left-radius: 20px !important;
    border-top-right-radius: 20px !important;
}
</style>
<style>
.header {
    margin: 0 !important;
    padding: 20px 20px 0 !important;
}
</style>