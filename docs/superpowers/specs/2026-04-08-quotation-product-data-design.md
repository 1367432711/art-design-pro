# 报价单产品数据关联设计

**创建时间**: 2026-04-08  
**状态**: 待实现

---

## 1. 业务背景

### 1.1 业务模型

在外贸业务中，产品与报价单的关系具有以下特点：

| 维度                | 说明                                           |
| ------------------- | ---------------------------------------------- |
| **产品固定属性**    | 型号、等级、装箱数、吸塑数、内盒数、图片等     |
| **报价浮动属性**    | 价格（因客户、订单量等因素而异）               |
| **产品 - 报价关系** | 一个产品可被多次报价，一个报价单可包含多个产品 |

### 1.2 当前问题

1. 报价单中的产品数据是完全独立的快照，与产品库无关联
2. `selectedProductId` 字段存在但未实际使用
3. 产品库更新后，历史报价单无法同步最新的产品信息
4. 用户无法判断报价单中的产品是否仍在产品库中

---

## 2. 设计方案

### 2.1 核心原则

**混合模式**：基础属性实时关联，价格信息保持独立

| 数据类型                           | 存储方式         | 说明                   |
| ---------------------------------- | ---------------- | ---------------------- |
| 产品基础信息（型号、等级、包装等） | 实时从产品库读取 | 确保数据准确性和一致性 |
| 产品价格                           | 报价单快照       | 保持历史报价的独立性   |
| 客户信息                           | 报价单快照       | 记录报价时的客户关联   |

### 2.2 数据结构

#### 报价单产品项结构

```typescript
interface QuotationProduct {
  id: string
  selectedProductId: string // 关联产品库 ID（必填）

  // 实时从产品库读取的字段（不存储）
  // - spec: 规格型号
  // - type: 产品类型
  // - grade: 产品等级
  // - cartonQuantity: 装箱数
  // - blisterQuantity: 吸塑数
  // - innerBoxQuantity: 内盒数
  // - mainImage: 产品图片

  // 报价单存储的快照字段
  name: string // 产品名称（可自定义）
  price: number // 报价单价
  currency: string // 币种
  qty: number // 数量
  total: number // 小计
  remark?: string // 备注

  // 可选：用于数据一致性校验
  _productSnapshot?: {
    spec: string
    grade: string
    // ...其他基础属性
  }
}
```

### 2.3 数据流

```
┌─────────────────────────────────────────────────────────────┐
│                     创建报价单                                │
├─────────────────────────────────────────────────────────────┤
│  1. 从产品库选择产品 → 自动填充基础属性（型号、等级、包装等）        │
│  2. 输入价格 → 根据客户/订单量单独报价                          │
│  3. 保存 → 基础属性存快照 + 价格存快照 + selectedProductId      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     查看报价详情                              │
├─────────────────────────────────────────────────────────────┤
│  1. 根据 selectedProductId 从产品库获取最新基础属性             │
│  2. 价格使用报价单中的快照数据                                 │
│  3. 如产品已删除，显示警告提示                                  │
└─────────────────────────────────────────────────────────────┘
```

### 2.4 页面行为

#### 报价详情页

| 场景                     | 行为                                 |
| ------------------------ | ------------------------------------ |
| 产品存在且数据完整       | 显示产品最新基础属性 + 报价快照价格  |
| 产品存在但基础属性为空   | 从产品库补充                         |
| 产品已被删除             | 显示警告："产品已下架"，保留快照数据 |
| `selectedProductId` 为空 | 显示手动输入的产品信息               |

#### 报价列表页

- 产品名称显示：优先使用 `selectedProductId` 关联的产品名称
- 规格型号显示：从产品库实时读取

---

## 3. 技术实现

### 3.1 核心函数

```typescript
// 报价详情页：补充产品数据
function supplementProductData(quotationProduct: QuotationProduct) {
  const sourceProduct = getProductById(quotationProduct.selectedProductId)

  if (sourceProduct) {
    // 基础属性从产品库读取（总是使用最新数据）
    return {
      ...quotationProduct,
      spec: sourceProduct.spec,
      type: sourceProduct.type,
      grade: sourceProduct.grade,
      cartonQuantity: sourceProduct.cartonQuantity,
      blisterQuantity: sourceProduct.blisterQuantity,
      innerBoxQuantity: sourceProduct.innerBoxQuantity,
      image: sourceProduct.mainImage
      // 价格等字段保持报价单中的快照
    }
  } else {
    // 产品不存在，标记警告
    return {
      ...quotationProduct,
      _warning: '产品已下架'
    }
  }
}
```

### 3.2 文件修改清单

| 文件 | 修改内容 |
| --- | --- |
| `src/views/trade/quotation/quotation-detail.vue` | 修改 `supplementProductSpecs` 函数，增加基础属性同步逻辑 |
| `src/views/trade/quotation/index.vue` | 列表页产品名称/规格显示逻辑 |
| `src/views/trade/quotation/form.vue` | 创建/编辑报价单时产品选择逻辑 |
| `src/types/api/api.d.ts` | 更新报价产品类型定义 |

### 3.3 数据迁移

对于现有报价单数据：

- 已有 `selectedProductId` 的：自动从产品库补充基础属性
- 无 `selectedProductId` 的：保留快照数据，标记为"独立产品"

---

## 4. 边界情况处理

### 4.1 产品被删除

当报价单关联的产品在产品库中被删除时：

```vue
<template>
  <ElTag v-if="product._warning" type="danger" size="small"> 产品已下架 </ElTag>
</template>
```

### 4.2 产品基础属性变更

- 用户修改产品库中的产品信息 → 所有报价单详情页自动显示最新数据
- 用户需要知道历史报价单的产品信息会变化 → 在详情页添加提示

### 4.3 价格独立性

- 无论产品库如何变化，报价单中的价格始终保持不变
- 如需调整价格，需编辑报价单重新保存

---

## 5. 测试要点

- [ ] 报价详情页正确显示产品最新型号、等级、包装数据
- [ ] 报价详情页价格保持报价单中的快照值
- [ ] 产品被删除时显示警告提示
- [ ] 无 `selectedProductId` 的报价单正常显示快照数据
- [ ] 列表页正确显示产品名称和规格

---

## 6. 后续扩展

- [ ] 添加"刷新产品数据"按钮（手动同步产品库）
- [ ] 产品价格历史追溯（查看某个产品历史报价记录）
- [ ] 根据客户等级自动建议报价
