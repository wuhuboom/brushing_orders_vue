<script setup>
import { useI18n } from "vue-i18n";
import { openCustomerServiceDialog } from "@/utils/customerServiceDialog";

defineProps({
  show: { type: Boolean, default: false },
  amount: { type: [Number, String], default: "" },
});
const emit = defineEmits(["close"]);
const { t } = useI18n();

const close = () => emit("close");
const openCustomerService = () => openCustomerServiceDialog();
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
        <button
          type="button"
          class="bonus-prize__claim"
          @click="openCustomerService"
        >
          <span class="bonus-prize__claim-label">
            {{ t("das.started.claimReward") }}
          </span>
          <span class="bonus-prize__tap-hint" aria-hidden="true">
            <svg
              class="bonus-prize__tap-hand"
              viewBox="0 0 66 70"
              fill="none"
            >
              <path
                d="M27 39V13c0-3.3 2.7-6 6-6s6 2.7 6 6v18-6c0-3.3 2.7-6 6-6s6 2.7 6 6v8-3c0-3.3 2.7-6 6-6s6 2.7 6 6v15c0 14-9 23-23 23h-4c-8 0-13-3-17-9L5 43c-2.3-3.1-1.5-7.5 1.7-9.7 2.8-1.9 6.6-1.3 8.7 1.3L27 48V39Z"
                fill="rgba(0, 0, 0, 0.32)"
                stroke="currentColor"
                stroke-width="3.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </button>
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
.bonus-prize__claim {
  position: absolute;
  top: calc(100% + clamp(6px, 1.5vw, 12px));
  left: 50%;
  display: block;
  width: max-content;
  max-width: min(145%, calc(100vw - 40px));
  padding: 4px 0;
  border: 0;
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
  font-size: clamp(13px, 2.5vw, 18px);
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
  text-decoration: underline;
  text-decoration-color: #ffdf19;
  text-underline-offset: 4px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.9);
  transform: translateX(-50%);
}
.bonus-prize__claim-label {
  display: block;
}
.bonus-prize__claim:hover,
.bonus-prize__claim:focus-visible {
  color: #ffdf19;
}
.bonus-prize__claim:focus-visible {
  outline: 2px solid #ffdf19;
  outline-offset: 4px;
  border-radius: 4px;
}
.bonus-prize__tap-hint {
  position: absolute;
  top: calc(100% - clamp(14px, 2.5vw, 20px));
  left: 50%;
  width: clamp(34px, 6vw, 48px);
  height: clamp(42px, 7.5vw, 60px);
  color: #fff;
  pointer-events: none;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.9));
  transform: translateX(-50%);
}
.bonus-prize__tap-hint::before,
.bonus-prize__tap-hint::after {
  position: absolute;
  top: 1px;
  left: 50%;
  z-index: 2;
  display: block;
  content: "";
  pointer-events: none;
}
.bonus-prize__tap-hint::before {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fff;
  box-shadow:
    0 -15px 0 #fff,
    11px -10px 0 #ffdf19,
    16px 1px 0 #ff7a00,
    10px 12px 0 #ffdf19,
    -10px 12px 0 #fff,
    -16px 1px 0 #ff7a00,
    -11px -10px 0 #ffdf19;
  animation: bonus-click-sparks 1.65s ease-out infinite;
}
.bonus-prize__tap-hint::after {
  width: 8px;
  height: 8px;
  border: 2px solid #ffdf19;
  border-radius: 50%;
  animation: bonus-click-ring 1.65s ease-out infinite;
}
.bonus-prize__tap-hand {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
  animation: bonus-hand-click 1.65s ease-in-out infinite;
}

@keyframes bonus-rays-spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
@keyframes bonus-hand-click {
  0%,
  30%,
  100% {
    transform: translateY(10px) scale(1);
  }
  44%,
  58% {
    transform: translateY(0) scale(0.96);
  }
  72% {
    transform: translateY(10px) scale(1);
  }
}
@keyframes bonus-click-sparks {
  0%,
  43% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.12);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.42);
  }
  68% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1);
  }
  78%,
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.35);
  }
}
@keyframes bonus-click-ring {
  0%,
  45% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.2);
  }
  51% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.45);
  }
  72%,
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(2.5);
  }
}
</style>
