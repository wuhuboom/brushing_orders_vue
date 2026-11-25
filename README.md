
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


生产构建仍排除 `public/config.js`。部署时保留服务器上与 `index.html` 同级的 `config.js`，首次部署时单独放置该文件。

## 线上联系方式

页脚 Contact Us 的地址、邮箱、电话读取线上 `config.js` 的 `window.APP_CONFIG.contact`：

```js
window.APP_CONFIG = {
  contact: {
    address: "Humboldt, Iowa",
    email: "websites@wester.media",
    phone: "401-753-2001",
  },
};
```

更新此功能时，将上述字段合并到服务器现有的 `config.js`。以后直接修改该文件，访客刷新页面即可看到新值，无需重新构建。页面启动时会先读取带时间戳的配置地址，避免沿用旧的浏览器缓存。

地址兼容旧配置的 `contact.locations` 数组；有 `address` 时优先使用 `address`。未配置或留空的联系方式不显示，点击仍沿用现有 `work.` 子域名跳转规则。
