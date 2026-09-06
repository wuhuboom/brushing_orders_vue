<template>
  <DmkPcAccountShell active="edit" breadcrumb-key="das.dmk.editProfile">
    <DmkPcEditTabs active="profile">
      <div class="nsg-profile-editor w-[50%] mx-auto mt-10">
        <div
          class="w-full flex flex-col items-center justify-center"
        >
          <van-uploader
            :after-read="uploadFile"
            :preview-image="false"
            accept="image/*"
          >
            <div
              class="w-20 h-20 ml-6 p-2 mr-6 border-2 rounded-full border-[rgba(255,255,255,.2)]"
            >
              <img
                v-if="displayAvatar"
                :src="displayAvatar"
                class="w-full h-full rounded-full object-cover"
                alt=""
                @error="handleAvatarError"
              />
            </div>
          </van-uploader>
          <div
            class="text-[#666] text-sm mt-2 flex items-center"
          >
            <div class="mr-1">{{ $t("das.dmk.profileImage") }}</div>
            <i
              class="van-badge__wrapper van-icon van-icon-edit"
              style="font-size: 16px"
            ></i>
          </div>
        </div>
        <div class="w-full mt-6">
          <button
            class="van-button van-button--default van-button--large"
            style="
              color: white;
              background: var(--main-color);
              border-color: var(--main-color);
            "
            type="button"
            :disabled="!selected || saving"
            @click="save"
          >
            <div class="van-button__content">
              <span class="van-button__text"
                ><span class="font-oswald text-black"
                  >{{ $t("das.dmk.update") }}</span
                ></span
              >
            </div>
          </button>
        </div>
      </div>
    </DmkPcEditTabs>
  </DmkPcAccountShell>
  <DmkH5Layout class="dmk-mobile-current">
    <div class="nsg-profile-editor-h5 w-full p-4 text-white dmk-profile-info-scope">
      <div class="nsg-mobile-page-title">
        <NsgBackButton type="button" :aria-label="$t('das.common.back')" @click="safeBack(router, '/my')" />
        <strong>{{ $t("das.dmk.editProfile") }}</strong>
        <span aria-hidden="true"></span>
      </div>
      <div class="nsg-mobile-profile-body">
        <div class="nsg-mobile-profile-avatar">
          <van-uploader
            :after-read="uploadFile"
            :preview-image="false"
            accept="image/*"
          >
            <div class="nsg-mobile-profile-avatar__image">
              <img
                v-if="displayAvatar"
                :src="displayAvatar"
                class="w-full h-full rounded-full object-cover"
                alt=""
                @error="handleAvatarError"
              />
              <img class="nsg-avatar-camera" src="/nsg16/icon-camera.png" alt="" />
            </div>
          </van-uploader>
          <button
            v-if="selected"
            type="button"
            class="nsg-mobile-profile-save"
            :disabled="!selected || saving"
            @click="save"
          >
            {{ $t("das.common.save") }}
          </button>
        </div>

        <div class="nsg-mobile-profile-fields">
          <label>
            <span>{{ $t("das.profile.username") }}</span>
            <div><img src="/nsg16/icon-user.png" alt="" /><strong>{{ profileUser.username || "—" }}</strong></div>
          </label>
          <label>
            <span>{{ $t("das.profile.gender") }}</span>
            <div><strong>{{ genderLabel }}</strong><img src="/nsg16/profile-chevron.png" alt="" /></div>
          </label>
          <label>
            <span>{{ $t("das.auth.phone") }}</span>
            <div><img src="/nsg16/icon-phone.png" alt="" /><strong>{{ profileUser.phoneNumber || profileUser.phone || "—" }}</strong></div>
          </label>
          <label>
            <span>{{ $t("das.auth.email") }}</span>
            <div><img src="/nsg16/icon-mail.png" alt="" /><strong>{{ profileUser.email || "—" }}</strong></div>
          </label>
        </div>

        <h2 class="nsg-mobile-security-title">{{ $t("das.page.security") }}</h2>
        <div class="nsg-mobile-security-grid">
          <button
            v-for="section in passwordSections"
            :key="section.key"
            type="button"
            :class="{ active: expandedPassword === section.key, 'is-login': section.key === 'login' }"
            @click="togglePasswordSection(section.key)"
          >
            <img class="nsg-security-icon" :src="section.key === 'login' ? '/nsg16/icon-login-password.png' : '/nsg16/icon-pin.png'" alt="" />
            <img class="nsg-security-arrow" src="/nsg16/security-arrow.png" alt="" />
            <strong>{{ $t(section.key === 'login' ? 'das.page.loginPassword' : 'das.page.fundPassword') }}</strong>
            <small>{{ $t(section.label) }}</small>
          </button>
        </div>

        <form
          v-if="expandedPassword"
          class="nsg-mobile-password-form"
          novalidate
          @invalid.capture.prevent
          @submit.prevent="submitPassword(passwordSections.find((item) => item.key === expandedPassword))"
        >
          <div class="w-full box-border flex flex-col">
            <div class="w-full flex flex-col mt-6">
              <div
                v-for="field in passwordFields"
                :key="field.key"
                class="w-full flex flex-col"
                :class="field.key === 'old' ? '' : 'mt-4'"
              >
                <div class="text-[#fff] text-base">{{ $t(field.label) }}</div>
                <div
                  class="w-full mt-2 overflow-hidden rounded-md bg-[#1a1a1a] border border-[#393939]"
                >
                  <div class="van-cell van-field">
                    <div class="van-cell__value van-field__value">
                      <div class="van-field__body">
                        <input
                        v-model="passwordForms[expandedPassword][field.key]"
                          class="van-field__control"
                          :placeholder="$t(field.label)"
                          type="password"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full mt-6">
                <button
                  class="nsg-password-submit van-button van-button--default van-button--large"
                  :class="{ 'is-ready': passwordReady }"
                  style="
                    color: white;
                    background: var(--main-color);
                    border-color: var(--main-color);
                  "
                  type="submit"
                  :disabled="passwordSubmitting"
                >
                  <div class="van-button__content">
                    <span class="van-button__text text-black">{{ $t("das.dmk.update") }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </DmkH5Layout>
</template>
<script setup>
import NsgBackButton from "@/components/dmk/NsgBackButton.vue";
import DmkPcAccountShell from "@/components/dmkPc/DmkPcAccountShell.vue";
import DmkPcEditTabs from "@/components/dmkPc/DmkPcEditTabs.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import { useUserStore } from "@/store/modules/user";
import {
  editPassword,
  editTradePassword,
  updateAvatar,
  userGetInfo,
} from "@/api/apis";
import { defaultAvatarForUser, genderForUser, hasUserAvatar } from "@/utils/avatar";
import { safeBack } from "@/utils/navigation";

const base =
  window.g?.VITE_API_IMG_URL || import.meta.env.VITE_API_IMG_URL || "";
const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();
const selected = ref();
const saving = ref(false);
const avatarUrl = ref("");
const expandedPassword = ref("");
const passwordSubmitting = ref(false);
const passwordForms = reactive({
  transaction: { old: "", new: "", confirm: "" },
  login: { old: "", new: "", confirm: "" },
});
const passwordFields = [
  { key: "old", label: "das.dmk.oldPassword" },
  { key: "new", label: "das.dmk.newPassword" },
  { key: "confirm", label: "das.dmk.confirmNewPassword" },
];
const passwordSections = [
  {
    key: "transaction",
    label: "das.dmk.updateTransactionPassword",
    oldField: "oldTradePassword",
    newField: "newTradePassword",
    submitter: editTradePassword,
  },
  {
    key: "login",
    label: "das.dmk.updateLoginPassword",
    oldField: "oldPassword",
    newField: "newPassword",
    submitter: editPassword,
  },
];
const profileUser = computed(() => userStore.userInfo || {});
const genderLabel = computed(() => {
  const gender = genderForUser(profileUser.value);
  return gender ? t(`das.auth.${gender}`) : "—";
});
const passwordReady = computed(() => {
  const values = passwordForms[expandedPassword.value];
  return Boolean(values?.old && values.new && values.confirm && values.new === values.confirm);
});
let previewObjectUrl = "";

const togglePasswordSection = (key) => {
  expandedPassword.value = expandedPassword.value === key ? "" : key;
};

const submitPassword = async (section) => {
  const values = passwordForms[section.key];
  if (!values.old || !values.new || !values.confirm) {
    return showToast(t("das.auth.required"));
  }
  if (values.new !== values.confirm) {
    return showToast(t("das.auth.passwordMismatch"));
  }
  if (passwordSubmitting.value) return;
  passwordSubmitting.value = true;
  try {
    await section.submitter({
      [section.oldField]: values.old,
      [section.newField]: values.new,
    });
    values.old = "";
    values.new = "";
    values.confirm = "";
    expandedPassword.value = "";
    showSuccessToast(t("das.common.success"));
  } catch (error) {
    showToast(error?.msg || error?.message || t("das.common.requestFailed"));
  } finally {
    passwordSubmitting.value = false;
  }
};

const displayAvatar = computed(() => avatarUrl.value);

const clearObjectUrl = () => {
  if (!previewObjectUrl) return;
  URL.revokeObjectURL(previewObjectUrl);
  previewObjectUrl = "";
};

const uploadFile = (entry) => {
  const item = Array.isArray(entry) ? entry[0] : entry;
  const file = item?.file instanceof Blob ? item.file : undefined;
  selected.value = file;
  if (!file) return;

  clearObjectUrl();
  previewObjectUrl = URL.createObjectURL(file);
  avatarUrl.value = previewObjectUrl;
};

const handleAvatarError = () => {
  if (avatarUrl.value === previewObjectUrl) return;
  avatarUrl.value = "";
};

const save = async () => {
  if (!selected.value || saving.value) return;
  saving.value = true;
  try {
    await updateAvatar(selected.value);
    const updatedUser = (await userGetInfo()).data || {};
    userStore.setUserInfo(updatedUser);
    showSuccessToast(t("das.common.success"));
    safeBack(router, "/my");
  } catch (error) {
    showToast(error?.msg || error?.message || t("das.common.requestFailed"));
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  try {
    const user = (await userGetInfo()).data || {};
    const path = String(user.avatar || "").trim();
    avatarUrl.value = hasUserAvatar(path)
      ? /^https?:/i.test(path)
        ? path
        : `${base}${path}`
      : defaultAvatarForUser(user);
  } catch (_) {
    // A failed request does not confirm that this user has no avatar.
  }
});

onUnmounted(clearObjectUrl);
</script>
<style scoped>
.profile-edit {
  min-height: 100%;
  background: #f7f5ec;
  color: #17382d;
}
.profile-edit section {
  padding: 70px 24px;
  text-align: center;
}
.profile-avatar-uploader {
  display: inline-flex;
}
.profile-avatar-preview {
  display: block;
  width: 150px;
  height: 150px;
  cursor: pointer;
  filter: drop-shadow(0 10px 17px rgba(8, 37, 27, 0.18));
}
.profile-edit p {
  color: #7b827c;
}
.profile-edit button {
  width: min(100%, 420px);
  height: 50px;
  margin-top: 25px;
  border: 0;
  border-radius: 999px;
  background: #14392c;
  color: white;
  font-weight: 700;
}
.profile-edit button:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}
</style>
