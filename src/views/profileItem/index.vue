<template>
    <div class="profile-item-page min-h-screen bg-[#F5F8F7]">
        <AppLoadingScreen :visible="isUploading" />
        <PageTopBar
            :title="$t('modify_information')"
            show-back
            @click-left="onClickLeft"
        />

        <div class="px-[22px] pt-[75px] pb-[32px]">
            <div class="flex flex-col items-center pt-[8px]">
                <div class="relative" @click="triggerUploader">
                    <div class="avatar-wrap">
                        <img
                            :src="previewAvatar"
                            alt="avatar"
                            class="avatar-img"
                            @error="(e) => (e.target.src = userImg)"
                        />
                    </div>
                    <div class="avatar-camera">
                        <!-- <van-icon name="photograph" size="14" color="#fff" /> -->
                        <img src="@/static/images/auth/camer.png" alt="" />
                    </div>
                    <van-uploader
                        ref="uploaderRef"
                        v-model="fileList"
                        :after-read="afterRead"
                        reupload
                        max-count="1"
                        class="hidden-uploader"
                    />
                </div>

                <div
                    class="mt-[12px] text-[28px] leading-[34px] text-[#1D2B24] font-medium"
                >
                    {{
                        userStore.userInfo.username || userInfo.username || "--"
                    }}
                </div>
                <div class="vip-badge mt-[10px]">VIP1</div>
            </div>

            <div class="security-card mt-[28px]">
                <div class="security-icon">
                    <img src="@/static/images/auth/securityic.png" alt="" />
                </div>
                <div class="ml-[12px] flex-1 min-w-0">
                    <div
                        class="text-[16px] leading-[22px] text-white font-medium"
                    >
                        {{ $t("account_security") }}
                    </div>
                    <div
                        class="mt-[4px] text-[12px] leading-[17px] text-white/85"
                    >
                        {{ $t("keep_account_updated_secure") }}
                    </div>
                </div>
            </div>

            <div class="info-card mt-[20px]">
                <div class="info-row">
                    <div class="row-icon">
                        <img src="@/static/images/auth/celllist1.png" alt="" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="row-title">{{ $t("username") }}</div>
                        <div class="row-subtitle">
                            {{
                                userStore.userInfo.username ||
                                userInfo.username ||
                                "--"
                            }}
                        </div>
                    </div>
                </div>

                <div class="info-row">
                    <div class="row-icon">
                        <img src="@/static/images/auth/celllist2.png" alt="" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="row-title">{{ $t("phone") }}</div>
                        <div class="row-subtitle">{{ maskedPhone }}</div>
                    </div>
                </div>

                <div
                    class="info-row cursor-pointer"
                    @click="toPage('/updatePassword')"
                >
                    <div class="row-icon">
                        <img src="@/static/images/auth/celllist3.png" alt="" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="row-title">{{ $t("update_password") }}</div>
                        <div class="row-subtitle">
                            {{ $t("change_login_password") }}
                        </div>
                    </div>
                    <van-icon name="arrow" color="#7BA78A" size="18" />
                </div>

                <div
                    class="info-row no-border cursor-pointer"
                    @click="toPage('/updateTransactionPassword')"
                >
                    <div class="row-icon">
                        <img src="@/static/images/auth/celllist4.png" alt="" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="row-title">
                            {{ $t("update_transaction_password") }}
                        </div>
                        <div class="row-subtitle">
                            {{ $t("change_transaction_pin") }}
                        </div>
                    </div>
                    <van-icon name="arrow" color="#7BA78A" size="18" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../store/modules/user";
import { updateAvatar, upload, userGetInfo } from "../../api/apis";
import { showSuccessToast } from "@/util/message";
import { useI18n } from "vue-i18n";
import AppLoadingScreen from "@/components/AppLoadingScreen.vue";

const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();
const uploaderRef = ref(null);
const fileList = ref([]);
const userInfo = ref({});
const avatarUrl = ref("");
const VITE_API_IMG_URL = window.g.VITE_API_IMG_URL;
const user4 = new URL("@/static/images/user4.png", import.meta.url).href;
const userImg = new URL("@/static/images/userImg.png", import.meta.url).href;
const isUploading = ref(false);
const previewAvatar = computed(() => {
    if (fileList.value?.[0]?.url) return fileList.value[0].url;
    return userStore.userInfo?.avatar || userInfo.value?.avatar || user4;
});

const maskedPhone = computed(() => {
    const phone = userStore.userInfo?.phone || userInfo.value?.phone || "";
    if (!phone) return "--";
    if (phone.length < 7) return phone;
    return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
});

const fetchUserInfo = async () => {
    await userStore.getUserInfo();
    const res = await userGetInfo();
    userInfo.value = res.data || {};
    const avatar = userInfo.value.avatar || userStore.userInfo?.avatar || user4;
    avatarUrl.value = userInfo.value.avatar || "";
    fileList.value = [{ url: avatar }];
};

const triggerUploader = () => {
    const input = uploaderRef.value?.$el?.querySelector('input[type="file"]');
    if (input) input.click();
};

const afterRead = async (file) => {
    isUploading.value = true;
    try {
        const uploadRes = await upload({ file: file.file });
        if (uploadRes.code !== 200) {
            showSuccessToast(uploadRes.msg || t("image_upload_failed"));
            fileList.value = [{ url: previewAvatar.value }];
            return;
        }

        avatarUrl.value = uploadRes.fileName;
        const fullAvatar = `${VITE_API_IMG_URL}${avatarUrl.value}`;
        fileList.value = [{ url: fullAvatar }];

        const updateRes = await updateAvatar({ avatar: fullAvatar });
        if (updateRes.code === 200) {
            showSuccessToast(t("avatar_updated_successfully"));
            await fetchUserInfo();
        } else {
            showSuccessToast(updateRes.msg || t("avatar_update_failed"));
        }
    } catch (error) {
        showSuccessToast(t("network_error"));
    } finally {
        isUploading.value = false;
    }
};

const toPage = (path) => {
    router.push({ path });
};

const onClickLeft = () => router.replace("/my");

onMounted(() => {
    fetchUserInfo();
});
</script>

<style scoped>
.profile-item-page :deep(.van-nav-bar) {
    background: #ffffff;
}

.profile-item-page :deep(.van-nav-bar__title) {
    color: #24352d;
    font-size: 22px;
    font-weight: 500;
}

.profile-item-page :deep(.van-nav-bar .van-icon) {
    color: #23a455;
    font-size: 20px;
}

.profile-item-page :deep(.van-nav-bar::after) {
    border-bottom: 1px solid #dbe9df;
}

.avatar-wrap {
    width: 86px;
    height: 86px;
    border-radius: 50%;
    border: 3px solid #d6efe0;
    background: #23a455;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(35, 164, 85, 0.12);
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-camera {
    position: absolute;
    right: -2px;
    bottom: 2px;
    width: 24px;
    height: 24px;
    /*border-radius: 50%;
    background: #23a455;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 8px rgba(35, 164, 85, 0.2);*/
    display: flex;
    align-items: center;
    justify-content: center;
}

.hidden-uploader {
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
}

.hidden-uploader :deep(.van-uploader__wrapper),
.hidden-uploader :deep(.van-uploader__upload) {
    width: 0;
    height: 0;
    overflow: hidden;
}

.vip-badge {
    min-width: 50px;
    height: 24px;
    padding: 0 12px;
    border-radius: 999px;
    background: #dcefe1;
    color: #5ba06f;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.security-card {
    display: flex;
    align-items: center;
    min-height: 62px;
    padding: 0 16px;
    border-radius: 16px;
    background: linear-gradient(135deg, #35c766 0%, #179249 100%);
}

.security-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.info-card {
    background: #ffffff;
    border: 1px solid #d5e7da;
    border-radius: 18px;
    overflow: hidden;
}

.info-row {
    min-height: 72px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dbe9df;
}

.info-row.no-border {
    border-bottom: none;
}

.row-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: #e3f2e8;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;
}

.row-title {
    color: #24352d;
    font-size: 16px;
    line-height: 22px;
}

.row-subtitle {
    margin-top: 4px;
    color: #7ba78a;
    font-size: 13px;
    line-height: 18px;
}
</style>
