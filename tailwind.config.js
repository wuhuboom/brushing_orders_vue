// tailwind.config.js
module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	darkMode: "selector", // or 'media' or 'class'
	theme: {
		extend: {
			lineHeight: {
				2.5: "0.625rem",
				4.5: "1.125rem",
			},
			width: {
				300: "75rem",
				114: "28.5rem",
				108: "27rem",
				100: "25rem",
				50: "12.5rem",
				22: "5.5rem",
				21: "5.25rem",
			},
			height: {
				4.5: "1.125rem",
				5.5: "1.375rem",
				7.5: "1.875rem",
				17.5: "4.375rem",
				120: "30rem",
			},
			fontSize: {
				8: [
					"2rem",
					{
						lineHeight: "1",
					},
				],
				10: [
					"0.625rem",
					{
						lineHeight: "1",
					},
				],
				14: [
					"3.5rem",
					{
						lineHeight: "1",
					},
				],
				5.5: [
					"1.375rem",
					{
						lineHeight: "1",
					},
				],

			},
			lineHeight: {
				20: "5rem",
			},
			colors: {
				bar: "#2C48C6",
				unBar: "#BDC0CF",
				up: "#16D148",
				down: "#EF2C2C",
				main: "#22242D",// 文字主要颜色
				secondary: "#80849D",// 文字次要颜色
				tips: "#999999",// 文字提示颜色
				disabled: "#CCCCCC",// 文字不可用颜色
				title: "#2C48C6",// 标题颜色
				line: "#E5E5E5",// 分割线颜色
			},
			gap: {
				22: "5.5rem",
			},
			gridTemplateRows: {
				17: "repeat(17, minmax(0, 1fr))",
			},
			gridRow: {
				"span-16": "span 16 / span 16",
			},
			spacing: {
				'0.5': '0.125rem',
				'7.5': '1.875rem',
			},
			borderRadius: {
				'2.5': '0.625rem',
			},
		},
	},
	variants: {},
	plugins: [],
};
