<template>
  <main class="das-page deposit-page">
    <DasPageHeader title-key="das.page.deposit" />
    <section class="deposit-layout">
      <div class="deposit-balance">
        <b>{{ $t("das.profile.totalBalance") }}</b>
        <strong>${{ money(user.totalBalance || user.balance) }}</strong>
        <div class="deposit-wallet-status">
          <i aria-hidden="true"></i>
          <span>USD Wallet Active</span>
        </div>
        <button class="deposit-top-up" type="button" @click="contact">
          <span class="deposit-top-up__icon" aria-hidden="true"></span>
          <span>{{ $t("das.deposit.topUp") }}</span>
        </button>
      </div>

      <section class="deposit-pending-orders">
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

      <div class="deposit-recent-title">
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
        class="deposit-activity-list"
      >
        <article v-for="item in items" :key="item.id" class="deposit-activity">
          <div class="deposit-activity__copy">
            <b>{{ $t("das.deposit.deposited") }}</b>
            <small>
              {{ $t("das.deposit.reference") }}
              {{ item.orderNumber || item.id }}
            </small>
          </div>
          <div class="deposit-activity__meta">
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
<style scoped>
.deposit-page {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(
      ellipse at 24% 100%,
      rgba(0, 158, 255, 0.2),
      transparent 17%
    ),
    #040713 !important;
  color: #f7f8fc;
}

.deposit-layout {
  width: min(100%, 760px);
  margin: 0 auto;
  padding: 11px 16px 30px;
  flex: 1;
}

.deposit-balance {
  width: 100%;
  height: 249px;
  padding: 24px 23px 29px;
  border: 1px solid #243657;
  border-radius: 6px;
  background:
    radial-gradient(circle at 8% 30%, rgba(20, 92, 219, 0.62), transparent 48%),
    radial-gradient(
      circle at 92% 50%,
      rgba(202, 83, 18, 0.48),
      transparent 42%
    ),
    #15192a;
  color: #fff;
  text-align: center;
}

.deposit-balance > b {
  display: block;
  color: #c9c8d1;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.deposit-balance > strong {
  display: block;
  max-width: 100%;
  margin-top: 4px;
  overflow: hidden;
  color: #fff;
  font-size: clamp(36px, 9.6vw, 48px);
  line-height: 1.08;
  font-weight: 500;
  letter-spacing: -1px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.deposit-wallet-status {
  width: 175px;
  height: 30px;
  margin: 17px auto 0;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px solid #292d3a;
  border-radius: 7px;
  background: rgba(24, 28, 39, 0.78);
  color: #10ccd5;
  font-size: 14px;
  line-height: 1;
  font-weight: 650;
  white-space: nowrap;
}

.deposit-wallet-status i {
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 2px;
  background: #12d0d9;
}

.deposit-top-up {
  width: 100%;
  height: 58px;
  margin-top: 30px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(100deg, #08baff, #0878ff 48%, #4e22cf);
  color: #fff;
  font-size: 22px;
  line-height: 1;
  font-weight: 700;
  text-transform: uppercase;
}

.deposit-top-up__icon {
  position: relative;
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  border: 3px solid currentColor;
  border-radius: 50%;
}

.deposit-top-up__icon::before,
.deposit-top-up__icon::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 1px;
  background: currentColor;
  transform: translate(-50%, -50%);
}

.deposit-pending-orders {
  margin-top: 28px;
}

.deposit-pending-orders > h2 {
  margin: 0 0 14px;
  color: #fff;
  font-size: 20px;
  line-height: 1.2;
}

.deposit-pending-orders__empty {
  min-height: 48px;
  margin: 0;
  border: 1px solid #26334d;
  border-radius: 7px;
  display: grid;
  place-items: center;
  background: #101522;
  color: #96a2b8;
  font-size: 13px;
}

.deposit-pending-orders :deep(.record-card) {
  border-radius: 7px;
}

.deposit-top-up__icon::before {
  width: 11px;
  height: 3px;
}

.deposit-top-up__icon::after {
  width: 3px;
  height: 11px;
}

.deposit-recent-title {
  height: 27px;
  margin: 32px 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deposit-recent-title h2 {
  margin: 0;
  color: #fff;
  font-size: 20px;
  line-height: 1.2;
  font-weight: 700;
}

.deposit-recent-title button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #12d0d9;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 600;
}

.deposit-activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deposit-activity {
  width: 100%;
  min-height: 78px;
  padding: 14px 13px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  align-items: center;
  gap: 12px;
  border: 1px solid #343743;
  border-radius: 5px;
  background: #11141f;
  color: #f5f6fa;
  box-shadow: none;
}

.deposit-activity__copy,
.deposit-activity__meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.deposit-activity__copy {
  align-items: flex-start;
  text-align: left;
}

.deposit-activity__meta {
  align-items: flex-end;
  text-align: right;
}

.deposit-activity b,
.deposit-activity strong {
  max-width: 100%;
  overflow: hidden;
  color: #fff;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.deposit-activity small {
  max-width: 100%;
  color: #c8c7d0;
  font-size: 12px;
  line-height: 1.2;
  font-weight: 400;
  white-space: nowrap;
}

.deposit-activity__meta small {
  max-width: none;
}

.deposit-page-footer {
  width: 100%;
  min-height: 83px;
  margin: 0;
  padding: 0 16px;
  display: grid;
  place-items: center;
  background: rgba(8, 11, 28, 0.84);
  color: #8b93a5;
  text-align: center;
  font-size: 10px;
  line-height: 1.2;
}

@media (min-width: 760px) {
  .deposit-layout {
    padding-left: 24px;
    padding-right: 24px;
  }

  .deposit-balance > strong {
    font-size: 48px;
  }
}

@media (max-width: 359px) {
  .deposit-layout {
    padding-left: 12px;
    padding-right: 12px;
  }

  .deposit-balance {
    padding-left: 18px;
    padding-right: 18px;
  }

  .deposit-activity {
    padding-left: 10px;
    padding-right: 10px;
  }

  .deposit-activity b,
  .deposit-activity strong,
  .deposit-activity small {
    font-size: 12px;
  }

  .deposit-activity__copy small {
    white-space: normal;
    overflow-wrap: anywhere;
  }
}
</style>
