<template>
  <form class="nsg-withdraw-form" novalidate @invalid.capture.prevent @submit.prevent="$emit('submit')">
    <section class="nsg-withdraw-balance"><p>{{ $t('das.dmk.accountAmount') }}</p><strong>{{ balance }} <span>{{ $t('das.dmk.currencyUsd') }}</span></strong></section>
    <div class="nsg-withdraw-field">
      <label :for="`${id}-amount`">{{ $t('das.dmk.withdrawAmount') }}</label>
      <div class="nsg-withdraw-input"><img class="nsg-withdraw-input__icon" src="/nsg16/withdraw-amount-icon.png" alt="" /><input :id="`${id}-amount`" v-model.number="form.amount" type="text" inputmode="decimal" :placeholder="$t('das.nsg.withdrawPlaceholder')" :aria-describedby="`${id}-minimum`" /><span>{{ $t('das.dmk.currencyUsd') }}</span></div>
      <p v-if="minimum !== null" :id="`${id}-minimum`" class="nsg-withdraw-hint"><img src="/nsg16/hint-info.png" alt="" /><span>{{ $t('das.nsg.minimumWithdrawal') }} <strong>{{ minimum }} {{ $t('das.dmk.currencyUsd') }}</strong></span></p>
    </div>
    <div class="nsg-withdraw-field">
      <label :for="`${id}-password`">{{ $t('das.dmk.transactionPassword') }}</label>
      <div class="nsg-withdraw-input"><img class="nsg-withdraw-input__icon" src="/nsg16/withdraw-password-icon.png" alt="" /><input :id="`${id}-password`" v-model="form.tradePassword" :type="passwordVisible ? 'text' : 'password'" autocomplete="off" :placeholder="$t('das.nsg.transactionPasswordPlaceholder')" :aria-describedby="`${id}-security`" /><button type="button" class="nsg-withdraw-password-toggle" :aria-label="$t(passwordVisible ? 'das.nsg.hidePassword' : 'das.nsg.showPassword')" :aria-pressed="passwordVisible" @click="passwordVisible = !passwordVisible"><img :src="passwordVisible ? '/nsg16/password-visible.png' : '/nsg16/password-hidden.png'" alt="" /></button></div>
      <p :id="`${id}-security`" class="nsg-withdraw-hint"><img src="/nsg16/hint-shield.png" alt="" /><span>{{ $t('das.nsg.transactionSecurity') }}</span></p>
    </div>
    <button v-if="!hasAccount" class="nsg-withdraw-add-account" type="button" @click="$emit('add-account')">{{ $t('das.dmk.addWithdrawalAccount') }}</button>
    <button class="nsg-withdraw-submit" type="submit">{{ $t('das.dmk.withdraw') }}</button>
  </form>
</template>
<script setup>
import { ref } from "vue";
defineProps({ form: { type: Object, required: true }, balance: String, minimum: { type: [String, Number], default: null }, hasAccount: Boolean, id: { type: String, required: true } });
defineEmits(["submit", "add-account"]);
const passwordVisible = ref(false);
</script>
<style>
.nsg-withdraw-form { width: min(770px, calc(100% - 80px)); margin: 46px auto 0; padding: 0 0 62px; font: 16px/1.5 "DM Sans", Arial, sans-serif; color: #cbd0e3; }
.nsg-withdraw-form * { box-sizing: border-box; }
.nsg-withdraw-balance { min-height: 185px; padding: 36px 40px; margin-bottom: 36px; border-radius: 12px; background: url('/nsg16/wallet-hero.png') right 38px center / 175px auto no-repeat, radial-gradient(circle at 82% 50%, #65309844, transparent 35%), #192236; }
.nsg-withdraw-balance p { margin: 0 0 24px; color: #abaabe; font-size: 16px; }
.nsg-withdraw-balance > strong { font-size: 44px; line-height: 1.2; font-weight: 700; color: #fff; }
.nsg-withdraw-balance > strong > span { margin-left: 10px; color: #aca0ff; font-size: 22px; font-weight: 600; }
.nsg-withdraw-field + .nsg-withdraw-field { margin-top: 30px; }
.nsg-withdraw-field > label { display: block; margin-bottom: 10px; font-size: 19px; font-weight: 600; }
.nsg-withdraw-input { display: flex; align-items: center; gap: 14px; min-height: 66px; padding: 12px 16px; border: 1px solid #242a39; border-radius: 12px; background: #101524; }
.nsg-withdraw-input:focus-within { border-color: #8273dd; }
.nsg-withdraw-input__icon { width: 36px; height: 36px; object-fit: contain; flex: 0 0 auto; }
.nsg-withdraw-input input { min-width: 0; width: 100%; padding: 0; border: 0; outline: 0; background: transparent; color: #d0d6e5; font: inherit; }
.nsg-withdraw-input input::placeholder { color: #697287; opacity: 1; }
.nsg-withdraw-input > span { padding: 0 8px; font-size: 18px; font-weight: 600; }
.nsg-withdraw-password-toggle { flex: 0 0 30px; width: 30px; padding: 3px; border: 0; color: #a6a9ba; background: transparent; cursor: pointer; }
.nsg-withdraw-password-toggle img { display: block; width: 24px; height: 24px; object-fit: contain; }
.nsg-withdraw-hint { display: flex; align-items: baseline; gap: 7px; margin: 12px 6px 0; color: #818699; font-size: 16px; }
.nsg-withdraw-hint > img { flex: 0 0 13px; width: 13px; height: 13px; object-fit: contain; }
.nsg-withdraw-hint strong { color: #b5b2df; font-weight: 600; }
.nsg-withdraw-submit { display: block; width: 100%; min-height: 62px; margin-top: 56px; padding: 12px; border: 0; border-radius: 10px; background: var(--nsg-gradient); color: white; font: 600 22px/1.4 "DM Sans", Arial, sans-serif; cursor: pointer; }
.nsg-withdraw-add-account { display: block; margin-top: 20px; padding: 0; border: 0; background: none; color: #b093f7; font: inherit; cursor: pointer; }
@media (max-width: 1023px) {
  .nsg-withdraw-form { width: auto; margin: 0 20px; padding-bottom: 100px; font-size: 15px; }
  .nsg-withdraw-balance { min-height: 112px; padding: 24px 18px; margin-bottom: 24px; border-radius: 10px; background-size: 100px auto, auto, auto; background-position: right 15px center, center, center; background-color: #111a2d; }
  .nsg-withdraw-balance p { margin-bottom: 12px; color: #929eb3; font-size: 13px; text-transform: uppercase; }
  .nsg-withdraw-balance > strong { font-size: 28px; }
  .nsg-withdraw-balance > strong > span { margin-left: 3px; font-size: 17px; }
  .nsg-withdraw-field > label { margin-bottom: 16px; font-size: 17px; }
  .nsg-withdraw-input { min-height: 62px; padding: 16px 14px; border-radius: 8px; background: #141d30; }
  .nsg-withdraw-input__icon { display: none; }
  .nsg-withdraw-input > span { padding: 0; font-size: 15px; }
  .nsg-withdraw-password-toggle { display: none; }
  .nsg-withdraw-hint { gap: 5px; margin: 12px 0 0; font-size: 12px; }
  .nsg-withdraw-hint > img { flex-basis: 13px; width: 13px; height: 13px; }
  .nsg-withdraw-field + .nsg-withdraw-field { margin-top: 24px; }
  .nsg-withdraw-submit { min-height: 60px; margin-top: 36px; border-radius: 8px; font-size: 20px; }
}
</style>
