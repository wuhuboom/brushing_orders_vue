<template>
  <main class="das-page notice-page">
    <DasPageHeader title-key="das.page.notifications" />
    <section class="notice-list">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        :finished-text="$t('das.common.noMore')"
        @load="load"
      >
        <button
          v-for="item in list"
          :key="item.id"
          type="button"
          @click="
            safePush(router, { path: '/noticeDetail', query: { id: item.id } })
          "
        >
          <i aria-hidden="true"></i>
          <span
            ><b>{{ item.noticeTitle || item.title }}</b
            ><em>{{ item.noticeContent || item.content || item.summary }}</em
            ><small>◷&nbsp; {{ relativeDate(item.createTime) }}</small></span
          >
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
  min-height: 100%;
  background: #f7f5ec;
  color: #17382d;
}
.notice-list {
  max-width: 760px;
  margin: auto;
  padding: 20px 30px 0;
}
.notice-list button {
  width: 100%;
  min-height: 115px;
  padding: 22px 0;
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: 13px;
  border: 0;
  border-bottom: 1px solid #d9dcd5;
  background: transparent;
  color: #17382d;
  text-align: left;
}
.notice-list button > i {
  width: 7px;
  height: 7px;
  margin-top: 5px;
  border-radius: 50%;
  background: #14392c;
}
.notice-list button > span {
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.notice-list b {
  font-size: 16px;
}
.notice-list em {
  color: #808983;
  font-size: 13px;
  line-height: 1.5;
  font-style: normal;
}
.notice-list small {
  color: #9aa19c;
  font-size: 11px;
}
</style>
