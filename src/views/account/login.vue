<template>
  <main class="auth-screen das-page">
    <header class="auth-top">
      <button
        class="auth-back"
        type="button"
        :aria-label="$t('das.common.back')"
        @click="safeReplace(router, '/account/welcome')"
      >
        <img src="@/static/brain/back.png" alt="" />
      </button>
      <p class="auth-welcome">{{ $t("das.auth.welcome") }}</p>
      <img class="auth-logo" src="@/static/brain/logo.png" alt="Brain Power" />
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
      class="auth-form"
      novalidate
      @invalid.capture.prevent
      @submit.prevent="submit"
    >
      <p class="auth-kicker">{{ signInTitle }}</p>
      <h1>
        <span>{{ $t("das.auth.signInLead") }}</span
        ><em>{{ $t("das.auth.signInAccent") }}</em>
      </h1>
      <p class="auth-hint">
        <span>{{ signInHint.lead }}</span>
        <em>{{ signInHint.accent }}</em>
      </p>
      <label class="required username-field"
        ><span>{{ $t("das.auth.username") }}</span
        ><input
          v-model.trim="form.username"
          aria-required="true"
          autocomplete="username"
      /></label>
      <label class="required password-field"
        ><span>{{ $t("das.auth.password") }}</span
        ><input
          v-model="form.password"
          aria-required="true"
          type="password"
          autocomplete="current-password"
      /></label>
      <div class="auth-options">
        <button type="button" @click="customer">
          {{ $t("das.auth.forgot") }}</button
        ><label
          ><input v-model="remember" type="checkbox" />
          {{ $t("das.auth.remember") }}</label
        >
      </div>
      <button
        class="auth-submit"
        type="submit"
        :disabled="!canSubmit || submitting"
      >
        {{ $t("das.auth.login") }} <span>→</span>
      </button>
      <p class="auth-link">
        {{ $t("das.auth.noAccount") }}
        <button type="button" @click="safeReplace(router, '/account/register')">
          {{ $t("das.auth.registerNow") }}
        </button>
      </p>
      <p class="auth-link auth-support">
        {{ $t("das.auth.cannotLogin") }}
        <button type="button" @click="customer">
          {{ $t("das.auth.support") }}
        </button>
      </p>
      <p class="auth-copyright">{{ $t("das.common.copyright") }}</p>
    </form>
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
.auth-screen {
  position: relative;
  min-height: max(100dvh, 750px);
  padding: 23px clamp(31px, 8vw, 76px) max(23px, env(safe-area-inset-bottom));
  background: #010616 url("@/static/brain/auth-background.png") center / 100%
    100% no-repeat;
  color: #fff;
  overflow: hidden;
}
.auth-top,
.auth-form {
  position: relative;
  z-index: 1;
}
.auth-top {
  z-index: 2;
  height: 177px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.auth-back {
  width: 38px;
  height: 38px;
  margin-left: -15px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}
.auth-back img {
  width: 38px;
  height: 38px;
  display: block;
  object-fit: contain;
}
.auth-welcome {
  position: absolute;
  top: 42px;
  left: 50%;
  margin: 0;
  transform: translateX(-50%);
  color: #969eae;
  font-size: 18px;
  line-height: 1.3;
  white-space: nowrap;
}
.auth-top > .auth-logo {
  position: absolute;
  left: 50%;
  top: 89px;
  width: min(65.4vw, 245px);
  height: auto;
  transform: translateX(-50%);
  object-fit: contain;
}
.auth-language {
  position: relative;
  z-index: 4;
  margin-right: -16px;
}
.language-button {
  width: 85px;
  height: 34px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid #202946;
  border-radius: 9px;
  background: rgba(7, 13, 29, 0.74);
  color: #cdd2df;
  font-size: 14px;
  cursor: pointer;
}
.language-globe {
  position: relative;
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  border: 2px solid #3185ff;
  border-radius: 50%;
}
.language-globe::before,
.language-globe::after {
  content: "";
  position: absolute;
  inset: 2px 5px;
  border: 1px solid #3185ff;
  border-block: 0;
  border-radius: 50%;
}
.language-globe::after {
  inset: 7px 1px auto;
  height: 0;
  border: 0;
  border-top: 1px solid #3185ff;
  border-radius: 0;
}
.language-chevron {
  width: 7px;
  height: 7px;
  margin-top: -4px;
  border-right: 2px solid #aeb5c6;
  border-bottom: 2px solid #aeb5c6;
  transform: rotate(45deg);
}
.language-menu {
  position: absolute;
  top: 43px;
  right: 0;
  width: 109px;
  max-height: min(324px, calc(100vh - 80px));
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  border: 1px solid #29345e;
  border-radius: 9px;
  background: #13192b;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.4);
}
.language-menu::-webkit-scrollbar {
  display: none;
}
.language-menu button {
  width: 100%;
  height: 36px;
  padding: 0 10px 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 0;
  border-bottom: 1px solid #2a355d;
  background: transparent;
  color: #c8ccda;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}
.language-menu button:last-child {
  border-bottom: 0;
}
.language-menu button.active {
  background: #2a3041;
  color: #fff;
}
.language-menu b {
  color: inherit;
  font-weight: 500;
}
.auth-form {
  max-width: 760px;
  margin: 0 auto;
}
.auth-kicker {
  margin: 0;
  color: #fff;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.05;
  text-align: center;
  text-transform: capitalize;
}
.auth-form h1 {
  display: none;
}
.auth-form h1 span,
.auth-form h1 em {
  display: block;
}
.auth-form h1 em {
  color: #ed9b87;
  font-style: normal;
}
.auth-hint {
  margin: 10px 0 29px;
  color: #929aae;
  font-size: 14px;
  line-height: 1.25;
  text-align: center;
}
.auth-hint em {
  color: #347dff;
  font-style: normal;
}
.auth-form > label {
  position: relative;
  display: block;
  margin-top: 15px;
}
.auth-form > .username-field {
  margin-top: 0;
}
.auth-form > label > span {
  display: block;
  margin-bottom: 11px;
  color: #f4f5fa;
  font-size: 15px;
  font-weight: 400;
  line-height: 19px;
}
.required > span::after {
  content: "*";
  color: #9ba4ba;
}
.auth-form > label input {
  width: 100%;
  height: 55px;
  padding: 0 18px 0 57px;
  border: 1px solid #343b4d;
  border-radius: 6px;
  background-color: #111522;
  color: #fff;
  font-size: 16px;
  outline: 0;
}
.auth-form > label input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.28);
}
.username-field::after,
.password-field::after {
  content: "";
  position: absolute;
  left: 15px;
  bottom: calc((55px - var(--auth-field-icon-size)) / 2);
  z-index: 1;
  width: var(--auth-field-icon-size);
  height: var(--auth-field-icon-size);
  background: var(--auth-field-icon) center / contain no-repeat;
  pointer-events: none;
}
.username-field {
  --auth-field-icon: url("@/static/brain/user.png");
  --auth-field-icon-size: 29px;
}
.password-field {
  --auth-field-icon: url("@/static/brain/lock.png");
  --auth-field-icon-size: 24px;
}
.auth-options {
  min-height: 20px;
  margin: 18px 0 29px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #8290ad;
  font-size: 12px;
}
.auth-options button {
  padding: 0;
  border: 0;
  background: none;
  color: #3977e9;
}
.auth-options label {
  display: flex;
  align-items: center;
  gap: 9px;
}
.auth-options input {
  width: 20px;
  height: 20px;
  margin: 0;
  accent-color: #0b78ff;
}
.auth-submit {
  width: 100%;
  height: 50px;
  border: 1px solid transparent;
  border-radius: 10px;
  background:
    linear-gradient(
        90deg,
        #0197fe 0%,
        #2c3dbe 64.04%,
        #301ca2 100%
      )
      padding-box,
    linear-gradient(
        274deg,
        rgba(137, 84, 237, 0.94) 0%,
        rgba(78, 241, 255, 0.94) 100%
      )
      border-box;
  color: #fff;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
}
.auth-submit:disabled {
  opacity: 0.42;
  cursor: not-allowed;
}
.auth-link {
  margin: 25px 0 0;
  text-align: center;
  color: #929aad;
  font-size: 13px;
  line-height: 18px;
}
.auth-support {
  margin-top: 12px;
}
.auth-link button {
  padding: 0;
  border: 0;
  background: none;
  color: #3f79e3;
  text-decoration: none;
  font-weight: 500;
}
.auth-copyright {
  display: none;
}
.status-dialog {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 1082 / 759;
  min-height: 0;
  padding: 5.2% 5% 4%;
  overflow: hidden;
  text-align: center;
  color: #fff;
  background: #03163b url("@/static/brain/auth-status-background.png") center /
    contain no-repeat;
}
.status-dialog::after {
  content: none;
}
.status-dialog > * {
  position: relative;
  z-index: 1;
}
.status-dialog__icon {
  width: 20%;
  height: auto;
  aspect-ratio: 1;
  margin: 0 auto;
  display: grid;
  place-items: center;
  border: 2px solid #1984ff;
  border-radius: 50%;
  color: #fff;
  font-size: 36px;
  font-weight: 400;
  line-height: 1;
  visibility: hidden;
  box-shadow:
    0 0 13px rgba(0, 132, 255, 0.95),
    inset 0 0 12px rgba(0, 132, 255, 0.4);
}

.status-dialog h2 {
  margin: 11px 0 6px;
  padding: 0 4px;
  font-size: clamp(20px, 6vw, 27px);
  line-height: 1.12;
  overflow-wrap: anywhere;
}
.status-dialog p {
  margin: 0;
  color: #a2acc0;
  font-size: 13px;
  line-height: 18px;
}
.status-dialog button {
  min-width: 134px;
  height: 32px;
  margin-top: 15px;
  border: 1px solid #ffd066;
  border-radius: 7px;
  background: linear-gradient(105deg, #ffb20b, #ff7900);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}
:global(.das-login-status-dialog.van-dialog) {
  top: 44% !important;
  left: 50% !important;
  z-index: 3001 !important;
  width: min(72vw, 540px) !important;
  height: auto !important;
  max-width: calc(100vw - 40px);
  aspect-ratio: 1082 / 759;
  margin: 0 !important;
  overflow: hidden;
  border: 0;
  border-radius: 14px !important;
  background: transparent;
  box-shadow: none;
  transform: translate3d(-50%, -50%, 0) !important;
}
:global(.das-auth-overlay.van-overlay) {
  position: fixed !important;
  inset: 0 !important;
  z-index: 3000 !important;
  background: rgba(0, 4, 15, 0.72);
}

@media (min-width: 760px) {
  .auth-screen {
    padding-inline: 76px;
  }
  .auth-top {
    height: 220px;
  }
  .auth-welcome {
    top: 48px;
    font-size: 24px;
  }
  .auth-top > .auth-logo {
    top: 92px;
    width: 360px;
  }
  .auth-kicker {
    font-size: 42px;
  }
  .language-button {
    width: 118px;
    height: 44px;
    font-size: 17px;
  }
  .language-menu {
    top: 52px;
    width: 165px;
    max-height: min(486px, calc(100vh - 96px));
  }
  .language-menu button {
    height: 54px;
    font-size: 16px;
  }
}
</style>
