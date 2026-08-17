<script setup>
import { computed, onBeforeUnmount, watch } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  show: { type: Boolean, default: false },
  bonus: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["close"]);
const { t } = useI18n();
let closeTimer;

const seconds = (value, maximum) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return 0;
  return Math.min(maximum, number);
};

const amount = computed(() => {
  const value = Number(props.bonus.amount);
  return (Number.isFinite(value) ? value : 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
});
const animationStyle = computed(() => ({
  "--bonus-animation-duration": `${seconds(props.bonus.animationDuration, 60) || 1.2}s`,
}));

const clearCloseTimer = () => {
  clearTimeout(closeTimer);
  closeTimer = undefined;
};
const close = () => {
  clearCloseTimer();
  emit("close");
};

watch(
  () => [props.show, props.bonus.displayDuration],
  ([show, displayDuration]) => {
    clearCloseTimer();
    const duration = seconds(displayDuration, 300);
    if (show && duration) closeTimer = setTimeout(close, duration * 1000);
  },
  { immediate: true },
);

onBeforeUnmount(clearCloseTimer);
</script>

<template>
  <van-dialog
    :show="show"
    class="bonus-dialog"
    :show-confirm-button="false"
    :close-on-click-overlay="false"
    @update:show="(value) => !value && close()"
  >
    <div class="bonus-card" :style="animationStyle">
      <div class="bonus-spark" aria-hidden="true">✦</div>
      <p>{{ t("das.started.bonusLabel") }}</p>
      <h2>{{ t("das.started.bonusTitle") }}</h2>
      <strong>{{ amount }} USD</strong>
      <span v-if="bonus.orderNum">
        {{ t("das.started.bonusOrder", { order: bonus.orderNum }) }}
      </span>
      <small>{{ t("das.started.bonusHint") }}</small>
      <button type="button" @click="close">
        {{ t("das.started.bonusContinue") }}
      </button>
    </div>
  </van-dialog>
</template>

<style scoped>
.bonus-card {
  padding: 34px 24px 26px;
  text-align: center;
  color: #17382d;
  background:
    radial-gradient(circle at 50% 12%, rgba(255, 224, 139, 0.8), transparent 35%),
    #f8f4e8;
}
.bonus-spark {
  width: 72px;
  height: 72px;
  margin: 0 auto 14px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #e89a83;
  color: #fff8df;
  font-size: 38px;
  animation: bonus-pop var(--bonus-animation-duration) ease-in-out infinite alternate;
}
.bonus-card p {
  margin: 0;
  color: #9a725e;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.bonus-card h2 {
  margin: 8px 0 12px;
  font-size: 24px;
}
.bonus-card strong {
  display: block;
  color: #d66f58;
  font-size: 34px;
}
.bonus-card span {
  display: block;
  margin-top: 8px;
  color: #9a725e;
  font-size: 13px;
  font-weight: 700;
}
.bonus-card small {
  display: block;
  margin-top: 12px;
  color: #768079;
  line-height: 1.5;
}
.bonus-card button {
  width: 100%;
  height: 48px;
  margin-top: 24px;
  border: 0;
  border-radius: 999px;
  background: #17382d;
  color: #fff;
  font-weight: 800;
}
:deep(.bonus-dialog) {
  width: min(86vw, 390px);
  overflow: hidden;
  border-radius: 24px;
}
@keyframes bonus-pop {
  from {
    transform: scale(0.92) rotate(-5deg);
    box-shadow: 0 8px 20px rgba(214, 111, 88, 0.16);
  }
  to {
    transform: scale(1.06) rotate(5deg);
    box-shadow: 0 12px 30px rgba(214, 111, 88, 0.36);
  }
}
</style>
