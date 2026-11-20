<template>
  <main class="das-page records-page or-page">
    <HeaderTop />
    <div class="wm-page-scroll">
      <section class="or-main">
        <div class="or-titlebar">
          <button
            class="or-back"
            type="button"
            :aria-label="$t('das.common.back')"
            @click="safeBack(router, '/starting')"
          >
            <img
              class="poetic-back-arrow"
              src="/design500/back-white.png"
              alt=""
            />
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
            :aria-pressed="active === index"
            @click="switchTab(index)"
          >
            {{ $t(tab.label) }}
            <span v-if="tabCounts[tab.status] != null" class="wester-record-count">{{ tabCounts[tab.status] }}</span>
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
                  <img src="/westermedia/record-clock.png" alt="" /><time>{{
                    formatDateTime(item.createTimeTimestamp)
                  }}</time>
                </div>
                <span :class="['or-card__status', statusClass(item.status)]">
                  <img :src="statusIcons[statusKey(item.status)]" alt="" />
                  {{ statusText(item.status) }}
                </span>
              </header>
              <div class="or-card__body">
                <div class="or-card__image">
                  <img :src="imageUrl(item.coverUrl)" alt="" />
                </div>
                <div class="or-card__info">
                  <div class="wester-record-title">
                    <h2 :title="item.goodsName">{{ item.goodsName }}</h2>
                    <p>{{ money(item.price) }} <small>USD</small></p>
                  </div>
                  <span
                    v-if="item.goodsDesc || item.description"
                    class="records-design-description"
                    >{{ item.goodsDesc || item.description }}</span
                  >
                  <div class="or-card__price-rating">
                    <div class="or-card__stars" aria-label="rating">
                      <img src="/design500/star.png" alt="" />
                      <b>{{ item.rating }}</b>
                      <small
                        v-if="
                          item.reviewCount || item.reviews || item.reviewTotal
                        "
                      >
                        ({{
                          item.reviewCount || item.reviews || item.reviewTotal
                        }}
                        {{ $t("das.started.reviews") }})
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              <footer class="or-card__foot">
                <div>
                  <span>{{ $t("das.records.total") }}</span>
                  <strong>{{ money(item.totalAmount ?? item.price) }}</strong
                  ><em>USD</em>
                </div>
                <div>
                  <span>{{ $t("das.records.commission") }}</span>
                  <strong>{{ money(item.commission) }}</strong
                  ><em>USD</em>
                </div>
                <div>
                  <span>{{ $t("das.wester.profitRate") }}</span>
                  <strong>{{ formatOrderProfitRate(item) }}</strong>
                </div>
              </footer>
              <div class="wester-record-link">
                <small>{{ $t("das.product.briefNo") }}: {{ item.orderNo || item.id }}</small>
                <button
                  v-if="item.id"
                  type="button"
                  @click="openOrderDetails(item)"
                >
                  {{ $t("das.wester.viewDetails") }} <span aria-hidden="true">→</span>
                </button>
              </div>
            </article></van-list
        ></van-pull-refresh>
      </section>
      <Footer name="/records" />
    </div>
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
import { formatDateTime } from "@/util/times";
import { formatOrderProfitRate } from "@/utils/orderProfitRate";
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
const tabCounts = reactive({});
const statusIcons = {
  "das.records.pending": "/westermedia/record-pending.png",
  "das.records.completed": "/westermedia/record-completed.png",
  "das.records.frozen": "/westermedia/record-failed.png",
};
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
    if (total > 0 || finished.value) {
      tabCounts[params.status] = total || list.value.length;
    }
    if (!params.status && finished.value) {
      for (const tab of tabs.slice(1)) {
        tabCounts[tab.status] = list.value.filter((item) => String(item.status) === tab.status).length;
      }
    }
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
