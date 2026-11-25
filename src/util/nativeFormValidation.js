const disableForForm = (form) => {
  if (!(form instanceof HTMLFormElement)) return;
  form.noValidate = true;
};

const disableInTree = (node) => {
  if (!(node instanceof Element)) return;

  if (node.matches("form")) disableForForm(node);
  node.querySelectorAll?.("form").forEach(disableForForm);
};

export const installNativeFormValidationGuard = () => {
  if (
    typeof document === "undefined" ||
    typeof Element === "undefined" ||
    typeof HTMLFormElement === "undefined" ||
    typeof MutationObserver === "undefined"
  ) {
    return () => {};
  }

  const preventNativeInvalidUi = (event) => event.preventDefault();
  document.addEventListener("invalid", preventNativeInvalidUi, true);

  document.querySelectorAll("form").forEach(disableForForm);

  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach(disableInTree);
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  return () => {
    observer.disconnect();
    document.removeEventListener("invalid", preventNativeInvalidUi, true);
  };
};
