<template>
    <div class="payment-method-page min-h-screen bg-[#eef2fb]">
        <PageTopBar
            :title="$t('wallet_management')"
            show-back
            @click-left="onClickLeft"
        />

        <div class="payment-method-page__body">
            <div class="hero-card">
                <div class="hero-icon-wrap">
                    <!-- <van-icon name="coupon-o" size="34" color="#fff" /> -->
                    <img
                        src="@/static/images/cardbank.png"
                        alt=""
                        class="w-50.86 h-54"
                    />
                </div>
                <div class="hero-content">
                    <div class="hero-title">
                        {{ $t("bind_wallet_account") }}
                    </div>
                    <div class="hero-desc">
                        {{
                            $t(
                                "dear_user_please_enter_your_btc_20_eth_20_address_do_not_enter_your_bank_account_information_or_password",
                            )
                        }}
                    </div>
                </div>
            </div>

            <div class="px-[20px] mt-[30px]">
                <div class="field-group">
                    <div class="field-label">
                        <span>{{ $t("wallet_name") }}</span>
                    </div>
                    <van-field
                        v-model="form.name"
                        label=""
                        :placeholder="$t('please_enter_wallet_name')"
                        label-align="top"
                        class="custom-field"
                    />
                </div>

                <div class="field-group">
                    <div class="field-label">
                        <span>{{ $t("network") }}</span>
                    </div>
                    <van-field
                        v-model="form.walletType"
                        label=""
                        :placeholder="$t('please_enter_network')"
                        label-align="top"
                        class="custom-field"
                    />
                </div>

                <div class="field-group">
                    <div class="field-label">
                        <span>{{ $t("wallet_address") }}</span>
                    </div>
                    <van-field
                        v-model="form.walletAddress"
                        label=""
                        :placeholder="$t('please_enter_wallet_address')"
                        label-align="top"
                        class="custom-field"
                    />
                </div>

                <div class="notice-card">
                    <img src="@/static/images/passwall.png" alt="" />
                    <div class="notice-text">
                        {{ $t("account_encrypted_notice") }}
                    </div>
                </div>

                <div class="mt-[30px]">
                    <van-button
                        :class="[
                            'submit-btn',
                            { 'submit-btn--active': isFormReady },
                        ]"
                        block
                        @click="submitForm"
                    >
                        {{ $t("submit") }}
                    </van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive } from "vue";
import { addWalletBank, getBankWallet } from "../../api/apis";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { showToast } from "@/util/message";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const routePathStackKey = "route-path-stack";

const form = reactive({
    name: "",
    walletType: "",
    walletAddress: "",
});

const isFormReady = computed(
    () => !!form.name && !!form.walletType && !!form.walletAddress,
);

const readRouteStack = () => {
    try {
        const stack = JSON.parse(
            sessionStorage.getItem(routePathStackKey) || "[]",
        );
        return Array.isArray(stack)
            ? stack.filter((path) => typeof path === "string" && path)
            : [];
    } catch (error) {
        console.warn("Failed to read route stack", error);
        return [];
    }
};

const getSafeReturnPath = () => {
    const stack = readRouteStack();
    const currentIndex = stack.lastIndexOf(route.path);
    const safeReturnPaths = ["/cardList", "/withdraw", "/my"];
    const previousStack = (
        currentIndex >= 0 ? stack.slice(0, currentIndex) : stack
    )
        .filter((path) => path !== route.path)
        .reverse();

    return (
        previousStack.find((path) => safeReturnPaths.includes(path)) ||
        "/cardList"
    );
};

const getReturnQuery = (returnPath) => {
    if (returnPath !== "/cardList") return {};
    const query = {};
    if (route.query.type != null) query.type = route.query.type;
    if (route.query.fromType != null) query.fromType = route.query.fromType;
    if (route.query.sourceType != null)
        query.sourceType = route.query.sourceType;
    return query;
};

const goBackAfterSave = () => {
    const returnPath = getSafeReturnPath();
    router.push({ path: returnPath, query: getReturnQuery(returnPath) });
};

const submitForm = async () => {
    const query = {
        type: 2,
        name: form.name,
    };

    if (route.query.id) {
        query.id = Number(route.query.id);
    }

    if (!form.name) return showToast(t("please_enter_wallet_name"));
    if (!form.walletType) return showToast(t("please_enter_network"));
    if (!form.walletAddress) return showToast(t("please_enter_wallet_address"));

    query.walletType = form.walletType;
    query.walletAddress = form.walletAddress;

    await addWalletBank(query);
    showToast(
        route.query.id ? t("modification_successful") : t("added_successfully"),
    );
    goBackAfterSave();
};

const onClickLeft = () => {
    goBackAfterSave();
};

const getgetBankWallet = async () => {
    const res = await getBankWallet({ id: route.query.id });
    form.name = res.data.name;
    form.walletAddress = res.data.walletAddress;
    form.walletType = res.data.walletType;
};

onMounted(() => {
    if (route.query.id) {
        getgetBankWallet();
    }
});
</script>

<style scoped>
.payment-method-page :deep(.van-nav-bar) {
    background: #000000;
}

.payment-method-page :deep(.van-nav-bar__title) {
    color: #ffffff;
    font-size: 20px;
    font-weight: 600;
}

.payment-method-page :deep(.van-nav-bar .van-icon) {
    color: #ffffff;
}

.payment-method-page :deep(.van-nav-bar::after) {
    border-bottom: none;
}

.payment-method-page__body {
    padding: 10px 0 36px;
}

.hero-card {
    position: relative;
    overflow: hidden;
    background: url(@/static/images/wallet-amount-card-bg.png) no-repeat;
    background-size: 100% 100%;
    padding: 28px 24px 24px;
    margin: 0 10px;
    display: flex;
    gap: 16px;
    align-items: flex-start;
}

.hero-icon-wrap {
    width: 56px;
    height: 56px;
    /*border-radius: 14px;
    background: rgba(255, 255, 255, 0.16);*/
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.hero-content {
    position: relative;
    z-index: 1;
    min-width: 0;
    flex: 1;
}

.hero-title {
    color: #ffffff;
    font-size: 17px;
    line-height: 24px;
    font-weight: 500;
}

.hero-desc {
    margin-top: 8px;
    color: rgba(255, 255, 255, 0.92);
    font-size: 12px;
}

.field-group + .field-group {
    margin-top: 22px;
}

.field-label {
    display: block;
    color: #000000;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    margin-bottom: 13px;
}

.custom-field {
    height: 48px;
    min-height: 48px;
    border: 1px solid #d5deeb;
    border-radius: 7px;
    background: #ffffff;
    padding: 0 16px;
    display: flex;
    align-items: center;
    box-shadow: none;
}

.payment-method-page :deep(.custom-field.van-cell) {
    padding: 0 16px;
}

.payment-method-page :deep(.custom-field .van-field__body),
.payment-method-page :deep(.custom-field .van-field__control) {
    height: 100%;
}

.payment-method-page :deep(.custom-field .van-field__control) {
    color: #111827;
    font-size: 15px;
    min-height: 0;
}

.payment-method-page :deep(.custom-field .van-field__control::placeholder) {
    color: #9aa3b2;
}

.notice-card {
    margin-top: 34px;
    padding: 15px 12px;
    border-radius: 16px;
    background: #f3f6ff;
    border: 1px solid #d8e0ee;
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.notice-text {
    color: #6f7d95;
    font-size: 12px;
}

.submit-btn {
    padding: 15px 40px;
    border: none;
    border-radius: 16px;
    background: #d6dcfa;
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    transition: all 0.2s ease;
}

.submit-btn--active {
    background: linear-gradient(90deg, #3b45df 0%, #3a4be7 100%);
    color: #ffffff;
    box-shadow: none;
}
</style>
