<template>
  <main class="welcome-page das-page">
    <img
      class="welcome-logo"
      src="@/static/brain/logo.png"
      alt="Brain Power"
    />
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
  position: relative;
  min-height: 100dvh;
  padding: clamp(138px, 19vh, 150px) clamp(34px, 8vw, 78px) 28px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #010718 url("@/static/brain/auth-background.png") center / 100%
    100% no-repeat;
  color: #fff;
}
.welcome-logo {
  position: relative;
  z-index: 1;
  width: min(100%, 245px);
  height: auto;
  margin: 0 auto;
  object-fit: contain;
}
.welcome-copy {
  position: relative;
  z-index: 1;
  margin: 34px 0 42px;
  text-align: center;
}
.welcome-copy h1 {
  max-width: 620px;
  margin: 0;
  font-size: clamp(25px, 7vw, 48px);
  line-height: 1.18;
  letter-spacing: -0.025em;
  font-weight: 800;
}
.welcome-copy h1 span,
.welcome-copy h1 em {
  display: block;
}
.welcome-copy h1 em {
  background: linear-gradient(90deg, #09d9f2, #7e6cff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-style: normal;
}
.welcome-copy p {
  max-width: 560px;
  margin: 28px 0 0;
  color: #abb3c6;
  font-size: clamp(13px, 3.6vw, 16px);
  line-height: 1.45;
}
.welcome-actions {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 16px;
}
.welcome-actions button {
  width: 100%;
  height: 51px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
}
.welcome-primary {
  border: 0;
  background: linear-gradient(100deg, #08baff, #0878ff 46%, #4e22cf);
  color: #fff;
  box-shadow: 0 0 22px rgba(0, 128, 255, 0.24);
}
.welcome-secondary {
  border: 1px solid #1975d9;
  background: rgba(3, 10, 29, 0.74);
  color: #fff;
}
.welcome-copyright {
  position: relative;
  z-index: 1;
  margin: auto 0 0;
  padding-top: 34px;
  text-align: center;
  color: #778198;
  font-size: 10px;
}
@media (min-width: 760px) {
  .welcome-page {
    min-height: 100dvh;
    padding-top: 160px;
  }
  .welcome-copy {
    margin: 70px 0;
  }
}
</style>
