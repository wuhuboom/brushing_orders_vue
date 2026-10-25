<template>
  <van-popup
    v-model:show="visible"
    class="dmk-customer-service-dialog"
    teleport="body"
    round
    close-on-click-overlay
  >
    <div class="dmk-customer-service-dialog__list">
      <button
        v-for="(item, index) in channels"
        :key="item.id || item.linkUrl || index"
        type="button"
        class="dmk-customer-service-dialog__channel"
        @click="openChannel(item.linkUrl)"
      >
        <span class="dmk-customer-service-dialog__identity">
          <img :src="channelIcon(item, index)" alt="" />
          <span>{{
            item.name ||
            $t("das.dmk.customerServiceNumber", { number: index + 1 })
          }}</span>
        </span>
        <van-icon name="arrow" />
      </button>

      <div v-if="loading" class="dmk-customer-service-dialog__status">
        {{ $t("das.common.loading") }}
      </div>
      <div
        v-else-if="!channels.length"
        class="dmk-customer-service-dialog__status"
      >
        {{ $t("das.contact.empty") }}
      </div>
    </div>
    <button
      type="button"
      class="dmk-customer-service-dialog__cancel"
      @click="visible = false"
    >
      {{ $t("das.common.cancel") }}
    </button>
  </van-popup>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { getCustomerService } from "@/api/apis";
import { useUserStore } from "@/store/modules/user";
import { buildCustomerServiceUrl } from "@/utils/customerServiceUrl";

const props = defineProps({
  show: { type: Boolean, default: false },
});
const emit = defineEmits(["update:show"]);

const userStore = useUserStore();
const channels = ref([]);
const loading = ref(false);
const loaded = ref(false);
const visible = computed({
  get: () => props.show,
  set: (value) => emit("update:show", value),
});

const fallbackIcons = [
  "/dmk/assets/1782859272238521795.jpg",
  "/dmk/assets/1782859377580593157.jpg",
  "/dmk/assets/1785267614949659890.jpg",
];
const imageBase =
  window.g?.VITE_API_IMG_URL || import.meta.env.VITE_API_IMG_URL || "";

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

const loadChannels = async () => {
  if (loaded.value || loading.value) return;
  loading.value = true;
  try {
    const response = await getCustomerService();
    channels.value = response.data || [];
    loaded.value = true;
  } catch (_) {
    channels.value = [];
    loaded.value = true;
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.show,
  (show) => {
    if (show) loadChannels();
  },
  { immediate: true },
);
</script>

<style scoped>
:global(.dmk-customer-service-dialog.van-popup) {
  width: min(86vw, 340px);
  overflow: hidden;
  border: 1px solid #3a3a3a;
  background: #111;
  box-shadow:
    0 18px 55px rgba(0, 0, 0, 0.65),
    0 0 24px rgba(205, 255, 49, 0.1);
}

.dmk-customer-service-dialog__list {
  min-height: 58px;
}

.dmk-customer-service-dialog__channel {
  width: 100%;
  min-height: 58px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0;
  border-bottom: 1px solid #303030;
  background: #111;
  color: #fff;
  font-size: 14px;
}

.dmk-customer-service-dialog__identity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dmk-customer-service-dialog__identity img {
  width: 24px;
  height: 24px;
  border-radius: 3px;
  object-fit: cover;
}

.dmk-customer-service-dialog__channel > :deep(.van-icon) {
  color: var(--main-color);
  font-size: 16px;
}

.dmk-customer-service-dialog__status {
  padding: 20px;
  color: #aaa;
  text-align: center;
  font-size: 14px;
}

.dmk-customer-service-dialog__cancel {
  width: 100%;
  padding: 12px 16px 15px;
  border: 0;
  border-top: 1px solid #303030;
  background: #171717;
  color: var(--main-color);
  font-size: 14px;
}
</style>
