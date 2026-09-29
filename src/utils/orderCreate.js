const BONUS_RESULT = "BONUS";
const ORDER_RESULT = "ORDER";

const ORDER_ERROR_KEYS = {
  500: "das.orderErrors.server",
  901: "das.orderErrors.tradeConfig",
  902: "das.orderErrors.outsideTradingHours",
  904: "das.orderErrors.userMissing",
  905: "das.orderErrors.accountRestricted",
  906: "das.orderErrors.minimumBalance",
  908: "das.orderErrors.busy",
  910: "das.orderErrors.invalidConfig",
  911: "das.orderErrors.noProduct",
  912: "das.orderErrors.invalidLevel",
  913: "das.orderErrors.orderMissing",
  914: "das.orderErrors.invalidUser",
  916: "das.orderErrors.insufficientBalance",
  918: "das.orderErrors.orderConflict",
  921: "das.orderErrors.bonusMissing",
  922: "das.orderErrors.bonusUnavailable",
  923: "das.orderErrors.invalidRequest",
};

const looksLikeBonus = (data = {}) =>
  data.orderNum !== undefined ||
  data.animationDuration !== undefined ||
  data.displayDuration !== undefined ||
  data.distributionType !== undefined;

export const parseCreateOrderResponse = (
  response,
  normalizeOrder = (value) => value,
) => {
  const data = response?.data ?? response ?? {};
  const explicitType = String(response?.resultType ?? "").toUpperCase();
  const resultType = [ORDER_RESULT, BONUS_RESULT].includes(explicitType)
    ? explicitType
    : looksLikeBonus(data)
      ? BONUS_RESULT
      : ORDER_RESULT;

  return {
    resultType,
    data: resultType === ORDER_RESULT ? normalizeOrder(data) : { ...data },
  };
};

export const getOrderErrorKey = (code) => ORDER_ERROR_KEYS[Number(code)] || "";

export const getOrderErrorMessage = (translate, error, fallbackKey) => {
  const key = getOrderErrorKey(error?.code);
  if (key) return translate(key);
  return (
    error?.msg ||
    error?.message ||
    translate(fallbackKey || "das.started.unableCreate")
  );
};
