export function initializeHomeAnimations(root) {
  const { SplitType, gsap, ScrollTrigger } = window;
  const typeSplit = new SplitType(root.querySelectorAll("[text-split]"), {
    types: "words, chars",
    tagName: "span",
  });

  const context = gsap.context(() => {
    function playOnScroll(element, timeline) {
      ScrollTrigger.create({
        trigger: element,
        start: "top bottom",
        onLeaveBack: () => {
          timeline.progress(0);
          timeline.pause();
        },
      });
      ScrollTrigger.create({
        trigger: element,
        start: "top 60%",
        onEnter: () => timeline.play(),
      });
    }

    root.querySelectorAll("[words-slide-from-right]").forEach((element) => {
      const timeline = gsap.timeline({ paused: true });
      timeline.from(element.querySelectorAll(".word"), {
        opacity: 0,
        x: "1em",
        duration: 0.6,
        ease: "power2.out",
        stagger: { amount: 0.2 },
      });
      playOnScroll(element, timeline);
    });

    root.querySelectorAll("[letters-fade-in]").forEach((element) => {
      const timeline = gsap.timeline({ paused: true });
      timeline.from(element.querySelectorAll(".char"), {
        opacity: 0,
        duration: 0.2,
        ease: "power1.out",
        stagger: { amount: 0.8 },
      });
      playOnScroll(element, timeline);
    });

    gsap.set(root.querySelectorAll("[text-split]"), { opacity: 1 });
  }, root);

  const runtime = document.createElement("script");
  runtime.src = process.env.BASE_URL + "poetic/assets/poetic-2024.4d712066.2864305aa55dc348.js";
  document.body.appendChild(runtime);

  return () => {
    context.revert();
    typeSplit.revert();
    if (window.Webflow && window.Webflow.destroy) window.Webflow.destroy();
    runtime.remove();
  };
}
