<template>
  <header class="das-header">
    <component
      :is="navigationEnabled ? 'button' : 'span'"
      class="das-brand"
      type="button"
      aria-label="Amplava home"
      v-on="navigationEnabled ? { click: () => safeReplace(router, '/') } : {}"
    >
      <img src="@/static/amplava/logo.png" alt="Amplava" />
    </component>
    <div class="das-header__actions">
      <button class="das-contact" type="button" @click="customer">
        <img src="@/static/amplava/support.png" :alt="$t('das.nav.contact')" />
        <span class="das-contact__label" aria-hidden="true">{{
          $t("das.nav.contact")
        }}</span>
      </button>
      <component
        :is="navigationEnabled ? 'button' : 'span'"
        class="das-avatar"
        v-on="navigationEnabled ? { click: () => safePush(router, '/my') } : {}"
      >
        <img :src="avatar" alt="" @error="avatarFailed = true" />
      </component>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { safePush, safeReplace } from "@/utils/navigation";
import { defaultAvatarForUser } from "@/utils/avatar";
import maleAvatar from "@/static/amplava/avatar-male.png";
import femaleAvatar from "@/static/amplava/avatar-female.png";

defineProps({ navigationEnabled: { type: Boolean, default: true } });

const router = useRouter();
const userStore = useUserStore();
const imageBase = window.g?.VITE_API_IMG_URL || "";
const avatarFailed = ref(false);
const avatarPath = computed(() =>
  String(userStore.userInfo?.avatar ?? "").trim(),
);
watch(avatarPath, () => {
  avatarFailed.value = false;
});
const avatar = computed(() => {
  const path = avatarPath.value;
  if (
    !path ||
    ["null", "undefined"].includes(path.toLowerCase()) ||
    avatarFailed.value
  ) {
    return defaultAvatarForUser(userStore.userInfo, {
      male: maleAvatar,
      female: femaleAvatar,
    });
  }
  return /^https?:/i.test(path) ? path : imageBase + path;
});
const customer = () => safePush(router, "/contact");
</script>

<style scoped>
.das-header {
  width: 100%;
  height: 88px;
  padding: 26px 26px 14px 30px;
  display: flex;
  align-items: center;
  background: #14392c;
  color: #f7f5ec;
  position: relative;
  z-index: 20;
}
.das-brand {
  width: 34px;
  height: 42px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.das-brand img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.das-header__actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
.das-contact {
  min-width: 112px;
  height: 40px;
  padding: 0 22px;
  border: 0;
  border-radius: 999px;
  background: #f7f5ec;
  color: #17382d;
  font-size: 13px;
  font-weight: 700;
}
.das-avatar {
  width: 38px;
  height: 38px;
  border: 1px solid rgba(247, 245, 236, 0.65);
  border-radius: 50%;
  background: transparent;
  color: #f7f5ec;
  font-size: 13px;
  font-weight: 700;
}
@media (min-width: 600px) {
  .das-header {
    padding-left: 34px;
    padding-right: 34px;
  }
}
</style>
