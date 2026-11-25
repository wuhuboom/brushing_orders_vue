<template>
  <main class="das-page account-info-page">
    <DasPageHeader title-key="das.page.accountInfo" />
    <div class="account-info-page__scroll">
      <section class="poetic-account-identity">
        <div class="poetic-account-person">
          <AvatarUpload
            @updated="
              user = $event;
              avatarFailed = false;
            "
          >
            <template #default="{ open, uploading }">
              <button
                type="button"
                class="poetic-account-avatar"
                :aria-label="$t('das.profile.changeAvatar')"
                :disabled="uploading"
                @click="open"
              >
                <img :src="accountAvatar" alt="" @error="avatarFailed = true" />
              </button>
              <button type="button" class="wester-account-upload" :disabled="uploading" @click="open">
                <img src="/westermedia/camera.png" alt="" />{{ $t('das.design.uploadAvatar') }}
              </button>
            </template>
          </AvatarUpload>
          <div class="wester-account-name">
            <h2 :title="user.username || '—'">{{ user.username || "—" }}</h2>
            <span>{{ $t("das.wester.member") }}</span>
          </div>
        </div>
      </section>
      <section class="account-info-section">
        <h2>{{ $t("das.profile.account") }}</h2>
        <div class="account-info-field account-info-field--readonly">
          <strong>{{ $t("das.profile.username") }}</strong
          ><span>{{ user.username || "—" }}</span>
        </div>
        <div class="account-info-field account-info-field--readonly">
          <strong>{{ $t("das.profile.mobileNo") }}</strong
          ><span>{{ user.phoneNumber || user.phone || "—" }}</span>
        </div>
        <div class="account-info-field account-info-gender">
          <strong>{{ $t("das.profile.gender") }}</strong>
          <span class="account-info-gender-value">{{ gender }}</span>
          <div class="wester-gender-options" aria-hidden="true">
            <span :class="{ 'is-current': gender === $t('das.auth.male') }">{{ $t("das.auth.male") }}</span>
            <span :class="{ 'is-current': gender === $t('das.auth.female') }">{{ $t("das.auth.female") }}</span>
            <span>{{ $t("das.profileGroups.other") }}</span>
          </div>
        </div>
      </section>
      <section class="account-info-actions">
        <h2>{{ $t("das.page.security") }}</h2>
        <button
          class="account-info-action"
          type="button"
          @click="safePush(router, '/updatePassword')"
        >
          <span>{{ $t("das.page.loginPassword") }}</span
          ><i aria-hidden="true"><PoeticGlyph name="key" /></i>
        </button>
        <button
          class="account-info-action"
          type="button"
          @click="safePush(router, '/updateTransactionPassword')"
        >
          <span>{{ $t("das.page.fundPassword") }}</span
          ><i aria-hidden="true"><PoeticGlyph name="pin" /></i>
        </button>
      </section>
      <p class="account-design-copyright">{{ $t('das.common.copyright') }}</p>
    </div>
  </main>
</template>

<script setup>
import PoeticGlyph from "@/components/PoeticGlyph.vue";
import AvatarUpload from "@/components/AvatarUpload.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { userGetInfo } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import { useUserStore } from "@/store/modules/user";
import {
  defaultAvatarForUser,
  genderForUser,
  resolveProfileImageUrl,
} from "@/utils/avatar";
import { safePush } from "@/utils/navigation";
import maleAvatar from "/westermedia/avatar-male.png";
import femaleAvatar from "/westermedia/avatar-female.png";

const router = useRouter();
const { t } = useI18n();
const store = useUserStore();
const user = ref(store.userInfo || {});
const avatarFailed = ref(false);
const avatarUrl = computed(() =>
  resolveProfileImageUrl(user.value.avatar, window.g?.VITE_API_IMG_URL || ""),
);
watch(avatarUrl, () => {
  avatarFailed.value = false;
});
const accountAvatar = computed(() => {
  if (avatarUrl.value && !avatarFailed.value) return avatarUrl.value;
  return defaultAvatarForUser(user.value, {
    male: maleAvatar,
    female: femaleAvatar,
  });
});
const gender = computed(() => {
  const normalized = genderForUser(user.value);
  if (normalized === "male") return t("das.auth.male");
  if (normalized === "female") return t("das.auth.female");
  return "—";
});
onMounted(async () => {
  const initialUser = user.value;
  try {
    const response = await userGetInfo();
    if (user.value === initialUser && response.data) user.value = response.data;
  } catch (_) {}
});
</script>
