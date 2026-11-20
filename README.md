
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

首页页脚的邮箱和办公城市读取 `public/config.js` 中的 `contact`。未配置时显示参考首页的默认文案：

```js
contact: {
  email: "websites@wester.media",
  locations: ["Humboldt, Iowa"],
}
```

本地开发使用 `public/config.js`，修改后刷新页面即可生效。

生产构建会排除 `public/config.js`，`dist/` 中不包含配置文件。页面仍读取与 `index.html` 同级的 `config.js`：首次部署时单独放置并修改该文件；后续更新保留服务器上的现有配置。线上修改配置后刷新页面即可生效，无需重新构建。

## 首页结构

首页由 `src/views/Home.vue` 直接渲染，页头和页脚位于 `src/components/HomeHeader.vue`、`HomeFooter.vue`。布局、响应式样式和动画位于 `public/westermedia/home.css`，图片和字体位于 `public/westermedia/assets/`。链接仍由 `public/redirect.js` 统一跳转到当前站点的 `work.` 子域名。
