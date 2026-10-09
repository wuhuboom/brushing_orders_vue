<template>
  <main class="das-page withdraw-design-page">
    <DasPageHeader title-key="das.page.withdraw" />
    <form
      class="withdraw-content"
      novalidate
      @invalid.capture.prevent
      @submit.prevent="send"
    >
      <section class="withdraw-balance-card">
        <button
          class="withdraw-history"
          type="button"
          :aria-label="$t('das.withdraw.history')"
          @click="safePush(router, '/withdrawRecords')"
        >
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line></svg
          ><span>{{ $t("das.withdraw.history") }}</span>
        </button>

        <h2>{{ $t("das.profile.totalBalance") }}</h2>
        <div class="withdraw-total">
          <strong>{{ money(user.totalBalance || user.balance) }}</strong
          ><span>USD</span>
        </div>
        <p>{{ $t("das.withdraw.processingNote") }}</p>
      </section>
      <section class="withdraw-summary-card">
        <p class="withdraw-summary-row">
          <span>{{ $t("das.withdraw.availableAmount") }}</span>
          <strong>{{ money(user.balance) }} USD</strong>
        </p>
        <p class="withdraw-summary-row">
          <span>{{ $t("das.withdraw.freezeAmount") }}</span>
          <strong>{{ money(user.frozenBalance) }} USD</strong>
        </p>
      </section>
      <section class="withdraw-form-section">
        <h2>{{ $t("das.withdraw.withdrawAmount") }}</h2>
        <div class="withdraw-form-field withdraw-form-field--select">
          <span>{{ $t("das.form.selectAccount") }}</span>
          <DasSelect
            v-if="accounts.length"
            v-model="form.withdrawalAccountId"
            :options="accounts"
            value-key="id"
            :get-label="accountName"
            :aria-label="$t('das.form.selectAccount')"
            :placeholder="$t('das.form.selectAccount')"
          />
          <button
            v-else-if="!accounts.length"
            class="withdraw-design-add-account"
            type="button"
            @click="safePush(router, '/paymentMethods')"
          >
            {{ $t("das.form.addAccount") }}
          </button>
        </div>
        <label class="withdraw-form-field withdraw-form-field--amount">
          <span>{{ $t("das.withdraw.withdrawAmount") }}</span>
          <div class="withdraw-amount-row">
            <input
              v-model.number="form.amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            <button
              type="button"
              class="withdraw-all-btn"
              @click="form.amount = Number(user.balance || 0)"
            >
              {{ $t("das.withdraw.allBalance") }}
            </button>
          </div>
        </label>

        <label class="withdraw-form-field withdraw-form-field--password">
          <span>{{ $t("das.auth.tradePassword") }}</span>
          <div class="withdraw-password-row">
            <input
              v-model="form.tradePassword"
              :type="tradePasswordVisible ? 'text' : 'password'"
              placeholder="********"
            />
            <button
              class="withdraw-eye-btn"
              type="button"
              :aria-pressed="tradePasswordVisible"
              @click="tradePasswordVisible = !tradePasswordVisible"
            >
              <ReferenceEye :visible="tradePasswordVisible" />
            </button>
          </div>
        </label>

        <button class="withdraw-submit" type="submit">
          {{ $t("das.common.confirm") }}
        </button>
        <p class="withdraw-design-copyright">
          {{ $t("das.common.copyright") }}
        </p>
      </section>
    </form>
  </main>
</template>

<script setup>
import ReferenceEye from "@/components/ReferenceEye.vue";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import { withdrawal, getWithdrawalAccounts, userGetInfo } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import DasSelect from "@/components/DasSelect.vue";
import withdrawHistoryIcon from "@/static/brain/history.png";
import lockIcon from "@/static/brain/lock.png";
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

