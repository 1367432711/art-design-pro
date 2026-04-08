# PI/PL 模块设计文档

**创建时间**: 2026-04-08  
**状态**: 待评审

---

## 1. 业务背景

### 1.1 外贸业务流程

```
客户询价 → 报价单 (Quotation) → 客户确认 → PI → 客户付款 → PL → 发货
```

### 1.2 三种单据关系

| 单据   | 英文名称         | 用途                   | 阶段     |
| ------ | ---------------- | ---------------------- | -------- |
| 报价单 | Quotation        | 给客户报价             | 销售阶段 |
| PI     | Proforma Invoice | 形式发票，客户付款依据 | 收款阶段 |
| PL     | Packing List     | 装箱单，发货依据       | 发货阶段 |

### 1.3 数据流转关系

```
报价单 (Quotation)
    ↓ (客户确认)
PI (Proforma Invoice) - 新增：银行信息、发票号、毛重、体积
    ↓ (客户付款)
PL (Packing List) - 新增：包装明细、净重、箱数
```

---

## 2. 需求分析

### 2.1 核心需求

1. **从报价单生成 PI** - 自动带入产品、客户、价格信息
2. **从 PI 生成 PL** - 自动带入产品、客户、发票号信息
3. **数据不重复录入** - 上游单据确认后，下游单据自动继承
4. **状态跟踪** - 订单状态清晰可见（待确认→待付款→已付款→待发货→已发货）

### 2.2 用户决策

| 问题         | 选择              | 说明                                           |
| ------------ | ----------------- | ---------------------------------------------- |
| 银行信息管理 | 提前配置          | 在系统设置中配置多个银行账号，创建 PI 时选择   |
| 发票号规则   | 自动生成 + 可修改 | 默认 `PI-YYYYMMDD-NNN`，允许手动调整           |
| 毛重/体积    | 从产品自动计算    | 产品详情已有 `grossWeight`、`netWeight` 等字段 |
| 包装明细     | 按产品填写        | 每个产品填写箱数、净重、毛重                   |

---

## 3. 数据模型设计

### 3.1 银行账户配置

```typescript
interface BankAccount {
  id: string
  bankName: string // 银行名称
  accountName: string // 账户名称（受益人）
  accountNumberUSD: string // 美元账号
  accountNumberRMB: string // 人民币账号
  swiftCode: string // SWIFT 代码
  bankAddress: string // 银行地址
  bankCountry: string // 银行所在国家
  isDefault: boolean // 是否默认账户
  status: 'active' | 'inactive'
  createTime: string
}
```

### 3.2 PI 主表

```typescript
interface PIListItem {
  // 基础信息
  id: string
  invoiceNo: string // 发票号（自动生成：PI-YYYYMMDD-NNN）
  piDate: string // 开票日期
  quotationId: string // 关联的报价单 ID
  customerId: string
  customerName: string

  // 公司信息（从系统配置读取）
  companyName: string
  companyAddress: string
  companyEmail: string
  companyPhone: string

  // 客户信息
  consignee: string // 收货人
  deliveryAddress: string // 收货地址
  contactPhone: string // 联系电话
  contactEmail: string // 联系邮箱

  // 贸易信息
  tradeTerms: string // 贸易条款（FOB/CIF 等）
  tradeCountry: string // 贸易国家
  portOfLoading: string // 装运港
  portOfDestination: string // 目的港

  // 物流信息（从产品自动计算）
  grossWeight: number // 总毛重 (kg)
  netWeight: number // 总净重 (kg)
  totalVolume: number // 总体积 (CBM)
  totalCartons: number // 总箱数

  // 产品列表（从报价单复制）
  products: PIProduct[]

  // 金额信息
  currency: string // 币种
  totalAmount: number // 总金额
  depositAmount: number // 定金金额
  depositPercent: number // 定金比例 (如 30)
  balanceAmount: number // 尾款金额

  // 付款条款
  paymentTerms: string // 付款方式描述
  depositDueDate: string // 定金截止日期
  balanceDueDate: string // 尾款截止日期

  // 银行信息（从账户配置选择）
  bankAccountId: string // 关联的银行账户 ID
  bankInfo: BankInfo // 冗余存储，避免关联查询

  // 状态
  status: '待付款' | '部分付款' | '已付款' | '已取消'
  paidAmount: number // 已付金额

  // 时间
  deliveryDate: string // 交货期
  validityDays: number // 有效期（天）

  // 系统字段
  createTime: string
  updateTime: string
  createBy: string
  updateBy: string
}
```

### 3.3 PI 产品明细

```typescript
interface PIProduct {
  id: string // PI 产品 ID
  productId: string // 关联的产品 ID

  // 产品信息（快照）
  productName: string
  sku: string
  spec: string
  type: string
  grade: string
  material: string
  unit: string

  // 报价信息（从报价单复制）
  quantity: number
  unitPrice: number
  totalPrice: number
  currency: string

  // 包装信息（从产品复制）
  cartonQuantity: number // 每箱数量
  singleWeight: string // 单片重量
  blisterQuantity: number // 吸塑数量
  innerBoxQuantity: number // 内盒数量
  cartonSize: string // 外箱尺寸
  grossWeight: number // 每箱毛重
  netWeight: number // 每箱净重

  // 计算字段
  totalCartons: number // 总箱数 = quantity / cartonQuantity
  totalGW: number // 总毛重 = totalCartons * grossWeight
  totalNW: number // 总净重 = totalCartons * netWeight
  totalCBM: number // 总体积 = 箱数 * 箱体积

  // 图片
  mainImage: string

  // 备注
  remark?: string
}
```

### 3.4 PL 主表

```typescript
interface PLListItem {
  // 基础信息
  id: string
  invoiceNo: string // 关联的 PI 发票号
  plNo: string // PL 编号（自动生成：PL-YYYYMMDD-NNN）
  plDate: string // 开票日期
  piId: string // 关联的 PI ID
  customerId: string
  customerName: string

  // 公司信息
  companyName: string
  companyAddress: string

  // 客户信息
  consignee: string // 收货人

  // 产品包装明细
  products: PLProduct[]

  // 汇总信息
  totalQuantity: number // 总数量
  totalCartons: number // 总箱数
  totalNW: number // 总净重
  totalGW: number // 总毛重
  totalCBM: number // 总体积

  // 状态
  status: '待发货' | '部分发货' | '已发货'
  shippedQuantity: number // 已发货数量

  // 系统字段
  createTime: string
  updateTime: string
  createBy: string
  updateBy: string
}
```

### 3.5 PL 产品明细

```typescript
interface PLProduct {
  id: string // PL 产品 ID
  piProductId: string // 关联的 PI 产品 ID
  productId: string // 关联的产品 ID

  // 产品信息（快照）
  productName: string
  sku: string
  spec: string
  type: string
  unit: string

  // 数量信息（从 PI 复制）
  quantity: number
  unit: string

  // 包装明细（用户填写/确认）
  cartons: number // 箱数
  nwPerCarton: number // 每箱净重
  gwPerCarton: number // 每箱毛重
  cbmPerCarton: number // 每箱体积（长×宽×高/1000000）

  // 计算字段
  totalNW: number // 总净重 = cartons * nwPerCarton
  totalGW: number // 总毛重 = cartons * gwPerCarton
  totalCBM: number // 总体积 = cartons * cbmPerCarton

  // 备注
  remark?: string
}
```

### 3.6 报价单扩展

```typescript
// 在 QuotationListItem 中扩展
interface QuotationListItem {
  // ... 现有字段

  // 新增状态管理
  status: '待确认' | '已确认' | '已转 PI' | '已拒绝' | '已过期'
  piId?: string // 关联的 PI ID（已转 PI 时填写）
  piInvoiceNo?: string // PI 发票号（已转 PI 时填写）
}
```

---

## 4. API 接口设计

### 4.1 银行账户管理

| 接口                        | 方法   | 参数                | 说明             |
| --------------------------- | ------ | ------------------- | ---------------- |
| `fetchGetBankAccountList`   | GET    | `{ current, size }` | 获取银行账户列表 |
| `fetchGetBankAccountDetail` | GET    | `id`                | 获取银行账户详情 |
| `fetchCreateBankAccount`    | POST   | `BankAccount`       | 创建银行账户     |
| `fetchUpdateBankAccount`    | PUT    | `BankAccount`       | 更新银行账户     |
| `fetchDeleteBankAccount`    | DELETE | `id`                | 删除银行账户     |

### 4.2 PI 管理

| 接口                         | 方法   | 参数                                 | 说明            |
| ---------------------------- | ------ | ------------------------------------ | --------------- |
| `fetchGetPIList`             | GET    | `{ current, size, ...searchParams }` | 获取 PI 列表    |
| `fetchGetPIDetail`           | GET    | `id`                                 | 获取 PI 详情    |
| `fetchCreatePI`              | POST   | `PIListItem`                         | 创建 PI         |
| `fetchUpdatePI`              | PUT    | `PIListItem`                         | 更新 PI         |
| `fetchDeletePI`              | DELETE | `id`                                 | 删除 PI         |
| `fetchCreatePIFromQuotation` | POST   | `{ quotationId }`                    | 从报价单生成 PI |
| `fetchUpdatePIStatus`        | PUT    | `{ id, status, paidAmount? }`        | 更新 PI 状态    |

### 4.3 PL 管理

| 接口                  | 方法   | 参数                                 | 说明          |
| --------------------- | ------ | ------------------------------------ | ------------- |
| `fetchGetPLList`      | GET    | `{ current, size, ...searchParams }` | 获取 PL 列表  |
| `fetchGetPLDetail`    | GET    | `id`                                 | 获取 PL 详情  |
| `fetchCreatePL`       | POST   | `PLListItem`                         | 创建 PL       |
| `fetchUpdatePL`       | PUT    | `PLListItem`                         | 更新 PL       |
| `fetchDeletePL`       | DELETE | `id`                                 | 删除 PL       |
| `fetchCreatePLFromPI` | POST   | `{ piId }`                           | 从 PI 生成 PL |
| `fetchUpdatePLStatus` | PUT    | `{ id, status, shippedQuantity? }`   | 更新 PL 状态  |

---

## 5. 页面设计

### 5.1 页面路由

| 页面名称 | 路由 | 组件路径 | 说明 |
| --- | --- | --- | --- |
| PI 列表 | `/trade/pi` | `views/trade/pi/index.vue` | PI 列表、搜索、筛选 |
| PI 创建 | `/trade/pi/form` | `views/trade/pi/form.vue` | 创建 PI、从报价单转入 |
| PI 详情 | `/trade/pi/detail/:id` | `views/trade/pi/pi-detail.vue` | 查看 PI、打印 |
| PI 编辑 | `/trade/pi/edit/:id` | `views/trade/pi/form.vue` | 编辑 PI |
| PL 列表 | `/trade/pl` | `views/trade/pl/index.vue` | PL 列表、搜索、筛选 |
| PL 创建 | `/trade/pl/form` | `views/trade/pl/form.vue` | 创建 PL、从 PI 转入 |
| PL 详情 | `/trade/pl/detail/:id` | `views/trade/pl/pl-detail.vue` | 查看 PL、打印 |
| PL 编辑 | `/trade/pl/edit/:id` | `views/trade/pl/form.vue` | 编辑 PL |
| 银行账户列表 | `/system/bank-account` | `views/system/bank-account/index.vue` | 管理银行账户 |

### 5.2 报价单列表扩展

在现有报价单列表中添加：

- 状态列：显示报价单状态（待确认/已确认/已转 PI/已拒绝/已过期）
- 操作按钮：
  - 待确认状态：[确认] [拒绝]
  - 已确认状态：[转 PI]
  - 已转 PI 状态：[查看 PI]

### 5.3 PI 表单页面设计

**头部**：

- 返回按钮
- 标题：新增 PI / 编辑 PI
- 来源显示：如果是从报价单转入，显示来源报价单号

**表单分区**：

1. **基本信息**
   - 发票号（自动生成，可编辑）
   - 开票日期（默认今天）
   - 选择报价单（新增模式，从报价单列表选择）
   - 选择客户（自动带入报价单客户）

2. **客户信息**（自动带入）
   - 客户名称
   - 收货人
   - 收货地址
   - 联系电话
   - 联系邮箱

3. **贸易信息**
   - 贸易条款（下拉选择：FOB/CIF/EXW）
   - 贸易国家（输入）
   - 装运港（输入）
   - 目的港（输入）
   - 交货期（日期选择）

4. **产品列表**（从报价单复制）
   - 表格显示：产品图片、名称、规格、数量、单价、总价
   - 每行显示：箱数、每箱毛重、每箱净重（可编辑）
   - 底部汇总：总数量、总箱数、总毛重、总净重、总体积

5. **付款信息**
   - 币种（下拉：USD/EUR/RMB 等）
   - 总金额（自动计算）
   - 定金比例（输入，如 30）
   - 定金金额（自动计算）
   - 尾款金额（自动计算）
   - 定金截止日期（日期选择）
   - 尾款截止日期（日期选择）
   - 付款条款说明（多行文本）

6. **银行信息**
   - 选择银行账户（下拉选择，从系统配置读取）
   - 显示所选银行的详细信息（只读）

7. **状态**
   - 状态（下拉：待付款/部分付款/已付款）
   - 已付金额（输入）

**操作按钮**：

- [保存]
- [保存并发送]
- [取消]

### 5.4 PL 表单页面设计

**头部**：

- 返回按钮
- 标题：新增 PL / 编辑 PL
- 来源显示：关联的 PI 发票号

**表单分区**：

1. **基本信息**
   - PL 编号（自动生成，可编辑）
   - 开票日期（默认今天）
   - 关联 PI 发票号（只读）
   - 客户名称（自动带入）

2. **客户信息**（自动带入）
   - 收货人

3. **产品包装明细**（核心）
   - 表格显示每个产品的包装信息
   - 列：产品名称、规格、数量、箱数、每箱净重、每箱毛重、每箱体积、总净重、总毛重、总体积
   - 箱数、每箱净重、每箱毛重、每箱体积可编辑
   - 总净重、总毛重、总体积自动计算

4. **汇总信息**（自动计算）
   - 总数量
   - 总箱数
   - 总净重
   - 总毛重
   - 总体积

**操作按钮**：

- [保存]
- [保存并打印]
- [确认发货]
- [取消]

---

## 6. 状态流转设计

### 6.1 报价单状态

```
待确认 → 已确认 → 已转 PI
   ↓         ↓
 已拒绝   已过期（超过有效期）
```

### 6.2 PI 状态

```
待付款 → 部分付款 → 已付款
   ↓
 已取消
```

### 6.3 PL 状态

```
待发货 → 部分发货 → 已发货
```

### 6.4 订单完整状态链

```
报价单 (待确认)
    ↓ 确认
报价单 (已确认)
    ↓ 转 PI
PI (待付款)
    ↓ 付款
PI (已付款)
    ↓ 生成 PL
PL (待发货)
    ↓ 发货
PL (已发货) → 订单完成
```

---

## 7. 打印/导出功能

### 7.1 打印模板

需要实现以下打印模板：

1. **PI 打印模板**
   - 公司抬头
   - 发票号、日期
   - 客户信息
   - 产品列表表格
   - 付款条款
   - 银行信息
   - 公司签章位置

2. **PL 打印模板**
   - 公司抬头
   - PL 编号、日期
   - 关联发票号
   - 客户信息
   - 产品包装明细表格
   - 汇总信息
   - 公司签章位置

### 7.2 导出格式

- PDF（用于发送客户，不可编辑）
- Excel（用于内部编辑和存档）

---

## 8. 开发计划

### Phase 1: 基础数据模型 (优先级：高)

- [ ] 创建类型定义 `src/types/api/api.d.ts`
- [ ] 创建 Mock 数据
- [ ] 创建 API 接口 `src/api/trade-manage.ts`

### Phase 2: 银行账户管理 (优先级：高)

- [ ] 银行账户列表页面
- [ ] 银行账户表单页面
- [ ] 银行账户 API

### Phase 3: PI 模块 (优先级：高)

- [ ] PI 列表页面
- [ ] PI 表单页面（从报价单生成）
- [ ] PI 详情页面
- [ ] PI 打印功能

### Phase 4: PL 模块 (优先级：中)

- [ ] PL 列表页面
- [ ] PL 表单页面（从 PI 生成）
- [ ] PL 详情页面
- [ ] PL 打印功能

### Phase 5: 报价单扩展 (优先级：高)

- [ ] 报价单状态管理
- [ ] 报价单转 PI 功能
- [ ] 报价单列表扩展

### Phase 6: 订单状态看板 (优先级：低)

- [ ] 订单状态看板页面
- [ ] 订单统计图表

---

## 9. 技术要点

### 9.1 数据继承逻辑

```typescript
// 从报价单生成 PI 时
function createPIFromQuotation(quotation: QuotationListItem): PIListItem {
  return {
    ...quotation,
    invoiceNo: generateInvoiceNo(),
    products: quotation.products.map((p) => ({
      ...p,
      // 包装信息从产品库复制
      cartonQuantity: product.cartonQuantity,
      grossWeight: product.grossWeight,
      netWeight: product.netWeight,
      // 计算字段
      totalCartons: p.quantity / product.cartonQuantity,
      totalGW: (p.quantity / product.cartonQuantity) * product.grossWeight,
      totalNW: (p.quantity / product.cartonQuantity) * product.netWeight
    })),
    // 自动计算汇总
    grossWeight: sum(products.map((p) => p.totalGW)),
    netWeight: sum(products.map((p) => p.totalNW)),
    totalVolume: sum(products.map((p) => p.totalCBM))
  }
}
```

### 9.2 发票号生成规则

```typescript
function generateInvoiceNo(prefix: string = 'PI'): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 900 + 100)
  return `${prefix}${dateStr}${random}`
}
```

### 9.3 包装计算逻辑

```typescript
// 每箱体积计算 (mm → CBM)
function calculateCBM(length: number, width: number, height: number): number {
  return (length * width * height) / 1000000
}

// 总箱数计算
function calculateTotalCartons(quantity: number, cartonQuantity: number): number {
  return Math.ceil(quantity / cartonQuantity)
}
```

---

## 10. 风险提示

1. **数据一致性** - PI/PL 从报价单继承数据，需要确保快照数据不与原数据联动
2. **状态同步** - 报价单状态变更后，需要同步更新关联的 PI/PL 状态
3. **打印格式** - PDF 打印需要精确控制格式，建议使用成熟的 PDF 库
4. **权限控制** - 银行账户信息敏感，需要权限控制

---

## 11. 待确认事项

- [ ] PI 打印模板的具体格式（需要客户提供模板）
- [ ] PL 打印模板的具体格式（需要客户提供模板）
- [ ] 是否需要多银行账户支持
- [ ] 是否需要支持多次付款（部分付款场景）
- [ ] 是否需要支持分批发货

---

<div align="center">
  <p>Art Design Pro © 2024-2026</p>
</div>
