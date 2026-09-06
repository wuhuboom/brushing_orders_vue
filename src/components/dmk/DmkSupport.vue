<template>
  <button
    type="button"
    :aria-label="$t('das.dmk.customerSupport')"
    class="dmk-support-launcher cursor-pointer hover:scale-110 transition-transform duration-300"
    :class="inline ? 'is-inline' : 'fixed bottom-6 right-6 z-50'"
    @click="open"
  >
    <img src="/nsg16/support-agent.png" alt="" />
  </button>
</template>

<script setup>
import { openCustomerServiceDialog } from "@/utils/customerServiceDialog";

defineProps({ inline: { type: Boolean, default: false } });
const open = () => openCustomerServiceDialog();
defineExpose({ open });
</script>

<style scoped>
.dmk-support-launcher {
  width: 74px;
  height: 74px;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 50%;
  background: transparent;
  filter: drop-shadow(0 8px 15px rgba(51, 62, 255, 0.34));
}

.dmk-support-launcher img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (max-width: 759px) {
  .dmk-support-launcher:not(.is-inline) {
    right: 14px !important;
    bottom: 22px !important;
    width: 58px;
    height: 58px;
  }
}
</style>
