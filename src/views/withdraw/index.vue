<template>
    <div class="withdraw-page min-h-screen bg-[#F5F8F7]">
        <PageTopBar :title="$t('withdraw')" show-back @click-left="onClickLeft">
            <template #right>
                <div class="history-text" @click="toHistory">
                    {{ $t("Withdrawal.History") }}
                </div>
            </template>
        </PageTopBar>

        <div class="px-[20px] pt-[96px] pb-[36px]">
            <div class="balance-card">
                <div>
                    <div class="balance-label">
                        {{ $t("available_balance") }}
                    </div>
                    <div class="balance-value">
                        ${{ formatMoney(userInfo.balance) }}
                    </div>
                </div>
                <!-- <div
                    class="min-tag"
                    v-if="userInfo?.userLevel?.minWithdrawAmount != null"
                >
                    {{ $t("min_amount") }} ${{
                        userInfo.userLevel.minWithdrawAmount
                    }}
                </div> -->
            </div>

            <div class="section-title mt-[24px]">
                {{ $t("withdrawal_account") }}
            </div>

            <div
                v-if="bankWallet.length === 0"
                class="empty-account-card"
                @click="addType(2)"
            >
                <div class="empty-account-icon">
                    <van-icon
                        name="plus"
                        size="20"
                        color="var(--theme-primary)"
                    />
                </div>
                <div>
                    <div class="empty-account-title">
                        {{ $t("add_wallet") }}
                    </div>
                    <div class="empty-account-desc">
                        {{ $t("withdraw.str1") }}
                    </div>
                </div>
            </div>

            <div v-else class="account-select-card">
                <div
                    v-for="(item, index) in bankWallet"
                    :key="item.id || index"
                    class="account-row"
                    :class="{
                        'row-selected': bankItem?.id === item.id,
                        'row-divider': index !== bankWallet.length - 1,
                    }"
                    @click="selectAccount(item)"
                >
                    <div class="radio-wrap">
                        <div
                            class="radio-circle"
                            :class="{ active: bankItem?.id === item.id }"
                        >
                            <div
                                v-if="bankItem?.id === item.id"
                                class="radio-dot"
                            ></div>
                        </div>
                    </div>

                    <div class="account-row-icon">
                        <!-- <van-icon
                            :name="item.type == 1 ? 'balance-o' : 'coupon-o'"
                            size="22"
                            color="var(--theme-primary)"
                        />
                         -->
                        <img src="@/static/images/bank1.png" alt="" />
                    </div>

                    <div class="account-row-info">
                        <div class="account-row-name">
                            {{
                                item.type == 1
                                    ? item.bankCode
                                    : item.name || item.walletType
                            }}
                        </div>
                        <div class="account-row-no">
                            <template v-if="item.type == 1"
                                >**** {{ formatTail(item.bankCard) }}</template
                            >
                            <template v-else
                                >****
                                {{ formatTail(item.walletAddress) }}</template
                            >
                        </div>
                    </div>
                </div>
            </div>

            <div class="manage-link" @click="toList">
                <!-- <van-icon name="balance-o" size="18" color="var(--theme-primary)" /> -->
                <img src="@/static/images/bank1.png" alt="" />
                <span>{{ $t("manage_bound_accounts") }}</span>
                <van-icon name="arrow" size="18" color="var(--theme-primary)" />
            </div>

            <div class="section-title mt-[20px]">
                {{ $t("withdrawal_amount") }}
            </div>
            <div class="amount-card">
                <div class="currency-mark">$</div>
                <van-field
                    v-model="ruleForm.amount"
                    label=""
                    class="amount-field"
                    placeholder="0"
                    label-align="top"
                    size="large"
                    type="digit"
                />
                <div class="all-btn" @click="All">{{ $t("all") }}</div>
            </div>

            <div class="tip-card tip-card--password">
                <div class="tip-card__icon tip-card__icon--lock">
                    <img src="@/static/images/lockp.png" alt="" />
                    <!-- <van-icon name="lock" size="16" color="var(--theme-primary)" /> -->
                </div>
                <span
                    >A withdrawal password is required to confirm the
                    transaction</span
                >
            </div>

            <!-- <div class="tip-card tip-card--info">
        <div class="tip-card__icon tip-card__icon--info">
          <van-icon name="info-o" size="15" color="#51A4F4" />
        </div>
        <span>{{ $t('you_will_receive_your_withdrawal_within_an_hour') }}</span>
      </div> -->

            <div v-if="false" class="withdraw-password-card mt-[20px]">
                <div class="withdraw-password-header">
                    <div class="withdraw-password-icon">
                        <van-icon
                            name="lock"
                            size="22"
                            color="var(--theme-green-defalut)"
                        />

                        <img src="@/static/images/locks.png" alt="" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="withdraw-password-title">
                            {{ $t("withdrawal_password") }}
                        </div>
                        <div class="withdraw-password-desc">
                            {{ $t("enter_6_digit_security_password") }}
                        </div>
                    </div>
                </div>

                <div class="password-boxes">
                    <div
                        v-for="index in 6"
                        :key="index"
                        class="password-box"
                        :class="{
                            filled: ruleForm.tradePassword.length >= index,
                        }"
                    >
                        <span
                            v-if="ruleForm.tradePassword.length >= index"
                        ></span>
                    </div>
                </div>

                <!-- 原来的交易密码样式先保留在这里，后续需要可以恢复：
        <van-password-input :value="ruleForm.tradePassword" :gutter="10" />
        -->
                <div class="password-input-row">
                    <van-field
                        :model-value="tradePasswordInputValue"
                        :type="showTradePassword ? 'text' : 'password'"
                        inputmode="numeric"
                        maxlength="6"
                        :border="false"
                        class="trade-password-field"
                        @update:model-value="updateTradePassword"
                    />
                    <van-icon
                        :name="showTradePassword ? 'eye-o' : 'closed-eye'"
                        size="22"
                        color="#6B8F75"
                        @click="showTradePassword = !showTradePassword"
                    />
                </div>
            </div>

            <div class="mt-[20px]">
                <van-button class="submit-btn" block @click="getWithdrawal">
                    <span class="submit-btn__inner">
                        <!-- <van-icon name="lock" size="18" color="#ffffff" /> -->
                        <img src="@/static/images/locks.png" alt="" />
                        <span>{{ $t("submit_withdrawal") }}</span>
                    </span>
                </van-button>
            </div>
        </div>

        <van-popup
            v-model:show="showPasswordPopup"
            position="bottom"
            class="withdraw-password-popup"
            overlay-class="withdraw-password-overlay"
            round
        >
            <div class="withdraw-password-sheet">
                <button
                    class="password-close"
                    type="button"
                    @click="closePasswordPopup"
                >
                    <van-icon name="cross" size="18" color="#5C8066" />
                </button>

                <div class="withdraw-password-header">
                    <div class="withdraw-password-icon">
                        <van-icon
                            name="lock"
                            size="22"
                            color="var(--theme-green-defalut)"
                        />
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="withdraw-password-title">
                            {{ $t("withdrawal_password") }}
                        </div>
                        <div class="withdraw-password-desc">
                            {{ $t("enter_6_digit_security_password") }}
                        </div>
                    </div>
                </div>

                <div class="password-boxes">
                    <div
                        v-for="index in 6"
                        :key="index"
                        class="password-box"
                        :class="{
                            filled: ruleForm.tradePassword.length >= index,
                        }"
                    >
                        <span
                            v-if="ruleForm.tradePassword.length >= index"
                        ></span>
                    </div>
                </div>

                <!-- ：<van-password-input :value="ruleForm.tradePassword" :gutter="10" /> -->
                <div class="password-input-row">
                    <van-field
                        :model-value="tradePasswordInputValue"
                        :type="showTradePassword ? 'text' : 'password'"
                        inputmode="numeric"
                        maxlength="6"
                        :border="false"
                        class="trade-password-field"
                        @update:model-value="updateTradePassword"
                    />
                    <button
                        type="button"
                        class="password-eye-btn"
                        @click="showTradePassword = !showTradePassword"
                    >
                        <van-icon
                            :name="showTradePassword ? 'eye-o' : 'closed-eye'"
                            size="20"
                            color="#6B8F75"
                        />
                    </button>
                </div>

                <van-button
                    class="password-confirm-btn"
                    block
                    :loading="withdrawSubmitting"
                    @click="handleConfirmWithdrawal"
                >
                    {{ $t("confirm_withdrawal") }}
                </van-button>

                <div class="password-help">
                    <span>{{ $t("forgot_password_question") }}</span>
                    <button type="button" @click="goResetPassword">
                        {{ $t("reset_now") }}
                    </button>
                </div>
            </div>
        </van-popup>

        <van-number-keyboard
            v-model="ruleForm.tradePassword"
            :show="showKeyboard"
            @blur="showKeyboard = false"
        />
    </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {
    withdrawal,
    getTradeConfig,
    userGetInfo,
    getUserBankWallet,
} from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import { showSuccessToast, showToast } from "@/util/message";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

const showKeyboard = ref(false);
const router = useRouter();
const route = useRoute();
const amount = ref("");
const userStore = useUserStore();
const userInfo = ref({});
const { t } = useI18n();
const isMobile = ref(false);
const showPasswordPopup = ref(false);
const showTradePassword = ref(false);
const withdrawSubmitting = ref(false);
const tradePasswordInputValue = computed(() => ruleForm.tradePassword);

const formatTail = (card) => {
    if (!card) return "0000";
    const str = String(card).replace(/\s+/g, "");
    return str.slice(-4) || str;
};

const formatMoney = (value) => {
    const num = Number(value || 0);
    return num.toFixed(2);
};

function handleFocus() {
    if (isMobile.value) {
        showKeyboard.value = true;
    }
}

const updateTradePassword = (value) => {
    ruleForm.tradePassword = String(value || "")
        .replace(/\D/g, "")
        .slice(0, 6);
};

const update = () => {
    const smallScreen = window.matchMedia("(max-width: 768px)").matches;
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    isMobile.value = smallScreen && hasTouch;
};

const onClickLeft = () => {
    if (route.query.type == 1) {
        router.replace({
            path: "/",
        });
    } else {
        router.replace({
            path: "/my",
        });
    }
};

const ruleForm = reactive({
    amount: 0,
    tradePassword: "",
    walletId: "",
});

const addType = (type) => {
    if (type == 1) {
        router.push({
            path: "/addCard",
        });
    } else {
        router.push({
            path: "/addWallet",
            query: {
                fromType: route.query.type,
            },
        });
    }
};

const All = () => {
    ruleForm.amount = amount.value;
};

const validateWithdrawalBase = () => {
    if (!bankItem.value?.id) {
        router.push({
            path: "/cardList",
            query: {
                type: 2,
                fromType: route.query.type,
            },
        });
        return false;
    }
    if (!ruleForm.amount) {
        showToast(t("please_enter_the_amount"));
        return false;
    }
    const min = userInfo.value?.userLevel?.minWithdrawAmount;
    const max = userInfo.value?.userLevel?.maxWithdrawAmount;
    if (min == null || max == null) return false;
    if (ruleForm.amount < min || ruleForm.amount > max) {
        showToast(
            t("rechargeLimit", {
                min: userInfo.value.userLevel.minWithdrawAmount,
                max: userInfo.value.userLevel.maxWithdrawAmount,
            }),
        );
        return false;
    }
    return true;
};

const getWithdrawal = () => {
    if (!validateWithdrawalBase()) return;
    ruleForm.tradePassword = "";
    showTradePassword.value = false;
    showPasswordPopup.value = true;
};

const closePasswordPopup = () => {
    if (withdrawSubmitting.value) return;
    showPasswordPopup.value = false;
    ruleForm.tradePassword = "";
    showTradePassword.value = false;
};

const goResetPassword = () => {
    closePasswordPopup();
    router.push({ path: "/updateTransactionPassword" });
};

const confirmWithdrawal = async () => {
    if (withdrawSubmitting.value) return;

    try {
        if (!ruleForm.tradePassword || ruleForm.tradePassword.length < 6) {
            showToast(t("please_enter_transaction_password"));
            return;
        }

        if (!bankItem.value?.id) {
            showToast(
                t("please_select_withdrawal_account") ||
                    t("withdrawal_account"),
            );
            return;
        }

        ruleForm.walletId = Number(bankItem.value.id);
        withdrawSubmitting.value = true;

        await withdrawal(ruleForm);
        showPasswordPopup.value = false;
        showSuccessToast(t("withdrawal_successful"));
        await refresh();
    } catch (error) {
        // 接口业务错误已由 src/api/index.js 根据 showMsg 统一弹出提示。
        // 这里必须完整吞掉 Promise reject，否则 Vue 会打印黄色警告：
        // [Vue warn]: Unhandled error during execution of component event handler
        // 同时控制台还会出现 Uncaught (in promise)。
        if (import.meta.env.DEV) {
            console.debug("[withdraw] handled withdrawal error:", error);
        }
    } finally {
        withdrawSubmitting.value = false;
    }
};

const handleConfirmWithdrawal = () => {
    // 不把 async Promise 直接返回给 Vue 的 click 事件，避免任何漏掉的 reject 触发黄色 Vue Warning。
    confirmWithdrawal().catch((error) => {
        if (import.meta.env.DEV) {
            console.debug("[withdraw] confirm click handled:", error);
        }
    });
};

const toHistory = () => {
    router.push({ path: "/withdrawHistory" });
};

const TradeInfor = ref({});

const tradeConfig = async () => {
    let res = await getTradeConfig();
    TradeInfor.value = res.data;
};

const bankItem = ref("");
const bankWallet = ref([]);
const getgetUserBankWallet = async () => {
    let res = await getUserBankWallet();
    bankWallet.value = res.data || [];
    if (
        userStore.userWallerType &&
        typeof userStore.userWallerType === "object" &&
        !Array.isArray(userStore.userWallerType) &&
        Object.keys(userStore.userWallerType).length > 0
    ) {
        bankItem.value = userStore.userWallerType;
    } else {
        bankItem.value = (res.data || [])[0];
    }
};

const selectAccount = (item) => {
    bankItem.value = item;
    userStore.setuserWallerType(item);
};

const refresh = () => {
    tradeConfig();
    getgetUserBankWallet();
    ruleForm.amount = 0;
    ruleForm.tradePassword = "";
};

const toList = () => {
    router.push({
        path: "/cardList",
        query: {
            type: 2,
            fromType: route.query.type,
        },
    });
};

onMounted(() => {
    tradeConfig();
    getgetUserBankWallet();
    userGetInfo().then((res) => {
        amount.value = res.data.balance;
        userInfo.value = res.data;
    });
    update();
    window.addEventListener("resize", update);
});

onUnmounted(() => {
    window.removeEventListener("resize", update);
});
</script>
<style>
.withdraw .el-input__wrapper {
    border: 1px solid #666;
}
</style>
<style scoped>
.withdraw-page :deep(.van-nav-bar) {
    background: #ffffff;
}

.withdraw-page :deep(.van-nav-bar__title) {
    color: #24352d;
    font-size: 20px;
    font-weight: 600;
}

.withdraw-page :deep(.van-nav-bar .van-icon) {
    color: var(--theme-primary);
}

.withdraw-page :deep(.van-nav-bar::after) {
    border-bottom: 1px solid #dbe9df;
}

.history-text {
    color: #24352d;
    font-size: 16px;
    font-weight: 500;
}

.balance-card {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 22px 20px;
    border-radius: 18px;
    background: var(--theme-button-gradient-background);
    /*box-shadow: 0 10px 24px var(--theme-button-shadow);*/
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
    font-weight: 700;
}

.min-tag {
    min-width: 66px;
    height: 30px;
    padding: 0 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.88);
    color: #2a8148;
    font-size: 13px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 4px;
}

.section-title {
    color: #708a76;
    font-size: 15px;
    line-height: 22px;
    font-weight: 500;
}

.empty-account-card {
    margin-top: 12px;
    padding: 18px;
    border: 1px dashed #9ed5ad;
    border-radius: 16px;
    background: #ffffff;
    display: flex;
    align-items: center;
    gap: 14px;
}

.empty-account-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: #eff7f1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-account-title {
    color: #24352d;
    font-size: 15px;
    font-weight: 600;
}

.empty-account-desc {
    margin-top: 4px;
    color: #8aa291;
    font-size: 13px;
}

.account-select-card {
    margin-top: 12px;
    border: 1px solid #cfe5d5;
    border-radius: 16px;
    overflow: hidden;
    background: #ffffff;
}

.account-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 14px;
}

.row-selected {
    background: #edf7ef;
}

.row-divider {
    border-bottom: 1px solid #dbe9df;
}

.radio-wrap {
    width: 24px;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
}

.radio-circle {
    width: 19px;
    height: 19px;
    border-radius: 50%;
    border: 2px solid #b7d7bf;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
}

.radio-circle.active {
    border-color: var(--theme-green-defalut);
}

.radio-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--theme-green-defalut);
}

.account-row-icon {
    width: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img {
        width: 16px;
        height: 16px;
    }
}

.account-row-info {
    min-width: 0;
    flex: 1;
}

.account-row-name {
    color: #24352d;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    word-break: break-word;
}

.account-row-no {
    margin-top: 2px;
    color: #8aa291;
    font-size: 12px;
    line-height: 18px;
}

.manage-link {
    margin-top: 12px;
    height: 48px;
    padding: 0 14px;
    border: 1px dashed #7acc90;
    border-radius: 14px;
    background: #f3fbf5;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--theme-green-defalut);
    font-size: 15px;
    font-weight: 500;
}

.manage-link span {
    flex: 1;
}

.amount-card {
    position: relative;
    margin-top: 12px;
    border: 1.5px solid #24aa4d;
    border-radius: 18px;
    background: #ffffff;
    min-height: 84px;
    display: flex;
    align-items: center;
    padding: 0 64px 0 22px;
}

.currency-mark {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--theme-green-defalut);
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
}

.amount-field {
    width: 100%;
    padding-left: 20px;
    background: transparent;
}

.withdraw-page :deep(.amount-field .van-cell) {
    padding: 0;
    background: transparent;
}

.withdraw-page :deep(.amount-field .van-field__body) {
    align-items: center;
}

.withdraw-page :deep(.amount-field .van-field__control) {
    color: #24352d;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2;
}

.withdraw-page :deep(.amount-field .van-field__control::placeholder) {
    color: #7f8c84;
    font-weight: 600;
}

.all-btn {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--theme-green-defalut);
    font-size: 15px;
    font-weight: 500;
}

.tip-card {
    margin-top: 14px;
    min-height: 56px;
    border-radius: 12px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #24352d;
    font-size: 14px;
    line-height: 20px;
}

.tip-card--password {
    background: #edf7ef;
    border: 1px solid #d8eadc;
}

.tip-card--info {
    background: #edf7ef;
    border: 1px solid #d8eadc;
}

.tip-card__icon {
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.withdraw-password-popup {
    width: 100%;
    max-width: min(100vw, var(--app-pc-max-width, 375px));
    left: 50% !important;
    transform: translateX(-50%) !important;
    overflow: visible;
    background: transparent;
}

:global(.withdraw-password-overlay) {
    background: rgba(0, 0, 0, 0.42);
    backdrop-filter: blur(4px);
}

@media (min-width: 768px) {
    .withdraw-password-popup {
        width: min(100%, var(--app-pc-max-width, 375px)) !important;
        max-width: var(--app-pc-max-width, 375px) !important;
        left: 50% !important;
        right: auto !important;
        bottom: 0 !important;
        transform: translateX(-50%) !important;
    }

    :global(.withdraw-password-overlay) {
        width: min(100%, var(--app-pc-max-width, 375px)) !important;
        max-width: var(--app-pc-max-width, 375px) !important;
        left: 50% !important;
        right: auto !important;
        transform: translateX(-50%) !important;
    }
}

.withdraw-password-sheet {
    position: relative;
    border-radius: 28px 28px 0 0;
    background: #ffffff;
    padding: 26px 24px 24px;
    box-sizing: border-box;
}

.password-close {
    position: absolute;
    top: 24px;
    right: 20px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #eaf7ee;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
}

.withdraw-password-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-right: 44px;
}

.withdraw-password-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #eaf7ee;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.withdraw-password-title {
    color: #1b261e;
    font-size: 17px;
    line-height: 22px;
    font-weight: 700;
}

.withdraw-password-desc {
    margin-top: 4px;
    color: #6b8f75;
    font-size: 12px;
    line-height: 18px;
}

.password-boxes {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
    margin-top: 22px;
}

.password-box {
    height: 54px;
    border-radius: 10px;
    border: 2px solid #cfe5d5;
    background: #f7fbf8;
    display: flex;
    align-items: center;
    justify-content: center;
}

.password-box span {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #000000;
}

.password-input-row {
    margin-top: 18px;
    min-height: 54px;
    border-radius: 14px;
    border: 1px solid #cfe5d5;
    background: #f1f8f3;
    padding: 0 14px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.trade-password-field {
    flex: 1;
    padding: 0;
    background: transparent;
}

.withdraw-page :deep(.trade-password-field.van-cell) {
    padding: 0;
    background: transparent;
}

.withdraw-page :deep(.trade-password-field .van-field__body) {
    align-items: center;
}

.withdraw-page :deep(.trade-password-field .van-field__control) {
    color: #24352d;
    font-size: 16px;
    letter-spacing: 0.5em;
}

.password-eye-btn {
    width: 28px;
    height: 28px;
    border: 0;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.password-confirm-btn {
    margin-top: 26px;
    height: 56px;
    border: none;
    border-radius: 14px;
    background: var(--theme-primary);
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
}

.password-help {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 10px;
    color: #6b8f75;
    font-size: 12px;
    line-height: 18px;
}

.password-help button {
    color: #139344;
    font-size: 12px;
    font-weight: 700;
    border: 0;
    background: transparent;
}

.submit-btn {
    height: 52px;
    border: none;
    border-radius: 14px;
    background: var(--theme-primary);
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    box-shadow: 0 10px 24px var(--theme-button-shadow);
}

.submit-btn__inner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

@media (max-width: 380px) {
    .password-boxes {
        gap: 8px;
    }

    .password-box {
        height: 48px;
    }
}

@media (min-width: 768px) {
    .withdraw-password-popup {
        top: 50% !important;
        bottom: auto !important;
        width: var(--app-pc-max-width, 375px);
        transform: translate(-50%, -50%) !important;
        border-radius: 28px;
    }

    .withdraw-password-sheet {
        border-radius: 28px;
    }
}
</style>
