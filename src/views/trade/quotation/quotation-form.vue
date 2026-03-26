<!-- 报价表单 - 扁平化设计 -->
<template>
  <div class="quotation-form-page">
    <!-- 报价单头部信息 -->
    <ElCard class="art-card mb-4">
      <template #header>
        <div class="flex-b items-center">
          <span class="font-semibold text-lg">
            <ArtSvgIcon icon="ri:file-list-3-line" class="mr-2 text-primary" />
            报价单信息 / Quotation Information
          </span>
        </div>
      </template>

      <ElForm :model="formData" label-width="120px" class="quotation-info-form">
        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="报价单号">
              <ElInput v-model="formData.quotationNo" placeholder="QT20260326123" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="客户">
              <ElSelect
                v-model="formData.customerId"
                placeholder="选择客户"
                filterable
                style="width: 100%"
                @change="handleCustomerChange"
              >
                <ElOption
                  v-for="opt in customerOptions"
                  :key="opt.id"
                  :value="opt.id"
                  :label="opt.customerName"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="报价日期">
              <ElDatePicker v-model="formData.quotationDate" type="date" style="width: 100%" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="有效期">
              <ElInput v-model="formData.validity" placeholder="如：30 天" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="贸易条款">
              <ElSelect v-model="formData.tradeTerm" placeholder="选择条款" style="width: 100%">
                <ElOption label="FOB" value="FOB" />
                <ElOption label="CIF" value="CIF" />
                <ElOption label="EXW" value="EXW" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="付款方式">
              <ElInput v-model="formData.paymentTerm" placeholder="如：T/T 30% deposit" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="装运港口">
              <ElInput v-model="formData.shipmentPort" placeholder="如：Shanghai" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="交货期">
              <ElInput v-model="formData.leadTime" placeholder="如：30 days" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="币种">
              <ElSelect v-model="formData.currency" style="width: 100%">
                <ElOption label="USD" value="USD" />
                <ElOption label="EUR" value="EUR" />
                <ElOption label="CNY" value="CNY" />
                <ElOption label="GBP" value="GBP" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="客户 WhatsApp">
              <ElInput v-model="formData.clientWhatsapp" placeholder="+86 138 0000 0000" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="客户邮箱">
              <ElInput v-model="formData.clientEmail" placeholder="client@example.com" />
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
    </ElCard>

    <!-- 产品列表 - 表格形式 -->
    <ElCard class="art-card">
      <template #header>
        <div class="flex-b items-center">
          <span class="font-semibold text-lg">
            <ArtSvgIcon icon="ri:package-line" class="mr-2 text-primary" />
            产品列表 / Products
          </span>
          <ElButton type="primary" @click="addProduct">
            <ArtSvgIcon icon="ri:add-line" class="mr-1" />
            添加产品
          </ElButton>
        </div>
      </template>

      <ElTable
        :data="formData.products"
        border
        class="products-table"
        header-cell-class-name="table-header-center"
      >
        <!-- 序号 -->
        <ElTableColumn type="index" width="50" align="center" label="序号" />

        <!-- 产品图片 -->
        <ElTableColumn width="100" align="center" label="产品图">
          <template #default="{ row, $index }">
            <ElUpload
              :file-list="row.image ? [{ url: row.image }] : []"
              :limit="1"
              accept="image/*"
              :show-file-list="false"
              :before-upload="handleImageBeforeUpload"
              :on-change="(file) => handleImageChange(file, $index)"
            >
              <div v-if="!row.image" class="image-upload-btn">
                <ArtSvgIcon icon="ri:image-add-line" class="text-2xl text-g-300" />
              </div>
              <img v-else :src="row.image" class="product-image" />
            </ElUpload>
          </template>
        </ElTableColumn>

        <!-- 产品名称（从产品库选择） -->
        <ElTableColumn min-width="180" label="产品名称" align="center">
          <template #default="{ row, $index }">
            <ElSelect
              v-model="row.selectedProductId"
              placeholder="选择产品或手动输入"
              filterable
              clearable
              @change="(val) => handleProductSelect(val, $index)"
              style="width: 100%"
            >
              <ElOption
                v-for="opt in productOptions"
                :key="opt.id"
                :value="opt.id"
                :label="opt.name"
              >
                <div class="flex items-center gap-2">
                  <img
                    v-if="opt.mainImage"
                    :src="opt.mainImage"
                    class="w-8 h-8 rounded object-cover"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="font-medium truncate">{{ opt.name }}</div>
                    <div class="text-xs text-g-400">
                      {{ opt.spec }} | {{ opt.grade }} | MOQ: {{ opt.moq }}
                    </div>
                  </div>
                  <div class="text-primary font-semibold">
                    {{ formatPrice(opt.salePrice, opt.currency) }}
                  </div>
                </div>
              </ElOption>
            </ElSelect>
          </template>
        </ElTableColumn>

        <!-- 产品型号 -->
        <ElTableColumn width="120" label="型号/SKU" align="center">
          <template #default="{ row }">
            <ElInput v-model="row.sku" placeholder="型号" class="compact-input" />
          </template>
        </ElTableColumn>

        <!-- 产品等级 -->
        <ElTableColumn width="80" label="等级" align="center">
          <template #default="{ row }">
            <ElTag
              v-if="row.grade"
              :type="getGradeTagType(row.grade)"
              size="small"
              class="grade-tag"
              @click="editGrade(row)"
            >
              {{ row.grade }}
            </ElTag>
            <ElSelect v-else v-model="row.grade" placeholder="等级" style="width: 100%">
              <ElOption label="A 级" value="A 级" />
              <ElOption label="B 级" value="B 级" />
              <ElOption label="C 级" value="C 级" />
            </ElSelect>
          </template>
        </ElTableColumn>

        <!-- 产品类型 -->
        <ElTableColumn width="100" label="产品类型" align="center">
          <template #default="{ row }">
            <ElTag
              v-if="row.type"
              :type="getTypeTagType(row.type)"
              size="small"
              class="type-tag"
              @click="editType(row)"
            >
              {{ row.type }}
            </ElTag>
            <ElSelect v-else v-model="row.type" placeholder="类型" style="width: 100%">
              <ElOption label="切割片" value="切割片" />
              <ElOption label="百叶片" value="百叶片" />
              <ElOption label="磨光片" value="磨光片" />
              <ElOption label="其他" value="其他" />
            </ElSelect>
          </template>
        </ElTableColumn>

        <!-- 数量 -->
        <ElTableColumn width="100" label="数量" align="center">
          <template #default="{ row, $index }">
            <ElInputNumber
              v-model="row.qty"
              :min="0"
              :precision="0"
              placeholder="0"
              controls-position="right"
              style="width: 100%"
              class="compact-input-number"
              @change="updateTotal($index)"
            />
          </template>
        </ElTableColumn>

        <!-- 单价 -->
        <ElTableColumn width="110" label="单价" align="center">
          <template #default="{ row, $index }">
            <ElInputNumber
              v-model="row.price"
              :min="0"
              :precision="2"
              placeholder="0.00"
              controls-position="right"
              style="width: 100%"
              class="compact-input-number"
              @change="updateTotal($index)"
            />
          </template>
        </ElTableColumn>

        <!-- 小计 -->
        <ElTableColumn width="120" label="小计" align="center">
          <template #default="{ row }">
            <span class="font-bold text-primary text-base">
              {{ formatAmount(row.total || 0, formData.currency || 'USD') }}
            </span>
          </template>
        </ElTableColumn>

        <!-- 产品备注（展开显示） -->
        <ElTableColumn min-width="150" label="备注" align="center">
          <template #default="{ row }">
            <ElInput
              v-model="row.remark"
              type="textarea"
              :rows="1"
              placeholder="可选备注"
              autosize
              class="compact-textarea"
            />
          </template>
        </ElTableColumn>

        <!-- 操作 -->
        <ElTableColumn width="80" align="center" label="操作" fixed="right">
          <template #default="{ $index }">
            <ElButton type="danger" link @click="removeProduct($index)">
              <ArtSvgIcon icon="ri:delete-bin-line" class="text-lg" />
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>

    <!-- 费用汇总 -->
    <ElCard class="art-card mt-4">
      <template #header>
        <div class="flex-b items-center">
          <span class="font-semibold text-lg">
            <ArtSvgIcon icon="ri:calculator-line" class="mr-2 text-primary" />
            费用汇总 / Cost Summary
          </span>
        </div>
      </template>

      <ElForm :model="formData.costSummary" label-width="100px">
        <!-- 费用明细 -->
        <div class="cost-section-title">费用明细 / Charges</div>
        <ElRow :gutter="20" class="costs-row">
          <ElCol :span="6">
            <ElFormItem label="运费">
              <ElInputNumber
                v-model="formData.costSummary.freightCharges"
                :min="0"
                :precision="2"
                placeholder="0.00"
                controls-position="right"
                style="width: 100%"
                @change="calculateTotals"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="折扣">
              <ElInputNumber
                v-model="formData.costSummary.discountValue"
                :min="0"
                :precision="2"
                placeholder="0.00"
                controls-position="right"
                style="width: 100%"
                @change="calculateTotals"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="5">
            <ElFormItem label="折扣类型">
              <ElSelect v-model="formData.costSummary.discountType" style="width: 100%">
                <ElOption label="百分比" value="percent" />
                <ElOption label="固定金额" value="fixed" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="税费">
              <ElInputNumber
                v-model="formData.costSummary.taxValue"
                :min="0"
                :precision="2"
                placeholder="0.00"
                controls-position="right"
                style="width: 100%"
                @change="calculateTotals"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="其他费用">
              <ElInputNumber
                v-model="formData.costSummary.otherCharges"
                :min="0"
                :precision="2"
                placeholder="0.00"
                controls-position="right"
                style="width: 100%"
                @change="calculateTotals"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 合计区域 -->
        <div class="cost-section-title">金额汇总 / Summary</div>
        <ElRow :gutter="20" class="summary-row">
          <ElCol :span="8">
            <div class="summary-item">
              <span class="summary-label">产品总计</span>
              <span class="summary-value">{{
                formatAmount(productsSubtotal, formData.currency || 'USD')
              }}</span>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="summary-item">
              <span class="summary-label">折扣后合计</span>
              <span class="summary-value discount">{{
                formatAmount(
                  formData.costSummary.subtotal -
                    (formData.costSummary.discountType === 'percent'
                      ? formData.costSummary.subtotal * (formData.costSummary.discountValue / 100)
                      : formData.costSummary.discountValue),
                  formData.currency || 'USD'
                )
              }}</span>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="summary-item grand-total">
              <span class="summary-label">总计</span>
              <span class="summary-value">{{
                formatAmount(grandTotal, formData.currency || 'USD')
              }}</span>
            </div>
          </ElCol>
        </ElRow>
      </ElForm>
    </ElCard>

    <!-- 操作按钮 -->
    <div class="form-actions mt-4 flex gap-4">
      <ElButton type="primary" @click="handleSubmit">
        <ArtSvgIcon icon="ri:save-line" class="mr-1" />
        保存报价
      </ElButton>
      <ElButton @click="handleCancel">取消</ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'
  import { useRouter, useRoute } from 'vue-router'
  import { fetchGetCustomerList, fetchGetProductList } from '@/api/trade-manage'

  defineOptions({ name: 'QuotationForm' })

  const router = useRouter()
  const route = useRoute()
  const isEdit = computed(() => !!route.params.id)

  // 客户列表
  const customerOptions = ref<Api.Trade.CustomerListItem[]>([])
  // 产品列表
  const productOptions = ref<Api.Trade.ProductListItem[]>([])

  // 表单数据 - 扁平化结构
  const formData = ref({
    quotationNo: '',
    customerId: '',
    customerName: '',
    quotationDate: new Date().toISOString().slice(0, 10),
    validity: '',
    currency: 'USD',
    tradeTerm: '',
    paymentTerm: '',
    shipmentPort: '',
    leadTime: '',
    clientWhatsapp: '',
    clientEmail: '',
    // 产品列表（扁平化）
    products: [] as Array<{
      id: string
      selectedProductId?: string // 关联的产品库 ID
      image?: string // 产品图片
      sku: string // 型号
      name: string // 产品名称
      type: string // 产品类型
      grade: string // 产品等级
      qty: number // 数量
      unit: string // 单位
      price: number // 单价
      currency: string // 币种
      total: number // 小计
      remark?: string // 备注
    }>,
    costSummary: {
      freightCharges: 0,
      discountValue: 0,
      discountType: 'percent' as const,
      taxValue: 0,
      otherCharges: 0,
      subtotal: 0,
      grandTotal: 0
    }
  })

  // 产品小计
  const productsSubtotal = computed(() => {
    return formData.value.products.reduce((sum, p) => sum + (p.total || 0), 0)
  })

  // 总计（实时计算：产品小计 + 运费 - 折扣 + 税费 + 其他费用）
  const grandTotal = computed(() => {
    const { freightCharges, taxValue, otherCharges, discountValue, discountType } =
      formData.value.costSummary
    const discount =
      discountType === 'percent' ? productsSubtotal.value * (discountValue / 100) : discountValue
    return productsSubtotal.value - discount + freightCharges + taxValue + otherCharges
  })

  // 货币符号
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    CNY: '¥',
    GBP: '£'
  }

  // 格式化金额
  const formatAmount = (amount: number, currency: string) => {
    const symbol = currencySymbols[currency] || currency
    return `${symbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }

  // 格式化价格
  const formatPrice = (price: number, currency: string = 'USD') => {
    const symbol = currencySymbols[currency] || currency
    return `${symbol}${price.toFixed(2)}`
  }

  // 生成报价单号
  const generateQuotationNo = () => {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 900 + 100)
    return `QT${dateStr}${random}`
  }

  // 上传图片前验证
  const handleImageBeforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) ElMessage.error('只能上传图片')
    return isImage
  }

  // 图片上传
  const handleImageChange = (file: any, index: number) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.products[index].image = e.target?.result as string
    }
    reader.readAsDataURL(file.raw)
  }

  // 选择产品（从产品库）
  const handleProductSelect = (productId: string | undefined, index: number) => {
    if (!productId) {
      // 清空选择，保留手动输入
      formData.value.products[index].selectedProductId = ''
      return
    }

    const product = productOptions.value.find((p) => p.id === productId)
    if (!product) return

    // 自动填充产品信息
    formData.value.products[index] = {
      ...formData.value.products[index],
      selectedProductId: product.id,
      image: product.mainImage || '',
      sku: product.sku || '',
      name: product.name,
      type: product.type,
      grade: product.grade,
      unit: product.unit || '片',
      price: product.salePrice || 0,
      currency: product.currency || 'USD',
      remark: product.description || ''
    }
    updateTotal(index)
  }

  // 选择客户
  const handleCustomerChange = (customerId: string) => {
    const customer = customerOptions.value.find((c) => c.id === customerId)
    if (customer) {
      formData.value.customerName = customer.customerName
    }
  }

  // 获取等级标签类型
  const getGradeTagType = (grade: string) => {
    const types: Record<string, 'success' | 'primary' | 'warning'> = {
      'A 级': 'success',
      'B 级': 'primary',
      'C 级': 'warning'
    }
    return types[grade] || 'info'
  }

  // 获取类型标签类型
  const getTypeTagType = (type: string) => {
    const types: Record<string, 'primary' | 'success' | 'warning' | 'info'> = {
      切割片: 'primary',
      百叶片: 'success',
      磨光片: 'warning',
      其他: 'info'
    }
    return types[type] || 'info'
  }

  // 编辑等级（点击标签清空，显示下拉框）
  const editGrade = (row: any) => {
    row.grade = ''
  }

  // 编辑类型（点击标签清空，显示下拉框）
  const editType = (row: any) => {
    row.type = ''
  }

  // 添加产品
  const addProduct = () => {
    formData.value.products.push({
      id: Date.now().toString(),
      selectedProductId: '',
      image: '',
      sku: '',
      name: '',
      type: '',
      grade: '',
      qty: 1,
      unit: '片',
      price: 0,
      currency: 'USD',
      total: 0,
      remark: ''
    })
  }

  // 删除产品
  const removeProduct = (index: number) => {
    if (formData.value.products.length === 1) {
      ElMessage.warning('至少保留一行产品')
      return
    }
    formData.value.products.splice(index, 1)
    calculateTotals()
  }

  // 更新小计
  const updateTotal = (index: number) => {
    const product = formData.value.products[index]
    product.total = (product.qty || 0) * (product.price || 0)
    calculateTotals()
  }

  // 计算总计
  const calculateTotals = () => {
    // 更新所有产品的小计
    formData.value.products.forEach((p) => {
      p.total = (p.qty || 0) * (p.price || 0)
    })

    // 更新产品总计
    formData.value.costSummary.subtotal = formData.value.products.reduce(
      (sum, p) => sum + (p.total || 0),
      0
    )
  }

  // 提交保存
  const handleSubmit = () => {
    ElMessage.success('报价单已保存（演示版）')
    // TODO: 实现保存逻辑
    console.log('Form data:', formData.value)
  }

  // 取消
  const handleCancel = () => {
    router.back()
  }

  // 加载数据
  const loadData = async () => {
    try {
      const customerRes = await fetchGetCustomerList({ current: 1, size: 100 })
      customerOptions.value = (customerRes.data as any)?.records || []

      const productRes = await fetchGetProductList({ current: 1, size: 100 })
      productOptions.value = (productRes.data as any)?.records || []

      if (!isEdit.value && !formData.value.quotationNo) {
        formData.value.quotationNo = generateQuotationNo()
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  }

  onMounted(() => {
    loadData()
    addProduct() // 添加第一行
  })
</script>

<style lang="scss" scoped>
  .quotation-info-form {
    :deep(.el-form-item) {
      margin-bottom: 16px;
    }

    :deep(.el-input-number) {
      width: 100%;
    }
  }

  .products-table {
    // 表格头部样式
    :deep(.el-table__header th) {
      font-size: 13px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      background: linear-gradient(to bottom, var(--el-fill-color), var(--el-fill-color-light));
    }

    // 表头居中
    :deep(.table-header-center) {
      text-align: center !important;
    }

    // 表格行样式
    :deep(.el-table__row) {
      &:hover {
        background-color: var(--el-fill-color-lighter);
      }

      .el-table__cell {
        text-align: center;
      }
    }

    // 单元格内输入框
    :deep(.el-input__wrapper),
    :deep(.el-select .el-input__wrapper),
    :deep(.el-textarea__inner) {
      border-color: var(--el-border-color-light);
      box-shadow: none;
      transition: all 0.2s;

      &:hover {
        border-color: var(--el-color-primary-light-5);
      }

      &:focus-within {
        border-color: var(--el-color-primary);
        box-shadow: 0 0 0 1px var(--el-color-primary-light-9) inset;
      }
    }

    // 居中输入框内容
    :deep(.el-input__inner),
    :deep(.el-textarea__inner) {
      text-align: center;
    }

    // 数字输入框
    :deep(.el-input-number) {
      width: 100%;

      .el-input__wrapper {
        padding-right: 8px;
        padding-left: 8px;
      }
    }

    // 紧凑输入框
    .compact-input {
      :deep(.el-input__wrapper) {
        padding-right: 6px;
        padding-left: 6px;
      }
    }

    .compact-input-number {
      :deep(.el-input-number__decrease),
      :deep(.el-input-number__increase) {
        display: none;
      }
    }

    .compact-textarea {
      :deep(.el-textarea__inner) {
        padding: 4px 8px;
        font-size: 13px;
      }
    }

    // 图片上传按钮
    .image-upload-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      cursor: pointer;
      border: 2px dashed var(--el-border-color);
      border-radius: 8px;
      transition: all 0.2s;

      &:hover {
        background: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary);
      }
    }

    // 产品图片
    .product-image {
      width: 60px;
      height: 60px;
      cursor: pointer;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.05);
      }
    }

    // 等级和类型标签
    .grade-tag,
    .type-tag {
      font-weight: 500;
      cursor: pointer;
    }
  }

  .products-summary {
    box-shadow: 0 2px 12px rgb(0 0 0 / 5%);
  }

  .form-actions {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }

  // 费用汇总区域样式
  .cost-section-title {
    padding-left: 12px;
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    border-left: 3px solid var(--el-color-primary);
  }

  .costs-row {
    margin-bottom: 20px;
  }

  .summary-row {
    padding: 20px 16px;
    background: linear-gradient(to right, var(--el-fill-color-light), var(--el-fill-color-lighter));
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
  }

  .summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: 0 1px 3px rgb(0 0 0 / 5%);
    transition: all 0.2s;

    &:hover {
      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
    }
  }

  .summary-label {
    margin-bottom: 8px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  .summary-value {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);

    &.discount {
      color: var(--el-color-warning);
    }
  }

  .grand-total {
    background: linear-gradient(
      to right,
      var(--el-color-primary-light-9),
      var(--el-color-primary-light-7)
    );
    border: 1px solid var(--el-color-primary-light-5);

    .summary-label {
      color: var(--el-color-primary-dark-2);
    }

    .summary-value {
      font-size: 24px;
      font-weight: bold;
      color: var(--el-color-primary);
    }
  }
</style>
