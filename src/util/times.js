// 将时间戳格式化，时间戳十位或13位，默认 yyyy-MM-dd hh:mm:ss
export function formatTime(time, format = "yyyy-MM-dd hh:mm:ss") {
	if (!time) return "";
    if (time.toString().length === 10) {
        time = time * 1000;
    }
	let date = new Date(time);
	let obj = {
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

// 返回当月的第一天和最后一天
export function useCurrentMonthRange() {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth(); // 注意：从 0 开始（0 是一月）
  
	// 获取当月第一天
	const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  
	// 获取当月最后一天（下个月的第 0 天）
	const lastDay = new Date(year, month + 1, 0).getDate();
	const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  
	return { start, end };
  }