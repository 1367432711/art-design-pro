<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '添加客户' : '编辑客户'"
    width="40%"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="客户名称" prop="customerName">
            <ElInput v-model="formData.customerName" placeholder="请输入客户名称" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="联系人" prop="contactPerson">
            <ElInput v-model="formData.contactPerson" placeholder="请输入联系人" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="联系电话" prop="contactPhone">
            <ElInput v-model="formData.contactPhone" placeholder="请输入联系电话" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="联系邮箱" prop="contactEmail">
            <ElInput v-model="formData.contactEmail" placeholder="请输入联系邮箱" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="国家" prop="country">
            <ElSelect v-model="formData.country" placeholder="请选择国家" clearable>
              <ElOption label="中国" value="中国" />
              <ElOption label="美国" value="美国" />
              <ElOption label="英国" value="英国" />
              <ElOption label="德国" value="德国" />
              <ElOption label="法国" value="法国" />
              <ElOption label="日本" value="日本" />
              <ElOption label="韩国" value="韩国" />
              <ElOption label="澳大利亚" value="澳大利亚" />
              <ElOption label="加拿大" value="加拿大" />
              <ElOption label="其他" value="其他" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="客户状态" prop="status">
            <ElRadioGroup v-model="formData.status">
              <ElRadio label="1">活跃</ElRadio>
              <ElRadio label="2">潜在</ElRadio>
              <ElRadio label="3">流失</ElRadio>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElFormItem label="主要产品" prop="products">
        <ElInput
          v-model="formData.products"
          type="textarea"
          :rows="3"
          placeholder="请输入客户主要采购产品"
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

  interface Props {
    visible: boolean
    type: string
    customerData?: Partial<Api.Trade.CustomerListItem>
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

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
    customerName: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    country: '',
    products: '',
    status: '1'
  })

  // 表单验证规则
  const rules: FormRules = {
    customerName: [
      { required: true, message: '请输入客户名称', trigger: 'blur' },
      { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
    ],
    contactPerson: [
      { required: true, message: '请输入联系人', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    contactPhone: [
      {
        required: true,
        message: '请输入联系电话',
        trigger: 'blur'
      },
      {
        pattern: /^[\d\-+()#\s]+$/,
        message: '请输入正确的电话格式',
        trigger: 'blur'
      }
    ],
    contactEmail: [
      {
        required: true,
        message: '请输入联系邮箱',
        trigger: 'blur'
      },
      {
        type: 'email',
        message: '请输入正确的邮箱格式',
        trigger: 'blur'
      }
    ],
    country: [{ required: true, message: '请选择国家', trigger: 'blur' }],
    status: [{ required: true, message: '请选择客户状态', trigger: 'blur' }]
  }

  /**
   * 初始化表单数据
   * 根据对话框类型（新增/编辑）填充表单
   */
  const initFormData = () => {
    const isEdit = props.type === 'edit' && props.customerData
    const row = props.customerData

    Object.assign(formData, {
      customerName: isEdit && row ? row.customerName || '' : '',
      contactPerson: isEdit && row ? row.contactPerson || '' : '',
      contactPhone: isEdit && row ? row.contactPhone || '' : '',
      contactEmail: isEdit && row ? row.contactEmail || '' : '',
      country: isEdit && row ? row.country || '' : '',
      products: isEdit && row ? row.products || '' : '',
      status: isEdit && row ? row.status || '1' : '1'
    })
  }

  /**
   * 监听对话框状态变化
   * 当对话框打开时初始化表单数据并清除验证状态
   */
  watch(
    () => [props.visible, props.type, props.customerData],
    ([visible]) => {
      if (visible) {
        initFormData()
        nextTick(() => {
          formRef.value?.clearValidate()
        })
      }
    },
    { immediate: true }
  )

  /**
   * 提交表单
   * 验证通过后触发提交事件
   */
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
