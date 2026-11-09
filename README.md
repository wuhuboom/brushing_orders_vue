
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

## 按钮跳转地址

页面链接和业务跳转按钮使用 `public/config.js` 中的 `redirectUrl`，在当前页面跳转（首页 iframe 会跳转整个窗口）。菜单展开/收起、手机菜单、评价轮播、复制等本地操作保留原功能，不跳转；菜单内的具体页面链接仍使用配置地址。

```js
window.APP_CONFIG = {
  redirectUrl: "https://your-website.com/",
};
```

本地开发时修改 `public/config.js`，刷新页面即可生效。地址留空时，不执行跳转。

打包后配置文件位于 `dist/config.js`，线上可直接修改该文件并刷新页面，无需重新构建。再次打包前，请同步修改 `public/config.js`，以免覆盖线上配置。
