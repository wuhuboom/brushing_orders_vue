<template>
  <main class="about-page">
    <div class="about-titlebar">
      <div class="about-container about-titlebar__inner">
        <router-link to="/" class="back-button" aria-label="Back to home"><SiteIcon name="back" /></router-link>
        <h1>About Us</h1>
        <span class="overview-badge">OFFICIAL OVERVIEW &amp; GOVERNANCE</span>
        <nav class="breadcrumbs" aria-label="Breadcrumb"><router-link to="/">Home</router-link><span>/</span><span aria-current="page">About Us</span></nav>
      </div>
    </div>

    <div class="about-container about-content">
      <section class="about-panel what-we-do" aria-labelledby="what-title">
        <header class="panel-heading">
          <div class="section-mark"></div>
          <h2 id="what-title">WHAT WE DO</h2>
          <p>Technology-driven growth marketing and enterprise performance scaling.</p>
        </header>
        <div class="about-copy-grid">
          <div>
            <p class="intro-callout">world of good is a technology-driven growth marketing firm driven by an exceptional team of consulting marketers, creatives, analysts, and technologists. We drive revenue growth and brand awareness for merchants at ecommerce companies around the world (uch as Shopify, Amazon, eBay, and Etsy)</p>
            <p>Marketing is no longer about a singular offer or what your brand presents visually. It's a sprawling journey with countless touch points</p>
            <p>Consumers shop with their values and gravitate towards brands they trust. They want to be a part of a tribe. A story. What's more, the path to purchase needs to be fast, frictionless and personable</p>
            <p>The media landscape is vastly different, too. Measurement is smarter but also harder than ever</p>
          </div>
          <div>
            <p>Marketing should be a strategic business driver, a road that leads to profitable revenue growth and brand lift</p>
            <p>We take the guesswork out of marketing, making the most from your investment so you get what you really care about: growth, handled from planning to execution</p>
            <p>Our experienced team develops custom marketing playbooks fueled by your data, market trends and industry insights to set you apart from the competition, designed to drive revenue and brand lift</p>
            <p class="technology-callout">Our proprietary technology, nova, analyzes a company's digital ecosystem using multiple first-party data sources to build informed and custom marketing plans. And, nova de-risks investments by optimizing capital allocation—putting marketers, operators and the investment community in a strategic seat at the table</p>
            <p class="closing-copy">When you know the customer journey, singular channels don't matter because you're building a strategic program. That's what we are in the business of: igniting growth and brand recognition for the brands we are lucky to call our clients</p>
          </div>
        </div>
      </section>

      <section class="operations" aria-labelledby="operations-title">
        <div class="section-mark"></div>
        <h2 id="operations-title">Core Operations &amp; Service System</h2>
        <p class="section-description">Platform performance tiers, decentralized partner services, and collaborative daily tasks.</p>
        <div class="operations-grid">
          <article v-for="service in services" :key="service.title" class="service-card">
            <div class="service-icon"><SiteIcon :name="service.icon" /></div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </article>
        </div>
      </section>

      <section class="about-panel terms-panel" aria-labelledby="terms-title">
        <header class="panel-heading terms-heading">
          <div class="section-mark"></div>
          <div class="terms-heading__row"><h2 id="terms-title">Terms of Operation, Compliance &amp; User Protections</h2><span class="document-label">COMPLIANCE DOC #2026-US-WOG</span></div>
          <p>Complete platform regulations, legal compliance frameworks, and guidelines (Sections 1.0 – 14.0).</p>
        </header>
        <div class="terms-grid">
          <article v-for="(term, index) in terms" :key="term.title" class="term">
            <h3><span class="term-number">{{ index + 1 }}</span>{{ term.title }}</h3>
            <ul><li v-for="(item, itemIndex) in term.items" :key="itemIndex"><strong>{{ index + 1 }}.{{ itemIndex + 1 }})<template v-if="item.label"> {{ item.label }}:</template></strong> {{ item.text }}</li></ul>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import SiteIcon from "@/components/SiteIcon.vue";
import { services, terms } from "@/content/about";

export default {
  name: "About",
  components: { SiteIcon },
  data: () => ({ services, terms }),
};
</script>
