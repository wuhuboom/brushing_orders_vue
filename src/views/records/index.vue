<template>
  <main class="das-page records-page or-page">
    <HeaderTop />
    <section class="or-main">
      <div class="or-titlebar">
        <button
          class="or-back"
          type="button"
          :aria-label="$t('das.common.back')"
          @click="safeBack(router, '/starting')"
        >
          <img src="/psybir/back.png" alt="" />
        </button>
        <h1>{{ $t("das.page.records") }}</h1>
      </div>
      <div class="or-tabs">
        <button
          v-for="(tab, index) in tabs"
          :key="tab.label"
          class="or-tab"
          :data-status="tab.status"
          :class="{ 'or-tab--active': active === index }"
          type="button"
          @click="switchTab(index)"
        >
          {{ $t(tab.label) }}
        </button>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
        ><van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('das.common.noMore')"
          @load="onLoad"
        >
          <template #loading><ReferenceLoading /></template>
          <article
            v-for="item in list"
            :key="item.id || item.orderNo"
            class="or-card"
          >
            <header class="or-card__head">
              <div class="or-card__date">
                <img src="/psybir/calendar.png" alt="" />
                <time>{{ formatDate(item.createTime) }}</time>
              </div>
              <span :class="['or-card__status', statusClass(item.status)]">{{
                statusText(item.status)
              }}</span>
            </header>
            <div class="or-card__body">
              <div class="or-card__image">
                <img :src="imageUrl(item.coverUrl)" alt="" />
              </div>
              <div class="or-card__info">
                <h2>{{ item.goodsName }}</h2>
                <span
                  v-if="item.goodsDesc || item.description"
                  class="records-design-description"
                  >{{ item.goodsDesc || item.description }}</span
                >
                <p>{{ money(item.price) }} USD</p>
                <div class="or-card__stars" aria-label="rating">
                  <img
                    v-for="star in 5"
                    :key="star"
                    src="/psybir/star.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <footer class="or-card__foot">
              <div>
                <span>{{ $t("das.records.total") }}</span>
                <strong>{{ money(item.price) }}<em> USD</em></strong>
              </div>
              <div>
                <span>{{ $t("das.records.commission") }}</span>
                <strong>{{ money(item.commission) }}<em> USD</em></strong>
              </div>
              <button
                v-if="isPending(item.status)"
                type="button"
                @click="openOrderDetails(item)"
              >
                {{ $t("das.records.goSubmit") }}
                <img src="/psybir/arrow-right.png" alt="" />
              </button>
            </footer></article></van-list
      ></van-pull-refresh>
    </section>
    <Footer name="/records" />
  </main>
</template>

<script setup>
import ReferenceLoading from "@/components/ReferenceLoading.vue";
import { onBeforeUnmount, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { getOrderInfos } from "@/api/apis";
import HeaderTop from "@/components/HeaderTop.vue";
import Footer from "@/components/Footer.vue";
import placeholder from "@/static/brain/record-fallback.png";
import { formatTime } from "@/util/times";
import { safeBack, safePush } from "@/utils/navigation";
const router = useRouter(),
  { t } = useI18n(),
  base = window.g?.VITE_API_IMG_URL || "",
  active = ref(0),
  list = ref([]),
  loading = ref(false),
  refreshing = ref(false),
  finished = ref(false),
  query = reactive({ pageNum: 1, pageSize: 10, status: "" });
const tabs = [
    { label: "das.records.all", status: "" },
    { label: "das.records.pending", status: "1" },
    { label: "das.records.completed", status: "0" },
  ],
  imageUrl = (p) =>
    p ? (/^https?:/i.test(p) ? p : `${base}${p}`) : placeholder,
  money = (v) =>
    Number(v || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  formatDate = (v) =>
    v === undefined || v === null || v === "" ? "—" : formatTime(v),
  isPending = (s) => String(s) === "1",
  statusKey = (s) =>
    String(s) === "0"
      ? "das.records.completed"
      : String(s) === "2"
        ? "das.records.frozen"
        : "das.records.pending",
  statusText = (s) => t(statusKey(s)),
  statusClass = (s) =>
    `records-design-status records-design-status--${statusKey(s).split(".").pop()}`;
const openOrderDetails = (item) => {
  try {
    sessionStorage.setItem(`dasOrder:${item.id}`, JSON.stringify(item));
  } catch (_) {}
  safePush(router, { path: "/productInfo", query: { id: item.id } });
};
let requestController;
const loadData = async () => {
  if (requestController) return;
  const controller = new AbortController();
  requestController = controller;
  loading.value = true;
  const params = { ...query };
  try {
    const r = await getOrderInfos(params, { signal: controller.signal });
    if (requestController !== controller) return;
    const rows = r.rows || [];
    list.value.push(...rows);
    const total = Number(r.total || 0);
    finished.value =
      rows.length < params.pageSize ||
      (total > 0 && list.value.length >= total);
    if (!finished.value) query.pageNum = params.pageNum + 1;
  } catch {
    if (requestController === controller) finished.value = true;
  } finally {
    if (requestController === controller) {
      requestController = undefined;
      loading.value = false;
      refreshing.value = false;
    }
  }
};
const onLoad = async () => {
    if (finished.value) {
      if (!requestController) loading.value = false;
      return;
    }
    await loadData();
  },
  onRefresh = async () => {
    const previousController = requestController;
    requestController = undefined;
    previousController?.abort();
    loading.value = true;
    refreshing.value = true;
    finished.value = false;
    query.pageNum = 1;
    list.value = [];
    await loadData();
  },
  switchTab = (i) => {
    if (active.value === i) return;
    active.value = i;
    query.status = tabs[i].status;
    onRefresh();
  };
onBeforeUnmount(() => {
  const controller = requestController;
  requestController = undefined;
  controller?.abort();
});
</script>
