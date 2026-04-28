<template>
  <div class="container w-full min-h-[100vh] bg-[fff]">
    <AppLoadingScreen :visible="isUploading" />
    <PageTopBar :title="$t('modify_information')" show-back @click-left="onClickLeft" />
    <div class="w-full pl-6 pr-6 pt-[77px] box-border flex flex-col">
      <div class="w-full flex flex-col">
        <div class="w-full flex flex-col items-center justify-center mt-20">
          <van-uploader v-model="fileList" :after-read="afterRead" reupload max-count="1" />
          <div class="text-[#666] text-sm mt-2 flex items-center">
            <div class="mr-1 text-[var(--theme-primary)]">{{ $t("click_to_change") }}</div>
            <van-icon name="edit" />
          </div>
          <div class="text-[#666666] text-[14px] pt-[15px]">{{ $t("profile.str") }}</div>
          <div class="pc-fixed-bottom fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%]">
            <van-button class="w-full" style="background: var(--theme-button-gradient); color: #fff" @click="updateAvatarMethods">
              {{ $t("update") }}
            </van-button>
          </div>
        </div>
      </div>
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
