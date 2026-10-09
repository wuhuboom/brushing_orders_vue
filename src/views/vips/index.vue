<template>
  <main class="das-page vip-design-page vip-levels-page">
    <DasPageHeader title-key="das.page.vip" />
    <section class="vip-levels-main">
      <div ref="levelList" class="vip-levels-list">
        <span
          ref="progressLine"
          class="reference-hidden"
          :style="{ height: timelineProgress }"
          aria-hidden="true"
        ></span>
        <article
          v-for="(item, index) in displayLevels"
          :key="item.id || item.level || index"
          :ref="(element) => setLevelCard(element, index)"
          class="vip-levels-card"
          :class="{ 'is-current': isCurrent(item) }"
        >
          <div class="vip-levels-card__icon">
            <img
              class="vip-levels-badge vip-levels-badge--image"
              :src="levelIcon(item, index)"
              alt=""
            />
          </div>
          <div class="vip-levels-card__body">
            <div class="vip-levels-card__head">
              <h2>{{ item.name || "VIP " + (item.level || index + 1) }}</h2>
              <span v-if="isCurrent(item)">{{ $t("das.vip.current") }}</span>
            </div>
            <strong>{{ item.metrics.price }}</strong>
            <p v-for="(line, lineIndex) in item.metricRows" :key="lineIndex">
              {{ line }}
            </p>
          </div>
        </article>
      </div>
      <p class="vip-levels-footer">{{ $t("das.common.copyright") }}</p>
    </section>
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


