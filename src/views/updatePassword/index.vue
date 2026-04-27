<template>
    <div class="password-page min-h-screen bg-[#F5F8F7]">
        <PageTopBar :title="pageTitle" show-back @click-left="onClickLeft" />

        <div class="page-body px-[16px] pt-[72px] pb-[36px]">
            <div class="hero-wrap">
                <div class="hero-icon">
                    <img
                        src="@/static/images/auth/uppass.png"
                        alt=""
                        class="hero-icon__image"
                    />
                </div>
                <h1 class="hero-title">{{ titleText }}</h1>
                <p class="hero-desc">
                    {{ $t("strong_passwords_protect_account") }}
                </p>
            </div>

            <div class="form-card mt-[24px]">
                <div class="field-block">
                    <div class="field-label">
                        {{ $t("current_password_upper") }}
                    </div>
                    <van-field
                        v-model="ruleForm.oldPassword"
                        :type="showOldPassword ? 'text' : 'password'"
                        :placeholder="$t('enter_current_password')"
                        class="custom-field"
                    >
                        <template #left-icon>
                            <img
                                src="@/static/images/auth/auth-password.png"
                                alt=""
                                class="field-key-image"
                            />
                        </template>
                        <template #right-icon>
                            <van-icon
                                :name="showOldPassword ? 'eye-o' : 'closed-eye'"
                                size="18"
                                color="#7BA78A"
                                @click.stop="showOldPassword = !showOldPassword"
                            />
                        </template>
                    </van-field>
                </div>

                <div class="field-block">
                    <div class="field-label">
                        {{ $t("new_password_upper") }}
                    </div>
                    <van-field
                        v-model="ruleForm.newPassword"
                        :type="showNewPassword ? 'text' : 'password'"
                        :placeholder="$t('enter_new_password')"
                        class="custom-field"
                    >
                        <template #left-icon>
                            <img
                                src="@/static/images/auth/auth-password.png"
                                alt=""
                                class="field-key-image"
                            />
                        </template>
                        <template #right-icon>
                            <van-icon
                                :name="showNewPassword ? 'eye-o' : 'closed-eye'"
                                size="18"
                                color="#7BA78A"
                                @click.stop="showNewPassword = !showNewPassword"
                            />
                        </template>
                    </van-field>
                </div>

                <div class="field-block field-block-last">
                    <div class="field-label">
                        {{ $t("confirm_new_password_upper") }}
                    </div>
                    <van-field
                        v-model="agentNewPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        :placeholder="$t('re_enter_new_password')"
                        class="custom-field"
                    >
                        <template #left-icon>
                            <img
                                src="@/static/images/auth/auth-password.png"
                                alt=""
                                class="field-key-image"
                            />
                        </template>
                        <template #right-icon>
                            <van-icon
                                :name="
                                    showConfirmPassword ? 'eye-o' : 'closed-eye'
                                "
                                size="18"
                                color="#7BA78A"
                                @click.stop="
                                    showConfirmPassword = !showConfirmPassword
                                "
                            />
                        </template>
                    </van-field>
                </div>
            </div>

            <div class="mt-[18px]">
                <van-button
                    :class="[
                        'submit-btn',
                        { 'submit-btn--active': isFormReady },
                    ]"
                    block
                    @click="submitForm"
                >
                    {{ buttonText }}
                </van-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { editPassword } from "../../api/apis";
import { showFailToast, showSuccessToast } from "@/util/message";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const routePathStackKey = "route-path-stack";
const safeReturnPaths = ["/withdraw", "/profileItem", "/my"];

const agentNewPassword = ref("");
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const ruleForm = reactive({
    oldPassword: "",
    newPassword: "",
});

const titleCase = (value) =>
    String(value || "").replace(/\b\w/g, (char) => char.toUpperCase());

const pageTitle = computed(() => titleCase(t("update_password")));
const titleText = computed(() => titleCase(t("change_login_password")));
const buttonText = computed(() => titleCase(t("update_password")));

const isFormReady = computed(
    () =>
        !!ruleForm.oldPassword &&
        !!ruleForm.newPassword &&
        !!agentNewPassword.value,
);

const readRouteStack = () => {
    try {
        const stack = JSON.parse(
            sessionStorage.getItem(routePathStackKey) || "[]",
        );
        return Array.isArray(stack)
            ? stack.filter((path) => typeof path === "string" && path)
            : [];
    } catch (error) {
        console.warn("Failed to read route stack", error);
        return [];
    }
};

const getSafeReturnPath = () => {
    const stack = readRouteStack();
    const currentIndex = stack.lastIndexOf(route.path);
    const previousStack = (
        currentIndex >= 0 ? stack.slice(0, currentIndex) : stack
    )
        .filter((path) => path !== route.path)
        .reverse();
    return (
        previousStack.find((path) => safeReturnPaths.includes(path)) ||
        "/profileItem"
    );
};

const goBackAfterSave = () => {
    router.push({ path: getSafeReturnPath() });
};

const onClickLeft = () => goBackAfterSave();

const submitForm = async () => {
    if (!ruleForm.oldPassword)
        return showFailToast(t("please_enter_the_old_password"));
    if (!ruleForm.newPassword)
        return showFailToast(t("please_enter_a_new_password"));
    if (ruleForm.newPassword.length < 6 || ruleForm.newPassword.length > 18) {
        return showFailToast(t("please_enter_a_6_18_digit_password"));
    }
    if (ruleForm.newPassword !== agentNewPassword.value) {
        return showFailToast(t("passwords_do_not_match"));
    }
    await editPassword(ruleForm);
    showSuccessToast(t("modification_successful"));
    goBackAfterSave();
};
</script>

<style scoped>
.page-body {
    min-height: calc(100vh - 53px);
}

.hero-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.hero-icon {
    width: 88px;
    height: 88px;
    border-radius: 999px;
    background: #deeee3;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-icon__image {
    width: 26px;
    height: 26px;
}

.hero-title {
    margin-top: 16px;
    color: #22362c;
    font-size: 18px;
    line-height: 28px;
    font-weight: 500;
}

.hero-desc {
    max-width: 320px;
    margin-top: 8px;
    color: #7ba78a;
    font-size: 13px;
    line-height: 20px;
}

.form-card {
    border: 1px solid #d4e6d9;
    border-radius: 20px;
    background: #ffffff;
    padding: 16px;
}

.field-block {
    margin-bottom: 16px;
}

.field-block-last {
    margin-bottom: 0;
}

.field-label {
    margin-bottom: 10px;
    color: #6f9b7a;
    font-size: 11px;
    line-height: 15px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
}

.field-key-image {
    width: 16px;
    height: 16px;
}

.custom-field {
    min-height: 54px;
    border: 1px solid rgba(210, 235, 218, 1) !important;
    border-radius: 10px;
    background: rgba(240, 250, 243, 1) !important;
    border-radius: 14px;
    padding: 4px 12px;
    display: flex;
    align-items: center;
}

.password-page :deep(.custom-field .van-field__left-icon) {
    margin-right: 10px;
}

.password-page :deep(.custom-field .van-field__right-icon) {
    margin-left: 10px;
}

.password-page :deep(.custom-field .van-field__control) {
    color: #22362c;
    font-size: 15px;
}

.password-page :deep(.custom-field .van-field__control::placeholder) {
    color: #97aa9d;
}

.submit-btn {
    height: 54px;
    border: none;
    border-radius: 16px;
    background: #dfeee2;
    color: #6e9c7b;
    font-size: 15px;
    font-weight: 500;
}

.submit-btn--active {
    background: linear-gradient(135deg, #34c263 0%, #169741 100%);
    color: #ffffff;
    box-shadow: 0 10px 24px rgba(35, 164, 85, 0.16);
}
</style>
