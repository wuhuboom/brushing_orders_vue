<template>
  <DasContentPage
    title-key="das.page.certificate"
    :content="content"
    :fallback-image="fallback"
    :loading="loading"
  />
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getContentConfig } from "@/api/apis";
import DasContentPage from "@/components/DasContentPage.vue";
import fallback from "@/static/das/Das-cert.png";
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
