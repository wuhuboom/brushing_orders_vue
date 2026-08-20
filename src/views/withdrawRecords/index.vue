<template>
  <main class="das-page history-page">
    <DasPageHeader title-key="das.page.withdrawHistory" back-to="/withdraw" />
    <section class="history-body">
      <div class="history-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.status"
          :class="{ active: active === tab.status }"
          type="button"
          @click="switchTab(tab.status)"
        >
          {{ $t(tab.label) }}
        </button>
      </div>
      <van-list
        v-model:loading="loading"
        :finished="finished"
        :finished-text="$t('das.common.noMore')"
        @load="load"
        ><article v-for="item in items" :key="item.id">
          <i></i>
          <div>
            <b>{{ $t(statusLabel(item.status)) }}</b
            ><small
              >{{ $t("das.deposit.reference") }}
              {{ item.orderNumber || item.id }}</small
            ><small>{{ date(item.createTime) }}</small>
          </div>
          <strong>{{ money(item.netAmount || item.amount) }} USD</strong>
        </article></van-list
      >
      <p>{{ $t("das.common.copyright") }}</p>
    </section>
  </main>
</template>
<script setup>
import { reactive, ref } from "vue";
import { getWithdrawals } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
const tabs = [
    { status: "2", label: "das.withdraw.successful" },
    { status: "1", label: "das.records.pending" },
    { status: "3", label: "das.withdraw.rejected" },
  ],
  active = ref("2"),
  items = ref([]),
  loading = ref(false),
  finished = ref(false),
  query = reactive({ pageNum: 1, pageSize: 10, status: "2" });
const money = (v) =>
    Number(v || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  date = (v) =>
    String(v || "")
      .replace("T", " | ")
      .slice(0, 19),
  statusLabel = (s) =>
    String(s) === "2"
      ? "das.withdraw.successful"
      : String(s) === "3"
        ? "das.withdraw.rejected"
        : "das.records.pending";
const load = async () => {
  if (finished.value) return;
  loading.value = true;
  try {
    const r = await getWithdrawals(query),
      rows = r.rows || [];
    items.value.push(...rows);
    finished.value = rows.length < query.pageSize;
    if (!finished.value) query.pageNum++;
  } finally {
    loading.value = false;
  }
};
const switchTab = (status) => {
  active.value = status;
  query.status = status;
  query.pageNum = 1;
  items.value = [];
  finished.value = false;
  load();
};
</script>
<style scoped>
.history-page {
  min-height: 100%;
  background: #f7f5ec;
  color: #17382d;
}
.history-body {
  max-width: 760px;
  margin: auto;
  padding: 20px 28px 70px;
}
.history-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.history-tabs button {
  height: 44px;
  border: 1px solid #cfd3cc;
  border-radius: 999px;
  background: transparent;
  color: #7a827c;
  font-weight: 700;
}
.history-tabs .active {
  border-color: #14392c;
  background: #14392c;
  color: #fff;
}
.history-body article {
  min-height: 112px;
  padding: 22px 4px;
  display: grid;
  grid-template-columns: 10px 1fr auto;
  gap: 12px;
  align-items: center;
  border-bottom: 1px solid #d9dcd5;
}
.history-body article i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #14392c;
}
.history-body article div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.history-body article small {
  color: #89918c;
  font-size: 11px;
}
.history-body article > strong {
  font-size: 14px;
}
.history-body > p {
  margin-top: 28px;
  text-align: center;
  color: #9ba19c;
  font-size: 10px;
}
</style>
