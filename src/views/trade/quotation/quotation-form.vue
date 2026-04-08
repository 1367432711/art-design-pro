<!-- 报价表单 - 扁平化设计 -->
<template>
  <div class="quotation-form-page">
    <!-- 头部操作区 -->
    <ArtPageHeader :title="isEdit ? '编辑报价单' : '新增报价单'" @back="handleBack">
      <ElSpace>
        <ElButton type="primary" size="large" @click="handleSubmit" :loading="submitting">
          <Icon icon="ri:save-line" class="mr-1" />
          保存
        </ElButton>
        <ElButton size="large" @click="handleBack">
          <Icon icon="ri:close-line" class="mr-1" />
          取消
        </ElButton>
      </ElSpace>
    </ArtPageHeader>

    <!-- 客户信息 -->
    <ElCard class="art-card mb-4">
      <template #header>
        <div class="flex-b items-center">
          <span class="font-semibold text-lg">
            <ArtSvgIcon icon="ri:user-star-line" class="mr-2 text-primary" />
            客户信息 / Customer Information
          </span>
          <ElTag v-if="isEdit" type="info" size="small">已锁定</ElTag>
        </div>
      </template>

      <ElForm :model="formData" label-width="120px" class="customer-info-form">
        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElFormItem label="客户名称">
              <ElSelect
                v-model="formData.customerId"
                placeholder="选择客户"
                filterable
                style="width: 100%"
                :disabled="isEdit"
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
          <ElCol :span="6">
            <ElFormItem label="联系人">
              <ElInput v-model="formData.contactPerson" placeholder="联系人" :disabled="isEdit" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="联系电话">
              <ElInput v-model="formData.contactPhone" placeholder="联系电话" :disabled="isEdit" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="联系邮箱">
              <ElInput v-model="formData.contactEmail" placeholder="联系邮箱" :disabled="isEdit" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElFormItem label="WhatsApp">
              <ElInput
                v-model="formData.clientWhatsapp"
                placeholder="+86 138 0000 0000"
                :disabled="isEdit"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="国家/地区">
              <ElInput v-model="formData.country" placeholder="国家/地区" :disabled="isEdit" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="地址">
              <ElInput v-model="formData.address" placeholder="详细地址" :disabled="isEdit" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="主营产品">
              <ElInput
                v-model="formData.customerProducts"
                placeholder="主营产品"
                :disabled="isEdit"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
    </ElCard>

    <!-- 报价单信息 -->
    <ElCard class="art-card mb-4">
      <template #header>
        <div class="flex-b items-center">
          <span class="font-semibold text-lg">
            <ArtSvgIcon icon="ri:file-list-3-line" class="mr-2 text-primary" />
            报价单信息 / Quotation Information
          </span>
        </div>
      </template>

      <ElForm :model="formData" label-width="100px" class="quotation-info-form">
        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElFormItem label="报价单号">
              <ElInput v-model="formData.quotationNo" placeholder="QT20260326123" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="报价日期">
              <ElDatePicker v-model="formData.quotationDate" type="date" style="width: 100%" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="有效期至">
              <ElDatePicker
                v-model="formData.validity"
                type="date"
                placeholder="选择截止日期"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
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
          <ElCol :span="6">
            <ElFormItem label="贸易条款">
              <ElSelect v-model="formData.tradeTerm" placeholder="选择条款" style="width: 100%">
                <ElOption label="FOB" value="FOB" />
                <ElOption label="CIF" value="CIF" />
                <ElOption label="EXW" value="EXW" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="付款方式">
              <ElInput v-model="formData.paymentTerm" placeholder="如：T/T 30% deposit" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="装运港口">
              <ElInput v-model="formData.shipmentPort" placeholder="如：Shanghai" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="交货期">
              <ElInput v-model="formData.leadTime" placeholder="如：30 days" />
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
        <ElTableColumn type="index" width="70" align="center" label="序号" />

        <!-- 产品图片 -->
        <ElTableColumn width="100" align="center" label="产品图">
          <template #default="{ row, $index }">
            <ElUpload
              :file-list="row.image ? [{ name: 'product-image', url: row.image }] : []"
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
        <ElTableColumn min-width="90" label="产品名称" align="center">
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

        <!-- 规格型号 -->
        <ElTableColumn min-width="120" label="规格型号" align="center">
          <template #default="{ row }">
            <ElInput v-model="row.spec" placeholder="规格型号" class="compact-input" />
          </template>
        </ElTableColumn>

        <!-- 产品等级 -->
        <ElTableColumn width="110" label="等级" align="center">
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
        <ElTableColumn width="110" label="产品类型" align="center">
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
        <ElTableColumn width="110" label="小计" align="center">
          <template #default="{ row }">
            <span class="font-bold text-primary text-base">
              {{ formatAmount(row.total || 0, formData.currency || 'USD') }}
            </span>
          </template>
        </ElTableColumn>

        <!-- 产品备注（展开显示） -->
        <ElTableColumn min-width="100" label="备注" align="center">
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

      <ElForm :model="formData.costSummary" label-width="80px">
        <!-- 费用明细 -->
        <div class="cost-section-title">费用明细 / Charges</div>
        <ElRow :gutter="16" class="costs-row">
          <ElCol :span="5">
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
          <ElCol :span="5">
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
          <ElCol :span="4">
            <ElFormItem label="折扣类型">
              <ElSelect v-model="formData.costSummary.discountType" style="width: 100%">
                <ElOption label="百分比" value="percent" />
                <ElOption label="固定金额" value="fixed" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="5">
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
          <ElCol :span="5">
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
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'
  import ArtPageHeader from '@/components/core/base/art-page-header/index.vue'
  import { Icon } from '@iconify/vue'
  import { useRouter, useRoute } from 'vue-router'
  import {
    fetchGetCustomerList,
    fetchGetProductList,
    fetchGetQuotationDetail,
    fetchCreateQuotation,
    fetchUpdateQuotation
  } from '@/api/trade-manage'

  defineOptions({ name: 'QuotationForm' })

  const router = useRouter()
  const route = useRoute()
  // 编辑模式判断：支持路径参数和查询参数
  const isEdit = computed(() => !!(route.params.id || route.query.id))
  // 获取报价 ID
  const quotationId = computed(() => (route.params.id || route.query.id) as string)

  // 客户列表
  const customerOptions = ref<Api.Trade.CustomerListItem[]>([])
  // 产品列表
  const productOptions = ref<Api.Trade.ProductListItem[]>([])
  // 提交中状态
  const submitting = ref(false)

  // 表单数据 - 扁平化结构
  const formData = ref({
    // 客户信息（从客户档案带过来，允许临时覆盖）
    customerId: '',
    customerName: '',
    contactPerson: '', // 联系人
    contactPhone: '', // 联系电话
    contactEmail: '', // 联系邮箱
    clientWhatsapp: '', // WhatsApp
    country: '', // 国家/地区
    address: '', // 详细地址
    customerProducts: '', // 主营产品（客户档案）

    // 报价单信息
    quotationNo: '',
    quotationDate: new Date().toISOString().slice(0, 10),
    validity: '',
    currency: 'USD',
    tradeTerm: '',
    paymentTerm: '',
    shipmentPort: '',
    leadTime: '',

    // 报价产品列表（扁平化）
    products: [] as Array<{
      id: string
      selectedProductId?: string // 关联的产品库 ID
      image?: string // 产品图片
      spec: string // 规格型号
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
      spec: product.spec || '',
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

  // 选择客户（自动填充客户信息）
  const handleCustomerChange = (customerId: string) => {
    const customer = customerOptions.value.find((c) => c.id === customerId)
    if (customer) {
      formData.value.customerName = customer.customerName
      formData.value.contactPerson = customer.contactPerson || ''
      formData.value.contactPhone = customer.contactPhone || ''
      formData.value.contactEmail = customer.contactEmail || ''
      formData.value.clientWhatsapp = customer.contactPhone || '' // 默认使用联系电话
      formData.value.country = customer.country || ''
      formData.value.address = customer.address || ''
      formData.value.customerProducts = customer.products || ''
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
      spec: '',
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
  const handleSubmit = async () => {
    if (submitting.value) return // 防止重复提交

    submitting.value = true
    try {
      // 验证必填字段
      if (!formData.value.customerId) {
        ElMessage.warning('请选择客户')
        return
      }
      if (formData.value.products.length === 0) {
        ElMessage.warning('请至少添加一个产品')
        return
      }

      // 准备提交数据
      const submitData = {
        ...formData.value,
        status: '1' // 默认待确认
      }

      let result
      if (isEdit.value) {
        // 编辑模式
        result = await fetchUpdateQuotation({
          id: route.params.id as string,
          ...submitData
        } as unknown as Partial<Api.Trade.QuotationListItem>)
      } else {
        // 新增模式
        result = await fetchCreateQuotation(
          submitData as unknown as Partial<Api.Trade.QuotationListItem>
        )
      }

      ElMessage.success(result.msg || '保存成功')

      // 保存成功后返回列表页
      setTimeout(() => {
        router.push('/trade/quotation')
      }, 500)
    } catch (error: any) {
      console.error('保存失败:', error)
      ElMessage.error(error.message || '保存失败，请重试')
    } finally {
      submitting.value = false
    }
  }

  // 返回报价列表或客户详情页
  const handleBack = () => {
    const fromCustomer = route.query.fromCustomer === 'true'
    if (fromCustomer) {
      // 从客户详情页来，返回客户详情页
      router.back()
    } else {
      // 从报价列表来，返回报价列表
      router.push('/trade/quotation')
    }
  }

  // 加载报价单详情
  const loadQuotationDetail = async () => {
    const id = quotationId.value
    console.log('[QuotationForm] 加载报价详情，ID:', id)
    if (!id) {
      console.error('[QuotationForm] 报价 ID 为空')
      return
    }

    try {
      const res = await fetchGetQuotationDetail(id)
      console.log('[QuotationForm] 报价详情响应:', res)
      const data = (res as any).data

      if (!data) {
        ElMessage.error('报价单不存在')
        setTimeout(() => {
          router.push('/trade/quotation')
        }, 1000)
        return
      }

      // 先填充报价数据
      formData.value = {
        ...formData.value,
        // 客户信息（先填充报价单中已保存的）
        customerId: data.customerId || '',
        customerName: data.customerName || '',
        contactPerson: data.contactPerson || '',
        contactPhone: data.contactPhone || '',
        contactEmail: data.contactEmail || '',
        clientWhatsapp: data.clientWhatsapp || '',
        country: data.country || '',
        address: data.address || '',
        customerProducts: typeof data.products === 'string' ? data.products : '',
        // 报价信息
        quotationNo: data.quotationNo || '',
        quotationDate: data.quotationDate || new Date().toISOString().slice(0, 10),
        validity: data.validity || '',
        currency: data.currency || 'USD',
        tradeTerm: data.tradeTerm || '',
        paymentTerm: data.paymentTerm || '',
        shipmentPort: data.shipmentPort || '',
        leadTime: data.leadTime || '',
        // 产品列表和费用汇总
        products: Array.isArray(data.products) ? data.products : [],
        costSummary: data.costSummary || {
          freightCharges: 0,
          discountValue: 0,
          discountType: 'percent' as const,
          taxValue: 0,
          otherCharges: 0,
          subtotal: 0,
          grandTotal: 0
        }
      }

      // 如果报价单中客户信息不完整，从客户档案补充
      if (data.customerId && customerOptions.value.length > 0) {
        const customer = customerOptions.value.find((c) => c.id === data.customerId)
        if (customer) {
          // 只补充报价单中为空的字段
          if (!formData.value.contactPerson)
            formData.value.contactPerson = customer.contactPerson || ''
          if (!formData.value.contactPhone)
            formData.value.contactPhone = customer.contactPhone || ''
          if (!formData.value.contactEmail)
            formData.value.contactEmail = customer.contactEmail || ''
          if (!formData.value.clientWhatsapp)
            formData.value.clientWhatsapp = customer.contactPhone || ''
          if (!formData.value.country) formData.value.country = customer.country || ''
          if (!formData.value.address) formData.value.address = customer.address || ''
          if (!formData.value.customerProducts)
            formData.value.customerProducts = customer.products || ''
        }
      }
    } catch (error) {
      console.error('[QuotationForm] 加载报价单详情失败:', error)
      ElMessage.error(`加载报价单详情失败：${error instanceof Error ? error.message : '未知错误'}`)
      setTimeout(() => {
        router.push('/trade/quotation')
      }, 1000)
    }
  }

  // 加载数据
  const loadData = async () => {
    try {
      // 先加载客户和产品选项
      const customerRes = await fetchGetCustomerList({ current: 1, size: 100 })
      customerOptions.value = (customerRes.data as any)?.records || []

      const productRes = await fetchGetProductList({ current: 1, size: 100 })
      productOptions.value = (productRes.data as any)?.records || []

      if (isEdit.value) {
        // 编辑模式：先加载报价单详情（此时 customerOptions 已加载完成）
        await loadQuotationDetail()
      } else {
        // 新增模式：检查是否从客户详情页跳转
        const customerId = route.query.customerId as string
        const customerName = route.query.customerName as string

        if (customerId) {
          formData.value.customerId = customerId
          formData.value.customerName = decodeURIComponent(customerName || '')

          // 自动填充客户档案信息
          const customer = customerOptions.value.find((c) => c.id === customerId)
          if (customer) {
            formData.value.contactPerson = customer.contactPerson || ''
            formData.value.contactPhone = customer.contactPhone || ''
            formData.value.contactEmail = customer.contactEmail || ''
            formData.value.clientWhatsapp = customer.contactPhone || ''
            formData.value.country = customer.country || ''
            formData.value.address = customer.address || ''
            formData.value.customerProducts = customer.products || ''
          }
        }

        // 生成报价单号
        if (!formData.value.quotationNo) {
          formData.value.quotationNo = generateQuotationNo()
        }

        // 添加第一行产品
        addProduct()
      }
    } catch (error) {
      console.error('[QuotationForm] 加载数据失败:', error)
      ElMessage.error(`加载数据失败：${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  onMounted(() => {
    loadData()
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
