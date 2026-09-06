<template>
  <article ref="documentRoot" class="nsg-rich-document" :class="{ 'nsg-rich-document--registration': registration }" v-html="content"></article>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";

const props = defineProps({ content: { type: String, default: "" }, registration: Boolean });
const documentRoot = ref(null);

// Group the existing rich text for presentation; retain its text, links and emphasis.
watch([() => props.content, documentRoot], async () => {
  await nextTick();
  const root = documentRoot.value;
  if (!root || root.querySelector(":scope > .nsg-document-intro")) return;
  const elements = [...root.children];
  const intro = document.createElement("div");
  intro.className = "nsg-document-intro";
  root.prepend(intro);
  let section = -1;
  let sectionGroup = root;
  let card = null;
  elements.forEach((element) => {
    const text = (element.textContent || "").trim();
    if (!text && !element.querySelector("img, video, iframe, hr")) {
      element.classList.add("nsg-document-spacer");
      return;
    }
    const numberedClause = /^\(?\d+\.\d+/.test(text);
    const numberedHeading = /^(?:\([A-ZIVX]+\)|[IVX]+[.)]|\d+[.)．、])\s*/i.test(text);
    const heading = !numberedClause && (numberedHeading || element.matches("h2, h3") || element.querySelector("strong.ql-size-large"));
    if (heading) {
      section += 1;
      card = null;
      sectionGroup = document.createElement("section");
      sectionGroup.className = "nsg-document-section";
      sectionGroup.dataset.tone = String(section % 2);
      root.insertBefore(sectionGroup, element);
      sectionGroup.append(element);
      element.classList.add("nsg-document-heading");
      element.dataset.tone = String(section % 2);
      element.dataset.number = String(section + 1).padStart(2, "0");
    } else if (section < 0 && !numberedClause) {
      intro.append(element);
    } else {
      if (!card || numberedClause) {
        card = document.createElement("section");
        card.className = "nsg-document-clause";
        if (sectionGroup === root) root.insertBefore(card, element);
        else sectionGroup.append(card);
      }
      card.append(element);
    }
  });
  const introChildren = [...intro.children];
  const standaloneTitle = introChildren.length === 1 && (
    introChildren[0].matches("h1, h2, h3") ||
    [...introChildren[0].querySelectorAll("strong.ql-size-huge, strong.ql-size-large")]
      .some((title) => title.textContent.trim() === introChildren[0].textContent.trim())
  );
  intro.classList.toggle("nsg-document-intro--title-only", standaloneTitle);
}, { immediate: true, flush: "post" });
</script>

<style>
html #app .nsg-rich-document {
  color: #b6b4c7;
  font-family: "DM Sans", Arial, sans-serif;
  font-size: 16px;
  line-height: 1.45;
  overflow-wrap: anywhere;
}
html #app .nsg-rich-document :is(p, span, strong, div, section) {
  color: inherit !important;
  background-color: transparent !important;
  font-family: inherit !important;
  font-size: inherit !important;
  line-height: inherit !important;
}
html #app .nsg-rich-document p { margin: 0 0 16px; }
html #app .nsg-rich-document strong { font-weight: 700; }
html #app .nsg-rich-document :is(h1, h2, h3) { color: #d5d6ee; font-weight: 600; }
html #app .nsg-rich-document a { color: #a99aff !important; text-decoration: underline; }
html #app .nsg-rich-document :is(img, video, iframe) { max-width: 100%; }
html #app .nsg-rich-document ul { list-style: disc; padding-left: 24px; }
html #app .nsg-rich-document ol { list-style: decimal; padding-left: 24px; }
html #app .nsg-rich-document .nsg-document-spacer,
html #app .nsg-rich-document .nsg-document-intro:empty { display: none; }
html #app .nsg-rich-document .nsg-document-heading {
  margin: 24px 0 8px;
  color: #a398ed !important;
  font-weight: 500;
}
html #app .nsg-rich-document .nsg-document-intro { margin-bottom: 24px; }
html #app .nsg-rich-document .nsg-document-intro > :first-child { color: #d5d6ee !important; }
@media (max-width: 1023px) {
  html #app .nsg-rich-document--registration .nsg-document-intro--title-only { display: none; }
  html #app .nsg-rich-document { font-size: 13px; line-height: 1.65; }
  html #app .nsg-rich-document .nsg-document-intro {
    padding: 16px;
    border: 1px solid #20283c;
    border-radius: 5px;
    background: #0c1427 !important;
  }
  html #app .nsg-rich-document .nsg-document-intro > :first-child { font-size: 16px !important; font-weight: 600; }
  html #app .nsg-rich-document .nsg-document-intro > p:last-child:not(:first-child) {
    padding: 10px;
    border-left: 3px solid #008aa7;
    background: #0b1b2c !important;
  }
  html #app .nsg-rich-document .nsg-document-heading {
    position: relative;
    margin: 26px 0 12px;
    padding: 0 0 8px 14px;
    border-bottom: 1px solid #2c3847;
    color: #16c8e0 !important;
    font-size: 14px !important;
    text-transform: uppercase;
  }
  html #app .nsg-rich-document .nsg-document-heading[data-tone="1"] { color: #b96aea !important; }
  html #app .nsg-rich-document .nsg-document-heading::before {
    position: absolute;
    top: 5px;
    left: 0;
    width: 5px;
    height: 14px;
    background: currentColor;
    content: "";
  }
  html #app .nsg-rich-document .nsg-document-clause {
    margin-bottom: 12px;
    padding: 14px;
    border-radius: 4px;
    background: #151e30 !important;
  }
  html #app .nsg-rich-document .nsg-document-clause strong { color: #d2d2e1 !important; }
  html #app .nsg-rich-document :is(.nsg-document-clause, .nsg-document-intro) > :last-child { margin-bottom: 0; }
  html #app .nsg-rich-document:not(.nsg-rich-document--registration) .nsg-document-section {
    margin: 0 0 16px;
    padding: 16px;
    border: 1px solid #20283c;
    border-radius: 10px;
    background: #10192c !important;
  }
  html #app .nsg-rich-document:not(.nsg-rich-document--registration) .nsg-document-heading {
    min-height: 32px;
    margin: 0 0 16px;
    padding: 0 0 12px 38px;
    color: #d4d6e8 !important;
    font-weight: 600;
    text-transform: none;
  }
  html #app .nsg-rich-document:not(.nsg-rich-document--registration) .nsg-document-heading::before {
    content: attr(data-number);
    top: 0;
    width: 26px;
    height: 26px;
    display: grid;
    place-items: center;
    border: 1px solid #155063;
    border-radius: 5px;
    background: #113445;
    color: #15c4dc;
    font-size: 12px;
  }
  html #app .nsg-rich-document:not(.nsg-rich-document--registration) .nsg-document-heading[data-tone="1"]::before { border-color: #4b346f; background: #32204e; color: #b591e0; }
  html #app .nsg-rich-document:not(.nsg-rich-document--registration) .nsg-document-clause {
    margin: 0 0 14px;
    padding: 0 0 0 10px;
    border-left: 2px solid #202c40;
    border-radius: 0;
    background: transparent !important;
  }
  html #app .nsg-rich-document:not(.nsg-rich-document--registration) .nsg-document-clause:last-child { margin-bottom: 0; }
}
</style>
