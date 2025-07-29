<template>
    <div>
        <Header view="market" :label="$t('出金')"></Header>
        <div class="flex items-center bg-gray h-[50px] rounded-full p-1 mt-5 text-base" v-if="menus.length > 1">
            <div v-for="item in menus" class="flex-1 flex items-center justify-center h-full rounded-full"
                :class="selectMenu === item.value ? 'text-blue bg-[#FBFCFD]' : ' opacity-30'"
                @click="handleChangeMenu(item.value)">
                <p>{{ item.label }}</p>
            </div>
        </div>
        <div v-if="list.length > 0">
            <el-form status-icon label-width="auto" class="w-full mt-8">
                <div v-if="selectMenu === 'crypto'">
                    <el-form-item :label="$t('选择网络')" prop="email" label-position="top" @click="openSelectUserCoin">
                        <el-input v-model="params.coin" type="text" autocomplete="off" size="large" :disabled="true" />
                    </el-form-item>
                    <el-form-item :label="$t('确认地址')" prop="email" label-position="top" @click="openSelectUserCoin">
                        <el-input v-model="params.channel" type="text" autocomplete="off" size="large"
                            :disabled="true" />
                    </el-form-item>
                </div>
                <div v-else>
                    <el-form-item :label="$t('选择法币')" prop="email" label-position="top" @click="openSelectFiatCurrency">
                        <el-input v-model="params.country" type="text" autocomplete="off" size="large" :disabled="true" />
                    </el-form-item>
                    <el-form-item :label="$t('银行名称')" prop="email" label-position="top" @click="openSelectBankCard">
                        <el-input v-model="params.coin" type="text" autocomplete="off" size="large" :disabled="true" />
                    </el-form-item>
                    <el-form-item :label="$t('银行卡号')" prop="email" label-position="top" @click="openSelectBankCard">
                        <el-input v-model="params.channel" type="text" autocomplete="off" size="large"
                            :disabled="true" />
                    </el-form-item>
                </div>
                <el-form-item :label="$t(`${$t('出金金额')}(${$t('最低')}：${setting.leastWithdrawal})`)"
                    prop="email" label-position="top" @click="openSelectCoinNet">
                    <el-input v-model="params.amountOfWithdrawal" type="text" autocomplete="off" size="large" />
                    <div class="flex items-center w-full mt-1.5 opacity-50">
                        <p>{{ $t('手续费') }}：{{ fee }}</p>
                        <p class="ml-auto">{{ $t('实际到账') }}：{{ actualAmount }}</p>
                    </div>
                </el-form-item>
            </el-form>
            <div @click="submitForm" class="w-full relative -right-5">
                <div class=" text-base mt-10 bg-blue px-5 flex items-center h-12 rounded-l-2.5 text-white button-bg">
                    <div>{{ $t('完成') }}</div>
                    <el-icon class="ml-auto" size="20">
                        <Check />
                    </el-icon>
                </div>
            </div>
        </div>
        <div v-else>
            <div v-if="selectMenu === 'crypto'">
                <img src="@/static/images/wallet.png" alt="" class="w-52 m-auto">
                <p class="text-center opacity-40">{{ $t('无数字货币钱包') }}</p>
            </div>
            <div v-else>
                <img src="@/static/images/bank.png" alt="" class="w-52 m-auto">
                <p class="text-center opacity-40">{{ $t('请先添加银行卡') }}</p>
            </div>
        </div>
        <SelectUserCoin ref="selectUserCoinRef" :list="list" v-model="params.id"></SelectUserCoin>
        <SelectBankCard ref="selectBankCardRef" :list="list" v-model="params.id"></SelectBankCard>
        <SelectFiatCurrency ref="selectFiatCurrencyRef" :list="fiatCurrencyList" v-model="params.country"></SelectFiatCurrency>
    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
import SelectUserCoin from './components/SelectUserCoin.vue'
import SelectBankCard from './components/SelectBankCard.vue'
import SelectFiatCurrency from './components/SelectFiatCurrency.vue'
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { reqGetBindList } from '@/api/apis.js'
import { reqWithdraw ,reqGetCurrencyConfig} from '../../api/apis';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '@/store/modules/common';
import BigNumber from 'bignumber.js';
import { useUserStore } from '../../store/modules/user';

const { t } = useI18n()
const selectMenu = ref('crypto')
const list = ref([])
const selectUserCoinRef = ref(null)
const selectBankCardRef = ref(null)
const selectFiatCurrencyRef = ref(null)
const commonStore = useCommonStore()
const setting = computed(() => commonStore.setting)
const userStore = useUserStore()
const fiatCurrencyList = ref([])

onMounted(() => {
    getBankCardList()
    getCurrencyConfig()
})

const fee = computed(() => {
    const fee = new BigNumber(setting.value.withdrawalFee).times(params.amountOfWithdrawal).div(100).toFixed()
    return fee === 'NaN' ? 0 : fee
})

// 实际到账 = 出金金额 - 手续费
const actualAmount = computed(() => {
    const actualAmount = new BigNumber(params.amountOfWithdrawal).minus(fee.value).toFixed()
    return actualAmount === 'NaN' ? 0 : actualAmount
})


const menus = computed(() => [
    {
        label: t('数字货币'),
        value: 'crypto'
    },
    {
        label: t('银行卡'),
        value: 'bank'
    }
])
const params = reactive({
    id: '',
    channel: '',
    amountOfWithdrawal: '',
    coin: '',
    mode: 1,
    country: ''
})

watch(() => params.id, () => {
    if (!params.id) return
    const options = list.value.find(item => item.id === params.id)
    params.channel = options.bankCardNumber || ''
    params.coin = selectMenu.value === 'crypto' ? `${list.value[0].bankName}/${list.value[0].accountOpeningAddress}-${list.value[0].bankName}` : list.value[0].bankName
    params.country = options.country
    
})

function getBankCardList() {
    reqGetBindList({ type: selectMenu.value === 'crypto' ? 'DIGITAL_WALLET_ADDRESS' : "BANK_CARD" }).then(res => {
        list.value = res.data.records
        if (list.value.length > 0) {
            params.id = list.value[0].id
        }
    })
}

function handleChangeMenu(value) {
    selectMenu.value = value
    params.id = ''
    params.channel = ''
    params.amountOfWithdrawal = ''
    params.coin = ''
    params.country = ''
    getBankCardList()
}

function submitForm() {
    const data = {
        amountOfWithdrawal: params.amountOfWithdrawal,
        mode: selectMenu.value === 'crypto' ? 1 : 2
    };
    // 修改正则表达式以支持 100、100.、100.00 等格式
    if (!/^\d+(\.\d*)?$/.test(data.amountOfWithdrawal)) {
        ElMessage({ message: t('请输入正确的金额'), type: "error" });
        return;
    }
    if (selectMenu.value === 'crypto') {
        const options = list.value.find(item => item.id === params.id)
        data.channel = options.bankCardNumber
        data.coin = options.bankName
    }else {
        data.coin = params.country
        data.bindBankCardId = params.id
    }
    reqWithdraw(data).then(res => {
        ElMessage({ message: t('提交成功'), type: "success" })
        userStore.getUserBalance()
    })
}

function getCurrencyConfig() {
    reqGetCurrencyConfig({ type: 1 }).then(res => {
        fiatCurrencyList.value = res.data
    })
}

function openSelectUserCoin() {
    selectUserCoinRef.value.open()
}

function openSelectBankCard() {
    selectBankCardRef.value.open()
}

function openSelectFiatCurrency() {
    selectFiatCurrencyRef.value.open()
}
</script>

<style scoped>
.avatar-uploader .el-upload {

    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    width: 100%;
}

.el-form-item__content {
    border: 2px solid #3d3d3d !important;
    width: 100%;
}

.avatar-uploader {
    width: 100% !important;
}

:deep(.el-upload) {
    width: 100% !important;
}

.avatar-uploader .el-upload:hover {
    /* border-color: var(--el-color-primary); */
    border: 2px solid #3d3d3d !important;
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 116px;
    text-align: center;
    border: 2px solid #3d3d3d !important;
    border-radius: 10px;
}
</style>