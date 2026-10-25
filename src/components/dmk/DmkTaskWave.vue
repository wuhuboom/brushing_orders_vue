<template>
  <svg
    ref="waveRoot"
    class="dmk-task-waveform"
    :class="{ 'dmk-task-waveform--full': full }"
    viewBox="0 0 440 440"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <g class="dmk-task-waveform__contours">
      <path
        v-for="index in CONTOUR_COUNT"
        :key="`contour-${index}`"
        :style="{ opacity: 0.085 + index * 0.075 }"
      />
    </g>

    <g class="dmk-task-waveform__bars">
      <path
        v-for="index in 3"
        :key="`bars-${index}`"
        :class="`dmk-task-waveform__tone-${index}`"
      />
    </g>

    <g class="dmk-task-waveform__particles">
      <path
        v-for="index in 3"
        :key="`particles-${index}`"
        :class="`dmk-task-waveform__tone-${index}`"
      />
    </g>
  </svg>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

defineProps({
  full: {
    type: Boolean,
    default: false,
  },
});

const TAU = Math.PI * 2;
const CENTER = 220;
const POINT_COUNT = 120;
const BAR_COUNT = 144;
const PARTICLE_COUNT = 78;
const CONTOUR_COUNT = 9;

const waveRoot = ref(null);

let animationFrame = 0;
let animationStart = 0;
let previousFrame = 0;
let intersectionObserver;
let waveIsVisible = false;
let reduceMotion = false;
let contourNodes = [];
let barNodes = [];
let particleNodes = [];

const pointAt = (radius, angle) => ({
  x: CENTER + Math.cos(angle) * radius,
  y: CENTER + Math.sin(angle) * radius,
});

const noise = (seed) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const waveRadius = (angle, time) =>
  Math.sin(angle * 6 + time * 0.92) * 27 +
  Math.sin(angle * 3 - time * 0.58 + 1.15) * 8 +
  Math.sin(angle * 9 + time * 1.34 + 0.65) * 5.5 +
  Math.sin(angle * 15 - time * 1.8) * 2.8;

const closedWavePath = (time, layer) => {
  const points = [];
  const layerOffset = (layer - (CONTOUR_COUNT - 1) / 2) * 2.8;
  const waveGain = 0.72 + layer * 0.065;

  for (let index = 0; index < POINT_COUNT; index += 1) {
    const angle = (index / POINT_COUNT) * TAU;
    const fineWave = Math.sin(angle * 21 - time * 2.6 + layer) * 1.1;
    const radius =
      160 + layerOffset + waveRadius(angle, time) * waveGain + fineWave;
    points.push(pointAt(radius, angle));
  }

  return `${points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
    )
    .join(" ")} Z`;
};

const circlePath = (x, y, radius) =>
  `M${(x - radius).toFixed(1)} ${y.toFixed(1)} ` +
  `a${radius.toFixed(1)} ${radius.toFixed(1)} 0 1 0 ${(radius * 2).toFixed(1)} 0 ` +
  `a${radius.toFixed(1)} ${radius.toFixed(1)} 0 1 0 ${(-radius * 2).toFixed(1)} 0`;

const renderWave = (time) => {
  for (let index = 0; index < CONTOUR_COUNT; index += 1) {
    contourNodes[index]?.setAttribute("d", closedWavePath(time, index));
  }

  const nextBars = [[], [], []];
  for (let index = 0; index < BAR_COUNT; index += 1) {
    const angle = (index / BAR_COUNT) * TAU;
    const wave = waveRadius(angle, time);
    const vibration = Math.sin(index * 1.73 + time * 4.1) * 4.2;
    const innerRadius = 139 + wave * 0.46 + vibration;
    const outerRadius =
      163 + wave * 1.08 +
      (Math.sin(index * 0.93 - time * 3.25) + 1) * 6.5;
    const inner = pointAt(innerRadius, angle);
    const outer = pointAt(outerRadius, angle);
    nextBars[index % 3].push(
      `M${inner.x.toFixed(1)} ${inner.y.toFixed(1)}L${outer.x.toFixed(1)} ${outer.y.toFixed(1)}`,
    );
  }
  nextBars.forEach((segments, index) => {
    barNodes[index]?.setAttribute("d", segments.join(""));
  });

  const nextParticles = [[], [], []];
  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const randomA = noise(index + 1);
    const randomB = noise(index + 23);
    const angle =
      (index / PARTICLE_COUNT) * TAU +
      Math.sin(time * (0.34 + randomA * 0.25) + index) * 0.022;
    const drift = Math.sin(time * (0.72 + randomB * 0.62) + index * 0.61) * 5;
    const radius =
      178 +
      waveRadius(angle, time) * 0.72 +
      randomA * 38 +
      drift;
    const point = pointAt(radius, angle);
    const dotRadius = 1.2 + randomB * 2.15;
    nextParticles[index % 3].push(circlePath(point.x, point.y, dotRadius));
  }
  nextParticles.forEach((segments, index) => {
    particleNodes[index]?.setAttribute("d", segments.join(""));
  });
};

const animate = (timestamp) => {
  if (!waveIsVisible || document.hidden) {
    animationFrame = 0;
    return;
  }
  if (!animationStart) animationStart = timestamp;
  if (timestamp - previousFrame >= 34) {
    renderWave((timestamp - animationStart) / 1000);
    previousFrame = timestamp;
  }
  animationFrame = window.requestAnimationFrame(animate);
};

const startAnimation = () => {
  if (reduceMotion || animationFrame || !waveIsVisible || document.hidden)
    return;
  previousFrame = 0;
  animationFrame = window.requestAnimationFrame(animate);
};

const stopAnimation = () => {
  window.cancelAnimationFrame(animationFrame);
  animationFrame = 0;
};

const handleVisibilityChange = () => {
  if (document.hidden) stopAnimation();
  else startAnimation();
};

onMounted(() => {
  const root = waveRoot.value;
  if (!root) return;
  contourNodes = Array.from(
    root.querySelectorAll(".dmk-task-waveform__contours path"),
  );
  barNodes = Array.from(root.querySelectorAll(".dmk-task-waveform__bars path"));
  particleNodes = Array.from(
    root.querySelectorAll(".dmk-task-waveform__particles path"),
  );
  reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  renderWave(0);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  if ("IntersectionObserver" in window) {
    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        waveIsVisible = Boolean(entry?.isIntersecting);
        if (waveIsVisible) startAnimation();
        else stopAnimation();
      },
      { threshold: 0.01 },
    );
    intersectionObserver.observe(root);
  } else {
    waveIsVisible = true;
    startAnimation();
  }
});

onUnmounted(() => {
  stopAnimation();
  intersectionObserver?.disconnect();
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});
</script>

<style scoped>
.dmk-task-waveform {
  --wave-tone-1: #54e4cd;
  --wave-tone-2: #ff74b9;
  --wave-tone-3: #c9ff32;
  position: absolute;
  inset: -28%;
  z-index: 0;
  width: 156%;
  height: 156%;
  overflow: visible;
  pointer-events: none;
  filter: drop-shadow(0 0 5px rgba(84, 228, 205, 0.5));
  transition: filter 0.35s ease;
}

.dmk-task-waveform--full {
  --wave-tone-1: #ff3c52;
  --wave-tone-2: #ff9a51;
  --wave-tone-3: #ffbec7;
  filter: drop-shadow(0 0 6px rgba(255, 59, 59, 0.62));
}

.dmk-task-waveform__contours path {
  fill: none;
  stroke: var(--wave-tone-1);
  stroke-width: 1.15;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dmk-task-waveform__contours path:nth-child(even) {
  stroke: var(--wave-tone-2);
}

.dmk-task-waveform__contours path:nth-child(3n) {
  stroke: var(--wave-tone-3);
}

.dmk-task-waveform__bars path {
  fill: none;
  stroke-width: 1.05;
  stroke-linecap: round;
  opacity: 0.72;
}

.dmk-task-waveform__particles path {
  stroke: none;
  opacity: 0.76;
}

.dmk-task-waveform__tone-1 {
  fill: var(--wave-tone-1);
  stroke: var(--wave-tone-1);
}

.dmk-task-waveform__tone-2 {
  fill: var(--wave-tone-2);
  stroke: var(--wave-tone-2);
}

.dmk-task-waveform__tone-3 {
  fill: var(--wave-tone-3);
  stroke: var(--wave-tone-3);
}
</style>
