<template>
    <div>
        <Header :label="$t('搜索')"></Header>
        <el-input :placeholder="$t('输入搜索关键词')" type="text" autocomplete="off" size="large" v-model="search"
            class="mt-8">
            <template #suffix>
                <el-icon size="20" color="#303133" @click="getHotCoinList"><Select /></el-icon>
            </template>
        </el-input>
        <p class="text-lg mt-6 mb-5">{{ $t('热门搜素') }}</p>
        <div class="flex items-center gap-2.5">
            <div v-for="item in hotSearch" class="flex-1 flex items-center justify-center bg-gray py-2 rounded-2.5"
                @click="handleChangeHot(item)">{{
                    item }}</div>
        </div>
        <p class="text-lg mt-6 mb-2.5">{{ $t('搜索结果') }}</p>
        <div v-if="list.length > 0">
            <p v-for="item in list" class="text-lg py-3" @click="toChart(item)">{{ item.symbolShowName }}</p>
        </div>
        <img src="@/static/images/empty.png" alt="" class=" w-52 m-auto" v-else>
    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
import { onMounted, ref } from 'vue';
import { reqGetHotCoinList } from '../../api/apis';
import { useRouter } from 'vue-router';
const hotSearch = ref(['USD', 'GBP', 'AUD', 'HKD'])
const search = ref('')
const list = ref([])
const router = useRouter()

onMounted(() => {
    // getHotCoinList()
})

function handleChangeHot(value) {
    console.log(value);
    if (search.value === value) return
    search.value = value
    list.value = []
    getHotCoinList()
}

function getHotCoinList() {
    reqGetHotCoinList({ symbolOrigin: search.value, order: 0 }).then(res => {
        list.value = res.data.records
    })
}

function toChart(item) {
    router.push({
        path: '/index/chart',
        query: {
            symbol: item.symbol,
            highPrice:item.highPrice,
            lowPrice:item.lowPrice,
        }
    })
}
</script>

<style scoped>
.infinite-list {
    height: 300px;
    padding: 0;
    margin: 0;
    list-style: none;
}

.infinite-list .infinite-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 10px;
    color: var(--el-color-primary);
}

.infinite-list .infinite-list-item+.list-item {
    margin-top: 10px;
}
</style>