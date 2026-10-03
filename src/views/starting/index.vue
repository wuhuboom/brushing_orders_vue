<template>
  <main class="das-page started-page started-page--cards">
    <div class="work-page-content">
      <div class="work-hero">
        <HeaderTop />
        <section class="work-balance">
          <h1>{{ $t("das.deposit.totalBalance") }}</h1>
          <strong>
            {{ money(userInfo.totalBalance ?? userInfo.balance, "0.00") }} USD
          </strong>
          <p>{{ $t("das.started.balanceHint") }}</p>
        </section>
      </div>
      <div class="work-panel">
        <TaskShowcase tiles framed />
        <section class="work-summary">
          <div class="work-summary__figures">
            <div class="work-amount-card">
              <h2>{{ $t("das.started.todayMargin") }}</h2>
              <strong>{{ money(userInfo.commission, "0.00") }} USD</strong>
              <p>{{ $t("das.started.commissionResetHint") }}</p>
            </div>
            <div class="work-amount-card">
              <h2>{{ $t("das.started.pendingAmount") }}</h2>
              <strong>{{ money(userInfo.balance, "0.00") }} USD</strong>
            </div>
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
      <section class="work-history">
        <button
          class="work-history__link"
          type="button"
          @click="safePush(router, '/records')"
        >
          <span class="work-history__arrow" aria-hidden="true"></span>
          {{ $t("das.withdraw.history") }}
        </button>
        <button
          class="work-history__support"
          type="button"
          :aria-label="$t('das.nav.contact')"
          @click="safePush(router, '/contact')"
        >
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <defs>
              <linearGradient id="work-support-gradient" x2="0" y2="1">
                <stop stop-color="#ffbf62" />
                <stop offset="1" stop-color="#ff833d" />
              </linearGradient>
            </defs>
            <path
              d="M7 27v-5a17 17 0 0 1 34 0v5"
              fill="none"
              stroke="#ffac50"
              stroke-width="3"
            />
            <rect x="3" y="22" width="7" height="14" rx="3.5" fill="#ffac50" />
            <rect x="38" y="22" width="7" height="14" rx="3.5" fill="#ffac50" />
            <circle cx="24" cy="26" r="15" fill="url(#work-support-gradient)" />
            <g fill="white">
              <circle cx="16" cy="26" r="2.4" />
              <circle cx="24" cy="26" r="2.4" />
              <circle cx="32" cy="26" r="2.4" />
            </g>
          </svg>
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
import HeaderTop from "@/components/HeaderTop.vue";
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
#app .started-page--cards {
  --work-gutter: clamp(16px, 4.1vw, 40px);
  background: #000;
  color: #111;
}
.work-page-content {
  width: 100%;
  max-width: none;
  margin: 0;
  background: linear-gradient(90deg, #3f42ff, #7926e7 48%, #ff00ab);
}
.work-hero {
  padding: 0 var(--work-gutter);
  color: #fff;
}
#app .work-hero :deep(.das-header) {
  width: 100%;
  height: auto;
  min-height: 72px;
  padding: 20px 0 16px;
  background: transparent;
}
#app .work-hero :deep(.das-brand) {
  width: clamp(153px, 40.8vw, 280px);
  height: auto;
  aspect-ratio: 153 / 42;
}
#app .work-hero :deep(.das-header__actions) {
  display: none;
}
.work-balance {
  padding: 0 0 12px;
}
.work-balance h1 {
  margin: 0;
  color: #fff;
  font-size: clamp(13px, 3.47vw, 24px);
  font-weight: 400;
  line-height: 1.45;
}
.work-balance strong {
  display: block;
  margin-top: 3px;
  color: #fff;
  font-size: clamp(20px, 5.33vw, 36px);
  font-weight: 750;
  line-height: 1.25;
  overflow-wrap: anywhere;
}
.work-balance p {
  margin: 3px 0 0;
  color: #fff;
  font-size: clamp(13px, 3.47vw, 22px);
  line-height: 1.4;
}
.work-panel {
  padding: 0 var(--work-gutter) 24px;
}
.work-summary {
  display: grid;
  grid-template-columns: minmax(0, 1.16fr) minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  margin-top: 7px;
}
.work-summary__figures {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 7px;
}
.work-amount-card {
  padding: 11px 13px 13px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 4px #28125024;
}
.work-amount-card h2,
.work-amount-card strong {
  display: block;
  margin: 0;
  font-weight: 750;
  line-height: 1.25;
  overflow-wrap: anywhere;
}
.work-amount-card h2 {
  color: #080808;
  font-size: clamp(16px, 4.27vw, 30px);
  letter-spacing: 0.3px;
}
.work-amount-card strong {
  margin-top: 4px;
  color: #f51988;
  font-size: clamp(20px, 5.33vw, 36px);
}
.work-amount-card p {
  margin: 5px 0 0;
  color: #111;
  font-size: clamp(10.5px, 2.8vw, 18px);
  line-height: 1.25;
}
.work-start {
  position: relative;
  width: calc(100% + 24px);
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
  font-size: clamp(16px, 4.8vw, 30px);
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
  outline: 2px solid #fff;
  outline-offset: -18px;
  border-radius: 50%;
}
.work-history {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 76px;
  padding: 16px calc(var(--work-gutter) + 13px);
  background: #000;
}
.work-history__link {
  display: grid;
  justify-items: center;
  gap: 7px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: clamp(17px, 4.53vw, 28px);
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
}
.work-history__arrow {
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  border-bottom: 11px solid #ff9417;
}
.work-history__support {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  padding: 8px;
  border: 0;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
}
.work-history__support svg {
  width: 100%;
  height: 100%;
}
#app .started-page--cards :deep(.das-footer-space) {
  background: #000;
}
@media (min-width: 768px) {
  .work-panel {
    padding-bottom: 40px;
  }
  .work-balance {
    padding-bottom: 24px;
  }
  .work-summary {
    gap: 20px;
    margin-top: 16px;
  }
  .work-summary__figures {
    gap: 16px;
  }
  .work-amount-card {
    padding: 24px 28px;
    border-radius: 18px;
  }
  .work-history {
    min-height: 112px;
    padding-top: 24px;
    padding-bottom: 24px;
  }
  .work-history__support {
    width: 56px;
    height: 56px;
    padding: 10px;
  }
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
