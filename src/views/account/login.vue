<template>
  <main class="auth-screen das-page fp-auth fp-auth--login">
    <header class="auth-top fp-auth__top">
      <h1 class="auth-welcome">{{ $t("das.auth.welcome") }}</h1>
      <div class="fp-auth__brand">
        <img
          class="auth-logo"
          src="/worldofgood/logo-Cu7jN8a6.webp"
          alt="worldofgood"
        />
      </div>
      <div class="auth-language">
        <button
          class="language-button"
          type="button"
          :aria-expanded="languageOpen"
          aria-haspopup="listbox"
          @click="languageOpen = !languageOpen"
        >
          <span class="language-globe" aria-hidden="true"></span>
          <span>{{ language.toUpperCase() }}</span>
          <span class="language-chevron" aria-hidden="true"></span>
        </button>
        <div
          v-if="languageOpen"
          class="language-menu"
          role="listbox"
          :aria-label="$t('das.page.language')"
        >
          <button
            v-for="item in LANGS"
            :key="item.code"
            type="button"
            role="option"
            :aria-selected="language === item.code"
            :class="{ active: language === item.code }"
            @click="changeLanguage(item.code)"
          >
            <span>{{ item.name }}</span>
            <b>{{ item.code.toUpperCase() }}</b>
          </button>
        </div>
      </div>
    </header>
    <form
      class="auth-form fp-auth__content fp-auth__form"
      novalidate
      @invalid.capture.prevent
      @submit.prevent="submit"
    >
      <p class="auth-kicker fp-auth__title">{{ signInTitle }}</p>
      <h1>
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
        {{ $t("das.auth.login") }} <span>→</span>
      </button>
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
        <span class="status-dialog__icon" aria-hidden="true">×</span>
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
import ReferenceEye from "@/components/ReferenceEye.vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { LANGS } from "@/config/lang";
import { useCommonStore } from "@/store/modules/common";
import { useUserStore } from "@/store/modules/user";
import { useLocale } from "@/util/useLocale";
import { login } from "@/api/apis";
import { safePush, safeReplace } from "@/utils/navigation";
const router = useRouter(),
  { t, locale } = useI18n(),
  { setLocale } = useLocale(),
  commonStore = useCommonStore(),
  userStore = useUserStore();
const form = reactive({ username: "", password: "" }),
  remember = ref(true),
  submitting = ref(false),
  showError = ref(false),
  languageOpen = ref(false),
  errorMessage = ref("");
const language = computed(() => commonStore.clientLang || "en");
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
const changeLanguage = (code) => {
  commonStore.updateLang(code);
  locale.value = code;
  setLocale(code);
  languageOpen.value = false;
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
    showError.value = true;
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
:global(.das-login-status-dialog.van-dialog) {
  top: 50%;
  width: min(calc(100vw - 48px), 360px);
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 18px 44px #00000024;
  font-family: Arial, Helvetica, sans-serif;
}
:global(.das-auth-overlay.van-overlay) {
  background: #11201b80;
}
.status-dialog {
  padding: 28px 24px 24px;
  color: #151514;
  text-align: center;
}
.status-dialog__icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: #eef2ea;
  color: #435754;
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
}
.status-dialog h2 {
  margin: 0 0 10px;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.3;
}
.status-dialog p {
  margin: 0;
  color: #6e817d;
  font-size: 15px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.status-dialog button {
  display: block;
  width: 100%;
  min-height: 46px;
  margin-top: 22px;
  padding: 12px 16px;
  border: 0;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 800;
}
.status-dialog button:focus-visible {
  outline: 2px solid #435754;
  outline-offset: 3px;
}
</style>

