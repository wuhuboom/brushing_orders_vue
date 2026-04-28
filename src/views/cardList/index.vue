<template>
    <div class="card-list-page min-h-screen bg-[#F5F8F7]">
        <PageTopBar :title="pageTitle" show-back @click-left="onClickLeft">
            <template #right>
                <div class="nav-help" @click.stop="goCustomerPage">
                    <img src="@/static/images/serv.png" alt="" />
                </div>
            </template>
        </PageTopBar>

        <div class="px-[22px] pt-[76px] pb-[120px]">
            <div class="summary-card">
                <div class="summary-left">
                    <div class="summary-label">{{ $t("bound_accounts") }}</div>
                    <div class="summary-count">{{ bankWallet.length }}</div>
                </div>
                <div class="summary-right">
                    <!-- <div class="summary-item summary-item-divider">
                        <div class="summary-item-count">
                            {{ bankCards.length }}
                        </div>
                        <div class="summary-item-label">
                            {{ $t("bank_cards") }}
                        </div>
                    </div> -->
                    <div class="summary-item">
                        <div class="summary-item-count">
                            {{ wallets.length }}
                        </div>
                        <div class="summary-item-label">
                            {{ $t("wallets") }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="section-block mt-[24px]" v-if="bankCards.length">
                <div class="section-title-row">
                    <div class="section-icon">
                        <van-icon name="balance-o" size="16" />
                    </div>
                    <div class="section-title">{{ $t("bank_card_upper") }}</div>
                </div>

                <div
                    v-for="(item, index) in bankCards"
                    :key="`card-${item.id || index}`"
                    class="account-card"
                    :class="{ selected: activeValue == item.id }"
                    @click="selectEmits(item)"
                >
                    <div class="account-main">
                        <div
                            class="account-icon"
                            :class="index % 2 === 0 ? 'icon-green' : 'icon-red'"
                        >
                            <van-icon name="balance-o" size="28" color="#fff" />
                        </div>

                        <div class="account-info">
                            <div class="account-name">
                                {{ item.bankCode || "--" }}
                            </div>
                            <div class="account-user">
                                {{ item.name || "--" }}
                            </div>
                            <div class="account-no">
                                {{ maskCard(item.bankCard) }}
                            </div>
                        </div>
                    </div>

                    <div class="action-btn" @click.stop="editAccount(item)">
                        <van-icon name="edit" size="20" color="var(--theme-primary)" />
                    </div>
                </div>
            </div>

            <div class="section-block mt-[22px]" v-if="wallets.length">
                <div class="section-title-row">
                    <div class="section-icon wallet-icon">
                        <img src="@/static/images/walletlistw.png" alt="" />
                    </div>
                    <div class="section-title">{{ $t("wallet_upper") }}</div>
                    <div class="section-badge">{{ wallets.length }}</div>
                </div>

                <div
                    v-for="(item, index) in wallets"
                    :key="`wallet-${item.id || index}`"
                    class="account-card"
                    :class="{ selected: activeValue == item.id }"
                    @click="selectEmits(item)"
                >
                    <div class="account-main">
                        <div
                            class="account-icon"
                            :class="
                                index % 2 === 0 ? 'icon-blue' : 'icon-green'
                            "
                        >
                            <img src="@/static/images/walletlist.png" />
                        </div>

                        <div class="account-info">
                            <div class="account-name">
                                {{ item.name || item.walletType || "--" }}
                            </div>
                            <div class="account-user">
                                {{ item.walletType || item.name || "--" }}
                            </div>
                            <div class="account-no wallet-no">
                                {{ maskWallet(item.walletAddress) }}
                            </div>
                        </div>
                    </div>

                    <div class="action-btn" @click.stop="editAccount(item)">
                        <van-icon name="edit" size="20" color="var(--theme-primary)" />
                    </div>
                </div>
            </div>
        </div>

        <div class="fixed-action-wrap pc-fixed-bottom">
            <van-button
                v-if="showCardBtn"
                class="action-button"
                block
                @click="addBank(1)"
            >
                <van-icon name="plus" size="20" class="mr-[10px]" />
                {{ $t("add_bank_card") }}
            </van-button>

            <van-button
                v-if="showWalletBtn"
                class="action-button mt-[12px] action-button--secondary"
                block
                @click="addBank(2)"
            >
                <van-icon name="plus" size="20" class="mr-[10px]" />
                {{ $t("add_wallet") }}
            </van-button>
        </div>

        <ContactUs ref="ContactUsRef"></ContactUs>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { getUserBankWallet, getTradeConfig } from "../../api/apis";
import { useUserStore } from "@/store/modules/user";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import ContactUs from "@/components/ContactUs.vue";

const ContactUsRef = ref(null);
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const routePathStackKey = "route-path-stack";
const activeValue = ref(0);
const showCardBtn = ref(false);
const showWalletBtn = ref(false);
const form = reactive({
    withdrawName: "",
    withdrawAddress: "",
    withdrawType: "",
});

const TradeInfor = ref({});
const bankWallet = ref([]);

const bankCards = computed(() =>
    (bankWallet.value || []).filter((item) => Number(item.type) === 1),
);
const wallets = computed(() =>
    (bankWallet.value || []).filter((item) => Number(item.type) === 2),
);

const pageTitle = computed(() => t("bank_card_management"));

const tradeConfig = async () => {
    let res = await getTradeConfig();
    TradeInfor.value = res.data;
};

const customer = () => {
    ContactUsRef.value.open();
};

const editAccount = () => {
    router.push({ path: "/customer" });
};

const goCustomerPage = () => {
    router.push({ path: "/customer" });
};

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

const getCardListSourcePath = () => {
    const stack = readRouteStack();
    const currentIndex = stack.lastIndexOf(route.path);
    const previousStack = (
        currentIndex >= 0 ? stack.slice(0, currentIndex) : stack
    )
        .filter((path) => path !== route.path)
        .reverse();

    return previousStack.find((path) => ["/my", "/withdraw"].includes(path));
};

const isMySource = () =>
    getCardListSourcePath() === "/my" || route.query.type == 1;

const getWithdrawSourceType = () => {
    const sourceType = route.query.fromType ?? route.query.sourceType;
    return sourceType;
};

const getWithdrawReturnQuery = (extra = {}) => {
    const query = { ...extra };
    const sourceType = getWithdrawSourceType();
    if (sourceType != null && sourceType !== "") {
        query.type = sourceType;
    }
    return query;
};

const getCardListReturnQuery = () => {
    const query = {};
    if (route.query.type != null) query.type = route.query.type;
    if (route.query.fromType != null) query.fromType = route.query.fromType;
    if (route.query.sourceType != null) query.sourceType = route.query.sourceType;
    return query;
};

const onClickLeft = () => {
    const sourcePath = getCardListSourcePath();
    if (sourcePath === "/my" || (!sourcePath && route.query.type == 1)) {
        router.push({ path: "/my" });
        return;
    }

    if (sourcePath === "/withdraw" || route.query.type != 1) {
        router.push({
            path: "/withdraw",
            query: getWithdrawReturnQuery(),
        });
        return;
    }

    router.push({ path: "/my" });
};

const addBank = (type) => {
    if (type == 1) {
        router.push({
            path: "/addCard",
            query: getCardListReturnQuery(),
        });
    } else {
        router.push({
            path: "/addWallet",
            query: {
                ...getCardListReturnQuery(),
                type: route.query.type,
                fromType: route.query.fromType,
            },
        });
    }
};

const getgetUserBankWallet = async () => {
    let res = await getUserBankWallet();
    bankWallet.value = res.data || [];
    showCardBtn.value = false;
    showWalletBtn.value = bankWallet.value.length === 0;

    if (
        userStore.userWallerType &&
        typeof userStore.userWallerType === "object" &&
        !Array.isArray(userStore.userWallerType) &&
        Object.keys(userStore.userWallerType).length > 0
    ) {
        activeValue.value = userStore.userWallerType.id;
    } else {
        activeValue.value = res.data.length != 0 ? res.data[0].id : 0;
    }
};

const selectEmits = (item) => {
    activeValue.value = item.id;
    userStore.setuserWallerType(item);
    if (isMySource()) {
    } else {
        router.push({
            path: "/withdraw",
            query: getWithdrawReturnQuery({ ...item }),
        });
    }
};

const maskCard = (value) => {
    if (!value) return "**** **** **** ****";
    const str = String(value).replace(/\s+/g, "");
    if (str.length <= 4) return str;
    return `**** **** **** ${str.slice(-4)}`;
};

const maskWallet = (value) => {
    if (!value) return "**** **** 0000";
    const str = String(value).replace(/\s+/g, "");
    if (str.length <= 4) return str;
    return `**** **** ${str.slice(-4)}`;
};

onMounted(async () => {
    getgetUserBankWallet();
    tradeConfig();
    await userStore.getUserInfo();
    form.withdrawName = userStore.userInfo.withdrawName;
    form.withdrawAddress = userStore.userInfo.withdrawAddress;
    form.withdrawType = userStore.userInfo.withdrawType;
});
</script>

<style scoped>
.card-list-page :deep(.van-nav-bar) {
    background: #ffffff;
}

.card-list-page :deep(.van-nav-bar__title) {
    color: #22362c;
    font-size: 20px;
    font-weight: 500;
}

.card-list-page :deep(.van-nav-bar .van-icon) {
    color: var(--theme-primary);
}

.card-list-page :deep(.van-nav-bar::after) {
    border-bottom: 1px solid #dbe9df;
}

.nav-help {
    width: 36px;
    height: 36px;
    /*border-radius: 50%;
    border: 1px solid #b9dfc5;
    background: #eff7f1;*/
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 36px;
}

.summary-card {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 22px;
    border-radius: 16px;
    box-shadow: 0px 4px 16px 0px rgba(34, 160, 80, 0.22);
    background: var(--theme-button-gradient-background);
}

.summary-left {
    min-width: 110px;
}

.summary-label,
.summary-item-label {
    color: rgba(255, 255, 255, 0.84);
    font-size: 14px;
    line-height: 20px;
}

.summary-count,
.summary-item-count {
    color: #ffffff;
    font-size: 24px;
    line-height: 30px;
    margin-top: 8px;
    font-weight: 600;
}

.summary-right {
    display: flex;
    flex: 1;
    justify-content: flex-end;
}

.summary-item {
    min-width: 88px;
    text-align: center;
    padding: 4px 0;
}

.summary-item-divider {
    border-right: 1px solid rgba(255, 255, 255, 0.22);
    margin-right: 18px;
    padding-right: 18px;
}

.section-block {
    margin-top: 22px;
}

.section-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
}

.section-icon {
    color: var(--theme-primary);
    display: flex;
    align-items: center;
}

.wallet-icon {
    color: #58a7e8;
}

.section-title {
    color: #24352d;
    font-size: 15px;
    line-height: 22px;
    letter-spacing: 0.08em;
}

.section-badge {
    min-width: 28px;
    height: 24px;
    padding: 0 8px;
    border-radius: 999px;
    background: #e7f4ea;
    color: #8bb396;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 6px;
}

.account-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px;
    border: 1px solid #cae5d2;
    border-radius: 22px;
    background: #ffffff;
    box-shadow: 0 6px 18px rgba(40, 88, 55, 0.05);
}

.account-card + .account-card {
    margin-top: 14px;
}

.account-card.selected {
    border-color: #7ecb96;
    box-shadow: 0 8px 24px rgba(35, 164, 85, 0.1);
}

.account-main {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
    flex: 1;
}

.account-icon {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.icon-green {
    background: var(--theme-primary);
}

.icon-red {
    background: #ea4335;
}

.icon-blue {
    background: #61aef0;
}

.account-info {
    min-width: 0;
    flex: 1;
}

.account-name {
    color: #24352d;
    font-size: 16px;
    line-height: 22px;
    font-weight: 500;
    word-break: break-word;
}

.account-user {
    margin-top: 6px;
    color: #648c6e;
    font-size: 14px;
    line-height: 20px;
}

.account-no {
    margin-top: 6px;
    color: #24352d;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0.18em;
}

.wallet-no {
    letter-spacing: 0.12em;
}

.action-btn {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    border: 1px solid #cfe5d5;
    background: #f6fbf7;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.fixed-action-wrap {
    position: fixed;
    left: 50%;
    bottom: 22px;
    transform: translateX(-50%);
    width: calc(100% - 44px);
    max-width: calc(var(--app-pc-max-width, 375px) - 44px);
    z-index: 9;
    padding-top: 14px;
    border-top: 1px solid #dbe9df;
    background: #f5f8f7;
}

.action-button {
    height: 58px;
    border: none;
    border-radius: 16px;
    background: var(--theme-button-gradient);
    color: #ffffff;
    font-size: 16px;
    box-shadow: 0 10px 24px var(--theme-button-shadow);
}

.action-button--secondary {
    background: var(--theme-primary);
    color: #fff;
    box-shadow: none;
}

.card-list-page :deep(.action-button .van-button__content) {
    font-weight: 500;
}
</style>
