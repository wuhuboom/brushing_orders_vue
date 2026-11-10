
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

页面链接、业务跳转按钮和社交图标在点击时读取当前页面 URL，在完整域名前加上 `work.`，保留协议和端口，跳转到新域名的首页，无需配置跳转地址。域名开头始终只保留一个 `work.`，已有的重复前缀会合并；`www` 等其他子域名会保留。

```text
https://www.google.com/ → https://work.www.google.com/
https://example.com/campaign/#/ → https://work.example.com/
http://work.work.work.localhost:8081/#/ → http://work.localhost:8081/
```

菜单展开/收起、手机菜单、评价轮播等本地操作保留原功能，不跳转；菜单内的具体页面链接遵循上述域名跳转规则。

## 首页联系方式

首页页脚的邮箱、电话、办公地址和办公城市统一读取 `public/config.js` 中的 `contact`：

```js
contact: {
  email: "hello@500designs.com",
  phone: "+1 949 520 6771",
  address: "400 Spectrum Center Drive, Suite 1900, Irvine, California",
  locations: ["Irvine", "San Francisco"],
}
```

修改后刷新页面即可生效；线上可直接修改 `dist/config.js`，无需重新构建。再次打包前，请同步修改 `public/config.js`，以免覆盖线上配置。联系方式和社交图标的点击跳转遵循上述域名跳转规则。

## 首页结构

首页由 `src/views/Home.vue` 直接渲染，页头和页脚位于 `src/components/HomeHeader.vue`、`HomeFooter.vue`，服务菜单共用 `src/content/services.js`。布局、字体、响应式样式和动画位于 `public/design500/home.css`，图片和视频位于 `public/design500/assets/`。
