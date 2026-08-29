<script setup>
import { useI18n } from "vue-i18n";

defineProps({
  show: { type: Boolean, default: false },
  amount: { type: [Number, String], default: "" },
});
const emit = defineEmits(["close"]);
const { t } = useI18n();

const close = () => emit("close");
</script>

<template>
  <van-dialog
    :show="show"
    class="bonus-dialog"
    width="min(calc(100vw - 48px), 560px)"
    :show-confirm-button="false"
    close-on-click-overlay
    @update:show="(value) => !value && close()"
  >
    <div class="bonus-prize" role="status" :aria-label="t('das.common.success')">
      <img
        class="bonus-prize__rays"
        src="@/static/das/bonus-rays.png"
        alt=""
        aria-hidden="true"
      />
      <div class="bonus-prize__result">
        <img
          class="bonus-prize__title"
          src="@/static/das/bonus-big-win.png"
          :alt="t('das.common.success')"
        />
        <strong class="bonus-prize__amount">
          <span>{{ amount }}</span>
        </strong>
      </div>
    </div>
  </van-dialog>
</template>

<style scoped>
:global(.bonus-dialog.van-dialog) {
  width: min(calc(100vw - 32px), calc(100dvh - 32px), 720px) !important;
  max-width: none !important;
  left: 50% !important;
  right: auto !important;
  margin: 0 !important;
  transform: translate3d(-50%, -50%, 0) !important;
  overflow: visible;
  background: transparent;
}
.bonus-prize {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
}
.bonus-prize__rays {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 88%;
  height: 88%;
  animation: bonus-rays-spin 12s linear infinite;
}
.bonus-prize__result {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 75%;
  transform: translate(-50%, -45%);
}
.bonus-prize__title {
  display: block;
  width: 100%;
}
.bonus-prize__amount {
  position: absolute;
  bottom: 3%;
  left: 47%;
  width: 82%;
  height: 20%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  transform: translateX(-50%);
  color: #ffdf19;
  font-family: Arial, Helvetica, sans-serif;
  font-size: clamp(26px, 7vw, 58px);
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  text-align: center;
  text-shadow: 0 3px 0 rgba(113, 53, 0, 0.5);
  white-space: nowrap;
}
.bonus-prize__amount span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes bonus-rays-spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
