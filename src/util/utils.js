import { showFailToast, showInviteCopySuccessToast } from "@/util/message";
import i18n from "@/i18n";
import BigNumber from "bignumber.js";
const imageBaseUrl = "";
// 动态导入图片
const images = import.meta.glob("../static/images/*", { eager: true });

export const getStaticImageUrl = (image) => {
  // console.log('imageBaseUrl', images, image);
  // 如果imageBaseUrl为空，直接使用相对路径
  if (imageBaseUrl !== "") return `/static/images/${image}`;
  // 使用image参数查找路径，确保精确匹配文件名
  const imagePath = Object.keys(images).find((path) => {
    // withdraw文件名，包括扩展名
    const fileName = path.split("/").pop();
    return fileName === image;
  });
  // console.log('imagePath', images[imagePath]);
  // 调用函数并处理Promise以获取模块对象，然后back默认导出
  return imagePath ? images[imagePath].default : null;
};

export const copyContent = (content, options = {}) => {
  const input = document.createElement("input");
  input.value = content;
  document.body.appendChild(input);
  input.select();
  // 使用 Clipboard API 的 writeText 方法copy文本
  navigator.clipboard
    .writeText(input.value)
    .then(() => {
      console.log(i18n);
      showInviteCopySuccessToast({
        message: i18n.global.t("copied_successfully"),
        duration: options.duration,
      });
    })
    .catch((err) => {
      showFailToast({
        message: i18n.global.t("copy_failed"),
        class: options.failClass,
      });
    });

  document.body.removeChild(input);
};

const imageUrl = "https://api.cfiox.com";
export const getImageUrl = (url) => {
  return imageUrl + url;
};

export const getTextColor = (value) => {
  if (value === undefined || !value) return "text-[#666666]";
  if (Number(value) > 0) {
    return "text-[#2FA766]";
  } else {
    return "text-[#E2464A]";
  }
};

export const getBgColor = (value) => {
  if (value === undefined || !value) return "bg-[#666666]";
  if (value > 0) {
    return "bg-[#2FA766]";
  } else {
    return "bg-[#E2464A]";
  }
};

export const formatPhoneNumber = (input) => {
  // 去除空格
  let raw = input.replace(/\s+/g, "");

  // 拆出 + 国际码
  let prefix = "";
  if (raw.startsWith("+")) {
    const match = raw.match(/^\+\d{1,3}/); // 匹配 +1、+86 等
    if (match) {
      prefix = match[0];
      raw = raw.slice(prefix.length);
    }
  }

  // 格式化为 3-3-4-4 分组
  const groups = [];
  if (raw.length > 0) groups.push(raw.slice(0, 3));
  if (raw.length > 3) groups.push(raw.slice(3, 6));
  if (raw.length > 6) groups.push(raw.slice(6, 10));
  if (raw.length > 10) groups.push(raw.slice(10, 14));

  return (prefix ? prefix + " " : "") + groups.join(" ");
};

export const formatWithTimezone = (timestamp, tzName) => {
  const options = {
    timeZone: tzName,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  let parts;
  try {
    parts = new Intl.DateTimeFormat("zh-CN", options).formatToParts(new Date(timestamp));
  } catch (err) {
    console.warn(`[formatWithTimezone] Invalid timezone: ${tzName}`);
    return ""; // ❌ 时区非法，直接back空字符串
  }

  const get = (type) => parts.find(p => p.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
};

// service工作时间
// export const checkWorkTimeLocal = (workTimeStart, workTimeEnd) => {
//   const now = new Date();

//   // 本地当前小时和分钟
//   const hours = now.getHours();
//   const minutes = now.getMinutes();
//   const currentHM = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

//   // 转分钟数方便比较
//   const toMinutes = (hm) => {
//     const [h, m] = hm.split(":").map(Number);
//     return h * 60 + m;
//   };

//   const nowMinutes = toMinutes(currentHM);
//   const startMinutes = toMinutes(workTimeStart);
//   const endMinutes = toMinutes(workTimeEnd);

//   if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
//     return true;
//   } else {
//     return false
//   }
// };

// service工作时间校验（根据后台时区，兜底本地时间）
export const checkWorkTimeLocal = (workTimeStart, workTimeEnd, tzName) => {
  let hours, minutes;

  try {
    const formatter = new Intl.DateTimeFormat("zh-CN", {
      timeZone: tzName || Intl.DateTimeFormat().resolvedOptions().timeZone, // 没有back就用本地时区
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(new Date());
    hours = parts.find((p) => p.type === "hour").value;
    minutes = parts.find((p) => p.type === "minute").value;
  } catch (err) {
    console.warn(`[checkWorkTimeWithTimezone] 无效时区 ${tzName}，回退到本地时间`);
    const now = new Date();
    hours = String(now.getHours()).padStart(2, "0");
    minutes = String(now.getMinutes()).padStart(2, "0");
  }

  const currentHM = `${hours}:${minutes}`;

  // 转换成分钟方便比较
  const toMinutes = (hm) => {
    const [h, m] = hm.split(":").map(Number);
    return h * 60 + m;
  };

  const nowMinutes = toMinutes(currentHM);
  const startMinutes = toMinutes(workTimeStart);
  const endMinutes = toMinutes(workTimeEnd);

  return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
};

