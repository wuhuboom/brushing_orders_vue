<template>
  <article class="record-card">
    <header>
      <time>{{ formatDate(item.createTime) }}</time>
      <span :class="statusClass(item.status)">{{
        statusText(item.status)
      }}</span>
    </header>

    <div class="record-main">
      <img :src="imageUrl(item.coverUrl)" :alt="item.goodsName || ''" />
      <div>
        <h2>{{ item.goodsName }}</h2>
        <strong>{{ money(item.price) }} {{ $t("das.dmk.currencyUsd") }}</strong>
        <p :aria-label="$t('das.dmk.fiveStars')">★★★★★</p>
      </div>
    </div>

    <footer>
      <div>
        <small>{{ $t("das.records.total") }}</small>
        <b>{{ money(item.totalAmount ?? item.price) }} {{ $t("das.dmk.currencyUsd") }}</b>
      </div>
      <div>
        <small>{{ $t("das.records.commission") }}</small>
        <b>{{ money(item.totalCommission ?? item.commission) }} {{ $t("das.dmk.currencyUsd") }}</b>
      </div>
      <button
        v-if="isPending(item.status)"
        type="button"
        @click="$emit('submit', item)"
      >
        {{ $t("das.records.goSubmit") }} →
      </button>
    </footer>
  </article>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import placeholder from "@/static/das/image-placeholder.png";
import { formatTime } from "@/util/times";

defineProps({
  item: { type: Object, required: true },
});
defineEmits(["submit"]);

const { t } = useI18n();
const imageBaseUrl = window.g?.VITE_API_IMG_URL || "";
const imageUrl = (path) =>
  path
    ? /^https?:/i.test(path)
      ? path
      : `${imageBaseUrl}${path}`
    : placeholder;
const money = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const formatDate = (value) =>
  value === undefined || value === null || value === ""
    ? "—"
    : formatTime(value);
const isPending = (status) => String(status) === "1";
const statusKey = (status) =>
  String(status) === "0"
    ? "das.records.completed"
    : String(status) === "2"
      ? "das.records.frozen"
      : "das.records.pending";
const statusText = (status) => t(statusKey(status));
const statusClass = (status) =>
  `status status--${statusKey(status).split(".").pop()}`;
</script>

<style scoped>
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

@media (max-width: 360px) {
  .record-card footer {
    grid-template-columns: 1fr 1fr;
  }
  .record-card footer button {
    grid-column: 1 / -1;
  }
}
</style>
