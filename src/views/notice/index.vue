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
        <template #loading><ReferenceLoading /></template>
        <button
          v-for="item in list"
          :key="item.id"
          class="bp-notification-card an-card"
          type="button"
          @click="
            safePush(router, { path: '/noticeDetail', query: { id: item.id } })
          "
        >
          <span class="an-card__cover"
            ><img src="/psybir/notice.png" alt="" /></span
          ><span class="an-card__body"
            ><span class="bp-notification-card__head">
              <b>{{ item.noticeTitle || item.title }}</b>
              <time>{{ relativeDate(item.createTime) }}</time>
            </span>
            <span
              class="bp-notification-card__content"
              v-text="item.noticeContent || item.content || item.summary"
            ></span
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
import ReferenceLoading from "@/components/ReferenceLoading.vue";
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
