# Art Design Pro 统一开发规范

> 📘 完整的开发规范指南，涵盖代码规范、项目结构、开发流程、最佳实践  
> **版本**: 2026-04-07 | **技术栈**: Vue 3.5 + TypeScript + Vite

---

## 目录

1. [开发前必读](#1-开发前必读)
2. [代码规范](#2-代码规范)
3. [项目结构规范](#3-项目结构规范)
4. [组件开发规范](#4-组件开发规范)
5. [页面开发规范](#5-页面开发规范)
6. [API 开发规范](#6-api 开发规范)
7. [状态管理规范](#7-状态管理规范)
8. [路由开发规范](#8-路由开发规范)
9. [样式规范](#9-样式规范)
10. [Git 工作流](#10-git 工作流)
11. [开发流程](#11-开发流程)
12. [最佳实践](#12-最佳实践)

---

## 1. 开发前必读

### 1.1 新项目开发流程

```
需求 → Brainstorming → 设计文档 → 用户批准 → 实现计划 → 编码 → 测试 → 提交
```

**⚠️ 重要**: 任何新功能都必须先经过 brainstorming 流程，编写设计文档并获得用户批准后，才能开始编码。

### 1.2 环境要求

- Node.js >= 20.19.0
- pnpm >= 8.8.0
- 推荐编辑器：VS Code

### 1.3 必装插件

- Vue - Official
- ESLint
- Prettier
- Stylelint
- Tailwind CSS IntelliSense

---

## 2. 代码规范

### 2.1 基础语法

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

| 规则     | 要求               | ESLint 配置                                     |
| -------- | ------------------ | ----------------------------------------------- |
| 引号     | 使用单引号         | `quotes: ['error', 'single']`                   |
| 分号     | 语句末尾不加分号   | `semi: ['error', 'never']`                      |
| 变量声明 | 禁止使用 var       | `no-var: 'error'`                               |
| 空行     | 不允许多个连续空行 | `no-multiple-empty-lines: ['warn', { max: 1 }]` |

### 2.2 TypeScript 规范

```typescript
// ✅ 正确
interface UserInfo {
  id: string
  name: string
  email?: string
}

type Role = 'admin' | 'user' | 'guest'

// ❌ 错误
interface UserInfo {
  // 任意类型
  id: any
  name: any
}
```

**要求**:

- 所有函数参数和返回值必须标注类型
- 对象必须使用 interface 或 type 定义
- 禁止使用 any 类型

### 2.3 Vue 组件规范

```vue
<script setup lang="ts">
  // 1. 导入顺序：Vue → 路由 → Store → 组件 → 工具 → 类型
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/modules/user'
  import ArtTable from '@/components/ArtTable.vue'
  import { formatDate } from '@/utils'
  import type { UserInfo } from '@/types'

  // 2. 使用 definesProps/defineEmits
  const props = defineProps<{
    title: string
    visible?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'submit', data: UserInfo): void
  }>()

  // 3. 响应式数据
  const loading = ref(false)
  const tableData = ref<UserInfo[]>([])

  // 4. 计算属性
  const isEmpty = computed(() => tableData.value.length === 0)

  // 5. 函数（按调用顺序排列）
  const handleSubmit = async () => {
    loading.value = true
    try {
      // 处理逻辑
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <!-- 单个根元素 -->
  <div class="container">
    <!-- 内容 -->
  </div>
</template>
```

---

## 3. 项目结构规范

### 3.1 目录结构

```
src/
├── api/                    # API 接口层
│   ├── auth.ts            # 认证接口
│   ├── user.ts            # 用户接口
│   ├── system-manage.ts   # 系统管理接口
│   └── trade-manage.ts    # 外贸管理接口
├── assets/                 # 静态资源
├── components/             # 公共组件
├── composables/            # 组合式函数
├── directives/             # 自定义指令
├── enums/                  # 枚举定义
├── hooks/                  # Hooks
│   └── core/              # 核心 Hooks
├── layouts/                # 布局组件
├── mock/                   # Mock 数据
│   ├── data/              # JSON 数据文件
│   └── temp/              # Mock 逻辑初始化
├── router/                 # 路由配置
│   ├── guards/            # 路由守卫
│   ├── modules/           # 模块化路由
│   └── routes/            # 路由定义
├── store/                  # Pinia 状态管理
│   └── modules/           # 状态模块
├── styles/                 # 全局样式
├── types/                  # TypeScript 类型定义
├── utils/                  # 工具函数
└── views/                  # 页面组件
```

### 3.2 文件命名

| 类型       | 命名规则         | 示例              |
| ---------- | ---------------- | ----------------- |
| Vue 组件   | 小写 + 连字符    | `user-list.vue`   |
| 组合式函数 | 小驼峰，use 前缀 | `useTable.ts`     |
| Store 模块 | 小写             | `user.ts`         |
| API 文件   | 小写 + 连字符    | `trade-manage.ts` |
| 工具函数   | 小写             | `format-date.ts`  |
| 类型定义   | 小写             | `user.ts`         |
| 枚举       | 小写             | `role-enum.ts`    |

### 3.3 路径别名

```typescript
// vite.config.ts 配置
'@': 'src/'
'@views': 'src/views/'
'@utils': 'src/utils/'
'@stores': 'src/store/'
'@styles': 'src/assets/styles/'
'@mock': 'src/mock/'
'@imgs': 'src/assets/images/'
'@icons': 'src/assets/icons/'
```

---

## 4. 组件开发规范

### 4.1 组件分类

| 类型     | 路径                   | 说明                                 |
| -------- | ---------------------- | ------------------------------------ |
| 核心组件 | `components/core/`     | 全局通用组件（ArtTable、ArtForm 等） |
| 业务组件 | `components/business/` | 业务特定组件                         |
| 页面组件 | `views/`               | 页面级组件                           |

### 4.2 组件 Props 规范

```typescript
// ✅ 正确
const props = defineProps<{
  // 必填
  title: string
  // 可选
  visible?: boolean
  // 带默认值
  size?: 'small' | 'medium' | 'large'
  // 数组
  tags?: string[]
  // 对象
  config?: TableConfig
  // 函数
  onSubmit?: (data: FormData) => void
}>()

// ❌ 错误：缺少类型
const props = defineProps({
  title: String,
  visible: Boolean
})
```

### 4.3 组件事件规范

```typescript
// ✅ 正确：使用 defineEmits
const emit = defineEmits<{
  // v-model 支持
  (e: 'update:modelValue', value: string): void
  // 普通事件
  (e: 'submit', data: FormData): void
  (e: 'cancel'): void
  (e: 'change', value: string): void
}>()

// 触发事件
emit('submit', formData)
```

### 4.4 插槽使用

```vue
<template>
  <div class="card">
    <!-- 默认插槽 -->
    <slot></slot>

    <!-- 具名插槽 -->
    <slot name="header"></slot>
    <slot name="footer"></slot>

    <!-- 作用域插槽 -->
    <slot :row="rowData" :index="index"></slot>
  </div>
</template>
```

---

## 5. 页面开发规范

### 5.1 新建页面步骤

```
1. 创建页面组件 → 2. 注册路由 → 3. 测试访问 → 4. 提交代码
```

**1. 创建页面组件** (`src/views/module/page.vue`)

**2. 注册路由** (`src/router/modules/module.ts`)

```typescript
{
  path: '/module/page',
  name: 'ModulePage',
  component: '/module/page',
  meta: {
    title: '页面标题',
    icon: 'ri:xxx-line',
    keepAlive: true,
    roles: ['R_SUPER', 'R_ADMIN']
  }
}
```

**3. 访问测试**: `http://localhost:3006/#/module/page`

**4. 提交代码**: `pnpm commit`

### 5.2 页面组件要求

- ✅ 必须有**单个根元素**（路由动画要求）
- ✅ 注释不能放在根元素外部
- ✅ 使用 `art-full-height` 类让页面最小高度撑满屏幕
- ✅ 使用 `art-card`、`art-table-card` 等内置样式

### 5.3 页面结构模板

```vue
<template>
  <div class="art-full-height">
    <!-- 页头 -->
    <div class="art-card">
      <div class="art-card-header">
        <h2>页面标题</h2>
      </div>
      <div class="art-card-body">
        <!-- 搜索栏 -->
        <ArtSearchBar v-model:search-params="searchParams" />

        <!-- 表格 -->
        <ArtTable
          v-model:data="tableData"
          v-model:loading="loading"
          v-model:pagination="pagination"
        >
          <!-- 操作列 -->
          <template #actions="{ row }">
            <ArtButtonTable @edit="handleEdit(row)" @delete="handleDelete(row)" />
          </template>
        </ArtTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useTable } from '@/hooks'

  const searchParams = ref({})
  const pagination = ref({ current: 1, size: 10, total: 0 })

  const {
    data: tableData,
    loading,
    getData
  } = useTable({
    core: {
      apiFn: fetchList,
      immediate: true
    }
  })

  const handleEdit = (row: any) => {
    // 编辑逻辑
  }

  const handleDelete = async (row: any) => {
    // 删除逻辑
  }
</script>
```

---

## 6. API 开发规范

### 6.1 API 文件结构

```typescript
// src/api/module.ts
import { http } from '@/utils/http'

// 请求参数类型
interface ListQuery {
  current: number
  size: number
  keyword?: string
}

// 响应数据类型
interface ListItem {
  id: string
  name: string
}

interface ListResponse {
  list: ListItem[]
  total: number
}

// API 函数
export function fetchList(query: ListQuery) {
  return http.get<ListResponse>('/api/module/list', query)
}

export function fetchDetail(id: string) {
  return http.get<ListItem>(`/api/module/${id}`)
}

export function create(data: Partial<ListItem>) {
  return http.post<ListItem>('/api/module', data)
}

export function update(id: string, data: Partial<ListItem>) {
  return http.put<ListItem>(`/api/module/${id}`, data)
}

export function remove(id: string) {
  return http.delete(`/api/module/${id}`)
}
```

### 6.2 响应格式

```typescript
// 基础响应结构
interface BaseResponse<T = unknown> {
  code: number // 状态码：200 成功
  msg: string // 响应消息
  data: T // 响应数据
}

// HTTP 封装自动返回 data 字段
const result = await fetchList({ current: 1, size: 10 })
// result 直接是 { list, total } 而不是完整响应
```

### 6.3 API 命名规范

| 操作 | 函数前缀          | HTTP 方法 |
| ---- | ----------------- | --------- |
| 列表 | `fetchGet~List`   | GET       |
| 详情 | `fetchGet~Detail` | GET       |
| 创建 | `fetchCreate~`    | POST      |
| 更新 | `fetchUpdate~`    | PUT       |
| 删除 | `fetchDelete~`    | DELETE    |

---

## 7. 状态管理规范

### 7.1 Store 模块结构

```typescript
// src/store/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // State
    const isLogin = ref(false)
    const userInfo = ref<UserInfo | null>(null)
    const accessToken = ref('')

    // Getters
    const isLoggedIn = computed(() => isLogin.value)
    const userName = computed(() => userInfo.value?.name || '')

    // Actions
    const setUserInfo = (info: UserInfo) => {
      userInfo.value = info
    }

    const login = async (credentials: LoginParams) => {
      const { token } = await fetchLogin(credentials)
      accessToken.value = token
      isLogin.value = true
    }

    const logout = () => {
      isLogin.value = false
      userInfo.value = null
      accessToken.value = ''
      router.push('/login')
    }

    return {
      // State
      isLogin,
      userInfo,
      accessToken,
      // Getters
      isLoggedIn,
      userName,
      // Actions
      setUserInfo,
      login,
      logout
    }
  },
  {
    persist: {
      key: 'user',
      storage: localStorage
    }
  }
)
```

### 7.2 持久化配置

```typescript
// 需要持久化的状态
{
  persist: {
    key: 'store-name',
    storage: localStorage,
    paths: ['accessToken', 'userInfo']  // 指定持久化的字段
  }
}
```

---

## 8. 路由开发规范

### 8.1 路由配置位置

| 路由类型 | 配置位置                            | 说明                    |
| -------- | ----------------------------------- | ----------------------- |
| 静态路由 | `src/router/routes/staticRoutes.ts` | 登录/404/500 等公共页面 |
| 动态路由 | `src/router/modules/*.ts`           | 需要权限的业务页面      |

### 8.2 Meta 属性说明

```typescript
{
  path: '/example',
  component: '/example',
  meta: {
    title: '页面标题',           // 页面标题
    icon: 'ri:xxx-line',       // 菜单图标
    keepAlive: true,           // 是否缓存页面
    fixedTab: true,            // 是否固定标签页
    isHide: true,              // 是否隐藏菜单
    isHideTab: true,           // 是否隐藏标签页
    isIframe: true,            // 是否为 iframe
    link: 'https://...',       // 外链地址
    roles: ['R_SUPER'],        // 允许访问的角色
    activePath: '/parent',     // 激活的父级菜单
    authList: [                // 按钮权限
      { title: '新增', authMark: 'add' },
      { title: '编辑', authMark: 'edit' }
    ]
  }
}
```

### 8.3 路由模块导出

```typescript
// src/router/modules/module.ts
import { AppRouteRecord } from '@/types/router'

export const moduleRoutes: AppRouteRecord = {
  path: '/module',
  name: 'Module',
  component: '/index/index',
  meta: {
    title: '模块标题',
    icon: 'ri:xxx-line'
  },
  children: [
    // 子路由
  ]
}
```

---

## 9. 样式规范

### 9.1 样式优先级

```
Tailwind CSS 类 > 内置类名 > 自定义 SCSS
```

### 9.2 内置类名

| 类名              | 用途     |
| ----------------- | -------- |
| `art-card`        | 卡片容器 |
| `art-card-header` | 卡片头部 |
| `art-card-body`   | 卡片内容 |
| `art-table-card`  | 表格容器 |
| `art-full-height` | 全高容器 |

### 9.3 CSS 变量

```scss
// 使用 CSS 变量保持主题一致性
.element {
  background: var(--el-bg-color);
  color: var(--default-text-color);
  border-color: var(--default-border-color);
}
```

### 9.4 Tailwind CSS

```vue
<template>
  <!-- ✅ 正确 -->
  <div class="flex items-center justify-between p-4">
    <span class="text-gray-600">文本</span>
    <button class="px-4 py-2 bg-blue-500 text-white rounded">按钮</button>
  </div>
</template>
```

---

## 10. Git 工作流

### 10.1 分支规范

```
main          - 主分支（生产环境）
dev           - 开发分支
feature/xxx   - 功能分支
fix/xxx       - 修复分支
```

### 10.2 提交规范

使用 `pnpm commit` 调用 cz-git:

```bash
feat: 新增订单管理模块
fix: 修复报价单编辑数据无法加载的问题
docs: 更新开发文档
refactor: 重构用户信息表单逻辑
style: 格式化代码
test: 添加单元测试
chore: 更新依赖版本
```

### 10.3 提交流程

```bash
# 1. 添加文件
git add .

# 2. 交互式提交
pnpm commit

# 3. 推送（需要用户明确指令）
git push
```

**⚠️ 注意**: 不要在 commit 后自动 push，必须等用户明确说"推送"时才执行。

---

## 11. 开发流程

### 11.1 新功能开发流程

```mermaid
graph LR
    A[需求] --> B[Brainstorming]
    B --> C[设计文档]
    C --> D[用户批准]
    D --> E[实现计划]
    E --> F[编码]
    F --> G[测试]
    G --> H[提交]
```

### 11.2 页面开发 Checklist

- [ ] 创建页面组件 (`src/views/module/page.vue`)
- [ ] 注册路由 (`src/router/modules/module.ts`)
- [ ] 创建 API 接口 (`src/api/module.ts`)
- [ ] 创建 Store 模块 (如需要)
- [ ] 测试页面访问
- [ ] 测试 CRUD 功能
- [ ] 代码格式化 (`pnpm lint:fix`)
- [ ] 类型检查 (`pnpm type-check`)
- [ ] 提交代码 (`pnpm commit`)

### 11.3 清理演示数据

```bash
pnpm clean:dev
```

清理 LocalStorage 中的 Mock 数据，恢复为初始 JSON 文件数据。

---

## 12. 最佳实践

### 12.1 useTable 使用

```typescript
const {
  data, // 表格数据
  loading, // 加载状态
  pagination, // 分页信息
  searchParams, // 搜索参数
  getData, // 获取数据
  refreshData, // 刷新数据
  refreshCreate, // 创建后刷新
  refreshUpdate, // 更新后刷新
  refreshRemove, // 删除后刷新
  resetSearchParams // 重置搜索
} = useTable({
  core: {
    apiFn: fetchList,
    immediate: true // 自动加载
  },
  performance: {
    enableCache: true // 启用缓存
  }
})
```

### 12.2 错误处理

```typescript
try {
  await fetchData()
} catch (error) {
  // 使用 Element Plus Message
  ElMessage.error('操作失败')

  // 或使用全局错误处理
  console.error(error)
}
```

### 12.3 异步操作

```typescript
// ✅ 正确：使用 try-finally 确保状态恢复
const handleSubmit = async () => {
  loading.value = true
  try {
    await apiCall()
    ElMessage.success('操作成功')
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    loading.value = false
  }
}
```

### 12.4 图标使用

```vue
<template>
  <!-- Remix Icon -->
  <Icon icon="ri:user-line" />

  <!-- 自定义 SVG -->
  <ArtSvgIcon icon="ri:mail-line" />

  <!-- 添加新图标集 -->
  <!-- pnpm add -D @iconify-json/xxx -->
</template>
```

### 12.5 Mock 数据开发

```typescript
// 开发环境自动使用 Mock
// 生产环境切换真实 API

// Mock 数据位置：src/mock/data/
// LocalStorage Key: trade_xxx_list
```

---

## 附录

### A. 常用命令

```bash
pnpm install          # 安装依赖
pnpm dev              # 启动开发服务器
pnpm build            # 生产打包
pnpm lint             # ESLint 检查
pnpm lint:fix         # ESLint 自动修复
pnpm format           # 代码格式化
pnpm type-check       # TypeScript 类型检查
pnpm commit           # Git 提交
pnpm clean:dev        # 清理演示数据
```

### B. 相关链接

- **官方文档**: https://www.artd.pro/docs
- **演示地址**: https://www.artd.pro
- **GitHub**: https://github.com/Daymychen/art-design-pro

---

<div align="center">
  <p>Art Design Pro © 2024-2026</p>
  <p>统一开发规范 v1.0</p>
</div>
