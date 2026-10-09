<template>
  <main class="das-page started-page starting-page">
    <HeaderTop />
    <div class="starting-top-strip" aria-hidden="true"></div>
    <div class="starting-main">
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
      <section class="starting-carousel">
        <div class="starting-carousel__viewport">
          <div
            class="starting-carousel__track"
            :style="{
              '--starting-carousel-duration':
                Math.max(36, Math.min(displayGoods.length, 50) * 6) + 's',
            }"
          >
            <div
              v-for="group in 2"
              :key="group"
              class="starting-carousel__group"
              :aria-hidden="group === 2 ? true : undefined"
            >
              <article
                v-for="(item, index) in displayGoods.slice(0, 50)"
                :key="item.id || index"
                class="starting-product-card"
              >
                <button
                  class="starting-product-card__image"
                  type="button"
                  :tabindex="group === 2 ? -1 : 0"
                  @click="selectBackdrop({ item, index, slot: index % 8 })"
                >
                  <img
                    v-if="hasImage(item.coverUrl)"
                    :src="imageUrl(item.coverUrl)"
                    :alt="item.goodsName || ''"
                  /><DasImagePlaceholder v-else />
                </button>
                <h2>{{ item.goodsName || $t("das.page.productDetails") }}</h2>
                <div class="starting-product-card__rate">
                  <svg
                    viewBox="0 0 576 512"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                    /></svg
                  >{{ ratingText(item.rating) }}
                </div>
                <p>
                  {{ $t("das.started.price") }}:
                  <strong>{{ money(item.price, "0.00") }} USD</strong>
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
      <button class="starting-action" type="button" @click="handleClick">
        {{ $t("das.started.startNow") }} ({{ userInfo.dealCount || 0 }}/{{
          orderCount || 0
        }})
      </button>
      <section class="starting-summary">
        <img
          class="starting-summary__rocket"
          src="@/static/brain/commission.png"
          alt=""
        />
        <h2>{{ $t("das.profile.commission") }}</h2>
        <strong class="starting-summary__commission"
          >{{ money(userInfo.commission, "0.00") }} USD</strong
        >
        <p>{{ $t("das.started.marginHint") }}</p>
        <div class="starting-summary__divider"></div>
        <div class="starting-summary__grid">
          <article>
            <img src="@/static/brain/started-balance.png" alt="" />
            <h3>{{ $t("das.profile.balance") }}</h3>
            <strong>{{ money(userInfo.balance, "0.00") }} USD</strong>
            <p>{{ $t("das.started.balanceHint") }}</p>
          </article>
          <article>
            <img src="@/static/brain/frozen.png" alt="" />
            <h3>{{ $t("das.profile.frozen") }}</h3>
            <strong>{{ money(userInfo.frozenBalance, "0.00") }} USD</strong>
            <p>{{ $t("das.started.frozenHint") }}</p>
          </article>
        </div>
      </section>
      <section class="starting-notice">
        <h2>{{ $t("das.started.notice") }}:</h2>
        <p>{{ noticeText }}</p>
      </section>
      <p class="starting-footer">{{ $t("das.common.copyright") }}</p>
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


