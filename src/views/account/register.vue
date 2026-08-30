<template>
  <main class="register-screen das-page">
    <header class="register-top">
      <button
        class="register-back"
        type="button"
        :aria-label="$t('das.common.back')"
        @click="safeReplace(router, '/account/welcome')"
      >
        <img src="@/static/brain/back.png" alt="" />
      </button>
      <img
        class="register-logo"
        src="@/static/brain/logo.png"
        alt="Brain Power"
      />
    </header>
    <form
      class="register-form"
      novalidate
      @invalid.capture.prevent
      @submit.prevent="submit"
    >
      <p class="register-kicker">{{ $t("das.auth.signUp") }}</p>
      <h1>
        {{ $t("das.auth.requestLead") }}
        <em>{{ $t("das.auth.requestAccent") }}</em>
      </h1>
      <p class="register-hint">{{ $t("das.auth.registerHint") }}</p>
      <div class="register-fields">
        <label class="register-input register-input--username required"
          ><span>{{ $t("das.auth.username") }}</span>
          <div class="register-control">
            <User class="register-control__icon" aria-hidden="true" />
            <input
              v-model.trim="form.username"
              aria-required="true"
              autocomplete="username"
              :placeholder="$t('das.auth.username')"
            />
          </div>
        </label>

        <div class="register-field required">
          <span>{{ $t("das.auth.phone") }}</span>
          <div ref="phoneFieldRef" class="phone-field">
            <button
              class="phone-country-button"
              type="button"
              :aria-label="$t('das.auth.phoneCountry')"
              aria-haspopup="listbox"
              :aria-expanded="phonePickerOpen"
              @click.stop="phonePickerOpen = !phonePickerOpen"
            >
              <img
                :src="selectedCountry.flag"
                class="phone-country-flag"
                :alt="selectedCountry.name"
              />
              <span class="phone-country-chevron" aria-hidden="true">⌄</span>
            </button>
            <div class="phone-number-control">
              <span class="phone-country-code"
                >+{{ selectedCountry.dial }}</span
              >
              <input
                v-model="localPhone"
                aria-required="true"
                inputmode="tel"
                :maxlength="selectedPhoneRule.pattern.length"
                autocomplete="tel-national"
                :placeholder="phonePlaceholder"
                @input="sanitizePhone"
              />
            </div>
            <div
              v-if="phonePickerOpen"
              class="phone-country-menu"
              role="listbox"
              :aria-label="$t('das.auth.phoneCountry')"
            >
              <button
                v-for="country in allCountryList"
                :key="`${country.name}-${country.dial}`"
                type="button"
                role="option"
                :aria-selected="country.name === selectedCountry.name"
                :class="{
                  'is-selected': country.name === selectedCountry.name,
                }"
                @click="selectCountry(country)"
              >
                <img
                  :src="country.flag"
                  class="phone-country-flag"
                  :alt="country.name"
                />
                <span>{{ country.name }}</span>
                <strong>+{{ country.dial }}</strong>
              </button>
            </div>
          </div>
        </div>

        <!-- <label class="required"
          ><span>{{ $t("das.auth.birthday") }}</span
          ><input
            v-model="birthday"
            aria-required="true"
            inputmode="numeric"
            maxlength="10"
            :placeholder="$t('das.auth.birthdayPlaceholder')"
            @input="sanitizeBirthday"
        /></label> -->

        <label class="register-input register-input--email"
          ><span>{{ $t("das.auth.email") }}</span>
          <div class="register-control">
            <Message class="register-control__icon" aria-hidden="true" />
            <input
              v-model.trim="form.email"
              type="text"
              inputmode="email"
              autocomplete="email"
              :placeholder="$t('das.auth.optional')"
            />
          </div>
        </label>

        <div class="register-field gender-group required">
          <span class="gender-field__title">{{ $t("das.auth.gender") }}</span>
          <div class="gender-field">
            <Male class="register-control__icon" aria-hidden="true" />
            <div class="gender-field__options">
              <label>
                <input
                  v-model="form.gender"
                  type="radio"
                  value="0"
                  aria-required="true"
                />
                <span>{{ $t("das.auth.male") }}</span>
              </label>
              <label>
                <input
                  v-model="form.gender"
                  type="radio"
                  value="1"
                  aria-required="true"
                />
                <span>{{ $t("das.auth.female") }}</span>
              </label>
            </div>
          </div>
        </div>

        <label class="register-input register-input--password required"
          ><span>{{ $t("das.auth.password") }}</span>
          <div class="register-control register-control--password">
            <Lock class="register-control__icon" aria-hidden="true" />
            <input
              v-model="form.password"
              aria-required="true"
              type="password"
              autocomplete="new-password"
              placeholder="••••••••"
            />
            <Hide
              class="register-control__end-icon"
              aria-hidden="true"
            /></div></label
        ><label class="register-input register-input--password required"
          ><span>{{ $t("das.auth.confirmPassword") }}</span>
          <div class="register-control register-control--password">
            <Lock class="register-control__icon" aria-hidden="true" />
            <input
              v-model="confirmPassword"
              aria-required="true"
              type="password"
              autocomplete="new-password"
              placeholder="••••••••"
            />
            <Hide
              class="register-control__end-icon"
              aria-hidden="true"
            /></div></label
        ><label class="register-input register-input--password required"
          ><span>{{ $t("das.auth.tradePassword") }}</span>
          <div class="register-control register-control--password">
            <Key class="register-control__icon" aria-hidden="true" />
            <input
              v-model="form.tradePassword"
              aria-required="true"
              type="password"
              inputmode="numeric"
              autocomplete="new-password"
              placeholder="••••••••"
            />
            <Hide
              class="register-control__end-icon"
              aria-hidden="true"
            /></div></label
        ><label class="register-input register-input--invite required"
          ><span>{{ $t("das.auth.inviteCode") }}</span>
          <div class="register-control">
            <Present class="register-control__icon" aria-hidden="true" />
            <input
              v-model.trim="form.inviteCode"
              aria-required="true"
              :placeholder="$t('das.auth.inviteCode')"
            />
          </div>
        </label>
      </div>
      <label class="register-agree"
        ><input v-model="agreed" type="checkbox" /><span
          >{{ $t("das.auth.agree") }}
          <button type="button" @click="openTerms">
            {{ $t("das.auth.terms") }}
          </button></span
        ></label
      ><button class="register-submit" type="submit" :disabled="submitting">
        {{ $t("das.common.submit") }}
      </button>
      <p class="register-switch">
        {{ $t("das.auth.haveAccount") }}
        <button type="button" @click="safeReplace(router, '/account/login')">
          {{ $t("das.auth.loginNow") }}
        </button>
      </p>
      <p class="register-legal">
        {{ $t("das.auth.signupAgreementPrefix") }}
        <button type="button" @click="openTerms">
          {{ $t("das.auth.terms") }}
        </button>
      </p>
      <p class="register-copyright">{{ $t("das.common.copyright") }}</p>
    </form>
    <van-dialog
      v-model:show="showSuccess"
      class="register-status-dialog"
      overlay-class="register-status-overlay"
      teleport="body"
      :show-confirm-button="false"
      ><div class="status-dialog">
        <span class="status-dialog__icon" aria-hidden="true">✓</span>
        <h2>{{ $t("das.auth.registerSuccess") }}</h2>
        <p>{{ $t("das.auth.registerSuccessHint") }}</p>
        <button @click="safeReplace(router, '/account/login')">
          {{ $t("das.auth.continue") }}
        </button>
      </div></van-dialog
    >
  </main>
</template>
<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
import {
  Hide,
  Key,
  Lock,
  Male,
  Message,
  Present,
  User,
} from "@element-plus/icons-vue";
import { register } from "@/api/apis";
import { useRegistrationDraft } from "@/composables/useRegistrationDraft";
import {
  PHONE_COUNTRIES,
  formatPhoneNumber,
  getPhoneCountry,
  getPhoneRule,
  isValidPhone,
  localPhoneDigits,
} from "@/config/phone";
import { safePush, safeReplace } from "@/utils/navigation";

const router = useRouter(),
  { t } = useI18n(),
  phonePickerOpen = ref(false),
  phoneFieldRef = ref(),
  localPhone = ref(""),
  birthday = ref(""),
  confirmPassword = ref(""),
  agreed = ref(false),
  submitting = ref(false),
  showSuccess = ref(false),
  form = reactive({
    username: "",
    password: "",
    tradePassword: "",
    gender: "",
    inviteCode: "",
    email: "",
  });

const { saveDraft, takeDraft, clearDraft } = useRegistrationDraft();

const selectedCountry = ref(getPhoneCountry(window.g?.DEFAULT_PHONE_COUNTRY));
const allCountryList = PHONE_COUNTRIES;

const draft = takeDraft();
if (draft) {
  Object.assign(form, draft.form);
  selectedCountry.value = getPhoneCountry(draft.selectedCountry?.id);
  localPhone.value = draft.localPhone;
  birthday.value = draft.birthday;
  confirmPassword.value = draft.confirmPassword;
  agreed.value = draft.agreed;
}

const openTerms = async () => {
  saveDraft({
    form: { ...form },
    selectedCountry: { ...selectedCountry.value },
    localPhone: localPhone.value,
    birthday: birthday.value,
    confirmPassword: confirmPassword.value,
    agreed: agreed.value,
  });
  try {
    await safePush(router, "/tc");
  } catch (error) {
    clearDraft();
    throw error;
  }
};

const selectedPhoneRule = computed(() => getPhoneRule(selectedCountry.value));
const phonePlaceholder = computed(() =>
  selectedPhoneRule.value.pattern.replace(/#/g, "_"),
);

const selectCountry = (country) => {
  const phone = localPhoneDigits(localPhone.value);
  selectedCountry.value = country;
  localPhone.value = formatPhoneNumber(phone, selectedPhoneRule.value);
  phonePickerOpen.value = false;
};

const closePhonePickerOnOutside = (event) => {
  if (phoneFieldRef.value && !phoneFieldRef.value.contains(event.target)) {
    phonePickerOpen.value = false;
  }
};

onMounted(() =>
  document.addEventListener("pointerdown", closePhonePickerOnOutside),
);
onBeforeUnmount(() =>
  document.removeEventListener("pointerdown", closePhonePickerOnOutside),
);

const sanitizePhone = (event) => {
  const value = formatPhoneNumber(event.target.value, selectedPhoneRule.value);
  localPhone.value = value;
  event.target.value = value;
};
const sanitizeBirthday = (e) =>
  (birthday.value = e.target.value.replace(/[^0-9/\s-]/g, ""));
const isValidBirthday = (value) => {
  const m = value.match(/^\s*(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})\s*$/);
  if (!m) return false;
  const month = +m[1],
    day = +m[2],
    year = +m[3],
    date = new Date(year, month - 1, day);
  return (
    year >= 1900 &&
    date <= new Date() &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};
const emailReg = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const submit = async () => {
  const phone = localPhoneDigits(localPhone.value);
  if (!isValidPhone(phone, selectedCountry.value.dial, selectedPhoneRule.value))
    return showToast(t("das.auth.invalidPhone"));
  if (
    !form.username ||
    form.gender === "" ||
    !form.password ||
    !confirmPassword.value ||
    !form.tradePassword
  )
    return showToast(t("das.auth.required"));
  if (form.email && !emailReg.test(form.email))
    return showToast(t("das.auth.invalidEmail"));
  if (!form.inviteCode) return showToast(t("das.auth.inviteRequired"));
  if (birthday.value && !isValidBirthday(birthday.value))
    return showToast(t("das.auth.invalidBirthday"));
  if (form.password !== confirmPassword.value)
    return showToast(t("das.auth.passwordMismatch"));
  if (!agreed.value) return showToast(t("das.auth.agreeRequired"));
  submitting.value = true;
  try {
    await register({
      ...form,
      phoneNumber: `+${selectedCountry.value.dial}${phone}`,
    });
    clearDraft();
    showSuccess.value = true;
  } finally {
    submitting.value = false;
  }
};
</script>
<style scoped>
.register-screen {
  min-height: 100dvh;
  padding: 23px clamp(23px, 6.2vw, 60px) 34px;
  background: #05091d url("@/static/brain/auth-register-background.png") center
    top / 100% 100% no-repeat;
  color: #fff;
}
.register-top {
  height: 40px;
  display: flex;
  align-items: center;
}
.register-back {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}
.register-back img {
  width: 40px;
  height: 40px;
  display: block;
  object-fit: contain;
}
.register-top > .register-logo {
  display: none;
}
.register-form {
  max-width: 760px;
  margin: 0 auto;
}
.register-kicker {
  margin: 0;
  color: #fff;
  font-size: clamp(28px, 7.467vw, 38px);
  font-weight: 800;
  line-height: 1.08;
  text-align: center;
}
.register-form h1 {
  margin: 4px 0 0;
  color: #cfd5e1;
  font-size: clamp(20px, 5.333vw, 30px);
  font-weight: 800;
  line-height: 1.15;
  text-align: center;
}
.register-form h1 em {
  color: #5799f5;
  font-style: normal;
}
.register-hint {
  margin: 8px 0 22px;
  color: #99a2b5;
  font-size: clamp(12px, 3.2vw, 15px);
  line-height: 1.4;
  text-align: center;
}
.register-fields {
  display: grid;
  gap: clamp(14px, 3.733vw, 18px);
}
.register-fields > label > span,
.register-field > span {
  display: block;
  margin-bottom: 8px;
  color: #d2d6e0;
  font-size: clamp(13px, 3.467vw, 16px);
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: 0;
  text-transform: none;
}
.required > span::after,
.gender-group.required .gender-field__title::after {
  content: " *";
  color: #7d879c;
}
.register-control {
  width: 100%;
  height: clamp(44px, 11.733vw, 54px);
  padding: 0 clamp(14px, 3.733vw, 20px);
  display: flex;
  align-items: center;
  gap: clamp(12px, 3.2vw, 18px);
  border: 1px solid #333846;
  border-radius: 7px;
  background: #121620;
  color: #a4adbf;
}
.register-control:focus-within,
.phone-field:focus-within,
.gender-field:focus-within {
  border-color: rgba(78, 142, 247, 0.72);
  box-shadow: 0 0 0 1px rgba(43, 115, 240, 0.18);
}
.register-control input {
  min-width: 0;
  height: 100%;
  flex: 1 1 auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: clamp(14px, 3.733vw, 18px);
}
.register-control__icon,
.register-control__end-icon {
  width: clamp(21px, 5.6vw, 27px);
  height: clamp(21px, 5.6vw, 27px);
  flex: 0 0 auto;
  color: #a7afbf;
}
.register-control__end-icon {
  width: clamp(20px, 5.333vw, 25px);
  height: clamp(20px, 5.333vw, 25px);
  color: #747d90;
}
.register-fields input::placeholder {
  color: #737b8f;
  opacity: 1;
}
.phone-field {
  position: relative;
  height: clamp(44px, 11.733vw, 54px);
  display: grid;
  grid-template-columns: clamp(60px, 16vw, 76px) 1fr;
  border: 1px solid #333846;
  border-radius: 7px;
  background: #121620;
}
.phone-country-button {
  min-width: 0;
  height: 100%;
  padding: 0 7px 0 clamp(13px, 3.467vw, 18px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 0;
  background: transparent;
  color: #f7f5ec;
}
.phone-country-code {
  color: #a6aebe;
  font-size: clamp(14px, 3.733vw, 18px);
  font-weight: 400;
  white-space: nowrap;
}
.phone-country-flag {
  width: 24px;
  height: 16px;
  flex: 0 0 auto;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(247, 245, 236, 0.12);
}
.phone-country-chevron {
  color: rgba(247, 245, 236, 0.7);
  font-size: 13px;
  transform: translateY(-1px);
}
.phone-number-control {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.phone-number-control > input {
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0 18px 0 0;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: clamp(14px, 3.733vw, 18px);
}
.phone-country-menu {
  position: absolute;
  z-index: 20;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: 230px;
  overflow-y: auto;
  padding: 7px;
  border: 1px solid #343b50;
  border-radius: 10px;
  background: #111726;
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.5);
}
.phone-country-menu button {
  width: 100%;
  min-height: 42px;
  padding: 8px 11px;
  display: grid;
  grid-template-columns: 28px 1fr auto;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: rgba(247, 245, 236, 0.82);
  text-align: left;
  font-size: 13px;
}
.phone-country-menu button strong {
  color: #f7f5ec;
  font-weight: 700;
}
.phone-country-menu button.is-selected,
.phone-country-menu button:hover {
  background: rgba(247, 245, 236, 0.09);
}
.gender-group > span {
  display: block;
}
.gender-field {
  min-height: clamp(44px, 11.733vw, 54px);
  padding: 0 clamp(14px, 3.733vw, 20px);
  display: flex;
  align-items: center;
  gap: clamp(12px, 3.2vw, 18px);
  border: 1px solid #333846;
  border-radius: 7px;
  background: #121620;
}
.gender-field__options {
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
}
.gender-field__options label {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #d6dae3;
  font-size: clamp(13px, 3.467vw, 16px);
}
.gender-field__options label > span {
  margin: 0;
  color: inherit;
  font-size: inherit;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
}
.gender-field__options input {
  width: 17px;
  height: 17px;
  margin: 0;
  accent-color: #188bff;
}
.register-agree {
  margin: 20px 0 17px;
  display: flex;
  align-items: center;
  gap: 11px;
  color: #9aa3b7;
  font-size: clamp(11px, 2.933vw, 13px);
  line-height: 1.4;
}
.register-agree > input {
  width: 17px;
  height: 17px;
  margin: 0;
  flex: 0 0 auto;
  accent-color: #168cff;
}
.register-agree button,
.register-switch button,
.register-legal button {
  padding: 0;
  border: 0;
  background: none;
  color: #3879e6;
  text-decoration: none;
  font-weight: 700;
}
.register-submit {
  width: 100%;
  height: clamp(51px, 13.6vw, 62px);
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
  font-size: clamp(17px, 4.533vw, 21px);
  font-weight: 700;
  box-shadow: inset 0 1px 0 rgba(65, 230, 255, 0.55);
}
.register-submit::after {
  content: "  →";
  font-size: 1.15em;
  font-weight: 400;
}
.register-submit:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}
.register-switch,
.register-legal,
.register-copyright {
  text-align: center;
  color: #929bb0;
  font-size: clamp(11px, 2.933vw, 13px);
  line-height: 1.45;
}
.register-switch {
  margin: 18px 0 0;
}
.register-legal {
  margin: 14px 0 0;
}
.register-copyright {
  margin: 42px 0 0;
  font-size: clamp(10px, 2.667vw, 12px);
}
.status-dialog {
  min-height: clamp(188px, 50.133vw, 320px);
  padding: clamp(19px, 5.067vw, 32px) clamp(18px, 4.8vw, 34px)
    clamp(17px, 4.533vw, 29px);
  text-align: center;
  color: #fff;
  background:
    radial-gradient(circle at 50% 0, rgba(22, 117, 255, 0.43), transparent 38%),
    url("@/static/brain/auth-background.png") center bottom / 165% auto
      no-repeat,
    linear-gradient(180deg, #061e4d 0%, #03183d 100%);
}
.status-dialog__icon {
  width: clamp(48px, 12.8vw, 76px);
  height: clamp(48px, 12.8vw, 76px);
  margin: auto;
  display: grid;
  place-items: center;
  border: 2px solid #1f8fff;
  border-radius: 50%;
  background: radial-gradient(circle, #1556c1 0%, #061e4b 66%);
  box-shadow:
    0 0 0 9px rgba(16, 100, 224, 0.12),
    0 0 24px rgba(0, 136, 255, 0.9),
    inset 0 0 14px rgba(0, 168, 255, 0.38);
  font-size: clamp(30px, 8vw, 46px);
  font-weight: 700;
  line-height: 1;
}
.status-dialog__icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.status-dialog h2 {
  margin: clamp(17px, 4.533vw, 26px) 0 8px;
  font-size: clamp(23px, 6.133vw, 36px);
  line-height: 1.15;
}
.status-dialog p {
  margin: 0;
  color: #a2acc0;
  font-size: clamp(12px, 3.2vw, 18px);
  line-height: 1.45;
}
.status-dialog button {
  width: min(78%, 360px);
  height: clamp(36px, 9.6vw, 54px);
  margin-top: clamp(18px, 4.8vw, 27px);
  border: 1px solid #ffd159;
  border-radius: 8px;
  background: linear-gradient(110deg, #ffae0a 0%, #ff7a00 100%);
  color: white;
  font-size: clamp(14px, 3.733vw, 20px);
  font-weight: 800;
  box-shadow: 0 0 14px rgba(255, 151, 0, 0.34);
}
:global(.register-status-overlay.van-overlay) {
  position: fixed !important;
  z-index: 3000 !important;
  inset: 0 !important;
  background: rgba(0, 0, 0, 0.78) !important;
}
:global(.register-status-dialog.van-dialog) {
  position: fixed !important;
  z-index: 3001 !important;
  top: 44% !important;
  left: 50% !important;
  width: min(72vw, 536px);
  max-width: calc(100vw - 40px);
  margin: 0 !important;
  overflow: hidden;
  transform: translate3d(-50%, -50%, 0) !important;
  border: 1px solid #278fff;
  border-radius: 13px !important;
  background: #07152e;
  box-shadow:
    0 0 28px rgba(0, 113, 255, 0.74),
    inset 0 0 22px rgba(0, 119, 255, 0.16);
}
@media (max-width: 420px) {
  .gender-field {
    padding-inline: 16px;
  }
  .gender-field__options {
    gap: 12px;
  }
  .gender-field__options label {
    gap: 5px;
    font-size: 13px;
  }
}
@media (min-width: 760px) {
  .register-form {
    padding-bottom: 18px;
  }
  .register-copyright {
    margin-top: 54px;
  }
}
</style>
