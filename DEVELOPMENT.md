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
- [图标使用](#图标使用)
- [样式与主题](#样式与主题)
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
| **UI 组件库** | Element Plus 2.11 (覆盖 80% 常用组件) |
| **状态管理** | Pinia 3.0 (+ 持久化插件) |
| **路由** | Vue Router 4.5 |
| **样式** | Tailwind CSS 4.1 + SCSS |
| **HTTP** | Axios 1.12 |
| **图表** | ECharts 6.0 |
| **工具库** | VueUse 13.9 |

> **注**: 项目对 Element Plus 部分组件 UI 进行了调优，详见 [样式与主题](#样式与主题) 章节。

---

## 代码规范

### 自动化工具

项目使用以下工具实现代码提交时的自动校验与格式化：

| 工具 | 说明 |
|------|------|
| **ESLint** | JS/TS 代码检查 |
| **Prettier** | 代码格式化 |
| **Stylelint** | CSS/SCSS 代码检查 |
| **CommitLint** | Git 提交信息检查 |
| **Husky** | Git 钩子工具 |
| **Lint-staged** | 提交前自动校验暂存文件 |
| **cz-git** | 可视化 Git 提交工具 |

### ESLint 规则

```javascript
quotes: ['error', 'single']           // 使用单引号
semi: ['error', 'never']              // 语句末尾不加分号
no-var: 'error'                       // 禁止 var，使用 let/const
no-multiple-empty-lines: ['warn', { max: 1 }]  // 不允许多个空行
```

### Lint-staged 配置

提交代码时自动执行校验与格式化 (`package.json`):

```json
"lint-staged": {
  "*.{js,ts}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{cjs,json}": [
    "prettier --write"
  ],
  "*.{vue,html}": [
    "eslint --fix",
    "prettier --write",
    "stylelint --fix"
  ],
  "*.{scss,css}": [
    "stylelint --fix",
    "prettier --write"
  ],
  "*.md": [
    "prettier --write"
  ]
}
```

### 常用命令

```bash
# 检查项目中的 JS/TS 语法
pnpm lint

# 自动修复 JS/TS 语法错误
pnpm fix

# 使用 Prettier 格式化所有指定类型的文件
pnpm lint:prettier

# 使用 Stylelint 检查和自动修复 CSS/SCSS/Vue 样式问题
pnpm lint:stylelint

# 仅检查暂存文件，确保提交前代码质量
pnpm lint:lint-staged

# 设置 Husky Git 钩子（项目初始化时执行）
pnpm prepare

# 使用 Commitizen 规范化提交消息
pnpm commit
```

### Git 提交规范

使用 `pnpm commit` 调用 cz-git，遵循 conventional commits:

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新增功能 | `feat: 添加用户管理页面` |
| `fix` | 修复缺陷 | `fix: 修复表单提交失败问题` |
| `docs` | 文档变更 | `docs: 更新 README 说明` |
| `style` | 代码格式（不影响功能） | `style: 修复缩进格式` |
| `refactor` | 代码重构（不包括 bug 修复、功能新增） | `refactor: 重构用户模块` |
| `perf` | 性能优化 | `perf: 优化列表渲染性能` |
| `test` | 测试相关 | `test: 添加登录功能测试` |
| `build` | 构建流程、外部依赖变更 | `build: 升级 webpack 版本` |
| `ci` | 修改 CI 配置、脚本 | `ci: 更新 GitHub Actions 配置` |
| `revert` | 回滚 commit | `revert: 回滚上一个提交` |
| `chore` | 对构建过程或辅助工具的更改 | `chore: 更新依赖版本` |
| `wip` | 开发中 | `wip: 完善功能开发中` |

### 完整提交流程

```bash
# 1. 添加文件到暂存区
git add .

# 2. 使用可视化工具提交（推荐）
pnpm commit

# 3. 推送到远程仓库
git push
```

> **提示**: 代码提交会自动触发 Husky 钩子，执行 lint-staged 进行代码校验和格式化，确保提交代码质量。

### 路径别名

| 别名 | 路径 |
|------|------|
| `@/` | `src/` |
| `@views/` | `src/views/` |
| `@utils/` | `src/utils/` |
| `@stores/` | `src/store/` |
| `@styles/` | `src/assets/styles/` |
| `@imgs/` | `src/assets/images/` |
| `@icons/` | `src/assets/icons/` |
| `@plugins/` | `src/plugins/` |

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

## 图标使用

### v3.0 版本 - Iconify (推荐)

v3.0 版本图标库升级为 **Iconify**,支持海量图标库，包括 Remix Icon、Material Design Icons、Font Awesome 等 150+ 图标集。

#### 推荐图标库

为确保系统图标风格统一，项目全部采用 **Remix Icon** 图标库：

- [Iconify - Remix Icon](https://icon-sets.iconify.design/ri/)
- [Remix Icon 官网](https://remixicon.com/)

#### 使用方式

使用 `ArtSvgIcon` 组件显示图标：

```vue
<template>
  <!-- 基础使用 -->
  <ArtSvgIcon icon="ri:home-line" />

  <!-- 自定义大小 -->
  <ArtSvgIcon icon="ri:user-line" class="text-2xl" />

  <!-- 自定义颜色 -->
  <ArtSvgIcon icon="ri:heart-fill" class="text-red-500" />

  <!-- 组合使用 -->
  <ArtSvgIcon icon="ri:star-fill" class="text-4xl text-yellow-500" />
</template>

<script setup>
import ArtSvgIcon from "@/components/core/base/art-svg-icon/index.vue";
</script>
```

#### 样式定制

通过 Tailwind CSS 类名控制图标样式：

```vue
<!-- 大小控制 -->
<ArtSvgIcon icon="ri:home-line" class="text-sm" />    <!-- 小 -->
<ArtSvgIcon icon="ri:home-line" class="text-base" />  <!-- 默认 -->
<ArtSvgIcon icon="ri:home-line" class="text-2xl" />   <!-- 大 -->
<ArtSvgIcon icon="ri:home-line" class="text-4xl" />   <!-- 超大 -->

<!-- 颜色控制 -->
<ArtSvgIcon icon="ri:heart-fill" class="text-red-500" />
<ArtSvgIcon icon="ri:star-fill" class="text-yellow-500" />
<ArtSvgIcon icon="ri:check-line" class="text-green-500" />
<ArtSvgIcon icon="ri:close-line" class="text-gray-500" />

<!-- 主题色 -->
<ArtSvgIcon icon="ri:home-line" class="text-theme" />
<ArtSvgIcon icon="ri:user-line" class="text-primary" />
<ArtSvgIcon icon="ri:settings-line" class="text-secondary" />
```

#### 离线图标使用

默认情况下，Iconify 会从 CDN 动态加载图标数据。如果你的项目部署在内网环境，需要启用离线图标支持。

**步骤 1: 安装离线图标包**

```bash
# 安装 Remix Icon（系统必需）
pnpm add -D @iconify-json/ri

# 安装其他图标集（可选）
pnpm add -D @iconify-json/svg-spinners
pnpm add -D @iconify-json/line-md

# 或一次性安装所有图标集（体积较大，不推荐）
pnpm add -D @iconify/json
```

**步骤 2: 配置离线图标加载器**

在 `src/utils/ui/iconify-loader.ts` 中配置需要加载的图标集：

```typescript
import { addCollection } from "@iconify/vue";

// 导入离线图标数据
import riIcons from "@iconify-json/ri/icons.json";
import lineMd from "@iconify-json/line-md/icons.json";

// 注册离线图标集
addCollection(riIcons);
addCollection(lineMd);
```

**步骤 3: 启用离线图标**

在 `src/main.ts` 中导入离线图标加载器：

```typescript
import "@utils/ui/iconify-loader"; // 离线图标加载
```

> **提示**:
> - 离线图标会在构建时打包到项目中，无需网络请求
> - 只需安装和注册实际使用的图标集，避免打包体积过大
> - 离线模式在内网和外网环境下都能正常工作
> - 如果你添加了新的图标集，需要：安装对应的 `@iconify-json/[icon-set-name]` 包 → 在 `iconify-loader.ts` 中导入并注册 → 重新启动开发服务器

---

### v2.x 版本 - Iconfont

> 注意：v3.0+ 版本已升级为 Iconify,以下内容仅适用于 v2.x 版本或需要兼容旧项目的情况。

项目图标使用 iconfont 提供，内置了 600+ 的图标，可以满足大部分的图标需求。

如果你需要添加或者自定义图标库，可以访问 [系统图标库](https://www.iconfont.cn/),进入后你可以把它添加到自己的项目中进行使用。

#### 使用方式

你可以在菜单中找到 Icon 图标，里面汇集了所有的图标，点击复制可以拿到图标的 Unicode 或 Font class。

**Unicode 用法**

```html
<i class="iconfont-sys">&#xe649;</i>
```

**Font class 用法**

```html
<i class="iconfont-sys iconsys-gou"></i>
```

#### 图标库目录

图标库目录：`src/assets/icons/system`

> **注意**: 为了方便用户拓展图标库，系统图默认使用 `iconfont-sys` 类名，而不是`iconfont`.

---

## 样式与主题

### 主题系统

项目基于 **Tailwind CSS v4** 构建，提供高度灵活的主题定制系统。

**配置文件**: `src/assets/styles/core/tailwind.css`

### CSS 主题变量

#### 基础颜色变量

```css
/* 文字颜色 */
color: var(--art-gray-100);  /* 最浅 */
color: var(--art-gray-500);  /* 中等 */
color: var(--art-gray-900);  /* 最深 */

/* 边框 */
border: 1px solid var(--default-border);
border: 1px solid var(--default-border-dashed);

/* 背景颜色 */
background-color: var(--default-bg-color);   /* 页面底色 */
background-color: var(--default-box-color);  /* 卡片/容器背景 */

/* 交互状态 */
background-color: var(--art-hover-color);    /* 悬停状态 */
background-color: var(--art-active-color);   /* 激活状态 */
```

#### 使用 Tailwind 工具类

```html
<!-- 文字颜色 -->
<div class="text-g-900">深色文字</div>
<div class="text-g-500">中等文字</div>
<div class="text-g-100">浅色文字</div>

<!-- 背景颜色 -->
<div class="bg-box">卡片背景</div>
<div class="bg-hover-color">悬停背景</div>

<!-- 边框 -->
<div class="border-full-d">完整边框</div>
<div class="border-b-d">底部边框</div>

<!-- 主题色 -->
<div class="bg-primary text-white">主题色背景</div>
<div class="text-primary">主题色文字</div>
```

### 主题色系统

项目使用 **OKLCH 色彩空间** 定义主题色，提供更准确的色彩表现：

```css
/* 主题色 */
color: var(--art-primary);   /* 主色 */
color: var(--art-secondary); /* 次要色 */
color: var(--art-success);   /* 成功色 */
color: var(--art-warning);   /* 警告色 */
color: var(--art-error);     /* 错误色 */
color: var(--art-info);      /* 信息色 */
color: var(--art-danger);    /* 危险色 */
```

#### Element Plus 主题色变体

系统自动生成 9 个不同深浅的主题色变体：

```css
/* 主题色变浅（数字越大越浅） */
background-color: var(--el-color-primary-light-1);  /* 最深 */
background-color: var(--el-color-primary-light-5);  /* 中等 */
background-color: var(--el-color-primary-light-9);  /* 最浅 */

/* 主题色变深（数字越大越深） */
background-color: var(--el-color-primary-dark-1);
background-color: var(--el-color-primary-dark-5);
background-color: var(--el-color-primary-dark-9);
```

### 灰度色系统

提供 9 个层级的灰度色，自动适配 Light/Dark 模式：

```css
/* CSS 变量方式 */
color: var(--art-gray-100);  /* 最浅 */
color: var(--art-gray-500);  /* 中等 */
color: var(--art-gray-900);  /* 最深 */

/* Tailwind 工具类方式 */
<div class="text-g-100">最浅文字</div>
<div class="text-g-500">中等文字</div>
<div class="text-g-900">最深文字</div>
```

### 布局工具类

项目扩展了 Tailwind CSS，提供实用的工具类组合：

```html
<!-- Flexbox 快捷类 -->
<div class="flex-c">     <!-- flex + items-center -->
  <div class="flex-b">   <!-- flex + justify-between -->
    <div class="flex-cc"><!-- flex + items-center + justify-center -->
      <div class="flex-cb"><!-- flex + items-center + justify-between -->
      </div>
    </div>
  </div>
</div>

<!-- 过渡动画 -->
<div class="tad-200">  <!-- transition-all duration-200 -->
  <div class="tad-300"><!-- transition-all duration-300 -->
  </div>
</div>

<!-- 边框工具类 -->
<div class="border-full-d">  <!-- 完整边框 -->
  <div class="border-b-d">   <!-- 底部边框 -->
    <div class="border-t-d"> <!-- 顶部边框 -->
      <div class="border-l-d"><!-- 左侧边框 -->
        <div class="border-r-d"><!-- 右侧边框 -->
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 其他工具类 -->
<div class="c-p">        <!-- cursor-pointer -->
<div class="rounded-custom-xs">  <!-- 小圆角 -->
<div class="rounded-custom-sm">  <!-- 中等圆角 -->
```

### 主题切换

#### 使用 useTheme Hook

```typescript
import { useTheme } from "@/hooks/core/useTheme";
import { SystemThemeEnum } from "@/enums/appEnum";

const { switchThemeStyles } = useTheme();

// 切换到暗色主题
switchThemeStyles(SystemThemeEnum.DARK);

// 切换到亮色主题
switchThemeStyles(SystemThemeEnum.LIGHT);

// 切换到自动模式（跟随系统）
switchThemeStyles(SystemThemeEnum.AUTO);
```

#### 自定义主题色

**修改预设主题色** (`src/config/index.ts`):

```typescript
systemMainColor: [
  "#5D87FF", // 默认蓝色
  "#B48DF3", // 紫色
  "#1D84FF", // 天蓝色
  "#60C041", // 绿色
  "#38C0FC", // 青色
  "#F9901F", // 橙色
  "#FF80C8", // 粉色
];
```

**动态设置主题色**:

```typescript
import { setElementThemeColor } from "@/utils/ui/colors";

// 设置自定义主题色
setElementThemeColor("#5D87FF");
```

### 主题色工具函数

完整的颜色处理工具位于 `src/utils/ui/colors.ts`：

```typescript
import {
  hexToRgba,      // Hex 转 RGBA
  hexToRgb,       // Hex 转 RGB
  rgbToHex,       // RGB 转 Hex
  getLightColor,  // 生成变浅的颜色
  getDarkColor,   // 生成变深的颜色
  colourBlend,    // 颜色混合
} from "@/utils/ui/colors";

// 生成变浅的颜色
const lightColor = getLightColor("#5D87FF", 0.3);

// 生成变深的颜色
const darkColor = getDarkColor("#5D87FF", 0.3);

// 颜色混合
const blendedColor = colourBlend("#5D87FF", "#FFFFFF", 0.5);
```

---

### Element Plus 样式调优

项目对 Element Plus 部分组件 UI 进行了调优，以获得更好的视觉效果。

**配置文件**: `src/assets/styles/core/el-ui.scss`

#### 主要调优内容

**1. 组件高度统一**

```scss
:root {
  --el-component-custom-height: 36px !important;
  --el-component-size: var(--el-component-custom-height) !important;
}

// 按钮、表单、选择器等默认大小统一为 36px
.el-button--default {
  height: var(--el-component-custom-height) !important;
}
.el-select--default .el-select__wrapper {
  min-height: var(--el-component-custom-height) !important;
}
```

**2. 圆角优化**

```scss
:root {
  --el-border-radius-base: calc(var(--custom-radius) / 3 + 2px) !important;
  --el-border-radius-small: calc(var(--custom-radius) / 3 + 4px) !important;
  --el-messagebox-border-radius: calc(var(--custom-radius) / 3 + 4px) !important;
}

.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pager li {
  border-radius: 6px;
}
```

**3. Dialog 弹窗优化**

```scss
.el-dialog {
  border-radius: calc(var(--custom-radius) / 1.2 + 2px) !important;
  overflow: hidden;
}

.el-dialog__body {
  padding: 25px 0 !important;
  position: relative;
}

// 弹窗动画
@keyframes dialog-open {
  0% { opacity: 0; transform: scale(0.2); }
  100% { opacity: 1; transform: scale(1); }
}
```

**4. Dropdown 和 Select 下拉优化**

```scss
.el-dropdown-menu {
  padding: 6px !important;
  border-radius: 10px !important;
  border: none !important;

  .el-dropdown-menu__item {
    padding: 6px 16px !important;
    border-radius: 6px !important;

    &:hover:not(.is-disabled) {
      background-color: var(--art-el-active-color) !important;
    }
  }
}

// 隐藏下拉三角
.el-select__popper,
.el-dropdown__popper {
  .el-popper__arrow {
    display: none;
  }
}
```

**5. 复选框/单选按钮优化**

```scss
// 复选框
.el-checkbox--default .el-checkbox__inner {
  width: 16px !important;
  height: 16px !important;
  border-radius: 4px !important;
}

// 单选按钮
.el-radio--default .el-radio__input .el-radio__inner {
  width: 16px;
  height: 16px;
}
```

**6. Message 消息提示优化**

```scss
.el-message {
  background-color: var(--default-box-color) !important;
  border: 0 !important;
  box-shadow:
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05) !important;
}
```

**7. 菜单动画优化**

```scss
// 折叠展开动画（提升流畅度）
.el-menu.el-menu--inline {
  transition: max-height 0.26s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

// hover 动画（提升跟手感）
.el-sub-menu__title,
.el-menu-item {
  transition: background-color 0s !important;
}
```

---

### 最佳实践

**1. 优先使用 Tailwind 工具类**

```html
<!-- ✅ 推荐 -->
<div class="flex items-center gap-4 p-4 bg-box rounded-lg"></div>

<!-- ❌ 不推荐 -->
<div style="display: flex; align-items: center; gap: 1rem;"></div>
```

**2. 使用 CSS 变量保持一致性**

```css
/* ✅ 推荐 - 自动适配主题 */
.my-component {
  color: var(--art-gray-900);
  background: var(--default-box-color);
}

/* ❌ 不推荐 - 硬编码颜色 */
.my-component {
  color: #323251;
  background: #ffffff;
}
```

**3. 使用语义化的颜色变量**

```css
/* ✅ 推荐 */
border-color: var(--default-border);
background: var(--art-hover-color);

/* ❌ 不推荐 */
border-color: #e2e8ee;
background: #f2f4f5;
```

**4. 利用工具类组合**

```html
<!-- ✅ 推荐 - 使用预定义的组合类 -->
<div class="flex-cb tad-300"></div>

<!-- ❌ 不推荐 - 重复写完整的类 -->
<div class="flex items-center justify-between transition-all duration-300"></div>
```

### 响应式设计

使用 Tailwind 的响应式前缀：

```html
<!-- 移动端优先 -->
<div class="text-sm md:text-base lg:text-lg">响应式文字大小</div>

<!-- 不同屏幕下的布局 -->
<div class="flex-col md:flex-row">响应式布局</div>
```

### 内置全局组件

项目内置了丰富的全局组件，可在任何地方直接使用：

**配置文件**: `src/config/modules/component.ts`

| 组件 | 说明 |
|------|------|
| `settings-panel` | 设置面板 |
| `global-search` | 全局搜索 |
| `screen-lock` | 锁屏功能 |
| `chat-window` | 聊天窗口 |
| `fireworks-effect` | 礼花效果 |
| `watermark` | 水印效果 |

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
