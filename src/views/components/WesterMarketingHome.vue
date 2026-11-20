<template>
  <div ref="content" class="wester-marketing" lang="en" dir="ltr">
    <section class="wm-hero">
      <div class="wm-hero-inner">
        <div class="wm-hero-copy">
          <p class="wm-eyebrow" data-enter="fade" style="--wm-duration: 700ms">
            Hello, Iowa.
          </p>
          <h1
            class="wm-hero-title"
            data-enter="slide-bottom"
            style="--wm-duration: 900ms; --wm-delay: 150ms"
          >
            Websites that work as hard as <strong>Iowa businesses</strong> do.
          </h1>
          <p
            class="wm-body"
            data-enter="fade"
            style="--wm-duration: 800ms; --wm-delay: 450ms"
          >
            I design, write and build WordPress websites for Iowa businesses,
            then make sure Google sends people to them. One designer, start to
            finish, no hand-offs.
          </p>
          <div
            class="wm-hero-actions"
            data-enter="slide-bottom"
            style="--wm-duration: 700ms; --wm-delay: 700ms"
          >
            <RouterLink to="/contact" class="wm-btn-primary wm-button">
              Start your project
            </RouterLink>
            <RouterLink to="/contact" class="wm-btn-ghost wm-button">
              See the work
            </RouterLink>
          </div>
        </div>
        <div class="wm-hero-art" aria-hidden="true">
          <div
            class="wm-hero-disc"
            data-enter="scale"
            style="--wm-duration: 1000ms; --wm-delay: 300ms"
          ></div>
          <div
            class="wm-hero-block"
            data-enter="slide-left"
            style="--wm-duration: 1000ms; --wm-delay: 500ms"
          ></div>
          <div
            class="wm-hero-ring"
            data-enter="scale"
            style="--wm-duration: 900ms; --wm-delay: 750ms"
          ></div>
          <p
            class="wm-hero-caption"
            data-enter="fade"
            style="--wm-duration: 800ms; --wm-delay: 1100ms"
          >
            design + words + code
          </p>
          <div class="wm-hero-orbit"></div>
          <div class="wm-hero-star"></div>
        </div>
      </div>
    </section>
    <section class="wm-marquee">
      <div class="wm-marquee-track">
        <p class="wm-marquee-text">
          Web Design &nbsp;&nbsp;✺&nbsp;&nbsp; SEO &amp; Analytics
          &nbsp;&nbsp;✺&nbsp;&nbsp; Branding &nbsp;&nbsp;✺&nbsp;&nbsp; Print
          &amp; Digital Design &nbsp;&nbsp;✺&nbsp;&nbsp; Website Maintenance
          &nbsp;&nbsp;✺&nbsp;&nbsp; Made in Humboldt, Iowa
          &nbsp;&nbsp;✺&nbsp;&nbsp;
        </p>
        <p class="wm-marquee-text" aria-hidden="true">
          Web Design &nbsp;&nbsp;✺&nbsp;&nbsp; SEO &amp; Analytics
          &nbsp;&nbsp;✺&nbsp;&nbsp; Branding &nbsp;&nbsp;✺&nbsp;&nbsp; Print
          &amp; Digital Design &nbsp;&nbsp;✺&nbsp;&nbsp; Website Maintenance
          &nbsp;&nbsp;✺&nbsp;&nbsp; Made in Humboldt, Iowa
          &nbsp;&nbsp;✺&nbsp;&nbsp;
        </p>
      </div>
    </section>
    <section class="wm-stats">
      <div class="wm-stats-inner">
        <div
          class="wm-stat"
          data-reveal="slide-bottom"
          style="--wm-duration: 600ms"
        >
          <h2 class="wm-stat-value">18+</h2>
          <p class="wm-stat-label">years designing for businesses</p>
        </div>
        <div
          class="wm-stat"
          data-reveal="slide-bottom"
          style="--wm-duration: 600ms; --wm-delay: 120ms"
        >
          <h2 class="wm-stat-value">85+</h2>
          <p class="wm-stat-label">websites launched</p>
        </div>
        <div
          class="wm-stat"
          data-reveal="slide-bottom"
          style="--wm-duration: 600ms; --wm-delay: 240ms"
        >
          <h2 class="wm-stat-value">50+</h2>
          <p class="wm-stat-label">Iowa clients</p>
        </div>
        <div
          class="wm-stat"
          data-reveal="slide-bottom"
          style="--wm-duration: 600ms; --wm-delay: 360ms"
        >
          <h2 class="wm-stat-value">30+</h2>
          <p class="wm-stat-label">
            clients across SD, NE, MO, MN, TX &amp; OK
          </p>
        </div>
      </div>
    </section>
    <section class="wm-section wm-services">
      <div class="wm-inner">
        <div
          class="wm-section-heading"
          data-reveal="fade"
          style="--wm-duration: 800ms"
        >
          <p class="wm-eyebrow">What I do</p>
          <h2 class="wm-h2">
            Everything your business needs online, from one person who knows it.
          </h2>
        </div>
        <div class="wm-service-grid">
          <RouterLink
            class="wm-card"
            to="/contact"
            data-reveal="slide-bottom"
            style="--wm-duration: 650ms"
          >
            <span class="wm-service-number">01</span>
            <h3 class="wm-card-title">Web Design</h3>
            <p class="wm-body">
              Custom WordPress sites that load fast, look sharp on every phone
              and make the next step obvious.
            </p>
            <span class="wm-service-link">Explore web design →</span>
          </RouterLink>
          <RouterLink
            class="wm-card"
            to="/contact"
            data-reveal="slide-bottom"
            style="--wm-duration: 650ms; --wm-delay: 100ms"
          >
            <span class="wm-service-number">02</span>
            <h3 class="wm-card-title">SEO &amp; Analytics</h3>
            <p class="wm-body">
              Get found on Google by people nearby, and know which visits
              actually turn into calls.
            </p>
            <span class="wm-service-link">Explore SEO →</span>
          </RouterLink>
          <RouterLink
            class="wm-card"
            to="/contact"
            data-reveal="slide-bottom"
            style="--wm-duration: 650ms; --wm-delay: 200ms"
          >
            <span class="wm-service-number">03</span>
            <h3 class="wm-card-title">Branding</h3>
            <p class="wm-body">
              Logos, colors and brand guides that make your business look as
              good as it works.
            </p>
            <span class="wm-service-link">Explore branding →</span>
          </RouterLink>
          <RouterLink
            class="wm-card"
            to="/contact"
            data-reveal="slide-bottom"
            style="--wm-duration: 650ms; --wm-delay: 100ms"
          >
            <span class="wm-service-number">04</span>
            <h3 class="wm-card-title">Print &amp; Digital Design</h3>
            <p class="wm-body">
              Brochures, postcards, signs, social graphics and ads that match
              your brand.
            </p>
            <span class="wm-service-link">Explore design →</span>
          </RouterLink>
          <RouterLink
            class="wm-card wm-maintenance"
            to="/contact"
            data-reveal="slide-bottom"
            style="--wm-duration: 650ms; --wm-delay: 200ms"
          >
            <span class="wm-service-number">05</span>
            <h3 class="wm-card-title">Website Maintenance</h3>
            <p class="wm-body">
              Monthly updates, backups, security checks and small content edits,
              from $150 a month.
            </p>
            <span class="wm-service-link">See maintenance plans →</span>
          </RouterLink>
        </div>
      </div>
    </section>
    <section class="wm-section wm-work">
      <div class="wm-inner wm-work-inner">
        <div
          class="wm-section-heading"
          data-reveal="fade"
          style="--wm-duration: 800ms"
        >
          <p class="wm-eyebrow">Recent work</p>
          <h2 class="wm-h2 wm-work-heading">Real projects. Real results.</h2>
        </div>
        <div class="wm-work-grid">
          <RouterLink
            class="wm-project"
            to="/contact"
            data-reveal="slide-bottom"
            style="--wm-duration: 750ms"
          >
            <span class="wm-project-grell">Grell Roofing</span>
            <span class="wm-project-label"
              >Web Design · SEO &amp; Analytics</span
            >
            <h3 class="wm-project-title">
              A commercial roofing website built to be found.
            </h3>
            <p class="wm-project-description">
              Design, copy and build for Grell Roofing, with local SEO and lead
              tracking set up so every estimate request is counted.
            </p>
            <span class="wm-project-link">Read the case study →</span>
            <img
              decoding="async"
              class="wm-project-grell-image"
              src="/westermedia/homepage/grell-website-mockup-1024x538.jpg"
              width="800"
              height="420"
              srcset="
                /westermedia/homepage/grell-website-mockup-1024x538.jpg 1024w,
                /westermedia/homepage/grell-website-mockup-300x158.jpg   300w,
                /westermedia/homepage/grell-website-mockup-768x403.jpg   768w,
                /westermedia/homepage/grell-website-mockup-1536x807.jpg 1536w,
                /westermedia/homepage/grell-website-mockup.jpg          1641w
              "
              alt=""
            />
          </RouterLink>
          <RouterLink
            class="wm-project"
            to="/contact"
            data-reveal="slide-bottom"
            style="--wm-duration: 750ms; --wm-delay: 150ms"
          >
            <span class="wm-project-haul">Built for the Long Haul</span>
            <span class="wm-project-label">Web Design</span>
            <h3 class="wm-project-title">
              A sale catalog buyers can search online.
            </h3>
            <p class="wm-project-description">
              A bull sale website with searchable sale listings for Downey Ranch
              and Kniebel Cattle Co.
            </p>
            <span class="wm-project-link">Read the case study →</span>
            <img
              decoding="async"
              class="wm-project-haul-image"
              src="/westermedia/homepage/built-for-the-long-haul-website-mockup-1024x613.jpg"
              width="800"
              height="479"
              srcset="
                /westermedia/homepage/built-for-the-long-haul-website-mockup-1024x613.jpg 1024w,
                /westermedia/homepage/built-for-the-long-haul-website-mockup-300x180.jpg   300w,
                /westermedia/homepage/built-for-the-long-haul-website-mockup-768x460.jpg   768w,
                /westermedia/homepage/built-for-the-long-haul-website-mockup-1536x919.jpg 1536w,
                /westermedia/homepage/built-for-the-long-haul-website-mockup.jpg          1577w
              "
              alt=""
            />
          </RouterLink>
          <RouterLink
            class="wm-project"
            to="/contact"
            data-reveal="slide-bottom"
            style="--wm-duration: 750ms; --wm-delay: 300ms"
          >
            <span class="wm-project-wells">Wells Ag Supply</span>
            <span class="wm-project-label">Web Design · Copywriting</span>
            <h3 class="wm-project-title">
              An ag supply website that puts farmers in control.
            </h3>
            <p class="wm-project-description">
              Copy, design, build and ongoing maintenance for an independent ag
              inputs supplier in Fonda, Iowa.
            </p>
            <span class="wm-project-link">Read the case study →</span>
            <img
              loading="lazy"
              decoding="async"
              class="wm-project-wells-image"
              src="/westermedia/homepage/wells-ag-supply-website-mockup-1024x538.jpg"
              width="800"
              height="420"
              srcset="
                /westermedia/homepage/wells-ag-supply-website-mockup-1024x538.jpg 1024w,
                /westermedia/homepage/wells-ag-supply-website-mockup-300x158.jpg   300w,
                /westermedia/homepage/wells-ag-supply-website-mockup-768x403.jpg   768w,
                /westermedia/homepage/wells-ag-supply-website-mockup-1536x807.jpg 1536w,
                /westermedia/homepage/wells-ag-supply-website-mockup.jpg          1641w
              "
              alt="Wells Ag Supply website homepage designed by WesterMedia"
            />
          </RouterLink>
        </div>
        <div class="wm-work-actions">
          <RouterLink to="/contact" class="wm-work-button wm-button">
            See all work
          </RouterLink>
        </div>
      </div>
      <span class="wm-work-watermark" aria-hidden="true"
        >made in Iowa ✺ made in Iowa ✺ made in Iowa</span
      >
    </section>
    <section class="wm-section wm-process">
      <div class="wm-inner">
        <div class="wm-section-heading">
          <p class="wm-eyebrow">How it works</p>
          <h2 class="wm-h2">
            A simple process, and you always know where things stand.
          </h2>
        </div>
        <div class="wm-process-track" aria-hidden="true">
          <div class="wm-process-progress"></div>
        </div>
        <div class="wm-process-grid">
          <div
            class="wm-step"
            data-reveal="slide-left"
            style="--wm-duration: 650ms"
          >
            <span class="wm-step-number">1</span>
            <h3 class="wm-card-title">Talk</h3>
            <p class="wm-body">
              A free call about your business, your customers and what the
              website needs to do.
            </p>
          </div>
          <div
            class="wm-step"
            data-reveal="slide-left"
            style="--wm-duration: 650ms; --wm-delay: 150ms"
          >
            <span class="wm-step-number">2</span>
            <h3 class="wm-card-title">Plan</h3>
            <p class="wm-body">
              A sitemap, quote and timeline, so nothing is a surprise.
            </p>
          </div>
          <div
            class="wm-step"
            data-reveal="slide-left"
            style="--wm-duration: 650ms; --wm-delay: 300ms"
          >
            <span class="wm-step-number">3</span>
            <h3 class="wm-card-title">Build</h3>
            <p class="wm-body">
              I write the copy, design the pages and build the site, with your
              feedback at each stage.
            </p>
          </div>
          <div
            class="wm-step"
            data-reveal="slide-left"
            style="--wm-duration: 650ms; --wm-delay: 450ms"
          >
            <span class="wm-step-number">4</span>
            <h3 class="wm-card-title">Grow</h3>
            <p class="wm-body">
              Launch, SEO setup, analytics, and ongoing maintenance if you want
              it.
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="wm-section wm-about">
      <div class="wm-about-inner">
        <div
          class="wm-portrait"
          data-reveal="slide-left"
          style="--wm-duration: 900ms"
        >
          <img
            loading="lazy"
            decoding="async"
            class="wm-portrait-image"
            src="/westermedia/homepage/chelsey-westermedia-headshot-1024x1024.jpg"
            width="800"
            height="800"
            srcset="
              /westermedia/homepage/chelsey-westermedia-headshot-1024x1024.jpg 1024w,
              /westermedia/homepage/chelsey-westermedia-headshot-300x300.jpg    300w,
              /westermedia/homepage/chelsey-westermedia-headshot-150x150.jpg    150w,
              /westermedia/homepage/chelsey-westermedia-headshot-768x768.jpg    768w,
              /westermedia/homepage/chelsey-westermedia-headshot.jpg           1200w
            "
            alt=""
          />
        </div>
        <div
          class="wm-about-copy"
          data-reveal="fade"
          style="--wm-duration: 900ms; --wm-delay: 200ms"
        >
          <p class="wm-eyebrow">Why WesterMedia</p>
          <h2 class="wm-h2">
            A designer, a writer and a developer. All one person.
          </h2>
          <p class="wm-body">
            Most small businesses end up juggling a designer, a copywriter and a
            web developer, and paying for the gaps between them. I've been
            designing and building websites since 2008, and I write and build as
            well as design. When I build your website, the words, the design and
            the code are made to work together from the start.
          </p>
          <RouterLink class="wm-about-action" to="/contact">
            <span class="wm-about-link">More about me →</span>
          </RouterLink>
        </div>
      </div>
    </section>
    <section class="wm-cta">
      <h2 class="wm-cta-title" data-reveal="scale" style="--wm-duration: 800ms">
        Ready for a website that brings in business?
      </h2>
      <p class="wm-cta-copy">
        Tell me about your project. I'll get back to you within two business
        days with next steps and a quote.
      </p>
      <RouterLink to="/contact" class="wm-btn-ghost wm-cta-button wm-button">
        Start your project
      </RouterLink>
      <div class="wm-cta-ring"></div>
      <div class="wm-cta-disc"></div>
      <div class="wm-cta-star"></div>
      <div class="wm-cta-outline"></div>
    </section>
    <footer class="wm-section-dark wm-footer">
      <div class="wm-footer-inner">
        <div class="wm-footer-intro">
          <p class="wm-footer-eyebrow">Let's make something good.</p>
          <h2 class="wm-footer-title">
            Websites, SEO and branding for Iowa businesses.
          </h2>
          <RouterLink to="/contact" class="wm-footer-button wm-button">
            Start your project
          </RouterLink>
        </div>

        <hr class="wm-footer-divider" />
        <div class="wm-footer-bottom">
          <p class="wm-footer-copyright">
            © 2026 WesterMedia. All rights reserved.
          </p>
          <p class="wm-footer-signature">
            Designed, written and built in Humboldt, Iowa ✺
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import "./wester-marketing.css";

const content = ref(null);
let stopAnimations;

onMounted(() => {
  const root = content.value.parentElement;
  const page = root.parentElement;
  const reveal = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("wm-revealed");
        reveal.unobserve(entry.target);
      }
    },
    { root },
  );

  for (const element of content.value.querySelectorAll("[data-reveal]")) {
    reveal.observe(element);
  }

  const scrollEffects = [
    [".wm-hero-art", 1],
    [".wm-work-watermark", 1],
    [".wm-process-progress", 0.6],
  ].map(([selector, end]) => ({
    element: content.value.querySelector(selector),
    end,
  }));

  let frame;
  function updateScrollEffects() {
    frame = undefined;
    const scrollTop = root.scrollTop;
    const height = page.clientHeight;
    const progress = scrollEffects.map(({ element, end }) => {
      // Use layout offsets so the animated transform never feeds back into its progress.
      let top = root.offsetTop;
      for (
        let ancestor = element;
        ancestor && ancestor !== root;
        ancestor = ancestor.offsetParent
      ) {
        top += ancestor.offsetTop;
      }
      return Math.max(0, Math.min(1, (top - scrollTop) / (height * end)));
    });
    scrollEffects.forEach(({ element }, index) => {
      element.style.setProperty("--wm-progress", progress[index]);
    });
  }

  function scheduleScrollEffects() {
    if (frame === undefined) frame = requestAnimationFrame(updateScrollEffects);
  }

  const resize = new ResizeObserver(scheduleScrollEffects);
  resize.observe(root);
  resize.observe(content.value);
  root.addEventListener("scroll", scheduleScrollEffects, { passive: true });
  updateScrollEffects();

  stopAnimations = () => {
    reveal.disconnect();
    resize.disconnect();
    root.removeEventListener("scroll", scheduleScrollEffects);
    cancelAnimationFrame(frame);
  };
});

onBeforeUnmount(() => stopAnimations?.());
</script>
