<template>
  <DmkPcLayout>
    <section class="salary-page salary-page--pc">
      <div class="salary-milestones">
        <article v-for="item in milestones" :key="item.day">
          <h2>
            {{
              $t("das.dmk.dayOrdinal", {
                day: item.day,
                ordinal: englishOrdinal(item.day),
              })
            }}
          </h2>
          <div class="salary-progress-track">
            <span :style="{ width: milestoneProgress(item.day) }"></span>
          </div>
          <p>
            {{
              $t("das.dmk.checkInDay", {
                day: item.day,
                ordinal: englishOrdinal(item.day),
              })
            }}
          </p>
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
      <div class="salary-h5-milestones">
        <article v-for="item in milestones" :key="item.day">
          <span :class="{ complete: workingDays >= item.day }"></span>
          <div>
            <p>
              {{
                $t("das.dmk.checkInDay", {
                  day: item.day,
                  ordinal: englishOrdinal(item.day),
                })
              }}
            </p>
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
import { computed, onMounted, ref } from "vue";
import { userGetInfo } from "@/api/apis";
import { useUserStore } from "@/store/modules/user";
import DmkPcLayout from "@/components/dmkPc/DmkPcLayout.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import { useI18n } from "vue-i18n";

const store = useUserStore();
const { t } = useI18n();
const user = ref(store.userInfo || {});

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");
const numberValue = (...values) => {
  const value = Number(firstValue(...values));
  return Number.isFinite(value) ? value : 0;
};
const englishOrdinal = (value) => {
  const number = Number(value);
  const lastTwoDigits = number % 100;
  const suffix =
    lastTwoDigits >= 11 && lastTwoDigits <= 13
      ? "th"
      : { 1: "st", 2: "nd", 3: "rd" }[number % 10] || "th";
  return `${number}${suffix}`;
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
const milestones = [
  { day: 2, amount: 120 },
  { day: 5, amount: 1300 },
  { day: 10, amount: 1600 },
  { day: 15, amount: 1900 },
  { day: 30, amount: 2500 },
];
const milestoneProgress = (day) =>
  `${Math.max(0, Math.min(100, (workingDays.value / day) * 100))}%`;

const rules = computed(() => [
  t("das.dmk.salaryRule1"),
  t("das.dmk.salaryRule2"),
  t("das.dmk.salaryRule3"),
]);

onMounted(async () => {
  try {
    const response = await userGetInfo();
    const latest = response.data || {};
    user.value = latest;
    store.setUserInfo(latest);
  } catch (_) {}
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
.salary-milestones {
  margin-top: 0;
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
.salary-h5-milestones {
  margin: 0 0 28px;
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
