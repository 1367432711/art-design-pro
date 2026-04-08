<!-- PL 搜索表单 -->
<template>
  <div class="art-search-form">
    <ElForm :model="modelValue" :inline="true">
      <ElFormItem label="PL 编号">
        <ElInput
          v-model="modelValue.plNo"
          placeholder="请输入 PL 编号"
          clearable
          style="width: 160px"
        ></ElInput>
      </ElFormItem>
      <ElFormItem label="发票号">
        <ElInput
          v-model="modelValue.invoiceNo"
          placeholder="请输入发票号"
          clearable
          style="width: 160px"
        ></ElInput>
      </ElFormItem>
      <ElFormItem label="客户名称">
        <ElInput
          v-model="modelValue.customerName"
          placeholder="请输入客户名称"
          clearable
          style="width: 160px"
        ></ElInput>
      </ElFormItem>
      <ElFormItem label="状态">
        <ElSelect
          v-model="modelValue.status"
          placeholder="请选择状态"
          clearable
          style="width: 120px"
        >
          <ElOption label="待发货" value="待发货"></ElOption>
          <ElOption label="部分发货" value="部分发货"></ElOption>
          <ElOption label="已发货" value="已发货"></ElOption>
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
  const modelValue = defineModel<Api.Trade.PLSearchParams>({ required: true })
  const emit = defineEmits<{
    search: [value: Api.Trade.PLSearchParams]
    reset: []
  }>()

  const handleSearch = () => {
    emit('search', { ...modelValue.value })
  }

  const handleReset = () => {
    modelValue.value.plNo = undefined
    modelValue.value.invoiceNo = undefined
    modelValue.value.customerName = undefined
    modelValue.value.status = undefined
    modelValue.value.startTime = undefined
    modelValue.value.endTime = undefined
    emit('reset')
  }
</script>
