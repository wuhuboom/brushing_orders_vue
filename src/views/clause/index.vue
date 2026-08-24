<template>
  <DmkRichContentPage :content="content" :loading="loading" />
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getContentConfig } from "@/api/apis";
import DmkRichContentPage from "@/components/dmk/DmkRichContentPage.vue";
const content = ref(""),
  loading = ref(true);
onMounted(async () => {
  try {
    content.value = (await getContentConfig()).data?.termsContent || "";
  } finally {
    loading.value = false;
  }
});
</script>
