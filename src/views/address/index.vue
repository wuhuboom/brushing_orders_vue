<template>
    <div class="min-h-[100vh] bg-[#f6f6f6]">
        <div
            class="relative flex items-center justify-center h-[56px] bg-white px-[16px]"
        >
            <div class="absolute left-[16px]">
                <van-icon
                    name="arrow-left"
                    color="#222"
                    size="22px"
                    @click="onClickLeft"
                />
            </div>
            <div class="text-[18px] font-medium text-[#111]">
                {{ $t("deposit") }}
            </div>
        </div>

        <div class="px-[18px] pt-[18px] pb-[28px]">
            <div class="text-center text-[16px] text-[#444] mb-[16px]">
                {{ $t("network") }} - {{ orderInfo.network || "TRON(TRC-20)" }}
            </div>

            <div
                class="warning-banner flex items-center rounded-[12px] bg-[#fff3e8] text-[#ff6a21] px-[14px] py-[12px] text-[14px]"
            >
                <img
                    src="@/static/images/address-warning.png"
                    alt=""
                    draggable="false"
                    class="mr-[8px] h-[18px] w-[18px] shrink-0"
                />
                <span>{{ $t("you_have_an_unpaid_order") }}</span>
            </div>

            <div
                class="mt-[14px] rounded-[20px] bg-white px-[20px] py-[24px] shadow-sm"
            >
                <div class="text-center text-[18px] text-[#333]">
                    {{ $t("deposit_amount") }}
                </div>
                <div class="flex items-end justify-center mt-[10px]">
                    <div
                        class="text-[26px] font-medium text-[#ff6a21] leading-none"
                    >
                        {{ formatAmount(orderInfo.amout) }}
                    </div>
                    <div class="text-[14px] text-[#666] ml-[6px] mb-[2px]">
                        {{ orderInfo.payMethod || "USDT" }}
                    </div>
                </div>

                <div class="mt-[18px] flex justify-center">
                    <div class="qr-panel">
                        <img
                            v-if="qrImg"
                            :src="qrImg"
                            alt="deposit qrcode"
                            class="w-[180px] h-[180px] rounded-[12px] bg-white"
                        />
                        <div
                            class="mt-[14px] text-center text-[16px] text-white"
                        >
                            {{ $t("waiting_for_payment") }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-[20px] text-[15px] text-[#555]">
                {{ $t("one_time_address") }}:
            </div>
            <div
                class="mt-[10px] flex items-center rounded-[14px] bg-white px-[16px] py-[14px] shadow-sm"
            >
                <div
                    class="flex-1 break-all text-[15px] text-[#222] leading-[22px]"
                >
                    {{ orderInfo.address || "-" }}
                </div>
                <button
                    type="button"
                    class="copy-icon-btn ml-[12px] h-[40px] w-[40px] shrink-0"
                    @mousedown.prevent
                    @touchstart.prevent
                    @click="copyAddress"
                >
                    <img
                        src="@/static/images/address-copy.png"
                        alt=""
                        draggable="false"
                        class="h-[40px] w-[40px]"
                    />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { showToast } from "@/util/message";
import { useI18n } from "vue-i18n";
import QRCode from "qrcode";
import { copyContent } from "../../util/utils";

const { t } = useI18n();

const qrImg = ref("");
const orderInfo = ref({
    amount: "",
    payMethod: "USDT",
    address: "",
    network: "TRON(TRC-20)",
});

const readStoredOrder = () => {
    const raw = sessionStorage.getItem("depositOrderInfo");
    if (!raw) {
        return;
    }

    try {
        const parsed = JSON.parse(raw);
        orderInfo.value = {
            ...orderInfo.value,
            ...parsed,
        };
    } catch (error) {
        console.error("Failed to parse deposit order info", error);
    }
};

const generateQrCode = async () => {
    if (!orderInfo.value.address) {
        qrImg.value = "";
        return;
    }

    qrImg.value = await QRCode.toDataURL(orderInfo.value.address, {
        width: 180,
        margin: 1,
        errorCorrectionLevel: "H",
    });
};

const formatAmount = (value) => {
    if (value === undefined || value === null || value === "") {
        return "0.00";
    }

    const amount = Number(value);
    if (Number.isNaN(amount)) {
        return value;
    }

    return amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const copyAddress = () => {
    if (!orderInfo.value.address) {
        showToast(t("network_error"));
        return;
    }

    copyContent(orderInfo.value.address);
};

const onClickLeft = () => history.back();

watch(
    () => orderInfo.value.address,
    () => {
        generateQrCode();
    },
    { immediate: true },
);

onMounted(() => {
    readStoredOrder();
});
</script>

<style scoped>
.qr-panel {
    width: 212px;
    padding: 16px 16px 18px;
    border-radius: 20px;
    background: #050505;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.warning-banner,
.copy-icon-btn {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
}

.copy-icon-btn {
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
}
</style>
