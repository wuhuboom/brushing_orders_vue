<template>
  <span class="payment-account-crypto__row">
    <span class="payment-account-crypto__icon-wrap" aria-hidden="true">
      <span class="payment-account-crypto__icon-fallback">{{ String(option.typeName ?? "").slice(0, 1) }}</span>
    </span>
    <strong class="payment-account-crypto__symbol">{{ option.typeName }}</strong>
  </span>
</template>

<script setup>
defineProps({ option: { type: Object, required: true } });
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
  background: var(--brand-sage, #6e817d);
}
.payment-account-crypto__icon-fallback {
  color: #fff;
  font-size: 17px;
  font-weight: 800;
}
.payment-account-crypto__symbol {
  color: #000;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.15;
}
</style>
