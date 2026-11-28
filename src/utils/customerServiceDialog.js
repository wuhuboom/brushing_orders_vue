export const CUSTOMER_SERVICE_DIALOG_EVENT = "dmk:open-customer-service";
// Existing deployment configs may omit this setting; keep support hidden by default.
export const CUSTOMER_SERVICE_ENABLED =
  globalThis.window?.g?.SHOW_CUSTOMER_SERVICE === true;

export const openCustomerServiceDialog = () => {
  if (!CUSTOMER_SERVICE_ENABLED) return;
  window.dispatchEvent(new CustomEvent(CUSTOMER_SERVICE_DIALOG_EVENT));
};
