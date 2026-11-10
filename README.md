
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

本地开发使用 `public/config.js`，修改后刷新页面即可生效。

生产构建会排除 `public/config.js`，`dist/` 中不包含配置文件。页面仍读取与 `index.html` 同级的 `config.js`：首次部署时单独放置并修改该文件；后续更新保留服务器上的现有配置。线上修改配置后刷新页面即可生效，无需重新构建。

## 首页结构

首页由 `src/views/Home.vue` 直接渲染，页头和页脚位于 `src/components/HomeHeader.vue`、`HomeFooter.vue`，服务菜单共用 `src/content/services.js`。布局、字体、响应式样式和动画位于 `public/design500/home.css`，图片和视频位于 `public/design500/assets/`。
