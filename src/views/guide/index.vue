<template>
  <DasContentPage
    title-key="das.page.guide"
    :content="content"
    :loading="loading"
  />
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getContentConfig } from "@/api/apis";
import DasContentPage from "@/components/DasContentPage.vue";
const content = ref(""),
  loading = ref(true);
onMounted(async () => {
  try {
    const d = (await getContentConfig()).data || {};
    content.value =
      d.usageDescription ||
      d.orderDescription ||
      d.transactionDescription ||
      "";
  } finally {
    loading.value = false;
  }
});
</script>
