# World of Good

按提供的 PC PDF 设计稿实现的 Vue 2 静态网站，包含 Home 和 About Us。

## 运行

```sh
npm install
npm run serve
```

## 检查和构建

```sh
npm run lint -- --no-fix
npm run build
```

构建产物位于 `dist/`，可部署在网站根目录或子目录，使用 hash 路由。

- Home：`/#/`
- About Us：`/#/about`
- 页面、图片和字体均使用本地文件，不请求后端接口。
- 按要求不包含 Continue on Mobile 弹窗。
- 图片、标识来自提供的设计稿及同款已有素材；本地字体许可证保存在 `src/assets/fonts/`。

## 按钮跳转地址

Contact Us 和头像共用 `public/config.js` 中的 `redirectUrl`，在当前页面跳转：

```js
window.APP_CONFIG = {
  redirectUrl: "https://your-website.com/",
};
```

本地开发时修改 `public/config.js`，刷新页面即可生效。地址留空时，两个按钮不可点击。

打包后配置文件位于 `dist/config.js`，线上可直接修改该文件并刷新页面，无需重新构建。再次打包前，请同步修改 `public/config.js`，以免覆盖线上配置。
