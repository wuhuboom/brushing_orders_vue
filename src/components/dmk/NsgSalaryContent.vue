<template>
  <div class="nsg-salary" :class="{ 'is-mobile': mobile }" :style="{ '--count': Math.max(1, milestones.length) }">
    <div class="nsg-salary__summary">
      <h1><strong v-if="!mobile">{{ workingDays }}</strong>{{ $t("das.dmk.workingDay") }}</h1>
      <div class="nsg-salary__member">
        <NsgUiIcon name="medal" />
        <span>{{ $t("das.nsg.salaryMember", { level: memberLevel }) }}</span>
        <NsgUiIcon name="next" class="nsg-salary__chevron" />
      </div>
    </div>

    <ol class="nsg-salary__timeline" :style="{ '--count': milestones.length }">
      <li v-for="(item, index) in milestones" :key="item.day" :style="accent(index)">
        <strong>{{ $t("das.dmk.dayOrdinal", dayParams(item.day)) }}</strong>
        <span class="nsg-salary__star" :class="{ 'is-complete': workingDays >= item.day }"><NsgUiIcon name="star" /></span>
      </li>
    </ol>

    <div class="nsg-salary__cards" :style="{ '--count': milestones.length }">
      <article v-for="(item, index) in milestones" :key="item.day" class="nsg-salary__card" :style="accent(index)">
        <span class="nsg-salary__calendar"><NsgUiIcon name="calendar-check" /></span>
        <div class="nsg-salary__card-copy">
          <p class="nsg-salary__check-in">{{ $t("das.transaction.checkIn") }}</p>
          <h2>{{ $t("das.nsg.salaryDay", dayParams(item.day)) }}</h2>
          <p class="nsg-salary__base">{{ $t("das.dmk.baseSalary") }}</p>
        </div>
        <div class="nsg-salary__reward">
          <p><strong>{{ item.amount }}</strong><small>{{ $t("das.dmk.currencyUsd") }}</small></p>
          <span v-if="mobile" class="nsg-salary__tier">{{ index === milestones.length - 1 ? $t("das.nsg.salaryTopTier") : $t("das.nsg.salaryTier", { tier: index + 1 }) }}</span>
        </div>
      </article>
    </div>

    <section class="nsg-salary__chart" :aria-label="$t('das.nsg.earningsGrowth')">
      <div class="nsg-salary__chart-heading">
        <h2><NsgUiIcon name="trend" />{{ $t("das.nsg.earningsGrowth") }}</h2>
        <span v-if="mobile">{{ $t("das.dmk.baseSalary") }} · {{ $t("das.dmk.currencyUsd") }}</span>
      </div>
      <div class="nsg-salary__plot" aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs><linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d72e7" stop-opacity=".36" /><stop offset="1" stop-color="#7d72e7" stop-opacity=".10" /></linearGradient></defs>
          <path class="nsg-salary__grid" d="M0 18H100M0 56H100" />
          <path v-if="points.length" :d="areaPath" :fill="`url(#${gradientId})`" />
          <path v-for="point in points" :key="point.day" class="nsg-salary__guide" :d="`M${point.x} ${point.y}V94`" />
          <polyline :points="linePoints" fill="none" stroke="#a356f5" stroke-width="2.5" vector-effect="non-scaling-stroke" />
          <path class="nsg-salary__baseline" d="M0 94H100" />
        </svg>
        <span v-for="(point, index) in points" :key="point.day" class="nsg-salary__plot-point" :style="{ ...accent(index), left: `${point.x}%`, top: `${point.y}%` }">
          <b>{{ point.amount }}</b><i></i>
        </span>
      </div>
      <ol class="nsg-salary__axis">
        <li v-for="(point, index) in points" :key="point.day" :style="{ ...accent(index), left: `${point.x}%` }">
          {{ $t("das.nsg.salaryDay", dayParams(point.day)) }}
          <span class="nsg-salary__sr-only">: {{ point.amount }} {{ $t("das.dmk.currencyUsd") }}</span>
        </li>
      </ol>
    </section>

    <section class="nsg-salary__rules">
      <div class="nsg-salary__shield"><NsgUiIcon name="shield" /></div>
      <h2>{{ $t("das.dmk.workingDayBonuses") }}</h2>
      <ul>
        <li><span class="nsg-salary__rule-icon"><NsgUiIcon name="user" /></span><p>{{ $t("das.dmk.salaryRule1") }}</p></li>
        <li><span class="nsg-salary__rule-icon"><NsgUiIcon name="gift" /></span><p>{{ $t("das.dmk.salaryRule2") }}</p></li>
        <li><span class="nsg-salary__rule-icon"><NsgUiIcon name="support" /></span><i18n-t keypath="das.nsg.salaryRuleSupport" tag="p" scope="global"><template #support><button type="button" @click="openCustomerServiceDialog">{{ $t("das.dmk.customerSupport") }}</button></template></i18n-t></li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import NsgUiIcon from "./NsgUiIcon.vue";
import { openCustomerServiceDialog } from "../../utils/customerServiceDialog";

const props = defineProps({
  mobile: Boolean,
  workingDays: { type: Number, default: 0 },
  memberLevel: { type: Number, default: 1 },
  milestones: { type: Array, required: true },
});
const dayParams = (day) => {
  const suffix = day % 100 >= 11 && day % 100 <= 13 ? "th" : { 1: "st", 2: "nd", 3: "rd" }[day % 10] || "th";
  return { day, ordinal: `${day}${suffix}` };
};
const accent = (index) => {
  const palette = ["28, 202, 229", "79, 143, 246", "106, 100, 255", "148, 82, 247", "176, 75, 242"];
  const position = Math.round(index * 4 / Math.max(1, props.milestones.length - 1));
  return { "--accent-rgb": palette[position] };
};
const gradientId = computed(() => `nsg-salary-area-${props.mobile ? "h5" : "pc"}`);
// Plot the existing salary values. The design's example amounts are not business data.
const points = computed(() => {
  const maximum = Math.max(1, ...props.milestones.map((item) => item.amount));
  return props.milestones.map((item, index) => ({
    ...item,
    x: props.milestones.length === 1 ? 50 : 6 + index * 88 / (props.milestones.length - 1),
    y: 90 - item.amount / maximum * 66,
  }));
});
const linePoints = computed(() => points.value.map(({ x, y }) => `${x},${y}`).join(" "));
const areaPath = computed(() => {
  if (!points.value.length) return "";
  const first = points.value[0], last = points.value.at(-1);
  return `M${first.x} 94L${points.value.map(({ x, y }) => `${x} ${y}`).join("L")}L${last.x} 94Z`;
});
</script>

<style scoped>
.nsg-salary { color: #f3f2fc; font-family: "DM Sans", Arial, sans-serif; }
.nsg-salary *, .nsg-salary *::before, .nsg-salary *::after { box-sizing: border-box; }
.nsg-salary h1, .nsg-salary h2, .nsg-salary p, .nsg-salary ol, .nsg-salary ul { margin: 0; padding: 0; }
.nsg-salary ol, .nsg-salary ul { list-style: none; }
.nsg-salary__summary { display: flex; justify-content: center; align-items: center; gap: 24px; padding: 64px 0 88px; }
.nsg-salary__summary h1 { display: flex; align-items: center; gap: 10px; color: #bdbbd0; font-size: 32px; font-weight: 500; line-height: 1.2; }
.nsg-salary__summary h1 strong { color: #fff; font-size: 68px; font-weight: 600; }
.nsg-salary__member { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 48px; padding: 10px 20px; border: 1px solid #333566; border-radius: 28px; background: #191f32; box-shadow: 0 0 22px #7163ff40; color: #b9b5ed; font-size: 16px; font-weight: 600; }
.nsg-salary__member > .nsg-ui-icon { color: #7166ff; font-size: 22px; }
.nsg-salary__member .nsg-salary__chevron { color: #b9b5ed; font-size: 13px; transform: rotate(90deg); }
.nsg-salary .nsg-salary__timeline { position: relative; display: flex; justify-content: space-between; gap: 8px; padding: 0 12px; margin: 0 auto 72px; width: 76%; }
.nsg-salary__timeline::before { content: ""; position: absolute; left: 0; right: 0; top: 44px; height: 10px; border-radius: 8px; background: linear-gradient(90deg, #1bcbe3, #6666f8 52%, #b44af2); }
.nsg-salary__timeline li { z-index: 1; text-align: center; color: rgb(var(--accent-rgb)); }
.nsg-salary__timeline strong { display: block; font-size: 30px; font-weight: 700; line-height: 1.3; text-shadow: 0 2px 6px rgba(var(--accent-rgb), .4); }
.nsg-salary__star { display: grid; place-items: center; width: 32px; height: 32px; margin: 24px auto 0; border: 3px solid currentColor; border-radius: 50%; background: #0b1122; font-size: 16px; }
.nsg-salary__star.is-complete { background: rgb(var(--accent-rgb)); color: #fff; border-color: rgb(var(--accent-rgb)); }
.nsg-salary__cards { display: grid; grid-template-columns: repeat(var(--count), minmax(0, 1fr)); gap: 20px; }
.nsg-salary__card { display: grid; grid-template-columns: 52px minmax(0, 1fr); column-gap: 20px; align-content: center; min-width: 0; min-height: 174px; padding: 24px 18px; border: 1px solid #1b202f; border-radius: 12px; background: #0d121e; }
.nsg-salary__calendar { grid-row: span 2; align-self: center; display: grid; place-items: center; width: 52px; height: 60px; border: 1px solid rgba(var(--accent-rgb), .32); border-radius: 15px; background: linear-gradient(140deg, rgba(var(--accent-rgb), .28), #0b1426); box-shadow: 0 0 16px rgba(var(--accent-rgb), .16); color: rgb(var(--accent-rgb)); font-size: 27px; }
.nsg-salary__check-in, .nsg-salary__card h2 { font-size: 17px; font-weight: 600; line-height: 1.45; }
.nsg-salary__card-copy { min-width: 0; overflow-wrap: anywhere; }
.nsg-salary__base { margin-top: 6px !important; color: #9699af; font-size: 15px; line-height: 1.4; }
.nsg-salary__reward { grid-column: 2; color: rgb(var(--accent-rgb)); }
.nsg-salary__reward p { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; margin-top: 8px; }
.nsg-salary__reward strong { font-size: 32px; font-weight: 600; line-height: 1.15; }
.nsg-salary__reward small { font-size: 14px; }
.nsg-salary__chart { margin-top: 46px; padding: 30px 32px 26px; border: 1px solid #1b202f; border-radius: 12px; background: #0d121e; }
.nsg-salary__chart-heading { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.nsg-salary__chart-heading h2 { display: inline-flex; align-items: center; gap: 10px; padding: 9px 16px; border-radius: 30px; background: #242b40; color: #b6b9d1; font-size: 13px; font-weight: 500; letter-spacing: 1px; }
.nsg-salary__chart-heading .nsg-ui-icon { color: #706cff; }
.nsg-salary__plot { position: relative; height: 176px; margin-top: 14px; }
.nsg-salary__plot svg { display: block; width: 100%; height: 100%; overflow: visible; }
.nsg-salary__grid, .nsg-salary__guide, .nsg-salary__baseline { stroke: #333a4a; stroke-width: 1; vector-effect: non-scaling-stroke; fill: none; }
.nsg-salary__grid { opacity: 0; }
.nsg-salary__guide { stroke-dasharray: 2 3; opacity: .45; }
.nsg-salary__baseline { opacity: .8; }
.nsg-salary__plot-point { position: absolute; color: rgb(var(--accent-rgb)); }
.nsg-salary__plot-point b { position: absolute; bottom: 23px; left: 0; transform: translateX(-50%); font-size: 14px; font-weight: 600; white-space: nowrap; }
.nsg-salary__plot-point i { position: absolute; width: 12px; height: 12px; left: -6px; top: -6px; border: 3px solid #b574ff; border-radius: 50%; background: #fff; }
.nsg-salary .nsg-salary__axis { position: relative; min-height: 22px; }
.nsg-salary__axis li { position: absolute; transform: translateX(-50%); width: max-content; max-width: calc(100% / var(--count)); color: rgb(var(--accent-rgb)); text-align: center; font-size: 14px; font-weight: 600; letter-spacing: 1px; }
.nsg-salary__rules { display: grid; grid-template-columns: 110px minmax(0, 1fr); column-gap: 30px; margin-top: 46px; padding: 34px; border: 1px solid #1b202f; border-radius: 12px; background: #0d121e; }
.nsg-salary__shield { grid-row: span 2; justify-self: center; display: grid; place-items: center; width: 64px; height: 64px; margin-top: 16px; border-radius: 12px; transform: rotate(-45deg); background: linear-gradient(135deg, #7167ff, #ad48f5); box-shadow: 0 0 22px #7362fc70; }
.nsg-salary__shield .nsg-ui-icon { transform: rotate(45deg); font-size: 30px; color: #fff; }
.nsg-salary__rules h2 { font-size: 30px; line-height: 1.3; font-weight: 600; }
.nsg-salary__rules ul { display: grid; gap: 22px; margin-top: 28px; }
.nsg-salary__rules li { display: flex; align-items: flex-start; gap: 16px; color: #a8a8bc; font-size: 16px; line-height: 1.7; }
.nsg-salary__rule-icon { flex: 0 0 auto; display: grid; place-items: center; width: 32px; height: 32px; border: 1px solid #343969; border-radius: 50%; color: #776aff; background: #222a40; font-size: 19px; }
.nsg-salary__rules li:nth-child(2) .nsg-salary__rule-icon { color: #a950f3; }
.nsg-salary__rules li:nth-child(3) .nsg-salary__rule-icon { color: #21bdd7; border-color: #245268; }
.nsg-salary__rules button { padding: 0; border: 0; background: none; color: #8bc5ff; font: inherit; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.nsg-salary__rules button:focus-visible { outline: 2px solid #8bc5ff; outline-offset: 3px; }
.nsg-salary__sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.is-mobile .nsg-salary__summary { flex-direction: column; gap: 30px; padding: 30px 0 48px; }
.is-mobile .nsg-salary__summary h1 { font-size: 30px; font-weight: 600; }
.is-mobile .nsg-salary__member { min-height: 42px; font-size: 17px; padding: 8px 22px; }
.is-mobile .nsg-salary__timeline { display: grid; grid-template-columns: repeat(var(--count), minmax(0, 1fr)); gap: 0; padding: 0; width: 100%; margin-bottom: 34px; }
.is-mobile .nsg-salary__timeline::before { top: 34px; height: 7px; left: 2%; right: 2%; }
.is-mobile .nsg-salary__timeline strong { font-size: 20px; font-weight: 600; }
.is-mobile .nsg-salary__star { width: 32px; height: 32px; margin-top: -4px; border-width: 1.5px; font-size: 16px; box-shadow: 0 0 0 2px #000; }
.is-mobile .nsg-salary__star .nsg-ui-icon { fill: currentColor; }
.is-mobile .nsg-salary__cards { grid-template-columns: 1fr; gap: 16px; }
.is-mobile .nsg-salary__card { grid-template-columns: 44px minmax(0, 1fr) auto; column-gap: 20px; min-height: 120px; padding: 20px; border-radius: 11px; background: radial-gradient(ellipse at 95% 100%, rgba(var(--accent-rgb), .16), transparent 65%), linear-gradient(120deg, #101829, #0d1020); }
.is-mobile .nsg-salary__card:first-child { background: radial-gradient(ellipse at 100% 100%, #00303966, transparent 65%), linear-gradient(#111b30, #010507); }
.is-mobile .nsg-salary__calendar { grid-row: 1; width: 44px; height: 48px; border-radius: 13px; font-size: 24px; }
.is-mobile .nsg-salary__card-copy { align-self: center; }
.is-mobile .nsg-salary__check-in { color: #95a5bc; font-size: 16px; }
.is-mobile .nsg-salary__card h2 { font-size: 18px; }
.is-mobile .nsg-salary__base { font-size: 14px; }
.is-mobile .nsg-salary__reward { grid-column: 3; align-self: center; text-align: right; }
.is-mobile .nsg-salary__reward p { justify-content: flex-end; gap: 7px; margin: 0; }
.is-mobile .nsg-salary__reward strong { font-size: 30px; }
.is-mobile .nsg-salary__reward small { font-size: 13px; }
.nsg-salary__tier { display: inline-block; margin-top: 8px; padding: 3px 10px; border: 1px solid rgba(var(--accent-rgb), .2); border-radius: 3px; background: rgba(var(--accent-rgb), .15); font-size: 13px; font-weight: 600; }
.is-mobile .nsg-salary__chart { margin-top: 32px; padding: 22px 22px 24px; border-color: #252c3d; background: #0b1123; }
.is-mobile .nsg-salary__chart-heading { flex-wrap: wrap; gap: 8px; }
.is-mobile .nsg-salary__chart-heading h2 { padding: 6px 12px; font-size: 14px; font-weight: 600; letter-spacing: 0; color: #756dff; }
.is-mobile .nsg-salary__chart-heading > span { font-size: 12px; color: #95a4bc; }
.is-mobile .nsg-salary__plot { height: 164px; margin-top: 20px; }
.is-mobile .nsg-salary__grid { opacity: .3; stroke-dasharray: 2 3; }
.is-mobile .nsg-salary__guide { opacity: 0; }
.is-mobile .nsg-salary__plot-point b { bottom: 16px; font-size: 11px; }
.is-mobile .nsg-salary__plot-point i { width: 9px; height: 9px; top: -4.5px; left: -4.5px; border: 0; background: rgb(var(--accent-rgb)); }
.is-mobile .nsg-salary__axis { min-height: 32px; margin-top: 30px; }
.is-mobile .nsg-salary__axis li { font-size: 12px; line-height: 1.35; letter-spacing: 0; }
.is-mobile .nsg-salary__rules { grid-template-columns: 44px minmax(0, 1fr); gap: 24px 18px; margin-top: 32px; padding: 24px 22px; border-color: #252c3d; }
.is-mobile .nsg-salary__shield { grid-row: 1; align-self: center; width: 30px; height: 30px; margin: 0; border-radius: 6px; }
.is-mobile .nsg-salary__shield .nsg-ui-icon { font-size: 17px; }
.is-mobile .nsg-salary__rules h2 { font-size: 18px; }
.is-mobile .nsg-salary__rules ul { grid-column: 1 / -1; gap: 24px; margin: 0; }
.is-mobile .nsg-salary__rules li { gap: 16px; font-size: 16px; line-height: 1.7; }
.is-mobile .nsg-salary__rule-icon { width: 32px; height: 32px; border-radius: 11px; margin-top: 3px; }
@media (min-width: 1024px) and (max-width: 1250px) {
  .nsg-salary__card { column-gap: 12px; padding-inline: 14px; grid-template-columns: 40px minmax(0, 1fr); }
  .nsg-salary__calendar { width: 40px; height: 48px; }
  .nsg-salary__reward strong { font-size: 28px; }
}
@media (max-width: 380px) {
  .is-mobile .nsg-salary__card { column-gap: 12px; padding: 16px 12px; grid-template-columns: 36px minmax(0, 1fr) auto; }
  .is-mobile .nsg-salary__calendar { width: 36px; height: 42px; font-size: 22px; }
  .is-mobile .nsg-salary__reward strong { font-size: 26px; }
  .is-mobile .nsg-salary__card h2 { font-size: 16px; }
  .is-mobile .nsg-salary__chart, .is-mobile .nsg-salary__rules { padding-inline: 18px; }
}
</style>
