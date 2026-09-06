<template>
  <Teleport to="body">
    <Transition name="fund-dialog" @after-leave="handleAfterLeave">
      <div v-if="visible" class="fund-dialog" role="dialog" aria-modal="true">
        <button
          class="fund-dialog__backdrop"
          type="button"
          :aria-label="$t('das.common.close')"
          @click="cancel"
        ></button>
        <form
          class="fund-dialog__card"
          novalidate
          @submit.prevent="verifyPassword"
        >
          <button
            class="fund-dialog__close"
            type="button"
            :aria-label="$t('das.common.close')"
            @click="cancel"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m7 7 10 10M17 7 7 17" />
            </svg>
          </button>

          <header class="fund-dialog__header">
            <img class="fund-dialog__brand" src="/nsg16/logo.png" alt="NSG" />
            <span class="fund-dialog__eyebrow">{{ $t("das.dmk.secureAccess") }}</span>
          </header>
          <div class="fund-dialog__intro">
            <div>
              <h2>{{ $t("das.form.verifyFundPassword") }}</h2>
              <p>{{ $t("das.form.verifyFundPasswordHint") }}</p>
            </div>
            <span class="fund-dialog__icon" aria-hidden="true">
              <img src="/nsg16/withdraw-password-icon.png" alt="" />
            </span>
          </div>

          <label class="fund-dialog__field">
            <span>{{ $t("das.form.fundPassword") }}</span>
            <div>
              <input
                ref="passwordInput"
                v-model="password"
                :type="passwordVisible ? 'text' : 'password'"
                :placeholder="$t('das.form.enterTradePassword')"
                autocomplete="current-password"
                minlength="6"
                maxlength="18"
              />
              <button
                type="button"
                :aria-label="$t('das.form.togglePassword')"
                @click="passwordVisible = !passwordVisible"
              >
                <img :src="passwordVisible ? '/nsg16/password-visible.png' : '/nsg16/password-hidden.png'" alt="" />
              </button>
            </div>
          </label>

          <div class="fund-dialog__actions">
            <button type="button" @click="cancel">
              {{ $t("das.common.cancel") }}
            </button>
            <button type="submit" :disabled="submitting || password.length < 6">
              {{
                submitting ? $t("das.common.loading") : $t("das.common.confirm")
              }}
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { showToast } from "vant";
import { useI18n } from "vue-i18n";
import { checkTradePassword } from "@/api/apis";

const emit = defineEmits(["verified", "cancel"]);
const { t } = useI18n();
const visible = ref(false);
const password = ref("");
const passwordVisible = ref(false);
const submitting = ref(false);
const passwordInput = ref(null);
const verifiedToken = ref("");

const open = async () => {
  password.value = "";
  passwordVisible.value = false;
  visible.value = true;
  await nextTick();
  passwordInput.value?.focus();
};

const close = () => {
  visible.value = false;
  password.value = "";
  passwordVisible.value = false;
};

const cancel = () => {
  if (submitting.value) return;
  verifiedToken.value = "";
  close();
  emit("cancel");
};

const handleAfterLeave = () => {
  if (!verifiedToken.value) return;
  const token = verifiedToken.value;
  verifiedToken.value = "";
  emit("verified", token);
};

const verifyPassword = async () => {
  const value = password.value.trim();
  if (value.length < 6 || value.length > 18) {
    showToast(t("das.form.fundPasswordLength"));
    return;
  }
  submitting.value = true;
  try {
    const response = await checkTradePassword({ tradePassword: value });
    const token = String(response?.data?.token ?? response?.data ?? "").trim();
    if (!token) throw new Error(t("das.form.credentialMissing"));
    verifiedToken.value = token;
    close();
  } catch (error) {
    if (!error?.code) {
      showToast(error?.msg || error?.message || t("das.common.requestFailed"));
    }
    password.value = "";
    await nextTick();
    passwordInput.value?.focus();
  } finally {
    submitting.value = false;
  }
};

defineExpose({ open, close });
</script>

<style scoped>
.fund-dialog { position: fixed; inset: 0; z-index: 3000; display: grid; place-items: center; padding: 24px; }
.fund-dialog__backdrop { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; background: #030611c7; backdrop-filter: blur(8px); }
.fund-dialog__card { position: relative; z-index: 1; width: min(100%, 520px); padding: 28px 32px 24px; border: 1px solid #354267; border-radius: 24px; color: #f2f5ff; background: radial-gradient(ellipse at 100% 0, #36316466, transparent 65%), #111a2e; box-shadow: 0 30px 110px #0009, inset 0 1px 0 #ffffff0d; font-family: "DM Sans", Arial, sans-serif; }
.fund-dialog__header { display: flex; align-items: center; gap: 16px; padding-right: 32px; }
.fund-dialog__brand { width: 70px; height: 30px; object-fit: contain; }
.fund-dialog__eyebrow { padding-left: 16px; border-left: 1px solid #384461; color: #a9b7d5; font-size: 10px; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; }
.fund-dialog__close { position: absolute; top: 22px; right: 22px; display: grid; place-items: center; width: 32px; height: 32px; padding: 7px; border: 1px solid #33405a; border-radius: 10px; color: #aab7d0; background: #1a253b; }
.fund-dialog__close svg { width: 100%; height: 100%; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }
.fund-dialog__intro { display: grid; grid-template-columns: minmax(0, 1fr) 70px; align-items: center; gap: 24px; margin: 34px 0 28px; }
.fund-dialog h2 { margin: 0; font-size: 26px; font-weight: 650; line-height: 1.2; letter-spacing: -.025em; }
.fund-dialog p { margin: 12px 0 0; color: #a0aec9; font-size: 13px; line-height: 1.6; }
.fund-dialog__icon { display: grid; place-items: center; width: 70px; height: 80px; border: 1px solid #45537a; border-radius: 22px; background: linear-gradient(145deg, #263c57, #29233f); transform: rotate(6deg); box-shadow: 0 10px 30px #0003; }
.fund-dialog__icon img { width: 48px; height: 48px; transform: rotate(-6deg); }
.fund-dialog__field > span { display: block; margin-bottom: 10px; color: #d4dcee; font-size: 13px; font-weight: 600; }
.fund-dialog__field > div { height: 58px; padding: 0 12px 0 16px; display: flex; align-items: center; border: 1px solid #394866; border-radius: 12px; background: #0b1324; transition: border-color 160ms, box-shadow 160ms; }
.fund-dialog__field > div:focus-within { border-color: #8292ed; box-shadow: 0 0 0 3px #8292ed14; }
.fund-dialog__field input { min-width: 0; flex: 1; border: 0; outline: 0; color: #fff; background: transparent; font-size: 16px; }
.fund-dialog__field input::placeholder { color: #7888a6; }
.fund-dialog__field button { width: 36px; height: 36px; padding: 8px; border: 0; background: transparent; }
.fund-dialog__field button img { width: 100%; height: 100%; object-fit: contain; }
.fund-dialog__actions { display: grid; grid-template-columns: 1fr 1.5fr; gap: 12px; padding-top: 24px; margin-top: 24px; border-top: 1px solid #2a3650; }
.fund-dialog__actions button { min-height: 50px; padding: 10px; border: 1px solid #3a4865; border-radius: 12px; color: #dce5f8; background: #182238; font-size: 14px; font-weight: 650; }
.fund-dialog__actions button:last-child { border: 0; color: #fff; background: linear-gradient(100deg, #46b9eb, #8840df); box-shadow: 0 6px 20px #5754c325; }
.fund-dialog__actions button:disabled { opacity: .45; box-shadow: none; cursor: not-allowed; }
.fund-dialog button:focus-visible { outline: 2px solid #8ecaff; outline-offset: 3px; }
.fund-dialog-enter-active, .fund-dialog-leave-active { transition: opacity 180ms ease; }
.fund-dialog-enter-active .fund-dialog__card, .fund-dialog-leave-active .fund-dialog__card { transition: transform 220ms ease; }
.fund-dialog-enter-from, .fund-dialog-leave-to { opacity: 0; }
.fund-dialog-enter-from .fund-dialog__card, .fund-dialog-leave-to .fund-dialog__card { transform: translateY(16px); }
@media (max-width: 480px) {
  .fund-dialog { padding: 16px; }
  .fund-dialog__card { padding: 24px; border-radius: 20px; }
  .fund-dialog__header { gap: 12px; }
  .fund-dialog__eyebrow { padding-left: 12px; font-size: 9px; }
  .fund-dialog__intro { grid-template-columns: minmax(0, 1fr) 56px; gap: 16px; margin: 28px 0; }
  .fund-dialog h2 { font-size: 23px; }
  .fund-dialog__icon { width: 56px; height: 66px; border-radius: 18px; }
  .fund-dialog__icon img { width: 42px; height: 42px; }
}
@media (prefers-reduced-motion: reduce) {
  .fund-dialog-enter-active, .fund-dialog-leave-active, .fund-dialog-enter-active .fund-dialog__card, .fund-dialog-leave-active .fund-dialog__card { transition: none; }
}
:global(.el-message), :global(.van-toast) { z-index: 4100 !important; }
</style>
