<template>
  <DmkPcAccountShell active="deposit">
    <div class="w-full h-full dmk-deposit-scope">
      <div class="h-[80vh] overflow-y-scroll">
        <div
          class="w-full pl-2 pr-2 pt-6 box-border flex flex-col"
        >
          <div class="van-list" role="feed">
            <div v-for="item in items" :key="item.id || item.orderNumber">
              <div
                class="w-full mb-4 bg-[#141426] rounded-xl shadow flex flex-col p-3"
              >
                <div class="flex justify-between">
                  <div
                    class="text-sm font-semibold text-[#999]"
                  >
                    {{ item.orderNumber || item.id }}
                    <div class="flex justify-between mt-3">
                      <div
                        class="text-sm font-normal text-[#999]"
                      >
                        {{ date(item.createTime) }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="flex text-base text-[var(--main-color)] font-semibold items-center mt-3"
                  >
                    {{ $t("das.dmk.currencyUsd") }} {{ money(item.receivedAmount || item.amount) }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="loading" class="van-list__loading">{{ $t("das.common.loading") }}</div>
            <div v-else-if="finished" class="van-list__finished-text">
              {{ $t("das.dmk.noMoreData") }}
            </div>
            <button
              v-else
              type="button"
              class="w-full py-3 text-[#999]"
              @click="load"
            >
              {{ $t("das.dmk.loadMore") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </DmkPcAccountShell>
  <DmkH5Layout class="dmk-mobile-current">
    <div class="w-full h-full dmk-deposit-scope">
      <div class="w-[90%] pb-4 mx-auto text-3xl text-white">
        {{ $t("das.dmk.depositHistory") }}
      </div>
      <div class="h-[100vh] overflow-y-scroll">
        <div
          class="w-full pl-2 pr-2 pt-6 box-border flex flex-col"
        >
          <div class="van-list" role="feed">
            <div v-for="item in items" :key="item.id || item.orderNumber">
              <div
                class="w-full mb-4 bg-[#141426] rounded-xl shadow flex flex-col p-3"
              >
                <div class="flex justify-between">
                  <div
                    class="text-sm font-semibold text-[#999]"
                  >
                    {{ item.orderNumber || item.id }}
                    <div class="flex justify-between mt-3">
                      <div
                        class="text-sm font-normal text-[#999]"
                      >
                        {{ h5Date(item.createTime) }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="flex text-base text-[var(--main-color)] font-semibold items-center mt-3"
                  >
                    {{ $t("das.dmk.currencyUsd") }} {{ h5Amount(item.receivedAmount || item.amount) }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="loading" class="van-list__loading">{{ $t("das.common.loading") }}</div>
            <div v-else-if="finished" class="van-list__finished-text">
              {{ $t("das.dmk.noMoreData") }}
            </div>
            <button
              v-else
              type="button"
              class="w-full py-3 text-[#999]"
              @click="load"
            >
              {{ $t("das.dmk.loadMore") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </DmkH5Layout>
</template>
<script setup>
import DmkPcAccountShell from "@/components/dmkPc/DmkPcAccountShell.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getDeposit, getOrderInfos, userGetInfo } from "@/api/apis";
import { safePush } from "@/utils/navigation";
import { openCustomerServiceDialog } from "@/utils/customerServiceDialog";
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
  h5Amount = (v) => {
    const n = Number(v || 0);
    return Number.isInteger(n)
      ? String(n)
      : n.toLocaleString("en-US", {
          useGrouping: false,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  },
  h5Date = (value) => {
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
