<!-- PL 弹窗 -->
<template>
  <ElDialog
    :model-value="visible"
    :title="type === 'add' ? '新增 PL' : '编辑 PL'"
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

      <ElFormItem label="PL 编号" prop="plNo">
        <ElInput v-model="formData.plNo" placeholder="请输入 PL 编号"></ElInput>
      </ElFormItem>

      <ElFormItem label="关联 PI" prop="invoiceNo">
        <ElInput v-model="formData.invoiceNo" placeholder="请输入关联 PI 发票号"></ElInput>
      </ElFormItem>

      <ElFormItem label="PL 日期" prop="plDate">
        <ElDatePicker
          v-model="formData.plDate"
          type="date"
          placeholder="请选择日期"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        ></ElDatePicker>
      </ElFormItem>

      <ElFormItem label="客户名称" prop="customerName">
        <ElInput v-model="formData.customerName" placeholder="请输入客户名称"></ElInput>
      </ElFormItem>

      <ElFormItem label="收货人" prop="consignee">
        <ElInput v-model="formData.consignee" placeholder="请输入收货人"></ElInput>
      </ElFormItem>

      <ElDivider content-position="left">包装信息</ElDivider>

      <ElFormItem label="总数量" prop="totalQuantity">
        <ElInputNumber v-model="formData.totalQuantity" :min="0" style="width: 100%" />
      </ElFormItem>

      <ElFormItem label="总箱数" prop="totalCartons">
        <ElInputNumber v-model="formData.totalCartons" :min="0" style="width: 100%" />
      </ElFormItem>

      <ElFormItem label="总净重 (kg)" prop="totalNW">
        <ElInputNumber v-model="formData.totalNW" :min="0" :precision="2" style="width: 100%" />
      </ElFormItem>

      <ElFormItem label="总毛重 (kg)" prop="totalGW">
        <ElInputNumber v-model="formData.totalGW" :min="0" :precision="2" style="width: 100%" />
      </ElFormItem>

      <ElFormItem label="总体积 (CBM)" prop="totalCBM">
        <ElInputNumber v-model="formData.totalCBM" :min="0" :precision="3" style="width: 100%" />
      </ElFormItem>

      <ElFormItem label="状态" prop="status">
        <ElSelect v-model="formData.status" placeholder="请选择状态" style="width: 100%">
          <ElOption label="待发货" value="待发货"></ElOption>
          <ElOption label="部分发货" value="部分发货"></ElOption>
          <ElOption label="已发货" value="已发货"></ElOption>
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
    plData?: Partial<Api.Trade.PLListItem>
  }

  const props = withDefaults(defineProps<Props>(), {
    plData: () => ({})
  })

  const emit = defineEmits<{
    submit: []
  }>()

  const formRef = ref<FormInstance>()
  const loading = ref(false)

  const formData = ref<Partial<Api.Trade.PLListItem>>({
    plNo: '',
    invoiceNo: '',
    plDate: '',
    customerName: '',
    consignee: '',
    totalQuantity: 0,
    totalCartons: 0,
    totalNW: 0,
    totalGW: 0,
    totalCBM: 0,
    status: '待发货'
  })

  const formRules: FormRules = {
    plNo: [{ required: true, message: '请输入 PL 编号', trigger: 'blur' }],
    invoiceNo: [{ required: true, message: '请输入关联 PI 发票号', trigger: 'blur' }],
    plDate: [{ required: true, message: '请选择 PL 日期', trigger: 'change' }],
    customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }]
  }

  const initFormData = () => {
    if (props.type === 'edit' && props.plData?.id) {
      formData.value = { ...props.plData }
    } else {
      formData.value = {
        plNo: '',
        invoiceNo: '',
        plDate: new Date().toISOString().slice(0, 10),
        customerName: '',
        consignee: '',
        totalQuantity: 0,
        totalCartons: 0,
        totalNW: 0,
        totalGW: 0,
        totalCBM: 0,
        status: '待发货'
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

  const handleClose = () => {
    emit('submit')
  }

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
