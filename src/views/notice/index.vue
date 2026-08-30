<template>
  <main class="das-page notice-page">
    <DasPageHeader title-key="das.page.notifications" />
    <section class="bp-notifications-list">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        :finished-text="$t('das.common.noMore')"
        @load="load"
      >
        <button
          v-for="item in list"
          :key="item.id"
          class="bp-notification-card"
          type="button"
          @click="
            safePush(router, { path: '/noticeDetail', query: { id: item.id } })
          "
        >
          <span class="bp-notification-card__head">
            <b>{{ item.noticeTitle || item.title }}</b>
            <time>{{ relativeDate(item.createTime) }}</time>
          </span>
          <span
            class="bp-notification-card__content"
            v-text="item.noticeContent || item.content || item.summary"
          ></span>
        </button>
      </van-list>
    </section>
    <p class="das-page-copyright">{{ $t("das.common.copyright") }}</p>
  </main>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { safePush } from "@/utils/navigation";
import { getNoticeList } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
const router = useRouter(),
  list = ref([]),
  loading = ref(false),
  finished = ref(false),
  q = reactive({ pageNum: 1, pageSize: 10 });
const relativeDate = (v) =>
  String(v || "")
    .replace("T", " ")
    .slice(0, 16);
const load = async () => {
  if (finished.value) return;
  loading.value = true;
  try {
    const r = await getNoticeList(q);
    list.value.push(...r.rows);
    finished.value = r.rows.length < q.pageSize;
    if (!finished.value) q.pageNum++;
  } finally {
    loading.value = false;
  }
};
</script>
<style scoped>
.notice-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #020717;
  color: #f4f5f8;
}
.bp-notifications-list {
  width: calc(100% - 46px);
  max-width: 840px;
  margin: 15px auto 0;
}
.bp-notification-card {
  position: relative;
  width: 100%;
  min-height: 100px;
  margin: 0 0 9px;
  padding: 19px 17px 11px 22px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  border: 1px solid #343946;
  border-radius: 6px;
  background: #12151f;
  color: #f1f2f6;
  text-align: left;
  box-shadow: none;
}
.bp-notification-card::before {
  position: absolute;
  inset: -1px auto -1px -1px;
  width: 4px;
  background: #12d1de;
  content: "";
}
.bp-notification-card__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 14px;
}
.bp-notification-card__head b {
  min-width: 0;
  color: #f1f2f6;
  font-size: 16px;
  line-height: 1.3;
  font-weight: 400;
  overflow-wrap: anywhere;
}
.bp-notification-card__head time {
  padding-top: 1px;
  color: #13d1df;
  font-size: 13px;
  line-height: 1.35;
  white-space: nowrap;
}
.bp-notification-card__content {
  margin-top: 9px;
  display: block;
  color: #c7c8d1;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-line;
  overflow-wrap: anywhere;
}
.bp-notifications-list :deep(.van-list__finished-text) {
  display: none;
}
.notice-page > .das-page-copyright {
  margin-top: auto;
  padding-top: 35px;
}
@media (max-width: 360px) {
  .bp-notifications-list {
    width: calc(100% - 32px);
  }
  .bp-notification-card {
    padding-right: 14px;
    padding-left: 18px;
  }
  .bp-notification-card__head {
    gap: 9px;
  }
  .bp-notification-card__head time {
    font-size: 12px;
  }
}
</style>
