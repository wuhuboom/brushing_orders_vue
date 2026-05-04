<template>
    <div class="customer-page">
        <PageTopBar
            :title="$t('service')"
            show-back
            @click-left="onClickLeft"
        />

        <div class="customer-body">
            <section class="customer-hero">
                <div class="customer-hero__icon">
                    <img src="@/static/images/cusserve.png" />
                </div>
                <div class="customer-hero__content">
                    <h2>{{ $t("customer_help_title") }}</h2>
                    <p>
                        {{
                            $t("customer_help_desc", { timerstr: workTimeText })
                        }}
                    </p>
                    <div class="customer-hero__status">
                        <span class="customer-dot"></span>
                        <span>{{ $t("all_agents_online_now") }}</span>
                    </div>
                </div>
                <span class="customer-hero__orb"></span>
            </section>

            <div class="customer-section-title">
                {{ $t("contact_channels") }}
            </div>

            <div class="customer-list">
                <div
                    v-for="(item, index) in customerList"
                    :key="item.linkUrl || item.name || index"
                    class="customer-card"
                    @click="jump(item, index)"
                >
                    <div
                        class="customer-card__icon"
                        :class="index === 0 ? 'is-chat' : 'is-service'"
                    >
                        <img :src="index === 0 ? cusmessIcon : cusserveIcon" />
                    </div>
                    <div class="customer-card__main">
                        <div class="customer-card__title">{{ item.name }}</div>
                        <div class="customer-card__desc">
                            {{
                                index === 0
                                    ? $t("avg_response_2_min")
                                    : $t("customer.str3")
                            }}
                        </div>
                    </div>
                    <div class="customer-card__aside">
                        <!-- <div
                            class="customer-card__badge"
                            :class="index === 0 ? 'is-online' : 'is-reply'"
                        >
                            {{ index === 0 ? $t("online") : $t("reply_24h") }}
                        </div> -->
                        <img
                            class="customer-card__aside-arrow"
                            src="@/static/images/rightarrow.png"
                            alt=""
                            style="height: 18px; width: 18px"
                        />
                    </div>
                </div>

                <div
                    v-if="emailAddressInfo"
                    class="customer-card"
                    @click="copyContent(emailAddressInfo)"
                >
                    <div class="customer-card__icon is-email">
                        <van-icon name="envelop-o" />
                    </div>
                    <div class="customer-card__main">
                        <div class="customer-card__title">
                            {{ $t("email_support") }}
                        </div>
                        <div class="customer-card__desc email-text">
                            {{ emailAddressInfo }}
                        </div>
                    </div>
                    <div class="customer-card__aside">
                        <div class="customer-card__badge is-reply">
                            {{ $t("reply_24h") }}
                        </div>
                        <img
                            class="customer-card__aside-arrow"
                            src="@/static/images/back.png"
                            alt=""
                            style="height: 18px; width: 18px"
                        />
                    </div>
                </div>
            </div>
        </div>

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
import { onMounted, ref, computed } from "vue";
import {
    getCustomerService,
    getEmailAddress,
    userGetInfo,
    getTradeConfig,
} from "@/api/apis";
import { useUserStore } from "@/store/modules/user";
import md5 from "crypto-js/md5";
import { copyContent } from "@/util/utils";
import cusmessIcon from "@/static/images/cusmess.png";
import cusserveIcon from "@/static/images/user-service.png";
const showCenter = ref(false);
const userStore = useUserStore();
const customerList = ref([]);
const emailAddressInfo = ref("");
const userInfo = ref({});

const open = async () => {
    showCenter.value = true;
    const res = await getCustomerService();
    customerList.value = res.data;
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

const getUserGetInfo = () => {
    userGetInfo().then((res) => {
        userInfo.value = res.data;
    });
};

const onClickLeft = () => history.back();
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
onMounted(async () => {
    emailAddress();
    getUserGetInfo();
    tradeConfig();
    const res = await getCustomerService();
    customerList.value = res.data;
});

defineExpose({
    open,
    close,
});
</script>

<style scoped>
.customer-page {
    min-height: 100vh;
    background: #edf4ef;
}

.customer-body {
    padding: 78px 16px 24px;
}

.customer-hero {
    position: relative;
    overflow: hidden;
    display: flex;
    gap: 16px;
    align-items: center;
    border-radius: 24px;
    padding: 22px 20px;
    background: var(--theme-button-gradient);
    color: #fff;
}

.customer-hero__icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: #fff;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
}

.customer-hero__content {
    position: relative;
    z-index: 1;
    flex: 1;
}

.customer-hero__content h2 {
    margin: 6px 0 6px;
    font-size: 16px;
    line-height: 30px;
    font-weight: 600;
}

.customer-hero__content p {
    margin: 0;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.9);
}

.customer-hero__status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #e2ffe6;
    font-size: 11px;
}

.customer-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #7ee79b;
}

.customer-hero__orb {
    position: absolute;
    right: -18px;
    top: -18px;
    width: 134px;
    height: 134px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
}

.customer-section-title {
    margin: 24px 2px 16px;
    color: #212b21;
    font-size: 19px;
    line-height: 28px;
    font-weight: 500;
}

.customer-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.customer-card {
    position: relative;
    display: grid;
    grid-template-columns: 58px minmax(0, 1fr) 78px;
    column-gap: 14px;
    align-items: center;
    min-height: 112px;
    border-radius: 22px;
    border: 1px solid #d7e9da;
    background: #fff;
    padding: 22px 16px;
    box-shadow: 0 10px 24px rgba(32, 76, 42, 0.05);
}

.customer-card__icon {
    width: 58px;
    height: 58px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    flex-shrink: 0;
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

.customer-card__main {
    min-width: 0;
    padding-right: 0;
}

.customer-card__title {
    color: #222d22;
    font-size: 14px;
    line-height: 22px;
    font-weight: 500;
    white-space: nowrap;
    /* overflow: hidden; */
    text-overflow: ellipsis;
}

.customer-card__desc {
    margin-top: 6px;
    color: #648664;
    font-size: 11px;
    line-height: 20px;
    word-break: break-all;
}

.customer-card__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    width: 100%;
    min-height: 28px;
    padding: 5px 8px;
    font-size: 11px;
    line-height: 14px;
    white-space: normal;
    text-align: center;
    word-break: break-word;
}

.customer-card__aside {
    display: flex;
    width: 78px;
    min-width: 78px;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    align-self: stretch;
    padding: 4px 0 2px;
}

.customer-card__aside-arrow {
    margin-top: 12px;
    flex-shrink: 0;
}

.customer-card__badge.is-online {
    background: #e9f7eb;
    color: #2da551;
}

.customer-card__badge.is-reply {
    background: #edf3ff;
    color: #3a82f3;
}

.customer-card__arrow {
    position: absolute;
    right: 28px;
    top: 58%;
    transform: translateY(-50%);
    color: #709271;
    font-size: 20px;
}

.customer-dialog__header {
    padding: 18px 18px 10px;
    color: #1f2b1f;
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
}

.customer-dialog__list {
    padding: 0 14px 14px;
}

.customer-dialog__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 0;
    border-top: 1px solid #eef3ef;
}

.customer-dialog__item:first-child {
    border-top: 0;
}

.customer-dialog__item-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    flex: 1;
}

.email-text {
    max-width: 170px;
}

.customer-dialog__item .customer-card__badge,
.customer-dialog__item .customer-card__arrow {
    position: static;
    transform: none;
}

:deep(.customer-nav .van-nav-bar) {
    background: #fff;
}

:deep(.customer-nav .van-nav-bar__title) {
    color: #1f2a1f;
    font-size: 18px;
    font-weight: 500;
}

:deep(.customer-nav .van-icon-arrow-left) {
    color: #27a14c;
    font-size: 22px;
}

:deep(.customer-dialog .van-dialog) {
    border-radius: 20px;
    overflow: hidden;
}
</style>
