<template>
  <section
    class="product-draw"
    :data-phase="phase"
    :data-target="target"
    :aria-busy="phase === 'loading'"
    :style="flightStyle"
  >
    <div class="product-draw__tiles">
      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="product-draw__row"
        :style="{ '--row-delay': `${rowIndex * ROW_DURATION}ms` }"
      >
        <div
          v-if="phase === 'revealing'"
          :key="round"
          class="product-draw__row-placeholder"
          aria-hidden="true"
        >
          <span v-for="n in 3" :key="n" class="product-draw__skeleton"></span>
        </div>
        <button
          v-for="(entry, column) in row"
          :key="`${round}-${entry.slot}`"
          class="product-draw__tile"
          :class="{
            'is-selected': selectedSlot === entry.slot,
            'is-hit': phase === 'impact' && target === entry.slot,
          }"
          :style="{
            '--origin-x':
              column === 0
                ? 'calc(100% + 8px)'
                : column === 2
                  ? 'calc(-100% - 8px)'
                  : '0px',
          }"
          type="button"
          :aria-label="entry.item.goodsName || undefined"
          :aria-pressed="selectedSlot === entry.slot"
          :disabled="phase !== 'ready'"
          @click="selectTile(entry)"
        >
          <img
            v-if="hasImage(entry.item.coverUrl)"
            :src="imageUrl(entry.item.coverUrl)"
            :alt="entry.item.goodsName || ''"
            :class="{
              'is-loaded': loadedImages.has(imageUrl(entry.item.coverUrl)),
            }"
            @load="loadedImages.add(imageUrl(entry.item.coverUrl))"
            @error="loadedImages.delete(imageUrl(entry.item.coverUrl))"
          />
          <span
            v-if="
              !hasImage(entry.item.coverUrl) ||
              !loadedImages.has(imageUrl(entry.item.coverUrl))
            "
            class="product-draw__skeleton"
            aria-hidden="true"
          ></span>
        </button>
      </div>
    </div>
    <div
      v-if="phase === 'flying' || phase === 'impact'"
      class="product-draw__flight"
      aria-hidden="true"
    >
      <svg class="product-draw__plane" viewBox="0 0 100 64">
        <path
          d="M6 31h24L20 8h13l29 23h24q12 1 12 6T86 43H62L33 61H20l10-18H6l6-6Z"
          fill="#f3f7ff"
          stroke="#5362e9"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <path d="m34 31 28 6-28 6 8-6Z" fill="#a49aff" />
        <path d="M76 31h9l7 6H76Z" fill="#53c9ff" />
        <path d="M14 31 6 19h11l13 12" fill="#fa27b4" />
        <path
          d="M5 37H-10"
          stroke="#92dbff"
          stroke-width="4"
          stroke-linecap="round"
        />
      </svg>
      <svg
        v-if="phase === 'flying'"
        class="product-draw__bomb"
        viewBox="0 0 32 48"
      >
        <path d="m8 3 8 6 8-6v14H8Z" fill="#6653ee" />
        <path d="M16 12C3 12 3 35 16 44c13-9 13-32 0-32Z" fill="#ed24a6" />
        <path
          d="M11 22v9"
          stroke="#ffadf0"
          stroke-width="3"
          stroke-linecap="round"
        />
        <path d="M8 35h16" stroke="#ffd44c" stroke-width="4" />
      </svg>
      <span v-if="phase === 'impact'" class="product-draw__burst"
        ><i v-for="n in 8" :key="n" :style="{ '--ray': `${n * 45}deg` }"></i
      ></span>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  products: { type: Array, default: () => [] },
  selectedIndex: { type: Number, default: 0 },
});
const emit = defineEmits(["select"]);
const ROW_DURATION = 760;
const FLIGHT_DURATION = 1600;
const DROP_DURATION = 620;
const phase = ref("loading");
const round = ref(0);
const loadedImages = ref(new Set());
const offset = ref(0);
const target = ref(0);
const selectedSlot = ref(-1);
const timers = new Set();
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let mounted = false;
const entries = computed(() =>
  Array.from({ length: 9 }, (_, slot) => {
    const index = (offset.value + slot) % (props.products.length || 1);
    return { slot, index, item: props.products[index] || {} };
  }),
);
const rows = computed(() => [
  entries.value.slice(0, 3),
  entries.value.slice(3, 6),
  entries.value.slice(6, 9),
]);
const targetColumn = computed(() => target.value % 3);
const releaseDelay = computed(
  () =>
    (((targetColumn.value * 100) / 3 + 100 / 6 + 12) / 124) * FLIGHT_DURATION,
);
const flightStyle = computed(() => ({
  "--target-x": `${((targetColumn.value + 0.5) * 100) / 3}%`,
  "--target-y": `${((Math.floor(target.value / 3) + 0.5) * 100) / 3}%`,
  "--flight-duration": `${FLIGHT_DURATION}ms`,
  "--drop-delay": `${releaseDelay.value}ms`,
  "--drop-duration": `${DROP_DURATION}ms`,
}));
const hasImage = (path) =>
  Boolean(
    path && !["null", "undefined"].includes(String(path).trim().toLowerCase()),
  );
const imageUrl = (path) =>
  /^https?:/i.test(path) ? path : `${window.g?.VITE_API_IMG_URL || ""}${path}`;
const later = (action, delay) => {
  const timer = setTimeout(() => {
    timers.delete(timer);
    if (mounted) action();
  }, delay);
  timers.add(timer);
};
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers.clear();
};
const selectTile = (entry) => {
  if (phase.value !== "ready") return;
  clearTimers();
  selectedSlot.value = entry.slot;
  emit("select", entry.index);
  if (!motionPreference.matches) later(nextRound, 4500);
};
const beginRound = () => {
  clearTimers();
  if (!mounted || !props.products.length) {
    phase.value = "loading";
    return;
  }
  if (document.hidden || motionPreference.matches) {
    phase.value = "ready";
    selectedSlot.value = entries.value.findIndex(
      (entry) => entry.index === props.selectedIndex,
    );
    return;
  }
  round.value += 1;
  selectedSlot.value = -1;
  phase.value = "revealing";
  const candidates = entries.value.filter(
    (entry) => entry.index !== props.selectedIndex,
  );
  const choices = candidates.length ? candidates : entries.value;
  target.value = choices[Math.floor(Math.random() * choices.length)].slot;
  later(() => {
    phase.value = "flying";
    later(() => {
      selectedSlot.value = target.value;
      emit("select", entries.value[target.value].index);
      phase.value = "impact";
    }, releaseDelay.value + DROP_DURATION);
    later(
      () => {
        phase.value = "ready";
        later(nextRound, 4500);
      },
      FLIGHT_DURATION + DROP_DURATION + 200,
    );
  }, ROW_DURATION * 3);
};
const nextRound = () => {
  if (props.products.length > 9)
    offset.value = (offset.value + 9) % props.products.length;
  beginRound();
};
const restart = () => {
  offset.value = 0;
  beginRound();
};
const handleVisibility = () => {
  clearTimers();
  if (document.hidden) {
    phase.value = props.products.length ? "ready" : "loading";
    selectedSlot.value = entries.value.findIndex(
      (entry) => entry.index === props.selectedIndex,
    );
  } else if (!motionPreference.matches && props.products.length) {
    later(nextRound, 4500);
  }
};
watch(() => props.products, restart);
onMounted(() => {
  mounted = true;
  beginRound();
  document.addEventListener("visibilitychange", handleVisibility);
  motionPreference.addEventListener("change", beginRound);
});
onBeforeUnmount(() => {
  mounted = false;
  clearTimers();
  document.removeEventListener("visibilitychange", handleVisibility);
  motionPreference.removeEventListener("change", beginRound);
});
</script>

<style scoped>
.product-draw {
  position: relative;
  padding: 12px;
  border-radius: 12px;
  background: white;
  isolation: isolate;
}
.product-draw__tiles {
  display: grid;
  gap: 8px;
  overflow: hidden;
  padding: 2px;
  margin: -2px;
}
.product-draw__row {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.product-draw__row-placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  pointer-events: none;
  animation: row-placeholder 680ms var(--row-delay) linear both;
}
.product-draw__row-placeholder > span {
  border: 2px solid #e7eaf2;
  border-radius: 9px;
}
@keyframes row-placeholder {
  0%,
  85% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.product-draw__tile > .product-draw__skeleton {
  position: absolute;
  inset: 0;
}
.product-draw__tile {
  z-index: 1;
  position: relative;
  width: 100%;
  aspect-ratio: 1.06;
  padding: 0;
  overflow: hidden;
  border: 2px solid #e7eaf2;
  border-radius: 9px;
  background: #fff;
  box-shadow: 0 2px 3px #22395a18;
  cursor: pointer;
  opacity: 1;
}
.product-draw__tile:disabled {
  cursor: default;
}
.product-draw__tile img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
}
.product-draw__tile img.is-loaded {
  opacity: 1;
}
.product-draw__skeleton {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(100deg, #edf1f7 20%, #f8faff 45%, #edf1f7 70%);
  background-size: 240% 100%;
  animation: product-skeleton 1.5s ease-in-out infinite;
}
@keyframes product-skeleton {
  from {
    background-position: 100% 0;
  }
  to {
    background-position: -100% 0;
  }
}
.product-draw__tile.is-selected {
  border-color: #6552ff;
  box-shadow: 0 2px 3px #ee1ca57a;
}
.product-draw[data-phase="revealing"] .product-draw__tile {
  animation: distribute-tile 680ms var(--row-delay)
    cubic-bezier(0.25, 0.7, 0.3, 1) both;
}
.product-draw[data-phase="revealing"] .product-draw__tile:nth-of-type(2) {
  z-index: 2;
  animation-name: reveal-center;
}
.product-draw__flight {
  position: absolute;
  inset: 12px;
  pointer-events: none;
  overflow: hidden;
  z-index: 4;
}
.product-draw__plane {
  position: absolute;
  top: 0;
  width: 64px;
  height: 42px;
  transform: translateX(-50%);
  filter: drop-shadow(0 3px 3px #5356bb44);
  animation: grid-fly var(--flight-duration) linear both;
}
.product-draw__bomb {
  position: absolute;
  left: var(--target-x);
  width: 24px;
  height: 36px;
  transform: translate(-50%, -50%);
  animation: grid-drop var(--drop-duration) var(--drop-delay)
    cubic-bezier(0.4, 0, 0.8, 0.4) both;
}
.product-draw__burst {
  position: absolute;
  left: var(--target-x);
  top: var(--target-y);
  width: 66px;
  height: 66px;
  margin: -33px;
  border: 4px solid #ffba33;
  border-radius: 50%;
  animation: grid-burst 550ms ease-out both;
}
.product-draw__burst i {
  position: absolute;
  left: 50%;
  top: 50%;
  height: 14px;
  width: 4px;
  border-radius: 4px;
  background: #ff3fbe;
  transform: rotate(var(--ray)) translateY(-45px);
  transform-origin: 0 0;
}
.product-draw__tile.is-hit {
  animation: tile-impact 450ms ease-out;
}
@keyframes distribute-tile {
  0%,
  18% {
    opacity: 0;
    transform: translateX(var(--origin-x));
  }
  19% {
    opacity: 1;
    transform: translateX(var(--origin-x));
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes reveal-center {
  0% {
    opacity: 0;
  }
  18%,
  100% {
    opacity: 1;
  }
}
@keyframes grid-fly {
  from {
    left: -12%;
  }
  to {
    left: 112%;
  }
}
@keyframes grid-drop {
  0% {
    top: 28px;
    opacity: 0;
  }
  1% {
    opacity: 1;
  }
  100% {
    top: var(--target-y);
    opacity: 1;
  }
}
@keyframes grid-burst {
  from {
    opacity: 1;
    transform: scale(0.3);
  }
  to {
    opacity: 0;
    transform: scale(1.4);
  }
}
@keyframes tile-impact {
  35% {
    transform: scale(0.93);
  }
  70% {
    transform: scale(1.025);
  }
  100% {
    transform: scale(1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .product-draw *,
  .product-draw[data-phase="revealing"] .product-draw__tile {
    animation: none;
  }
  .product-draw__flight {
    display: none;
  }
}
</style>
