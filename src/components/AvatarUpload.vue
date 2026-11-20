<template>
  <slot :open="open" :uploading="uploading"></slot>
  <van-uploader
    ref="uploader"
    class="avatar-upload-input"
    :after-read="changeAvatar"
    :preview-image="false"
    :disabled="uploading"
    accept="image/*"
  />
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { showSuccessToast, showToast } from "vant";
import { updateAvatar, userGetInfo } from "@/api/apis";
import { useUserStore } from "@/store/modules/user";

const emit = defineEmits(["updated"]);
const { t } = useI18n();
const store = useUserStore();
const uploader = ref(null);
const uploading = ref(false);
const open = () => {
  if (!uploading.value) uploader.value?.chooseFile();
};
const changeAvatar = async (entry) => {
  const item = Array.isArray(entry) ? entry[0] : entry;
  const file = item?.file;
  if (!(file instanceof Blob) || uploading.value) return;
  uploading.value = true;
  try {
    await updateAvatar(file);
    const user = (await userGetInfo()).data || {};
    store.setUserInfo(user);
    emit("updated", user);
    showSuccessToast(t("das.common.success"));
  } catch (error) {
    showToast(error?.msg || error?.message || t("das.common.requestFailed"));
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped>
.avatar-upload-input {
  display: none;
}
</style>
