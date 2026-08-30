<template>
  <main class="das-page bp-home-page">
    <HeaderTop />

    <section class="bp-hero">
      <div class="bp-hero__copy bp-reveal is-visible">
        <p class="bp-gradient-title">Welcome to BrainPower:</p>
        <h1>Complete DTC Ecosystem Growth For Online Consumer Brands.</h1>
        <button type="button" class="bp-cta" @click="goContact">
          Book a FREE Ecosystem Evaluation Call
        </button>
      </div>
      <div
        class="bp-hero-slider bp-swipe-carousel"
        :class="{ 'is-dragging': heroIsDragging }"
        aria-label="BrainPower case study carousel"
        @pointerdown="onHeroPointerDown"
        @pointermove="onHeroPointerMove"
        @pointerup="onHeroPointerEnd"
        @pointercancel="onHeroPointerEnd"
      >
        <div
          ref="heroTrackElement"
          class="bp-hero-slider__track"
          :class="{
            'bp-hero-slider__track--no-transition':
              !heroTransitionEnabled || heroIsDragging,
          }"
          :style="heroTrackStyle"
          @transitionend="normalizeHeroPosition"
        >
          <img
            v-for="(slide, index) in heroRenderedSlides"
            :key="`${slide}-${index}`"
            :src="slide"
            alt="BrainPower client growth case study"
            draggable="false"
          />
        </div>
      </div>
      <div class="bp-dots" aria-label="Carousel slides">
        <button
          v-for="(_, index) in heroSlides"
          :key="index"
          type="button"
          :class="{ active: heroIndex === index }"
          :aria-label="`View slide ${index + 1}`"
          @click="selectHero(index)"
        ></button>
      </div>
    </section>

    <section class="bp-shortcuts" aria-label="Quick links">
      <button
        v-for="item in shortcuts"
        :key="item.title"
        type="button"
        @click="goTo(item)"
      >
        <span><DasIcon :name="item.icon" /></span>
        <b>{{ $t(item.label) }}</b>
      </button>
    </section>

    <div class="bp-site-body">
      <section class="bp-managed bp-reveal">
        <h2>Over <em>$100M</em> In DTC Revenue Under Management:</h2>
        <div class="bp-logo-marquee">
          <div class="bp-logo-track">
            <img
              v-for="(logo, index) in doubledPartnerLogos"
              :key="`${logo}-${index}`"
              :src="siteAsset(logo)"
              alt=""
            />
          </div>
        </div>
      </section>

      <section class="bp-awards bp-reveal">
        <h2 class="bp-gradient-heading">
          Lead Profitable Growth With An Award Winning Team
        </h2>
        <div class="bp-awards__desktop-copy">
          <h3>That Can Take All The Marketing Tasks Off Your Plate.</h3>
          <p>
            We Will <strong>Grow and Manage</strong> Your Entire DTC Ecosystem
          </p>
        </div>
        <p class="bp-awards__mobile-copy">
          That Can Take All The Marketing Tasks Off Your Plate. We Will
          <strong>Grow and Manage</strong> Your Entire DTC Ecosystem
        </p>
        <picture class="bp-section-arc">
          <source
            media="(max-width: 640px)"
            :srcset="siteAsset('Group-24802-1.png')"
          />
          <img :src="siteAsset('Group-24802.png')" alt="" />
        </picture>
        <h3 class="bp-awards__title">
          <strong>5-Time</strong> 2023 Clutch.co Award Winners
        </h3>
        <img
          class="bp-awards__badges"
          :src="siteAsset('image-2376.png')"
          alt="Five 2023 Clutch.co awards"
        />
        <img
          class="bp-awards__clutch"
          :src="siteAsset('Group-24991.png')"
          alt="Clutch 2023 award badges"
        />
        <h2 class="bp-ecosystem-intro">
          The DTC Growth Ecosystems:<br />
          <span>Fueled By Traffic, Powered by Efficiency</span>
        </h2>
      </section>

      <section class="bp-ecosystems">
        <header class="bp-reveal">
          <h2>Here’s How<br /><span>The DTC Growth Ecosystems</span> Work</h2>
          <h3><span>What’s Included in ecosystem growth management?</span></h3>
        </header>
        <article
          v-for="(ecosystem, index) in ecosystems"
          :key="ecosystem.title"
          class="bp-ecosystem-card bp-reveal"
          :class="{ 'bp-ecosystem-card--reverse': index % 2 }"
        >
          <div class="bp-ecosystem-card__copy">
            <h3>{{ ecosystem.title }}</h3>
            <p>{{ ecosystem.copy }}</p>
          </div>
          <div class="bp-ecosystem-card__media">
            <img
              v-if="ecosystem.media.endsWith('.gif')"
              :src="siteAsset(ecosystem.media)"
              alt=""
            />
            <video
              v-else
              autoplay
              loop
              muted
              playsinline
              preload="metadata"
              :poster="siteAsset(ecosystem.poster)"
            >
              <source :src="siteAsset(ecosystem.media)" type="video/mp4" />
            </video>
          </div>
        </article>
        <button type="button" class="bp-cta bp-cta--center" @click="goContact">
          Book a FREE Ecosystem Evaluation Call
        </button>
      </section>

      <section class="bp-wins bp-reveal">
        <h2>
          Check Out
          <span
            >Recent Wins<br class="bp-mobile-only" />
            From Our Clients</span
          >
        </h2>
        <p>Don’t take our word for it</p>
        <div
          class="bp-win-carousel bp-swipe-carousel"
          :class="{ 'is-dragging': caseIsDragging }"
          aria-label="Client wins carousel"
          @pointerdown="onCasePointerDown"
          @pointermove="onCasePointerMove"
          @pointerup="onCasePointerEnd"
          @pointercancel="onCasePointerEnd"
        >
          <div
            ref="caseTrackElement"
            class="bp-win-carousel__track"
            :class="{
              'bp-win-carousel__track--no-transition':
                !caseTransitionEnabled || caseIsDragging,
            }"
            :style="caseTrackStyle"
            @transitionend="normalizeCasePosition"
          >
            <article
              v-for="(caseStudy, renderedIndex) in renderedCaseStudies"
              :key="`${caseStudy.originalIndex}-${renderedIndex}`"
              class="bp-win-card"
              :class="`bp-win-card--${caseStudy.originalIndex}`"
            >
              <div class="bp-win-card__copy">
                <h3>{{ caseStudy.title }}</h3>
                <div class="bp-win-card__stats">
                  <p v-for="stat in caseStudy.stats" :key="stat.label">
                    <strong>{{ stat.value }}</strong>
                    <span>{{ stat.label }}</span>
                  </p>
                </div>
              </div>
              <img :src="siteAsset(caseStudy.image)" alt="" draggable="false" />
            </article>
          </div>
        </div>
        <div class="bp-dots bp-dots--wins">
          <button
            v-for="(_, index) in caseStudies"
            :key="index"
            type="button"
            :class="{ active: caseIndex === index }"
            :aria-label="`View client win ${index + 1}`"
            @click="selectCase(index)"
          ></button>
        </div>
        <div class="bp-wins__summary">
          <h3>
            Plus take <strong>ALL</strong> the marketing tasks off your plate.
          </h3>
          <p>
            This includes: landing pages, emails, ad design, product launches,
            holiday offers, upsells – you name it when you use the power of…
          </p>
        </div>
      </section>

      <section class="bp-partners bp-reveal">
        <picture class="bp-partners__arc">
          <source
            media="(max-width: 640px)"
            :srcset="siteAsset('Rectangle-16844.png')"
          />
          <img :src="siteAsset('Rectangle-16823.png')" alt="" />
        </picture>
        <h2 class="bp-partners__title bp-partners__title--desktop">
          We Work With The Best<br />Marketing Partners For
          <span>DTC Brands</span>
        </h2>
        <h2 class="bp-partners__title bp-partners__title--mobile">
          We Work With The Best<br />Marketing Partners<br />For
          <span>DTC Brands</span>
        </h2>
        <div
          class="bp-partner-carousel"
          @mouseenter="pausePartnerCarousel"
          @mouseleave="startPartnerCarousel"
        >
          <div
            class="bp-partner-carousel__track"
            :class="{
              'bp-partner-carousel__track--no-transition':
                !partnerTransitionEnabled,
            }"
            :style="partnerTrackStyle"
          >
            <div
              v-for="(logo, index) in tripledTechnologyLogos"
              :key="`${logo}-${index}`"
              class="bp-partner-carousel__slide"
              :class="{
                'bp-partner-carousel__slide--center': index === partnerPosition,
              }"
            >
              <div class="bp-partner-carousel__box">
                <img :src="siteAsset(logo)" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bp-combined bp-reveal">
        <h2>
          BrainPower Combines Finance, Design, and Marketing For an Unmatched
          Approach<br />To <span>Profitable Growth</span>
        </h2>
        <img
          class="bp-combined__line"
          :src="siteAsset('Group-24811.svg')"
          alt=""
        />
        <picture class="bp-combined__art">
          <source
            media="(max-width: 640px)"
            :srcset="siteAsset('Group-24982.png')"
          />
          <img :src="siteAsset('Group-24926-1.png')" alt="" />
        </picture>
        <button type="button" class="bp-cta" @click="goContact">
          See Our Work
        </button>
      </section>

      <section class="bp-final-cta bp-reveal">
        <h2>
          Our Clients are thriving<br />in today’s DTC Landscape,
          <span>Discover How You Can too!</span>
        </h2>
        <p>Book a call to schedule a FREE ecosystem evaluation call.</p>
        <button type="button" class="bp-cta" @click="goContact">
          Book A Discovery Call
        </button>
      </section>

      <footer class="bp-source-footer">
        <img :src="siteAsset('Logo(1).svg')" alt="BrainPower" />
        <nav aria-label="BrainPower footer links">
          <span>About Us</span>
          <span>How we Help Brands</span>
          <span>Case Studies</span>
          <span>Ecosystem</span>
        </nav>
        <div>
          <p>2023 BrainPower, Inc. All Rights Reserved.</p>
          <p>Privacy Policy | Terms of Conditions</p>
        </div>
      </footer>
    </div>

    <Footer name="/" />
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import DasIcon from "@/components/DasIcon.vue";
import Footer from "@/components/Footer.vue";
import HeaderTop from "@/components/HeaderTop.vue";
import { safePush } from "@/utils/navigation";
import mockup1 from "@/static/brain/site/Mockup-1-1.png";
import mockup2 from "@/static/brain/site/Mockup-2-2.png";
import mockup3 from "@/static/brain/site/Mockup-3-2.png";

const router = useRouter();
const heroIndex = ref(0);
const caseIndex = ref(0);
const heroSlides = [mockup1, mockup2, mockup3];
const carouselRepeatCount = 7;
const carouselMiddleRepeat = Math.floor(carouselRepeatCount / 2);
const heroRenderedSlides = Array.from(
  { length: heroSlides.length * carouselRepeatCount },
  (_, index) => heroSlides[index % heroSlides.length],
);
const heroPosition = ref(carouselMiddleRepeat * heroSlides.length);
const heroTransitionEnabled = ref(true);
const heroTrackElement = ref(null);
const shortcuts = [
  { title: "vip", label: "das.home.vip", icon: "vipcenter", route: "/vips" },
  {
    title: "activities",
    label: "das.home.activities",
    icon: "activity",
    route: "/event",
  },
  {
    title: "withdrawal",
    label: "das.home.withdraw",
    icon: "withdraw",
    route: "/withdraw",
  },
  { title: "deposit", label: "das.home.deposit", icon: "deposit", route: "/deposit" },
  { title: "terms", label: "das.home.terms", icon: "terms", route: "/clause" },
  {
    title: "certificate",
    label: "das.home.certificate",
    icon: "certificate",
    route: "/cert",
  },
  { title: "faqs", label: "das.home.faqs", icon: "faq", route: "/faqs" },
  { title: "service", label: "das.home.service", icon: "about", route: "/contact" },
];
const partnerLogos = [
  "Dark_BG_Horizontal_Logo.svg",
  "Logo.svg",
  "OT-Logo-footer.svg",
  "Ryder-logo_final_-all-colorways-05-1-1.png",
  "image-2367-1.png",
  "image-2366-1.png",
  "Group-1-1.png",
  "image-9.png",
];
const technologyLogos = [
  "abcd.png",
  "Group-24051.png",
  "Group-24790.svg",
  "image-57.png",
  "dsgsg.png",
  "Group-24790.svg",
];
const doubledPartnerLogos = computed(() => [...partnerLogos, ...partnerLogos]);
const tripledTechnologyLogos = computed(() => [
  ...technologyLogos,
  ...technologyLogos,
  ...technologyLogos,
]);
const partnerPosition = ref(technologyLogos.length);
const partnerTransitionEnabled = ref(true);
const partnerTrackStyle = computed(() => ({
  transform: `translate3d(${((1 - partnerPosition.value) / tripledTechnologyLogos.value.length) * 100}%, 0, 0)`,
}));
const ecosystems = [
  {
    title: "Acquisition Ecosystem",
    media: "acquisition-ecosystem.mp4",
    poster: "Group-24804.png",
    copy: "Critical for reducing customer acquisition costs (CAC). This ecosystem uses a network of landing pages, irresistible offers, custom pop-ups, and targeted emails. This results in reducing CAC by as much as 50% and increasing conversion rates by as much as 10X. This means you can spend more to make more.",
  },
  {
    title: "Retention Ecosystem",
    media: "retention-ecosystem.mp4",
    poster: "Group-24843.png",
    copy: "Once your traffic converts, you need to distribute it for long term growth. In the world of DTC, this comes in the form of email and SMS. But, this doesn’t mean exploiting your community. Instead, you will have organized holiday sales events with site wide banners, offer pages, pop ups, and segmented lists. This way you nurture every customer in the ecosystem properly.",
  },
  {
    title: "Paid Traffic Ecosystem",
    media: "paid-traffic-ecosystem.mp4",
    poster: "Group-24805.png",
    copy: "Traffic is the energy source that fuels your habitat. However, if it isn’t managed properly, it can kill your entire business. With a paid traffic ecosystem, you will have consistent messaging, design, and offers. This will result in a seamless shopping experience that gets your customers excited before they enter The Acquisition Ecosystem.",
  },
  {
    title: "Profit Maximizer Ecosystem",
    media: "profit-maximizer-ecosystem.mp4",
    poster: "Group-24990.png",
    copy: "This is the anchor of sustainability in your business. This system uses upsells, order bumps, and conversion rate optimizers to increase the revenue generated on every sale. This compliments both the retention and acquisition ecosystems and increases revenue by as much as 373%.",
  },
  {
    title: "Financial Ecosystem",
    media: "financial-ecosystem.gif",
    poster: "Group-24990.png",
    copy: "When was the last time you had an agency build you a path to profitability projection based on your COG’s and historical data? Probably never. Profitable cash flow is the oxygen that keeps your business alive. Think of the Financial Ecosystem as your business’ own internal oxygen management system. We will tell you which products are most profitable, exactly how much you can spend to acquire customers, and where you need to put your marketing dollars to increase profitability.",
  },
];
const caseStudies = [
  {
    image: "Group-2219-1-1.png",
    title: "Ryder Toys Shatters Company Revenue Records",
    stats: [
      { value: "$1.65M", label: "With First Month" },
      { value: "193%", label: "Increases Revenue By" },
    ],
  },
  {
    image: "Assets-9.png",
    title: "Seven Minerals Achieves",
    stats: [
      { value: "373%", label: "Revenue Growth" },
      { value: "80%", label: "Increase in Conversion Rate within 6 months" },
    ],
  },
  {
    image: "Group-24946-1.png",
    title: "Rove Dash Camera Breaks",
    stats: [{ value: "35% YOY", label: "profitable growth" }],
  },
];
const renderedCaseStudies = Array.from(
  { length: caseStudies.length * carouselRepeatCount },
  (_, index) => ({
    ...caseStudies[index % caseStudies.length],
    originalIndex: index % caseStudies.length,
  }),
);
const casePosition = ref(carouselMiddleRepeat * caseStudies.length);
const caseTransitionEnabled = ref(true);
const caseTrackElement = ref(null);

const siteAssets = import.meta.glob("../static/brain/site/*", {
  eager: true,
  query: "?url",
  import: "default",
});
const siteAsset = (name) => siteAssets[`../static/brain/site/${name}`];
const goTo = (item) => safePush(router, item.route);
const goContact = () => safePush(router, "/contact");
const positiveModulo = (value, length) => ((value % length) + length) % length;
const nearestPositionForIndex = (position, index, length) => {
  const currentIndex = positiveModulo(Math.round(position), length);
  let distance = index - currentIndex;

  if (distance > length / 2) distance -= length;
  if (distance < -length / 2) distance += length;
  return position + distance;
};
const selectHero = (index) => {
  if (index === heroIndex.value) return;
  heroTransitionEnabled.value = true;
  heroIndex.value = index;
  heroPosition.value = nearestPositionForIndex(
    heroPosition.value,
    index,
    heroSlides.length,
  );
};
const selectCase = (index) => {
  if (index === caseIndex.value) return;
  caseTransitionEnabled.value = true;
  caseIndex.value = index;
  casePosition.value = nearestPositionForIndex(
    casePosition.value,
    index,
    caseStudies.length,
  );
};

let heroTimer;
let caseTimer;
let partnerTimer;
let partnerResetTimer;
let revealObserver;
const moveHero = (direction) => {
  heroTransitionEnabled.value = true;
  heroPosition.value += direction;
  heroIndex.value =
    (heroIndex.value + direction + heroSlides.length) % heroSlides.length;
};
const normalizeHeroPosition = (event) => {
  if (event.propertyName !== "transform" || heroIsDragging.value) return;
  const normalizedPosition =
    carouselMiddleRepeat * heroSlides.length +
    positiveModulo(heroPosition.value, heroSlides.length);
  if (normalizedPosition === heroPosition.value) return;

  heroTransitionEnabled.value = false;
  heroPosition.value = normalizedPosition;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      heroTransitionEnabled.value = true;
    });
  });
};
const startHeroCarousel = () => {
  if (heroTimer) return;
  heroTimer = window.setInterval(() => {
    moveHero(1);
  }, 4200);
};
const pauseHeroCarousel = () => {
  window.clearInterval(heroTimer);
  heroTimer = undefined;
};
const moveCase = (direction) => {
  caseTransitionEnabled.value = true;
  casePosition.value += direction;
  caseIndex.value =
    (caseIndex.value + direction + caseStudies.length) % caseStudies.length;
};
const normalizeCasePosition = (event) => {
  if (event.propertyName !== "transform" || caseIsDragging.value) return;
  const normalizedPosition =
    carouselMiddleRepeat * caseStudies.length +
    positiveModulo(casePosition.value, caseStudies.length);
  if (normalizedPosition === casePosition.value) return;

  caseTransitionEnabled.value = false;
  casePosition.value = normalizedPosition;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      caseTransitionEnabled.value = true;
    });
  });
};
const startCaseCarousel = () => {
  if (caseTimer) return;
  caseTimer = window.setInterval(() => {
    moveCase(1);
  }, 5200);
};
const pauseCaseCarousel = () => {
  window.clearInterval(caseTimer);
  caseTimer = undefined;
};
const getTranslateX = (element, fallback) => {
  if (!element) return fallback;
  const transform = window.getComputedStyle(element).transform;
  if (!transform || transform === "none") return fallback;
  const values = transform
    .slice(transform.indexOf("(") + 1, -1)
    .split(",")
    .map(Number);

  if (!values) return fallback;
  return transform.startsWith("matrix3d") ? values[12] : values[4];
};
const createSwipeGesture = (
  index,
  length,
  pause,
  start,
  position,
  transitionEnabled,
  trackElement,
) => {
  const isDragging = ref(false);
  const dragTranslate = ref(null);
  let pointerId;
  let startX = 0;
  let startY = 0;
  let startTranslate = 0;
  let carouselWidth = 1;
  let deltaX = 0;
  let axis;
  let settleFrame;

  const style = computed(() => ({
    transform:
      dragTranslate.value === null
        ? `translate3d(${-position.value * 100}%, 0, 0)`
        : `translate3d(${dragTranslate.value}px, 0, 0)`,
  }));
  const finish = (element) => {
    if (element?.hasPointerCapture?.(pointerId)) {
      element.releasePointerCapture(pointerId);
    }
    isDragging.value = false;
    pointerId = undefined;
    axis = undefined;
    deltaX = 0;
    start();
  };
  const onPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    window.cancelAnimationFrame(settleFrame);
    carouselWidth = Math.max(1, event.currentTarget.clientWidth);
    const currentTranslate = getTranslateX(
      trackElement.value,
      -position.value * carouselWidth,
    );
    const currentPosition = -currentTranslate / carouselWidth;
    const rebasedPosition =
      carouselMiddleRepeat * length + positiveModulo(currentPosition, length);

    transitionEnabled.value = false;
    position.value = rebasedPosition;
    startTranslate = -rebasedPosition * carouselWidth;
    dragTranslate.value = startTranslate;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    deltaX = 0;
    axis = undefined;
    isDragging.value = true;
    pause();
    try {
      event.currentTarget.setPointerCapture?.(pointerId);
    } catch {
      // Some embedded browsers do not expose pointer capture for touch input.
    }
  };
  const onPointerMove = (event) => {
    if (!isDragging.value || event.pointerId !== pointerId) return;
    const moveX = event.clientX - startX;
    const moveY = event.clientY - startY;

    if (!axis && Math.max(Math.abs(moveX), Math.abs(moveY)) >= 6) {
      axis = Math.abs(moveX) > Math.abs(moveY) ? "x" : "y";
    }
    if (axis !== "x") return;

    event.preventDefault();
    deltaX = moveX;
    dragTranslate.value = startTranslate + moveX;
  };
  const onPointerEnd = (event) => {
    if (!isDragging.value || event.pointerId !== pointerId) return;
    const threshold = Math.min(
      90,
      Math.max(38, event.currentTarget.clientWidth * 0.1),
    );

    const currentPosition = -(startTranslate + deltaX) / carouselWidth;
    let targetPosition = Math.round(currentPosition);

    if (axis === "x" && Math.abs(deltaX) >= threshold) {
      targetPosition =
        deltaX < 0
          ? Math.floor(currentPosition + 0.001) + 1
          : Math.ceil(currentPosition - 0.001) - 1;
    }

    position.value = targetPosition;
    index.value = positiveModulo(targetPosition, length);
    transitionEnabled.value = true;
    finish(event.currentTarget);

    settleFrame = window.requestAnimationFrame(() => {
      dragTranslate.value = null;
    });
  };

  return {
    isDragging,
    style,
    onPointerDown,
    onPointerMove,
    onPointerEnd,
  };
};
const {
  isDragging: heroIsDragging,
  style: heroTrackStyle,
  onPointerDown: onHeroPointerDown,
  onPointerMove: onHeroPointerMove,
  onPointerEnd: onHeroPointerEnd,
} = createSwipeGesture(
  heroIndex,
  heroSlides.length,
  pauseHeroCarousel,
  startHeroCarousel,
  heroPosition,
  heroTransitionEnabled,
  heroTrackElement,
);
const {
  isDragging: caseIsDragging,
  style: caseTrackStyle,
  onPointerDown: onCasePointerDown,
  onPointerMove: onCasePointerMove,
  onPointerEnd: onCasePointerEnd,
} = createSwipeGesture(
  caseIndex,
  caseStudies.length,
  pauseCaseCarousel,
  startCaseCarousel,
  casePosition,
  caseTransitionEnabled,
  caseTrackElement,
);
const advancePartnerCarousel = () => {
  partnerTransitionEnabled.value = true;
  partnerPosition.value += 1;

  if (partnerPosition.value === technologyLogos.length * 2) {
    partnerResetTimer = window.setTimeout(() => {
      partnerTransitionEnabled.value = false;
      partnerPosition.value = technologyLogos.length;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          partnerTransitionEnabled.value = true;
        });
      });
    }, 300);
  }
};
const startPartnerCarousel = () => {
  if (partnerTimer) return;
  partnerTimer = window.setInterval(advancePartnerCarousel, 2000);
};
const pausePartnerCarousel = () => {
  window.clearInterval(partnerTimer);
  partnerTimer = undefined;
};
onMounted(() => {
  startHeroCarousel();
  startCaseCarousel();
  startPartnerCarousel();
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 },
  );
  document
    .querySelectorAll(".bp-reveal")
    .forEach((element) => revealObserver.observe(element));
});
onBeforeUnmount(() => {
  pauseHeroCarousel();
  pauseCaseCarousel();
  pausePartnerCarousel();
  window.clearTimeout(partnerResetTimer);
  revealObserver?.disconnect();
});
</script>

<style scoped>
@font-face {
  font-family: "Roboto BP";
  src: url("@/static/brain/site/Roboto-ExtraBold.woff2") format("woff2");
  font-style: normal;
  font-weight: 800;
  font-display: swap;
}

.bp-home-page {
  min-height: 100%;
  padding-bottom: 106px;
  overflow-x: hidden;
  overflow-y: auto;
  background: #121530 !important;
  color: #fff;
  font-family: "SF Pro Display", sans-serif;
}
.bp-hero {
  min-height: 0;
  padding: clamp(44px, 8vw, 76px) clamp(18px, 5vw, 48px) 12px;
  position: relative;
  overflow: hidden;
  background: #121530 url("@/static/brain/site/Group-24991-1.png") center /
    cover no-repeat;
  text-align: center;
}
.bp-hero__copy {
  position: relative;
  z-index: 1;
}
.bp-gradient-title,
.bp-gradient-heading,
.bp-ecosystem-intro span,
.bp-ecosystems > header span,
.bp-wins > h2 span,
.bp-partners h2 span,
.bp-combined h2 span,
.bp-final-cta h2 span {
  background: linear-gradient(
    75deg,
    #fff174 25.55%,
    #80f87e 42.18%,
    #20d0ee 59.1%,
    #1682ff 76.62%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.bp-gradient-title {
  margin: 0;
  font-size: clamp(28px, 6.8vw, 67px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
}
.bp-hero h1 {
  max-width: 1050px;
  margin: 10px auto 34px;
  color: #fff;
  font-size: clamp(24px, 5.4vw, 67px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: capitalize;
}
.bp-cta {
  min-height: 60px;
  padding: 17px 42px;
  border: 0;
  border-radius: 50px;
  background: linear-gradient(90.83deg, #c71a15 49.93%, #da8302 114.05%);
  color: #fff;
  font-size: clamp(16px, 2.2vw, 22px);
  font-weight: 700;
  line-height: 1.18;
  transition:
    color 0.25s ease,
    background 0.25s ease,
    transform 0.25s ease;
}
.bp-cta:hover,
.bp-cta:focus-visible {
  background: #fff;
  color: #d21515;
  transform: translateY(-2px);
}
.bp-hero-slider {
  width: min(965px, 100%);
  aspect-ratio: 2.08;
  margin: 72px auto 0;
  overflow: hidden;
  position: relative;
}
.bp-hero-slider__track {
  width: 100%;
  height: 100%;
  display: flex;
  will-change: transform;
  transition: transform 0.5s ease;
}
.bp-hero-slider__track--no-transition {
  transition: none;
}
.bp-hero-slider img {
  width: 100%;
  height: 100%;
  flex: 0 0 100%;
  display: block;
  object-fit: contain;
}
.bp-swipe-carousel {
  touch-action: pan-y;
  cursor: grab;
  user-select: none;
  will-change: transform;
  transition: transform 0.24s ease;
}
.bp-swipe-carousel.is-dragging {
  cursor: grabbing;
  transition: none;
}
.bp-dots {
  margin-top: 22px;
  display: flex;
  justify-content: center;
  gap: 12px;
}
.bp-dots button {
  width: 15px;
  height: 15px;
  padding: 0;
  position: relative;
  z-index: 1;
  border: 1.5px solid #d6d6d6;
  border-radius: 80px;
  background: linear-gradient(
    104deg,
    rgba(234, 234, 234, 0.05) -20.18%,
    rgba(255, 255, 255, 0.05) 20.77%,
    rgba(255, 255, 255, 0.05) 69.36%,
    rgba(235, 235, 235, 0.05) 93.59%
  );
  backdrop-filter: blur(25px);
}
.bp-dots button::after {
  content: "";
  position: absolute;
  inset: 4px;
  z-index: -1;
  border-radius: 50%;
  background: #f19436;
  opacity: 0;
}
.bp-dots button.active {
  border-color: #f19436;
}
.bp-dots button.active::after {
  opacity: 1;
}
.bp-shortcuts {
  padding: 12px clamp(14px, 3vw, 28px) 46px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  row-gap: 29px;
  /*background: #071d49;*/
}
.bp-shortcuts button {
  min-width: 0;
  padding: 0 2px;
  border: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: transparent;
  color: #d8dfef;
  font-size: 14px;
  line-height: 19px;
}
.bp-shortcuts button > span {
  width: 68px;
  height: 68px;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
}
.bp-shortcuts :deep(.das-icon) {
  width: 68px;
  height: 68px;
}
.bp-shortcuts b {
  max-width: 100%;
  overflow: hidden;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.bp-site-body {
  background: #121530;
}
.bp-managed {
  padding: 42px 15px 0;
  background: #121530;
  text-align: center;
}
.bp-managed h2 {
  margin: 0 auto 38px;
  font-size: clamp(23px, 4vw, 50px);
  font-weight: 500;
  line-height: 1.3;
}
.bp-managed em {
  color: #80f87e;
  font-style: normal;
  font-weight: 800;
}
.bp-logo-marquee {
  padding: 35px 40px;
  overflow: hidden;
  border: 1px solid #fff;
  border-radius: 16px;
  background: radial-gradient(
    227.28% 616.1% at 0% 0%,
    rgba(255, 255, 255, 0.46) 0%,
    rgba(255, 255, 255, 0) 100%
  );
}
.bp-logo-track,
.bp-partner-carousel__track {
  width: max-content;
  display: flex;
  align-items: center;
  animation: bp-marquee 26s linear infinite;
}
.bp-logo-track img {
  width: 147px;
  height: 66px;
  margin: 0 20px;
  flex: 0 0 auto;
  object-fit: contain;
}
.bp-awards {
  padding: 139px 15px 106px;
  overflow: hidden;
  background: #121530;
  text-align: center;
}
.bp-gradient-heading {
  max-width: 1000px;
  margin: 0 auto 28px;
  font-size: clamp(28px, 4.6vw, 45px);
  font-weight: 700;
  line-height: 1.22;
}
.bp-awards h3,
.bp-awards p {
  margin: 0;
}
.bp-awards__desktop-copy h3 {
  font-size: clamp(25px, 4vw, 45px);
  line-height: 1.22;
}
.bp-awards__desktop-copy p {
  margin-top: 12px;
  font-size: clamp(22px, 3.2vw, 40px);
  line-height: 1.25;
}
.bp-awards__mobile-copy {
  display: none;
}
.bp-section-arc {
  width: min(100%, 1228px);
  margin: 34px auto -2px;
  display: block;
}
.bp-section-arc img,
.bp-partners__arc img {
  width: 100%;
  display: block;
}
.bp-awards__title {
  margin-top: 30px !important;
  font-size: clamp(24px, 4vw, 45px);
  line-height: 1.2;
}
.bp-awards__badges {
  width: min(100%, 1000px);
  margin: 30px auto 0;
  display: block;
}
.bp-awards__clutch {
  width: min(100%, 820px);
  margin: 42px auto 0;
  display: none;
}
.bp-ecosystem-intro {
  display: none;
}
.bp-ecosystems {
  padding: 0 15px 20px;
  background: #121530;
}
.bp-ecosystems > header {
  max-width: 1100px;
  margin: 0 auto 38px;
  text-align: center;
}
.bp-ecosystems > header h2 {
  display: none;
}
.bp-ecosystems > header h3 {
  margin: 0;
  font-size: clamp(26px, 4.5vw, 45px);
  line-height: 1.22;
  text-transform: capitalize;
}
.bp-ecosystem-card {
  max-width: 1200px;
  margin: 0 auto 24px;
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0) 100%
  );
}
.bp-ecosystem-card::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  border: 2px solid;
  border-image: linear-gradient(
      270deg,
      rgba(155, 165, 255, 0) 6.55%,
      #9ba5ff 49.99%,
      rgba(155, 165, 255, 0) 94.34%
    )
    1;
  pointer-events: none;
}
.bp-ecosystem-card > * {
  position: relative;
  z-index: 1;
}
.bp-ecosystem-card--reverse .bp-ecosystem-card__copy {
  order: 2;
}
.bp-ecosystem-card__copy {
  padding: clamp(34px, 5vw, 70px);
}
.bp-ecosystem-card__copy h3 {
  margin: 0 0 24px;
  color: #fff;
  font-size: clamp(26px, 3.6vw, 45px);
  line-height: 1.12;
  text-align: center;
}
.bp-ecosystem-card__copy p {
  margin: 0;
  color: #fff;
  font-size: clamp(16px, 1.8vw, 20px);
  line-height: 1.5;
}
.bp-ecosystem-card__media {
  align-self: stretch;
  overflow: hidden;
}
.bp-ecosystem-card__media img,
.bp-ecosystem-card__media video {
  width: 100%;
  height: 100%;
  min-height: 360px;
  display: block;
  object-fit: cover;
}
.bp-cta--center {
  margin: 37px auto 80px;
  display: block;
}
.bp-wins {
  padding: 112px 15px 117px;
  background:
    radial-gradient(
      circle at 50% 44%,
      rgba(65, 92, 215, 0.28),
      transparent 42%
    ),
    #121530;
  text-align: center;
}
.bp-wins > h2 {
  max-width: 850px;
  margin: 0 auto 10px;
  font-size: clamp(30px, 5vw, 50px);
  line-height: 1.1;
}
.bp-wins > p {
  display: none;
}
.bp-win-carousel {
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}
.bp-win-carousel__track {
  width: 100%;
  display: flex;
  will-change: transform;
  transition: transform 0.5s ease;
}
.bp-win-carousel__track--no-transition {
  transition: none;
}
.bp-win-card {
  width: 100%;
  max-width: 1200px;
  min-height: 510px;
  margin: 0 auto;
  padding: 54px;
  flex: 0 0 100%;
  overflow: hidden;
  border-radius: 8px;
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
  align-items: center;
  text-align: left;
}
.bp-win-card--0 {
  background: linear-gradient(135deg, #173671, #0b173c 65%, #07112e);
}
.bp-win-card--1 {
  background: linear-gradient(135deg, #edf4dc, #fff8e6 52%, #e6efc9);
  color: #152958;
}
.bp-win-card--2 {
  background: linear-gradient(135deg, #111e4c, #23368c 55%, #12183d);
}
.bp-win-card__copy {
  position: relative;
  z-index: 2;
}
.bp-win-card h3 {
  margin: 0 0 30px;
  font-size: clamp(28px, 4vw, 45px);
  line-height: 1.1;
}
.bp-win-card__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
}
.bp-win-card__stats p {
  margin: 0;
}
.bp-win-card__stats strong,
.bp-win-card__stats span {
  display: block;
}
.bp-win-card__stats strong {
  color: #ffb800;
  font-size: clamp(48px, 7vw, 80px);
  line-height: 0.95;
}
.bp-win-card--1 .bp-win-card__stats strong {
  color: #4e7707;
}
.bp-win-card--2 .bp-win-card__stats strong {
  background: linear-gradient(75deg, #fff174, #80f87e, #20d0ee, #1682ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.bp-win-card__stats span {
  margin-top: 9px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
}
.bp-win-card > img {
  width: 118%;
  max-height: 460px;
  margin-left: -8%;
  display: block;
  object-fit: contain;
}
.bp-dots--wins {
  margin-top: 34px;
  gap: 14px;
}
.bp-dots--wins button {
  width: 16px;
  height: 16px;
  border: 1px solid #fff;
  background: transparent;
  backdrop-filter: none;
}
.bp-dots--wins button::after {
  display: none;
}
.bp-dots--wins button.active {
  width: 16px;
  height: 16px;
  border: 1px solid #fff;
  background: #fff;
}
.bp-wins__summary {
  display: none;
}
.bp-wins__summary h3 {
  margin: 0 0 26px;
  font-size: clamp(24px, 4.3vw, 44px);
  line-height: 1.22;
}
.bp-wins__summary h3 strong {
  background: linear-gradient(45deg, #5feaa3, #43dfc4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.bp-wins__summary p {
  max-width: 625px;
  margin: 0 auto;
  font-size: clamp(18px, 2.3vw, 22px);
  line-height: 1.36;
}
.bp-partners {
  padding: 0 15px 180px;
  overflow: hidden;
  background: #121530;
  text-align: center;
}
.bp-partners__arc {
  width: min(100%, 1190px);
  margin: 0 auto;
  display: block;
}
.bp-partners__title {
  max-width: 900px;
  margin: -95px auto 63px;
  position: relative;
  font-family: "Roboto BP", Roboto, sans-serif;
  font-size: 45px;
  font-weight: 800;
  line-height: 55px;
}
.bp-partners__title--mobile {
  display: none;
}
.bp-partner-carousel {
  width: 100%;
  margin-left: 0;
  overflow: hidden;
  container-type: inline-size;
}
.bp-partner-carousel__track {
  --bp-partner-slide-width: 20cqw;
  transition: transform 0.3s ease;
  animation: none;
  will-change: transform;
}
.bp-partner-carousel__track--no-transition {
  transition: none;
}
.bp-partner-carousel__slide {
  width: var(--bp-partner-slide-width);
  padding: 0 2px;
  position: relative;
  flex: 0 0 var(--bp-partner-slide-width);
  transition: all 0.3s ease-in-out;
}
.bp-partner-carousel__slide::after {
  content: "";
  position: absolute;
  inset: 0 -100px;
  z-index: -1;
  background: linear-gradient(
    90deg,
    rgba(18, 21, 48, 0) 0%,
    #121530 52.45%,
    rgba(18, 21, 48, 0) 100%
  );
}
.bp-partner-carousel__slide--center {
  z-index: 1;
  transform: scale(1.5);
}
.bp-partner-carousel__box {
  padding-top: 56%;
  position: relative;
  overflow: hidden;
}
.bp-partner-carousel__box img {
  max-width: 100%;
  height: auto;
  margin: auto;
  position: absolute;
  inset: 0;
}
.bp-combined {
  padding: 0 15px 120px;
  background: #121530
    url("@/static/brain/site/BrainPower-Homepage-V3-Desktop.svg") top center /
    cover no-repeat;
  text-align: center;
}
.bp-combined h2 {
  max-width: 1245px;
  margin: 0 auto;
  padding: 0 90px 755px;
  font-size: 45px;
  font-weight: 700;
  line-height: 55px;
  text-transform: capitalize;
}
.bp-combined__line {
  width: 21px;
  height: 174px;
  display: inline-block;
}
.bp-combined__art {
  width: 100%;
  display: block;
}
.bp-combined__art img {
  width: 88%;
  margin: 0 auto;
  display: block;
}
.bp-combined .bp-cta {
  margin-top: 0;
}

.bp-final-cta {
  padding: 0 15px 86px;
  background: #121530;
  text-align: center;
}
.bp-final-cta > * {
  max-width: 1170px;
  margin-right: auto;
  margin-left: auto;
}
.bp-final-cta h2 {
  margin-top: 0;
  margin-bottom: 18px;
  font-family: "Roboto BP", Roboto, sans-serif;
  font-size: clamp(32px, 5vw, 50px);
  font-weight: 800;
  line-height: 1.1;
}
.bp-mobile-only {
  display: none;
}
.bp-final-cta p {
  margin-top: 0;
  margin-bottom: 28px;
  font-size: 20px;
}
.bp-source-footer {
  padding: 50px 15px 59px;
  border-top: 1px solid #535b9f;
  display: grid;
  grid-template-columns: 0.8fr 1.5fr 1.2fr;
  align-items: center;
  gap: 28px;
  background: #121530;
  color: #fff;
  font-size: 14px;
}
.bp-source-footer > img {
  width: 182px;
  margin: auto;
}
.bp-source-footer nav {
  display: flex;
  justify-content: center;
  gap: 28px;
}
.bp-source-footer p {
  margin: 4px 0;
  text-align: center;
}
.bp-reveal {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.75s ease,
    transform 0.75s ease;
}
.bp-reveal.is-visible {
  opacity: 1;
  transform: none;
}
.bp-slide-fade-enter-active,
.bp-slide-fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.bp-slide-fade-enter-from {
  opacity: 0;
  transform: translateX(18px);
}
.bp-slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-18px);
}
@keyframes bp-marquee {
  to {
    transform: translateX(-50%);
  }
}

@media (max-width: 767px) {
  .bp-home-page {
    padding-bottom: 92px;
  }
  .bp-hero {
    min-height: 0;
    padding: 40px 25px 10px;
  }
  .bp-gradient-title {
    font-size: 28px;
    line-height: 50px;
    letter-spacing: -1px;
  }
  .bp-hero h1 {
    margin: 0 auto 18px;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: 0;
  }
  .bp-cta {
    min-height: 53px;
    padding: 17px 19px;
    font-size: 16px;
    line-height: 19px;
  }
  .bp-hero-slider {
    width: 100%;
    margin-top: 47px;
  }
  .bp-dots {
    margin-top: 18px;
  }
  .bp-shortcuts {
    padding-top: 22px;
  }
  .bp-shortcuts button {
    font-size: 14px;
  }
  .bp-shortcuts button > span {
    width: 68px;
    height: 68px;
  }
  .bp-managed {
    padding: 38px 20px 0;
  }
  .bp-managed h2 {
    margin-bottom: 37px;
    font-size: 23px;
    line-height: 28px;
  }
  .bp-logo-marquee {
    width: calc(100% + 40px);
    margin-left: -20px;
    padding: 31px 20px;
    border-right: 0;
    border-left: 0;
    border-radius: 0;
  }
  .bp-logo-track img {
    width: 92px;
    height: 44px;
    margin: 0 10px;
  }
  .bp-awards {
    padding: 45px 0 53px;
  }
  .bp-gradient-heading {
    padding: 0 27px;
    font-size: 25px;
    line-height: 28px;
  }
  .bp-awards__desktop-copy {
    display: none;
  }
  .bp-awards__mobile-copy {
    padding: 8px 35px 11px;
    display: block;
    font-size: 18px;
    line-height: 25px;
  }
  .bp-section-arc {
    margin-top: 0;
  }
  .bp-awards__title {
    margin: -45px auto 39px !important;
    padding: 0 35px;
    font-size: 25px;
    line-height: 30px;
  }
  .bp-awards__badges {
    display: none;
  }
  .bp-awards__clutch {
    width: 307px;
    max-width: 100%;
    margin: 0 auto;
    display: block;
  }
  .bp-ecosystem-intro {
    margin-top: 44px;
    padding: 0 28px;
    font-size: 27px;
    line-height: 32px;
  }
  .bp-ecosystems {
    padding: 0 25px 0 28px;
  }
  .bp-ecosystems > header h2 {
    margin-bottom: 30px;
    font-size: 24px;
    line-height: 29px;
  }
  .bp-ecosystems > header h3 {
    padding: 0 40px;
    font-size: 26px;
    line-height: 28px;
  }
  .bp-ecosystem-card {
    margin-bottom: 0;
    padding: 10px 16px 16px;
    grid-template-columns: 1fr;
  }
  .bp-ecosystem-card:nth-of-type(2) {
    margin-top: 24px;
    margin-bottom: 24px;
    padding: 10px 11px 21px;
  }
  .bp-ecosystem-card:nth-of-type(3) {
    padding: 10px 8px 35px;
  }
  .bp-ecosystem-card:nth-of-type(4) {
    margin-top: 24px;
    margin-bottom: 24px;
    padding: 10px 8px 35px;
  }
  .bp-ecosystem-card:nth-of-type(5) {
    padding: 10px 8px 35px;
  }
  .bp-ecosystem-card--reverse .bp-ecosystem-card__copy {
    order: 1;
  }
  .bp-ecosystem-card__copy {
    padding: 0;
    order: 1;
  }
  .bp-ecosystem-card__copy h3 {
    margin: 0;
    padding: 10px 20px 16px;
    font-size: 26px;
    line-height: 30px;
  }
  .bp-ecosystem-card__copy p {
    padding: 0 2px 22px;
    font-size: 16px;
    line-height: 25px;
    text-align: center;
  }
  .bp-ecosystem-card:nth-of-type(2) .bp-ecosystem-card__copy h3 {
    padding: 10px 30px 18px;
  }
  .bp-ecosystem-card:nth-of-type(2) .bp-ecosystem-card__copy p {
    padding: 0 16px 15px;
  }
  .bp-ecosystem-card:nth-of-type(3) .bp-ecosystem-card__copy h3,
  .bp-ecosystem-card:nth-of-type(4) .bp-ecosystem-card__copy h3 {
    padding: 10px 20px 18px;
  }
  .bp-ecosystem-card:nth-of-type(3) .bp-ecosystem-card__copy p {
    padding: 0 16px;
  }
  .bp-ecosystem-card:nth-of-type(4) .bp-ecosystem-card__copy p {
    padding: 0 11px;
  }
  .bp-ecosystem-card:nth-of-type(5) .bp-ecosystem-card__copy h3 {
    padding: 0 40px 18px;
  }
  .bp-ecosystem-card:nth-of-type(5) .bp-ecosystem-card__copy p {
    padding: 0 16px;
  }
  .bp-ecosystem-card__media {
    margin: 0 -16px;
    order: 0;
  }
  .bp-ecosystem-card:nth-of-type(2) .bp-ecosystem-card__media {
    margin: 0 -11px;
  }
  .bp-ecosystem-card:nth-of-type(3) .bp-ecosystem-card__media {
    margin: 0 -8px;
  }
  .bp-ecosystem-card:nth-of-type(4) .bp-ecosystem-card__media {
    margin: 0 -6px;
  }
  .bp-ecosystem-card:nth-of-type(5) .bp-ecosystem-card__media {
    margin: 0 -7px;
  }
  .bp-ecosystem-card__media img,
  .bp-ecosystem-card__media video {
    min-height: 0;
    height: auto;
    aspect-ratio: auto;
    object-fit: inherit;
  }
  .bp-cta--center {
    width: 100%;
    margin: 37px auto 0;
  }
  .bp-wins {
    padding: 51px 20px 60px;
  }
  .bp-wins > h2 {
    margin-bottom: 35px;
    font-size: 28px;
    line-height: 35px;
  }
  .bp-mobile-only {
    display: inline;
  }
  .bp-wins > p {
    margin-bottom: 35px;
    font-size: 18px;
    line-height: 22px;
  }
  .bp-win-card {
    min-height: 0;
    padding: 0 0 26px;
    grid-template-columns: 1fr;
    text-align: center;
  }
  .bp-win-card__copy {
    padding: 43px 28px 11px;
  }
  .bp-win-card h3 {
    margin: 0 5px 23px;
    font-size: 20px;
    line-height: 22px;
  }
  .bp-win-card__stats {
    justify-content: center;
    gap: 18px;
  }
  .bp-win-card__stats strong {
    font-size: 48px;
    line-height: 1;
  }
  .bp-win-card__stats span {
    max-width: 145px;
    margin: 6px auto 0;
    font-size: 18px;
    line-height: 22px;
  }
  .bp-win-card > img {
    width: 100%;
    height: 270px;
    margin: 0;
    object-fit: contain;
  }
  .bp-dots--wins {
    margin-top: 27px;
  }
  .bp-wins__summary {
    padding-top: 72px;
  }
  .bp-wins__summary h3 {
    margin-bottom: 19px;
    font-size: 24px;
    line-height: 29px;
  }
  .bp-wins__summary p {
    font-size: 18px;
    line-height: 25px;
  }
  .bp-partners {
    padding: 0 15px 48px;
  }
  .bp-partners__arc {
    width: calc(100% + 30px);
    margin-left: -15px;
  }
  .bp-partners__title--desktop {
    display: none;
  }
  .bp-partners__title--mobile {
    margin: -65px auto 51px;
    padding: 0;
    display: block;
    font-size: 25px;
    line-height: 28px;
  }
  .bp-partner-carousel__track {
    --bp-partner-slide-width: 134px;
  }
  .bp-combined {
    padding: 6px 0 0;
    background: #121530 url("@/static/brain/site/Group-24997.svg") 0 -51px /
      cover no-repeat;
  }
  .bp-combined h2 {
    max-width: 415px;
    margin: 0 auto;
    padding: 0 25px 530px;
    font-size: 22px;
    line-height: 28px;
  }
  .bp-combined__line {
    width: 21px;
    height: 200px;
    margin: 207px 0 -25px;
    display: inline-block;
  }
  .bp-combined__art {
    width: 100%;
    padding: 0 20px;
  }
  .bp-combined__art img {
    width: 100%;
  }
  .bp-combined .bp-cta {
    width: calc(100% - 90px);
    margin: 23px 45px 50px;
    padding: 17px 81px;
    font-size: 18px;
    line-height: 21px;
  }
  .bp-final-cta {
    padding: 42px 49px 98px;
    position: relative;
  }
  .bp-final-cta::before {
    content: "";
    position: absolute;
    inset: 0 27px 49px;
    border: 2px solid;
    border-image: linear-gradient(
        270deg,
        rgba(155, 165, 255, 0) 6.55%,
        #9ba5ff 49.99%,
        rgba(155, 165, 255, 0) 94.34%
      )
      1;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0)
    );
    pointer-events: none;
  }
  .bp-final-cta > * {
    width: 100%;
    position: relative;
  }
  .bp-final-cta h2 {
    margin-bottom: 11px;
    font-size: 22px;
    line-height: 28px;
  }
  .bp-final-cta p {
    margin-bottom: 22px;
    font-size: 18px;
    line-height: 22px;
  }
  .bp-final-cta .bp-cta {
    width: 100%;
    font-size: 18px;
    line-height: 21px;
    padding-right: 48px;
    padding-left: 48px;
  }
  .bp-source-footer {
    padding: 39px 20px 61px;
    grid-template-columns: 1fr;
    gap: 26px;
  }
  .bp-source-footer nav {
    flex-wrap: wrap;
    gap: 16px 24px;
  }
}

@media (max-width: 370px) {
  .bp-shortcuts {
    padding-right: 7px;
    padding-left: 7px;
  }
  .bp-shortcuts button > span {
    width: 58px;
    height: 58px;
  }
  .bp-shortcuts :deep(.das-icon) {
    width: 58px;
    height: 58px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bp-logo-track,
  .bp-partner-carousel__track {
    animation: none;
  }
  .bp-reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
