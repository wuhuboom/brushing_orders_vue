<template>
    <div class="profile-item-page min-h-screen">
        <AppLoadingScreen :visible="isUploading" />

        <PageTopBar
            :title="$t('modify_information')"
            show-back
            :back-aria-label="$t('back')"
            @click-left="onClickLeft"
        />

        <main class="profile-content">
            <van-uploader
                ref="uploaderRef"
                v-model="fileList"
                :after-read="afterRead"
                reupload
                max-count="1"
                class="hidden-uploader"
            />

            <section class="info-card">
                <div class="info-row">
                    <div class="row-icon">
                        <img
                            src="@/static/images/profile-item/profile-user.png"
                            alt=""
                        />
                    </div>
                    <div class="row-content">
                        <div class="row-title">{{ $t("username") }}</div>
                        <div class="row-subtitle">
                            {{
                                userStore.userInfo.username ||
                                userInfo.username ||
                                "--"
                            }}
                        </div>
                    </div>
                    <!-- <img
                        class="row-arrow"
                        src="@/static/images/profile-item/arrow1.png"
                        alt=""
                    /> -->
                </div>

                <div class="info-row">
                    <div class="row-icon">
                        <img
                            src="@/static/images/profile-item/profile-phone.png"
                            alt=""
                        />
                    </div>
                    <div class="row-content">
                        <div class="row-title">{{ $t("phone") }}</div>
                        <div class="row-subtitle">{{ maskedPhone }}</div>
                    </div>
                    <!-- <img
                        class="row-arrow"
                        src="@/static/images/profile-item/arrow1.png"
                        alt=""
                    /> -->
                </div>

                <div
                    class="info-row cursor-pointer"
                    @click="toPage('/updatePassword')"
                >
                    <div class="row-icon">
                        <img
                            src="@/static/images/profile-item/profile-password.png"
                            alt=""
                        />
                    </div>
                    <div class="row-content">
                        <div class="row-title">{{ $t("update_password") }}</div>
                        <div class="row-subtitle">
                            {{ $t("change_login_password") }}
                        </div>
                    </div>
                    <img
                        class="row-arrow"
                        src="@/static/images/profile-item/arrow1.png"
                        alt=""
                    />
                </div>

                <div
                    class="info-row no-border cursor-pointer"
                    @click="toPage('/updateTransactionPassword')"
                >
                    <div class="row-icon">
                        <img
                            src="@/static/images/profile-item/profile-trade.png"
                            alt=""
                        />
                    </div>
                    <div class="row-content">
                        <div class="row-title">
                            {{ $t("update_transaction_password") }}
                        </div>
                        <div class="row-subtitle">
                            {{ $t("change_transaction_pin") }}
                        </div>
                    </div>
                    <img
                        class="row-arrow"
                        src="@/static/images/profile-item/arrow1.png"
                        alt=""
                    />
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import PageTopBar from "@/components/PageTopBar.vue";
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
.profile-item-page {
    min-height: 100vh;
    background: #eef2fa;
    color: #111111;
}

.profile-header {
    height: 52px;
    background: #000000;
    color: #ffffff;
}

.profile-nav {
    height: 52px;
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr) 64px;
    align-items: center;
}

.profile-title {
    text-align: center;
    color: #ffffff;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.03em;
    white-space: nowrap;
}

.profile-back {
    width: 64px;
    height: 52px;
    border: none;
    outline: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.profile-back span {
    width: 16px;
    height: 16px;
    border-left: 4px solid #ffffff;
    border-bottom: 4px solid #ffffff;
    transform: rotate(45deg);
    border-radius: 2px;
    margin-left: 8px;
}

.profile-content {
    padding: 18px 20px 32px;
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

.info-card {
    background: #ffffff;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: none;
}

.info-row {
    min-height: 91px;
    padding: 0 28px 0 14px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eef1f6;
}

.info-row.no-border {
    border-bottom: none;
}

.row-icon {
    width: 40px;
    height: 40px;
    margin-right: 16px;
    flex-shrink: 0;
}

.row-icon img {
    width: 40px;
    height: 40px;
    display: block;
    object-fit: contain;
}

.row-content {
    flex: 1;
    min-width: 0;
}

.row-title {
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 14px;
    color: #000000;
    line-height: 23px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.row-subtitle {
    margin-top: 8px;
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 12px;
    color: #6b7280;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.row-arrow {
    width: 20px;
    height: 20px;
    object-fit: contain;
    margin-left: 12px;
    flex-shrink: 0;
}
</style>
