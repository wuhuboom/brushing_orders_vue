<template>
    <div>
        <Header :label="$t('出入金记录')"></Header>
        <div class="flex items-center gap-4 mt-5 text-base pb-6"
            style="border-bottom: 1px solid hsla(0, 0%, 92.9%, .46);">
            <div v-for="item, index in recordType" class="flex-1 flex" @click="handleChangeType(item)">
                <div class="flex items-start flex-col gap-1">
                    <img :src="getStaticImageUrl(item.icon)" alt="" class="w-5 h-5">
                    <p>{{ item.name }}</p>
                </div>
                <el-icon class="text-blue ml-auto" size="20" v-if="item.value === selectType">
                    <Select />
                </el-icon>
            </div>
        </div>

        <div class="grid grid-cols-2 items-center gap-4 py-6 text-base"
            style="border-bottom: 1px solid hsla(0, 0%, 92.9%, .46);">
            <div v-for="item, index in status" class="flex-1 flex" @click="handleChangeStatus(item)">
                <div class="flex items-start gap-1">
                    <img :src="getStaticImageUrl(item.icon)" alt="" class="w-5 h-5">
                    <p>{{ item.name }}</p>
                </div>
                <el-icon class="text-blue ml-auto" size="20" v-if="item.value === selectStatus">
                    <Select />
                </el-icon>
            </div>
        </div>

        <div class="flex flex-col gap-4 mt-8">
            <div v-for="item in list" class="flex items-center gap-4">
                <img src="@/static/images/recode-recharge.png" alt="" class="h-11 w-11" v-if="item.type === 1">
                <img src="@/static/images/recode-withdraw.png" alt="" class="h-11 w-11" v-else>
                <div>
                    <p class="text-lg">{{ item.amount }}</p>
                    <p class="text-xs opacity-50">{{ formatTime(item.updateTime) }}</p>

                </div>
                <img src="" alt="">
                <el-icon class="ml-auto" size="24" color="#facc14"
                    v-if="item.status === 'APPLYING' || item.checkStatus === 'APPLYING'">
                    <Timer />
                </el-icon>
                <el-icon class="ml-auto text-red" size="24"
                    v-else-if="item.status === 'FAILED' || item.checkStatus === 'FAILED'">
                    <CloseBold />
                </el-icon>
                <el-icon class="ml-auto text-blue" size="24" v-else><Select /></el-icon>
            </div>
        </div>
    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getStaticImageUrl } from '../../util/utils'
import { reqGetRechargeList, reqGetWithdrawList } from '../../api/apis'
import { formatTime } from '../../util/times'

const { t } = useI18n()
// 记录类型
const recordType = computed(() => {
    return [{
        name: t('所有类型'),
        value: 0,
        icon: 'recode-all.png'
    },
    {
        name: t('充值'),
        value: 1,
        icon: 'recode-recharge.png'
    },
    {
        name: t('提现'),
        value: 2,
        icon: 'recode-withdraw.png'
    }]
})
const selectType = ref(0)
const selectStatus = ref('')
// 状态
const status = computed(() => {
    return [{
        name: t('所有'),
        value: '',
        icon: 'recode-all.png'
    },
    {
        name: t('审核中'),
        value: 'APPLYING',
        icon: 'recode-pending.png'
    },
    {
        name: t('成功'),
        value: 'PASSED',
        icon: 'recode-success.png'
    }, {
        name: t('失败'),
        value: 'FAILED',
        icon: 'recode-fail.png'
    }]
})
const list = ref([])

onMounted(() => {
    getDepositList()
    getWithdrawList()
})

function getDepositList() {
    // 调用接口获取数据
    reqGetRechargeList().then(res => {
        // 给list的每一个加个类型参数
        res.data.records.forEach(item => {
            item.type = 1
        })
        // 筛选status
        if (selectStatus.value) {
            res.data.records = res.data.records.filter(item => item.status === selectStatus.value)
        }
        list.value = [...list.value, ...res.data.records]

    })
}

function getWithdrawList() {
    // 调用接口获取数据
    reqGetWithdrawList().then(res => {
        res.data.records.forEach(item => {
            item.type = 2
        })
        // 筛选status
        if (selectStatus.value) {
            res.data.records = res.data.records.filter(item => item.checkStatus === selectStatus.value)
        }
        list.value = [...list.value, ...res.data.records]
    })
}

function handleChangeType(item) {
    selectType.value = item.value
    getData()
}

function handleChangeStatus(item) {
    if (item.value === selectStatus.value) return
    selectStatus.value = item.value
    getData()
}

function getData() {
    list.value = []
    if (selectType.value === 1) {
        getDepositList()
    } else if (selectType.value === 2) {
        getWithdrawList()
    } else {
        getDepositList()
        getWithdrawList()
    }
}
</script>

<style scoped></style>