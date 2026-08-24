<template>
  <DmkPcAccountShell>
    <div class="w-full h-full dmk-withdraw-scope">
      <div class="van-tabs van-tabs--line">
        <div class="van-tabs__wrap">
          <div
            class="van-tabs__nav van-tabs__nav--line"
            role="tablist"
            style="border-color: var(--main-color); background: transparent"
          >
            <div
              class="van-tab van-tab--line cursor-pointer"
              style="color: rgb(153, 153, 153)"
              @click="safePush(router, '/withdraw')"
            >
              <span class="van-tab__text van-tab__text--ellipsis">{{ $t("das.dmk.withdraw") }}</span>
            </div>
            <div
              class="van-tab van-tab--line van-tab--active"
              style="color: rgb(255, 255, 255)"
            >
              <span class="van-tab__text van-tab__text--ellipsis">{{ $t("das.dmk.history") }}</span>
            </div>
            <div
              class="van-tabs__line"
              style="
                background-color: var(--main-color);
                transform: translateX(838.5px) translateX(-50%);
                transition-duration: 0.3s;
              "
            ></div>
          </div>
        </div>
        <div class="van-tabs__content">
          <div class="van-tab__panel">
            <div
              class="w-full flex flex-col p-6 pb-0 box-border"
            >
              <div class="van-tabs van-tabs--card">
                <div class="van-tabs__wrap">
                  <div
                    class="van-tabs__nav van-tabs__nav--card"
                    role="tablist"
                    style="
                      border-color: var(--main-color);
                      background: transparent;
                    "
                  >
                    <div
                      v-for="tab in pcTabs"
                      :key="tab.status"
                      class="van-tab van-tab--card cursor-pointer"
                      :class="{ 'van-tab--active': active === tab.status }"
                      :style="{
                        borderColor: 'var(--main-color)',
                        color:
                          active === tab.status ? 'black' : 'rgb(255,255,255)',
                        backgroundColor:
                          active === tab.status
                            ? 'var(--main-color)'
                            : 'transparent',
                      }"
                      @click="switchTab(tab.status)"
                    >
                      <span class="van-tab__text van-tab__text--ellipsis"
                        ><span
                          class="font-oswald font-semibold text-base"
                          >{{ $t(tab.labelKey) }}</span
                        ></span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="h-[80vh] overflow-y-scroll">
              <div
                class="w-full pl-2 pr-2 pt-6 box-border flex flex-col"
              >
                <div class="van-list" role="feed">
                  <div v-for="item in items" :key="item.id || item.orderNumber">
                    <div
                      class="shadow rounded-xl bg-[#141426] text-[#666] p-3 box-border flex flex-col mb-4"
                    >
                      <div
                        class="flex items-center justify-between font-medium pb-2 text-sm"
                      >
                        <div>{{ item.orderNumber || item.id }}</div>
                      </div>
                      <div
                        class="w-full h-[1px] bg-[#EBEBEB]"
                      ></div>
                      <div
                        class="flex flex-col text-sm font-medium mt-2"
                      >
                        <div
                          v-for="row in pcHistoryRows(item)"
                          :key="row.label"
                          class="flex mt-1"
                        >
                          <div class="w-[50%]">
                            {{ row.label }}
                          </div>
                          <div class="w-[50%]">
                            :
                            <span :class="row.statusClass">{{
                              row.value
                            }}</span>
                          </div>
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
        </div>
      </div>
    </div>
  </DmkPcAccountShell>
  <DmkH5Layout class="dmk-mobile-current">
    <div class="w-full h-full dmk-withdraw-scope">
      <div class="van-tabs van-tabs--line">
        <div class="van-tabs__wrap">
          <div
            class="van-tabs__nav van-tabs__nav--line"
            role="tablist"
            style="border-color: var(--main-color); background: transparent"
          >
            <div
              class="van-tab van-tab--line cursor-pointer"
              role="tab"
              aria-selected="false"
              style="color: rgb(153, 153, 153)"
              @click="safePush(router, '/withdraw')"
            >
              <span class="van-tab__text van-tab__text--ellipsis">{{ $t("das.dmk.withdraw") }}</span>
            </div>
            <div
              class="van-tab van-tab--line van-tab--active"
              role="tab"
              aria-selected="true"
              style="color: rgb(255, 255, 255)"
            >
              <span class="van-tab__text van-tab__text--ellipsis">{{ $t("das.dmk.history") }}</span>
            </div>
            <div
              class="van-tabs__line"
              style="
                background-color: var(--main-color);
                transform: translateX(75vw) translateX(-50%);
                transition-duration: 0.3s;
              "
            ></div>
          </div>
        </div>
        <div class="van-tabs__content">
          <div class="van-tab__panel" role="tabpanel">
            <div
              class="w-full flex flex-col p-6 pb-0 box-border"
            >
              <div class="van-tabs van-tabs--card">
                <div class="van-tabs__wrap">
                  <div
                    class="van-tabs__nav van-tabs__nav--card"
                    role="tablist"
                    style="
                      border-color: var(--main-color);
                      background: transparent;
                    "
                  >
                    <div
                      v-for="tab in pcTabs"
                      :key="tab.status"
                      class="van-tab van-tab--card cursor-pointer"
                      :class="{ 'van-tab--active': active === tab.status }"
                      :style="{
                        borderColor: 'var(--main-color)',
                        color:
                          active === tab.status ? 'black' : 'rgb(255,255,255)',
                        backgroundColor:
                          active === tab.status
                            ? 'var(--main-color)'
                            : 'transparent',
                      }"
                      @click="switchTab(tab.status)"
                    >
                      <span class="van-tab__text van-tab__text--ellipsis"
                        ><span
                          class="font-oswald font-semibold text-base"
                          >{{ $t(tab.labelKey) }}</span
                        ></span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="h-[80vh] overflow-y-scroll">
              <div
                class="w-full pl-2 pr-2 pt-6 box-border flex flex-col"
              >
                <div class="van-list" role="feed">
                  <div v-for="item in items" :key="item.id || item.orderNumber">
                    <div
                      class="shadow rounded-xl bg-[#141426] text-[#666] p-3 box-border flex flex-col mb-4"
                    >
                      <div
                        class="flex items-center justify-between font-medium pb-2 text-sm"
                      >
                        <div>
                          {{ item.orderNumber || item.id }}
                        </div>
                      </div>
                      <div
                        class="w-full h-[1px] bg-[#EBEBEB]"
                      ></div>
                      <div
                        class="flex flex-col text-sm font-medium mt-2"
                      >
                        <div
                          v-for="row in h5HistoryRows(item)"
                          :key="row.label"
                          class="flex mt-1"
                        >
                          <div class="w-[50%]">
                            {{ row.label }}
                          </div>
                          <div class="w-[50%]">
                            :
                            <span :class="row.statusClass">{{
                              row.value
                            }}</span>
                          </div>
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
        </div>
      </div>
    </div>
  </DmkH5Layout>
</template>
<script setup>
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
