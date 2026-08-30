<template>
  <main class="das-page withdraw-design-page">
    <DasPageHeader title-key="das.page.withdraw" />
    <button
      class="withdraw-design-history"
      type="button"
      :aria-label="$t('das.withdraw.history')"
      @click="safePush(router, '/withdrawRecords')"
    >
      <img :src="withdrawHistoryIcon" alt="" />
    </button>
    <form
      class="withdraw-design-body"
      novalidate
      @invalid.capture.prevent
      @submit.prevent="send"
    >
      <section class="withdraw-design-total">
        <b>{{ $t("das.profile.totalBalance") }}</b>
        <strong>${{ money(user.totalBalance || user.balance) }}</strong>
        <p>{{ $t("das.withdraw.processingNote") }}</p>
      </section>
      <section class="withdraw-design-amounts">
        <p>
          <b>{{ $t("das.withdraw.availableAmount") }}</b>
          <span>${{ money(user.balance) }}</span>
        </p>
        <p>
          <b>{{ $t("das.withdraw.freezeAmount") }}</b>
          <span>${{ money(user.frozenBalance) }}</span>
        </p>
      </section>
      <section class="withdraw-design-form">
        <h2>{{ $t("das.withdraw.withdrawAmount") }}</h2>
        <label class="withdraw-design-input withdraw-design-input--amount">
          <span aria-hidden="true">$</span>
          <input
            v-model.number="form.amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
          />
          <button
            type="button"
            @click="form.amount = Number(user.balance || 0)"
          >
            {{ $t("das.withdraw.allBalance") }}
          </button>
        </label>

        <h2>{{ $t("das.auth.tradePassword") }}</h2>
        <label class="withdraw-design-input withdraw-design-input--password">
          <img :src="lockIcon" alt="" />
          <input
            v-model="form.tradePassword"
            :type="tradePasswordVisible ? 'text' : 'password'"
            placeholder="********"
          />
          <button
            class="withdraw-design-toggle"
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
              <path
                d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
              />
              <circle cx="12" cy="12" r="2.8" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3.5 9.5c2.4 2.8 5.2 4.1 8.5 4.1s6.1-1.3 8.5-4.1" />
              <path
                d="m6.8 13-1.3 2.4M10.4 14l-.4 2.7M13.6 14l.4 2.7M17.2 13l1.3 2.4"
              />
            </svg>
          </button>
        </label>

        <div class="withdraw-design-account-slot">
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

        <button class="withdraw-design-confirm" type="submit">
          {{ $t("das.common.confirm") }}
        </button>
        <p class="withdraw-design-copyright">
          © 2026 Brain Power All Rights Reserved
        </p>
      </section>
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
<style scoped>
.das-page.withdraw-design-page {
  position: relative;
  min-height: 100%;
  background-color: #020717;
  background-image: radial-gradient(
    ellipse at 50% 100%,
    rgba(0, 151, 255, 0.13),
    transparent 18%
  );
  color: #f4f6fb;
}
.withdraw-design-history {
  position: absolute;
  z-index: 30;
  top: 64px;
  right: 11px;
  width: 44px;
  height: 40px;
  padding: 0;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
}
.withdraw-design-history img {
  width: 22px;
  height: 22px;
  display: block;
  object-fit: contain;
}
.withdraw-design-body {
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  padding: 12px 16px 0;
}
.withdraw-design-total {
  height: 134px;
  padding: 13px 29px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #404451;
  border-radius: 6px;
  background:
    radial-gradient(circle at 6% 28%, rgba(22, 94, 219, 0.68), transparent 50%),
    radial-gradient(circle at 95% 54%, rgba(190, 74, 19, 0.5), transparent 46%),
    #15192a;
  color: #f3f5fb;
  text-align: center;
}
.withdraw-design-total > b {
  color: #cbd0dc;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 1.8px;
  text-transform: uppercase;
}
.withdraw-design-total > strong {
  display: block;
  max-width: 100%;
  margin: 10px 0 8px;
  overflow: hidden;
  color: #06d5df;
  font-size: 35px;
  font-weight: 600;
  line-height: 42px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.withdraw-design-total > p {
  width: 100%;
  min-height: 34px;
  margin: 0;
  padding: 3px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
  border: 1px solid #30333d;
  border-radius: 9px;
  background: rgba(17, 21, 31, 0.64);
  color: #c6c9d3;
  font-size: clamp(9px, 2.8vw, 11px);
  line-height: 13px;
  text-align: center;
}
.withdraw-design-total > p::before {
  content: "i";
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  display: grid;
  place-items: center;
  border: 2px solid #0dd9e1;
  border-radius: 50%;
  color: #0dd9e1;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
}
.withdraw-design-amounts {
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.withdraw-design-amounts p {
  min-width: 0;
  height: 89px;
  margin: 0;
  padding: 20px 15px 14px;
  display: flex;
  flex-direction: column;
  gap: 13px;
  border-radius: 4px;
  background: #101421;
}
.withdraw-design-amounts b {
  overflow: hidden;
  color: #cbd0dc;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.withdraw-design-amounts span {
  overflow: hidden;
  color: #f2f4f8;
  font-size: clamp(21px, 6.6vw, 25px);
  line-height: 28px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.withdraw-design-form {
  height: 414px;
  margin-top: 18px;
  padding: 19px 8px 0;
  border: 1px solid #2f3441;
  border-radius: 6px;
}
.withdraw-design-form h2 {
  margin: 0;
  color: #e8ebf3;
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  text-transform: capitalize;
}
.withdraw-design-form h2 + .withdraw-design-input {
  margin-top: 7px;
}
.withdraw-design-input {
  width: 100%;
  height: 55px;
  padding: 0 8px 0 16px;
  display: grid;
  align-items: center;
  border: 1px solid #363b48;
  border-radius: 10px;
  background: #111522;
  color: #f2f4f8;
}
.withdraw-design-input--amount {
  grid-template-columns: 26px minmax(0, 1fr) auto;
}
.withdraw-design-input--amount > span {
  color: #c7cad5;
  font-size: 26px;
  line-height: 1;
}
.withdraw-design-input--password {
  grid-template-columns: 30px minmax(0, 1fr) 38px;
}
.withdraw-design-input--password > img {
  width: 24px;
  height: 24px;
  opacity: 0.8;
  filter: grayscale(1) brightness(1.65);
}
.withdraw-design-input input {
  width: 100%;
  height: 53px;
  padding: 0 7px;
  border: 0;
  outline: 0;
  background: transparent;
  color: #f3f4f8;
  font-size: 16px;
  font-weight: 400;
}
.withdraw-design-input input::placeholder {
  color: #8f94a4;
  opacity: 1;
}
.withdraw-design-input--amount > button {
  width: auto;
  min-width: max-content;
  height: 41px;
  padding: 0 10px;
  border: 1px solid rgba(6, 208, 220, 0.45);
  border-radius: 4px;
  background: rgba(4, 77, 89, 0.42);
  color: #0ddce5;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.15;
  white-space: nowrap;
}
.withdraw-design-form h2:nth-of-type(2) {
  margin-top: 17px;
}
.withdraw-design-toggle {
  width: 38px;
  height: 53px;
  padding: 0;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  color: #777f90;
}
.withdraw-design-toggle svg {
  width: 22px;
  height: 22px;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.withdraw-design-account-slot {
  height: 96px;
  padding-top: 18px;
}
.withdraw-design-account-slot :deep(.das-select__trigger),
.withdraw-design-add-account {
  width: 100%;
  height: 58px;
  border: 1px solid #303744;
  border-radius: 8px;
  background: #111522;
  color: #bdc4d3;
  font-size: 13px;
  font-weight: 500;
}
.withdraw-design-account-slot :deep(.das-select__menu) {
  border-color: #303744;
  border-radius: 8px;
  background: #111522;
}
.withdraw-design-confirm {
  width: 100%;
  height: 60px;
  margin: 0;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(100deg, #08baff, #0878ff 48%, #4e22cf);
  color: #fff;
  font-size: 20px;
  font-weight: 700;
}
.withdraw-design-copyright {
  margin: 28px 0 0;
  text-align: center;
  color: #8e98ab;
  font-size: 10px;
  line-height: 14px;
}
@media (max-width: 350px) {
  .withdraw-design-body {
    padding-right: 12px;
    padding-left: 12px;
  }
  .withdraw-design-total {
    padding-right: 18px;
    padding-left: 18px;
  }
  .withdraw-design-amounts {
    gap: 10px;
  }
  .withdraw-design-amounts p {
    padding-right: 10px;
    padding-left: 10px;
  }
}
</style>
