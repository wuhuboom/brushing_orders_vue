<template>
  <Teleport to="body">
    <Transition name="security-dialog" @after-leave="handleAfterLeave">
      <div
        v-if="visible"
        class="security-dialog"
        role="dialog"
        aria-modal="true"
      >
        <button
          class="security-dialog__backdrop"
          type="button"
          :aria-label="$t('das.common.close')"
          @click="cancel"
        ></button>

        <form
          class="security-dialog__card"
          novalidate
          @submit.prevent="verifyPassword"
        >
          <button
            class="security-dialog__close"
            type="button"
            :aria-label="$t('das.common.close')"
            @click="cancel"
          >
            <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M6 6l20 20M26 6 6 26" />
            </svg>
          </button>

          <span class="security-dialog__lock" aria-hidden="true">
            <svg viewBox="0 0 36 36" fill="none">
              <rect x="7" y="15" width="22" height="16" rx="3" />
              <path d="M11.5 15v-4a6.5 6.5 0 0 1 13 0v4" />
              <circle cx="18" cy="23" r="2" />
            </svg>
          </span>

          <h2>{{ $t("das.form.verifyFundPassword") }}</h2>
          <p>{{ $t("das.form.verifyFundPasswordHint") }}</p>

          <label class="security-dialog__field">
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
                <svg
                  v-if="passwordVisible"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                  />
                  <circle cx="12" cy="12" r="2.6" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M3 3l18 18M10.6 6.1A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-2.5 3.2M6.2 7.2C3.8 9 2.5 12 2.5 12s3.5 6 9.5 6a10 10 0 0 0 3.1-.5M9.9 9.9a3 3 0 0 0 4.2 4.2"
                  />
                </svg>
              </button>
            </div>
          </label>

          <div class="security-dialog__actions">
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
.security-dialog {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: grid;
  place-items: center;
  padding: 24px;
  font-family: "SF Pro Display", Arial, sans-serif;
}

.security-dialog__backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  background: rgba(0, 5, 18, 0.78);
  backdrop-filter: blur(5px);
}

.security-dialog__card {
  position: relative;
  z-index: 1;
  width: min(100%, 370px);
  min-height: 506px;
  padding: 33px 31px 34px;
  border: 1px solid rgba(20, 66, 111, 0.45);
  border-radius: 29px;
  background: #07172f;
  color: #dfeaff;
  box-shadow: 0 24px 65px rgba(0, 0, 0, 0.45);
}

.security-dialog__close {
  position: absolute;
  top: 25px;
  right: 25px;
  width: 42px;
  height: 42px;
  padding: 7px;
  border: 0;
  background: transparent;
  color: #cbd0da;
}

.security-dialog__close svg,
.security-dialog__field button svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  stroke-width: 2.1;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.security-dialog__lock {
  width: 65px;
  height: 65px;
  margin: 0 auto 31px;
  display: grid;
  place-items: center;
  border: 1px solid #155f64;
  border-radius: 17px;
  background: #0c3342;
  color: #36dca5;
}

.security-dialog__lock svg {
  width: 35px;
  height: 35px;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.security-dialog h2 {
  margin: 0;
  text-align: center;
  color: #dce9ff;
  font-size: 27px;
  font-weight: 800;
  line-height: 1.1;
}

.security-dialog > .security-dialog__card > p {
  max-width: 294px;
  margin: 17px auto 35px;
  color: #c8cedb;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
}

.security-dialog__field > span {
  display: block;
  margin: 0 0 13px;
  color: #dce9ff;
  font-size: 16px;
  font-weight: 500;
}

.security-dialog__field > div {
  height: 64px;
  padding: 0 13px 0 18px;
  display: flex;
  align-items: center;
  border: 1px solid #38475b;
  border-radius: 17px;
  background: #203044;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.security-dialog__field > div:focus-within {
  border-color: #2f8eff;
  box-shadow: 0 0 0 3px rgba(47, 142, 255, 0.15);
}

.security-dialog__field input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #fff;
  font-size: 18px;
}

.security-dialog__field input::placeholder {
  color: #8793a6;
}

.security-dialog__field button {
  width: 42px;
  height: 42px;
  padding: 8px;
  border: 0;
  background: transparent;
  color: #c3c9d4;
}

.security-dialog__actions {
  margin-top: 37px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.security-dialog__actions button {
  min-width: 0;
  min-height: 58px;
  border: 1px solid #378aff;
  border-radius: 15px;
  background: transparent;
  color: #dce9ff;
  font-size: 17px;
  font-weight: 700;
}

.security-dialog__actions button:last-child {
  border: 0;
  background: linear-gradient(105deg, #109df2, #176ee3 48%, #3d27bd);
}

.security-dialog__actions button:disabled {
  cursor: not-allowed;
}

.security-dialog-enter-active,
.security-dialog-leave-active {
  transition: opacity 180ms ease;
}

.security-dialog-enter-active .security-dialog__card,
.security-dialog-leave-active .security-dialog__card {
  transition:
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 180ms ease;
}

.security-dialog-enter-from,
.security-dialog-leave-to {
  opacity: 0;
}

.security-dialog-enter-from .security-dialog__card,
.security-dialog-leave-to .security-dialog__card {
  opacity: 0;
  transform: translateY(20px) scale(0.965);
}

@media (max-width: 390px) {
  .security-dialog {
    padding: 18px;
  }

  .security-dialog__card {
    padding-right: 24px;
    padding-left: 24px;
  }
}

:global(.el-message),
:global(.van-toast) {
  z-index: 4100 !important;
}
</style>
