<template>
  <main class="das-page deposit-page">
    <DasPageHeader title-key="das.page.deposit" />
    <section class="deposit-body">
      <div class="balance-card">
        <div class="balance-card__amounts">
          <div>
            <b>{{ $t("das.profile.balance") }}</b>
            <strong>{{ money(user.balance) }} USD</strong>
          </div>
          <div>
            <b>{{ $t("das.deposit.totalBalance") }}</b>
            <strong>{{ money(user.totalBalance) }} USD</strong>
          </div>
        </div>
        <button type="button" @click="contact">
          {{ $t("das.deposit.topUp") }}
        </button>
      </div>
      <div v-if="pendingOrders.length" class="pending-orders">
        <OrderCard
          v-for="item in pendingOrders"
          :key="item.id || item.orderNo"
          :item="item"
          @submit="openOrderDetails"
        />
      </div>
      <div class="recent-title">
        <h2>{{ $t("das.deposit.recent") }}</h2>
        <button type="button" @click="openTransactions">
          {{ $t("das.common.seeAll") }}
        </button>
      </div>
      <van-list
        v-model:loading="loading"
        :finished="finished"
        :finished-text="$t('das.common.noMore')"
        @load="load"
        ><article v-for="item in items" :key="item.id" class="deposit-entry">
          <i></i>
          <div>
            <b>{{ $t("das.deposit.deposited") }}</b
            ><small
              >{{ $t("das.deposit.reference") }}
              {{ item.orderNumber || item.id }}</small
            ><small>{{ date(item.createTime) }}</small>
          </div>
          <strong>{{ money(item.receivedAmount || item.amount) }} USD</strong>
        </article></van-list
      >
      <p class="deposit-copyright">{{ $t("das.common.copyright") }}</p>
    </section>
  </main>
</template>
<script setup>
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
      .replace("T", " | ")
      .slice(0, 19),
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
  const [userResult] = await Promise.allSettled([userGetInfo(), loadPendingOrders()]);
  if (userResult.status === "fulfilled") user.value = userResult.value.data || {};
});
onBeforeUnmount(() => pendingController?.abort());
</script>
<style scoped>
.deposit-page {
  min-height: 100%;
  background: #f7f5ec;
  color: #17382d;
}
.deposit-body {
  max-width: 760px;
  margin: auto;
  padding: 20px 28px 70px;
}
.balance-card {
  min-height: 225px;
  padding: 28px;
  border-radius: 22px;
  background: #14392c;
  color: #f7f5ec;
}
.balance-card__amounts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.balance-card__amounts > div {
  min-width: 0;
}
.balance-card b {
  display: block;
  font-size: 14px;
}
.balance-card strong {
  display: block;
  margin-top: 18px;
  overflow-wrap: anywhere;
  font-size: clamp(20px, 6vw, 28px);
  font-weight: 500;
}
.balance-card button {
  float: right;
  margin-top: 25px;
  height: 43px;
  padding: 0 24px;
  border: 0;
  border-radius: 999px;
  background: #f7f5ec;
  color: #17382d;
  font-weight: 700;
}
.pending-orders {
  margin-top: 18px;
}
.recent-title {
  margin: 27px 0 4px;
  display: flex;
  justify-content: space-between;
  align-items: start;
}
.recent-title h2 {
  margin: 0;
  font-size: 19px;
}
.recent-title button {
  padding: 0;
  border: 0;
  background: none;
  color: #768078;
  font-size: 12px;
  text-decoration: underline;
}
.deposit-entry {
  min-height: 104px;
  padding: 19px 4px;
  display: grid;
  grid-template-columns: 10px 1fr auto;
  gap: 12px;
  align-items: center;
  border-bottom: 1px solid #d9dcd5;
}
.deposit-entry i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #14392c;
}
.deposit-entry div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.deposit-entry div b {
  font-size: 15px;
}
.deposit-entry small {
  color: #89918c;
  font-size: 11px;
}
.deposit-entry > strong {
  font-size: 14px;
}
.deposit-copyright {
  margin: 28px 0 0;
  text-align: center;
  color: #9ba19c;
  font-size: 10px;
}
</style>
