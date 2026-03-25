# Art Design Pro 项目开发规范

## 核心开发规则

请严格遵守以下开发规范，所有代码修改都应参考 `DEVELOPMENT.md` 文档：

### 代码规范

- 使用单引号，不使用双引号
- 语句末尾不加分号
- 禁止使用 var，使用 let/const
- 不允许多个连续空行

### 样式规范

- 优先使用 `art-card`、`art-table-card`、`art-full-height` 等系统内置类名
- 使用 Tailwind CSS 工具类优先于自定义 SCSS
- 使用 CSS 变量保持主题一致性：`var(--el-bg-color)`, `var(--default-box-color)` 等
- 卡片样式统一使用 `art-card` 类
- 表格容器使用 `art-table-card` 类
- 全高容器使用 `art-full-height` 类

### 组件使用

- 表格使用 `ArtTable` 组件而非原生 `ElTable`
- 操作按钮使用 `ArtButtonTable` 组件
- 图标使用 `ArtSvgIcon` 或 `Icon` (Iconify) 组件

### 页面开发流程

1. 创建页面组件 → 2. 注册到路由 → 3. 测试访问 → 4. 提交代码

### 其他规范

- 页面组件必须有单个根元素（路由动画要求）
- 注释不能放在根元素外部
- 响应数据字段遵循 `BaseResponse<T>` 格式
