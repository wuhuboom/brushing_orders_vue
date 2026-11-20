let withdrawalCredential = "";

export const setWithdrawalCredential = (value) => {
  withdrawalCredential = String(value || "").trim();
  return withdrawalCredential;
};

export const getWithdrawalCredential = () => withdrawalCredential;

export const clearWithdrawalCredential = () => {
  withdrawalCredential = "";
};

