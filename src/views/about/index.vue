<template>
  <DasContentPage
    title-key="das.page.about"
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
    content.value = (await getContentConfig()).data?.aboutContent || "";
  } finally {
    loading.value = false;
  }
});
</script>
