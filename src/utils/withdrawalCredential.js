const STORAGE_KEY = "dasWithdrawalToken";
let withdrawalCredential = "";

export const setWithdrawalCredential = (value) => {
  withdrawalCredential = String(value || "").trim();
  if (typeof sessionStorage !== "undefined") {
    if (withdrawalCredential) {
      sessionStorage.setItem(STORAGE_KEY, withdrawalCredential);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }
  return withdrawalCredential;
};

export const getWithdrawalCredential = () => {
  if (!withdrawalCredential && typeof sessionStorage !== "undefined") {
    withdrawalCredential = String(sessionStorage.getItem(STORAGE_KEY) || "").trim();
  }
  return withdrawalCredential;
};

export const clearWithdrawalCredential = () => {
  withdrawalCredential = "";
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
  }
};
