<template>
  <main class="das-page das-subpage">
    <DasPageHeader :title-key="titleKey" :back-to="backTo" />
    <section class="das-content-card">
      <img v-if="image" class="das-content-card__image" :src="image" alt="" />
      <div v-if="loading" class="das-empty">{{ $t("das.common.loading") }}</div>
      <div
        v-else-if="normalizedContent"
        class="das-rich-text"
        v-html="normalizedContent"
        @error.capture="handleImageError"
      ></div>
      <div v-else class="das-empty">{{ $t("das.common.noData") }}</div>
    </section>
    <p class="das-page-copyright">{{ $t("das.common.copyright") }}</p>
  </main>
</template>
<script setup>
import { computed } from "vue";
import DasPageHeader from "@/components/DasPageHeader.vue";
const props = defineProps({
  titleKey: { type: String, required: true },
  content: { type: String, default: "" },
  image: { type: String, default: "" },
  fallbackImage: { type: String, default: "" },
  loading: Boolean,
  backTo: { type: String, default: "/" },
});
const imageBase = window.g?.VITE_API_IMG_URL || "";
const absolute = (value) =>
  !value || /^(?:https?:|data:|blob:)/i.test(value)
    ? value
    : `${imageBase}${value.startsWith("/") ? "" : "/"}${value}`;
const normalizedContent = computed(() => {
  const source = String(props.content || "").trim();
  if (!source) return "";
  if (
    !/<[a-z][\s\S]*>/i.test(source) &&
    /\.(?:png|jpe?g|gif|webp|svg)(?:\?.*)?$/i.test(source)
  )
    return `<img src="${absolute(source)}" alt="" />`;
  return source.replace(
    /(<img\b[^>]*?\bsrc=["'])([^"']+)(["'])/gi,
    (_, start, value, end) => `${start}${absolute(value)}${end}`,
  );
});
const handleImageError = (event) => {
  const image = event.target;
  if (
    props.fallbackImage &&
    image?.tagName === "IMG" &&
    image.dataset.fallbackApplied !== "true"
  ) {
    image.dataset.fallbackApplied = "true";
    image.src = props.fallbackImage;
  }
};
</script>
