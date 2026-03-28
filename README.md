<img  src="https://www.qiniu.lingchen.kim/github-cover-light6.webp" />

<br />
<h1 align="center">Art Design Pro</h1>
<p align="center">A backend system template that combines design aesthetics with efficient development, helping you quickly build professional-grade applications</p>
<div align="center">English | <a href="./README.zh-CN.md">简体中文</a></div>

<br />
<div align="center">

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE) [![github stars](https://img.shields.io/github/stars/Daymychen/art-design-pro)](https://github.com/Daymychen/art-design-pro/stargazers) [![github forks](https://img.shields.io/github/forks/Daymychen/art-design-pro)](https://github.com/Daymychen/art-design-pro/network/members)

</div>
<br />

## What makes this project special?

**Interface Design**: Modern UI design with smooth interactions, focusing on user experience and visual design

**Quick Start**: Clean architecture + comprehensive documentation, easy for backend developers to use

**Rich Components**: Built-in high-quality components for data display, forms, and more to meet different business scenarios

**Smooth Interactions**: Button clicks, theme switching, page transitions, chart animations - experience comparable to commercial products

**Efficient Development**: Built-in practical APIs like useTable and ArtForm to significantly improve development efficiency

**Clean Scripts**: Built-in one-click cleanup script to quickly remove demo data and get a ready-to-develop base project

## Tech Stack

Development Framework: Vue3, TypeScript, Vite, Element-Plus, Tailwind CSS

Code Standards: Eslint, Prettier, Stylelint, Husky, Lint-staged, cz-git

## Preview

<kbd><img src="https://www.qiniu.lingchen.kim/github-c1.webp" alt="Light Theme"/></kbd>

<kbd><img src="https://www.qiniu.lingchen.kim/github-c2.webp" alt="Light Theme"/></kbd>

<kbd><img src="https://www.qiniu.lingchen.kim/github-c4.webp" alt="Dark Theme"/></kbd>

<kbd><img src="https://www.qiniu.lingchen.kim/github-c5.webp" alt="Dark Theme"/></kbd>

## Quick Access

[Live Demo](https://www.artd.pro) | [Official Documentation](https://www.artd.pro/docs) | [Changelog](./CHANGELOG.en.md)

## Installation & Setup

```bash
# Install dependencies
pnpm install

# If pnpm install fails, try using the command below
pnpm install --ignore-scripts

# Start local development environment
pnpm dev

# Build for production
pnpm build
```

## Clean Version

The project includes a cleanup script to quickly remove demo data and provide developers with a ready-to-develop base project

```bash
pnpm clean:dev
```

## Technical Support

QQ Group: <a href="https://qm.qq.com/cgi-bin/qm/qr?k=Gg6yzZLFaNgmRhK0T5Qcjf7-XcAFWWXm&jump_from=webapi&authKey=YpRKVJQyFKYbGTiKw0GJ/YQXnNF+GdXNZC5beQQqnGZTvuLlXoMO7nw5fNXvmVhA">1038930070</a> (Click the link to join the group chat)

## Browser Compatibility

Supports modern mainstream browsers including Chrome, Safari, Firefox, and more.

## Contributing

We sincerely welcome and appreciate the support of every contributor! Whether you have new ideas, feature suggestions, or code optimizations, you can participate in the following ways:

Submit Pull Requests: Share your code and help the project grow.

Create GitHub Issues: Provide bug feedback or new feature suggestions to help us improve together.

Every contribution you make takes this project one step further! Come join our open source community!

## Continuous Optimization & Extension

The project maintains active updates, supports the latest frontend tech stack, is compatible with mainstream frameworks, and ensures long-term stability and extensibility. Community-driven feedback mechanisms allow your needs to be quickly integrated into project iterations.

## Donation

If you feel this project has reduced your development costs and solved problems in your work/life, you can support us through the following ways:

<img src="https://www.qiniu.lingchen.kim/%E7%BB%84%202%402x%202.png" alt="Donation QR Code"/>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Daymychen/art-design-pro&type=Date)](https://www.star-history.com/#Daymychen/art-design-pro&Date)

---

# 开发规范指南

> 📋 本文档整理了项目的核心开发规则，帮助开发者快速上手并遵循统一的开发规范。

## 目录

- [快速开始](#快速开始)
- [技术栈](#技术栈)
- [代码规范](#代码规范)
- [响应格式](#响应格式)
- [路由与菜单](#路由与菜单)
- [表格分页配置](#表格分页配置)
- [新建页面步骤](#新建页面步骤)
- [常见问题](#常见问题)

---

## 快速开始

```bash
# 安装依赖
pnpm install

# 本地开发
pnpm dev

# 生产打包
pnpm build

# 清理演示数据（获取精简项目）
pnpm clean:dev
```

**环境要求**: Node.js >= 20.19.0, pnpm >= 8.8.0

---

## 技术栈

| 类别          | 技术                                |
| ------------- | ----------------------------------- |
| **核心框架**  | Vue 3.5 + TypeScript 5.6 + Vite 7.1 |
| **UI 组件库** | Element Plus 2.11                   |
| **状态管理**  | Pinia 3.0 (+ 持久化插件)            |
| **路由**      | Vue Router 4.5                      |
| **样式**      | Tailwind CSS 4.1 + SCSS             |
| **HTTP**      | Axios 1.12                          |
| **图表**      | ECharts 6.0                         |
| **工具库**    | VueUse 13.9                         |

---

## 代码规范

### ESLint 规则

```javascript
quotes: ['error', 'single']           // 使用单引号
semi: ['error', 'never']              // 语句末尾不加分号
no-var: 'error'                       // 禁止 var，使用 let/const
no-multiple-empty-lines: ['warn', { max: 1 }]  // 不允许多个空行
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

### 路径别名

| 别名       | 路径                 |
| ---------- | -------------------- |
| `@/`       | `src/`               |
| `@views/`  | `src/views/`         |
| `@utils/`  | `src/utils/`         |
| `@stores/` | `src/store/`         |
| `@styles/` | `src/assets/styles/` |

---

## 响应格式

### 基础响应 (src/types/common/response.ts)

```typescript
interface BaseResponse<T = unknown> {
  code: number // 状态码
  msg: string // 消息
  data: T // 数据
}
```

### HTTP 请求返回值

默认返回 `data` 中的数据而不是整个响应体：

```typescript
try {
  const { token, refreshToken } = await fetchLogin({
    userName: username,
    password
  })
  // 直接使用 token, refreshToken
} catch (error) {
  if (error instanceof HttpError) {
    // 根据状态码处理
    console.log(error.code)
  }
}
```

---

## 路由与菜单

### 路由类型

| 类型         | 配置位置                            | 说明                         |
| ------------ | ----------------------------------- | ---------------------------- |
| **静态路由** | `src/router/routes/staticRoutes.ts` | 登录/注册/404/500 等公共页面 |
| **动态路由** | `src/router/routes/asyncRoutes.ts`  | 需要权限的业务页面           |

### 权限模式配置

在 `.env` 文件中配置：

```env
# 权限模式【 frontend 前端模式 / backend 后端模式 】
VITE_ACCESS_MODE = backend
```

> **注意**: 后端模式下，菜单由后端根据用户角色返回，不需要配置 `roles` 字段。

### 路由定义示例

```typescript
{
  name: "Dashboard",
  path: "/dashboard",
  component: "/index/index",  // 组件路径 (相对于 src/views)
  meta: {
    title: "仪表盘",
    icon: "ri:pie-chart-line",
    roles: ["R_SUPER", "R_ADMIN"],  // 前端模式用，后端模式不需要
    keepAlive: false,
  },
  children: [
    {
      path: "console",
      name: "Console",
      component: "/dashboard/console",
      meta: {
        title: "控制台",
        keepAlive: false,
        fixedTab: true,  // 固定标签页
      },
    },
  ],
}
```

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

---

## 表格分页配置

### 配置文件：src/utils/table/tableConfig.ts

```typescript
export const tableConfig = {
  // 响应数据字段映射（按顺序查找）
  recordFields: ['list', 'data', 'records', 'items', 'result', 'rows'],
  totalFields: ['total', 'count'], // 总条数
  currentFields: ['current', 'page', 'pageNum'], // 当前页码
  sizeFields: ['size', 'pageSize', 'limit'], // 每页大小

  // 请求参数映射（前端发送请求时使用的参数名）
  paginationKey: {
    current: 'current', // 当前页码
    size: 'size' // 每页大小
  }
}
```

### 自定义字段

如果后端使用其他字段名，可以添加：

```typescript
recordFields: ['list', 'data', 'yourCustomField']
```

---

## 新建页面步骤

### 1. 创建页面组件

在 `/src/views/` 目录下创建 Vue 文件：

```vue
<template>
  <div class="page-content">
    <!-- 这个类名可以让页面最小高度撑满屏幕 -->
    <h1>测试页面</h1>
  </div>
</template>

<script setup lang="ts">
  // 组件逻辑
</script>
```

> **重要**: 页面组件必须有**单个根元素**，否则路由切换动画会失效。注释节点也不能在根元素外。

### 2. 注册路由

**动态路由** (`src/router/routes/asyncRoutes.ts`):

```typescript
export const asyncRoutes: MenuListType[] = [
  {
    path: '/test/index',
    name: 'Test',
    component: '/test/index',
    meta: {
      title: '测试页',
      keepAlive: true
    }
  }
]
```

**静态路由** (`src/router/routes/staticRoutes.ts`):

```typescript
export const staticRoutes: AppRouteRecordRaw[] = [
  {
    path: '/test',
    name: 'Test',
    component: () => import('@views/test/index.vue'),
    meta: { title: '测试页面', isHideTab: true }
  }
]
```

> **注意**: 如果动态路由已配置，静态路由中需移除相同配置，避免重复。

### 3. 访问测试

```
http://localhost:3006/#/test
```

---

## 内嵌 iframe 页面

```typescript
{
  path: '/outside/iframe/elementui',
  name: 'ElementUI',
  component: '',
  meta: {
    title: 'Element Plus 文档',
    keepAlive: false,
    link: 'https://element-plus.org/zh-CN/component/overview.html',
    isIframe: true
  }
}
```

---

## 主页配置

通过配置 `HOME_PAGE_PATH` 定义主页路由，默认为菜单第一个有效路径：

```typescript
// src/router/index.ts
export const HOME_PAGE_PATH = ''
```

---

## 常见问题

### 1. 页面切换一片空白

**原因**: 开启了路由切换动画，Vue 的 `<Transition>` 组件要求页面组件必须有单个根元素。

**解决方法**: 将所有内容包裹在单个容器元素中。

❌ **错误示例**:

```html
<template>
  <div>内容 1</div>
  <span>内容 2</span>
</template>
```

✅ **正确示例**:

```html
<template>
  <div>
    <div>内容 1</div>
    <span>内容 2</span>
  </div>
</template>
```

### 2. 点击菜单页面自动刷新

**原因**: Vite 在开发模式下自动进行依赖预构建优化。

**识别方法**: 启动台看到提示:

```
[vite] new dependencies optimized: element-plus/es/components/tooltip/style/index
```

**解决方法**: 在 `vite.config.ts` 中添加依赖到 `optimizeDeps.include`:

```typescript
export default defineConfig({
  optimizeDeps: {
    include: [
      'element-plus/es/components/tooltip/style/index',
      'element-plus/es/components/message/style/index'
    ]
  }
})
```

添加配置后需要重启开发服务器。

---

## 核心 Hook

### useTable

企业级表格数据管理 Hook，位于 `src/hooks/core/useTable.ts`。

**主要功能**:

- 数据获取与缓存
- 分页控制 (含移动端适配)
- 搜索功能 (防抖)
- 5 种刷新策略

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

---

## 技术支持

- **官方文档**: https://www.artd.pro/docs
- **演示地址**: https://www.artd.pro
- **QQ 群**: 1038930070

---

<div align="center">
  <p>🤖 Generated with <a href="https://claude.com/claude-code">Claude Code</a></p>
</div>
