<template>
  <header class="das-header page-header">
    <button
      class="das-brand page-header__brand"
      type="button"
      aria-label="Poetic home"
      @click="safeReplace(router, '/')"
    >
      <img src="/poetic/logo.png" alt="Poetic" />
    </button>
    <div class="das-header__actions page-header__right">
      <button
        class="das-contact page-header__contact"
        type="button"
        @click="customer"
      >
        {{ $t("das.nav.contact") }}
      </button>
      <button
        class="das-avatar page-header__profile"
        type="button"
        @click="openMy"
      >
        <img :src="headerAvatar" @error="avatarFailed = true" alt="" />
        <span>{{ initials }}</span>
      </button>
      <PoeticNavigation />
    </div>
  </header>
</template>

<script setup>
import PoeticNavigation from "@/components/PoeticNavigation.vue";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { defaultAvatarForUser, resolveProfileImageUrl } from "@/utils/avatar";
import maleAvatar from "@/static/psybir/avatar-male.png";
import femaleAvatar from "@/static/psybir/avatar-female.png";
import {
  profileNavigationAction,
  safePush,
  safeReplace,
} from "@/utils/navigation";

const router = useRouter();
const userStore = useUserStore();
const avatarFailed = ref(false);
watch([() => userStore.token, () => userStore.userInfo?.avatar], () => {
  avatarFailed.value = false;
});
const headerAvatar = computed(() => {
  if (!userStore.token) return "/poetic/guest.png";
  if (!avatarFailed.value) {
    const url = resolveProfileImageUrl(
      userStore.userInfo?.avatar,
      window.g?.VITE_API_IMG_URL || "",
    );
    if (url) return url;
  }
  return defaultAvatarForUser(userStore.userInfo, {
    male: maleAvatar,
    female: femaleAvatar,
  });
});
const initials = computed(() => {
  const name = userStore.userInfo?.username || "DL";
  return name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
});
const customer = () => safePush(router, "/contact");
const openMy = () => {
  const currentPath = router.currentRoute.value.path;
  const previous = window.history.state?.back;
  const previousPath =
    typeof previous === "string" ? router.resolve(previous).path : "";
  const action = profileNavigationAction(currentPath, previousPath);

  if (action === "stay") return Promise.resolve(false);
  if (action === "back") {
    router.back();
    return Promise.resolve(true);
  }

  return action === "push"
    ? safePush(router, "/my")
    : safeReplace(router, "/my");
};
</script>
