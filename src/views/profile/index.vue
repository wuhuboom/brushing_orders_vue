<template>
  <main class="das-page profile-edit">
    <DasPageHeader title-key="das.page.profile" />
    <section>
      <van-uploader
        :after-read="uploadFile"
        :preview-image="false"
        accept="image/*"
        class="profile-avatar-uploader"
      >
        <span class="profile-avatar-preview">
          <ProfileAvatar
            :src="displayAvatar"
            alt=""
            @error="handleAvatarError"
          />
        </span>
      </van-uploader>
      <p>{{ $t("das.profile.changeAvatar") }}</p>
      <button type="button" :disabled="!selected || saving" @click="save">
        {{ $t("das.common.save") }}
      </button>
    </section>
  </main>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import { useUserStore } from "@/store/modules/user";
import { updateAvatar, userGetInfo } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import ProfileAvatar from "@/components/ProfileAvatar.vue";
import avatarFallback from "@/static/das/avatar-profile-raw.png";
import femaleAvatarFallback from "@/static/das/avatar-profile-raw-female.png";
import { defaultAvatarForUser } from "@/utils/avatar";
import { safeBack } from "@/utils/navigation";

const base = window.g?.VITE_API_IMG_URL || import.meta.env.VITE_API_IMG_URL || "";
const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();
const selected = ref();
const saving = ref(false);
const currentUser = ref(userStore.userInfo || {});
const avatarUrl = ref("");
let previewObjectUrl = "";

const defaultAvatar = computed(() =>
  defaultAvatarForUser(currentUser.value, {
    male: avatarFallback,
    female: femaleAvatarFallback,
  }),
);

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
    currentUser.value = user;
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
