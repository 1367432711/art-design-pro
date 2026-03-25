# Art Design Pro 开发指南

> 📘 完整的开发流程化指南，包含代码规范、开发流程、Mock 数据配置等

**最后更新**: 2026-03-26

---

## 目录

1. [快速开始](#快速开始)
2. [代码规范](#代码规范)
3. [页面开发流程](#页面开发流程)
4. [Mock 数据配置](#mock-数据配置)
5. [路由配置](#路由配置)
6. [API 开发规范](#api-开发规范)
7. [类型定义规范](#类型定义规范)
8. [提交规范](#提交规范)

---

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 开发启动

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:5173
```

### 项目结构

```
src/
├── api/              # API 接口
├── components/       # 公共组件
├── hooks/           # 组合式函数
├── locales/         # 国际化
├── mock/temp/       # Mock 数据
├── router/modules/  # 路由模块
├── store/           # Pinia 状态管理
├── types/api/       # TypeScript 类型定义
├── utils/           # 工具函数
└── views/           # 页面组件
```

---

## 代码规范

### JavaScript/TypeScript

```typescript
// ✅ 正确
const name = 'John'
let count = 0

// ❌ 错误
var name = 'John' // 禁止使用 var
const NAME = 'John' // 使用单引号
count++ // 语句末尾不加分号
```

**核心规则**:

- 使用单引号，不使用双引号
- 语句末尾不加分号
- 禁止使用 `var`，使用 `let/const`
- 不允许多个连续空行

### Vue 组件

```vue
<!-- ✅ 正确：单个根元素 -->
<template>
  <div class="page-container">
    <h1>标题</h1>
    <p>内容</p>
  </div>
</template>

<!-- ❌ 错误：多个根元素 -->
<template>
  <h1>标题</h1>
  <p>内容</p>
</template>
```

**核心规则**:

- 页面组件必须有单个根元素（路由动画要求）
- 注释不能放在根元素外部

### 样式规范

```vue
<template>
  <!-- ✅ 正确：使用系统类名 -->
  <ElCard class="art-card">
    <div class="custom-section">内容</div>
  </ElCard>
</template>

<style lang="scss" scoped>
  .custom-section {
    // 使用 CSS 变量
    color: var(--el-text-color-primary)
    background: var(--el-bg-color)
  }
</style>
```

**核心规则**:

- 优先使用 `art-card`、`art-table-card`、`art-full-height` 等系统内置类名
- 使用 Tailwind CSS 工具类优先于自定义 SCSS
- 使用 CSS 变量保持主题一致性

### 组件使用

```vue
<template>
  <!-- ✅ 正确 -->
  <ArtTable :data="list" :columns="columns" />
  <ArtButtonTable type="edit" @click="handleEdit" />
  <Icon icon="ri:user-line" />

  <!-- ❌ 避免 -->
  <ElTable>...</ElTable>
  <!-- 除非特殊需求 -->
  <el-button icon="el-icon-edit">编辑</el-button>
</template>
```

**核心规则**:

- 表格使用 `ArtTable` 组件而非原生 `ElTable`
- 操作按钮使用 `ArtButtonTable` 组件
- 图标使用 `ArtSvgIcon` 或 `Icon` (Iconify) 组件

---

## 页面开发流程

### 步骤 1: 创建页面组件

在 `src/views/模块名/` 目录下创建页面文件：

```
src/views/trade/product/
├── index.vue          # 列表页
├── product-form.vue   # 表单页
└── product-detail.vue # 详情页
```

### 步骤 2: 注册到路由

编辑 `src/router/modules/模块名.ts`：

```typescript
import { AppRouteRecord } from '@/types/router'

export const tradeRoutes: AppRouteRecord = {
  path: '/trade',
  name: 'Trade',
  component: '/index/index',
  meta: {
    title: 'menus.trade.title',
    icon: 'ri:global-line',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'product',
      name: 'Product',
      component: '/trade/product',
      meta: {
        title: 'menus.trade.product',
        icon: 'ri:box-3-line',
        keepAlive: true
      }
    },
    {
      path: 'product/detail/:id',
      name: 'ProductDetail',
      component: '/trade/product/product-detail',
      meta: {
        title: '产品详情',
        isHide: true,
        keepAlive: true
      }
    }
  ]
}
```

### 步骤 3: 测试访问

访问 `http://localhost:5173/trade/product` 测试页面

### 步骤 4: 提交代码

```bash
git add .
git commit -m "feat: 新增产品管理模块"
git push
```

---

## Mock 数据配置

### 步骤 1: 创建 Mock 数据文件

在 `src/mock/temp/` 目录创建数据文件：

```typescript
// src/mock/temp/productList.ts

import type { Api } from '@/types/api'

// 初始数据
const PRODUCT_LIST_DATA: Api.Trade.ProductListItem[] = [
  {
    id: '1',
    name: '树脂切割片',
    type: '切割片',
    sku: 'QT-001',
    spec: '100×16×3mm',
    grade: 'A 级',
    salePrice: 5.0,
    currency: 'USD'
    // ... 其他字段
  }
]

// CRUD 函数
export function getProductListData(params: Api.Trade.ProductSearchParams) {
  // 实现分页和搜索逻辑
  return { records: PRODUCT_LIST_DATA, total: PRODUCT_LIST_DATA.length }
}

export function getProductDetailById(id: string) {
  return PRODUCT_LIST_DATA.find((item) => item.id === id)
}

export function createProduct(product: Partial<Api.Trade.ProductListItem>) {
  const newProduct = {
    ...product,
    id: String(Date.now()),
    createTime: new Date().toLocaleString(),
    updateTime: new Date().toLocaleString()
  } as Api.Trade.ProductListItem
  PRODUCT_LIST_DATA.unshift(newProduct)
  return newProduct
}

export function updateProduct(id: string, data: Partial<Api.Trade.ProductListItem>) {
  const index = PRODUCT_LIST_DATA.findIndex((item) => item.id === id)
  if (index === -1) return null
  PRODUCT_LIST_DATA[index] = {
    ...PRODUCT_LIST_DATA[index],
    ...data,
    updateTime: new Date().toLocaleString()
  }
  return PRODUCT_LIST_DATA[index]
}

export function deleteProduct(id: string) {
  const index = PRODUCT_LIST_DATA.findIndex((item) => item.id === id)
  if (index === -1) return null
  PRODUCT_LIST_DATA.splice(index, 1)
  return true
}
```

### 步骤 2: 在 API 中引用

```typescript
// src/api/trade-manage.ts

import {
  getProductListData,
  getProductDetailById,
  createProduct,
  updateProduct,
  deleteProduct
} from '@/mock/temp/productList'

export function fetchGetProductList(params: Api.Trade.ProductSearchParams) {
  // 使用模拟数据（开发环境）
  const data = getProductListData(params)
  return Promise.resolve({
    code: 200,
    msg: 'success',
    data
  })

  // 真实 API 请求（生产环境）
  // return request.get<Api.Trade.ProductList>({
  //   url: '/api/trade/product/list',
  //   params
  // })
}

export function fetchCreateProduct(data: Partial<Api.Trade.ProductListItem>) {
  const newProduct = createProduct(data)
  return Promise.resolve({
    code: 200,
    msg: 'success',
    data: newProduct
  })
}
```

---

## 路由配置

### 路由参数说明

| 参数           | 类型    | 必填 | 说明                     |
| -------------- | ------- | ---- | ------------------------ |
| path           | string  | ✅   | 路由路径                 |
| name           | string  | ✅   | 路由名称（唯一）         |
| component      | string  | ✅   | 组件路径（相对于 views） |
| meta.title     | string  | ✅   | 菜单标题                 |
| meta.icon      | string  | -    | 菜单图标                 |
| meta.keepAlive | boolean | -    | 是否缓存页面             |
| meta.isHide    | boolean | -    | 是否隐藏菜单             |

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

**注意**: 开启 KeepAlive 后，使用 `onActivated` hook 处理数据刷新：

```typescript
onMounted(() => {
  getData() // 首次加载
})

onActivated(() => {
  refreshData() // 从缓存返回时刷新
})
```

---

## API 开发规范

### 文件结构

```typescript
// src/api/trade-manage.ts

import request from '@/utils/http'

// ==================== 客户管理 ====================

/**
 * 获取客户列表
 * @param params 搜索参数
 */
export function fetchGetCustomerList(params: Api.Trade.CustomerSearchParams) {
  return request.get<Api.Trade.CustomerList>({
    url: '/api/trade/customer/list',
    params
  })
}

// ==================== 报价管理 ====================
// ==================== 产品管理 ====================
```

### 响应格式

所有 API 返回遵循 `BaseResponse<T>` 格式：

```typescript
interface BaseResponse<T> {
  code: number // 状态码
  msg: string // 消息
  data: T // 数据
}
```

### 错误处理

```typescript
try {
  const res = await fetchGetProductList(params)
  const data = res.data
} catch (error) {
  console.error('获取产品列表失败:', error)
  ElMessage.error('获取产品列表失败')
}
```

---

## 类型定义规范

### 文件位置

`src/types/api/api.d.ts`

### 命名空间结构

```typescript
declare namespace Api {
  /** 通用类型 */
  namespace Common {
    interface PaginationParams {
      current: number
      size: number
      total: number
    }
  }

  /** 贸易管理 */
  namespace Trade {
    // 客户
    interface CustomerListItem {
      id: string
      customerName: string
      contactPerson: string
      status: string
    }

    // 产品
    interface ProductListItem {
      id: string
      name: string
      type: string
      spec: string
    }

    // 报价
    interface QuotationListItem {
      id: string
      quotationNo: string
      customerName: string
      totalPrice: number
    }

    // 搜索参数
    interface ProductSearchParams extends PaginationParams {
      keyword?: string
      type?: string
      grade?: string
    }
  }
}
```

### 使用方式

```typescript
// 在 .vue 文件中直接使用（全局命名空间）
const params: Api.Trade.ProductSearchParams = {
  current: 1,
  size: 20,
  keyword: '切割片'
}

// 在 .ts 文件中同样直接使用
function fetchData(params: Api.Trade.ProductSearchParams) {
  // ...
}
```

---

## 提交规范

### Commit 格式

```
<type>: <subject>

[optional body]

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### Type 类型

| 类型     | 说明          |
| -------- | ------------- |
| feat     | 新功能        |
| fix      | Bug 修复      |
| docs     | 文档更新      |
| style    | 代码格式调整  |
| refactor | 代码重构      |
| perf     | 性能优化      |
| chore    | 构建/工具配置 |

### 示例

```bash
# 新功能
git commit -m "feat: 新增产品管理模块"

# Bug 修复
git commit -m "fix: 修复报价表单计算错误"

# 文档更新
git commit -m "docs: 更新开发手册"

# 完整格式
git commit -m "$(cat <<'EOF'
feat: 完成产品管理和报价管理模块

新增功能:
- 产品管理列表页
- 产品管理表单页
- 产品管理详情页
- 报价管理列表页
- 报价管理表单页
- 报价管理详情页

功能特性:
- 支持多产品报价
- 自动计算总价
- Mock 数据支持

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## 常见问题

### 页面空白

**问题**: 页面刷新后空白

**原因**: `<template>` 有多个根元素或注释在外部

**解决**: 确保单个根元素，注释放在内部

```vue
<!-- ❌ 错误 -->
<template>
  <!-- 头部 -->
  <div>头部</div>
  <div>内容</div>
</template>

<!-- ✅ 正确 -->
<template>
  <div>
    <!-- 头部 -->
    <div>头部</div>
    <div>内容</div>
  </div>
</template>
```

### ESLint 报错

**问题**: `no-unused-vars` 报错

**解决**: 删除未使用的变量，或使用 `_` 前缀

```typescript
// ❌ 错误
const handleSuccess = (response: any, uploadFile: any) => {
  // uploadFile 未使用
}

// ✅ 正确
const handleSuccess = (response: any) => {
  // ...
}
```

### Mock 数据不生效

**检查清单**:

1. Mock 文件路径是否正确 (`src/mock/temp/`)
2. API 文件是否正确引用 Mock 函数
3. 是否返回了 `Promise.resolve` 格式
4. 数据结构是否符合类型定义

---

## 开发工具

### VS Code 推荐插件

- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- Tailwind CSS IntelliSense

### 快捷命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产打包
pnpm preview      # 预览生产构建
pnpm lint         # 代码检查
pnpm format       # 代码格式化
pnpm commit       # Git 提交 (cz-git)
```

---

<div align="center">
  <p>📚 本文档持续更新，请及时同步最新规范</p>
  <p>Art Design Pro © 2024-2026</p>
</div>
