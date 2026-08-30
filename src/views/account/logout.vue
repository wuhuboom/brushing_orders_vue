<template>
  <main class="das-page logout-page">
    <DasPageHeader title-key="das.profile.logout" />
    <section class="logout-body">
      <img class="logout-hero" src="@/static/brain/logout-hero.png" alt="" />
      <h1>{{ $t("das.logout.question") }}</h1>
      <p>{{ $t("das.profile.logoutQuestion") }}</p>
      <button class="stay" @click="safeBack(router, '/my')">
        {{ $t("das.logout.stay") }}</button
      ><button class="exit" @click="exit">{{ $t("das.logout.exit") }}</button>
    </section>
    <p class="das-page-copyright">{{ $t("das.common.copyright") }}</p>
  </main>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import DasPageHeader from "@/components/DasPageHeader.vue";
import { safeBack } from "@/utils/navigation";
const router = useRouter(),
  userStore = useUserStore(),
  exit = () => userStore.logout();
</script>
<style scoped>
.logout-page {
  min-height: 100%;
  background: #f7f5ec;
  color: #17382d;
}
.logout-body {
  max-width: 760px;
  margin: auto;
  padding: 28px 30px;
  text-align: center;
}
.logout-hero {
  display: block;
  width: min(100%, 280px);
  height: 230px;
  margin: 0 auto 20px;
  object-fit: contain;
}
.logout-body h1 {
  margin: 0;
  font-size: 26px;
}
.logout-body p {
  max-width: 330px;
  margin: 26px auto;
  color: #8a928c;
  line-height: 1.5;
}
.logout-body button {
  width: 100%;
  height: 62px;
  margin-top: 12px;
  border-radius: 999px;
  font-weight: 800;
}
.stay {
  border: 0;
  background: #14392c;
  color: #fff;
}
.exit {
  border: 1px solid #b8bdb8;
  background: transparent;
  color: #17382d;
}
</style>
