---
name: 项目完整架构
description: Art Design Pro 项目完整架构、路由模块、页面组件、Store 模块详解
type: reference
---

# Art Design Pro 项目完整架构

**最后更新**: 2026-04-07

## 一、路由模块总览

### 1.1 仪表盘 (Dashboard)

**路径**: `/dashboard` | **图标**: `ri:pie-chart-line` | **角色**: 超级管理员、管理员

| 子路由       | 组件                   | 标题   | KeepAlive       |
| ------------ | ---------------------- | ------ | --------------- |
| `/console`   | `/dashboard/console`   | 控制台 | ❌ (固定标签页) |
| `/analysis`  | `/dashboard/analysis`  | 分析   | ❌              |
| `/ecommerce` | `/dashboard/ecommerce` | 电商   | ❌              |

### 1.2 模板 (Template)

**路径**: `/template` | **图标**: `ri:apps-2-line`

| 子路由      | 组件                 | 标题 | KeepAlive |
| ----------- | -------------------- | ---- | --------- |
| `/cards`    | `/template/cards`    | 卡片 | ❌        |
| `/banners`  | `/template/banners`  | 横幅 | ❌        |
| `/charts`   | `/template/charts`   | 图表 | ❌        |
| `/map`      | `/template/map`      | 地图 | ✅        |
| `/chat`     | `/template/chat`     | 聊天 | ✅        |
| `/calendar` | `/template/calendar` | 日历 | ✅        |
| `/pricing`  | `/template/pricing`  | 定价 | ✅ (全屏) |

### 1.3 小组件 (Widgets)

**路径**: `/widgets` | **图标**: `ri:apps-2-add-line`

| 子路由          | 组件                    | 标题         | KeepAlive |
| --------------- | ----------------------- | ------------ | --------- |
| `/icon`         | `/widgets/icon`         | 图标         | ✅        |
| `/image-crop`   | `/widgets/image-crop`   | 图片裁剪     | ✅        |
| `/excel`        | `/widgets/excel`        | Excel        | ✅        |
| `/video`        | `/widgets/video`        | 视频         | ✅        |
| `/count-to`     | `/widgets/count-to`     | 数字滚动     | ❌        |
| `/wang-editor`  | `/widgets/wang-editor`  | 富文本编辑器 | ✅        |
| `/watermark`    | `/widgets/watermark`    | 水印         | ✅        |
| `/context-menu` | `/widgets/context-menu` | 右键菜单     | ✅        |
| `/qrcode`       | `/widgets/qrcode`       | 二维码       | ✅        |
| `/drag`         | `/widgets/drag`         | 拖拽         | ✅        |
| `/text-scroll`  | `/widgets/text-scroll`  | 文字滚动     | ✅        |
| `/fireworks`    | `/widgets/fireworks`    | 烟花         | ✅ (Hot)  |

### 1.4 示例 (Examples)

**路径**: `/examples` | **图标**: `ri:sparkling-line`

| 子路由 | 组件 | 标题 | KeepAlive | 权限 |
| --- | --- | --- | --- | --- |
| `/permission/switch-role` | `/examples/permission/switch-role` | 切换角色 | ✅ | - |
| `/permission/button-auth` | `/examples/permission/button-auth` | 按钮权限 | ✅ | 8 种按钮权限 |
| `/permission/page-visibility` | `/examples/permission/page-visibility` | 页面可见性 | ✅ | 超级管理员 |
| `/tabs` | `/examples/tabs` | 标签页 | - | - |
| `/tables/basic` | `/examples/tables/basic` | 基础表格 | ✅ | - |
| `/tables` | `/examples/tables` | 表格 | ✅ | - |
| `/tables/tree` | `/examples/tables/tree` | 树形表格 | ✅ | - |
| `/forms` | `/examples/forms` | 表单 | ✅ | - |
| `/forms/search-bar` | `/examples/forms/search-bar` | 搜索栏 | ✅ | - |
| `/socket-chat` | `/examples/socket-chat` | Socket 聊天 | ✅ | - |

### 1.5 系统管理 (System)

**路径**: `/system` | **图标**: `ri:user-3-line` | **角色**: 超级管理员、管理员

| 子路由 | 组件 | 标题 | KeepAlive | 角色 | 按钮权限 |
| --- | --- | --- | --- | --- | --- |
| `/user` | `/system/user` | 用户管理 | ✅ | R_SUPER, R_ADMIN | - |
| `/role` | `/system/role` | 角色管理 | ✅ | R_SUPER, R_ADMIN | - |
| `/user-center` | `/system/user-center` | 个人中心 | ✅ | - | 隐藏 |
| `/menu` | `/system/menu` | 菜单管理 | ✅ | R_SUPER | 新增/编辑/删除 |
| `/nested/menu1` | `/system/nested/menu1` | 菜单 1 | ✅ | - | - |
| `/nested/menu2/menu2-1` | `/system/nested/menu2` | 菜单 2-1 | ✅ | - | - |
| `/nested/menu3/menu3-1` | `/system/nested/menu3` | 菜单 3-1 | ✅ | - | - |
| `/nested/menu3/menu3-2/menu3-2-1` | `/system/nested/menu3/menu3-2` | 菜单 3-2-1 | ✅ | - | - |

### 1.6 文章管理 (Article)

**路径**: `/article` | **图标**: `ri:book-2-line` | **角色**: 超级管理员、管理员

| 子路由          | 组件               | 标题     | KeepAlive | 按钮权限  |
| --------------- | ------------------ | -------- | --------- | --------- |
| `/article-list` | `/article/list`    | 文章列表 | ✅        | 新增/编辑 |
| `/detail/:id`   | `/article/detail`  | 文章详情 | ✅ (隐藏) |
| `/comment`      | `/article/comment` | 评论管理 | ✅        | -         |
| `/publish`      | `/article/publish` | 发布文章 | ✅        | 发布      |

### 1.7 外贸管理 (Trade) ★核心业务

**路径**: `/trade` | **图标**: `ri:global-line` | **角色**: 超级管理员、管理员

| 子路由                  | 组件                                | 标题          | KeepAlive |
| ----------------------- | ----------------------------------- | ------------- | --------- |
| `/customer`             | `/trade/customer`                   | 客户管理      | ✅        |
| `/customer/detail/:id`  | `/trade/customer/customer-detail`   | 客户详情      | ✅ (隐藏) |
| `/product`              | `/trade/product`                    | 产品管理      | ✅        |
| `/product/detail/:id`   | `/trade/product/product-detail`     | 产品详情      | ✅ (隐藏) |
| `/product/form`         | `/trade/product/product-form`       | 新增/编辑产品 | ✅ (隐藏) |
| `/quotation`            | `/trade/quotation`                  | 报价管理      | ✅        |
| `/quotation/detail/:id` | `/trade/quotation/quotation-detail` | 报价详情      | ✅ (隐藏) |
| `/quotation/form`       | `/trade/quotation/quotation-form`   | 新增报价      | ✅ (隐藏) |
| `/quotation/form/:id`   | `/trade/quotation/quotation-form`   | 编辑报价      | ✅ (隐藏) |

### 1.8 结果页 (Result)

**路径**: `/result` | **图标**: `ri:checkbox-circle-line`

| 子路由     | 组件              | 标题   | KeepAlive |
| ---------- | ----------------- | ------ | --------- |
| `/success` | `/result/success` | 成功页 | ✅        |
| `/fail`    | `/result/fail`    | 失败页 | ✅        |

### 1.9 异常页 (Exception)

**路径**: `/exception` | **图标**: `ri:error-warning-line`

| 子路由 | 组件             | 标题           | KeepAlive | 全屏 |
| ------ | ---------------- | -------------- | --------- | ---- |
| `/403` | `/exception/403` | 403 无权限     | ✅        | ✅   |
| `/404` | `/exception/404` | 404 不存在     | ✅        | ✅   |
| `/500` | `/exception/500` | 500 服务器错误 | ✅        | ✅   |

### 1.10 保障 (Safeguard)

**路径**: `/safeguard` | **图标**: `ri:shield-check-line`

| 子路由    | 组件                | 标题       | KeepAlive |
| --------- | ------------------- | ---------- | --------- |
| `/server` | `/safeguard/server` | 服务器监控 | ✅        |

---

## 二、Store 模块

### 2.1 userStore (用户状态)

**持久化**: `localStorage` | **Key**: `user`

| State           | 类型             | 说明     |
| --------------- | ---------------- | -------- |
| `language`      | LanguageEnum     | 语言设置 |
| `isLogin`       | boolean          | 登录状态 |
| `isLock`        | boolean          | 锁屏状态 |
| `lockPassword`  | string           | 锁屏密码 |
| `info`          | UserInfo         | 用户信息 |
| `searchHistory` | AppRouteRecord[] | 搜索历史 |
| `accessToken`   | string           | 访问令牌 |
| `refreshToken`  | string           | 刷新令牌 |

**Actions**: `setUserInfo`, `setLoginStatus`, `setLanguage`, `setSearchHistory`, `setLockStatus`, `setLockPassword`, `setToken`, `logOut`, `checkAndClearWorktabs`

### 2.2 settingStore (设置状态)

**持久化**: `localStorage`

管理主题、布局、动画等系统设置。

### 2.3 menuStore (菜单状态)

**持久化**: `localStorage`

管理菜单展开状态、激活状态、主页路径等。

### 2.4 worktabStore (工作台状态)

**持久化**: `localStorage`

管理标签页的开启、关闭、固定等。

### 2.5 tableStore (表格状态)

**持久化**: `localStorage`

管理表格配置、列设置等。

---

## 三、Hooks

### 核心 Hooks

| Hook                  | 用途                                              |
| --------------------- | ------------------------------------------------- |
| `useTable`            | 企业级表格数据管理（缓存/分页/搜索/5 种刷新策略） |
| `useAuth`             | 权限控制                                          |
| `useTheme`            | 主题切换                                          |
| `useCommon`           | 通用功能                                          |
| `useAppMode`          | 应用模式                                          |
| `useTableColumns`     | 表格列配置管理                                    |
| `useCeremony`         | 礼花 + 文字滚动效果                               |
| `useFastEnter`        | 顶栏快速入口                                      |
| `useHeaderBar`        | 顶栏功能管理                                      |
| `useChart`            | 图表相关                                          |
| `useLayoutHeight`     | 布局高度管理                                      |
| `useAutoLayoutHeight` | 自动布局高度                                      |

---

## 四、API 接口层

### 4.1 auth.ts (认证接口)

| 函数                 | 接口                   | 说明         |
| -------------------- | ---------------------- | ------------ |
| `fetchLogin(data)`   | `POST /api/auth/login` | 用户登录     |
| `fetchGetUserInfo()` | `GET /api/user/info`   | 获取用户信息 |

### 4.2 user.ts (用户接口)

| 函数                        | 接口                    | 说明         |
| --------------------------- | ----------------------- | ------------ |
| `fetchGetUserInfo()`        | `GET /api/user/info`    | 获取用户信息 |
| `fetchUpdateUserInfo(data)` | `POST /api/user/update` | 更新用户信息 |

### 4.3 system-manage.ts (系统管理)

| 函数                      | 接口                        | 说明     |
| ------------------------- | --------------------------- | -------- |
| `fetchGetUserList(query)` | `GET /api/user/list`        | 用户列表 |
| `fetchGetRoleList()`      | `GET /api/system/role/list` | 角色列表 |
| `fetchGetMenuList()`      | `GET /api/system/menu/list` | 菜单列表 |

### 4.4 trade-manage.ts (外贸管理)

**客户管理** (5 个): 列表、详情、创建、更新、删除  
**产品管理** (5 个): 列表、详情、创建、更新、删除  
**报价管理** (5 个): 列表、详情、创建、更新、删除

---

## 五、Mock 数据

### 数据文件位置

`src/mock/data/`

| 数据     | Storage Key            | JSON 文件                      |
| -------- | ---------------------- | ------------------------------ |
| 用户列表 | `system_user_list`     | `mock/data/userList.json`      |
| 客户列表 | `trade_customer_list`  | `mock/data/customerList.json`  |
| 产品列表 | `trade_product_list`   | `mock/data/productList.json`   |
| 报价列表 | `trade_quotation_list` | `mock/data/quotationList.json` |

---

## 六、工具函数

### utils 目录结构

```
utils/
├── constants/      # 常量定义
├── form/           # 表单工具
├── http/           # HTTP 请求封装
├── navigation/     # 导航工具
├── socket/         # WebSocket
├── storage/        # 存储工具
├── sys/            # 系统工具
├── table/          # 表格工具
└── ui/             # UI 工具（图标加载器、动画等）
```

---

## 七、页面组件统计

| 模块      | 页面数 | 说明                                     |
| --------- | ------ | ---------------------------------------- |
| dashboard | 3      | 控制台、分析、电商                       |
| template  | 7      | 卡片、横幅、图表、地图、聊天、日历、定价 |
| widgets   | 13     | 图标、裁剪、Excel、视频、烟花等          |
| examples  | 10+    | 权限、表格、表单、Socket 聊天等          |
| system    | 10+    | 用户、角色、菜单、嵌套菜单               |
| article   | 4      | 列表、详情、评论、发布                   |
| trade     | 9      | 客户、产品、报价（含详情/表单）          |
| result    | 2      | 成功、失败                               |
| exception | 3      | 403、404、500                            |
| safeguard | 1      | 服务器监控                               |

**总计**: 60+ 页面组件
