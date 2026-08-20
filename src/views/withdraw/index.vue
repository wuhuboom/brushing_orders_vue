<template>
  <main class="das-page withdraw-page">
    <DasPageHeader title-key="das.page.withdraw" />
    <form class="withdraw-body" novalidate @invalid.capture.prevent @submit.prevent="send">
      <section class="total-card">
        <div>
          <b>{{ $t("das.deposit.totalBalance") }}</b
          ><button type="button" @click="safePush(router, '/withdrawRecords')">
            <img :src="withdrawHistoryIcon" alt="" />
            <u>{{ $t("das.withdraw.history") }}</u>
          </button>
        </div>
        <strong>{{ money(user.totalBalance || user.balance) }} USD</strong>
        <p>{{ $t("das.withdraw.processingNote") }}</p>
      </section>
      <section class="amounts-card">
        <p>
          <b>{{ $t("das.withdraw.availableAmount") }}</b
          ><span>{{ money(user.balance) }} USD</span>
        </p>
        <p>
          <b>{{ $t("das.withdraw.freezeAmount") }}</b
          ><span>{{ money(user.frozenBalance) }} USD</span>
        </p>
      </section>
      <h2>{{ $t("das.withdraw.withdrawAmount") }}</h2>
      <label class="input-card"
        ><input
          v-model.number="form.amount"
          type="number"
          min="0"
          step="0.01"
          :placeholder="$t('das.withdraw.withdrawAmount')"
        /><button
          type="button"
          @click="form.amount = Number(user.balance || 0)"
        >
          {{ $t("das.withdraw.allBalance") }}
        </button></label
      ><div v-if="accounts.length" class="account-select">
        <DasSelect
          v-model="form.withdrawalAccountId"
          :options="accounts"
          value-key="id"
          :get-label="accountName"
          :aria-label="$t('das.form.selectAccount')"
          :placeholder="$t('das.form.selectAccount')"
        />
      </div
      ><button
        v-else
        class="add-account"
        type="button"
        @click="safePush(router, '/paymentMethods')"
      >
        {{ $t("das.form.addAccount") }}</button
      ><label class="input-card"
        ><input
          v-model="form.tradePassword"
          :type="tradePasswordVisible ? 'text' : 'password'"
          :placeholder="$t('das.auth.tradePassword')" /><button
          class="password-toggle"
          type="button"
          :aria-pressed="tradePasswordVisible"
          @click="tradePasswordVisible = !tradePasswordVisible"
        >
          <svg
            v-if="tradePasswordVisible"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle cx="12" cy="12" r="2.8" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 3l18 18" />
            <path d="M10.6 6.1A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-2.5 3.2" />
            <path d="M6.2 7.2C3.8 9 2.5 12 2.5 12s3.5 6 9.5 6a10 10 0 0 0 3.1-.5" />
            <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
          </svg></button
        ></label
      ><button class="confirm-button" type="submit">
        {{ $t("das.common.confirm") }}
      </button>
      <p class="withdraw-copyright">{{ $t("das.common.copyright") }}</p>
    </form>
  </main>
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import { withdrawal, getWithdrawalAccounts, userGetInfo } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import DasSelect from "@/components/DasSelect.vue";
import withdrawHistoryIcon from "@/static/das/icons/withdraw-history.png";
import { safePush, safeReplace } from "@/utils/navigation";
const router = useRouter(),
  { t } = useI18n(),
  user = ref({}),
  accounts = ref([]),
  tradePasswordVisible = ref(false),
  form = reactive({ amount: "", tradePassword: "", withdrawalAccountId: "" });
const money = (v) =>
    Number(v || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  accountName = (a) =>
    a.accountName || a.walletName || a.bankName || a.account || String(a.id);
const send = async () => {
  if (!form.amount || !form.tradePassword)
    return showToast(t("das.auth.required"));
  const amount = Number(form.amount);
  const hasValidPrecision =
    Math.abs(amount * 100 - Math.round(amount * 100)) < 1e-8;
  if (!Number.isFinite(amount) || amount <= 0 || !hasValidPrecision)
    return showToast(t("das.withdraw.invalidAmount"));
  if (!form.withdrawalAccountId)
    return showToast(t("das.withdraw.accountRequired"));
  await withdrawal(form);
  showSuccessToast(t("das.withdraw.success"));
  safeReplace(router, "/withdrawRecords");
};
onMounted(async () => {
  const [u, a] = await Promise.all([userGetInfo(), getWithdrawalAccounts()]);
  user.value = u.data || {};
  accounts.value = a.data || [];
  form.withdrawalAccountId =
    accounts.value.find((x) => x.isDefault)?.id || accounts.value[0]?.id || "";
});
</script>
<style scoped>
.withdraw-page {
  min-height: 100%;
  background: #f7f5ec;
  color: #17382d;
}
.withdraw-body {
  max-width: 760px;
  margin: auto;
  padding: 20px 28px 70px;
}
.total-card {
  padding: 27px;
  border-radius: 23px;
  background: #14392c;
  color: #f7f5ec;
}
.total-card > div {
  display: flex;
  justify-content: space-between;
}
.total-card button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 0;
  background: none;
  color: #efa18e;
}
.total-card button img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
.total-card > strong {
  display: block;
  margin: 25px 0;
  font-size: 31px;
  font-weight: 500;
}
.total-card p {
  margin: 0;
  color: rgba(247, 245, 236, 0.65);
  font-size: 12px;
  line-height: 1.5;
}
.amounts-card {
  margin-top: 16px;
  border-radius: 23px;
  background: #14392c;
  color: #f7f5ec;
  overflow: hidden;
}
.amounts-card p {
  margin: 0;
  padding: 22px 25px;
  display: flex;
  justify-content: space-between;
}
.amounts-card p + p {
  border-top: 1px solid rgba(247, 245, 236, 0.15);
}
.withdraw-body h2 {
  margin: 28px 5px 14px;
  font-size: 18px;
}
.input-card {
  height: 82px;
  margin: 12px 0;
  padding: 0 18px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  border-radius: 20px;
  background: #fff;
}
.input-card input {
  height: 54px;
  border: 0;
  outline: 0;
  background: transparent;
  font-weight: 700;
}
.input-card button {
  height: 43px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  background: #14392c;
  color: #fff;
  font-weight: 700;
}
.input-card img {
  width: 22px;
  opacity: 0.5;
}
.input-card .password-toggle {
  width: 38px;
  height: 38px;
  padding: 7px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #53675e;
  background: transparent;
}
.password-toggle svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  stroke-width: 2.1;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.account-select {
  margin: 0 0 5px;
}
.add-account {
  width: 100%;
  height: 50px;
  border: 1px solid #14392c;
  border-radius: 999px;
  background: transparent;
  color: #14392c;
  font-weight: 700;
}
.confirm-button {
  width: 100%;
  height: 58px;
  margin-top: 24px;
  border: 0;
  border-radius: 999px;
  background: #14392c;
  color: #fff;
  font-size: 17px;
  font-weight: 800;
}
.withdraw-copyright {
  margin-top: 28px;
  text-align: center;
  color: #9ba19c;
  font-size: 10px;
}
</style>
