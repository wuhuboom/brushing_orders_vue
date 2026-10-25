<template>
  <main class="das-page das-subpage">
    <DasPageHeader :title-key="titleKey" :back-to="backTo" />
    <section class="das-content-card">
      <img v-if="image" class="das-content-card__image" :src="image" alt="" />

      <div
        v-if="loading && placeholderCount > 0"
        class="das-media-stack"
        :style="placeholderStyle"
        aria-hidden="true"
      >
        <span
          v-for="index in placeholderCount"
          :key="index"
          class="das-media-frame das-media-frame--standalone"
        >
          <span class="das-media-placeholder">
            <img class="das-media-placeholder__icon" :src="placeholderIcon" alt="" />
            <span>{{ placeholderLabel }}</span>
          </span>
        </span>
      </div>
      <div v-else-if="loading" class="das-empty">{{ $t("das.common.loading") }}</div>

      <div
        v-else-if="normalizedContent"
        ref="richTextEl"
        class="das-rich-text"
        :style="placeholderStyle"
        v-html="normalizedContent"
      ></div>

      <div
        v-else-if="placeholderCount > 0"
        class="das-media-stack"
        :style="placeholderStyle"
        aria-hidden="true"
      >
        <span
          v-for="index in placeholderCount"
          :key="index"
          class="das-media-frame das-media-frame--standalone"
        >
          <span class="das-media-placeholder">
            <img class="das-media-placeholder__icon" :src="placeholderIcon" alt="" />
            <span>{{ placeholderLabel }}</span>
          </span>
        </span>
      </div>
      <div v-else class="das-empty">{{ $t("das.common.noData") }}</div>
    </section>
    <p class="das-page-copyright">{{ $t("das.common.copyright") }}</p>
  </main>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import DasPageHeader from "@/components/DasPageHeader.vue";
import placeholderIcon from "@/static/das/image-placeholder.png";

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

const placeholderLabel = computed(() =>
  props.placeholderLabelKey ? t(props.placeholderLabelKey) : "",
);

const placeholderStyle = computed(() => ({
  "--das-media-aspect": props.placeholderAspectRatio,
}));

const applyImageState = (image, frame) => {
  if (!image.complete) return;
  frame.classList.toggle("is-loaded", image.naturalWidth > 0);
  frame.classList.toggle("is-error", image.naturalWidth <= 0);
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

    const icon = document.createElement("img");
    icon.className = "das-media-placeholder__icon";
    icon.src = placeholderIcon;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.className = "das-media-placeholder__label";
    label.textContent = placeholderLabel.value;

    placeholder.append(icon, label);
    image.parentNode?.insertBefore(frame, image);
    frame.append(placeholder, image);

    image.addEventListener("load", () => {
      frame.classList.add("is-loaded");
      frame.classList.remove("is-error");
    });
    image.addEventListener("error", () => {
      frame.classList.remove("is-loaded");
      frame.classList.add("is-error");

      if (
        props.fallbackImage &&
        image.dataset.fallbackApplied !== "true"
      ) {
        image.dataset.fallbackApplied = "true";
        image.src = props.fallbackImage;
      }
    });

    applyImageState(image, frame);
  });
};

const updatePlaceholderLabels = () => {
  if (!richTextEl.value) return;
  richTextEl.value
    .querySelectorAll(".das-media-placeholder__label")
    .forEach((label) => {
      label.textContent = placeholderLabel.value;
    });
};

watch(
  normalizedContent,
  async () => {
    await nextTick();
    decorateRichImages();
  },
  { flush: "post" },
);

watch(placeholderLabel, async () => {
  await nextTick();
  updatePlaceholderLabels();
});

onMounted(async () => {
  await nextTick();
  decorateRichImages();
});
</script>

<style scoped>
.das-media-stack {
  display: grid;
  gap: 16px;
}

.das-media-frame {
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
  border-radius: 18px;
  background: #17382d;
}

.das-media-frame:not(.is-loaded) {
  aspect-ratio: var(--das-media-aspect, 0.84 / 1);
}

.das-rich-text :deep(.das-media-frame) {
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
  margin: 0 0 16px;
  border-radius: 18px;
  background: #17382d;
}

.das-rich-text :deep(.das-media-frame:not(.is-loaded)) {
  aspect-ratio: var(--das-media-aspect, 0.84 / 1);
}

.das-media-placeholder,
.das-rich-text :deep(.das-media-placeholder) {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #17382d;
  color: rgba(235, 239, 229, 0.5);
  font-size: 11px;
  line-height: 1.2;
  text-align: center;
}

.das-media-placeholder__icon,
.das-rich-text :deep(.das-media-placeholder__icon) {
  width: 38px;
  height: 38px;
  border-radius: 0;
  object-fit: contain;
  opacity: 0.5;
}

.das-rich-text :deep(.das-media-image) {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  margin: 0;
  border-radius: 18px;
  opacity: 0;
}

.das-rich-text :deep(.das-media-frame.is-loaded) {
  aspect-ratio: auto;
  background: transparent;
}

.das-rich-text :deep(.das-media-frame.is-loaded .das-media-placeholder) {
  display: none;
}

.das-rich-text :deep(.das-media-frame.is-loaded .das-media-image) {
  opacity: 1;
}
</style>
