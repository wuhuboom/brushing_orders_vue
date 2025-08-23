<template>
    <div class="w-full relative z-50">
        <div class="h-[80px]"></div> <!-- 占位 -->
        <div class="bar-shadow flex items-center fixed bottom-0 left-0 right-0 h-[80px] w-full bg-white " style="bottom: -1px;">
            <div v-for="menu in menus" :key="menu.title"
                class="flex-1 flex flex-col items-center text-xs gap-1 font-light"  @click="onClickMenu(menu)">
                <img :src="name === menu.url ? getStaticImageUrl(`${menu.icon}_h.png`) : getStaticImageUrl(`${menu.icon}.png`)"
                    alt="" class="h-7 w-7" :class="menu.title == $t('开始')?'starting':''">
                <span  class="leading-normal text-[10px] " :class="name === menu.url?'text-[#4CAF50]':'text-[#6B7280]',menu.title == $t('开始')?'startingText':''" style="font-size: 12px;">
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
    { title: t('开始'), url: '/starting', icon: 'starting' },
     { title: t('记录'), url: '/records', icon: 'records' },
    // { title: t('我的'), url: '/user', icon: 'user' }
])

watch(() => props.name, (val) => {
    active.value = val
})

function onClickMenu(menu) {
    // console.log('onClickMenu',menu.id)
    active.value = menu.id
    router.push({
        path: menu.url
    })
}
</script>
<style>
.bar-shadow {
    box-shadow: 0px -1px 4px 0px #0000000D;
}
.starting {
    margin-top: -3rem;
    width: 5.5rem;
    height: 5.5rem;
}
.startingText {
    margin-top: -1rem;
}
</style>