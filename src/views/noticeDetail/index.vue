<template>
  <main class="das-page detail-page">
    <DasPageHeader title-key="das.page.notifications" back-to="/notice" />
    <article>
      <h1>{{ notice.noticeTitle }}</h1>
      <time>{{
        String(notice.createTime || "")
          .replace("T", " ")
          .slice(0, 19)
      }}</time>
      <div class="das-rich-text" v-html="notice.noticeContent"></div>
    </article>
  </main>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getNotice } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
const route = useRoute(),
  notice = ref({});
onMounted(
  async () =>
    (notice.value = (await getNotice({ id: route.query.id })).data || {}),
);
</script>
<style scoped>
.detail-page {
  min-height: 100%;
  background: #f7f5ec;
  color: #17382d;
}
.detail-page article {
  max-width: 760px;
  margin: auto;
  padding: 38px 30px;
}
.detail-page h1 {
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 500;
}
.detail-page time {
  color: #888f89;
  font-size: 12px;
}
.detail-page .das-rich-text {
  margin-top: 28px;
}
</style>
