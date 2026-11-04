<template>
  <main class="das-page vip-design-page vip-levels-page">
    <DasPageHeader title-key="das.page.vip" />
    <section class="vip-levels-main">
      <div class="poetic-vip-intro">
        <div>
          <small>{{ $t("das.page.vip") }}</small>
          <h1>{{ $t("das.profile.vip") }}</h1>
          <p>
            {{ $t("das.vip.commission") }} · {{ $t("das.vip.dailyOrders") }}
          </p>
        </div>
        <b v-if="currentLevelIndex >= 0"
          >{{ $t("das.vip.current") }}
          {{
            displayLevels[currentLevelIndex].name ||
            "VIP " + (currentLevelIndex + 1)
          }}</b
        >
      </div>
      <nav class="poetic-vip-tabs" :aria-label="$t('das.page.vip')">
        <button
          v-for="(item, index) in displayLevels"
          :key="item.id || index"
          type="button"
          :class="{ active: isCurrent(item) }"
          @click="
            levelCards[index]?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          "
        >
          {{ item.name || "VIP " + (index + 1) }}
        </button>
      </nav>
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
          :style="{ '--tier-index': index }"
          :class="{ 'is-current': isCurrent(item) }"
        >
          <header class="poetic-vip-card-head">
            <div>
              <div class="vip-levels-card__head">
                <img
                  v-if="item.icon"
                  class="poetic-vip-api-icon"
                  :src="levelIcon(item, index)"
                  alt=""
                  @error="$event.target.style.display = 'none'"
                  @load="$event.target.style.display = ''"
                />
                <h2>{{ item.name || "VIP " + (item.level || index + 1) }}</h2>
                <span v-if="isCurrent(item)">{{ $t("das.vip.current") }}</span>
              </div>
              <p>
                {{ $t("das.vip.balanceRequired") }} · {{ item.metrics.price }}
              </p>
            </div>
            <div class="poetic-vip-yield">
              <small>{{ $t("das.vip.commission") }}</small
              ><strong>{{ item.metrics.profitPerTransaction }}</strong>
            </div>
          </header>
          <div class="poetic-vip-metrics">
            <div>
              <span>{{ $t("das.vip.dataPerSet") }}</span
              ><strong
                >{{ item.metrics.dataPerSet }}
                {{ $t("das.vip.dataPerSet") }}</strong
              >
            </div>
            <div>
              <span>{{ $t("das.vip.profitTransaction") }}</span
              ><strong>{{ item.metrics.profitPerTransaction }}</strong>
            </div>
            <div>
              <span>{{ $t("das.vip.mergedProfit") }}</span
              ><strong>{{ item.metrics.mergedProfit }}</strong>
            </div>
            <div>
              <span>{{ $t("das.vip.tasksPerDay") }}</span
              ><strong
                >{{ item.metrics.tasksPerDay }}
                {{ $t("das.vip.tasksPerDay") }}</strong
              >
            </div>
          </div>
          <div
            class="poetic-vip-state"
            :class="{
              'is-current': isCurrent(item),
              'is-attained':
                currentLevelIndex >= 0 && index <= currentLevelIndex,
            }"
          >
            <span>{{ item.name || "VIP " + (index + 1) }}</span>
            <strong v-if="isCurrent(item)">{{ $t("das.vip.current") }}</strong>
            <img
              v-else-if="currentLevelIndex < 0 || index > currentLevelIndex"
              src="/poetic/upgrade-lock.png"
              alt=""
            />
          </div>
          <details v-if="item.description" class="poetic-vip-description">
            <summary>
              {{ $t("das.page.vip") }} {{ $t("das.home.terms") }}
            </summary>
            <p v-for="(line, lineIndex) in item.metricRows" :key="lineIndex">
              {{ line }}
            </p>
          </details>
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
import vip1 from "@/static/psybir/vip-1.png";
import vip2 from "@/static/psybir/vip-2.png";
import vip3 from "@/static/psybir/vip-3.png";
import vip4 from "@/static/psybir/vip-4.png";
import vip5 from "@/static/psybir/vip-5.png";

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
