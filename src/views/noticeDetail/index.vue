<template>
  <main class="das-page detail-page">
    <DasPageHeader title-key="das.page.notifications" back-to="/notice" />
    <article>
      <h1>{{ notice.noticeTitle }}</h1>
      <time>{{ formatDateTime(notice.createTimeTimestamp) }}</time>
      <div class="das-rich-text" v-html="notice.noticeContent"></div>
    </article>
  </main>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getNotice } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import { formatDateTime } from "@/util/times";
const route = useRoute(),
  notice = ref({});
onMounted(
  async () =>
    (notice.value = (await getNotice({ id: route.query.id })).data || {}),
);
</script>
