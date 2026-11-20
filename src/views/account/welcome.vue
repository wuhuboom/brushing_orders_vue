<template>
  <main class="welcome-page das-page fp-welcome">
    <header class="psy-welcome-header">
      <img src="/westermedia/logo.png" alt="WesterMedia" />
    </header>
    <section class="welcome-copy">
      <p class="psy-welcome-trust">{{ $t("das.wester.welcomeStudio") }}</p>
      <h1 class="fp-welcome__title">
        {{ $t("das.wester.welcomeHeadline") }}
        <strong>{{ $t("das.wester.welcomeAccent") }}</strong>
      </h1>
      <p class="psy-welcome-description">{{ $t("das.wester.welcomeIntro") }}</p>
    </section>
    <figure class="wester-welcome-art">
      <img src="/westermedia/welcome-studio.png" alt="" />
      <figcaption><i>Grell Roofing &amp; Ag Systems</i><span>{{ $t("das.wester.caseStudy") }}</span></figcaption>
    </figure>
    <section class="welcome-actions fp-welcome__actions">
      <button
        class="welcome-secondary fp-welcome__btn fp-welcome__btn--secondary"
        type="button"
        @click="safeReplace(router, '/account/login')"
      >
        {{ $t("das.auth.login") }}
        <img src="/design500/arrow-white.png" alt="" />
      </button>
      <p class="wester-welcome-separator">{{ $t("das.wester.or") }}</p>
      <button
        class="welcome-primary fp-welcome__btn fp-welcome__btn--primary"
        type="button"
        @click="safeReplace(router, '/account/register')"
      >
        {{ $t("das.auth.createAccount") }}
      </button>
    </section>
    <div class="wester-welcome-footer">
      <span>Designed, written and built in Humboldt, Iowa ☀</span>
      <small>{{ $t("das.wester.studioLine") }}</small>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from "vue-router";
import { safeReplace } from "@/utils/navigation";
const router = useRouter();
</script>
