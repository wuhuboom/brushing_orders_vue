# PC 参考站数据与本项目 API 映射

本次适配按业务含义映射，不复制参考站 API 路径。参考站与本项目 URL 不同，只要返回的数据用途一致，就继续调用本项目后端。

## 已有对应 API

| 页面数据 | 参考站请求 | 本项目实现 | 处理方式 |
| --- | --- | --- | --- |
| 网站标题、Logo、注册开关等 | `/api/webConfig` | `GET /config/website` | 公共页面启动时读取，失败使用 DAS 本地默认值且不阻断页面 |
| About 富文本 | `/api/about` | `GET /config/content` 的 `aboutContent` | About 页面使用本项目返回内容，不复制参考站内容接口 |
| 条款 | 参考站内容配置 | `GET /config/content` 的 `termsContent` / `protocolContent` | 沿用现有条款页 |
| FAQ | 参考站内容配置 | `GET /config/content` 的 `helpContent` | 沿用现有 FAQ 页 |
| 客服列表 | `/api/customer_services` | `GET /config/customer-services` | 沿用本项目客服名称、头像和链接 |
| 登录 | 参考站登录接口 | `POST /user/login` | PC 表单复用现有登录逻辑 |
| 注册 | 参考站注册接口 | `POST /user/register` | PC 表单复用现有注册、国家区号和手机号校验 |

## 页面静态内容

- 未登录 PC 页的布局、导航名称、营销标题、功能说明、按钮文案和奖牌装饰属于参考站前端模板内容，当前作为页面静态展示。
- 根据当前复刻要求，未登录 PC 模板的展示品牌使用参考站 `DMK`，About 主标题保留 `Lunyex`；本项目仍会读取 `/config/website` 供其他业务页面使用。
- About 后台富文本仍在营销模板下方展示，由本项目 API 动态返回。

## 当前缺口

| 缺少项 | 当前影响 | 后端建议 |
| --- | --- | --- |
| 注册生日字段 | PC 注册页按参考站显示并校验生日，但现有 `/user/register` 请求模型没有生日字段，因此暂不发送 | 明确字段名（建议 `birthday`，格式 `YYYY-MM-DD`）后再接入 |
| Salary 页面及数据 | Profile 菜单可展示该入口，但项目内没有 Salary 页面和对应 API | 提供薪资明细/汇总接口及字段说明 |
| Deposit History 独立页面 | 项目有充值和记录页面，但没有能确认等价的“入金历史”专用数据接口 | 确认现有记录接口是否包含充值历史，或提供专用接口 |

后续登录态页面检查时会继续在此文档补充映射和真实缺口。
