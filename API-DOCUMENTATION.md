# Art Design Pro - API 接口文档

> 📋 完整的 API 接口文档，包含所有端点的请求/响应类型和 Mock 数据说明

**最后更新**: 2026-04-07

---

## 目录

1. [API 概述](#1-api 概述)
2. [认证接口](#2-认证接口-auth)
3. [用户接口](#3-用户接口-user)
4. [系统管理接口](#4-系统管理接口-system-manage)
5. [外贸管理接口](#5-外贸管理接口-trade-manage)
6. [Mock 数据说明](#6-mock 数据说明)

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
const result = await fetchLogin({ userName, password })
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

**函数**: `fetchLogin(data: LoginData)`

**接口**: `POST /api/auth/login`

**请求参数**:

```typescript
interface LoginData {
  userName: string // 用户名/手机号
  password: string // 密码
}
```

**响应数据**:

```typescript
interface LoginResponse {
  token: string // JWT Token
  refreshToken: string // 刷新 Token
}
```

**Mock 逻辑**:

- 验证手机号是否存在于 `userList` Mock 数据中
- 验证密码是否匹配
- 成功返回 `token` 和 `refreshToken`

**使用示例**:

```typescript
const { token, refreshToken } = await fetchLogin({
  userName: 'admin',
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
  id: string
  nickName: string // 昵称
  userName: string // 用户名
  email: string // 邮箱
  phone: string // 手机号
  role: number // 角色 ID
  avatar: string // 头像 URL
  createTime: string // 创建时间
}
```

**Mock 逻辑**:

- 从 `userList` Mock 数据中查找 ID 匹配的用户
- 返回用户信息对象

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
  id?: string
  nickName?: string
  userName?: string
  email?: string
  phone?: string
  role?: number
  avatar?: string
}
```

**响应数据**:

```typescript
interface UpdateResponse {
  message: string // 更新结果消息
  updatedData: UserInfo // 更新后的数据
}
```

**字段映射**:

```typescript
// UserInfo → UserListItem (用于更新 Mock 数据)
{
  id → userId,
  nickName → nickName,
  userName → name,
  email → email,
  phone → phone,
  role → role,
  avatar → avatar
}
```

**使用示例**:

```typescript
const result = await fetchUpdateUserInfo({
  nickName: '新昵称',
  email: 'new@email.com'
})
```

---

## 4. 系统管理接口 (system-manage)

文件位置：`src/api/system-manage.ts`

### 4.1 获取用户列表

**函数**: `fetchGetUserList(query?: UserListQuery)`

**接口**: `GET /api/user/list`

**请求参数**:

```typescript
interface UserListQuery {
  current?: number // 当前页码
  size?: number // 每页数量
  userName?: string // 用户名搜索
}
```

**响应数据**:

```typescript
interface UserListItem {
  userId: string // 用户 ID
  name: string // 姓名
  nickName: string // 昵称
  email: string // 邮箱
  phone: string // 手机号
  role: number // 角色 ID
  avatar: string // 头像
  createTime: string // 创建时间
  updateTime: string // 更新时间
}

interface UserListResponse {
  list: UserListItem[]
  total: number
}
```

**Mock 数据**: `mock/data/userInfo.json`

**使用示例**:

```typescript
const { list, total } = await fetchGetUserList({
  current: 1,
  size: 10
})
```

---

### 4.2 获取角色列表

**函数**: `fetchGetRoleList()`

**接口**: `GET /api/system/role/list`

**请求参数**: 无

**响应数据**:

```typescript
interface RoleItem {
  id: number
  roleName: string
  roleCode: string
  roleSort: number
  createTime?: string
}
```

**Mock 数据**:

```json
[
  { "id": 1, "roleName": "超级管理员", "roleCode": "super_admin", "roleSort": 1 },
  { "id": 2, "roleName": "管理员", "roleCode": "admin", "roleSort": 2 },
  { "id": 3, "roleName": "普通用户", "roleCode": "user", "roleSort": 3 }
]
```

**使用示例**:

```typescript
const roleList = await fetchGetRoleList()
```

---

### 4.3 获取菜单列表

**函数**: `fetchGetMenuList()`

**接口**: `GET /api/system/menu/list`

**请求参数**: 无

**响应数据**:

```typescript
// 返回动态路由配置数组
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

- 返回 `src/router/routes/asyncRoutes.ts` 中定义的路由
- 根据用户角色过滤权限

**使用示例**:

```typescript
const menuList = await fetchGetMenuList()
```

---

## 5. 外贸管理接口 (trade-manage)

文件位置：`src/api/trade-manage.ts`

### 5.1 客户管理 (Customer)

#### 5.1.1 获取客户列表

**函数**: `fetchGetCustomerList(query: CustomerListQuery)`

**接口**: `GET /api/trade/customer/list`

**请求参数**:

```typescript
interface CustomerListQuery {
  current: number // 当前页码
  size: number // 每页数量
  name?: string // 客户名称搜索
  country?: string // 国家搜索
  source?: string // 来源搜索
  level?: string // 等级搜索
  status?: string // 状态搜索
}
```

**响应数据**:

```typescript
interface Customer {
  id: string // 客户 ID
  name: string // 客户名称
  contactPerson: string // 联系人
  email: string // 邮箱
  phone: string // 电话
  country: string // 国家
  source: string // 来源
  level: string // 等级
  status: string // 状态
  address?: string // 地址
  salesPerson?: string // 销售
  remarks?: string // 备注
  createTime: string // 创建时间
  updateTime: string // 更新时间
}

interface CustomerListResponse {
  list: Customer[]
  total: number
}
```

**Mock 数据**: `mock/data/customerList.json`

**使用示例**:

```typescript
const { list, total } = await fetchGetCustomerList({
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

**响应数据**: `Customer` 对象

**使用示例**:

```typescript
const customer = await fetchGetCustomerDetail('1')
```

---

#### 5.1.3 创建客户

**函数**: `fetchCreateCustomer(data: Customer)`

**接口**: `POST /api/trade/customer`

**请求参数**: `Customer` 对象 (不含 `id`、`createTime`、`updateTime`)

**响应数据**:

```typescript
interface CreateResponse {
  message: string
  customer: Customer
}
```

**使用示例**:

```typescript
const result = await fetchCreateCustomer({
  name: '新客户',
  contactPerson: 'John Doe',
  email: 'john@example.com',
  country: 'USA',
  level: 'A',
  status: 'active'
})
```

---

#### 5.1.4 更新客户

**函数**: `fetchUpdateCustomer(id: string, data: Partial<Customer>)`

**接口**: `PUT /api/trade/customer`

**请求参数**:

| 参数 | 类型     | 说明       |
| ---- | -------- | ---------- |
| id   | string   | 客户 ID    |
| data | Customer | 更新的字段 |

**响应数据**:

```typescript
interface UpdateResponse {
  message: string
  customer: Customer
}
```

**使用示例**:

```typescript
const result = await fetchUpdateCustomer('1', {
  email: 'newemail@example.com'
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
  message: string
}
```

**使用示例**:

```typescript
await fetchDeleteCustomer('1')
```

---

### 5.2 产品管理 (Product)

#### 5.2.1 获取产品列表

**函数**: `fetchGetProductList(query: ProductListQuery)`

**接口**: `GET /api/trade/product/list`

**请求参数**:

```typescript
interface ProductListQuery {
  current: number // 当前页码
  size: number // 每页数量
  name?: string // 产品名称搜索
  type?: string // 产品类型搜索
  grade?: string // 产品等级搜索
  sku?: string // SKU 搜索
}
```

**响应数据**:

```typescript
interface Product {
  id: string // 产品 ID
  name: string // 产品名称
  type: string // 产品类型
  sku: string // SKU
  specification: string // 规格
  grade: string // 等级
  material: string // 材质
  price: number // 价格
  stock: number // 库存
  image?: string // 图片 URL
  createTime: string // 创建时间
  updateTime: string // 更新时间
}

interface ProductListResponse {
  list: Product[]
  total: number
}
```

**产品类型**: 切割片、百叶片、磨光片、其他  
**产品等级**: A 级、B 级、C 级

**Mock 数据**: `mock/data/productList.json`

**使用示例**:

```typescript
const { list, total } = await fetchGetProductList({
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

**响应数据**: `Product` 对象

**使用示例**:

```typescript
const product = await fetchGetProductDetail('1')
```

---

#### 5.2.3 创建产品

**函数**: `fetchCreateProduct(data: Product)`

**接口**: `POST /api/trade/product`

**请求参数**: `Product` 对象 (不含 `id`、`createTime`、`updateTime`)

**响应数据**:

```typescript
interface CreateResponse {
  message: string
  product: Product
}
```

**使用示例**:

```typescript
const result = await fetchCreateProduct({
  name: '切割片 A 型',
  type: '切割片',
  sku: 'CP-A-001',
  specification: '100mm x 1.2mm',
  grade: 'A 级',
  material: '刚玉',
  price: 15.5,
  stock: 1000
})
```

---

#### 5.2.4 更新产品

**函数**: `fetchUpdateProduct(id: string, data: Partial<Product>)`

**接口**: `PUT /api/trade/product`

**请求参数**:

| 参数 | 类型    | 说明       |
| ---- | ------- | ---------- |
| id   | string  | 产品 ID    |
| data | Product | 更新的字段 |

**响应数据**:

```typescript
interface UpdateResponse {
  message: string
  product: Product
}
```

**使用示例**:

```typescript
const result = await fetchUpdateProduct('1', {
  price: 12.5,
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
  message: string
}
```

**使用示例**:

```typescript
await fetchDeleteProduct('1')
```

---

### 5.3 报价管理 (Quotation)

#### 5.3.1 获取报价列表

**函数**: `fetchGetQuotationList(query: QuotationListQuery)`

**接口**: `GET /api/trade/quotation/list`

**请求参数**:

```typescript
interface QuotationListQuery {
  current: number // 当前页码
  size: number // 每页数量
  quotationNo?: string // 报价单号搜索
  customerId?: string // 客户 ID 搜索
  status?: string // 状态搜索
  startDate?: string // 开始日期
  endDate?: string // 结束日期
}
```

**响应数据**:

```typescript
interface Quotation {
  id: string // 报价 ID
  quotationNo: string // 报价单号 (CI-YYYYMMDD-NNN)
  customerId: string // 客户 ID
  customerName: string // 客户名称
  products: Product[] // 产品数组
  totalAmount: number // 总金额
  currency: string // 币种
  tradeTerm: string // 贸易条款
  paymentTerm: string // 付款条款
  status: string // 状态
  validUntil: string // 有效期至
  remarks?: string // 备注
  createTime: string // 创建时间
  updateTime: string // 更新时间
}

interface QuotationListResponse {
  list: Quotation[]
  total: number
}
```

**报价单号规则**: `CI-YYYYMMDD-NNN` (如 `CI-20260325-001`)  
**状态**: 草稿、待发送、已发送、已确认、已拒绝

**Mock 数据**: `mock/data/quotationList.json`

**使用示例**:

```typescript
const { list, total } = await fetchGetQuotationList({
  current: 1,
  size: 10,
  status: '待发送'
})
```

---

#### 5.3.2 获取报价详情

**函数**: `fetchGetQuotationDetail(id: string)`

**接口**: `GET /api/trade/quotation/:id`

**请求参数**:

| 参数 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | string | 报价 ID |

**响应数据**: `Quotation` 对象

**使用示例**:

```typescript
const quotation = await fetchGetQuotationDetail('1')
```

---

#### 5.3.3 创建报价

**函数**: `fetchCreateQuotation(data: Quotation)`

**接口**: `POST /api/trade/quotation`

**请求参数**: `Quotation` 对象 (不含 `id`、`createTime`、`updateTime`)

**响应数据**:

```typescript
interface CreateResponse {
  message: string
  quotation: Quotation
}
```

**使用示例**:

```typescript
const result = await fetchCreateQuotation({
  quotationNo: 'CI-20260407-001',
  customerId: '1',
  customerName: 'ABC Company',
  products: [...],
  totalAmount: 5000,
  currency: 'USD',
  tradeTerm: 'FOB',
  paymentTerm: 'T/T',
  status: '草稿',
  validUntil: '2026-05-07'
})
```

---

#### 5.3.4 更新报价

**函数**: `fetchUpdateQuotation(id: string, data: Partial<Quotation>)`

**接口**: `PUT /api/trade/quotation`

**请求参数**:

| 参数 | 类型      | 说明       |
| ---- | --------- | ---------- |
| id   | string    | 报价 ID    |
| data | Quotation | 更新的字段 |

**响应数据**:

```typescript
interface UpdateResponse {
  message: string
  quotation: Quotation
}
```

**使用示例**:

```typescript
const result = await fetchUpdateQuotation('1', {
  status: '已发送'
})
```

---

#### 5.3.5 删除报价

**函数**: `fetchDeleteQuotation(id: string)`

**接口**: `DELETE /api/trade/quotation/:id`

**请求参数**:

| 参数 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | string | 报价 ID |

**响应数据**:

```typescript
interface DeleteResponse {
  message: string
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
| 用户信息 | `user_info`            | `mock/data/userInfo.json`      |
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

### 6.3 清理演示数据

执行以下命令清理所有 Mock 数据:

```bash
pnpm clean:dev
```

该命令会:

1. 清除所有 LocalStorage 中的 Mock 数据
2. 重置为初始 JSON 文件中的数据

---

## 附录

### A. 公共类型定义

```typescript
// 通用分页参数
interface PageQuery {
  current: number
  size: number
}

// 通用分页响应
interface PageResponse<T> {
  list: T[]
  total: number
}

// 通用操作响应
interface ActionResponse {
  message: string
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
  <p>最后更新：2026-04-07</p>
</div>
