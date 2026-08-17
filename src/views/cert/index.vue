<template>
  <DasContentPage
    title-key="das.page.certificate"
    :content="content"
    :loading="loading"
    placeholder-label-key="das.page.certificate"
    :placeholder-count="1"
    placeholder-aspect-ratio="0.76 / 1"
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
    content.value = (await getContentConfig()).data?.certificateContent || "";
  } finally {
    loading.value = false;
  }
});
</script>
