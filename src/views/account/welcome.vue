<template>
  <main class="welcome-page das-page fp-welcome">
    <div class="fp-welcome__brand">
      <img
        class="welcome-logo"
        src="/worldofgood/logo-Cu7jN8a6.webp"
        alt="worldofgood"
      />
    </div>
    <section class="welcome-copy">
      <p class="fp-welcome__subbrand">A human connections company</p>
      <h1 class="fp-welcome__title">World of Good Brands</h1>
    </section>
    <section class="welcome-actions fp-welcome__actions">
      <button
        class="welcome-primary fp-welcome__btn fp-welcome__btn--primary"
        type="button"
        @click="safeReplace(router, '/account/register')"
      >
        {{ $t("das.auth.createAccount") }}</button
      ><button
        class="welcome-secondary fp-welcome__btn fp-welcome__btn--secondary"
        type="button"
        @click="safeReplace(router, '/account/login')"
      >
        {{ $t("das.auth.login") }}
      </button>
    </section>
    <p class="welcome-copyright fp-welcome__copyright">
      {{ $t("das.common.copyright") }}
    </p>
  </main>
</template>

<script setup>
import { useRouter } from "vue-router";
import { safeReplace } from "@/utils/navigation";
const router = useRouter();
</script>

