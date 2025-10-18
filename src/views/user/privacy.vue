<template>
    <div>
        <Header :label="$t('隐私政策')"></Header>
        <div v-html="content"></div>
    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
import { onMounted, ref } from 'vue';
import { reqGetCommonQuestion } from '../../api/apis';

const content = ref('')

onMounted(() => {
    getPrivacyPolicy()
})

function getPrivacyPolicy() {
    // 发送请求获取隐私政策
    reqGetCommonQuestion({ type: 'SECRET_PROBLEM' }).then(res => {
        content.value = res.data[0].content
    })
}
</script>

<style scoped></style>