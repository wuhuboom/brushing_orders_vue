<template>
  <DmkPcAccountShell breadcrumb-key="das.dmk.depositHistory" breadcrumb-parent-key="das.dmk.withdraw">
    <div class="nsg-finance-page nsg-deposit-page"><NsgTransactionNav active="/deposit" @navigate="safePush(router, $event)" /><NsgDepositList :items="filteredItems" :active="active" :format-date="h5Date" :loading="loading" :finished="finished" @filter="active = $event" @load="load" /></div>
  </DmkPcAccountShell>
  <DmkH5Layout class="dmk-mobile-current">
    <div class="nsg-finance-page nsg-deposit-page--mobile">
      <div class="nsg-mobile-page-title nsg-history-mobile-title"><NsgBackButton type="button" :aria-label="$t('das.common.back')" @click="safePush(router, '/withdraw')" /><strong>{{ $t("das.dmk.history") }}</strong><span aria-hidden="true"></span></div>
      <div class="nsg-history-type-tabs"><button type="button" @click="safePush(router, '/withdrawRecords')">{{ $t("das.page.withdrawHistory") }}</button><button class="active" type="button">{{ $t("das.dmk.depositHistory") }}</button></div>
      <NsgDepositList :items="filteredItems" :active="active" :format-date="h5Date" :loading="loading" :finished="finished" @filter="active = $event" @load="load" />
    </div>
  </DmkH5Layout>
</template>
<script setup>
import NsgBackButton from "@/components/dmk/NsgBackButton.vue";
import DmkPcAccountShell from "@/components/dmkPc/DmkPcAccountShell.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getDeposit, getOrderInfos, userGetInfo } from "@/api/apis";
import { safePush } from "@/utils/navigation";
import { openCustomerServiceDialog } from "@/utils/customerServiceDialog";
import NsgDepositList from "@/components/dmk/NsgDepositList.vue";
import NsgTransactionNav from "@/components/dmk/NsgTransactionNav.vue";
import NsgUiIcon from "@/components/dmk/NsgUiIcon.vue";
const active = ref("");
const filteredItems = computed(() => active.value ? items.value.filter(item => String(item.status) === active.value) : items.value);
const router = useRouter(),
  user = ref({}),
  pendingOrders = ref([]),
  items = ref([]),
  loading = ref(false),
  finished = ref(false),
  query = reactive({ pageNum: 1, pageSize: 10 });
const h5Date = (value) => {
    if (!value) return "—";
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
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
    }
    return String(value).replace("T", " ").slice(0, 19);
  },
  contact = () => openCustomerServiceDialog(),
  openTransactions = () => safePush(router, "/transactionActivity"),
  load = async () => {
    if (finished.value || loading.value) return;
    loading.value = true;
    try {
      const r = await getDeposit(query),
        rows = r.rows || [];
      items.value.push(...rows);
      finished.value = rows.length < query.pageSize;
      if (!finished.value) query.pageNum++;
    } finally {
      loading.value = false;
    }
  };

let pendingController;
const openOrderDetails = (item) => {
  try {
    sessionStorage.setItem(`dasOrder:${item.id}`, JSON.stringify(item));
  } catch (_) {}
  safePush(router, { path: "/productInfo", query: { id: item.id } });
};
const loadPendingOrders = async () => {
  pendingController?.abort();
  const controller = new AbortController();
  pendingController = controller;
  try {
    const result = await getOrderInfos(
      { pageNum: 1, pageSize: 10, status: "1" },
      { signal: controller.signal },
    );
    if (!controller.signal.aborted) pendingOrders.value = result.rows || [];
  } catch (_) {
    if (!controller.signal.aborted) pendingOrders.value = [];
  } finally {
    if (pendingController === controller) pendingController = undefined;
  }
};

onMounted(async () => {
  const [userResult] = await Promise.allSettled([
    userGetInfo(),
    loadPendingOrders(),
    load(),
  ]);
  if (userResult.status === "fulfilled")
    user.value = userResult.value.data || {};
});
onBeforeUnmount(() => pendingController?.abort());
</script>
<style scoped>
.nsg-deposit-page { min-height: 820px; background: #ffffff02; }
.nsg-deposit-page--mobile { min-height: 100vh; background: #000; }
.nsg-history-mobile-title { border-bottom: 2px solid #131c2f; min-height: 64px; }
.nsg-history-mobile-title button { font-size: 22px; }
.nsg-history-type-tabs { margin-top: 12px; }
</style>
