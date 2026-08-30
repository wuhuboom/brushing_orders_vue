<template>
  <DasContentPage
    title-key="das.page.activities"
    :content="content"
    :loading="loading"
    :fallback-image="activityPoster"
    placeholder-label-key="das.page.activityArtwork"
    :placeholder-count="1"
    placeholder-aspect-ratio="0.84 / 1"
  />
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getContentConfig } from "@/api/apis";
import DasContentPage from "@/components/DasContentPage.vue";
import activityPoster from "@/static/brain/activity-poster.png";
const content = ref("");
const loading = ref(true);
onMounted(async () => {
  try {
    content.value =
      (await getContentConfig()).data?.eventContent || activityPoster;
  } catch (_) {
    content.value = activityPoster;
  } finally {
    loading.value = false;
  }
});
</script>
