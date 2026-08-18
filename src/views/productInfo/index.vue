<template>
  <main class="das-page product-details-page">
    <HeaderTop />
    <section class="product-details-content">
      <div class="product-details-title">
        <button type="button" :aria-label="$t('das.common.back')" @click="safeBack(router, '/starting')">
          ‹
        </button>
        <h1>{{ $t("das.page.productDetails") }}</h1>
      </div>

      <article class="product-details-card">
        <div class="product-cover" :class="{ 'is-placeholder': !hasCover }">
          <img v-if="hasCover" :src="imageUrl(order.coverUrl)" :alt="order.goodsName || ''" />
          <template v-else>
            <DasImagePlaceholder class="product-cover-icon" />
            <small>{{ $t("das.product.briefCover") }}</small>
          </template>
        </div>

        <h2>{{ order.goodsName || $t("das.page.productDetails") }}</h2>
        <p class="product-rating"><span>★</span> {{ ratingText(order.rating) }}</p>

        <div class="product-summary">
          <div>
            <b>{{ $t("das.records.total") }}</b>
            <strong>{{ money(order.totalAmount ?? order.price) }} USD</strong>
          </div>
          <div>
            <b>{{ $t("das.product.totalCommission") }}</b>
            <strong>{{ money(order.totalCommission ?? order.commission) }} USD</strong>
          </div>
        </div>

        <div class="product-meta">
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
          class="product-submit"
          type="button"
          :disabled="submitting || loading"
          @click="submitForm"
        >
          {{ submitting ? $t("das.common.loading") : $t("das.common.submit") }}
        </button>
      </article>
      <p class="product-copyright">{{ $t("das.common.copyright") }}</p>
    </section>
    <Footer name="/starting" />
    <van-dialog
      :show="submitAnimationVisible"
      class="submit-loading-dialog"
      :show-confirm-button="false"
      :close-on-click-overlay="false"
    >
      <div class="submit-loading-animation" role="status" :aria-label="$t('das.common.loading')">
        <img src="@/static/das/loading-submit.gif" alt="" />
      </div>
    </van-dialog>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import HeaderTop from "@/components/HeaderTop.vue";
import Footer from "@/components/Footer.vue";
import DasImagePlaceholder from "@/components/DasImagePlaceholder.vue";
import { getOrderInfo, submitOrder } from "@/api/apis";
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
let submitDelayTimer;
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
const ratingText = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return number.toLocaleString(undefined, { maximumFractionDigits: 1 });
};
const formattedCreateTime = computed(() =>
  order.value.createTime ? formatTime(order.value.createTime) : "—",
);
const canSubmit = computed(() => {
  const status = order.value.status;
  return Boolean(order.value.id) && (status === undefined || status === null || String(status) === "1");
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

const submitForm = async () => {
  if (!order.value.id || submitting.value) return;
  submitting.value = true;
  submitAnimationVisible.value = true;
  try {
    await new Promise((resolve) => {
      submitDelayTimer = setTimeout(resolve, 3000);
    });
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

onMounted(loadOrder);
onBeforeUnmount(() => {
  pageAlive = false;
  clearTimeout(submitDelayTimer);
});
</script>

<style scoped>
.product-details-page {
  min-height: 100vh;
  background: #f7f6ee;
  color: #17382d;
}
.product-details-content {
  min-height: calc(100vh - 88px);
  padding: 20px clamp(18px, 5vw, 34px) 18px;
  background: #f7f6ee;
}
.product-details-title {
  position: relative;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-details-title button {
  position: absolute;
  left: 2px;
  top: 50%;
  width: 36px;
  height: 36px;
  padding: 0;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #17382d;
  font-size: 30px;
  font-weight: 300;
  line-height: 1;
}
.product-details-title h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
}
.product-details-card {
  margin-top: 12px;
  padding: 20px 18px 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.62);
  text-align: center;
}
.product-cover {
  width: min(52%, 180px);
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 13px;
  background: #17382d;
}
.product-cover img {
  width: 100%;
  height: 100%;
  padding: 14px;
  object-fit: contain;
  background: #fff;
}
.product-cover.is-placeholder {
  align-content: center;
  gap: 10px;
  color: rgba(247, 245, 236, 0.55);
}
.product-cover-icon {
  width: 45px;
  height: 37px;
}
.product-cover small {
  font-size: 10px;
}
.product-details-card h2 {
  margin: 17px 0 0;
  font-size: 14px;
  line-height: 1.35;
  font-weight: 800;
}
.product-rating {
  margin: 7px 0 17px;
  color: #929991;
  font-size: 11px;
}
.product-rating span {
  color: #eda08f;
}
.product-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}
.product-summary > div {
  min-height: 70px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  border: 1px solid #d9ddd4;
  border-radius: 12px;
  background: #fbfaf4;
}
.product-summary b {
  font-size: 10px;
}
.product-summary strong {
  font-size: 13px;
  font-weight: 500;
}
.product-meta {
  margin-top: 13px;
  padding: 11px 13px;
  display: grid;
  gap: 10px;
  border: 1px solid #d9ddd4;
  border-radius: 12px;
  background: #fbfaf4;
}
.product-meta > div {
  min-width: 0;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;
  text-align: left;
}
.product-meta span {
  color: #959c96;
  font-size: 10px;
}
.product-meta b {
  min-width: 0;
  overflow-wrap: anywhere;
  color: #566059;
  font-size: 10px;
  font-weight: 500;
  text-align: right;
}
.product-submit {
  width: 100%;
  height: 50px;
  margin-top: 16px;
  border: 0;
  border-radius: 999px;
  background: #17382d;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
}
.product-submit:disabled {
  opacity: 0.58;
}
:deep(.submit-loading-dialog) {
  width: min(70vw, 280px);
  overflow: hidden;
  border-radius: 22px;
  background: transparent;
}
.submit-loading-animation {
  display: grid;
  place-items: center;
  padding: 12px;
  border-radius: 22px;
  background: #f7f5ec;
}
.submit-loading-animation img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 14px;
}
.product-copyright {
  margin: 18px 0 0;
  color: #a0a69f;
  font-size: 9px;
  text-align: center;
}
@media (min-width: 600px) {
  .product-details-content {
    padding-inline: 40px;
  }
  .product-details-card {
    max-width: 620px;
    margin-inline: auto;
    padding: 26px 28px 24px;
  }
}
</style>
