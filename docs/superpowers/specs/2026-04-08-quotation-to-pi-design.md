# 报价单生成 PI 功能设计

**创建时间**: 2026-04-08  
**状态**: 待实现

---

## 1. 业务背景

### 1.1 业务流程

```
报价单 (Quotation) → 客户确认 → 生成 PI (形式发票) → 客户付款 → 生产/发货
     ↓                ↓            ↓
  status: 1       status: 2    创建 PI 记录
  待确认           已确认        piId 关联到报价单
```

### 1.2 核心需求

1. **一键生成 PI**: 报价单确认后，业务员可一键生成 PI 草稿
2. **数据继承**: PI 自动继承报价单的客户信息、产品明细、价格等
3. **可调整**: 业务员可在 PI 中调整运费、付款方式等
4. **关联追溯**: 报价单和 PI 双向关联，可互相跳转查看

---

## 2. 设计方案

### 2.1 数据映射

| 报价单字段               | PI 字段              | 说明                     |
| ------------------------ | -------------------- | ------------------------ |
| `customerId`             | `customerId`         | 直接复制                 |
| `customerName`           | `customerName`       | 直接复制                 |
| `clientEmail`            | `contactEmail`       | 映射为客户联系邮箱       |
| `clientWhatsapp`         | `contactPhone`       | 映射为客户联系电话       |
| `tradeTerm`              | `tradeTerms`         | 贸易条款                 |
| `country`                | `tradeCountry`       | 贸易国家                 |
| `shipmentPort`           | `portOfLoading`      | 装运港                   |
| `leadTime`               | `deliveryDate`       | 交货期                   |
| `products[]`             | `products[]`         | 产品明细（需转换字段）   |
| `currency`               | `currency`           | 币种                     |
| `costSummary.grandTotal` | `totalAmount`        | 总金额                   |
| -                        | `depositPercent: 30` | 默认定金 30%             |
| -                        | `invoiceNo`          | 自动生成 PI-YYYYMMDD-NNN |

### 2.2 PI 产品字段映射

| 报价单产品字段      | PI 产品字段        | 说明          |
| ------------------- | ------------------ | ------------- |
| `selectedProductId` | `productId`        | 关联产品库 ID |
| `name`              | `productName`      | 产品名称      |
| `spec`              | `spec`             | 规格型号      |
| `type`              | `type`             | 产品类型      |
| `grade`             | `grade`            | 产品等级      |
| `qty`               | `quantity`         | 数量          |
| `price`             | `unitPrice`        | 单价          |
| `total`             | `totalPrice`       | 小计          |
| `currency`          | `currency`         | 币种          |
| `cartonQuantity`    | `cartonQuantity`   | 装箱数        |
| `blisterQuantity`   | `blisterQuantity`  | 吸塑数        |
| `innerBoxQuantity`  | `innerBoxQuantity` | 内盒数        |

### 2.3 需要补充的 PI 字段

以下字段在报价单中没有，生成 PI 时需要业务员手动填写或使用默认值：

| 字段                | 默认值/来源                     | 说明                        |
| ------------------- | ------------------------------- | --------------------------- |
| `invoiceNo`         | 自动生成 `PI-YYYYMMDD-NNN`      | PI 发票号                   |
| `piDate`            | 当前日期                        | 开票日期                    |
| `companyName`       | 系统设置/空                     | 公司名称                    |
| `companyAddress`    | 系统设置/空                     | 公司地址                    |
| `companyEmail`      | 系统设置/空                     | 公司邮箱                    |
| `companyPhone`      | 系统设置/空                     | 公司电话                    |
| `consignee`         | 同 `customerName`               | 收货人                      |
| `deliveryAddress`   | 同报价单 `address`              | 收货地址                    |
| `portOfDestination` | 空                              | 目的港（需业务员填写）      |
| `grossWeight`       | 从产品计算                      | 总毛重 = Σ(产品毛重 × 箱数) |
| `netWeight`         | 从产品计算                      | 总净重                      |
| `totalVolume`       | 从产品计算                      | 总体积 = Σ(箱规体积 × 箱数) |
| `totalCartons`      | 从产品计算                      | 总箱数 = Σ(数量 / 每箱数量) |
| `depositAmount`     | `totalAmount × depositPercent%` | 定金金额                    |
| `balanceAmount`     | `totalAmount - depositAmount`   | 尾款金额                    |
| `paymentTerms`      | 空或默认模板                    | 付款条款                    |
| `depositDueDate`    | `piDate + 3 天`                 | 定金截止日                  |
| `balanceDueDate`    | `piDate + 发货前`               | 尾款截止日                  |
| `status`            | `待付款`                        | PI 状态                     |

---

## 3. 技术实现

### 3.1 核心函数

```typescript
// 从报价单生成 PI 草稿数据
function generatePIDataFromQuotation(quotation: QuotationDetail): Partial<PIListItem> {
  return {
    // 基本信息
    invoiceNo: generatePIInvoiceNo(), // PI-YYYYMMDD-NNN
    piDate: formatDate(new Date()),
    quotationId: quotation.id, // 关联报价单 ID

    // 客户信息
    customerId: quotation.customerId,
    customerName: quotation.customerName,
    consignee: quotation.customerName,
    contactEmail: quotation.clientEmail,
    contactPhone: quotation.clientWhatsapp,
    deliveryAddress: quotation.address,

    // 贸易信息
    tradeTerms: quotation.tradeTerm,
    tradeCountry: quotation.country,
    portOfLoading: quotation.shipmentPort,
    deliveryDate: quotation.leadTime,

    // 产品明细
    products: quotation.products.map((p) => ({
      id: generateId(),
      productId: p.selectedProductId || '',
      productName: p.name,
      spec: p.spec,
      type: p.type,
      grade: p.grade,
      quantity: p.qty,
      unitPrice: p.price,
      totalPrice: p.total,
      currency: p.currency,
      cartonQuantity: p.cartonQuantity,
      blisterQuantity: p.blisterQuantity,
      innerBoxQuantity: p.innerBoxQuantity
    })),

    // 金额信息
    currency: quotation.currency,
    totalAmount: quotation.costSummary.grandTotal,
    depositPercent: 30,
    depositAmount: quotation.costSummary.grandTotal * 0.3,
    balanceAmount: quotation.costSummary.grandTotal * 0.7,

    // 状态
    status: '待付款',
    paidAmount: 0
  }
}

// 计算 PI 物流信息
function calculatePILogistics(piProducts: PIProduct[], allProducts: ProductListItem[]) {
  let totalCartons = 0
  let grossWeight = 0
  let netWeight = 0
  let totalVolume = 0

  piProducts.forEach((piProduct) => {
    const sourceProduct = allProducts.find((p) => p.id === piProduct.productId)
    if (sourceProduct) {
      const cartons = Math.ceil(piProduct.quantity / (sourceProduct.cartonQuantity || 1))
      totalCartons += cartons
      grossWeight += cartons * (sourceProduct.grossWeight || 0)
      netWeight += cartons * (sourceProduct.netWeight || 0)

      // 计算体积 (箱规：52×32×28cm → 0.52×0.32×0.28 m³)
      if (sourceProduct.cartonSize) {
        const [l, w, h] = sourceProduct.cartonSize.split('×').map((s) => parseFloat(s) / 100)
        totalVolume += l * w * h * cartons
      }
    }
  })

  return { totalCartons, grossWeight, netWeight, totalVolume }
}
```

### 3.2 页面跳转逻辑

```typescript
// 报价详情页：生成 PI
const handleCreatePI = () => {
  if (!quotationData.value.id) return

  // 携带报价单数据跳转到 PI 表单页
  router.push({
    path: '/trade/pi/form',
    query: {
      fromQuotation: 'true',
      quotationId: quotationData.value.id
    }
  })
}

// PI 表单页：读取报价单数据
const loadQuotationData = async () => {
  const quotationId = route.query.quotationId as string
  if (!quotationId) return

  const res = await fetchGetQuotationDetail(quotationId)
  const quotation = res.data

  // 自动生成 PI 草稿数据
  formData.value = {
    ...generatePIDataFromQuotation(quotation),
    ...calculatePILogistics(formData.value.products, allProducts)
  }
}
```

### 3.3 文件修改清单

| 文件 | 修改内容 |
| --- | --- |
| `src/views/trade/quotation/quotation-detail.vue` | 修改 `handleCreatePI` 函数，跳转到 PI 表单并携带报价单 ID |
| `src/views/trade/pi/pi-form.vue` | 添加从报价单加载数据逻辑，自动生成 PI 草稿 |
| `src/api/trade-manage.ts` | 添加 `fetchGetQuotationDetail` 导入（如未导入） |

### 3.4 报价单状态更新

生成 PI 后，更新报价单的 `piId` 字段：

```typescript
// PI 保存成功后
await fetchUpdateQuotation({
  id: quotationId,
  piId: piId,
  orderStatus: 'pi'
})
```

---

## 4. 用户体验

### 4.1 操作步骤

1. 业务员打开报价单详情页
2. 点击"确认报价"按钮（状态变为"已确认"）
3. 点击"生成 PI"按钮
4. 跳转到 PI 表单页，数据已自动填充
5. 业务员补充/调整信息（目的港、付款方式、银行账号等）
6. 保存 PI

### 4.2 提示文案

- 生成 PI 后提示："PI 已创建，请补充付款方式等信息"
- 报价单页提示："已转 PI，查看 PI 详情"

### 4.3 边界情况

| 场景                           | 处理方式                             |
| ------------------------------ | ------------------------------------ |
| 报价单已被转 PI                | "生成 PI"按钮隐藏，显示"查看 PI"按钮 |
| 报价单产品无 selectedProductId | 使用快照数据， productId 留空        |
| 产品库中找不到产品             | 使用报价单中的快照数据               |

---

## 5. 测试要点

- [ ] 报价单详情页"生成 PI"按钮正常跳转
- [ ] PI 表单页正确加载报价单数据
- [ ] 产品明细、价格、客户信息正确映射
- [ ] 物流信息自动计算正确
- [ ] 定金/尾款金额计算正确
- [ ] PI 保存后，报价单状态更新为"已转 PI"
- [ ] 报价单详情页可点击"查看 PI"跳转

---

## 6. 后续扩展

- [ ] 支持选择是否继承报价单数据（可空白创建）
- [ ] 支持从多个报价单合并生成 PI
- [ ] PI 模板配置（贸易条款、付款方式的默认值）
- [ ] 银行账号默认选择
