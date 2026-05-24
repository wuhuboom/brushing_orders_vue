<template>
    <div class="customer-page">
        <PageTopBar :title="$t('service')" show-back @click-left="onClickLeft" />

        <section class="service-hero">
            <img :src="serviceHero" :alt="$t('help_center')" />
        </section>

        <main class="customer-body">
            <div class="customer-list">
                <div
                    v-for="(item, index) in serviceCards"
                    :key="item.linkUrl || item.name || index"
                    class="customer-card"
                    @click="jump(item, index)"
                >
                    <img
                        class="customer-card__avatar"
                        :src="item.avatar"
                        alt=""
                    />
                    <div class="customer-card__main">
                        <div class="customer-card__title">
                            {{ item.displayName }}
                        </div>
                        <div class="customer-card__time">
                            {{ item.displayTime }}
                        </div>
                    </div>
                    <button class="customer-card__button" type="button">
                        {{ $t("chat") }}
                    </button>
                </div>

                <div
                    v-if="emailAddressInfo && !serviceCards.length"
                    class="customer-card"
                    @click="copyContent(emailAddressInfo)"
                >
                    <div
                        class="customer-card__avatar customer-card__avatar--email"
                    >
                        @
                    </div>
                    <div class="customer-card__main">
                        <div class="customer-card__title">
                            {{ $t("email_support") }}
                        </div>
                        <div class="customer-card__time email-text">
                            {{ emailAddressInfo }}
                        </div>
                    </div>
                    <button class="customer-card__button" type="button">
                        {{ $t("copy") }}
                    </button>
                </div>
            </div>
        </main>

        <van-dialog
            v-model:show="showCenter"
            :showConfirmButton="false"
            closeOnClickOverlay
            width="286px"
            class="customer-dialog"
        >
            <div class="customer-dialog__header">
                {{ $t("contact_channels") }}
            </div>
            <div class="customer-dialog__list">
                <div
                    v-for="(item, index) in customerList"
                    :key="`dialog-${item.linkUrl || item.name || index}`"
                    class="customer-dialog__item"
                    @click="jump(item, index)"
                >
                    <div class="customer-dialog__item-left">
                        <div
                            class="customer-card__icon"
                            :class="index === 0 ? 'is-chat' : 'is-service'"
                        >
                            <van-icon
                                :name="index === 0 ? 'chat-o' : 'service-o'"
                            />
                        </div>
                        <div>
                            <div class="customer-card__title">
                                {{ item.name }}
                            </div>
                            <div class="customer-card__desc">
                                {{ $t("customer.str4") }}
                            </div>
                        </div>
                    </div>
                    <van-icon name="arrow" class="customer-card__arrow" />
                </div>
                <div
                    v-if="emailAddressInfo"
                    class="customer-dialog__item"
                    @click="copyContent(emailAddressInfo)"
                >
                    <div class="customer-dialog__item-left">
                        <div class="customer-card__icon is-email">
                            <van-icon name="envelop-o" />
                        </div>
                        <div>
                            <div class="customer-card__title">
                                {{ $t("email_support") }}
                            </div>
                            <div class="customer-card__desc email-text">
                                {{ emailAddressInfo }}
                            </div>
                        </div>
                    </div>
                    <van-icon name="arrow" class="customer-card__arrow" />
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<script setup>
import PageTopBar from "@/components/PageTopBar.vue";
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
    getCustomerServiceByLang,
    getEmailAddress,
    getTradeConfig,
} from "@/api/apis";
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from "@/store/modules/common";
import { useI18n } from "vue-i18n";
import { showToast } from "@/util/message";
import { errorMessages } from "@/api/errorCodeMap";
import md5 from "crypto-js/md5";
import { copyContent } from "@/util/utils";
import cusmessIcon from "@/static/images/cusmess.png";
import cusserveIcon from "@/static/images/user-service.png";
import serviceHero from "@/static/images/service/service-hero.png";
import serviceAvatar1 from "@/static/images/service/service-avatar-1.png";
import serviceAvatar2 from "@/static/images/service/service-avatar-2.png";
const showCenter = ref(false);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const commonStore = useCommonStore();
const { t } = useI18n();
const customerList = ref([]);
const emailAddressInfo = ref("");
const userInfo = ref({});

const parLang = computed(() => {
    const mapped = commonStore.getValueByKey(commonStore.lang);
    return mapped ?? commonStore.lang;
});

const showServiceError = (error) => {
    if (Number(error?.code) === 920) {
        showToast({
            content: t("supportHours"),
            key: "customer-support-hours",
        });
        return;
    }

    const errorKey = errorMessages[error?.code];
    showToast(
        errorKey
            ? t(errorKey)
            : error?.msg || error?.message || t("network_error"),
    );
};

const loadCustomerService = async () => {
    try {
        const res = await getCustomerServiceByLang({ lang: parLang.value });
        customerList.value = res?.data || [];
        return customerList.value;
    } catch (error) {
        customerList.value = [];
        showServiceError(error);
        return [];
    }
};

const open = async () => {
    showCenter.value = true;
    await loadCustomerService();
};

const close = () => (showCenter.value = false);

const emailAddress = async () => {
    const res = await getEmailAddress();
    emailAddressInfo.value = res.data;
};

const jump = (item, index = 0) => {
    const rawUrl = typeof item === "string" ? item : item?.linkUrl;
    if (!rawUrl) return;

    // 只有第一个在线客服链接需要拼接访客参数；接口返回的其他客服链接按原地址跳转。
    const finalUrl =
        index === 0
            ? buildKefuUrl(rawUrl, userInfo.value.username)
            : normalizeExternalUrl(rawUrl);

    if (finalUrl) {
        window.open(finalUrl, "_blank");
    }
};

function normalizeExternalUrl(url) {
    const value = `${url || ""}`.trim();
    if (!value) return "";
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
    return `https://${value.replace(/^\/\/+/, "")}`;
}

function buildKefuUrl(baseUrl, username) {
    const value = normalizeExternalUrl(baseUrl);
    if (!value) return "";

    try {
        const visitorId = md5(username || "").toString();
        const url = new URL(value);
        if (userStore.token) {
            url.searchParams.set("visitor_id", visitorId);
            url.searchParams.set("visitor_name", username || "");
        }
        return url.toString();
    } catch (error) {
        return value;
    }
}

const getUserGetInfo = async () => {
    if (!userStore.token) {
        userInfo.value = {};
        return userInfo.value;
    }

    const info = await userStore.getUserInfo();
    userInfo.value = info || {};
    return userInfo.value;
};

const onClickLeft = () => {
    history.back();
};
const TradeInfor = ref({});
const tradeConfig = async () => {
    let res = await getTradeConfig();
    TradeInfor.value = res.data;
};

const workTimeText = computed(() => {
    const start = TradeInfor.value?.workTimeStart || "--:--";
    const end = TradeInfor.value?.workTimeEnd || "--:--";

    return `${start} - ${end}`;
});

const serviceCards = computed(() =>
    (customerList.value || []).map((item, index) => ({
        ...item,
        displayName: item?.name || (index === 0 ? "Nnan" : "Linda"),
        displayTime: index === 0 ? "AM9:00-20:00" : "PM20:00-9:00",
        avatar: index === 0 ? serviceAvatar1 : serviceAvatar2,
    })),
);

onMounted(async () => {
    emailAddress();
    getUserGetInfo();
    tradeConfig();
    await loadCustomerService();
});

defineExpose({
    open,
    close,
});
</script>

<style scoped>
.customer-page {
    min-height: 100vh;
    background: #f1f4fb;
    color: #0a0a0a;
}

.algofy-topbar {
    position: relative;
    height: 80px;
    background: #050505;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
}

.algofy-topbar__back {
    position: absolute;
    left: 22px;
    top: 50%;
    width: 22px;
    height: 22px;
    border: 0;
    background: transparent;
    transform: translateY(-50%) rotate(45deg);
    border-left: 4px solid #fff;
    border-bottom: 4px solid #fff;
    border-radius: 2px;
}

.algofy-topbar__title {
    font-size: 24px;
    line-height: 1;
    font-weight: 800;
    color: #fff;
    letter-spacing: 1px;
}

.service-hero {
    width: 100%;
    height: 209px;
    overflow: hidden;
    background: #9eb4ff;
}

.service-hero img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.customer-body {
    padding: 15px 20px 40px;
}

.customer-list {
    display: flex;
    flex-direction: column;
    gap: 11px;
}

.customer-card {
    display: grid;
    grid-template-columns: 49px minmax(0, 1fr) 114px;
    align-items: center;
    gap: 14px;
    min-height: 73px;
    border-radius: 8px;
    background: #fff;
    padding: 12px 15px 12px 21px;
    box-shadow: none;
}

.customer-card__avatar {
    width: 49px;
    height: 49px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
}

.customer-card__avatar--email {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e9f0ff;
    color: #2f46e8;
    font-size: 28px;
    font-weight: 800;
}

.customer-card__main {
    min-width: 0;
}

.customer-card__title {
    color: #050505;
    font-size: 14px;
    line-height: 19px;
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.customer-card__time {
    margin-top: 1px;
    color: #00a94f;
    font-size: 13px;
    line-height: 17px;
    font-weight: 700;
    white-space: nowrap;
}

.customer-card__button {
    width: 114px;
    height: 37px;
    border: 0;
    border-radius: 999px;
    background: #3444e8;
    color: #fff;
    font-size: 15px;
    line-height: 1;
    font-weight: 500;
    white-space: nowrap;
    padding: 0;
}

.customer-card__icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.customer-card__icon.is-chat,
.customer-card__icon.is-service {
    background: #e7f3ea;
    color: #1ba14c;
}

.customer-card__icon.is-email {
    background: #e8f0fb;
    color: #347ff6;
}

.customer-card__desc {
    margin-top: 4px;
    color: #648664;
    font-size: 12px;
    line-height: 18px;
    word-break: break-all;
}

.customer-card__arrow {
    color: #709271;
    font-size: 20px;
}

.customer-dialog__header {
    padding: 18px 18px 10px;
    color: #1f2b1f;
    font-size: 16px;
    font-weight: 600;
}

.customer-dialog__list {
    padding: 0 14px 16px;
}

.customer-dialog__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid #edf3ee;
}

.customer-dialog__item:last-child {
    border-bottom: 0;
}

.customer-dialog__item-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.email-text {
    word-break: break-all;
}

</style>
