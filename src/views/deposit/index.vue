<template>
  <main class="das-page deposit-page">
    <DasPageHeader title-key="das.page.deposit" />
    <section class="deposit-body">
      <div class="balance-card">
        <b>{{ $t("das.deposit.totalBalance") }}</b
        ><strong>{{ money(user.totalBalance || user.balance) }} USD</strong
        ><button type="button" @click="contact">
          {{ $t("das.deposit.topUp") }}
        </button>
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
        ><article v-for="item in items" :key="item.id">
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
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getDeposit, userGetInfo } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import { safePush } from "@/utils/navigation";
const router = useRouter(),
  user = ref({}),
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
onMounted(async () => (user.value = (await userGetInfo()).data || {}));
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
  min-height: 210px;
  padding: 28px;
  border-radius: 22px;
  background: #14392c;
  color: #f7f5ec;
}
.balance-card b {
  font-size: 14px;
}
.balance-card strong {
  display: block;
  margin: 25px 0 20px;
  font-size: 32px;
  font-weight: 500;
}
.balance-card button {
  float: right;
  height: 43px;
  padding: 0 24px;
  border: 0;
  border-radius: 999px;
  background: #f7f5ec;
  color: #17382d;
  font-weight: 700;
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
.deposit-body article {
  min-height: 104px;
  padding: 19px 4px;
  display: grid;
  grid-template-columns: 10px 1fr auto;
  gap: 12px;
  align-items: center;
  border-bottom: 1px solid #d9dcd5;
}
.deposit-body article i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #14392c;
}
.deposit-body article div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.deposit-body article div b {
  font-size: 15px;
}
.deposit-body article small {
  color: #89918c;
  font-size: 11px;
}
.deposit-body article > strong {
  font-size: 14px;
}
.deposit-copyright {
  margin: 28px 0 0;
  text-align: center;
  color: #9ba19c;
  font-size: 10px;
}
</style>
