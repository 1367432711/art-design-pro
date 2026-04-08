# Art Design Pro - API 接口文档

> 📋 完整的 API 接口文档，包含所有端点的请求/响应类型和 Mock 数据说明

**最后更新**: 2026-04-08

---

## 目录

1. [API 概述](#1-api 概述)
2. [认证接口](#2-认证接口-auth)
3. [用户接口](#3-用户接口-user)
4. [系统管理接口](#4-系统管理接口-system-manage)
5. [外贸管理接口](#5-外贸管理接口-trade-manage)
6. [Mock 数据说明](#6-mock 数据说明)
7. [API 清单总览](#7-api 清单总览)

---

## 1. API 概述

### 基础响应结构

所有接口统一返回格式:

```typescript
interface BaseResponse<T = unknown> {
  code: number // 状态码：200 成功，其他失败
  msg: string // 响应消息
  data: T // 响应数据
}
```

### HTTP 请求封装

所有请求默认返回 `data` 字段中的数据:

```typescript
const result = await fetchLogin({ phone, password })
// result 直接是 { token, refreshToken } 而不是完整响应
```

### 环境配置

| 环境 | 行为              |
| ---- | ----------------- |
| 开发 | 使用 Mock 数据    |
| 生产 | 调用真实 API 接口 |

---

## 2. 认证接口 (auth)

文件位置：`src/api/auth.ts`

### 2.1 用户登录

**函数**: `fetchLogin(params: LoginParams)`

**接口**: `POST /api/auth/login`

**请求参数**:

```typescript
interface LoginParams {
  phone: string // 手机号
  password: string // 密码
}
```

**响应数据**:

```typescript
interface LoginResponse {
  token: string // JWT Token
  refreshToken: string // 刷新 Token
  userId?: number // 用户 ID
}
```

**Mock 逻辑**:

- 验证手机号是否存在于 `userList` Mock 数据中
- 验证密码是否匹配（使用 `user.password` 字段）
- 成功返回 `token`、`refreshToken` 和 `userId`

**使用示例**:

```typescript
const { token, refreshToken, userId } = await fetchLogin({
  phone: '15153933164',
  password: '123456'
})
```

---

### 2.2 获取用户信息

**函数**: `fetchGetUserInfo()`

**接口**: `GET /api/user/info`

**请求参数**: 无 (从 Token 中获取用户 ID)

**响应数据**:

```typescript
interface UserInfo {
  userId: number
  userName: string // 用户名/真实姓名
  nickName: string // 昵称
  email: string // 邮箱
  phone: string // 手机号
  avatar: string // 头像 URL
  sex: string // 性别：1-男 2-女
  role: string // 职位
  department: string // 部门
  address: string // 地址
  intro: string // 个人介绍
  wechat: string // 微信
  whatsapp: string // WhatsApp
  facebook: string // Facebook
  roles: string[] // 角色列表
  buttons: string[] // 按钮权限列表
}
```

**Mock 逻辑**:

- 从 `userList` Mock 数据中根据 `userId` 查找用户
- 通过 `user-data-mapper.ts` 转换为 `UserInfo` 格式返回

**使用示例**:

```typescript
const userInfo = await fetchGetUserInfo()
```

---

## 3. 用户接口 (user)

文件位置：`src/api/user.ts`

### 3.1 获取用户信息

**函数**: `fetchGetUserInfo()`

**说明**: 与 `auth.ts` 中的函数功能相同，详见 [2.2](#22-获取用户信息)

---

### 3.2 更新用户信息

**函数**: `fetchUpdateUserInfo(data: Partial<UserInfo>)`

**接口**: `POST /api/user/update`

**请求参数**:

```typescript
interface UserInfo {
  userId?: number
  realName?: string // 姓名
  nickName?: string // 昵称
  email?: string // 邮箱
  phone?: string // 手机号
  sex?: string // 性别
  intro?: string // 个人介绍
  address?: string // 地址
  avatar?: string // 头像
  wechat?: string // 微信
  whatsapp?: string // WhatsApp
  facebook?: string // Facebook
  role?: string // 职位
  department?: string // 部门
}
```

**响应数据**:

```typescript
interface UpdateResponse {
  code: number
  msg: string
  data: UserInfo // 更新后的用户信息
}
```

**字段映射**:

```typescript
// UserInfo → UserListItem (用于更新 Mock 数据)
{
  userId → id,
  realName → realName,
  nickName → nickName,
  email → userEmail,
  phone → userPhone,
  sex → sex,
  intro → intro,
  address → address,
  avatar → avatar,
  wechat → wechat,
  whatsapp → whatsapp,
  facebook → facebook,
  role → role,
  department → department
}
```

**使用示例**:

```typescript
const result = await fetchUpdateUserInfo({
  nickName: '新昵称',
  email: 'new@email.com',
  phone: '15153933164'
})
```

---

## 4. 系统管理接口 (system-manage)

文件位置：`src/api/system-manage.ts`

### 4.1 获取用户列表

**函数**: `fetchGetUserList(params: UserSearchParams)`

**接口**: `GET /api/user/list`

**请求参数**:

```typescript
interface UserSearchParams {
  current: number // 当前页码
  size: number // 每页数量
  userName?: string // 用户名搜索
  userGender?: string // 性别搜索
  userPhone?: string // 手机号搜索
  userEmail?: string // 邮箱搜索
  status?: string // 状态搜索
}
```

**响应数据**:

```typescript
interface UserListItem {
  id: number
  userName: string // 用户名/真实姓名
  nickName: string // 昵称
  userGender: string // 性别
  userPhone: string // 手机号
  userEmail: string // 邮箱
  userRoles: string[] // 角色列表
  avatar: string // 头像
  status: string // 状态：1-启用 2-禁用
  realName?: string // 姓名
  sex?: string // 性别
  intro?: string // 个人介绍
  wechat?: string // 微信
  whatsapp?: string // WhatsApp
  facebook?: string // Facebook
  role?: string // 职位
  department?: string // 部门
  address?: string // 地址
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
}

interface UserListResponse {
  records: UserListItem[]
  current: number
  size: number
  total: number
}
```

**Mock 数据**: `mock/data/userList.json`

**使用示例**:

```typescript
const { records, total } = await fetchGetUserList({
  current: 1,
  size: 10
})
```

---

### 4.2 获取角色列表

**函数**: `fetchGetRoleList(params: RoleSearchParams)`

**接口**: `GET /api/role/list`

**请求参数**:

```typescript
interface RoleSearchParams {
  current?: number // 当前页码
  size?: number // 每页数量
  roleId?: number // 角色 ID
  roleName?: string // 角色名称
  roleCode?: string // 角色编码
  enabled?: boolean // 启用状态
  startTime?: string | null // 开始时间
  endTime?: string | null // 结束时间
}
```

**响应数据**:

```typescript
interface RoleListItem {
  roleId: number
  roleName: string
  roleCode: string
  description: string
  enabled: boolean
  createTime: string
}

interface RoleListResponse {
  records: RoleListItem[]
  current: number
  size: number
  total: number
}
```

**Mock 数据**: 内置模拟数据（超级管理员、管理员、普通用户）

**使用示例**:

```typescript
const { records, total } = await fetchGetRoleList({
  current: 1,
  size: 10
})
```

---

### 4.3 获取菜单列表

**函数**: `fetchGetMenuList()`

**接口**: `GET /api/system/menu/list`

**请求参数**: 无

**响应数据**:

```typescript
interface RouteModule {
  path: string
  name: string
  component: string
  meta: {
    title: string
    icon: string
    keepAlive?: boolean
    roles?: string[]
  }
  children?: RouteModule[]
}
```

**Mock 逻辑**:

- 开发环境：返回 `src/router/routes/asyncRoutes.ts` 中定义的路由
- 生产环境：调用真实 API 获取菜单配置

**使用示例**:

```typescript
const menuList = await fetchGetMenuList()
```

---

## 5. 外贸管理接口 (trade-manage)

文件位置：`src/api/trade-manage.ts`

### 5.1 客户管理 (Customer)

#### 5.1.1 获取客户列表

**函数**: `fetchGetCustomerList(params: CustomerSearchParams)`

**接口**: `GET /api/trade/customer/list`

**请求参数**:

```typescript
interface CustomerSearchParams {
  current: number // 当前页码
  size: number // 每页数量
  customerName?: string // 客户名称
  contactPerson?: string // 联系人
  contactPhone?: string // 联系电话
  contactEmail?: string // 联系邮箱
  country?: string // 国家
  source?: string // 来源
  status?: string // 状态：1-活跃 2-潜在 3-流失
  salesPerson?: string // 业务员
}
```

**响应数据**:

```typescript
interface CustomerListItem {
  id: string
  customerName: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  country: string
  address: string
  products: string
  source: string
  status: string
  salesPerson: string
  remarks: string
  quotationCount: number
  createTime: string
  updateBy: string
  updateTime: string
}

interface CustomerListResponse {
  records: CustomerListItem[]
  current: number
  size: number
  total: number
}
```

**Mock 数据**: `mock/data/customerList.json`

**使用示例**:

```typescript
const { records, total } = await fetchGetCustomerList({
  current: 1,
  size: 10,
  country: 'USA'
})
```

---

#### 5.1.2 获取客户详情

**函数**: `fetchGetCustomerDetail(id: string)`

**接口**: `GET /api/trade/customer/:id`

**请求参数**:

| 参数 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | string | 客户 ID |

**响应数据**: `CustomerListItem` 对象

**使用示例**:

```typescript
const customer = await fetchGetCustomerDetail('1')
```

---

#### 5.1.3 创建客户

**函数**: `fetchCreateCustomer(data: Partial<CustomerListItem>)`

**接口**: `POST /api/trade/customer`

**请求参数**: `CustomerListItem` 对象 (不含 `id`、`createTime`、`updateTime`)

**响应数据**:

```typescript
interface CreateResponse {
  code: number
  msg: string
  data: CustomerListItem
}
```

**使用示例**:

```typescript
const result = await fetchCreateCustomer({
  customerName: 'ABC Company',
  contactPerson: 'John Doe',
  contactPhone: '+1 234 567 8900',
  contactEmail: 'john@example.com',
  country: 'USA',
  status: '1'
})
```

---

#### 5.1.4 更新客户

**函数**: `fetchUpdateCustomer(data: Partial<CustomerListItem>)`

**接口**: `PUT /api/trade/customer`

**请求参数**:

| 参数 | 类型                      | 说明       |
| ---- | ------------------------- | ---------- |
| id   | string                    | 客户 ID    |
| data | Partial<CustomerListItem> | 更新的字段 |

**响应数据**:

```typescript
interface UpdateResponse {
  code: number
  msg: string
  data: CustomerListItem
}
```

**使用示例**:

```typescript
const result = await fetchUpdateCustomer({
  id: '1',
  contactEmail: 'newemail@example.com'
})
```

---

#### 5.1.5 删除客户

**函数**: `fetchDeleteCustomer(id: string)`

**接口**: `DELETE /api/trade/customer/:id`

**请求参数**:

| 参数 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | string | 客户 ID |

**响应数据**:

```typescript
interface DeleteResponse {
  code: number
  msg: string
  data: null
}
```

**使用示例**:

```typescript
await fetchDeleteCustomer('1')
```

---

### 5.2 产品管理 (Product)

#### 5.2.1 获取产品列表

**函数**: `fetchGetProductList(params: ProductSearchParams)`

**接口**: `GET /api/trade/product/list`

**请求参数**:

```typescript
interface ProductSearchParams {
  current: number // 当前页码
  size: number // 每页数量
  keyword?: string // 关键词：产品名称/SKU/规格型号
  type?: string // 产品类型
  grade?: string // 产品等级
  material?: string // 材质
  status?: string // 状态：on_sale-上架 off_sale-下架
}
```

**响应数据**:

```typescript
interface ProductListItem {
  id: string
  name: string // 产品名称
  sku: string // 产品编号
  type: string // 产品类型：切割片/百叶片/磨光片/其他
  grade: string // 产品等级：A 级/B 级/C 级
  spec: string // 规格型号
  material: string // 材质
  unit: string // 单位
  costPrice: number // 成本价
  salePrice: number // 销售价
  currency: string // 币种
  moq: number // 最小起订量
  stock: number // 库存数量
  leadTime: string // 交货期
  mainImage: string // 主图
  imageCount: number // 图片数量
  status: string // 状态：on_sale-上架 off_sale-下架
  description: string // 产品描述
  notes: string // 内部备注
  // 包装信息
  singleWeight: string // 单片重量
  blisterQuantity: number // 吸塑数量
  innerBoxQuantity: number // 内盒数量
  cartonQuantity: number // 每箱数量
  cartonSize: string // 外箱尺寸
  grossWeight: number // 每箱毛重
  netWeight: number // 每箱净重
  createTime: string
  updateBy: string
  updateTime: string
}

interface ProductListResponse {
  records: ProductListItem[]
  current: number
  size: number
  total: number
}
```

**产品类型**: 切割片、百叶片、磨光片、其他  
**产品等级**: A 级、B 级、C 级

**Mock 数据**: `mock/data/productList.json`

**使用示例**:

```typescript
const { records, total } = await fetchGetProductList({
  current: 1,
  size: 10,
  type: '切割片'
})
```

---

#### 5.2.2 获取产品详情

**函数**: `fetchGetProductDetail(id: string)`

**接口**: `GET /api/trade/product/:id`

**请求参数**:

| 参数 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | string | 产品 ID |

**响应数据**: `ProductListItem` 对象

**使用示例**:

```typescript
const product = await fetchGetProductDetail('1')
```

---

#### 5.2.3 创建产品

**函数**: `fetchCreateProduct(data: Partial<ProductListItem>)`

**接口**: `POST /api/trade/product`

**请求参数**: `ProductListItem` 对象 (不含 `id`、`createTime`、`updateTime`)

**响应数据**:

```typescript
interface CreateResponse {
  code: number
  msg: string
  data: ProductListItem
}
```

**使用示例**:

```typescript
const result = await fetchCreateProduct({
  name: '切割片 A 型',
  type: '切割片',
  sku: 'CP-A-001',
  spec: '100mm x 1.2mm',
  grade: 'A 级',
  material: '刚玉',
  salePrice: 15.5,
  stock: 1000
})
```

---

#### 5.2.4 更新产品

**函数**: `fetchUpdateProduct(data: Partial<ProductListItem>)`

**接口**: `PUT /api/trade/product`

**请求参数**:

| 参数 | 类型                     | 说明       |
| ---- | ------------------------ | ---------- |
| id   | string                   | 产品 ID    |
| data | Partial<ProductListItem> | 更新的字段 |

**响应数据**:

```typescript
interface UpdateResponse {
  code: number
  msg: string
  data: ProductListItem
}
```

**使用示例**:

```typescript
const result = await fetchUpdateProduct({
  id: '1',
  salePrice: 12.5,
  stock: 800
})
```

---

#### 5.2.5 删除产品

**函数**: `fetchDeleteProduct(id: string)`

**接口**: `DELETE /api/trade/product/:id`

**请求参数**:

| 参数 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | string | 产品 ID |

**响应数据**:

```typescript
interface DeleteResponse {
  code: number
  msg: string
  data: null
}
```

**使用示例**:

```typescript
await fetchDeleteProduct('1')
```

---

### 5.3 报价管理 (Quotation)

#### 5.3.1 获取报价列表

**函数**: `fetchGetQuotationList(params: QuotationSearchParams)`

**接口**: `GET /api/trade/quotation/list`

**请求参数**:

```typescript
interface QuotationSearchParams {
  current: number // 当前页码
  size: number // 每页数量
  customerId?: string // 客户 ID
  customerName?: string // 客户名称
  quotationNo?: string // 报价单号
  productName?: string // 产品名称
  status?: string // 状态
  currency?: string // 币种
  startTime?: string // 开始日期
  endTime?: string // 结束日期
}
```

**响应数据**:

```typescript
interface QuotationListItem {
  id: string
  customerId: string // 客户 ID
  customerName: string // 客户名称
  quotationNo: string // 报价单号
  productName: string // 产品名称
  specification: string // 规格型号
  quantity: number // 数量
  unit: string // 单位
  unitPrice: number // 单价
  currency: string // 币种
  totalPrice: number // 总金额
  tradeTerm: string // 贸易条款
  paymentTerm: string // 付款方式
  validity: string // 报价有效期
  remarks: string // 备注
  status: string // 状态
  quotationDate: string // 报价日期
  createTime: string
  updateBy: string
  updateTime: string
  // 扩展字段
  shipmentPort?: string // 装运港口
  leadTime?: string // 交货期
  clientWhatsapp?: string // 客户 WhatsApp
  clientEmail?: string // 客户邮箱
  products?: QuotationProduct[] // 产品列表
  costSummary?: QuotationCostSummary // 费用汇总
}

interface QuotationProduct {
  id: string
  selectedProductId?: string
  variants: ProductVariant[]
}

interface ProductVariant {
  id: string
  sku: string
  desc: string
  spec: string
  qty: number
  unit: string
  price: number
  image?: string
  total?: number
}

interface QuotationCostSummary {
  freightCharges: number // 运费
  discountValue: number // 折扣值
  discountType: 'percent' | 'fixed' // 折扣类型
  taxValue: number // 税费
  otherCharges: number // 其他费用
  subtotal: number // 产品小计
  grandTotal: number // 总计
}

interface QuotationListResponse {
  records: QuotationListItem[]
  current: number
  size: number
  total: number
}
```

**报价单号规则**: `CI-YYYYMMDD-NNN` (如 `CI-20260325-001`)  
**状态**: 待确认、已接受、已拒绝、已过期

**Mock 数据**: `mock/data/quotationList.json`

**使用示例**:

```typescript
const { records, total } = await fetchGetQuotationList({
  current: 1,
  size: 10,
  status: '1'
})
```

---

#### 5.3.2 获取客户报价记录列表

**函数**: `fetchGetCustomerQuotations(customerId: string, params: CommonSearchParams)`

**接口**: `GET /api/trade/customer/:customerId/quotations`

**请求参数**:

| 参数       | 类型               | 说明     |
| ---------- | ------------------ | -------- |
| customerId | string             | 客户 ID  |
| params     | CommonSearchParams | 分页参数 |

**响应数据**: `QuotationListResponse`

**使用示例**:

```typescript
const { records, total } = await fetchGetCustomerQuotations('1', {
  current: 1,
  size: 10
})
```

---

#### 5.3.3 获取报价详情

**函数**: `fetchGetQuotationDetail(id: string)`

**接口**: `GET /api/trade/quotation/:id`

**请求参数**:

| 参数 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | string | 报价 ID |

**响应数据**: `QuotationListItem` 对象（包含完整 `products` 和 `costSummary`）

**使用示例**:

```typescript
const quotation = await fetchGetQuotationDetail('1')
```

---

#### 5.3.4 创建报价

**函数**: `fetchCreateQuotation(data: Partial<QuotationListItem>)`

**接口**: `POST /api/trade/quotation`

**请求参数**: `QuotationListItem` 对象 (不含 `id`、`createTime`、`updateTime`)

**响应数据**:

```typescript
interface CreateResponse {
  code: number
  msg: string
  data: QuotationListItem
}
```

**使用示例**:

```typescript
const result = await fetchCreateQuotation({
  customerId: '1',
  customerName: 'ABC Company',
  quotationNo: 'CI-20260408-001',
  status: '1',
  products: [...],
  costSummary: {...}
})
```

---

#### 5.3.5 更新报价

**函数**: `fetchUpdateQuotation(data: Partial<QuotationListItem>)`

**接口**: `PUT /api/trade/quotation`

**请求参数**:

| 参数 | 类型                       | 说明       |
| ---- | -------------------------- | ---------- |
| id   | string                     | 报价 ID    |
| data | Partial<QuotationListItem> | 更新的字段 |

**响应数据**:

```typescript
interface UpdateResponse {
  code: number
  msg: string
  data: QuotationListItem
}
```

**使用示例**:

```typescript
const result = await fetchUpdateQuotation({
  id: '1',
  status: '2'
})
```

---

#### 5.3.6 删除报价

**函数**: `fetchDeleteQuotation(id: string)`

**接口**: `DELETE /api/trade/quotation/:id`

**请求参数**:

| 参数 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | string | 报价 ID |

**响应数据**:

```typescript
interface DeleteResponse {
  code: number
  msg: string
  data: null
}
```

**使用示例**:

```typescript
await fetchDeleteQuotation('1')
```

---

## 6. Mock 数据说明

### 6.1 数据存储

开发环境下，Mock 数据使用 LocalStorage 存储，保证数据持久化。

| 数据     | Storage Key            | JSON 文件                      |
| -------- | ---------------------- | ------------------------------ |
| 用户列表 | `system_user_list`     | `mock/data/userList.json`      |
| 客户列表 | `trade_customer_list`  | `mock/data/customerList.json`  |
| 产品列表 | `trade_product_list`   | `mock/data/productList.json`   |
| 报价列表 | `trade_quotation_list` | `mock/data/quotationList.json` |

### 6.2 自动同步

Vite 插件 `syncMockData` 会在开发环境下自动将 LocalStorage 的变更同步回 JSON 文件。

**触发时机**:

- LocalStorage 数据变更时
- 页面关闭时

**同步逻辑**:

```typescript
// Vite 配置中的插件逻辑
watch(localStorageChanges, () => {
  // 将最新数据写入 JSON 文件
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2))
})
```

### 6.3 用户数据结构

**`userList.json` 字段说明**:

```typescript
interface UserListItem {
  id: number
  userName: string // 真实姓名（用于显示）
  nickName: string // 昵称
  userPhone: string // 手机号（用于登录）
  userEmail: string // 邮箱
  password: string // 密码
  userGender: string // 性别
  userRoles: string[] // 角色列表：R_SUPER, R_ADMIN, R_USER
  avatar: string // 头像
  status: string // 状态：1-启用 2-禁用
  // 扩展字段
  realName?: string
  sex?: string
  intro?: string
  wechat?: string
  whatsapp?: string
  facebook?: string
  role?: string // 职位
  department?: string // 部门
  address?: string // 地址
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
}
```

### 6.4 清理演示数据

在浏览器控制台执行以下命令清理所有 Mock 数据:

```javascript
localStorage.clear()
```

然后刷新页面即可重置为初始 JSON 文件中的数据。

---

## 7. API 清单总览

### 7.1 认证模块 (auth.ts)

| 函数名             | 方法 | 说明         |
| ------------------ | ---- | ------------ |
| `fetchLogin`       | POST | 用户登录     |
| `fetchGetUserInfo` | GET  | 获取用户信息 |

### 7.2 用户模块 (user.ts)

| 函数名                | 方法 | 说明         |
| --------------------- | ---- | ------------ |
| `fetchGetUserInfo`    | GET  | 获取用户信息 |
| `fetchUpdateUserInfo` | POST | 更新用户信息 |

### 7.3 系统管理模块 (system-manage.ts)

| 函数名             | 方法 | 说明         |
| ------------------ | ---- | ------------ |
| `fetchGetUserList` | GET  | 获取用户列表 |
| `fetchGetRoleList` | GET  | 获取角色列表 |
| `fetchGetMenuList` | GET  | 获取菜单列表 |

### 7.4 客户管理模块 (trade-manage.ts)

| 函数名                   | 方法   | 说明         |
| ------------------------ | ------ | ------------ |
| `fetchGetCustomerList`   | GET    | 获取客户列表 |
| `fetchGetCustomerDetail` | GET    | 获取客户详情 |
| `fetchCreateCustomer`    | POST   | 创建客户     |
| `fetchUpdateCustomer`    | PUT    | 更新客户     |
| `fetchDeleteCustomer`    | DELETE | 删除客户     |

### 7.5 产品管理模块 (trade-manage.ts)

| 函数名                  | 方法   | 说明         |
| ----------------------- | ------ | ------------ |
| `fetchGetProductList`   | GET    | 获取产品列表 |
| `fetchGetProductDetail` | GET    | 获取产品详情 |
| `fetchCreateProduct`    | POST   | 创建产品     |
| `fetchUpdateProduct`    | PUT    | 更新产品     |
| `fetchDeleteProduct`    | DELETE | 删除产品     |

### 7.6 报价管理模块 (trade-manage.ts)

| 函数名                       | 方法   | 说明             |
| ---------------------------- | ------ | ---------------- |
| `fetchGetQuotationList`      | GET    | 获取报价列表     |
| `fetchGetCustomerQuotations` | GET    | 获取客户报价记录 |
| `fetchGetQuotationDetail`    | GET    | 获取报价详情     |
| `fetchCreateQuotation`       | POST   | 创建报价         |
| `fetchUpdateQuotation`       | PUT    | 更新报价         |
| `fetchDeleteQuotation`       | DELETE | 删除报价         |

---

## 附录

### A. 公共类型定义

```typescript
// 通用分页参数
interface CommonSearchParams {
  current: number
  size: number
}

// 通用分页响应
interface PaginatedResponse<T> {
  records: T[]
  current: number
  size: number
  total: number
}

// 通用操作响应
interface ActionResponse {
  code: number
  msg: string
  data?: any
}
```

### B. 状态码说明

| 状态码 | 说明         |
| ------ | ------------ |
| 200    | 请求成功     |
| 400    | 请求参数错误 |
| 401    | 未授权       |
| 403    | 禁止访问     |
| 404    | 资源不存在   |
| 500    | 服务器错误   |

---

<div align="center">
  <p>Art Design Pro - API 接口文档</p>
  <p>最后更新：2026-04-08</p>
</div>
