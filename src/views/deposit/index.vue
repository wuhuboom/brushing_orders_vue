<template>
    <div class="deposit-page min-h-screen bg-[#eef2fb]">
        <PageTopBar
            :title="$t('deposit')"
            :right-text="$t('Withdrawal.History')"
            show-back
            @click-left="onClickLeft"
            @click-right="toHistory"
        />

        <div class="px-[20px] pt-[16px] pb-[34px]">
            <div class="balance-card">
                <div>
                    <div class="balance-label">{{ $t("auto_account_amount") }}</div>
                    <div class="balance-value">
                        {{ formatMoney(userInfo.balance) }}
                    </div>
                </div>
            </div>

            <div class="section-label mt-[18px]">
                {{ $t("enter_amount_usdt") }}
            </div>
            <div class="amount-card">
                <div class="amount-prefix">$</div>
                <van-field
                    v-model="amount"
                    type="number"
                    input-align="left"
                    maxlength="12"
                    :border="false"
                    placeholder="0.00"
                    class="deposit-field"
                />
            </div>

            <div class="quick-amounts">
                <div
                    v-for="item in quickAmounts"
                    :key="item"
                    class="quick-amount-item"
                    :class="{ active: amount === String(item) }"
                    @click="selectQuickAmount(item)"
                >
                    ${{ formatQuickAmount(item) }}
                </div>
            </div>

            <div class="section-label mt-[18px]">
                {{ $t("select_customer_service_channel") }}
            </div>
            <div v-if="customerServices.length" class="service-list">
                <div
                    v-for="(item, index) in customerServices"
                    :key="item.id || item.name || index"
                    class="service-item"
                    :class="{ active: selectedServiceIndex === index }"
                    @click="selectedServiceIndex = index"
                >
                    <div class="service-name">
                        {{
                            item.name ||
                            $t("customer_service_no", { number: index + 1 })
                        }}
                    </div>
                    <div
                        class="service-radio"
                        :class="{ active: selectedServiceIndex === index }"
                    >
                        <div
                            v-if="selectedServiceIndex === index"
                            class="service-radio__dot"
                        ></div>
                    </div>
                </div>
            </div>
            <div v-else class="service-item service-item--empty">
                <div class="service-name">{{ $t("customer_service") }}</div>
                <div class="service-radio"></div>
            </div>

            <van-button block class="contact-btn" @click="handlePrimaryAction">
                {{ $t("contact_customer_service") }}
            </van-button>
        </div>

        <ContactUs ref="ContactUsRef" />
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import md5 from "crypto-js/md5";
import { showToast } from "@/util/message";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from "@/store/modules/common";
import ContactUs from "@/components/ContactUs.vue";
import {
    getCustomerServiceByLang,
    getRechargeAddress,
    getTradeConfig,
    topUp,
    userGetInfo,
} from "../../api/apis";
import { checkWorkTimeLocal } from "../../util/utils";

const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();
const commonStore = useCommonStore();

const ContactUsRef = ref(null);
const userInfo = ref({});
const tradeInfo = ref({});
const rechargeAddressInfo = ref({});
const customerServices = ref([]);
const selectedServiceIndex = ref(0);
const amount = ref("");
const quickAmounts = [50, 100, 200, 500, 1000, 2000];

const parLang = computed(() => {
    const mapped = commonStore.getValueByKey(commonStore.lang);
    return mapped ?? commonStore.lang;
});

const formatMoney = (value) => {
    const num = Number(value || 0);
    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
};

const formatQuickAmount = (value) => {
    return Number(value).toLocaleString("en-US");
};

const selectQuickAmount = (value) => {
    amount.value = String(value);
};

const buildKefuUrl = (baseUrl, username) => {
    if (!baseUrl) return "";

    const finalUrl = new URL(baseUrl);
    if (userStore.token && username) {
        finalUrl.searchParams.set("visitor_id", md5(username).toString());
        finalUrl.searchParams.set("visitor_name", username);
    }
    return finalUrl.toString();
};

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

const loadCustomerServices = async () => {
    try {
        const res = await getCustomerServiceByLang({ lang: parLang.value });
        customerServices.value = res?.data || [];
        if (
            customerServices.value.length &&
            selectedServiceIndex.value >= customerServices.value.length
        ) {
            selectedServiceIndex.value = 0;
        }
    } catch (error) {
        customerServices.value = [];
    }
};

const refreshPage = async () => {
    await Promise.all([
        loadUserInfo(),
        loadTradeConfig(),
        loadRechargeAddress(),
        loadCustomerServices(),
    ]);
};

// const submitDeposit = async () => {
//     const currentAmount = String(amount.value || "").trim();
//     if (!currentAmount) {
//         showToast(t("please_enter_the_amount"));
//         return;
//     }

//     const rechargeUrl = rechargeAddressInfo.value?.url;
//     if (!rechargeUrl) {
//         const time = checkWorkTimeLocal(
//             tradeInfo.value.workTimeStart,
//             tradeInfo.value.workTimeEnd,
//             userStore.zoneActive.tzName,
//         );

//         if (time) {
//             ContactUsRef.value?.open();
//         } else {
//             showToast(t("supportHours"));
//         }
//         return;
//     }

//     const payload = {
//         amout: Number(currentAmount),
//         payMethod: "USDT",
//         address: rechargeUrl,
//     };

//     const res = await topUp(payload);
//     const orderInfo = {
//         ...(res?.data || {}),
//         amout: currentAmount,
//         payMethod: payload.payMethod,
//         address: rechargeUrl,
//         network: rechargeAddressInfo.value?.network || "TRON(TRC-20)",
//     };

//     sessionStorage.setItem("depositOrderInfo", JSON.stringify(orderInfo));
//     router.push({ path: "/address" });
// };

const submitDepositServer = async () => {
    const selectedService = customerServices.value[selectedServiceIndex.value];
    const serviceUrl = selectedService?.linkUrl || selectedService?.url;
    if (serviceUrl) {
        const finalUrl = buildKefuUrl(serviceUrl, userInfo.value?.username);
        window.open(finalUrl);
        return;
    }

    const rechargeUrl = rechargeAddressInfo.value?.url;
    if (rechargeUrl) {
        router.push({ path: "/address" });
        return;
    }

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
};

const handlePrimaryAction = () => {
    submitDepositServer();
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
.deposit-page {
    min-height: 100vh;
    background: #eef2fb;
    color: #0f1115;
}

.deposit-page :deep(.page-top-bar) {
    height: 80px;
    padding-top: 0;
    grid-template-columns: 50px minmax(0, 1fr) 74px;
    background: #000;
}

.deposit-page :deep(.page-top-bar::before),
:deep(.deposit-field.van-cell::after),
.service-radio,
.service-radio__dot {
    display: none;
}

.deposit-page :deep(.page-top-bar__title) {
    padding-top: 0;
    color: #fff;
    font-size: 21px;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
}

.deposit-page :deep(.page-top-bar__side) {
    padding: 0;
}

.deposit-page :deep(.page-top-bar__side--left),
.deposit-page :deep(.page-top-bar__side--right) {
    justify-content: center;
}

.deposit-page :deep(.page-top-bar__right-text) {
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 12px;
    color: #ffffff;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.deposit-page :deep(.page-top-bar .van-icon) {
    color: #fff !important;
    font-size: 28px !important;
}

.balance-card {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 17px 18px 26px;
    /*background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    box-shadow: 0px 4px 6px 1px rgba(0, 0, 0, 0.1);
    border-radius: 7px 7px 7px 7px;*/

    border-radius: 8px;
    background: url(@/static/images/wallet-amount-card-bg.png) no-repeat;
    background-size: 100% 100%;
}

.balance-label,
.balance-value {
    position: relative;
    z-index: 1;
    color: #fff;
    font-weight: 700;
}

.balance-label {
    font-size: 21px;
    line-height: 1.15;
}

.balance-value {
    margin-top: 12px;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 26px;
    color: #ffffff;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.section-label {
    margin-bottom: 16px;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #000000;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.amount-card {
    display: flex;
    align-items: center;
    height: 48px;
    overflow: hidden;
    padding: 0 24px;
    border: 1px solid #d8e0ee;
    border-radius: 12px;
    background: #fff;
    box-sizing: border-box;
}

.amount-prefix {
    flex-shrink: 0;
    margin-right: 8px;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #78828a;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

:deep(.deposit-field) {
    flex: 1;
    padding: 0;
    background: transparent;
}

:deep(.deposit-field .van-field__body),
:deep(.deposit-field .van-field__control) {
    min-height: 94px;
}

:deep(.deposit-field .van-field__control) {
    color: #111827;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #78828a;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

:deep(.deposit-field .van-field__control::placeholder) {
    color: #7b8597;
    opacity: 1;
}

.quick-amounts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px 8px;
    margin-top: 16px;
}

.quick-amount-item {
    padding: 8px 39px 10px;
    border: none;
    border-radius: 8px;
    background: #fff;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 14px;
    color: #757575;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.quick-amount-item.active {
    border-color: #3442e6;
    background: #3442e6;
    color: #fff;
}

.service-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.service-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 12px 16px;
    border: 1px solid transparent;
    border-radius: 8px;
    background: #fff;
    box-sizing: border-box;
}

.service-item.active {
    border-color: #3442e6;
}

.service-item--empty {
    opacity: 0.8;
}

.service-name {
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 14px;
    color: #000000;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.contact-btn {
    margin-top: 32px;
    padding: 15px 40px;
    border: none;
    border-radius: 8px;
    background: #3043e3;
    box-shadow: none;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #fafafa;
    line-height: 24px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}
</style>
