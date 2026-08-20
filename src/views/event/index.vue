<template>
  <DasContentPage
    title-key="das.page.activities"
    :content="content"
    :loading="loading"
    placeholder-label-key="das.page.activityArtwork"
    :placeholder-count="2"
    placeholder-aspect-ratio="0.84 / 1"
  />
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getContentConfig } from "@/api/apis";
import DasContentPage from "@/components/DasContentPage.vue";
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
