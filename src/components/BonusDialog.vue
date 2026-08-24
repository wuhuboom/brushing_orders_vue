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
    width="min(calc(100vw - 24px), calc(var(--das-app-max-width, 100%) - 24px))"
    :show-confirm-button="false"
    close-on-click-overlay
    @update:show="(value) => !value && close()"
  >
    <div class="bonus-prize">
      <img src="@/static/das/congratulations.png" :alt="t('das.common.success')" />
      <button type="button" @click="contact">
        {{ t("das.auth.support") }}
      </button>
    </div>
  </van-dialog>
</template>

<style scoped>
:global(.bonus-dialog.van-dialog) {
  width: min(calc(100vw - 24px), calc(var(--das-app-max-width, 100%) - 24px)) !important;
  max-width: min(calc(100vw - 24px), calc(var(--das-app-max-width, 100%) - 24px)) !important;
  left: 50% !important;
  right: auto !important;
  margin: 0 !important;
  transform: translate3d(-50%, -50%, 0) !important;
  max-height: calc(100dvh - 28px);
  overflow: hidden;
  border-radius: 22px;
  background: #f7f1e7;
}
.bonus-prize {
  padding: 8px;
  background: #f7f1e7;
}
.bonus-prize img {
  display: block;
  width: 100%;
  max-height: calc(100dvh - 112px);
  object-fit: contain;
  border-radius: 16px;
}
.bonus-prize button {
  width: 100%;
  min-height: 52px;
  margin-top: 8px;
  padding: 10px 18px;
  border: 1px solid #c69a4b;
  border-radius: 999px;
  background: #14392c;
  color: #fff8ec;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.02em;
  box-shadow: 0 7px 18px rgba(20, 57, 44, 0.2);
}
.bonus-prize button:active {
  transform: translateY(1px);
  box-shadow: 0 3px 10px rgba(20, 57, 44, 0.18);
}
</style>
