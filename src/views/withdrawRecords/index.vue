<template>
  <main class="das-page withdraw-history-page">
    <DasPageHeader title-key="das.page.withdrawHistory" back-to="/withdraw" />
    <section class="withdraw-history-body">
      <div class="withdraw-record-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.status"
          class="withdraw-record-tab"
          :class="{ 'withdraw-record-tab--active': active === tab.status }"
          type="button"
          @click="switchTab(tab.status)"
        >
          {{ $t(tab.label) }}
        </button>
      </div>
      <van-list
        class="withdraw-history-list"
        v-model:loading="loading"
        :finished="finished"
        :finished-text="$t('das.common.noMore')"
        @load="load"
      >
        <template #loading><ReferenceLoading /></template>
        <article
          v-for="item in items"
          :key="item.id"
          :class="[
            `is-status-${String(item.status)}`,
            {
              'has-reason':
                String(item.status) === '3' && rejectionReason(item),
            },
          ]"
        >
          <div class="withdraw-history-summary">
            <div class="withdraw-history-copy">
              <b>{{ $t(statusLabel(item.status)) }}</b>
              <small>
                {{ $t("das.deposit.reference") }}
                {{ item.orderNumber || item.id }}
              </small>
            </div>
            <div class="withdraw-history-meta">
              <strong>+ ${{ money(item.netAmount || item.amount) }} USD</strong>
              <small>{{ date(item.createTime) }}</small>
            </div>
          </div>
          <p v-if="String(item.status) === '3' && rejectionReason(item)">
            Reason: {{ rejectionReason(item) }}
          </p>
        </article>
      </van-list>
      <p class="withdraw-history-copyright">
        {{ $t("das.common.copyright") }}
      </p>
    </section>
  </main>
</template>

<script setup>
import ReferenceLoading from "@/components/ReferenceLoading.vue";
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
      .slice(0, 19)
      .replace("T", " | "),
  statusLabel = (s) =>
    String(s) === "2"
      ? "das.withdraw.successful"
      : String(s) === "3"
        ? "das.withdraw.rejected"
        : "das.records.pending",
  rejectionReason = (item) =>
    item.rejectReason ||
    item.rejectionReason ||
    item.rejectedReason ||
    item.failureReason ||
    item.failReason ||
    item.reason ||
    item.remark ||
    item.remarks ||
    "";
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
