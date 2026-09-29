/* Visual behavior from the supplied Podean page; application navigation stays in Vue. */
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const services = $("#hs_cos_wrapper_widget_1726833909953 .c-slider");
services.slick({
  infinite: true,
  adaptiveHeight: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: false,
  speed: 700,
  dots: true,
  responsive: [
    { breakpoint: 992, settings: { slidesToShow: 1, arrows: false } },
  ],
});
$("#hs_cos_wrapper_module_1727333321459 .c-slider").slick({
  infinite: true,
  adaptiveHeight: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: !reducedMotion,
  autoplaySpeed: 2000,
  speed: 590,
  dots: true,
  responsive: [
    { breakpoint: 992, settings: { slidesToShow: 1, arrows: false } },
  ],
});
for (const [id, count] of [
  ["widget_1726838177610", 6],
  ["module_1728613232268", 7],
]) {
  $("#hs_cos_wrapper_" + id + " .scrolling-logos").slick({
    dots: false,
    infinite: true,
    autoplay: !reducedMotion,
    autoplaySpeed: 0,
    speed: 4000,
    cssEase: "linear",
    adaptiveHeight: true,
    slidesToShow: count,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 5, arrows: false } },
      { breakpoint: 575, settings: { slidesToShow: 4, arrows: false } },
    ],
  });
}
const content = document.querySelector(".body-wrapper");
const shortcuts = document.getElementById("amplava-shortcuts-slot");
let pendingFrame;
let firstPaintReady = false;
function reportLayout() {
  cancelAnimationFrame(pendingFrame);
  pendingFrame = requestAnimationFrame(() => {
    parent.postMessage(
      {
        type: "podean-layout",
        ready: firstPaintReady,
        height: Math.ceil(content.getBoundingClientRect().height),
        shortcutsY: shortcuts.getBoundingClientRect().top + window.scrollY,
      },
      location.origin,
    );
  });
}
new ResizeObserver(reportLayout).observe(content);
window.addEventListener("message", (event) => {
  if (event.source !== parent || event.origin !== location.origin) return;
  if (
    event.data?.type !== "amplava-shortcuts-size" ||
    !Number.isFinite(event.data.height)
  )
    return;
  shortcuts.style.height = event.data.height + "px";
});
const heroArt = new Image();
heroArt.src = "assets/1120414178-Hero.svg";
Promise.all([document.fonts.ready, heroArt.decode().catch(() => {})]).then(
  () => {
    firstPaintReady = true;
    $(".slick-initialized").slick("setPosition");
    reportLayout();
  },
);
window.addEventListener("load", reportLayout);
document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  const url = new URL(link.href, location.href);
  if (
    url.hostname === "podean.com" &&
    url.pathname.replace(/\/$/, "") === "/contact"
  ) {
    event.preventDefault();
    parent.postMessage({ type: "amplava-contact" }, location.origin);
  }
});
// Open reference-only resources separately so they cannot replace the embedded homepage.
for (const link of document.querySelectorAll('a[href^="https:"]')) {
  link.target = "_blank";
  link.rel = "noopener noreferrer";
}
document.addEventListener("visibilitychange", () => {
  $(".slick-initialized").each(function () {
    const slider = $(this);
    if (document.hidden) slider.slick("slickPause");
    else if (!reducedMotion && slider.slick("getSlick").options.autoplay)
      slider.slick("slickPlay");
  });
});

// Copied marketing forms use the existing support flow; no third-party form API is added.
document.addEventListener("submit", (event) => {
  event.preventDefault();
  parent.postMessage({ type: "amplava-contact" }, location.origin);
});

// The reference requests autoplay and looping but hides the player's controls.
// Keep its autoplay attempt, with explicit play/pause and a loading indicator.
const mapPlayer = document.querySelector(".podean-map-player");
const mapVideo = mapPlayer.querySelector("video");
const mapToggle = mapPlayer.querySelector("button");
const mapLoading = mapPlayer.querySelector(".podean-map-loading");
function updateMapPlayer() {
  const loading = !mapVideo.error && mapVideo.readyState < 3;
  const playing = !mapVideo.paused && !mapVideo.ended;
  mapPlayer.classList.toggle("is-loading", loading);
  mapPlayer.classList.toggle("is-playing", playing);
  mapPlayer.setAttribute("aria-busy", String(loading));
  mapLoading.setAttribute("aria-hidden", String(!loading));
  mapToggle.disabled = loading;
  const label = playing ? "Pause video" : "Play video";
  mapToggle.setAttribute("aria-label", label);
  mapToggle.title = playing ? "" : label;
}
async function playMapVideo() {
  try {
    await mapVideo.play();
  } catch {
    /* Autoplay restrictions leave the manual play button available. */
  }
  updateMapPlayer();
}
function toggleMapVideo() {
  if (mapVideo.paused) playMapVideo();
  else mapVideo.pause();
}
mapToggle.addEventListener("click", toggleMapVideo);
mapVideo.addEventListener("click", toggleMapVideo);
for (const event of [
  "loadstart",
  "loadeddata",
  "canplay",
  "waiting",
  "play",
  "pause",
  "ended",
  "error",
]) {
  mapVideo.addEventListener(event, updateMapPlayer);
}
mapVideo.addEventListener("playing", () => {
  mapPlayer.classList.add("has-played");
  updateMapPlayer();
});
updateMapPlayer();
if (!reducedMotion) playMapVideo();
