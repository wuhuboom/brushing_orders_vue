<template>
  <header class="das-header page-header">
    <button
      class="das-brand page-header__brand"
      type="button"
      aria-label="Psybir home"
      @click="safeReplace(router, '/')"
    >
      <img src="/psybir/logo.png" alt="Psybir" />
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
        <img src="/psybir/profile.png" alt="" />
        <span>{{ initials }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import {
  profileNavigationAction,
  safePush,
  safeReplace,
} from "@/utils/navigation";

const router = useRouter();
const userStore = useUserStore();
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
