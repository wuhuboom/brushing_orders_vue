<template>
  <DmkPcAccountShell breadcrumb-key="das.dmk.withdraw" breadcrumb-parent-key="das.dmk.withdraw">
    <div class="nsg-finance-page nsg-withdraw-page"><NsgTransactionNav active="/withdraw" @navigate="safePush(router, $event)" /><NsgWithdrawForm id="withdraw-pc" :form="form" :balance="money(user.totalBalance || user.balance)" :minimum="minimumWithdrawal" :has-account="!!accounts.length" @submit="send" @add-account="safePush(router, '/paymentMethods')" /></div>
  </DmkPcAccountShell>
  <DmkH5Layout class="dmk-mobile-current">
    <div class="nsg-finance-page nsg-withdraw-page--mobile">
      <div class="nsg-mobile-page-title nsg-withdraw-mobile-title"><NsgBackButton type="button" :aria-label="$t('das.common.back')" @click="safePush(router, '/my')" /><strong>{{ $t("das.dmk.withdraw") }}</strong><button class="nsg-withdraw-history-link" type="button" :aria-label="$t('das.page.withdrawHistory')" @click="safePush(router, '/withdrawRecords')"><img src="/nsg16/withdraw-history-icon.png" alt="" /></button></div>
      <NsgWithdrawForm id="withdraw-h5" :form="form" :balance="money(user.totalBalance || user.balance)" :minimum="minimumWithdrawal" :has-account="!!accounts.length" @submit="send" @add-account="safePush(router, '/paymentMethods')" />
    </div>
  </DmkH5Layout>
</template>
<script setup>
import NsgBackButton from "@/components/dmk/NsgBackButton.vue";
import DmkPcAccountShell from "@/components/dmkPc/DmkPcAccountShell.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import { withdrawal, getWithdrawalAccounts, userGetInfo, getTradeConfig } from "@/api/apis";
import { safePush, safeReplace } from "@/utils/navigation";
import NsgWithdrawForm from "@/components/dmk/NsgWithdrawForm.vue";
import NsgTransactionNav from "@/components/dmk/NsgTransactionNav.vue";
import NsgUiIcon from "@/components/dmk/NsgUiIcon.vue";
const router = useRouter(),
  { t } = useI18n(),
  user = ref({}),
  accounts = ref([]),
  minimumWithdrawal = ref(null),
  form = reactive({ amount: "", tradePassword: "", withdrawalAccountId: "" });
const money = (v) =>
    Number(v || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
  void getTradeConfig().then(({ data }) => {
    const value = data?.minWithdrawalAmount;
    if (value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value))) minimumWithdrawal.value = Number(value);
  }).catch(() => {});
  const [u, a] = await Promise.all([userGetInfo(), getWithdrawalAccounts()]);
  user.value = u.data || {};
  accounts.value = a.data || [];
  form.withdrawalAccountId =
    accounts.value.find((x) => x.isDefault)?.id || accounts.value[0]?.id || "";
});
</script>
<style scoped>
.nsg-withdraw-page--mobile { min-height: 100vh; background: #000; }
.nsg-withdraw-mobile-title { min-height: 68px; border-bottom: 2px solid #131c2f; }
.nsg-withdraw-mobile-title button { font-size: 25px; }
.nsg-withdraw-mobile-title .nsg-withdraw-history-link { display: grid; place-items: center; padding: 0; background: #141e31 !important; border-color: #2a3851 !important; }
.nsg-withdraw-history-link img { width: 25px; height: 25px; object-fit: contain; }
</style>
