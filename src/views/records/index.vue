<template>
  <main class="das-page records-page">
    <HeaderTop />
    <section class="records-content">
      <div class="records-title">
        <button type="button" @click="safeBack(router, '/starting')">‹</button>
        <h1>{{ $t("das.page.records") }}</h1>
      </div>
      <div class="records-tabs">
        <button
          v-for="(tab, index) in tabs"
          :key="tab.label"
          :class="{ active: active === index }"
          type="button"
          @click="switchTab(index)"
        >
          {{ $t(tab.label) }}
        </button>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
        ><van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('das.common.noMore')"
          @load="onLoad"
          ><OrderCard
            v-for="item in list"
            :key="item.id || item.orderNo"
            :item="item"
            @submit="openOrderDetails"
          /></van-list
        ></van-pull-refresh
      >
      <p class="records-copyright">{{ $t("das.common.copyright") }}</p>
    </section>
    <Footer name="/records" />
  </main>
</template>
<script setup>
import { onBeforeUnmount, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getOrderInfos } from "@/api/apis";
import HeaderTop from "@/components/HeaderTop.vue";
import Footer from "@/components/Footer.vue";
import OrderCard from "@/components/OrderCard.vue";
import { safeBack, safePush } from "@/utils/navigation";
const router = useRouter(),
  active = ref(0),
  list = ref([]),
  loading = ref(false),
  refreshing = ref(false),
  finished = ref(false),
  query = reactive({ pageNum: 1, pageSize: 10, status: "" });
const tabs = [
    { label: "das.records.all", status: "" },
    { label: "das.records.pending", status: "1" },
    { label: "das.records.completed", status: "0" },
  ];
const openOrderDetails = (item) => {
  try {
    sessionStorage.setItem(`dasOrder:${item.id}`, JSON.stringify(item));
  } catch (_) {}
  safePush(router, { path: "/productInfo", query: { id: item.id } });
};
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

onBeforeUnmount(cancelPendingRequest);
</script>
<style scoped>
.records-page {
  min-height: 100vh;
  background: #14392c;
  color: #f7f5ec;
}
.records-content {
  padding: 28px 24px 35px;
}
.records-title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.records-title button {
  position: absolute;
  left: 8px;
  border: 0;
  background: none;
  color: inherit;
  font-size: 31px;
}
.records-title h1 {
  margin: 0;
  font-size: 24px;
}
.records-tabs {
  margin: 24px 0 18px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
}
.records-tabs button {
  height: 42px;
  padding: 0 7px;
  border: 1px solid rgba(247, 245, 236, 0.35);
  border-radius: 999px;
  background: transparent;
  color: rgba(247, 245, 236, 0.72);
  font-size: 12px;
  font-weight: 700;
}
.records-tabs button.active {
  border-color: #f7f5ec;
  background: #f7f5ec;
  color: #17382d;
}
.records-copyright {
  margin: 34px 0 0;
  text-align: center;
  color: rgba(247, 245, 236, 0.42);
  font-size: 9px;
}
</style>
