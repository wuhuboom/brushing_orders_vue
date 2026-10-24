<template>
  <main class="das-page das-subpage">
    <DasPageHeader :title-key="titleKey" :back-to="backTo" />
    <section class="das-content-card">
      <img v-if="image" class="das-content-card__image" :src="image" alt="" />

      <div v-if="loading" class="reference-loading-block">
        <ReferenceLoading />
      </div>

      <div
        v-else-if="normalizedContent"
        ref="richTextEl"
        class="das-rich-text"
        :style="placeholderStyle"
        v-html="normalizedContent"
      ></div>

      <div v-else class="das-empty">{{ $t("das.common.noData") }}</div>
    </section>
    <p class="das-page-copyright">{{ $t("das.common.copyright") }}</p>
  </main>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import DasPageHeader from "@/components/DasPageHeader.vue";
import ReferenceLoading from "@/components/ReferenceLoading.vue";

const props = defineProps({
  titleKey: { type: String, required: true },
  content: { type: String, default: "" },
  image: { type: String, default: "" },
  fallbackImage: { type: String, default: "" },
  loading: Boolean,
  backTo: { type: String, default: "/" },
  placeholderLabelKey: { type: String, default: "" },
  placeholderCount: { type: Number, default: 0 },
  placeholderAspectRatio: { type: String, default: "0.84 / 1" },
});

const { t } = useI18n();
const richTextEl = ref(null);
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
  ) {
    return `<img src="${absolute(source)}" alt="" />`;
  }
  return source.replace(
    /(<img\b[^>]*?\bsrc=["'])([^"']+)(["'])/gi,
    (_, start, value, end) => `${start}${absolute(value)}${end}`,
  );
});

const placeholderStyle = computed(() => ({
  "--das-media-aspect": props.placeholderAspectRatio,
}));

const applyImageState = (image, frame) => {
  if (!image.complete) return;
  frame.classList.toggle("is-loaded", image.naturalWidth > 0);
  frame.classList.toggle("is-error", image.naturalWidth <= 0);
};

const decorateRichLayout = () => {
  const root = richTextEl.value;
  if (!root?.closest(".tc-page, .faq-page, .about-page, .service-terms-page")) return;
  root.querySelectorAll("p, h1, h2, h3, .ql-code-block-container").forEach((element) => {
    if (!element.textContent.trim() && !element.querySelector("img, video")) {
      element.classList.add("reference-rich-spacer");
    }
  });
  if (root.closest(".tc-page")) {
    const blocks = Array.from(root.children);
    let sectionStart = true;
    blocks.forEach((element, index) => {
      if (element.classList.contains("ql-code-block-container")) {
        if (index > 2) element.classList.add("reference-rich-section-gap");
        sectionStart = true;
      } else if (!element.classList.contains("reference-rich-spacer")) {
        if (sectionStart && !element.querySelector(".ql-size-huge")) {
          element.classList.add("reference-rich-section-lead");
        }
        sectionStart = false;
      }
    });
  }
  if (root.closest(".faq-page")) {
    root.querySelector("p.ql-align-center:first-child")?.classList.add("reference-faq-subtitle");
    root.querySelectorAll("p:has(> .ql-size-large)").forEach((element, index) => {
      element.classList.add("reference-faq-heading");
      if (index === 0) element.classList.add("reference-faq-heading--first");
    });
  }
  if (root.closest(".about-page")) {
    let headingCount = 0;
    Array.from(root.children).forEach((element) => {
      if (/^H[1-3]$/.test(element.tagName) && !element.classList.contains("reference-rich-spacer")) {
        element.classList.add(headingCount === 0 ? "reference-about-heading" : "reference-about-section-heading");
        headingCount++;
      } else if (headingCount > 1 && element.tagName === "P") {
        element.classList.add("reference-about-section-text");
      }
    });
  }
};

const decorateRichImages = () => {
  if (!props.placeholderLabelKey || !richTextEl.value) return;

  richTextEl.value.querySelectorAll("img").forEach((image) => {
    if (image.dataset.dasMediaDecorated === "true") return;

    image.dataset.dasMediaDecorated = "true";
    image.classList.add("das-media-image");

    const frame = document.createElement("span");
    frame.className = "das-media-frame";

    const placeholder = document.createElement("span");
    placeholder.className = "das-media-placeholder";

    placeholder.classList.add("reference-media-loading");
    placeholder.setAttribute("aria-label", t("das.common.loading"));
    placeholder.innerHTML = '<span class="reference-loading" aria-hidden="true"><i></i><i></i><i></i></span>';
    image.parentNode?.insertBefore(frame, image);
    frame.append(placeholder, image);

    image.addEventListener("load", () => {
      frame.classList.add("is-loaded");
      frame.classList.remove("is-error");
    });
    image.addEventListener("error", () => {
      frame.classList.remove("is-loaded");
      frame.classList.add("is-error");

      if (props.fallbackImage && image.dataset.fallbackApplied !== "true") {
        image.dataset.fallbackApplied = "true";
        image.src = props.fallbackImage;
      }
    });

    applyImageState(image, frame);
  });
};

watch(
  normalizedContent,
  async () => {
    await nextTick();
    decorateRichLayout();
    decorateRichImages();
  },
  { flush: "post" },
);

onMounted(async () => {
  await nextTick();
  decorateRichLayout();
  decorateRichImages();
});
</script>
