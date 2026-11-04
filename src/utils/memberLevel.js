const hasValue = (value) =>
  value !== undefined && value !== null && value !== "";

const formatNumber = (value, maximumFractionDigits = 2) => {
  if (!hasValue(value) || !Number.isFinite(Number(value))) return "—";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(Number(value));
};

const formatPercentage = (value) => {
  const formatted = formatNumber(value);
  return formatted === "—" ? formatted : `${formatted}%`;
};

const decodeHtmlEntities = (value) =>
  value.replace(
    /&(#(?:x[0-9a-f]+|\d+)|amp|lt|gt|quot|apos|nbsp);/gi,
    (entity, name) => {
      const normalized = name.toLowerCase();
      const namedEntities = {
        amp: "&",
        lt: "<",
        gt: ">",
        quot: '"',
        apos: "'",
        nbsp: " ",
      };
      if (namedEntities[normalized]) return namedEntities[normalized];

      const isHex = normalized.startsWith("#x");
      const codePoint = Number.parseInt(
        normalized.slice(isHex ? 2 : 1),
        isHex ? 16 : 10,
      );
      return Number.isFinite(codePoint) && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : entity;
    },
  );

const htmlToPlainText = (value) =>
  decodeHtmlEntities(
    value
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
      .replace(/<[^>]*>/g, ""),
  )
    .replace(/\s+/g, " ")
    .trim();

export const getMemberLevelDescriptionLines = (description) => {
  if (!hasValue(description)) return [];

  const source = String(description);
  const paragraphs = Array.from(
    source.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi),
    (match) => match[1],
  );
  const blocks = paragraphs.length
    ? paragraphs
    : source.split(/<br\s*\/?\s*>/i);

  return blocks.map(htmlToPlainText).filter(Boolean);
};

export const getMemberLevelMetrics = (level = {}) => ({
  price: hasValue(level.price)
    ? `${formatNumber(level.price)} USD`
    : hasValue(level.minBalance)
      ? `${formatNumber(level.minBalance)} USD`
      : "—",
  dataPerSet: formatNumber(level.orderCountPerDay, 0),
  profitPerTransaction: formatPercentage(level.minCommissionRate),
  mergedProfit: formatPercentage(level.maxContinuousCommissionRate),
  tasksPerDay: formatNumber(level.taskCountPerDay, 0),
});

const memberLevelKeys = (value = {}) =>
  [
    value.id,
    value.level,
    value.levelId,
    value.vipId,
    value.userLevel?.id,
    value.userLevel?.level,
    value.memberLevel?.id,
    value.memberLevel?.level,
  ]
    .filter(hasValue)
    .map(String);

export const memberLevelMatchesUser = (level = {}, user = {}) => {
  const userKeys = new Set(memberLevelKeys(user));
  return memberLevelKeys(level).some((key) => userKeys.has(key));
};
