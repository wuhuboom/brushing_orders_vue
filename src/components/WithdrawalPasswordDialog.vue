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
        <form class="fund-dialog__card" novalidate @submit.prevent="verifyPassword">
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

          <span class="fund-dialog__icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <rect x="5" y="12" width="22" height="15" rx="5" />
              <path d="M10 12V9.5a6 6 0 0 1 12 0V12" />
              <circle cx="16" cy="19" r="2" />
            </svg>
          </span>
          <h2>{{ $t("das.form.verifyFundPassword") }}</h2>
          <p>{{ $t("das.form.verifyFundPasswordHint") }}</p>

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
                <svg v-if="passwordVisible" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                  <circle cx="12" cy="12" r="2.6" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 3l18 18M10.6 6.1A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-2.5 3.2M6.2 7.2C3.8 9 2.5 12 2.5 12s3.5 6 9.5 6a10 10 0 0 0 3.1-.5M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                </svg>
              </button>
            </div>
          </label>

          <div class="fund-dialog__actions">
            <button type="button" @click="cancel">
              {{ $t("das.common.cancel") }}
            </button>
            <button type="submit" :disabled="submitting || password.length < 6">
              {{ submitting ? $t("das.common.loading") : $t("das.common.confirm") }}
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
.fund-dialog {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: grid;
  place-items: center;
  padding: 24px;
}
.fund-dialog__backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  background: rgba(8, 31, 23, 0.66);
  backdrop-filter: blur(3px);
}
.fund-dialog__card {
  position: relative;
  z-index: 1;
  width: min(100%, 370px);
  padding: 30px 26px 24px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 28px;
  color: #17382d;
  background:
    radial-gradient(circle at 100% 0, rgba(242, 196, 76, 0.13), transparent 38%),
    #f7f5ec;
  box-shadow: 0 24px 56px rgba(5, 27, 19, 0.32);
}
.fund-dialog__close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 34px;
  height: 34px;
  padding: 8px;
  border: 0;
  border-radius: 50%;
  color: #62736a;
  background: #e9eee4;
}
.fund-dialog__close svg,
.fund-dialog__field button svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.fund-dialog__icon {
  width: 58px;
  height: 58px;
  margin: 0 auto 16px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  color: #173e30;
  background: #dce9d7;
}
.fund-dialog__icon svg {
  width: 33px;
  height: 33px;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.fund-dialog h2 {
  margin: 0;
  font-size: 22px;
  text-align: center;
}
.fund-dialog p {
  max-width: 280px;
  margin: 9px auto 24px;
  color: #7c8881;
  font-size: 13px;
  line-height: 1.55;
  text-align: center;
}
.fund-dialog__field > span {
  display: block;
  margin: 0 0 9px 3px;
  font-size: 14px;
  font-weight: 750;
}
.fund-dialog__field > div {
  height: 58px;
  padding: 0 12px 0 18px;
  display: flex;
  align-items: center;
  border: 1px solid #d7dbd2;
  border-radius: 17px;
  background: #fff;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}
.fund-dialog__field > div:focus-within {
  border-color: #4d806d;
  box-shadow: 0 0 0 3px rgba(77, 128, 109, 0.12);
}
.fund-dialog__field input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  color: #17382d;
  background: transparent;
  font-size: 16px;
}
.fund-dialog__field input::placeholder {
  color: #a2aaa5;
}
.fund-dialog__field button {
  width: 38px;
  height: 38px;
  padding: 8px;
  border: 0;
  color: #6f7e76;
  background: transparent;
}
.fund-dialog__actions {
  margin-top: 24px;
  display: grid;
  grid-template-columns: 0.78fr 1.22fr;
  gap: 10px;
}
.fund-dialog__actions button {
  min-height: 50px;
  border: 1px solid #d3d8d0;
  border-radius: 999px;
  color: #17382d;
  background: transparent;
  font-size: 15px;
  font-weight: 750;
}
.fund-dialog__actions button:last-child {
  border-color: #14392c;
  color: #fff;
  background: #14392c;
}
.fund-dialog__actions button:disabled {
  opacity: 0.48;
}
.fund-dialog-enter-active,
.fund-dialog-leave-active {
  transition: opacity 180ms ease;
}
.fund-dialog-enter-active .fund-dialog__card,
.fund-dialog-leave-active .fund-dialog__card {
  transition: transform 220ms ease, opacity 180ms ease;
}
.fund-dialog-enter-from,
.fund-dialog-leave-to {
  opacity: 0;
}
.fund-dialog-enter-from .fund-dialog__card,
.fund-dialog-leave-to .fund-dialog__card {
  opacity: 0;
  transform: translateY(18px) scale(0.97);
}

:global(.el-message) {
  z-index: 4100 !important;
}
:global(.van-toast) {
  z-index: 4100 !important;
}
</style>
