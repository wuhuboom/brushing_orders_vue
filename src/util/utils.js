import { ElMessage } from "element-plus";
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
    // 提取文件名，包括扩展名
    const fileName = path.split("/").pop();
    return fileName === image;
  });
  // console.log('imagePath', images[imagePath]);
  // 调用函数并处理Promise以获取模块对象，然后返回默认导出
  return imagePath ? images[imagePath].default : null;
};

export const copyContent = (content) => {
  const input = document.createElement("input");
  input.value = content;
  document.body.appendChild(input);
  input.select();
  // 使用 Clipboard API 的 writeText 方法复制文本
  navigator.clipboard
    .writeText(input.value)
    .then(() => {
      console.log(i18n);
      ElMessage.success(i18n.global.t("复制成功"));
    })
    .catch((err) => {
      ElMessage.success(i18n.global.t("复制失败"));
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

// 计算涨幅
export const calculateRise = (newPrice, oldPrice) => {
  return BigNumber(newPrice).minus(oldPrice).div(oldPrice).toFixed(4);
};

// 将成交量转换为K,M,G
export const formatVolume = (volume) => {
  volume = +volume;
  if (volume < 1000) {
    return BigNumber(volume).toFixed(2);
  } else if (volume < 1000000) {
    // console.log(BigNumber(volume).toString(2) + "K");
    return BigNumber(volume).div(1000).toFixed(2) + "K";
  } else if (volume < 1000000000) {
    return BigNumber(volume).div(1000000).toFixed(2) + "M";
  } else {
    return BigNumber(volume).div(1000000000).toFixed(2) + "G";
  }
};

/**
 *  计算预估强平价 预估强平价  =  开仓均价 - 保证金 / （仓位数量*杠杆 / 基础货币价格）10 50000 0.5  45025 54975
 * @param {*} side 开仓类型 1:开多 2:开空
 * @param {*} lever 杠杆倍数
 * @param {*} price 开仓均价
 * @param {*} rate 保证金率
 * @returns
 */
export const calculateLiquidation = (side, lever, price, rate, fixed) => {
  rate = rate / 100;
  if (side === 1) {
    return BigNumber(price)
      .times(
        BigNumber(1)
          .minus(BigNumber(1).div(lever))
          .plus(BigNumber(rate).div(lever))
      )
      .toFixed(fixed);
  } else {
    return BigNumber(price)
      .times(
        BigNumber(1)
          .plus(BigNumber(1).div(lever))
          .minus(BigNumber(rate).div(lever))
      )
      .toFixed(fixed);
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

  // 拿到 parts（数组形式，每个部分拆开）
  const parts = new Intl.DateTimeFormat("zh-CN", options).formatToParts(new Date(timestamp));
  const get = (type) => parts.find(p => p.type === type)?.value || "";

  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
};

