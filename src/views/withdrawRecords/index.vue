<template>
  <main class="das-page withdraw-history-page">
    <DasPageHeader title-key="das.page.withdrawHistory" back-to="/withdraw" />
    <section class="withdraw-history-body">
      <div class="withdraw-history-tabs">
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
        class="withdraw-history-list"
        v-model:loading="loading"
        :finished="finished"
        :finished-text="$t('das.common.noMore')"
        @load="load"
      >
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
        © 2026 Brain Power All Rights Reserved
      </p>
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
<style scoped>
.das-page.withdraw-history-page {
  min-height: 100%;
  background-color: #020717;
  background-image: radial-gradient(
    ellipse at 50% 100%,
    rgba(0, 151, 255, 0.14),
    transparent 20%
  );
  color: #f4f6fb;
}
.withdraw-history-body {
  width: 100%;
  max-width: 820px;
  min-height: calc(100svh - 111px);
  margin: 0 auto;
  padding: 19px 16px 0;
  display: flex;
  flex-direction: column;
}
.withdraw-history-tabs {
  display: grid;
  grid-template-columns: 1.08fr 0.98fr 1.02fr;
  gap: 18px;
}
.withdraw-history-tabs button {
  height: 36px;
  padding: 0 5px;
  overflow: hidden;
  border: 1px solid #343947;
  border-radius: 10px;
  background: #111522;
  color: #9ca7c2;
  font-size: 14px;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.withdraw-history-tabs button.active {
  border-color: transparent;
  background: linear-gradient(100deg, #08baff, #0878ff);
  color: #fff;
  font-weight: 600;
}
.withdraw-history-list {
  margin-top: 22px;
}
.withdraw-history-list article {
  margin: 0 0 12px;
}
.withdraw-history-summary {
  min-height: 79px;
  padding: 17px 13px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 12px;
  align-items: center;
  border: 1px solid #343947;
  border-radius: 5px;
  background: #111522;
}
.withdraw-history-copy,
.withdraw-history-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.withdraw-history-copy b {
  overflow: hidden;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.withdraw-history-copy small,
.withdraw-history-meta small {
  color: #999eae;
  font-size: 12px;
  line-height: 17px;
  white-space: nowrap;
}
.withdraw-history-meta {
  align-items: flex-end;
  text-align: right;
}
.withdraw-history-meta strong {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
  white-space: nowrap;
}
.withdraw-history-list article.is-status-3 .withdraw-history-meta strong {
  color: #ff555d;
  text-decoration: line-through;
  text-decoration-thickness: 1px;
}
.withdraw-history-list article > p {
  min-height: 31px;
  margin: 0;
  padding: 7px 9px;
  border-radius: 0 0 4px 4px;
  background: #211925;
  color: #f05059;
  font-size: 12px;
  line-height: 17px;
}
.withdraw-history-list article.has-reason .withdraw-history-summary {
  border-radius: 5px 5px 0 0;
}
.withdraw-history-list :deep(.van-list__finished-text),
.withdraw-history-list :deep(.van-list__loading) {
  color: #8f98aa;
  font-size: 12px;
  line-height: 36px;
}
.withdraw-history-copyright {
  margin: auto 0 0;
  padding: 42px 0 25px;
  text-align: center;
  color: #8e98ab;
  font-size: 10px;
  line-height: 14px;
}
@media (max-width: 350px) {
  .withdraw-history-body {
    padding-right: 12px;
    padding-left: 12px;
  }
  .withdraw-history-tabs {
    gap: 10px;
  }
  .withdraw-history-summary {
    padding-right: 10px;
    padding-left: 10px;
  }
  .withdraw-history-copy small,
  .withdraw-history-meta small,
  .withdraw-history-meta strong {
    font-size: 11px;
  }

  .withdraw-history-copy small {
    white-space: normal;
    overflow-wrap: anywhere;
  }
}
</style>
