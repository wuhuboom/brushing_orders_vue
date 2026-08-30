<template>
  <main class="das-page vip-design-page">
    <DasPageHeader title-key="das.page.vip" />

    <section class="vip-design-stage">
      <div ref="levelList" class="vip-design-list">
        <span
          ref="progressLine"
          class="vip-design-progress"
          :style="{ height: timelineProgress }"
          aria-hidden="true"
        ></span>
        <article
          v-for="(item, index) in displayLevels"
          :key="item.id || item.level || index"
          :ref="(element) => setLevelCard(element, index)"
          class="vip-design-card"
          :class="{
            'is-current': isCurrent(item),
          }"
        >
          <span class="vip-design-card__node" aria-hidden="true"></span>
          <div class="vip-design-card__heading">
            <img :src="levelIcon(item, index)" alt="" />
            <div>
              <h2>{{ item.name || `VIP ${item.level || index + 1}` }}</h2>
              <strong>{{ item.metrics.price }}</strong>
            </div>
            <b v-if="isCurrent(item)" class="vip-design-current">
              {{ $t("das.vip.current") }}
            </b>
          </div>

          <div class="vip-design-metrics">
            <div
              v-for="(line, lineIndex) in item.metricRows"
              :key="`${item.id || index}-metric-${lineIndex}`"
            >
              <svg
                v-if="lineIndex === 0"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <ellipse cx="16" cy="7" rx="10" ry="4" />
                <path
                  d="M6 7v7c0 2.2 4.5 4 10 4s10-1.8 10-4V7M6 14v7c0 2.2 4.5 4 10 4s10-1.8 10-4v-7"
                />
              </svg>
              <svg
                v-else-if="lineIndex === 1"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M5 25h22M7 23V8M10 20l5-5 4 3 7-8" />
              </svg>
              <svg
                v-else-if="lineIndex === 2"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M15 4a12 12 0 1 0 12 12H15V4Z" />
                <path d="M19 4v8h8a12 12 0 0 0-8-8Z" />
              </svg>
              <svg v-else viewBox="0 0 32 32" aria-hidden="true">
                <rect x="7" y="7" width="18" height="21" rx="3" />
                <path
                  d="M12 7V5h8v2M11 13h2M16 13h5M11 18h2M16 18h5M11 23h2M16 23h5"
                />
              </svg>
              <p>{{ line }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <p class="vip-design-copyright">{{ $t("das.common.copyright") }}</p>
  </main>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { getLevel, userGetInfo } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import {
  getMemberLevelDescriptionLines,
  getMemberLevelMetrics,
  memberLevelMatchesUser,
} from "@/utils/memberLevel";
import vip1 from "@/static/brain/vip-1.png";
import vip2 from "@/static/brain/vip-2.png";
import vip3 from "@/static/brain/vip-3.png";
import vip4 from "@/static/brain/vip-4.png";
import vip5 from "@/static/brain/vip-5.png";

const levels = ref([]);
const user = ref({});
const levelList = ref(null);
const progressLine = ref(null);
const levelCards = ref([]);
const timelineProgress = ref("0px");
const localLevelIcons = [vip1, vip2, vip3, vip4, vip5];
const imageBase =
  window.g?.VITE_API_IMG_URL || import.meta.env.VITE_API_IMG_URL || "";

const displayLevels = computed(() =>
  levels.value.map((level) => {
    const metrics = getMemberLevelMetrics(level);
    const descriptionLines = getMemberLevelDescriptionLines(level.description);
    return {
      ...level,
      metrics,
      metricRows: descriptionLines.length
        ? descriptionLines
        : [
            `${metrics.dataPerSet} data per set`,
            `Profit per transaction ${metrics.profitPerTransaction}`,
            `${metrics.mergedProfit} profit of merged data`,
            `${metrics.tasksPerDay} sets tasks per day`,
          ],
    };
  }),
);

const levelIcon = (item, index) => {
  if (item.icon) {
    const path = String(item.icon);
    return /^(?:https?:|data:|blob:)/i.test(path)
      ? path
      : `${imageBase}${path.startsWith("/") ? "" : "/"}${path}`;
  }
  const value = Number(item.level || index + 1);
  const iconIndex = Number.isFinite(value) ? value - 1 : index;
  return localLevelIcons[Math.max(0, Math.min(iconIndex, 4))];
};
const isCurrent = (item) => memberLevelMatchesUser(item, user.value);
const currentLevelIndex = computed(() =>
  displayLevels.value.findIndex(isCurrent),
);
const setLevelCard = (element, index) => {
  if (element) levelCards.value[index] = element;
};
const updateTimelineProgress = () => {
  const card = levelCards.value[currentLevelIndex.value];
  const node = card?.querySelector(".vip-design-card__node");
  if (!card || !node || !progressLine.value) {
    timelineProgress.value = "0px";
    return;
  }
  const height =
    card.offsetTop +
    node.offsetTop +
    node.offsetHeight / 2 -
    progressLine.value.offsetTop;
  timelineProgress.value = `${Math.max(0, height)}px`;
};

let timelineObserver;

watch(
  [displayLevels, currentLevelIndex],
  async () => {
    await nextTick();
    updateTimelineProgress();
  },
  { flush: "post" },
);

onMounted(async () => {
  timelineObserver = new ResizeObserver(updateTimelineProgress);
  if (levelList.value) timelineObserver.observe(levelList.value);
  try {
    levels.value = (await getLevel()).data || [];
  } catch (_) {}
  try {
    user.value = (await userGetInfo()).data || {};
  } catch (_) {}
  await nextTick();
  updateTimelineProgress();
});

onBeforeUnmount(() => timelineObserver?.disconnect());
</script>

<style scoped>
.vip-design-page {
  container-type: inline-size;
  min-height: 100%;
  background: #030717 !important;
  color: #fff;
  font-family: "SF Pro Display", Arial, sans-serif;
}

.vip-design-stage {
  min-height: 100%;
  padding: 30.67% 6.4% 8% 17.07%;
  background-color: #031024;
  background-image: url("@/static/brain/vip-background.png");
  background-position: center top;
  background-size: 100% auto;
  background-repeat: no-repeat;
}

.vip-design-list {
  --vip-timeline-x: -7.55cqw;
  width: 100%;
  margin: 0 auto;
  position: relative;
  display: grid;
  gap: 4.6cqw;
}

.vip-design-list::before {
  content: "";
  position: absolute;
  z-index: 0;
  top: 0;
  bottom: 9cqw;
  left: var(--vip-timeline-x);
  width: 0.32cqw;
  min-width: 2px;
  transform: translateX(-50%);
  border-radius: 3px;
  background: linear-gradient(#243047 0 90%, #101827 100%);
}

.vip-design-progress {
  position: absolute;
  z-index: 0;
  top: 0;
  left: var(--vip-timeline-x);
  width: 4px;
  transform: translateX(-50%);
  background: #031024;
  pointer-events: none;
}

.vip-design-progress::after {
  content: "";
  position: absolute;
  inset: 0 auto 0 1px;
  width: 2px;
  background: repeating-linear-gradient(
    to bottom,
    #3487ff 0 7px,
    transparent 7px 13px
  );
  filter: drop-shadow(0 0 4px rgba(41, 137, 255, 0.7));
}

.vip-design-card {
  min-height: 73.5cqw;
  padding: 5.35cqw 5cqw 5.8cqw;
  position: relative;
  z-index: 1;
  overflow: visible;
  border: 1px solid rgba(24, 93, 171, 0.18);
  border-radius: 1.3cqw;
  background: rgba(3, 18, 43, 0.94);
  box-shadow: 0 3cqw 6cqw rgba(0, 0, 0, 0.2);
}

.vip-design-card::after {
  content: "";
  position: absolute;
  top: -1px;
  right: 0;
  left: 0;
  height: 0.32cqw;
  min-height: 2px;
  border-radius: inherit;
  background: linear-gradient(90deg, #0a274c, #0997fb 45%, #1c526f);
}

.vip-design-card__node {
  position: absolute;
  top: 9.4cqw;
  left: var(--vip-timeline-x);
  width: 3.1cqw;
  height: 3.1cqw;
  transform: translateX(-50%);
  border-radius: 50%;
  background: #33435d;
  box-shadow: 0 0 0 0.45cqw rgba(5, 20, 44, 0.9);
}

.vip-design-card.is-current .vip-design-card__node {
  background: #4d91ff;
  box-shadow: 0 0 3.2cqw #2989ff;
}

.vip-design-card__heading {
  min-height: 17cqw;
  padding-bottom: 4.5cqw;
  position: relative;
  display: grid;
  grid-template-columns: 14.3cqw minmax(0, 1fr) auto;
  align-items: center;
  gap: 1cqw;
  border-bottom: 0.45cqw solid #1d2c45;
  text-align: left;
}

.vip-design-card__heading > img {
  width: 14.3cqw;
  height: 14.3cqw;
  display: block;
  object-fit: contain;
}

.vip-design-card__heading > div {
  min-width: 0;
}

.vip-design-card h2 {
  margin: 0 0 2.8cqw;
  color: #fff;
  font-size: 4.35cqw;
  font-weight: 500;
  line-height: 1;
}

.vip-design-card strong {
  display: block;
  color: #fff;
  white-space: pre-line;
  font-size: 4.4cqw;
  font-weight: 400;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.vip-design-current {
  align-self: start;
  min-width: 18.2cqw;
  padding: 2.25cqw 3cqw;
  border: 0.3cqw solid #1688ff;
  border-radius: 2.1cqw;
  background: linear-gradient(100deg, #0753bd, #087cf4);
  color: #fff;
  text-align: center;
  font-size: 3.35cqw;
  font-weight: 700;
  white-space: nowrap;
}

.vip-design-metrics {
  padding-top: 5.6cqw;
  display: grid;
  gap: 5.6cqw;
}

.vip-design-metrics > div {
  min-width: 0;
  display: grid;
  grid-template-columns: 5.4cqw minmax(0, 1fr);
  align-items: center;
  gap: 3.6cqw;
}

.vip-design-metrics p {
  margin: 0;
  color: #d5deed;
  font-size: 3.65cqw;
  line-height: 1.25;
  text-align: left;
}

.vip-design-metrics svg {
  width: 5.4cqw;
  height: 5.4cqw;
  fill: none;
  stroke: #5aa5ff;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.vip-design-metrics > div:nth-child(1) svg,
.vip-design-metrics > div:nth-child(3) svg {
  fill: #5aa5ff;
  stroke: #5aa5ff;
}

.vip-design-copyright {
  margin: 0;
  padding: 10% 20px 12%;
  color: #8a91a1;
  background:
    radial-gradient(
      circle at 50% 110%,
      rgba(30, 150, 226, 0.34),
      transparent 48%
    ),
    #080a1a;
  text-align: center;
  font-size: clamp(12px, 3.2vw, 28px);
}

@media (max-width: 390px) {
  .vip-design-stage {
    padding-right: 5.5%;
  }
}
</style>
