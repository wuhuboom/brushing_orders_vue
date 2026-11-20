<template>
  <main class="das-page contact-page">
    <DasPageHeader title-key="das.nav.contact" />
    <section class="contact-design-body">
      <p class="wester-concierge">{{ $t("das.wester.conciergeActive") }}</p>
      <div v-if="userStore.token && inviteCode" class="wester-contact-id">
        <img src="/westermedia/contact-id.png" alt="" />
        <div>
          <small>{{ $t("das.wester.depositInquiries") }}</small>
          <p>
            <span>{{ $t("das.profile.referralCode") }} <strong>{{ inviteCode }}</strong></span>
            <button type="button" @click="copyInviteCode">
              <img src="/westermedia/copy-invite.png" alt="" />
              {{ $t("das.profile.copyReferral") }}
            </button>
          </p>
        </div>
      </div>
      <div class="wester-contact-panel">
        <div class="wester-contact-status">
          <span>{{ $t("das.wester.liveSessionReady") }}</span>
          <span v-if="serviceHours"><img src="/westermedia/service-clock.png" alt="" />{{ $t("das.contact.operatingHours") }}</span>
        </div>
        <img class="wester-contact-art" src="/westermedia/support-illustration.png" alt="" />
        <h2>{{ $t("das.contact.liveChat") }}</h2>
        <p>{{ $t("das.contact.responseTime") }}</p>
        <div class="contact-design-channels">
        <button
          v-for="(item, index) in channels"
          :key="item.id || item.linkUrl"
          type="button"
          :class="{
            'is-telegram': channelPresentation(item, index).isTelegram,
          }"
          :aria-label="channelPresentation(item, index).title"
          @click="openChannel(item.linkUrl)"
        >
          <img
            class="contact-design-channel__icon"
            :src="channelPresentation(item, index).icon"
            alt=""
            @error="$event.target.style.display = 'none'"
            @load="$event.target.style.display = ''"
          />
          <span class="contact-design-channel__action">
            {{ channelPresentation(item).isTelegram ? channelPresentation(item).title : $t("das.wester.startLiveChat") }}
            <img src="/design500/arrow-white.png" alt="" />
          </span>
        </button>
        <div v-if="loading" class="contact-design-status">
          <ReferenceLoading />
        </div>
        <span v-else-if="!channels.length" class="contact-design-status">{{
          $t("das.contact.empty")
        }}</span>
        </div>
        <p v-if="serviceHours" class="wester-contact-hours">
          {{ $t("das.contact.operatingHours") }}: {{ serviceHours }}
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { showToast } from "vant";
import { useI18n } from "vue-i18n";
import ReferenceLoading from "@/components/ReferenceLoading.vue";
import { getCustomerService, getTradeConfig } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import { useUserStore } from "@/store/modules/user";
import { buildCustomerServiceUrl } from "@/utils/customerServiceUrl";
import liveChatIcon from "/westermedia/chat-action.png";
import { copyText } from "@/utils/copyText";
import { formatWorkTime } from "@/util/times";

const userStore = useUserStore();
const { t } = useI18n();
const inviteCode = computed(() => String(userStore.userInfo?.inviteCode ?? "").trim());
const copyInviteCode = async () => {
  try {
    await copyText(inviteCode.value);
    showToast(t("das.profile.copySuccess"));
  } catch {
    showToast(t("das.profile.copyFailed"));
  }
};
const serviceHours = ref("");
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
    icon: isTelegram ? resolveImageUrl(item.image) : liveChatIcon,
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
onMounted(async () => {
  if (!userStore.token) return;
  try {
    const config = (await getTradeConfig()).data;
    const start = formatWorkTime(config?.workTimeStart);
    const end = formatWorkTime(config?.workTimeEnd);
    if (start && end) serviceHours.value = `${start}–${end}`;
  } catch (_) {
    // Unavailable hours must not block the customer service channels.
  }
});
</script>
