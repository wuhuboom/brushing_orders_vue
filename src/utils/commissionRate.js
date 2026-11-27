import BigNumber from "bignumber.js";

export const formatCommissionRate = (commission, price) => {
    if ([commission, price].some((value) => value === undefined || value === null || value === "")) {
        return "—";
    }

    const amount = new BigNumber(commission);
    const productPrice = new BigNumber(price);
    if (!amount.isFinite() || !productPrice.isFinite() || productPrice.lte(0)) {
        return "—";
    }

    return `${amount.dividedBy(productPrice).times(100).decimalPlaces(2, BigNumber.ROUND_HALF_UP).toFixed()}%`;
};
