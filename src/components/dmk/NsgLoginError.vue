<template>
  <div class="nsg-login-error">
    <svg class="nsg-login-error__icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="6" />
      <path d="m24 24 16 16m0-16L24 40" stroke="currentColor" stroke-width="7" stroke-linecap="round" />
    </svg>
    <h2>{{ $t("das.auth.wrongCredentials") }}</h2>
    <p>{{ message || $t("das.auth.wrongCredentialsHint") }}</p>
    <button type="button" @click="$emit('retry')">{{ $t("das.auth.tryAgain") }}</button>
  </div>
</template>

<script setup>
defineProps({ message: { type: String, default: "" } });
defineEmits(["retry"]);
</script>

<style scoped>
:global(.dmk-login-error-dialog.van-dialog) {
  width: min(448px, calc(100vw - 32px));
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  border: 1px solid #202538;
  border-radius: 16px !important;
  background: #070e20;
  box-shadow: none;
}
.nsg-login-error {
  padding: 36px 32px 32px;
  color: #d5d7f0;
  font-family: "DM Sans", Arial, sans-serif;
  text-align: center;
}
.nsg-login-error__icon {
  display: block;
  width: 64px;
  height: 64px;
  margin: 0 auto;
  color: #ff3b30;
}
.nsg-login-error h2 {
  margin: 20px 0 16px;
  color: #d5d7f0;
  font-size: 28px;
  font-weight: 500;
  line-height: 1.25;
}
.nsg-login-error p {
  margin: 0;
  color: #a9a6bd;
  font-size: 16px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.nsg-login-error button {
  width: 100%;
  min-height: 48px;
  margin-top: 32px;
  padding: 10px 12px;
  border: 0;
  border-radius: 10px;
  background: var(--nsg-gradient, linear-gradient(90deg, #49bdec, #8b2cdd));
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
}
@media (max-width: 1023px) {
  :global(.dmk-login-error-dialog.van-dialog) { width: 70vw; max-width: 448px; border-radius: 10px !important; }
  .nsg-login-error { padding: 24px 13% 18px; }
  .nsg-login-error__icon { width: 42px; height: 42px; }
  .nsg-login-error h2 { margin: 14px 0; font-size: 18px; }
  .nsg-login-error p { font-size: 13px; }
  .nsg-login-error button { min-height: 34px; margin-top: 22px; padding: 6px 10px; border-radius: 6px; font-size: 14px; }
}
</style>
