<template>
  <main class="das-page product-details-page">
    <div class="pd-page-header">
      <HeaderTop />
      <div class="pd-titlebar">
        <button
          type="button"
          :aria-label="$t('das.common.back')"
          @click="safeBack(router, '/starting')"
        >
          <img src="/psybir/back.png" alt="" />
        </button>
        <h1>{{ $t("das.page.productDetails") }}</h1>
      </div>
    </div>
    <section class="pd-content">
      <article class="pd-main">
        <div class="pd-cover" :class="{ 'is-placeholder': !hasCover }">
          <img
            v-if="hasCover"
            :src="imageUrl(order.coverUrl)"
            :alt="order.goodsName || ''"
          />
          <template v-else>
            <DasImagePlaceholder class="pd-cover__placeholder" />
            <small>{{ $t("das.product.briefCover") }}</small>
          </template>
        </div>

        <h2>{{ order.goodsName || $t("das.page.productDetails") }}</h2>
        <p class="pd-rating">
          <span>★</span>
          <b>{{ ratingText(order.rating) }}</b>
          <small v-if="reviewCount">{{ reviewCount }} Reviews</small>
        </p>

        <p class="pd-price">
          {{ $t("das.started.price") }}:
          <strong>{{ money(order.price ?? order.totalAmount) }} USD</strong>
        </p>

        <div class="pd-summary">
          <div class="pd-summary__card">
            <div class="pd-summary__heading">
              <img src="@/static/brain/wallet.png" alt="" />
              <b>{{ $t("das.records.total") }}</b>
            </div>
            <strong>{{ money(order.totalAmount ?? order.price) }}</strong>
            <small>USD</small>
            <img
              class="pd-summary__decoration"
              src="@/static/brain/product-total-amount.png"
              alt=""
              aria-hidden="true"
            />
          </div>
          <div class="pd-summary__card">
            <div class="pd-summary__heading">
              <img src="@/static/brain/commission.png" alt="" />
              <b>{{ $t("das.product.totalCommission") }}</b>
            </div>
            <strong>{{
              money(order.totalCommission ?? order.commission)
            }}</strong>
            <small>USD</small>
            <img
              class="pd-summary__decoration"
              src="@/static/brain/product-total-commission.png"
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>

        <div class="pd-meta">
          <h3>{{ $t("das.product.orderDetails") }}</h3>
          <div>
            <span>{{ $t("das.product.creationTime") }}</span>
            <b>{{ formattedCreateTime }}</b>
          </div>
          <div>
            <span>{{ $t("das.product.briefNo") }}</span>
            <b>{{ order.orderNo || order.id || "—" }}</b>
          </div>
        </div>

        <button
          v-if="canSubmit"
          class="pd-submit"
          :class="{ 'pd-submit--docked': submitDocked }"
          type="button"
          :disabled="submitting || loading"
          @click="submitForm"
        >
          {{ submitting ? $t("das.common.loading") : $t("das.common.submit") }}
        </button>
        <span
          v-if="canSubmit"
          ref="submitEnd"
          class="pd-submit-end"
          aria-hidden="true"
        ></span>
      </article>
    </section>
    <van-dialog
      :show="submitAnimationVisible"
      class="submit-loading-dialog"
      overlay-class="submit-loading-overlay"
      :show-confirm-button="false"
      :close-on-click-overlay="false"
    >
      <div
        class="starting-match__card"
        role="status"
        aria-live="polite"
        :aria-label="$t('das.product.processingOrder')"
      >
        <img
          class="starting-match__spinner"
          src="/psybir/submit-spinner.png"
          alt=""
        />
        <h2>{{ $t("das.product.submittingOrder") }}</h2>
        <p>{{ $t("das.product.submitHint") }}</p>
        <div class="starting-match__processing">
          {{ $t("das.product.processingPleaseWait") }}
        </div>
      </div>
    </van-dialog>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import HeaderTop from "@/components/HeaderTop.vue";
import DasImagePlaceholder from "@/components/DasImagePlaceholder.vue";
import { getOrderInfo, getTradeConfig, submitOrder } from "@/api/apis";
import { formatTime } from "@/util/times";
import { safeBack, safeReplace } from "@/utils/navigation";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const imageBaseUrl = window.g?.VITE_API_IMG_URL || "";
const order = ref({});
const loading = ref(false);
const submitting = ref(false);
const submitAnimationVisible = ref(false);
const tradeInfo = ref({});
const submitEnd = ref(null);
const submitDocked = ref(false);
let submitDelayTimer;
let tradeConfigRequest;
let pageAlive = true;

const hasCover = computed(() => {
  const value = String(order.value.coverUrl ?? "")
    .trim()
    .toLowerCase();
  return Boolean(value && value !== "null" && value !== "undefined");
});

const imageUrl = (path) =>
  /^https?:/i.test(String(path || "")) ? path : `${imageBaseUrl}${path || ""}`;
const money = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const ratingText = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return number.toLocaleString(undefined, { maximumFractionDigits: 1 });
};
const reviewCount = computed(
  () =>
    order.value.reviewCount ??
    order.value.reviews ??
    order.value.reviewTotal ??
    "",
);
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


watch(submitEnd, (element, _previous, onCleanup) => {
  if (!element) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      submitDocked.value = !entry.isIntersecting;
    },
    {
      root: element.closest(".product-details-page"),
      rootMargin: "0px 0px -12px 0px",
      threshold: 1,
    },
  );
  observer.observe(element);
  onCleanup(() => observer.disconnect());
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
    if (!cached)
      showToast(error?.msg || error?.message || t("das.common.requestFailed"));
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

const submitForm = async () => {
  if (!order.value.id || submitting.value) return;
  submitting.value = true;
  submitAnimationVisible.value = true;
  try {
    await loadTradeConfig();
    await waitForSubmitDelay();
    if (!pageAlive) return;
    submitAnimationVisible.value = false;
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
  loadOrder();
  loadTradeConfig();
});
onBeforeUnmount(() => {
  pageAlive = false;
  clearTimeout(submitDelayTimer);
});
</script>
