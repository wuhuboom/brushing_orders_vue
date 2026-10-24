<template>
  <main class="register-screen das-page fp-auth fp-auth--register">
    <header class="register-top fp-auth__top">
      <button
        class="psy-register-back"
        type="button"
        :aria-label="$t('das.common.back')"
        @click="safeReplace(router, '/account/login')"
      >
        <img src="/psybir/back.png" alt="" />
      </button>
      <h2>{{ $t("das.auth.signUp") }}</h2>
      <p class="reference-register-welcome">{{ $t("das.auth.welcome") }}</p>

      <img class="register-logo" src="/psybir/logo.png" alt="Psybir" />
    </header>
    <form
      class="register-form fp-auth__content fp-auth__form"
      novalidate
      @invalid.capture.prevent
      @submit.prevent="submit"
    >
      <p class="register-kicker fp-auth__title">{{ $t("das.auth.signUp") }}</p>
      <h1>
        {{ $t("das.auth.requestLead") }}
        <em>{{ $t("das.auth.requestAccent") }}</em>
      </h1>
      <p class="register-hint fp-auth__subtitle">
        {{ $t("das.auth.registerHint") }}
      </p>
      <div class="register-fields">
        <label class="register-input register-input--username required"
          ><span>{{ $t("das.auth.username") }}</span>
          <div class="register-control">
            <img
              class="register-control__icon"
              src="/psybir/auth-user.png"
              alt=""
            />
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
              <img
                class="phone-country-chevron"
                src="/psybir/chevron-down.png"
                alt=""
              />
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
            <img
              class="register-control__icon"
              src="/psybir/auth-email.png"
              alt=""
            />
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
            <img
              class="register-control__icon"
              src="/psybir/auth-gender.png"
              alt=""
            />
            <DasSelect
              v-model="form.gender"
              :options="[
                { value: '0', label: $t('das.auth.male') },
                { value: '1', label: $t('das.auth.female') },
              ]"
              :placeholder="$t('das.auth.select')"
              :aria-label="$t('das.auth.gender')"
            />
          </div>
        </div>

        <label class="register-input register-input--password required"
          ><span>{{ $t("das.auth.password") }}</span>
          <div class="register-control register-control--password">
            <img
              class="register-control__icon"
              src="/psybir/auth-lock.png"
              alt=""
            />
            <input
              v-model="form.password"
              aria-required="true"
              type="password"
              autocomplete="new-password"
              placeholder="••••••••"
            />
            <ReferenceEye class="register-control__end-icon" /></div></label
        ><label class="register-input register-input--password required"
          ><span>{{ $t("das.auth.confirmPassword") }}</span>
          <div class="register-control register-control--password">
            <img
              class="register-control__icon"
              src="/psybir/auth-lock.png"
              alt=""
            />
            <input
              v-model="confirmPassword"
              aria-required="true"
              type="password"
              autocomplete="new-password"
              placeholder="••••••••"
            />
            <ReferenceEye class="register-control__end-icon" /></div></label
        ><label class="register-input register-input--password required"
          ><span>{{ $t("das.auth.tradePassword") }}</span>
          <div class="register-control register-control--password">
            <img
              class="register-control__icon"
              src="/psybir/auth-shield.png"
              alt=""
            />
            <input
              v-model="form.tradePassword"
              aria-required="true"
              type="password"
              inputmode="numeric"
              autocomplete="new-password"
              placeholder="••••••••"
            />
            <ReferenceEye class="register-control__end-icon" /></div></label
        ><label class="register-input register-input--invite required"
          ><span>{{ $t("das.auth.inviteCode") }}</span>
          <div class="register-control">
            <img
              class="register-control__icon"
              src="/psybir/auth-gift.png"
              alt=""
            />
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
      ><button
        class="register-submit fp-auth__submit"
        type="submit"
        :disabled="submitting"
      >
        {{ $t("das.common.submit") }}
      </button>
      <p class="register-switch fp-auth__linkline">
        {{ $t("das.auth.haveAccount") }}
        <button type="button" @click="safeReplace(router, '/account/login')">
          {{ $t("das.auth.loginNow") }}
        </button>
      </p>
      <p class="register-legal fp-auth__linkline">
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
import ReferenceEye from "@/components/ReferenceEye.vue";
import DasSelect from "@/components/DasSelect.vue";
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
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
