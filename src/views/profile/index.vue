<template>
  <div class="profile-page min-h-screen bg-[#eef2fb]">
    <AppLoadingScreen :visible="isUploading" />
    <PageTopBar :title="$t('modify_information')" show-back @click-left="onClickLeft" />

    <div class="profile-page__body">
      <section class="profile-page__card">
        <div class="profile-page__avatar-wrap">
          <van-uploader
            v-model="fileList"
            :after-read="afterRead"
            reupload
            max-count="1"
            class="profile-page__uploader"
          />
        </div>
        <div class="profile-page__action">
          <span>{{ $t("click_to_change") }}</span>
          <van-icon name="edit" size="16" />
        </div>
        <div class="profile-page__desc">{{ $t("profile.str") }}</div>
      </section>

      <van-button class="profile-page__submit" block @click="updateAvatarMethods">
        {{ $t("update") }}
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { updateAvatar, upload, userGetInfo } from "../../api/apis";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { showSuccessToast } from "@/util/message";
import AppLoadingScreen from "@/components/AppLoadingScreen.vue";

const router = useRouter();
const onClickLeft = () => router.replace("/profileItem");
const { t } = useI18n();
const userInfo = ref({});
const avatarUrl = ref("");
const isUploading = ref(false);
const VITE_API_IMG_URL = window.g.VITE_API_IMG_URL;
const user4 = new URL("@/static/images/user4.png", import.meta.url).href;
const fileList = ref([]);

const afterRead = async (file) => {
  isUploading.value = true;
  try {
    const uploadRes = await upload({ file: file.file });
    if (uploadRes.code !== 200) {
      showSuccessToast(uploadRes.msg || t("image_upload_failed"));
      return;
    }
    avatarUrl.value = uploadRes.fileName;
  } catch (error) {
    showSuccessToast(t("network_error"));
  } finally {
    isUploading.value = false;
  }
};

const updateAvatarMethods = async () => {
  isUploading.value = true;
  try {
    const updateRes = await updateAvatar({ avatar: VITE_API_IMG_URL + avatarUrl.value });
    if (updateRes.code === 200) {
      showSuccessToast(t("avatar_updated_successfully"));
      router.push({
        path: "/profileItem",
      });
    } else {
      showSuccessToast(updateRes.msg || t("avatar_update_failed"));
    }
  } finally {
    isUploading.value = false;
  }
};

onMounted(() => {
  userGetInfo().then((res) => {
    userInfo.value = res.data;
    fileList.value.push({ url: userInfo.value.avatar == null ? user4 : userInfo.value.avatar });
    avatarUrl.value = userInfo.value.avatar;
  });
});
</script>

<style scoped>
.profile-page__body {
  padding: 92px 20px 36px;
}

.profile-page__card {
  padding: 36px 20px 28px;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(18, 25, 38, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-page__avatar-wrap {
  width: 132px;
  height: 132px;
  border-radius: 50%;
  overflow: hidden;
  background: #edf2ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-page__uploader :deep(.van-uploader__upload),
.profile-page__uploader :deep(.van-uploader__preview),
.profile-page__uploader :deep(.van-uploader__preview-image) {
  width: 132px;
  height: 132px;
  border-radius: 50%;
  overflow: hidden;
}

.profile-page__uploader :deep(.van-uploader__upload) {
  margin: 0;
  background: #edf2ff;
}

.profile-page__action {
  margin-top: 16px;
  color: #3550e8;
  font-size: 15px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.profile-page__desc {
  margin-top: 14px;
  color: #7a8496;
  font-size: 14px;
  line-height: 1.45;
  text-align: center;
}

.profile-page__submit {
  margin-top: 26px;
  height: 58px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(90deg, #3b45df 0%, #3a4be7 100%);
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
}
</style>
