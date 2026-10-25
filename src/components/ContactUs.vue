<template>
  <span class="contact-route-proxy" aria-hidden="true"></span>
</template>
<script setup>
import { openCustomerServiceDialog } from "@/utils/customerServiceDialog";
const open = () => openCustomerServiceDialog();
const close = () => undefined;
defineExpose({ open, close });
</script>
<style scoped>
.contact-route-proxy {
  display: none;
}
</style>
