# PI/PL 模块实现计划

**基于设计文档**: `docs/superpowers/specs/2026-04-08-pi-pl-module-design.md`  
**创建时间**: 2026-04-08

---

## 开发阶段总览

| 阶段    | 内容                | 优先级 | 预计文件数 |
| ------- | ------------------- | ------ | ---------- |
| Phase 1 | 类型定义和 API 接口 | 高     | 2          |
| Phase 2 | Mock 数据和数据库   | 高     | 4          |
| Phase 3 | 银行账户管理        | 高     | 3          |
| Phase 4 | PI 模块             | 高     | 5          |
| Phase 5 | PL 模块             | 中     | 5          |
| Phase 6 | 报价单扩展          | 高     | 2          |
| Phase 7 | 打印功能            | 中     | 2          |

---

## Phase 1: 类型定义和 API 接口

### 1.1 扩展类型定义

**文件**: `src/types/api/api.d.ts`

**任务**:

- [ ] 添加 `BankAccount` 接口
- [ ] 添加 `PIListItem` 接口
- [ ] 添加 `PIProduct` 接口
- [ ] 添加 `PLListItem` 接口
- [ ] 添加 `PLProduct` 接口
- [ ] 扩展 `QuotationListItem` 状态字段

**代码位置**:

```typescript
namespace Api {
  namespace Trade {
    interface BankAccount {}
    interface PIListItem {}
    interface PIProduct {}
    interface PLListItem {}
    interface PLProduct {}
  }
}
```

### 1.2 创建 API 接口

**文件**: `src/api/trade-manage.ts`

**任务**:

- [ ] `fetchGetBankAccountList` - 获取银行账户列表
- [ ] `fetchGetBankAccountDetail` - 获取银行账户详情
- [ ] `fetchCreateBankAccount` - 创建银行账户
- [ ] `fetchUpdateBankAccount` - 更新银行账户
- [ ] `fetchDeleteBankAccount` - 删除银行账户
- [ ] `fetchGetPIList` - 获取 PI 列表
- [ ] `fetchGetPIDetail` - 获取 PI 详情
- [ ] `fetchCreatePI` - 创建 PI
- [ ] `fetchUpdatePI` - 更新 PI
- [ ] `fetchDeletePI` - 删除 PI
- [ ] `fetchCreatePIFromQuotation` - 从报价单生成 PI
- [ ] `fetchGetPLList` - 获取 PL 列表
- [ ] `fetchGetPLDetail` - 获取 PL 详情
- [ ] `fetchCreatePL` - 创建 PL
- [ ] `fetchUpdatePL` - 更新 PL
- [ ] `fetchDeletePL` - 删除 PL
- [ ] `fetchCreatePLFromPI` - 从 PI 生成 PL

---

## Phase 2: Mock 数据和数据库

### 2.1 Mock 数据文件

**文件**: `src/mock/data/`

**任务**:

- [ ] 创建 `bankAccountList.json` - 银行账户 Mock 数据
- [ ] 创建 `piList.json` - PI Mock 数据
- [ ] 创建 `plList.json` - PL Mock 数据

**示例数据**:

```json
// bankAccountList.json
[
  {
    "id": "1",
    "bankName": "中国农业银行",
    "accountName": "SHANDONG NAJU ABRASIVES CO.,LTD.",
    "accountNumberUSD": "1587321040001043",
    "accountNumberRMB": "1587321040029744",
    "swiftCode": "ABOCCNBJ150",
    "bankAddress": "NO.137,YIHE ROAD,LINYI,SHANDONG PROVINCE,CHINA",
    "isDefault": true,
    "status": "active"
  }
]
```

### 2.2 数据库操作函数

**文件**: `src/utils/storage/db.ts`

**任务**:

- [ ] `getBankAccountList()` - 获取银行账户列表
- [ ] `getBankAccountById(id)` - 获取银行账户详情
- [ ] `addBankAccount(account)` - 添加银行账户
- [ ] `updateBankAccount(account)` - 更新银行账户
- [ ] `deleteBankAccount(id)` - 删除银行账户
- [ ] `getPIList()` - 获取 PI 列表
- [ ] `getPIDetail(id)` - 获取 PI 详情
- [ ] `addPI(pi)` - 添加 PI
- [ ] `updatePI(pi)` - 更新 PI
- [ ] `deletePI(id)` - 删除 PI
- [ ] `getPLList()` - 获取 PL 列表
- [ ] `getPLDetail(id)` - 获取 PL 详情
- [ ] `addPL(pl)` - 添加 PL
- [ ] `updatePL(pl)` - 更新 PL
- [ ] `deletePL(id)` - 删除 PL

**文件**: `src/mock/temp/`

- [ ] `bankAccountList.ts` - 银行账户 Mock 逻辑
- [ ] `piList.ts` - PI Mock 逻辑
- [ ] `plList.ts` - PL Mock 逻辑

---

## Phase 3: 银行账户管理

### 3.1 银行账户列表

**文件**: `src/views/system/bank-account/index.vue`

**功能**:

- [ ] 表格显示银行账户列表
- [ ] 搜索功能（按银行名称、账号）
- [ ] 状态筛选（active/inactive）
- [ ] 操作按钮：[编辑] [删除] [设为默认]
- [ ] [新建账户] 按钮

**UI 组件**:

- ArtTable (表格)
- ElSearch (搜索栏)
- ElPagination (分页)

### 3.2 银行账户表单

**文件**: `src/views/system/bank-account/form.vue`

**功能**:

- [ ] 银行名称输入
- [ ] 账户名称输入
- [ ] 美元账号输入
- [ ] 人民币账号输入
- [ ] SWIFT 代码输入
- [ ] 银行地址输入
- [ ] 是否默认账户切换
- [ ] 状态切换（active/inactive）
- [ ] 表单验证
- [ ] 提交保存

**表单字段**:

```typescript
{
  bankName: string
  accountName: string
  accountNumberUSD: string
  accountNumberRMB: string
  swiftCode: string
  bankAddress: string
  bankCountry: string
  isDefault: boolean
  status: 'active' | 'inactive'
}
```

---

## Phase 4: PI 模块

### 4.1 PI 列表页面

**文件**: `src/views/trade/pi/index.vue`

**功能**:

- [ ] 表格显示 PI 列表
- [ ] 搜索功能（发票号、客户名称）
- [ ] 状态筛选（待付款/部分付款/已付款/已取消）
- [ ] 日期范围筛选
- [ ] 操作按钮：[查看] [编辑] [删除] [打印]
- [ ] [新建 PI] 按钮
- [ ] [从报价单生成] 按钮

**表格列**: | 列名 | 字段 | 说明 | |------|------|------| | 发票号 | invoiceNo | 可点击查看详情 | | 客户名称 | customerName | - | | 总金额 | totalAmount | 带币种符号 | | 已付金额 | paidAmount | - | | 状态 | status | 标签显示 | | 开票日期 | piDate | - | | 操作 | - | [查看] [编辑] [删除] [打印] |

### 4.2 PI 表单页面

**文件**: `src/views/trade/pi/form.vue`

**功能分区**:

**1. 基本信息**

- [ ] 发票号（自动生成，可编辑）
- [ ] 开票日期（日期选择器）
- [ ] 选择报价单（弹窗选择，新增模式）
- [ ] 客户名称（自动带入，只读）

**2. 客户信息**

- [ ] 客户名称（只读）
- [ ] 收货人（可编辑）
- [ ] 收货地址（可编辑）
- [ ] 联系电话（可编辑）
- [ ] 联系邮箱（可编辑）

**3. 贸易信息**

- [ ] 贸易条款（下拉：FOB/CIF/EXW）
- [ ] 贸易国家（输入）
- [ ] 装运港（输入）
- [ ] 目的港（输入）
- [ ] 交货期（日期选择）

**4. 产品列表**

- [ ] 表格显示产品（从报价单复制）
- [ ] 显示：图片、名称、规格、数量、单价、总价
- [ ] 可编辑：箱数、每箱毛重、每箱净重
- [ ] 自动计算：总箱数、总毛重、总净重、总体积
- [ ] 底部汇总显示

**5. 付款信息**

- [ ] 币种（下拉：USD/EUR/RMB/GBP）
- [ ] 总金额（自动计算，只读）
- [ ] 定金比例（输入数字）
- [ ] 定金金额（自动计算）
- [ ] 尾款金额（自动计算）
- [ ] 定金截止日期（日期选择）
- [ ] 尾款截止日期（日期选择）
- [ ] 付款条款说明（多行文本）

**6. 银行信息**

- [ ] 选择银行账户（下拉选择）
- [ ] 显示银行详细信息（只读）

**7. 状态**

- [ ] 状态选择（待付款/部分付款/已付款）
- [ ] 已付金额输入

**操作按钮**:

- [ ] [保存] 按钮
- [ ] [保存并发送] 按钮
- [ ] [取消] 按钮

### 4.3 PI 详情页面

**文件**: `src/views/trade/pi/pi-detail.vue`

**功能**:

- [ ] 公司信息抬头
- [ ] 发票号、日期显示
- [ ] 客户信息显示
- [ ] 产品列表表格
- [ ] 付款条款显示
- [ ] 银行信息显示
- [ ] [打印] 按钮
- [ ] [导出 PDF] 按钮
- [ ] [导出 Excel] 按钮
- [ ] [返回] 按钮

### 4.4 PI 打印模板

**文件**: `src/views/trade/pi/pi-print-template.vue`

**功能**:

- [ ] 公司抬头（名称、地址、邮箱、电话）
- [ ] 发票号、日期右对齐
- [ ] 客户信息区块
- [ ] 产品表格（边框、表头底色）
- [ ] 付款条款区块
- [ ] 银行信息区块（黄色背景）
- [ ] 签章位置预留

---

## Phase 5: PL 模块

### 5.1 PL 列表页面

**文件**: `src/views/trade/pl/index.vue`

**功能**:

- [ ] 表格显示 PL 列表
- [ ] 搜索功能（PL 编号、发票号、客户名称）
- [ ] 状态筛选（待发货/部分发货/已发货）
- [ ] 操作按钮：[查看] [编辑] [删除] [打印]
- [ ] [新建 PL] 按钮
- [ ] [从 PI 生成] 按钮

**表格列**: | 列名 | 字段 | 说明 | |------|------|------| | PL 编号 | plNo | 可点击查看详情 | | 发票号 | invoiceNo | 关联的 PI 发票号 | | 客户名称 | customerName | - | | 总数量 | totalQuantity | - | | 总箱数 | totalCartons | - | | 状态 | status | 标签显示 | | 开票日期 | plDate | - | | 操作 | - | [查看] [编辑] [删除] [打印] |

### 5.2 PL 表单页面

**文件**: `src/views/trade/pl/form.vue`

**功能分区**:

**1. 基本信息**

- [ ] PL 编号（自动生成，可编辑）
- [ ] 开票日期（日期选择器）
- [ ] 关联 PI 发票号（只读）
- [ ] 客户名称（只读）

**2. 客户信息**

- [ ] 收货人（可编辑）

**3. 产品包装明细**

- [ ] 表格显示产品列表
- [ ] 显示：产品名称、规格、数量（只读）
- [ ] 可编辑：箱数、每箱净重、每箱毛重、每箱体积
- [ ] 自动计算：总净重、总毛重、总体积
- [ ] 行操作：[删除]（如果允许）

**4. 汇总信息**

- [ ] 总数量（自动计算）
- [ ] 总箱数（自动计算）
- [ ] 总净重（自动计算）
- [ ] 总毛重（自动计算）
- [ ] 总体积（自动计算）

**操作按钮**:

- [ ] [保存] 按钮
- [ ] [保存并打印] 按钮
- [ ] [确认发货] 按钮
- [ ] [取消] 按钮

### 5.3 PL 详情页面

**文件**: `src/views/trade/pl/pl-detail.vue`

**功能**:

- [ ] 公司抬头
- [ ] PL 编号、日期
- [ ] 关联发票号
- [ ] 客户信息
- [ ] 产品包装明细表格
- [ ] 汇总信息
- [ ] [打印] 按钮
- [ ] [导出 PDF] 按钮
- [ ] [导出 Excel] 按钮
- [ ] [返回] 按钮

### 5.4 PL 打印模板

**文件**: `src/views/trade/pl/pl-print-template.vue`

**功能**:

- [ ] 公司抬头
- [ ] PL 编号、日期右对齐
- [ ] 关联发票号
- [ ] 客户信息
- [ ] 产品包装表格（Marks & Nos、Commodities、QTY、Unit Price、CTNS、M3、N.W.、G.W.）
- [ ] 汇总行（Total）
- [ ] 签章位置预留

---

## Phase 6: 报价单扩展

### 6.1 报价单列表扩展

**文件**: `src/views/trade/quotation/index.vue`

**修改内容**:

- [ ] 添加状态列（待确认/已确认/已转 PI/已拒绝/已过期）
- [ ] 添加操作按钮逻辑：
  - 待确认：[确认] [拒绝]
  - 已确认：[转 PI]
  - 已转 PI：[查看 PI]
- [ ] 状态标签颜色：
  - 待确认：warning
  - 已确认：success
  - 已转 PI：primary
  - 已拒绝：danger
  - 已过期：info

### 6.2 报价单转 PI 功能

**文件**: `src/views/trade/quotation/index.vue` 或 `src/views/trade/pi/form.vue`

**功能**:

- [ ] 点击 [转 PI] 按钮
- [ ] 检查报价单状态是否为已确认
- [ ] 跳转到 PI 表单页面
- [ ] 传递报价单 ID 参数
- [ ] PI 表单自动加载报价单数据

### 6.3 报价单状态更新

**文件**: `src/api/trade-manage.ts`

**接口**:

- [ ] `fetchUpdateQuotationStatus` - 更新报价单状态

**文件**: `src/mock/temp/quotationList.ts`

**函数**:

- [ ] `updateQuotationStatus(id, status, piId?)` - 更新报价单状态

---

## Phase 7: 打印功能

### 7.1 打印组件封装

**文件**: `src/components/print/print-container.vue`

**功能**:

- [ ] 打印区域容器
- [ ] 打印样式隔离
- [ ] 打印按钮封装
- [ ] 打印预览功能

### 7.2 PDF 导出功能

**文件**: `src/utils/print/pdf-export.ts`

**功能**:

- [ ] 使用 html2canvas + jspdf
- [ ] A4 纸张尺寸设置
- [ ] 分页处理
- [ ] 图片质量优化

### 7.3 Excel 导出功能

**文件**: `src/utils/print/excel-export.ts`

**功能**:

- [ ] 使用 xlsx 库
- [ ] 表头样式设置
- [ ] 列宽自动调整
- [ ] 边框和底色

---

## 开发顺序依赖图

```
Phase 1: 类型定义 + API 接口
    ↓
Phase 2: Mock 数据 + 数据库
    ↓
Phase 3: 银行账户管理（PI 依赖）
    ↓
    ├─→ Phase 4: PI 模块
    │       ↓
    │   Phase 5: PL 模块
    │
    └─→ Phase 6: 报价单扩展（与 PI 并行）
            ↓
    Phase 7: 打印功能（最后）
```

---

## 测试计划

### 单元测试

- [ ] API 接口测试
- [ ] 数据计算函数测试（总重、总体积、箱数等）
- [ ] 发票号生成函数测试

### 集成测试

- [ ] 报价单 → PI 流转测试
- [ ] PI → PL 流转测试
- [ ] 状态同步测试

### E2E 测试

- [ ] 完整业务流程测试
- [ ] 打印功能测试

---

## 验收标准

1. **功能完整性**
   - [ ] 银行账户可 CRUD
   - [ ] PI 可从报价单生成
   - [ ] PL 可从 PI 生成
   - [ ] 状态正确流转

2. **数据准确性**
   - [ ] 产品数据正确复制
   - [ ] 包装计算准确
   - [ ] 汇总数据正确

3. **用户体验**
   - [ ] 表单操作流畅
   - [ ] 打印格式正确
   - [ ] 错误提示友好

4. **代码质量**
   - [ ] TypeScript 编译通过
   - [ ] ESLint 检查通过
   - [ ] 无 console.error

---

## 风险与缓解

| 风险          | 影响 | 缓解措施                 |
| ------------- | ---- | ------------------------ |
| 打印格式复杂  | 高   | 提前确认模板，使用成熟库 |
| 数据计算复杂  | 中   | 编写计算函数，充分测试   |
| 状态同步复杂  | 中   | 设计清晰的状态机         |
| Mock 数据量大 | 低   | 逐步填充，优先核心字段   |

---

<div align="center">
  <p>Art Design Pro © 2024-2026</p>
</div>
