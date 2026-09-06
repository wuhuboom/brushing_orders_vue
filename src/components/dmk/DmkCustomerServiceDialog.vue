<template>
  <van-popup
    v-model:show="visible"
    class="dmk-customer-service-dialog"
    teleport="body"
    round
    close-on-click-overlay
  >
    <div class="dmk-customer-service-dialog__intro">
      <img src="/nsg16/support-agent.png" alt="" />
      <h2>{{ $t("das.dmk.customerSupport") }}</h2>
      <p>{{ $t("das.contact.hint") }}</p>
    </div>
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
  box-sizing: border-box;
  width: min(88vw, 438px);
  overflow: visible;
  border: 2px solid transparent;
  border-radius: 18px;
  background:
    linear-gradient(#090d29, #090d29) padding-box,
    linear-gradient(145deg, #43c9ff, #9536ec) border-box;
  box-shadow:
    0 28px 80px rgba(0, 0, 0, 0.78),
    0 0 34px rgba(86, 69, 255, 0.14);
  color: #e5e8fb;
}

.dmk-customer-service-dialog__intro {
  padding: 86px 28px 22px;
  position: relative;
  text-align: center;
}

.dmk-customer-service-dialog__intro img {
  position: absolute;
  left: 50%;
  top: -64px;
  width: 142px;
  height: 142px;
  transform: translateX(-50%);
  object-fit: contain;
}

.dmk-customer-service-dialog__intro h2 {
  margin: 0;
  color: #e4e8ff;
  font-size: 28px;
  font-weight: 650;
}

.dmk-customer-service-dialog__intro p {
  margin: 22px 0 0;
  color: #969db9;
  font-size: 14px;
}

.dmk-customer-service-dialog__list {
  min-height: 66px;
  padding: 0 28px;
}

.dmk-customer-service-dialog__channel {
  width: 100%;
  min-height: 66px;
  margin-bottom: 11px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #303a55;
  border-radius: 11px;
  background: #202a40;
  color: #e9edff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.dmk-customer-service-dialog__identity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dmk-customer-service-dialog__identity img {
  width: 38px;
  height: 38px;
  padding: 7px;
  border-radius: 9px;
  background: linear-gradient(135deg, #4ec7ff, #8b39e9);
  object-fit: cover;
}

.dmk-customer-service-dialog__channel > :deep(.van-icon) {
  color: #50caff;
  font-size: 20px;
}

.dmk-customer-service-dialog__status {
  padding: 24px;
  border: 1px solid #29334e;
  border-radius: 11px;
  color: #8d95b2;
  background: #151d33;
  text-align: center;
  font-size: 14px;
}

.dmk-customer-service-dialog__cancel {
  width: 100%;
  padding: 26px 16px 28px;
  border: 0;
  border-radius: 0 0 17px 17px;
  background: transparent;
  color: #e6eaff;
  font-size: 13px;
  font-weight: 650;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
}

@media (max-width: 759px) {
  :global(.dmk-customer-service-dialog.van-popup) {
    width: min(84vw, 364px);
    border-radius: 17px;
  }

  .dmk-customer-service-dialog__intro {
    padding: 72px 22px 19px;
  }

  .dmk-customer-service-dialog__intro img {
    top: -55px;
    width: 122px;
    height: 122px;
  }

  .dmk-customer-service-dialog__intro h2 {
    font-size: 21px;
  }

  .dmk-customer-service-dialog__intro p {
    margin-top: 17px;
    font-size: 13px;
  }

  .dmk-customer-service-dialog__list {
    padding: 0 22px;
  }

  .dmk-customer-service-dialog__channel {
    min-height: 60px;
  }

  .dmk-customer-service-dialog__cancel {
    padding: 23px 16px 26px;
  }
}
</style>
