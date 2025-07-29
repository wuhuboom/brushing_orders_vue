<template>
    <div>
        <Header view="market" :label="$t('银行卡')" rightType="bank"></Header>
        <div class="py-5" v-if="bankCardList.length > 0">
            <div class="button-bg bg-blue rounded-[20px] p-5 text-white" @click="toAddBank(item)"
                v-for="item in bankCardList">
                <div class="flex items-center">
                    <p class="text-lg">{{ item.bankCardName }}</p>
                    <p class="ml-auto">{{ item.bankName }}</p>
                </div>
                <p class="mt-4 text-sm">{{ item.bankCardNumber }}</p>
            </div>
        </div>
        <img src="@/static/images/bank.png" alt="" class="w-52 m-auto" v-else>
    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { reqGetBindList } from '../../api/apis';

const router = useRouter()
const bankCardList = ref([])

onMounted(() => {
    getBankCardList()
})

function getBankCardList() {
    reqGetBindList({ type: "BANK_CARD" }).then(res => {
        console.log(res)
        bankCardList.value = res.data.records
    })
}

function toAddBank(item) {
    router.push({ path: '/user/addBank', query: { type: 'delete', id: item.id } })
}
</script>

<style scoped></style>