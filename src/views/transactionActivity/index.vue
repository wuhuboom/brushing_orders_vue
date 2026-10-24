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
        <template #loading><ReferenceLoading /></template>
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
import ReferenceLoading from "@/components/ReferenceLoading.vue";
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
