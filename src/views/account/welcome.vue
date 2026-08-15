<template>
  <main class="welcome-page das-page">
    <img class="welcome-logo" src="@/static/das/wordmark-cream.png" alt="DAS" />
    <section class="welcome-copy">
      <h1>
        <span>{{ $t("das.auth.welcomeLead") }}</span
        ><em>{{ $t("das.auth.welcomeAccent") }}</em>
      </h1>
      <p>{{ $t("das.auth.welcomeCopy") }}</p>
    </section>
    <section class="welcome-actions">
      <button
        class="welcome-primary"
        type="button"
        @click="safeReplace(router, '/account/register')"
      >
        {{ $t("das.auth.createAccount") }}</button
      ><button
        class="welcome-secondary"
        type="button"
        @click="safeReplace(router, '/account/login')"
      >
        {{ $t("das.auth.login") }}
      </button>
    </section>
    <p class="welcome-copyright">{{ $t("das.common.copyright") }}</p>
  </main>
</template>
<script setup>
import { useRouter } from "vue-router";
import { safeReplace } from "@/utils/navigation";
const router = useRouter();
</script>
<style scoped>
.welcome-page {
  min-height: 100%;
  padding: 70px clamp(34px, 8vw, 78px) 38px;
  display: flex;
  flex-direction: column;
  background: #14392c;
  color: #f7f5ec;
}
.welcome-logo {
  width: 45px;
  height: 70px;
  object-fit: contain;
}
.welcome-copy {
  margin: auto 0;
}
.welcome-copy h1 {
  max-width: 620px;
  margin: 0;
  font-size: clamp(38px, 8vw, 66px);
  line-height: 1.03;
  letter-spacing: -0.045em;
  font-weight: 400;
}
.welcome-copy h1 span,
.welcome-copy h1 em {
  display: block;
}
.welcome-copy h1 em {
  color: #ed9b87;
  font-style: normal;
}
.welcome-copy p {
  max-width: 560px;
  margin: 28px 0 0;
  color: rgba(247, 245, 236, 0.58);
  font-size: clamp(14px, 2.4vw, 18px);
  line-height: 1.6;
}
.welcome-actions {
  display: grid;
  gap: 13px;
}
.welcome-actions button {
  width: 100%;
  height: 61px;
  border-radius: 999px;
  font-weight: 700;
}
.welcome-primary {
  border: 0;
  background: #f7f5ec;
  color: #17382d;
}
.welcome-secondary {
  border: 1px solid rgba(247, 245, 236, 0.32);
  background: transparent;
  color: #f7f5ec;
}
.welcome-copyright {
  margin: 23px 0 0;
  text-align: center;
  color: rgba(247, 245, 236, 0.35);
  font-size: 10px;
}
@media (min-width: 760px) {
  .welcome-page {
    min-height: 900px;
  }
  .welcome-actions {
    grid-template-columns: 1fr 1fr;
  }
  .welcome-copy {
    margin: 170px 0;
  }
}
</style>
