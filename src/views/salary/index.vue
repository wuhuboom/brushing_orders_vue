<template>
  <DmkPcLayout>
    <section class="salary-page salary-page--pc">
      <div class="salary-overview">
        <strong>{{ workingDays }}</strong>
        <span>{{ $t("das.dmk.workingDay") }}</span>
        <div class="salary-level-picker" @pointerdown.stop>
          <button
            type="button"
            class="salary-level"
            :aria-expanded="levelMenuOpen"
            @click="toggleLevelMenu"
          >
            {{ levelName }} {{ $t("das.dmk.member") }} <span>⌄</span>
          </button>
          <div v-if="levelMenuOpen" class="salary-level-options" role="menu">
            <button
              v-for="item in availableLevels"
              :key="levelKey(item)"
              type="button"
              :class="{ active: levelKey(item) === levelKey(activeLevel) }"
              @click="selectLevel(item)"
            >
              {{ levelDisplayName(item) }} {{ $t("das.dmk.member") }}
            </button>
          </div>
        </div>
      </div>

      <div class="salary-milestones">
        <article v-for="item in milestones" :key="item.day">
          <h2>{{ $t("das.dmk.dayOrdinal", { day: item.day }) }}</h2>
          <div class="salary-progress-track">
            <span :style="{ width: milestoneProgress(item.day) }"></span>
          </div>
          <p>{{ $t("das.dmk.checkInDay", { day: item.day }) }}</p>
          <p>{{ $t("das.dmk.baseSalary") }}</p>
          <strong>{{ item.amount }} {{ $t("das.dmk.currencyUsd") }}</strong>
        </article>
      </div>

      <div class="salary-chart">
        <img src="/dmk/assets/check_in.png" alt="" />
      </div>

      <div class="salary-rules">
        <h3>{{ $t("das.dmk.workingDayBonuses") }}</h3>
        <p v-for="rule in rules" :key="rule">
          <img src="/dmk/assets/dian.png" alt="" />
          <span>{{ rule }}</span>
        </p>
      </div>
    </section>
  </DmkPcLayout>

  <DmkH5Layout class="dmk-mobile-current">
    <section class="salary-page salary-page--h5">
      <div class="salary-h5-head">
        <div><strong>{{ workingDays }}</strong><span>{{ $t("das.dmk.workingDay") }}</span></div>
        <div class="salary-level-picker" @pointerdown.stop>
          <button
            type="button"
            class="salary-level"
            :aria-expanded="levelMenuOpen"
            @click="toggleLevelMenu"
          >
            {{ levelName }} {{ $t("das.dmk.member") }} <span>⌄</span>
          </button>
          <div v-if="levelMenuOpen" class="salary-level-options" role="menu">
            <button
              v-for="item in availableLevels"
              :key="levelKey(item)"
              type="button"
              :class="{ active: levelKey(item) === levelKey(activeLevel) }"
              @click="selectLevel(item)"
            >
              {{ levelDisplayName(item) }} {{ $t("das.dmk.member") }}
            </button>
          </div>
        </div>
      </div>
      <div class="salary-h5-milestones">
        <article v-for="item in milestones" :key="item.day">
          <span :class="{ complete: workingDays >= item.day }"></span>
          <div>
            <p>{{ $t("das.dmk.checkInDay", { day: item.day }) }}</p>
            <p>{{ $t("das.dmk.baseSalary") }}</p>
            <strong>{{ item.amount }} {{ $t("das.dmk.currencyUsd") }}</strong>
          </div>
        </article>
      </div>
      <div class="salary-rules">
        <h3>{{ $t("das.dmk.workingDayBonuses") }}</h3>
        <p v-for="rule in rules" :key="rule">
          <img src="/dmk/assets/dian.png" alt="" />
          <span>{{ rule }}</span>
        </p>
      </div>
    </section>
  </DmkH5Layout>

</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { getLevel, userGetInfo } from "@/api/apis";
import { useUserStore } from "@/store/modules/user";
import DmkPcLayout from "@/components/dmkPc/DmkPcLayout.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import { useI18n } from "vue-i18n";

const store = useUserStore();
const { t } = useI18n();
const user = ref(store.userInfo || {});
const levels = ref([]);
const selectedLevelKey = ref("");
const levelMenuOpen = ref(false);

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");
const numberValue = (...values) => {
  const value = Number(firstValue(...values));
  return Number.isFinite(value) ? value : 0;
};

const workingDays = computed(() =>
  numberValue(
    user.value.workingDays,
    user.value.workingDay,
    user.value.workDays,
    user.value.checkInDays,
    user.value.attendanceDays,
  ),
);
const level = computed(() => user.value.userLevel || user.value.memberLevel || {});
const levelKey = (item = {}) =>
  String(item.id ?? item.levelId ?? item.level ?? "");
const availableLevels = computed(() =>
  [...levels.value].sort(
    (left, right) => Number(left.level ?? left.id) - Number(right.level ?? right.id),
  ),
);
const activeLevel = computed(
  () =>
    availableLevels.value.find(
      (item) => levelKey(item) === selectedLevelKey.value,
    ) || level.value,
);
const levelDisplayName = (item = {}) =>
  String(
    item.name ||
      item.nameEn ||
      `VIP${item.level ?? item.id ?? item.levelId ?? 1}`,
  ).replace(/\s+Member$/i, "");
const levelName = computed(
  () => levelDisplayName(activeLevel.value),
);
const salaryAmount = (day, fallback) =>
  numberValue(
    activeLevel.value[`salary${day}`],
    activeLevel.value[`baseSalary${day}`],
    activeLevel.value[`checkIn${day}Salary`],
    activeLevel.value[`workingDay${day}Salary`],
    fallback,
  );
const milestones = computed(() => [
  { day: 5, amount: salaryAmount(5, 900) },
  { day: 15, amount: salaryAmount(15, 1500) },
  { day: 30, amount: salaryAmount(30, 3800) },
]);
const milestoneProgress = (day) =>
  `${Math.max(0, Math.min(100, (workingDays.value / day) * 100))}%`;

const rules = computed(() => [
  t("das.dmk.salaryRule1"),
  t("das.dmk.salaryRule2"),
  t("das.dmk.salaryRule3"),
]);

const toggleLevelMenu = () => {
  if (!availableLevels.value.length) return;
  levelMenuOpen.value = !levelMenuOpen.value;
};
const selectLevel = (item) => {
  selectedLevelKey.value = levelKey(item);
  levelMenuOpen.value = false;
};
const closeLevelMenu = () => {
  levelMenuOpen.value = false;
};

onMounted(async () => {
  document.addEventListener("pointerdown", closeLevelMenu);
  const [userResult, levelResult] = await Promise.allSettled([
    userGetInfo(),
    getLevel(),
  ]);
  if (userResult.status === "fulfilled") {
    const latest = userResult.value.data || {};
    user.value = latest;
    store.setUserInfo(latest);
  }
  if (levelResult.status === "fulfilled") {
    const result = levelResult.value.data;
    levels.value = Array.isArray(result) ? result : result?.list || [];
  }
  selectedLevelKey.value = levelKey(level.value) || String(
    user.value.levelId ?? user.value.vipId ?? "",
  );
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", closeLevelMenu);
});
</script>

<style scoped>
.salary-page {
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
  color: #fff;
  background: #000;
}
.salary-page--pc {
  max-width: 1200px;
  padding: 44px 16px 72px;
}
.salary-overview {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 14px;
}
.salary-overview > strong {
  font-size: 70px;
  font-weight: 400;
  line-height: 1;
}
.salary-overview > span {
  padding-bottom: 7px;
  font-size: 18px;
}
.salary-level {
  width: 100%;
  min-width: 164px;
  min-height: 45px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #858585;
  border-radius: 4px;
  background: linear-gradient(#3b3b3b, #111);
  box-shadow: inset 0 0 16px rgba(255, 255, 255, 0.13);
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
}
.salary-level-picker {
  position: relative;
  z-index: 20;
}
.salary-level-options {
  position: absolute;
  z-index: 30;
  top: calc(100% + 6px);
  right: 0;
  width: 100%;
  min-width: 164px;
  overflow: hidden;
  border: 1px solid #858585;
  border-radius: 4px;
  background: #151515;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.55);
}
.salary-level-options button {
  width: 100%;
  min-height: 42px;
  padding: 0 15px;
  border: 0;
  border-bottom: 1px solid #343434;
  color: #fff;
  background: transparent;
  cursor: pointer;
  font: inherit;
  text-align: left;
}
.salary-level-options button:last-child {
  border-bottom: 0;
}
.salary-level-options button:hover,
.salary-level-options button.active {
  color: #000;
  background: var(--main-color);
}
.salary-milestones {
  margin-top: 82px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15%;
}
.salary-milestones article {
  text-align: center;
}
.salary-milestones h2 {
  margin: 0 0 12px;
  font-size: 50px;
  font-weight: 400;
}
.salary-progress-track {
  height: 38px;
  padding: 7px;
  border: 1px solid #5c5c5c;
  background: linear-gradient(#252525, #0a0a0a);
}
.salary-progress-track span {
  display: block;
  height: 100%;
  border-radius: 5px;
  background: linear-gradient(90deg, #caff28, #87ff72);
  box-shadow: 0 0 10px rgba(218, 255, 69, 0.35);
}
.salary-milestones p {
  margin: 43px 0 0;
  font-size: 20px;
  line-height: 1.3;
}
.salary-milestones p + p {
  margin-top: 0;
}
.salary-milestones strong {
  display: block;
  margin-top: 2px;
  font-size: 20px;
}
.salary-chart {
  margin-top: 34px;
  padding-bottom: 17px;
  border-bottom: 1px solid #fff;
}
.salary-chart img {
  display: block;
  width: 100%;
}
.salary-rules {
  margin-top: 32px;
}
.salary-rules h3 {
  margin: 0 0 10px;
  color: #fff;
  font-size: 24px;
  font-weight: 400;
}
.salary-rules p {
  margin: 9px 0;
  display: flex;
  align-items: flex-start;
  font-size: 16px;
  line-height: 1.5;
}
.salary-rules img {
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
}
.salary-page--h5 {
  padding: 22px 16px 42px;
}
.salary-h5-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.salary-h5-head > div:first-child strong,
.salary-h5-head > div:first-child span {
  display: block;
}
.salary-h5-head > div:first-child strong {
  font-size: 34px;
}
.salary-h5-head > div:first-child span {
  margin-top: 3px;
  font-size: 20px;
}
.salary-page--h5 .salary-level {
  min-width: 0;
  font-size: 14px;
}
.salary-h5-milestones {
  margin: 40px 0 28px;
}
.salary-h5-milestones article {
  min-height: 130px;
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 52px;
}
.salary-h5-milestones article > span {
  display: block;
  width: 24px;
  height: 100%;
  border: 1px solid #5c5c5c;
  background: linear-gradient(#252525, #0a0a0a);
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.12);
}
.salary-h5-milestones article > span.complete {
  background: linear-gradient(#caff28, #87ff72);
}
.salary-h5-milestones p {
  margin: 0;
  font-size: 18px;
  line-height: 1.45;
}
.salary-h5-milestones strong {
  font-size: 20px;
}
.salary-page--h5 .salary-rules h3 {
  color: var(--main-color);
  font-size: 18px;
}
.salary-page--h5 .salary-rules p {
  font-size: 15px;
}
</style>
