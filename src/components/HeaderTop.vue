<template>
  <header class="das-header">
    <button
      class="das-brand"
      type="button"
      :aria-label="$t('das.dmk.homeAria')"
      @click="safeReplace(router, '/')"
    >
      <img src="@/static/das/wordmark-cream.png" alt="DAS" />
    </button>
    <div class="das-header__actions">
      <button class="das-contact" type="button" @click="customer">
        {{ $t("das.nav.contact") }}
      </button>
      <button class="das-avatar" type="button" @click="safePush(router, '/my')">
        <img :src="avatar" alt="" @error="avatarFailed = true" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { safePush, safeReplace } from "@/utils/navigation";
import { openCustomerServiceDialog } from "@/utils/customerServiceDialog";

const router = useRouter();
const userStore = useUserStore();
const avatarFailed = ref(false);
const imageBaseUrl = window.g?.VITE_API_IMG_URL || "";
const avatar = computed(() => {
  const path = String(userStore.userInfo?.avatar || "").trim();
  if (!path || avatarFailed.value) return "/dmk/assets/avatar.png";
  return /^https?:/i.test(path) ? path : `${imageBaseUrl}${path}`;
});
const customer = () => openCustomerServiceDialog();
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
  overflow: hidden;
  color: #f7f5ec;
}
.das-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
@media (min-width: 600px) {
  .das-header {
    padding-left: 34px;
    padding-right: 34px;
  }
}
</style>
