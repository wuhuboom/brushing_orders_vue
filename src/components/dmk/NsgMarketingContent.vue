<template>
  <div ref="host" class="nsg-marketing-content"></div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { openCustomerServiceDialog } from "@/utils/customerServiceDialog";
import homeHtml from "@/assets/nsg-marketing/home.html?raw";
import aboutHtml from "@/assets/nsg-marketing/about.html?raw";
import originalCss from "@/assets/nsg-marketing/original.css?raw";
import { getPcBreakpoint } from "@/responsiveMode";

const props = defineProps({ page: { type: String, default: "home" } });
const emit = defineEmits(["start-work"]);
const host = ref(null);
const { t } = useI18n();

// Keep the supplied Webflow layout isolated from the existing NSG header/footer.
const contentCss = originalCss
  .replace(/:root(?=\{)/g, ":host")
  .replace(/(?<![.\w-])body(?=\{)/g, ".body")
  .replaceAll("Montserrat", "NsgMarketingMontserrat")
  .replaceAll(
    "https://cdn.prod.website-files.com/5dfbe31e79679a7e29232084/61f31a58945c4f70bd55d074_agency-subsection-background.jpg",
    "/nsg16/marketing/assets/agency-background.jpg",
  );

onMounted(() => {
  const root = host.value.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = contentCss + `
    :host { display: block; width: 100%; }
    .body { isolation: isolate; }
    @media (max-width: ${getPcBreakpoint() - 0.02}px) {
      .nsg-home .hero-video .flex-container { padding-left: 16px; padding-right: 16px; }
      .nsg-home .hero-video .div-block { width: 100%; max-width: 100%; }
      .nsg-home .hero-video .heading-1 { text-align: center; }
      .nsg-home .hero-video [data-customer-service] {
        display: block;
        width: fit-content;
        max-width: 100%;
        margin: 28px auto 0;
      }
    }
  `;
  const body = document.createElement("div");
  body.className = props.page === "about" ? "body" : "body nsg-home";
  body.innerHTML = props.page === "about" ? aboutHtml : homeHtml;
  const supportButtons = body.querySelectorAll("[data-customer-service]");
  const translatedHeadings = body.querySelectorAll("[data-i18n]");
  watchEffect(() => {
    const label = t("das.dmk.contactCustomerService");
    supportButtons.forEach((button) => { button.textContent = label; });
    translatedHeadings.forEach((heading) => { heading.textContent = t(heading.dataset.i18n); });
  });
  // These are presentation-only documents: do not enable third-party workflows.
  body.addEventListener("submit", (event) => event.preventDefault());
  body.addEventListener("click", (event) => {
    if (event.target.closest("[data-customer-service]")) {
      event.preventDefault();
      openCustomerServiceDialog();
      return;
    }
    const link = event.target.closest("a");
    if (!link) return;
    event.preventDefault();
    if (props.page === "about" && link.classList.contains("cta-button")) {
      emit("start-work");
    }
  });
  root.append(style, body);
});
</script>

<style>
@font-face {
  font-family: "NsgMarketingMontserrat";
  src: url("/nsg16/marketing/assets/montserrat-latin.woff2") format("woff2");
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
}
@font-face {
  font-family: "NsgMarketingMontserrat";
  src: url("/nsg16/marketing/assets/montserrat-italic-latin.woff2") format("woff2");
  font-style: italic;
  font-weight: 100 900;
  font-display: swap;
}
.nsg-marketing-content { display: block; width: 100%; }
</style>
