<template>
    <div class="customer-page">
        <PageTopBar
            :title="$t('service')"
            show-back
            @click-left="onClickLeft"
        />

        <main class="customer-body">
            <div class="customer-body__title">
                {{ $t("customer_service_center_title") }}
            </div>
            <div class="customer-body__subtitle">
                {{ $t("customer_service_center_subtitle") }}
            </div>

            <div class="service-card-list">
                <div
                    v-for="(item, index) in serviceCards"
                    :key="item.linkUrl || item.name || index"
                    class="service-card"
                    @click="jump(item, index)"
                >
                    <img class="service-card__image" :src="item.icon" alt="" />

                    <div class="service-card__title">
                        {{ item.name }}
                    </div>

                    <div class="service-card__desc">
                        {{ $t("customer_service_card_desc") }}
                    </div>

                    <div class="service-card__footer">
                        <button class="service-card__button" type="button">
                            {{ $t("customer_service_consult_now") }}
                            <van-icon name="arrow" />
                        </button>
                    </div>
                </div>

                <div
                    v-if="emailAddressInfo && !serviceCards.length"
                    class="service-card"
                    @click="copyContent(emailAddressInfo)"
                >
                    <img
                        class="service-card__image"
                        :src="serviceOnlineIcon"
                        alt=""
                    />

                    <div class="service-card__title">
                        {{ $t("email_support") }}
                    </div>

                    <div class="service-card__desc email-text">
                        {{ emailAddressInfo }}
                    </div>

                    <div class="service-card__footer">
                        <button class="service-card__button" type="button">
                            {{ $t("copy") }}
                            <van-icon name="arrow" />
                        </button>
                    </div>
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
                                {{ getCustomerDisplayName(item, index) }}
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

import serviceOnlineIcon from "@/static/images/service/service-online.png";
import serviceTelegramIcon from "@/static/images/service/service-telegram.png";

const showCenter = ref(false);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const commonStore = useCommonStore();
const { t } = useI18n();

const customerList = ref([]);
const emailAddressInfo = ref("");
const userInfo = ref({});
const TradeInfor = ref({});

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

const close = () => {
    showCenter.value = false;
};

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

const tradeConfig = async () => {
    const res = await getTradeConfig();
    TradeInfor.value = res.data;
};

const workTimeText = computed(() => {
    const start = TradeInfor.value?.workTimeStart || "--:--";
    const end = TradeInfor.value?.workTimeEnd || "--:--";

    return `${start} - ${end}`;
});

const getCustomerDisplayName = (item, index = 0) => {
    if (index === 0) {
        return t("online_customer_service");
    }

    if (index === 1) {
        return t("telegram_customer_service");
    }

    return item?.name || "";
};

const buildServiceIconUrl = (iconUrl, name = "") => {
    const normalizedName = `${name || ""}`.trim().toLowerCase();
    const fallbackIcon = normalizedName.includes("telegram")
        ? serviceTelegramIcon
        : serviceOnlineIcon;
    const value = `${iconUrl || ""}`.trim();

    if (!value) return fallbackIcon;

    // 接口偶尔可能直接返回完整地址，此时不再重复拼接图片域名。
    if (/^(https?:)?\/\//i.test(value) || /^(data|blob):/i.test(value)) {
        return value;
    }

    const imageBaseUrl = `${
        window.g?.VITE_API_IMG_URL || import.meta.env.VITE_API_IMG_URL || ""
    }`.replace(/\/+$/, "");

    if (!imageBaseUrl) return value;

    return `${imageBaseUrl}/${value.replace(/^\/+/, "")}`;
};

const serviceCards = computed(() =>
    (customerList.value || []).map((item, index) => ({
        ...item,
        displayName: getCustomerDisplayName(item, index),
        icon: buildServiceIconUrl(item?.iconUrl, item?.name),
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
    min-height: 100dvh;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: #0a0a0a;
    display: flex;
    flex-direction: column;
}

.customer-body {
    flex: 1;
    min-height: 0;
    padding: 38px 22px 40px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    box-sizing: border-box;
}

.customer-body__title {
    font-family: Inter_700wght, Inter_700wght;
    font-weight: normal;
    font-size: 20px;
    color: #ffffff;
    line-height: 32px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.customer-body__subtitle {
    margin-top: 20px;
    font-family: Inter-Regular, Inter-Regular;
    font-weight: normal;
    font-size: 14px;
    color: #ffffff;
    line-height: 24px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.service-card-list {
    margin-top: 23px;
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.service-card {
    min-height: 158px;
    padding: 12px 16px 11px 26px;
    border-radius: 12px;
    background: #fff;
    box-sizing: border-box;
}

.service-card__image {
    display: block;
    width: 28px;
    height: 28px;
    object-fit: contain;
}

.service-card__title {
    margin-top: 9px;
    font-family: Inter_700wght, Inter_700wght;
    font-weight: normal;
    font-size: 16px;
    color: #000000;
    line-height: 28px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.service-card__desc {
    margin-top: 13px;
    font-family: Inter-Regular, Inter-Regular;
    font-weight: normal;
    font-size: 12px;
    color: #000000;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.service-card__footer {
    margin-top: 5px;
    display: flex;
    justify-content: flex-end;
}

.service-card__button {
    height: 38px;
    padding: 0 12px;
    border: 0;
    border-radius: 10px;
    background: #3b82f6;
    font-family: Inter-Regular, Inter-Regular;
    font-weight: normal;
    font-size: 12px;
    color: #ffffff;
    line-height: 24px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    white-space: nowrap;
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

.customer-card__title {
    color: #050505;
    font-size: 14px;
    line-height: 19px;
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
