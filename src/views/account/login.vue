<template>
  <div class="dmk-pc-only w-full min-h-[100vh] bg-black dmk-site-scope">
    <div class="w-full min-h-[100vh] text-white dmk-login-scope">
      <div class="block">
        <div class="max-w-[1200px] mx-auto">
          <DmkPcHeader :authenticated="false" />
          <form
            class="w-full my-[10vh] flex justify-between items-center relative"
            novalidate
            @invalid.capture.prevent
            @submit.prevent="submit"
          >
            <div class="mr-36 w-[500px]">
              <div class="text-3xl">
                {{ $t("das.dmk.readyToStart") }}
              </div>
              <div class="text-5xl mt-2">
                {{ $t("das.dmk.loginAccessCopy") }}
              </div>
              <p class="nsg-login-description">{{ $t("das.auth.signInHint") }}</p>
            </div>
            <div class="login-input flex flex-1">
              <div class="box">
                <div
                  class="text-white text-lg text-center py-3 mt-4"
                >
                  {{ $t("das.dmk.enterLoginInformation") }}
                </div>
                <div class="mt-4 w-[90%] mx-auto">
                  <div class="van-cell van-field">
                    <div class="van-cell__value van-field__value">
                      <div class="van-field__body">
                        <input
                          v-model.trim="form.username"
                          autocomplete="username"
                          class="van-field__control"
                          :placeholder="$t('das.auth.usernamePhone')"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-6 w-[90%] mx-auto">
                  <div class="van-cell van-field">
                    <div class="van-cell__value van-field__value">
                      <div class="van-field__body">
                        <input
                          v-model="form.password"
                          autocomplete="current-password"
                          class="van-field__control"
                          :placeholder="$t('das.auth.password')"
                          :type="passwordVisible ? 'text' : 'password'"
                        />
                        <div
                          class="van-field__button cursor-pointer"
                          role="button"
                          tabindex="0"
                          :aria-label="$t('das.form.togglePassword')"
                          @click="passwordVisible = !passwordVisible"
                          @keydown.enter="passwordVisible = !passwordVisible"
                        >
                          <img
                            :src="
                              passwordVisible
                                ? '/dmk/assets/eye.png'
                                : '/dmk/assets/eye-off.png'
                            "
                            class="w-6"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="mt-4 px-4 text-right text-white text-base cursor-pointer"
                  @click="customer"
                >
                  {{ $t("das.dmk.forgotPassword") }}
                </div>
                <div class="mt-6 px-4">
                  <button
                    class="van-button van-button--default van-button--large van-button--block"
                    style="
                      color: white;
                      background: var(--main-color);
                      border-color: var(--main-color);
                    "
                    type="submit"
                    :disabled="submitting"
                  >
                    <div class="van-button__content">
                      <span class="van-button__text"
                        ><span
                          class="text-black font-semibold text-base"
                          >{{ $t("das.dmk.login") }}</span
                        ></span
                      >
                    </div>
                  </button>
                </div>
                <div
                  class="mt-20 text-center cursor-pointer"
                  @click="safeReplace(router, '/account/register')"
                >
                  {{ $t("das.dmk.noAccount") }}<span
                    class="text-[var(--main-color)] ml-2"
                    >{{ $t("das.dmk.signUp") }}</span
                  >
                </div>
              </div>
              <DmkSupport ref="pcSupport" inline class="nsg-login-support--pc" />
            </div>
          </form>
        </div>
        <DmkFooter />
      </div>
      <van-dialog
        v-model:show="showError"
        class="dmk-login-error-dialog"
        :show-confirm-button="false"
      >
        <NsgLoginError :message="errorMessage" @retry="showError = false" />
      </van-dialog>
    </div>
  </div>
  <div
    class="dmk-h5-only dmk-mobile-current w-full relative bg-black text-white min-h-[100vh] dmk-login-scope"
  >
    <DmkH5Header :authenticated="false">
      <template #actions>
        <img
          class="nsg-auth-language w-6 cursor-pointer"
          src="/dmk/assets/language.png"
          alt=""
          @click="safePush(router, '/setting/language')"
        />
      </template>
    </DmkH5Header>
    <form
      novalidate
      @invalid.capture.prevent
      @submit.prevent="submit"
    >
      <div class="w-full h-[30vh] overflow-hidden">
        <NsgBackButton
          class="nsg-auth-back"
          type="button"
          :aria-label="$t('das.common.back')"
          @click="safeBack(router, '/account/welcome')"
         />
        <div class="w-[92%] mx-auto p-4">
          <div class="text-4xl text-center">
            <p>{{ $t("das.dmk.readyToStart") }}</p>
            <p>{{ $t("das.dmk.loginAccessCopy") }}</p>
          </div>
          <p class="nsg-login-description">{{ $t("das.auth.signInHint") }}</p>
        </div>
      </div>
      <div class="login-input">
        <div class="box">
          <div
            class="text-white text-lg text-center py-3 mt-4"
          >
            {{ $t("das.dmk.enterLoginInformation") }}
          </div>
          <div class="mt-4 w-[90%] mx-auto nsg-login-username">
            <label class="nsg-login-field-label" for="nsg-h5-login-username">{{ $t("das.auth.usernamePhone") }}</label>
            <div class="van-cell van-field">
              <div class="van-cell__value van-field__value">
                <div class="van-field__body">
                  <input
                    v-model.trim="form.username"
                    id="nsg-h5-login-username"
                    autocomplete="username"
                    class="van-field__control"
                    :placeholder="$t('das.auth.usernamePhone')"
                    type="text"
                  />
                </div>
              </div>
            </div>
            <DmkSupport inline class="nsg-login-support--h5" />
          </div>
          <div class="mt-6 w-[90%] mx-auto">
            <label class="nsg-login-field-label" for="nsg-h5-login-password">{{ $t("das.auth.password") }}</label>
            <div class="van-cell van-field">
              <div class="van-cell__value van-field__value">
                <div class="van-field__body">
                  <input
                    v-model="form.password"
                    id="nsg-h5-login-password"
                    autocomplete="current-password"
                    class="van-field__control"
                    :placeholder="$t('das.auth.password')"
                    :type="passwordVisible ? 'text' : 'password'"
                  />
                  <div
                    class="van-field__button cursor-pointer"
                    role="button"
                    tabindex="0"
                    :aria-label="$t('das.form.togglePassword')"
                    @click="passwordVisible = !passwordVisible"
                    @keydown.enter="passwordVisible = !passwordVisible"
                  >
                    <img
                      :src="
                        passwordVisible
                          ? '/dmk/assets/eye.png'
                          : '/dmk/assets/eye-off.png'
                      "
                      class="w-6"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="mt-4 px-4 text-right text-white text-base cursor-pointer"
            @click="customer"
          >
            {{ $t("das.dmk.forgotPassword") }}
          </div>
          <div class="mt-6 px-4">
            <button
              class="van-button van-button--default van-button--large van-button--block"
              style="
                color: white;
                background: var(--main-color);
                border-color: var(--main-color);
              "
              type="submit"
              :disabled="submitting"
            >
              <div class="van-button__content">
                <span class="van-button__text"
                  ><span
                    class="text-black font-semibold text-base"
                    >{{ $t("das.dmk.login") }}</span
                  ></span
                >
              </div>
            </button>
          </div>
          <div
            class="mt-20 text-center cursor-pointer"
            @click="safeReplace(router, '/account/register')"
          >
            {{ $t("das.dmk.noAccount") }}<span
              class="text-[var(--main-color)] ml-2"
              >{{ $t("das.dmk.signUp") }}</span
            >
          </div>
        </div>
      </div>
    </form>
    <van-dialog
      v-model:show="showError"
      class="dmk-login-error-dialog"
      :show-confirm-button="false"
    >
      <NsgLoginError :message="errorMessage" @retry="showError = false" />
    </van-dialog>
  </div>
</template>
<script setup>
import NsgBackButton from "@/components/dmk/NsgBackButton.vue";
import DmkPcHeader from "@/components/dmkPc/DmkPcHeader.vue";
import DmkH5Header from "@/components/dmkH5/DmkH5Header.vue";
import DmkFooter from "@/components/dmk/DmkFooter.vue";
import DmkSupport from "@/components/dmk/DmkSupport.vue";
import NsgLoginError from "@/components/dmk/NsgLoginError.vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCommonStore } from "@/store/modules/common";
import { useUserStore } from "@/store/modules/user";
import { login } from "@/api/apis";
import { safeBack, safePush, safeReplace } from "@/utils/navigation";
const router = useRouter(),
  { t } = useI18n(),
  commonStore = useCommonStore(),
  userStore = useUserStore();
const form = reactive({ username: "", password: "" }),
  remember = ref(true),
  submitting = ref(false),
  showError = ref(false),
  errorMessage = ref(""),
  passwordVisible = ref(false),
  pcSupport = ref();
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

const customer = () => pcSupport.value?.open();
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
</style>
