<template>
  <main class="das-page profile-edit">
    <DasPageHeader title-key="das.page.profile" />
    <section>
      <van-uploader
        v-model="files"
        :after-read="uploadFile"
        :max-count="1"
        :deletable="false"
        reupload
      />
      <p>{{ $t("das.profile.changeAvatar") }}</p>
      <button type="button" :disabled="!selected || saving" @click="save">
        {{ $t("das.common.save") }}
      </button>
    </section>
  </main>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import { useUserStore } from "@/store/modules/user";
import { updateAvatar, userGetInfo } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import avatarFallback from "@/static/das/avatar-profile-composed.png";
import femaleAvatarFallback from "@/static/das/avatar-profile-composed-female.png";
import { defaultAvatarForUser } from "@/utils/avatar";
import { safeBack } from "@/utils/navigation";
const base = window.g?.VITE_API_IMG_URL || import.meta.env.VITE_API_IMG_URL || "";
const router = useRouter(),
  { t } = useI18n(),
  userStore = useUserStore(),
  files = ref([]),
  selected = ref(),
  saving = ref(false);
const uploadFile = (entry) => {
  const item = Array.isArray(entry) ? entry[0] : entry;
  selected.value = item?.file instanceof Blob ? item.file : undefined;
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
    const u = (await userGetInfo()).data || {};
    const defaultAvatar = defaultAvatarForUser(u, {
      male: avatarFallback,
      female: femaleAvatarFallback,
    });
    const url = u.avatar
      ? /^https?:/i.test(u.avatar)
        ? u.avatar
        : `${base}${u.avatar}`
      : defaultAvatar;
    files.value = [{ url, isImage: true }];
  } catch (_) {
    files.value = [
      {
        url: defaultAvatarForUser(userStore.userInfo, {
          male: avatarFallback,
          female: femaleAvatarFallback,
        }),
        isImage: true,
      },
    ];
  }
});
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
.profile-edit :deep(.van-uploader__upload),
.profile-edit :deep(.van-uploader__preview-image) {
  width: 150px;
  height: 150px;
  border-radius: 50%;
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
