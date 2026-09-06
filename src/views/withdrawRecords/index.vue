<template>
  <DmkPcAccountShell breadcrumb-key="das.page.withdrawHistory" breadcrumb-parent-key="das.dmk.withdraw">
    <div class="dmk-withdraw-scope nsg-withdraw-history">
      <nav class="nsg-withdraw-navigation">
        <button type="button" @click="safePush(router, '/withdraw')"><NsgUiIcon name="withdraw" />{{ $t("das.dmk.withdraw") }}</button>
        <button type="button" class="active"><NsgUiIcon name="history-clock" />{{ $t("das.page.withdrawHistory") }}</button>
        <button type="button" @click="safePush(router, '/deposit')"><NsgUiIcon name="history" />{{ $t("das.dmk.depositHistory") }}</button>
      </nav>
      <NsgWithdrawalList :items="items" :tabs="pcTabs" :active="active" :rows="h5HistoryRows" :format-date="h5Date" :loading="loading" :finished="finished" @filter="switchTab" @load="load" />
    </div>
  </DmkPcAccountShell>
  <DmkH5Layout class="dmk-mobile-current">
    <div class="nsg-withdraw-history nsg-withdraw-history--mobile">
      <div class="nsg-mobile-page-title nsg-history-mobile-title">
        <NsgBackButton type="button" :aria-label="$t('das.common.back')" @click="safePush(router, '/withdraw')" />
        <strong>{{ $t("das.dmk.history") }}</strong><span aria-hidden="true"></span>
      </div>
      <div class="nsg-history-type-tabs">
        <button class="active" type="button">{{ $t("das.page.withdrawHistory") }}</button>
        <button type="button" @click="safePush(router, '/deposit')">{{ $t("das.dmk.depositHistory") }}</button>
      </div>
      <NsgWithdrawalList :items="items" :tabs="pcTabs" :active="active" :rows="h5HistoryRows" :format-date="h5Date" :loading="loading" :finished="finished" @filter="switchTab" @load="load" />
    </div>
  </DmkH5Layout>
</template>
<script setup>
import NsgBackButton from "@/components/dmk/NsgBackButton.vue";
import NsgWithdrawalList from "@/components/dmk/NsgWithdrawalList.vue";
import NsgUiIcon from "@/components/dmk/NsgUiIcon.vue";
import { useRouter } from "vue-router";
import DmkPcAccountShell from "@/components/dmkPc/DmkPcAccountShell.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import { safePush } from "@/utils/navigation";
import { onMounted, reactive, ref } from "vue";
import { getWithdrawals } from "@/api/apis";
import { useI18n } from "vue-i18n";
const router = useRouter();
const { t } = useI18n();
const pcTabs = [
  { status: "1", labelKey: "das.dmk.reviewing" },
  { status: "2", labelKey: "das.common.success" },
  { status: "3", labelKey: "das.dmk.reject" },
];
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
let requestVersion = 0;
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
  if (finished.value || loading.value) return;
  const version = requestVersion;
  const params = { ...query };
  loading.value = true;
  try {
    const r = await getWithdrawals(params),
      rows = r.rows || [];
    if (version !== requestVersion) return;
    items.value.push(...rows);
    finished.value = rows.length < params.pageSize;
    if (!finished.value) query.pageNum++;
  } catch (_) {
    if (version === requestVersion) finished.value = true;
  } finally {
    if (version === requestVersion) loading.value = false;
  }
};
const switchTab = (status) => {
  requestVersion++;
  active.value = status;
  query.status = status;
  query.pageNum = 1;
  items.value = [];
  loading.value = false;
  finished.value = false;
  void load();
};
const pcHistoryRows = (item) => {
  const status = String(item.status);
  const statusText =
    status === "2"
      ? t("das.common.success")
      : status === "3"
        ? t("das.dmk.reject")
        : t("das.dmk.reviewing");
  return [
    {
      key: "walletAddress",
      label: t("das.form.walletAddress"),
      value: item.walletAddress || item.bankAccount || item.account || "—",
    },
    {
      key: "walletName",
      label: t("das.form.walletName"),
      value:
        item.walletName ||
        item.bankName ||
        item.accountName ||
        item.withdrawalTypeName ||
        "—",
    },
    {
      key: "withdrawAmount",
      label: t("das.withdraw.withdrawAmount"),
      value: money(item.amount),
    },
    {
      key: "amountReceived",
      label: t("das.dmk.amountReceived"),
      value: money(item.netAmount || item.receivedAmount || item.amount),
    },
    {
      key: "status",
      label: t("das.deposit.status"),
      value: statusText,
      statusClass:
        status === "3"
          ? "text-red-500"
          : status === "2"
            ? "text-[var(--main-color)]"
            : "",
    },
    {
      key: "createdAt",
      label: t("das.dmk.createdAt"),
      value: date(item.createTime),
    },
  ];
};
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
};
const h5HistoryRows = (item) => {
  const rows = pcHistoryRows(item);
  return rows.map((row) =>
    row.key === "createdAt"
      ? { ...row, value: h5Date(item.createTime) }
      : row,
  );
};
onMounted(load);
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
<style>
html #app .nsg-account-page:has(.nsg-withdraw-history) { border: 0; border-radius: 0; background: #000 !important; }
html #app .nsg-account-panel:has(.nsg-withdraw-history) { margin-top: 0 !important; border: 1px solid #252833 !important; border-radius: 16px; box-shadow: none !important; background: radial-gradient(ellipse at 100% 80%, #29154966, transparent 38%), #090c14 !important; }
html #app .nsg-account-panel:has(.nsg-withdraw-history) .nsg-account-content { padding: 0 !important; background: transparent !important; }
html #app .nsg-withdraw-history.dmk-withdraw-scope { min-height: 820px; background: transparent !important; }
.nsg-withdraw-navigation { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); overflow: hidden; border-bottom: 1px solid #2a2d38; border-radius: 15px 15px 0 0; }
.nsg-withdraw-navigation button { display: flex; align-items: center; justify-content: center; gap: 12px; min-height: 62px; padding: 12px; border: 0; background: transparent; color: #cfd1df; font: 500 17px/1.4 "DM Sans", Arial, sans-serif; letter-spacing: .06em; cursor: pointer; }
.nsg-withdraw-navigation button.active { color: white; background: linear-gradient(100deg, #4cbcf1, #9130d9); }
.nsg-withdraw-history--mobile { min-height: 100vh; background: #000; }
.nsg-withdraw-history--mobile .nsg-history-mobile-title { border-bottom: 2px solid #131c2f; min-height: 64px; }
.nsg-withdraw-history--mobile .nsg-history-mobile-title button { font-size: 22px; }
.nsg-withdraw-history--mobile .nsg-history-type-tabs { margin-top: 12px; }
</style>
