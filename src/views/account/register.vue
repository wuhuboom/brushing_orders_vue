<template>
  <div class="dmk-pc-only w-full min-h-[100vh] bg-black dmk-site-scope">
    <div class="w-full min-h-[100vh] text-white dmk-register-scope">
      <div class="block">
        <div class="max-w-[1200px] mx-auto relative">
          <DmkPcHeader :authenticated="false" />
          <div
            class="w-full text-center py-8 text-4xl font-semibold"
          >
            {{ $t("das.dmk.niceToMeet") }}
          </div>
          <form
            class="login-input min-h-[65vh] w-[70%] mx-auto"
            novalidate
            @invalid.capture.prevent
            @submit.prevent="submit"
          >
            <div class="box">
              <div
                class="w-[90%] mt-16 mx-auto grid grid-cols-2 gap-4"
              >
                <div class="col-span-1">
                  <div class="van-cell van-field">
                    <div class="van-cell__value van-field__value">
                      <div class="van-field__body">
                        <input
                          v-model.trim="form.username"
                          class="van-field__control van-field__control--left"
                          autocomplete="username"
                          :placeholder="$t('das.auth.username')"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-span-1">
                  <div
                    class="van-cell van-field dmk-register-phone-cell"
                  >
                    <div class="van-cell__value van-field__value">
                      <div class="van-field__body dmk-register-phone" @pointerdown.stop>
                        <button
                          class="dmk-register-phone__country"
                          type="button"
                          :aria-expanded="phonePickerOpen"
                          @click.stop="phonePickerOpen = !phonePickerOpen"
                        >
                          <img :src="selectedCountry.flag" :alt="countryName(selectedCountry)" />
                          <span>+{{ selectedCountry.dial }}</span>
                          <van-icon name="arrow-down" />
                        </button>
                        <input
                          v-model="localPhone"
                          class="van-field__control van-field__control--left"
                          autocomplete="tel-national"
                          inputmode="tel"
                          :maxlength="selectedPhoneRule.pattern.length"
                          :placeholder="$t('das.auth.phone')"
                          type="text"
                          @input="sanitizePhone"
                        />
                        <div v-if="phonePickerOpen" class="dmk-register-phone__menu">
                          <button
                            v-for="country in allCountryList"
                            :key="`${country.id}-${country.dial}-pc`"
                            type="button"
                            :class="{ selected: country.id === selectedCountry.id }"
                            @click="selectCountry(country)"
                          >
                            <img :src="country.flag" :alt="countryName(country)" />
                            <span>{{ countryName(country) }}</span>
                            <strong>+{{ country.dial }}</strong>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-span-1">
                  <div class="van-cell van-field">
                    <div class="van-cell__value van-field__value">
                      <div class="van-field__body">
                        <input
                          v-model.trim="form.email"
                          class="van-field__control van-field__control--left"
                          autocomplete="email"
                          :placeholder="$t('das.auth.email')"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-span-1">
                  <div class="van-cell van-field">
                    <div class="van-cell__value van-field__value">
                      <div class="van-field__body">
                        <input
                          v-model="form.tradePassword"
                          class="van-field__control van-field__control--left"
                          autocomplete="new-password"
                          :placeholder="$t('das.auth.tradePassword')"
                          :type="tradePasswordVisible ? 'text' : 'password'"
                        />
                        <div
                          class="van-field__button cursor-pointer"
                          role="button"
                          tabindex="0"
                          :aria-label="$t('das.form.togglePassword')"
                          :aria-pressed="tradePasswordVisible"
                          @click="tradePasswordVisible = !tradePasswordVisible"
                          @keydown.enter.prevent="tradePasswordVisible = !tradePasswordVisible"
                          @keydown.space.prevent="tradePasswordVisible = !tradePasswordVisible"
                        >
                          <img
                            :src="
                              tradePasswordVisible
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
                <div class="col-span-1">
                  <div class="van-cell van-field">
                    <div class="van-cell__value van-field__value">
                      <div class="van-field__body">
                        <input
                          v-model="form.password"
                          class="van-field__control van-field__control--left"
                          autocomplete="new-password"
                          :placeholder="$t('das.auth.password')"
                          :type="passwordVisible ? 'text' : 'password'"
                        />
                        <div
                          class="van-field__button cursor-pointer"
                          role="button"
                          tabindex="0"
                          :aria-label="$t('das.form.togglePassword')"
                          :aria-pressed="passwordVisible"
                          @click="passwordVisible = !passwordVisible"
                          @keydown.enter.prevent="passwordVisible = !passwordVisible"
                          @keydown.space.prevent="passwordVisible = !passwordVisible"
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
                <div class="col-span-1">
                  <div class="van-cell van-field">
                    <div class="van-cell__value van-field__value">
                      <div class="van-field__body">
                        <input
                          v-model="confirmPassword"
                          class="van-field__control van-field__control--left"
                          autocomplete="new-password"
                          :placeholder="$t('das.auth.confirmPassword')"
                          :type="confirmPasswordVisible ? 'text' : 'password'"
                        />
                        <div
                          class="van-field__button cursor-pointer"
                          role="button"
                          tabindex="0"
                          :aria-label="$t('das.form.togglePassword')"
                          :aria-pressed="confirmPasswordVisible"
                          @click="confirmPasswordVisible = !confirmPasswordVisible"
                          @keydown.enter.prevent="confirmPasswordVisible = !confirmPasswordVisible"
                          @keydown.space.prevent="confirmPasswordVisible = !confirmPasswordVisible"
                        >
                          <img
                            :src="
                              confirmPasswordVisible
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
                <div class="col-span-1">
                  <div
                    class="van-cell van-field cursor-pointer"
                    role="button"
                    tabindex="0"
                    @click="genderPickerOpen = true"
                    @keydown.enter.prevent="genderPickerOpen = true"
                    @keydown.space.prevent="genderPickerOpen = true"
                  >
                    <div class="van-cell__value van-field__value">
                      <div class="van-field__body">
                        <input
                          :value="genderLabel"
                          class="van-field__control van-field__control--left cursor-pointer"
                          :placeholder="$t('das.auth.gender')"
                          type="text"
                          readonly
                          tabindex="-1"
                        />
                        <div class="van-field__button">
                          <i
                            class="van-badge__wrapper van-icon van-icon-arrow-down"
                            style="color: rgb(225, 225, 225); font-size: 20px"
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-span-1">
                  <div class="van-cell van-field">
                    <div class="van-cell__value van-field__value">
                      <div class="van-field__body">
                        <input
                          v-model.trim="form.inviteCode"
                          class="van-field__control van-field__control--left"
                          :placeholder="$t('das.auth.inviteCode')"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-span-2">
                  <label class="van-checkbox cursor-pointer">
                    <input
                      v-model="agreed"
                      class="dmk-native-checkbox"
                      type="checkbox"
                    />
                    <div
                      class="van-checkbox__icon van-checkbox__icon--square"
                      :class="{ 'van-checkbox__icon--checked': agreed }"
                      style="font-size: 18px"
                    >
                      <i
                        class="van-badge__wrapper van-icon van-icon-success"
                        :style="
                          agreed
                            ? 'border-color: var(--main-color); background-color: var(--main-color)'
                            : ''
                        "
                      ></i>
                    </div>
                    <span class="van-checkbox__label"
                      ><span
                        class="text-[#fff] font-semibold text-sm"
                        >{{ $t("das.dmk.agreeWith") }}</span
                      ><span
                        class="ml-2 text-[var(--main-color)] text-sm underline font-bold"
                        @click.prevent="openTerms"
                        >{{ $t("das.auth.terms") }}</span
                      ></span
                    >
                  </label>
                </div>
                <div class="mt-6 col-span-2 px-4">
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
                          >{{ $t("das.auth.register") }}</span
                        ></span
                      >
                    </div>
                  </button>
                </div>
                <div
                  class="mt-6 col-span-2 text-center cursor-pointer"
                  @click="safeReplace(router, '/account/login')"
                >
                  {{ $t("das.dmk.alreadyHaveAccount") }}<span
                    class="text-[var(--main-color)] ml-2"
                    >{{ $t("das.dmk.login") }}</span
                  >
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <van-dialog
        v-model:show="showSuccess"
        class="das-status-dialog"
        :show-confirm-button="false"
        ><div class="status-dialog">
          <span class="status-dialog__icon"
            ><img src="@/static/das/icons/status-success.png" alt=""
          /></span>
          <h2>{{ $t("das.auth.registerSuccess") }}</h2>
          <p>{{ $t("das.auth.registerSuccessHint") }}</p>
          <button @click="safeReplace(router, '/account/login')">
            {{ $t("das.auth.continue") }}
          </button>
        </div></van-dialog
      >
      <DmkSupport />
    </div>
  </div>
  <div
    class="dmk-h5-only dmk-mobile-current w-full min-h-[100vh] text-white bg-black dmk-register-scope"
  >
    <form
      class="w-full relative"
      novalidate
      @invalid.capture.prevent
      @submit.prevent="submit"
    >
      <div class="w-full overflow-hidden">
        <div
          class="w-full px-4 py-2 flex justify-between items-center"
        >
          <div class="w-[var(--logo-width)]">
            <img
              class="w-full"
              src="/dmk/assets/logo.png"
              alt=""
            />
          </div>
        </div>
        <div class="w-[92%] mx-auto p-8">
          <div class="text-3xl text-center">
            <p>{{ $t("das.dmk.niceToMeet") }}</p>
          </div>
        </div>
      </div>
      <div class="login-input min-h-[80vh]">
        <div class="box">
          <div class="mt-8 w-[90%] mx-auto">
            <div class="van-cell van-field">
              <div class="van-cell__value van-field__value">
                <div class="van-field__body">
                  <input
                    v-model.trim="form.username"
                    autocomplete="username"
                    class="van-field__control van-field__control--left"
                    :placeholder="$t('das.auth.username')"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6 w-[90%] mx-auto">
            <div
              class="van-cell van-field dmk-register-phone-cell"
            >
              <div class="van-cell__value van-field__value">
                <div class="van-field__body dmk-register-phone" @pointerdown.stop>
                  <button
                    class="dmk-register-phone__country"
                    type="button"
                    :aria-expanded="phonePickerOpen"
                    @click.stop="phonePickerOpen = !phonePickerOpen"
                  >
                    <img :src="selectedCountry.flag" :alt="countryName(selectedCountry)" />
                    <span>+{{ selectedCountry.dial }}</span>
                    <van-icon name="arrow-down" />
                  </button>
                  <input
                    v-model="localPhone"
                    autocomplete="tel-national"
                    inputmode="tel"
                    :maxlength="selectedPhoneRule.pattern.length"
                    class="van-field__control van-field__control--left"
                    :placeholder="$t('das.auth.phone')"
                    type="text"
                    @input="sanitizePhone"
                  />
                  <div v-if="phonePickerOpen" class="dmk-register-phone__menu">
                    <button
                      v-for="country in allCountryList"
                      :key="`${country.id}-${country.dial}-h5`"
                      type="button"
                      :class="{ selected: country.id === selectedCountry.id }"
                      @click="selectCountry(country)"
                    >
                      <img :src="country.flag" :alt="countryName(country)" />
                      <span>{{ countryName(country) }}</span>
                      <strong>+{{ country.dial }}</strong>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6 w-[90%] mx-auto">
            <div class="van-cell van-field">
              <div class="van-cell__value van-field__value">
                <div class="van-field__body">
                  <input
                    v-model.trim="form.email"
                    autocomplete="email"
                    class="van-field__control van-field__control--left"
                    :placeholder="$t('das.auth.email')"
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
                    v-model="form.tradePassword"
                    autocomplete="new-password"
                    class="van-field__control van-field__control--left"
                    :placeholder="$t('das.auth.tradePassword')"
                    :type="tradePasswordVisible ? 'text' : 'password'"
                  />
                  <div
                    class="van-field__button cursor-pointer"
                    role="button"
                    tabindex="0"
                    :aria-label="$t('das.form.togglePassword')"
                    :aria-pressed="tradePasswordVisible"
                    @click="tradePasswordVisible = !tradePasswordVisible"
                    @keydown.enter.prevent="tradePasswordVisible = !tradePasswordVisible"
                    @keydown.space.prevent="tradePasswordVisible = !tradePasswordVisible"
                  >
                    <img
                      :src="
                        tradePasswordVisible
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
          <div class="mt-6 w-[90%] mx-auto">
            <div class="van-cell van-field">
              <div class="van-cell__value van-field__value">
                <div class="van-field__body">
                  <input
                    v-model="form.password"
                    autocomplete="new-password"
                    class="van-field__control van-field__control--left"
                    :placeholder="$t('das.auth.password')"
                    :type="passwordVisible ? 'text' : 'password'"
                  />
                  <div
                    class="van-field__button cursor-pointer"
                    role="button"
                    tabindex="0"
                    :aria-label="$t('das.form.togglePassword')"
                    :aria-pressed="passwordVisible"
                    @click="passwordVisible = !passwordVisible"
                    @keydown.enter.prevent="passwordVisible = !passwordVisible"
                    @keydown.space.prevent="passwordVisible = !passwordVisible"
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
          <div class="mt-6 w-[90%] mx-auto">
            <div class="van-cell van-field">
              <div class="van-cell__value van-field__value">
                <div class="van-field__body">
                  <input
                    v-model="confirmPassword"
                    autocomplete="new-password"
                    class="van-field__control van-field__control--left"
                    :placeholder="$t('das.auth.confirmPassword')"
                    :type="confirmPasswordVisible ? 'text' : 'password'"
                  />
                  <div
                    class="van-field__button cursor-pointer"
                    role="button"
                    tabindex="0"
                    :aria-label="$t('das.form.togglePassword')"
                    :aria-pressed="confirmPasswordVisible"
                    @click="confirmPasswordVisible = !confirmPasswordVisible"
                    @keydown.enter.prevent="confirmPasswordVisible = !confirmPasswordVisible"
                    @keydown.space.prevent="confirmPasswordVisible = !confirmPasswordVisible"
                  >
                    <img
                      :src="
                        confirmPasswordVisible
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
          <div class="mt-6 w-[90%] mx-auto">
            <div
              class="van-cell van-field cursor-pointer"
              role="button"
              tabindex="0"
              @click="genderPickerOpen = true"
              @keydown.enter.prevent="genderPickerOpen = true"
              @keydown.space.prevent="genderPickerOpen = true"
            >
              <div class="van-cell__value van-field__value">
                <div class="van-field__body">
                  <input
                    :value="genderLabel"
                    readonly
                    class="van-field__control van-field__control--left dmk-h5-register-select"
                    :placeholder="$t('das.auth.gender')"
                    type="text"
                  />
                  <div class="van-field__button">
                    <i
                      class="van-badge__wrapper van-icon van-icon-arrow-down"
                      style="color: rgb(225, 225, 225); font-size: 20px"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6 w-[90%] mx-auto">
            <div class="van-cell van-field">
              <div class="van-cell__value van-field__value">
                <div class="van-field__body">
                  <input
                    v-model.trim="form.inviteCode"
                    class="van-field__control van-field__control--left"
                    :placeholder="$t('das.auth.inviteCode')"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class="mt-6 w-[90%] mx-auto flex justify-between"
          >
            <label class="van-checkbox cursor-pointer">
              <input
                v-model="agreed"
                class="dmk-native-checkbox"
                type="checkbox"
              />
              <div
                class="van-checkbox__icon van-checkbox__icon--square"
                :class="{ 'van-checkbox__icon--checked': agreed }"
                style="font-size: 18px"
              >
                <i
                  class="van-badge__wrapper van-icon van-icon-success"
                  :style="
                    agreed
                      ? 'border-color: var(--main-color); background-color: var(--main-color)'
                      : ''
                  "
                ></i>
              </div>
              <span class="van-checkbox__label"
                ><span
                  class="text-[#fff] font-semibold text-sm"
                  >{{ $t("das.dmk.agreeWith") }}</span
                ><span
                  class="ml-2 text-[var(--main-color)] text-sm underline font-bold"
                  @click.prevent="openTerms"
                  >{{ $t("das.auth.terms") }}</span
                ></span
              >
            </label>
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
                    >{{ $t("das.auth.register") }}</span
                  ></span
                >
              </div>
            </button>
          </div>
          <div
            class="mt-6 text-center cursor-pointer"
            @click="safeReplace(router, '/account/login')"
          >
            {{ $t("das.dmk.alreadyHaveAccount") }}<span
              class="text-[var(--main-color)] ml-2"
              >{{ $t("das.dmk.login") }}</span
            >
          </div>
        </div>
      </div>
    </form>
    <van-dialog
      v-model:show="showSuccess"
      class="das-status-dialog"
      :show-confirm-button="false"
      ><div class="status-dialog">
        <span class="status-dialog__icon"
          ><img src="@/static/das/icons/status-success.png" alt=""
        /></span>
        <h2>{{ $t("das.auth.registerSuccess") }}</h2>
        <p>{{ $t("das.auth.registerSuccessHint") }}</p>
        <button @click="safeReplace(router, '/account/login')">
          {{ $t("das.auth.continue") }}
        </button>
      </div></van-dialog
    >
  </div>
  <van-action-sheet
    v-model:show="genderPickerOpen"
    class="dmk-register-gender-sheet"
    :actions="genderActions"
    :cancel-text="$t('das.common.cancel')"
    close-on-click-action
    @select="selectGender"
  />
</template>
<script setup>
import DmkPcHeader from "@/components/dmkPc/DmkPcHeader.vue";
import DmkSupport from "@/components/dmk/DmkSupport.vue";
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
  { t, locale } = useI18n(),
  phonePickerOpen = ref(false),
  localPhone = ref(""),
  confirmPassword = ref(""),
  tradePasswordVisible = ref(false),
  passwordVisible = ref(false),
  confirmPasswordVisible = ref(false),
  agreed = ref(false),
  submitting = ref(false),
  showSuccess = ref(false),
  genderPickerOpen = ref(false),
  form = reactive({
    username: "",
    password: "",
    tradePassword: "",
    gender: "",
    inviteCode: "",
    email: "",
  });

const genderActions = computed(() => [
  { name: t("das.auth.male"), value: "0" },
  { name: t("das.auth.female"), value: "1" },
]);
const genderLabel = computed(
  () => genderActions.value.find((item) => item.value === form.gender)?.name || "",
);
const selectGender = (item) => {
  form.gender = item.value;
};

const { saveDraft, takeDraft, clearDraft } = useRegistrationDraft();

const selectedCountry = ref(getPhoneCountry(window.g?.DEFAULT_PHONE_COUNTRY));
const allCountryList = PHONE_COUNTRIES;
const countryDisplayNames = computed(() => {
  try {
    return new Intl.DisplayNames([locale.value], { type: "region" });
  } catch {
    return null;
  }
});
const countryName = (country) => {
  const region = String(country?.flag || "")
    .match(/\/([a-z]{2})\.svg$/i)?.[1]
    ?.toUpperCase();
  return (region && countryDisplayNames.value?.of(region)) || country?.name || "";
};

const draft = takeDraft();
if (draft) {
  Object.assign(form, draft.form);
  selectedCountry.value = getPhoneCountry(draft.selectedCountry?.id);
  localPhone.value = draft.localPhone;
  confirmPassword.value = draft.confirmPassword;
  agreed.value = draft.agreed;
}

const openTerms = async () => {
  saveDraft({
    form: { ...form },
    selectedCountry: { ...selectedCountry.value },
    localPhone: localPhone.value,
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

const closePhonePickerOnOutside = () => {
  phonePickerOpen.value = false;
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
const emailReg = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const submit = async () => {
  if (submitting.value) return;

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
.dmk-register-phone {
  position: relative;
  overflow: visible;
}
.dmk-register-phone-cell {
  position: relative;
  z-index: 20;
  overflow: visible;
}
.dmk-register-phone__country {
  height: 38px;
  min-width: 98px;
  margin-right: 13px;
  padding: 0 12px 0 3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.16);
  color: #fff;
  background: transparent;
  font-size: 14px;
  white-space: nowrap;
}
.dmk-register-phone__country img,
.dmk-register-phone__menu img {
  width: 25px;
  height: 17px;
  flex: 0 0 auto;
  border-radius: 3px;
  object-fit: cover;
}
.dmk-register-phone__country :deep(.van-icon) {
  color: #aaa;
  font-size: 12px;
}
.dmk-register-phone__menu {
  position: absolute;
  z-index: 60;
  top: calc(100% + 15px);
  left: -16px;
  width: min(380px, calc(100vw - 46px));
  max-height: 270px;
  padding: 8px;
  overflow-y: auto;
  border: 1px solid rgba(218, 255, 69, 0.45);
  border-radius: 14px;
  background: #141414;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.72);
}
.dmk-register-phone__menu button {
  width: 100%;
  min-height: 42px;
  padding: 7px 10px;
  display: grid;
  grid-template-columns: 28px 1fr auto;
  align-items: center;
  gap: 9px;
  border: 0;
  border-radius: 9px;
  color: #ddd;
  background: transparent;
  text-align: left;
}
.dmk-register-phone__menu button:hover,
.dmk-register-phone__menu button.selected {
  color: #fff;
  background: rgba(218, 255, 69, 0.12);
}
.dmk-register-phone__menu strong {
  color: var(--main-color);
  font-weight: 600;
}
@media (max-width: 1023px) {
  .dmk-register-phone__country {
    min-width: 92px;
    margin-right: 10px;
  }
  .dmk-register-phone__menu {
    left: -12px;
    width: calc(100vw - 64px);
    max-height: 230px;
  }
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
</style>
