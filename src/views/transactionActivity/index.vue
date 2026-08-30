<template>
  <main class="das-page transaction-page">
    <DasPageHeader
      title-key="das.page.transactionActivity"
      back-to="/deposit"
    />

    <section class="transaction-body">
      <div class="transaction-heading">
        <h2>{{ $t("das.transaction.allActivity") }}</h2>
        <span v-if="total">{{ total }}</span>
      </div>

      <van-list
        v-model:loading="loading"
        :finished="finished"
        :finished-text="$t('das.common.noMore')"
        @load="load"
      >
        <article
          v-for="(item, index) in items"
          :key="item.id || item.serialCode || `${item.createdTime}-${index}`"
          class="transaction-item"
        >
          <div class="transaction-copy">
            <strong>{{ transactionLabel(item) }}</strong>
            <small v-if="reference(item)">
              {{ $t("das.transaction.serial") }} {{ reference(item) }}
            </small>
            <time>{{ date(item.createdTime || item.createTime) }}</time>
          </div>
          <div class="transaction-value">
            <strong :class="amountClass(item.transactionAmount)">
              {{ signedMoney(item.transactionAmount) }} USD
            </strong>
            <small v-if="hasValue(item.balanceAfter)">
              {{ $t("das.transaction.balanceAfter") }}
              {{ money(item.balanceAfter) }} USD
            </small>
          </div>
        </article>
      </van-list>

      <p class="transaction-copyright">{{ $t("das.common.copyright") }}</p>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getTransactions } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";

const { t } = useI18n();
const items = ref([]);
const loading = ref(false);
const finished = ref(false);
const total = ref(0);
const query = reactive({ pageNum: 1, pageSize: 100 });

const transactionKeys = {
  zs: "gift",
  kk: "deduction",
  cz: "recharge",
  txz: "withdrawalPending",
  txjd: "withdrawalUnfrozen",
  tx: "withdrawal",
  rw: "task",
  bjfh: "principalReturn",
  fy: "commission",
  xjfy: "subordinateCommission",
  qd: "checkIn",
  sxf: "serviceFee",
  ck: "deposit",
  jj: "bonus",
  dx: "baseSalary",
  yzj: "reliefFund",
  zczs: "registrationGift",
  spfr: "productProfitShare",
  rwjl: "taskReward",
  yebzc: "balanceFundTransferOut",
  yebzr: "balanceFundTransferIn",
  gzjl: "workReward",
  sjjl: "upgradeReward",
  qt: "other",
  txbh: "withdrawalRejected",
};

const normalizedType = (value) =>
  String(value || "")
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();

const transactionLabel = (item) => {
  const typeName = String(item.transactionType || "").split(":")[0];
  const type = normalizedType(typeName);
  const key = transactionKeys[type];
  if (key) return t(`das.transaction.${key}`);
  return t("das.transaction.other");
};

const hasValue = (value) =>
  value !== undefined && value !== null && value !== "";
const numberValue = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};
const money = (value) =>
  numberValue(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const signedMoney = (value) => {
  const amount = numberValue(value);
  return `${amount > 0 ? "+" : ""}${money(amount)}`;
};
const amountClass = (value) =>
  numberValue(value) < 0 ? "is-negative" : "is-positive";
const reference = (item) => item.serialCode || item.transactionCode || "";
const date = (value) => {
  const text = String(value || "").replace("T", " ").slice(0, 19);
  return text || "—";
};

const load = async () => {
  if (finished.value) {
    loading.value = false;
    return;
  }
  try {
    const response = await getTransactions({ ...query });
    const rows = response.rows || [];
    items.value.push(...rows);
    total.value = Number(response.total || items.value.length);
    finished.value =
      rows.length < query.pageSize ||
      (total.value > 0 && items.value.length >= total.value);
    if (!finished.value) query.pageNum += 1;
  } finally {
    loading.value = false;
  }
};

</script>

<style scoped>
.transaction-page {
  min-height: 100%;
  background: #f7f5ec;
  color: #17382d;
}
.transaction-body {
  max-width: 760px;
  margin: auto;
  padding: 20px 16px 62px;
}
.transaction-heading {
  margin: 4px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.transaction-heading h2 {
  margin: 0;
  font-size: 19px;
}
.transaction-heading span {
  min-width: 34px;
  padding: 5px 10px;
  border-radius: 999px;
  color: #66766d;
  background: #e8eee3;
  font-size: 12px;
  text-align: center;
}
.transaction-item {
  min-height: 88px;
  margin-top: 12px;
  padding: 14px 13px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 12px;
  align-items: center;
  border: 1px solid #343743 !important;
  border-radius: 5px;
  background: #11141f !important;
  color: #f5f6fa;
  box-shadow: none;
}
.transaction-copy,
.transaction-value {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.transaction-copy > strong {
  color: #fff;
  font-size: 14px;
  line-height: 1.2;
}
.transaction-copy small,
.transaction-copy time,
.transaction-value small {
  color: #c8c7d0;
  font-size: 11px;
  font-style: normal;
  line-height: 1.2;
}
.transaction-copy small {
  overflow-wrap: anywhere;
}
.transaction-value {
  align-items: flex-end;
  text-align: right;
}
.transaction-value > strong {
  font-size: 14px;
  line-height: 1.2;
  white-space: nowrap;
}
.transaction-value > strong.is-positive {
  color: #287158;
}
.transaction-value > strong.is-negative {
  color: #d76250;
}
.transaction-copyright {
  margin: 30px 0 0;
  color: #9ba19c;
  font-size: 10px;
  text-align: center;
}
@media (max-width: 390px) {
  .transaction-body {
    padding-left: 12px;
    padding-right: 12px;
  }

  .transaction-item {
    padding-right: 10px;
    padding-left: 10px;
  }

  .transaction-copy small,
  .transaction-copy time,
  .transaction-value small {
    font-size: 10px;
  }
}
</style>
