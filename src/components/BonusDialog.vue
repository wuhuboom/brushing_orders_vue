<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  show: { type: Boolean, default: false },
  amount: { type: [Number, String], default: 0 },
});
const emit = defineEmits(["close", "contact"]);
const { t } = useI18n();
const showAmount = window.g?.BONUS_DIALOG_MODE === "amount";
const displayedAmount = computed(() =>
  Number(props.amount || 0).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  }),
);

const close = () => emit("close");
const contact = () => emit("contact");
</script>

<template>
  <van-dialog
    :show="show"
    teleport="body"
    :class="showAmount ? 'bonus-dialog' : 'bonus-poster-dialog'"
    :show-confirm-button="false"
    close-on-click-overlay
    @update:show="(value) => !value && close()"
  >
    <template v-if="showAmount">
      <div class="bonus-prize">
        <img
          class="psy-bonus-background"
          src="/design500/reward-card.png"
          alt=""
        />
        <strong class="psy-bonus-amount">{{ displayedAmount }} USD</strong>
        <p class="psy-bonus-hint">{{ t("das.started.bonusContactHint") }}</p>
        <button type="button" @click="contact">
          {{ t("das.started.claimReward") }}
        </button>
      </div>
      <button
        class="design-bonus-close"
        type="button"
        :aria-label="t('das.common.close')"
        @click="close"
      >
        ×
      </button>
    </template>
    <div v-else class="bonus-poster">
      <img src="/design500/reward-poster.png" :alt="t('das.common.success')" />
      <button type="button" @click="contact">
        {{ t("das.auth.support") }}
      </button>
    </div>
  </van-dialog>
</template>

<style scoped>
:global(.van-dialog.bonus-poster-dialog) {
  top: 50%;
  width: min(calc(var(--design-shell) - 24px), calc(100dvh - 100px));
  border-radius: 22px !important;
  background: #f7f1e7;
}
.bonus-poster {
  padding: 8px;
}
.bonus-poster img {
  display: block;
  width: 100%;
  border-radius: 16px;
}
.bonus-poster button {
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
.bonus-poster button:active {
  transform: translateY(1px);
  box-shadow: 0 3px 10px rgba(20, 57, 44, 0.18);
}
</style>
