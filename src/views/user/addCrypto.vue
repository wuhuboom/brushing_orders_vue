<template>
    <div>
        <Header view="market" :label="$t('添加加密钱包')" :rightType="type" @rightClick="handleDelete"></Header>
        <el-form :model="ruleForm" status-icon :rules="rules" label-width="auto" class="w-full mt-8">
            <el-form-item :label="$t('币种名称')" prop="email" label-position="top" @click="openSelectCoinNet">
                <el-input v-model="ruleForm.bankName" type="text" autocomplete="off" size="large" :disabled="true" />
            </el-form-item>
            <el-form-item :label="$t('币种网络')" prop="email" label-position="top" @click="openSelectCoinNet">
                <el-input v-model="ruleForm.accountOpeningAddress" type="text" autocomplete="off" size="large" :disabled="true" />
            </el-form-item>
            <el-form-item :label="$t('地址')" prop="email" label-position="top">
                <el-input v-model="ruleForm.bankCardNumber" type="text" autocomplete="off" size="large"
                    :disabled="type" />
            </el-form-item>
        </el-form>
        <div @click="submitForm()" class="w-full relative -right-5" size="large" round v-if="!type">
            <div class=" text-base mt-12 bg-blue px-5 flex items-center h-12 rounded-l-2.5 text-white button-bg">
                <div>{{ $t('添加加密钱包') }}</div>
                <el-icon class="ml-auto" size="20"><Select /></el-icon>
            </div>

        </div>
        <Delete ref="deleteRef" @confirm="confirmDelete" type="crypto"></Delete>
        <SelectCoinNet ref="selectCoinNetRef" :list="currencyList" v-model="selectCurrency"></SelectCoinNet>
    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
import Delete from './components/Delete.vue';
import SelectCoinNet from './components/SelectCoinNet.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { reqBindBank, reqDeleteBind, reqGetCurrencyConfig } from '../../api/apis';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const type = ref(route.query.type)
const deleteRef = ref(null)
const selectCoinNetRef = ref(null)
const id = ref(null)
const ruleForm = reactive({
    bankName: '', // 币种
    accountOpeningAddress: '', //  网络
    bankCardNumber: '', // 地址
    type: 'DIGITAL_WALLET_ADDRESS'
})
const rules = computed(() => {
    return {
    }
})
const currencyList = ref([]) // 币种列表
const selectCurrency = ref(null) // 选择的币种
const currency = computed(() => {
    return currencyList.value.filter(item => item.label === selectCurrency.value)[0]
})
watch(selectCurrency, (newVal) => {
    if (newVal) {
        ruleForm.bankName = currency.value.currency
        ruleForm.accountOpeningAddress = currency.value.label
    }
})


onMounted(() => {
    if (route.query.data) {
        const data = JSON.parse(route.query.data)
        ruleForm.bankName = data.bankName
        ruleForm.accountOpeningAddress = `${data.accountOpeningAddress}-${ruleForm.bankName}`
        ruleForm.bankCardNumber = data.bankCardNumber
        id.value = data.id
    } else {
        getCurrencyConfig()
    }

})

function getCurrencyConfig() {
    reqGetCurrencyConfig({ type: 2 }).then(res => {
        res.data.forEach(item => {
            let temp = {
                label: '',
                currency: item.currency,
                network: '',
                icon: item.icon
            }
            item.tradingNetwork = JSON.parse(item.tradingNetwork)
            Object.keys(item.tradingNetwork).forEach(key => {
                currencyList.value.push({
                    ...temp,
                    label: `${key}-${temp.currency}`,
                    network: key
                })
            })
            selectCurrency.value = currencyList.value[0].label
        })
    })
}

function handleDelete() {
    deleteRef.value.open()
}

function confirmDelete() {
    reqDeleteBind(id.value).then(res => {
        deleteRef.value.close()
        ElMessage({ message: t('删除成功'), type: "success" })
        router.back()
    })
}
function openSelectCoinNet() {
    selectCoinNetRef.value.open()
}

function submitForm() {
    ruleForm.accountOpeningAddress = currency.value.network
    reqBindBank(ruleForm).then(res => {
        ElMessage({ message: t('添加成功'), type: "success" })
        router.back()
    })
}
</script>

<style scoped></style>