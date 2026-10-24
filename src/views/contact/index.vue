<template>
  <main class="das-page contact-page">
    <DasPageHeader title-key="das.nav.contact" />
    <section class="contact-design-body">
      <div class="psy-contact-hero">
        <img
          class="contact-design-hero"
          src="/psybir/support-hero.png"
          alt=""
        />
        <div class="psy-contact-hero-copy">
          <h2>
            <span>{{ $t("das.contact.heroLead") }}</span
            ><b>{{ $t("das.contact.heroAccent") }}</b>
          </h2>
          <p>{{ $t("das.contact.heroHint") }}</p>
        </div>
      </div>

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
            <small>{{ item.name || $t("das.contact.customerService") }}</small>
          </span>
          <span class="contact-design-channel__action">
            {{
              $t(
                channelPresentation(item).isTelegram
                  ? "das.contact.connect"
                  : "das.contact.start",
              )
            }}
            <img
              :src="
                channelPresentation(item).isTelegram
                  ? '/psybir/service-external.png'
                  : '/psybir/service-chevron.png'
              "
              alt=""
            />
          </span>
        </button>
        <div v-if="loading" class="contact-design-status">
          <ReferenceLoading />
        </div>
        <span v-else-if="!channels.length" class="contact-design-status">{{
          $t("das.contact.empty")
        }}</span>
      </div>

      <aside class="contact-design-service-info">
        <div class="contact-design-hours">
          <img src="/psybir/service-hours.png" alt="" />
          <div>
            <small>{{ $t("das.contact.operatingHours") }}</small
            ><b>{{ $t("das.contact.globalCoverage") }}</b>
          </div>
          <span>{{ $t("das.contact.coverageDays") }}</span>
        </div>
        <p>
          <img src="/psybir/info.png" alt="" /><span>{{
            $t("das.contact.responseTime")
          }}</span>
        </p>
      </aside>
      <small class="contact-design-copyright">
        {{ $t("das.common.copyright") }}
      </small>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import ReferenceLoading from "@/components/ReferenceLoading.vue";
import { getCustomerService } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import { useUserStore } from "@/store/modules/user";
import { buildCustomerServiceUrl } from "@/utils/customerServiceUrl";
import liveChatIcon from "@/static/psybir/live-chat.png";

const userStore = useUserStore();
const { t } = useI18n();
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
    title: t(isTelegram ? "das.contact.telegram" : "das.contact.liveChat"),
    isTelegram,
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
