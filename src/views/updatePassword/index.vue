<template>
    <div class="password-page min-h-screen">
        <PageTopBar :title="pageTitle" show-back @click-left="onClickLeft" />

        <div class="page-body">
            <div class="form-card">
                <div class="field-block">
                    <div class="field-label">{{ $t("auto_old_login_password") }}</div>
                    <van-field
                        v-model="ruleForm.oldPassword"
                        :type="showOldPassword ? 'text' : 'password'"
                        placeholder=""
                        class="custom-field"
                    />
                </div>
                <div class="field-block">
                    <div class="field-label">{{ $t("auto_new_login_password") }}</div>
                    <van-field
                        v-model="ruleForm.newPassword"
                        :type="showNewPassword ? 'text' : 'password'"
                        placeholder=""
                        class="custom-field"
                    />
                </div>
                <div class="field-block field-block-last">
                    <div class="field-label">{{ $t("auto_confirm_new_login_password") }}</div>
                    <van-field
                        v-model="agentNewPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        placeholder=""
                        class="custom-field"
                    />
                </div>
            </div>

            <div class="password-note">
                {{ $t("strong_passwords_protect_account") }}
            </div>

            <van-button
                :class="['submit-btn', { 'submit-btn--active': isFormReady }]"
                block
                @click="submitForm"
            >{{ $t("auto_update") }}</van-button>
        </div>
    </div>
</template>

<script setup>
import PageTopBar from "@/components/PageTopBar.vue";
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
.password-page {
    min-height: 100vh;
    background: #eef2fa;
    color: #0d0f14;
}

.password-header {
    height: 68px;
    background: #000000;
    color: #ffffff;
}

.password-nav {
    height: 56px;
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr) 64px;
    align-items: center;
}

.password-title {
    text-align: center;
    color: #ffffff;
    font-size: 16px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: 0.04em;
    white-space: nowrap;
    text-transform: uppercase;
}

.password-back {
    width: 64px;
    height: 56px;
    border: none;
    outline: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.password-back span {
    width: 17px;
    height: 17px;
    border-left: 4px solid #ffffff;
    border-bottom: 4px solid #ffffff;
    transform: rotate(45deg);
    border-radius: 2px;
    margin-left: 8px;
}

.page-body {
    padding: 29px 20px 36px;
    min-height: calc(100vh - 68px);
    box-sizing: border-box;
}

.form-card {
    background: transparent;
    padding: 0;
}

.field-block {
    margin-bottom: 22px;
}

.field-block-last {
    margin-bottom: 0;
}

.field-label {
    margin-bottom: 13px;
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 14px;
    color: #000000;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.custom-field {
    height: 48px;
    min-height: 48px;
    border: 1px solid #d5deeb !important;
    border-radius: 7px;
    background: #ffffff !important;
    padding: 0 16px;
    display: flex;
    align-items: center;
    box-shadow: none;
}

.password-page :deep(.custom-field .van-field__body),
.password-page :deep(.custom-field .van-field__control) {
    height: 100%;
}

.password-page :deep(.custom-field .van-field__control) {
    color: #111827;
    font-size: 15px;
}

.password-page :deep(.custom-field .van-field__control::placeholder) {
    color: transparent;
}

.password-note {
    margin: 21px 2px 52px;
    color: #7b7d83;
    font-size: 14px;
    line-height: 1.35;
    font-weight: 400;
}

.submit-btn {
    height: 44px;
    border: none;
    border-radius: 7px;
    background: #3442e6;
    color: #ffffff;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.03em;
}

.submit-btn--active {
    background: #3442e6;
    color: #ffffff;
    box-shadow: none;
}
</style>
