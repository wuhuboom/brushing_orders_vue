<template>
  <main class="welcome-page das-page fp-welcome">
    <header class="psy-welcome-header">
      <img src="/psybir/logo.png" alt="Psybir" />
      <div>
        <button
          type="button"
          class="psy-language-link"
          :aria-label="$t('das.page.language')"
          @click="safeReplace(router, '/setting/language')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <ellipse cx="12" cy="12" rx="4" ry="9" />
            <path d="M3 12h18" /></svg
          ><span>{{ $i18n.locale.toUpperCase() }}</span>
        </button>
        <button
          type="button"
          class="psy-support-link"
          :aria-label="$t('das.nav.contact')"
          @click="safeReplace(router, '/contact')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 14v-3a8 8 0 0 1 16 0v6a3 3 0 0 1-3 3h-4M4 10h3v7H4zM17 10h3v7h-3z"
            /></svg
          ><i></i>
        </button>
      </div>
    </header>
    <img class="psy-welcome-core" src="/psybir/welcome-core.png" alt="" />
    <section class="welcome-copy">
      <p class="psy-welcome-trust">
        <i></i>Trusted by 60+ Global Enterprises · 99.98% Uptime
      </p>
      <h1 class="fp-welcome__title">Accelerate Your Digital Commerce</h1>
      <p class="psy-welcome-description">
        Access cutting-edge algorithmic mission tools, decentralized yield
        distribution, and enterprise-grade asset infrastructure.
      </p>
    </section>
    <section class="welcome-actions fp-welcome__actions">
      <button
        class="welcome-secondary fp-welcome__btn fp-welcome__btn--secondary"
        type="button"
        @click="safeReplace(router, '/account/login')"
      >
        {{ $t("das.auth.login") }} <span>➜</span>
      </button>
      <button
        class="welcome-primary fp-welcome__btn fp-welcome__btn--primary"
        type="button"
        @click="safeReplace(router, '/account/register')"
      >
        {{ $t("das.auth.createAccount") }}
      </button>
    </section>
    <p class="psy-welcome-terms">Terms of Service · Privacy Policy · Docs</p>
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
