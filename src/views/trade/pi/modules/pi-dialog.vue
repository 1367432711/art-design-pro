<!-- PI 弹窗 -->
<template>
  <ElDialog
    :model-value="visible"
    :title="type === 'add' ? '新增 PI' : '编辑 PI'"
    width="900px"
    @close="handleClose"
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      label-position="left"
    >
      <ElDivider content-position="left">基本信息</ElDivider>

      <ElFormItem label="发票号" prop="invoiceNo">
        <ElInput v-model="formData.invoiceNo" placeholder="请输入发票号"></ElInput>
      </ElFormItem>

      <ElFormItem label="PI 日期" prop="piDate">
        <ElDatePicker
          v-model="formData.piDate"
          type="date"
          placeholder="请选择日期"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        ></ElDatePicker>
      </ElFormItem>

      <ElFormItem label="客户名称" prop="customerName">
        <ElInput v-model="formData.customerName" placeholder="请输入客户名称"></ElInput>
      </ElFormItem>

      <ElFormItem label="公司名称" prop="companyName">
        <ElInput v-model="formData.companyName" placeholder="请输入公司名称"></ElInput>
      </ElFormItem>

      <ElFormItem label="公司地址" prop="companyAddress">
        <ElInput
          v-model="formData.companyAddress"
          type="textarea"
          :rows="2"
          placeholder="请输入公司地址"
        ></ElInput>
      </ElFormItem>

      <ElFormItem label="收货人" prop="consignee">
        <ElInput v-model="formData.consignee" placeholder="请输入收货人"></ElInput>
      </ElFormItem>

      <ElDivider content-position="left">贸易信息</ElDivider>

      <ElFormItem label="贸易条款" prop="tradeTerms">
        <ElSelect v-model="formData.tradeTerms" placeholder="请选择贸易条款" style="width: 100%">
          <ElOption label="FOB" value="FOB"></ElOption>
          <ElOption label="CIF" value="CIF"></ElOption>
          <ElOption label="EXW" value="EXW"></ElOption>
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="贸易国家" prop="tradeCountry">
        <ElInput v-model="formData.tradeCountry" placeholder="请输入贸易国家"></ElInput>
      </ElFormItem>

      <ElFormItem label="装运港" prop="portOfLoading">
        <ElInput v-model="formData.portOfLoading" placeholder="请输入装运港"></ElInput>
      </ElFormItem>

      <ElFormItem label="目的港" prop="portOfDestination">
        <ElInput v-model="formData.portOfDestination" placeholder="请输入目的港"></ElInput>
      </ElFormItem>

      <ElFormItem label="交货期" prop="deliveryDate">
        <ElDatePicker
          v-model="formData.deliveryDate"
          type="date"
          placeholder="请选择交货期"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        ></ElDatePicker>
      </ElFormItem>

      <ElDivider content-position="left">付款信息</ElDivider>

      <ElFormItem label="币种" prop="currency">
        <ElSelect v-model="formData.currency" placeholder="请选择币种" style="width: 100%">
          <ElOption label="USD" value="USD"></ElOption>
          <ElOption label="EUR" value="EUR"></ElOption>
          <ElOption label="RMB" value="RMB"></ElOption>
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="总金额" prop="totalAmount">
        <ElInputNumber v-model="formData.totalAmount" :min="0" :precision="2" style="width: 100%" />
      </ElFormItem>

      <ElFormItem label="定金比例" prop="depositPercent">
        <ElInputNumber v-model="formData.depositPercent" :min="0" :max="100" style="width: 100%" />
      </ElFormItem>

      <ElFormItem label="定金金额" prop="depositAmount">
        <ElInputNumber
          v-model="formData.depositAmount"
          :min="0"
          :precision="2"
          style="width: 100%"
        />
      </ElFormItem>

      <ElFormItem label="尾款金额" prop="balanceAmount">
        <ElInputNumber
          v-model="formData.balanceAmount"
          :min="0"
          :precision="2"
          style="width: 100%"
        />
      </ElFormItem>

      <ElFormItem label="状态" prop="status">
        <ElSelect v-model="formData.status" placeholder="请选择状态" style="width: 100%">
          <ElOption label="待付款" value="待付款"></ElOption>
          <ElOption label="部分付款" value="部分付款"></ElOption>
          <ElOption label="已付款" value="已付款"></ElOption>
          <ElOption label="已取消" value="已取消"></ElOption>
        </ElSelect>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElSpace>
        <ElButton @click="handleClose">取消</ElButton>
        <ElButton type="primary" :loading="loading" @click="handleSubmit">确定</ElButton>
      </ElSpace>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'

  interface Props {
    visible: boolean
    type: 'add' | 'edit'
    piData?: Partial<Api.Trade.PIListItem>
  }

  const props = withDefaults(defineProps<Props>(), {
    piData: () => ({})
  })

  const emit = defineEmits<{
    submit: []
  }>()

  const formRef = ref<FormInstance>()
  const loading = ref(false)

  // 表单数据
  const formData = ref<Partial<Api.Trade.PIListItem>>({
    invoiceNo: '',
    piDate: '',
    customerName: '',
    companyName: '',
    companyAddress: '',
    consignee: '',
    tradeTerms: '',
    tradeCountry: '',
    portOfLoading: '',
    portOfDestination: '',
    deliveryDate: '',
    currency: 'USD',
    totalAmount: 0,
    depositPercent: 30,
    depositAmount: 0,
    balanceAmount: 0,
    status: '待付款'
  })

  // 表单验证规则
  const formRules: FormRules = {
    invoiceNo: [{ required: true, message: '请输入发票号', trigger: 'blur' }],
    piDate: [{ required: true, message: '请选择 PI 日期', trigger: 'change' }],
    customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
    companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
    tradeTerms: [{ required: true, message: '请选择贸易条款', trigger: 'change' }],
    currency: [{ required: true, message: '请选择币种', trigger: 'change' }]
  }

  // 初始化表单数据
  const initFormData = () => {
    if (props.type === 'edit' && props.piData?.id) {
      formData.value = { ...props.piData }
    } else {
      formData.value = {
        invoiceNo: '',
        piDate: new Date().toISOString().slice(0, 10),
        customerName: '',
        companyName: '',
        companyAddress: '',
        consignee: '',
        tradeTerms: 'FOB',
        tradeCountry: '',
        portOfLoading: '',
        portOfDestination: '',
        deliveryDate: '',
        currency: 'USD',
        totalAmount: 0,
        depositPercent: 30,
        depositAmount: 0,
        balanceAmount: 0,
        status: '待付款'
      }
    }
  }

  watch(
    () => props.visible,
    (val) => {
      if (val) {
        initFormData()
      }
    },
    { immediate: true }
  )

  // 关闭弹窗
  const handleClose = () => {
    emit('submit')
  }

  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (!valid) return

      loading.value = true
      try {
        ElMessage.success('保存成功')
        emit('submit')
      } catch {
        ElMessage.error('保存失败')
      } finally {
        loading.value = false
      }
    })
  }
</script>
