<template>
  <main class="das-page account-info-page">
    <DasPageHeader title-key="das.page.accountInfo" />
    <div class="account-info-page__scroll">
      <section class="account-info-avatar">
        <AvatarUpload @updated="user = $event">
          <template #default="{ open, uploading }">
            <button
              class="account-info-avatar__button"
              type="button"
              :disabled="uploading"
              @click="open"
            >
              <img :src="accountAvatar" alt="" />
            </button>
            <button
              class="account-info-avatar__change"
              type="button"
              :disabled="uploading"
              @click="open"
            >
              <span>{{
                $t(
                  uploading ? "das.common.loading" : "das.profile.changeAvatar",
                )
              }}</span
              ><svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path
                  d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                />
              </svg>
            </button>
          </template>
        </AvatarUpload>
      </section>
      <section class="account-info-section">
        <h2>{{ $t("das.profile.myProfile") }}</h2>
        <div class="account-info-field account-info-field--readonly">
          <strong>{{ $t("das.profile.mobileNo") }}</strong
          ><span>{{ user.phoneNumber || user.phone || "—" }}</span>
        </div>
        <div class="account-info-field account-info-field--readonly">
          <strong>{{ $t("das.profile.username") }}</strong
          ><span>{{ user.username || "—" }}</span>
        </div>
        <div class="account-info-field account-info-gender">
          <strong>{{ $t("das.profile.gender") }}</strong>
          <div class="account-info-gender__options">
            <label v-for="option in ['male', 'female']" :key="option"
              ><input
                type="radio"
                :checked="gender === $t('das.auth.' + option)"
                disabled
              /><i aria-hidden="true"></i
              ><span>{{ $t("das.auth." + option) }}</span></label
            >
          </div>
        </div>
      </section>
      <section class="account-info-actions">
        <button
          class="account-info-action"
          type="button"
          @click="safePush(router, '/updatePassword')"
        >
          <span>{{ $t("das.page.loginPassword") }}</span
          ><i aria-hidden="true"></i>
        </button>
        <button
          class="account-info-action"
          type="button"
          @click="safePush(router, '/updateTransactionPassword')"
        >
          <span>{{ $t("das.page.fundPassword") }}</span
          ><i aria-hidden="true"></i>
        </button>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { userGetInfo } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import AvatarUpload from "@/components/AvatarUpload.vue";
import { genderForUser } from "@/utils/avatar";
import { safePush } from "@/utils/navigation";
const router = useRouter(),
  { t } = useI18n(),
  user = ref({});
const accountAvatar = computed(() => {
  const image = String(user.value.avatar || "").trim();
  if (!image) return "/worldofgood/user1-BYHgxI8z.png";
  return /^(?:https?:|data:|blob:)/i.test(image)
    ? image
    : `${window.g?.VITE_API_IMG_URL || import.meta.env.VITE_API_IMG_URL || ""}${image}`;
});
const gender = computed(() => {
  const normalized = genderForUser(user.value);
  if (normalized === "male") return t("das.auth.male");
  if (normalized === "female") return t("das.auth.female");
  return "—";
});
onMounted(async () => (user.value = (await userGetInfo()).data || {}));
</script>

