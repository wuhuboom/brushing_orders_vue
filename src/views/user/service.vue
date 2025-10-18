<template>
    <div class="h-full flex flex-col px-0">
        <div class="flex h-10 items-center px-4">
            <el-icon size="24" @click="back"><ArrowLeft /></el-icon>
        </div>
        <div class="flex-1">
            <iframe :src="sercviceUrl" frameborder="0" class="m-0 p-0 h-full w-full"></iframe>
        </div>
        
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCommonStore } from '../../store/modules/common';
import { useRouter } from 'vue-router';

const commonStore = useCommonStore();
const sercviceUrl = computed(() => {
    return commonStore.setting.online;
})

const router = useRouter();

function back() {
    router.back();
}
</script>