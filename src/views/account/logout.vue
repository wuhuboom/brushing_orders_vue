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
      >
        <button
          class="profile-logout-modal__close"
          type="button"
          :aria-label="$t('das.common.cancel')"
          @click="safeBack(router, '/my')"
        >
          <span></span>
        </button>
        <h2>{{ $t("das.profile.logout") }}</h2>
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
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { safeBack } from "@/utils/navigation";
const router = useRouter(), userStore = useUserStore(), exit = () => userStore.logout();
</script>
