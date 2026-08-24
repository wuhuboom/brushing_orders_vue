<template>
  <div class="dmk-terms-page w-full min-h-[100vh] bg-black text-white">
    <div class="van-sticky">
      <div class="van-nav-bar van-hairline--bottom van-safe-area-top">
        <div class="van-nav-bar__content">
          <button
            type="button"
            class="van-nav-bar__left van-haptics-feedback"
            @click="safeBack(router, '/account/register')"
          >
            <i
              class="van-badge__wrapper van-icon van-icon-arrow-left van-nav-bar__arrow"
            ></i>
          </button>
          <div class="van-nav-bar__title van-ellipsis">
            {{ $t("das.dmk.termsTitle") }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="w-full p-6 box-border text-[#fff]">
      {{ $t("das.dmk.loading") }}
    </div>
    <div
      v-else
      class="w-full p-6 box-border flex flex-col font-montserrat text-[#fff]"
      v-html="content"
    ></div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { safeBack } from "@/utils/navigation";
defineProps({ content: { type: String, default: "" }, loading: Boolean });
const router = useRouter();
</script>

<style scoped>
.dmk-terms-page {
  background: #000 !important;
  color: #fff !important;
}

.dmk-terms-page :deep(.van-nav-bar) {
  background: #100827 !important;
}

.dmk-terms-page :deep(.van-nav-bar__title),
.dmk-terms-page :deep(.van-nav-bar .van-icon) {
  color: #fff !important;
}
</style>
