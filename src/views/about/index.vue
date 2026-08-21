<template>
  <div class="about-page">
  <PcPublicShell class="pc-about">
    <section class="pc-about__hero">
      <div class="pc-about__copy">
        <p class="pc-about__eyebrow">Award winning marketing agency in the US</p>
        <img class="pc-about__hero-title" :src="heroTitle" alt="A look inside the Lunyex mentality." />
        <p class="pc-about__intro">
          We’ve rebuilt SEO, PPC, and Web design workflows from the ground-up to give you a completely refreshed experience. We think you’ll like it, a lot.
        </p>
        <button type="button" @click="safePush(router, '/account/login')">Start Work</button>
      </div>
      <img class="pc-about__awards" :src="awardsImage" alt="Clutch agency awards" />
    </section>
    <section class="pc-about__overview">
      <div class="pc-about__overview-copy">
        <h2>Starting from zero, we’ve rebuilt SEO and PPC workflows from the ground-up.</h2>
        <p>
          With a strict attention to detail and removing all the unnecessary excess, we've optimized the process to give you tan experience that delivers results and total confidence in the work getting done.
        </p>
      </div>
      <div class="pc-about__features">
        <img :src="featureQuality" alt="Focus on quality not quantity for the highest ROI" />
        <img :src="featureTransparency" alt="Transparency and communication in everything" />
        <img :src="featureImprove" alt="Constantly find ways to improve and get better" />
      </div>
    </section>
    <section class="pc-about__results">
      <div class="pc-about__results-inner">
        <img class="pc-about__results-copy" :src="resultsImage" alt="Award-winning results: 50+ clients, 1m+ impressions and 5.4x average return" />
        <img class="pc-about__clients" :src="clientLogos" alt="Client logos" />
      </div>
    </section>
    <footer class="pc-about__footer">
      <div class="pc-about__footer-lead">
        <img src="@/static/pc/dmk-logo.png" alt="DMK" />
        <p>An award winning SEO, PPC, Web Dev agency that specializes in search, discovery, and conversion.</p>
      </div>
      <div class="pc-about__flags">
        <div class="pc-about__flag-track">
          <template v-for="copy in 2" :key="copy">
            <img v-for="flag in flags" :key="`${copy}-${flag.name}`" :src="flag.src" :alt="flag.name" />
          </template>
        </div>
      </div>
      <div class="pc-about__footer-links">
        <button @click="safePush(router, '/account/login')">Home</button><button>Pay-Per-Click</button><button>Web Design &amp; Dev</button><button>SEO</button><span>support@swcpartnership.online</span>
        <button class="accent" @click="safePush(router, '/about')">About <img :src="linkArrow" alt="" /></button><button class="accent" @click="safePush(router, '/tc')">T &amp; C <img :src="linkArrow" alt="" /></button><button class="accent" @click="safePush(router, '/faqs')">FAQs <img :src="linkArrow" alt="" /></button><button class="accent" @click="safePush(router, '/contact')">Customer Support <img :src="linkArrow" alt="" /></button>
      </div>
      <small>Made with&nbsp; <b>♥</b></small>
    </footer>
  </PcPublicShell>
  <DasContentPage
    class="mobile-about"
    title-key="das.page.about"
    :content="content"
    :loading="loading"
  />
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getContentConfig } from "@/api/apis";
import DasContentPage from "@/components/DasContentPage.vue";
import PcPublicShell from "@/components/pc/PcPublicShell.vue";
import { safePush } from "@/utils/navigation";
import awardsImage from "@/static/pc/about/awards.png";
import heroTitle from "@/static/pc/about/hero-title.png";
import resultsImage from "@/static/pc/about/results.png";
import featureQuality from "@/static/pc/about/feature-quality.png";
import featureTransparency from "@/static/pc/about/feature-transparency.png";
import featureImprove from "@/static/pc/about/feature-improve.png";
import clientLogos from "@/static/pc/about/client-logos.png";
import flagUs from "@/static/pc/about/flag-us.png";
import flagBrazil from "@/static/pc/about/flag-brazil.png";
import flagCanada from "@/static/pc/about/flag-canada.png";
import flagFrance from "@/static/pc/about/flag-france.png";
import flagGermany from "@/static/pc/about/flag-germany.png";
import flagItaly from "@/static/pc/about/flag-italy.png";
import flagJapan from "@/static/pc/about/flag-japan.png";
import flagIndia from "@/static/pc/about/flag-india.png";
import flagChina from "@/static/pc/about/flag-china.png";
import flagUk from "@/static/pc/about/flag-uk.png";
import linkArrow from "@/static/pc/about/link-arrow.png";
const router = useRouter();
const flags = [
  { name: "United States", src: flagUs },
  { name: "Brazil", src: flagBrazil },
  { name: "Canada", src: flagCanada },
  { name: "France", src: flagFrance },
  { name: "Germany", src: flagGermany },
  { name: "Italy", src: flagItaly },
  { name: "Japan", src: flagJapan },
  { name: "India", src: flagIndia },
  { name: "China", src: flagChina },
  { name: "United Kingdom", src: flagUk },
];
const content = ref(""),
  loading = ref(true);
onMounted(async () => {
  try {
    content.value = (await getContentConfig()).data?.aboutContent || "";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.pc-about { display: none; }
.about-page { width: 100%; min-height: 100%; }
@media (min-width: 900px) {
  .mobile-about { display: none; }
  .pc-about { display: block; }
  .pc-about__hero {
    width: min(100%, 1200px);
    height: 533px;
    margin: 0 auto;
    padding: 40px 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
    gap: 16px;
  }
  .pc-about__copy { padding-top: 40px; }
  .pc-about__eyebrow { margin: 0; color: #fff; font-size: 18px; line-height: 28px; }
  .pc-about__hero-title { width: 513px; height: 109px; margin-top: 40px; display: block; object-fit: contain; }
  .pc-about__intro { width: 592px; margin: 40px 0 0; color: #fff; font-size: 18px; line-height: 28px; }
  .pc-about__copy > button {
    width: 592px;
    height: 48px;
    margin-top: 40px;
    border: 0;
    border-radius: 999px;
    background: #daff45;
    color: #050505;
    font-size: 16px;
  }
  .pc-about__awards { width: 420px; height: 453px; justify-self: center; object-fit: contain; }
  .pc-about__overview { height: 733px; padding: 40px 0; background: #fff; color: #0d0d0d; }
  .pc-about__overview-copy { width: 638px; margin: 0 auto; }
  .pc-about__overview h2 { margin: 0; padding: 40px 0 20px; font-size: 44px; font-weight: 500; line-height: 55px; letter-spacing: 0; }
  .pc-about__overview-copy > p { margin: 0; color: #000; font-size: 18px; line-height: 28px; }
  .pc-about__features { width: min(100%, 1200px); height: 312px; margin: 32px auto 0; display: flex; align-items: center; justify-content: space-between; }
  .pc-about__features img { width: auto; height: 312px; display: block; object-fit: contain; }
  .pc-about__results { height: 661px; padding: 40px 0; background: #daff45; color: #070707; }
  .pc-about__results-inner { width: min(100%, 1200px); height: 581px; margin: 0 auto; }
  .pc-about__results-copy { width: 1084px; height: 481px; display: block; object-fit: contain; }
  .pc-about__clients { width: 1200px; height: auto; margin-top: 80px; display: block; }
  .pc-about__footer {
    width: min(100%, 1200px);
    height: 456px;
    margin: 0 auto;
    padding: 40px 0 16px;
    display: grid;
    grid-template-columns: 660px 480px;
    grid-template-rows: 200px 28px 28px 24px;
    justify-content: space-between;
    gap: 40px 0;
    background: #0b0b0b;
  }
  .pc-about :deep(.pc-public-shell__support) { right: 24px; bottom: 24px; }
  .pc-about__footer::before { content: ""; position: absolute; left: 0; right: 0; height: 456px; margin-top: -40px; z-index: -1; background: #000; }
  .pc-about__footer-lead { align-self: center; }
  .pc-about__footer-lead > img { width: 80px; height: auto; display: block; }
  .pc-about__footer p { width: 660px; margin: 8px 0 0; color: #979797; font-size: 16px; line-height: 24px; }
  .pc-about__flags {
    width: 456px;
    height: 200px;
    justify-self: end;
    overflow: hidden;
  }
  .pc-about__flag-track {
    width: max-content;
    height: 143px;
    display: flex;
    align-items: flex-start;
    animation: pc-about-flags 17s linear infinite;
  }
  .pc-about__flags:hover .pc-about__flag-track { animation-play-state: paused; }
  .pc-about__flags img { width: 158px; height: 143px; flex: 0 0 auto; object-fit: contain; }
  .pc-about__footer-links { grid-column: 1 / -1; grid-row: 2 / 4; display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: 28px 28px; gap: 40px 16px; align-items: center; font-size: 18px; line-height: 28px; }
  .pc-about__footer button { padding: 0; border: 0; background: transparent; color: #fff; text-align: left; }
  .pc-about__footer .accent { display: inline-flex; align-items: center; gap: 8px; color: #daff45; }
  .pc-about__footer .accent img { width: 24px; height: 24px; object-fit: contain; }
  .pc-about__footer-links span { color: #fff; }
  .pc-about__footer small { grid-column: 1 / -1; grid-row: 4; align-self: end; color: #fff; }
  .pc-about__footer small b { color: #e82929; }
  @keyframes pc-about-flags { to { transform: translateX(-50%); } }
}
</style>
