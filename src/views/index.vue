<template>
  <DmkPcLayout>
    <DmkPcHomeContent />
  </DmkPcLayout>
  <DmkH5Layout class="dmk-mobile-current">
    <DmkH5HomeContent />
  </DmkH5Layout>
</template>

<script setup>
import DmkH5HomeContent from "@/components/dmkH5/DmkH5HomeContent.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import DmkPcHomeContent from "@/components/dmkPc/DmkPcHomeContent.vue";
import DmkPcLayout from "@/components/dmkPc/DmkPcLayout.vue";
</script>
