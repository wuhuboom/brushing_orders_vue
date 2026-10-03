<template>
  <main class="das-page started-page">
    <div class="work-page-content">
      <section class="work-balance">
        <h1>{{ $t("das.deposit.totalBalance") }}</h1>
        <strong
          >{{
            money(userInfo.totalBalance ?? userInfo.balance, "0.00")
          }}
          USD</strong
        >
        <p>{{ $t("das.started.balanceHint") }}</p>
      </section>
      <TaskShowcase />
      <section class="work-summary">
        <div class="work-summary__figures">
          <h2>{{ $t("das.started.todayMargin") }}</h2>
          <strong>{{ money(userInfo.commission, "0.00") }} USD</strong>
          <p>{{ $t("das.started.marginHint") }}</p>
          <h2 class="work-summary__pending">{{ $t("das.profile.frozen") }}</h2>
          <strong>{{ money(userInfo.frozenBalance, "0.00") }} USD</strong>
        </div>
        <button
          class="work-start"
          type="button"
          :disabled="creatingOrder"
          :aria-label="$t('das.started.startNow')"
          :aria-busy="creatingOrder"
          @click="handleClick"
        >
          <img :src="startButton" alt="" />
          <span class="work-start__count"
            >({{ userInfo.dealCount || 0 }}/{{ orderCount || 0 }})</span
          >
        </button>
      </section>
    </div>
    <BonusDialog
      :show="bonusVisible"
      :amount="bonusAmount"
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
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { closeToast, showLoadingToast, showToast } from "vant";
import { createOrder, getTradeConfig, userGetInfo } from "@/api/apis";
import Footer from "@/components/Footer.vue";
import BonusDialog from "@/components/BonusDialog.vue";
import { safePush } from "@/utils/navigation";
import { getOrderErrorMessage } from "@/utils/orderCreate";

import startButton from "@/static/amplava/task-start-button.png";

import TaskShowcase from "@/components/TaskShowcase.vue";
const router = useRouter();
const brandIcon = import.meta.env.BASE_URL + "amplava-icon.svg";
const { t } = useI18n();
const userInfo = ref({});
const tradeInfo = ref({});
const orderCount = ref(40);
const bonusVisible = ref(false);
const bonusAmount = ref("");
const creatingOrder = ref(false);
const startAnimationVisible = ref(false);
let startDelayTimer;
let tradeConfigRequest;
let pageAlive = false;

const money = (value, fallback) =>
  value === undefined || value === null || value === ""
    ? fallback
    : Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

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
      bonusAmount.value = res.data?.amount ?? "";
      bonusVisible.value = true;
      return;
    }
    const order = res.data || {};
    showToast(t("das.started.created"));
    openOrderDetails(order);
  } catch (error) {
    closeToast();
    if (Number(error?.code) === 2000) {
      bonusAmount.value = error?.data?.amount ?? "";
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
  clearTimeout(startDelayTimer);
});
</script>

<style scoped>
#app .started-page {
  background: #fff;
  color: #111;
}
.work-page-content {
  width: 100%;
  max-width: none;
  margin: 0;
  padding-bottom: 24px;
}
.work-balance {
  padding: 6px 16px 0;
}
.work-balance h1,
.work-summary h2,
.work-balance strong,
.work-summary strong {
  display: block;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.work-balance p,
.work-summary p {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}
.work-summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: 0;
  padding: 0 16px;
}
.work-summary__figures {
  position: relative;
  z-index: 1;
}
.work-summary .work-summary__pending {
  margin-top: 16px;
}
.work-start {
  position: relative;
  width: calc(100% + 32px);
  aspect-ratio: 1;
  justify-self: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.work-start img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.work-start__count {
  position: absolute;
  top: 57%;
  left: 26%;
  width: 49%;
  color: #fff;
  font-size: clamp(16px, 4.8vw, 24px);
  line-height: 1.4;
  font-weight: 650;
  text-align: center;
  text-shadow: 0 1px 5px #392478;
}
.work-start:active {
  transform: scale(0.97);
}
.work-start:disabled {
  cursor: wait;
  opacity: 0.65;
}
.work-start:focus-visible {
  outline: 2px solid #7926e7;
  outline-offset: -18px;
  border-radius: 50%;
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
</style>
