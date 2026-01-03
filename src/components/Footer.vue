<template>
    <div class="w-full relative z-50">
        <div class="h-[68px]"></div> <!-- 占位 -->
        <div class="bar-shadow flex items-center fixed bottom-0 left-0 right-0 h-[68px] w-full bg-[#fff]" style="bottom: -1px;">
            <div v-for="menu in menus" :key="menu.title"
                class="flex-1 flex flex-col items-center text-xs gap-1"  @click="onClickMenu(menu)">
                <!-- <img :src="name === menu.url ? getStaticImageUrl(`${menu.icon}.png`) : getStaticImageUrl(`${menu.icon}.png`)"
                    alt="" class="h-7 w-7"> -->
                <van-icon :name="menu.icon" color="#646566" size="22px" />
                <span  class="leading-normal text-[10px] " :class="name === menu.url?'text-[#707070]':'text-[#707070]',menu.title == $t('开始')?'startingText':''" style="font-size: 12px;">
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
    { title: t('首页'), url: '/', icon: 'wap-home-o' },
    { title: t('客服'), url: '/service', icon: 'service-o' },
    { title: t('开始'), url: '/projectspage', icon: 'bag-o' },
    { title: t('记录'), url: '/records', icon: 'notes-o' },
    { title: t('我的'), url: '/my', icon: 'contact-o' }
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
    margin-top: -2rem;
    width: 3.5rem;
    height: 3.5rem;
}
/* .startingText {
    margin-top: -1rem;
} */
</style>