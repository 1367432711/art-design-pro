<!-- 银行账户搜索表单 -->
<template>
  <div class="art-search-form">
    <ElForm :model="modelValue" :inline="true">
      <ElFormItem label="银行名称">
        <ElInput
          v-model="modelValue.bankName"
          placeholder="请输入银行名称"
          clearable
          style="width: 200px"
        ></ElInput>
      </ElFormItem>
      <ElFormItem label="账户名称">
        <ElInput
          v-model="modelValue.accountName"
          placeholder="请输入账户名称"
          clearable
          style="width: 200px"
        ></ElInput>
      </ElFormItem>
      <ElFormItem label="状态">
        <ElSelect
          v-model="modelValue.status"
          placeholder="请选择状态"
          clearable
          style="width: 150px"
        >
          <ElOption label="启用" value="active"></ElOption>
          <ElOption label="禁用" value="inactive"></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem>
        <ElSpace>
          <ElButton type="primary" @click="handleSearch">查询</ElButton>
          <ElButton @click="handleReset">重置</ElButton>
        </ElSpace>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
  const modelValue = defineModel<Api.Trade.BankAccountSearchParams>({ required: true })
  const emit = defineEmits<{
    search: [value: Api.Trade.BankAccountSearchParams]
    reset: []
  }>()

  const handleSearch = () => {
    emit('search', { ...modelValue.value })
  }

  const handleReset = () => {
    modelValue.value.bankName = undefined
    modelValue.value.accountName = undefined
    modelValue.value.status = undefined
    emit('reset')
  }
</script>
