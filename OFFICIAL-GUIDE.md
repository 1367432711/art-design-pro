# Art Design Pro - 官方开发文档整合

> 📚 基于官方文档 (https://www.artd.pro/docs) 的完整开发指南  
> **注意**: 本文档为框架结构，具体章节内容需根据官方文档逐步填充

**最后更新**: 2026-04-07

---

## 文档导航

| 阶段   | 文档                             | 状态      |
| ------ | -------------------------------- | --------- |
| 入门   | [开始](#1-开始)                  | ⏳ 待填充 |
| 入门   | [介绍](#2-介绍)                  | ⏳ 待填充 |
| 入门   | [快速开始](#3-快速开始)          | ⏳ 待填充 |
| 入门   | [精简版本](#4-精简版本)          | ⏳ 待填充 |
| 入门   | [必读文档](#5-必读文档)          | ⏳ 待填充 |
| 入门   | [同步代码](#6-同步代码)          | ⏳ 待填充 |
| 基础   | [项目结构](#7-项目结构)          | ✅ 已有   |
| 基础   | [组件库](#8-组件库)              | ⏳ 待填充 |
| 基础   | [路由和菜单](#9-路由和菜单)      | ✅ 已有   |
| 基础   | [系统配置](#10-系统配置)         | ⏳ 待填充 |
| 基础   | [主题配置](#11-主题配置)         | ⏳ 待填充 |
| 基础   | [图标](#12-图标)                 | ✅ 已有   |
| 基础   | [环境变量](#13-环境变量)         | ✅ 已有   |
| 基础   | [构建和部署](#14-构建和部署)     | ⏳ 待填充 |
| 深入   | [国际化](#15-国际化)             | ⏳ 待填充 |
| 深入   | [权限管理](#16-权限管理)         | ⏳ 待填充 |
| 深入   | [脚本](#17-脚本)                 | ⏳ 待填充 |
| Hooks  | [UseTable](#18-useTable)         | ✅ 已有   |
| 组件   | [ArtSearchBar](#19-artSearchBar) | ⏳ 待填充 |
| 工程化 | [规范](#20-规范)                 | ✅ 已有   |

---

## 1. 开始

> 官方文档：https://www.artd.pro/docs/zh/guide/start.html

**待填充内容**:

- 开发环境要求
- 推荐编辑器配置
- 必备插件

---

## 2. 介绍

> 官方文档：https://www.artd.pro/docs/zh/guide/introduce.html

**待填充内容**:

- 项目定位
- 核心特性
- 技术选型理由
- 适用场景

---

## 3. 快速开始

> 官方文档：https://www.artd.pro/docs/zh/guide/quick-start.html

**待填充内容**:

- 项目克隆
- 依赖安装
- 启动命令
- 访问地址

---

## 4. 精简版本

> 官方文档：https://www.artd.pro/docs/zh/guide/lite.html

**待填充内容**:

- 精简版与完整版区别
- 如何选择版本
- 精简版功能列表

---

## 5. 必读文档

> 官方文档：https://www.artd.pro/docs/zh/guide/must-read.html

**待填充内容**:

- 核心概念
- 架构设计
- 开发流程

---

## 6. 同步代码

> 官方文档：https://www.artd.pro/docs/zh/guide/sync-code.html

**待填充内容**:

- Git 工作流
- 代码同步策略
- 冲突处理

---

## 7. 项目结构

> 官方文档：https://www.artd.pro/docs/zh/guide/project-structure.html

**当前项目实际结构**:

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

**详细说明**: 见 [findings.md](./findings.md#3-项目目录结构)

---

## 8. 组件库

> 官方文档：https://www.artd.pro/docs/zh/guide/components.html

**待填充内容**:

- Element Plus 组件使用
- 自定义组件列表
- 组件开发规范

**当前项目核心组件**: | 组件 | 用途 | 路径 | |------|------|------| | ArtTable | 企业级表格 | `src/components/AdvancedTable/ArtTable.vue` | | ArtSearchBar | 搜索栏 | `src/components/ArtSearchBar/index.vue` | | ArtButtonTable | 表格操作按钮 | `src/components/ArtButtonTable/index.vue` | | ArtSvgIcon | SVG 图标 | `src/components/SvgIcon/index.vue` | | Icon | Iconify 图标 | 全局注册 |

---

## 9. 路由和菜单

> 官方文档：https://www.artd.pro/docs/zh/guide/router.html

**当前项目配置**:

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

**详细说明**: 见 [findings.md](./findings.md#8-路由配置)

---

## 10. 系统配置

> 官方文档：https://www.artd.pro/docs/zh/guide/system-config.html

**待填充内容**:

- 配置文件位置
- 可配置项列表
- 动态配置方法

---

## 11. 主题配置

> 官方文档：https://www.artd.pro/docs/zh/guide/theme.html

**待填充内容**:

- 主题切换原理
- 自定义主题色
- 暗黑模式配置

**当前项目实现**:

- 使用 `useTheme` Hook 进行主题切换
- CSS 变量存储主题色
- LocalStorage 持久化主题选择

---

## 12. 图标

> 官方文档：https://www.artd.pro/docs/zh/guide/icon.html

**当前项目配置**:

### 已注册图标集

| 图标集            | 用途         |
| ----------------- | ------------ |
| `ri` - Remix Icon | 系统必要图标 |
| `svg-spinners`    | SVG 旋转动画 |
| `line-md`         | Line MD 图标 |

### 使用方式

```vue
<template>
  <ArtSvgIcon icon="ri:mail-line" />
  <Icon icon="ri:user-line" />
</template>
```

### 添加新图标集

```bash
pnpm add -D @iconify-json/[icon-set-name]
```

然后在 `src/utils/ui/iconify-loader.ts` 中注册。

**详细说明**: 见 [CLAUDE.md](./CLAUDE.md#组件使用)

---

## 13. 环境变量

> 官方文档：https://www.artd.pro/docs/zh/guide/env.html

**当前项目配置**:

| 变量                 | 说明         | 默认值    |
| -------------------- | ------------ | --------- |
| `VITE_VERSION`       | 应用版本     | `0.0.0`   |
| `VITE_PORT`          | 开发端口     | `5173`    |
| `VITE_BASE_URL`      | 基础路径     | `/`       |
| `VITE_API_URL`       | API 地址     | -         |
| `VITE_API_PROXY_URL` | API 代理地址 | -         |
| `VITE_ACCESS_MODE`   | 权限模式     | `backend` |

**详细说明**: 见 [findings.md](./findings.md#12-环境配置)

---

## 14. 构建和部署

> 官方文档：https://www.artd.pro/docs/zh/guide/build.html

**待填充内容**:

- 生产构建命令
- 部署流程
- Nginx 配置示例
- Docker 部署

**当前项目命令**:

```bash
pnpm build        # 生产打包
pnpm preview      # 预览构建结果
pnpm clean:dev    # 清理演示数据
```

---

## 15. 国际化

> 官方文档：https://www.artd.pro/docs/zh/guide/i18n.html

**待填充内容**:

- 多语言配置
- 翻译文件结构
- 语言切换方法

---

## 16. 权限管理

> 官方文档：https://www.artd.pro/docs/zh/guide/permission.html

**当前项目实现**:

### 权限模式

| 模式       | 说明                        |
| ---------- | --------------------------- |
| `backend`  | 后端控制菜单路由权限 (推荐) |
| `frontend` | 前端控制菜单路由权限        |

### 权限实现

- 登录获取 Token
- 根据用户角色动态加载路由
- 路由守卫验证权限

**待填充内容**:

- 权限配置详解
- 按钮级权限控制

---

## 17. 脚本

> 官方文档：https://www.artd.pro/docs/zh/guide/scripts.html

**当前项目命令**:

```bash
# 开发
pnpm dev          # 启动开发服务器

# 构建
pnpm build        # 生产打包
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

---

## 18. UseTable

> 官方文档：https://www.artd.pro/docs/zh/guide/use-table.html

**位置**: `src/hooks/core/useTable.ts`

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

**详细说明**: 见 [findings.md](./findings.md#6-core-hook-和组件)

---

## 19. ArtSearchBar

> 官方文档：https://www.artd.pro/docs/zh/guide/art-search-bar.html

**待填充内容**:

- 组件 Props
- 使用示例
- 最佳实践

**当前项目使用**:

```vue
<template>
  <ArtSearchBar
    v-model:search-params="searchParams"
    :fields="searchFields"
    @search="handleSearch"
    @reset="handleReset"
  />
</template>
```

---

## 20. 规范

> 官方文档：https://www.artd.pro/docs/zh/guide/standard.html

**当前项目规范**:

### 代码规范

- 使用单引号 `'`
- 语句末尾不加分号 `;`
- 禁止使用 `var`
- 不允许多个连续空行

### Git 提交规范

使用 `pnpm commit` 调用 cz-git:

| 类型        | 说明        |
| ----------- | ----------- |
| `feat:`     | 新功能      |
| `fix:`      | 修复 bug    |
| `docs:`     | 文档变更    |
| `refactor:` | 重构        |
| `style:`    | 代码格式    |
| `test:`     | 测试相关    |
| `chore:`    | 构建/工具链 |

**详细说明**: 见 [CLAUDE.md](./CLAUDE.md)

---

## 待补充章节

以下是官方文档可能存在但当前项目文档中尚未详细记录的章节:

- [ ] 组件库详细使用指南
- [ ] 系统配置详解
- [ ] 主题配置详解
- [ ] 构建和部署完整流程
- [ ] 国际化配置
- [ ] 权限管理详解
- [ ] ArtSearchBar 组件文档
- [ ] 其他 Hooks 函数文档

---

<div align="center">
  <p>Art Design Pro - 官方开发文档整合</p>
  <p>最后更新：2026-04-07</p>
</div>
