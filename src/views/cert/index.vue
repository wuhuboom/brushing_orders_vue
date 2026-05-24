<template>
  <div class="plain-design-page cert-page">
    <PageTopBar :title="$t('certificate')" show-back @click-left="onClickLeft" />

    <main class="cert-content">
      <img
        src="@/static/images/certprod2.png"
        class="certificate-image"
        :alt="$t('certificate')"
        @click="openContentPreview"
      />
    </main>

    <van-image-preview
      v-if="!isPc"
      v-model:show="showCertPreview"
      :images="certContentPreviewImages"
      :start-position="0"
      closeable
      close-icon="cross"
    />

    <transition name="cert-desktop-preview-fade">
      <div
        v-if="isPc && showCertPreview"
        class="cert-desktop-preview"
        @click.self="showCertPreview = false"
      >
        <button
          class="cert-desktop-preview__close"
          type="button"
          :aria-label="$t('close_preview')"
          @click="showCertPreview = false"
        >
          ×
        </button>
        <div class="cert-desktop-preview__panel">
          <img
            :src="certProductImage"
            class="cert-desktop-preview__image"
            :alt="$t('certificate_preview')"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import PageTopBar from "@/components/PageTopBar.vue";
import { onMounted, onUnmounted, ref } from 'vue';
import certProductImage from '@/static/images/certprod2.png';

const showCertPreview = ref(false);
const certContentPreviewImages = [certProductImage];
const isPc = ref(false);

const openContentPreview = () => {
  showCertPreview.value = true;
};

const onClickLeft = () => {
  history.back();
};

const updateDeviceMode = () => {
  isPc.value = window.matchMedia("(min-width: 768px)").matches;
};

onMounted(() => {
  updateDeviceMode();
  window.addEventListener("resize", updateDeviceMode);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateDeviceMode);
});
</script>

<style scoped>
.plain-design-page {
  min-height: 100vh;
  background: #eef2f8;
  color: #111;
  font-family: inherit;
}

.design-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  height: 52px;
  display: grid;
  grid-template-columns: 56px 1fr 56px;
  align-items: center;
  background: #030303;
  color: #fff;
}

.design-title {
  text-align: center;
  font-size: 18px;
  line-height: 22px;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.design-back {
  width: 52px;
  height: 52px;
  border: 0;
  background: transparent;
  position: relative;
}

.design-back::before {
  content: '';
  position: absolute;
  left: 19px;
  top: 18px;
  width: 13px;
  height: 13px;
  border-left: 3px solid #fff;
  border-bottom: 3px solid #fff;
  transform: rotate(45deg);
  border-radius: 1px;
}


.cert-page :deep(.page-top-bar) {
  position: sticky;
  top: 0;
  left: auto !important;
  right: auto !important;
  width: 100% !important;
  max-width: none !important;
  transform: none !important;
}

.cert-content {
  padding: 28px 20px 48px;
}

.certificate-image {
  display: block;
  width: 100%;
  background: #fff;
  object-fit: contain;
}

.cert-desktop-preview {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 50%;
  z-index: 4000;
  width: var(--app-pc-max-width, 375px);
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.56);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.cert-desktop-preview__panel {
  width: 100%;
  max-height: calc(100vh - 64px);
  max-height: calc(100dvh - 64px);
  padding: 12px;
  border-radius: 16px;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0 16px 42px rgba(15, 23, 42, 0.2);
}

.cert-desktop-preview__image {
  display: block;
  width: 100%;
  max-height: calc(100vh - 88px);
  max-height: calc(100dvh - 88px);
  object-fit: contain;
}

.cert-desktop-preview__close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 26px;
  line-height: 1;
}

.cert-desktop-preview-fade-enter-active,
.cert-desktop-preview-fade-leave-active {
  transition: opacity 0.24s ease;
}

.cert-desktop-preview-fade-enter-from,
.cert-desktop-preview-fade-leave-to {
  opacity: 0;
}
</style>
