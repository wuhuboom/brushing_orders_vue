<template>
  <DmkPcAbout />
  <div class="dmk-pc-only">
    <div class="dmk-contact-overlay" aria-hidden="true"></div>
    <div
      role="dialog"
      tabindex="0"
      class="dmk-contact-dialog van-popup van-popup--center van-dialog"
      aria-modal="true"
    >
      <div class="van-dialog__content">
        <div class="flex flex-col rounded-xl overflow-hidden bg-white dmk-contact-scope">
          <button
            v-for="(item, index) in channels"
            :key="item.id || item.linkUrl || index"
            type="button"
            class="w-full flex items-center justify-between p-4 box-border border-b-[1px] border-[#eef2f4] bg-white"
            @click="openChannel(item.linkUrl)"
          >
            <div class="flex items-center">
              <img
                class="w-6 h-6 mr-3 rounded-sm object-cover"
                :src="channelIcon(item, index)"
                alt=""
              />
              <div class="text-[#3b4a48] text-sm font-medium">
                {{ item.name || $t("das.dmk.customerServiceNumber", { number: index + 1 }) }}
              </div>
            </div>
            <i
              class="van-badge__wrapper van-icon van-icon-arrow"
              style="color: rgb(22, 88, 182); font-size: 16px"
            ></i>
          </button>
          <div v-if="loading" class="p-5 text-center text-[#3b4a48] text-sm">{{ $t("das.common.loading") }}</div>
        </div>
      </div>
      <div class="w-full flex items-center justify-center pt-3 pb-3 dmk-contact-scope">
        <button
          type="button"
          class="text-[var(--main-color)] text-sm bg-transparent border-0 cursor-pointer"
          @click="safePush(router, '/about')"
        >
          {{ $t("das.common.cancel") }}
        </button>
      </div>
    </div>
  </div>

  <main class="das-page contact-page dmk-mobile-current">
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
          <span>{{ item.name }}</span
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
import { useRouter } from "vue-router";
import { getCustomerService, userGetInfo } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
import DmkPcAbout from "@/components/dmkPc/DmkPcAbout.vue";
import { useUserStore } from "@/store/modules/user";
import { safePush } from "@/utils/navigation";
import {
  buildCustomerServiceUrl,
  customerServiceVisitor,
} from "@/utils/customerServiceUrl";

const userStore = useUserStore();
const router = useRouter();
const channels = ref([]),
  loading = ref(true);

const fallbackIcons = [
  "/dmk/assets/1782859272238521795.jpg",
  "/dmk/assets/1782859377580593157.jpg",
  "/dmk/assets/1785267614949659890.jpg",
];
const imageBase = window.g?.VITE_API_IMG_URL || import.meta.env.VITE_API_IMG_URL || "";
const channelIcon = (item, index) => {
  const value = item.icon || item.iconUrl || item.image || item.avatar || "";
  if (!value) return fallbackIcons[index % fallbackIcons.length];
  return /^https?:/i.test(value) ? value : `${imageBase}${value}`;
};

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
    // 客服列表仍可使用；用户信息缺失时保持原始客服 URL。
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
@media (min-width: 1024px) {
  .dmk-contact-overlay {
    position: fixed;
    inset: 0;
    z-index: 2010;
    background: rgba(0, 0, 0, 0.7);
  }
  .dmk-contact-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 2011;
    width: 320px;
    margin: 0;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
  }
  .dmk-contact-dialog button {
    font-family: inherit;
  }
}
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
