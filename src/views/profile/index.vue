<template>
  <DmkPcAccountShell active="edit">
    <DmkPcEditTabs active="profile">
      <div class="w-[50%] mx-auto mt-10">
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
    <div class="w-full p-4 text-white dmk-profile-info-scope">
      <div class="text-3xl">{{ $t("das.dmk.editProfile") }}</div>
      <div class="mt-4">
        <div class="text-base">{{ $t("das.dmk.profileImage") }}</div>
        <div
          class="border-[1px] border-[var(--main-color)] p-2 rounded-md flex justify-between items-center mt-2"
        >
          <van-uploader
            :after-read="uploadFile"
            :preview-image="false"
            accept="image/*"
          >
            <div class="w-12 h-12">
              <img
                :src="displayAvatar"
                class="w-full h-full rounded-full object-cover"
                alt=""
                @error="handleAvatarError"
              />
            </div>
          </van-uploader>
          <button
            type="button"
            class="bg-[var(--main-color)] px-4 py-2 rounded-md text-black text-base"
            :disabled="!selected || saving"
            @click="save"
          >
            {{ $t("das.common.save") }}
          </button>
        </div>
      </div>
      <div
        v-for="section in passwordSections"
        :key="section.key"
        class="box w-full mt-4 p-4 py-3"
      >
        <button
          type="button"
          class="w-full flex justify-between items-center text-lg text-white text-left"
          @click="togglePasswordSection(section.key)"
        >
          <span>{{ $t(section.label) }}</span>
          <i
            class="van-badge__wrapper van-icon"
            :class="
              expandedPassword === section.key
                ? 'van-icon-arrow-up'
                : 'van-icon-arrow-down'
            "
            style="color: #fff; font-size: 24px"
          ></i>
        </button>
        <form
          v-if="expandedPassword === section.key"
          class="w-full"
          novalidate
          @invalid.capture.prevent
          @submit.prevent="submitPassword(section)"
        >
          <div class="h-[1px] bg-white mb-4 w-full mt-2"></div>
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
                          v-model="passwordForms[section.key][field.key]"
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
                  class="van-button van-button--default van-button--large"
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

const defaultAvatar = computed(() => "/dmk/assets/avatar.png");

const displayAvatar = computed(() => avatarUrl.value || defaultAvatar.value);

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
  avatarUrl.value = defaultAvatar.value;
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
    avatarUrl.value = path
      ? /^https?:/i.test(path)
        ? path
        : `${base}${path}`
      : defaultAvatar.value;
  } catch (_) {
    avatarUrl.value = defaultAvatar.value;
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
