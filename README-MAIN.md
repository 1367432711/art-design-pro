# Art Design Pro - 完整开发文档

> 📚 一体化开发文档，整合项目所有核心知识  
> **版本**: 2026-04-07 | **技术栈**: Vue 3.5 + TypeScript + Vite

---

## 目录导航

本整合文档包含以下核心内容:

| 部分               | 内容      | 详情                   |
| ------------------ | --------- | ---------------------- |
| [1](#1-项目概述)   | 项目概述  | 介绍、特色、技术栈     |
| [2](#2-快速开始)   | 快速开始  | 环境要求、安装、启动   |
| [3](#3-项目结构)   | 项目结构  | 目录结构、路径别名     |
| [4](#4-开发规范)   | 开发规范  | 代码规范、Git 提交规范 |
| [5](#5-核心功能)   | 核心功能  | 路由、权限、主题、图标 |
| [6](#6-业务模块)   | 业务模块  | 客户、产品、报价管理   |
| [7](#7-api 接口)   | API 接口  | 所有接口定义           |
| [8](#8-mock 数据)  | Mock 数据 | 开发数据配置           |
| [9](#9-核心-hook)  | 核心 Hook | useTable 等工具        |
| [10](#10-构建部署) | 构建部署  | 打包、清理、命令       |

---

## 1. 项目概述

### 关于 Art Design Pro

Art Design Pro 是一款专注于 **用户体验** 和 **视觉设计** 的企业级中后台解决方案。针对传统管理系统在交互设计和视觉呈现方面的不足，我们构建了一套完整的设计体系和技术架构。

### 解决的问题

| 问题             | 解决方案                                       |
| ---------------- | ---------------------------------------------- |
| **视觉体验优化** | 科学的配色体系、合理的排版布局、流畅的动效设计 |
| **交互效率提升** | 符合用户认知习惯的信息架构和交互模式           |
| **开发效率提升** | 完整的组件库、设计规范和最佳实践               |

### 核心特色

- ✨ **现代化 UI 设计** - 简洁美观，注重细节打磨
- 🚀 **极速上手** - 简洁架构配合完整文档
- 🧩 **丰富组件库** - 覆盖常见业务场景
- 🎨 **丝滑交互体验** - 每个交互细节都精心设计
- 🛠️ **高效开发工具** - useTable、ArtForm 等实用 API
- 🧹 **快速项目初始化** - 一键清理演示数据

### 技术栈

| 类别           | 技术                                              |
| -------------- | ------------------------------------------------- |
| **核心框架**   | Vue 3.5.21 + TypeScript 5.6.3 + Vite 7.1.5        |
| **UI 组件库**  | Element Plus 2.11.2                               |
| **样式方案**   | Tailwind CSS 4.1.14 + Sass 1.81.0                 |
| **状态管理**   | Pinia 3.0.3                                       |
| **路由管理**   | Vue Router 4.5.1                                  |
| **HTTP 请求**  | Axios 1.12.2                                      |
| **图表库**     | ECharts 6.0.0                                     |
| **工具集**     | VueUse 13.9.0                                     |
| **图标库**     | Iconify 5.0.0 (Remix Icon, svg-spinners, line-md) |
| **代码质量**   | ESLint + Prettier + Stylelint                     |
| **工程化工具** | Husky + Lint-staged + cz-git                      |

### 浏览器兼容性

支持 Chrome、Edge、Firefox、Safari、Opera 等现代浏览器。

---

## 2. 快速开始

### 环境要求

- Node.js >= 18.x
- pnpm >= 8.x

### 安装依赖

```bash
pnpm install
# 如果失败，尝试：
pnpm install --ignore-scripts
```

### 启动开发服务器

```bash
pnpm dev
```

访问：`http://localhost:3006`

### 生产打包

```bash
pnpm build
```

### 清理演示数据

```bash
pnpm clean:dev
```

---

## 3. 项目结构

### 目录结构

```
art-design-pro/
├── scripts/              # 构建脚本
├── src/
│   ├── api/              # API 接口定义
│   │   ├── auth.ts       # 认证接口
│   │   ├── user.ts       # 用户接口
│   │   ├── system-manage.ts   # 系统管理接口
│   │   └── trade-manage.ts    # 外贸管理接口
│   ├── assets/           # 静态资源
│   │   ├── icons/        # SVG 图标
│   │   └── images/       # 图片资源
│   ├── components/       # 公共组件
│   ├── composables/      # 组合式函数
│   ├── config/           # 配置文件
│   ├── directives/       # 自定义指令
│   ├── hooks/            # 自定义 Hooks
│   │   └── core/         # 核心 Hook
│   │       └── useTable.ts
│   ├── layouts/          # 布局组件
│   ├── mock/             # Mock 数据
│   │   ├── data/         # JSON 数据文件
│   │   └── temp/         # Mock 逻辑
│   ├── router/           # 路由配置
│   │   └── routes/       # 路由定义
│   │       ├── staticRoutes.ts
│   │       └── asyncRoutes.ts
│   ├── store/            # Pinia 状态管理
│   │   └── modules/      # 状态模块
│   ├── styles/           # 全局样式
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   │   ├── http/         # HTTP 请求封装
│   │   ├── storage/      # 存储工具
│   │   ├── table/        # 表格工具
│   │   └── ui/           # UI 工具
│   └── views/            # 页面组件
│       ├── dashboard/    # 仪表盘
│       ├── trade/        # 外贸管理
│       │   ├── customer/     # 客户管理
│       │   ├── product/      # 产品管理
│       │   └── quotation/    # 报价管理
│       └── system/       # 系统管理
├── .env                  # 环境变量
├── .eslintrc.js          # ESLint 配置
├── .prettierrc           # Prettier 配置
├── .stylelintrc          # Stylelint 配置
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
└── vite.config.ts        # Vite 配置
```

### 路径别名

| 别名       | 路径                 |
| ---------- | -------------------- |
| `@/`       | `src/`               |
| `@views/`  | `src/views/`         |
| `@utils/`  | `src/utils/`         |
| `@stores/` | `src/store/`         |
| `@styles/` | `src/assets/styles/` |
| `@mock/`   | `src/mock/`          |
| `@imgs/`   | `src/assets/images/` |
| `@icons/`  | `src/assets/icons/`  |

### 环境变量

| 变量                 | 说明         | 默认值    |
| -------------------- | ------------ | --------- |
| `VITE_VERSION`       | 应用版本     | `0.0.0`   |
| `VITE_PORT`          | 开发端口     | `5173`    |
| `VITE_BASE_URL`      | 基础路径     | `/`       |
| `VITE_API_URL`       | API 地址     | -         |
| `VITE_API_PROXY_URL` | API 代理地址 | -         |
| `VITE_ACCESS_MODE`   | 权限模式     | `backend` |

---

## 4. 开发规范

### 代码规范

#### 基础语法

```typescript
// ✅ 正确
const name = 'Art Design Pro'
let count = 0
console.log('hello')

// ❌ 错误
const name = 'Art Design Pro' // 双引号
var count = 0 // var
console.log('hello') // 分号
```

#### ESLint 规则

- `quotes: ['error', 'single']` - 使用单引号
- `semi: ['error', 'never']` - 语句末尾不加分号
- `no-var: 'error'` - 禁止使用 var
- `no-multiple-empty-lines: ['warn', { max: 1 }]` - 不允许多个连续空行

### Git 提交规范

使用 `pnpm commit` 调用 cz-git，遵循 conventional commits:

| 类型        | 说明        | 示例                                    |
| ----------- | ----------- | --------------------------------------- |
| `feat:`     | 新功能      | `feat: 新增订单管理模块`                |
| `fix:`      | 修复 bug    | `fix: 修复报价单编辑数据无法加载的问题` |
| `docs:`     | 文档变更    | `docs: 更新开发文档`                    |
| `refactor:` | 重构        | `refactor: 重构用户信息表单逻辑`        |
| `style:`    | 代码格式    | `style: 格式化代码`                     |
| `test:`     | 测试相关    | `test: 添加单元测试`                    |
| `chore:`    | 构建/工具链 | `chore: 更新依赖版本`                   |

### 样式规范

- 优先使用 `art-card`、`art-table-card`、`art-full-height` 等系统内置类名
- 使用 Tailwind CSS 工具类优先于自定义 SCSS
- 使用 CSS 变量保持主题一致性

---

## 5. 核心功能

### 路由和菜单

#### 路由类型

| 类型     | 配置位置                            | 说明                         |
| -------- | ----------------------------------- | ---------------------------- |
| 静态路由 | `src/router/routes/staticRoutes.ts` | 登录/注册/404/500 等公共页面 |
| 动态路由 | `src/router/routes/asyncRoutes.ts`  | 需要权限的业务页面           |

#### Meta 属性说明

| 属性         | 类型     | 说明                       |
| ------------ | -------- | -------------------------- |
| `title`      | string   | 路由标题                   |
| `icon`       | string   | 路由图标 (iconify 格式)    |
| `keepAlive`  | boolean  | 是否缓存页面               |
| `fixedTab`   | boolean  | 是否固定标签页             |
| `isHideTab`  | boolean  | 是否在标签页中隐藏         |
| `isIframe`   | boolean  | 是否为 iframe 内嵌页面     |
| `link`       | string   | 外部链接地址               |
| `roles`      | string[] | 角色权限 (前端模式)        |
| `activePath` | string   | 手动指定激活的父级菜单路径 |

### 权限管理

#### 权限模式

| 模式       | 说明                        |
| ---------- | --------------------------- |
| `backend`  | 后端控制菜单路由权限 (推荐) |
| `frontend` | 前端控制菜单路由权限        |

#### 权限实现

1. 登录获取 Token
2. 根据用户角色动态加载路由
3. 路由守卫验证权限

### 主题配置

- 使用 `useTheme` Hook 进行主题切换
- CSS 变量存储主题色
- LocalStorage 持久化主题选择

### 图标使用

#### 已注册图标集

| 图标集            | 用途         |
| ----------------- | ------------ |
| `ri` - Remix Icon | 系统必要图标 |
| `svg-spinners`    | SVG 旋转动画 |
| `line-md`         | Line MD 图标 |

#### 使用方式

```vue
<template>
  <ArtSvgIcon icon="ri:mail-line" />
  <Icon icon="ri:user-line" />
</template>
```

#### 添加新图标集

```bash
pnpm add -D @iconify-json/[icon-set-name]
```

然后在 `src/utils/ui/iconify-loader.ts` 中注册。

---

## 6. 业务模块

### 模块总览

| 模块     | 路由前缀            | 页面数 | 状态      |
| -------- | ------------------- | ------ | --------- |
| 客户管理 | `/trade/customer`   | 2      | ✅ 已完成 |
| 产品管理 | `/trade/product`    | 3      | ✅ 已完成 |
| 报价管理 | `/trade/quotation`  | 3      | ✅ 已完成 |
| 订单管理 | `/trade/order`      | 2      | ⏳ 待开发 |
| 跟进记录 | `/trade/followup`   | 1      | ⏳ 待开发 |
| 数据统计 | `/trade/statistics` | 1      | ⏳ 待开发 |

### 客户管理 (`/trade/customer`)

**核心字段**: 名称、联系人、邮箱、电话、国家、来源、等级、状态

**API 接口**:

- `GET /api/trade/customer/list` - 获取客户列表
- `GET /api/trade/customer/:id` - 获取客户详情
- `POST /api/trade/customer` - 创建客户
- `PUT /api/trade/customer` - 更新客户
- `DELETE /api/trade/customer/:id` - 删除客户

### 产品管理 (`/trade/product`)

**产品类型**: 切割片、百叶片、磨光片、其他  
**产品等级**: A 级、B 级、C 级

**核心字段**: 名称、类型、SKU、规格、等级、材质、价格、库存、图片

**API 接口**:

- `GET /api/trade/product/list` - 获取产品列表
- `GET /api/trade/product/:id` - 获取产品详情
- `POST /api/trade/product` - 创建产品
- `PUT /api/trade/product` - 更新产品
- `DELETE /api/trade/product/:id` - 删除产品

### 报价管理 (`/trade/quotation`)

**报价单号规则**: `CI-YYYYMMDD-NNN` (如 `CI-20260325-001`)

**状态**: 草稿、待发送、已发送、已确认、已拒绝

**核心字段**: 报价单号、客户、产品数组、费用汇总、贸易条款、付款方式

**API 接口**:

- `GET /api/trade/quotation/list` - 获取报价列表
- `GET /api/trade/quotation/:id` - 获取报价详情
- `POST /api/trade/quotation` - 创建报价
- `PUT /api/trade/quotation` - 更新报价
- `DELETE /api/trade/quotation/:id` - 删除报价

---

## 7. API 接口

### 基础响应结构

```typescript
interface BaseResponse<T = unknown> {
  code: number // 状态码：200 成功，其他失败
  msg: string // 响应消息
  data: T // 响应数据
}
```

所有请求默认返回 `data` 字段中的数据。

### 认证接口 (`auth.ts`)

| 函数                 | 接口                   | 说明         |
| -------------------- | ---------------------- | ------------ |
| `fetchLogin(data)`   | `POST /api/auth/login` | 用户登录     |
| `fetchGetUserInfo()` | `GET /api/user/info`   | 获取用户信息 |

### 用户接口 (`user.ts`)

| 函数                        | 接口                    | 说明         |
| --------------------------- | ----------------------- | ------------ |
| `fetchGetUserInfo()`        | `GET /api/user/info`    | 获取用户信息 |
| `fetchUpdateUserInfo(data)` | `POST /api/user/update` | 更新用户信息 |

### 系统管理接口 (`system-manage.ts`)

| 函数                      | 接口                        | 说明         |
| ------------------------- | --------------------------- | ------------ |
| `fetchGetUserList(query)` | `GET /api/user/list`        | 获取用户列表 |
| `fetchGetRoleList()`      | `GET /api/system/role/list` | 获取角色列表 |
| `fetchGetMenuList()`      | `GET /api/system/menu/list` | 获取菜单列表 |

### 外贸管理接口 (`trade-manage.ts`)

#### 客户管理

| 函数                            | 接口                             | 说明         |
| ------------------------------- | -------------------------------- | ------------ |
| `fetchGetCustomerList(query)`   | `GET /api/trade/customer/list`   | 获取客户列表 |
| `fetchGetCustomerDetail(id)`    | `GET /api/trade/customer/:id`    | 获取客户详情 |
| `fetchCreateCustomer(data)`     | `POST /api/trade/customer`       | 创建客户     |
| `fetchUpdateCustomer(id, data)` | `PUT /api/trade/customer`        | 更新客户     |
| `fetchDeleteCustomer(id)`       | `DELETE /api/trade/customer/:id` | 删除客户     |

#### 产品管理

| 函数                           | 接口                            | 说明         |
| ------------------------------ | ------------------------------- | ------------ |
| `fetchGetProductList(query)`   | `GET /api/trade/product/list`   | 获取产品列表 |
| `fetchGetProductDetail(id)`    | `GET /api/trade/product/:id`    | 获取产品详情 |
| `fetchCreateProduct(data)`     | `POST /api/trade/product`       | 创建产品     |
| `fetchUpdateProduct(id, data)` | `PUT /api/trade/product`        | 更新产品     |
| `fetchDeleteProduct(id)`       | `DELETE /api/trade/product/:id` | 删除产品     |

#### 报价管理

| 函数                             | 接口                              | 说明         |
| -------------------------------- | --------------------------------- | ------------ |
| `fetchGetQuotationList(query)`   | `GET /api/trade/quotation/list`   | 获取报价列表 |
| `fetchGetQuotationDetail(id)`    | `GET /api/trade/quotation/:id`    | 获取报价详情 |
| `fetchCreateQuotation(data)`     | `POST /api/trade/quotation`       | 创建报价     |
| `fetchUpdateQuotation(id, data)` | `PUT /api/trade/quotation`        | 更新报价     |
| `fetchDeleteQuotation(id)`       | `DELETE /api/trade/quotation/:id` | 删除报价     |

---

## 8. Mock 数据

### LocalStorage 存储

开发环境下使用 LocalStorage 存储 Mock 数据。

| 数据     | Storage Key            | JSON 文件                      |
| -------- | ---------------------- | ------------------------------ |
| 用户信息 | `user_info`            | `mock/data/userInfo.json`      |
| 客户列表 | `trade_customer_list`  | `mock/data/customerList.json`  |
| 产品列表 | `trade_product_list`   | `mock/data/productList.json`   |
| 报价列表 | `trade_quotation_list` | `mock/data/quotationList.json` |

### 自动同步

Vite 插件 `syncMockData` 会在开发环境下自动将 LocalStorage 的变更同步回 JSON 文件。

### 清理演示数据

```bash
pnpm clean:dev
```

---

## 9. 核心 Hook

### useTable

位置：`src/hooks/core/useTable.ts`

**主要功能**:

- 数据获取与缓存
- 分页控制 (含移动端适配)
- 搜索功能 (防抖)
- 5 种刷新策略

**使用示例**:

```typescript
const {
  data,
  loading,
  pagination,
  searchParams,
  getData,
  refreshData,
  refreshCreate,
  refreshUpdate,
  refreshRemove,
  resetSearchParams
} = useTable({
  core: {
    apiFn: fetchUserList,
    immediate: true
  },
  performance: {
    enableCache: true
  }
})
```

### 其他 Hook

- `useTheme` - 主题切换
- `useAuth` - 认证逻辑

---

## 10. 构建部署

### 常用命令

```bash
# 安装依赖
pnpm install
pnpm install --ignore-scripts  # 如果失败

# 开发
pnpm dev

# 构建
pnpm build
pnpm build:dev    # 开发环境打包
pnpm build:pro    # 生产环境打包

# 代码质量
pnpm lint         # ESLint 检查
pnpm lint:fix     # ESLint 自动修复
pnpm format       # 代码格式化
pnpm type-check   # TypeScript 类型检查

# Git
pnpm commit       # Git 提交 (cz-git)

# 清理
pnpm clean:dev    # 清理演示数据
```

### 新建页面步骤

1. 创建页面组件：`src/views/模块名/page.vue`
2. 注册到路由：`src/router/routes/asyncRoutes.ts`
3. 测试访问：`http://localhost:3006/#/路由`
4. 提交代码

---

## 常见问题

### 页面切换空白

**原因**: 页面组件没有单个根元素  
**解决**: 将所有内容包裹在单个容器中

### 点击菜单页面刷新

**原因**: Vite 依赖预构建优化  
**解决**: 在 `vite.config.ts` 中添加依赖到 `optimizeDeps.include`

### LocalStorage 数据被重置

**原因**: userInfo.ts 每次页面加载都从 JSON 重置  
**解决**: 仅在 LocalStorage 为空时从 JSON 初始化

---

## 相关链接

- **官方文档**: https://www.artd.pro/docs
- **演示地址**: https://www.artd.pro
- **GitHub**: https://github.com/Daymychen/art-design-pro
- **QQ 群**: 1038930070

---

<div align="center">
  <p>Art Design Pro © 2024-2026</p>
  <p>最后更新：2026-04-07</p>
</div>
