<template>
  <main class="dmk-submit-task-page">
    <van-popup
      v-model:show="popupVisible"
      class="dmk-submit-task-popup"
      position="bottom"
      closeable
      :close-on-click-overlay="false"
      :lock-scroll="true"
      @closed="closeModal"
    >
      <div class="dmk-submit-task-shell">
        <h1 class="dmk-submit-task-title">{{ $t("das.dmk.ratingSubmission") }}</h1>

        <div class="dmk-submit-task-content">
          <div class="dmk-submit-task-product">
            <div class="dmk-submit-task-cover">
              <van-image
                v-if="hasCover"
                width="100%"
                height="100%"
                fit="cover"
                :src="imageUrl(order.coverUrl)"
                :alt="order.goodsName || ''"
              />
            </div>
            <p class="dmk-submit-task-name">
              {{ order.goodsName || "—" }}
            </p>
          </div>

          <div class="dmk-submit-task-summary">
            <div class="dmk-submit-task-summary-item">
              <p>{{ $t("das.dmk.totalAmount") }}</p>
              <strong><span>{{ $t("das.dmk.currencyUsd") }}</span> {{ totalAmount }}</strong>
            </div>
            <div class="dmk-submit-task-summary-item">
              <p>{{ $t("das.dmk.profit") }}</p>
              <strong><span>{{ $t("das.dmk.currencyUsd") }}</span> {{ profit }}</strong>
            </div>
            <div class="dmk-submit-task-summary-item">
              <p>{{ $t("das.dmk.commission") }}</p>
              <strong>{{ commissionRate }}</strong>
            </div>
          </div>

          <div class="dmk-submit-task-row">
            <span>{{ $t("das.dmk.createdAt") }}</span>
            <strong>{{ formattedCreateTime }}</strong>
          </div>
          <div class="dmk-submit-task-row">
            <span>{{ $t("das.dmk.taskCode") }}</span>
            <strong class="dmk-submit-task-code">
              {{ order.orderNo || order.id || "—" }}
            </strong>
          </div>
          <div class="dmk-submit-task-row dmk-submit-task-rating-row">
            <span>{{ $t("das.dmk.rating") }}</span>
            <VanRate
              v-model="rating"
              :size="24"
              color="#3456c4"
              void-icon="star"
              void-color="#cccccc"
              :gutter="2"
              readonly
            />
          </div>

          <van-button
            class="dmk-submit-task-button"
            size="large"
            round
            block
            color="var(--btn-color)"
            :disabled="!canSubmit || submitting || loading"
            @click="submitForm"
          >
            <span>{{ $t("das.common.submit") }}</span>
          </van-button>
        </div>

        <div
          v-if="submitAnimationVisible"
          class="dmk-submit-task-loading"
          role="status"
          :aria-label="$t('das.common.loading')"
        >
          <img
            src="https://diamondstaeop.com/images/home/loading.gif"
            alt=""
          />
        </div>
      </div>
    </van-popup>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { Rate as VanRate, showSuccessToast, showToast } from "vant";
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
.dmk-submit-task-page {
  width: 100%;
  min-height: 100vh;
  background: #000;
}

.dmk-submit-task-shell {
  position: relative;
  width: 100%;
  color: #fff;
}

.dmk-submit-task-title {
  margin: 0;
  padding: 16px 42px 0 16px;
  color: #009adf;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
}

.dmk-submit-task-content {
  box-sizing: border-box;
  width: 100%;
  margin-top: 12px;
  padding: 12px;
}

.dmk-submit-task-product {
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.dmk-submit-task-cover {
  width: 128px;
  height: 128px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 6px;
  background: #34383c;
}

.dmk-submit-task-name {
  margin: 0;
  padding: 16px 0 0;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
}

.dmk-submit-task-summary {
  display: flex;
  width: 100%;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
}

.dmk-submit-task-summary-item {
  box-sizing: border-box;
  width: 33.333333%;
  min-width: 0;
  padding: 0 8px;
  text-align: center;
}

.dmk-submit-task-summary-item + .dmk-submit-task-summary-item {
  border-left: 1px solid #e5e7eb;
}

.dmk-submit-task-summary-item p,
.dmk-submit-task-summary-item strong {
  margin: 0;
  line-height: 1.5;
}

.dmk-submit-task-summary-item p {
  color: #999;
  font-size: 12px;
  font-weight: 600;
}

.dmk-submit-task-summary-item strong {
  display: block;
  margin-top: 4px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.dmk-submit-task-summary-item strong span {
  font-size: 12px;
  font-weight: 400;
}

.dmk-submit-task-row {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  min-height: 54px;
  padding: 16px 0;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.dmk-submit-task-row > span {
  flex: 0 0 auto;
  color: #999;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  white-space: nowrap;
}

.dmk-submit-task-row > strong {
  min-width: 0;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
  text-align: right;
  overflow-wrap: anywhere;
}

.dmk-submit-task-row > .dmk-submit-task-code {
  color: #efd7d7;
  font-size: 12px;
}

.dmk-submit-task-rating-row {
  border-bottom: 0;
}

.dmk-submit-task-button {
  width: 100%;
  margin-top: 16px;
  border-color: var(--btn-color);
  background: var(--btn-color);
}

.dmk-submit-task-button span {
  color: #000;
  font-weight: 600;
}

.dmk-submit-task-loading {
  position: absolute;
  z-index: 10;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.dmk-submit-task-loading img {
  display: block;
  width: 128px;
  height: auto;
}
</style>

<style>
.dmk-submit-task-popup.van-popup--bottom {
  box-sizing: border-box;
  width: 100%;
  height: auto;
  max-height: 100vh;
  overflow-y: auto;
  background: rgba(50, 50, 50, 0.8);
}

.dmk-submit-task-popup .van-popup__close-icon {
  color: #fff;
}

.dmk-submit-task-popup .van-rate {
  display: inline-flex;
  flex-wrap: nowrap;
}

@media (min-width: 640px) {
  .dmk-submit-task-popup.van-popup--bottom {
    right: 0;
    left: 0;
    width: min(1200px, 100%);
    margin: 0 auto;
  }
}
</style>
