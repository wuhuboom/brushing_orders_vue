<template>
  <main class="das-page product-details-page pd-page">
    <div class="design-order-backdrop" aria-hidden="true">
      <HeaderTop />
      <div class="design-order-backdrop__bar"></div>
      <div class="design-order-backdrop__balance"></div>
      <div class="design-order-backdrop__products">
        <img src="/poetic/task-laptop.png" alt="" /><img
          src="/poetic/task-phone.png"
          alt=""
        />
      </div>
    </div>
    <section class="pd-content">
      <article class="pd-main">
        <header class="design-order-heading">
          <img src="/design500/submit-bolt.png" alt="" />
          <div>
            <h1>{{ $t("das.product.orderDetails") }}</h1>
            <p>
              {{ $t("das.product.creationTime") }}: {{ formattedCreateTime }}
            </p>
          </div>
          <button
            class="design-order-close"
            type="button"
            :aria-label="$t('das.common.close')"
            :disabled="submitting || submitAnimationVisible"
            @click="safeBack(router, '/starting')"
          >
            <img src="/design500/close-soft.png" alt="" />
          </button>
        </header>
        <section class="design-order-product">
          <div class="pd-cover">
            <img
              v-if="hasCover"
              :src="imageUrl(order.coverUrl)"
              alt=""
            /><DasImagePlaceholder
              v-else
              :label="$t('das.product.briefCover')"
            />
          </div>
          <div class="design-order-product__copy">
            <small>{{ order.orderNo || order.id || "—" }}</small>
            <h2 :title="order.goodsName">{{ order.goodsName }}</h2>
            <p>
              {{ $t("das.started.price") }}:
              <strong>{{ money(order.price) }} USD</strong>
            </p>
            <div
              v-if="order.rating !== undefined && order.rating !== null"
              class="pd-rating"
            >
              <img src="/design500/star.png" alt="" /><b>{{
                ratingText(order.rating)
              }}</b
              ><small v-if="reviewCount"
                >({{ reviewCount }} {{ $t("das.started.reviews") }})</small
              >
            </div>
          </div>
        </section>
        <section class="design-order-totals">
          <div>
            <span>{{ $t("das.records.total") }}</span
            ><strong>{{ money(order.totalAmount ?? order.price) }} USD</strong>
          </div>
          <div>
            <span>{{ $t("das.product.totalCommission") }}</span
            ><strong
              >{{
                money(order.totalCommission ?? order.commission)
              }}
              USD</strong
            >
          </div>
          <div>
            <span>{{ $t("das.product.briefNo") }}</span
            ><small>{{ order.orderNo || order.id || "—" }}</small>
          </div>
        </section>
        <p class="design-order-assurance">
          <img src="/design500/shield.png" alt="" /><span>{{
            $t("das.product.submitHint")
          }}</span>
        </p>
        <button
          v-if="canSubmit"
          class="pd-submit"
          :class="{
            'pd-submit--docked': submitDocked,
            'is-submitting': submitting || submitAnimationVisible,
          }"
          :aria-busy="submitting || submitAnimationVisible"
          type="button"
          :disabled="submitting || loading"
          @click="submitForm"
        >
          <template v-if="submitting || submitAnimationVisible">
            <img
              class="pd-submit__spinner"
              src="/design500/refresh.png"
              alt=""
            />
            <span>{{ $t("das.product.submittingOrder") }}</span>
          </template>
          <template v-else>
            <img src="/design500/bolt-white.png" alt="" />
            <span>{{ $t("das.common.submit") }}</span>
            <img src="/design500/bolt.png" alt="" />
          </template>
        </button>
        <span
          v-if="canSubmit"
          ref="submitEnd"
          class="pd-submit-end"
          aria-hidden="true"
        ></span>
        <button
          class="design-order-cancel"
          type="button"
          :disabled="submitting || submitAnimationVisible"
          @click="safeBack(router, '/starting')"
        >
          {{ $t("das.common.cancel") }}
        </button>
      </article>
    </section>
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
