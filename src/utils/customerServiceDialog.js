export const CUSTOMER_SERVICE_DIALOG_EVENT = "dmk:open-customer-service";

export const openCustomerServiceDialog = () => {
  window.dispatchEvent(new CustomEvent(CUSTOMER_SERVICE_DIALOG_EVENT));
};
