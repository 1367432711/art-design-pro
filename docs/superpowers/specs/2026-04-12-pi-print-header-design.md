# PI 打印模板头部设计

**创建时间**: 2026-04-12  
**状态**: 已实现  
**风格**: Apple 极简主义 / 瑞士现代主义

---

## 1. 设计目标

创建高端、专业、简洁的 PI 打印模板头部，符合国际贸易单据的专业形象。

---

## 2. 设计理念

### 2.1 核心原则

- **极简主义**: 去除多余装饰，回归信息本质
- **层次感**: 通过字号、字重、颜色建立清晰的视觉层级
- **对齐**: 严格的网格对齐，视觉平衡
- **留白**: 适当的负空间，提升阅读体验

### 2.2 参考风格

- **Apple 官网**: 简洁、现代、高端
- **瑞士平面设计**: 网格系统、无衬线字体、不对称平衡
- **国际贸易单据**: 专业、正式、信息密度适中

---

## 3. 布局设计

### 3.1 三栏网格布局

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌────┐  ┌─────────────────────────┐  ┌─────────────────────┐  │
│  │ XL │  │ SHANDONG XIAOLONG       │  │ PROFORMA INVOICE    │  │
│  │    │  │ INDUSTRY AND TRADE      │  │ PI-20260412-001     │  │
│  │    │  │ CO.,LTD.                │  │ 2026-04-12          │  │
│  └────┘  │ 地址 / 邮箱 / 电话       │  └─────────────────────┘  │
│          └─────────────────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 栏目内容

| 栏目 | 内容                     | 宽度            | 对齐   |
| ---- | ------------------------ | --------------- | ------ |
| 左栏 | Logo 标志                | 60px            | 固定   |
| 中栏 | 公司信息 + 联系方式      | 1fr (自适应)    | 左对齐 |
| 右栏 | 单据标题 + 发票号 + 日期 | auto (内容宽度) | 右对齐 |

---

## 4. 视觉规范

### 4.1 Logo 设计

```scss
.logo-mark {
  width: 60px;
  height: 36px;
  background: #1d1d1f; // $text-primary
  border-radius: 6px;

  .mono {
    font-family: 'SF Mono', monospace;
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 2px;
  }
}
```

**设计说明**:

- 长方形比例 (60×36 ≈ 1.67:1)，符合黄金分割
- 6px 圆角，柔和但不失专业
- 黑白配色，经典永恒
- 等宽字体，数据感

### 4.2 公司信息

```scss
.header-info {
  .company-line-1 {
    font-size: 13px;
    font-weight: 600;
    color: #1d1d1f;
    text-transform: uppercase;
    line-height: 1.3;
  }

  .company-line-2 {
    font-size: 10px;
    font-weight: 500;
    color: #6e6e73;
    line-height: 1.4;
    margin-top: 4px;
  }

  .company-line-3 {
    font-size: 10px;
    font-weight: 500;
    color: #86868b;
    line-height: 1.4;
    margin-top: 2px;
  }
}
```

**视觉层级**: | 行 | 内容 | 字号 | 字重 | 颜色 | |----|------|------|------|------| | Line 1 | 公司名称 | 13px | 600 | #1D1D1F (主色) | | Line 2 | 地址 | 10px | 500 | #6E6E73 (辅助色) | | Line 3 | 邮箱电话 | 10px | 500 | #86868B (次要色) |

### 4.3 单据信息

```scss
.document-section {
  text-align: right;

  .document-title {
    font-size: 14px;
    font-weight: 700;
    color: #1d1d1f;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .document-subtitle {
    font-size: 11px;
    font-weight: 600;
    color: #1d1d1f;
    font-family: 'SF Mono', monospace;
    margin-top: 4px;
  }

  .document-date {
    font-size: 10px;
    color: #6e6e73;
    margin-top: 2px;
  }
}
```

---

## 5. 配色体系

### 5.1 颜色定义

```scss
$text-primary: #1d1d1f; // 主要文字 (Apple 深灰)
$text-secondary: #86868b; // 次要文字 (中灰)
$text-tertiary: #6e6e73; // 辅助文字 (浅灰)
$border-light: #d2d2d7; // 边框/分隔线 (淡灰)
```

### 5.2 使用场景

| 颜色            | 使用场景                   |
| --------------- | -------------------------- |
| $text-primary   | 公司名称、单据标题、发票号 |
| $text-secondary | 邮箱电话                   |
| $text-tertiary  | 地址、日期                 |
| $border-light   | 分隔线、边框               |

---

## 6. 字体体系

### 6.1 字体栈

```scss
font-family:
  -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Inter',
  sans-serif;

// 数字/发票号
font-family: 'SF Mono', monospace;
```

### 6.2 字号阶梯

| 用途      | 字号 | 字重 | 行高 |
| --------- | ---- | ---- | ---- |
| 公司名称  | 13px | 600  | 1.3  |
| 单据标题  | 14px | 700  | 1.3  |
| 地址/日期 | 10px | 500  | 1.4  |
| 发票号    | 11px | 600  | 1.4  |

---

## 7. 间距规范

### 7.1 栏目间距

```scss
.header-main {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px; // 栏目之间 20px
  align-items: center;
}
```

### 7.2 行间距

```scss
.company-line-2 {
  margin-top: 4px;
} // 公司信息行间距
.company-line-3 {
  margin-top: 2px;
} // 紧密行间距
.document-subtitle {
  margin-top: 4px;
}
.document-date {
  margin-top: 2px;
}
```

### 7.3 底部间距

```scss
.company-header {
  margin-bottom: 40px; // 头部与内容区间距
}
```

---

## 8. 打印适配

### 8.1 纸张尺寸

```scss
@media print {
  .pi-print {
    padding: 28px 36px;
    font-size: 10px;

    @page {
      size: A4;
      margin: 12mm;
    }
  }
}
```

### 8.2 打印优化

- 使用 `-webkit-print-color-adjust: exact` 保证背景色打印
- 字号适度缩小适应 A4 纸张
- 减少 padding 节省空间

---

## 9. 实现文件

| 文件     | 路径                                       | 说明     |
| -------- | ------------------------------------------ | -------- |
| 打印模板 | `src/views/trade/pi/pi-print-template.vue` | 核心实现 |
| 样式     | (同文件内联 SCSS)                          | 样式定义 |

---

## 10. 设计验证

### 10.1 自检清单

- [x] Logo 为长方形 (60×36px)
- [x] 三栏布局清晰
- [x] 视觉层级分明
- [x] 配色统一
- [x] 字体规范
- [x] 间距合理
- [x] 打印适配

### 10.2 视觉效果

- **高端感**: 通过字号对比、留白、配色实现
- **专业感**: 严格的网格对齐、统一的视觉语言
- **可读性**: 清晰的信息层级、合适的字号

---

<div align="center">
  <p>Art Design Pro © 2024-2026</p>
</div>
