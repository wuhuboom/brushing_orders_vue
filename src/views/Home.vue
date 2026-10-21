<template>
  <main class="home-page">
    <section class="home-hero" aria-labelledby="hero-title">
      <img class="home-hero__image" src="worldofgood/hero.jpg" alt="People connecting through their mobile devices" fetchpriority="high" />
      <div class="home-hero__shade"></div>
      <div class="home-hero__content page-container">
        <p class="eyebrow">DIGITAL INVENTIVENESS</p>
        <h1 id="hero-title">Creating <span>Real</span><br />Business Value</h1>
        <p class="home-hero__description">Transforming ideas into meaningful digital experiences that drive<br class="desktop-break" /> growth for brands, businesses and nonprofits.</p>
      </div>
    </section>

    <div class="page-container home-content">
      <section class="home-intro two-columns" aria-labelledby="intro-title">
        <div>
          <div class="section-mark"></div>
          <h2 id="intro-title">We're a digital marketing agency based in California City</h2>
          <p class="body-copy">World of Good helps forward-thinking B2B &amp; B2C organizations navigate the complexity of today's digital landscape. We unite high-impact brand storytelling, design systems, and modern performance marketing to cultivate meaningful audience connections and sustainable growth.</p>
          <div class="intro-stats">
            <div><p><strong>10+</strong> <span>Years</span></p><small>Crafting transformative digital brand experiences</small></div>
            <div><p><strong>98%</strong> <span>Retention</span></p><small>Long-term partnerships rooted in tangible ROI</small></div>
          </div>
        </div>
        <figure class="studio-image">
          <img src="worldofgood/studio.webp" alt="Our collaborative team at the California City Studio" width="677" height="361" />
        </figure>
      </section>

      <section class="home-approach" aria-labelledby="approach-title">
        <div class="section-mark"></div>
        <h2 id="approach-title" class="section-heading">Our Approach</h2>
        <div class="two-columns approach-content">
          <p class="body-copy">Competition is as fierce in the digital world as it is across virtually every business segment. Brands, businesses and nonprofits that anchor their digital experiences with smart integrated planning, emotional understanding, artful design and insightful analysis create sustainable engagement.</p>
          <img class="approach-image" src="worldofgood/approach.webp" alt="Integrated digital marketing, design, social media and analytics" width="680" height="311" loading="lazy" />
        </div>
      </section>

      <section class="home-expertise two-columns" aria-labelledby="expertise-title">
        <div>
          <div class="section-mark"></div>
          <h2 id="expertise-title" class="section-heading">Agency Expertise</h2>
          <p class="body-copy">The strength of our digital agency lies in an ever-evolving set of core competencies nimbly combined and refined into a custom solution for our clients and their brands.</p>
        </div>
        <ul class="expertise-list">
          <li v-for="service in expertise" :key="service.title"><span class="expertise-icon"><SiteIcon :name="service.icon" /></span><span>{{ service.title }}</span></li>
        </ul>
      </section>

      <section class="home-world" aria-labelledby="world-title">
        <div class="section-mark"></div>
        <h2 id="world-title" class="section-heading">Discover Our World</h2>
        <div class="case-grid">
          <article v-for="project in projects" :key="project.title" class="case-card">
            <img :src="'worldofgood/' + project.image" :alt="project.alt" width="382" height="250" loading="lazy" />
            <div class="sr-only"><h3>{{ project.title }}</h3><p>{{ project.description }}</p></div>
          </article>
        </div>
      </section>

      <section class="home-clients" aria-labelledby="clients-title">
        <h2 id="clients-title" class="eyebrow clients-heading"><span class="section-mark"></span>SOME OF OUR AWESOME CLIENTS</h2>
        <div class="client-logos">
          <img v-for="client in clients" :key="client.name" :src="'worldofgood/' + client.image" :alt="client.name" loading="lazy" />
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import SiteIcon from "@/components/SiteIcon.vue";

export default {
  name: "Home",
  components: { SiteIcon },
  data: () => ({
    expertise: [
      { title: "Digital Strategy", icon: "chart" },
      { title: "UX/Web Design", icon: "code" },
      { title: "Social Media", icon: "people" },
      { title: "Paid Media", icon: "media" },
      { title: "Digital Marketing", icon: "megaphone" },
      { title: "Search", icon: "search" },
    ],
    projects: [
      { title: "Zoetis", description: "Pet care marketing for consumers and professionals", image: "zoetis.webp", alt: "Veterinary professionals caring for a dog" },
      { title: "Goya Foods", description: "Comprehensive digital support services", image: "goya.webp", alt: "Freshly baked golden empanadas" },
      { title: "AkzoNobel", description: "Converting brand excitement into higher conversion rates", image: "akzonobel.webp", alt: "A yacht at sea" },
    ],
    clients: [
      { name: "AgEagle", image: "ageagle.png" },
      { name: "NYU Langone Health", image: "nyu.png" },
      { name: "organicgirl", image: "organicgirl.png" },
      { name: "Newman's Own", image: "newmans-own.png" },
      { name: "UNDP", image: "undp.png" },
    ],
  }),
};
</script>
