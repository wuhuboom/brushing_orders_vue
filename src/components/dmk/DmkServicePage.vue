<template>
  <DmkPcLayout>
    <DmkServiceContent :service="service" />
  </DmkPcLayout>
  <DmkH5Layout class="dmk-mobile-current">
    <DmkServiceContent :service="service" mobile />
  </DmkH5Layout>
</template>

<script setup>
import DmkPcLayout from "@/components/dmkPc/DmkPcLayout.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import DmkServiceContent from "./DmkServiceContent.vue";

defineProps({ service: { type: String, required: true } });
</script>
