const DEFAULT_PC_BREAKPOINT = 1024;

export const getPcBreakpoint = () => {
  const raw = window.g?.APP_PC_BREAKPOINT ?? DEFAULT_PC_BREAKPOINT;
  const value = Number.parseFloat(String(raw).replace(/px$/i, ""));
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_PC_BREAKPOINT;
};

export const installResponsiveMode = () => {
  const root = document.documentElement;
  const breakpoint = getPcBreakpoint();
  root.style.setProperty("--das-pc-breakpoint", `${breakpoint}px`);

  const media = window.matchMedia(`(min-width: ${breakpoint}px)`);
  const apply = () => {
    const isPc = media.matches;
    root.classList.toggle("dmk-pc-mode", isPc);
    root.classList.toggle("dmk-h5-mode", !isPc);
    root.dataset.dmkMode = isPc ? "pc" : "h5";
  };

  apply();
  media.addEventListener?.("change", apply);
  return { breakpoint, media };
};
