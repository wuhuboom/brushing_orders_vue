<script setup>
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const props = defineProps({
  show: { type: Boolean, default: false },
  amount: { type: [Number, String], default: 0 },
});
const emit = defineEmits(["close", "contact"]);
const { t } = useI18n();
const displayedAmount = computed(() => Number(props.amount || 0).toLocaleString(undefined, { maximumFractionDigits: 2 }));

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
      <img
        class="psy-bonus-background"
        src="/psybir/bonus-art.png"
        alt="BIG WIN"
      />
      <strong class="psy-bonus-amount">{{ displayedAmount }} USD</strong>
      <p class="psy-bonus-hint">{{ t("das.started.bonusContactHint") }}</p>
      <button type="button" @click="contact">
        {{ t("das.started.claimReward") }}
      </button>
    </div>
  </van-dialog>
</template>
