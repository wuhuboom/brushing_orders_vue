<template>
    <div class="auth-shell" :class="`auth-shell--lang-${currentLang.code}`">
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

        <div class="auth-card auth-card--login">
            <div
                class="auth-switch auth-switch--login"
                :class="{ 'auth-switch--to-register': switchLeaving }"
            >
                <div class="auth-switch__thumb"></div>
                <div class="auth-switch__item auth-switch__item--active">
                    {{ $t("login") }}
                </div>
                <div class="auth-switch__item" @click="toRegister">
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
                <el-form-item prop="">
                    <div class="auth-input">
                        <img
                            class="auth-input__icon"
                            src="@/static/images/auth/auth-phone.png"
                            alt=""
                        />
                        <el-input
                            v-model.trim="ruleForm.username"
                            type="text"
                            :placeholder="$t('username_phone')"
                            autocomplete="off"
                            size="large"
                        />
                    </div>
                </el-form-item>

                <el-form-item prop="">
                    <div class="auth-input">
                        <img
                            class="auth-input__icon"
                            src="@/static/images/auth/auth-lock.png"
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
                                    @click.stop="showPassword = !showPassword"
                                >
                                    <Hide v-if="showPassword" />
                                    <View v-else />
                                </el-icon>
                            </template>
                        </el-input>
                    </div>
                </el-form-item>
            </el-form>

            <div
                class="auth-submit mt-[20px] mb-[22px]"
                @click="submitForm(ruleFormRef)"
            >
                {{ $t("log_in") }}
            </div>

            <!-- <div class="auth-meta">
                <span class="auth-meta__muted">{{ $t("need_help") }}</span>
                <span class="auth-meta__link" @click="customer">
                    {{ $t("contact_customer_service") }}
                </span>
            </div> -->

            <!-- <div class="auth-footer">
        <span class="auth-footer__muted">{{ $t("don_t_have_an_account") }}</span>
        <span class="auth-footer__link" @click="toRegister">
          {{ $t("register_now") }}
        </span>
      </div> -->
        </div>

        <Lang ref="langRef"></Lang>
        <ContactUs ref="ContactUsRef"></ContactUs>
        <AppLoadingScreen :visible="isSubmitting" />
    </div>
</template>

<script setup>
import AppLoadingScreen from "@/components/AppLoadingScreen.vue";
import Lang from "@/components/Lang.vue";
import ContactUs from "@/components/ContactUs.vue";
import { Hide, View } from "@element-plus/icons-vue";
import { computed, onMounted, reactive, ref } from "vue";
import { showFailToast, showToast } from "@/util/message";
import { useCommonStore } from "@/store/modules/common";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { login, getTradeConfig } from "../../api/apis";
import { checkWorkTimeLocal } from "../../util/utils";
import { useUserStore } from "@/store/modules/user";
import { LANGS } from "@/config/lang";

const ContactUsRef = ref(null);

const router = useRouter();
const { t } = useI18n();
const ruleFormRef = ref(null);
const userStore = useUserStore();
const langRef = ref(null);
const switchLeaving = ref(false);
const showPassword = ref(false);
const isSubmitting = ref(false);
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

function toRegister() {
    if (switchLeaving.value) return;
    switchLeaving.value = true;
    window.setTimeout(() => {
        router.push({ path: "/account/register" });
    }, 180);
}

function submitForm(formEl) {
    if (isSubmitting.value) return;
    if (!ruleForm.username) return showToast(t("username_phone_is_request"));
    if (!ruleForm.password) return showToast(t("please_enter_password"));
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
                    showFailToast(err?.msg || err?.message || t("network_error"));
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
    TradeInfor.value = res.data;
};

const customer = () => {
    const time = checkWorkTimeLocal(
        TradeInfor.value.workTimeStart,
        TradeInfor.value.workTimeEnd,
        userStore.zoneActive.tzName,
    );
    if (time) {
        ContactUsRef.value.open();
    } else {
        showToast(t("supportHours"));
    }
};

onMounted(() => {
    tradeConfig();
});
</script>

<style scoped>
.auth-shell {
    min-height: 100vh;
    background: linear-gradient(180deg, #eff8f1 0%, #f5faf6 42%, #f5faf6 100%);
    position: relative;
    overflow: hidden;
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
    min-width: 156px;
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
    padding: 0 0 28px;
    /*background: rgba(255, 253, 248, 0.9);*/
}

.auth-card--login {
    min-height: calc(100vh - 206px);
}

.auth-switch {
    display: flex;
    position: relative;
    padding: 4px;
    border-radius: 14px;
    background: #ebf8ee;
    margin-bottom: 24px;
    overflow: hidden;
}

.auth-switch__thumb {
    position: absolute;
    top: 4px;
    left: 4px;
    width: calc(50% - 4px);
    height: 41px;
    border-radius: 11px;
    background: linear-gradient(135deg, #34be64 0%, #148c41 100%);
    box-shadow: 0 3px 8px rgba(34, 160, 80, 0.25);
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

.auth-switch--to-register .auth-switch__thumb {
    transform: translateX(calc(100% + 4px));
}

.auth-switch--to-register .auth-switch__item:first-child {
    color: #789680;
}

.auth-switch--to-register .auth-switch__item:last-child {
    color: #fff;
}

.auth-title {
    font-size: 28px;
    line-height: 1.2;
    font-weight: 700;
    color: #153822;
    margin-bottom: 20px;
}

.auth-form :deep(.el-form-item) {
    margin-bottom: 14px;
}

.auth-form :deep(.el-form-item__content) {
    line-height: normal;
}

.auth-input {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 51px;
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

.auth-meta,
.auth-footer {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 4px;
    font-size: 12px;
    line-height: 18px;
}

.auth-meta {
    margin: 0 0 18px;
}

.auth-footer {
    margin-top: 18px;
}

.auth-meta__muted,
.auth-footer__muted {
    color: #8caa94;
}

.auth-meta__link,
.auth-footer__link {
    color: #22a050;
}

.auth-submit {
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #34be64 0%, #148c41 100%);
    box-shadow: 0 4px 16px rgba(34, 160, 80, 0.3);
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
}
</style>
