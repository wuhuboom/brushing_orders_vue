<template>
    <div class="deposit-page min-h-screen bg-[#F5F8F7]">
        <PageTopBar
            :title="$t('deposit')"
            :right-text="$t('Withdrawal.History')"
            show-back
            @click-left="onClickLeft"
            @click-right="toHistory"
        />

        <div class="px-[20px] pt-[82px] pb-[34px]">
            <div class="balance-card">
                <div>
                    <div class="balance-label">
                        {{ $t("available_balance") }}
                    </div>
                    <div class="balance-value">
                        ${{ formatMoney(userInfo.balance) }}
                    </div>
                </div>
                <div class="balance-tag">{{ $t("ui_usdt") }}</div>
            </div>

            <!-- <div class="section-label mt-[22px]">{{ $t("enter_amount_usdt") }}</div>
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
          @click="selectQuickAmount(item)"
        >
          ${{ formatQuickAmount(item) }}
        </div>
      </div> -->

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
.page-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    height: 64px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #dce9df;
}

@media (min-width: 768px) {
    .page-header {
        left: 50%;
        right: auto;
        width: 100%;
        max-width: var(--app-pc-max-width, 375px);
        transform: translateX(-50%);
    }
}

.page-header__left,
.page-header__right {
    position: absolute;
    top: 0;
    height: 64px;
    display: flex;
    align-items: center;
}

.page-header__left {
    left: 18px;
}

.page-header__right {
    right: 18px;
    color: #26352e;
    font-size: 16px;
    font-weight: 400;
}

.page-header__title {
    color: #22342b;
    font-size: 18px;
    font-weight: 500;
}

.balance-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 24px 22px;
    border-radius: 20px;
    background: linear-gradient(135deg, #1f9a47 0%, #1e9644 100%);
    box-shadow: 0 10px 22px rgba(33, 154, 72, 0.18);
}

.balance-label {
    color: rgba(255, 255, 255, 0.88);
    font-size: 14px;
    line-height: 20px;
}

.balance-value {
    margin-top: 8px;
    color: #ffffff;
    font-size: 24px;
    line-height: 32px;
    font-weight: 500;
}

.balance-tag {
    min-width: 78px;
    padding: 8px 14px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.18);
    color: #ffffff;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
}

.section-label {
    color: #6f8f78;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 10px;
}

.amount-card {
    display: flex;
    align-items: center;
    min-height: 72px;
    border-radius: 18px;
    border: 1px solid #cfe5d5;
    background: #ffffff;
    padding: 0 18px;
}

.amount-prefix {
    flex-shrink: 0;
    color: #23a455;
    font-size: 22px;
    line-height: 1;
    font-weight: 500;
    margin-right: 10px;
}

:deep(.deposit-field) {
    flex: 1;
    padding: 0;
    background: transparent;
}

:deep(.deposit-field .van-field__body) {
    min-height: 56px;
}

:deep(.deposit-field .van-field__control) {
    min-height: 56px;
    color: #6c746f;
    font-size: 20px;
    line-height: 28px;
}

:deep(.deposit-field .van-field__control::placeholder) {
    color: #98a39d;
}

.quick-amounts {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 14px;
}

.quick-amount-item {
    min-width: 54px;
    height: 34px;
    padding: 0 16px;
    border-radius: 10px;
    border: 1px solid #cfe5d5;
    background: #ffffff;
    color: #68806f;
    font-size: 14px;
    line-height: 32px;
    text-align: center;
    box-sizing: border-box;
}

.service-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.service-item {
    min-height: 64px;
    border-radius: 18px;
    border: 1px solid #d8ece0;
    background: #ffffff;
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.service-item.active {
    border-color: #7bc995;
}

.service-item--empty {
    opacity: 0.8;
}

.service-name {
    color: #22342b;
    font-size: 16px;
    line-height: 24px;
}

.service-radio {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid #b6d6c0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

.service-radio.active {
    border-color: #23a455;
}

.service-radio__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #23a455;
}

.contact-btn {
    margin-top: 20px;
    height: 56px;
    border: none;
    border-radius: 18px;
    background: linear-gradient(90deg, #37c767 0%, #1c9b45 100%);
    box-shadow: 0 10px 20px rgba(33, 154, 72, 0.2);
    color: #ffffff;
    font-size: 18px;
    font-weight: 500;
}
</style>
