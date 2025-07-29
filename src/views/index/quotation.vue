<template>
    <div>
        <Header :label="$t('行情')" rightType="search"></Header>
        <div class="flex items-center bg-gray h-[50px] rounded-full p-1">
            <div v-for="item in menus" class="flex-1 flex items-center justify-center h-full rounded-full"
                :class="selectMenu === item.value ? 'text-blue bg-[#FBFCFD]' : ' opacity-30'"
                @click="handleChangeMenu(item.value)">
                <p>{{ $t(item.label) }}</p>
            </div>
        </div>
        <div class="flex flex-col items-center gap-5 my-[15px]">
            <MarketCoin v-for="(item, index) in list" :data="item"></MarketCoin>
        </div>
    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
import MarketCoin from '@/views/components/MarketCoin.vue';
import { onMounted, ref ,computed} from 'vue';
import { reqGetHotCoinList } from '../../api/apis';
import { useI18n } from 'vue-i18n';


const { t } = useI18n()
const selectMenu = ref('forex')
const list = ref([])
const menus = computed(()=>[
    {
        label: t('外汇'),
        value: 'forex',
        query: {
            order: 0,
            type2: 1
        }
    },
    {
        label: t('大宗商品'),
        value: 'gold',
        query: {
            order: 0,
            type2: 5
        }
    },
    {
        label: t('股票'),
        value: 'stock',
        query: {
            order: 0,
            type2: 3
        }
    },
    {
        label: t('加密货币'),
        value: 'index',
        query: {
            order: 0,
            type: 4
        }
    }
])

onMounted(() => {
    getHotCoinList()
})

function handleChangeMenu(value) {
    if (selectMenu.value === value) return
    selectMenu.value = value
    list.value = []
    getHotCoinList()
}

function getHotCoinList() {
    const data = menus.value.find(item => item.value === selectMenu.value)
    reqGetHotCoinList(data?.query || {}).then(res => {
        list.value = res.data.records
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