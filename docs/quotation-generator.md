# 外贸报价单生成器 - 开发文档

## 项目概述

外贸报价单生成器是一个专业的外贸报价单制作工具，支持在线编辑、预览和导出 PDF 格式报价单。

### 核心功能

- 📝 **在线编辑** - 公司信息、报价单信息、产品列表、费用汇总
- 🖼️ **图片上传** - 公司 Logo、产品图片支持拖拽上传
- 👁️ **实时预览** - A4 纸张格式预览，支持缩放、翻页
- 📄 **PDF 导出** - 一键导出专业 PDF 报价单
- 💾 **数据持久化** - LocalStorage 自动保存，支持导入导出

---

## 技术栈

| 类别         | 技术                | 版本/说明      |
| ------------ | ------------------- | -------------- |
| **CSS 框架** | Tailwind CSS        | CDN 方式引入   |
| **图标库**   | Font Awesome        | 6.4.0          |
| **PDF 生成** | html2canvas + jsPDF | 1.4.1 + 2.5.1  |
| **数据存储** | LocalStorage        | 浏览器本地存储 |

### 外部依赖

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- html2canvas -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

<!-- jsPDF -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<!-- Font Awesome -->
<link
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  rel="stylesheet"
/>
```

---

## 项目结构

```
├── 顶部导航栏 (Fixed Navigation)
│   ├── Logo + 标题
│   └── 操作按钮组 (保存/加载/导出/导入/清空/预览/导出 PDF)
│
├── 主内容区 (Main Content)
│   ├── 1. 公司信息 (Company Info)
│   │   ├── Logo 上传区
│   │   └── 基本信息表单 (名称/联系人/WhatsApp/邮箱/地址)
│   │
│   ├── 2. 报价单信息 (Quotation Info)
│   │   ├── 基础信息 (单号/日期/有效期/货币)
│   │   ├── 贸易条款 (术语/港口/付款方式/交期)
│   │   └── 客户信息
│   │
│   ├── 3. 产品列表 (Products)
│   │   ├── 支持多产品
│   │   ├── 每个产品支持多型号/变体
│   │   └── 每个变体包含：图片/SKU/描述/数量/单位/单价
│   │
│   ├── 4. 费用汇总 (Cost Summary)
│   │   ├── 运费/折扣/税费/其他费用
│   │   └── 自动计算小计和总计
│   │
│   └── 5. 其他信息 (Other Info)
│       ├── 付款条款
│       ├── 质保信息
│       └── 支持自定义字段
│
├── 预览弹窗 (Preview Modal)
│   ├── A4 格式预览
│   ├── 翻页控制
│   ├── 缩放控制 (放大/缩小/自适应)
│   └── 关闭按钮
│
├── Toast 提示系统
├── 加载动画 Overlay
└── PDF 导出容器 (隐藏)
```

---

## 核心模块详解

### 1. 数据管理模块

#### 全局变量

```javascript
let products = [] // 产品列表
let currentZoom = 1.0 // 预览缩放比例
let companyLogoData = null // 公司 Logo (Base64)
let currentPage = 1 // 当前预览页码
let totalPages = 1 // 总页数

// 费用汇总变量
let freightCharges = 0 // 运费
let discountValue = 0 // 折扣值
let discountType = 'percent' // 折扣类型 (percent/fixed)
let taxValue = 0 // 税费
let otherCharges = 0 // 其他费用
let subtotal = 0 // 小计
let grandTotal = 0 // 总计

// 其他信息字段
let otherInfoFields = [
  { id: 'paymentTerms', label: '付款条款', value: '...' },
  { id: 'warrantyInfo', label: '质保信息', value: '...' }
]
```

#### LocalStorage 持久化

```javascript
const STORAGE_KEY = 'quote_generator_data'

// 保存数据
function saveData() {
  const data = {
    companyName: document.getElementById('companyName')?.value,
    // ... 所有表单字段
    products: products,
    companyLogoData: companyLogoData
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// 加载数据
function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return

  const data = JSON.parse(saved)
  // 恢复所有表单状态
  products = data.products || []
  companyLogoData = data.companyLogoData || null
  // ...
}

// 清空数据
function clearData() {
  if (confirm('确定要清空所有保存的数据吗？')) {
    localStorage.removeItem(STORAGE_KEY)
    location.reload()
  }
}
```

### 2. 产品管理模块

#### 数据结构

```javascript
{
    id: 1234567890,
    image: null,  // 产品主图 (Base64)
    variants: [{
        id: 1234567891,
        sku: 'ABC-123',
        desc: '产品描述',
        qty: 100,
        unit: 'PCS',
        price: 10.50,
        image: null  // 变体图片 (Base64)
    }]
}
```

#### 核心函数

```javascript
// 添加产品
function addProduct() {
  const id = Date.now()
  products.push({
    id,
    variants: [
      {
        id: Date.now() + 1,
        sku: '',
        desc: '',
        qty: 0,
        unit: 'PCS',
        price: 0
      }
    ]
  })
  renderProducts()
  calculateTotal()
}

// 添加变体
function addVariant(productId) {
  const product = products.find((p) => p.id === productId)
  product.variants.push({
    /* 新变体 */
  })
  renderProducts()
  calculateTotal()
}

// 删除产品
function removeProduct(productId) {
  products = products.filter((p) => p.id !== productId)
  renderProducts()
  calculateTotal()
}

// 更新变体数据
function updateVariantData(productId, variantId, field, value) {
  const product = products.find((p) => p.id === productId)
  const variant = product.variants.find((v) => v.id === variantId)
  variant[field] = field === 'desc' || field === 'sku' ? value : parseFloat(value) || 0
  updatePreviewData()
  calculateTotal()
}
```

### 3. 费用计算模块

```javascript
function calculateTotal() {
  // 1. 计算产品小计
  let productSubtotal = 0
  products.forEach((product) => {
    product.variants.forEach((variant) => {
      productSubtotal += variant.qty * variant.price
    })
  })
  subtotal = productSubtotal

  // 2. 获取费用值
  freightCharges = parseFloat(document.getElementById('freightCharges')?.value) || 0
  discountValue = parseFloat(document.getElementById('discountValue')?.value) || 0
  discountType = document.getElementById('discountType')?.value || 'percent'
  taxValue = parseFloat(document.getElementById('taxValue')?.value) || 0
  otherCharges = parseFloat(document.getElementById('otherCharges')?.value) || 0

  // 3. 计算折扣
  let discountAmount = 0
  if (discountType === 'percent') {
    discountAmount = subtotal * (discountValue / 100)
  } else {
    discountAmount = discountValue
  }

  // 4. 计算总计
  grandTotal = subtotal - discountAmount + freightCharges + taxValue + otherCharges

  // 5. 更新显示
  const currencyCode = document.getElementById('currencyType')?.value || 'USD'
  const currencySymbol = getCurrencySymbol(currencyCode)
  document.getElementById('subtotalDisplay').innerText = `${currencySymbol}${subtotal.toFixed(2)}`
  document.getElementById('discountDisplay').innerText =
    `-${currencySymbol}${discountAmount.toFixed(2)}`
  document.getElementById('grandTotalDisplay').innerText =
    `${currencySymbol}${grandTotal.toFixed(2)}`

  updatePreviewData()
  saveData()
}
```

### 4. 预览模块

#### A4 纸张尺寸定义

```css
/* A4 纸精确尺寸 (794px × 1123px @ 96 DPI) */
.quote-page {
  width: 794px;
  height: 1123px;
  padding: 57px 76px;
  box-sizing: border-box;
}

.page-footer {
  margin-top: auto;
  text-align: right;
  font-size: 10px;
  color: #9ca3af;
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
}
```

#### 分页逻辑

```javascript
// 计算总页数
function calculateTotalPages() {
  let totalVariants = 0
  products.forEach((product) => {
    totalVariants += product.variants.length
  })

  const firstPageRows = 9 // 首页可容纳行数
  const otherPageRows = 13 // 其他页可容纳行数

  if (totalVariants === 0) return { totalPages: 1, firstPageRows, otherPageRows }

  let remainingRows = totalVariants
  let pages = 1
  remainingRows -= firstPageRows

  while (remainingRows > 0) {
    pages++
    remainingRows -= otherPageRows
  }

  return { totalPages: Math.max(1, pages), firstPageRows, otherPageRows }
}

// 生成单页内容
function generateSinglePageContent(pageNum, rowsPerPage, startRowIndex, isForPDF = false) {
  // 生成该页的产品行
  // 首页包含完整 header，其他页只显示简化的 header
  // 末页显示费用汇总和其他信息
}

// 生成所有页面
function generateAllPagesContent(isForPDF = false) {
  const { totalPages, firstPageRows, otherPageRows } = calculateTotalPages()
  let allPagesHtml = ''
  let startRowIndex = 0

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const rowsPerPage = pageNum === 1 ? firstPageRows : otherPageRows
    allPagesHtml += generateSinglePageContent(pageNum, rowsPerPage, startRowIndex, isForPDF)
    startRowIndex += rowsPerPage
  }

  return allPagesHtml
}
```

#### 缩放控制

```javascript
// 自适应缩放
function calculateAutoZoom() {
  const previewBody = document.getElementById('previewBody')
  const availableWidth = previewBody.clientWidth - 80
  const availableHeight = previewBody.clientHeight - 80

  const scaleX = availableWidth / A4_WIDTH_PX
  const scaleY = availableHeight / A4_HEIGHT_PX

  currentZoom = Math.min(scaleX, scaleY, 1.5)
  applyZoom()
}

function applyZoom() {
  const wrapper = document.getElementById('quote-document-wrapper')
  wrapper.style.transform = `scale(${currentZoom})`
  wrapper.style.transformOrigin = 'top center'
}
```

### 5. PDF 导出模块

```javascript
async function downloadPDF() {
  if (products.length === 0) {
    alert('请至少添加一个产品！')
    return
  }

  try {
    // 1. 显示加载动画
    loadingOverlay.style.display = 'flex'

    // 2. 等待图片加载完成
    await new Promise((resolve) => {
      const images = document.querySelectorAll('img')
      // 等待所有图片加载...
    })

    const quoteNum = document.getElementById('quoteNumber')?.value || 'QUO-001'
    const pdfPages = []

    // 3. 逐页生成 PDF
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      // 生成单页 HTML
      const pageHtml = generateSinglePageContent(pageNum, rowsPerPage, startRowIndex, true)
      exportContainer.innerHTML = pageHtml

      // 等待渲染
      await new Promise((resolve) => setTimeout(resolve, 300))

      // 捕获当前页
      const pageElement = exportContainer.querySelector('.pdf-single-page')
      const canvas = await html2canvas(pageElement, {
        scale: 2, // 2 倍清晰度
        useCORS: true, // 允许跨域图片
        allowTaint: true,
        logging: false
      })

      pdfPages.push(canvas)
    }

    // 4. 合并所有页到 PDF
    const { jsPDF } = jspdf
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    pdfPages.forEach((canvas, index) => {
      if (index > 0) pdf.addPage()
      const imgData = canvas.toDataURL('image/jpeg', 0.98)
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
    })

    // 5. 保存 PDF
    pdf.save(`Quotation_${quoteNum}.pdf`)
  } catch (err) {
    console.error('PDF 生成错误:', err)
    alert('PDF 生成失败：' + err.message)
  } finally {
    loadingOverlay.style.display = 'none'
  }
}
```

### 6. 数据导入导出模块

```javascript
// 导出数据
function exportData() {
  saveData()
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    showToast('没有可导出的数据', 'warning')
    return
  }

  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const quoteNum = document.getElementById('quoteNumber')?.value || 'backup'
  a.href = url
  a.download = `quote_backup_${quoteNum}_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  showToast('数据导出成功', 'success')
}

// 导入数据
function importData(input) {
  const file = input.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      loadData()
      showToast('数据导入成功', 'success')
    } catch (err) {
      showToast('文件格式错误', 'error')
    }
  }
  reader.readAsText(file)
}
```

---

## UI 组件说明

### 1. 货币符号映射

```javascript
function getCurrencySymbol(currencyCode) {
  const symbols = {
    USD: '$',
    EUR: '€',
    CNY: '¥',
    GBP: '£'
  }
  return symbols[currencyCode] || currencyCode
}
```

### 2. Toast 提示系统

```javascript
function showToast(message, type = 'info') {
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  }

  const colors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  }

  const toast = document.createElement('div')
  toast.className = `${colors[type]} border rounded-xl px-4 py-3 shadow-lg`
  toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `

  container.appendChild(toast)
  setTimeout(() => toast.remove(), 3000)
}
```

### 3. 图片上传处理

```javascript
function handleImageUpload(input, imgId, removeBtnId) {
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = function (e) {
      const img = document.getElementById(imgId)
      const removeBtn = document.getElementById(removeBtnId)

      img.src = e.target.result
      img.style.display = 'block'
      removeBtn.style.display = 'flex'

      if (imgId === 'companyLogoImg') {
        companyLogoData = e.target.result
        updatePreviewData()
      }
    }
    reader.readAsDataURL(input.files[0])
  }
}

function removeImage(imgId, removeBtnId, event) {
  if (event) event.stopPropagation()

  const img = document.getElementById(imgId)
  img.src = ''
  img.style.display = 'none'
  document.getElementById(removeBtnId).style.display = 'none'

  if (imgId === 'companyLogoImg') {
    companyLogoData = null
    updatePreviewData()
  }
}
```

---

## 快捷键支持

| 快捷键     | 功能         |
| ---------- | ------------ |
| `Ctrl + S` | 保存数据     |
| `Ctrl + P` | 打开预览     |
| `Esc`      | 关闭预览窗口 |

---

## Tailwind 自定义配置

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        primaryDark: '#1d4ed8',
        primaryLight: '#eff6ff',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444'
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07)',
        elevated: '0 10px 40px -10px rgba(0, 0, 0, 0.1)'
      }
    }
  }
}
```

---

## 开发注意事项

### 1. A4 纸张尺寸精度

- 使用 CSS 精确控制尺寸 (794px × 1123px)
- Tailwind 工具类无法替代时需使用自定义 CSS
- PDF 导出时需保持与预览一致的尺寸

### 2. 图片处理

- 所有上传的图片转换为 Base64 存储
- PDF 导出时需等待所有图片加载完成
- html2canvas 需启用 `useCORS: true` 支持跨域图片

### 3. 分页逻辑

- 首页可容纳 9 行产品 (包含完整 header)
- 其他页可容纳 13 行产品 (简化 header)
- 末页显示费用汇总和其他信息

### 4. 数据持久化

- 所有操作自动保存到 LocalStorage
- 大数据量时注意性能问题
- 导入导出时注意数据格式兼容性

---

## 文件清单

| 文件/模块    | 说明                                |
| ------------ | ----------------------------------- |
| 索引文件     | 单文件 HTML，包含所有样式和脚本     |
| html2canvas  | 网页截图库，用于将 HTML 转为 Canvas |
| jsPDF        | PDF 生成库，用于创建 PDF 文档       |
| Tailwind CSS | 实用优先的 CSS 框架                 |
| Font Awesome | 图标库                              |

---

## 未来扩展建议

1. **模板系统** - 支持多种报价单模板选择
2. **多语言支持** - 中英文切换
3. **云端同步** - 支持账号登录和数据云同步
4. **批量操作** - 批量导入产品、批量导出
5. **API 集成** - 对接 ERP/CRM 系统
6. **自定义主题** - 支持自定义颜色、字体
7. **电子签名** - 支持添加电子签名

---

## 常见问题

### Q: PDF 导出时图片不显示？

A: 确保图片是本地上传的 Base64 格式，或 html2canvas 启用 `useCORS: true`

### Q: 预览页面切换动画卡顿？

A: 检查缩放计算逻辑，确保 `transform-origin` 设置正确

### Q: LocalStorage 容量限制？

A: LocalStorage 通常有 5MB 限制，大量图片时建议考虑 IndexedDB

---

_文档版本：1.1_ _最后更新：2026-03-26_

---

## 更新日志

### v1.1 - 2026-03-26 (Art Design Pro 集成版)

**新增功能**:

- ✅ 集成到 Art Design Pro 项目
- ✅ 支持多产品多型号/变体
- ✅ 公司信息管理（Logo、联系方式）
- ✅ 费用汇总（运费、折扣、税费）
- ✅ A4 格式预览弹窗
- ✅ PDF 导出功能
- ✅ LocalStorage 草稿自动保存

**类型定义**:

- `Api.Trade.QuotationDetail` - 报价单详情（完整版）
- `Api.Trade.QuotationProduct` - 报价产品（支持多变体）
- `Api.Trade.ProductVariant` - 产品变体/型号
- `Api.Trade.QuotationCompanyInfo` - 公司信息
- `Api.Trade.QuotationCostSummary` - 费用汇总
- `Api.Trade.QuotationInfoField` - 其他信息字段

**文件结构**:

```
src/views/trade/quotation/
├── index.vue                    # 报价列表页
├── quotation-detail.vue         # 报价详情页
├── quotation-form-enhanced.vue  # 报价表单页（增强版）
└── modules/
    ├── quotation-search.vue     # 搜索组件
    ├── quotation-dialog.vue     # 对话框组件
    └── quotation-preview.vue    # 预览组件（新增）
```

**使用说明**:

1. 访问 `/trade/quotation` 进入报价管理
2. 点击"新增报价"按钮创建报价单
3. 填写公司信息、报价单信息、产品列表
4. 点击"预览"按钮查看 A4 格式效果
5. 点击"导出 PDF"下载报价单
