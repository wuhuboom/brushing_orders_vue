<template>
    <div class="flex flex-col">
        <Header :title="$t('切换语言')"></Header>
        <div class="flex-1 overflow-auto px-4 flex flex-col gap-3">
            <div v-for="lang in langs" class="flex justify-between items-center" @click="onClickLang(lang.code)">
                <div>{{ lang.title }}</div>
                <img :src="langCode === lang.code ? getStaticImageUrl('lang-active.png') : getStaticImageUrl('lang-unactive.png')"
                    alt="" class="h-4">
            </div>
        </div>
    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
import { computed } from 'vue';
import { getStaticImageUrl } from '@/util/utils.js'
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '@/store/modules/common';
const {  locale } = useI18n()
const langs = [
    { title: '中文', code: 'zh' },
    { title: 'English', code: 'en' }
]
const commonStore = useCommonStore()
const langCode = computed(() => commonStore.lang)

function onClickLang(val) {
    commonStore.updateLang(val);
    locale.value = val;
}
</script>