<!-- 添加跟进弹窗 -->
<template>
  <ElDialog
    v-model="dialogVisible"
    :title="type === 'add' ? '添加跟进记录' : '编辑跟进记录'"
    width="600px"
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      label-position="left"
    >
      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElFormItem label="跟进类型" prop="followupType">
            <ElSelect
              v-model="formData.followupType"
              placeholder="请选择跟进类型"
              clearable
              style="width: 100%"
            >
              <ElOption label="电话跟进" value="phone" />
              <ElOption label="邮件跟进" value="email" />
              <ElOption label="微信沟通" value="wechat" />
              <ElOption label="WhatsApp 沟通" value="whatsapp" />
              <ElOption label="样品寄送" value="sample" />
              <ElOption label="合同签订" value="contract" />
              <ElOption label="其他" value="other" />
            </ElSelect>
          </ElFormItem>
        </ElCol>

        <ElCol :span="24">
          <ElFormItem label="跟进时间" prop="followupTime">
            <ElDatePicker
              v-model="formData.followupTime"
              type="datetime"
              placeholder="请选择跟进时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </ElFormItem>
        </ElCol>

        <ElCol :span="24">
          <ElFormItem label="跟进内容" prop="content">
            <ElInput
              v-model="formData.content"
              type="textarea"
              :rows="6"
              placeholder="请输入详细的跟进内容"
              maxlength="2000"
              show-word-limit
            />
          </ElFormItem>
        </ElCol>

        <ElCol :span="24">
          <ElFormItem label="下一步计划" prop="nextPlan">
            <ElInput
              v-model="formData.nextPlan"
              type="textarea"
              :rows="3"
              placeholder="请输入下一步跟进计划"
              maxlength="500"
              show-word-limit
            />
          </ElFormItem>
        </ElCol>

        <ElCol :span="24">
          <ElFormItem label="提醒时间" prop="reminderTime">
            <ElDatePicker
              v-model="formData.reminderTime"
              type="datetime"
              placeholder="请选择提醒时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
              clearable
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>

    <template #footer>
      <ElSpace>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="submitting" @click="handleSubmit"> 确定 </ElButton>
      </ElSpace>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import {
    ElForm,
    ElDialog,
    ElRow,
    ElCol,
    ElFormItem,
    ElInput,
    ElButton,
    ElSpace,
    ElSelect,
    ElOption,
    ElDatePicker,
    ElMessage
  } from 'element-plus'

  defineOptions({ name: 'FollowupDialog' })

  const props = defineProps<{
    visible: boolean
    type: 'add' | 'edit'
    customerId?: string
    customerName?: string
    followupData?: Partial<Api.Trade.FollowupListItem>
  }>()

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
  }>()

  const formRef = ref<InstanceType<typeof ElForm>>()

  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  // 表单数据
  const formData = ref<Partial<Api.Trade.FollowupListItem>>({
    followupType: '',
    followupTime: '',
    content: '',
    nextPlan: '',
    reminderTime: ''
  })

  // 表单验证规则
  const formRules = {
    followupType: [{ required: true, message: '请选择跟进类型', trigger: 'change' }],
    followupTime: [{ required: true, message: '请选择跟进时间', trigger: 'change' }],
    content: [{ required: true, message: '请输入跟进内容', trigger: 'blur' }]
  }

  const submitting = ref(false)

  // 初始化表单数据
  watch(
    () => props.followupData,
    (data) => {
      if (data && props.type === 'edit') {
        formData.value = { ...formData.value, ...data }
      }
    },
    { immediate: true }
  )

  // 重置表单
  const resetForm = () => {
    formData.value = {
      followupType: '',
      followupTime: '',
      content: '',
      nextPlan: '',
      reminderTime: ''
    }
    formRef.value?.clearValidate()
  }

  // 弹窗关闭后重置
  const handleClosed = () => {
    resetForm()
  }

  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (!valid) return

      submitting.value = true
      try {
        // TODO: 调用创建/更新跟进记录的 API
        await new Promise((resolve) => setTimeout(resolve, 500))
        ElMessage.success(props.type === 'add' ? '添加跟进记录成功' : '更新跟进记录成功')
        dialogVisible.value = false
        emit('submit')
      } catch (error) {
        console.error('提交跟进记录失败:', error)
      } finally {
        submitting.value = false
      }
    })
  }
</script>

<style lang="scss" scoped></style>
