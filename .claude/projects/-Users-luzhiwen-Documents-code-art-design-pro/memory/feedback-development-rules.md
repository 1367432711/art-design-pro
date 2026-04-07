---
name: 统一开发规范必须遵守
description: 所有代码必须遵循 DEVELOPMENT-STANDARDS.md 中的规范
type: feedback
---

**规则**: 编写任何代码时都必须严格遵守 `DEVELOPMENT-STANDARDS.md` 中的开发规范

**为什么**: 保持代码一致性、可读性和可维护性

**如何应用**:

### 代码规范

- 使用单引号 `'`，不使用双引号 `"`
- 语句末尾不加分号 `;`
- 禁止使用 `var`，使用 `let` 或 `const`
- 不允许多个连续空行
- 所有函数参数和返回值必须标注类型
- 禁止使用 `any` 类型

### 新功能开发流程

```
需求 → Brainstorming → 设计文档 → 用户批准 → 实现计划 → 编码
```

⚠️ 任何新功能都必须先经过 brainstorming，写设计文档并获得用户批准后才能编码

### Git 提交规范

使用 `pnpm commit` 调用 cz-git:

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档变更
- `refactor:` 重构
- `style:` 代码格式
- `test:` 测试相关
- `chore:` 构建/工具链

⚠️ 不要在 commit 后自动 push，必须等用户明确说"推送"时才执行

### 页面开发规范

- 页面组件必须有单个根元素
- 注释不能放在根元素外部
- 使用 `art-full-height`、`art-card` 等内置类名

### 样式规范

- 优先使用 Tailwind CSS 和内置类名
- 使用 CSS 变量保持主题一致性

### API 开发规范

- 基础响应结构：`{ code, msg, data }`
- HTTP 封装默认返回 `data` 字段
- 函数命名：`fetchGet~List`、`fetchCreate~` 等

### 组件规范

- Props 使用 `defineProps<{ 字段：类型 }>()` 泛型语法
- Events 使用 `defineEmits<{ (e: '事件', 参数): void }>()` 泛型语法

---

**违反示例**:

- ❌ 用户："新增一个订单页面" → 直接开始写代码
- ✅ 用户："新增一个订单页面" → 启动 brainstorming 流程

**遵守示例**:

- ✅ 代码使用单引号、无分号
- ✅ 所有类型都有标注
- ✅ 使用 `pnpm commit` 提交
- ✅ 等待用户明确指令后再 push
