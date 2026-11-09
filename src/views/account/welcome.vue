<template>
  <main class="welcome-page das-page fp-welcome">
    <header class="psy-welcome-header">
      <img src="/design500/logo-white.png" alt="500 Designs" />
      <div>
        <button
          type="button"
          class="psy-language-link"
          :aria-label="$t('das.page.language')"
          @click="safeReplace(router, '/setting/language')"
        >
          <img src="/design500/globe-plain.png" alt="" /><span>{{
            $i18n.locale.toUpperCase()
          }}</span>
        </button>
        <button
          type="button"
          class="psy-support-link"
          :aria-label="$t('das.nav.contact')"
          @click="safeReplace(router, '/contact')"
        >
          <img src="/design500/support-dark.png" alt="" /><i></i>
        </button>
      </div>
    </header>
    <img class="psy-welcome-core" src="/design500/logo-black.png" alt="" />
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
        {{ $t("das.auth.login") }}
        <img src="/design500/arrow-white.png" alt="" />
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
