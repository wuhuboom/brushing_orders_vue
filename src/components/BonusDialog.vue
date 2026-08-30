<script setup>
import { useI18n } from "vue-i18n";

defineProps({
  show: { type: Boolean, default: false },
});
const emit = defineEmits(["close", "contact"]);
const { t } = useI18n();

const close = () => emit("close");
const contact = () => emit("contact");
</script>

<template>
  <van-dialog
    :show="show"
    class="bonus-dialog"
    width="min(92vw, 880px)"
    :show-confirm-button="false"
    close-on-click-overlay
    @update:show="(value) => !value && close()"
  >
    <div class="bonus-prize">
      <img src="@/static/brain/congratulations.png" alt="Congratulations" />
      <button type="button" @click="contact">
        {{ t("das.auth.support") }}
      </button>
    </div>
  </van-dialog>
</template>

<style scoped>
:global(.bonus-dialog.van-dialog) {
  width: min(92vw, 880px) !important;
  max-width: min(92vw, 880px) !important;
  left: 50% !important;
  right: auto !important;
  margin: 0 !important;
  transform: translate3d(-50%, -50%, 0) !important;
  max-height: none !important;
  overflow: visible !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}
.bonus-prize {
  padding: 0;
  background: transparent;
}
.bonus-prize img {
  display: block;
  width: 100%;
  height: auto;
  max-height: none;
  object-fit: initial;
  border-radius: 0;
}
.bonus-prize button {
  width: min(88%, 680px);
  min-height: 52px;
  margin: 10px auto 0;
  padding: 10px 18px;
  border: 0;
  border-radius: 999px;
  display: block;
  background: linear-gradient(100deg, #0b9eff, #2f37d0);
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.02em;
  box-shadow: none;
}
.bonus-prize button:active {
  transform: translateY(1px);
  box-shadow: none;
}
</style>
