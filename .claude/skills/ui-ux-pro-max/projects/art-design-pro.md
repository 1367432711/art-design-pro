# Art Design Pro - Project Context

**项目类型**: Enterprise Admin Dashboard / B2B Trade Management System

**技术栈**: Vue 3.5 + TypeScript 5.6 + Vite 7.1 + Tailwind CSS 4.1 + Element Plus 2.11

**设计风格**: 现代企业级、简洁专业、响应式设计

---

## 项目架构

### 核心技术

| 技术         | 版本   | 用途       |
| ------------ | ------ | ---------- |
| Vue          | 3.5.22 | 前端框架   |
| TypeScript   | 5.6.3  | 类型系统   |
| Vite         | 7.1.7  | 构建工具   |
| Tailwind CSS | 4.1.14 | 原子化 CSS |
| Element Plus | 2.11.2 | UI 组件库  |
| Pinia        | 3.0.3  | 状态管理   |
| Vue Router   | 4.5.1  | 路由管理   |
| Iconify Vue  | 5.0.0  | 图标库     |

### 项目结构

```
src/
├── api/              # API 接口层
├── components/       # 公共组件库
│   ├── core/         # 核心组件（ArtTable、ArtButtonTable 等）
│   ├── business/     # 业务组件
│   └── product-card/ # 高级产品卡片组件
├── views/            # 页面组件
│   ├── dashboard/    # 仪表盘（分析/控制台/电商）
│   ├── trade/        # 贸易管理（客户/产品/报价）
│   ├── system/       # 系统管理
│   ├── article/      # 文章管理
│   └── widgets/      # 组件示例
├── mock/temp/        # Mock 数据
├── types/api/        # TypeScript 类型定义
└── router/modules/   # 路由模块
```

---

## 业务模块

### 1. Dashboard 仪表盘

- **Analysis**: 数据分析（销售额、客户满意度、产品分类）
- **Console**: 控制台（项目概览、待办事项、活跃用户）
- **E-commerce**: 电商数据（订单、交易、热销商品）

### 2. Trade 贸易管理（核心业务）

| 模块     | 路由               | 功能                                |
| -------- | ------------------ | ----------------------------------- |
| 客户管理 | `/trade/customer`  | 客户列表、详情、跟进记录、报价单    |
| 产品管理 | `/trade/product`   | 产品列表、详情、多型号管理          |
| 报价管理 | `/trade/quotation` | 报价单创建/编辑、产品明细、费用汇总 |

### 3. System 系统管理

- 用户管理、角色管理、菜单管理、权限配置

### 4. Article 文章管理

- 文章列表、详情、发布、评论

---

## 设计系统

### 样式规范

```scss
// 内置类名
art-card          // 统一卡片样式
art-table-card    // 表格容器
art-full-height   // 全高容器

// CSS 变量
--el-bg-color         // 背景色
--el-text-color-primary // 主文本色
--default-box-color   // 默认盒状背景
```

### 代码规范

- 单引号 `'` 而非双引号 `"`
- 语句末尾不加分号 `;`
- 禁止使用 `var`，使用 `let/const`
- 页面组件必须单根元素

### 组件使用

- 表格 → `ArtTable`（非 `ElTable`）
- 操作按钮 → `ArtButtonTable`
- 图标 → `ArtSvgIcon` 或 `Icon`（Iconify）

---

## UI/UX 组件库

### 已存在的高级组件

| 组件               | 路径                                               | 功能             |
| ------------------ | -------------------------------------------------- | ---------------- |
| PremiumProductCard | `components/product-card/premium-product-card.vue` | 高级质感产品卡片 |
| ArtTable           | `components/core/tables/art-table/`                | 数据表格         |
| ArtButtonTable     | `components/core/forms/art-button-table/`          | 操作按钮         |
| ArtSearchBar       | `components/core/forms/art-search-bar/`            | 搜索栏           |

### 图表组件

- ArtBarChart、ArtLineChart、ArtRingChart、ArtRadarChart、ArtMapChart

### 卡片组件

- ArtStatsCard、ArtImageCard、ArtProgressCard、ArtTimelineListCard

---

## 颜色主题

**当前使用 Element Plus 默认主题**，支持亮色/暗色模式切换：

- 主色：`#3b82f6` (blue-500)
- 成功：`#10b981` (emerald-500)
- 警告：`#f59e0b` (amber-500)
- 危险：`#ef4444` (red-500)
- 信息：`#64748b` (slate-500)

---

## 贸易业务流程

### 客户跟进流程

```
客户列表 → 客户详情 → [报价单] [跟进记录] [订单]
                     ↓
              报价创建 → 产品选择 → 费用配置 → 提交
                     ↓
              状态跟踪 → 待确认/已接受/已拒绝/已过期
```

### 报价单结构

- 头部：报价单号、客户、日期、贸易条款、付款方式
- 产品明细：多产品多型号、单价、数量、小计
- 费用汇总：运费、折扣、税费、总计

---

## 开发注意事项

### 1. 路由配置

- 动态路由基于 `router/modules/` 目录
- 需要权限验证

### 2. Mock 数据

- 位于 `mock/temp/` 目录
- 支持分页、搜索、筛选

### 3. API 响应格式

```typescript
interface BaseResponse<T> {
  code: number
  msg: string
  data: T
}
```

### 4. 类型定义

- 位于 `types/api/api.d.ts`
- `Api.Trade.CustomerListItem`、`Api.Trade.QuotationListItem` 等

---

## 待完善功能（UI/UX 优化空间）

1. **跟进记录模块** - 已创建弹窗组件，待 API 对接
2. **订单管理模块** - 待开发
3. **PDF 导出功能** - 待实现
4. **附件管理** - 客户相关合同、产品目录
5. **时间轴视图** - 客户时间轴
6. **智能提醒** - 报价到期、跟进计划

---

## 设计偏好

**企业级 B2B 界面**:

- 简洁专业，避免过度装饰
- 清晰的数据层级和视觉重点
- 高效的表格和表单交互
- 一致的颜色和间距系统

**避免**:

- Emoji 作为图标使用
- 过度动画影响性能
- 颜色过浅导致可读性差
- 布局不一致

---

_最后更新：2026-03-28_
