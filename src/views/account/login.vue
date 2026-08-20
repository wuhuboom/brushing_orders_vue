<template>
  <main class="auth-screen das-page">
    <header class="auth-top">
      <img src="@/static/das/wordmark-cream.png" alt="DAS" />
      <button
        class="language-button"
        type="button"
        @click="safePush(router, '/setting/language')"
      >
        {{ language.toUpperCase() }}
      </button>
    </header>
    <form class="auth-form" novalidate @invalid.capture.prevent @submit.prevent="submit">
      <p class="auth-kicker">{{ $t("das.auth.signIn") }}</p>
      <h1>
        <span>{{ $t("das.auth.signInLead") }}</span
        ><em>{{ $t("das.auth.signInAccent") }}</em>
      </h1>
      <p class="auth-hint">{{ $t("das.auth.signInHint") }}</p>
      <label class="required"
        ><span>{{ $t("das.auth.username") }}</span
        ><input v-model.trim="form.username" aria-required="true" autocomplete="username"
      /></label>
      <label class="required"
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
      <button class="auth-submit" type="submit" :disabled="submitting">
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
      class="das-status-dialog"
      :show-confirm-button="false"
      ><div class="status-dialog">
        <span class="status-dialog__icon"><img src="@/static/das/icons/status-error.png" alt="" /></span>
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
import { useCommonStore } from "@/store/modules/common";
import { useUserStore } from "@/store/modules/user";
import { login } from "@/api/apis";
import { safePush, safeReplace } from "@/utils/navigation";
const router = useRouter(),
  { t } = useI18n(),
  commonStore = useCommonStore(),
  userStore = useUserStore();
const form = reactive({ username: "", password: "" }),
  remember = ref(true),
  submitting = ref(false),
  showError = ref(false),
  errorMessage = ref("");
const language = computed(() => commonStore.clientLang || "en");
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
  if (!form.username || !form.password) {
    errorMessage.value = t("das.auth.required");
    showError.value = true;
    return;
  }
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
  min-height: 100%;
  padding: 54px clamp(34px, 8vw, 76px) 38px;
  background: #0d241c;
  color: #f7f5ec;
}
.auth-top {
  height: 88px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.auth-top img {
  width: 45px;
  height: 70px;
  object-fit: contain;
}
.language-button {
  width: 42px;
  height: 42px;
  border: 1px solid rgba(247, 245, 236, 0.35);
  border-radius: 50%;
  background: transparent;
  color: inherit;
  font-size: 11px;
}
.auth-form {
  max-width: 760px;
  margin: 0 auto;
}
.auth-kicker {
  margin: 0 0 36px;
  color: rgba(247, 245, 236, 0.58);
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.18em;
}
.auth-form h1 {
  margin: 0;
  font-size: clamp(38px, 7vw, 64px);
  line-height: 1.05;
  letter-spacing: -0.045em;
  font-weight: 400;
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
  margin: 27px 0 53px;
  color: rgba(247, 245, 236, 0.58);
  font-size: 16px;
}
.auth-form > label {
  display: block;
  margin-top: 28px;
}
.auth-form > label > span {
  display: block;
  margin-bottom: 13px;
  color: rgba(247, 245, 236, 0.58);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.required > span::after {
  content: " *";
  color: #ed9b87;
}
.auth-form > label input {
  width: 100%;
  height: 61px;
  padding: 0 24px;
  border: 1px solid rgba(247, 245, 236, 0.28);
  border-radius: 999px;
  background: rgba(247, 245, 236, 0.07);
  color: #f7f5ec;
}
.auth-options {
  margin: 24px 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(247, 245, 236, 0.68);
  font-size: 13px;
}
.auth-options button {
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
}
.auth-options label {
  display: flex;
  align-items: center;
  gap: 9px;
}
.auth-options input {
  width: 24px;
  height: 24px;
  accent-color: #f7f5ec;
}
.auth-submit {
  width: 100%;
  height: 67px;
  border: 0;
  border-radius: 999px;
  background: #f7f5ec;
  color: #17382d;
  font-size: 18px;
  font-weight: 800;
}
.auth-link {
  margin: 28px 0 0;
  text-align: center;
  color: rgba(247, 245, 236, 0.55);
  font-size: 13px;
}
.auth-link button {
  padding: 0;
  border: 0;
  background: none;
  color: #f7f5ec;
  text-decoration: underline;
  font-weight: 800;
}
.auth-copyright {
  margin: 42px 0 0;
  text-align: center;
  color: rgba(247, 245, 236, 0.35);
  font-size: 10px;
}
.status-dialog {
  padding: 34px 28px 30px;
  text-align: center;
  color: #17382d;
}
.status-dialog__icon {
  width: 48px;
  height: 48px;
  margin: auto;
  display: grid;
  place-items: center;
  border: 3px solid #17382d;
  border-radius: 50%;
  font-size: 38px;
  font-weight: 300;
  line-height: 1;
}
.status-dialog__icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.status-dialog h2 {
  margin: 22px 0 10px;
  font-size: 23px;
}
.status-dialog p {
  margin: 0;
  color: #79817b;
  font-size: 13px;
  line-height: 1.45;
}
.status-dialog button {
  width: 100%;
  height: 50px;
  margin-top: 24px;
  border: 0;
  border-radius: 999px;
  background: #14392c;
  color: #fff;
  font-weight: 700;
}
:global(.das-status-dialog.van-dialog) {
  width: min(84%, 380px);
  border-radius: 24px;
  background: #f7f5ec;
}
</style>
