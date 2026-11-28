const mexicoDateTime = new Intl.DateTimeFormat("es-MX", {
  timeZone: "America/Mexico_City",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

// 支持秒、毫秒时间戳；统一显示墨西哥城时间和日/月/年格式。
export function formatTime(time, format = "dd/MM/yyyy hh:mm:ss") {
  if (time === undefined || time === null || time === "") return "";
  const raw = String(time).trim();
  if (/^\d{10}$/.test(raw)) time = Number(raw) * 1000;
  else if (/^\d{13}$/.test(raw)) time = Number(raw);
  const date = new Date(time);
  if (Number.isNaN(date.getTime())) return raw;
  const parts = Object.fromEntries(
    mexicoDateTime.formatToParts(date).map(({ type, value }) => [type, value]),
  );
  const obj = {
    yyyy: parts.year,
    MM: parts.month,
    dd: parts.day,
    hh: parts.hour,
    mm: parts.minute,
    ss: parts.second,
  };
  return format.replace(/yyyy|MM|dd|hh|mm|ss/g, (key) => obj[key]);
}

// 返回当月的第一天和最后一天
export function useCurrentMonthRange() {
  const [year, month] = formatTime(Date.now(), "yyyy-MM").split("-").map(Number);

  // 获取当月第一天
  const start = `${year}-${String(month).padStart(2, "0")}-01`;

  // 获取当月最后一天（下个月的第 0 天）
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  return { start, end };
}
