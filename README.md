## 运行与构建

```sh
npm install
npm run serve
npm run build
```

构建产物位于 `dist/`，支持网站根目录或子目录，保留 hash 路由。

## 首页结构

`src/views/Home.vue` 直接渲染完整首页，保留提供的 Poetic HTML 的页面结构、文字、图片和原始样式。

- `src/home-animations.js`：在 Vue 页面挂载后初始化原始文字动画和 Webflow 交互，在组件销毁时释放动画。
- `public/poetic/assets/`：本地字体、图片及原始动画库。
- `public/poetic/home.css`：原 HTML 内联公共样式。
- `public/poetic/responsive.css`：PC/H5 响应式补充样式。

原始资源均从本地加载，页面展示无需请求原站 CDN。提供的 HTML 没有视频资源。

## 自动跳转与联系方式

Logo、导航、案例、正文按钮、页脚链接、联系方式及订阅提交，均在点击或提交时读取当前页面地址，移除域名开头的 `www.` 和已有的 `work.` 前缀，再加上 `work.` 并跳转到目标站首页。保留当前协议和端口。例如 `https://www.aaaa.com/page` 跳转到 `https://work.aaaa.com/`。

修改 `public/config.js` 后刷新页面即可生效：

- `contact.email`：邮箱显示文字及提示。
- `contact.facebook`、`contact.instagram`、`contact.linkedin`：各自的 `label` 控制显示名称，`url` 控制账号地址提示；实际点击仍使用当前域名生成的 `work.` 地址。

手机菜单展开/收起及输入框编辑保留页面内操作。

本地开发使用 `public/config.js`。生产构建会排除该文件，`dist/` 中不包含配置文件。页面仍读取与 `index.html` 同级的 `config.js`：首次部署时单独放置并修改该文件；后续更新保留服务器上的现有配置。线上修改联系方式后刷新页面即可生效，无需重新构建。
