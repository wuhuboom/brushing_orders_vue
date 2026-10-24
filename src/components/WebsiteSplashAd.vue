<script setup>
import { ref, watch } from "vue";
import { getWebsiteConfig } from "@/api/apis";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
const imageUrl = ref("");
const visible = ref(false);
let handledToken = "";

const resolveImageUrl = (path) => {
  const value = String(path ?? "").trim();
  if (!value || ["null", "undefined"].includes(value.toLowerCase())) return "";
  if (/^(?:https?:|data:|blob:)/i.test(value)) return value;
  return `${window.g?.VITE_API_IMG_URL || ""}${value}`;
};

const close = () => {
  visible.value = false;
};

watch(
  () => userStore.token,
  async (token, _previousToken, onCleanup) => {
    if (!token) {
      handledToken = "";
      imageUrl.value = "";
      visible.value = false;
      return;
    }
    if (handledToken === token) return;
    handledToken = token;

    let cancelled = false;
    onCleanup(() => {
      cancelled = true;
    });

    try {
      const response = await getWebsiteConfig();
      if (cancelled || userStore.token !== token) return;
      const url = resolveImageUrl(response?.data?.popUpImage);
      if (!url) return;
      imageUrl.value = url;
      visible.value = true;
    } catch (_) {
      // The splash advertisement is optional and must never block login.
    }
  },
);
</script>

<template>
  <div
    v-if="visible"
    class="splash-ad"
    role="dialog"
    aria-modal="true"
    aria-label="Advertisement"
    @click.self="close"
  >
    <div class="splash-ad__content">
      <button
        class="splash-ad__close"
        type="button"
        aria-label="Close"
        @click="close"
      >
        ×
      </button>
      <img :src="imageUrl" alt="" @error="close" />
    </div>
  </div>
</template>

<style scoped>
.splash-ad {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(7, 18, 14, 0.72);
}

.splash-ad__content {
  position: relative;
  width: min(100%, 560px);
  max-height: calc(100dvh - 48px);
}

.splash-ad__content img {
  display: block;
  width: 100%;
  max-height: calc(100dvh - 48px);
  object-fit: contain;
  border-radius: 18px;
}

.splash-ad__close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  width: 36px;
  height: 36px;
  padding: 0 0 3px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.52);
  color: #fff;
  font-size: 27px;
  line-height: 1;
}
</style>
