<!-- 报价新增/编辑页面 -->
<template>
  <div class="quotation-form-page">
    <!-- 页头 -->
    <ElPageHeader class="mb-3" @back="handleBack">
      <template #title>
        <span class="text-lg font-semibold">{{ isEdit ? '编辑报价' : '新增报价' }}</span>
      </template>
    </ElPageHeader>

    <ElCard class="art-card">
      <ElForm ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <!-- 基础信息 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium text-gray-500">基础信息 / Basic Information</span>
        </ElDivider>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="报价单号" prop="quotationNo">
              <ElInput v-model="formData.quotationNo" disabled placeholder="系统自动生成" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="客户选择" prop="customerName">
              <ElSelect
                v-model="formData.customerName"
                placeholder="请选择客户"
                filterable
                @change="handleCustomerChange"
                style="width: 100%"
              >
                <ElOption
                  v-for="customer in customerOptions"
                  :key="customer.id"
                  :label="customer.customerName"
                  :value="customer.customerName"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="4">
            <ElFormItem label="状态" prop="status">
              <ElSelect v-model="formData.status" placeholder="请选择" style="width: 100%">
                <ElOption label="待确认" value="1" />
                <ElOption label="已接受" value="2" />
                <ElOption label="已拒绝" value="3" />
                <ElOption label="已过期" value="4" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="报价日期" prop="quotationDate">
              <ElDatePicker
                v-model="formData.quotationDate"
                type="date"
                placeholder="请选择"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="有效期至" prop="validity">
              <ElDatePicker
                v-model="formData.validity"
                type="date"
                placeholder="请选择"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 产品明细 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium text-gray-500">产品明细 / Product Details</span>
        </ElDivider>

        <ElTable :data="productList" border class="mb-3">
          <ElTableColumn label="产品名称" min-width="180">
            <template #default="{ row }">
              <ElSelect
                v-model="row.productName"
                placeholder="选择产品"
                filterable
                @change="(val) => handleProductChange(val, row)"
                style="width: 100%"
              >
                <ElOption
                  v-for="product in productOptions"
                  :key="product.id"
                  :label="product.name"
                  :value="product.name"
                />
              </ElSelect>
            </template>
          </ElTableColumn>
          <ElTableColumn label="规格型号" min-width="150">
            <template #default="{ row }">
              <ElInput v-model="row.specification" placeholder="规格型号" />
            </template>
          </ElTableColumn>
          <ElTableColumn label="数量" width="100">
            <template #default="{ row }">
              <ElInputNumber
                v-model="row.quantity"
                :min="1"
                :precision="0"
                placeholder="0"
                controls-position="right"
                style="width: 100%"
                @change="calculateTotal(row)"
              />
            </template>
          </ElTableColumn>
          <ElTableColumn label="单位" width="100">
            <template #default="{ row }">
              <ElSelect v-model="row.unit" placeholder="单位" style="width: 100%">
                <ElOption label="PCS - 个/件" value="PCS" />
                <ElOption label="Set - 套" value="Set" />
                <ElOption label="KG - 千克" value="KG" />
                <ElOption label="Box - 箱" value="Box" />
                <ElOption label="Bottle - 瓶" value="Bottle" />
              </ElSelect>
            </template>
          </ElTableColumn>
          <ElTableColumn label="单价" width="120">
            <template #default="{ row }">
              <ElInputNumber
                v-model="row.unitPrice"
                :min="0"
                :precision="2"
                placeholder="0.00"
                controls-position="right"
                style="width: 100%"
                @change="calculateTotal(row)"
              />
            </template>
          </ElTableColumn>
          <ElTableColumn label="币种" width="90">
            <template #default="{ row }">
              <ElSelect v-model="row.currency" placeholder="币种" style="width: 100%">
                <ElOption label="USD" value="USD" />
                <ElOption label="EUR" value="EUR" />
                <ElOption label="CNY" value="CNY" />
                <ElOption label="GBP" value="GBP" />
              </ElSelect>
            </template>
          </ElTableColumn>
          <ElTableColumn label="金额" width="120" align="right">
            <template #default="{ row }">
              <span class="font-medium text-primary">{{
                formatAmount(row.totalPrice, row.currency)
              }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="80" align="center" fixed="right">
            <template #default="{ $index }">
              <ElButton type="danger" link @click="removeProduct($index)">
                <Icon icon="ri:delete-bin-line" />
              </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>

        <ElButton type="primary" plain @click="addProduct">
          <Icon icon="ri:add-line" class="mr-1" />
          添加产品
        </ElButton>

        <!-- 合计 -->
        <div class="total-section mt-4 p-4 bg-gray-50 rounded">
          <div class="flex justify-end items-center gap-4">
            <span class="text-gray-600">总数量：</span>
            <span class="text-lg font-semibold">{{ totalQuantity }}</span>
            <span class="text-gray-600 ml-4">总金额：</span>
            <span class="text-xl font-bold text-primary">{{
              formatAmount(totalAmount, 'USD')
            }}</span>
          </div>
        </div>

        <!-- 商务条款 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium text-gray-500">商务条款 / Terms</span>
        </ElDivider>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="贸易条款" prop="tradeTerm">
              <ElSelect
                v-model="formData.tradeTerm"
                placeholder="请选择贸易条款"
                clearable
                style="width: 100%"
              >
                <ElOption label="FOB - 船上交货" value="FOB" />
                <ElOption label="CIF - 成本加保险费加运费" value="CIF" />
                <ElOption label="EXW - 工厂交货" value="EXW" />
                <ElOption label="DDP - 完税后交货" value="DDP" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="付款方式" prop="paymentTerm">
              <ElSelect
                v-model="formData.paymentTerm"
                placeholder="请选择付款方式"
                clearable
                style="width: 100%"
              >
                <ElOption label="T/T 30% deposit" value="T/T 30% deposit" />
                <ElOption label="T/T 50% advance" value="T/T 50% advance" />
                <ElOption label="L/C at sight" value="L/C at sight" />
                <ElOption label="L/C 90 days" value="L/C 90 days" />
                <ElOption label="D/P" value="D/P" />
                <ElOption label="D/A" value="D/A" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElFormItem label="备注" prop="remarks">
          <ElInput
            v-model="formData.remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息（可选）"
          />
        </ElFormItem>

        <!-- 提交按钮 -->
        <ElFormItem class="mt-6">
          <ElSpace>
            <ElButton @click="handleBack">取消</ElButton>
            <ElButton type="primary" :loading="submitLoading" @click="handleSubmit"
              >保存报价</ElButton
            >
          </ElSpace>
        </ElFormItem>
      </ElForm>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage, ElPageHeader } from 'element-plus'
  import { Icon } from '@iconify/vue'
  import { useRouter, useRoute } from 'vue-router'
  import { fetchGetCustomerList, fetchGetProductList } from '@/api/trade-manage'
  import {
    fetchGetQuotationDetail,
    fetchCreateQuotation,
    fetchUpdateQuotation
  } from '@/api/trade-manage'

  defineOptions({ name: 'QuotationForm' })

  const router = useRouter()
  const route = useRoute()

  const isEdit = computed(() => !!route.params.id)

  // 表单实例
  const formRef = ref<FormInstance>()

  // 提交状态
  const submitLoading = ref(false)

  // 客户列表
  const customerOptions = ref<Api.Trade.CustomerListItem[]>([])

  // 产品列表
  const productOptions = ref<Api.Trade.ProductListItem[]>([])

  // 基础表单数据
  const formData = reactive({
    customerId: '',
    customerName: '',
    quotationNo: '',
    tradeTerm: '',
    paymentTerm: '',
    quotationDate: '',
    validity: '',
    status: '1',
    remarks: ''
  })

  // 产品明细列表（多行）
  const productList = ref<Api.Trade.QuotationListItem[]>([])

  // 表单验证规则
  const rules: FormRules = {
    customerName: [{ required: true, message: '请选择客户', trigger: 'change' }],
    quotationDate: [{ required: true, message: '请选择报价日期', trigger: 'change' }],
    validity: [{ required: true, message: '请选择有效期', trigger: 'change' }],
    tradeTerm: [{ required: true, message: '请选择贸易条款', trigger: 'change' }],
    paymentTerm: [{ required: true, message: '请选择付款方式', trigger: 'change' }]
  }

  // 总金额计算
  const totalQuantity = computed(() => {
    return productList.value.reduce((sum, item) => sum + (item.quantity || 0), 0)
  })

  const totalAmount = computed(() => {
    return productList.value.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
  })

  // 格式化金额
  const formatAmount = (amount: number, currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      CNY: '¥',
      GBP: '£'
    }
    const symbol = symbols[currency] || currency
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // 生成报价单号
  const generateQuotationNo = () => {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 900 + 100)
    return `QT${dateStr}${random}`
  }

  // 加载客户列表
  const loadCustomers = async () => {
    try {
      const res = await fetchGetCustomerList({ current: 1, size: 100 })
      customerOptions.value = (res.data as any)?.records || []
    } catch (error) {
      console.error('加载客户列表失败:', error)
    }
  }

  // 加载产品列表
  const loadProducts = async () => {
    try {
      const res = await fetchGetProductList({ current: 1, size: 100 })
      productOptions.value = (res.data as any)?.records || []
    } catch (error) {
      console.error('加载产品列表失败:', error)
    }
  }

  // 处理客户选择
  const handleCustomerChange = (customerName: string) => {
    const customer = customerOptions.value.find((c) => c.customerName === customerName)
    if (customer) {
      formData.customerId = customer.id
    }
  }

  // 处理产品选择
  const handleProductChange = (productName: string, row: any) => {
    const product = productOptions.value.find((p) => p.name === productName)
    if (product) {
      row.specification = product.spec || ''
      row.unitPrice = product.salePrice || 0
      row.currency = product.currency || 'USD'
      calculateTotal(row)
    }
  }

  // 计算单行总价
  const calculateTotal = (row: any) => {
    row.totalPrice = (row.quantity || 0) * (row.unitPrice || 0)
  }

  // 添加产品行
  const addProduct = () => {
    productList.value.push({
      id: '',
      customerId: '',
      customerName: '',
      quotationNo: '',
      productName: '',
      specification: '',
      quantity: 1,
      unit: 'PCS',
      unitPrice: 0,
      currency: 'USD',
      totalPrice: 0,
      tradeTerm: '',
      paymentTerm: '',
      validity: '',
      remarks: '',
      status: '',
      quotationDate: ''
    })
  }

  // 删除产品行
  const removeProduct = (index: number) => {
    if (productList.value.length === 1) {
      ElMessage.warning('至少保留一行产品')
      return
    }
    productList.value.splice(index, 1)
  }

  // 加载报价详情（编辑模式）
  const loadQuotationData = async () => {
    if (!isEdit.value) return

    try {
      const res = await fetchGetQuotationDetail(route.params.id as string)
      const data = res.data as Api.Trade.QuotationListItem

      // 填充基础信息
      formData.customerId = data.customerId || ''
      formData.customerName = data.customerName || ''
      formData.quotationNo = data.quotationNo || ''
      formData.tradeTerm = data.tradeTerm || ''
      formData.paymentTerm = data.paymentTerm || ''
      formData.quotationDate = data.quotationDate || ''
      formData.validity = data.validity || ''
      formData.status = data.status || '1'
      formData.remarks = data.remarks || ''

      // 填充产品明细（单产品模式转为多产品）
      productList.value = [
        {
          id: data.id || '',
          customerId: data.customerId || '',
          customerName: data.customerName || '',
          quotationNo: data.quotationNo || '',
          productName: data.productName || '',
          specification: data.specification || '',
          quantity: data.quantity || 0,
          unit: data.unit || 'PCS',
          unitPrice: data.unitPrice || 0,
          currency: data.currency || 'USD',
          totalPrice: data.totalPrice || 0,
          tradeTerm: data.tradeTerm || '',
          paymentTerm: data.paymentTerm || '',
          validity: data.validity || '',
          remarks: data.remarks || '',
          status: data.status || '',
          quotationDate: data.quotationDate || ''
        }
      ]
    } catch (error) {
      console.error('加载报价详情失败:', error)
      ElMessage.error('加载报价详情失败')
    }
  }

  // 初始化表单
  const initForm = () => {
    // 重置基础表单
    Object.assign(formData, {
      customerId: '',
      customerName: '',
      quotationNo: generateQuotationNo(),
      tradeTerm: '',
      paymentTerm: '',
      quotationDate: new Date().toISOString().slice(0, 10),
      validity: getDefaultValidity(),
      status: '1',
      remarks: ''
    })

    // 清空产品列表
    productList.value = []

    // 检查路由参数（从客户详情页跳转）
    const customerId = route.query.customerId as string
    const customerName = route.query.customerName as string

    if (customerId && customerName) {
      formData.customerId = customerId
      formData.customerName = decodeURIComponent(customerName)
    }

    // 添加第一行产品
    if (!isEdit.value) {
      addProduct()
    }
  }

  // 获取默认有效期（报价日期 + 30 天）
  const getDefaultValidity = () => {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    return date.toISOString().slice(0, 10)
  }

  // 返回上一页
  const handleBack = () => {
    router.back()
  }

  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (!valid) return

      // 验证至少有一行产品
      if (productList.value.length === 0) {
        ElMessage.warning('请至少添加一行产品')
        return
      }

      // 验证每行产品都填写完整
      for (let i = 0; i < productList.value.length; i++) {
        const row = productList.value[i]
        if (!row.productName || !row.quantity || !row.unitPrice) {
          ElMessage.warning(`请填写第 ${i + 1} 行产品的完整信息`)
          return
        }
      }

      submitLoading.value = true
      try {
        // 合并数据（多产品模式，每个产品生成一条报价记录）
        for (const product of productList.value) {
          const quotationData = {
            ...formData,
            customerId: formData.customerId,
            customerName: formData.customerName,
            productName: product.productName,
            specification: product.specification,
            quantity: product.quantity,
            unit: product.unit,
            unitPrice: product.unitPrice,
            currency: product.currency,
            totalPrice: product.totalPrice,
            id: isEdit.value ? (route.params.id as string) : undefined
          }

          if (isEdit.value) {
            await fetchUpdateQuotation(quotationData)
          } else {
            await fetchCreateQuotation(quotationData)
          }
        }

        ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
        handleBack()
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      } finally {
        submitLoading.value = false
      }
    })
  }

  onMounted(() => {
    loadCustomers()
    loadProducts()
    initForm()
    loadQuotationData()
  })
</script>

<style lang="scss" scoped>
  .quotation-form-page {
    padding-bottom: 20px;

    :deep(.el-input-number) {
      width: 100%;
    }

    .total-section {
      border: 1px solid var(--el-border-color-light);
    }
  }
</style>
