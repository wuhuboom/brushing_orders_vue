<template>
    <div
        class="auth-shell auth-shell--login-page"
        :class="`auth-shell--lang-${currentLang.code}`"
    >
        <div class="auth-hero auth-hero--login">
            <img
                class="auth-hero__image"
                src="@/static/images/auth/algofy-login-hero.png"
                alt=""
            />
            <div class="auth-lang" @click="handleChangeLang">
                <span class="auth-lang__globe">◎</span>
                <span class="auth-lang__flag">{{ currentLang.flag }}</span>
                <span class="auth-lang__text">{{ currentLang.name }}</span>
                <span class="auth-lang__arrow"></span>
            </div>
            <div class="auth-brand">
                <img src="@/static/images/logo.png" alt="" />
            </div>
        </div>

        <div class="auth-card auth-card--login">
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
                        {{ $t("username") }}<span>*</span>
                    </div>
                    <el-form-item prop="">
                        <div class="auth-input">
                            <el-input
                                v-model.trim="ruleForm.username"
                                type="text"
                                :placeholder="$t('username')"
                                autocomplete="off"
                                size="large"
                            />
                        </div>
                    </el-form-item>
                </div>

                <div class="auth-field">
                    <div class="auth-field__label">
                        {{ $t("password") }}<span>*</span>
                    </div>
                    <el-form-item prop="">
                        <div class="auth-input">
                            <el-input
                                v-model="ruleForm.password"
                                :placeholder="$t('password')"
                                :type="showPassword ? 'text' : 'password'"
                                autocomplete="off"
                                size="large"
                            />
                        </div>
                    </el-form-item>
                </div>
            </el-form>

            <div class="auth-meta auth-meta--login">
                <label class="auth-check">
                    <input v-model="rememberMe" type="checkbox" />
                    <span class="auth-check__box"></span>
                    <span>{{ $t("auto_remember_me") }}</span>
                </label>
                <!-- <span class="auth-meta__link">
                    {{ $t("forgot_password_question") }}
                </span> -->
            </div>

            <div
                class="auth-submit"
                :class="{
                    'auth-submit--disabled': !isLoginReady || isSubmitting,
                }"
                :aria-disabled="!isLoginReady || isSubmitting"
                @click="submitForm(ruleFormRef)"
            >
                {{ $t("auto_sign_in") }}
            </div>

            <div class="auth-footer">
                <span class="auth-footer__muted">{{
                    $t("don_t_have_an_account")
                }}</span>
                <span class="auth-footer__link" @click="toRegister">{{
                    $t("auto_register")
                }}</span>
            </div>

            <div class="auth-footer auth-footer--help">
                <span class="auth-footer__muted">{{ $t("need_help") }}</span>
                <span class="auth-footer__link" @click="customer">{{
                    $t("auto_contact_customer")
                }}</span>
            </div>

            <div class="auth-copyright">
                {{ $t("auto_copyright_2025_algofy_company") }}<br />{{
                    $t("auto_all_rights_reserved")
                }}
            </div>
        </div>

        <Lang ref="langRef"></Lang>
        <AppLoadingScreen :visible="isSubmitting || isCustomerLoading" />
    </div>
</template>

<script setup>
import AppLoadingScreen from "@/components/AppLoadingScreen.vue";
import Lang from "@/components/Lang.vue";
import { computed, reactive, ref } from "vue";
import { showFailToast, showToast } from "@/util/message";
import { useCommonStore } from "@/store/modules/common";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { login, getTradeConfig } from "../../api/apis";
import { checkWorkTimeLocal } from "../../util/utils";
import { useUserStore } from "@/store/modules/user";
import { LANGS } from "@/config/lang";

const router = useRouter();
const { t } = useI18n();
const ruleFormRef = ref(null);
const userStore = useUserStore();
const langRef = ref(null);
const switchLeaving = ref(false);
const showPassword = ref(false);
const isSubmitting = ref(false);
const isCustomerLoading = ref(false);
const rememberMe = ref(false);
const ruleForm = reactive({
    email: "",
    password: "",
    username: "",
});
const commonStore = useCommonStore();
const rules = computed(() => {
    return {};
});
const currentLang = computed(() => LANGS[commonStore.lang] || LANGS.en);
const isLoginReady = computed(() =>
    Boolean(ruleForm.username && ruleForm.password),
);

function toRegister() {
    if (switchLeaving.value) return;
    switchLeaving.value = true;
    window.setTimeout(() => {
        router.push({ path: "/account/register" });
    }, 180);
}

function submitForm(formEl) {
    if (isSubmitting.value || !isLoginReady.value) return;
    formEl.validate((valid) => {
        if (valid) {
            const data = {
                username: ruleForm.username,
                password: ruleForm.password,
            };
            isSubmitting.value = true;
            login(data)
                .then((res) => {
                    userStore.setToken(`Bearer ${res.data.token}`);
                    userStore.setUserInfo(res.data.info);
                    return router.push({ path: "/" });
                })
                .catch((err) => {
                    showFailToast(
                        err?.msg || err?.message || t("network_error"),
                    );
                })
                .finally(() => {
                    isSubmitting.value = false;
                });
        }
    });
}

function handleChangeLang() {
    langRef.value.open();
}

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

        await router.push({
            path: "/customer",
        });
    } catch (error) {
        showToast(error?.msg || error?.message || t("network_error"));
    } finally {
        isCustomerLoading.value = false;
    }
};
</script>

<style scoped>
.auth-shell {
    min-height: 100vh;
    background: #161616 !important;
    position: relative;
    overflow: hidden;
    color: #ffffff;
}

.auth-shell--login-page {
    background: #161616 !important;
}

.auth-hero {
    position: relative;
    height: 323px;
    background: #161616;
    overflow: hidden;
}

.auth-shell--login-page .auth-brand {
    display: none;
}

.auth-hero__image {
    width: 100%;
    height: 323px;
    object-fit: cover;
    object-position: center top;
    display: block;
}

.auth-brand {
    display: none;
}

.auth-lang {
    position: absolute;
    top: 20px;
    right: 18px;
    z-index: 5;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: 156px;
    height: 42px;
    padding: 0 11px;
    border: 1px solid rgba(34, 160, 80, 0.18);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.94);
    color: #1d2b21;
    font-size: 14px;
    font-weight: 700;
    box-shadow: 0 8px 22px rgba(32, 125, 59, 0.1);
    box-sizing: border-box;
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
    flex: 0 0 20px;
    font-size: 0;
    line-height: 0;
}

.auth-shell--lang-en .auth-lang__flag {
    background-image: url("@/static/images/lang/en.png");
}

.auth-shell--lang-zh .auth-lang__flag,
.auth-shell--lang-zh-TW .auth-lang__flag,
.auth-shell--lang-zhTw .auth-lang__flag,
.auth-shell--lang-zh-tw .auth-lang__flag {
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
    margin: 0;
    padding: 0px 25px 34px;
    background: #161616 !important;
    color: #dde1ef;
    box-shadow: none !important;
    border: 0 !important;
}

.auth-card--login {
    min-height: calc(100vh - 323px);
    box-sizing: border-box;
}

.auth-form :deep(.el-form-item) {
    margin-bottom: 0;
}

.auth-form :deep(.el-form-item__content) {
    line-height: normal;
}

.auth-field + .auth-field {
    margin-top: 20px;
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
    color: #ff1d1d;
}

.auth-input {
    display: flex;
    align-items: center;
    width: 100%;
    height: 62px;
    padding: 0 14px;
    border: 1px solid #cfd6e2;
    border-radius: 8px;
    background: #ffffff;
    overflow: hidden;
    box-sizing: border-box;
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
    height: 60px;
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    outline: none !important;

    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 15px;
    color: #191919;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.auth-input :deep(.el-input__inner::placeholder) {
    color: #b4bac8;
}

.auth-input :deep(.el-input__wrapper.is-focus) {
    box-shadow: none !important;
}

.auth-input :deep(.el-input__suffix),
.auth-input :deep(.el-input__prefix) {
    display: none !important;
}

.auth-meta,
.auth-footer {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 5px;
    font-family: Montserrat, Montserrat;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.auth-meta {
    margin: 28px 0 36px;
    justify-content: space-between;
    align-items: center;
}

.auth-footer {
    margin-top: 23px;
}

.auth-footer--help {
    margin-top: 23px;
}

.auth-meta__muted,
.auth-footer__muted {
    color: #dde1ef;
}

.auth-meta__link,
.auth-footer__link {
    color: #778ff9;
}

.auth-check {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: Montserrat, Montserrat;
    font-weight: 400;
    font-size: 14px;
    color: #dbe2eb;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.auth-check input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.auth-check__box {
    width: 20px;
    height: 20px;
    border: 2px solid #dde1ef;
    border-radius: 4px;
    background: transparent;
    box-sizing: border-box;
    position: relative;
}

.auth-check input:checked + .auth-check__box::after {
    content: "";
    position: absolute;
    left: 5px;
    top: 1px;
    width: 6px;
    height: 11px;
    border-right: 2px solid #506eff;
    border-bottom: 2px solid #506eff;
    transform: rotate(40deg);
}

.auth-submit {
    height: 62px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #354bea;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #fafafa;
    line-height: 24px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.auth-submit--disabled {
    pointer-events: none;
    cursor: not-allowed;
    background: #354bea;
    color: #ffffff;
    opacity: 1;
}

.auth-copyright {
    margin-top: 108px;
    color: rgba(216, 220, 234, 0.42);
    font-size: 12px;
    line-height: 20px;
    text-align: center;
}
</style>
