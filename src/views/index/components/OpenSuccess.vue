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
                <p class="text-[25px] mt-5 text-black">{{ $t('开仓成功') }}</p>
            </div>
        </template>
        <div class="flex items-center flex-col px-[15px] pb-[25px]">
            <el-icon size="50" :class="props.type == 'sell' ? 'text-red' : 'text-blue'">
                <Check />
            </el-icon>
            <!-- <p class=" opacity-50 mt-2.5">832983248989423</p> -->
            <p class="mt-2.5">{{tradeStore.detail.symbolShowName}}</p>
            <p class="opacity-50 mt-2.5" :class="props.type == 'sell' ? 'text-red' : 'text-blue'">{{openType === 'market'?$t('市价'):$t('挂单')}} {{ $t('购买') }} {{ props.share }} {{ $t('手数') }}</p>
            <div class="w-full rounded-2xl mt-5 flex items-center justify-center text-white h-11" :class="props.type == 'sell' ? 'bg-red' : 'bg-blue'"
                @click="toPosition">
                {{ $t('查看持仓') }}</div>
        </div>
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTradeStore } from '@/store/modules/trade';

const dialogVisible = ref(false);
const tradeStore = useTradeStore();
const router = useRouter()
const props = defineProps({
    type: {
        type: String,
        default: 'sell'
    },
    openType: {
        type: String,
        default: 'market'
    },
    share: {
        type: Number,
        default: 0
    }
});

// 更符合Vue3习惯的暴露方式
const open = () => (dialogVisible.value = true);
const close = () => (dialogVisible.value = false);

defineExpose({
    open,
    close // 新增关闭方法
});

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