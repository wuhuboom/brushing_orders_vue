<template>
  <DmkRichContentPage
    :content="content"
    :loading="loading"
    :title="$t('das.dmk.termsTitle')"
    back-fallback="/account/register"
    registration
  />
</template>
<script setup>
import DmkRichContentPage from "@/components/dmk/DmkRichContentPage.vue";
defineProps({ content: { type: String, default: "" }, loading: Boolean });
</script>
