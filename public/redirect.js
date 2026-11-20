(function () {
  "use strict";

  var controls = 'a[href], [data-redirect]';

  function workUrl() {
    var host = window.location.host.replace(/^(?:(?:work|www)\.)+/i, "");
    return window.location.protocol + "//work." + host + "/";
  }

  function syncLinks() {
    var url = workUrl();
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
    var url = workUrl();
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
