<template>
  <main
    ref="pageRef"
    class="das-page home-page"
    :class="{ 'skip-entry-animations': skipEntryAnimations }"
  >
    <section class="legacy-hero">
      <HeaderTop />
      <div class="legacy-hero__copy">
        <h1 aria-label="Your best cohorts are hiding in plain sight.">
          <span aria-hidden="true">Your best&nbsp;</span
          ><span class="legacy-hero__typed-word" aria-hidden="true">{{
            typedHeroWord
          }}</span
          ><span
            class="legacy-hero__cursor"
            :class="{ visible: heroCursorVisible }"
            aria-hidden="true"
            >|</span
          ><br aria-hidden="true" /><span aria-hidden="true"
            >are hiding in plain sight.</span
          >
        </h1>
        <p class="legacy-hero__summary">
          We find them—and build the creative, media, and retention strategy
          around them.
        </p>
        <p class="legacy-hero__fit">
          <span aria-hidden="true">↳</span>
          <span
            >For retail and e-commerce companies generating $15M–$100M+</span
          >
        </p>
      </div>
    </section>

    <div class="target-page-shell">
      <section class="target-white-card">
        <div class="target-content">
          <div class="target-main-content">
            <section class="stats-section">
              <div ref="statsRef" class="hero-stats intro-fade intro-fade--1">
                <div class="hero-stat">
                  <strong>13 yrs</strong>
                  <i></i>
                  <span>In ecommerce</span>
                </div>
                <div class="hero-stat">
                  <strong>{{ brandCount }}+</strong>
                  <i></i>
                  <span>Brand engagements</span>
                </div>
                <div class="hero-stat">
                  <strong>4+ yrs</strong>
                  <i></i>
                  <span>Avg. client retention</span>
                </div>
              </div>
            </section>

            <section
              class="logo-marquee client-marquee intro-fade intro-fade--5"
            >
              <div class="marquee-label marquee-label--clients">
                Clients &amp;<br />Partners
              </div>
              <div class="marquee-window">
                <div class="marquee-track marquee-track--clients">
                  <div
                    v-for="(client, index) in doubledClients"
                    :key="`${client.name}-${index}`"
                    class="marquee-item marquee-item--client"
                  >
                    <img
                      :src="`/das-home/clients/${client.logo}`"
                      :alt="client.name"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section class="legacy-shortcuts intro-fade intro-fade--6">
              <h2>{{ $t("das.home.shortcuts") }}</h2>
              <div class="legacy-shortcuts__grid">
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

            <section class="work-video intro-fade intro-fade--7">
              <video autoplay loop muted playsinline preload="metadata">
                <source src="/das-home/work-bumper.mp4" type="video/mp4" />
              </video>
            </section>

            <section
              class="testimonials intro-fade intro-fade--7"
              @pointerdown="startQuoteSwipe"
              @pointerup="finishQuoteSwipe"
              @pointercancel="cancelQuoteSwipe"
            >
              <p class="section-kicker">What Brands Are Saying</p>
              <div class="testimonial-window">
                <transition name="quote-shift" mode="out-in">
                  <article :key="testimonialIndex" class="testimonial">
                    <blockquote>“{{ currentTestimonial.quote }}”</blockquote>
                    <p>
                      <strong>{{ currentTestimonial.author }}</strong
                      ><span
                        >, {{ currentTestimonial.title }},
                        {{ currentTestimonial.company }}</span
                      >
                    </p>
                  </article>
                </transition>
              </div>
              <div class="testimonial-progress" aria-label="Testimonials">
                <button
                  v-for="(_, index) in testimonials"
                  :key="index"
                  type="button"
                  :aria-label="`View testimonial ${index + 1}`"
                  @click="selectTestimonial(index)"
                >
                  <i
                    v-if="index === testimonialIndex"
                    :key="testimonialCycle"
                  ></i>
                </button>
              </div>
            </section>

            <section class="old-model scroll-reveal">
              <h2>The old model is broken.</h2>
              <p>
                And when customer personas aren't tied to LTV curves, payback
                periods, and contribution margin, every decision downstream is
                built on a guess. CMOs don't need more execution. They need an
                intelligence system—one that starts with the audience, and
                builds everything else around what it reveals.
              </p>
            </section>

            <section ref="pillarsRef" class="pillars scroll-reveal">
              <article
                v-for="(pillar, index) in pillars"
                :key="pillar.title"
                class="pillar"
                :class="{ 'pillar--wide': index === 0 }"
              >
                <h3>{{ pillar.title }}</h3>
                <div class="pillar-art">
                  <object
                    type="image/svg+xml"
                    :data="pillarAsset(pillar, index)"
                    :aria-label="`${pillar.title} illustration`"
                  ></object>
                </div>
                <p class="pillar-copy" v-html="pillar.copy"></p>
                <div class="pillar-proof">
                  <span aria-hidden="true">↳</span>
                  <p>{{ pillar.proof }}</p>
                </div>
              </article>
            </section>

            <section ref="compoundRef" class="compounding scroll-reveal">
              <p class="section-kicker">How It Compounds</p>
              <div>
                <p
                  v-for="(line, index) in compoundLines"
                  :key="line"
                  class="compound-line"
                  :class="{ visible: compoundVisible }"
                  :style="{ transitionDelay: `${index * 300}ms` }"
                >
                  {{ line }}
                </p>
              </div>
            </section>

            <section class="positioning-card scroll-reveal">
              <h2>
                The audience development and customer intelligence partner for
                retail and e-commerce companies generating $15M–$100M. We find
                the customers who drive the most value, build everything around
                them, and then find more of them.
              </h2>
              <a
                href="https://madebydas.com/founder-letter"
                target="_blank"
                rel="noopener noreferrer"
              >
                A note from our founder
                <span class="arrow-swap" aria-hidden="true"
                  ><i>→</i><i>→</i></span
                >
              </a>
            </section>

            <section class="logo-marquee platform-marquee scroll-reveal">
              <div class="marquee-label marquee-label--platforms">
                Fluent in<br />your stack
              </div>
              <div class="marquee-window">
                <div class="marquee-track marquee-track--platforms">
                  <div
                    v-for="(platform, index) in doubledPlatforms"
                    :key="`${platform.name}-${index}`"
                    class="marquee-item marquee-item--platform"
                  >
                    <img
                      :src="`/das-home/platforms/${platform.logo}`"
                      :alt="platform.name"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section class="faq-section scroll-reveal">
              <p class="section-kicker">Frequently Asked Questions</p>
              <div class="faq-list">
                <article
                  v-for="(item, index) in faqs"
                  :key="item.question"
                  class="faq-item"
                  :class="{ open: openFaq === index }"
                >
                  <button type="button" @click="toggleFaq(index)">
                    <span>{{ item.question }}</span>
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </button>
                  <div class="faq-answer">
                    <div>
                      <p v-for="answer in item.answers" :key="answer">
                        {{ answer }}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <section class="ask-ai scroll-reveal">
              <p>Ask AI about DAS</p>
              <div>
                <a
                  v-for="ai in aiLinks"
                  :key="ai.name"
                  :href="ai.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  :title="`Ask ${ai.name} about DAS`"
                >
                  <img :src="`/das-home/icons/${ai.icon}`" :alt="ai.name" />
                </a>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section class="site-footer-reveal" aria-label="DAS footer">
        <p class="site-footer-reveal__location">
          Consider your audience® in
          <transition name="city-fade" mode="out-in">
            <span :key="currentCity">{{ currentCity }}</span>
          </transition>
        </p>
        <a href="mailto:newbiz@madebydas.com">newbiz@madebydas.com</a>
        <a
          href="https://madebydas.com/founder-letter"
          target="_blank"
          rel="noopener noreferrer"
          >A note from our founder</a
        >
        <a
          href="https://intelligence.madebydas.com"
          target="_blank"
          rel="noopener noreferrer"
          >Intelligence Library →</a
        >
        <img src="/das-home/workmark-black.png" alt="DAS" />
        <div class="site-footer-reveal__legal">
          <span>© 2013–2026 DAS</span><i>·</i>
          <a
            href="https://madebydas.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            >Privacy</a
          ><i>·</i>
          <a
            href="https://madebydas.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            >Terms</a
          ><i>·</i>
          <a
            href="https://madebydas.com/accessibility"
            target="_blank"
            rel="noopener noreferrer"
            >Accessibility</a
          >
        </div>
      </section>
    </div>

    <Footer name="/" />
  </main>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import DasIcon from "@/components/DasIcon.vue";
import Footer from "@/components/Footer.vue";
import HeaderTop from "@/components/HeaderTop.vue";
import { safePush } from "@/utils/navigation";

const router = useRouter();
const HOME_SCROLL_STORAGE_KEY = "das-home-scroll-top";
const DOCUMENT_SCROLL_CLASS = "das-home-document-scroll";
const isDocumentScrollMode = () =>
  window.matchMedia("(min-width: 768px)").matches;

const getSavedScrollTop = () => {
  try {
    const saved = Number(sessionStorage.getItem(HOME_SCROLL_STORAGE_KEY));
    sessionStorage.removeItem(HOME_SCROLL_STORAGE_KEY);
    return Number.isFinite(saved) && saved > 0 ? saved : 0;
  } catch {
    return 0;
  }
};

const savedScrollTop = getSavedScrollTop();
const skipEntryAnimations = savedScrollTop > 0;

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

const pageRef = ref(null);
const statsRef = ref(null);
const pillarsRef = ref(null);
const compoundRef = ref(null);

const heroWords = ["customers", "audiences", "fans", "segments", "cohorts"];
const typedHeroWord = ref("");
const heroWordIndex = ref(0);
const heroDeleting = ref(false);
const heroCursorVisible = ref(true);
const brandCount = ref(2);
const animatedPillarIndex = ref(-1);
const compoundVisible = ref(false);
const openFaq = ref(null);
const currentCity = ref("New York, NY");

const clients = [
  { name: "Koia", logo: "koia_logo.png" },
  { name: "Leesa", logo: "leesa_logo copy.png" },
  { name: "Create", logo: "create_logo1.png" },
  { name: "Vivid Seats", logo: "vividseats_logo copy.png" },
  { name: "Hydrant", logo: "hydrant_logo.png" },
  { name: "Eden", logo: "Eden__Logo.jpg" },
  { name: "Kino Lorber", logo: "Kino_Lorber_logo.svg" },
  { name: "Chomps", logo: "chomps_logo.png" },
  { name: "AMIRI", logo: "amiri_logo.png" },
  { name: "Glamnetic", logo: "glamnetic_logo 1.png" },
  { name: "Simplehuman", logo: "Simplehuman_logo.png" },
  { name: "Ted Baker", logo: "ted-baker_logo.png" },
  { name: "Scotts Flowers NYC", logo: "sottsflowers_logo2.png" },
];

const platforms = [
  { name: "Meta Business Partner", logo: "meta.png" },
  { name: "Google Partner", logo: "google-ads.png" },
  { name: "YouTube Advertising", logo: "youtube.svg" },
  { name: "TikTok Marketing Partners", logo: "tiktok.png" },
  { name: "Shopify Plus Partner", logo: "shopify-plus-badge.svg" },
  { name: "Triple Whale", logo: "triple-whale.png" },
  { name: "Northbeam", logo: "northbeam.png" },
  { name: "PostPilot", logo: "postpilot.png" },
  { name: "Klaviyo Master Platinum", logo: "klaviyo-master-platinum.png" },
];

const doubledClients = computed(() => [...clients, ...clients]);
const doubledPlatforms = computed(() => [...platforms, ...platforms]);

const testimonials = [
  {
    quote:
      "Partnering with DAS was a game-changer for us. They helped us successfully launch key initiatives like our Costco.com campaign and multiple new product lines. Their strategy and data-driven approach ensured every channel was seamless and impactful.",
    author: "Diane DiLorenzo",
    title: "VP, Marketing",
    company: "Koia",
  },
  {
    quote:
      "The Leesa spots are truly incredible. Their approach to world-building and product discovery, paired with their creativity, dedication, and ability to bring our vision to life, exceeded all expectations in balancing performance branding with storytelling.",
    author: "Jen Pressley",
    title: "Head of Brand",
    company: "3Z Brands",
  },
  {
    quote:
      "Email list nearly doubled. Monthly sales increased. Their ability to adapt to our aesthetic while challenging our thinking has been invaluable.",
    author: "John Cassella",
    title: "VP Operations & E-Commerce",
    company: "J. Queen New York",
  },
];

const testimonialIndex = ref(0);
const testimonialCycle = ref(0);
const currentTestimonial = computed(() => testimonials[testimonialIndex.value]);

const pillars = [
  {
    key: "intelligence",
    title: "Intelligence",
    copy: "We build personas as financial cohorts, tied to LTV curves, CAC payback, and contribution margin. Value concentration, behavioral patterns, and predictive signals mapped to unit economics to inform the greater intelligence system.",
    proof:
      "Identified a 12% high-value cohort driving 41% of revenue — previously invisible in standard reporting.",
  },
  {
    key: "creative",
    title: "Creative",
    copy: "Informed by insight, <em>not</em> intuition. Campaigns that resonate because they're built for who actually purchases. Developed by in-house designers, reading the same data the media team reads.",
    proof:
      "2.3x ROAS improvement on Meta after rebuilding creative around actual purchaser profiles.",
  },
  {
    key: "media",
    title: "Media",
    copy: "Efficient, precise, and targeted. When you know who your best customers are, you stop paying to find the wrong ones.",
    proof:
      "34% CAC reduction by reallocating spend toward segments with proven repeat purchase behavior.",
  },
  {
    key: "retention",
    title: "Retention",
    copy: "Your best customers get recognized. At-risk customers get caught before they leave. For brands with 30%+ owned-channel revenue, retention is the P&amp;L.",
    proof:
      "19% lift in repeat purchase rate through differential treatment of at-risk vs. high-value customers.",
  },
  {
    key: "ai-orchestration",
    title: "AI Orchestration",
    copy: "Proprietary AI workflows synchronize intelligence, creative, media, and retention into a single operating rhythm. Every signal informs every decision, in real time.",
    proof:
      "AI-driven cohort models update weekly — feeding creative rotation, bid strategy, and lifecycle triggers simultaneously.",
  },
];

const compoundLines = [
  "Audience analysis drives the brief.",
  "The brief drives media targeting.",
  "Media-acquired customers feed into retention.",
  "Retention data updates the intelligence.",
  "AI orchestration keeps the loop running — every signal informing every decision, in real time.",
];

const faqs = [
  {
    question: "What does 'audience development' actually mean?",
    answers: [
      "Audience development means building your customer base as a compounding business asset. Most brands optimize for acquisition and hope retention sorts itself out. We invert that: define who the right customer actually is (margin, repeat behavior, payback window), build the lifecycle engine that retains them intentionally, then loop those learnings back into acquisition so you spend more on what compounds and less on what dilutes. The audience you build is either an asset or a cost center. We help you know which one you have—and what to do about it.",
    ],
  },
  {
    question:
      "We've worked with good agencies before. Why didn't we see results?",
    answers: [
      "Probably because creative, media, and retention were optimizing in isolation—each hitting their own KPIs while margin leaked between them. A 20% lift in ROAS doesn't help if you're acquiring customers who never repeat. A channel that looks efficient in platform but fails an incrementality test is just subsidized organic. A higher open rate doesn't matter if you're emailing your least profitable segment the hardest. Most agencies execute. Fewer connect the execution to whether the business actually got more valuable. That's the gap.",
    ],
  },
  {
    question: "What will you bring that our internal team can't see?",
    answers: [
      "Outside pattern recognition — and the time to find it. Most teams know blended CAC and platform ROAS. Fewer know CAC payback by acquisition source, or that their LTV is calculated on revenue instead of margin. We do that work: profitability by channel, segment, and cohort, then connect it to the decisions that actually matter.",
    ],
  },
  {
    question: "Will you tell us when our idea won't work?",
    answers: [
      "Yes. And in terms that hold up in a board room. If your segmentation is chasing high-activity but low-margin customers, or your creative is optimizing for engagement instead of profit per acquisition, we'll tell you before you spend the budget proving it.",
    ],
  },
  {
    question: "How do we know if we're ready for DAS?",
    answers: [
      "A few signals: ROAS looks fine but margin keeps compressing. You're calculating LTV on revenue, not contribution margin. Email metrics are strong, but revenue per customer is flat. Your blended CAC looks healthy but new customer acquisition is underwater. Any of those.",
    ],
  },
  {
    question: "What should we budget to work with DAS?",
    answers: [
      "Most engagements start with the Margin Diagnostic — a focused analysis that identifies where your operations leak contribution margin and builds a 90-day recovery roadmap. The Diagnostic is $5,000, credited in full toward a retainer if we move forward together.",
      "Retainers start at $25,000/month and scale based on the number of pillars activated—intelligence, creative, media, retention—and scoping of immediate and long-term priorities.",
    ],
  },
  {
    question: "How do we know we won't get lost in your roster?",
    answers: [
      "We work with 12–15 retainer clients per year, by design. Value comes from knowing your business deeply. Most clients partner with us for 4+ years; tenure that doesn't happen if people feel lost.",
    ],
  },
];

const aiPrompt = encodeURIComponent(
  "What does DAS (madebydas.com) do differently as a customer intelligence agency for retail and e-commerce brands? How do their five pillars — intelligence, creative, media, retention, and AI orchestration — work together?",
);
const aiLinks = [
  {
    name: "ChatGPT",
    icon: "chatgpt.svg",
    url: `https://chatgpt.com/?q=${aiPrompt}`,
  },
  {
    name: "Claude",
    icon: "claude.png",
    url: `https://claude.ai/new?q=${aiPrompt}`,
  },
  {
    name: "Perplexity",
    icon: "perplexity.png",
    url: `https://www.perplexity.ai/search?q=${aiPrompt}`,
  },
];

const cityNames = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Miami, FL",
  "Austin, TX",
  "Denver, CO",
  "Boston, MA",
  "Atlanta, GA",
  "San Francisco, CA",
];

let quoteTimer;
let cityTimer;
let cityStartTimer;
let statsFrame;
let quoteSwipeStart = null;
let revealObserver;
let statsObserver;
let pillarsObserver;
let compoundObserver;
const pillarTimers = [];
let restoreScrollTimer;
let heroTypingTimer;
let heroCursorTimer;

const saveHomeScroll = () => {
  const scrollTop = isDocumentScrollMode()
    ? window.scrollY
    : pageRef.value?.scrollTop;
  if (!Number.isFinite(scrollTop)) return;

  try {
    sessionStorage.setItem(HOME_SCROLL_STORAGE_KEY, String(scrollTop));
  } catch {
    // The page still works when browser storage is unavailable.
  }
};

const restoreHomeScroll = async () => {
  await nextTick();
  const restore = () => {
    if (!pageRef.value) return;
    const scrollElement = isDocumentScrollMode()
      ? document.scrollingElement || document.documentElement
      : pageRef.value;
    const previousBehavior = scrollElement.style.scrollBehavior;
    scrollElement.style.scrollBehavior = "auto";

    if (isDocumentScrollMode()) window.scrollTo(0, savedScrollTop);
    else pageRef.value.scrollTop = savedScrollTop;

    window.requestAnimationFrame(() => {
      scrollElement.style.scrollBehavior = previousBehavior;
    });
  };

  window.requestAnimationFrame(() => window.requestAnimationFrame(restore));
  restoreScrollTimer = window.setTimeout(restore, 300);
};

const advanceHeroTypewriter = () => {
  const targetWord = heroWords[heroWordIndex.value];

  if (!heroDeleting.value && typedHeroWord.value === targetWord) {
    heroDeleting.value = true;
    heroTypingTimer = window.setTimeout(advanceHeroTypewriter, 2000);
    return;
  }

  if (heroDeleting.value && typedHeroWord.value === "") {
    heroDeleting.value = false;
    heroWordIndex.value = (heroWordIndex.value + 1) % heroWords.length;
    heroTypingTimer = window.setTimeout(advanceHeroTypewriter, 400);
    return;
  }

  typedHeroWord.value = heroDeleting.value
    ? targetWord.slice(0, typedHeroWord.value.length - 1)
    : targetWord.slice(0, typedHeroWord.value.length + 1);
  heroTypingTimer = window.setTimeout(
    advanceHeroTypewriter,
    heroDeleting.value ? 50 : 80,
  );
};

const startHeroTypewriter = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typedHeroWord.value = "cohorts";
    heroCursorVisible.value = false;
    return;
  }

  heroTypingTimer = window.setTimeout(advanceHeroTypewriter, 80);
  heroCursorTimer = window.setInterval(() => {
    heroCursorVisible.value = !heroCursorVisible.value;
  }, 530);
};

const goTo = (item) => {
  saveHomeScroll();
  safePush(router, item.route);
};

const animateStats = () => {
  const started = performance.now();
  const duration = 4600;
  const frame = (now) => {
    const progress = Math.min(1, (now - started) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    brandCount.value = Math.min(100, Math.round(2 + eased * 98));
    if (progress < 1) statsFrame = window.requestAnimationFrame(frame);
  };
  statsFrame = window.requestAnimationFrame(frame);
};

const pillarAsset = (pillar, index) => {
  const state = index <= animatedPillarIndex.value ? "animated" : "static";
  return `/das-home/pillars/pillar-${pillar.key}-${state}.svg`;
};

const restartQuoteTimer = () => {
  window.clearInterval(quoteTimer);
  quoteTimer = window.setInterval(() => {
    testimonialIndex.value = (testimonialIndex.value + 1) % testimonials.length;
    testimonialCycle.value += 1;
  }, 8000);
};

const selectTestimonial = (index) => {
  testimonialIndex.value = index;
  testimonialCycle.value += 1;
  restartQuoteTimer();
};

const startQuoteSwipe = (event) => {
  quoteSwipeStart = event.clientX;
};

const finishQuoteSwipe = (event) => {
  if (quoteSwipeStart === null) return;
  const distance = quoteSwipeStart - event.clientX;
  if (Math.abs(distance) > 50) {
    const next =
      distance > 0
        ? (testimonialIndex.value + 1) % testimonials.length
        : (testimonialIndex.value - 1 + testimonials.length) %
          testimonials.length;
    selectTestimonial(next);
  }
  quoteSwipeStart = null;
};

const cancelQuoteSwipe = () => {
  quoteSwipeStart = null;
};

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index;
};

onBeforeMount(() => {
  document.documentElement.classList.add(DOCUMENT_SCROLL_CLASS);
});

onMounted(() => {
  restoreHomeScroll();
  startHeroTypewriter();
  restartQuoteTimer();
  const observerRoot = isDocumentScrollMode() ? null : pageRef.value;

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver?.unobserve(entry.target);
        }
      });
    },
    { root: observerRoot, threshold: 0.08, rootMargin: "0px 0px -8%" },
  );
  pageRef.value
    ?.querySelectorAll(".scroll-reveal")
    .forEach((element) => revealObserver.observe(element));

  statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        animateStats();
        statsObserver?.disconnect();
      }
    },
    { root: observerRoot, threshold: 0.5 },
  );
  if (statsRef.value) statsObserver.observe(statsRef.value);

  pillarsObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      pillars.forEach((_, index) => {
        const timer = window.setTimeout(() => {
          animatedPillarIndex.value = index;
        }, index * 900);
        pillarTimers.push(timer);
      });
      pillarsObserver?.disconnect();
    },
    { root: observerRoot, threshold: 0.08 },
  );
  if (pillarsRef.value) pillarsObserver.observe(pillarsRef.value);

  compoundObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        compoundVisible.value = true;
        compoundObserver?.disconnect();
      }
    },
    { root: observerRoot, threshold: 0.2 },
  );
  if (compoundRef.value) compoundObserver.observe(compoundRef.value);

  cityStartTimer = window.setTimeout(() => {
    let index = 0;
    cityTimer = window.setInterval(() => {
      index = (index + 1) % cityNames.length;
      currentCity.value = cityNames[index];
    }, 2500);
  }, 5000);
});

onBeforeRouteLeave(() => {
  saveHomeScroll();
});

onBeforeUnmount(() => {
  document.documentElement.classList.remove(DOCUMENT_SCROLL_CLASS);
  window.clearInterval(quoteTimer);
  window.clearTimeout(cityStartTimer);
  window.clearTimeout(restoreScrollTimer);
  window.clearTimeout(heroTypingTimer);
  window.clearInterval(heroCursorTimer);
  window.clearInterval(cityTimer);
  window.cancelAnimationFrame(statsFrame);
  pillarTimers.forEach((timer) => window.clearTimeout(timer));
  revealObserver?.disconnect();
  statsObserver?.disconnect();
  pillarsObserver?.disconnect();
  compoundObserver?.disconnect();
});
</script>

<style scoped>
.home-page {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  background: #f5f2eb;
  color: #0a0a0a;
  font-family: Inter, "DM Sans", sans-serif;
}

.home-page,
.home-page * {
  box-sizing: border-box;
}

.legacy-hero {
  min-height: 346px;
  background: #14392c;
  color: #f7f5ec;
}

.legacy-hero__copy {
  padding: 32px 30px 42px;
}

.legacy-hero__copy h1 {
  margin: 0;
  color: #f7f5ec;
  font-size: clamp(32px, 8.5vw, 43px);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.legacy-hero__typed-word {
  color: #f7f5ec;
}

.legacy-hero__cursor {
  color: #b8aa96;
  opacity: 0;
  font-size: 0.75em;
  font-weight: 200;
  transition: opacity 0.1s ease;
}

.legacy-hero__cursor.visible {
  opacity: 1;
}

.legacy-hero__summary {
  max-width: 360px;
  margin: 20px 0 0;
  color: rgba(247, 245, 236, 0.72);
  font-size: 15px;
  line-height: 1.55;
}

.legacy-hero__fit {
  max-width: 360px;
  margin: 18px 0 0;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: rgba(247, 245, 236, 0.58);
  font-size: 12px;
  line-height: 1.55;
}

.legacy-hero__fit > span:first-child {
  flex: 0 0 auto;
  color: rgba(247, 245, 236, 0.42);
}

.target-header-shell {
  position: fixed;
  z-index: 75;
  top: 0;
  left: 50%;
  width: min(100%, var(--das-app-max-width, 960px));
  transform: translateX(-50%);
  pointer-events: none;
}

.target-nav {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  border-radius: 0;
  background: #f5f2eb;
  box-shadow: none;
  pointer-events: auto;
  transition:
    width 0.3s ease,
    max-width 0.3s ease,
    margin-top 0.3s ease,
    border-radius 0.3s ease,
    box-shadow 0.3s ease;
}

.target-header-shell.scrolled .target-nav {
  width: 92%;
  max-width: 900px;
  margin-top: 12px;
  border-radius: 999px;
  box-shadow:
    0 1px 10px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.03);
}

.target-header-shell.scrolled .target-nav.menu-open {
  border-radius: 20px;
}

.target-nav__row {
  position: relative;
  max-width: 1000px;
  height: 44px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
}

.target-nav__brand {
  position: absolute;
  left: 50%;
  width: auto;
  height: 24px;
  padding: 0;
  border: 0;
  background: transparent;
  transform: translateX(-50%);
}

.target-nav__brand img {
  width: auto;
  height: 24px;
  display: block;
}

.target-nav__desktop {
  display: none;
}

.target-nav__mobile-spacer {
  flex: 1;
}

.target-nav__menu {
  width: 34px;
  height: 34px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  border: 0;
  background: transparent;
}

.target-nav__menu span {
  width: 18px;
  height: 1.5px;
  display: block;
  background: #0a0a0a;
  transition: 0.2s ease;
}

.target-nav.menu-open .target-nav__menu span:first-child {
  transform: translateY(6.5px) rotate(45deg);
}

.target-nav.menu-open .target-nav__menu span:nth-child(2) {
  opacity: 0;
}

.target-nav.menu-open .target-nav__menu span:last-child {
  transform: translateY(-6.5px) rotate(-45deg);
}

.target-nav__mobile-panel {
  padding: 8px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.target-nav__mobile-panel a,
.target-nav__mobile-panel button {
  padding: 10px 14px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #555;
  font:
    14px/1.35 "DM Sans",
    sans-serif;
  text-align: left;
  text-decoration: none;
}

.target-nav__mobile-panel button {
  margin-top: 4px;
  border-radius: 999px;
  background: #1e3328;
  color: #f5f2eb;
  text-align: center;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: 0.24s ease;
  overflow: hidden;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  max-height: 0;
  opacity: 0;
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  max-height: 240px;
  opacity: 1;
}

.target-page-shell {
  min-height: 100%;
  padding-top: 0;
  background: #f5f2eb;
}

.target-white-card {
  position: relative;
  z-index: 1;
  width: 100%;
  border-radius: 0 0 24px 24px;
  background: #fff;
  transform-origin: top center;
  transition: transform 0.75s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.target-white-card.released {
  transform: scale(0.98);
}

.target-content {
  width: 100%;
  padding: 48px 32px 120px;
  display: flex;
  justify-content: center;
}

.target-main-content {
  width: 100%;
  max-width: 672px;
}

.stats-section {
  width: 100%;
}

.hero-section h1 {
  margin: 0 0 32px;
  color: #0a0a0a;
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.hero-word {
  color: #1e3328;
}

.type-cursor {
  color: #9b8f83;
  font-size: 0.75em;
  font-weight: 200;
  transition: opacity 0.1s;
}

.type-cursor.hidden {
  opacity: 0;
}

.hero-summary {
  max-width: 520px;
  margin: 0 0 64px;
  color: #666;
  font-size: 15px;
  line-height: 1.7;
}

.hero-fit {
  max-width: 520px;
  margin: -40px 0 64px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #999;
  font-size: 13px;
  line-height: 1.7;
}

.hero-fit > span {
  flex: 0 0 auto;
  color: #d1d1d1;
}

.hero-fit p {
  margin: 0;
}

.hero-stats {
  width: 100%;
  margin-bottom: 64px;
  display: flex;
  justify-content: space-between;
}

.hero-stat {
  flex: 1 1 0;
  text-align: center;
  cursor: default;
}

.hero-stat strong {
  display: block;
  margin-bottom: 8px;
  color: #0a0a0a;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.hero-stat i {
  width: 48px;
  height: 4px;
  margin: 0 auto 8px;
  display: block;
  background: #9b8f83;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hero-stat span {
  display: block;
  color: #999;
  font-size: 12px;
  line-height: 1.5;
}

.hero-stat:hover strong {
  color: #9b8f83;
}

.hero-stat:hover i {
  opacity: 1;
}

.intro-fade {
  opacity: 0;
  animation: introFade 0.5s ease forwards;
}

.intro-fade--1 {
  animation-delay: 0.4s;
}

.intro-fade--2 {
  animation-delay: 0.6s;
}

.intro-fade--3 {
  animation-delay: 0.65s;
}

.intro-fade--4 {
  animation-delay: 0.7s;
}

.intro-fade--5 {
  animation-delay: 0.75s;
}

.intro-fade--6 {
  animation-delay: 0.8s;
}

.intro-fade--7 {
  animation-delay: 0.85s;
}

@keyframes introFade {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-marquee {
  margin-bottom: 56px;
  display: flex;
  overflow: hidden;
  border-top: 1px solid #e5e2dd;
  border-bottom: 1px solid #e5e2dd;
}

.legacy-shortcuts {
  margin: 0 0 56px;
  padding: 22px 16px 25px;
  border-radius: 26px;
  background: #eeede3;
  color: #17382d;
}

.legacy-shortcuts h2 {
  margin: 0 0 20px 6px;
  font-size: 19px;
  font-weight: 500;
}

.legacy-shortcuts__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  row-gap: 23px;
}

.legacy-shortcuts button {
  min-width: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border: 0;
  background: transparent;
  color: #17382d;
  font-size: 11px;
}

.legacy-shortcuts button > span {
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
  transition:
    transform 0.25s ease,
    background-color 0.25s ease;
}

.legacy-shortcuts button:hover > span {
  background: rgba(255, 255, 255, 0.82);
  transform: translateY(-2px);
}

.legacy-shortcuts button :deep(.das-icon) {
  width: 34px;
  height: 34px;
}

.legacy-shortcuts button b {
  max-width: 100%;
  overflow: hidden;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.marquee-label {
  position: relative;
  z-index: 2;
  flex: 0 0 auto;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  border-right: 1px solid #e5e2dd;
  background: #fff;
  color: #666;
  line-height: 1.3;
  white-space: nowrap;
}

.marquee-label--clients {
  font:
    13px/1.3 "DM Sans",
    sans-serif;
}

.marquee-label--platforms {
  color: #9b8f83;
  font:
    11px/1.4 "DM Sans",
    sans-serif;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.marquee-window {
  min-width: 0;
  flex: 1 1 auto;
  overflow: hidden;
}

.marquee-track {
  width: max-content;
  display: flex;
  align-items: center;
  will-change: transform;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.marquee-track--clients {
  animation-name: clientMarquee;
  animation-duration: 50s;
}

.marquee-track--platforms {
  animation-name: platformMarquee;
  animation-duration: 40s;
}

.marquee-window:hover .marquee-track {
  animation-play-state: paused;
}

.marquee-item {
  flex: 0 0 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e5e2dd;
}

.marquee-item--client {
  height: 56px;
}

.marquee-item--client img {
  max-width: 110px;
  max-height: 28px;
  object-fit: contain;
  filter: grayscale(1);
  opacity: 0.6;
  transition: 0.3s ease;
}

.marquee-item--client:hover img {
  filter: grayscale(0);
  opacity: 1;
}

.marquee-item--platform {
  height: 68px;
}

.marquee-item--platform img {
  max-width: 110px;
  max-height: 38px;
  object-fit: contain;
  filter: brightness(0) saturate(0);
  opacity: 0.38;
  transition: 0.2s ease;
}

.marquee-item--platform:hover img {
  opacity: 0.7;
}

@keyframes clientMarquee {
  to {
    transform: translateX(-50%);
  }
}

@keyframes platformMarquee {
  to {
    transform: translateX(-50%);
  }
}

.work-video {
  width: 100%;
  aspect-ratio: 16 / 9;
  margin-bottom: 80px;
  overflow: hidden;
  border-radius: 2px;
  background: #000;
}

.work-video video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.section-kicker {
  margin: 0 0 48px;
  color: #9b8f83;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.testimonials {
  margin-bottom: 80px;
  overflow: hidden;
  user-select: none;
  cursor: grab;
}

.testimonials:active {
  cursor: grabbing;
}

.testimonial-window {
  min-height: 200px;
}

.testimonial {
  padding: 8px 0 8px 40px;
  border-left: 4px solid #e0e0e0;
}

.testimonial blockquote {
  margin: 0 0 24px;
  color: #666;
  font-size: 15px;
  font-style: italic;
  line-height: 1.7;
}

.testimonial p {
  margin: 0;
  color: #999;
  font-size: 15px;
  line-height: 1.5;
}

.testimonial strong {
  color: #0a0a0a;
  font-weight: 500;
}

.quote-shift-enter-active,
.quote-shift-leave-active {
  transition:
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.quote-shift-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.quote-shift-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.testimonial-progress {
  margin-top: 24px;
  display: flex;
  gap: 10px;
}

.testimonial-progress button {
  position: relative;
  width: 48px;
  height: 4px;
  padding: 0;
  overflow: hidden;
  border: 0;
  background: #e8dfd6;
}

.testimonial-progress button i {
  position: absolute;
  inset: 0 auto 0 0;
  display: block;
  background: #9b8f83;
  animation: testimonialProgress 8s linear forwards;
}

@keyframes testimonialProgress {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.scroll-reveal {
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.65s ease,
    transform 0.65s ease;
}

.scroll-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.home-page.skip-entry-animations .intro-fade,
.home-page.skip-entry-animations .scroll-reveal,
.home-page.skip-entry-animations .compound-line {
  opacity: 1;
  transform: none;
  animation: none;
  transition: none;
}

.old-model {
  max-width: 576px;
  margin-bottom: 48px;
}

.old-model h2 {
  margin: 0 0 32px;
  color: #0a0a0a;
  font-size: 22px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.old-model p {
  margin: 0;
  color: #666;
  font-size: 15px;
  line-height: 1.7;
}

.pillars {
  margin-bottom: 80px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

.pillar {
  padding: 4px 0 4px 20px;
  border-left: 4px solid #e0e0e0;
}

.pillar h3 {
  margin: 0 0 12px;
  color: #0a0a0a;
  font-size: 14px;
  font-weight: 500;
}

.pillar-art {
  width: 180px;
  height: 75px;
  margin: 6px 0 12px;
  overflow: hidden;
}

.pillar-art object {
  width: 180px;
  height: 75px;
  display: block;
  pointer-events: none;
}

.pillar-copy {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.7;
}

.pillar-proof {
  margin-top: 16px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #7a7a7a;
}

.pillar-proof > span {
  flex: 0 0 auto;
  color: #9b8f83;
  font-size: 12px;
  font-weight: 600;
}

.pillar-proof p {
  margin: 0;
  font-size: 12px;
  font-weight: 300;
  line-height: 1.65;
  letter-spacing: 0.025em;
}

.compounding {
  margin: 0 0 32px;
  padding: 40px 0;
}

.compounding .section-kicker {
  margin-bottom: 40px;
}

.compounding > div {
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.compound-line {
  margin: 0;
  color: #555;
  font-size: 15px;
  line-height: 1.8;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.compound-line.visible {
  opacity: 1;
  transform: translateY(0);
}

.positioning-card {
  margin-bottom: 80px;
  padding: 32px;
  border-radius: 32px;
  background: #1e3328;
}

.positioning-card h2 {
  margin: 0 0 20px;
  color: #f5f2eb;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.45;
}

.positioning-card > a {
  position: relative;
  margin-top: 32px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #f5f2eb;
  font:
    14px/1.4 "DM Sans",
    sans-serif;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}

.positioning-card > a::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: -3px;
  left: 0;
  height: 2px;
  background: #9b8f83;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.positioning-card > a:hover::after {
  transform: scaleX(1);
}

.arrow-swap {
  position: relative;
  width: 16px;
  height: 16px;
  display: inline-block;
  overflow: hidden;
}

.arrow-swap i {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  transition: transform 0.3s ease;
}

.arrow-swap i:last-child {
  transform: translateX(-20px);
}

button:hover .arrow-swap i:first-child,
a:hover .arrow-swap i:first-child {
  transform: translateX(20px);
}

button:hover .arrow-swap i:last-child,
a:hover .arrow-swap i:last-child {
  transform: translateX(0);
}

.platform-marquee {
  margin-right: -32px;
  margin-bottom: 80px;
  margin-left: -32px;
}

.faq-section {
  margin-bottom: 80px;
}

.faq-section > .section-kicker {
  margin-bottom: 32px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  border-top: 2px solid #e8dfd6;
  transition: border-color 0.3s ease;
}

.faq-item:hover,
.faq-item.open {
  border-color: #9b8f83;
}

.faq-item > button {
  width: 100%;
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border: 0;
  background: transparent;
  color: #0a0a0a;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.45;
  text-align: left;
  transition: color 0.3s ease;
}

.faq-item > button:hover {
  color: #9b8f83;
}

.faq-item svg {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  fill: none;
  stroke: #9b8f83;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
  transition: transform 0.3s ease;
}

.faq-item.open svg {
  transform: rotate(180deg);
}

.faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 0.3s ease,
    opacity 0.3s ease;
}

.faq-answer > div {
  overflow: hidden;
}

.faq-item.open .faq-answer {
  grid-template-rows: 1fr;
  opacity: 1;
}

.faq-answer p {
  margin: 0;
  padding: 4px 0 20px;
  color: #666;
  font-size: 14px;
  line-height: 1.7;
}

.faq-answer p + p {
  padding-top: 0;
}

.ask-ai {
  padding: 48px 0 0;
  text-align: center;
}

.ask-ai > p {
  margin: 0 0 20px;
  color: #9b8f83;
  font:
    10px/1.4 "JetBrains Mono",
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.ask-ai > div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.ask-ai a {
  opacity: 0.4;
  transition: opacity 0.2s ease;
}

.ask-ai a:hover {
  opacity: 1;
}

.ask-ai img {
  width: 28px;
  height: 28px;
  display: block;
  object-fit: contain;
}

.site-footer-reveal {
  min-height: 440px;
  padding: 108px 32px 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #999;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
}

.site-footer-reveal p {
  margin: 0;
}

.site-footer-reveal a {
  position: relative;
  color: inherit;
  text-decoration: none;
  transition: color 0.3s ease;
}

.site-footer-reveal a:hover {
  color: #9b8f83;
}

.site-footer-reveal__location {
  min-height: 20px;
  font-weight: 300;
}

.site-footer-reveal__location span {
  display: inline-block;
}

.city-fade-enter-active,
.city-fade-leave-active {
  transition: opacity 0.3s ease;
}

.city-fade-enter-from,
.city-fade-leave-to {
  opacity: 0;
}

.site-footer-reveal > img {
  width: auto;
  height: 80px;
  margin: 30px auto 0;
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

.site-footer-reveal > img:hover {
  opacity: 0.6;
}

.site-footer-reveal__legal {
  margin-top: 2px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 12px;
  font-size: 11px;
  font-weight: 300;
}

.site-footer-reveal__legal i {
  color: #d1d1d1;
  font-style: normal;
}

@media (min-width: 640px) {
  .target-nav__row {
    height: 56px;
    padding: 0 32px;
  }

  .target-nav__brand,
  .target-nav__brand img {
    height: 28px;
  }

  .target-page-shell {
    padding-top: 0;
  }

  .target-content {
    padding: 64px 32px 120px;
  }

  .hero-section h1 {
    margin-bottom: 40px;
  }

  .hero-summary {
    margin-bottom: 80px;
    font-size: 16px;
  }

  .hero-fit {
    margin-top: -48px;
    margin-bottom: 80px;
    font-size: 14px;
  }

  .hero-stat strong {
    font-size: 30px;
  }

  .hero-stat span {
    font-size: 14px;
  }

  .logo-marquee {
    margin-bottom: 64px;
  }

  .work-video,
  .testimonials,
  .pillars,
  .positioning-card,
  .faq-section {
    margin-bottom: 96px;
  }

  .testimonial blockquote,
  .testimonial p,
  .old-model p {
    font-size: 16px;
  }

  .old-model h2 {
    font-size: 26px;
  }

  .pillars {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 40px;
  }

  .pillar--wide {
    grid-column: 1 / -1;
  }

  .compounding {
    padding: 56px 0;
  }

  .compound-line {
    font-size: 16px;
  }

  .positioning-card {
    padding: 40px 48px;
  }

  .positioning-card h2 {
    font-size: 20px;
  }

  .site-footer-reveal {
    font-size: 13px;
  }

  .site-footer-reveal__legal {
    font-size: 12px;
  }
}

@media (max-width: 360px) {
  .legacy-shortcuts {
    padding-right: 8px;
    padding-left: 8px;
  }

  .legacy-shortcuts button {
    gap: 6px;
    font-size: 9px;
  }

  .legacy-shortcuts button > span {
    width: 48px;
    height: 48px;
  }

  .legacy-shortcuts button :deep(.das-icon) {
    width: 29px;
    height: 29px;
  }
}

@media (min-width: 768px) {
  .target-nav__desktop {
    display: flex;
  }

  .target-nav__mobile-spacer,
  .target-nav__menu,
  .target-nav__mobile-panel {
    display: none;
  }

  .target-nav__side {
    flex: 1;
    align-items: center;
    gap: 2px;
  }

  .target-nav__side--right {
    justify-content: flex-end;
    gap: 8px;
  }

  .target-nav__side > a {
    padding: 8px 14px;
    border-radius: 12px;
    color: #555;
    font:
      14px/1.35 "DM Sans",
      sans-serif;
    text-decoration: none;
    transition: 0.15s ease;
  }

  .target-nav__side > a:hover {
    background: #eeedea;
    color: #0a0a0a;
  }

  .target-nav__intelligence {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .target-nav__intelligence svg {
    width: 12px;
    height: 12px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    opacity: 0;
    transform: translateX(-4px);
    transition: 0.2s ease;
  }

  .target-nav__intelligence:hover svg {
    opacity: 0.6;
    transform: translateX(0);
  }

  .target-pill-button {
    padding: 8px 20px;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 0;
    border-radius: 999px;
    background: #1e3328;
    color: #f5f2eb;
    font:
      500 13px/1.4 "DM Sans",
      sans-serif;
    transition: 0.2s ease;
  }

  .target-pill-button:hover {
    background: #162621;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: scale(1.03);
  }

  .target-content {
    padding: 80px 48px 120px;
  }

  .target-main-content {
    max-width: 820px;
  }

  :global(html.das-home-document-scroll) {
    height: auto;
    min-height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: #8f857a #e8e3dc;
    scrollbar-gutter: stable;
  }

  :global(html.das-home-document-scroll body),
  :global(html.das-home-document-scroll #app) {
    height: auto;
    min-height: 100%;
    overflow: visible;
  }

  .home-page.hide-scroll {
    height: auto;
    min-height: 100vh;
    overflow: visible !important;
  }

  :global(html.das-home-document-scroll::-webkit-scrollbar) {
    display: block;
    width: 10px;
  }

  :global(html.das-home-document-scroll::-webkit-scrollbar-track) {
    background: #e8e3dc;
  }

  :global(html.das-home-document-scroll::-webkit-scrollbar-thumb) {
    min-height: 48px;
    border: 2px solid transparent;
    border-radius: 999px;
    background: #8f857a;
    background-clip: content-box;
  }

  :global(html.das-home-document-scroll::-webkit-scrollbar-thumb:hover) {
    background: #74695f;
    background-clip: content-box;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-page {
    scroll-behavior: auto;
  }

  :global(html.das-home-document-scroll) {
    scroll-behavior: auto;
  }

  .intro-fade,
  .scroll-reveal,
  .compound-line {
    opacity: 1;
    transform: none;
    animation: none;
    transition: none;
  }

  .marquee-track,
  .testimonial-progress button i {
    animation-play-state: paused;
  }
}
</style>
