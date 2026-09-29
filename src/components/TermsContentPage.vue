<template>
  <main class="das-page terms-page">
    <header class="terms-hero">
      <DasPageHeader title-key="das.page.terms" back-to="/" />
      <div class="terms-hero__copy">
        <h1>{{ $t("das.page.terms") }}</h1>
        <p aria-hidden="true">
          Fair Play · Secure Trading ·<br />A Brighter Tomorrow
        </p>
      </div>
      <span class="terms-hero__caption" aria-hidden="true"
        >A BRIGHTER TOMORROW →</span
      >
    </header>
    <section class="terms-cards" :aria-busy="loading">
      <template v-if="loading">
        <article
          v-for="index in 3"
          :key="index"
          class="terms-card terms-skeleton"
          aria-hidden="true"
        >
          <span></span><i v-for="line in 5" :key="line"></i>
        </article>
        <span class="terms-status" role="status">{{
          $t("das.common.loading")
        }}</span>
      </template>
      <template v-else-if="sections.length">
        <article
          v-for="(section, index) in sections"
          :key="index"
          class="terms-card"
        >
          <header v-if="section.title" class="terms-card__heading">
            <span v-if="section.number" class="terms-card__number">{{
              /^\d+$/.test(section.number)
                ? section.number.padStart(2, "0")
                : section.number
            }}</span>
            <h2 v-html="section.title"></h2>
          </header>
          <div
            v-for="(block, blockIndex) in section.blocks"
            :key="blockIndex"
            class="terms-card__paragraph"
            :class="{ 'terms-card__clause': block.number }"
          >
            <span v-if="block.number" class="terms-card__clause-number">{{
              block.number
            }}</span>
            <div class="terms-card__text" v-html="block.html"></div>
          </div>
        </article>
      </template>
      <div v-else class="terms-card terms-empty">
        {{ $t("das.common.noData") }}
      </div>
    </section>
    <p class="das-page-copyright">{{ $t("das.common.copyright") }}</p>
  </main>
</template>

<script setup>
import { computed } from "vue";
import DasPageHeader from "@/components/DasPageHeader.vue";
import { parseTermsContent } from "@/utils/termsContent";
const props = defineProps({
  content: { type: String, default: "" },
  loading: Boolean,
});
const sections = computed(() =>
  parseTermsContent(props.content, window.g?.VITE_API_IMG_URL || ""),
);
</script>

<style scoped>
#app .terms-page {
  container-type: inline-size;
  background: #f2f4f9;
}
.terms-hero {
  position: relative;
  aspect-ratio: 1500 / 1012;
  background: url("@/static/amplava/terms-background.png") center / 100% 100%
    no-repeat;
  color: white;
}
#app .terms-hero :deep(.das-page-head) {
  position: relative;
  background: transparent;
}
#app .terms-hero :deep(.das-page-head::after) {
  display: none;
}
#app .terms-hero :deep(.das-page-head__title) {
  min-height: 22cqw;
  padding: 16px 4.2%;
  gap: 20px;
}
#app .terms-hero :deep(.das-page-head__title h1) {
  font-family: "Amplava Display", sans-serif;
  font-size: clamp(16px, 4.2cqw, 25px);
  font-weight: 400;
  text-transform: uppercase;
}
.terms-hero__copy {
  position: absolute;
  left: 4.2%;
  top: 32%;
  width: 49%;
}
.terms-hero__copy h1 {
  max-width: 100%;
  margin: 0;
  font-family: "Amplava Display", sans-serif;
  font-size: clamp(27px, 7.2cqw, 58px);
  font-weight: 400;
  line-height: 1.28;
  overflow-wrap: anywhere;
}
.terms-hero__copy p {
  margin: 13px 0 0;
  color: #ecd0f4;
  font-size: clamp(10px, 2.9cqw, 19px);
  line-height: 1.9;
}
.terms-hero__caption {
  position: absolute;
  right: 5%;
  bottom: 12%;
  color: #e5bce8;
  font-size: clamp(8px, 2.4cqw, 15px);
}
.terms-cards {
  position: relative;
  display: grid;
  gap: 14px;
  margin: -14px 16px 0;
}
.terms-card {
  min-width: 0;
  padding: 22px 19px;
  border-radius: 10px;
  background: white;
  color: #526079;
  font-size: 13px;
  line-height: 1.65;
  overflow-wrap: anywhere;
}
.terms-card__heading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 16px;
  margin-bottom: 15px;
  border-bottom: 1px solid #e5eaf3;
  color: #252f44;
}
.terms-card__heading:last-child {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: 0;
}
.terms-card__number {
  flex-shrink: 0;
  min-width: 38px;
  padding: 4px 6px;
  border-radius: 3px;
  background: #f21392;
  color: white;
  font-weight: 700;
  font-size: 13px;
  text-align: center;
}
.terms-card__heading h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
  text-transform: uppercase;
}
.terms-card__paragraph + .terms-card__paragraph {
  margin-top: 13px;
}
.terms-card__clause {
  display: flex;
  align-items: baseline;
  gap: 9px;
}
.terms-card__clause-number {
  flex-shrink: 0;
  color: #34415a;
  font-weight: 700;
}
.terms-card__text {
  min-width: 0;
}
.terms-card :deep(p) {
  margin: 0;
}
.terms-card :deep(strong) {
  color: #253047;
  font-weight: 700;
}
.terms-card :deep(img) {
  max-width: 100%;
  height: auto;
}
.terms-card :deep(a) {
  color: #eb008e;
  text-decoration: underline;
}
.terms-card :deep(ul),
.terms-card :deep(ol) {
  padding-left: 20px;
}
.terms-empty {
  text-align: center;
}
.terms-skeleton span,
.terms-skeleton i {
  display: block;
  height: 12px;
  margin: 12px 0;
  border-radius: 4px;
  background: linear-gradient(90deg, #edf0f8 25%, #fafbff 50%, #edf0f8 75%);
  background-size: 200% 100%;
  animation: terms-shimmer 1.5s ease-in-out infinite;
}
.terms-skeleton span {
  width: 65%;
  height: 24px;
  margin-bottom: 22px;
}
.terms-skeleton i:last-child {
  width: 70%;
}
.terms-status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
@keyframes terms-shimmer {
  to {
    background-position: -200% 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .terms-skeleton span,
  .terms-skeleton i {
    animation: none;
  }
}
</style>
