<template>
  <DmkPcLayout>
    <main class="nsg-vip-page nsg-vip-page--pc">
      <p class="nsg-vip-breadcrumb">{{ $t("das.dmk.profile") }} <span>›</span> {{ $t("das.dmk.vipLevels") }}</p>
      <header class="nsg-vip-hero"><div><h1>{{ $t("das.dmk.vipLevels") }}</h1><p>{{ $t("das.nsg.vipIntro") }}<br />{{ $t("das.nsg.vipUpgrade") }}</p></div><img src="/nsg16/vip-hero.png" alt="" /></header>
      <div class="nsg-vip-grid">
        <article v-for="(item, index) in displayLevels" :key="item.id || item.level || index" class="nsg-vip-card" :class="{ 'is-current': isCurrent(item), 'is-inactive': hasCurrentLevel && !isCurrent(item) }">
          <span v-if="isCurrent(item)" class="nsg-vip-current">{{ $t("das.vip.current") }}</span>
          <header><img :src="levelIcon(item, index)" alt="" /><div><h2>{{ item.name || `VIP${item.level || index + 1}` }}</h2><NsgVipBadge :label="item.name || `VIP${item.level || index + 1}`" /></div></header>
          <div class="nsg-vip-benefits"><p v-for="(line, lineIndex) in item.descriptionLines" :key="`${item.id || index}-description-${lineIndex}`" :class="{ 'is-muted': /no access/i.test(line) }">{{ line.replace(/^\s*[•●·]\s*/, '') }}</p></div>
        </article>
      </div>
    </main>
  </DmkPcLayout>
  <DmkH5Layout class="dmk-mobile-current">
    <div class="nsg-mobile-section-bar"><NsgBackButton decorative /><strong>{{ $t("das.dmk.vipLevels") }}</strong><i aria-hidden="true"></i></div>
    <main class="nsg-vip-page nsg-vip-page--mobile">
      <header class="nsg-vip-hero"><div><h1>{{ $t("das.dmk.vipLevels") }}</h1><p>{{ $t("das.nsg.vipIntro") }}<br />{{ $t("das.nsg.vipUpgrade") }}</p></div><img src="/nsg16/vip-hero.png" alt="" /></header>
      <div class="nsg-vip-grid">
        <article v-for="(item, index) in displayLevels" :key="item.id || item.level || index" class="nsg-vip-card" :class="{ 'is-current': isCurrent(item), 'is-inactive': hasCurrentLevel && !isCurrent(item) }">
          <span v-if="isCurrent(item)" class="nsg-vip-current">{{ $t("das.vip.current") }}</span>
          <header><img :src="levelIcon(item, index)" alt="" /><div><h2>{{ item.name || `VIP${item.level || index + 1}` }}</h2><NsgVipBadge :label="item.name || `VIP${item.level || index + 1}`" /></div></header>
          <div class="nsg-vip-benefits"><p v-for="(line, lineIndex) in item.descriptionLines" :key="`${item.id || index}-description-${lineIndex}`" :class="{ 'is-muted': /no access/i.test(line) }">{{ line.replace(/^\s*[•●·]\s*/, '') }}</p></div>
        </article>
      </div>
    </main>
  </DmkH5Layout>
</template>

<script setup>
import NsgBackButton from "@/components/dmk/NsgBackButton.vue";
import { computed, onMounted, ref } from "vue";
import { getLevel, userGetInfo } from "@/api/apis";
import DmkPcLayout from "@/components/dmkPc/DmkPcLayout.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import NsgVipBadge from "@/components/nsg/NsgVipBadge.vue";
import {
  getMemberLevelDescriptionLines,
  getMemberLevelMetrics,
} from "@/utils/memberLevel";

const levels = ref([]);
const user = ref({});
const base = window.g?.VITE_API_IMG_URL || "";
const displayLevels = computed(() =>
  [...levels.value]
    .sort(
      (left, right) =>
        Number(left.level ?? left.id) - Number(right.level ?? right.id),
    )
    .map((level) => ({
      ...level,
      metrics: getMemberLevelMetrics(level),
      descriptionLines: getMemberLevelDescriptionLines(level.description),
    })),
);
const levelColors = ["#e9792b", "#65a6d3", "#e4b500", "#e72d60", "#7032cf"];

const currentLevelKey = computed(() => {
  const value =
    user.value.levelId ??
    user.value.vipId ??
    user.value.userLevel?.id ??
    user.value.userLevel?.level ??
    user.value.memberLevel?.id ??
    user.value.memberLevel?.level;

  return value === undefined || value === null || value === ""
    ? ""
    : String(value);
});

const hasCurrentLevel = computed(() => currentLevelKey.value !== "");

const isCurrent = (item) =>
  currentLevelKey.value !== "" &&
  currentLevelKey.value ===
    String(item.id ?? item.levelId ?? item.level ?? "");
const image = (value) => {
  const path = String(value || "").trim();
  if (/^(?:https?:|data:|blob:)/i.test(path)) return path;
  return `${String(base).replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};
const medal = (color) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 78"><path fill="${color}" d="M16 45 12 76l20-11 20 11-4-31z"/><circle cx="32" cy="31" r="25" fill="${color}"/><circle cx="32" cy="31" r="19" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/><path fill="#fff" d="m32 18 4 8 9 1-6 7 2 9-9-5-9 5 2-9-6-7 9-1z"/></svg>`)}`;
const levelIcon = (item, index) => {
  const icon = item.icon || item.iconUrl || item.image || item.imageUrl;
  return icon ? image(icon) : medal(levelColors[index % levelColors.length]);
};
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
.nsg-vip-page { box-sizing: border-box; max-width: 1216px; margin: 0 auto; padding: 0 0 110px; color: #d2d6e4; font: 15px/1.55 "DM Sans", Arial, sans-serif; }
.nsg-vip-page * { box-sizing: border-box; }
.nsg-vip-breadcrumb { margin: 18px 0 0; color: #aaa0d7; font-size: 12px; letter-spacing: .08em; }
.nsg-vip-breadcrumb span { margin: 0 8px; color: #858c9d; }
.nsg-vip-hero { display: flex; justify-content: space-between; align-items: center; gap: 36px; min-height: 345px; padding: 30px 0; }
.nsg-vip-hero > div { max-width: 560px; }
.nsg-vip-hero h1 { margin: 0; color: white; font-size: 46px; line-height: 1.25; font-weight: 600; text-transform: uppercase; }
.nsg-vip-hero h1::after { content: ""; display: block; width: 64px; height: 4px; margin: 16px 0 24px; border-radius: 4px; background: var(--nsg-gradient); }
.nsg-vip-hero p { margin: 0; color: #9599a7; font-size: 18px; }
.nsg-vip-hero > img { width: 340px; height: 270px; object-fit: contain; margin-right: 60px; }
.nsg-vip-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 52px 30px; align-items: stretch; }
.nsg-vip-card { position: relative; min-width: 0; min-height: 550px; padding: 30px 32px; border-radius: 18px; background: url('/nsg16/vip-background-1.png') center / 100% 100% no-repeat; }
.nsg-vip-card:nth-child(4n + 2) { background-image: url('/nsg16/vip-background-2.png'); }
.nsg-vip-card:nth-child(4n + 3) { background-image: url('/nsg16/vip-background-3.png'); }
.nsg-vip-card:nth-child(4n + 4) { background-image: url('/nsg16/vip-background-4.png'); }
.nsg-vip-card > header { display: flex; align-items: center; gap: 24px; min-height: 83px; padding-bottom: 22px; border-bottom: 2px solid #ffffff12; }
.nsg-vip-card > header > img { width: 62px; height: 62px; object-fit: contain; }
.nsg-vip-card h2 { margin: 0; font-size: 24px; color: #f4f4f8; font-weight: 600; }
.nsg-vip-benefits { padding-top: 10px; color: #a3a5b4; font-size: 14px; }
.nsg-vip-benefits p { position: relative; margin: 20px 0; padding-left: 24px; line-height: 1.55; overflow-wrap: anywhere; }
.nsg-vip-benefits p::before { content: ""; position: absolute; left: 0; top: .58em; width: 6px; height: 6px; border-radius: 50%; background: #a8e92e; }
.nsg-vip-benefits p.is-muted::before { background: #b6b9c6; }
.nsg-vip-current { display: none; }
@media (max-width: 1270px) and (min-width: 1024px) { .nsg-vip-page { margin: 0 24px; } .nsg-vip-card { padding: 24px; } }
@media (max-width: 1023px) {
  .nsg-vip-page { padding: 0 20px 100px; font-size: 14px; }
  .nsg-vip-hero { display: grid; grid-template-columns: minmax(0, 1fr) 32%; min-height: 153px; gap: 8px; padding: 25px 0 24px; }
  .nsg-vip-hero > div { min-width: 0; }
  .nsg-vip-hero h1 { font-size: 24px; line-height: 1.3; }
  .nsg-vip-hero h1::after { display: none; }
  .nsg-vip-hero p { margin-top: 5px; font-size: 14px; line-height: 1.55; }
  .nsg-vip-hero > img { width: 100%; height: 118px; margin: 0; }
  .nsg-vip-grid { grid-template-columns: minmax(0, 1fr); gap: 14px; }
  .nsg-vip-card { min-height: 0; padding: 24px 16px 20px; border-radius: 12px; }
  .nsg-vip-card > header { min-height: 70px; gap: 18px; padding: 0 4px 22px; }
  .nsg-vip-card > header > img { width: 50px; height: 50px; }
  .nsg-vip-card h2 { font-size: 22px; }
  .nsg-vip-benefits { font-size: 14px; padding-top: 6px; }
  .nsg-vip-benefits p { margin: 12px 0; }
  .nsg-vip-benefits p::before { background: #23c5df; border-radius: 2px; }
  .nsg-vip-current { display: block; position: absolute; right: 1px; top: 1px; padding: 5px 16px; border-radius: 0 10px 0 16px; background: var(--nsg-gradient); font-size: 10px; color: white; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; }
}
</style>
