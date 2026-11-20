<template>
  <div class="profile-logout-modal">
    <button
      class="profile-logout-modal__mask"
      type="button"
      :aria-label="$t('das.common.cancel')"
      @click="safeBack(router, '/my')"
    ></button>
    <section
      class="profile-logout-modal__sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wester-logout-title"
    >
      <button
        class="profile-logout-modal__close"
        type="button"
        :aria-label="$t('das.common.cancel')"
        @click="safeBack(router, '/my')"
      >
        <img src="/westermedia/logout-close.png" alt="" />
      </button>
      <div class="poetic-logout-label">
        <PoeticGlyph name="exit" /><span>{{ $t("das.profile.logout") }}</span>
      </div>
      <h2 id="wester-logout-title">{{ $t("das.profile.logout") }}</h2>
      <p>{{ $t("das.profile.logoutQuestion") }}</p>
      <div class="profile-logout-modal__actions">
        <button
          class="profile-logout-modal__cancel"
          type="button"
          @click="safeBack(router, '/my')"
        >
          {{ $t("das.logout.stay") }}</button
        ><button
          class="profile-logout-modal__confirm"
          type="button"
          @click="exit"
        >
          {{ $t("das.logout.exit") }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import PoeticGlyph from "@/components/PoeticGlyph.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { safeBack } from "@/utils/navigation";
const router = useRouter(), userStore = useUserStore(), exit = () => userStore.logout();
</script>
