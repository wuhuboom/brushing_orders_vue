// Keep the captured page's reveal, video and testimonial behavior.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reveals = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-revealed");
      reveals.unobserve(entry.target);
    }
  },
  { rootMargin: "0px 0px -5% 0px", threshold: 0 },
);

document.querySelectorAll("[data-reveal]:not([data-load])").forEach((element) => {
  if (reducedMotion) element.classList.add("is-revealed");
  else reveals.observe(element);
});

const heroVideo = document.querySelector(".home-module__8Ob5sq__heroVideo video");
if (!navigator.connection?.saveData) {
  const playHero = () => {
    window.setTimeout(() => {
      heroVideo.muted = true;
      heroVideo.play().catch(() => {});
    }, 250);
  };
  if (document.readyState === "complete") playHero();
  else window.addEventListener("load", playHero, { once: true });
}

document.querySelectorAll(".HoverVideo-module__0J-oWW__wrap").forEach((wrapper) => {
  const video = wrapper.querySelector("video");
  video.muted = true;
  wrapper.addEventListener("mouseenter", () => video.play().catch(() => {}));
  video.addEventListener("playing", () => {
    wrapper.dataset.playing = "true";
  });
  wrapper.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
    delete wrapper.dataset.playing;
  });
});

const track = document.querySelector(".Testimonials-module__X7R5sW__track");
const slides = [...track.children];
const previous = document.querySelector('[aria-label="Previous testimonial"]');
const next = document.querySelector('[aria-label="Next testimonial"]');
let activeSlide = 0;

const changeSlide = (direction) => {
  activeSlide = Math.max(0, Math.min(slides.length - 1, activeSlide + direction));
  track.style.transform = `translateX(-${100 * activeSlide}%)`;
  slides.forEach((slide, index) => {
    slide.setAttribute("aria-hidden", String(index !== activeSlide));
  });
  previous.disabled = activeSlide === 0;
  next.disabled = activeSlide === slides.length - 1;
};

previous.addEventListener("click", () => changeSlide(-1));
next.addEventListener("click", () => changeSlide(1));
