<!-- 银行账户弹窗 -->
<template>
  <ElDialog
    :model-value="visible"
    :title="type === 'add' ? '新增银行账户' : '编辑银行账户'"
    width="800px"
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

      <ElFormItem label="银行名称" prop="bankName">
        <ElInput v-model="formData.bankName" placeholder="请输入银行名称"></ElInput>
      </ElFormItem>

      <ElFormItem label="账户名称" prop="accountName">
        <ElInput v-model="formData.accountName" placeholder="请输入账户名称（受益人）"></ElInput>
      </ElFormItem>

      <ElFormItem label="美元账号" prop="accountNumberUSD">
        <ElInput v-model="formData.accountNumberUSD" placeholder="请输入美元账号"></ElInput>
      </ElFormItem>

      <ElFormItem label="人民币账号" prop="accountNumberRMB">
        <ElInput v-model="formData.accountNumberRMB" placeholder="请输入人民币账号"></ElInput>
      </ElFormItem>

      <ElFormItem label="SWIFT 代码" prop="swiftCode">
        <ElInput v-model="formData.swiftCode" placeholder="请输入 SWIFT 代码"></ElInput>
      </ElFormItem>

      <ElFormItem label="银行地址" prop="bankAddress">
        <ElInput
          v-model="formData.bankAddress"
          type="textarea"
          :rows="2"
          placeholder="请输入银行地址"
        ></ElInput>
      </ElFormItem>

      <ElFormItem label="银行所在国家" prop="bankCountry">
        <ElInput v-model="formData.bankCountry" placeholder="请输入银行所在国家"></ElInput>
      </ElFormItem>

      <ElFormItem label="是否默认账户" prop="isDefault">
        <ElSwitch
          v-model="formData.isDefault"
          :active-value="true"
          :inactive-value="false"
        ></ElSwitch>
      </ElFormItem>

      <ElFormItem label="状态" prop="status">
        <ElRadioGroup v-model="formData.status">
          <ElRadio :value="'active'">启用</ElRadio>
          <ElRadio :value="'inactive'">禁用</ElRadio>
        </ElRadioGroup>
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
    bankAccountData?: Partial<Api.Trade.BankAccount>
  }

  const props = withDefaults(defineProps<Props>(), {
    bankAccountData: () => ({})
  })

  const emit = defineEmits<{
    submit: []
  }>()

  const formRef = ref<FormInstance>()
  const loading = ref(false)

  // 表单数据
  const formData = ref<Partial<Api.Trade.BankAccount>>({
    bankName: '',
    accountName: '',
    accountNumberUSD: '',
    accountNumberRMB: '',
    swiftCode: '',
    bankAddress: '',
    bankCountry: '',
    isDefault: false,
    status: 'active'
  })

  // 表单验证规则
  const formRules: FormRules = {
    bankName: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
    accountName: [{ required: true, message: '请输入账户名称', trigger: 'blur' }],
    accountNumberUSD: [{ required: true, message: '请输入美元账号', trigger: 'blur' }],
    accountNumberRMB: [{ required: true, message: '请输入人民币账号', trigger: 'blur' }],
    swiftCode: [{ required: true, message: '请输入 SWIFT 代码', trigger: 'blur' }],
    bankCountry: [{ required: true, message: '请输入银行所在国家', trigger: 'blur' }]
  }

  // 初始化表单数据
  const initFormData = () => {
    if (props.type === 'edit' && props.bankAccountData?.id) {
      formData.value = { ...props.bankAccountData }
    } else {
      formData.value = {
        bankName: '',
        accountName: '',
        accountNumberUSD: '',
        accountNumberRMB: '',
        swiftCode: '',
        bankAddress: '',
        bankCountry: '',
        isDefault: false,
        status: 'active'
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
        // TODO: 调用 API 提交数据
        // if (props.type === 'add') {
        //   await fetchCreateBankAccount(formData.value)
        // } else {
        //   await fetchUpdateBankAccount(formData.value)
        // }
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
