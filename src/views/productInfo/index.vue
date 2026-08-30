<template>
  <main class="das-page product-details-page">
    <HeaderTop />
    <section class="pd-content">
      <div class="pd-titlebar">
        <button
          type="button"
          :aria-label="$t('das.common.back')"
          @click="safeBack(router, '/starting')"
        >
          <img src="@/static/brain/back.png" alt="" />
        </button>
        <h1>{{ $t("das.page.productDetails") }}</h1>
      </div>

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
          type="button"
          :disabled="submitting || loading"
          @click="submitForm"
        >
          {{ submitting ? $t("das.common.loading") : $t("das.common.submit") }}
        </button>
      </article>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import HeaderTop from "@/components/HeaderTop.vue";
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

const submitForm = async () => {
  if (!order.value.id || submitting.value) return;
  submitting.value = true;
  try {
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
    submitting.value = false;
  }
};

onMounted(loadOrder);
</script>

<style scoped>
.product-details-page {
  min-height: 100vh;
  background: #040713 !important;
  background-image: none !important;
  color: #f7f8fc;
}
.pd-content {
  min-height: calc(100vh - 56px);
  padding: 0 0 56px;
  background: #040713;
}
.pd-titlebar {
  position: relative;
  height: 55px;
  display: grid;
  place-items: center;
  border-bottom: 1px solid #141b2b;
}
.pd-titlebar button {
  position: absolute;
  z-index: 1;
  left: 15px;
  top: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
}
.pd-titlebar button img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}
.pd-titlebar h1 {
  max-width: calc(100% - 110px);
  margin: 0;
  overflow: hidden;
  font-size: 18px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pd-main {
  max-width: 390px;
  margin: 0 auto;
  padding: 24px 10px 0;
  text-align: center;
}
.pd-cover {
  width: clamp(200px, 53.33vw, 212px);
  aspect-ratio: 1;
  margin: 0 auto;
  display: grid;
  place-items: center;
  overflow: hidden;
  border: 1px solid #263857;
  border-radius: 7px;
  background: #101421;
}
.pd-cover > img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
.pd-cover.is-placeholder {
  align-content: center;
  gap: 10px;
  color: rgba(247, 248, 252, 0.55);
}
.pd-cover__placeholder {
  width: 45px;
  height: 37px;
}
.pd-cover small {
  font-size: 10px;
}
.pd-main h2 {
  max-width: 350px;
  margin: 30px auto 0;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.25;
}
.pd-rating {
  margin: 10px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: #a1a9ba;
  font-size: 14px;
}
.pd-rating span {
  color: #ffd700;
  font-size: 17px;
}
.pd-rating b {
  color: #fff;
  font-weight: 500;
}
.pd-rating small {
  font-size: 14px;
}
.pd-price {
  margin: 17px 0 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
}
.pd-price strong {
  margin-left: 5px;
  color: #2c86ff;
  font-size: 20px;
  line-height: 1.2;
}
.pd-summary {
  width: min(calc(100% - 11px), 620px);
  margin: 17px auto 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.pd-summary__card {
  position: relative;
  height: 132px;
  padding: 16px 17px;
  overflow: hidden;
  border: 1px solid #1e2d49;
  border-radius: 7px;
  background: #091225;
  text-align: left;
}
.pd-summary__heading {
  min-height: 44px;
  display: grid;
  grid-template-columns: 40px 1fr;
  align-items: center;
  gap: 13px;
}
.pd-summary__heading img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.pd-summary__heading b {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2;
}
.pd-summary__card > strong {
  position: relative;
  z-index: 1;
  display: block;
  max-width: 100%;
  margin-top: 15px;
  overflow: hidden;
  color: #2c7eff;
  font-size: 21px;
  font-weight: 700;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pd-summary__card > small {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 6px;
  color: #909bad;
  font-size: 11px;
}
.pd-summary__decoration {
  position: absolute;
  right: -2px;
  bottom: -15px;
  width: 55px;
  height: 72px;
  object-fit: contain;
  pointer-events: none;
}
.pd-meta {
  width: min(calc(100% - 11px), 620px);
  margin: 16px auto 0;
  padding: 0 17px;
  border: 1px solid #1e2d49;
  border-radius: 7px;
  background: #091225;
}
.pd-meta > div {
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  border-bottom: 1px solid #1c273b;
  text-align: left;
}
.pd-meta > div:last-child {
  border-bottom: 0;
}
.pd-meta span {
  color: #929bad;
  font-size: 14px;
}
.pd-meta b {
  min-width: 0;
  overflow-wrap: anywhere;
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  text-align: right;
}
.pd-submit {
  width: min(calc(100% - 11px), 620px);
  height: 60px;
  margin: 16px auto 0;
  display: block;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(100deg, #08baff, #0878ff 48%, #4e22cf);
  color: #fff;
  font-size: 20px;
  font-weight: 700;
}
.pd-submit:disabled {
  opacity: 0.58;
}

@media (min-width: 760px) {
  .pd-main {
    max-width: 620px;
    padding-top: 28px;
  }
  .pd-main h2 {
    max-width: 560px;
  }
  .pd-summary,
  .pd-meta,
  .pd-submit {
    width: 100%;
    max-width: 620px;
  }
}

@media (max-width: 360px) {
  .pd-summary {
    gap: 10px;
  }
  .pd-summary__card {
    padding-inline: 13px;
  }
  .pd-summary__heading {
    grid-template-columns: 36px 1fr;
    gap: 9px;
  }
  .pd-summary__heading img {
    width: 36px;
    height: 36px;
  }
  .pd-summary__card > strong {
    font-size: 19px;
  }
}
</style>
