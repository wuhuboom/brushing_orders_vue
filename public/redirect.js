(function () {
  "use strict";

  var controls = 'a[href], [data-redirect]';

  function redirectUrl() {
    return (window.APP_CONFIG && window.APP_CONFIG.redirectUrl) || "";
  }

  function syncLinks() {
    var url = redirectUrl();
    document.querySelectorAll("a[href]:not([data-local-action])").forEach(function (link) {
      if (link.getAttribute("href") !== url) link.setAttribute("href", url);
      link.removeAttribute("target");
      link.removeAttribute("download");
    });
  }

  function redirect(event) {
    var control = event.target.closest && event.target.closest(controls);
    if (!control || control.hasAttribute("data-local-action") || control.disabled || (event.type === "auxclick" && event.button !== 1)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    var url = redirectUrl();
    if (url) window.top.location.assign(url);
  }

  document.addEventListener("click", redirect, true);
  document.addEventListener("auxclick", redirect, true);
  function init() {
    syncLinks();
    new MutationObserver(syncLinks).observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener("contextmenu", syncLinks, true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
