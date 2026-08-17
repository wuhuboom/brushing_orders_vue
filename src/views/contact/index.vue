<template>
  <main class="das-page contact-page">
    <DasPageHeader title-key="das.page.contact" />
    <section class="contact-body">
      <h2>{{ $t("das.contact.letsTalk") }}</h2>
      <p>{{ $t("das.contact.intro") }}</p>
      <div class="contact-channels">
        <button
          v-for="item in channels"
          :key="item.id || item.linkUrl"
          type="button"
          @click="openChannel(item.linkUrl)"
        >
          <span class="contact-channel__identity">
            <span class="contact-channel__avatar">
              <img
                :src="customerServiceAvatar"
                :alt="item.name || $t('das.page.contact')"
              />
            </span>
            <span>{{ item.name }}</span>
          </span
          ><b>›</b></button
        ><span v-if="loading">{{ $t("das.common.loading") }}</span
        ><span v-else-if="!channels.length">{{ $t("das.contact.empty") }}</span>
      </div>
      <h2 class="touch-title">{{ $t("das.contact.getInTouch") }}</h2>
      <p>{{ $t("das.contact.touchText") }}</p>
      <small>{{ $t("das.common.copyright") }}</small>
    </section>
  </main>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getCustomerService, userGetInfo } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import customerServiceAvatar from "@/static/das/customer service.png";
import { useUserStore } from "@/store/modules/user";
import {
  buildCustomerServiceUrl,
  customerServiceVisitor,
} from "@/utils/customerServiceUrl";
const userStore = useUserStore();
const channels = ref([]),
  loading = ref(true);
const openChannel = (url) => {
  const target = buildCustomerServiceUrl(url, {
    isLoggedIn: Boolean(userStore.token),
    user: userStore.userInfo,
  });
  if (target) window.open(target, "_blank", "noopener,noreferrer");
};
const ensureLoggedInUser = async () => {
  const visitor = customerServiceVisitor(userStore.userInfo);
  if (!userStore.token || (visitor.id !== undefined && visitor.name)) return;
  try {
    const user = (await userGetInfo()).data || {};
    userStore.setUserInfo(user);
  } catch (_) {
    // The customer-service list remains available if profile refresh fails.
  }
};
onMounted(async () => {
  try {
    const [response] = await Promise.all([
      getCustomerService(),
      ensureLoggedInUser(),
    ]);
    channels.value = response.data || [];
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped>
.contact-page {
  min-height: 100%;
  background: #f7f5ec;
  color: #17382d;
}
.contact-body {
  max-width: 760px;
  margin: auto;
  padding: 18px 28px 80px;
}
.contact-body h2 {
  margin: 18px 0 12px;
  text-align: center;
  font-size: 28px;
}
.contact-body > p {
  margin: 0;
  color: #778079;
  font-size: 15px;
  line-height: 1.55;
}
.contact-channels {
  margin: 26px 0 42px;
  display: grid;
  gap: 12px;
}
.contact-channels button {
  width: 100%;
  min-height: 62px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 0;
  border-radius: 18px;
  background: #14392c;
  color: #fff;
  text-align: left;
  font-size: 16px;
  font-weight: 700;
}
.contact-channels button b {
  font-size: 28px;
  font-weight: 300;
}
.contact-channel__identity {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}
.contact-channel__avatar {
  position: relative;
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.88);
  border-radius: 50%;
  background: #edf3e7;
}
.contact-channel__avatar img {
  position: absolute;
  top: -16%;
  left: -95%;
  width: 215%;
  max-width: none;
  height: 215%;
  object-fit: cover;
}
.contact-channels > span {
  text-align: center;
  color: #89918b;
}
.contact-body .touch-title {
  text-align: left;
}
.contact-body small {
  display: block;
  margin-top: 34px;
  text-align: center;
  color: #9ba19c;
  font-size: 10px;
}
</style>
