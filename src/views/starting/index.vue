<template>
  <main class="das-page started-page">
    <div class="started-bg" :class="{ 'is-data-transitioning': dataTransition }">
      <HeaderTop />
      <section class="started-user">
        <button type="button" @click="safePush(router, '/my')"><img src="@/static/das/icons/chevron-left.png" alt="" /></button>
        <div>
          <span>{{ $t("das.profile.hello") }},</span>
          <strong>{{ userInfo.username || "—" }}</strong>
        </div>
        <b>VIP {{ currentLevel }}</b>
        <img
          v-if="levelIcon"
          class="started-user__level-icon"
          :src="levelIcon"
          alt=""
          @error="levelIconFailed = true"
        />
        <DasIcon v-else name="vip-accent" />
      </section>

      <section class="product-stage">
        <div class="product-stage__backdrop" aria-hidden="true">
          <button
            v-for="entry in backdropProducts"
            :key="entry.key"
            class="product-stage__mini"
            type="button"
            @click="selectBackdrop(entry)"
          >
            <img
              v-if="hasImage(entry.item.coverUrl)"
              :src="imageUrl(entry.item.coverUrl)"
              :alt="entry.item.goodsName || ''"
            />
            <DasImagePlaceholder v-else class="product-placeholder product-placeholder--mini" />
          </button>
        </div>

        <div
          :key="`${currentProduct.id || currentProduct.orderNo || 'product'}-${current}`"
          class="product-stage__hero"
          :class="{ 'is-throwing': heroMotion }"
          :style="heroMotionStyle"
          @animationend="heroMotion = null"
        >
          <img
            v-if="hasImage(currentProduct.coverUrl)"
            :src="imageUrl(currentProduct.coverUrl)"
            :alt="currentProduct.goodsName || ''"
          />
          <DasImagePlaceholder v-else class="product-placeholder product-placeholder--hero" />
        </div>
      </section>

      <div class="product-dots">
        <i
          v-for="(_, index) in dotItems"
          :key="index"
          :class="{ active: index === activeDot }"
        ></i>
      </div>

      <section class="product-copy">
        <h1>{{ currentProduct.goodsName || $t("das.page.productDetails") }}</h1>
        <p class="product-rating"><img src="@/static/das/icons/rating-star.png" alt="" /> {{ ratingText(currentProduct.rating) }}</p>
        <h2>
          {{ $t("das.started.price") }}:
          <strong>{{ money(currentProduct.price, "0.00") }} USD</strong>
        </h2>
        <button type="button" @click="handleClick">
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
import DasIcon from "@/components/DasIcon.vue";
import DasImagePlaceholder from "@/components/DasImagePlaceholder.vue";
import { safePush } from "@/utils/navigation";

const router = useRouter();
const { t } = useI18n();
const apiImageUrl = window.g?.VITE_API_IMG_URL || "";
const userInfo = ref({});
const levelIconFailed = ref(false);
const tradeInfo = ref({});
const goodsList = ref([]);
const orderCount = ref(40);
const current = ref(0);
const heroMotion = ref(null);
const dataTransition = ref(false);
let refreshTimer;
let carouselTimer;
let dataTransitionTimer;
let pageAlive = false;
const AUTO_DELAY = 3000;
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
  Array.from({ length: Math.min(Math.max(displayGoods.value.length, 1), 8) }),
);
const activeDot = computed(() => current.value % dotItems.value.length);

const heroMotionStyle = computed(() => {
  if (!heroMotion.value) return {};
  return {
    "--throw-x": `${heroMotion.value.x}px`,
    "--throw-y": `${heroMotion.value.y}px`,
    "--throw-r": `${heroMotion.value.r}deg`,
  };
});

const motionForSlot = (slot = 0) => {
  const index = Number(slot || 0);
  const isTop = index < 4;
  const isLeft = [0, 1, 4, 5].includes(index);
  const isNear = [1, 2, 5, 6].includes(index);
  return {
    x: (isLeft ? -1 : 1) * (isNear ? 108 : 168),
    y: (isTop ? -1 : 1) * (isNear ? 82 : 102),
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

const hasImage = (path) => {
  const value = String(path ?? "").trim().toLowerCase();
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
      const previousId = currentProduct.value.id ?? currentProduct.value.orderNo;
      goodsList.value = nextGoods;
      const preservedIndex = nextGoods.findIndex(
        (item) => String(item.id ?? item.orderNo) === String(previousId),
      );
      current.value =
        preservedIndex >= 0 ? preservedIndex : Math.min(2, Math.max(0, nextGoods.length - 1));
      dataTransition.value = false;
      await nextTick();
      dataTransition.value = true;
      clearTimeout(dataTransitionTimer);
      dataTransitionTimer = setTimeout(() => {
        dataTransition.value = false;
      }, 760);
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

const handleClick = async () => {
  showLoadingToast({
    message: t("das.started.creating"),
    forbidClick: true,
    duration: 0,
  });
  try {
    const res = await createOrder();
    const order = res.data || {};
    closeToast();
    showToast(t("das.started.created"));
    openOrderDetails(order);
  } catch (error) {
    closeToast();
    if (Number(error?.code) === 907 && error?.data?.id) {
      openOrderDetails(error.data);
      return;
    }
    showToast(error?.msg || error?.message || t("das.started.unableCreate"));
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
  if (tradeResult.status === "fulfilled") {
    tradeInfo.value = tradeResult.value.data || {};
  }
  startCarousel();
});

onUnmounted(() => {
  pageAlive = false;
  clearTimeout(refreshTimer);
  clearTimeout(dataTransitionTimer);
  clearInterval(carouselTimer);
});
</script>

<style scoped>
.started-page {
  background: #ecf3e8;
  color: #17382d;
}
.started-bg {
  background: url("@/static/das/bg-get-started.png") top center/100% auto no-repeat;
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
  background: none;
  color: inherit;
  font-size: 32px;
  font-weight: 200;
}
.started-user button img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: brightness(0) invert(1);
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
  left: calc(50% - var(--hero-half) - var(--mini-peek) - var(--mini-w) - var(--mini-gap));
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
  right: calc(50% - var(--hero-half) - var(--mini-peek) - var(--mini-w) - var(--mini-gap));
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
</style>
