<template>
  <main
    ref="pageRef"
    class="das-page home-page podean-home"
    :aria-busy="!referenceReady"
    @scroll="updateScrollPosition"
  >
    <div class="home-reference" :class="{ 'is-ready': referenceReady }">
      <div
        v-if="!referenceReady"
        class="home-loading"
        role="status"
        :aria-label="$t('das.common.loading')"
      >
        <div
          class="home-loading__hero"
          :style="{ backgroundImage: 'url(' + referenceArtUrl + ')' }"
          aria-hidden="true"
        >
          <div class="home-loading__title"><i></i><i></i><i></i></div>
          <div class="home-loading__copy"><i></i><i></i><i></i></div>
          <div class="home-loading__button"></div>
        </div>
        <div class="home-loading__shortcuts" aria-hidden="true">
          <div class="home-loading__caption"></div>
          <div class="home-loading__grid">
            <div v-for="n in 8" :key="n"><i></i><span></span></div>
          </div>
        </div>
      </div>
      <section class="legacy-hero home-header">
        <HeaderTop />
      </section>
      <iframe
        ref="referenceRef"
        class="home-reference__frame"
        allow="autoplay"
        :inert="!referenceReady"
        :aria-hidden="!referenceReady"
        :src="referenceUrl"
        title="Marketplace marketing"
        :style="{ height: frameHeight + 'px' }"
        @load="syncShortcutsHeight"
      ></iframe>
      <div
        v-show="shortcutsTop !== null"
        :style="{
          top: shortcutsTop + 'px',
          visibility: referenceReady ? 'visible' : 'hidden',
        }"
        ref="shortcutsRef"
        class="home-shortcuts-slot"
      >
        <section class="legacy-shortcuts">
          <h2>{{ $t("das.home.shortcuts") }}</h2>
          <button
            class="home-shortcuts-support"
            type="button"
            @click="goTo({ route: '/contact' })"
          >
            <img
              src="@/static/amplava/support.png"
              :alt="$t('das.nav.contact')"
            />
          </button>
          <div class="legacy-shortcuts__grid">
            <button
              v-for="item in shortcuts"
              :key="item.title"
              type="button"
              @click="goTo(item)"
            >
              <span><DasIcon :name="item.icon" /></span
              ><b>{{ $t(item.title) }}</b>
            </button>
          </div>
        </section>
      </div>
    </div>
    <button
      v-show="showReturnToTop"
      class="home-return-top"
      type="button"
      aria-label="Back to top"
      @click="returnToTop"
    >
      <svg viewBox="0 0 512 512" aria-hidden="true">
        <path
          d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
        />
      </svg>
    </button>
    <Footer name="/" />
  </main>
</template>

<script setup>
import { nextTick, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
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
const referenceRef = ref(null);
const shortcutsRef = ref(null);
const frameHeight = ref(5600);
const referenceReady = ref(false);
const showReturnToTop = ref(false);
const updateScrollPosition = () => {
  showReturnToTop.value =
    (isDocumentScrollMode() ? window.scrollY : pageRef.value?.scrollTop) >= 50;
};
const returnToTop = () => {
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
  if (isDocumentScrollMode()) window.scrollTo({ top: 0, behavior });
  else pageRef.value?.scrollTo({ top: 0, behavior });
};
const shortcutsTop = ref(null);
const referenceUrl = import.meta.env.BASE_URL + "podean-home/index.html";
const referenceArtUrl =
  import.meta.env.BASE_URL + "podean-home/assets/1120414178-Hero.svg";
let shortcutObserver;
let restoreScrollTimer;
let restored = false;
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

  await new Promise((resolve) => {
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => {
        restore();
        resolve();
      }),
    );
  });
  restoreScrollTimer = window.setTimeout(restore, 300);
};

const goTo = (item) => {
  saveHomeScroll();
  safePush(router, item.route);
};
const syncShortcutsHeight = () => {
  const height = shortcutsRef.value?.getBoundingClientRect().height;
  if (height > 0)
    referenceRef.value?.contentWindow?.postMessage(
      { type: "amplava-shortcuts-size", height },
      window.location.origin,
    );
};
const receiveLayout = async (event) => {
  if (
    event.source !== referenceRef.value?.contentWindow ||
    event.origin !== window.location.origin
  )
    return;
  if (event.data?.type !== "podean-layout") return;
  const { height, shortcutsY } = event.data;
  if (!Number.isFinite(height) || !Number.isFinite(shortcutsY)) return;
  frameHeight.value = height;
  shortcutsTop.value = shortcutsY;
  await nextTick();
  syncShortcutsHeight();
  if (!restored && event.data.ready) {
    restored = true;
    await restoreHomeScroll();
    window.requestAnimationFrame(() => {
      if (pageRef.value) referenceReady.value = true;
    });
  }
};
onBeforeMount(() =>
  document.documentElement.classList.add(DOCUMENT_SCROLL_CLASS),
);
onMounted(() => {
  window.addEventListener("message", receiveLayout);
  window.addEventListener("scroll", updateScrollPosition, { passive: true });
  shortcutObserver = new ResizeObserver(syncShortcutsHeight);
  shortcutObserver.observe(shortcutsRef.value);
});
onBeforeRouteLeave(saveHomeScroll);
onBeforeUnmount(() => {
  document.documentElement.classList.remove(DOCUMENT_SCROLL_CLASS);
  window.removeEventListener("message", receiveLayout);
  window.removeEventListener("scroll", updateScrollPosition);
  shortcutObserver?.disconnect();
  window.clearTimeout(restoreScrollTimer);
});
</script>

<style scoped>
.home-return-top {
  position: fixed;
  z-index: 70;
  bottom: 88px;
  left: max(0px, calc((100vw - var(--das-app-max-width, 960px)) / 2));
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border: 0;
  border-radius: 35px;
  background: rgba(68, 68, 68, 0.7);
}
.home-return-top:hover {
  background: rgba(68, 68, 68, 0.9);
}
.home-return-top svg {
  width: 20px;
  fill: white;
}

.home-page {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  scroll-behavior: smooth;
}
.home-page,
.home-page * {
  box-sizing: border-box;
}
.home-reference {
  position: relative;
  width: 100%;
}
.home-reference__frame {
  opacity: 0;
  pointer-events: none;
  display: block;
  width: 100%;
  border: 0;
  background: #fff;
}
.home-reference.is-ready .home-reference__frame {
  opacity: 1;
  pointer-events: auto;
}
.home-loading {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  background: #f3f7fd;
}
.home-loading__hero {
  height: 726px;
  padding: 156px 30px 70px;
  background-color: #852bbb;
  background-size: cover;
  background-position: center;
}
.home-loading__title,
.home-loading__copy {
  display: grid;
  justify-items: center;
  gap: 14px;
  max-width: 440px;
  margin: 0 auto;
}
.home-loading__title i,
.home-loading__copy i,
.home-loading__button {
  display: block;
  border-radius: 8px;
  background: linear-gradient(
    100deg,
    #ffffff1f 20%,
    #ffffff4a 45%,
    #ffffff1f 70%
  );
  background-size: 240% 100%;
  animation: home-loading-shimmer 1.5s ease-in-out infinite;
}
.home-loading__title i {
  width: 88%;
  height: 36px;
}
.home-loading__title i:last-child {
  width: 62%;
}
.home-loading__copy {
  margin-top: 38px;
}
.home-loading__copy i {
  width: 95%;
  height: 24px;
}
.home-loading__copy i:last-child {
  width: 68%;
}
.home-loading__button {
  width: 220px;
  height: 54px;
  margin: 42px auto 0;
  border: 1px solid #ffffff54;
  border-radius: 28px;
}
.home-loading__shortcuts {
  margin: 20px 8px;
  padding: 22px 18px;
  background: #fff;
  border-radius: 12px;
}
.home-loading__caption {
  width: 100px;
  height: 14px;
  border-radius: 5px;
  background: #e8edf6;
}
.home-loading__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px 12px;
  margin-top: 24px;
}
.home-loading__grid > div {
  display: grid;
  justify-items: center;
  gap: 12px;
}
.home-loading__grid i,
.home-loading__grid span {
  background: linear-gradient(100deg, #edf1f8 20%, #f9fbff 45%, #edf1f8 70%);
  background-size: 240% 100%;
  animation: home-loading-shimmer 1.5s ease-in-out infinite;
}
.home-loading__grid i {
  width: 44px;
  height: 44px;
  border-radius: 12px;
}
.home-loading__grid span {
  width: 65px;
  max-width: 100%;
  height: 13px;
  border-radius: 4px;
}
@keyframes home-loading-shimmer {
  from {
    background-position: 100% 0;
  }
  to {
    background-position: -100% 0;
  }
}
@media (min-width: 576px) {
  .home-loading__hero {
    height: 640px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .home-loading * {
    animation: none;
  }
}
#app .home-header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 30;
  width: 100%;
  min-height: 0;
  padding: 0;
  background: transparent;
}
#app .home-header :deep(.das-contact) {
  display: none;
}
.home-shortcuts-slot {
  position: absolute;
  left: 0;
  width: 100%;
  padding: 10px 0;
  background: #f3f7fd;
}
.legacy-shortcuts {
  position: relative;
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

#app .legacy-shortcuts .home-shortcuts-support {
  position: absolute;
  top: -32px;
  right: 8px;
  width: 140px;
  height: 72px;
  padding: 0;
}
.home-shortcuts-support img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
#app .podean-home .legacy-shortcuts h2 {
  font-size: 16px;
}
#app .podean-home .legacy-shortcuts__grid {
  margin-top: 22px;
  gap: 24px 8px;
}
#app .podean-home .legacy-shortcuts__grid button > span,
#app .podean-home .legacy-shortcuts__grid :deep(.das-icon) {
  width: 64px;
  height: 64px;
}
#app .podean-home .legacy-shortcuts__grid b {
  font-size: 14px;
}
@media (min-width: 768px) {
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
  .home-page,
  :global(html.das-home-document-scroll) {
    scroll-behavior: auto;
  }
}
</style>
