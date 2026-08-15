<template>
  <DasContentPage
    title-key="das.page.activities"
    :content="content"
    :fallback-image="fallback"
    :loading="loading"
  />
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getContentConfig } from "@/api/apis";
import DasContentPage from "@/components/DasContentPage.vue";
import fallback from "@/static/das/Das activities.jpg";
const content = ref("");
const loading = ref(true);
onMounted(async () => {
  try {
    content.value = (await getContentConfig()).data?.eventContent || "";
  } finally {
    loading.value = false;
  }
});
</script>
