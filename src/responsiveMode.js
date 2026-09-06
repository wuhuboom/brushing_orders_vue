const DEFAULT_PC_BREAKPOINT = 1024;
const RESPONSIVE_VISIBILITY_STYLE_ID = "dmk-responsive-visibility";

export const getPcBreakpoint = () => {
  const raw = window.g?.APP_PC_BREAKPOINT ?? DEFAULT_PC_BREAKPOINT;
  const value = Number.parseFloat(String(raw).replace(/px$/i, ""));
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_PC_BREAKPOINT;
};

export const installResponsiveMode = () => {
  const root = document.documentElement;
  const breakpoint = getPcBreakpoint();
  const h5MaxWidth = Math.max(0, breakpoint - 0.02);
  root.style.setProperty("--das-pc-breakpoint", `${breakpoint}px`);

  let visibilityStyle = document.getElementById(
    RESPONSIVE_VISIBILITY_STYLE_ID,
  );
  if (!visibilityStyle) {
    visibilityStyle = document.createElement("style");
    visibilityStyle.id = RESPONSIVE_VISIBILITY_STYLE_ID;
    document.head.appendChild(visibilityStyle);
  }
  visibilityStyle.textContent = `
    @media (min-width: ${breakpoint}px) {
      .dmk-pc-only { display: block !important; }
      .dmk-mobile-current, .dmk-h5-only { display: none !important; }
    }
    @media (max-width: ${h5MaxWidth}px) {
      .dmk-pc-only { display: none !important; }
    }
  `;

  const media = window.matchMedia(`(min-width: ${breakpoint}px)`);
  const apply = () => {
    const isPc = media.matches;
    root.classList.toggle("dmk-pc-mode", isPc);
    root.classList.toggle("dmk-h5-mode", !isPc);
    root.dataset.dmkMode = isPc ? "pc" : "h5";
  };

  apply();
  if (media.addEventListener) media.addEventListener("change", apply);
  else media.addListener?.(apply);
  window.addEventListener("resize", apply, { passive: true });
  window.visualViewport?.addEventListener("resize", apply, { passive: true });
  return { breakpoint, media };
};
