<template>
  <DasContentPage
    title-key="das.page.terms"
    :content="content"
    :loading="loading"
  />
</template>
<script setup>
import { onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { getContentConfig } from "@/api/apis";
import DasContentPage from "@/components/DasContentPage.vue";
import { useRegistrationDraft } from "@/composables/useRegistrationDraft";
const content = ref(""),
  loading = ref(true);
const { clearDraft } = useRegistrationDraft();

onBeforeRouteLeave((to) => {
  if (to.path !== "/account/register") clearDraft();
});

onMounted(async () => {
  try {
    content.value = (await getContentConfig()).data?.protocolContent || "";
  } finally {
    loading.value = false;
  }
});
</script>
