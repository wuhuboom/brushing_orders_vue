<template>
  <main class="das-page started-page">
    <div class="started-bg">
      <HeaderTop />
      <section class="started-user">
        <div>
          <span>{{ $t("das.profile.hello") }},</span>
          <strong>{{ userInfo.username || "—" }}</strong>
        </div>
      </section>

      <ProductDrawGrid
        :products="goodsList"
        :selected-index="current"
        @select="current = $event"
      />

      <section class="product-copy">
        <h1>{{ currentProduct.goodsName || $t("das.page.productDetails") }}</h1>
        <p class="product-rating">
          <img src="@/static/das/icons/rating-star.png" alt="" />
          {{ ratingText(currentProduct.rating) }}
        </p>
        <h2>
          {{ $t("das.started.price") }}:
          <strong>{{ money(currentProduct.price, "0.00") }} USD</strong>
        </h2>
        <button type="button" :disabled="creatingOrder" @click="handleClick">
          {{ $t("das.started.startNow") }} ({{ userInfo.dealCount || 0 }}/{{
            orderCount || 0
          }})
        </button>
      </section>

      <section class="margin-card">
        <div class="margin-card__main-icon">
          <DasIcon name="retention" />
        </div>
        <h2>{{ $t("das.started.todayMargin") }}</h2>
        <strong>{{ money(userInfo.commission, "0.00") }} USD</strong>
        <p>{{ $t("das.started.marginHint") }}</p>
        <div class="balance-grid">
          <div>
            <DasIcon name="wallet" />
            <b>{{ $t("das.profile.balance") }}</b>
            <span>{{ money(userInfo.balance, "0.00") }} USD</span>
            <small>{{ $t("das.started.balanceHint") }}</small>
          </div>
          <div>
            <DasIcon name="retention1" />
            <b>{{ $t("das.profile.frozen") }}</b>
            <span>{{ money(userInfo.frozenBalance, "0.00") }} USD</span>
            <small>{{ $t("das.started.frozenHint") }}</small>
          </div>
        </div>
      </section>

      <section class="notice-card">
        <h2>{{ $t("das.started.notice") }}</h2>
        <p>{{ noticeText }}</p>
      </section>
      <p class="das-copyright">{{ $t("das.common.copyright") }}</p>
    </div>
    <BonusDialog
      :show="bonusVisible"
      @close="closeBonus"
      @contact="openBonusContact"
    />
    <van-dialog
      :show="startAnimationVisible"
      class="start-loading-dialog amplava-start-loading"
      :show-confirm-button="false"
      :close-on-click-overlay="false"
    >
      <div
        class="start-loading-animation"
        role="status"
        :aria-label="$t('das.common.loading')"
      >
        <div class="start-loading-emblem" aria-hidden="true">
          <span class="start-loading-ring"></span>
          <span class="start-loading-ring start-loading-ring--inner"></span>
          <img :src="brandIcon" alt="" />
        </div>
        <p>{{ $t("das.common.loading") }}</p>
        <span class="start-loading-track" aria-hidden="true"><i></i></span>
      </div>
    </van-dialog>
    <Footer name="/starting" />
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { closeToast, showLoadingToast, showToast } from "vant";
import {
  createOrder,
  getGoodsList,
  getTradeConfig,
  userGetInfo,
} from "@/api/apis";
import HeaderTop from "@/components/HeaderTop.vue";
import Footer from "@/components/Footer.vue";
import DasIcon from "@/components/DasIcon.vue";
import ProductDrawGrid from "@/components/ProductDrawGrid.vue";
import BonusDialog from "@/components/BonusDialog.vue";
import { safePush } from "@/utils/navigation";
import { getOrderErrorMessage } from "@/utils/orderCreate";

const router = useRouter();
const brandIcon = import.meta.env.BASE_URL + "amplava-icon.svg";
const { t } = useI18n();
const userInfo = ref({});
const tradeInfo = ref({});
const goodsList = ref([]);
const orderCount = ref(40);
const current = ref(0);
const bonusVisible = ref(false);
const creatingOrder = ref(false);
const startAnimationVisible = ref(false);
let refreshTimer;
let startDelayTimer;
let tradeConfigRequest;
let pageAlive = false;

const currentProduct = computed(
  () => goodsList.value[current.value] || goodsList.value[0] || {},
);

const money = (value, fallback) =>
  value === undefined || value === null || value === ""
    ? fallback
    : Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

const ratingText = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return number.toLocaleString(undefined, { maximumFractionDigits: 1 });
};

const formatClock = (value) => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "number" || /^\d{10,13}$/.test(String(value))) {
    const raw = Number(value);
    const date = new Date(String(value).length === 10 ? raw * 1000 : raw);
    if (!Number.isNaN(date.getTime())) {
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }
  }
  const text = String(value).trim();
  const clock = text.match(/(?:^|T|\s)(\d{1,2}):(\d{2})/);
  if (clock) return `${clock[1].padStart(2, "0")}:${clock[2]}`;
  if (/^\d{1,2}$/.test(text)) return `${text.padStart(2, "0")}:00`;
  return text;
};

const tradeStart = computed(() =>
  formatClock(
    tradeInfo.value.workTimeStart ??
      tradeInfo.value.serviceTimeRange?.[0] ??
      tradeInfo.value.workStartTime ??
      tradeInfo.value.businessStartTime ??
      tradeInfo.value.serviceStartTime ??
      tradeInfo.value.startTime ??
      tradeInfo.value.start,
  ),
);
const tradeEnd = computed(() =>
  formatClock(
    tradeInfo.value.workTimeEnd ??
      tradeInfo.value.serviceTimeRange?.[1] ??
      tradeInfo.value.workEndTime ??
      tradeInfo.value.businessEndTime ??
      tradeInfo.value.serviceEndTime ??
      tradeInfo.value.endTime ??
      tradeInfo.value.end,
  ),
);
const noticeText = computed(() =>
  tradeStart.value && tradeEnd.value
    ? t("das.started.noticeWithHours", {
        start: tradeStart.value,
        end: tradeEnd.value,
      })
    : t("das.started.noticeText"),
);

const delayMs = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

const waitForStartDelay = () =>
  new Promise((resolve) => {
    const timeout = delayMs(tradeInfo.value.startTaskDelayMs);
    if (!timeout) {
      resolve();
      return;
    }
    startDelayTimer = setTimeout(resolve, timeout);
  });

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

const getList = async () => {
  try {
    const res = await getGoodsList();
    if (!pageAlive) return;
    const nextGoods = Array.isArray(res.data) ? res.data : [];
    const signature = (list) =>
      JSON.stringify(
        list.map((item) => [
          item.id ?? item.orderNo,
          item.coverUrl,
          item.goodsName,
          item.price,
          item.rating,
        ]),
      );
    if (signature(nextGoods) !== signature(goodsList.value)) {
      const previousId =
        currentProduct.value.id ?? currentProduct.value.orderNo;
      goodsList.value = nextGoods;
      const preservedIndex = nextGoods.findIndex(
        (item) => String(item.id ?? item.orderNo) === String(previousId),
      );
      current.value =
        preservedIndex >= 0
          ? preservedIndex
          : Math.min(2, Math.max(0, nextGoods.length - 1));
    }
  } catch (_) {
  } finally {
    if (pageAlive) refreshTimer = setTimeout(getList, 10000);
  }
};

const openOrderDetails = (order) => {
  if (!order?.id) return;
  try {
    sessionStorage.setItem(`dasOrder:${order.id}`, JSON.stringify(order));
  } catch (_) {}
  safePush(router, { path: "/productInfo", query: { id: order.id } });
};

const closeBonus = () => {
  bonusVisible.value = false;
};

const openBonusContact = () => {
  closeBonus();
  safePush(router, "/contact");
};

const handleClick = async () => {
  if (creatingOrder.value) return;
  creatingOrder.value = true;
  startAnimationVisible.value = true;
  try {
    await loadTradeConfig();
    await waitForStartDelay();
    if (!pageAlive) return;
    startAnimationVisible.value = false;
    showLoadingToast({
      message: t("das.started.creating"),
      forbidClick: true,
      duration: 0,
    });
    const res = await createOrder();
    closeToast();
    if (res.resultType === "BONUS") {
      bonusVisible.value = true;
      return;
    }
    const order = res.data || {};
    showToast(t("das.started.created"));
    openOrderDetails(order);
  } catch (error) {
    closeToast();
    if (Number(error?.code) === 2000) {
      bonusVisible.value = true;
      return;
    }
    if (Number(error?.code) === 907 && error?.data?.id) {
      openOrderDetails(error.data);
      return;
    }
    showToast(getOrderErrorMessage(t, error, "das.started.unableCreate"));
  } finally {
    startAnimationVisible.value = false;
    creatingOrder.value = false;
  }
};

onMounted(async () => {
  pageAlive = true;
  getList();
  const [userResult, tradeResult] = await Promise.allSettled([
    userGetInfo(),
    loadTradeConfig(),
  ]);
  if (!pageAlive) return;
  if (userResult.status === "fulfilled") {
    userInfo.value = userResult.value.data || {};
    orderCount.value = userResult.value.data?.userLevel?.orderCount || 40;
  }
  if (tradeResult.status === "fulfilled") {
    tradeInfo.value = tradeResult.value?.data || tradeInfo.value;
  }
});

onUnmounted(() => {
  pageAlive = false;
  clearTimeout(refreshTimer);
  clearTimeout(startDelayTimer);
});
</script>

<style scoped>
.started-page {
  background: #ecf3e8;
  color: #17382d;
}
.started-bg {
  background: url("@/static/das/bg-get-started.png") top center/100% auto
    no-repeat;
  padding-bottom: 28px;
}
.started-user {
  min-height: 106px;
  box-sizing: border-box;
  padding: 39px 20px 20px;
  display: grid;
  grid-template-columns: 48px 1fr auto 25px;
  align-items: center;
  color: #f7f5ec;
}
.started-user div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.started-user span {
  opacity: 0.65;
  font-size: 13px;
}
.started-user strong {
  font-size: 17px;
}
.product-copy {
  padding: 18px 27px 0;
  text-align: center;
}
.product-copy h1 {
  margin: 0;
  font-size: 17px;
}
.product-rating {
  margin: 8px 0;
  color: #727b75;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-rating img {
  width: 14px;
  height: 14px;
  margin-right: 5px;
  object-fit: contain;
  vertical-align: -2px;
}
.product-copy h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
}
.product-copy button {
  width: 100%;
  height: 55px;
  margin-top: 20px;
  border: 3px solid transparent;
  border-radius: 999px;
  background:
    linear-gradient(#14392c, #14392c) padding-box,
    linear-gradient(90deg, #ef9382, #dfb34a, #277b68) border-box;
  color: white;
  font-size: 17px;
  font-weight: 800;
  box-shadow: 0 13px 20px rgba(20, 57, 44, 0.2);
}
.product-copy button:disabled {
  opacity: 0.65;
}
:deep(.van-dialog.amplava-start-loading) {
  width: min(76vw, 280px);
  overflow: hidden;
  border: 1px solid #ffffffb3;
  border-radius: 24px !important;
  background: #fff;
  box-shadow: 0 20px 64px #34196933;
}
.start-loading-animation {
  display: grid;
  justify-items: center;
  gap: 22px;
  padding: 34px 28px 30px;
  background:
    radial-gradient(ellipse at 10% 0%, #ebe8ff 0%, transparent 60%),
    radial-gradient(ellipse at 100% 100%, #ffe8f8 0%, transparent 55%), #fff;
}
.start-loading-emblem {
  position: relative;
  display: grid;
  place-items: center;
  width: 116px;
  height: 116px;
}
.start-loading-emblem::before {
  content: "";
  position: absolute;
  inset: 18px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 8px 22px #6751ed24;
}
.start-loading-emblem img {
  position: relative;
  display: block;
  width: 58px;
  height: 58px;
}
.start-loading-ring {
  position: absolute;
  inset: 0;
  border: 3px solid #7360ff16;
  border-top-color: #6247ff;
  border-right-color: #fa00b3;
  border-radius: 50%;
  animation: start-loading-orbit 1.6s linear infinite;
}
.start-loading-ring::after {
  content: "";
  position: absolute;
  top: 13px;
  right: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff0ca9;
  box-shadow: 0 0 12px #ff0ca966;
}
.start-loading-ring--inner {
  inset: 10px;
  border-width: 1px;
  border-top-color: #44c9f6;
  border-right-color: transparent;
  animation-direction: reverse;
  animation-duration: 2.4s;
}
.start-loading-ring--inner::after {
  display: none;
}
.start-loading-animation p {
  margin: 0;
  color: #293554;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.2px;
}
.start-loading-track {
  display: block;
  width: 112px;
  height: 4px;
  overflow: hidden;
  border-radius: 8px;
  background: #eae6f7;
}
.start-loading-track i {
  display: block;
  width: 48px;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #5943ff, #fa00b3);
  animation: start-loading-flow 1.5s ease-in-out infinite;
}
@keyframes start-loading-orbit {
  to {
    transform: rotate(360deg);
  }
}
@keyframes start-loading-flow {
  0% {
    transform: translateX(-48px);
  }
  100% {
    transform: translateX(112px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .start-loading-ring,
  .start-loading-track i {
    animation: none;
  }
  .start-loading-track i {
    margin: auto;
  }
}
.margin-card,
.notice-card {
  margin: 22px 24px 0;
  padding: 28px 22px 24px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.92);
  text-align: center;
}
.margin-card__main-icon {
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.margin-card__main-icon :deep(.das-icon) {
  width: 29px;
  height: 29px;
}
.margin-card h2 {
  margin: 13px 0 11px;
  font-size: 17px;
}
.margin-card > strong {
  font-size: 24px;
  font-weight: 400;
}
.margin-card > p {
  margin: 17px 0 14px;
  color: #8b918c;
  font-size: 12px;
  line-height: 1.4;
}
.balance-grid {
  padding-top: 21px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid #e3e5df;
}
.balance-grid > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  padding: 0 11px;
}
.balance-grid b {
  font-size: 13px;
}
.balance-grid span {
  font-size: 15px;
}
.balance-grid small {
  color: #8f9490;
  font-size: 10px;
  line-height: 1.3;
}
.notice-card {
  padding: 24px 28px;
}
.notice-card h2 {
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 800;
}
.notice-card p {
  margin: 0;
  color: #858b86;
  font-size: 12px;
  line-height: 1.55;
}
.das-copyright {
  margin: 24px 0 0;
  color: #98a29a;
  font-size: 9px;
  text-align: center;
}
</style>
