<template>
  <main class="auth-screen das-page fp-auth fp-auth--login">
    <div class="poetic-auth-bar">
      <button
        class="poetic-login-back"
        type="button"
        :aria-label="$t('das.common.back')"
        @click="safeReplace(router, '/account/welcome')"
      >
        <img class="poetic-back-arrow" src="/design500/back-white.png" alt="" />
      </button>
      <h1 class="auth-welcome">{{ signInTitle }}</h1>
      <AuthLanguage />
    </div>
    <header class="auth-top fp-auth__top">
      <div class="fp-auth__brand">
        <img
          class="auth-logo"
          src="/design500/logo-white.png"
          alt="500 Designs"
        />
      </div>
      <img class="psy-auth-profile" src="/poetic/guest.png" alt="" />
    </header>
    <form
      class="auth-form fp-auth__content fp-auth__form"
      novalidate
      @invalid.capture.prevent
      @submit.prevent="submit"
    >
      <div class="poetic-login-card">
        <p class="auth-kicker fp-auth__title">{{ signInTitle }}</p>
        <h1 class="psy-login-hero">
          <span>{{ $t("das.auth.signInLead") }}</span
          ><em>{{ $t("das.auth.signInAccent") }}</em>
        </h1>
        <p class="auth-hint fp-auth__subtitle">
          <span>{{ signInHint.lead }}</span>
          <em>{{ signInHint.accent }}</em>
        </p>
        <label class="required username-field fp-auth__field"
          ><span>{{ $t("das.auth.username") }}</span
          ><input
            v-model.trim="form.username"
            aria-required="true"
            autocomplete="username"
            :placeholder="$t('das.auth.username')"
        /></label>
        <label class="required password-field fp-auth__field"
          ><span>{{ $t("das.auth.password") }}</span
          ><input
            v-model="form.password"
            aria-required="true"
            :type="passwordVisible ? 'text' : 'password'"
            autocomplete="current-password"
            :placeholder="$t('das.auth.password')" /><button
            class="fp-auth__eye"
            type="button"
            :aria-label="$t('das.form.togglePassword')"
            :aria-pressed="passwordVisible"
            @click="passwordVisible = !passwordVisible"
          >
            <ReferenceEye :visible="passwordVisible" /></button
        ></label>
        <div class="auth-options fp-auth__inline-links">
          <button type="button" @click="customer">
            {{ $t("das.auth.forgot") }}</button
          ><label
            ><input v-model="remember" type="checkbox" />
            {{ $t("das.auth.remember") }}</label
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
        {{ $t("das.auth.noAccount") }}
        <button type="button" @click="safeReplace(router, '/account/register')">
          {{ $t("das.auth.registerNow") }}
        </button>
      </p>
      <p class="auth-link auth-support fp-auth__linkline">
        {{ $t("das.auth.cannotLogin") }}
        <button type="button" @click="customer">
          {{ $t("das.auth.support") }}
        </button>
      </p>
    </form>
    <footer class="fp-auth__footer">{{ $t("das.common.copyright") }}</footer>
    <van-dialog
      v-model:show="showError"
      class="das-status-dialog das-login-status-dialog"
      overlay-class="das-auth-overlay"
      teleport="body"
      :show-confirm-button="false"
      ><div class="status-dialog">
        <img class="status-dialog__icon" src="/design500/error.png" alt="" />
        <h2>{{ $t("das.auth.wrongCredentials") }}</h2>
        <p>{{ errorMessage || $t("das.auth.wrongCredentialsHint") }}</p>
        <button @click="showError = false">
          {{ $t("das.auth.tryAgain") }}
        </button>
      </div></van-dialog
    >
  </main>
</template>

<script setup>
import AuthLanguage from "@/components/AuthLanguage.vue";
import ReferenceEye from "@/components/ReferenceEye.vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/store/modules/user";
import { login } from "@/api/apis";
import { safePush, safeReplace } from "@/utils/navigation";
const router = useRouter(),
  { t } = useI18n(),
  userStore = useUserStore();
const form = reactive({ username: "", password: "" }),
  remember = ref(true),
  submitting = ref(false),
  showError = ref(false),
  errorMessage = ref("");
const passwordVisible = ref(false);
const canSubmit = computed(
  () => Boolean(form.username.trim()) && Boolean(form.password),
);
const signInTitle = computed(() => {
  const text = t("das.auth.signIn").trim();
  return text === text.toUpperCase()
    ? text
        .toLowerCase()
        .replace(/(^|\s)\S/g, (character) => character.toUpperCase())
    : text;
});
const signInHint = computed(() => {
  const text = t("das.auth.signInHint").trim();
  const match = text.match(/^(.*?)(\S+)$/);
  return match
    ? { lead: match[1], accent: match[2] }
    : { lead: text, accent: "" };
});
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
    showError.value = true;
  } finally {
    submitting.value = false;
  }
};
</script>
