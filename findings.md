# Art Design Pro - 研究发现

> 🔍 存储项目开发过程中的重要发现、技术决策和知识点

**创建时间**: 2026-04-08  
**最后更新**: 2026-04-08

---

## 项目架构发现

### 技术栈

```
Vue 3.5.21 + TypeScript 5.6.3 + Vite 7.1.5
Pinia (状态管理)
Element Plus (UI 组件库)
Tailwind CSS (工具类)
Vue Router 4 (路由)
```

### 项目结构

```
src/
├── api/              # API 接口层
│   ├── auth.ts       # 认证接口
│   ├── user.ts       # 用户接口
│   ├── system-manage.ts   # 系统管理
│   └── trade-manage.ts    # 外贸管理
├── types/api/        # TypeScript 类型定义
│   └── api.d.ts      # 所有 API 类型
├── store/            # Pinia 状态管理
├── views/            # 页面组件
├── components/       # 通用组件
├── utils/            # 工具函数
│   ├── user-data-mapper.ts  # 字段映射
│   └── http/         # HTTP 请求封装
└── mock/             # Mock 数据
    ├── data/         # JSON 数据文件
    └── temp/         # Mock 逻辑
```

---

## 关键设计决策

### 1. 单一数据源

**决策**: 使用 `userList.json` 作为用户数据的唯一来源

**原因**:

- 避免登录数据与个人中心数据不一致
- 简化数据管理逻辑
- 统一的字段映射层

**实现**:

- `src/utils/user-data-mapper.ts` 负责类型转换
- `Api.SystemManage.UserListItem` ↔ `Api.Auth.UserInfo`

---

### 2. 登录使用手机号

**决策**: 登录账号使用手机号而非用户名

**原因**:

- 更符合实际业务场景
- 手机号唯一且易记

**实现**:

```typescript
interface LoginParams {
  phone: string // 手机号登录
  password: string // 密码
}
```

---

### 3. Mock 数据持久化

**决策**: LocalStorage + JSON 文件双存储

**原因**:

- 开发时数据不丢失
- 便于版本管理和分享

**实现**:

- Vite 插件 `syncMockData` 自动同步
- Storage Key: `system_user_list`, `trade_customer_list` 等

---

## TypeScript 重构成果 (2026-04-08)

### 修复的问题

| 问题类型       | 数量 | 解决方案                                     |
| -------------- | ---- | -------------------------------------------- |
| 类型定义缺失   | 8    | 补充 `password`, `status`, `products` 等字段 |
| Props 引用错误 | 23   | `premium-product-card.vue` 扁平化 props      |
| 类型转换错误   | 6    | 使用 `as unknown as` 中转                    |
| 组件类型不匹配 | 10   | 修复 `ElTag size`, `UploadUserFile` 等       |

### 构建状态

```
✅ TypeScript 编译通过 (0 错误)
✅ ESLint 检查通过 (0 错误)
✅ 构建时间 ~31 秒
```

---

## API 设计原则

1. **统一返回格式** - `{ code, msg, data }`
2. **函数命名** - `fetch + 动作 + 模块` (如 `fetchGetUserList`)
3. **类型安全** - 所有参数/返回值都有类型定义
4. **环境隔离** - 开发用 Mock，生产用真实 API

---

## 常见问题解决方案

### 问题：登录状态刷新后丢失

**原因**: userId 未正确设置到 store

**解决**:

```typescript
// 登录流程
const { token, refreshToken, userId } = await fetchLogin({ phone, password })
userStore.setToken(token, refreshToken)
if (userId) {
  userStore.setUserInfo({ userId } as Api.Auth.UserInfo) // 先设置 userId
}
const userInfo = await fetchGetUserInfo()
userStore.setUserInfo(userInfo.data) // 再设置完整信息
```

### 问题：Mock 数据被旧数据覆盖

**原因**: LocalStorage 旧数据同步回 JSON

**解决**:

1. 浏览器执行 `localStorage.clear()`
2. 强制刷新页面
3. 重新测试

### 问题：报价单编辑模式下的时序问题 (2026-04-08)

**症状**:

- 编辑报价单时，表单会短暂显示空行后被真实数据覆盖（视觉闪烁）
- 客户选择器在数据加载完成前显示空白
- 报价单不存在时没有错误提示

**原因**:

1. `addProduct()` 在 `onMounted` 中与异步的 `loadData()` 同时执行，导致空行被随后加载的数据覆盖
2. `loadQuotationDetail()` 在 `customerOptions` 加载完成前设置 `customerId`
3. 缺少数据不存在的错误边界处理

**解决**:

```typescript
// 1. 编辑模式不调用 addProduct()
onMounted(() => {
  loadData() // 移除 addProduct()
})

// 2. loadData 中区分编辑/新增模式
const loadData = async () => {
  // 先加载选项
  await fetchGetCustomerList()
  await fetchGetProductList()

  if (isEdit.value) {
    await loadQuotationDetail() // 编辑模式：加载详情
  } else {
    // 新增模式：设置客户、生成单号、添加空行
    if (customerId) {
      /* ... */
    }
    generateQuotationNo()
    addProduct()
  }
}

// 3. loadQuotationDetail 添加错误处理
const loadQuotationDetail = async () => {
  const data = await fetchGetQuotationDetail(id)
  if (!data) {
    ElMessage.error('报价单不存在')
    router.push('/trade/quotation')
  }
  // 填充表单...
}
```

---

### 问题：报价单客户信息字段设计 (2026-04-08)

**需求**: 报价单中的客户信息应该从客户档案自动带过来，但允许临时覆盖（应对客户人员变动）。

**设计决策**:

1. **客户信息独立展示** - 与报价单信息分开，形成两个 Card
2. **编辑模式锁定客户** - 编辑报价单时，`customerId` 禁用，防止报价归属被误改
3. **联系信息可覆盖** - 联系人、电话、邮箱等允许临时修改，不影响客户档案
4. **快照式设计** - 报价单保存的是客户信息快照，客户档案变更不影响历史报价

**字段分类**:

| 类别     | 字段                               | 是否可编辑         |
| -------- | ---------------------------------- | ------------------ |
| 客户归属 | 客户名称                           | 新增可选，编辑锁定 |
| 联系信息 | 联系人、联系电话、联系邮箱         | ✅ 可覆盖          |
| 联系信息 | WhatsApp、国家、地址、主营产品     | ✅ 可覆盖          |
| 报价信息 | 报价单号、日期、有效期             | ✅ 可编辑          |
| 贸易条款 | 贸易条款、付款方式、装运港、交货期 | ✅ 可编辑          |

**实现要点**:

```typescript
// 1. formData 区分客户产品和报价产品
customerProducts: ''      // 客户档案的主营产品
products: []              // 报价单的产品列表

// 2. handleCustomerChange 自动填充
const handleCustomerChange = (customerId: string) => {
  const customer = customerOptions.value.find(c => c.id === customerId)
  if (customer) {
    formData.value.contactPerson = customer.contactPerson || ''
    formData.value.contactPhone = customer.contactPhone || ''
    // ... 填充所有客户字段
  }
}

// 3. 编辑模式禁用客户选择器
<ElSelect :disabled="isEdit" v-model="formData.customerId" />
```

---

## 待扩展模块

| 模块     | 功能         | 优先级 |
| -------- | ------------ | ------ |
| 订单管理 | 订单 CRUD    | 高     |
| 跟进记录 | 客户跟进管理 | 中     |
| 数据统计 | 图表展示     | 低     |
