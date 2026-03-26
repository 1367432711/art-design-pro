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

      <ElTable :data="formData.products" border class="products-table">
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
        <ElTableColumn min-width="180" label="产品名称">
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
        <ElTableColumn width="120" label="型号/SKU">
          <template #default="{ row }">
            <ElInput v-model="row.sku" placeholder="型号" />
          </template>
        </ElTableColumn>

        <!-- 产品等级 -->
        <ElTableColumn width="80" label="等级">
          <template #default="{ row }">
            <ElSelect v-model="row.grade" placeholder="等级" style="width: 100%">
              <ElOption label="A 级" value="A 级" />
              <ElOption label="B 级" value="B 级" />
              <ElOption label="C 级" value="C 级" />
            </ElSelect>
          </template>
        </ElTableColumn>

        <!-- 产品类型 -->
        <ElTableColumn width="100" label="产品类型">
          <template #default="{ row }">
            <ElSelect v-model="row.type" placeholder="类型" style="width: 100%">
              <ElOption label="切割片" value="切割片" />
              <ElOption label="百叶片" value="百叶片" />
              <ElOption label="磨光片" value="磨光片" />
              <ElOption label="其他" value="其他" />
            </ElSelect>
          </template>
        </ElTableColumn>

        <!-- 数量 -->
        <ElTableColumn width="100" align="right" label="数量">
          <template #default="{ row, $index }">
            <ElInputNumber
              v-model="row.qty"
              :min="0"
              :precision="0"
              placeholder="0"
              controls-position="right"
              style="width: 100%"
              @change="updateTotal($index)"
            />
          </template>
        </ElTableColumn>

        <!-- 单位 -->
        <ElTableColumn width="80" label="单位">
          <template #default="{ row }">
            <ElInput v-model="row.unit" placeholder="单位" style="width: 100%" />
          </template>
        </ElTableColumn>

        <!-- 单价 -->
        <ElTableColumn width="110" align="right" label="单价">
          <template #default="{ row, $index }">
            <ElInputNumber
              v-model="row.price"
              :min="0"
              :precision="2"
              placeholder="0.00"
              controls-position="right"
              style="width: 100%"
              @change="updateTotal($index)"
            />
          </template>
        </ElTableColumn>

        <!-- 币种 -->
        <ElTableColumn width="90" label="币种">
          <template #default="{ row }">
            <ElSelect v-model="row.currency" style="width: 100%">
              <ElOption label="USD" value="USD" />
              <ElOption label="EUR" value="EUR" />
              <ElOption label="CNY" value="CNY" />
              <ElOption label="GBP" value="GBP" />
            </ElSelect>
          </template>
        </ElTableColumn>

        <!-- 小计 -->
        <ElTableColumn width="120" align="right" label="小计">
          <template #default="{ row }">
            <span class="font-bold text-primary text-base">
              {{ formatAmount(row.total || 0, row.currency || 'USD') }}
            </span>
          </template>
        </ElTableColumn>

        <!-- 产品备注（展开显示） -->
        <ElTableColumn min-width="150" label="备注">
          <template #default="{ row }">
            <ElInput
              v-model="row.remark"
              type="textarea"
              :rows="1"
              placeholder="可选备注"
              autosize
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

      <!-- 汇总 -->
      <div
        class="products-summary mt-4 p-4 bg-gradient-to-r from-primary/5 to-primaryDark/5 rounded-xl border border-primary/20"
      >
        <div class="flex-b items-center">
          <div class="flex items-center gap-6">
            <div>
              <span class="text-g-500 mr-2">产品总数:</span>
              <span class="text-lg font-bold text-g-800">{{ totalQuantity }} {{ totalUnit }}</span>
            </div>
          </div>
          <div>
            <span class="text-g-500 mr-2">总计:</span>
            <span
              class="text-2xl font-bold bg-gradient-to-r from-primary to-primaryDark bg-clip-text text-transparent"
            >
              {{ formatAmount(grandTotal, formData.currency || 'USD') }}
            </span>
          </div>
        </div>
      </div>
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

      <ElForm :model="formData.costSummary" label-width="120px">
        <ElRow :gutter="20">
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
          <ElCol :span="6">
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
        </ElRow>

        <ElRow :gutter="20">
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
          <ElCol :span="6">
            <ElFormItem label="产品小计">
              <ElInput
                :model-value="
                  formatAmount(formData.costSummary.subtotal, formData.currency || 'USD')
                "
                disabled
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="总计">
              <ElInput
                :model-value="formatAmount(grandTotal, formData.currency || 'USD')"
                disabled
                class="grand-total-input"
                style="width: 100%"
              />
            </ElFormItem>
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

  // 总数量
  const totalQuantity = computed(() => {
    return formData.value.products.reduce((sum, p) => sum + (p.qty || 0), 0)
  })

  // 总单位（简化显示）
  const totalUnit = computed(() => {
    const units = [...new Set(formData.value.products.map((p) => p.unit))]
    return units.length === 1 ? units[0] : 'PCS'
  })

  // 总计
  const grandTotal = computed(() => {
    const { subtotal, freightCharges, taxValue, otherCharges, discountValue, discountType } =
      formData.value.costSummary
    const discount = discountType === 'percent' ? subtotal * (discountValue / 100) : discountValue
    return subtotal - discount + freightCharges + taxValue + otherCharges
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
      unit: product.unit || 'PCS',
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
      unit: 'PCS',
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
    formData.value.products.forEach((p, i) => updateTotal(i))

    // 计算 subtotal
    formData.value.costSummary.subtotal = formData.value.products.reduce(
      (sum, p) => sum + (p.total || 0),
      0
    )

    // 计算 grandTotal
    const { subtotal, freightCharges, taxValue, otherCharges, discountValue, discountType } =
      formData.value.costSummary
    const discount = discountType === 'percent' ? subtotal * (discountValue / 100) : discountValue
    formData.value.costSummary.grandTotal =
      subtotal - discount + freightCharges + taxValue + otherCharges
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
    :deep(.el-table__header th) {
      font-weight: 600;
      background: var(--el-fill-color);
    }

    :deep(.el-input-number) {
      width: 100%;
    }

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

    .product-image {
      width: 60px;
      height: 60px;
      cursor: pointer;
      object-fit: cover;
      border-radius: 8px;
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

  .grand-total-input {
    :deep(.el-input__wrapper) {
      background: linear-gradient(
        to right,
        var(--el-color-primary-light-9),
        var(--el-color-primary-light-7)
      );
      border-color: var(--el-color-primary);
    }

    :deep(.el-input__inner) {
      font-size: 1.1em;
      font-weight: bold;
      color: var(--el-color-primary);
    }
  }
</style>
