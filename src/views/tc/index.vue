<template>
  <DmkH5Terms :content="content" :loading="loading" />
</template>
<script setup>
import { onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { getContentConfig } from "@/api/apis";
import DmkH5Terms from "@/components/dmkH5/DmkH5Terms.vue";
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
