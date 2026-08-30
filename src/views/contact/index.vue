<template>
  <main class="das-page contact-page">
    <DasPageHeader title-key="das.page.contact" />
    <section class="contact-design-body">
      <img
        class="contact-design-hero"
        src="@/static/brain/contact-hero.png"
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
          <img
            class="contact-design-channel__arrow"
            :src="channelArrow"
            alt=""
          />
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
import channelArrow from "@/static/brain/contact-arrow.png";

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
  background: #01040f !important;
  background-image: none !important;
  color: #f7f8fc;
}
.contact-design-body {
  --contact-gutter: clamp(15px, 4vw, 20px);
  --contact-icon-size: clamp(32px, 8.53vw, 42px);
  width: 100%;
  min-height: calc(100vh - 111px);
  max-width: 720px;
  margin: 0 auto;
  padding: 6px var(--contact-gutter) 20px;
  display: flex;
  flex-direction: column;
}
.contact-design-hero {
  display: block;
  width: auto;
  aspect-ratio: 1343 / 825;
  margin: 0 clamp(5px, 1.33vw, 8px);
  object-fit: cover;
  border-radius: 12px;
}
.contact-design-heading {
  margin-top: 23px;
  text-align: center;
}
.contact-design-heading h2,
.contact-design-heading h3 {
  margin: 0;
  color: #fff;
  font-size: clamp(18px, 4.8vw, 32px);
  font-weight: 700;
  line-height: 1.22;
}
.contact-design-heading h2 {
  background: linear-gradient(90deg, #398bff, #3778ec);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.contact-design-heading h3 {
  margin-top: 12px;
}
.contact-design-intro {
  width: min(83.33vw, 610px);
  max-width: 100%;
  margin: 15px auto 0;
  color: #9ca4b7;
  font-size: clamp(13px, 3.47vw, 17px);
  line-height: 1.35;
  text-align: center;
}
.contact-design-channels {
  margin-top: 20px;
  display: grid;
  gap: 26px;
}
.contact-design-channels button {
  width: 100%;
  height: clamp(88px, 23.47vw, 112px);
  padding: 0 26px 0 29px;
  display: grid;
  grid-template-columns:
    var(--contact-icon-size) minmax(0, 1fr)
    var(--contact-icon-size);
  align-items: center;
  gap: 19px;
  border: 1px solid #1d3d71;
  border-radius: 16px;
  background: #0b0f1b;
  color: #fff;
  text-align: left;
  box-shadow: 0 0 18px rgba(18, 88, 201, 0.22);
}
.contact-design-channel__icon,
.contact-design-channel__arrow {
  width: var(--contact-icon-size);
  height: var(--contact-icon-size);
  display: block;
  object-fit: contain;
}
.contact-design-channel__copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 11px;
}
.contact-design-channel__copy b {
  overflow: hidden;
  color: #fff;
  font-size: clamp(16px, 4.27vw, 20px);
  font-weight: 400;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.contact-design-channel__copy small {
  color: #9ca4b7;
  font-size: clamp(13px, 3.47vw, 16px);
  line-height: 1;
}
.contact-design-channels > span {
  text-align: center;
  color: #9ca4b7;
}
.contact-design-copyright {
  width: calc(100% + (2 * var(--contact-gutter)));
  min-height: 81px;
  margin: auto calc(-1 * var(--contact-gutter)) -20px;
  padding: 0 var(--contact-gutter);
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(
      circle at 50% 100%,
      rgba(0, 159, 255, 0.2),
      transparent 31%
    ),
    #050817;
  color: #919aae;
  font-size: 11px;
  line-height: 1.25;
  text-align: center;
}

@media (min-width: 600px) {
  .contact-design-body {
    padding-top: 18px;
    padding-right: 20px;
    padding-left: 20px;
  }
  .contact-design-hero {
    width: 100%;
    max-width: 680px;
    margin-right: auto;
    margin-left: auto;
  }
  .contact-design-intro {
    max-width: 620px;
  }
}
</style>
