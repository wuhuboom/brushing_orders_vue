<template>
  <main class="das-page started-page starting-page">
    <HeaderTop />
    <h1 class="wester-start-title">{{ $t('das.design.start') }}</h1>
    <div class="wm-page-scroll">
      <div class="starting-top-strip" aria-hidden="true"></div>
      <div class="starting-main">
        <div class="poetic-task-heading">
          <h1><i></i>{{ $t("das.started.dailyProfitHint") }}</h1>
          <button
            class="psy-start-history"
            type="button"
            @click="safePush(router, '/records')"
          >
            <img src="/westermedia/order-clock.png" alt="" /><span>{{
              $t("das.page.records")
            }}</span
            ><img
              class="starting-records-arrow"
              src="/westermedia/chevron.png"
              alt=""
            />
          </button>
        </div>
        <section class="poetic-task-balance">
          <section class="starting-user">
            <div class="starting-user__name">
              <b class="wester-vault-heading"><img src="/westermedia/vault.png" alt="" />{{ $t('das.design.assetVault') }}</b>
              <span>{{ $t("das.profile.hello") }},</span
              ><strong>{{ userInfo.username || "—" }}</strong>
            </div>
            <div class="starting-user__vip">
              <strong>VIP{{ currentLevel }}</strong
              ><span
                v-if="userInfoLoading"
                class="started-design-user__level-skeleton"
                aria-hidden="true"
              ></span
              ><img
                v-else-if="levelIcon"
                :src="levelIcon"
                alt=""
                @error="levelIconFailed = true"
              />
            </div>
          </section>

          <section class="psy-start-balance">
            <img src="/westermedia/vault.png" alt="" />
            <h3>{{ $t('das.design.totalAvailableBalance') }}</h3>
            <strong
              >{{ money(userInfo.balance, "0.00") }} <small>USD</small></strong
            >
            <p>{{ $t("das.started.balanceHint") }}</p>
          </section>
          <div class="psy-start-dashboard">
            <section class="starting-summary">
              <img
                class="starting-summary__rocket"
                src="/westermedia/growth.png"
                alt=""
              />
              <div class="psy-start-commission">
                <h2>{{ $t("das.records.commission") }}</h2>
                <strong class="starting-summary__commission"
                  >{{ money(userInfo.commission, "0.00") }}
                  <small>USD</small></strong
                >
                <p>{{ $t("das.started.dailyProfitHint") }}</p>
              </div>
              <div class="starting-summary__divider"></div>
              <div class="starting-summary__grid">
                <article>
                  <img src="/westermedia/lock.png" alt="" />
                  <h3>{{ $t("das.profile.frozen") }}</h3>
                  <strong
                    >{{ money(userInfo.frozenBalance, "0.00") }}
                    <small>USD</small></strong
                  >
                  <p>{{ $t("das.started.frozenHint") }}</p>
                </article>
              </div>
              <div class="starting-summary__divider"></div>
            </section>
          </div>
          <div v-if="specialBonusAmount !== 0" class="starting-summary__bonus">
            <h3>{{ $t("das.started.pendingAmount") }}</h3>
            <strong>
              {{ money(specialBonusAmount, "0.00") }}
              <small>USD</small>
            </strong>
            <button
              class="starting-summary__claim"
              type="button"
              @click="openBonusContact"
            >
              {{ $t("das.started.claimReward") }}
            </button>
          </div>
        </section>
        <section class="poetic-featured">
          <h2>{{ $t("das.page.productDetails") }}</h2>
          <TaskShowcase>
            <button
              class="starting-action"
              type="button"
              :disabled="creatingOrder"
              :aria-busy="creatingOrder"
              @click="handleClick"
            >
              <VanLoading
                v-if="creatingOrder"
                class="psy-start-loading"
                size="24px"
                aria-hidden="true"
              />
              <span class="psy-start-count"
                >{{ userInfo.dealCount || 0 }}/{{ orderCount || 0 }}</span
              >
              <img
                v-if="!creatingOrder"
                class="starting-action-bolt"
                src="/westermedia/bolt.png"
                alt=""
              /><span class="psy-start-label">{{
                $t("das.wester.startOptimize")
              }}</span>
            </button>
          </TaskShowcase>
          <div class="design-task-progress">
            <b
              ><img src="/westermedia/progress.png" alt="" />{{
                $t("das.wester.taskProgress")
              }}</b
            ><div class="wester-progress-count">
              <span class="design-task-count">{{ userInfo.dealCount || 0 }} / {{ orderCount || 0 }}</span>
              <span class="wester-progress-status">{{ $t(creatingOrder ? "das.started.creating" : "das.wester.standby") }}</span>
            </div>
            <i
              ><span
                :style="{
                  width: taskProgress + '%',
                }"
              ></span
            ></i>
            <p class="wester-progress-caption">
              <span>{{ $t("das.wester.cycleCompleted", { progress: taskProgress.toFixed(1) }) }}</span>
              <span>{{ $t("das.wester.taskTarget", { tasks: orderCount }) }}</span>
            </p>
          </div>
        </section>
        <p class="starting-footer">{{ $t("das.common.copyright") }}</p>
      </div>
      <BonusDialog
        :show="bonusVisible"
        :amount="bonusAmount"
        @close="closeBonus"
        @contact="openBonusContact"
      />
      <Footer name="/starting">
        <section class="starting-notice">
          <h2>{{ $t("das.started.notice") }}:</h2>
          <p>{{ noticeText }}</p>
        </section>
      </Footer>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { Loading as VanLoading, showToast } from "vant";
import { createOrder, getTradeConfig, userGetInfo } from "@/api/apis";
import HeaderTop from "@/components/HeaderTop.vue";
import Footer from "@/components/Footer.vue";
import TaskShowcase from "@/components/TaskShowcase.vue";
import BonusDialog from "@/components/BonusDialog.vue";
import { safePush } from "@/utils/navigation";
import { getOrderErrorMessage } from "@/utils/orderCreate";

const router = useRouter();
const { t } = useI18n();
const apiImageUrl = window.g?.VITE_API_IMG_URL || "";
const userInfo = ref({});
const userInfoLoading = ref(true);
const levelIconFailed = ref(false);
const tradeInfo = ref({});
const orderCount = ref(40);
const taskProgress = computed(() =>
  Math.min(100, ((userInfo.value.dealCount || 0) / (orderCount.value || 1)) * 100),
);
const bonusVisible = ref(false);
const bonusAmount = ref(0);
const specialBonusAmount = computed(() => {
  const amount = Number(bonusAmount.value);
  return Number.isFinite(amount) ? Math.abs(amount) : 0;
});
const creatingOrder = ref(false);
let pageAlive = false;
const currentLevel = computed(
  () =>
    userInfo.value.userLevel?.level ??
    userInfo.value.memberLevel?.level ??
    userInfo.value.levelId ??
    userInfo.value.vipId ??
    1,
);
const levelIcon = computed(() => {
  if (levelIconFailed.value) return "";
  const path =
    userInfo.value.userLevel?.icon ??
    userInfo.value.memberLevel?.icon ??
    userInfo.value.levelIcon ??
    userInfo.value.vipIcon;
  return hasImage(path) ? imageUrl(path) : "";
});

const hasImage = (path) => {
  const value = String(path ?? "")
    .trim()
    .toLowerCase();
  return Boolean(value && value !== "null" && value !== "undefined");
};
const imageUrl = (path) =>
  /^https?:/i.test(String(path || "")) ? path : `${apiImageUrl}${path}`;

const money = (value, fallback) =>
  value === undefined || value === null || value === ""
    ? fallback
    : Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

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
  try {
    const res = await createOrder();
    if (res.resultType === "BONUS") {
      bonusAmount.value = res.data?.amount ?? 0;
      bonusVisible.value = true;
      return;
    }
    const order = res.data || {};
    showToast(t("das.started.created"));
    openOrderDetails(order);
  } catch (error) {
    if (Number(error?.code) === 2000) {
      bonusAmount.value = error?.data?.amount ?? 0;
      bonusVisible.value = true;
      return;
    }
    if (Number(error?.code) === 907 && error?.data?.id) {
      openOrderDetails(error.data);
      return;
    }
    showToast(getOrderErrorMessage(t, error, "das.started.unableCreate"));
  } finally {
    creatingOrder.value = false;
  }
};

onMounted(async () => {
  pageAlive = true;
  const [userResult, tradeResult] = await Promise.allSettled([
    userGetInfo(),
    getTradeConfig(),
  ]);
  if (!pageAlive) return;
  if (userResult.status === "fulfilled") {
    userInfo.value = userResult.value.data || {};
    bonusAmount.value = userInfo.value.pendingBonusAmount ?? 0;
    levelIconFailed.value = false;
    orderCount.value = userResult.value.data?.userLevel?.orderCount || 40;
  }
  userInfoLoading.value = false;
  if (tradeResult.status === "fulfilled") {
    tradeInfo.value = tradeResult.value.data || {};
  }
});

onUnmounted(() => {
  pageAlive = false;
});
</script>
