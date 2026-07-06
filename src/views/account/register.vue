<template>
    <div
        class="auth-shell auth-shell--register"
        :class="`auth-shell--lang-${currentLang.code}`"
    >
        <div class="auth-hero auth-hero--register">
            <img
                class="auth-hero__image"
                src="@/static/images/auth/algofy-register-hero.png"
                alt=""
            />
            <button class="auth-back" type="button" @click="toLogin">
                <van-icon name="arrow-left" size="28" color="#ffffff" />
            </button>
            <div class="auth-register-title">{{ $t("register") }}</div>
            <div v-if="false" class="auth-lang" @click="handleChangeLang">
                <span class="auth-lang__globe"></span>
                <img
                    v-if="currentLangIcon"
                    class="auth-lang__flag"
                    :src="currentLangIcon"
                    alt=""
                    aria-hidden="true"
                />
                <span
                    v-else
                    class="auth-lang__flag auth-lang__flag--fallback"
                ></span>
                <span class="auth-lang__text">{{ currentLang.name }}</span>
                <span class="auth-lang__arrow"></span>
            </div>
        </div>

        <div class="auth-card auth-card--register">
            <el-form
                ref="ruleFormRef"
                :model="ruleForm"
                status-icon
                :rules="rules"
                label-width="0"
                class="auth-form"
            >
                <div class="auth-field">
                    <div class="auth-field__label">
                        {{ $t("auto_full_name") }}<span>*</span>
                    </div>
                    <el-form-item prop="username">
                        <div class="auth-input">
                            <el-input
                                v-model="ruleForm.username"
                                :placeholder="''"
                                type="text"
                                autocomplete="off"
                                size="large"
                                @input="onUsernameInput"
                            />
                        </div>
                    </el-form-item>
                </div>

                <div v-if="isNeedPhone" class="auth-field">
                    <div class="auth-field__label">
                        {{ $t("auto_phone_no") }}<span>*</span>
                    </div>
                    <el-form-item prop="phone">
                        <div class="auth-input">
                            <el-input
                                v-model="ruleForm.phone"
                                :placeholder="''"
                                type="text"
                                autocomplete="off"
                                size="large"
                                @input="onPhoneInput"
                            />
                        </div>
                    </el-form-item>
                </div>

                <div class="auth-field">
                    <div class="auth-field__label">
                        {{ $t("auto_select") }}<span>*</span>
                    </div>
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
                                    <span class="auth-gender-emoji">{{
                                        $t("auto_m")
                                    }}</span>
                                    <span>{{ $t("male") }}</span>
                                </span>
                                <van-icon
                                    v-if="ruleForm.sex === 1"
                                    name="success"
                                    class="auth-gender-select__check"
                                    size="18"
                                />
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
                                    <span class="auth-gender-emoji">{{
                                        $t("auto_f")
                                    }}</span>
                                    <span>{{ $t("female") }}</span>
                                </span>
                                <van-icon
                                    v-if="ruleForm.sex === 2"
                                    name="success"
                                    class="auth-gender-select__check"
                                    size="18"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <div class="auth-field">
                    <div class="auth-field__label">
                        {{ $t("auto_transaction_password") }}<span>*</span>
                    </div>
                    <el-form-item prop="tradePassword">
                        <div class="auth-input">
                            <el-input
                                v-model="ruleForm.tradePassword"
                                :placeholder="''"
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
                            </el-input>
                        </div>
                    </el-form-item>
                </div>

                <div class="auth-field">
                    <div class="auth-field__label">
                        {{ $t("auto_login_password") }}<span>*</span>
                    </div>
                    <el-form-item prop="password">
                        <div class="auth-input">
                            <el-input
                                v-model="ruleForm.password"
                                :placeholder="''"
                                :type="showPassword ? 'text' : 'password'"
                                autocomplete="off"
                                size="large"
                            >
                            </el-input>
                        </div>
                    </el-form-item>
                </div>

                <div class="auth-field">
                    <div class="auth-field__label">
                        {{ $t("auto_confirm_password") }}<span>*</span>
                    </div>
                    <el-form-item prop="agentPassword">
                        <div class="auth-input">
                            <el-input
                                v-model="agentPassword"
                                :placeholder="''"
                                :type="
                                    showConfirmPassword ? 'text' : 'password'
                                "
                                autocomplete="off"
                                size="large"
                            >
                            </el-input>
                        </div>
                    </el-form-item>
                </div>

                <div class="auth-field">
                    <div class="auth-field__label">
                        {{ $t("auto_invite_code_required") }}
                    </div>
                    <el-form-item prop="inviteCode">
                        <div class="auth-input">
                            <el-input
                                v-model="ruleForm.inviteCode"
                                :placeholder="''"
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
                        checked-color="#4d63ff"
                        shape="round"
                        icon-size="20px"
                    >
                        <span class="auth-agreement__muted">{{
                            $t("auto_accept_our_s")
                        }}</span>
                        <span class="auth-agreement__link" @click.stop="jump">{{
                            $t("auto_terms_conditions")
                        }}</span>
                    </van-checkbox>
                </div>

                <div
                    class="auth-submit"
                    :class="{
                        'auth-submit--disabled':
                            !isRegisterReady || isSubmitting,
                    }"
                    :aria-disabled="!isRegisterReady || isSubmitting"
                    @click="sendCode"
                >
                    {{ $t("auto_submit") }}
                </div>

                <div class="auth-footer">
                    <span class="auth-footer__muted">{{
                        $t("need_help")
                    }}</span>
                    <span class="auth-footer__link" @click="customer">{{
                        $t("auto_contact_customer")
                    }}</span>
                </div>
            </el-form>
        </div>

        <Lang v-if="false" ref="langRef"></Lang>
        <AppLoadingScreen :visible="isSubmitting || isCustomerLoading" />
    </div>
</template>

<script setup>
import AppLoadingScreen from "@/components/AppLoadingScreen.vue";
import Lang from "@/components/Lang.vue";
import { Hide, View } from "@element-plus/icons-vue";
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { register, reqBeedPhone, getTradeConfig } from "../../api/apis";
import { showToast } from "@/util/message";
import { useCommonStore } from "@/store/modules/common";
import { useUserStore } from "@/store/modules/user";
import { checkWorkTimeLocal } from "../../util/utils";
import { LANGS } from "@/config/lang";
import { LANG_ICONS } from "@/config/langIcons";

const onUsernameInput = (val) => {
    ruleForm.username = val.replace(/[^a-zA-Z0-9]/g, "");
};

const onPhoneInput = (val) => {
    ruleForm.phone = val.replace(/\D/g, "");
};

const router = useRouter();
const { t } = useI18n();
const ruleFormRef = ref(null);
const langRef = ref(null);
const commonStore = useCommonStore();
const userStore = useUserStore();
const agentPassword = ref("");
const checked = ref(false);
const switchLeaving = ref(false);
const isSubmitting = ref(false);
const isCustomerLoading = ref(false);
const genderMenuOpen = ref(false);
const showTradePassword = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const needPhone = ref(1);

const ruleForm = reactive({
    username: "",
    phone: "",
    password: "",
    tradePassword: "",
    sex: null,
    inviteCode: "",
});

const REGISTER_FORM_CACHE_KEY = "skye_register_form_cache";
const REGISTER_FORM_CACHE_MAX_AGE = 30 * 60 * 1000;

const rules = computed(() => {
    return {};
});

const currentLang = computed(() => LANGS[commonStore.lang] || LANGS.en);
const currentLangIcon = computed(() => LANG_ICONS[currentLang.value.code]);

const isNeedPhone = computed(() => {
    return Number(needPhone.value) === 0;
});

const genderLabel = computed(() => {
    if (ruleForm.sex === 1) return t("male");
    if (ruleForm.sex === 2) return t("female");
    return t("Gender_fomt");
});

const genderEmoji = computed(() => {
    if (ruleForm.sex === 2) return "F";
    return "M";
});

const isRegisterReady = computed(() => {
    return Boolean(
        checked.value &&
        ruleForm.username &&
        (!isNeedPhone.value || ruleForm.phone) &&
        ruleForm.password &&
        ruleForm.sex &&
        agentPassword.value &&
        ruleForm.tradePassword &&
        ruleForm.inviteCode,
    );
});

function getNeedPhoneValue(res) {
    const value =
        res?.data?.needPhone ??
        res?.data?.need_phone ??
        res?.data?.value ??
        res?.data ??
        res?.needPhone ??
        res?.need_phone ??
        1;

    return Number(value) === 0 ? 0 : 1;
}

async function getNeedPhoneConfig() {
    try {
        const res = await reqBeedPhone();
        needPhone.value = getNeedPhoneValue(res);

        if (!isNeedPhone.value) {
            ruleForm.phone = "";
        }
    } catch (error) {
        needPhone.value = 1;
        ruleForm.phone = "";
    }
}

function clearRegisterFormCache() {
    try {
        sessionStorage.removeItem(REGISTER_FORM_CACHE_KEY);
    } catch (error) {}
}

function saveRegisterFormCache() {
    try {
        sessionStorage.setItem(
            REGISTER_FORM_CACHE_KEY,
            JSON.stringify({
                timestamp: Date.now(),
                ruleForm: {
                    username: ruleForm.username || "",
                    phone: ruleForm.phone || "",
                    password: ruleForm.password || "",
                    tradePassword: ruleForm.tradePassword || "",
                    sex: ruleForm.sex,
                    inviteCode: ruleForm.inviteCode || "",
                },
                agentPassword: agentPassword.value || "",
                checked: checked.value,
            }),
        );
    } catch (error) {}
}

function restoreRegisterFormCache() {
    try {
        const cache = sessionStorage.getItem(REGISTER_FORM_CACHE_KEY);
        if (!cache) return false;

        const data = JSON.parse(cache);
        clearRegisterFormCache();

        if (
            !data?.timestamp ||
            Date.now() - Number(data.timestamp) > REGISTER_FORM_CACHE_MAX_AGE
        ) {
            return false;
        }

        const cachedRuleForm = data.ruleForm || {};
        const cachedSex = Number(cachedRuleForm.sex);

        ruleForm.username = cachedRuleForm.username || "";
        ruleForm.phone = cachedRuleForm.phone || "";
        ruleForm.password = cachedRuleForm.password || "";
        ruleForm.tradePassword = cachedRuleForm.tradePassword || "";
        ruleForm.sex = [1, 2].includes(cachedSex) ? cachedSex : null;
        ruleForm.inviteCode = cachedRuleForm.inviteCode || "";
        agentPassword.value = data.agentPassword || "";
        checked.value = Boolean(data.checked);

        return true;
    } catch (error) {
        clearRegisterFormCache();
        return false;
    }
}

function toLogin() {
    if (switchLeaving.value) return;
    clearRegisterFormCache();
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

    if (!checked.value) {
        return showToast(t("please_tick_and_agree_to_the_argeement"));
    }

    if (!ruleForm.username) {
        return showToast(t("please_enter_username"));
    }

    const reg = /^[A-Za-z0-9]+$/;
    if (!reg.test(ruleForm.username)) {
        return showToast(t("user_name_input_space_or_special_symbol"));
    }

    if (isNeedPhone.value && !ruleForm.phone) {
        return showToast(t("please_enter_phone_number"));
    }

    if (!ruleForm.password) {
        return showToast(t("please_enter_a_6_digit_password"));
    }

    if (!ruleForm.sex) {
        return showToast(t("gender_cannot_be_empty"));
    }

    if (!agentPassword.value) {
        return showToast(t("please_enter_confirm_password"));
    }

    if (agentPassword.value != ruleForm.password) {
        return showToast(t("passwords_do_not_match"));
    }

    if (!/^\d{6}$/.test(ruleForm.tradePassword)) {
        return showToast(t("please_enter_a_6_digit_transaction_password"));
    }

    if (!ruleForm.inviteCode) {
        return showToast(t("please_enter_invitation_code"));
    }

    const submitForm = {
        ...ruleForm,
    };

    if (!isNeedPhone.value) {
        delete submitForm.phone;
    }

    isSubmitting.value = true;
    register(submitForm)
        .then(() => {
            clearRegisterFormCache();
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
    saveRegisterFormCache();
    router.push({
        path: "/tc",
    });
};

const TradeInfor = ref({});

const tradeConfig = async () => {
    const res = await getTradeConfig();
    TradeInfor.value = res.data || {};
    return TradeInfor.value;
};

const ensureTradeConfig = async () => {
    return tradeConfig();
};

const showSupportHoursToast = () => {
    showToast({
        content: t("supportHours"),
        key: "customer-support-hours",
    });
};

const customer = async () => {
    if (isCustomerLoading.value) return;

    isCustomerLoading.value = true;
    try {
        const tradeInfo = await ensureTradeConfig();

        if (tradeInfo?.workTimeStart && tradeInfo?.workTimeEnd) {
            const time = checkWorkTimeLocal(
                tradeInfo.workTimeStart,
                tradeInfo.workTimeEnd,
                userStore.zoneActive?.tzName,
            );

            if (!time) {
                showSupportHoursToast();
                return;
            }
        }

        saveRegisterFormCache();
        await router.push({
            path: "/customer",
        });
    } catch (error) {
        showToast(error?.msg || error?.message || t("network_error"));
    } finally {
        isCustomerLoading.value = false;
    }
};

onMounted(() => {
    restoreRegisterFormCache();

    const code = getHashParam("code");
    if (code) {
        ruleForm.inviteCode = code;
    }

    getNeedPhoneConfig();
});
</script>

<style scoped>
.auth-shell {
    min-height: 100vh;
    background: #181818 !important;
    position: relative;
    overflow-x: hidden;
    color: #ffffff;
    font-family: "Montserrat", "Avenir Next", Arial, sans-serif;
}

.auth-shell--register {
    overflow-y: auto;
    background: #181818 !important;
}

.auth-hero {
    position: sticky;
    top: 0;
    z-index: 100;
    height: 87px;
    background: #181818;
    overflow: visible;
    transform: translateZ(0);
}
.auth-shell--register .auth-hero {
    position: fixed;
    top: 0;
    left: 50%;
    width: min(100vw, var(--app-pc-max-width, 375px));
    transform: translateX(-50%);
}
.auth-shell--register .auth-card--register {
    margin-top: 117px;
}

@media (max-width: 767px) {
    .auth-shell--register .auth-hero {
        left: 0;
        width: 100%;
        transform: none;
    }
}

.auth-hero__image {
    width: 100%;
    height: 87px;
    object-fit: cover;
    display: block;
}

.auth-back {
    position: absolute;
    left: 18px;
    top: 63px;
    z-index: 2;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.auth-register-title {
    position: absolute;
    left: 50%;
    top: 66px;
    transform: translateX(-50%);
    color: #ffffff;
    font-size: 17px;
    line-height: 22px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
}

.auth-lang {
    position: absolute;
    right: 18px;
    top: 48px;
    z-index: 5;
    min-width: 142px;
    height: 44px;
    padding: 0 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.94);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #151923;
    font-size: 15px;
    line-height: 20px;
    font-weight: 700;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16);
    box-sizing: border-box;
}

.auth-lang__globe {
    width: 18px;
    height: 18px;
    border: 2px solid #2c9b52;
    border-radius: 50%;
    box-sizing: border-box;
    position: relative;
    flex: 0 0 18px;
}

.auth-lang__globe::before {
    content: "";
    position: absolute;
    left: 50%;
    top: -2px;
    bottom: -2px;
    width: 2px;
    background: #2c9b52;
    transform: translateX(-50%);
}

.auth-lang__flag {
    width: 22px;
    height: 15px;
    border-radius: 2px;
    object-fit: cover;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
    flex: 0 0 22px;
}

.auth-lang__flag--fallback {
    background: #e6eef8;
}

.auth-lang__text {
    max-width: 72px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.auth-lang__arrow {
    width: 8px;
    height: 8px;
    border-right: 2px solid #6d806f;
    border-bottom: 2px solid #6d806f;
    transform: rotate(45deg) translateY(-2px);
    flex: 0 0 8px;
}

.auth-card {
    position: relative;
    margin: 30px 20px 0;
    padding: 0 0 50px;
    background: #181818 !important;
}

.auth-form :deep(.el-form-item) {
    margin-bottom: 0;
}

.auth-form :deep(.el-form-item__content) {
    line-height: normal;
}

.auth-field {
    margin: 0;
}

.auth-field + .auth-field {
    margin-top: 19px;
}

.auth-field__label {
    margin-bottom: 12px;
    font-family: Montserrat, Montserrat;
    font-weight: 400;
    font-size: 15px;
    color: #dbe2eb;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.auth-field__label span {
    color: #ff1f1f;
}

.auth-input {
    display: flex;
    align-items: center;
    width: 100%;
    height: 48px;
    padding: 0 11px;
    border: 1px solid #c9d0df;
    border-radius: 8px;
    background: #ffffff;
    overflow: hidden;
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
    height: 46px;
    font-size: 16px;
    line-height: 46px;
    color: #1a1f29;
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    outline: none !important;
}

.auth-input :deep(.el-input__inner::placeholder) {
    color: transparent;
}

.auth-input :deep(.el-input__wrapper.is-focus) {
    box-shadow: none !important;
}

.auth-eye-icon {
    display: none;
}

.auth-gender-select {
    margin-bottom: 0;
}

.auth-gender-select__trigger {
    width: 100%;
    height: 48px;
    padding: 0 24px 0 12px;
    border: 1px solid #c9d0df;
    border-radius: 8px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: none;
}

.auth-gender-select__value {
    display: inline-flex;
    align-items: center;
    gap: 0;
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 15px;
    color: #191919;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.auth-gender-select__trigger--placeholder .auth-gender-select__value {
    color: #191919;
}

.auth-gender-emoji {
    display: none;
}

.auth-gender-select__arrow {
    width: 12px;
    height: 12px;
    border-right: 3px solid #181818;
    border-bottom: 3px solid #181818;
    transform: rotate(45deg) translateY(-4px);
    transition: transform 0.2s ease;
}

.auth-gender-select__arrow--open {
    transform: rotate(225deg) translateY(-1px);
}

.auth-gender-select__menu {
    margin-top: 8px;
    border-radius: 8px;
    border: 1px solid #c9d0df;
    background: #ffffff;
    overflow: hidden;
}

.auth-gender-select__option {
    width: 100%;
    min-height: 48px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #1a1f29;
    border-bottom: 1px solid #eef1f5;
}

.auth-gender-select__option:last-child {
    border-bottom: 0;
}

.auth-gender-select__option--active,
.auth-gender-select__check {
    color: #4d63ff;
}

.auth-agreement {
    margin: 18px 0 0;
    font-family: Montserrat, Montserrat;
    font-weight: 400;
    font-size: 12px;
    color: #dbe2eb;
    line-height: 16px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.auth-agreement :deep(.van-checkbox) {
    align-items: center;
}

.auth-agreement :deep(.van-checkbox__label) {
    margin-left: 6px;
    color: #d9dde8;
}

.auth-agreement :deep(.van-checkbox__icon) {
    font-size: 18px !important;
}

.auth-agreement :deep(.van-checkbox__icon .van-icon) {
    border-color: #d9dde8;
    background: transparent;
}

.auth-agreement :deep(.van-checkbox__icon--checked .van-icon) {
    border-color: #4d63ff;
    background: #4d63ff;
}

.auth-agreement__muted {
    color: #d9dde8;
}

.auth-agreement__link {
    color: #d9dde8;
}

.auth-submit {
    margin-top: 36px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #3547e8;
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 16px;
    color: #fafafa;
    line-height: 24px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.auth-submit--disabled {
    pointer-events: none;
    background: #7f838c;
    box-shadow: none;
    color: #ffffff;
    cursor: not-allowed;
}

.auth-footer {
    margin-top: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    font-family: Montserrat, Montserrat;
    font-weight: 400;
    font-size: 14px;
    color: #778ff9;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.auth-footer__muted {
    color: #d9dde8;
}

.auth-footer__link {
    color: #6d84ff;
}
</style>
