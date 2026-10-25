<template>
  <StartingView v-if="isDesktop" />

  <DmkH5Layout v-else class="dmk-mobile-current">
    <div class="w-full max-w-[1200px] mx-auto text-white">
      <div class="text-[var(--main-color)] text-lg px-4">
        <p>{{ $t("das.dmk.totalBalance") }}</p>
        <p>{{ h5Amount(userInfo.totalBalance ?? userInfo.balance) }} {{ $t("das.dmk.currencyUsd") }}</p>
        <p class="text-xs text-white">{{ $t("das.dmk.balanceHint") }}</p>
      </div>
      <div class="w-full grid grid-cols-1 gap-4">
        <div class="col-span-1">
          <video autoplay class="w-full h-full" loop muted playsinline style="z-index:1;width:100%">
            <source src="/dmk/assets/start-work-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div class="col-span-1">
          <div class="w-full px-4 flex justify-between items-center">
            <div class="w-1/2">
              <div class="text-lg text-[var(--main-color)]">
                <p>{{ $t("das.dmk.commission") }}</p>
                <p>{{ h5Amount(userInfo.commission) }} {{ $t("das.dmk.currencyUsd") }}</p>
                <p class="text-white text-xs">{{ $t("das.dmk.commissionHint") }}</p>
                <div class="w-full flex flex-col mt-4">
                  <p>{{ $t("das.dmk.pendingAmount") }}</p>
                  <p>{{ h5Amount(userInfo.balance) }} {{ $t("das.dmk.currencyUsd") }}</p>
                </div>
              </div>
            </div>
            <div class="w-1/2 flex justify-end items-center">
              <div class="van-circle" style="width:150px;height:150px">
                <svg style="transform:rotate(270deg)" viewBox="0 0 1040 1040">
                  <path class="van-circle__layer" d="M 520 520 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000" style="fill:none;stroke:rgb(90,110,26);stroke-width:40px"></path>
                  <path class="van-circle__hover" d="M 520 520 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000" stroke="rgb(44,185,73)" style="stroke:rgb(44,185,73);stroke-width:41px;stroke-dasharray:3140px,3140px"></path>
                </svg>
                <div class="w-[150px] h-[150px] flex justify-center items-center bg-black">
                  <div class="w-[120px] h-[120px] bg-[#414c15] rounded-full flex justify-center items-center">
                    <div class="flex flex-col justify-center items-center">
                      <img alt="" class="w-10" src="/dmk/assets/starting.png" />
                      <p class="text-xl font-medium text-white text-center mt-2">({{ userInfo.dealCount || 0 }}/{{ h5OrderCount }})</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full px-4 mt-4 bg-[#1a1a1a] py-4">
        <i class="van-badge__wrapper van-icon van-icon-play" style="color:var(--main-color);transform:rotate(-90deg)"></i>
        <p class="text-xl font-medium">{{ $t("das.dmk.history") }}</p>
      </div>
    </div>

    <div class="van-overlay" role="button" tabindex="0" style="z-index:2050" @click="safeBack(router, '/starting')"></div>
    <div class="van-popup van-popup--bottom" role="dialog" tabindex="0" style="z-index:2050;background:rgba(0,0,0,.5);height:70%">
      <div class="w-full">
        <button type="button" class="px-4 w-full text-left text-white" @click="safeBack(router, '/starting')">
          <i class="van-badge__wrapper van-icon van-icon-play" style="color:var(--main-color);transform:rotate(90deg)"></i>
          <p class="text-xl font-medium">{{ $t("das.dmk.history") }}</p>
        </button>
        <div class="w-full bg-transparent dmk-task-history-scope">
          <div class="van-tabs van-tabs--line">
            <div class="van-tabs__wrap">
              <div class="van-tabs__nav van-tabs__nav--line" role="tablist" style="border-color:var(--main-color)">
                <div v-for="(tab,index) in tabs" :key="tab.label" class="van-tab van-tab--line cursor-pointer" :class="{ 'van-tab--active': active === index }" :style="{ color: active === index ? 'rgb(255,255,255)' : 'rgb(153,153,153)' }" @click="switchTab(index)"><span class="van-tab__text van-tab__text--ellipsis">{{ h5TabLabel(tab) }}</span></div>
                <div class="van-tabs__line" :style="h5TabLineStyle"></div>
              </div>
            </div>
          </div>
          <div class="h-[79vh] overflow-y-scroll">
            <div class="w-full pl-2 pr-2 pt-6 box-border flex flex-col">
              <div class="van-pull-refresh"><div class="van-pull-refresh__track"><div class="van-pull-refresh__head"></div>
                <div class="van-list" role="feed">
                  <div v-for="item in list" :key="item.id || item.orderNo">
                    <button type="button" class="w-full bg-[#3c4146] bg-opacity-50 text-xs p-2 rounded-md mb-2 text-left" @click="openOrderDetails(item)">
                      <div class="w-full flex justify-between items-start pb-2 border-b-[1px] border-[#fff]">
                        <img :src="h5ImageUrl(item.coverUrl)" :alt="item.goodsName || ''" class="w-[4rem] h-[4rem] rounded-lg object-cover" />
                        <div class="text-[#eee] ml-2 w-full flex-1">
                          <p>{{ item.goodsName || '—' }}</p>
                          <p class="text-[var(--main-color)]">{{ $t("das.dmk.productPrice") }}: {{ h5Money(item.price) }} {{ $t("das.dmk.currencyUsd") }}</p>
                        </div>
                        <div class="flex flex-col justify-end items-center">
                          <p class="text-[10px] text-right w-full">{{ h5Date(item.createTime) }}</p>
                          <div class="flex w-full justify-end">
                            <div class="text-black text-xs text-right rounded p-1 bg-[var(--main-color)] font-medium">
                    {{ String(item.status) === "1" ? $t("das.common.submit") : h5Status(item.status) }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="w-full flex justify-between items-center mt-4">
                        <div class="text-xs text-white"><p>{{ $t("das.dmk.commRate") }}</p><p>{{ h5Rate(item.rebatePercentage ?? item.commissionRate ?? item.rate) }}</p></div>
                        <div class="text-xs text-white"><p>{{ $t("das.dmk.profits") }}</p><p>{{ h5Money(item.totalCommission ?? item.commission ?? item.profit) }} {{ $t("das.dmk.currencyUsd") }}</p></div>
                        <div class="text-xs text-white"><p>{{ $t("das.dmk.totalRefund") }}</p><p>{{ h5Amount(item.price ?? item.totalAmount) }} {{ $t("das.dmk.currencyUsd") }}</p></div>
                      </div>
                    </button>
                  </div>
                  <div v-if="loading" class="van-list__loading">{{ $t("das.common.loading") }}</div>
                  <div v-else-if="finished" class="van-list__finished-text">{{ $t("das.dmk.noMoreData") }}</div>
                  <button v-else type="button" class="w-full py-3 text-[#999]" @click="onLoad">{{ $t("das.dmk.loadMore") }}</button>
                </div>
              </div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DmkH5Layout>

  <DmkSubmitTask
    v-model:show="submitTaskVisible"
    :order="submitTaskOrder"
    @submitted="refreshAfterSubmit"
    @navigate="safePush(router, $event)"
  />
</template>
<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getOrderInfos, userGetInfo } from "@/api/apis";
import StartingView from "@/views/starting/index.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import DmkSubmitTask from "@/components/dmk/DmkSubmitTask.vue";
import h5Placeholder from "@/static/das/image-placeholder.png";
import { safeBack, safePush } from "@/utils/navigation";
import { getPcBreakpoint } from "@/responsiveMode";
import { useI18n } from "vue-i18n";
const desktopQuery = window.matchMedia(`(min-width: ${getPcBreakpoint()}px)`);
const isDesktop = ref(desktopQuery.matches);
const router = useRouter(),
  route = useRoute(),
  userInfo = ref({}),
  active = ref(0),
  list = ref([]),
  loading = ref(false),
  refreshing = ref(false),
  finished = ref(false),
  submitTaskVisible = ref(false),
  submitTaskOrder = ref({}),
  query = reactive({ pageNum: 1, pageSize: 10, status: "" });
const { t, locale } = useI18n();
const tabs = [
    { label: "das.records.all", status: "" },
    { label: "das.records.pending", status: "1" },
    { label: "das.records.completed", status: "0" },
  ];
const openOrderDetails = (item) => {
  if (String(item.status) !== "1") return;
  submitTaskOrder.value = item;
  submitTaskVisible.value = true;
};
const refreshAfterSubmit = async () => {
  cancelPendingRequest();
  resetList();
  const [userResult] = await Promise.allSettled([
    userGetInfo(),
    loadData({ replace: true }),
  ]);
  if (userResult.status === "fulfilled") {
    userInfo.value = userResult.value.data || {};
  }
};
const h5ImageBase = window.g?.VITE_API_IMG_URL || "";
const h5ImageUrl = (path) => path ? (/^https?:/i.test(String(path)) ? path : `${h5ImageBase}${path}`) : h5Placeholder;
const h5Money = (value) => Number(value || 0).toLocaleString(locale.value, { useGrouping: false, minimumFractionDigits: 2, maximumFractionDigits: 2 });
const h5Amount = (value) => Number(value || 0).toLocaleString(locale.value, { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 2 });
const h5Rate = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  const text = String(value);
  if (text.includes("%")) return text;
  const number = Number(value);
  return Number.isFinite(number) ? `${number}%` : text;
};
const h5Date = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleString(locale.value, { year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "2-digit", second: "2-digit" });
  }
  return String(value).replace("T", " ").slice(0, 19);
};
const h5Status = (status) => String(status) === "0"
  ? t("das.records.completed")
  : String(status) === "2"
    ? t("das.records.frozen")
    : t("das.records.pending");
const h5TabLabel = (tab) => t(tab.label);
const h5TabLineStyle = computed(() => ({
  backgroundColor: "var(--main-color)",
  width: "40px",
  transform: `translateX(calc((100vw / 3) * ${active.value + 0.5})) translateX(-50%)`,
  transitionDuration: ".3s",
}));
const h5OrderCount = computed(() => userInfo.value.userLevel?.orderCount || userInfo.value.memberLevel?.orderCount || 40);

let requestVersion = 0;
let requestInFlight = false;
let requestController;
let tabSwitchTimer;

const cancelPendingRequest = () => {
  clearTimeout(tabSwitchTimer);
  tabSwitchTimer = undefined;
  requestVersion += 1;
  requestController?.abort();
  requestController = undefined;
  requestInFlight = false;
};

const resetList = () => {
  query.pageNum = 1;
  list.value = [];
  finished.value = false;
};

const loadData = async ({ replace = false } = {}) => {
  if (requestInFlight) {
    loading.value = false;
    return;
  }
  const version = ++requestVersion;
  const controller = new AbortController();
  requestController = controller;
  requestInFlight = true;
  loading.value = true;
  const params = { ...query, pageNum: replace ? 1 : query.pageNum };
  try {
    const r = await getOrderInfos(params, { signal: controller.signal });
    if (version !== requestVersion) return;
    const rows = r.rows || [];
    list.value = replace ? rows : [...list.value, ...rows];
    const total = Number(r.total || 0);
    finished.value =
      rows.length < params.pageSize || (total > 0 && list.value.length >= total);
    if (!finished.value) query.pageNum = params.pageNum + 1;
  } catch (error) {
    if (!controller.signal.aborted && version === requestVersion) finished.value = true;
  } finally {
    if (version === requestVersion) {
      requestController = undefined;
      requestInFlight = false;
      loading.value = false;
      refreshing.value = false;
    }
  }
};
const onLoad = async () => {
    if (finished.value) {
      loading.value = false;
      return;
    }
    await loadData();
  },
  onRefresh = async () => {
    cancelPendingRequest();
    refreshing.value = true;
    resetList();
    await loadData({ replace: true });
  },
  switchTab = (i) => {
    if (active.value === i) return;
    cancelPendingRequest();
    active.value = i;
    query.status = tabs[i].status;
    resetList();
    loading.value = true;
    tabSwitchTimer = setTimeout(() => {
      tabSwitchTimer = undefined;
      loadData({ replace: true });
    }, 180);
  };

const syncDesktop = (event) => {
  const matches = typeof event?.matches === "boolean"
    ? event.matches
    : desktopQuery.matches;
  isDesktop.value = matches;
  if (!matches && !list.value.length && !loading.value && !finished.value) {
    loadData({ replace: true });
  }
};
if (desktopQuery.addEventListener) {
  desktopQuery.addEventListener("change", syncDesktop);
} else {
  desktopQuery.addListener?.(syncDesktop);
}
const recordsResizeObserver = typeof ResizeObserver === "undefined"
  ? null
  : new ResizeObserver(syncDesktop);
recordsResizeObserver?.observe(document.documentElement);
window.addEventListener("resize", syncDesktop, { passive: true });
window.visualViewport?.addEventListener("resize", syncDesktop, {
  passive: true,
});

onMounted(async () => {
  if (route.query.tab === "pending") {
    active.value = 1;
    query.status = tabs[1].status;
  }

  if (!isDesktop.value) loadData({ replace: true });

  try { userInfo.value = (await userGetInfo()).data || {}; } catch (_) {}
});
onBeforeUnmount(() => {
  cancelPendingRequest();
  if (desktopQuery.removeEventListener) {
    desktopQuery.removeEventListener("change", syncDesktop);
  } else {
    desktopQuery.removeListener?.(syncDesktop);
  }
  recordsResizeObserver?.disconnect();
  window.removeEventListener("resize", syncDesktop);
  window.visualViewport?.removeEventListener("resize", syncDesktop);
});
</script>
