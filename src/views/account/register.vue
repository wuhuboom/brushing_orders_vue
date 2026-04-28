<template>
    <div
        class="auth-shell auth-shell--register"
        :class="`auth-shell--lang-${currentLang.code}`"
    >
        <div class="auth-hero">
            <img
                class="auth-hero__image"
                src="@/static/images/auth/auth-hero.png"
                alt=""
            />
            <div class="auth-hero__overlay"></div>
            <div class="auth-lang" @click="handleChangeLang">
                <span class="auth-lang__globe">◎</span>
                <span class="auth-lang__flag">{{ currentLang.flag }}</span>
                <span class="auth-lang__text">{{ currentLang.name }}</span>
                <span class="auth-lang__arrow"></span>
            </div>
            <div class="auth-hero__caption">
                {{ $t("hello_welcome") }}
            </div>
        </div>

        <div class="auth-card auth-card--register">
            <div
                class="auth-switch auth-switch--register"
                :class="{ 'auth-switch--to-login': switchLeaving }"
            >
                <div class="auth-switch__thumb"></div>
                <div class="auth-switch__item" @click="toLogin">
                    {{ $t("login") }}
                </div>
                <div class="auth-switch__item auth-switch__item--active">
                    {{ $t("register") }}
                </div>
            </div>

            <el-form
                ref="ruleFormRef"
                :model="ruleForm"
                status-icon
                :rules="rules"
                label-width="0"
                class="auth-form"
            >
                <div class="auth-section">
                    <div class="auth-section__title">
                        <span class="auth-section__badge">1</span>
                        <span>{{ $t("basic_information_upper") }}</span>
                    </div>

                    <el-form-item prop="username">
                        <div class="auth-input">
                            <img
                                class="auth-input__icon"
                                src="@/static/images/auth/auth-user-green.png"
                                alt=""
                            />
                            <el-input
                                v-model="ruleForm.username"
                                :placeholder="$t('username')"
                                type="text"
                                autocomplete="off"
                                size="large"
                                @input="onUsernameInput"
                            />
                        </div>
                    </el-form-item>

                    <div class="auth-gender-select">
                        <button
                            type="button"
                            class="auth-gender-select__trigger"
                            :class="{
                                'auth-gender-select__trigger--placeholder':
                                    !ruleForm.sex,
                            }"
                            @click="toggleGenderMenu"
                        >
                            <span class="auth-gender-select__value">
                                <span class="auth-gender-emoji">
                                    {{ genderEmoji }}
                                </span>
                                <span>{{ genderLabel }}</span>
                            </span>
                            <span
                                class="auth-gender-select__arrow"
                                :class="{
                                    'auth-gender-select__arrow--open':
                                        genderMenuOpen,
                                }"
                            ></span>
                        </button>

                        <div
                            v-show="genderMenuOpen"
                            class="auth-gender-select__menu"
                        >
                            <button
                                type="button"
                                class="auth-gender-select__option"
                                :class="{
                                    'auth-gender-select__option--active':
                                        ruleForm.sex === 1,
                                }"
                                @click="selectGender(1)"
                            >
                                <span class="auth-gender-select__value">
                                    <span class="auth-gender-emoji">🧑</span>
                                    <span>{{ $t("male") }}</span>
                                </span>
                                <span
                                    v-if="ruleForm.sex === 1"
                                    class="auth-gender-select__check"
                                >
                                    ✓
                                </span>
                            </button>
                            <button
                                type="button"
                                class="auth-gender-select__option"
                                :class="{
                                    'auth-gender-select__option--active':
                                        ruleForm.sex === 2,
                                }"
                                @click="selectGender(2)"
                            >
                                <span class="auth-gender-select__value">
                                    <span class="auth-gender-emoji">👩</span>
                                    <span>{{ $t("female") }}</span>
                                </span>
                                <span
                                    v-if="ruleForm.sex === 2"
                                    class="auth-gender-select__check"
                                >
                                    ✓
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="auth-section">
                    <div class="auth-section__title">
                        <span class="auth-section__badge">2</span>
                        <span>{{ $t("account_security_upper") }}</span>
                    </div>

                    <el-form-item prop="tradePassword">
                        <div class="auth-input">
                            <img
                                class="auth-input__icon"
                                src="@/static/images/auth/authtrade.png"
                                alt=""
                            />
                            <el-input
                                v-model="ruleForm.tradePassword"
                                :placeholder="$t('transaction_password')"
                                :type="showTradePassword ? 'text' : 'password'"
                                maxlength="6"
                                autocomplete="off"
                                size="large"
                                @input="
                                    ruleForm.tradePassword =
                                        ruleForm.tradePassword.replace(
                                            /\D/g,
                                            '',
                                        )
                                "
                            >
                                <template #suffix>
                                    <el-icon
                                        class="auth-eye-icon"
                                        @click.stop="
                                            showTradePassword =
                                                !showTradePassword
                                        "
                                    >
                                        <Hide v-if="showTradePassword" />
                                        <View v-else />
                                    </el-icon>
                                </template>
                            </el-input>
                        </div>
                    </el-form-item>

                    <el-form-item prop="password">
                        <div class="auth-input">
                            <img
                                class="auth-input__icon"
                                src="@/static/images/auth/authlock.png"
                                alt=""
                            />
                            <el-input
                                v-model="ruleForm.password"
                                :placeholder="$t('password')"
                                :type="showPassword ? 'text' : 'password'"
                                autocomplete="off"
                                size="large"
                            >
                                <template #suffix>
                                    <el-icon
                                        class="auth-eye-icon"
                                        @click.stop="
                                            showPassword = !showPassword
                                        "
                                    >
                                        <Hide v-if="showPassword" />
                                        <View v-else />
                                    </el-icon>
                                </template>
                            </el-input>
                        </div>
                    </el-form-item>

                    <el-form-item prop="agentPassword">
                        <div class="auth-input">
                            <img
                                class="auth-input__icon"
                                src="@/static/images/auth/auth-lock.png"
                                alt=""
                            />
                            <el-input
                                v-model="agentPassword"
                                :placeholder="$t('confirm_password')"
                                :type="
                                    showConfirmPassword ? 'text' : 'password'
                                "
                                autocomplete="off"
                                size="large"
                            >
                                <template #suffix>
                                    <el-icon
                                        class="auth-eye-icon"
                                        @click.stop="
                                            showConfirmPassword =
                                                !showConfirmPassword
                                        "
                                    >
                                        <Hide v-if="showConfirmPassword" />
                                        <View v-else />
                                    </el-icon>
                                </template>
                            </el-input>
                        </div>
                    </el-form-item>
                </div>

                <div class="auth-section auth-section--compact">
                    <div class="auth-section__title">
                        <span class="auth-section__badge">3</span>
                        <span>{{ $t("invitation_code_upper") }}</span>
                    </div>

                    <el-form-item prop="inviteCode">
                        <div class="auth-input">
                            <img
                                class="auth-input__icon"
                                src="@/static/images/auth/authinvite.png"
                                alt=""
                            />
                            <el-input
                                v-model="ruleForm.inviteCode"
                                :placeholder="$t('invite_code_required')"
                                type="text"
                                autocomplete="off"
                                size="large"
                            />
                        </div>
                    </el-form-item>
                </div>

                <div class="auth-agreement">
                    <van-checkbox
                        v-model="checked"
                        checked-color="var(--theme-primary)"
                        shape="square"
                        icon-size="20px"
                    >
                        <span class="auth-agreement__muted">{{
                            $t("i_agree")
                        }}</span>
                        <span class="auth-agreement__link" @click.stop="jump">
                            {{ $t("terms_and_conditions_2") }}
                        </span>
                    </van-checkbox>
                </div>

                <div
                    class="auth-submit"
                    :class="{ 'auth-submit--disabled': !isRegisterReady || isSubmitting }"
                    :aria-disabled="!isRegisterReady || isSubmitting"
                    @click="sendCode"
                >
                    {{ $t("register") }}
                </div>

                <div class="auth-footer">
                    <span class="auth-footer__muted">{{
                        $t("already_have_an_account_2")
                    }}</span>
                    <span class="auth-footer__link" @click="toLogin">
                        {{ $t("login_now") }}
                    </span>
                </div>
            </el-form>

            <!-- <div class="auth-help">
                <span class="auth-help__muted">{{ $t("need_help") }}</span>
                <span class="auth-help__link" @click="jumpToService">
                    {{ $t("contact_customer_service") }}
                </span>
            </div> -->
        </div>

        <Lang ref="langRef"></Lang>
        <AppLoadingScreen :visible="isSubmitting" />
    </div>
</template>

<script setup>
import AppLoadingScreen from "@/components/AppLoadingScreen.vue";
import Lang from "@/components/Lang.vue";
import { Hide, View } from "@element-plus/icons-vue";
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { register } from "../../api/apis";
import { showToast } from "@/util/message";
import { useCommonStore } from "@/store/modules/common";
import { LANGS } from "@/config/lang";

const onUsernameInput = (val) => {
    ruleForm.username = val.replace(/[^a-zA-Z0-9]/g, "");
};

const router = useRouter();
const { t } = useI18n();
const ruleFormRef = ref(null);
const langRef = ref(null);
const commonStore = useCommonStore();
const agentPassword = ref("");
const checked = ref(false);
const switchLeaving = ref(false);
const isSubmitting = ref(false);
const genderMenuOpen = ref(false);
const showTradePassword = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const ruleForm = reactive({
    username: "",
    password: "",
    tradePassword: "",
    sex: null,
    inviteCode: "",
});
const rules = computed(() => {
    return {};
});
const currentLang = computed(() => LANGS[commonStore.lang] || LANGS.en);

const genderLabel = computed(() => {
    if (ruleForm.sex === 1) return t("male");
    if (ruleForm.sex === 2) return t("female");
    return "Select Gender";
});

const genderEmoji = computed(() => {
    if (ruleForm.sex === 2) return "👩";
    return "🧑";
});

const isRegisterReady = computed(() => {
    return Boolean(
        checked.value &&
            ruleForm.username &&
            ruleForm.password &&
            ruleForm.sex &&
            agentPassword.value &&
            ruleForm.tradePassword &&
            ruleForm.inviteCode,
    );
});

function toLogin() {
    if (switchLeaving.value) return;
    switchLeaving.value = true;
    window.setTimeout(() => {
        router.replace("/account/login");
    }, 180);
}

function toggleGenderMenu() {
    genderMenuOpen.value = !genderMenuOpen.value;
}

function selectGender(value) {
    ruleForm.sex = value;
    genderMenuOpen.value = false;
}

function handleChangeLang() {
    langRef.value.open();
}

function sendCode() {
    if (isSubmitting.value || !isRegisterReady.value) return;
    if (!checked.value)
        return showToast(t("please_tick_and_agree_to_the_argeement"));
    if (!ruleForm.username) return showToast(t("please_enter_username"));
    const reg = /^[A-Za-z0-9]+$/;
    if (!reg.test(ruleForm.username)) {
        return showToast(t("user_name_input_space_or_special_symbol"));
    }
    if (!ruleForm.password) {
        return showToast(t("please_enter_a_6_digit_password"));
    }
    if (!ruleForm.sex) return showToast(t("gender_cannot_be_empty"));
    if (!agentPassword.value)
        return showToast(t("please_enter_confirm_password"));
    if (agentPassword.value != ruleForm.password) {
        return showToast(t("passwords_do_not_match"));
    }
    if (!/^\d{6}$/.test(ruleForm.tradePassword)) {
        return showToast(t("please_enter_a_6_digit_transaction_password"));
    }
    if (!ruleForm.inviteCode)
        return showToast(t("please_enter_invitation_code"));
    isSubmitting.value = true;
    register(ruleForm)
        .then(() => {
            showToast(t("registration_successful"));
            return router.push({
                path: "/account/login",
            });
        })
        .catch(() => {})
        .finally(() => {
            isSubmitting.value = false;
        });
}

function getHashParam(key) {
    const hash = window.location.hash;
    const queryString = hash.includes("?") ? hash.split("?")[1] : "";
    const params = new URLSearchParams(queryString);
    return params.get(key);
}

const jump = () => {
    router.push({
        path: "/tc",
    });
};

const jumpToService = () => {
    router.push({
        path: "/service",
    });
};

onMounted(() => {
    const code = getHashParam("code");
    ruleForm.inviteCode = code;
});
</script>

<style scoped>
.auth-shell {
    min-height: 100vh;
    background: linear-gradient(180deg, #eff8f1 0%, #f5faf6 42%, #f5faf6 100%);
    position: relative;
    overflow-x: hidden;
}

.auth-shell--register {
    overflow-y: auto;
}

.auth-hero {
    position: relative;
    height: 220px;
}

.auth-hero__image {
    width: 100%;
    height: 198px;
    object-fit: cover;
    display: block;
}

.auth-hero__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        180deg,
        rgba(28, 159, 75, 0.18) 0%,
        rgba(245, 250, 246, 0) 80%
    );
}

.auth-hero__caption {
    position: absolute;
    left: 50%;
    top: 168px;
    transform: translateX(-50%);
    color: #199346;
    font-size: 12px;
    line-height: 18px;
    white-space: nowrap;
}

.auth-lang {
    position: absolute;
    top: 18px;
    right: 22px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 42px;
    width: 156px;
    padding: 0 11px;
    border: 1px solid rgba(34, 160, 80, 0.18);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.94);
    color: #1d2b21;
    font-size: 14px;
    font-weight: 700;
    z-index: 2;
    box-shadow: 0 8px 22px rgba(32, 125, 59, 0.1);
}

.auth-lang__globe {
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
    background: url("@/static/images/lang/globe.png") center / contain no-repeat;
    font-size: 0;
    line-height: 0;
}

.auth-lang__globe::before,
.auth-lang__globe::after {
    display: none;
}

.auth-lang__flag {
    width: 20px;
    height: 14px;
    border-radius: 2px;
    overflow: hidden;
    background: center / contain no-repeat;
    box-shadow: 0 0 0 1px rgba(20, 80, 36, 0.08);
    flex: 0 0 20px;
    font-size: 0;
    line-height: 0;
}

.auth-shell--lang-en .auth-lang__flag {
    background-image: url("@/static/images/lang/en.png");
}

.auth-shell--lang-zh .auth-lang__flag {
    background-image: url("@/static/images/lang/zh.png");
}

.auth-shell--lang-id .auth-lang__flag {
    background-image: url("@/static/images/lang/id.png");
}

.auth-shell--lang-th .auth-lang__flag {
    background-image: url("@/static/images/lang/th.png");
}

.auth-shell--lang-ko .auth-lang__flag {
    background:
        radial-gradient(
            circle at 50% 50%,
            #d83b3b 0 3px,
            #2462b8 3px 6px,
            transparent 6px
        ),
        #ffffff;
}

.auth-lang__text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.auth-lang__arrow {
    width: 8px;
    height: 8px;
    flex: 0 0 8px;
    margin-left: 1px;
    border-right: 2px solid #6c8a74;
    border-bottom: 2px solid #6c8a74;
    transform: rotate(45deg) translateY(-2px);
}

.auth-card {
    position: relative;
    margin: -14px 24px 0;
    padding-bottom: 28px;
}

.auth-card--register {
    margin-bottom: 12px;
}

.auth-switch {
    display: flex;
    position: relative;
    padding: 4px;
    border-radius: 14px;
    background: #fff;
    margin-bottom: 22px;
    overflow: hidden;
}

.auth-switch__thumb {
    position: absolute;
    top: 4px;
    left: 4px;
    width: calc(50% - 4px);
    height: 41px;
    border-radius: 11px;
    background: var( --theme-primary);
    box-shadow: 0 3px 8px var(--theme-button-shadow);
    transform: translateX(calc(100% + 4px));
    transition:
        transform 0.22s ease,
        box-shadow 0.22s ease;
}

.auth-switch__item {
    position: relative;
    z-index: 1;
    flex: 1;
    height: 41px;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #789680;
    font-size: 14px;
}

.auth-switch__item--active {
    color: #fff;
}

.auth-switch--to-login .auth-switch__thumb {
    transform: translateX(0);
}

.auth-switch--to-login .auth-switch__item:first-child {
    color: #fff;
}

.auth-switch--to-login .auth-switch__item:last-child {
    color: #789680;
}

.auth-form :deep(.el-form-item) {
    margin-bottom: 12px;
}

.auth-form :deep(.el-form-item__content) {
    line-height: normal;
}

.auth-section {
    margin-bottom: 18px;
}

.auth-section--compact {
    margin-bottom: 14px;
}

.auth-section__title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    line-height: 14px;
    letter-spacing: 0.9px;
    text-transform: uppercase;
    color: #afc1b5;
    margin-bottom: 12px;
}

.auth-section__badge {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #b9cdc1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    line-height: 1;
    color: #95ab9e;
    flex: 0 0 16px;
}

.auth-input {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 51px;
    padding: 0 14px 0 16px;
    border: 1px solid rgba(34, 160, 80, 0.2);
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 2px 6px rgba(34, 160, 80, 0.06);
    overflow: hidden;
}

.auth-input__icon {
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
}

.auth-input :deep(.el-input) {
    flex: 1;
    min-width: 0;
}

.auth-input :deep(.el-input__wrapper) {
    box-shadow: none !important;
    padding: 0 !important;
    background: transparent !important;
    border: 0 !important;
    border-radius: 0 !important;
}

.auth-input :deep(.el-input__inner) {
    height: 49px;
    font-size: 14px;
    color: #142819;
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    outline: none !important;
}

.auth-input :deep(.el-input__inner::placeholder) {
    color: rgba(20, 40, 25, 0.5);
}

.auth-input :deep(.el-input__wrapper.is-focus) {
    box-shadow: none !important;
}

.auth-input :deep(.el-input__suffix),
.auth-input :deep(.el-input__prefix) {
    display: flex;
    align-items: center;
}

.auth-input :deep(.el-input__suffix-inner) {
    color: #8caa94;
}

.auth-eye-icon {
    font-size: 18px;
    color: #8caa94;
    cursor: pointer;
}

.auth-gender-select {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
}

.auth-gender-select__trigger,
.auth-gender-select__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 52px;
    padding: 0 16px;
    border: 1px solid rgba(34, 160, 80, 0.2);
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 2px 6px rgba(34, 160, 80, 0.06);
    color: #1f3527;
    font-size: 14px;
    text-align: left;
}

.auth-gender-select__trigger {
    background: #fff;
    color: #203626;
    font-weight: 500;
}

.auth-gender-select__menu {
    overflow: hidden;
    background: #fff;
    border: 1px solid rgba(34, 160, 80, 0.18);
    border-radius: 14px;
    box-shadow: 0 8px 20px rgba(34, 160, 80, 0.06);
}

.auth-gender-select__option {
    border-radius: 0;
    box-shadow: none;
    border: 0;
    min-height: 46px;
    padding: 0 18px;
}

.auth-gender-select__option--active {
    background: #eef7f1;
}

.auth-gender-select__option + .auth-gender-select__option {
    border-top: 1px solid rgba(34, 160, 80, 0.12);
}

.auth-gender-select__option:last-child {
    border-bottom: 0;
}

.auth-gender-select__value {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.auth-gender-emoji {
    width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 16px;
    font-size: 14px;
    line-height: 1;
}

.auth-gender-select__trigger .auth-gender-select__value span:last-child {
    color: #203626;
}

.auth-gender-select__trigger--placeholder
    .auth-gender-select__value
    span:last-child {
    color: #b5c5ba;
}

.auth-gender-select__arrow {
    width: 8px;
    height: 8px;
    border-right: 1.5px solid #95ab9e;
    border-bottom: 1.5px solid #95ab9e;
    transform: rotate(45deg);
    transition: transform 0.2s ease;
    margin-right: 2px;
}

.auth-gender-select__arrow--open {
    transform: rotate(-135deg);
}

.auth-gender-select__check {
    color: #1fa654;
    font-size: 16px;
    line-height: 1;
}

.auth-agreement {
    margin: 6px 0 18px;
    font-size: 12px;
    line-height: 19px;
}

.auth-agreement :deep(.van-checkbox) {
    display: flex;
    align-items: flex-start;
}

.auth-agreement :deep(.van-checkbox__icon) {
    flex: 0 0 20px;
    width: 20px;
    height: 20px;
    margin-top: 0;
}

.auth-agreement :deep(.van-checkbox__icon .van-icon) {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: 2px solid #a9e5c1;
    background: #fff;
    color: transparent;
    font-size: 14px;
    line-height: 18px;
    box-sizing: border-box;
    transition:
        background-color 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;
}

.auth-agreement :deep(.van-checkbox__icon--checked .van-icon) {
    border-color: var(--theme-primary);
    background: var(--theme-primary);
    color: #fff;
}

.auth-agreement :deep(.van-checkbox__label) {
    flex: 1;
    min-width: 0;
    margin-left: 6px;
    color: #64826e;
    line-height: 19px;
}

.auth-agreement__muted {
    color: #64826e;
}

.auth-agreement__link {
    color: #149347;
    margin-left: 4px;
    font-weight: 700;
}

.auth-submit {
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--theme-primary);
    /*box-shadow: 0 4px 16px var(--theme-button-shadow-strong);*/
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1px;
    transition:
        background 0.2s ease,
        box-shadow 0.2s ease,
        color 0.2s ease,
        opacity 0.2s ease;
}

.auth-submit--disabled {
    pointer-events: none;
    cursor: not-allowed;
    background: var(--theme-button-disabled);
    box-shadow: none;
    color: var(--theme-primary);
    opacity: 1;
}

.auth-footer,
.auth-help {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 4px;
    font-size: 12px;
    line-height: 18px;
}

.auth-footer {
    margin-top: 18px;
}

.auth-help {
    margin-top: 12px;
    margin-bottom: 10px;
}

.auth-footer__muted,
.auth-help__muted {
    color: #8caa94;
}

.auth-footer__link,
.auth-help__link {
    color: var(--theme-primary);
}
</style>
