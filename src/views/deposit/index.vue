<template>
  <main class="das-page deposit-page">
    <DasPageHeader title-key="das.page.deposit" />
    <section class="recharge-content">
      <section class="recharge-balance-card recharge-balance-card--available">
        <h2>{{ $t("das.withdraw.availableAmount") }}</h2>
        <div class="recharge-balance-value">
          <strong>{{ money(user.balance) }}</strong
          ><span>USD</span>
        </div>
        <button class="recharge-topup" type="button" @click="contact">
          {{ $t("das.deposit.topUp") }}
        </button>
      </section>
      <section class="recharge-balance-card">
        <h2>{{ $t("das.profile.totalBalance") }}</h2>
        <div class="recharge-balance-value">
          <strong>{{ money(user.totalBalance || user.balance) }}</strong
          ><span>USD</span>
        </div>
        <div class="recharge-freeze-row">
          <span>{{ $t("das.withdraw.freezeAmount") }}</span
          ><strong>{{ money(user.frozenBalance) }} USD</strong>
        </div>
      </section>
      <section v-if="pendingOrders.length" class="deposit-pending-orders">
        <h2>Unfinished Orders</h2>
        <OrderCard
          v-for="item in pendingOrders"
          :key="item.id || item.orderNo"
          :item="item"
          @submit="openOrderDetails"
        />
        <p v-if="!pendingOrders.length" class="deposit-pending-orders__empty">
          No unfinished orders
        </p>
      </section>

      <div class="recharge-activity-tabs">
        <button
          class="recharge-activity-tab"
          type="button"
          @click="openTransactions"
        >
          {{ $t("das.deposit.recent") }}
        </button>
      </div>
      <van-list
        v-model:loading="loading"
        :finished="finished"
        :finished-text="$t('das.common.noMore')"
        @load="load"
        class="recharge-log-section"
      >
        <template #loading><ReferenceLoading /></template>
        <article v-for="item in items" :key="item.id" class="recharge-log-card">
          <div class="recharge-log-info">
            <b>{{ $t("das.deposit.deposited") }}</b>
            <small>
              {{ $t("das.deposit.reference") }}
              {{ item.orderNumber || item.id }}
            </small>
          </div>
          <div class="recharge-log-info">
            <strong
              >+ {{ money(item.receivedAmount || item.amount) }} USD</strong
            >
            <small>{{ date(item.createTime) }}</small>
          </div>
        </article>
      </van-list>
    </section>
    <p class="deposit-page-footer">{{ $t("das.common.copyright") }}</p>
  </main>
</template>

<script setup>
import ReferenceLoading from "@/components/ReferenceLoading.vue";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getDeposit, getOrderInfos, userGetInfo } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import OrderCard from "@/components/OrderCard.vue";
import { safePush } from "@/utils/navigation";
const router = useRouter(),
  user = ref({}),
  pendingOrders = ref([]),
  items = ref([]),
  loading = ref(false),
  finished = ref(false),
  query = reactive({ pageNum: 1, pageSize: 10 });
const money = (v) =>
    Number(v || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  date = (v) =>
    String(v || "")
      .slice(0, 19)
      .replace("T", " | "),
  contact = () => safePush(router, "/contact"),
  openTransactions = () => safePush(router, "/transactionActivity"),
  load = async () => {
    if (finished.value) return;
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
  if (!item?.id) return;
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
  ]);
  if (userResult.status === "fulfilled") {
    user.value = userResult.value.data || {};
  }
});
onBeforeUnmount(() => pendingController?.abort());
</script>

