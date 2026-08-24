<template>
  <DmkPcAccountShell>
    <div class="w-full h-full dmk-withdraw-scope">
      <div class="van-tabs van-tabs--line">
        <div class="van-tabs__wrap">
          <div class="van-tabs__nav van-tabs__nav--line" role="tablist" aria-orientation="horizontal" style="border-color: var(--main-color); background: transparent">
            <div class="van-tab van-tab--line van-tab--active" role="tab" aria-selected="true" style="color: rgb(255,255,255)"><span class="van-tab__text van-tab__text--ellipsis">{{ $t("das.dmk.withdraw") }}</span></div>
            <div class="van-tab van-tab--line cursor-pointer" role="tab" aria-selected="false" style="color: rgb(153,153,153)" @click="safePush(router, '/withdrawRecords')"><span class="van-tab__text van-tab__text--ellipsis">{{ $t("das.dmk.history") }}</span></div>
            <div class="van-tabs__line" style="background-color: var(--main-color); transform: translateX(279.5px) translateX(-50%); transition-duration: .3s"></div>
          </div>
        </div>
        <div class="van-tabs__content">
          <div class="van-tab__panel" role="tabpanel">
            <form class="p-4 box-border flex flex-col" novalidate @invalid.capture.prevent @submit.prevent="send">
              <div class="flex flex-col justify-between p-4 box-border mb-4">
                <div class="text-white opacity-70 text-sm font-semibold">{{ $t("das.dmk.accountAmount") }}</div>
                <div class="flex mt-4 mb-4"><div class="text-white text-center text-3xl font-bold flex items-center">{{ money(user.totalBalance || user.balance) }}</div><div class="text-white text-sm font-bold flex items-center ml-2 pt-[12px]">{{ $t("das.dmk.currencyUsd") }}</div></div>
              </div>
              <div class="w-full">
                <div class="w-full mt-4 box-border flex flex-col">
                  <div class="w-full flex flex-col">
                    <div class="w-full flex flex-col mt-2">
                      <div class="text-[#fff] text-base">{{ $t("das.dmk.withdrawAmount") }}</div>
                      <div class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939] lg:bg-[#fff] lg:border-[#fff]"><div class="van-cell van-field"><div class="van-cell__value van-field__value"><div class="van-field__body"><input v-model.number="form.amount" class="van-field__control" inputmode="decimal" :placeholder="$t('das.dmk.withdrawAmount')" type="text" /></div></div></div></div>
                    </div>
                    <div class="w-full flex flex-col mt-2">
                      <div class="text-[#fff] text-base">{{ $t("das.dmk.transactionPassword") }}</div>
                      <div class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939] lg:bg-[#fff] lg:border-[#fff]"><div class="van-cell van-field"><div class="van-cell__value van-field__value"><div class="van-field__body"><input v-model="form.tradePassword" class="van-field__control" :placeholder="$t('das.dmk.transactionPassword')" type="password" /></div></div></div></div>
                    </div>
                    <div v-if="!accounts.length" class="mt-4 text-[var(--main-color)] cursor-pointer" @click="safePush(router, '/paymentMethods')">{{ $t("das.dmk.addWithdrawalAccount") }}</div>
                    <div class="w-full mt-6"><button class="van-button van-button--default van-button--large" style="color:white;background:var(--main-color);border-color:var(--main-color)" type="submit"><div class="van-button__content"><span class="van-button__text"><span class="text-black">{{ $t("das.dmk.withdraw") }}</span></span></div></button></div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </DmkPcAccountShell>
  <DmkH5Layout class="dmk-mobile-current">
    <div class="w-full h-full dmk-withdraw-scope">
      <div class="van-tabs van-tabs--line">
        <div class="van-tabs__wrap">
          <div class="van-tabs__nav van-tabs__nav--line" role="tablist" style="border-color: var(--main-color); background: transparent">
            <div class="van-tab van-tab--line van-tab--active" role="tab" aria-selected="true" style="color: rgb(255, 255, 255)"><span class="van-tab__text van-tab__text--ellipsis">{{ $t("das.dmk.withdraw") }}</span></div>
            <div class="van-tab van-tab--line cursor-pointer" role="tab" aria-selected="false" style="color: rgb(153, 153, 153)" @click="safePush(router, '/withdrawRecords')"><span class="van-tab__text van-tab__text--ellipsis">{{ $t("das.dmk.history") }}</span></div>
            <div class="van-tabs__line" style="background-color: var(--main-color); transform: translateX(25vw) translateX(-50%); transition-duration: .3s"></div>
          </div>
        </div>
        <div class="van-tabs__content">
          <div class="van-tab__panel" role="tabpanel">
            <form class="p-4 box-border flex flex-col" novalidate @invalid.capture.prevent @submit.prevent="send">
              <div class="flex flex-col justify-between p-4 box-border mb-4">
                <div class="text-white opacity-70 text-sm font-semibold">{{ $t("das.dmk.accountAmount") }}</div>
                <div class="flex mt-4 mb-4">
                  <div class="text-white text-center text-3xl font-bold flex items-center">{{ h5Amount(user.totalBalance || user.balance) }}</div>
                  <div class="text-white text-sm font-bold flex items-center ml-2 pt-[12px]">{{ $t("das.dmk.currencyUsd") }}</div>
                </div>
              </div>
              <div class="w-full">
                <div class="w-full mt-4 box-border flex flex-col">
                  <div class="w-full flex flex-col">
                    <div class="w-full flex flex-col mt-2">
                      <div class="text-[#fff] text-base">{{ $t("das.dmk.withdrawAmount") }}</div>
                      <div class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939]">
                        <div class="van-cell van-field"><div class="van-cell__value van-field__value"><div class="van-field__body"><input v-model.number="form.amount" class="van-field__control" inputmode="decimal" :placeholder="$t('das.dmk.withdrawAmount')" type="text" /></div></div></div>
                      </div>
                    </div>
                    <div class="w-full flex flex-col mt-2">
                      <div class="text-[#fff] text-base">{{ $t("das.dmk.transactionPassword") }}</div>
                      <div class="w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#393939]">
                        <div class="van-cell van-field"><div class="van-cell__value van-field__value"><div class="van-field__body"><input v-model="form.tradePassword" class="van-field__control" :placeholder="$t('das.dmk.transactionPassword')" type="password" /></div></div></div>
                      </div>
                    </div>
                    <div v-if="!accounts.length" class="mt-4 text-[var(--main-color)] cursor-pointer" @click="safePush(router, '/paymentMethods')">{{ $t("das.dmk.addWithdrawalAccount") }}</div>
                    <div class="w-full mt-6">
                      <button class="van-button van-button--default van-button--large" style="color:white;background:var(--main-color);border-color:var(--main-color)" type="submit"><div class="van-button__content"><span class="van-button__text"><span class="text-black">{{ $t("das.dmk.withdraw") }}</span></span></div></button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </DmkH5Layout>
</template>
<script setup>
import DmkPcAccountShell from "@/components/dmkPc/DmkPcAccountShell.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import { withdrawal, getWithdrawalAccounts, userGetInfo } from "@/api/apis";
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
  h5Amount = (v) =>
    Number(v || 0).toLocaleString("en-US", {
      useGrouping: false,
      minimumFractionDigits: 0,
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
