# 产品管理模块 Mock 数据设置

## 已完成功能

### 1. Mock 数据文件

- **文件路径**: `src/mock/temp/productList.ts`
- **包含内容**:
  - 15 条产品示例数据（覆盖所有类型：切割片、百叶片、磨光片、其他）
  - 完整的字段信息（基本信息、商务信息、包装信息）
  - CRUD 操作函数：
    - `getProductListData()` - 获取产品列表（支持分页和搜索）
    - `getProductDetailById()` - 获取产品详情
    - `createProduct()` - 创建新产品
    - `updateProduct()` - 更新产品
    - `deleteProduct()` - 删除产品

### 2. API 接口适配

- **文件路径**: `src/api/trade-manage.ts`
- **更新内容**:
  - `fetchGetProductList()` - 使用 mock 数据
  - `fetchGetProductDetail()` - 使用 mock 数据
  - `fetchCreateProduct()` - 使用 mock 数据
  - `fetchUpdateProduct()` - 使用 mock 数据
  - `fetchDeleteProduct()` - 使用 mock 数据

### 3. 产品表单页面

- **文件路径**: `src/views/trade/product/product-form.vue`
- **功能**:
  - 新增/编辑产品表单
  - 图片上传功能（使用 picsum 随机图片）
  - 表单验证
  - 编辑模式下加载产品详情

### 4. 产品列表页面

- **文件路径**: `src/views/trade/product/index.vue`
- **更新内容**:
  - 删除功能调用 mock API

### 5. 产品详情页面

- **文件路径**: `src/views/trade/product/product-detail.vue`
- **状态**: 已使用 mock API

## 测试说明

### 访问产品管理

1. 启动开发服务器：`pnpm dev`
2. 访问：`http://localhost:5173/trade/product`

### 测试功能

- **查看列表**: 显示 15 条模拟产品数据
- **搜索**: 支持关键词、类型、等级、材质筛选
- **新增**: 点击"新增产品" → 填写表单 → 保存
- **编辑**: 点击操作栏编辑按钮 → 修改表单 → 保存
- **详情**: 点击操作栏查看按钮 → 查看产品详情
- **删除**: 点击操作栏删除按钮 → 确认删除

## Mock 数据说明

### 产品类型

- 切割片 (7 条)
- 百叶片 (4 条)
- 磨光片 (4 条)
- 其他 (2 条)

### 产品等级

- A 级：高质量产品
- B 级：普通产品
- C 级：经济型产品

### 图片资源

使用 picsum.photos 随机图片服务：

- 主图：`https://picsum.photos/400/400?random={id}`
- 上传模拟：每次上传生成随机图片 URL

## 注意事项

1. **数据持久化**: Mock 数据仅在当前会话中有效，刷新页面后数据会重置
2. **图片上传**: 使用 picsum 随机图片，实际部署需替换为真实上传接口
3. **生产环境**: 部署时请将 API 函数切换到真实后端接口（代码中已注释）

## 下一步工作

如需进一步完善，可以考虑：

1. 添加本地存储（localStorage）实现简单的数据持久化
2. 实现更复杂的搜索过滤逻辑
3. 添加批量导入/导出功能
4. 实现产品图片的真实上传功能
