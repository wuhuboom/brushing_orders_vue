<template>
  <main class="das-page contact-page">
    <DasPageHeader title-key="das.nav.contact" />
    <section class="contact-design-body">
      <img
        class="contact-design-hero"
        src="/worldofgood/logo-Cu7jN8a6.webp"
        alt=""
      />

      <div class="contact-design-heading">
        <h2>{{ $t("das.contact.letsTalk") }}</h2>
        <h3>{{ $t("das.contact.getInTouch") }}</h3>
      </div>
      <p class="contact-design-intro">{{ $t("das.contact.intro") }}</p>

      <div class="contact-design-channels">
        <button
          v-for="(item, index) in channels"
          :key="item.id || item.linkUrl"
          type="button"
          :aria-label="channelPresentation(item, index).title"
          @click="openChannel(item.linkUrl)"
        >
          <img
            class="contact-design-channel__icon"
            :src="channelPresentation(item, index).icon"
            alt=""
          />
          <span class="contact-design-channel__copy">
            <b>{{ channelPresentation(item, index).title }}</b>
            <small>{{ item.name || "Customer service" }}</small>
          </span>
          <svg
            class="contact-design-channel__arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
        <span v-if="loading">{{ $t("das.common.loading") }}</span>
        <span v-else-if="!channels.length">{{ $t("das.contact.empty") }}</span>
      </div>

      <small class="contact-design-copyright">
        {{ $t("das.common.copyright") }}
      </small>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getCustomerService } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import { useUserStore } from "@/store/modules/user";
import { buildCustomerServiceUrl } from "@/utils/customerServiceUrl";
import liveChatIcon from "@/static/brain/contact-live-chat.png";

const userStore = useUserStore();
const channels = ref([]),
  loading = ref(true);
const imageBaseUrl =
  window.g?.VITE_API_IMG_URL || import.meta.env.VITE_API_IMG_URL || "";
const resolveImageUrl = (image) => {
  if (!image) return liveChatIcon;
  if (/^(?:https?:)?\/\//i.test(image) || /^(?:data|blob):/i.test(image))
    return image;
  return `${imageBaseUrl.replace(/\/$/, "")}/${image.replace(/^\//, "")}`;
};
const channelPresentation = (item) => {
  const name = String(item.name || "").toLowerCase();
  const isTelegram = name.includes("telegram") || name.includes("telgeram");
  return {
    title: isTelegram ? "Telegram" : "Live chat",
    icon: resolveImageUrl(item.image),
  };
};
const openChannel = (url) => {
  const target = buildCustomerServiceUrl(url, {
    isLoggedIn: Boolean(userStore.token),
    user: userStore.userInfo,
  });
  if (target) window.open(target, "_blank", "noopener,noreferrer");
};
onMounted(async () => {
  try {
    channels.value = (await getCustomerService()).data || [];
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped>
.contact-page {
  min-height: 100vh;
  color: #151514;
}
.contact-design-body {
  width: 100%;
  min-height: calc(100dvh - 171px);
  margin: 0 auto;
  padding: 0 20px 24px;
  display: flex;
  flex-direction: column;
}
.contact-design-hero {
  display: block;
  width: 100%;
  height: 150px;
  padding: 44px;
  object-fit: contain;
  background: #caffad;
  border-radius: 12px;
}
.contact-design-heading {
  margin-top: 24px;
  text-align: center;
}
.contact-design-heading h2,
.contact-design-heading h3 {
  margin: 0;
  color: #435754;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
}
.contact-design-heading h3 {
  margin-top: 8px;
}
.contact-design-intro {
  margin: 16px 0 0;
  color: #151514;
  font-size: 15px;
  line-height: 1.5;
  text-align: center;
}
.contact-design-channels {
  margin-top: 26px;
  display: grid;
  gap: 18px;
}
.contact-design-channels button {
  width: 100%;
  min-height: 90px;
  padding: 18px 22px;
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 22px;
  align-items: center;
  gap: 18px;
  border: 1px solid #ffc0cb;
  border-radius: 15px;
  background: #fff;
  color: #151514;
  text-align: left;
  box-shadow: 0 8px 20px #43575412;
}
.contact-design-channel__icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.contact-design-channel__arrow {
  width: 22px;
  height: 22px;
  color: #6e817d;
}
.contact-design-channel__copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.contact-design-channel__copy b {
  color: #151514;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.2;
  overflow-wrap: anywhere;
}
.contact-design-channel__copy small {
  color: #6e817d;
  font-size: 14px;
  line-height: 1.3;
}
.contact-design-channels > span {
  text-align: center;
  color: #6e817d;
}
.contact-design-copyright {
  margin-top: auto;
  padding-top: 50px;
  display: block;
  color: #6e817d;
  font-size: 12px;
  line-height: 1.4;
  text-align: center;
}
@media (max-width: 430px) {
  .contact-design-body {
    padding: 0 16px 24px;
  }
  .contact-design-hero {
    height: 120px;
    padding: 30px;
  }
  .contact-design-heading h2,
  .contact-design-heading h3 {
    font-size: 24px;
  }
  .contact-design-intro {
    font-size: 14px;
  }
  .contact-design-channels button {
    padding: 16px;
    gap: 14px;
  }
}
</style>
