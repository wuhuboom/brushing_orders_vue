<template>
  <Teleport to="body">
    <Transition name="security-dialog" @after-leave="handleAfterLeave">
      <div
        v-if="visible"
        class="security-dialog pay-password-drawer"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('das.page.fundPassword')"
      >
        <button
          class="pay-password-drawer__mask"
          type="button"
          :aria-label="$t('das.common.close')"
          @click="cancel"
        ></button>
        <form
          class="security-dialog__card pay-password-drawer__sheet"
          novalidate
          @submit.prevent="verifyPassword"
        >
          <div class="pay-password-drawer__handle" aria-hidden="true"></div>
          <h2 class="pay-password-drawer__title">
            {{ $t("das.page.fundPassword") }}
          </h2>
          <div class="pay-password-drawer__field">
            <label for="withdrawal-verification-password"
              >{{ $t("das.form.fundPassword") }} <em>*</em></label
            >
            <div class="security-dialog__input-row">
              <input
                id="withdrawal-verification-password"
                ref="passwordInput"
                v-model="password"
                class="pay-password-drawer__input"
                :type="passwordVisible ? 'text' : 'password'"
                autocomplete="current-password"
                minlength="6"
                maxlength="18"
              />
              <button
                type="button"
                :aria-label="$t('das.form.togglePassword')"
                @click="passwordVisible = !passwordVisible"
              >
                <ReferenceEye :visible="passwordVisible" />
              </button>
            </div>
          </div>
          <div class="pay-password-drawer__foot">
            <button
              class="pay-password-drawer__btn pay-password-drawer__btn--cancel"
              type="button"
              @click="cancel"
            >
              {{ $t("das.common.cancel") }}
            </button>
            <button
              class="pay-password-drawer__btn pay-password-drawer__btn--confirm"
              type="submit"
              :disabled="submitting || password.length < 6"
            >
              {{
                submitting ? $t("das.common.loading") : $t("das.common.submit")
              }}
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import ReferenceEye from "@/components/ReferenceEye.vue";
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
  width: min(100%, 620px);
  right: auto;
  left: 50%;
  transform: translateX(-50%);
  font-family: Arial, Helvetica, sans-serif;
  line-height: normal;
}
.pay-password-drawer__mask {
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
}
.security-dialog__input-row {
  position: relative;
}
.security-dialog__input-row input {
  padding-right: 44px !important;
}
.security-dialog__input-row > button {
  position: absolute;
  top: 0;
  right: 4px;
  width: 36px;
  height: 44px;
  border: 0;
  padding: 8px;
  background: transparent;
  color: #111;
}
.security-dialog__input-row svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
.pay-password-drawer__btn:disabled {
  cursor: not-allowed;
}
.security-dialog-enter-active,
.security-dialog-leave-active {
  transition: opacity 180ms ease;
}
.security-dialog-enter-active .security-dialog__card,
.security-dialog-leave-active .security-dialog__card {
  transition: transform 180ms ease;
}
.security-dialog-enter-from,
.security-dialog-leave-to {
  opacity: 0;
}
.security-dialog-enter-from .security-dialog__card,
.security-dialog-leave-to .security-dialog__card {
  transform: translateY(20px);
}
:global(.el-message),
:global(.van-toast) {
  z-index: 4100 !important;
}
</style>
