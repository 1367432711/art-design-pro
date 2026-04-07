# Art Design Pro 项目开发规范

> 📋 本文档整理了项目的核心开发规则，所有代码修改都应遵循以下规范。

**最后更新**: 2026-04-07

---

## 代码规范

### 基础语法

- **引号**: 使用单引号，不使用双引号
- **分号**: 语句末尾不加分号
- **变量声明**: 禁止使用 `var`，使用 `let` 或 `const`
- **空行**: 不允许多个连续空行

### ESLint 配置

```javascript
quotes: ['error', 'single']
semi: ['error', 'never']
no-var: 'error'
no-multiple-empty-lines: ['warn', { max: 1 }]
```

### Git 提交规范

使用 `pnpm commit` 调用 cz-git，遵循 conventional commits:

| 类型        | 说明        |
| ----------- | ----------- |
| `feat:`     | 新功能      |
| `fix:`      | 修复 bug    |
| `docs:`     | 文档变更    |
| `refactor:` | 重构        |
| `style:`    | 代码格式    |
| `test:`     | 测试相关    |
| `chore:`    | 构建/工具链 |

---

## 样式规范

### 内置类名优先

- 优先使用 `art-card`、`art-table-card`、`art-full-height` 等系统内置类名
- 使用 Tailwind CSS 工具类优先于自定义 SCSS
- 使用 CSS 变量保持主题一致性：`var(--el-bg-color)`, `var(--default-box-color)` 等

### 卡片样式

- 卡片样式统一使用 `art-card` 类
- 表格容器使用 `art-table-card` 类
- 全高容器使用 `art-full-height` 类
- 卡片头部统一使用 `art-card-header` 类

---

## 组件使用

| 场景     | 组件                  | 说明                    |
| -------- | --------------------- | ----------------------- |
| 表格     | `ArtTable`            | 企业级表格数据管理组件  |
| 操作按钮 | `ArtButtonTable`      | 表格操作列按钮组        |
| 图标     | `ArtSvgIcon` / `Icon` | SVG 图标 / Iconify 图标 |

### 图标使用

```vue
<template>
  <ArtSvgIcon icon="ri:mail-line" />
  <Icon icon="ri:user-line" />
</template>
```

**已注册图标集**:

- `ri` - Remix Icon (系统必要)
- `svg-spinners` - SVG 旋转动画
- `line-md` - Line MD 图标

**添加新图标集**:

```bash
pnpm add -D @iconify-json/[icon-set-name]
```

然后在 `src/utils/ui/iconify-loader.ts` 中注册。

---

## 页面开发规范

### 页面开发流程

1. 创建页面组件
2. 注册到路由
3. 测试访问
4. 提交代码

### 页面组件要求

- 页面组件必须有**单个根元素**（路由动画要求）
- 注释不能放在根元素外部
- 使用 `art-full-height` 类让页面最小高度撑满屏幕

### 新建页面步骤

**1. 创建页面组件** (`src/views/xxx/page.vue`)

**2. 注册路由** (`src/router/routes/asyncRoutes.ts`)

```typescript
{
  path: '/test/index',
  name: 'Test',
  component: '/test/index',
  meta: {
    title: '测试页',
    keepAlive: true
  }
}
```

**3. 访问测试**: `http://localhost:3006/#/test`

---

## 响应格式

### 基础响应结构

```typescript
interface BaseResponse<T = unknown> {
  code: number // 状态码
  msg: string // 消息
  data: T // 数据
}
```

### HTTP 请求返回值

默认返回 `data` 中的数据:

```typescript
const { token, refreshToken } = await fetchLogin({
  userName: username,
  password
})
```

---

## 路径别名

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

---

## Mock 数据系统

### LocalStorage 存储

开发环境下使用 LocalStorage 存储 Mock 数据，避免每次刷新都重置。

| 数据     | Storage Key            | JSON 文件                      |
| -------- | ---------------------- | ------------------------------ |
| 用户信息 | `user_info`            | `mock/data/userInfo.json`      |
| 客户列表 | `trade_customer_list`  | `mock/data/customerList.json`  |
| 产品列表 | `trade_product_list`   | `mock/data/productList.json`   |
| 报价列表 | `trade_quotation_list` | `mock/data/quotationList.json` |

### Vite 插件自动同步

`syncMockData` 插件会在开发环境下自动将 LocalStorage 的变更同步回 JSON 文件。

---

## 业务模块

### 客户管理 (`/trade/customer`)

| 页面     | 路由                  | 组件                           | 状态 |
| -------- | --------------------- | ------------------------------ | ---- |
| 客户列表 | `/trade/customer`     | `customer/index.vue`           | ✅   |
| 客户详情 | `/trade/customer/:id` | `customer/customer-detail.vue` | ✅   |

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

## 开发进度

| 模块     | 页面数 | 状态      | 备注               |
| -------- | ------ | --------- | ------------------ |
| 客户管理 | 2      | ✅ 已完成 | 列表 + 详情        |
| 产品管理 | 3      | ✅ 已完成 | 列表 + 表单 + 详情 |
| 报价管理 | 3      | ✅ 已完成 | 列表 + 表单 + 详情 |
| 订单管理 | 2      | ⏳ 待设计 | 列表 + 表单        |
| 跟进记录 | 1      | ⏳ 待设计 | 列表 + 表单        |
| 数据统计 | 1      | ⏳ 待设计 | 统计图表           |

---

## 相关文档

- [README.md](./README.md) - 项目说明文档
- [DEVELOPMENT-LOG.md](./DEVELOPMENT-LOG.md) - 开发日志手册
- [GUIDE.md](./GUIDE.md) - 详细使用指南

---

<div align="center">
  <p>Art Design Pro © 2024-2026</p>
</div>
