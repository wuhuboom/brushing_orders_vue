// 将时间戳格式化，时间戳十位或13位，默认 yyyy-MM-dd hh:mm:ss
export function formatTime(time, format = "yyyy-MM-dd hh:mm:ss") {
  if (time === undefined || time === null || time === "") return "";
  const raw = String(time).trim();
  if (/^\d{10}$/.test(raw)) time = Number(raw) * 1000;
  else if (/^\d{13}$/.test(raw)) time = Number(raw);
  const date = new Date(time);
  if (Number.isNaN(date.getTime())) return raw;
  const obj = {
    yyyy: date.getFullYear(),
    MM: date.getMonth() + 1,
    dd: date.getDate(),
    hh: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds(),
  };
  return format.replace(/(yyyy|MM|dd|hh|mm|ss)+/g, (result, key) => {
    return obj[key] < 10 ? "0" + obj[key] : obj[key];
  });
}

const dateTimeOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
};
const usDateTime = new Intl.DateTimeFormat("en-US", dateTimeOptions);

export function parseDateTime(value) {
  if (typeof value !== "number" && typeof value !== "string")
    return new Date(NaN);
  const text = String(value).trim();
  if (!/^\d+$/.test(text)) return new Date(NaN);
  const timestamp = Number(text);
  return new Date(
    timestamp > 0 ? timestamp * (timestamp < 1e12 ? 1000 : 1) : NaN,
  );
}

export function formatDateTime(value, timeZone) {
  const date = parseDateTime(value);
  if (!Number.isFinite(date.getTime())) return "—";
  const formatter = timeZone
    ? new Intl.DateTimeFormat("en-US", { ...dateTimeOptions, timeZone })
    : usDateTime;
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map(({ type, value: part }) => [type, part]),
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

export function formatWorkTime(value) {
  const text = String(value ?? "").trim();
  if (/^\d{10}$|^\d{13}$/.test(text)) return formatTime(text, "hh:mm");
  const clock = text.match(/(?:^|T|\s)(\d{1,2}):(\d{2})/);
  if (clock) return `${clock[1].padStart(2, "0")}:${clock[2]}`;
  return /^\d{1,2}$/.test(text) ? `${text.padStart(2, "0")}:00` : "";
}
