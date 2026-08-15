<template>
  <main class="das-page records-page">
    <HeaderTop />
    <section class="records-content">
      <div class="records-title">
        <button type="button" @click="safeBack(router, '/starting')">‹</button>
        <h1>{{ $t("das.page.records") }}</h1>
      </div>
      <div class="records-tabs">
        <button
          v-for="(tab, index) in tabs"
          :key="tab.label"
          :class="{ active: active === index }"
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
          ><article
            v-for="item in list"
            :key="item.id || item.orderNo"
            class="record-card"
          >
            <header>
              <time>{{ formatDate(item.createTime) }}</time
              ><span :class="statusClass(item.status)">{{
                statusText(item.status)
              }}</span>
            </header>
            <div class="record-main">
              <img :src="imageUrl(item.coverUrl)" alt="" />
              <div>
                <h2>{{ item.goodsName }}</h2>
                <strong>{{ money(item.price) }} USD</strong>
                <p>★★★★★</p>
              </div>
            </div>
            <footer>
              <div>
                <small>{{ $t("das.records.total") }}</small
                ><b>{{ money(item.price) }} USD</b>
              </div>
              <div>
                <small>{{ $t("das.records.commission") }}</small
                ><b>{{ money(item.commission) }} USD</b>
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
      <p class="records-copyright">{{ $t("das.common.copyright") }}</p>
    </section>
    <Footer name="/records" />
  </main>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { getOrderInfos } from "@/api/apis";
import HeaderTop from "@/components/HeaderTop.vue";
import Footer from "@/components/Footer.vue";
import placeholder from "@/static/das/image-placeholder.png";
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
    { label: "das.records.frozen", status: "2" },
  ],
  imageUrl = (p) =>
    p ? (/^https?:/i.test(p) ? p : `${base}${p}`) : placeholder,
  money = (v) =>
    Number(v || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  formatDate = (v) => (v === undefined || v === null || v === "" ? "—" : formatTime(v)),
  isPending = (s) => String(s) === "1",
  statusKey = (s) =>
    String(s) === "0"
      ? "das.records.completed"
      : String(s) === "2"
        ? "das.records.frozen"
        : "das.records.pending",
  statusText = (s) => t(statusKey(s)),
  statusClass = (s) => `status status--${statusKey(s).split(".").pop()}`;
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
      rows.length < params.pageSize || (total > 0 && list.value.length >= total);
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
<style scoped>
.records-page {
  min-height: 100vh;
  background: #14392c;
  color: #f7f5ec;
}
.records-content {
  padding: 28px 24px 35px;
}
.records-title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.records-title button {
  position: absolute;
  left: 8px;
  border: 0;
  background: none;
  color: inherit;
  font-size: 31px;
}
.records-title h1 {
  margin: 0;
  font-size: 24px;
}
.records-tabs {
  margin: 24px 0 18px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
}
.records-tabs button {
  height: 42px;
  padding: 0 7px;
  border: 1px solid rgba(247, 245, 236, 0.35);
  border-radius: 999px;
  background: transparent;
  color: rgba(247, 245, 236, 0.72);
  font-size: 12px;
  font-weight: 700;
}
.records-tabs button.active {
  border-color: #f7f5ec;
  background: #f7f5ec;
  color: #17382d;
}
.record-card {
  margin-bottom: 14px;
  padding: 17px;
  border-radius: 22px;
  background: #fff;
  color: #17382d;
}
.record-card header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.record-card time {
  color: #818882;
  font-size: 11px;
}
.status {
  padding: 8px 14px;
  border-radius: 999px;
  background: #14392c;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
}
.status--pending {
  background: #efaa99;
  color: #17382d;
}
.status--frozen {
  background: #eaeeeb;
  color: #17382d;
}
.record-main {
  padding: 14px 0;
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 17px;
}
.record-main img {
  width: 84px;
  height: 84px;
  padding: 8px;
  object-fit: contain;
  border-radius: 14px;
  background: #f5f5ee;
}
.record-main h2 {
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 1.3;
}
.record-main strong {
  font-size: 16px;
}
.record-main p {
  margin: 6px 0 0;
  color: #e49281;
  letter-spacing: 2px;
  font-size: 14px;
}
.record-card footer {
  padding-top: 13px;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: end;
  gap: 8px;
  border-top: 1px solid #e3e5e1;
}
.record-card footer div {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.record-card footer small {
  color: #8b918c;
  font-size: 10px;
}
.record-card footer b {
  font-size: 13px;
}
.record-card footer button {
  height: 38px;
  padding: 0 15px;
  border: 0;
  border-radius: 999px;
  background: #14392c;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}
.records-copyright {
  margin: 34px 0 0;
  text-align: center;
  color: rgba(247, 245, 236, 0.42);
  font-size: 9px;
}
</style>
