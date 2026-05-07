<template>
    <div>
        <van-dialog
            v-model:show="showCenter"
            :showConfirmButton="false"
            closeOnClickOverlay
            cancelButtonColor="var(--theme-primary)"
            width="240px"
        >
            <div class="flex flex-col rounded-xl overflow-hidden bg-white">
                <div
                    v-for="item in customerList"
                    @click="jump(item.linkUrl)"
                    class="flex items-center justify-between p-4 box-border border-b-[1px] border-[#eef2f4]"
                >
                    <div class="flex items-center">
                        <img
                            src="@/static/images/service.png"
                            alt=""
                            class="w-6 h-6 mr-3"
                        />
                        <div class="flex items-center">{{ item.name }}</div>
                    </div>
                    <van-icon name="arrow" color="#aeb4eb" size="18px" />
                </div>
            </div>
        </van-dialog>
    </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { getCustomerServiceByLang } from "../api/apis";
import { useCommonStore } from "@/store/modules/common";
import { useI18n } from "vue-i18n";
import { showToast } from "@/util/message";
import { errorMessages } from "@/api/errorCodeMap";
const commonStore = useCommonStore();
const { t } = useI18n();
const showCenter = ref(false);
const customerList = ref([]);
const parLang = computed(() => {
    const mapped = commonStore.getValueByKey(commonStore.lang);
    return mapped ?? commonStore.lang;
});

const open = async () => {
    try {
        let res = await getCustomerServiceByLang({ lang: parLang.value });
        customerList.value = res.data || [];
        showCenter.value = true;
    } catch (error) {
        customerList.value = [];
        showCenter.value = false;
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
    }
};
const close = () => (showCenter.value = false);

const jump = (url) => {
    window.open(url);
};

defineExpose({
    open,
    close, // 新增关闭方法
});
</script>
