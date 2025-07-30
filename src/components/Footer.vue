<template>
    <div class="w-full relative z-50">
        <div class="h-[50px]"></div> <!-- 占位 -->
        <div class="bar-shadow flex items-center fixed bottom-0 left-0 right-0 h-[50px] w-full bg-[#f7f7fa]">
            <div v-for="menu in menus" :key="menu.title"
                class="flex-1 flex flex-col items-center text-xs gap-1 font-light " @click="onClickMenu(menu)">
                <img :src="name === menu.url ? getStaticImageUrl(`nav-${menu.icon}-active.png`) : getStaticImageUrl(`nav-${menu.icon}.png`)"
                    alt="" class="h-5 w-5">
                <span :class="name === menu.url ? 'text-blue' : 'text-[#3D3D3D]'" class="leading-normal text-[10px]">
                    {{ menu.title }}
                </span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { getStaticImageUrl } from '@/util/utils.js'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter()
const props = defineProps({
    name: String
})
const { t } = useI18n()
const active = ref(props.name)
const menus = computed(() => [
    { title: t('首页'), url: '/', icon: 'home' },
    { title: t('开始'), url: '/starting', icon: 'position' },
     { title: t('记录'), url: '/records', icon: 'user' },
    // { title: t('我的'), url: '/user', icon: 'user' }
])

watch(() => props.name, (val) => {
    active.value = val
})

function onClickMenu(menu) {
    // console.log('onClickMenu',menu.id)
    // active.value = menu.id
    router.push({
        path: menu.url
    })
}
</script>
<style>
.bar-shadow {
    box-shadow: 0px -1px 4px 0px #0000000D;
}
</style>