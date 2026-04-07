# Art Design Pro - 项目知识索引

> 📚 项目完整知识库索引，帮助开发者快速了解项目结构和开发规范

**最后更新**: 2026-04-07

---

## 快速导航

| 需求         | 查看文档                                       |
| ------------ | ---------------------------------------------- |
| 新手入门     | [README.md](./README.md)                       |
| 开发规范     | [CLAUDE.md](./CLAUDE.md)                       |
| 详细开发指南 | [GUIDE.md](./GUIDE.md)                         |
| API 接口文档 | [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) |
| 官方文档整合 | [OFFICIAL-GUIDE.md](./OFFICIAL-GUIDE.md)       |
| 技术栈详情   | [findings.md](./findings.md) - 第 2 节         |
| 业务模块     | [findings.md](./findings.md) - 第 4 节         |
| 路由配置     | [findings.md](./findings.md) - 第 8 节         |
| Mock 数据    | [findings.md](./findings.md) - 第 7 节         |

---

## 文档索引

### 核心文档

| 文档               | 路径                   | 用途                                 |
| ------------------ | ---------------------- | ------------------------------------ |
| README.md          | `./README.md`          | 项目介绍、快速开始、技术栈概览       |
| CLAUDE.md          | `./CLAUDE.md`          | 项目开发规范、代码规则、Git 提交规范 |
| GUIDE.md           | `./GUIDE.md`           | 详细开发指南、业务模块设计           |
| DEVELOPMENT-LOG.md | `./DEVELOPMENT-LOG.md` | 开发日志和版本记录                   |

### 规划文档 (planning-with-files-zh)

| 文档     | 路径             | 用途                         |
| -------- | ---------------- | ---------------------------- |
| 任务规划 | `./task_plan.md` | 当前任务的阶段划分和进度跟踪 |
| 研究发现 | `./findings.md`  | 项目研究和技术发现汇总       |
| 进度记录 | `./progress.md`  | 会话日志和操作记录           |

---

## 技术栈快速参考

### 核心框架

```
Vue 3.5.21 + TypeScript 5.6.3 + Vite 7.1.5
Element Plus 2.11.2 + Tailwind CSS 4.1.14
Pinia 3.0.3 + Vue Router 4.5.1
```

### 常用命令

```bash
pnpm install      # 安装依赖
pnpm dev          # 启动开发服务器
pnpm build        # 生产打包
pnpm clean:dev    # 清理演示数据
pnpm commit       # Git 提交
```

---

## 业务模块导航

### 已完成模块

#### 客户管理 (`/trade/customer`)

- 列表页：`src/views/trade/customer/index.vue`
- 详情页：`src/views/trade/customer/customer-detail.vue`
- API: `/api/trade/customer/*`

#### 产品管理 (`/trade/product`)

- 列表页：`src/views/trade/product/index.vue`
- 表单页：`src/views/trade/product/form.vue`
- 详情页：`src/views/trade/product/product-detail.vue`
- API: `/api/trade/product/*`

#### 报价管理 (`/trade/quotation`)

- 列表页：`src/views/trade/quotation/index.vue`
- 表单页：`src/views/trade/quotation/form.vue`
- 详情页：`src/views/trade/quotation/quotation-detail.vue`
- API: `/api/trade/quotation/*`

### 待开发模块

| 模块     | 路由                | 页面        | 状态      |
| -------- | ------------------- | ----------- | --------- |
| 订单管理 | `/trade/order`      | 列表 + 表单 | ⏳ 待设计 |
| 跟进记录 | `/trade/followup`   | 列表 + 表单 | ⏳ 待设计 |
| 数据统计 | `/trade/statistics` | 统计图表    | ⏳ 待设计 |

---

## 开发规范快速参考

### 代码规范

```typescript
// ✅ 正确
const name = 'Art Design Pro'
let count = 0

// ❌ 错误
const name = 'Art Design Pro' // 双引号
var count = 0 // var
console.log('hello') // 分号
```

### Git 提交规范

```bash
feat: 新增订单管理模块
fix: 修复报价单编辑数据无法加载的问题
docs: 更新开发文档
refactor: 重构用户信息表单逻辑
style: 格式化代码
test: 添加单元测试
chore: 更新依赖版本
```

### 新建页面步骤

1. 创建页面组件：`src/views/模块名/page.vue`
2. 注册到路由：`src/router/routes/asyncRoutes.ts`
3. 测试访问：`http://localhost:3006/#/路由`
4. 提交代码

---

## 核心 Hook 和组件

### useTable

位置：`src/hooks/core/useTable.ts`

```typescript
const { data, loading, pagination, getData, refreshData } = useTable({
  core: { apiFn: fetchUserList, immediate: true },
  performance: { enableCache: true }
})
```

### 图标使用

```vue
<template>
  <ArtSvgIcon icon="ri:mail-line" />
  <Icon icon="ri:user-line" />
</template>
```

---

## Mock 数据配置

| 数据     | Storage Key            | JSON 文件                      |
| -------- | ---------------------- | ------------------------------ |
| 用户信息 | `user_info`            | `mock/data/userInfo.json`      |
| 客户列表 | `trade_customer_list`  | `mock/data/customerList.json`  |
| 产品列表 | `trade_product_list`   | `mock/data/productList.json`   |
| 报价列表 | `trade_quotation_list` | `mock/data/quotationList.json` |

---

## Skills 使用

### brainstorming

**用途**: 新功能开发前的设计探索  
**触发**: 任何新功能请求时自动启动  
**输出**: `docs/superpowers/specs/设计文档.md`

### planning-with-files-zh

**用途**: 多步骤任务规划和进度跟踪  
**触发词**: 任务规划、项目计划、制定计划、分解任务  
**文件**: `task_plan.md`、`findings.md`、`progress.md`

### ui-ux-pro-max

**用途**: UI/UX 设计智能  
**包含**: 67 种风格、96 种配色、57 种字体搭配

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
  <p>Art Design Pro - 项目知识索引</p>
  <p>最后更新：2026-04-07</p>
</div>
