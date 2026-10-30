<template>
  <main class="das-page started-page starting-page">
    <HeaderTop />
    <div class="starting-top-strip" aria-hidden="true"></div>
    <div
      ref="startingMain"
      class="starting-main"
      :style="{ '--starting-showcase-height': showcaseHeight }"
    >
      <section class="psy-start-balance">
        <img src="@/static/brain/started-balance.png" alt="" />
        <h3>{{ $t("das.profile.balance") }}</h3>
        <strong
          >{{ money(userInfo.balance, "0.00") }} <small>USD</small></strong
        >
        <p>{{ $t("das.started.balanceHint") }}</p>
      </section>
      <TaskShowcase tiles framed />
      <section class="starting-user">
        <div class="starting-user__name">
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

      <div class="psy-start-dashboard">
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
          <span class="psy-start-label">{{ $t("das.started.startNow") }}</span>
        </button>
        <section class="starting-summary">
          <img
            class="starting-summary__rocket"
            src="@/static/brain/commission.png"
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
              <img src="@/static/brain/frozen.png" alt="" />
              <h3>{{ $t("das.profile.frozen") }}</h3>
              <strong>{{ money(userInfo.frozenBalance, "0.00") }} USD</strong>
              <p>{{ $t("das.started.frozenHint") }}</p>
            </article>
          </div>
          <div class="starting-summary__divider"></div>
          <div class="starting-summary__bonus">
            <h3>{{ $t("das.started.pendingAmount") }}</h3>
            <strong
              >{{ money(specialBonusAmount, "0.00") }}
              <small>USD</small></strong
            >
            <button
              v-if="specialBonusAmount !== 0"
              class="starting-summary__claim"
              type="button"
              @click="openBonusContact"
            >
              {{ $t("das.started.claimReward") }}
            </button>
          </div>
        </section>
      </div>
      <button
        class="psy-start-history"
        type="button"
        @click="safePush(router, '/records')"
      >
        <img src="/psybir/history.png" alt="" /><span>{{
          $t("das.page.records")
        }}</span
        ><b>›</b>
      </button>
      <section class="starting-notice">
        <h2>{{ $t("das.started.notice") }}:</h2>
        <p>{{ noticeText }}</p>
      </section>
      <p class="starting-footer">{{ $t("das.common.copyright") }}</p>
    </div>
    <BonusDialog
      :show="bonusVisible"
      :amount="bonusAmount"
      @close="closeBonus"
      @contact="openBonusContact"
    />
    <Footer name="/starting" />
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

const startingMain = ref(null);
const showcaseHeight = ref("auto");
let showcaseObserver;
const resizeShowcase = () => {
  const main = startingMain.value;
  if (!main) return;
  const balance = main.querySelector(".psy-start-balance");
  const dashboard = main.querySelector(".psy-start-dashboard");
  const footer = main.parentElement.querySelector(".das-footer");
  const header = main.parentElement.querySelector(".das-header");
  const outerHeight = (element) => {
    const style = getComputedStyle(element);
    return (
      element.getBoundingClientRect().height +
      parseFloat(style.marginTop) +
      parseFloat(style.marginBottom)
    );
  };
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const footerSpace = viewportHeight - footer.getBoundingClientRect().top + 8;
  const availableHeight =
    viewportHeight -
    header.getBoundingClientRect().height -
    parseFloat(getComputedStyle(main).paddingTop) -
    outerHeight(balance) -
    outerHeight(dashboard) -
    footerSpace;
  // Keep the video visible on very short screens, which can still scroll.
  showcaseHeight.value =
    Math.min(
      main.querySelector(".task-showcase").clientWidth / 1.11,
      Math.max(64, availableHeight),
    ) + "px";
};
onMounted(() => {
  const main = startingMain.value;
  showcaseObserver = new ResizeObserver(resizeShowcase);
  [
    main,
    main.querySelector(".psy-start-balance"),
    main.querySelector(".psy-start-dashboard"),
    main.parentElement.querySelector(".das-header"),
    main.parentElement.querySelector(".das-footer"),
  ].forEach((element) => showcaseObserver.observe(element));
  window.visualViewport?.addEventListener("resize", resizeShowcase);
  resizeShowcase();
});
onUnmounted(() => {
  showcaseObserver?.disconnect();
  window.visualViewport?.removeEventListener("resize", resizeShowcase);
});

const router = useRouter();
const { t } = useI18n();
const apiImageUrl = window.g?.VITE_API_IMG_URL || "";
const userInfo = ref({});
const userInfoLoading = ref(true);
const levelIconFailed = ref(false);
const tradeInfo = ref({});
const orderCount = ref(40);
const bonusVisible = ref(false);
const bonusAmount = ref(0);
const specialBonusAmount = computed(() => {
  const amount = Number(bonusAmount.value);
  return Number.isFinite(amount) && amount !== 0 ? -Math.abs(amount) : 0;
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
