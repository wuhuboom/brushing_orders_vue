export function formatOrderProfitRate(order, { signed = false } = {}) {
  const value = [order.rebatePercentage, order.profitRate]
    .find((rate) => rate != null && String(rate).trim() !== "");
  if (value == null) return "—";
  const rate = Number(String(value).trim().replace(/%$/, ""));
  if (!Number.isFinite(rate)) return "—";
  return signed
    ? `${rate > 0 ? "+" : ""}${rate.toFixed(2)}%`
    : `${rate}%`;
}
