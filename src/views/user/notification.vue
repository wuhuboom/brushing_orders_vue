<template>
    <div>
        <Header :label="$t('消息通知')"></Header>
        <div class="flex mt-5 flex-col gap-4">
            <div class="flex items-center gap-4" v-for="item in list" v-if="list.length > 0">
                <img src="@/static/images/recode-withdraw.png" alt="" class="h-11">
                <div>
                    <p class="text-lg line-clamp-1">{{ item.title }}</p>
                    <p class="text-xs opacity-50">{{ item.createTime }}</p>
                </div>
                <div class="ml-auto bg-gray px-3 py-2 rounded-lg flex items-center" @click="readMessage(item.id)">
                    <el-icon class="text-blue"><Check /></el-icon>
                </div>
            </div>
            <img src="@/static/images/order.png" alt="" class="w-52 m-auto" v-else>
        </div>
    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { reqGetMessageList, reqReadMessage } from '../../api/apis';

const list = ref([])
onMounted(() => {
    getMessageList()
})


function getMessageList() {
    reqGetMessageList().then(res => {
        list.value = res.data.records
        // 排除掉hasRead为true的消息
        list.value = list.value.filter(item => item.hasRead === false)
    })
}

function readMessage(id) {
    reqReadMessage(id).then(res => {
        getMessageList()
    })
}
</script>

<style scoped></style>