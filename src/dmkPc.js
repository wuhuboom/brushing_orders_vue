import { getPcBreakpoint } from "./responsiveMode";

const CSS_FILES = [
  "dmk-base.css",
  "scroll-marquee.css",
  "home.css",
  "language-popup.css",
  "login.css",
  "register.css",
  "vant-pull-refresh.css",
  "vant-swipe.css",
  "vant-tabs.css",
  "vant-image.css",
  "vant-rate.css",
  "vant-circle.css",
  "vant-image-preview.css",
  "update-transaction-password.css",
  "update-password.css",
  "withdraw.css",
  "payment-methods.css",
  "deposit.css",
  "vips.css",
  "faqs.css",
  "info.css",
  "vant-nav-bar.css",
  "check-in.css",
];

export const installDmkPcStyles = () => {
  const breakpoint = getPcBreakpoint();
  CSS_FILES.forEach((file) => {
    const id = `dmk-pc-css-${file}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `/dmk/css/${file}`;
    link.media = `(min-width: ${breakpoint}px)`;
    document.head.appendChild(link);
  });
};
