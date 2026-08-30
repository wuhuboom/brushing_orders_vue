<template>
  <header class="das-header">
    <button
      class="das-brand"
      type="button"
      aria-label="Brain Power home"
      @click="safeReplace(router, '/')"
    >
      <img src="@/static/brain/logo.png" alt="Brain Power" />
    </button>
    <div class="das-header__actions">
      <button class="das-contact" type="button" @click="customer">
        {{ $t("das.nav.contact") }}
      </button>
      <button class="das-avatar" type="button" @click="openMy">
        <img src="@/static/brain/header-avatar.png" alt="" />
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

<style scoped>
.das-header {
  width: 100%;
  height: 56px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  background:
    radial-gradient(circle at 100% 0, rgba(62, 40, 181, 0.2), transparent 42%),
    #03091a;
  color: #fff;
  position: relative;
  z-index: 20;
  border-bottom: 1px solid rgba(39, 81, 146, 0.28);
  font-family: "SF Pro Display", Arial, sans-serif;
}
.das-brand {
  width: 122px;
  height: 38px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.das-brand img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: left center;
}
.das-header__actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}
.das-contact {
  min-width: 92px;
  height: 34px;
  padding: 0 15px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(110deg, #ef2d18, #f28705);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  box-shadow: 0 0 16px rgba(240, 75, 16, 0.18);
}
.das-avatar {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(62, 139, 255, 0.75);
  border-radius: 50%;
  background:
    radial-gradient(circle at 36% 30%, rgba(52, 201, 255, 0.75), transparent 24%),
    linear-gradient(145deg, #132b5d, #091226);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 0 12px rgba(0, 137, 255, 0.38);
  overflow: hidden;
  padding: 0;
  position: relative;
}
.das-avatar img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
.das-avatar span {
  display: none;
}
@media (min-width: 600px) {
  .das-header {
    padding-left: 22px;
    padding-right: 22px;
  }
}
</style>
