<template>
  <main class="das-page records-page">
    <HeaderTop />
    <section class="records-design-shell">
      <div class="records-design-titlebar">
        <button
          type="button"
          :aria-label="$t('das.common.back')"
          @click="safeBack(router, '/starting')"
        >
          <img src="@/static/brain/back.png" alt="" />
        </button>
        <h1>{{ $t("das.page.records") }}</h1>
      </div>
      <div class="records-design-tabs">
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
            class="records-design-card"
          >
            <header class="records-design-card__head">
              <time
                ><img src="@/static/brain/clock.png" alt="" />{{
                  formatDate(item.createTime)
                }}</time
              ><span :class="statusClass(item.status)">{{
                statusText(item.status)
              }}</span>
            </header>
            <div class="records-design-main">
              <img :src="imageUrl(item.coverUrl)" alt="" />
              <div>
                <h2>{{ item.goodsName }}</h2>
                <span
                  v-if="item.goodsDesc || item.description"
                  class="records-design-description"
                  >{{ item.goodsDesc || item.description }}</span
                >
                <strong>{{ money(item.price) }} <small>USD</small></strong>
                <p>★★★★★</p>
              </div>
            </div>
            <footer class="records-design-footer">
              <div>
                <small>{{ $t("das.records.total") }}</small
                ><b>{{ money(item.price) }} <span>USD</span></b>
              </div>
              <div>
                <small>{{ $t("das.records.commission") }}</small
                ><b>{{ money(item.commission) }} <span>USD</span></b>
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
<style scoped>
.records-page {
  min-height: 100vh;
  background: #040713 !important;
  background-image: none !important;
  color: #f7f8fc;
}
.records-design-shell {
  width: 100%;
  max-width: 720px;
  min-height: calc(100vh - 56px);
  margin: 0 auto;
  padding: 0 15px 116px;
}
.records-design-titlebar {
  position: relative;
  height: 55px;
  margin: 0 -15px;
  display: grid;
  place-items: center;
  align-items: center;
  border-bottom: 1px solid #121a30;
}
.records-design-titlebar button {
  position: absolute;
  z-index: 1;
  left: 15px;
  top: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
}
.records-design-titlebar button img {
  width: 40px;
  height: 40px;
  display: block;
  object-fit: contain;
}
.records-design-titlebar h1 {
  max-width: calc(100% - 110px);
  margin: 0;
  overflow: hidden;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.records-design-tabs {
  margin: 19px 0 18px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
}
.records-design-tabs button {
  min-width: 0;
  height: 37px;
  padding: 0 5px;
  border: 1px solid #343947;
  border-radius: 8px;
  background: #11141f;
  color: #98a4c1;
  font-size: 14px;
  font-weight: 400;
}
.records-design-tabs button.active {
  border-color: #087eff;
  background: linear-gradient(104deg, #08baff, #0878ff 48%, #4e22cf);
  color: #fff;
  font-weight: 600;
}
.records-design-card {
  width: 100%;
  margin-bottom: 16px;
  padding: 0 16px 12px;
  overflow: hidden;
  border: 1px solid #343947;
  border-radius: 7px;
  background: #11141f;
  color: #f7f8fc;
}
.records-design-card__head {
  min-height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.records-design-card time {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #8ea0c8;
  font-size: 14px;
  line-height: 1.2;
}
.records-design-card time img {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  object-fit: contain;
}
.records-design-status {
  min-width: 75px;
  height: 25px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #554716;
  border-radius: 7px;
  background: #302910;
  color: #ffc13c;
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;
}
.records-design-status--completed {
  border-color: #125c48;
  background: #0b3b31;
  color: #20c99a;
}
.records-design-status--frozen {
  border-color: #63283a;
  background: #3b1722;
  color: #ff5362;
}
.records-design-main {
  min-height: 127px;
  padding: 17px 0;
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  border-top: 1px solid #18223a;
  border-bottom: 1px solid #18223a;
}
.records-design-main > div {
  min-width: 0;
}
.records-design-main > img {
  width: 92px;
  height: 92px;
  display: block;
  object-fit: cover;
  border: 1px solid #263857;
  border-radius: 10px;
  background: #0b1223;
}
.records-design-main h2 {
  margin: 0;
  color: #fff;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.3;
  overflow-wrap: anywhere;
}
.records-design-main strong {
  display: block;
  margin-top: 17px;
  color: #09a9ff;
  font-size: 21px;
  line-height: 1.1;
}
.records-design-main strong small {
  margin-left: 7px;
  color: #9ba6c2;
  font-size: 14px;
  font-weight: 500;
}
.records-design-description {
  display: block;
  margin-top: 8px;
  color: #9ba6c2;
  font-size: 14px;
  line-height: 1.35;
}
.records-design-main p {
  margin: 8px 0 0;
  color: #ffa000;
  letter-spacing: 3px;
  font-size: 18px;
  line-height: 1;
}
.records-design-footer {
  min-height: 66px;
  padding-top: 8px;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr) auto;
  align-items: center;
  gap: 6px;
}
.records-design-footer div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.records-design-footer small {
  color: #8fa0c4;
  font-size: 14px;
}
.records-design-footer b {
  color: #09a9ff;
  font-size: 18px;
  line-height: 1;
  overflow-wrap: anywhere;
}
.records-design-footer b span {
  margin-left: 4px;
  color: #9ba6c2;
  font-size: 12px;
  font-weight: 500;
}
.records-design-footer button {
  min-width: 91px;
  height: 50px;
  padding: 0 12px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(105deg, #d6191c, #f37808);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}
.records-design-shell :deep(.van-list__finished-text) {
  display: none;
}

@media (min-width: 760px) {
  .records-design-shell {
    padding-right: 24px;
    padding-left: 24px;
  }
  .records-design-titlebar {
    margin-right: -24px;
    margin-left: -24px;
  }
}

@media (max-width: 350px) {
  .records-design-shell {
    padding-right: 12px;
    padding-left: 12px;
  }
  .records-design-tabs {
    gap: 5px;
  }
  .records-design-tabs button {
    font-size: 12px;
  }
  .records-design-card {
    padding-right: 12px;
    padding-left: 12px;
  }
  .records-design-main {
    grid-template-columns: 82px minmax(0, 1fr);
    gap: 12px;
  }
  .records-design-main > img {
    width: 82px;
    height: 82px;
  }
  .records-design-footer {
    gap: 6px;
  }
  .records-design-footer small,
  .records-design-footer b span {
    font-size: 12px;
  }
  .records-design-footer b {
    font-size: 17px;
  }
  .records-design-footer button {
    min-width: 82px;
    padding: 0 8px;
    font-size: 14px;
  }
}
</style>
