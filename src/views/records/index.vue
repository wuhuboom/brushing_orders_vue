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
          <svg
            class="reference-back-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <h1>{{ $t("das.page.records") }}</h1>
      </div>
      <div class="or-tabs">
        <button
          v-for="(tab, index) in tabs"
          :key="tab.label"
          class="or-tab"
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
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M8 2v4M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path
                    d="M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"
                  />
                </svg>
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
                  <svg
                    v-for="star in 5"
                    :key="star"
                    fill="currentColor"
                    viewBox="0 0 576 512"
                    aria-hidden="true"
                  >
                    <path
                      d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                    />
                  </svg>
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
                {{ $t("das.records.goSubmit") }} →
              </button>
            </footer>
          </article></van-list
        ></van-pull-refresh
      >
    </section>
    <Footer name="/records" />
  </main>
</template>

<script setup>
import ReferenceLoading from "@/components/ReferenceLoading.vue";
import { reactive, ref } from "vue";
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
let requestVersion = 0;
const loadData = async () => {
  const version = ++requestVersion;
  const params = { ...query };
  try {
    const r = await getOrderInfos(params);
    if (version !== requestVersion) return;
    const rows = r.rows || [];
    list.value.push(...rows);
    const total = Number(r.total || 0);
    finished.value =
      rows.length < params.pageSize ||
      (total > 0 && list.value.length >= total);
    if (!finished.value) query.pageNum = params.pageNum + 1;
  } catch {
    if (version === requestVersion) finished.value = true;
  }
};
const onLoad = async () => {
    if (finished.value) {
      loading.value = false;
      return;
    }
    await loadData();
    loading.value = false;
  },
  onRefresh = async () => {
    refreshing.value = true;
    finished.value = false;
    loading.value = false;
    query.pageNum = 1;
    list.value = [];
    await loadData();
    refreshing.value = false;
  },
  switchTab = (i) => {
    if (active.value === i && list.value.length) return;
    active.value = i;
    query.status = tabs[i].status;
    onRefresh();
  };
</script>

