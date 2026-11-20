<template>
  <main class="das-page notice-page">
    <DasPageHeader title-key="das.page.notifications" />
    <section class="bp-notifications-list">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        :finished-text="$t('das.wester.endNotifications')"
        @load="load"
      >
        <template #loading><ReferenceLoading /></template>
        <template v-for="(item, index) in list" :key="item.id">
        <p v-if="index === 0 || noticeGroup(item) !== noticeGroup(list[index - 1])" class="wester-notice-group">
          {{ $t(noticeGroup(item)) }}
        </p>
        <button
          class="bp-notification-card an-card"
          type="button"
          @click="
            safePush(router, { path: '/noticeDetail', query: { id: item.id } })
          "
        >
          <span class="an-card__cover"
            ><img :src="noticeIcon(item)" alt="" /></span
          ><span class="an-card__body"
            ><span class="bp-notification-card__head">
              <small v-if="item.categoryName">{{ item.categoryName }}</small>
              <time>{{ formatDateTime(item.createTimeTimestamp) }}</time>
            </span>
            <b class="wester-notice-title">{{ item.noticeTitle || item.title }}</b>
            <span
              class="bp-notification-card__content"
              v-text="item.noticeContent || item.content || item.summary"
            ></span
          ></span>
        </button>
        </template>
      </van-list>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { safePush } from "@/utils/navigation";
import { getNoticeList } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import ReferenceLoading from "@/components/ReferenceLoading.vue";
import { resolveProfileImageUrl } from "@/utils/avatar";
import { formatDateTime, parseDateTime } from "@/util/times";
const router = useRouter(),
  list = ref([]),
  loading = ref(false),
  finished = ref(false),
  q = reactive({ pageNum: 1, pageSize: 10 });
const noticeGroup = (item) => {
  const date = parseDateTime(item.createTimeTimestamp);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "das.wester.today";
  return today - date < 7 * 24 * 60 * 60 * 1000
    ? "das.wester.earlierThisWeek"
    : "das.wester.earlier";
};
const noticeIcon = (item) => {
  const supplied = resolveProfileImageUrl(item.icon, window.g?.VITE_API_IMG_URL);
  if (supplied) return supplied;
  const category = String(item.categoryName || item.category || item.type || "");
  if (/commission|rebate/i.test(category)) return "/westermedia/notice-commission.png";
  if (/system|maintenance/i.test(category)) return "/westermedia/notice-system.png";
  if (/security/i.test(category)) return "/westermedia/notice-security.png";
  if (/withdraw|wallet/i.test(category)) return "/westermedia/notice-wallet.png";
  return "/westermedia/notice-support.png";
};
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
