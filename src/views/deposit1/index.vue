<template>
    <div class="deposit-legacy-page w-full min-h-[100vh] bg-[#f8f8f8]">
        <div class="container w-full mb-[60px] bg-white">
            <PageTopBar
                :title="$t('deposit')"
                show-back
                @click-left="onClickLeft"
            />
        </div>
        <div class="px-[15px] bg-[#fff] pb-[10px] my-[10px]">
            <div
                class="text-[15px] text-[#333] font-bold py-[10px] mb-[10px]"
                style="border-bottom: 1px solid #eee"
            >
                {{ $t("payment_method") }}
            </div>
            <div
                class="relative flex flex-col items-center border h-[62px] w-[75px] border-[#eee] rounded-[10px] pb-[10px]"
            >
                <div>
                    <img
                        class="w-[31px] h-[31px]"
                        src="@/static/images/deposit3.png"
                        alt=""
                    />
                </div>
                <div class="text-[12px] text-[#6a4d52]">USDT</div>
                <div>
                    <img
                        class="w-[16px] h-[16px] absolute bottom-0 right-0"
                        src="@/static/images/check.png"
                        alt=""
                    />
                </div>
            </div>
        </div>
        <div class="px-[15px] bg-[#fff] pb-[10px] my-[10px]">
            <div
                class="text-[15px] text-[#333] font-bold py-[10px] mb-[10px]"
                style="border-bottom: 1px solid #eee"
            >
                {{ $t("select_the_protocol_to_use") }}
            </div>
            <div
                class="relative flex justify-center items-center border h-[41px] w-[68px] border-[#eee] rounded-[10px]"
            >
                <!-- <div>
                <img class="w-[31px] h-[31px]" src="@/static/images/deposit3.png" alt="">
            </div> -->
                <div class="text-[12px] text-[#6a4d52]">TRC-20</div>
                <div>
                    <img
                        class="w-[16px] h-[16px] absolute bottom-0 right-0"
                        src="@/static/images/check.png"
                        alt=""
                    />
                </div>
            </div>
        </div>
        <div class="px-[15px] bg-[#fff] pb-[10px] my-[10px]">
            <div
                class="text-[15px] text-[#333] font-bold py-[10px] mb-[10px]"
                style="border-bottom: 1px solid #eee"
            >
                {{ $t("currency_selection") }}
            </div>
            <div
                class="relative flex justify-center items-center border h-[41px] w-[47px] border-[#eee] rounded-[10px]"
            >
                <div class="text-[12px] text-[#6a4d52]">{{ $t("auto_all") }}</div>
                <div>
                    <img
                        class="w-[16px] h-[16px] absolute bottom-0 right-0"
                        src="@/static/images/check.png"
                        alt=""
                    />
                </div>
            </div>
        </div>
        <div class="px-[15px] bg-[#fff] pb-[10px] my-[10px]">
            <div
                class="text-[15px] text-[#333] font-bold py-[10px] mb-[10px]"
                style="border-bottom: 1px solid #eee"
            >
                {{ $t("deposit_amount") }}
            </div>
            <div
                class="w-full mt-2 overflow-hidden flex items-center"
                style="border-bottom: 1px dashed #d1d5db"
            >
                <div class="text-[#6a4d52]">USDT</div>
                <van-field
                    v-model="amount"
                    label=""
                    style="font-size: 16px; margin-left: -10px"
                    :placeholder="$t('Please enter recipient name')"
                    label-align="top"
                    size="large"
                />
                <div
                    class="absolute right-0 top-[13px] text-[12px] text-[#2563EB]"
                    @click="All"
                >
                    {{ $t("all") }}
                </div>
            </div>
        </div>
        <div
            class="px-[16px]"
            style="border-bottom: 2px solid #eee; padding-bottom: 10px"
        >
            <div class="text-[#333] text-[12px] pb-[10px]">
                {{ $t("estimated_payment_amount") }}:{{ amount }}USDT
            </div>
            <div class="text-[#333] text-[12px]">
                {{ $t("reference_exchange_rate") }}：1 USDT ≈ 1 USDT
            </div>
            <div class="text-[#999] text-[12px]">
                {{
                    $t(
                        "payment_amount_and_exchange_rate_are_subject_to_actual_payment",
                    )
                }}.
            </div>
        </div>
        <div class="w-full pl-5 pr-5 mt-[20px]">
            <van-button
                color="var(--theme-primary)"
                :style="{
                    background: amount
                        ? 'var(--theme-button-gradient)'
                        : 'var(--theme-button-disabled)',
                    color: '#fff',
                }"
                class="w-full"
                @click="deposit"
                >{{ $t("deposit_now") }}</van-button
            >
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { getConfigByLang } from "../../api/apis";
import { useCommonStore } from "@/store/modules/common";
import { useRouter } from "vue-router";
const faqEn = ref("");
const amount = ref("");
const router = useRouter();
const commonStore = useCommonStore();
const parLang = computed(() => {
    const mapped = commonStore.getValueByKey(commonStore.lang);
    return mapped ?? commonStore.lang;
});
const deposit = () => {
    if (amount.value) {
        router.push({
            path: "/address",
            query: {
                amount: amount.value,
            },
        });
    }
};
onMounted(() => {});

const onClickLeft = () => history.back();
</script>
