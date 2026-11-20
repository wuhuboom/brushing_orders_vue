<template>
  <main class="auth-screen das-page fp-auth fp-auth--login">
    <div class="poetic-auth-bar">
      <button
        class="wester-auth-brand"
        type="button"
        :aria-label="$t('das.common.back')"
        @click="safeReplace(router, '/account/welcome')"
      >
        <img class="auth-logo" src="/westermedia/logo.png" alt="WesterMedia" />
      </button>
      <AuthLanguage />
    </div>
    <form
      class="auth-form fp-auth__content fp-auth__form"
      novalidate
      @invalid.capture.prevent
      @submit.prevent="submit"
    >
      <div class="wester-auth-intro">
        <p class="auth-kicker fp-auth__title">
          <img v-if="$i18n.locale === 'en'" src="/westermedia/welcome-back.png" :alt="$t('das.wester.welcomeBack')" />
          <template v-else>{{ $t("das.wester.welcomeBack") }}</template>
        </p>
        <h1 class="psy-login-hero">
          <span>{{ $t(showError ? "das.wester.portalLead" : "das.wester.signInLead") }}</span>
          <em>{{ $t(showError ? "das.wester.portalAccent" : "das.wester.signInAccent") }}</em>
        </h1>
        <p v-if="!showError" class="auth-hint fp-auth__subtitle">
          {{ $t("das.wester.portalHint") }}
        </p>
        <p class="wester-auth-badge"><img src="/westermedia/portal-lock.png" alt="" />{{ $t("das.wester.securePortal") }}</p>
      </div>
      <div class="wester-auth-tabs">
        <span>{{ $t("das.auth.login") }}</span>
        <button type="button" @click="safeReplace(router, '/account/register')">
          {{ $t("das.wester.createAccount") }}
        </button>
      </div>
      <div class="poetic-login-card">
        <header class="wester-auth-card-heading">
          <h2 class="wester-auth-card-title">{{ $t(showError ? "das.auth.login" : "das.wester.clientLogin") }}</h2>
          <span v-if="showError">{{ $t("das.wester.studioPortal") }}</span>
        </header>
        <div v-if="showError" class="wester-login-error" role="alert">
          <img src="/westermedia/login-error.png" alt="" />
          <div>
            <strong>{{ $t("das.wester.authenticationError") }}</strong>
            <p>{{ credentialError ? $t("das.wester.passwordMismatch") : errorMessage || $t("das.auth.authFailedHint") }}</p>
          </div>
        </div>
        <label class="required username-field fp-auth__field"
          ><span>{{ $t(showError ? "das.wester.usernameOrEmail" : "das.wester.workEmailUsername") }}</span
          ><input
            v-model.trim="form.username"
            aria-required="true"
            autocomplete="username"
            :placeholder="$t('das.wester.usernameExample')"
            @input="clearError"
        /></label>
        <div class="wester-forgot">
          <button type="button" @click="customer">{{ $t("das.auth.forgot") }}</button>
        </div>
        <label class="required password-field fp-auth__field" :class="{ 'has-error': credentialError }"
          ><span>{{ $t("das.wester.password") }}</span
          ><input
            v-model="form.password"
            aria-required="true"
            :type="passwordVisible ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="••••••••••••"
            :aria-invalid="credentialError || undefined"
            :aria-describedby="credentialError ? 'login-password-error' : undefined"
            @input="clearError"
          /><button
            class="fp-auth__eye"
            type="button"
            :aria-label="$t('das.form.togglePassword')"
            :aria-pressed="passwordVisible"
            @click="passwordVisible = !passwordVisible"
          >
            <ReferenceEye :visible="passwordVisible" /></button
        ></label>
        <p v-if="credentialError" id="login-password-error" class="wester-password-error">
          <img src="/westermedia/field-error.png" alt="" />
          <span>{{ $t("das.wester.incorrectPassword") }}</span>
        </p>
        <div class="auth-options fp-auth__inline-links">
          <label
            ><input v-model="remember" type="checkbox" />
            {{ $t("das.wester.rememberDevice") }}</label
          >
        </div>
        <button
          class="auth-submit fp-auth__submit"
          type="submit"
          :disabled="!canSubmit || submitting"
        >
          {{ $t("das.auth.login") }}
          <img src="/design500/arrow.png" alt="" />
        </button>
      </div>
      <p class="auth-link fp-auth__linkline">
        {{ $t(showError ? "das.auth.noAccount" : "das.wester.noStudioAccount") }}
        <button type="button" @click="safeReplace(router, '/account/register')">
          {{ $t(showError ? "das.wester.createAccount" : "das.wester.registerHere") }}
        </button>
      </p>
      <p class="auth-link auth-support fp-auth__linkline">
        {{ $t("das.wester.needAssistance") }}
        <button type="button" @click="customer">
          {{ $t("das.auth.support") }}
        </button>
      </p>
    </form>
    <WesterFooter class="fp-auth__footer" />
  </main>
</template>

<script setup>
import AuthLanguage from "@/components/AuthLanguage.vue";
import ReferenceEye from "@/components/ReferenceEye.vue";
import WesterFooter from "@/components/WesterFooter.vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { login } from "@/api/apis";
import { safePush, safeReplace } from "@/utils/navigation";
const router = useRouter(),
  userStore = useUserStore();
const form = reactive({ username: "", password: "" }),
  remember = ref(true),
  submitting = ref(false),
  showError = ref(false),
  errorMessage = ref(""),
  credentialError = ref(false);
const passwordVisible = ref(false);
const canSubmit = computed(
  () => Boolean(form.username.trim()) && Boolean(form.password),
);
const clearError = () => {
  showError.value = false;
  credentialError.value = false;
  errorMessage.value = "";
};
const rememberKeys = {
  enabled: "dasRemember",
  username: "dasUsername",
  password: "dasPassword",
};

const clearRememberedCredentials = () => {
  localStorage.removeItem(rememberKeys.username);
  localStorage.removeItem(rememberKeys.password);
  localStorage.removeItem("username");
  localStorage.removeItem("password");
};

onMounted(() => {
  const savedRemember = localStorage.getItem(rememberKeys.enabled);
  const legacyRemember = localStorage.getItem("checked");

  remember.value =
    savedRemember !== null
      ? savedRemember === "true"
      : legacyRemember !== "false";

  if (remember.value) {
    form.username =
      localStorage.getItem(rememberKeys.username) ||
      localStorage.getItem("username") ||
      "";
    form.password =
      localStorage.getItem(rememberKeys.password) ||
      localStorage.getItem("password") ||
      "";
  }
});

watch(remember, (enabled) => {
  localStorage.setItem(rememberKeys.enabled, String(enabled));
  if (!enabled) clearRememberedCredentials();
});

const customer = () => safePush(router, "/contact");
const submit = async () => {
  if (!canSubmit.value || submitting.value) return;
  submitting.value = true;
  try {
    const res = await login(form);
    userStore.setToken(`Bearer ${res.data.token}`);
    userStore.setUserInfo(res.data.info);
    localStorage.setItem(rememberKeys.enabled, String(remember.value));
    if (remember.value) {
      localStorage.setItem(rememberKeys.username, form.username);
      localStorage.setItem(rememberKeys.password, form.password);
    } else {
      clearRememberedCredentials();
    }
    localStorage.removeItem("checked");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    await safeReplace(router, "/");
  } catch (error) {
    errorMessage.value = error?.msg || error?.message || "";
    credentialError.value =
      [601, 602].includes(Number(error?.code)) ||
      /(?:invalid|incorrect|wrong).*(?:password|credentials)/i.test(errorMessage.value);
    showError.value = true;
  } finally {
    submitting.value = false;
  }
};
</script>
