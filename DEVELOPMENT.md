# Art Design Pro 开发规范指南

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

# 如果 pnpm install 失败，尝试
pnpm install --ignore-scripts

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

| 类别 | 技术 |
|------|------|
| **核心框架** | Vue 3.5 + TypeScript 5.6 + Vite 7.1 |
| **UI 组件库** | Element Plus 2.11 |
| **状态管理** | Pinia 3.0 (+ 持久化插件) |
| **路由** | Vue Router 4.5 |
| **样式** | Tailwind CSS 4.1 + SCSS |
| **HTTP** | Axios 1.12 |
| **图表** | ECharts 6.0 |
| **工具库** | VueUse 13.9 |

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

| 类型 | 说明 |
|------|------|
| `feat:` | 新功能 |
| `fix:` | 修复 bug |
| `docs:` | 文档变更 |
| `refactor:` | 重构 |
| `style:` | 代码格式 |
| `test:` | 测试相关 |
| `chore:` | 构建/工具链 |

### 路径别名

| 别名 | 路径 |
|------|------|
| `@/` | `src/` |
| `@views/` | `src/views/` |
| `@utils/` | `src/utils/` |
| `@stores/` | `src/store/` |
| `@styles/` | `src/assets/styles/` |

---

## 响应格式

### 基础响应 (src/types/common/response.ts)

```typescript
interface BaseResponse<T = unknown> {
  code: number; // 状态码
  msg: string; // 消息
  data: T; // 数据
}
```

### HTTP 请求返回值

默认返回 `data` 中的数据而不是整个响应体：

```typescript
try {
  const { token, refreshToken } = await fetchLogin({
    userName: username,
    password,
  });
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

| 类型 | 配置位置 | 说明 |
|------|----------|------|
| **静态路由** | `src/router/routes/staticRoutes.ts` | 登录/注册/404/500 等公共页面 |
| **动态路由** | `src/router/routes/asyncRoutes.ts` | 需要权限的业务页面 |

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

| 属性 | 类型 | 说明 |
|------|------|------|
| `title` | string | 路由标题 |
| `icon` | string | 路由图标 (iconify 格式) |
| `keepAlive` | boolean | 是否缓存页面 |
| `fixedTab` | boolean | 是否固定标签页 |
| `isHideTab` | boolean | 是否在标签页中隐藏 |
| `isIframe` | boolean | 是否为 iframe 内嵌页面 |
| `link` | string | 外部链接地址 |
| `roles` | string[] | 角色权限 (前端模式) |
| `activePath` | string | 手动指定激活的父级菜单路径 |

---

## 表格分页配置

### 配置文件：src/utils/table/tableConfig.ts

```typescript
export const tableConfig = {
  // 响应数据字段映射（按顺序查找）
  recordFields: ["list", "data", "records", "items", "result", "rows"],
  totalFields: ["total", "count"],           // 总条数
  currentFields: ["current", "page", "pageNum"],  // 当前页码
  sizeFields: ["size", "pageSize", "limit"],      // 每页大小

  // 请求参数映射（前端发送请求时使用的参数名）
  paginationKey: {
    current: "current",  // 当前页码
    size: "size",        // 每页大小
  },
};
```

### 自定义字段

如果后端使用其他字段名，可以添加：

```typescript
recordFields: ["list", "data", "yourCustomField"];
```

---

## 新建页面步骤

### 1. 创建页面组件

在 `/src/views/` 目录下创建 Vue 文件：

```vue
<template>
  <div class="page-content">  <!-- 这个类名可以让页面最小高度撑满屏幕 -->
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
    path: "/test/index",
    name: "Test",
    component: "/test/index",
    meta: {
      title: "测试页",
      keepAlive: true,
    },
  },
];
```

**静态路由** (`src/router/routes/staticRoutes.ts`):

```typescript
export const staticRoutes: AppRouteRecordRaw[] = [
  {
    path: "/test",
    name: "Test",
    component: () => import("@views/test/index.vue"),
    meta: { title: "测试页面", isHideTab: true },
  },
];
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
export const HOME_PAGE_PATH = "";
```

---

## 常见问题

### 1. 页面切换一片空白

**原因**: 开启了路由切换动画，Vue 的 `<Transition>` 组件要求页面组件必须有单个根元素。

**解决方法**: 将所有内容包裹在单个容器元素中。

❌ **错误示例**:
```html
<template>
  <!-- 多个根元素 -->
  <div>内容 1</div>
  <span>内容 2</span>
</template>
```

❌ **错误示例 (注释也是根节点)**:
```html
<template>
  <!-- 注释节点 -->
  <div>内容</div>
</template>
```

✅ **正确示例**:
```html
<template>
  <div>
    <!-- 注释放在根元素内部 -->
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
      "element-plus/es/components/tooltip/style/index",
      "element-plus/es/components/message/style/index",
    ],
  },
});
```

添加配置后需要重启开发服务器。此问题只在开发环境出现，生产环境不受影响。

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
  data, loading, pagination, searchParams,
  getData, refreshData, refreshCreate, refreshUpdate, refreshRemove,
  resetSearchParams
} = useTable({
  core: {
    apiFn: fetchUserList,
    immediate: true,
  },
  performance: {
    enableCache: true,
  },
});
```

### 刷新策略

| 方法 | 说明 | 使用场景 |
|------|------|----------|
| `refreshData()` | 全量刷新，清空所有缓存 | 手动刷新按钮 |
| `refreshSoft()` | 轻量刷新，保持分页状态 | 定时刷新 |
| `refreshCreate()` | 回到第一页，清空分页缓存 | 新增数据后 |
| `refreshUpdate()` | 保持当前页，清空搜索缓存 | 更新数据后 |
| `refreshRemove()` | 智能处理页码，避免空页面 | 删除数据后 |

---

## 项目结构

```
src/
├── api/                    # API 接口
│   ├── auth.ts             # 认证 API
│   └── system-manage.ts    # 系统管理 API
├── components/             # 组件
│   ├── business/           # 业务组件
│   └── core/               # 通用组件
├── hooks/                  # Composable 函数
│   └── core/               # 核心 Hooks (useTable, useTheme...)
├── router/                 # 路由
│   ├── routes/             # 路由配置
│   │   ├── staticRoutes.ts # 静态路由
│   │   └── asyncRoutes.ts  # 动态路由
│   ├── guards/             # 路由守卫
│   └── modules/            # 路由模块
├── store/                  # Pinia 状态管理
│   └── modules/            # 状态模块 (user/menu/setting)
├── utils/                  # 工具函数
│   ├── http/               # HTTP 请求封装
│   ├── table/              # 表格工具
│   └── storage/            # 存储工具
├── views/                  # 页面视图
└── types/                  # TypeScript 类型定义
```

---

## 环境配置文件

项目使用 `.env` 系列文件管理环境变量：

| 文件 | 用途 |
|------|------|
| `.env` | 通用环境配置 |
| `.env.development` | 开发环境配置 |
| `.env.production` | 生产环境配置 |

**重要配置项**:

```env
# API 接口地址
VITE_API_URL = /api

# 代理目标地址
VITE_API_PROXY_URL = http://localhost:8080

# 权限模式
VITE_ACCESS_MODE = backend

# 应用版本
VITE_VERSION = 1.0.0

# 开发端口
VITE_PORT = 3006

# 基础路径
VITE_BASE_URL = /
```

---

## 开发建议

1. **多设备同步开发**:
   - 将 `.env` 文件添加到版本控制（不要提交敏感信息）
   - 使用 `.env.local` 存储本地私有配置（需手动在另一台电脑创建）
   - 保持 `DEVELOPMENT.md` 与项目同步提交

2. **代码提交前检查**:
   ```bash
   pnpm lint        # 检查代码规范
   pnpm fix         # 自动修复可修复的问题
   pnpm lint:prettier  # 格式化代码
   ```

3. **新页面开发流程**:
   - 创建页面组件 → 注册路由 → 测试访问 → 提交代码

---

## 官方资源

- **官方文档**: https://www.artd.pro/docs
- **演示地址**: https://www.artd.pro
- **技术支持 QQ 群**: 1038930070

---

<div align="center">
  <p>📝 本文档会随项目更新，请保持同步</p>
  <p>Last Updated: 2026-03-24</p>
</div>
