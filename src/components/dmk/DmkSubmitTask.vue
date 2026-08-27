<template>
  <van-popup
    v-model:show="popupVisible"
    class="dmk-submit-task-popup"
    position="bottom"
    closeable
    teleport="body"
    :z-index="3000"
    :close-on-click-overlay="true"
    :lock-scroll="true"
  >
    <div class="dmk-submit-task-shell">
      <div class="dmk-submit-task-desktop">
        <div class="dmk-product-breadcrumb">
          <span>{{ $t("das.dmk.inventory") }}</span><b>›</b><span>{{ $t("das.dmk.products") }}</span><b>›</b><strong>{{ $t("das.dmk.submission") }}</strong>
        </div>
        <h1>{{ $t("das.dmk.productDetailsSubmission") }}</h1>

        <div class="dmk-product-layout">
          <div class="dmk-product-visual">
            <van-image
              v-if="hasCover"
              width="100%"
              height="100%"
              fit="cover"
              :src="imageUrl(order.coverUrl)"
              :alt="order.goodsName || ''"
            />
            <div class="dmk-product-rating">
              <VanRate
                v-model="rating"
                :size="22"
                color="#caff19"
                void-icon="star"
                void-color="#777b72"
                :gutter="2"
                readonly
              />
              <span>{{ rating.toFixed(1) }}/5.0</span>
              <small>({{ reviewCount }} {{ $t("das.started.reviews") }})</small>
            </div>
          </div>

          <div class="dmk-product-details">
            <section>
              <h2>{{ $t("das.dmk.investmentParameters") }}</h2>
              <div class="dmk-product-parameters">
                <div><span>{{ $t("das.dmk.totalAmount") }}</span><strong>{{ totalAmount }} {{ $t("das.dmk.currencyUsd") }}</strong></div>
                <div><span>{{ $t("das.dmk.totalCommission") }}</span><strong>{{ profit }} {{ $t("das.dmk.currencyUsd") }}</strong></div>
              </div>
            </section>
            <section>
              <h2>{{ $t("das.dmk.orderDetails") }}</h2>
              <dl>
                <div><dt>{{ $t("das.dmk.creationTime") }}</dt><dd>{{ formattedCreateTime }}</dd></div>
                <div><dt>{{ $t("das.dmk.orderNo") }}</dt><dd><span>{{ order.orderNo || order.id || "—" }}</span></dd></div>
              </dl>
            </section>
          </div>
        </div>

        <div class="dmk-product-submit-row">
          <div>
            <h2>{{ order.goodsName || "—" }}</h2>
            <p><span>{{ $t("das.dmk.price") }}:</span> {{ totalAmount }} <small>{{ $t("das.dmk.currencyUsd") }}</small></p>
          </div>
          <button
            type="button"
            :disabled="!canSubmit || submitting"
            @click="submitForm"
          >
            {{ $t("das.dmk.submitOrder") }} <span>→</span>
          </button>
        </div>
      </div>

      <div class="dmk-submit-task-mobile">
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
            <p class="dmk-submit-task-name">{{ order.goodsName || "—" }}</p>
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
            <span>{{ $t("das.dmk.createdAt") }}</span><strong>{{ formattedCreateTime }}</strong>
          </div>
          <div class="dmk-submit-task-row">
            <span>{{ $t("das.dmk.taskCode") }}</span>
            <strong class="dmk-submit-task-code">{{ order.orderNo || order.id || "—" }}</strong>
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
            :disabled="!canSubmit || submitting"
            @click="submitForm"
          >
            <span>{{ $t("das.common.submit") }}</span>
          </van-button>
        </div>
      </div>

      <div
        v-if="submitting"
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
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Rate as VanRate, showSuccessToast, showToast } from "vant";
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
let submitDelayTimer;

const popupVisible = computed({
  get: () => props.show,
  set: (value) => {
    if (!submitting.value) emit("update:show", value);
  },
});

watch(
  () => props.show,
  (show) => {
    if (show) rating.value = 5;
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
const reviewCount = computed(() =>
  Number(
    props.order.reviewCount ??
      props.order.reviews ??
      props.order.commentCount ??
      0,
  ).toLocaleString("en-US"),
);
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

<style scoped>
.dmk-submit-task-shell {
  position: relative;
  width: 100%;
  color: #fff;
}
.dmk-submit-task-desktop {
  display: none;
}
.dmk-submit-task-mobile {
  display: block;
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

@media (min-width: 1024px) {
  .dmk-submit-task-popup.van-popup--bottom {
    inset: auto auto 0 50% !important;
    width: min(1360px, calc(100vw - 96px));
    height: auto;
    max-height: none;
    margin: 0;
    overflow: visible !important;
    overflow-y: visible !important;
    translate: -50% 0;
    background: #111413;
    border-top: 1px solid rgba(218, 255, 69, 0.25);
  }

  .dmk-submit-task-popup .van-popup__close-icon {
    position: absolute;
    z-index: 30;
    top: 14px;
    right: 16px;
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border: 1px solid #3b3f3d;
    border-radius: 50%;
    color: #fff;
    background: rgba(18, 21, 20, 0.85);
    font-size: 21px;
  }

  .dmk-submit-task-mobile {
    display: none !important;
  }

  .dmk-submit-task-desktop {
    box-sizing: border-box;
    width: 100%;
    min-height: 0;
    padding: 24px 28px 22px;
    display: block !important;
    color: #f8f9f8;
    background:
      radial-gradient(circle at 25% 34%, rgba(170, 255, 48, 0.035), transparent 29%),
      #111413;
  }

  .dmk-product-breadcrumb {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #c7c9b6;
    font-family: "JetBrains Mono", "Courier New", monospace;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
  }

  .dmk-product-breadcrumb b {
    color: #bfc3af;
    font-size: 1.4em;
    font-weight: 400;
  }

  .dmk-product-breadcrumb strong {
    color: #caff19;
    font-weight: 700;
  }

  .dmk-submit-task-desktop > h1 {
    margin: 8px 0 18px;
    font-size: 34px;
    font-weight: 650;
    line-height: 1.04;
    letter-spacing: -0.04em;
  }

  .dmk-product-layout {
    display: grid;
    grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
    gap: 18px;
    align-items: stretch;
  }

  .dmk-product-visual {
    position: relative;
    min-height: 355px;
    overflow: hidden;
    border: 1px solid #3b3f3d;
    border-radius: 16px;
    background:
      linear-gradient(90deg, transparent 48%, rgba(218, 255, 69, 0.08) 50%, transparent 52%),
      #090d0b;
  }

  .dmk-product-visual::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(180deg, transparent 68%, rgba(0, 0, 0, 0.72));
  }

  .dmk-product-visual .van-image,
  .dmk-product-visual .van-image__img {
    display: block;
  }

  .dmk-product-rating {
    position: absolute;
    z-index: 2;
    left: 18px;
    bottom: 14px;
    min-height: 40px;
    padding: 0 13px;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid rgba(218, 255, 69, 0.28);
    border-radius: 999px;
    color: #fff;
    background: rgba(26, 29, 27, 0.9);
    backdrop-filter: blur(8px);
    font-family: "JetBrains Mono", "Courier New", monospace;
    font-size: 13px;
  }

  .dmk-product-rating small {
    color: #c7c9b6;
    font-size: 11px;
  }

  .dmk-product-details {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 14px;
  }

  .dmk-product-details section {
    padding: 20px;
    border: 1px solid #3b3f3d;
    border-radius: 16px;
    background: #1a1d1c;
  }

  .dmk-product-details h2 {
    margin: 0;
    padding-bottom: 13px;
    border-bottom: 1px solid #3a3d3b;
    font-size: 22px;
    font-weight: 600;
  }

  .dmk-product-parameters {
    margin-top: 14px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .dmk-product-parameters > div {
    min-height: 74px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid #3a3d3b;
    border-radius: 12px;
    background: #101312;
  }

  .dmk-product-parameters span,
  .dmk-product-details dt {
    color: #c9ccb7;
    font-family: "JetBrains Mono", "Courier New", monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .dmk-product-parameters strong {
    margin-top: 8px;
    font-size: clamp(16px, 1.35vw, 22px);
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
  }

  .dmk-product-details dl {
    margin: 12px 0 0;
  }

  .dmk-product-details dl > div {
    min-height: 50px;
    display: grid;
    grid-template-columns: 0.45fr 1fr;
    align-items: center;
    gap: 20px;
    border-bottom: 1px solid #303331;
  }

  .dmk-product-details dd {
    margin: 0;
    color: #fff;
    font-size: 14px;
    text-align: right;
    overflow-wrap: anywhere;
  }

  .dmk-product-details dd span {
    padding: 6px 9px;
    border-radius: 8px;
    background: #3a3d3b;
    font-family: "JetBrains Mono", "Courier New", monospace;
    font-size: 0.82em;
    letter-spacing: 0.04em;
  }

  .dmk-product-submit-row {
    margin-top: 17px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
  }

  .dmk-product-submit-row h2 {
    max-width: 1160px;
    margin: 0;
    font-size: 24px;
    font-weight: 500;
    line-height: 1.12;
  }

  .dmk-product-submit-row p {
    margin: 8px 0 0;
    color: #caff19;
    font-family: "JetBrains Mono", "Courier New", monospace;
    font-size: 23px;
    font-weight: 700;
  }

  .dmk-product-submit-row p span,
  .dmk-product-submit-row p small {
    color: #c9ccb7;
    font-size: 0.38em;
    font-weight: 600;
    letter-spacing: 0.08em;
  }

  .dmk-product-submit-row button {
    min-width: 280px;
    min-height: 62px;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    border: 0;
    border-radius: 999px;
    color: #030400;
    background: #caff19;
    box-shadow: 0 18px 44px rgba(202, 255, 25, 0.17);
    font-size: 19px;
    font-weight: 700;
  }

  .dmk-product-submit-row button span {
    font-size: 1.28em;
    font-weight: 400;
  }

  .dmk-product-submit-row button:disabled {
    cursor: not-allowed;
    filter: grayscale(0.65);
    opacity: 0.5;
  }

  .dmk-submit-task-loading {
    position: absolute;
  }
}

@media (min-width: 1024px) and (max-width: 1350px) {
  .dmk-product-layout {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  }
  .dmk-product-submit-row button {
    min-width: 230px;
    min-height: 58px;
    padding: 0 28px;
  }
}
</style>
