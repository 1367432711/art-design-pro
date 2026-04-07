# Art Design Pro - 开发指南

> 📘 面向开发者的完整开发指南，涵盖环境配置、开发规范、Mock 数据配置、最佳实践等内容

**最后更新**: 2026-04-07

---

## 目录

1. [快速开始](#快速开始)
2. [技术栈](#技术栈)
3. [项目结构](#项目结构)
4. [开发规范](#开发规范)
5. [页面开发流程](#页面开发流程)
6. [路由配置](#路由配置)
7. [Mock 数据配置](#mock-数据配置)
8. [核心功能](#核心功能)
9. [业务模块](#业务模块)
10. [构建配置](#构建配置)
11. [最佳实践](#最佳实践)
12. [常见问题](#常见问题)

---

## 快速开始

### 环境要求

- **Node.js**: >= 20.19.0
- **pnpm**: >= 8.8.0

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

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm serve
```

### 清理演示数据

```bash
pnpm clean:dev
```

---

## 技术栈

| 类别             | 技术         | 版本   |
| ---------------- | ------------ | ------ |
| **核心框架**     | Vue 3        | 3.5.21 |
| **类型系统**     | TypeScript   | 5.6.3  |
| **构建工具**     | Vite         | 7.1.5  |
| **UI 组件库**    | Element Plus | 2.11.2 |
| **状态管理**     | Pinia        | 3.0.3  |
| **路由管理**     | Vue Router   | 4.5.1  |
| **HTTP 客户端**  | Axios        | 1.12.2 |
| **样式方案**     | Tailwind CSS | 4.1.14 |
| **CSS 预处理器** | Sass         | 1.81.0 |
| **图表库**       | ECharts      | 6.0.0  |
| **工具集**       | VueUse       | 13.9.0 |
| **图标库**       | Iconify      | 5.0.0  |

### 代码质量工具

| 工具        | 用途                           |
| ----------- | ------------------------------ |
| ESLint      | JavaScript/TypeScript 代码检查 |
| Prettier    | 代码格式化                     |
| Stylelint   | CSS/SCSS 代码检查              |
| Husky       | Git Hooks 管理                 |
| Lint-staged | 暂存文件代码检查               |
| cz-git      | Git 提交规范工具               |

---

## 项目结构

```
art-design-pro/
├── scripts/              # 构建脚本
├── src/
│   ├── api/              # API 接口定义
│   ├── assets/           # 静态资源
│   │   ├── icons/        # SVG 图标
│   │   └── images/       # 图片资源
│   ├── components/       # 公共组件
│   ├── composables/      # 组合式函数
│   ├── config/           # 配置文件
│   ├── directives/       # 自定义指令
│   ├── hooks/            # 自定义 Hooks
│   ├── layouts/          # 布局组件
│   ├── mock/             # Mock 数据
│   │   ├── data/         # JSON 数据文件
│   │   └── temp/         # Mock 逻辑
│   ├── router/           # 路由配置
│   │   └── routes/       # 路由定义
│   ├── store/            # Pinia 状态管理
│   │   └── modules/      # 状态模块
│   ├── styles/           # 全局样式
│   ├── types/            # TypeScript 类型定义
│   │   ├── common/       # 通用类型
│   │   └── import/       # 自动导入类型
│   ├── utils/            # 工具函数
│   │   ├── http/         # HTTP 请求封装
│   │   ├── storage/      # 存储工具
│   │   ├── table/        # 表格工具
│   │   └── ui/           # UI 工具
│   └── views/            # 页面组件
│       ├── dashboard/    # 仪表盘
│       ├── trade/        # 外贸管理
│       └── system/       # 系统管理
├── .env                  # 环境变量
├── .eslintrc.js          # ESLint 配置
├── .prettierrc           # Prettier 配置
├── .stylelintrc          # Stylelint 配置
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
└── vite.config.ts        # Vite 配置
```

---

## 开发规范

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

#### 空行规则

```typescript
// ✅ 正确
const a = 1

const b = 2

// ❌ 错误
const a = 1

const b = 2 // 多个连续空行
```

### 样式规范

#### 内置类名优先

```vue
<template>
  <!-- ✅ 正确 -->
  <div class="art-card">
    <div class="art-card-header">...</div>
  </div>

  <!-- ❌ 不推荐 -->
  <div class="custom-card">
    <div class="custom-header">...</div>
  </div>
</template>
```

#### CSS 变量使用

```scss
.card {
  background-color: var(--el-bg-color);
  border-color: var(--default-box-color);
  color: var(--el-text-color-primary);
}
```

### Git 提交规范

使用 `pnpm commit` 调用 cz-git:

```bash
feat: 新增客户详情页面
fix: 修复报价单编辑数据无法加载的问题
refactor: 重构用户信息表单逻辑
docs: 更新开发文档
style: 格式化代码
test: 添加单元测试
chore: 更新依赖版本
```

---

## 页面开发流程

### 步骤 1: 创建页面组件

在 `src/views/模块名/` 目录下创建页面文件:

```
src/views/trade/product/
├── index.vue          # 列表页
├── form.vue           # 表单页
└── product-detail.vue # 详情页
```

### 步骤 2: 注册到路由

编辑 `src/router/routes/asyncRoutes.ts`:

```typescript
{
  path: '/trade/product',
  name: 'Product',
  component: '/trade/product',
  meta: {
    title: '产品管理',
    icon: 'ri:box-3-line',
    keepAlive: true
  }
}
```

### 步骤 3: 测试访问

访问 `http://localhost:5173/trade/product` 测试页面

### 步骤 4: 提交代码

```bash
git add .
git commit -m "feat: 新增产品管理模块"
```

---

## 路由配置

### 路由类型

| 类型     | 配置位置                            | 说明                         |
| -------- | ----------------------------------- | ---------------------------- |
| 静态路由 | `src/router/routes/staticRoutes.ts` | 登录/注册/404/500 等公共页面 |
| 动态路由 | `src/router/routes/asyncRoutes.ts`  | 需要权限的业务页面           |

### Meta 属性说明

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

### KeepAlive 配置

```typescript
{
  path: 'product',
  name: 'Product',
  component: '/trade/product',
  meta: {
    keepAlive: true  // 开启缓存
  }
}
```

---

## Mock 数据配置

### LocalStorage 存储

开发环境下使用 LocalStorage 存储 Mock 数据。

| 数据     | Storage Key            | JSON 文件                      |
| -------- | ---------------------- | ------------------------------ |
| 用户信息 | `user_info`            | `mock/data/userInfo.json`      |
| 客户列表 | `trade_customer_list`  | `mock/data/customerList.json`  |
| 产品列表 | `trade_product_list`   | `mock/data/productList.json`   |
| 报价列表 | `trade_quotation_list` | `mock/data/quotationList.json` |

### Vite 插件自动同步

`syncMockData` 插件会在开发环境下自动将 LocalStorage 的变更同步回 JSON 文件。

---

## 核心功能

### HTTP 请求封装

#### 基础响应结构

```typescript
interface BaseResponse<T = unknown> {
  code: number
  msg: string
  data: T
}
```

#### 请求示例

```typescript
const { token, refreshToken } = await fetchLogin({
  userName: username,
  password
})
```

### 表格 Hook (useTable)

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

### 图标系统

#### 已注册图标集

- `ri` - Remix Icon (系统必要)
- `svg-spinners` - SVG 旋转动画
- `line-md` - Line MD 图标

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

## 业务模块

### 客户管理 (`/trade/customer`)

| 页面     | 路由                  | 组件                           | 状态 |
| -------- | --------------------- | ------------------------------ | ---- |
| 客户列表 | `/trade/customer`     | `customer/index.vue`           | ✅   |
| 客户详情 | `/trade/customer/:id` | `customer/customer-detail.vue` | ✅   |

**核心字段**: 名称、联系人、邮箱、电话、国家、来源、等级、状态

### 产品管理 (`/trade/product`)

| 页面     | 路由                      | 组件                         | 状态 |
| -------- | ------------------------- | ---------------------------- | ---- |
| 产品列表 | `/trade/product`          | `product/index.vue`          | ✅   |
| 新增产品 | `/trade/product/new`      | `product/form.vue`           | ✅   |
| 产品详情 | `/trade/product/:id`      | `product/product-detail.vue` | ✅   |
| 编辑产品 | `/trade/product/edit/:id` | `product/form.vue`           | ✅   |

**产品类型**: 切割片、百叶片、磨光片、其他  
**产品等级**: A 级、B 级、C 级

### 报价管理 (`/trade/quotation`)

| 页面     | 路由                          | 组件                             | 状态 |
| -------- | ----------------------------- | -------------------------------- | ---- |
| 报价列表 | `/trade/quotation`            | `quotation/index.vue`            | ✅   |
| 新增报价 | `/trade/quotation/form`       | `quotation/form.vue`             | ✅   |
| 编辑报价 | `/trade/quotation/form/:id`   | `quotation/form.vue`             | ✅   |
| 报价详情 | `/trade/quotation/detail/:id` | `quotation/quotation-detail.vue` | ✅   |

**报价单号规则**: `CI-YYYYMMDD-NNN` (如 `CI-20260325-001`)  
**状态**: 草稿、待发送、已发送、已确认、已拒绝

---

## 构建配置

### 环境变量

| 变量                 | 说明         | 默认值    |
| -------------------- | ------------ | --------- |
| `VITE_VERSION`       | 应用版本     | `0.0.0`   |
| `VITE_PORT`          | 开发端口     | `5173`    |
| `VITE_BASE_URL`      | 基础路径     | `/`       |
| `VITE_API_URL`       | API 地址     | -         |
| `VITE_API_PROXY_URL` | API 代理地址 | -         |
| `VITE_ACCESS_MODE`   | 权限模式     | `backend` |

### 构建优化

- **代码压缩**: Terser (去除 console、debugger)
- **Gzip 压缩**: 大于 10KB 的文件自动压缩
- **按需导入**: 组件和 API 自动按需导入
- **依赖预构建**: echarts、xlsx、xgplayer 等大图依赖

---

## 最佳实践

### 组件开发

1. **单一职责**: 每个组件只负责一个功能
2. **Props 定义**: 使用 TypeScript 定义 Props 类型
3. **Emits 定义**: 明确定义组件触发的事件
4. **Slots 使用**: 合理使用插槽提高组件灵活性

### API 开发

1. **统一路径**: API 文件放在 `src/api/` 目录下
2. **类型定义**: 为请求和响应定义 TypeScript 类型
3. **错误处理**: 使用 try-catch 处理请求错误
4. **响应解构**: 直接解构 `data` 中的数据

### 样式开发

1. **Tailwind 优先**: 优先使用 Tailwind 工具类
2. **CSS 变量**: 使用 CSS 变量保持主题一致性
3. **响应式**: 使用 `max-md:` 等前缀处理移动端
4. **避免嵌套**: 避免过深的 CSS 嵌套

---

## 常见问题

### 页面切换空白

**原因**: 页面组件没有单个根元素

**解决**: 将所有内容包裹在单个容器中

### 点击菜单页面刷新

**原因**: Vite 依赖预构建优化

**解决**: 在 `vite.config.ts` 中添加依赖到 `optimizeDeps.include`

### LocalStorage 数据被重置

**原因**: `userInfo.ts` 每次页面加载都从 JSON 重置

**解决**: 仅在 LocalStorage 为空时从 JSON 初始化

---

## 技术支持

- **官方文档**: https://www.artd.pro/docs
- **演示地址**: https://www.artd.pro
- **QQ 群**: 1038930070

---

<div align="center">
  <p>Art Design Pro © 2024-2026</p>
</div>
