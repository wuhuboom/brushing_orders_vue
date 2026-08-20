<template>
  <main class="das-page vip-page">
    <DasPageHeader title-key="das.page.vip" />
    <section class="vip-list">
      <article
        v-for="(item, index) in displayLevels"
        :key="item.id"
        class="vip-card"
      >
        <img :src="levelIcon(item, index)" alt="" />
        <div class="vip-card__copy">
          <h2>{{ item.name || `VIP ${item.level || index + 1}` }}</h2>
          <strong>{{ item.metrics.price }}</strong>
          <div v-if="item.descriptionLines.length" class="vip-description">
            <p
              v-for="(line, lineIndex) in item.descriptionLines"
              :key="`${item.id}-description-${lineIndex}`"
            >
              {{ line }}
            </p>
          </div>
        </div>
        <b v-if="isCurrent(item)" class="current-badge">{{
          $t("das.vip.current")
        }}</b>
      </article>
    </section>
    <p class="das-page-copyright">{{ $t("das.common.copyright") }}</p>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { getLevel, userGetInfo } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import {
  getMemberLevelDescriptionLines,
  getMemberLevelMetrics,
} from "@/utils/memberLevel";

const levels = ref([]);
const user = ref({});
const base = window.g?.VITE_API_IMG_URL || "";
const displayLevels = computed(() =>
  levels.value.map((level) => ({
    ...level,
    metrics: getMemberLevelMetrics(level),
    descriptionLines: getMemberLevelDescriptionLines(level.description),
  })),
);
const levelColors = ["#e9792b", "#65a6d3", "#e4b500", "#e72d60", "#7032cf"];
const isCurrent = (item) =>
  String(user.value.levelId ?? user.value.vipId) ===
  String(item.id ?? item.level);
const image = (value) =>
  /^https?:/i.test(value || "") ? value : `${base}${value}`;
const medal = (color) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 78"><path fill="${color}" d="M16 45 12 76l20-11 20 11-4-31z"/><circle cx="32" cy="31" r="25" fill="${color}"/><circle cx="32" cy="31" r="19" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/><path fill="#fff" d="m32 18 4 8 9 1-6 7 2 9-9-5-9 5 2-9-6-7 9-1z"/></svg>`)}`;
const levelIcon = (item, index) =>
  item.icon ? image(item.icon) : medal(levelColors[index % levelColors.length]);
onMounted(async () => {
  try {
    levels.value = (await getLevel()).data || [];
  } catch (_) {}
  try {
    user.value = (await userGetInfo()).data || {};
  } catch (_) {}
});
</script>

<style scoped>
.vip-page {
  min-height: 100%;
  background: #f7f5ec;
  color: #17382d;
}
.vip-list {
  max-width: 800px;
  margin: auto;
  padding: 22px 24px 4px;
  display: grid;
  gap: 14px;
}
.vip-card {
  min-height: 204px;
  padding: 28px 24px;
  position: relative;
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 20px;
  border-radius: 22px;
  background: #fff;
}
.vip-card > img {
  width: 54px;
  height: 66px;
  object-fit: contain;
}
.vip-card h2 {
  margin: 0 0 8px;
  font-size: 20px;
}
.vip-card strong {
  font-size: 16px;
}
.vip-description {
  margin: 16px 0 0;
  color: #87908a;
  font-size: 14px;
  line-height: 1.7;
}
.vip-description p {
  margin: 0;
}
.current-badge {
  position: absolute;
  right: 0;
  top: 0;
  padding: 12px 18px;
  border-radius: 0 21px 0 18px;
  background: #14392c;
  color: #f7f5ec;
  font-size: 11px;
}
.das-page-copyright {
  margin-top: 12px;
}
@media (min-width: 760px) {
  .vip-list {
    grid-template-columns: 1fr 1fr;
  }
  .vip-card {
    min-height: 235px;
  }
  .vip-card:last-child:nth-child(odd) {
    grid-column: 1/-1;
  }
}
</style>
