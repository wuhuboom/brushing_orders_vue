<template>
  <DmkRichContentPage
    :content="content"
    :loading="loading"
    :title="$t('das.dmk.tax')"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getContentConfig } from "@/api/apis";
import DmkRichContentPage from "@/components/dmk/DmkRichContentPage.vue";

const content = ref("");
const loading = ref(true);

onMounted(async () => {
  try {
    content.value = (await getContentConfig()).data?.taxContent || "";
  } finally {
    loading.value = false;
  }
});
</script>
