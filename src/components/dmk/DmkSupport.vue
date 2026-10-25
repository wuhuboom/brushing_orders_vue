<template>
  <button
    type="button"
    :aria-label="$t('das.dmk.customerSupport')"
    class="fixed bottom-6 right-6 z-50 bg-[#555] p-2 rounded-full cursor-pointer hover:scale-110 transition-transform duration-300"
    @click="open"
  >
    <img class="w-8 h-8 md:w-16 md:h-16" src="/dmk/assets/kf.svg" alt="" />
  </button>
</template>

<script setup>
import { openCustomerServiceDialog } from "@/utils/customerServiceDialog";

const open = () => openCustomerServiceDialog();
defineExpose({ open });
</script>
