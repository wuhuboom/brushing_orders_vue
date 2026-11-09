const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      element.classList.remove("animate-in", "group-animate-in", "pix-waiting");
      element.classList.add("pix-animate", "animated");
      if (element.classList.contains("wpb_animate_when_almost_visible")) {
        element.classList.add("wpb_start_animation");
      }
      revealObserver.unobserve(element);
    }
  },
  { threshold: 0.05 },
);

document
  .querySelectorAll(
    ".animate-in, .group-animate-in, .wpb_animate_when_almost_visible",
  )
  .forEach((element) => {
    revealObserver.observe(element);
  });

customElements.whenDefined("lottie-player").then(() => {
  const animationObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const player = entry.target;
      player.play();
      animationObserver.unobserve(player);
    }
  });
  document.querySelectorAll("lottie-player").forEach((player) => {
    player.addEventListener("ready", () => animationObserver.observe(player), {
      once: true,
    });
  });
});

document.querySelectorAll('[data-toggle="pill"]').forEach((tab) => {
  tab.setAttribute("aria-selected", String(tab.classList.contains("active")));
  tab.addEventListener("click", (event) => {
    event.preventDefault();
    const tabs = tab.closest('[role="tablist"]');
    const target = document.getElementById(tab.getAttribute("href").slice(1));
    tabs.querySelectorAll('[role="tab"]').forEach((item) => {
      item.classList.toggle("active", item === tab);
      item.setAttribute("aria-selected", String(item === tab));
    });
    target.parentElement.querySelectorAll(".tab-pane").forEach((pane) => {
      pane.classList.toggle("active", pane === target);
      pane.classList.toggle("show", pane === target);
    });
  });
});

const backToTop = document.querySelector(".back_to_top");
const hero = document.querySelector(".vc_parallax");
const heroBackground = hero.querySelector(".vc_parallax-inner");
const updateScroll = () => {
  backToTop.classList.toggle("active", window.scrollY > 300);
  heroBackground.style.transform = `translateY(${Math.min(window.scrollY, hero.offsetHeight) / 3}px)`;
};
window.addEventListener("scroll", updateScroll, { passive: true });
backToTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);
updateScroll();
