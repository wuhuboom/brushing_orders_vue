<template>
  <div
    class="dmk-flag-carousel"
    :style="{
      '--dmk-flag-width': `${imageWidth}px`,
      '--dmk-flag-mobile-width': `${mobileImageWidth || imageWidth}px`,
    }"
    @mouseenter="pause"
    @mouseleave="resume"
  >
    <div
      ref="track"
      class="dmk-flag-carousel__track"
      :style="{ transform: `translate3d(${offset}px, 0, 0)` }"
    >
      <div v-for="round in 2" :key="round" class="dmk-flag-carousel__group">
        <div
          v-for="index in 10"
          :key="`${round}-${index}`"
          class="dmk-flag-carousel__item"
        >
          <img :src="`${assetBase}/i${index}.png`" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

defineProps({
  assetBase: { type: String, required: true },
  imageWidth: { type: Number, required: true },
  mobileImageWidth: { type: Number, default: 0 },
});

const STEP = 0.7;
const track = ref(null);
const offset = ref(0);
let frame = 0;
let paused = false;

const tick = () => {
  if (!paused && track.value) {
    const group = track.value.firstElementChild;
    const loopWidth = group?.getBoundingClientRect().width || 0;
    offset.value =
      loopWidth && Math.abs(offset.value) >= loopWidth
        ? 0
        : offset.value - STEP;
  }
  frame = requestAnimationFrame(tick);
};

const pause = () => {
  paused = true;
};

const resume = () => {
  paused = false;
};

onMounted(async () => {
  await nextTick();
  frame = requestAnimationFrame(tick);
});

onBeforeUnmount(() => cancelAnimationFrame(frame));
</script>

<style scoped>
.dmk-flag-carousel {
  width: 100%;
  overflow: hidden;
}

.dmk-flag-carousel__track,
.dmk-flag-carousel__group {
  width: max-content;
  display: flex;
  align-items: center;
}

.dmk-flag-carousel__track {
  will-change: transform;
}

.dmk-flag-carousel__group {
  flex: 0 0 auto;
}

.dmk-flag-carousel__item {
  flex: 0 0 auto;
  margin: 1rem 0.25rem;
  text-align: center;
}

.dmk-flag-carousel__item img {
  display: block;
  width: var(--dmk-flag-width);
  height: auto;
}

:global(.dmk-h5-only) .dmk-flag-carousel__item img {
  width: var(--dmk-flag-mobile-width);
}

@media (prefers-reduced-motion: reduce) {
  .dmk-flag-carousel__track {
    transform: none !important;
  }
}
</style>
