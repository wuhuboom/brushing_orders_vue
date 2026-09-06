<template>

  <van-popup
    v-model:show="popupVisible"
    class="nsg-task-dialog"
    position="center"
    closeable
    teleport="body"
    :z-index="3000"
    :close-on-click-overlay="true"
    :lock-scroll="true"

  >
    <NsgTaskCard
      :details="{ name: order.goodsName, cover: hasCover ? imageUrl(order.coverUrl) : '', totalAmount, profit, commissionRate, createdAt: formattedCreateTime, code: order.orderNo || order.id }"
      :rating="rating"
      :success="submissionSucceeded"
      :disabled="!submissionSucceeded && !canSubmit"
      :busy="submitting"
      @action="submissionSucceeded ? (popupVisible = false) : submitForm()"
    >
      <template #loading><img src="https://diamondstaeop.com/images/home/loading.gif" alt="" /></template>
    </NsgTaskCard>
  </van-popup>

</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import NsgTaskCard from "@/components/dmk/NsgTaskCard.vue";
import { submitOrder } from "@/api/apis";
import { formatTime } from "@/util/times";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Object,
    default: () => ({}),
  },
  submitDelayMs: {
    type: [Number, String],
    default: 0,
  },
});

const emit = defineEmits(["update:show", "submitted", "navigate"]);
const { t } = useI18n();
const imageBaseUrl = window.g?.VITE_API_IMG_URL || "";
const rating = ref(5);
const submitting = ref(false);
const submissionSucceeded = ref(false);
let submitDelayTimer;

const popupVisible = computed({
  get: () => props.show || submissionSucceeded.value,
  set: (value) => {
    if (!submitting.value) {
      if (!value) submissionSucceeded.value = false;
      emit("update:show", value);
    }
  },
});

watch(
  () => props.show,
  (show) => {
    if (show) {
      rating.value = 5;
      submissionSucceeded.value = false;
    }
  },
);

const hasCover = computed(() => {
  const value = String(props.order.coverUrl ?? "").trim().toLowerCase();
  return Boolean(value && value !== "null" && value !== "undefined");
});

const imageUrl = (path) =>
  /^https?:/i.test(String(path || "")) ? path : `${imageBaseUrl}${path || ""}`;
const money = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const totalAmount = computed(() =>
  money(props.order.totalAmount ?? props.order.price),
);
const profit = computed(() =>
  money(props.order.totalCommission ?? props.order.commission),
);
const commissionRate = computed(() => {
  const value =
    props.order.rebatePercentage ??
    props.order.commissionRate ??
    props.order.commission_rate ??
    props.order.rate;
  if (value === undefined || value === null || value === "") return "—";
  const text = String(value);
  if (text.includes("%")) return text;
  const number = Number(value);
  return Number.isFinite(number) ? `${number}%` : text;
});
const formattedCreateTime = computed(() => {
  const value = props.order.createTime ?? props.order.createdAt;
  return value ? formatTime(value) : "—";
});
const canSubmit = computed(() => {
  const status = props.order.status;
  return (
    Boolean(props.order.id) &&
    (status === undefined || status === null || String(status) === "1")
  );
});

const waitForSubmitDelay = () =>
  new Promise((resolve) => {
    const value = Number(props.submitDelayMs);
    const timeout = Number.isFinite(value) && value > 0 ? value : 0;
    if (!timeout) {
      resolve();
      return;
    }
    submitDelayTimer = setTimeout(resolve, timeout);
  });

const submitForm = async () => {
  if (!canSubmit.value || submitting.value) return;
  submitting.value = true;
  try {
    await waitForSubmitDelay();
    const res = await submitOrder(props.order.id);
    showSuccessToast(t("das.records.submitted"));
    submissionSucceeded.value = true;
    emit("submitted", { ...props.order, ...(res?.data || {}) });
    emit("update:show", false);
  } catch (error) {
    if (Number(error?.code) === 916) {
      const isPc = document.documentElement.classList.contains("dmk-pc-mode");
      if (isPc) {
        showToast(t("das.orderErrors.insufficientBalance"));
        return;
      }
      emit("navigate", "/records?tab=pending");
      return;
    }
    if (Number(error?.code) === 918) {
      emit("update:show", false);
    }
  } finally {
    submitting.value = false;
  }
};

onBeforeUnmount(() => clearTimeout(submitDelayTimer));
</script>
