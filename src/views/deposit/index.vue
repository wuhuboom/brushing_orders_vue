<template>
    <div class="min-h-[100vh] bg-[#f6f6f6]">
        <div
            class="relative bg-gradient-to-r from-[#a04149] to-[#6a4d52] px-[16px] pt-[14px] pb-[30px]"
        >
            <div class="relative flex items-center justify-center h-[42px]">
                <div class="absolute left-0">
                    <van-icon
                        name="arrow-left"
                        color="#fff"
                        size="22px"
                        @click="onClickLeft"
                    />
                </div>
                <div class="text-[18px] text-white font-medium">
                    {{ $t("定金") }}
                </div>
                <div
                    class="absolute right-0 text-[16px] text-white"
                    @click="toHistory"
                >
                    {{ $t("Withdrawal.History") }}
                </div>
            </div>

            <div
                class="flex justify-end mt-[8px] mb-[28px]"
                @click="refreshPage"
            >
                <img
                    class="w-[24px] h-[24px]"
                    src="../../static/images/shuaxin.png"
                    alt=""
                />
            </div>

            <div class="text-center text-white text-[15px]">
                {{ $t("账户金额") }}
            </div>
            <div class="flex items-end justify-center mt-[12px]">
                <div class="text-white text-[40px] leading-none">
                    {{ userInfo.balance || 0 }}
                </div>
                <div
                    class="ml-[6px] mb-[4px] text-white text-[18px] leading-none"
                >
                    USD
                </div>
            </div>
        </div>

        <div class="px-[26px] pt-[18px] pb-[24px]">
            <div class="deposit-input-wrap">
                <van-field
                    v-model="amount"
                    type="number"
                    input-align="left"
                    maxlength="12"
                    :border="false"
                    :placeholder="$t('请输入金额')"
                    class="deposit-field"
                />
            </div>

            <van-button
                block
                class="deposit-btn mt-[18px]"
                @click="submitDeposit"
            >
                {{ $t("deposit.btn.submit.money.text") }}
            </van-button>
        </div>

        <ContactUs ref="ContactUsRef" />
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/store/modules/user";
import ContactUs from "@/components/ContactUs.vue";
import {
    getRechargeAddress,
    getTradeConfig,
    topUp,
    userGetInfo,
} from "../../api/apis";
import { checkWorkTimeLocal } from "../../util/utils";

const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();

const ContactUsRef = ref(null);
const userInfo = ref({});
const tradeInfo = ref({});
const rechargeAddressInfo = ref({});
const amount = ref("");

const loadUserInfo = async () => {
    const res = await userGetInfo();
    userInfo.value = res.data || {};
};

const loadTradeConfig = async () => {
    const res = await getTradeConfig();
    tradeInfo.value = res.data || {};
};

const loadRechargeAddress = async () => {
    const res = await getRechargeAddress();
    rechargeAddressInfo.value = res?.data?.[0] || {};
};

const refreshPage = async () => {
    await Promise.all([
        loadUserInfo(),
        loadTradeConfig(),
        loadRechargeAddress(),
    ]);
};

const submitDeposit = async () => {
    const currentAmount = String(amount.value || "").trim();
    if (!currentAmount) {
        showToast(t("请输入金额"));
        return;
    }

    const rechargeUrl = rechargeAddressInfo.value?.url;
    if (!rechargeUrl) {
        const time = checkWorkTimeLocal(
            tradeInfo.value.workTimeStart,
            tradeInfo.value.workTimeEnd,
            userStore.zoneActive.tzName,
        );

        if (time) {
            ContactUsRef.value?.open();
        } else {
            showToast(t("supportHours"));
        }
        return;
    }

    const payload = {
        amout: Number(currentAmount),
        payMethod: "USDT",
        address: rechargeUrl,
    };

    const res = await topUp(payload);
    const orderInfo = {
        ...(res?.data || {}),
        amout: currentAmount,
        payMethod: payload.payMethod,
        address: rechargeUrl,
        network: rechargeAddressInfo.value?.network || "TRON(TRC-20)",
    };

    sessionStorage.setItem("depositOrderInfo", JSON.stringify(orderInfo));
    router.push({ path: "/address" });
};

const toHistory = () => {
    router.push({ path: "/depositHistory" });
};

const onClickLeft = () => history.back();

onMounted(() => {
    refreshPage();
});
</script>

<style scoped>
.deposit-input-wrap {
    border: 1px solid #e9e4e4;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.45);
}

:deep(.deposit-field) {
    padding: 8px 16px;
}

:deep(.deposit-field .van-field__body) {
    min-height: 38px;
}

:deep(.deposit-field .van-field__control) {
    min-height: 38px;
    padding: 0;
    font-size: 16px;
    color: #333333;
}

:deep(.deposit-field .van-field__control::placeholder) {
    color: #bebebe;
    font-size: 15px;
}

.deposit-btn {
    margin-top: 20px;
    height: 54px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(90deg, #a04149 0%, #765760 100%);
    color: #ffffff;
    font-size: 16px;
}
</style>
