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
    <header class="design-order-heading">
      <img src="/design500/submit-bolt.png" alt="" />
      <div>
        <h1>{{ $t("das.product.orderDetails") }}</h1>
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
    <section class="pd-content">
      <article class="pd-main">
        <p class="wester-order-spec">{{ $t("das.wester.orderSpecification") }}</p>
        <section class="design-order-product">
          <div class="pd-cover" :class="{ 'is-ready': coverState === 'ready' }">
            <span v-if="canSubmit" class="wester-vault">{{ $t("das.wester.inVault") }}</span>
            <img
              v-if="coverSrc && coverState !== 'failed'"
              :key="coverSrc"
              :src="coverSrc"
              decoding="async"
              alt=""
              @load="revealCover"
              @error="failCover"
            />
            <ReferenceLoading v-if="coverState === 'loading'" />
            <DasImagePlaceholder
              v-else-if="coverState !== 'ready'"
              :label="$t('das.product.briefCover')"
            />
          </div>
          <div class="design-order-product__copy">
            <h2 :title="order.goodsName">{{ order.goodsName }}</h2>
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
            <div class="wester-order-price">
              <div><span>{{ $t("das.wester.unitPrice") }}</span><strong>{{ money(order.price) }} <small>USD</small></strong></div>
              <div>
                <span>{{ $t("das.wester.profitRate") }}</span>
                <b>{{ formatOrderProfitRate(order, { signed: true }) }}</b>
              </div>
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
        </section>
        <section class="wester-order-record">
          <h2>{{ $t("das.wester.transactionRecord") }}</h2>
          <div class="wester-order-date">
            <span>{{ $t("das.product.creationTime") }}</span>
            <time>{{ formattedCreateTime }}</time>
          </div>
          <div class="wester-order-number">
            <span>{{ $t("das.product.briefNo") }}</span>
            <small>{{ order.orderNo || order.id || "—" }}</small>
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
            <span>{{ $t("das.wester.submitOrder") }}</span>
            <img src="/design500/arrow-white.png" alt="" />
          </template>
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
      v-model:show="showSuccess"
      class="wester-submit-success"
      teleport="body"
      :show-confirm-button="false"
    >
      <button class="wester-submit-close" type="button" :aria-label="$t('das.common.close')" @click="finishOrder('/starting')">×</button>
      <img class="wester-submit-check" src="/westermedia/order-success.png" alt="" />
      <p>{{ $t("das.wester.submissionConfirmed") }}</p>
      <h2>{{ $t("das.wester.orderSubmitted") }}</h2>
      <p class="wester-submit-hint">{{ $t("das.wester.submissionHint") }}</p>
      <dl>
        <div><dt>{{ $t("das.wester.settledAmount") }}</dt><dd>${{ money(order.totalAmount ?? order.price) }}</dd></div>
        <div><dt>{{ $t("das.wester.commissionEarned") }}</dt><dd>+${{ money(order.totalCommission ?? order.commission) }}</dd></div>
        <div><dt>{{ $t("das.product.briefNo") }}</dt><dd>{{ order.orderNo || order.id || "—" }}</dd></div>
      </dl>
      <button class="wester-submit-done" type="button" @click="finishOrder('/starting')">{{ $t("das.wester.done") }}</button>
      <button class="wester-submit-records" type="button" @click="finishOrder('/records')">{{ $t("das.wester.viewRecords") }}</button>
    </van-dialog>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
import HeaderTop from "@/components/HeaderTop.vue";
import DasImagePlaceholder from "@/components/DasImagePlaceholder.vue";
import ReferenceLoading from "@/components/ReferenceLoading.vue";
import { getOrderInfo, getTradeConfig, submitOrder } from "@/api/apis";
import { formatDateTime } from "@/util/times";
import { resolveProfileImageUrl } from "@/utils/avatar";
import { formatOrderProfitRate } from "@/utils/orderProfitRate";
import { safeBack, safeReplace } from "@/utils/navigation";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const imageBaseUrl = window.g?.VITE_API_IMG_URL || "";
const order = ref({});
const loading = ref(false);
const showSuccess = ref(false);
const submitting = ref(false);
const submitAnimationVisible = ref(false);
const tradeInfo = ref({});
const submitEnd = ref(null);
const submitDocked = ref(false);
let submitDelayTimer;
let tradeConfigRequest;
let pageAlive = true;

const coverSrc = computed(() => resolveProfileImageUrl(order.value.coverUrl, imageBaseUrl));
const coverState = ref("empty");
watch(coverSrc, (src) => { coverState.value = src ? "loading" : "empty"; }, { flush: "sync" });
const isCurrentCover = (image) => image.isConnected && image.getAttribute("src") === coverSrc.value;
const revealCover = async ({ currentTarget: image }) => {
  try {
    await image.decode();
    if (isCurrentCover(image)) coverState.value = "ready";
  } catch {
    if (isCurrentCover(image)) coverState.value = "failed";
  }
};
const failCover = ({ currentTarget: image }) => {
  if (isCurrentCover(image)) coverState.value = "failed";
};
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
const formattedCreateTime = computed(() => formatDateTime(order.value.createTimeTimestamp));
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

const finishOrder = (target) => {
  showSuccess.value = false;
  safeReplace(router, target);
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
    try {
      sessionStorage.removeItem(`dasOrder:${order.value.id}`);
    } catch (_) {}
    showSuccess.value = true;
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
