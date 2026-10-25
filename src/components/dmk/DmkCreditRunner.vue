<template>
  <div
    class="dmk-credit-runner"
    :class="{
      'dmk-credit-runner--full': normalizedPercent >= 100,
      'dmk-credit-runner--tossing': isTossing,
      'dmk-credit-runner--compact': compact,
    }"
    :aria-label="`Credit score ${formattedTarget}%`"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="normalizedPercent"
  >
    <div class="dmk-credit-runner__track">
      <span
        class="dmk-credit-runner__fill"
        :style="{ width: `${runnerPosition}%` }"
      ></span>
      <span class="dmk-credit-runner__finish" aria-hidden="true"></span>
      <span
        class="dmk-credit-runner__actor"
        :style="{ left: `${runnerPosition}%` }"
        aria-hidden="true"
      >
        <span class="dmk-credit-runner__score">{{ displayLabel }}%</span>
        <span class="dmk-credit-runner__person">
          <i class="dmk-credit-runner__head"></i>
          <i class="dmk-credit-runner__body"></i>
          <i class="dmk-credit-runner__arm dmk-credit-runner__arm--left"></i>
          <i class="dmk-credit-runner__arm dmk-credit-runner__arm--right"></i>
          <i class="dmk-credit-runner__leg dmk-credit-runner__leg--left"></i>
          <i class="dmk-credit-runner__leg dmk-credit-runner__leg--right"></i>
        </span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  percentage: {
    type: Number,
    default: 0,
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const normalizedPercent = computed(() => {
  const value = Number(props.percentage);
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
});
const formattedTarget = computed(() =>
  Number.isInteger(normalizedPercent.value)
    ? String(normalizedPercent.value)
    : normalizedPercent.value.toFixed(1),
);

const runnerPosition = ref(0);
const displayLabel = ref("0");
const isTossing = ref(false);
let labelFrame = 0;
let tossTimer = 0;
let mounted = false;

const formatLabel = (value) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);

const animateTo = (target) => {
  window.cancelAnimationFrame(labelFrame);
  window.clearTimeout(tossTimer);
  isTossing.value = false;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const startValue = Number(displayLabel.value) || 0;
  runnerPosition.value = target;
  if (reduceMotion) {
    displayLabel.value = formatLabel(target);
    isTossing.value = true;
    return;
  }

  const duration = 1600;
  tossTimer = window.setTimeout(() => {
    isTossing.value = true;
  }, 1080);
  const startTime = performance.now();
  const updateLabel = (now) => {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = startValue + (target - startValue) * eased;
    displayLabel.value = formatLabel(
      progress >= 1 ? target : Math.round(value * 10) / 10,
    );
    if (progress < 1) labelFrame = window.requestAnimationFrame(updateLabel);
  };
  labelFrame = window.requestAnimationFrame(updateLabel);
};

watch(normalizedPercent, (value) => {
  if (mounted) animateTo(value);
});

onMounted(() => {
  mounted = true;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => animateTo(normalizedPercent.value));
  });
});

onUnmounted(() => {
  window.cancelAnimationFrame(labelFrame);
  window.clearTimeout(tossTimer);
});
</script>

<style scoped>
.dmk-credit-runner {
  --runner-color: #cfff32;
  --runner-track: rgba(207, 255, 50, 0.2);
  --runner-actor-color: #ff3b3b;
  --runner-actor-text: #fff;
  --runner-actor-glow: rgba(255, 59, 59, 0.62);
  width: 100%;
  height: 54px;
  padding: 0 14px 0 5px;
  box-sizing: border-box;
  overflow: visible;
}
.dmk-credit-runner__track {
  height: 6px;
  position: relative;
  top: 40px;
  border-radius: 999px;
  background: var(--runner-track);
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.52),
    0 0 8px rgba(207, 255, 50, 0.18);
}
.dmk-credit-runner__fill {
  height: 100%;
  display: block;
  position: relative;
  overflow: hidden;
  border-radius: inherit;
  background: linear-gradient(90deg, #789918 0%, #b6eb29 48%, #e6ff86 100%);
  box-shadow: 0 0 11px rgba(207, 255, 50, 0.56);
  transition: width 1.6s cubic-bezier(0.2, 0.72, 0.24, 1);
}
.dmk-credit-runner__fill::after {
  content: "";
  position: absolute;
  inset: -3px auto -3px -30%;
  width: 24%;
  transform: skewX(-24deg);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.92),
    transparent
  );
  animation: dmk-runner-shine 1.55s 0.2s linear infinite;
}
.dmk-credit-runner__finish {
  width: 3px;
  height: 16px;
  position: absolute;
  right: 0;
  bottom: -5px;
  border-radius: 2px;
  background: var(--runner-color);
  box-shadow: 0 0 8px rgba(207, 255, 50, 0.72);
}
.dmk-credit-runner__actor {
  width: 30px;
  height: 43px;
  position: absolute;
  bottom: -2px;
  z-index: 2;
  transform: translateX(-50%);
  transition: left 1.6s cubic-bezier(0.2, 0.72, 0.24, 1);
}
.dmk-credit-runner__score {
  min-width: 33px;
  height: 18px;
  padding: 0 5px;
  box-sizing: border-box;
  display: grid;
  place-items: center;
  position: absolute;
  left: 50%;
  top: -7px;
  z-index: 4;
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: 6px;
  background: var(--runner-actor-color);
  color: var(--runner-actor-text);
  font-size: 9px;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
  transform: translateX(-50%);
  box-shadow: 0 0 8px var(--runner-actor-glow);
}
.dmk-credit-runner__person {
  width: 25px;
  height: 27px;
  position: absolute;
  left: 2px;
  bottom: 1px;
  animation: dmk-runner-bob 0.28s ease-in-out infinite alternate;
}
.dmk-credit-runner__person i {
  display: block;
  position: absolute;
  background: var(--runner-actor-color);
}
.dmk-credit-runner__head {
  width: 8px;
  height: 8px;
  left: 9px;
  top: 1px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--runner-actor-glow);
}
.dmk-credit-runner__body {
  width: 6px;
  height: 12px;
  left: 10px;
  top: 9px;
  border-radius: 4px 4px 2px 2px;
  background: var(--runner-actor-color) !important;
  transform: rotate(8deg);
  transform-origin: top center;
}
.dmk-credit-runner__arm,
.dmk-credit-runner__leg {
  width: 3px;
  border-radius: 999px;
  transform-origin: top center;
}
.dmk-credit-runner__arm {
  height: 10px;
  top: 9px;
}
.dmk-credit-runner__arm--left {
  left: 9px;
  transform: rotate(145deg);
}
.dmk-credit-runner__arm--right {
  left: 14px;
  transform: rotate(-145deg);
}
.dmk-credit-runner__leg {
  height: 11px;
  top: 19px;
}
.dmk-credit-runner__leg--left {
  left: 10px;
  animation: dmk-runner-leg-left 0.28s ease-in-out infinite alternate;
}
.dmk-credit-runner__leg--right {
  left: 14px;
  animation: dmk-runner-leg-right 0.28s ease-in-out infinite alternate;
}
.dmk-credit-runner--full {
  --runner-actor-color: #cfff32;
  --runner-actor-text: #101400;
  --runner-actor-glow: rgba(207, 255, 50, 0.62);
}
.dmk-credit-runner--tossing .dmk-credit-runner__score {
  animation: dmk-runner-score-toss 0.62s cubic-bezier(0.2, 0.75, 0.25, 1)
    forwards;
}
.dmk-credit-runner--tossing .dmk-credit-runner__person {
  animation:
    dmk-runner-bob 0.28s ease-in-out infinite alternate,
    dmk-runner-person-finish 0.26s 0.4s ease-in forwards;
}
.dmk-credit-runner--compact {
  height: 49px;
  padding-right: 11px;
}
.dmk-credit-runner--compact .dmk-credit-runner__track {
  top: 36px;
}
@keyframes dmk-runner-bob {
  from {
    transform: translateY(0) rotate(-2deg);
  }
  to {
    transform: translateY(-2px) rotate(2deg);
  }
}
@keyframes dmk-runner-leg-left {
  from {
    transform: rotate(42deg);
  }
  to {
    transform: rotate(-45deg);
  }
}
@keyframes dmk-runner-leg-right {
  from {
    transform: rotate(-45deg);
  }
  to {
    transform: rotate(42deg);
  }
}
@keyframes dmk-runner-score-toss {
  0% {
    transform: translateX(-50%) translateY(0) rotate(0deg);
  }
  44% {
    transform: translateX(-10%) translateY(-27px) rotate(20deg) scale(1.1);
  }
  82% {
    transform: translateX(-50%) translateY(38px) rotate(-3deg) scale(0.96);
  }
  91% {
    transform: translateX(-50%) translateY(33px) rotate(0deg) scale(1.04);
  }
  100% {
    transform: translateX(-50%) translateY(36px) rotate(0deg) scale(1);
  }
}
@keyframes dmk-runner-person-finish {
  from {
    opacity: 1;
    transform: translateY(-1px) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(7px) scale(0.28);
    visibility: hidden;
  }
}
@keyframes dmk-runner-shine {
  0% {
    left: -30%;
  }
  72%,
  100% {
    left: 118%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .dmk-credit-runner__fill,
  .dmk-credit-runner__actor {
    transition: none;
  }
  .dmk-credit-runner__fill::after,
  .dmk-credit-runner__person,
  .dmk-credit-runner__leg,
  .dmk-credit-runner--tossing .dmk-credit-runner__score {
    animation: none;
  }
  .dmk-credit-runner--tossing .dmk-credit-runner__person {
    opacity: 0;
    visibility: hidden;
  }
  .dmk-credit-runner--tossing .dmk-credit-runner__score {
    transform: translateX(-50%) translateY(36px);
  }
}
</style>
