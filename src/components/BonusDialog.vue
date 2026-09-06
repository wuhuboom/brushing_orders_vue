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
    :show-confirm-button="false"
    :aria-label="t('das.nsg.prizeTitle')"
    close-on-click-overlay
    teleport="body"
    @update:show="(value) => !value && close()"
  >
    <div class="bonus-prize">
      <div class="bonus-prize__art">
        <img class="bonus-prize__background" src="/nsg16/bonus-prize-bg.png" alt="" />
        <h2 class="bonus-prize__title" :class="{ 'is-long': t('das.nsg.prizeTitle').length > 20 }">{{ t("das.nsg.prizeTitle") }}</h2>
        <p class="bonus-prize__message">{{ t("das.nsg.prizeMessage") }}</p>
        <strong class="bonus-prize__amount" :style="{ fontSize: Math.min(20, 90 / Math.max(String(amount).length, 1)) + 'cqw' }">{{ amount }}</strong>
        <span class="bonus-prize__currency">USDT</span>
        <button type="button" class="bonus-prize__claim" @click="openCustomerService">
          <span>{{ t("das.nsg.prizeSupport") }}</span>
        </button>
      </div>
      <button type="button" class="bonus-prize__close" :aria-label="t('das.common.close')" @click="close">
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="4" />
          <path d="m17 17 14 14m0-14L17 31" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </van-dialog>
</template>

<style scoped>
@font-face {
  font-family: "NsgPrizeMontserrat";
  src: url("/nsg16/marketing/assets/montserrat-latin.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}

:global(.bonus-dialog.van-dialog) {
  width: min(430px, calc(100vw - 32px), calc((100dvh - 100px) * 1024 / 1336)) !important;
  max-width: none !important;
  top: 50% !important;
  left: 50% !important;
  right: auto !important;
  margin: 0 !important;
  padding: 0 !important;
  transform: translate3d(-50%, -50%, 0) !important;
  overflow: visible;
  border: 0;
  background: transparent !important;
  box-shadow: none;
}

.bonus-prize {
  container-type: inline-size;
  width: 100%;
  color: #fff;
  font-family: "NsgPrizeMontserrat", "PingFang SC", sans-serif;
  text-align: center;
}

.bonus-prize__art {
  position: relative;
  width: 100%;
  aspect-ratio: 1024 / 1336;
  overflow: hidden;
}

/* Remove only the source PNG's transparent top/bottom padding, not its artwork. */
.bonus-prize__background {
  position: absolute;
  top: -11.2275%;
  left: 0;
  display: block;
  width: 100%;
  max-width: none;
  pointer-events: none;
}

.bonus-prize__title,
.bonus-prize__message,
.bonus-prize__amount,
.bonus-prize__currency {
  position: absolute;
  left: 10%;
  width: 80%;
  margin: 0;
  color: #fff;
}

.bonus-prize__title {
  top: 13.3%;
  font-size: 6.6cqw;
  font-weight: 600;
  line-height: 1.2;
}
.bonus-prize__title.is-long { font-size: 5.5cqw; }

.bonus-prize__message {
  top: 21.5%;
  left: 12%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76%;
  min-height: 12%;
  font-size: 4.9cqw;
  font-weight: 500;
  line-height: 1.5;
  text-wrap: balance;
}

.bonus-prize__amount {
  top: 38.5%;
  left: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60%;
  height: 20%;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.bonus-prize__currency {
  top: 57.6%;
  font-size: 5cqw;
  font-weight: 600;
  line-height: 1.2;
}

.bonus-prize__claim {
  position: absolute;
  top: 72.5%;
  left: 12.5%;
  display: grid;
  place-items: center;
  width: 75%;
  height: 14.4%;
  padding: 0 7%;
  isolation: isolate;
  border: 0.6cqw solid #a8cbff;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(125deg, #001a88 1%, #02d5ff 12%, #2725ff 35%, #5c16e9 70%, #f794ff 85%, #561ab7 98%);
  box-shadow: 0 0 0 0.6cqw #5344e9, inset 0 0 0 0.7cqw #171787, inset 0 0 1.3cqw 1cqw #5fffff;
  cursor: pointer;
}

.bonus-prize__claim::before {
  position: absolute;
  z-index: -1;
  inset: 8%;
  border: 0.4cqw solid #ffffffa8;
  border-radius: inherit;
  background: linear-gradient(140deg, #00aaff 0%, #261ade 35%, #3214c4 58%, #8625d0 86%, #f857ff 100%);
  box-shadow: inset 0 0.8cqw 1cqw #b4f7ff, inset 0 -0.7cqw 0.8cqw #06dcff;
  content: "";
}

.bonus-prize__claim::after {
  position: absolute;
  z-index: -1;
  inset: 11% 12% 52%;
  border-radius: 999px;
  background: linear-gradient(160deg, #b3f8ff88, #ffffff05 68%);
  content: "";
}

.bonus-prize__claim span {
  font-size: 4.8cqw;
  font-weight: 600;
  line-height: 1.2;
  text-wrap: balance;
}

.bonus-prize__close {
  display: block;
  width: clamp(32px, 11cqw, 48px);
  height: clamp(32px, 11cqw, 48px);
  margin: 12px auto 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: #92959c;
  cursor: pointer;
}

.bonus-prize__close svg { display: block; width: 100%; height: 100%; }
.bonus-prize__close:hover { color: #fff; }
.bonus-prize button:focus-visible { outline: 2px solid #fff; outline-offset: 5px; }

@media (max-width: 759px) {
  :global(.bonus-dialog.van-dialog) {
    width: min(68vw, 430px, calc((100dvh - 88px) * 1024 / 1336)) !important;
  }
}
</style>
