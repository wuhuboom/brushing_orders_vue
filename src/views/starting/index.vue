<template>
  <DmkPcLayout>
    <div class="dmk-site-scope">
      <div class="w-full max-w-[1200px] mx-auto text-white">
        <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="col-span-1">
            <video
              autoplay
              class="w-full h-full object-cover"
              loop
              muted
              playsinline
              style="z-index: 1; width: 100%"
            >
              <source src="/dmk/assets/start-work-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div class="col-span-1">
            <div class="w-[500px] mx-auto hidden lg:block">
              <div
                class="text-5xl font-semibold text-[var(--main-color)] uppercase text-center pt-10"
              >
                {{ $t("das.dmk.startWork") }}
              </div>
              <div class="flex w-full mt-10 justify-center items-center">
                <button
                  type="button"
                  class="dmk-task-circle dmk-start-circle van-circle"
                  :class="{ 'dmk-task-circle--full': taskIsFull }"
                  style="width: 300px; height: 300px"
                  :disabled="creatingOrder"
                  @click="handleClick"
                >
                  <DmkTaskWave :full="taskIsFull" />
                  <svg
                    class="dmk-task-progress"
                    style="transform: rotate(270deg)"
                    viewBox="0 0 1050 1050"
                  >
                    <path
                      class="van-circle__layer"
                      d="M 525 525 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000"
                      style="
                        fill: none;
                        stroke: rgb(90, 110, 26);
                        stroke-width: 50px;
                      "
                    />
                    <path
                      class="van-circle__hover"
                      :style="{ strokeDasharray: taskProgressDash }"
                      d="M 525 525 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000"
                      stroke="rgb(44,185,73)"
                      style="stroke: rgb(44, 185, 73); stroke-width: 51px"
                    />
                  </svg>
                  <div
                    class="w-[300px] h-[300px] flex justify-center items-center bg-black"
                  >
                    <div
                      class="dmk-task-circle__inner w-[240px] h-[240px] bg-[#414c15] rounded-full flex justify-center items-center"
                    >
                      <div class="flex flex-col justify-center items-center">
                        <img
                          alt=""
                          class="w-20"
                          src="/dmk/assets/starting.png"
                        />
                        <p
                          class="dmk-task-circle__count text-5xl font-medium text-white text-center mt-2"
                        >
                          ({{ userInfo.dealCount || 0 }}/{{ orderCount || 0 }})
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
              <div
                class="mt-4 w-[420px] border-[1px] border-[rgb(90,110,26)] rounded-lg p-4 mx-auto"
              >
                <div class="w-full flex justify-between items-center">
                  <p>{{ $t("das.dmk.commission") }}</p>
                  <p>
                    {{ money(userInfo.commission, "0.00") }}
                    {{ $t("das.dmk.currencyUsd") }}
                  </p>
                </div>
                <div>
                  {{ $t("das.dmk.commissionHint") }}
                </div>
                <div class="h-[1px] bg-[var(--main-color)] my-4"></div>
                <div class="w-full flex justify-between items-center">
                  <p>{{ $t("das.dmk.totalBalance") }}</p>
                  <p>
                    {{
                      money(userInfo.totalBalance ?? userInfo.balance, "0.00")
                    }}
                    {{ $t("das.dmk.currencyUsd") }}
                  </p>
                </div>
                <div>{{ $t("das.dmk.balanceHint") }}</div>
                <div class="h-[1px] bg-[var(--main-color)] my-4"></div>
                <div class="w-full flex justify-between items-center">
                  <p>{{ $t("das.dmk.pendingAmount") }}</p>
                  <p>
                    {{
                      money(userInfo.balance, "0.00")
                    }}
                    {{ $t("das.dmk.currencyUsd") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-[#1a1a1a] hidden lg:block text-white">
        <div class="w-full max-w-[1200px] mx-auto py-10">
          <div class="w-full mx-auto text-5xl font-medium text-center py-5">
            {{ $t("das.dmk.history") }}
          </div>
          <div class="w-full bg-transparent dmk-task-history-scope">
            <div class="van-tabs van-tabs--line">
              <div class="van-tabs__wrap">
                <div
                  aria-orientation="horizontal"
                  class="van-tabs__nav van-tabs__nav--line"
                  role="tablist"
                  style="
                    border-color: var(--main-color);
                    background: transparent;
                  "
                >
                  <button
                    v-for="(tab, index) in historyTabs"
                    :key="tab.label"
                    type="button"
                    class="van-tab van-tab--line cursor-pointer"
                    :class="{ 'van-tab--active': historyActive === index }"
                    :aria-selected="historyActive === index"
                    :style="{
                      color:
                        historyActive === index
                          ? 'rgb(255, 255, 255)'
                          : 'rgb(153, 153, 153)',
                    }"
                    role="tab"
                    @click="switchHistoryTab(index)"
                  >
                    <span class="van-tab__text van-tab__text--ellipsis">
                      {{ tab.label }}
                    </span>
                  </button>
                  <div
                    class="van-tabs__line"
                    :style="historyTabLineStyle"
                  ></div>
                </div>
              </div>
            </div>
            <div class="h-[79vh] overflow-y-scroll">
              <div
                class="w-full pl-2 pr-2 pt-6 box-border flex flex-col"
              >
                <div
                  v-for="(item, index) in historyList"
                  :key="item.id || item.orderNo || index"
                  class="w-full bg-[#3c4146] bg-opacity-50 text-xs p-2 rounded-md mb-2 lg:p-8"
                >
                  <div
                    class="w-full flex justify-between items-start pb-2 border-b-[1px] border-[#fff]"
                  >
                    <div
                      class="w-[8rem] h-[8rem] rounded-lg overflow-hidden bg-[#34383c] flex-shrink-0"
                    >
                      <img
                        v-if="hasImage(item.coverUrl)"
                        :src="imageUrl(item.coverUrl)"
                        class="w-full h-full object-cover"
                        :alt="item.goodsName || ''"
                      />
                    </div>
                    <div
                      class="text-[#eee] ml-2 w-full flex-1"
                    >
                      <p class="lg:text-lg">
                        {{ item.goodsName || "—" }}
                      </p>
                      <p
                        class="text-[var(--main-color)] lg:text-lg"
                      >
                        {{ $t("das.dmk.productPrice") }}:
                        {{ money(item.price, "0.00") }}
                        {{ $t("das.dmk.currencyUsd") }}
                      </p>
                    </div>
                    <div
                      class="flex flex-col justify-end items-center"
                    >
                      <p
                        class="text-[10px] lg:text-base text-right w-full"
                      >
                        {{ historyDate(item.createTime ?? item.createdAt) }}
                      </p>
                      <div class="flex w-full justify-end">
                        <button
                          v-if="String(item.status) === '1'"
                          type="button"
                          class="text-black text-xs text-right rounded p-1 lg:p-4 lg:py-2 lg:text-base bg-[var(--main-color)] font-medium"
                          @click="openOrderDetails(item)"
                        >
                          {{ $t("das.common.submit") }}
                        </button>
                        <div
                          v-else
                          class="text-black text-xs text-right rounded p-1 lg:p-4 lg:py-2 lg:text-base bg-[var(--main-color)] font-medium"
                        >
                          {{ historyStatus(item.status) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="w-full flex justify-between items-center mt-4"
                  >
                    <div
                      class="text-xs lg:text-lg text-white"
                    >
                      <p>{{ $t("das.dmk.commRate") }}</p>
                      <p>
                        {{
                          historyRate(
                            item.rebatePercentage ??
                              item.commissionRate ??
                              item.rate,
                          )
                        }}
                      </p>
                    </div>
                    <div
                      class="text-xs lg:text-lg text-white text-center"
                    >
                      <p>{{ $t("das.dmk.profits") }}</p>
                      <p>
                        {{ money(item.commission ?? item.profit, "0.00") }}
                        {{ $t("das.dmk.currencyUsd") }}
                      </p>
                    </div>
                    <div
                      class="text-xs lg:text-lg text-white text-right"
                    >
                      <p>{{ $t("das.dmk.totalRefund") }}</p>
                      <p>
                        {{ money(item.price, "0.00") }}
                        {{ $t("das.dmk.currencyUsd") }}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  v-if="historyLoading"
                  class="w-full py-8 text-center text-[#999]"
                >
                  {{ $t("das.common.loading") }}...
                </div>
                <button
                  v-else-if="!historyFinished"
                  type="button"
                  class="mx-auto my-6 px-8 py-3 text-[#999]"
                  @click="loadHistory()"
                >
                  {{ $t("das.dmk.loadMore") }}
                </button>
                <div
                  v-else-if="!historyList.length"
                  class="w-full py-8 text-center text-[#999]"
                >
                  {{ $t("das.common.noData") }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DmkPcLayout>

  <DmkH5Layout class="dmk-mobile-current">
    <div class="w-full dmk-site-scope">
      <div class="w-full max-w-[1200px] mx-auto text-white">
        <div class="text-[var(--main-color)] text-lg px-4">
          <p>{{ $t("das.dmk.totalBalance") }}</p>
          <p>
            {{ h5Amount(userInfo.totalBalance ?? userInfo.balance) }}
            {{ $t("das.dmk.currencyUsd") }}
          </p>
          <p class="text-xs text-white">
            {{ $t("das.dmk.balanceHint") }}
          </p>
        </div>

        <div class="w-full grid grid-cols-1 gap-4">
          <div class="col-span-1">
            <video
              autoplay
              class="w-full h-full object-cover"
              loop
              muted
              playsinline
              style="z-index: 1; width: 100%"
            >
              <source src="/dmk/assets/start-work-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div class="col-span-1">
            <div class="w-full px-4 flex justify-between items-center">
              <div class="w-1/2">
                <div class="text-lg text-[var(--main-color)]">
                  <p>{{ $t("das.dmk.commission") }}</p>
                  <p>
                    {{ h5Amount(userInfo.commission) }}
                    {{ $t("das.dmk.currencyUsd") }}
                  </p>
                  <p class="text-white text-xs">
                    {{ $t("das.dmk.commissionHint") }}
                  </p>
                  <div class="w-full flex flex-col mt-4">
                    <p>{{ $t("das.dmk.pendingAmount") }}</p>
                    <p>
                      {{
                        h5Amount(userInfo.balance)
                      }}
                      {{ $t("das.dmk.currencyUsd") }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="w-1/2 flex justify-end items-center">
                <button
                  type="button"
                  class="dmk-task-circle dmk-h5-start-circle van-circle"
                  :class="{ 'dmk-task-circle--full': taskIsFull }"
                  style="width: 150px; height: 150px"
                  :disabled="creatingOrder"
                  @click="handleClick"
                >
                  <DmkTaskWave :full="taskIsFull" />
                  <svg
                    class="dmk-task-progress"
                    style="transform: rotate(270deg)"
                    viewBox="0 0 1040 1040"
                  >
                    <path
                      class="van-circle__layer"
                      d="M 520 520 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000"
                      style="
                        fill: none;
                        stroke: rgb(90, 110, 26);
                        stroke-width: 40px;
                      "
                    ></path>
                    <path
                      class="van-circle__hover"
                      :style="{ strokeDasharray: taskProgressDash }"
                      d="M 520 520 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000"
                      stroke="rgb(44,185,73)"
                      style="stroke: rgb(44, 185, 73); stroke-width: 41px"
                    ></path>
                  </svg>
                  <div
                    class="w-[150px] h-[150px] flex justify-center items-center bg-black"
                  >
                    <div
                      class="dmk-task-circle__inner w-[120px] h-[120px] bg-[#414c15] rounded-full flex justify-center items-center"
                    >
                      <div class="flex flex-col justify-center items-center">
                        <img
                          alt=""
                          class="w-10"
                          src="/dmk/assets/starting.png"
                        />
                        <p
                          class="dmk-task-circle__count text-xl font-medium text-white text-center mt-2"
                        >
                          ({{ userInfo.dealCount || 0 }}/{{ orderCount || 0 }})
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="w-full px-4 mt-4 bg-[#1a1a1a] py-4 text-left"
          @click="safePush(router, '/records')"
        >
          <i
            class="van-badge__wrapper van-icon van-icon-play"
            style="color: var(--main-color); transform: rotate(-90deg)"
          ></i>
          <p class="text-xl font-medium">{{ $t("das.dmk.history") }}</p>
        </button>
      </div>
    </div>

  </DmkH5Layout>

  <BonusDialog
    :show="bonusVisible"
    :amount="bonusAmount"
    @close="closeBonus"
  />
  <van-dialog
    :show="startAnimationVisible"
    class="start-loading-dialog"
    :show-confirm-button="false"
    :close-on-click-overlay="false"
  >
    <div
      class="start-loading-animation"
      role="status"
      :aria-label="$t('das.common.loading')"
    >
      <div class="start-loading-animation__brand" aria-hidden="true">Bavor</div>
      <div class="start-loading-animation__scanner" aria-hidden="true">
        <span class="start-loading-animation__ticks"></span>
        <span class="start-loading-animation__orbit"></span>
        <span class="start-loading-animation__sweep"></span>
        <span class="start-loading-animation__core">
          <img src="/dmk/assets/starting.png" alt="" />
        </span>
      </div>
      <p class="start-loading-animation__label">
        {{ $t("das.common.loading") }}
      </p>
      <div class="start-loading-animation__signal" aria-hidden="true">
        <i></i><i></i><i></i><i></i><i></i>
      </div>
    </div>
  </van-dialog>

  <DmkSubmitTask
    v-model:show="submitTaskVisible"
    :order="submitTaskOrder"
    :submit-delay-ms="tradeInfo.submitTaskDelayMs"
    @submitted="handleTaskSubmitted"
    @navigate="handleSubmitNavigate"
  />
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { closeToast, showLoadingToast, showToast } from "vant";
import {
  createOrder,
  getGoodsList,
  getOrderInfos,
  getTradeConfig,
  userGetInfo,
} from "@/api/apis";
import BonusDialog from "@/components/BonusDialog.vue";
import DmkSubmitTask from "@/components/dmk/DmkSubmitTask.vue";
import DmkTaskWave from "@/components/dmk/DmkTaskWave.vue";
import DmkPcLayout from "@/components/dmkPc/DmkPcLayout.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import { safePush } from "@/utils/navigation";
import { getOrderErrorMessage } from "@/utils/orderCreate";
import { openCustomerServiceDialog } from "@/utils/customerServiceDialog";

const router = useRouter();
const { t } = useI18n();
const apiImageUrl = window.g?.VITE_API_IMG_URL || "";
const userInfo = ref({});
const levelIconFailed = ref(false);
const tradeInfo = ref({});
const goodsList = ref([]);
const historyTabs = computed(() => [
  { label: t("das.records.all"), status: "" },
  { label: t("das.records.pending"), status: "1" },
  { label: t("das.records.completed"), status: "0" },
]);
const historyActive = ref(0);
const historyList = ref([]);
const historyLoading = ref(false);
const historyFinished = ref(false);
const historyPage = ref(1);
const orderCount = ref(40);
const taskProgress = ref(0);
let taskProgressFrame;
let taskProgressRevealed = false;
const taskProgressTarget = computed(() => {
  const completed = Number(userInfo.value.dealCount ?? 0);
  const limit = Number(orderCount.value);
  return Number.isFinite(completed) && Number.isFinite(limit) && limit > 0
    ? Math.min(1, Math.max(0, completed / limit))
    : 0;
});
const taskProgressDash = computed(() => {
  return `${(3140 * taskProgress.value).toFixed(2)}px, 3140px`;
});
const taskIsFull = computed(() => {
  const completed = Number(userInfo.value.dealCount ?? 0);
  const limit = Number(orderCount.value);
  return (
    Number.isFinite(completed) &&
    Number.isFinite(limit) &&
    limit > 0 &&
    completed >= limit
  );
});
const current = ref(0);
const heroMotion = ref(null);
const dataTransition = ref(false);
const bonusVisible = ref(false);
const bonusAmount = ref("");
const creatingOrder = ref(false);
const startAnimationVisible = ref(false);
const submitTaskVisible = ref(false);
const submitTaskOrder = ref({});
let refreshHistoryOnTaskClose = false;
let refreshTimer;
let carouselTimer;
let dataTransitionTimer;
let startDelayTimer;
let tradeConfigRequest;
let historyRequestVersion = 0;
let historyController;
let pageAlive = false;
const AUTO_DELAY = 3000;
const SOURCE_SLOT_ORDER = [0, 3, 7, 4, 1, 2, 6, 5];
let sourceSlotCursor = 0;

watch(taskProgressTarget, (value) => {
  if (!pageAlive) return;
  window.cancelAnimationFrame(taskProgressFrame);
  if (taskProgressRevealed) {
    taskProgress.value = value;
    return;
  }
  taskProgress.value = 0;
  taskProgressFrame = window.requestAnimationFrame(() => {
    taskProgressFrame = window.requestAnimationFrame(() => {
      taskProgressRevealed = true;
      taskProgress.value = value;
    });
  });
});

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

const historyTabLineStyle = computed(() => ({
  width: "50px",
  backgroundColor: "var(--main-color)",
  transform: `translateX(${200 + historyActive.value * 400}px) translateX(-50%)`,
  transitionDuration: ".3s",
}));
const historyRate = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  const text = String(value);
  if (text.includes("%")) return text;
  const number = Number(value);
  return Number.isFinite(number) ? `${number}%` : text;
};
const historyStatus = (status) =>
  String(status) === "0"
    ? t("das.records.completed")
    : String(status) === "2"
      ? t("das.records.frozen")
      : t("das.records.pending");
const historyDate = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime()))
    return String(value).replace("T", " ").slice(0, 19);
  return parsed
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .replace(/^(\d{2})\/(\d{2})\/(\d{4}), /, "$3-$1-$2 ");
};
const cancelHistoryRequest = () => {
  historyRequestVersion += 1;
  historyController?.abort();
  historyController = undefined;
  historyLoading.value = false;
};
const loadHistory = async ({ replace = false } = {}) => {
  if (historyLoading.value) return;
  const version = ++historyRequestVersion;
  const controller = new AbortController();
  historyController = controller;
  historyLoading.value = true;
  const pageNum = replace ? 1 : historyPage.value;
  const pageSize = 10;
  try {
    const response = await getOrderInfos(
      {
        pageNum,
        pageSize,
        status: historyTabs.value[historyActive.value].status,
      },
      { signal: controller.signal },
    );
    if (version !== historyRequestVersion) return;
    const rows = response.rows || [];
    historyList.value = replace ? rows : [...historyList.value, ...rows];
    const total = Number(response.total || 0);
    historyFinished.value =
      rows.length < pageSize ||
      (total > 0 && historyList.value.length >= total);
    historyPage.value = pageNum + 1;
  } catch (_) {
    if (!controller.signal.aborted && version === historyRequestVersion) {
      historyFinished.value = true;
    }
  } finally {
    if (version === historyRequestVersion) {
      historyController = undefined;
      historyLoading.value = false;
    }
  }
};
const switchHistoryTab = (index) => {
  if (historyActive.value === index) return;
  cancelHistoryRequest();
  historyActive.value = index;
  historyList.value = [];
  historyPage.value = 1;
  historyFinished.value = false;
  loadHistory({ replace: true });
};

const h5Amount = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    useGrouping: false,
    minimumFractionDigits: 0,
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

const openOrderDetails = (order, { refreshOnClose = false } = {}) => {
  if (!order?.id) return;
  refreshHistoryOnTaskClose = refreshOnClose;
  submitTaskOrder.value = order;
  submitTaskVisible.value = true;
};

const refreshAfterSubmit = async () => {
  cancelHistoryRequest();
  historyPage.value = 1;
  historyFinished.value = false;
  const [userResult] = await Promise.allSettled([
    userGetInfo(),
    loadHistory({ replace: true }),
  ]);
  if (!pageAlive || userResult.status !== "fulfilled") return;
  userInfo.value = userResult.value.data || {};
  levelIconFailed.value = false;
  orderCount.value = userResult.value.data?.userLevel?.orderCount || 40;
};

const handleTaskSubmitted = (updatedOrder) => {
  refreshHistoryOnTaskClose = false;
  submitTaskOrder.value = updatedOrder || submitTaskOrder.value;
  refreshAfterSubmit();
};

const handleSubmitNavigate = (path) => {
  refreshHistoryOnTaskClose = false;
  submitTaskVisible.value = false;
  if (path === "/contact") {
    openCustomerServiceDialog();
    return;
  }
  safePush(router, path);
};

watch(submitTaskVisible, (visible, wasVisible) => {
  if (visible || !wasVisible) return;

  const shouldRefresh =
    refreshHistoryOnTaskClose &&
    window.matchMedia("(min-width: 1024px)").matches;
  refreshHistoryOnTaskClose = false;

  if (shouldRefresh) {
    refreshAfterSubmit();
  }
});

const closeBonus = () => {
  bonusVisible.value = false;
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
    openOrderDetails(order, { refreshOnClose: true });
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
  getList();
  loadHistory({ replace: true });
  const [userResult, tradeResult] = await Promise.allSettled([
    userGetInfo(),
    loadTradeConfig(),
  ]);
  if (!pageAlive) return;
  if (userResult.status === "fulfilled") {
    userInfo.value = userResult.value.data || {};
    levelIconFailed.value = false;
    orderCount.value = userResult.value.data?.userLevel?.orderCount || 40;
  }
  if (tradeResult.status === "fulfilled") {
    tradeInfo.value = tradeResult.value?.data || tradeInfo.value;
  }
  startCarousel();
});

onUnmounted(() => {
  pageAlive = false;
  window.cancelAnimationFrame(taskProgressFrame);
  cancelHistoryRequest();
  clearTimeout(refreshTimer);
  clearTimeout(dataTransitionTimer);
  clearTimeout(startDelayTimer);
  clearInterval(carouselTimer);
});
</script>

<style scoped>
.dmk-task-circle {
  --task-ring-color: #2cb949;
  --task-track-color: #5a6e1a;
  --task-core-color: #414c15;
  --task-wave-color: rgba(44, 185, 73, 0.68);
  position: relative;
  overflow: visible;
  isolation: isolate;
  border-radius: 50%;
}
.dmk-task-circle--full {
  --task-ring-color: #ff3b3b;
  --task-track-color: #792525;
  --task-core-color: #581d1d;
  --task-wave-color: rgba(255, 59, 59, 0.7);
}
.dmk-task-progress {
  z-index: 2;
  animation: dmk-task-ring-glow 1.65s ease-in-out infinite;
}
.dmk-task-circle > div {
  position: relative;
  z-index: 1;
  overflow: hidden;
  border-radius: 50%;
}
.dmk-task-circle .van-circle__layer {
  stroke: var(--task-track-color) !important;
  transition: stroke 0.35s ease;
}
.dmk-task-circle .van-circle__hover {
  stroke: var(--task-ring-color) !important;
  stroke-linecap: round;
  filter: drop-shadow(0 0 8px var(--task-wave-color));
  transition:
    stroke 0.35s ease,
    stroke-dasharray 1.6s cubic-bezier(0.2, 0.72, 0.24, 1);
}
.dmk-task-circle__inner {
  background: var(--task-core-color) !important;
  transition:
    background-color 0.35s ease,
    box-shadow 0.35s ease;
  box-shadow: inset 0 0 34px rgba(0, 0, 0, 0.22);
}
.dmk-task-circle--full .dmk-task-circle__inner {
  box-shadow:
    inset 0 0 34px rgba(0, 0, 0, 0.25),
    0 0 24px rgba(255, 59, 59, 0.18);
}
.dmk-task-circle__count {
  transition: color 0.35s ease;
}
.dmk-task-circle--full .dmk-task-circle__count {
  color: #ffb4b4 !important;
}
@keyframes dmk-task-ring-glow {
  0%,
  100% {
    filter: drop-shadow(0 0 2px var(--task-wave-color));
  }
  50% {
    filter: drop-shadow(0 0 13px var(--task-wave-color));
  }
}
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
}
.product-copy button:disabled {
  opacity: 0.65;
}
:deep(.start-loading-dialog) {
  width: min(74vw, 268px);
  overflow: visible;
  border: 1px solid rgba(204, 255, 48, 0.28);
  border-radius: 26px;
  background: transparent;
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.72),
    0 0 36px rgba(204, 255, 48, 0.1);
}
.start-loading-animation {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 18px 18px;
  overflow: hidden;
  border-radius: 25px;
  background:
    radial-gradient(
      circle at 50% 42%,
      rgba(204, 255, 48, 0.09),
      transparent 42%
    ),
    linear-gradient(145deg, #181b17 0%, #0b0d0c 62%, #12150f 100%);
}
.start-loading-animation::before {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(204, 255, 48, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(204, 255, 48, 0.025) 1px, transparent 1px);
  background-size: 18px 18px;
  content: "";
  pointer-events: none;
}
.start-loading-animation::after {
  position: absolute;
  right: -35px;
  bottom: -48px;
  width: 120px;
  height: 120px;
  border: 1px solid rgba(204, 255, 48, 0.1);
  border-radius: 50%;
  content: "";
  box-shadow:
    0 0 0 14px rgba(204, 255, 48, 0.025),
    0 0 0 30px rgba(204, 255, 48, 0.018);
}
.start-loading-animation__brand {
  position: relative;
  align-self: flex-start;
  color: #fff;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.8px;
}
.start-loading-animation__brand::after {
  display: inline-block;
  width: 5px;
  height: 5px;
  margin-left: 7px;
  border-radius: 50%;
  background: var(--main-color);
  box-shadow: 0 0 9px var(--main-color);
  content: "";
  vertical-align: 3px;
  animation: start-loading-status 1.1s ease-in-out infinite;
}
.start-loading-animation__scanner {
  position: relative;
  width: 132px;
  height: 132px;
  margin-top: 5px;
  display: grid;
  place-items: center;
}
.start-loading-animation__ticks,
.start-loading-animation__orbit,
.start-loading-animation__sweep,
.start-loading-animation__core {
  position: absolute;
  border-radius: 50%;
}
.start-loading-animation__ticks {
  inset: 0;
  background: repeating-conic-gradient(
    from 0deg,
    rgba(204, 255, 48, 0.95) 0deg 2deg,
    transparent 2deg 10deg
  );
  -webkit-mask: radial-gradient(
    circle,
    transparent 0 55%,
    #000 56% 62%,
    transparent 63%
  );
  mask: radial-gradient(
    circle,
    transparent 0 55%,
    #000 56% 62%,
    transparent 63%
  );
  opacity: 0.72;
  animation: start-loading-rotate 8s linear infinite;
}
.start-loading-animation__orbit {
  inset: 12px;
  border: 1px solid rgba(204, 255, 48, 0.24);
  animation: start-loading-rotate 2.2s linear infinite;
}
.start-loading-animation__orbit::before,
.start-loading-animation__orbit::after {
  position: absolute;
  top: 50%;
  width: 7px;
  height: 7px;
  margin-top: -3.5px;
  border-radius: 50%;
  background: var(--main-color);
  box-shadow:
    0 0 8px var(--main-color),
    0 0 18px rgba(204, 255, 48, 0.65);
  content: "";
}
.start-loading-animation__orbit::before {
  left: -4px;
}
.start-loading-animation__orbit::after {
  right: -4px;
  opacity: 0.35;
}
.start-loading-animation__sweep {
  inset: 20px;
  background: conic-gradient(
    from 90deg,
    transparent 0 64%,
    rgba(204, 255, 48, 0.04) 72%,
    rgba(204, 255, 48, 0.72) 99%,
    transparent 100%
  );
  -webkit-mask: radial-gradient(circle, transparent 0 72%, #000 73% 100%);
  mask: radial-gradient(circle, transparent 0 72%, #000 73% 100%);
  filter: drop-shadow(0 0 4px rgba(204, 255, 48, 0.7));
  animation: start-loading-rotate 1.35s linear infinite;
}
.start-loading-animation__core {
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(204, 255, 48, 0.5);
  background: linear-gradient(145deg, #4b581b, #252d0e);
  box-shadow:
    inset 0 0 0 6px rgba(0, 0, 0, 0.3),
    0 0 0 8px rgba(204, 255, 48, 0.05),
    0 0 24px rgba(204, 255, 48, 0.18);
  animation: start-loading-core 1.45s ease-in-out infinite;
}
.start-loading-animation__core img {
  display: block;
  width: 33px;
  height: auto;
  filter: brightness(0) invert(1);
}
.start-loading-animation__label {
  position: relative;
  margin: 1px 0 7px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.start-loading-animation__signal {
  position: relative;
  height: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.start-loading-animation__signal i {
  width: 3px;
  height: 5px;
  border-radius: 999px;
  background: var(--main-color);
  box-shadow: 0 0 5px rgba(204, 255, 48, 0.45);
  animation: start-loading-signal 0.85s ease-in-out infinite alternate;
}
.start-loading-animation__signal i:nth-child(2),
.start-loading-animation__signal i:nth-child(4) {
  animation-delay: -0.2s;
}
.start-loading-animation__signal i:nth-child(3) {
  animation-delay: -0.4s;
}
@keyframes start-loading-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes start-loading-core {
  0%,
  100% {
    transform: scale(0.96);
    box-shadow:
      inset 0 0 0 6px rgba(0, 0, 0, 0.3),
      0 0 0 7px rgba(204, 255, 48, 0.04),
      0 0 18px rgba(204, 255, 48, 0.13);
  }
  50% {
    transform: scale(1.03);
    box-shadow:
      inset 0 0 0 6px rgba(0, 0, 0, 0.3),
      0 0 0 11px rgba(204, 255, 48, 0.07),
      0 0 29px rgba(204, 255, 48, 0.28);
  }
}
@keyframes start-loading-signal {
  to {
    height: 13px;
    opacity: 0.45;
  }
}
@keyframes start-loading-status {
  50% {
    opacity: 0.3;
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
  .dmk-task-circle .van-circle__hover {
    transition: none;
  }
  .dmk-task-progress,
  .product-stage__hero.is-throwing,
  .started-bg.is-data-transitioning .product-stage__hero,
  .started-bg.is-data-transitioning .product-stage__mini,
  .started-bg.is-data-transitioning .product-copy {
    animation: none;
  }
}
</style>
