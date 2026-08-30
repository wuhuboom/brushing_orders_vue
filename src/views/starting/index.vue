<template>
  <main class="das-page started-page">
    <div
      class="started-design-bg"
      :class="{ 'is-data-transitioning': dataTransition }"
    >
      <HeaderTop />
      <section class="started-design-user">
        <button
          type="button"
          :aria-label="$t('das.common.back')"
          @click="safePush(router, '/my')"
        >
          <img src="@/static/brain/back.png" alt="" />
        </button>
        <div class="started-design-user__copy">
          <span>{{ $t("das.profile.hello") }},</span>
          <strong>{{ userInfo.username || "—" }}</strong>
        </div>
        <div class="started-design-user__level">
          <b>VIP{{ currentLevel }}</b>
          <span
            v-if="userInfoLoading"
            class="started-design-user__level-skeleton"
            aria-hidden="true"
          ></span>
          <img
            v-else-if="levelIcon"
            class="started-design-user__level-icon"
            :src="levelIcon"
            alt=""
            @error="levelIconFailed = true"
          />
        </div>
      </section>

      <section
        class="started-design-stage"
        :class="{ 'is-shuffling': heroMotion }"
      >
        <div class="started-design-stage__backdrop" aria-hidden="true">
          <button
            v-for="entry in backdropProducts"
            :key="entry.key"
            class="started-design-stage__mini"
            type="button"
            @click="selectBackdrop(entry)"
          >
            <img
              v-if="hasImage(entry.item.coverUrl)"
              :src="imageUrl(entry.item.coverUrl)"
              :alt="entry.item.goodsName || ''"
            />
            <DasImagePlaceholder
              v-else
              class="started-design-placeholder started-design-placeholder--mini"
            />
          </button>
        </div>

        <div
          :key="currentProduct.id || currentProduct.orderNo || `product-${current}`"
          class="started-design-stage__hero"
          :class="{ 'is-dealing': heroMotion }"
          :style="heroMotionStyle"
          @animationend="heroMotion = null"
        >
          <img
            v-if="hasImage(currentProduct.coverUrl)"
            :src="imageUrl(currentProduct.coverUrl)"
            :alt="currentProduct.goodsName || ''"
          />
          <DasImagePlaceholder
            v-else
            class="started-design-placeholder started-design-placeholder--hero"
          />
        </div>
      </section>

      <div class="started-design-dots">
        <i
          v-for="(_, index) in dotItems"
          :key="index"
          :class="{ active: index === activeDot }"
        ></i>
      </div>

      <section class="started-design-product">
        <h1>{{ currentProduct.goodsName || $t("das.page.productDetails") }}</h1>
        <p class="started-design-product__rating">
          <img src="@/static/brain/rating-star.png" alt="" />
          <strong>{{ ratingText(currentProduct.rating) }}</strong>
          <span>{{ reviewCount }} Reviews</span>
        </p>
        <h2>
          {{ $t("das.started.price") }}:
          <strong>{{ money(currentProduct.price, "0.00") }} USD</strong>
        </h2>
        <button type="button" @click="handleClick">
           {{ $t("das.started.startNow") }}  ({{ userInfo.dealCount || 0 }}/{{ orderCount || 0 }})
        </button>
      </section>

      <section class="started-design-earnings">
        <div class="started-design-earnings__commission">
          <img src="@/static/brain/commission.png" alt="" />
          <div>
            <h2>TODAY'S COMMISSION</h2>
            <p>
              <strong>{{ money(userInfo.commission, "0.00") }}</strong>
              <span>USD</span>
            </p>
          </div>
        </div>
        <div class="started-design-earnings__grid">
          <div class="started-design-earnings__item">
            <div class="started-design-earnings__label">
              <img src="@/static/brain/started-balance.png" alt="" />
              <b>{{ $t("das.profile.balance") }}</b>
            </div>
            <strong>{{ money(userInfo.balance, "0.00") }} USD</strong>
            <small>{{ $t("das.started.balanceHint") }}</small>
          </div>
          <div class="started-design-earnings__item">
            <div class="started-design-earnings__label">
              <img src="@/static/brain/frozen.png" alt="" />
              <b>{{ $t("das.profile.frozen") }}</b>
            </div>
            <strong>{{ money(userInfo.frozenBalance, "0.00") }} USD</strong>
            <small>{{ $t("das.started.frozenHint") }}</small>
          </div>
        </div>
      </section>

      <section class="started-design-notice">
        <img src="@/static/brain/support.png" alt="" />
        <div>
          <h2>{{ $t("das.started.notice") }}:</h2>
          <template v-if="tradeStart && tradeEnd">
            <p class="started-design-notice__hours">
              Online Support Hours: {{ tradeStart }} - {{ tradeEnd }}
            </p>
            <p>{{ $t("das.started.noticeText") }}</p>
          </template>
          <p v-else>{{ noticeText }}</p>
        </div>
      </section>
      <p class="started-design-copyright">{{ $t("das.common.copyright") }}</p>
    </div>
    <BonusDialog
      :show="bonusVisible"
      @close="closeBonus"
      @contact="openBonusContact"
    />
    <Footer name="/starting" />
  </main>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
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
import DasImagePlaceholder from "@/components/DasImagePlaceholder.vue";
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
const goodsList = ref([]);
const orderCount = ref(40);
const current = ref(0);
const heroMotion = ref(null);
const dataTransition = ref(false);
const bonusVisible = ref(false);
const creatingOrder = ref(false);
let refreshTimer;
let carouselTimer;
let dataTransitionTimer;
let initialShuffleTimer;
let pageAlive = false;
let initialShufflePlayed = false;
const AUTO_DELAY = 3000;
const INITIAL_SHUFFLE_DELAY = 120;
const SOURCE_SLOT_ORDER = [0, 3, 7, 4, 1, 2, 6, 5];
let sourceSlotCursor = 0;

const displayGoods = computed(() =>
  goodsList.value.length
    ? goodsList.value
    : Array.from({ length: 9 }, (_, index) => ({ id: `placeholder-${index}` })),
);

const currentProduct = computed(
  () => displayGoods.value[current.value] || displayGoods.value[0] || {},
);

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

const backdropProducts = computed(() => {
  const list = displayGoods.value;
  if (!list.length) return [];
  return Array.from({ length: 8 }, (_, offset) => {
    const index = (current.value + offset + 1) % list.length;
    const item = list[index] || {};
    return {
      item,
      index,
      key: `${item.id || item.orderNo || "product"}-${index}-${offset}`,
      slot: offset,
    };
  });
});

const dotItems = computed(() =>
  Array.from({ length: Math.min(Math.max(displayGoods.value.length, 1), 5) }),
);
const activeDot = computed(() => current.value % dotItems.value.length);
const reviewCount = computed(
  () =>
    currentProduct.value.reviewCount ??
    currentProduct.value.reviews ??
    currentProduct.value.commentCount ??
    0,
);

const heroMotionStyle = computed(() => {
  if (!heroMotion.value) return {};
  return {
    "--deal-r": `${heroMotion.value.r}deg`,
  };
});

const motionForSlot = (slot = 0) => {
  const index = Number(slot || 0);
  const isTop = index < 4;
  const isLeft = [0, 1, 4, 5].includes(index);
  return {
    r: (isLeft ? -1 : 1) * (isTop ? 8 : -8),
  };
};

const advanceProduct = () => {
  const length = goodsList.value.length;
  if (!pageAlive || length <= 1 || heroMotion.value) return;
  const slot = SOURCE_SLOT_ORDER[sourceSlotCursor % SOURCE_SLOT_ORDER.length];
  sourceSlotCursor += 1;
  const incoming = backdropProducts.value.find((entry) => entry.slot === slot);
  if (!incoming) return;
  heroMotion.value = motionForSlot(incoming.slot);
  current.value = incoming.index;
};

const selectBackdrop = (entry) => {
  if (!entry || heroMotion.value) return;
  heroMotion.value = motionForSlot(entry.slot);
  current.value = entry.index;
  startCarousel();
};

const startCarousel = () => {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(advanceProduct, AUTO_DELAY);
};

const playInitialShuffle = async () => {
  if (initialShufflePlayed || goodsList.value.length <= 1) return;
  initialShufflePlayed = true;
  await nextTick();
  clearTimeout(initialShuffleTimer);
  initialShuffleTimer = setTimeout(() => {
    if (!pageAlive || heroMotion.value || goodsList.value.length <= 1) return;
    heroMotion.value = motionForSlot(SOURCE_SLOT_ORDER[0]);
    startCarousel();
  }, INITIAL_SHUFFLE_DELAY);
};

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
      dataTransition.value = false;
      clearTimeout(dataTransitionTimer);
      if (!heroMotion.value) {
        await nextTick();
        if (!heroMotion.value) {
          dataTransition.value = true;
          dataTransitionTimer = setTimeout(() => {
            dataTransition.value = false;
          }, 760);
        }
      }
      playInitialShuffle();
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
  showLoadingToast({
    message: t("das.started.creating"),
    forbidClick: true,
    duration: 0,
  });
  try {
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
    creatingOrder.value = false;
  }
};

onMounted(async () => {
  pageAlive = true;
  getList();
  const [userResult, tradeResult] = await Promise.allSettled([
    userGetInfo(),
    getTradeConfig(),
  ]);
  if (!pageAlive) return;
  if (userResult.status === "fulfilled") {
    userInfo.value = userResult.value.data || {};
    levelIconFailed.value = false;
    orderCount.value = userResult.value.data?.userLevel?.orderCount || 40;
  }
  userInfoLoading.value = false;
  if (tradeResult.status === "fulfilled") {
    tradeInfo.value = tradeResult.value.data || {};
  }
  startCarousel();
});

onUnmounted(() => {
  pageAlive = false;
  clearTimeout(refreshTimer);
  clearTimeout(dataTransitionTimer);
  clearTimeout(initialShuffleTimer);
  clearInterval(carouselTimer);
});
</script>

<style scoped>
.started-page {
  background: #ecf3e8;
  color: #17382d;
}
.started-bg {
  background: #020717;
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
.started-user button {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #0b1222;
  color: inherit;
  font-size: 32px;
  font-weight: 200;
}
.started-user button img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: none;
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
.started-user b {
  font-size: 14px;
  margin-right: 10px;
}
.started-user :deep(.das-icon) {
  width: 24px;
  height: 24px;
}
.started-user__level-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.product-stage {
  --hero-half: min(33%, 142px);
  --mini-w: 96px;
  --mini-peek: 30px;
  --mini-gap: 14px;
  height: 356px;
  position: relative;
  overflow: hidden;
}
.product-stage__backdrop {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.product-stage__mini {
  position: absolute;
  width: var(--mini-w);
  height: 132px;
  padding: 8px;
  overflow: hidden;
  border: 0;
  border-radius: 16px;
  background: rgba(248, 248, 240, 0.96);
  box-shadow: 0 8px 20px rgba(20, 57, 44, 0.09);
  cursor: pointer;
  pointer-events: auto;
}
.product-stage__mini:nth-child(1),
.product-stage__mini:nth-child(2),
.product-stage__mini:nth-child(3),
.product-stage__mini:nth-child(4) {
  top: 33px;
}
.product-stage__mini:nth-child(5),
.product-stage__mini:nth-child(6),
.product-stage__mini:nth-child(7),
.product-stage__mini:nth-child(8) {
  bottom: 33px;
}
.product-stage__mini:nth-child(1),
.product-stage__mini:nth-child(5) {
  left: calc(
    50% - var(--hero-half) - var(--mini-peek) - var(--mini-w) - var(--mini-gap)
  );
}
.product-stage__mini:nth-child(2),
.product-stage__mini:nth-child(6) {
  left: calc(50% - var(--hero-half) - var(--mini-peek));
}
.product-stage__mini:nth-child(3),
.product-stage__mini:nth-child(7) {
  right: calc(50% - var(--hero-half) - var(--mini-peek));
}
.product-stage__mini:nth-child(4),
.product-stage__mini:nth-child(8) {
  right: calc(
    50% - var(--hero-half) - var(--mini-peek) - var(--mini-w) - var(--mini-gap)
  );
}
.product-stage__mini img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.product-placeholder {
  display: block;
  color: #c0c6c3;
}
.product-placeholder--mini {
  width: 32px;
  height: 27px;
  margin: auto;
}
.product-placeholder--hero {
  width: 66px;
  height: 54px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.product-stage__hero {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(66%, 284px);
  height: 356px;
  transform: translate(-50%, -50%);
  z-index: 2;
  padding: 24px;
  overflow: hidden;
  border: 4px solid transparent;
  border-radius: 28px;
  background:
    linear-gradient(#fff, #fff) padding-box,
    linear-gradient(135deg, #ee907f, #e2b64c, #258672) border-box;
  box-shadow: 0 18px 28px rgba(20, 57, 44, 0.26);
}
.product-stage__hero::before,
.product-stage__hero::after {
  content: "";
  position: absolute;
  width: 27px;
  height: 27px;
  pointer-events: none;
}
.product-stage__hero::before {
  left: 17px;
  top: 17px;
  border-left: 3px solid #ee907f;
  border-top: 3px solid #ee907f;
  border-radius: 7px 0 0;
}
.product-stage__hero::after {
  right: 17px;
  bottom: 17px;
  border-right: 3px solid #76a8c6;
  border-bottom: 3px solid #76a8c6;
  border-radius: 0 0 7px;
}
.product-stage__hero img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.product-stage__hero.is-throwing {
  animation: product-throw-in 720ms cubic-bezier(0.16, 1.05, 0.3, 1) both;
}
@keyframes product-data-in {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
    filter: blur(5px);
  }
  65% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes product-mini-data-in {
  0% {
    opacity: 0;
    transform: translateY(14px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes product-copy-data-in {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.started-bg.is-data-transitioning .product-stage__hero:not(.is-throwing) {
  animation: product-data-in 680ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.started-bg.is-data-transitioning .product-stage__mini {
  animation: product-mini-data-in 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.started-bg.is-data-transitioning .product-stage__mini:nth-child(2),
.started-bg.is-data-transitioning .product-stage__mini:nth-child(6) {
  animation-delay: 45ms;
}
.started-bg.is-data-transitioning .product-stage__mini:nth-child(3),
.started-bg.is-data-transitioning .product-stage__mini:nth-child(7) {
  animation-delay: 90ms;
}
.started-bg.is-data-transitioning .product-stage__mini:nth-child(4),
.started-bg.is-data-transitioning .product-stage__mini:nth-child(8) {
  animation-delay: 135ms;
}
.started-bg.is-data-transitioning .product-copy {
  animation: product-copy-data-in 560ms 100ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes product-throw-in {
  0% {
    opacity: 0.34;
    filter: blur(1.5px);
    transform: translate(
        calc(-50% + var(--throw-x, 0px)),
        calc(-50% + var(--throw-y, 0px))
      )
      scale(0.34) rotate(var(--throw-r, 0deg));
    box-shadow: 0 5px 9px rgba(20, 57, 44, 0.08);
  }
  64% {
    opacity: 1;
    filter: blur(0);
    transform: translate(-50%, -50%) scale(1) rotate(0);
    box-shadow: 0 24px 36px rgba(20, 57, 44, 0.3);
  }
  82% {
    transform: translate(-50%, -50%) scale(0.985) rotate(0);
  }
  100% {
    opacity: 1;
    filter: blur(0);
    transform: translate(-50%, -50%) scale(1) rotate(0);
    box-shadow: 0 18px 28px rgba(20, 57, 44, 0.26);
  }
}
.product-dots {
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
}
.product-dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(23, 56, 45, 0.18);
}
.product-dots i.active {
  width: 22px;
  border-radius: 999px;
  background: #14392c;
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
  overflow: hidden;
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

@media (max-width: 380px) {
  .product-stage {
    --hero-half: min(33%, 126px);
    --mini-w: 84px;
    --mini-peek: 26px;
    --mini-gap: 11px;
    height: 330px;
  }
  .product-stage__hero {
    width: min(66%, 252px);
    height: 330px;
  }
  .product-stage__mini {
    height: 116px;
  }
  .product-stage__mini:nth-child(1),
  .product-stage__mini:nth-child(2),
  .product-stage__mini:nth-child(3),
  .product-stage__mini:nth-child(4) {
    top: 37px;
  }
  .product-stage__mini:nth-child(5),
  .product-stage__mini:nth-child(6),
  .product-stage__mini:nth-child(7),
  .product-stage__mini:nth-child(8) {
    bottom: 37px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-stage__hero.is-throwing,
  .started-bg.is-data-transitioning .product-stage__hero,
  .started-bg.is-data-transitioning .product-stage__mini,
  .started-bg.is-data-transitioning .product-copy {
    animation: none;
  }
}

/* The design-board layout uses page-specific class names so the older global
   get-started overrides cannot compress the carousel or summary cards. */
.started-design-bg {
  min-height: 100%;
  padding-bottom: 28px;
  overflow: hidden;
  background: #01040f;
  color: #fff;
}

.started-design-user {
  min-height: 55px;
  padding: 6px 15px;
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  align-items: center;
  border-bottom: 1px solid #151e33;
  background: #01040f;
}

.started-design-user > button {
  width: 40px;
  height: 40px;
  padding: 0;
  display: grid;
  place-items: center;
  border: 1px solid #173c73;
  border-radius: 50%;
  background: #071123;
}

.started-design-user > button img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.started-design-user__copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 11px;
}

.started-design-user__copy span {
  color: #9ca4b5;
  font-size: 13px;
  line-height: 1.25;
}

.started-design-user__copy strong {
  overflow: hidden;
  color: #fff;
  font-size: 18px;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.started-design-user__level {
  min-width: 80px;
  height: 33px;
  padding: 0 6px 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid #244b86;
  border-radius: 999px;
  background: #0c1933;
  color: #268cff;
}

.started-design-user__level b {
  font-size: 14px;
  font-weight: 500;
}

.started-design-user__level-icon {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.started-design-user__level-skeleton {
  width: 26px;
  height: 26px;
  flex: 0 0 26px;
  overflow: hidden;
  position: relative;
  border-radius: 50%;
  background: #172a49;
}

.started-design-user__level-skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(74, 150, 255, 0.45),
    transparent
  );
  animation: started-level-skeleton 1.2s ease-in-out infinite;
}

@keyframes started-level-skeleton {
  to {
    transform: translateX(100%);
  }
}

.started-design-stage {
  --started-hero: clamp(190px, 53.333vw, 230px);
  --started-mini: clamp(54px, 15.467vw, 66px);
  --started-hero-top: 21px;
  --started-side-gap: 4px;
  --started-stack-top: calc(
    var(--started-hero-top) +
      (var(--started-hero) - (2 * var(--started-mini) + 12px)) / 2 + 6px
  );
  height: calc(var(--started-hero) + var(--started-hero-top));
  position: relative;
  overflow: hidden;
  background: #01040f;
}

.started-design-stage__backdrop {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.started-design-stage__mini {
  position: absolute;
  width: var(--started-mini);
  height: var(--started-mini);
  padding: 0;
  overflow: hidden;
  border: 1px solid #1f2e49;
  border-radius: 2px;
  background: #101421;
  cursor: pointer;
  pointer-events: auto;
}

.started-design-stage__mini:nth-child(1),
.started-design-stage__mini:nth-child(3) {
  top: var(--started-stack-top);
}

.started-design-stage__mini:nth-child(2),
.started-design-stage__mini:nth-child(4) {
  top: calc(var(--started-stack-top) + var(--started-mini) + 12px);
}

.started-design-stage__mini:nth-child(1),
.started-design-stage__mini:nth-child(2) {
  left: calc(
    50% - (var(--started-hero) / 2) - var(--started-mini) -
      var(--started-side-gap)
  );
}

.started-design-stage__mini:nth-child(3),
.started-design-stage__mini:nth-child(4) {
  right: calc(
    50% - (var(--started-hero) / 2) - var(--started-mini) -
      var(--started-side-gap)
  );
}

.started-design-stage__mini:nth-child(n + 5) {
  display: none;
}

.started-design-stage__mini img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  filter: brightness(0.62);
}

.started-design-stage__hero {
  position: absolute;
  z-index: 2;
  top: var(--started-hero-top);
  left: 50%;
  width: var(--started-hero);
  height: var(--started-hero);
  overflow: hidden;
  transform: translateX(-50%);
  border: 1px solid #274a78;
  border-radius: 7px;
  background: #101421;
  box-shadow: 0 0 24px rgba(0, 99, 255, 0.12);
}

.started-design-stage__hero img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.started-design-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  transform: translate(-50%, -50%);
  color: #667086;
}

.started-design-placeholder--mini {
  width: 28px;
  height: 24px;
}

.started-design-placeholder--hero {
  width: 66px;
  height: 54px;
}

.started-design-stage.is-shuffling .started-design-stage__backdrop {
  z-index: 4;
}

.started-design-stage.is-shuffling .started-design-stage__mini {
  pointer-events: none;
  will-change: transform, filter, box-shadow;
  animation: started-design-card-shuffle 1720ms linear both;
}

.started-design-stage.is-shuffling
  .started-design-stage__mini:nth-child(2) {
  animation-delay: 22ms;
}

.started-design-stage.is-shuffling
  .started-design-stage__mini:nth-child(3) {
  animation-delay: 44ms;
}

.started-design-stage.is-shuffling
  .started-design-stage__mini:nth-child(4) {
  animation-delay: 66ms;
}

.started-design-stage__mini:nth-child(1),
.started-design-stage__mini:nth-child(2) {
  --gather-x: calc(
    var(--started-hero) / 2 + var(--started-mini) / 2 +
      var(--started-side-gap)
  );
}

.started-design-stage__mini:nth-child(3),
.started-design-stage__mini:nth-child(4) {
  --gather-x: calc(
    0px - var(--started-hero) / 2 - var(--started-mini) / 2 -
      var(--started-side-gap)
  );
}

.started-design-stage__mini:nth-child(1),
.started-design-stage__mini:nth-child(3) {
  --gather-y: calc(var(--started-mini) / 2);
}

.started-design-stage__mini:nth-child(2),
.started-design-stage__mini:nth-child(4) {
  --gather-y: calc(0px - var(--started-mini) / 2 - 12px);
}

.started-design-stage__mini:nth-child(1),
.started-design-stage__mini:nth-child(2),
.started-design-stage__mini:nth-child(3),
.started-design-stage__mini:nth-child(4) {
  --orbit-radius: clamp(40px, 11.5vw, 52px);
}

.started-design-stage__mini:nth-child(1) {
  --orbit-start: 0deg;
  --orbit-counter: 0deg;
  --card-tilt: 5deg;
}

.started-design-stage__mini:nth-child(2) {
  --orbit-start: 90deg;
  --orbit-counter: -90deg;
  --card-tilt: -4deg;
}

.started-design-stage__mini:nth-child(3) {
  --orbit-start: 180deg;
  --orbit-counter: -180deg;
  --card-tilt: 4deg;
}

.started-design-stage__mini:nth-child(4) {
  --orbit-start: 270deg;
  --orbit-counter: -270deg;
  --card-tilt: -5deg;
}

.started-design-stage__hero.is-dealing {
  --hero-orbit-radius: clamp(42px, 12vw, 54px);
  --hero-orbit-start: 45deg;
  --hero-orbit-counter: -45deg;
  --hero-card-tilt: -2deg;
  z-index: 3;
  transform-origin: center;
  will-change: transform, opacity, filter;
  animation: started-design-card-deal 1786ms linear both;
}

.started-design-bg.is-data-transitioning
  .started-design-stage:not(.is-shuffling)
  .started-design-stage__hero:not(.is-dealing) {
  animation: started-design-data-in 680ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.started-design-bg.is-data-transitioning
  .started-design-stage:not(.is-shuffling)
  .started-design-stage__mini {
  animation: product-mini-data-in 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.started-design-bg.is-data-transitioning .started-design-product {
  animation: product-copy-data-in 560ms 100ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes started-design-data-in {
  from {
    opacity: 0;
    filter: blur(5px);
    transform: translateX(-50%) scale(0.9);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateX(-50%) scale(1);
  }
}

@keyframes started-design-card-shuffle {
  0% {
    filter: brightness(1);
    transform: translate(0, 0) scale(1) rotate(0);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
    animation-timing-function: cubic-bezier(0.22, 0.78, 0.28, 1);
  }
  14% {
    filter: brightness(0.96);
    transform: translate(var(--gather-x), var(--gather-y)) scale(0.86)
      rotate(var(--card-tilt));
    box-shadow: 0 9px 20px rgba(0, 0, 0, 0.38);
    animation-timing-function: ease-out;
  }
  20% {
    filter: brightness(1.04);
    transform: translate(var(--gather-x), var(--gather-y))
      rotate(var(--orbit-start)) translateX(var(--orbit-radius))
      rotate(var(--orbit-counter)) rotate(var(--card-tilt)) scale(0.88);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.46);
    animation-timing-function: linear;
  }
  30% {
    filter: brightness(0.94);
    transform: translate(var(--gather-x), var(--gather-y))
      rotate(calc(var(--orbit-start) + 90deg)) translateX(var(--orbit-radius))
      rotate(calc(var(--orbit-counter) - 90deg)) rotate(var(--card-tilt))
      scale(0.86);
  }
  40% {
    filter: brightness(0.84);
    transform: translate(var(--gather-x), var(--gather-y))
      rotate(calc(var(--orbit-start) + 180deg)) translateX(var(--orbit-radius))
      rotate(calc(var(--orbit-counter) - 180deg)) rotate(var(--card-tilt))
      scale(0.83);
  }
  50% {
    filter: brightness(0.96);
    transform: translate(var(--gather-x), var(--gather-y))
      rotate(calc(var(--orbit-start) + 270deg)) translateX(var(--orbit-radius))
      rotate(calc(var(--orbit-counter) - 270deg)) rotate(var(--card-tilt))
      scale(0.86);
  }
  60% {
    filter: brightness(1.06);
    transform: translate(var(--gather-x), var(--gather-y))
      rotate(calc(var(--orbit-start) + 360deg)) translateX(var(--orbit-radius))
      rotate(calc(var(--orbit-counter) - 360deg)) rotate(var(--card-tilt))
      scale(0.9);
  }
  70% {
    filter: brightness(0.95);
    transform: translate(var(--gather-x), var(--gather-y))
      rotate(calc(var(--orbit-start) + 450deg)) translateX(var(--orbit-radius))
      rotate(calc(var(--orbit-counter) - 450deg)) rotate(var(--card-tilt))
      scale(0.86);
  }
  78% {
    filter: brightness(0.84);
    transform: translate(var(--gather-x), var(--gather-y))
      rotate(calc(var(--orbit-start) + 540deg)) translateX(var(--orbit-radius))
      rotate(calc(var(--orbit-counter) - 540deg)) rotate(var(--card-tilt))
      scale(0.83);
    animation-timing-function: cubic-bezier(0.18, 0.72, 0.24, 1);
  }
  85% {
    filter: brightness(0.96);
    transform: translate(var(--gather-x), var(--gather-y))
      rotate(calc(var(--orbit-start) + 630deg))
      translateX(calc(var(--orbit-radius) - 10px))
      rotate(calc(var(--orbit-counter) - 630deg)) rotate(var(--card-tilt))
      scale(0.85);
  }
  91% {
    filter: brightness(1.04);
    transform: translate(var(--gather-x), var(--gather-y))
      rotate(calc(var(--orbit-start) + 720deg)) translateX(14px)
      rotate(calc(var(--orbit-counter) - 720deg)) rotate(var(--card-tilt))
      scale(0.86);
    animation-timing-function: ease-out;
  }
  95% {
    filter: brightness(1);
    transform: translate(var(--gather-x), var(--gather-y)) scale(0.84)
      rotate(var(--card-tilt));
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.42);
  }
  100% {
    filter: brightness(1);
    transform: translate(0, 0) scale(1) rotate(0);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  }
}

@keyframes started-design-card-deal {
  0% {
    opacity: 1;
    filter: brightness(1);
    transform: translateX(-50%) scale(1) rotate(0);
    animation-timing-function: cubic-bezier(0.22, 0.78, 0.28, 1);
  }
  13% {
    opacity: 0.76;
    filter: brightness(0.82);
    transform: translateX(-50%) scale(0.27) rotate(var(--deal-r, 0deg));
    animation-timing-function: ease-out;
  }
  20% {
    opacity: 0.84;
    filter: brightness(0.94);
    transform: translateX(-50%) rotate(var(--hero-orbit-start))
      translateX(var(--hero-orbit-radius)) rotate(var(--hero-orbit-counter))
      rotate(var(--hero-card-tilt)) scale(0.27);
    animation-timing-function: linear;
  }
  30% {
    opacity: 0.78;
    filter: brightness(0.86);
    transform: translateX(-50%)
      rotate(calc(var(--hero-orbit-start) + 90deg))
      translateX(var(--hero-orbit-radius))
      rotate(calc(var(--hero-orbit-counter) - 90deg))
      rotate(var(--hero-card-tilt)) scale(0.25);
  }
  40% {
    opacity: 0.72;
    filter: brightness(0.78);
    transform: translateX(-50%)
      rotate(calc(var(--hero-orbit-start) + 180deg))
      translateX(var(--hero-orbit-radius))
      rotate(calc(var(--hero-orbit-counter) - 180deg))
      rotate(var(--hero-card-tilt)) scale(0.24);
  }
  50% {
    opacity: 0.78;
    filter: brightness(0.88);
    transform: translateX(-50%)
      rotate(calc(var(--hero-orbit-start) + 270deg))
      translateX(var(--hero-orbit-radius))
      rotate(calc(var(--hero-orbit-counter) - 270deg))
      rotate(var(--hero-card-tilt)) scale(0.25);
  }
  60% {
    opacity: 0.86;
    filter: brightness(0.98);
    transform: translateX(-50%)
      rotate(calc(var(--hero-orbit-start) + 360deg))
      translateX(var(--hero-orbit-radius))
      rotate(calc(var(--hero-orbit-counter) - 360deg))
      rotate(var(--hero-card-tilt)) scale(0.27);
  }
  70% {
    opacity: 0.78;
    filter: brightness(0.88);
    transform: translateX(-50%)
      rotate(calc(var(--hero-orbit-start) + 450deg))
      translateX(var(--hero-orbit-radius))
      rotate(calc(var(--hero-orbit-counter) - 450deg))
      rotate(var(--hero-card-tilt)) scale(0.25);
  }
  78% {
    opacity: 0.72;
    filter: brightness(0.78);
    transform: translateX(-50%)
      rotate(calc(var(--hero-orbit-start) + 540deg))
      translateX(var(--hero-orbit-radius))
      rotate(calc(var(--hero-orbit-counter) - 540deg))
      rotate(var(--hero-card-tilt)) scale(0.24);
    animation-timing-function: cubic-bezier(0.18, 0.72, 0.24, 1);
  }
  85% {
    opacity: 0.78;
    filter: brightness(0.88);
    transform: translateX(-50%)
      rotate(calc(var(--hero-orbit-start) + 630deg))
      translateX(calc(var(--hero-orbit-radius) - 10px))
      rotate(calc(var(--hero-orbit-counter) - 630deg))
      rotate(var(--hero-card-tilt)) scale(0.25);
  }
  88% {
    opacity: 0.88;
    filter: brightness(0.98);
    transform: translateX(-50%)
      rotate(calc(var(--hero-orbit-start) + 720deg)) translateX(14px)
      rotate(calc(var(--hero-orbit-counter) - 720deg))
      rotate(var(--hero-card-tilt)) scale(0.27);
    animation-timing-function: ease-out;
  }
  91% {
    opacity: 0.96;
    filter: brightness(1.08);
    transform: translateX(-50%) scale(0.3) rotate(var(--deal-r, 0deg));
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }
  96% {
    opacity: 1;
    filter: brightness(1.04);
    transform: translateX(-50%) scale(0.78) rotate(0);
    animation-timing-function: ease-out;
  }
  100% {
    opacity: 1;
    filter: brightness(1);
    transform: translateX(-50%) scale(1) rotate(0);
  }
}

.started-design-dots {
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: #01040f;
}

.started-design-dots i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #586173;
}

.started-design-dots i.active {
  background: #438cf8;
}

.started-design-product {
  max-width: 640px;
  margin: 0 auto;
  padding: 4px 12px 0;
  text-align: center;
}

.started-design-product h1 {
  margin: 0;
  color: #fff;
  font-size: clamp(17px, 4.76vw, 20px);
  font-weight: 700;
  line-height: 1.35;
}

.started-design-product__rating {
  margin: 4px 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #a5acbc;
  font-size: 14px;
}

.started-design-product__rating img {
  width: 15px;
  height: 15px;
  object-fit: contain;
}

.started-design-product__rating strong {
  color: #ffcf00;
  font-weight: 500;
}

.started-design-product h2 {
  margin: 0;
  color: #fff;
  font-size: 19px;
  font-weight: 700;
}

.started-design-product h2 strong {
  margin-left: 8px;
  color: #55a7ff;
  font-size: 20px;
  font-weight: 500;
}

.started-design-product > button {
  width: 100%;
  height: 72px;
  margin-top: 15px;
  border: 0;
  border-radius: 11px;
  background: linear-gradient(100deg, #09baff, #0878ff 50%, #4320c5);
  color: #fff;
  font-size: 19px;
  font-weight: 800;
}

.started-design-earnings {
  max-width: 640px;
  margin: 14px auto 0;
  overflow: hidden;
  border: 1px solid #213b64;
  border-radius: 7px;
  background: #101421;
}

.started-design-earnings__commission {
  min-height: 110px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.started-design-earnings__commission::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  width: 68%;
  height: 62%;
  background: url("@/static/brain/started-commission-wave.png") right bottom /
    100% 100% no-repeat;
  opacity: 0.68;
  pointer-events: none;
}

.started-design-earnings__commission > img {
  width: 60px;
  height: 60px;
  flex: 0 0 60px;
  position: relative;
  z-index: 1;
  object-fit: contain;
}

.started-design-earnings__commission > div {
  position: relative;
  z-index: 1;
}

.started-design-earnings__commission h2 {
  margin: 0 0 4px;
  color: #9aa3b6;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.8px;
}

.started-design-earnings__commission p {
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.started-design-earnings__commission strong {
  color: #4a9cff;
  font-size: 27px;
  line-height: 1.1;
}

.started-design-earnings__commission span {
  color: #c9cfdb;
  font-size: 13px;
}

.started-design-earnings__grid {
  min-height: 136px;
  padding: 14px 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid #233c61;
}

.started-design-earnings__item {
  min-width: 0;
  padding-right: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.started-design-earnings__item + .started-design-earnings__item {
  padding-right: 0;
  padding-left: 19px;
  border-left: 1px solid #244a80;
}

.started-design-earnings__label {
  min-height: 34px;
  display: flex;
  align-items: center;
  gap: 9px;
}

.started-design-earnings__label img {
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  object-fit: contain;
}

.started-design-earnings__label b {
  color: #aab2c3;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: 0.6px;
  text-align: left;
  text-transform: uppercase;
}

.started-design-earnings__item > strong {
  max-width: 100%;
  margin-top: 7px;
  overflow: hidden;
  color: #fff;
  font-size: clamp(16px, 4.76vw, 20px);
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.started-design-earnings__item small {
  margin-top: 4px;
  color: #7f8798;
  font-size: 10px;
  line-height: 1.25;
  text-align: left;
}

.started-design-notice {
  max-width: 640px;
  min-height: 102px;
  margin: 22px auto 0;
  padding: 16px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #17355d;
  border-radius: 7px;
  background: #081326;
  text-align: left;
}

.started-design-notice > img {
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  object-fit: contain;
}

.started-design-notice h2 {
  margin: 0 0 3px;
  color: #55a8ff;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
}

.started-design-notice p {
  margin: 0;
  color: #9aa3b6;
  font-size: 12px;
  line-height: 1.45;
}

.started-design-notice__hours {
  color: #fff !important;
}

.started-design-copyright {
  margin: 17px 0 7px;
  color: #4d566a;
  font-size: 9px;
  text-align: center;
}

@media (max-width: 659px) {
  .started-design-product,
  .started-design-earnings,
  .started-design-notice {
    margin-right: 15px;
    margin-left: 15px;
  }

  .started-design-product {
    padding-right: 0;
    padding-left: 0;
  }
}

@media (min-width: 600px) {
  .started-design-stage {
    --started-hero: clamp(230px, 31vw, 300px);
    --started-mini: clamp(66px, 8.4vw, 82px);
    --started-hero-top: 30px;
    --started-side-gap: 18px;
  }
}

@media (max-width: 370px) {
  .started-design-user__level {
    min-width: 82px;
    padding-right: 7px;
    padding-left: 11px;
    gap: 5px;
  }

  .started-design-earnings__grid {
    padding-right: 12px;
    padding-left: 12px;
  }

  .started-design-earnings__item + .started-design-earnings__item {
    padding-left: 13px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .started-design-stage.is-shuffling .started-design-stage__mini,
  .started-design-stage__hero.is-dealing,
  .started-design-bg.is-data-transitioning .started-design-stage__hero,
  .started-design-bg.is-data-transitioning .started-design-stage__mini,
  .started-design-bg.is-data-transitioning .started-design-product {
    animation: none;
  }
}
</style>
