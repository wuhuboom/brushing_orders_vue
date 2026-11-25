<template>
  <article class="or-card">
    <header class="or-card__head">
      <div class="or-card__date">
        <img src="/westermedia/record-clock.png" alt="" />
        <time>{{ formatDateTime(item.createTimeTimestamp) }}</time>
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
          <img v-for="star in 5" :key="star" src="/westermedia/rating-shortcut.png" alt="" />
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
        <strong>{{ money(item.totalCommission ?? item.commission) }}</strong
        ><em>USD</em>
      </div>
      <button
        v-if="isPending(item.status)"
        type="button"
        @click="$emit('submit', item)"
      >
        {{ $t("das.records.goSubmit") }}
        <img src="/westermedia/order-arrow.png" alt="" />
      </button>
    </footer>
  </article>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import placeholder from "@/static/brain/record-fallback.png";
import { formatDateTime } from "@/util/times";

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
