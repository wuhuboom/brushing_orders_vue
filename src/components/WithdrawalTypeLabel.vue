<template>
  <span class="payment-account-crypto__row">
    <span class="payment-account-crypto__icon-wrap" aria-hidden="true">
      <img v-if="icon" :src="icon" alt="" />
      <span v-else class="payment-account-crypto__icon-fallback">{{ String(option.typeName ?? "").slice(0, 1) }}</span>
    </span>
    <strong class="payment-account-crypto__symbol">{{ option.typeName }}</strong>
  </span>
</template>

<script setup>
import { computed } from "vue";
import { resolveProfileImageUrl } from "@/utils/avatar";

const props = defineProps({ option: { type: Object, required: true } });
const icon = computed(() =>
  resolveProfileImageUrl(props.option.icon, window.g?.VITE_API_IMG_URL),
);
</script>

<style scoped>
.payment-account-crypto__row {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
  text-align: left;
}
.payment-account-crypto__icon-wrap {
  display: flex;
  flex: 0 0 40px;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--wm-soft);
}
.payment-account-crypto__icon-wrap img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}
.payment-account-crypto__icon-fallback {
  color: var(--wm-rust);
  font-size: 17px;
  font-weight: 800;
}
.payment-account-crypto__symbol {
  color: var(--wm-ink);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.15;
}
</style>
