<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '新增报价' : '编辑报价'"
    width="50%"
    align-center
    :close-on-click-modal="false"
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="110px">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="客户名称" prop="customerName">
            <ElSelect
              v-model="formData.customerName"
              placeholder="请选择客户"
              filterable
              clearable
              @change="handleCustomerChange"
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
        <ElCol :span="12">
          <ElFormItem label="报价单号" prop="quotationNo">
            <ElInput v-model="formData.quotationNo" placeholder="系统自动生成" :disabled="true" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="产品名称" prop="productName">
            <ElInput v-model="formData.productName" placeholder="请输入产品名称" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="规格型号" prop="specification">
            <ElInput v-model="formData.specification" placeholder="请输入规格型号" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="8">
          <ElFormItem label="数量" prop="quantity">
            <ElInputNumber
              v-model="formData.quantity"
              :min="0"
              :precision="0"
              placeholder="请输入数量"
              style="width: 100%"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="单位" prop="unit">
            <ElSelect v-model="formData.unit" placeholder="请选择单位">
              <ElOption label="PCS - 个/件" value="PCS" />
              <ElOption label="Set - 套" value="Set" />
              <ElOption label="KG - 千克" value="KG" />
              <ElOption label="Box - 箱" value="Box" />
              <ElOption label="Bottle - 瓶" value="Bottle" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="币种" prop="currency">
            <ElSelect v-model="formData.currency" placeholder="请选择币种">
              <ElOption label="USD - 美元" value="USD" />
              <ElOption label="EUR - 欧元" value="EUR" />
              <ElOption label="CNY - 人民币" value="CNY" />
              <ElOption label="GBP - 英镑" value="GBP" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="单价" prop="unitPrice">
            <ElInputNumber
              v-model="formData.unitPrice"
              :min="0"
              :precision="2"
              placeholder="请输入单价"
              style="width: 100%"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="总金额" prop="totalPrice">
            <ElInput
              v-model="totalPriceDisplay"
              placeholder="自动计算"
              disabled
              class="font-medium text-primary"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="贸易条款" prop="tradeTerm">
            <ElSelect v-model="formData.tradeTerm" placeholder="请选择贸易条款" clearable>
              <ElOption label="FOB - 船上交货" value="FOB" />
              <ElOption label="CIF - 成本加保险费加运费" value="CIF" />
              <ElOption label="EXW - 工厂交货" value="EXW" />
              <ElOption label="DDP - 完税后交货" value="DDP" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="付款方式" prop="paymentTerm">
            <ElSelect v-model="formData.paymentTerm" placeholder="请选择付款方式" clearable>
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

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="报价日期" prop="quotationDate">
            <ElDatePicker
              v-model="formData.quotationDate"
              type="date"
              placeholder="请选择报价日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="有效期至" prop="validity">
            <ElDatePicker
              v-model="formData.validity"
              type="date"
              placeholder="请选择有效期至"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="状态" prop="status">
            <ElSelect v-model="formData.status" placeholder="请选择状态">
              <ElOption label="待确认" value="1" />
              <ElOption label="已接受" value="2" />
              <ElOption label="已拒绝" value="3" />
              <ElOption label="已过期" value="4" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElFormItem label="备注" prop="remarks">
        <ElInput
          v-model="formData.remarks"
          type="textarea"
          :rows="3"
          placeholder="请输入备注信息"
        />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">提交</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { fetchGetCustomerList } from '@/api/trade-manage'

  interface Props {
    visible: boolean
    type: string
    quotationData?: Partial<Api.Trade.QuotationListItem>
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 客户列表
  const customerOptions = ref<Api.Trade.CustomerListItem[]>([])

  // 对话框显示控制
  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  const dialogType = computed(() => props.type)

  // 表单实例
  const formRef = ref<FormInstance>()

  // 表单数据
  const formData = reactive({
    customerId: '',
    customerName: '',
    quotationNo: '',
    productName: '',
    specification: '',
    quantity: 0,
    unit: 'PCS',
    unitPrice: 0,
    currency: 'USD',
    totalPrice: 0,
    tradeTerm: '',
    paymentTerm: '',
    quotationDate: '',
    validity: '',
    status: '1',
    remarks: ''
  })

  // 总金额显示（自动计算）
  const totalPriceDisplay = computed(() => {
    const total = (formData.quantity || 0) * (formData.unitPrice || 0)
    return total.toFixed(2)
  })

  // 监听总金额变化，自动更新
  watch([() => formData.quantity, () => formData.unitPrice], () => {
    formData.totalPrice = (formData.quantity || 0) * (formData.unitPrice || 0)
  })

  // 表单验证规则
  const rules: FormRules = {
    customerName: [{ required: true, message: '请选择客户', trigger: 'change' }],
    productName: [
      { required: true, message: '请输入产品名称', trigger: 'blur' },
      { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
    ],
    specification: [{ required: true, message: '请输入规格型号', trigger: 'blur' }],
    quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
    unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
    currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
    unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }],
    tradeTerm: [{ required: true, message: '请选择贸易条款', trigger: 'change' }],
    paymentTerm: [{ required: true, message: '请选择付款方式', trigger: 'change' }],
    quotationDate: [{ required: true, message: '请选择报价日期', trigger: 'change' }],
    validity: [{ required: true, message: '请选择有效期至', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }]
  }

  // 加载客户列表
  const loadCustomers = async () => {
    try {
      const res = await fetchGetCustomerList({ current: 1, size: 100 })
      customerOptions.value = (res.data as any) || []
    } catch (error) {
      console.error('加载客户列表失败:', error)
    }
  }

  // 处理客户选择变化
  const handleCustomerChange = (customerName: string) => {
    const customer = customerOptions.value.find((c) => c.customerName === customerName)
    if (customer) {
      formData.customerId = customer.id
    }
  }

  // 生成报价单号
  const generateQuotationNo = () => {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.random().toString(36).slice(-3).toUpperCase()
    return `QT${dateStr}${random}`
  }

  // 初始化表单数据
  const initFormData = () => {
    const isEdit = props.type === 'edit' && props.quotationData
    const row = props.quotationData

    if (isEdit && row) {
      Object.assign(formData, {
        customerId: row.customerId || '',
        customerName: row.customerName || '',
        quotationNo: row.quotationNo || '',
        productName: row.productName || '',
        specification: row.specification || '',
        quantity: row.quantity || 0,
        unit: row.unit || 'PCS',
        unitPrice: row.unitPrice || 0,
        currency: row.currency || 'USD',
        totalPrice: row.totalPrice || 0,
        tradeTerm: row.tradeTerm || '',
        paymentTerm: row.paymentTerm || '',
        quotationDate: row.quotationDate || '',
        validity: row.validity || '',
        status: row.status || '1',
        remarks: row.remarks || ''
      })
    } else {
      // 新增模式，重置表单
      const prefillCustomerId = row?.customerId || ''
      const prefillCustomerName = row?.customerName || ''

      Object.assign(formData, {
        customerId: prefillCustomerId,
        customerName: prefillCustomerName,
        quotationNo: generateQuotationNo(),
        productName: '',
        specification: '',
        quantity: 0,
        unit: 'PCS',
        unitPrice: 0,
        currency: 'USD',
        totalPrice: 0,
        tradeTerm: '',
        paymentTerm: '',
        quotationDate: new Date().toISOString().slice(0, 10),
        validity: '',
        status: '1',
        remarks: ''
      })
    }
  }

  // 监听对话框状态变化
  watch(
    () => [props.visible, props.type, props.quotationData],
    ([visible]) => {
      if (visible) {
        initFormData()
        loadCustomers()
        nextTick(() => {
          formRef.value?.clearValidate()
        })
      }
    },
    { immediate: true }
  )

  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid) => {
      if (valid) {
        ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
        dialogVisible.value = false
        emit('submit')
      }
    })
  }
</script>
