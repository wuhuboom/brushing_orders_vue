<template>
  <main class="das-page home-page">
    <section class="home-hero">
      <HeaderTop />
      <div class="home-hero__copy">
        <h1>{{ $t("das.home.heroTitle") }}</h1>
        <p>{{ $t("das.home.heroCopy") }}</p>
      </div>
    </section>

    <section class="home-body">
      <div class="stack">
        <span>{{ $t("das.home.fluent") }}</span>
        <div>
          <b>Meta</b><b>Google</b><b>YouTube</b><b>TikTok</b><b>Shopify Plus</b>
        </div>
      </div>

      <section class="shortcuts">
        <h2>{{ $t("das.home.shortcuts") }}</h2>
        <div class="shortcuts__grid">
          <button
            v-for="item in shortcuts"
            :key="item.title"
            type="button"
            @click="goTo(item)"
          >
            <span><DasIcon :name="item.icon" /></span>
            <b>{{ $t(item.title) }}</b>
          </button>
        </div>
      </section>

      <section class="what-we-do">
        <h2>{{ $t("das.home.what") }}</h2>
        <p class="what-we-do__intro">{{ $t("das.home.whatIntro") }}</p>
        <article v-for="item in services" :key="item.title">
          <DasIcon :name="item.icon" />
          <div>
            <h3>{{ $t(item.title) }}</h3>
            <p>{{ $t(item.description) }}</p>
          </div>
        </article>
      </section>
    </section>
    <Footer name="/" />
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import HeaderTop from "@/components/HeaderTop.vue";
import Footer from "@/components/Footer.vue";
import { safePush } from "@/utils/navigation";
import DasIcon from "@/components/DasIcon.vue";

const router = useRouter();
const shortcuts = [
  { title: "das.home.deposit", icon: "deposit", route: "/deposit" },
  { title: "das.home.withdraw", icon: "withdraw", route: "/withdraw" },
  { title: "das.home.faqs", icon: "faq", route: "/faqs" },
  { title: "das.home.activities", icon: "activity", route: "/event" },
  { title: "das.home.terms", icon: "terms", route: "/clause" },
  { title: "das.home.vip", icon: "vip", route: "/vips" },
  { title: "das.home.certificate", icon: "certificate", route: "/cert" },
  { title: "das.home.about", icon: "about", route: "/about" },
];
const services = [
  {
    title: "das.home.strategy",
    icon: "intelligence",
    description: "das.home.strategyText",
  },
  {
    title: "das.home.creative",
    icon: "creative",
    description: "das.home.creativeText",
  },
  { title: "das.home.media", icon: "media", description: "das.home.mediaText" },
  {
    title: "das.home.retention",
    icon: "retention1",
    description: "das.home.retentionText",
  },
  {
    title: "das.home.aiOrchestration",
    icon: "ai",
    description: "das.home.aiOrchestrationText",
  },
];
const goTo = (item) => safePush(router, item.route);
</script>

<style scoped>
.home-hero {
  min-height: 346px;
  background: #14392c;
  color: #f7f5ec;
}
.home-hero__copy {
  padding: 32px 30px 42px;
}
.home-hero h1 {
  margin: 0;
  white-space: pre-line;
  font-size: clamp(32px, 8.5vw, 43px);
  line-height: 1.08;
  letter-spacing: -0.04em;
  font-weight: 400;
}
.home-hero p {
  max-width: 360px;
  margin: 20px 0 0;
  color: rgba(247, 245, 236, 0.72);
  font-size: 15px;
  line-height: 1.55;
}
.home-body {
  background: #f7f6ee;
  color: #17382d;
}
.stack {
  padding: 20px 30px 18px;
  border-bottom: 1px solid rgba(23, 56, 45, 0.07);
}
.stack > span {
  color: #9b9b92;
  font-size: 10px;
  letter-spacing: 0.18em;
}
.stack > div {
  margin-top: 17px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: #8a8a83;
  font-size: 12px;
  white-space: nowrap;
}
.shortcuts {
  margin: 24px 22px 0;
  padding: 22px 16px 25px;
  border-radius: 26px;
  background: #eeede3;
}
.shortcuts h2 {
  margin: 0 0 20px 6px;
  font-size: 19px;
}
.shortcuts__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 23px;
}
.shortcuts button {
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border: 0;
  background: none;
  color: #17382d;
  font-size: 11px;
}
.shortcuts button > span {
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
}
.shortcuts button b {
  font-weight: 700;
  white-space: nowrap;
}
.what-we-do {
  padding: 38px 30px 44px;
}
.what-we-do h2 {
  margin: 0;
  font-size: 31px;
  letter-spacing: -0.035em;
  font-weight: 400;
}
.what-we-do__intro {
  margin: 14px 0 30px;
  color: #777b75;
  font-size: 14px;
  line-height: 1.55;
}
.what-we-do article {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 14px;
  margin: 0 0 29px;
}
.what-we-do article :deep(.das-icon) {
  width: 28px;
  height: 28px;
  margin-top: 4px;
}
.what-we-do h3 {
  margin: 0 0 5px;
  font-size: 18px;
}
.what-we-do article p {
  margin: 0;
  color: #797d77;
  font-size: 14px;
  line-height: 1.48;
}
</style>
