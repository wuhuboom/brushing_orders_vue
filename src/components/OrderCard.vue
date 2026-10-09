<template>
  <article class="or-card">
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
        <strong
          >{{ money(item.totalAmount ?? item.price) }}<em> USD</em></strong
        >
      </div>
      <div>
        <span>{{ $t("das.records.commission") }}</span>
        <strong
          >{{ money(item.totalCommission ?? item.commission)
          }}<em> USD</em></strong
        >
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
import placeholder from "@/static/brain/record-fallback.png";
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
  `records-design-status records-design-status--${statusKey(status).split(".").pop()}`;
</script>


