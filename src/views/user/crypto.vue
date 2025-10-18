<template>
    <div>
        <Header view="market" :label="$t('加密钱包')" rightType="crypto"></Header>
        <div class="py-5 flex flex-col gap-2.5" v-if="bankCardList.length > 0">
            <div class="flex items-start gap-4" @click="toAddCrypto(item)" v-for="item in bankCardList">
                <img src="@/static/images/usdt.png" alt="" class="w-[45px] h-[45px]">
                <div class="flex-1 p-4 rounded-2xl" style="box-shadow: 0px 3px 8px 0 rgba(0, 0, 0, .16);">
                    <p class=" opacity-50 text-sm">{{`${item.accountOpeningAddress}-${item.bankName}`}}</p>
                    <div class="flex items-center gap-2 w-max" @click.stop="copyContent('xsfa')">
                        <p class="text-lg">{{ item.bankCardNumber }}</p>
                        <el-icon size="18" class=" opacity-50">
                            <DocumentCopy />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
        <img src="@/static/images/wallet.png" alt="" class="w-52 m-auto" v-else>
    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
import { copyContent } from '../../util/utils';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { reqGetBindList } from '../../api/apis';

const router = useRouter()
const bankCardList = ref([])

onMounted(() => {
    getBankCardList()
})

function getBankCardList() {
    reqGetBindList({ type: "DIGITAL_WALLET_ADDRESS" }).then(res => {
        bankCardList.value = res.data.records
    })
}
function toAddCrypto(item) {
    router.push({ path: '/user/addCrypto', query: { type: 'delete', data: JSON.stringify(item) } })
}

</script>

<style scoped></style>