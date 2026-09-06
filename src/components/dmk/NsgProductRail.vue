<template>
  <div v-if="loading" class="nsg-product-pool__rail nsg-product-skeleton" role="status" :aria-label="$t('das.common.loading')" aria-busy="true">
    <div v-for="index in 5" :key="index" class="nsg-product-tile" aria-hidden="true">
      <span class="nsg-skeleton-image"></span><span class="nsg-skeleton-line"></span><span class="nsg-skeleton-line is-short"></span>
    </div>
  </div>
  <div v-else-if="products.length" class="nsg-product-carousel">
    <div :key="current" class="nsg-product-pool__rail">
      <button v-for="(entry, position) in visibleProducts" :key="entry.index" type="button" class="nsg-product-tile" :class="{ 'is-active': entry.index === current, 'is-near': Math.abs(position - Math.floor(visibleProducts.length / 2)) === 1 }" :aria-pressed="entry.index === current" @click="$emit('select', entry.index)">
        <van-image v-if="hasImage(entry.item.coverUrl)" :src="imageUrl(entry.item.coverUrl)" :alt="entry.item.goodsName || ''" fit="contain" />
        <span v-else class="nsg-product-image-missing" aria-hidden="true">◇</span>
        <strong>{{ entry.item.goodsName || '—' }}</strong>
      </button>
    </div>
    <div class="nsg-product-carousel__controls">
      <button type="button" class="nsg-product-arrow is-previous" :disabled="products.length < 2" :aria-label="$t('das.nsg.previousProduct')" @click="$emit('select', (current - 1 + products.length) % products.length)"><NsgUiIcon name="previous" /></button>
      <div class="nsg-product-pool__dots" aria-hidden="true"><i v-for="index in Math.min(products.length, 8)" :key="index" :class="{ active: current % Math.min(products.length, 8) === index - 1 }"></i></div>
      <button type="button" class="nsg-product-arrow is-next" :disabled="products.length < 2" :aria-label="$t('das.nsg.nextProduct')" @click="$emit('select', (current + 1) % products.length)"><NsgUiIcon name="next" /></button>
    </div>
  </div>
  <div v-else class="nsg-product-pool__rail nsg-product-empty" role="status">{{ $t('das.common.noData') }}</div>
</template>
<script setup>
import { computed } from "vue";
import NsgUiIcon from "./NsgUiIcon.vue";
const props = defineProps({ products: { type: Array, default: () => [] }, current: { type: Number, default: 0 }, loading: Boolean });
defineEmits(["select"]);
const visibleProducts = computed(() => {
  const count = Math.min(props.products.length, 5);
  const start = props.current - Math.floor(count / 2);
  return Array.from({ length: count }, (_, offset) => {
    const index = (start + offset + props.products.length) % props.products.length;
    return { item: props.products[index], index };
  });
});
const hasImage = (path) => {
  const value = String(path ?? "").trim().toLowerCase();
  return Boolean(value && !["null", "undefined"].includes(value));
};
const imageUrl = (path) => /^https?:/i.test(String(path)) ? path : `${window.g?.VITE_API_IMG_URL || ""}${path}`;
</script>
<style>
.nsg-product-carousel { position: relative; --tile-width: 92px; --tile-height: 172px; --near-height: 196px; --hero-width: 142px; --hero-height: 276px; --image-width: 72px; --image-height: 82px; --hero-image-width: 116px; --hero-image-height: 144px; --tile-font: 11px; --hero-font: 15px; }
@media (min-width: 1024px) {
  .nsg-product-carousel { container-type: inline-size; --tile-width: 16%; --tile-height: clamp(172px, 31cqw, 204px); --near-height: clamp(196px, 35cqw, 234px); --hero-width: 25%; --hero-height: clamp(276px, 50cqw, 330px); --tile-font: 12px; --hero-font: 17px; }
}
.nsg-product-pool__rail { position: relative; height: 324px; margin: 12px 0 0; display: flex; align-items: center; justify-content: center; gap: 10px; }
.nsg-product-carousel .nsg-product-pool__rail::after { content: ""; position: absolute; bottom: 12px; left: 50%; width: 52%; height: 13px; transform: translateX(-50%); background: linear-gradient(90deg, #0735ff, #7622ff); border-radius: 50%; filter: blur(7px); animation: nsg-product-ground 1.15s both; }
.nsg-product-tile { box-sizing: border-box; width: var(--tile-width, 92px); height: var(--tile-height, 172px); min-width: 0; padding: 11px 8px; display: flex; flex: 0 1 auto; flex-direction: column; align-items: center; justify-content: center; gap: 12px; overflow: hidden; border: 1px solid #161d57; border-radius: 11px; color: #aeb5d3; background: #060b2b; cursor: pointer; }
.nsg-product-tile.is-near { height: var(--near-height); animation: nsg-product-neighbor 1.15s both; }
.nsg-product-tile.is-active { position: relative; z-index: 1; width: var(--hero-width); height: var(--hero-height); border-color: #6963f9; box-shadow: 0 0 12px #6059ff55; animation: nsg-product-draw 1.15s both; }
.nsg-product-tile strong { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; margin: 0; min-height: 0; max-height: 4.35em; flex-shrink: 0; overflow: hidden; overflow-wrap: anywhere; font-size: var(--tile-font, 11px); font-weight: 500; line-height: 1.45; text-align: center; }
.nsg-product-tile.is-active strong { color: #e1e4ff; font-size: var(--hero-font); animation: nsg-product-type 1.15s both; }
.nsg-product-tile .van-image, .nsg-product-tile .nsg-product-image-missing { width: var(--image-width, 72px); max-width: 100%; height: var(--image-height, 82px); flex-shrink: 0; }
.nsg-product-tile.is-active .van-image, .nsg-product-tile.is-active .nsg-product-image-missing { width: var(--hero-image-width); height: var(--hero-image-height); animation: nsg-product-image 1.15s both; }
.nsg-product-tile .van-image img { width: 100%; height: 100%; object-fit: contain; }
.nsg-product-image-missing { display: grid; place-items: center; color: #686a99; background: #141b39; border-radius: 8px; font-size: 32px; }
.nsg-product-tile .van-image__error, .nsg-product-tile .van-image__loading, .nsg-history-cover .van-image__error, .nsg-history-cover .van-image__loading { background: #141b39; color: #747c9e; }
.nsg-product-carousel__controls { display: flex; align-items: center; justify-content: center; min-height: 34px; margin-top: 10px; }
.nsg-product-pool__dots { display: flex; justify-content: center; gap: 9px; }
.nsg-product-pool__dots i { width: 10px; height: 10px; border-radius: 4px; background: #2d324e; }
.nsg-product-pool__dots i.active { background: #6961f4; }
.nsg-product-arrow { position: absolute; top: 144px; display: grid; place-items: center; width: 32px; height: 32px; padding: 4px; border: 1px solid #148fff; border-radius: 50%; color: #cff4ff; background: #082283; box-shadow: inset 0 0 6px #5458ff, 0 0 3px #7446ff; font-size: 22px; cursor: pointer; z-index: 2; }
.nsg-product-arrow.is-previous { left: 0; background: url('/nsg16/product-prev.png') center / contain no-repeat; }
.nsg-product-arrow.is-next { right: 0; background: url('/nsg16/product-next.png') center / contain no-repeat; }
.nsg-product-arrow { border: 0; box-shadow: none; }
.nsg-product-arrow > svg { visibility: hidden; }
.nsg-product-carousel .nsg-product-pool__rail::after { background: url('/nsg16/product-ground.png') center / 100% 100% no-repeat; height: 24px; filter: none; }
.nsg-product-arrow:disabled { opacity: .4; cursor: default; }
@media (min-width: 1024px) {
  .nsg-product-carousel .nsg-product-pool__rail { height: clamp(334px, 60cqw, 390px); }
  .nsg-product-carousel .nsg-product-arrow { top: 48%; }
}
.nsg-product-empty { color: #969bb7; }
.nsg-product-skeleton .nsg-product-tile { cursor: default; }
.nsg-product-skeleton span { display: block; flex-shrink: 0; border-radius: 5px; background: linear-gradient(90deg, #18203e 25%, #2d365a 50%, #18203e 75%); background-size: 200% 100%; animation: nsg-product-shimmer 1.5s linear infinite; }
.nsg-product-skeleton .nsg-skeleton-image { width: 80%; height: 55%; }
.nsg-product-skeleton .nsg-skeleton-line { width: 85%; height: 9px; }
.nsg-product-skeleton .nsg-skeleton-line.is-short { width: 55%; }
@keyframes nsg-product-shimmer { to { background-position: -200% 0; } }
@keyframes nsg-product-draw {
  0%, 28% { width: var(--tile-width); height: var(--tile-height); transform: translateY(0); border-color: #161d57; box-shadow: none; }
  62% { width: var(--hero-width); height: var(--hero-height); transform: translateY(-12px) scale(1.04); }
  78% { transform: translateY(4px) scale(.985); }
  91% { transform: translateY(-2px) scale(1.008); }
  100% { transform: translateY(0) scale(1); }
}
@keyframes nsg-product-neighbor { 0%, 28% { height: var(--tile-height); } 70%, 100% { height: var(--near-height); } }
@keyframes nsg-product-image { 0%, 28% { width: var(--image-width); height: var(--image-height); } 62%, 100% { width: var(--hero-image-width); height: var(--hero-image-height); } }
@keyframes nsg-product-type { 0%, 28% { font-size: var(--tile-font); } 62%, 100% { font-size: var(--hero-font); } }
@keyframes nsg-product-ground { 0%, 35% { opacity: 0; } 75%, 100% { opacity: 1; } }
@media (max-width: 1023px) {
  .nsg-product-carousel { --tile-width: 15%; --tile-height: 124px; --near-height: 142px; --hero-width: 25%; --hero-height: 202px; --image-width: 52px; --image-height: 56px; --hero-image-width: 78px; --hero-image-height: 91px; --tile-font: 10px; --hero-font: 14px; }
  .nsg-product-pool__rail { height: 224px; margin-top: 12px; gap: 6px; }
  .nsg-product-tile { padding: 8px 4px; border-radius: 10px; }
  .nsg-product-carousel .nsg-product-pool__rail::after { bottom: 2px; height: 9px; }
  .nsg-product-carousel__controls { justify-content: space-between; margin-top: 8px; }
  .nsg-product-arrow { position: static; width: 30px; height: 30px; }
  .nsg-product-pool__dots { gap: 6px; }
  .nsg-product-pool__dots i { width: 7px; height: 7px; border-radius: 3px; }
}
@media (prefers-reduced-motion: reduce) { .nsg-product-carousel *, .nsg-product-carousel ::after, .nsg-product-skeleton span { animation: none !important; } }
</style>
