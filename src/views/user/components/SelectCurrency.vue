<template>
    <el-drawer class="max-h-[500px] overflow-auto" v-model="dialogVisible" :show-close="false" :modal="true" direction="btt" append-to-body size="auto"
        header-class="header">
        <template #header>
            <div class="flex items-center justify-between h-8">
                <p class="text-[25px] text-black">{{ $t('选择币种网络') }}</p>
                <div @click="close" class="cursor-pointer">
                <el-icon><Close /></el-icon>
                </div>
            </div>
        </template>
        <div class="flex flex-col gap-4 ">
            <div v-for="item in list" class="flex items-center gap-4" @click="handleSelect(item)">
            <img :src="item.icon" alt="" class="w-[45px] h-[45px]">
            <div>
                <!-- <p class=" opacity-50 text-sm">{{ item.currency }}</p> -->
                <p class="">{{ item.currency }}</p>
            </div>
            <img src="@/static/images/selected-check.png" alt="" class="w-6 h-6 ml-auto" v-if="item.id === modelValue">
            <img src="@/static/images/selected-uncheck.png" alt="" class="w-6 h-6 ml-auto" v-else>
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