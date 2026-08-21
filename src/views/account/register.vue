<template>
  <div class="register-page">
  <PcPublicShell class="pc-register">
    <section class="pc-register__content">
      <h1>Nice To Meet You.</h1>
      <form class="pc-register__card" novalidate @submit.prevent="submit">
        <div class="pc-register__grid">
          <label><span>Username</span><input v-model.trim="form.username" autocomplete="username" /></label>
          <div class="pc-register__field">
            <span>Phone</span>
            <div ref="pcPhoneFieldRef" class="pc-register__phone">
              <button type="button" @click.stop="phonePickerOpen = !phonePickerOpen">
                <img :src="selectedCountry.flag" :alt="selectedCountry.name" />
                +{{ selectedCountry.dial }}⌄
              </button>
              <input
                v-model="localPhone"
                inputmode="tel"
                :maxlength="selectedPhoneRule.pattern.length"
                :placeholder="phonePlaceholder"
                @input="sanitizePhone"
              />
              <div v-if="phonePickerOpen" class="pc-register__country-menu">
                <button
                  v-for="country in allCountryList"
                  :key="`${country.name}-${country.dial}`"
                  type="button"
                  @click="selectCountry(country)"
                >
                  <img :src="country.flag" :alt="country.name" />
                  <span>{{ country.name }}</span><strong>+{{ country.dial }}</strong>
                </button>
              </div>
            </div>
          </div>
          <label><span>Birthday</span><input v-model="birthday" placeholder="MM / DD / YYYY" @input="sanitizeBirthday" /></label>
          <label><span>Email</span><input v-model.trim="form.email" autocomplete="email" /></label>
          <label><span>Transaction Password</span><input v-model="form.tradePassword" type="password" autocomplete="new-password" /></label>
          <label><span>Login Password</span><input v-model="form.password" type="password" autocomplete="new-password" /></label>
          <label><span>Confirm Login Password</span><input v-model="confirmPassword" type="password" autocomplete="new-password" /></label>
          <fieldset>
            <legend>Gender</legend>
            <label><input v-model="form.gender" type="radio" value="0" /> Male</label>
            <label><input v-model="form.gender" type="radio" value="1" /> Female</label>
          </fieldset>
          <label><span>Invite Code</span><input v-model.trim="form.inviteCode" /></label>
        </div>
        <label class="pc-register__agree">
          <input v-model="agreed" type="checkbox" />
          <span>I agree with <button type="button" @click="openTerms">Terms and Conditions</button></span>
        </label>
        <button class="pc-register__submit" type="submit" :disabled="submitting">Register</button>
        <p>Already have an account?
          <button type="button" @click="safeReplace(router, '/account/login')">Login</button>
        </p>
      </form>
    </section>
  </PcPublicShell>
  <main class="register-screen register-screen--mobile das-page">
    <header class="register-top">
      <img src="@/static/das/wordmark-cream.png" alt="DAS" />
    </header>
    <form class="register-form" novalidate @invalid.capture.prevent @submit.prevent="submit">
      <p class="register-kicker">{{ $t("das.auth.signUp") }}</p>
      <h1>
        {{ $t("das.auth.requestLead") }}
        <em>{{ $t("das.auth.requestAccent") }}</em>
      </h1>
      <p class="register-hint">{{ $t("das.auth.registerHint") }}</p>
      <div class="register-fields">
        <label class="required"
          ><span>{{ $t("das.auth.username") }}</span
          ><input
            v-model.trim="form.username"
            aria-required="true"
            autocomplete="username"
            :placeholder="$t('das.auth.username')"
        /></label>

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
              <span class="phone-country-code">+{{ selectedCountry.dial }}</span>
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
                :class="{ 'is-selected': country.name === selectedCountry.name }"
                @click="selectCountry(country)"
              >
                <img :src="country.flag" class="phone-country-flag" :alt="country.name" />
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

        <label
          ><span>{{ $t("das.auth.email") }}</span
          ><input
            v-model.trim="form.email"
            type="text"
            inputmode="email"
            autocomplete="email"
            :placeholder="$t('das.auth.optional')"
        /></label>

        <div class="register-field gender-group required">
          <div class="gender-field">
            <span class="gender-field__title">{{ $t("das.auth.gender") }}</span>
            <div class="gender-field__options">
              <label>
                <input v-model="form.gender" type="radio" value="0" aria-required="true" />
                <span>{{ $t("das.auth.male") }}</span>
              </label>
              <label>
                <input v-model="form.gender" type="radio" value="1" aria-required="true" />
                <span>{{ $t("das.auth.female") }}</span>
              </label>
            </div>
          </div>
        </div>

        <label class="required"
          ><span>{{ $t("das.auth.password") }}</span
          ><input
            v-model="form.password"
            aria-required="true"
            type="password"
            autocomplete="new-password"
            placeholder="••••••••" /></label
        ><label class="required"
          ><span>{{ $t("das.auth.confirmPassword") }}</span
          ><input
            v-model="confirmPassword"
            aria-required="true"
            type="password"
            autocomplete="new-password"
            placeholder="••••••••" /></label
        ><label class="required"
          ><span>{{ $t("das.auth.tradePassword") }}</span
          ><input
            v-model="form.tradePassword"
            aria-required="true"
            type="password"
            inputmode="numeric"
            autocomplete="new-password"
            placeholder="••••••••" /></label
        ><label class="required"
          ><span>{{ $t("das.auth.inviteCode") }}</span
          ><input
            v-model.trim="form.inviteCode"
            aria-required="true"
            :placeholder="$t('das.auth.inviteCode')"
        /></label>
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
      class="das-status-dialog"
      :show-confirm-button="false"
      ><div class="status-dialog">
        <span class="status-dialog__icon"><img src="@/static/das/icons/status-success.png" alt="" /></span>
        <h2>{{ $t("das.auth.registerSuccess") }}</h2>
        <p>{{ $t("das.auth.registerSuccessHint") }}</p>
        <button @click="safeReplace(router, '/account/login')">
          {{ $t("das.auth.continue") }}
        </button>
      </div></van-dialog
    >
  </main>
  </div>
</template>
<script setup>
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
import PcPublicShell from "@/components/pc/PcPublicShell.vue";

const router = useRouter(),
  { t } = useI18n(),
  phonePickerOpen = ref(false),
  phoneFieldRef = ref(),
  pcPhoneFieldRef = ref(),
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

const selectedPhoneRule = computed(
  () => getPhoneRule(selectedCountry.value),
);
const phonePlaceholder = computed(
  () => selectedPhoneRule.value.pattern.replace(/#/g, "_"),
);

const selectCountry = (country) => {
  const phone = localPhoneDigits(localPhone.value);
  selectedCountry.value = country;
  localPhone.value = formatPhoneNumber(phone, selectedPhoneRule.value);
  phonePickerOpen.value = false;
};

const closePhonePickerOnOutside = (event) => {
  const insideMobile = phoneFieldRef.value?.contains(event.target);
  const insidePc = pcPhoneFieldRef.value?.contains(event.target);
  if (!insideMobile && !insidePc) {
    phonePickerOpen.value = false;
  }
};

onMounted(() => document.addEventListener("pointerdown", closePhonePickerOnOutside));
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
.pc-register { display: none; }
.register-page { width: 100%; min-height: 100%; }
.register-screen {
  min-height: 100%;
  padding: 42px clamp(28px, 7vw, 72px) 40px;
  background: #0d241c;
  color: #f7f5ec;
}
.register-top {
  height: 82px;
  display: flex;
  align-items: flex-start;
}
.register-top img {
  width: 45px;
  height: 70px;
  object-fit: contain;
}
.register-form {
  max-width: 760px;
  margin: 22px auto 0;
}
.register-kicker {
  margin: 0 0 16px;
  color: rgba(247, 245, 236, 0.58);
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.18em;
}
.register-form h1 {
  margin: 0;
  font-size: clamp(36px, 6.5vw, 60px);
  font-weight: 400;
}
.register-form h1 em {
  color: #ed9b87;
  font-style: normal;
}
.register-hint {
  margin: 18px 0 35px;
  color: rgba(247, 245, 236, 0.58);
  font-size: 14px;
}
.register-fields {
  display: grid;
  gap: 22px;
}
.register-fields label > span,
.register-field > span {
  display: block;
  margin-bottom: 10px;
  color: rgba(247, 245, 236, 0.58);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}
.required > span::after,
.gender-group.required .gender-field__title::after {
  content: " *";
  color: #ed9b87;
}
.register-fields > label input,
.register-fields > label select {
  width: 100%;
  height: 58px;
  padding: 0 20px;
  border: 1px solid rgba(247, 245, 236, 0.28);
  border-radius: 999px;
  background: rgba(247, 245, 236, 0.07);
  color: #f7f5ec;
}
.register-fields input::placeholder {
  color: rgba(247, 245, 236, 0.32);
}
.phone-field {
  position: relative;
  height: 58px;
  display: grid;
  grid-template-columns: 62px 1fr;
  border: 1px solid rgba(247, 245, 236, 0.28);
  border-radius: 999px;
  background: rgba(247, 245, 236, 0.07);
}
.phone-country-button {
  min-width: 0;
  height: 100%;
  padding: 0 8px 0 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 0;
  background: transparent;
  color: #f7f5ec;
}
.phone-country-code {
  color: rgba(247, 245, 236, 0.58);
  font-size: 16px;
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
  color: #f7f5ec;
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
  border: 1px solid rgba(247, 245, 236, 0.26);
  border-radius: 18px;
  background: #17382d;
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.28);
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
  display: none;
}
.gender-field {
  min-height: 58px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border: 1px solid rgba(247, 245, 236, 0.28);
  border-radius: 999px;
  background: rgba(247, 245, 236, 0.07);
}
.gender-field__title {
  color: #f7f5ec;
  font-size: 14px;
}
.gender-field__options {
  display: flex;
  align-items: center;
  gap: 18px;
}
.gender-field__options label {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #f7f5ec;
  font-size: 14px;
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
  accent-color: #f7f5ec;
}
.register-agree {
  margin: 26px 0 24px;
  display: flex;
  gap: 11px;
  color: rgba(247, 245, 236, 0.62);
  font-size: 12px;
}
.register-agree > input {
  width: 22px;
  height: 22px;
}
.register-agree button,
.register-switch button,
.register-legal button {
  padding: 0;
  border: 0;
  background: none;
  color: #f7f5ec;
  text-decoration: underline;
  font-weight: 700;
}
.register-submit {
  width: 100%;
  height: 64px;
  border: 0;
  border-radius: 999px;
  background: #f7f5ec;
  color: #17382d;
  font-size: 17px;
  font-weight: 800;
}
.register-switch,
.register-legal,
.register-copyright {
  text-align: center;
  color: rgba(247, 245, 236, 0.55);
  font-size: 12px;
}
.register-switch {
  margin: 8px 0 0;
}
.register-legal {
  margin: 18px 0 0;
}
.register-copyright {
  margin-top: 38px;
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
  font-size: 30px;
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
  color: #747c76;
  font-size: 13px;
}
.status-dialog button {
  width: 100%;
  height: 50px;
  margin-top: 24px;
  border: 0;
  border-radius: 999px;
  background: #14392c;
  color: white;
  font-weight: 700;
}
:global(.das-status-dialog.van-dialog) {
  width: min(84%, 380px);
  border-radius: 24px;
  background: #f7f5ec;
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
@media (min-width: 900px) {
  .register-screen--mobile { display: none; }
  .pc-register { display: block; }
  .pc-register__content {
    width: min(100% - 96px, 1200px);
    margin: 0 auto;
    padding: 40px 0 90px;
  }
  .pc-register__content > h1 {
    margin: 0 0 40px;
    text-align: center;
    color: #fff;
    font-size: 46px;
    font-weight: 400;
    letter-spacing: -0.045em;
  }
  .pc-register__card {
    width: 840px;
    margin: 0 auto;
    padding: 48px 54px 42px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 9px;
    background: linear-gradient(145deg, rgba(34, 34, 34, 0.96), rgba(15, 15, 15, 0.99));
    color: #fff;
    box-shadow: 0 32px 90px rgba(0, 0, 0, 0.46);
  }
  .pc-register__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px 28px;
  }
  .pc-register__grid > label,
  .pc-register__field { min-width: 0; }
  .pc-register__grid > label > span,
  .pc-register__field > span,
  .pc-register__grid legend {
    display: block;
    margin-bottom: 10px;
    color: #929292;
    font-size: 12px;
  }
  .pc-register__grid input:not([type="radio"]),
  .pc-register__phone {
    width: 100%;
    height: 52px;
    border: 1px solid #3e3e3e;
    border-radius: 3px;
    background: #202020;
    color: #fff;
  }
  .pc-register__grid input:not([type="radio"]) { padding: 0 15px; }
  .pc-register__phone {
    position: relative;
    display: flex;
  }
  .pc-register__phone > button {
    min-width: 105px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border: 0;
    border-right: 1px solid #3e3e3e;
    background: transparent;
    color: #aaa;
  }
  .pc-register__phone img,
  .pc-register__country-menu img {
    width: 22px;
    height: 15px;
    object-fit: cover;
  }
  .pc-register__phone > input { border: 0 !important; background: transparent !important; }
  .pc-register__country-menu {
    position: absolute;
    z-index: 20;
    top: 58px;
    left: 0;
    right: 0;
    max-height: 230px;
    overflow-y: auto;
    padding: 7px;
    border: 1px solid #444;
    border-radius: 4px;
    background: #202020;
  }
  .pc-register__country-menu button {
    width: 100%;
    min-height: 38px;
    display: grid;
    grid-template-columns: 28px 1fr auto;
    align-items: center;
    gap: 8px;
    border: 0;
    background: transparent;
    color: #ddd;
    text-align: left;
  }
  .pc-register__country-menu button:hover { background: #303030; }
  .pc-register__grid fieldset {
    min-width: 0;
    height: 76px;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 28px;
    border: 0;
  }
  .pc-register__grid fieldset legend { transform: translateY(1px); }
  .pc-register__grid fieldset label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ddd;
    font-size: 13px;
  }
  .pc-register__grid fieldset input { accent-color: #d2ff4f; }
  .pc-register__agree {
    margin: 28px 0 22px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #aaa;
    font-size: 13px;
  }
  .pc-register__agree > input { width: 18px; height: 18px; accent-color: #d2ff4f; }
  .pc-register__agree button,
  .pc-register__card > p button {
    padding: 0;
    border: 0;
    background: transparent;
    color: #d2ff4f;
  }
  .pc-register__submit {
    width: 100%;
    height: 56px;
    border: 0;
    border-radius: 3px;
    background: #d2ff4f;
    color: #050505;
    font-weight: 700;
  }
  .pc-register__card > p {
    margin: 24px 0 0;
    color: #929292;
    text-align: center;
    font-size: 13px;
  }
}
</style>
