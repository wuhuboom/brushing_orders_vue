<template>
  <div class="w-full bg-black">
    <div class="w-full max-w-[1200px] text-white mx-auto py-10">
      <div class="w-[90%] lg:w-full mx-auto">
        <img
          class="w-full lg:w-[90%] lg:mx-auto"
          :src="asset(mobile ? config.phoneHero : config.pcHero)"
          alt=""
        />
        <p class="text-base text-center py-4 lg:w-[345px] lg:mx-auto">
          {{ $t("das.dmk.serviceLead") }}
        </p>
        <div
          class="w-full lg:w-[400px] uppercase lg:mx-auto rounded-full cursor-pointer mt-8 py-3 bg-[var(--main-color)] text-black text-base text-center"
          @click="startWork"
        >
          {{ $t("das.dmk.startWork") }}
        </div>

        <div v-if="mobile" class="w-full mt-20">
          <img
            v-for="image in config.mobileOverview"
            :key="image"
            class="w-full"
            :src="asset(image)"
            alt=""
          />
        </div>
        <div v-else class="w-full mt-20">
          <div class="w-full flex justify-between items-start gap-4">
            <img
              v-for="image in config.desktopOverview"
              :key="image"
              class="w-full"
              :src="asset(image)"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>

    <template v-if="mobile">
      <section class="w-full bg-white py-10 text-black">
        <div class="w-[90%] max-w-[1200px] mx-auto">
          <img class="w-full" :src="asset(config.mobileIntro)" alt="" />
          <img class="w-full" :src="asset(config.mobileShared)" alt="" />
        </div>
      </section>

      <section class="w-full bg-[#f0f0f0] py-10 text-black">
        <div class="w-[90%] max-w-[1200px] mx-auto">
          <img class="w-full" :src="asset(config.mobileStrategy)" alt="" />
          <img
            v-for="image in config.mobileStrategyCards"
            :key="image"
            class="w-full mt-6"
            :src="asset(image)"
            alt=""
          />
        </div>
      </section>

      <section class="w-full bg-white py-10 text-black">
        <div class="w-[90%] max-w-[1200px] mx-auto">
          <img class="w-full" :src="asset(config.mobileStory)" alt="" />
          <img class="w-full" :src="asset(config.mobileShared)" alt="" />
        </div>
      </section>

      <DmkAuditMarquee />

      <section class="w-full bg-white py-10 text-black">
        <div class="w-[90%] max-w-[1200px] mx-auto">
          <img class="w-full" :src="asset(config.mobileTestimonials)" alt="" />
        </div>
      </section>

      <section class="w-full bg-[var(--main-color)] py-10 text-black">
        <div class="w-[90%] max-w-[1200px] mx-auto">
          <img class="w-full" :src="asset(config.mobileClosing)" alt="" />
        </div>
      </section>
    </template>

    <template v-else>
      <section class="w-full bg-white py-10 text-black">
        <div class="w-full max-w-[1200px] mx-auto">
          <div class="w-[450px] text-4xl font-semibold">
            {{ $t(config.introTitle) }}
          </div>
          <div class="mt-4 text-base w-[600px]">{{ $t(config.introCopy) }}</div>
          <div class="w-full mx-auto py-10 flex justify-between items-start">
            <img
              v-for="image in config.introImages"
              :key="image"
              class="w-[500px]"
              :src="asset(image)"
              alt=""
            />
          </div>
        </div>
      </section>

      <section class="w-full bg-[#f0f0f0] py-10 text-black">
        <div class="w-full max-w-[1200px] mx-auto">
          <div class="w-[450px] text-4xl font-semibold">
            {{ $t(config.strategyTitle) }}
          </div>
          <div class="mt-4 text-base w-[600px]">{{ $t(config.strategyCopy) }}</div>
          <div
            class="w-[90%] mx-auto py-10 flex justify-between items-center gap-x-10"
          >
            <img
              v-for="image in config.strategyImages"
              :key="image"
              class="w-full"
              :src="asset(image)"
              alt=""
            />
          </div>
        </div>
      </section>

      <section class="w-full bg-white py-10 text-black">
        <div
          class="w-full max-w-[1200px] mx-auto flex justify-between items-center"
        >
          <template v-if="config.storyTitle">
            <div class="w-1/2">
              <p class="text-[60px] leading-tight font-medium">
                {{ $t(config.storyTitle) }}
              </p>
              <p
                v-for="paragraph in config.storyParagraphs"
                :key="paragraph"
                class="mt-6 text-lg"
              >
                {{ $t(paragraph) }}
              </p>
            </div>
            <div class="w-1/2 flex justify-center">
              <img :src="asset(config.storyImage)" alt="" />
            </div>
          </template>
          <img v-else class="w-full" :src="asset(config.storyImage)" alt="" />
        </div>
      </section>

      <DmkAuditMarquee />

      <section class="w-full bg-white py-10 text-black">
        <div class="w-full max-w-[1200px] mx-auto">
          <img
            v-if="config.testimonialsTitleImage"
            :src="asset(config.testimonialsTitleImage)"
            alt=""
          />
          <div v-else class="w-[500px] mx-auto text-[40px] font-semibold">
            {{ $t("das.dmk.testimonialsTitle") }}
          </div>
          <div class="w-full pt-20 grid grid-cols-4 gap-10">
            <img
              v-for="(image, index) in config.testimonialImages"
              :key="`${image}-${index}`"
              :class="index === 0 ? 'col-span-1' : ''"
              :src="asset(image)"
              alt=""
            />
          </div>
        </div>
      </section>

      <section class="w-full bg-[var(--main-color)] py-10 text-black">
        <div class="w-full max-w-[1600px] mx-auto">
          <img class="w-full" :src="asset(config.desktopClosing)" alt="" />
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { safePush } from "@/utils/navigation";
import DmkAuditMarquee from "./DmkAuditMarquee.vue";

const props = defineProps({
  service: { type: String, required: true },
  mobile: { type: Boolean, default: false },
});

const router = useRouter();
const store = useUserStore();
const asset = (name) => `/dmk/assets/${name}`;
const startWork = () =>
  safePush(router, store.token ? "/starting" : "/account/login");

const services = {
  ppc: {
    pcHero: "pc-ppc.png",
    phoneHero: "phone-ppc.png",
    desktopOverview: ["ppc1.png", "ppc2.png", "ppc3.png", "ppc4.png"],
    mobileOverview: ["ppc17.png", "ppc18.png", "ppc19.png", "ppc20.png"],
    introTitle: "das.dmk.ppcIntroTitle",
    introCopy: "das.dmk.ppcIntroCopy",
    introImages: ["ppc5.png", "ppc6.png"],
    strategyTitle: "das.dmk.ppcStrategyTitle",
    strategyCopy: "das.dmk.ppcStrategyCopy",
    strategyImages: ["ppc7.png", "ppc8.png", "ppc9.png"],
    storyTitle: "das.dmk.ppcStoryTitle",
    storyParagraphs: [
      "das.dmk.ppcStoryParagraph1",
      "das.dmk.ppcStoryParagraph2",
    ],
    storyImage: "ppc10.png",
    testimonialImages: ["ppc26.png", "ppc27.png", "ppc28.png", "ppc26.png"],
    desktopClosing: "ppc12.png",
    mobileIntro: "ppc21.png",
    mobileShared: "ppc16.png",
    mobileStrategy: "ppc22.png",
    mobileStrategyCards: ["ppc13.png", "ppc14.png", "ppc15.png"],
    mobileStory: "ppc23.png",
    mobileTestimonials: "ppc25.png",
    mobileClosing: "ppc24.png",
  },
  seo: {
    pcHero: "pc-seo.png",
    phoneHero: "phone-seo.png",
    desktopOverview: ["seo1.png", "seo2.png", "seo3.png", "seo4.png"],
    mobileOverview: ["seo17.png", "seo18.png", "seo19.png", "seo20.png"],
    introTitle: "das.dmk.seoIntroTitle",
    introCopy: "das.dmk.seoIntroCopy",
    introImages: ["seo5.png", "seo6.png"],
    strategyTitle: "das.dmk.seoStrategyTitle",
    strategyCopy: "das.dmk.seoStrategyCopy",
    strategyImages: ["seo7.png", "seo8.png", "seo9.png"],
    storyTitle: "das.dmk.seoStoryTitle",
    storyParagraphs: [
      "das.dmk.seoStoryParagraph1",
      "das.dmk.seoStoryParagraph2",
    ],
    storyImage: "seo10.png",
    testimonialImages: ["seo26.png", "seo27.png", "seo28.png", "seo26.png"],
    desktopClosing: "seo12.png",
    mobileIntro: "seo21.png",
    mobileShared: "seo16.png",
    mobileStrategy: "seo22.png",
    mobileStrategyCards: ["seo13.png", "seo14.png", "seo15.png"],
    mobileStory: "seo23.png",
    mobileTestimonials: "seo25.png",
    mobileClosing: "seo24.png",
  },
  web: {
    pcHero: "pc-web.png",
    phoneHero: "phone-web.png",
    desktopOverview: ["web1.png", "web2.png", "ppc3.png", "ppc4.png"],
    mobileOverview: ["web17.png", "web18.png", "web19.png", "web20.png"],
    introTitle: "das.dmk.webIntroTitle",
    introCopy: "das.dmk.webIntroCopy",
    introImages: ["web5.png", "web6.png"],
    strategyTitle: "das.dmk.webStrategyTitle",
    strategyCopy: "das.dmk.webStrategyCopy",
    strategyImages: ["web7.png", "web8.png", "web9.png"],
    storyImage: "web10.png",
    testimonialsTitleImage: "web29.png",
    testimonialImages: ["web26.png", "web27.png", "web28.png", "web26.png"],
    desktopClosing: "web12.png",
    mobileIntro: "web21.png",
    mobileShared: "web16.png",
    mobileStrategy: "web22.png",
    mobileStrategyCards: ["web13.png", "web14.png", "web15.png"],
    mobileStory: "web23.png",
    mobileTestimonials: "ppc25.png",
    mobileClosing: "web24.png",
  },
};

const config = computed(() => services[props.service] || services.seo);
</script>
