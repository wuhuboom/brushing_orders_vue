<template>
  <main class="dmk-submit-task-page">
  <van-popup
    v-model:show="popupVisible"
    class="nsg-task-dialog"
    position="center"
    closeable

    :close-on-click-overlay="false"
    :lock-scroll="true"
    @closed="closeModal"
  >
    <NsgTaskCard
      :details="{ name: order.goodsName, cover: hasCover ? imageUrl(order.coverUrl) : '', totalAmount, profit, commissionRate, createdAt: formattedCreateTime, code: order.orderNo || order.id }"
      :rating="rating"

      :disabled="!canSubmit || loading"
      :busy="submitAnimationVisible"
      @action="submitForm"
    >
      <template #loading><img src="https://diamondstaeop.com/images/home/loading.gif" alt="" /></template>
    </NsgTaskCard>
  </van-popup>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import NsgTaskCard from "@/components/dmk/NsgTaskCard.vue";
import { getOrderInfo, getTradeConfig, submitOrder } from "@/api/apis";
import { formatTime } from "@/util/times";
import { safeReplace } from "@/utils/navigation";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const imageBaseUrl = window.g?.VITE_API_IMG_URL || "";
const order = ref({});
const rating = ref(5);
const popupVisible = ref(false);
const loading = ref(false);
const submitting = ref(false);
const submitAnimationVisible = ref(false);
const tradeInfo = ref({});
let submitDelayTimer;
let tradeConfigRequest;
let pageAlive = true;

const hasCover = computed(() => {
  const value = String(order.value.coverUrl ?? "").trim().toLowerCase();
  return Boolean(value && value !== "null" && value !== "undefined");
});

const imageUrl = (path) =>
  /^https?:/i.test(String(path || "")) ? path : `${imageBaseUrl}${path || ""}`;
const money = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const totalAmount = computed(() => money(order.value.totalAmount ?? order.value.price));
const profit = computed(() => money(order.value.totalCommission ?? order.value.commission));
const commissionRate = computed(() => {
  const value =
    order.value.rebatePercentage ??
    order.value.commissionRate ??
    order.value.commission_rate ??
    order.value.rate;
  if (value === undefined || value === null || value === "") return "—";
  const text = String(value);
  if (text.includes("%")) return text;
  const number = Number(value);
  return Number.isFinite(number) ? `${number}%` : text;
});
const formattedCreateTime = computed(() =>
  order.value.createTime ? formatTime(order.value.createTime) : "—",
);
const canSubmit = computed(() => {
  const status = order.value.status;
  return (
    Boolean(order.value.id) &&
    (status === undefined || status === null || String(status) === "1")
  );
});

const delayMs = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

const waitForSubmitDelay = () =>
  new Promise((resolve) => {
    const timeout = delayMs(tradeInfo.value.submitTaskDelayMs);
    if (!timeout) {
      resolve();
      return;
    }
    submitDelayTimer = setTimeout(resolve, timeout);
  });

const readCachedOrder = (id) => {
  try {
    const cached = sessionStorage.getItem(`dasOrder:${id}`);
    return cached ? JSON.parse(cached) : null;
  } catch (_) {
    return null;
  }
};

const loadOrder = async () => {
  const id = route.query.id;
  if (!id) {
    safeReplace(router, "/starting");
    return;
  }
  const cached = readCachedOrder(id);
  if (cached) order.value = cached;
  loading.value = true;
  try {
    const res = await getOrderInfo(id);
    order.value = { ...order.value, ...(res.data || {}) };
    try {
      sessionStorage.setItem(`dasOrder:${id}`, JSON.stringify(order.value));
    } catch (_) {}
  } catch (error) {
    if (!cached) showToast(error?.msg || error?.message || t("das.common.requestFailed"));
  } finally {
    loading.value = false;
  }
};

const loadTradeConfig = () => {
  if (!tradeConfigRequest) {
    tradeConfigRequest = getTradeConfig()
      .then((res) => {
        if (pageAlive) tradeInfo.value = res.data || {};
        return res;
      })
      .catch(() => null);
  }
  return tradeConfigRequest;
};

const closeModal = () => {
  if (!submitting.value) safeReplace(router, "/starting");
};

const submitForm = async () => {
  if (!canSubmit.value || submitting.value) return;
  submitting.value = true;
  submitAnimationVisible.value = true;
  try {
    await loadTradeConfig();
    await waitForSubmitDelay();
    if (!pageAlive) return;
    const res = await submitOrder(order.value.id);
    if (res?.data) order.value = { ...order.value, ...res.data };
    showSuccessToast(t("das.records.submitted"));
    try {
      sessionStorage.removeItem(`dasOrder:${order.value.id}`);
    } catch (_) {}
    safeReplace(router, "/starting");
  } catch (error) {
    if (Number(error?.code) === 916) {
      safeReplace(router, "/deposit");
      return;
    }
    if (Number(error?.code) === 918) {
      safeReplace(router, "/starting");
    }
  } finally {
    submitAnimationVisible.value = false;
    submitting.value = false;
  }
};

onMounted(() => {
  popupVisible.value = true;
  loadOrder();
  loadTradeConfig();
});
onBeforeUnmount(() => {
  pageAlive = false;
  clearTimeout(submitDelayTimer);
});
</script>
<style scoped>
.dmk-submit-task-page { width: 100%; min-height: 100vh; background: #000; }
</style>
