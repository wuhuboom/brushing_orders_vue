// 只使用接口时间戳，格式与 Vue 18 充值记录一致，使用浏览器本地时区。
export function formatTime(v) {
  const timestamp = Number(v);
  if (!Number.isFinite(timestamp) || timestamp <= 0) return "—";
  const value = timestamp < 1e12 ? timestamp * 1000 : timestamp;
  const time = new Date(value);
  if (Number.isNaN(time.getTime())) return "—";
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
      .formatToParts(time)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value: part }) => [type, part]),
  );
  return `${parts.month}/${parts.day}/${parts.year} | ${parts.hour}:${parts.minute}:${parts.second} ${parts.dayPeriod}`;
}

// 返回当月的第一天和最后一天
export function useCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 注意：从 0 开始（0 是一月）

  // 获取当月第一天
  const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;

  // 获取当月最后一天（下个月的第 0 天）
  const lastDay = new Date(year, month + 1, 0).getDate();
  const end = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  return { start, end };
}
