<template>
  <component :is="decorative ? 'span' : 'button'" class="nsg-back-button" :type="decorative ? undefined : 'button'" :aria-hidden="decorative || undefined" :aria-label="decorative ? undefined : $t('das.common.back')">
    <NsgUiIcon name="back" />
  </component>
</template>
<script setup>
import NsgUiIcon from "./NsgUiIcon.vue";
defineProps({ decorative: Boolean });
</script>
<style>
@media (max-width: 1023px) {
  html body #app .nsg-back-button {
    display: inline-flex !important; align-items: center; justify-content: center;
    box-sizing: border-box; width: 52px !important; height: 52px !important;
    min-width: 52px; flex: 0 0 52px; margin: 0; padding: 0 !important;
    border: 1px solid #263047 !important; border-radius: 13px !important;
    background: #080d18 !important; color: #aeb9d0 !important;
    font-size: 22px !important; line-height: 1; cursor: pointer;
  }
  html body #app .nsg-back-button > svg { display: block; width: 22px; height: 22px; margin: 0; }
  html body #app .nsg-back-button:focus-visible { outline: 2px solid #79c9ff; outline-offset: 3px; }
  html body #app :is(.nsg-mobile-page-title, .nsg-mobile-section-bar, .das-page-head__title):has(> .nsg-back-button) {
    display: grid; grid-template-columns: 52px minmax(0, 1fr) 52px; gap: 8px;
    box-sizing: border-box; width: 100%; height: auto !important; min-height: 80px !important;
    align-items: center; margin: 0; padding: 12px 20px !important;
    border-bottom: 1px solid #263047; background: #000;
  }
  html body #app :is(.nsg-mobile-page-title, .nsg-mobile-section-bar, .das-page-head__title):has(> .nsg-back-button) > :is(strong, h1) {
    margin: 0; text-align: center;
  }
  html body #app .dmk-payment-methods-scope:not(.nsg-wallet-editing) > .nsg-wallet-mobile-title:has(> .nsg-back-button) {
    width: calc(100% + 40px); margin: -30px -20px 0;
  }
  html body #app .nsg-auth-back.nsg-back-button { margin: 12px 20px; }
}
</style>
