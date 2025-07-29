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

            </div>
        </template>
        <p class="text-[25px] text-black">{{ $t('选择币网') }}</p>
        <div class="pt-5 flex flex-col gap-2.5">
            <div class="flex items-start gap-4" @click="handleSelect(item)" v-for="item in list">
                <!-- <img :src="item.icon" alt="" class="w-[45px] h-[45px]"> -->
                 <img src="@/static/images/usdt.png" alt="" class="w-[45px] h-[45px]">
                <div class="flex-1 p-4 rounded-2xl flex items-center"
                    style="box-shadow: 0px 3px 8px 0 rgba(0, 0, 0, .16);">
                    <div>
                        <p>{{ `${item.accountOpeningAddress}-${item.bankName}` }}</p>
                        <p class=" opacity-50 text-sm">{{ item.bankCardNumber  }}</p>
                    </div>
                    
                    <el-icon class="text-blue ml-auto" size="18" v-if="item.id == modelValue"><Select /></el-icon>
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue';
const dialogVisible = ref(false);

// 确保SelectCoinNet组件有以下props定义
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    list: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:modelValue'])

// 在选择时触发更新
function handleSelect(item) {
    emit('update:modelValue', item.id)
    close() // 关闭drawer
}
// 更符合Vue3习惯的暴露方式
const open = () => (dialogVisible.value = true);
const close = () => (dialogVisible.value = false);

defineExpose({
    open,
    close // 新增关闭方法
});

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