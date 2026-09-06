<template>
  <nav class="nsg-finance-nav">
    <button v-for="tab in tabs" :key="tab.path" type="button" :class="{ active: active === tab.path }" :aria-current="active === tab.path ? 'page' : undefined" @click="$emit('navigate', tab.path)"><NsgUiIcon :name="tab.icon" />{{ $t(tab.label) }}</button>
  </nav>
</template>
<script setup>
import NsgUiIcon from "./NsgUiIcon.vue";
defineProps({ active: String });
defineEmits(["navigate"]);
const tabs = [
  { path: '/withdraw', icon: 'withdraw', label: 'das.dmk.withdraw' },
  { path: '/withdrawRecords', icon: 'history-clock', label: 'das.page.withdrawHistory' },
  { path: '/deposit', icon: 'history', label: 'das.dmk.depositHistory' },
];
</script>
<style>
.nsg-finance-nav { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); overflow: hidden; border-bottom: 1px solid #292d37; border-radius: 15px 15px 0 0; }
.nsg-finance-nav button { min-height: 62px; padding: 12px; display: flex; justify-content: center; align-items: center; gap: 12px; border: 0; color: #cfd1df; background: transparent; font: 500 17px/1.4 "DM Sans", Arial, sans-serif; letter-spacing: .06em; cursor: pointer; }
.nsg-finance-nav .active { color: #fff; background: var(--nsg-gradient); }
html #app .nsg-account-panel:has(.nsg-finance-page) { margin-top: 0 !important; max-width: 1216px; border: 1px solid #252833 !important; border-radius: 16px; box-shadow: none !important; background: radial-gradient(ellipse at 100% 80%, #29154966, transparent 38%), #090c14 !important; }
html #app .nsg-account-panel:has(.nsg-finance-page) .nsg-account-tabs { display: none; }
html #app .nsg-account-panel:has(.nsg-finance-page) .nsg-account-content { min-height: 830px !important; padding: 0 !important; background: transparent !important; }
html #app .nsg-account-page:has(.nsg-finance-page) { border: 0; border-radius: 0; background: #000 !important; }
.nsg-finance-page { color: #ccd1e1; font-family: "DM Sans", Arial, sans-serif; }
</style>
