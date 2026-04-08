<!-- PI 搜索表单 -->
<template>
  <div class="art-search-form">
    <ElForm :model="modelValue" :inline="true">
      <ElFormItem label="发票号">
        <ElInput
          v-model="modelValue.invoiceNo"
          placeholder="请输入发票号"
          clearable
          style="width: 180px"
        ></ElInput>
      </ElFormItem>
      <ElFormItem label="客户名称">
        <ElInput
          v-model="modelValue.customerName"
          placeholder="请输入客户名称"
          clearable
          style="width: 180px"
        ></ElInput>
      </ElFormItem>
      <ElFormItem label="状态">
        <ElSelect
          v-model="modelValue.status"
          placeholder="请选择状态"
          clearable
          style="width: 120px"
        >
          <ElOption label="待付款" value="待付款"></ElOption>
          <ElOption label="部分付款" value="部分付款"></ElOption>
          <ElOption label="已付款" value="已付款"></ElOption>
          <ElOption label="已取消" value="已取消"></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="日期范围">
        <ElDatePicker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          style="width: 240px"
          @change="handleDateChange"
        ></ElDatePicker>
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
  const modelValue = defineModel<Api.Trade.PISearchParams>({ required: true })
  const emit = defineEmits<{
    search: [value: Api.Trade.PISearchParams]
    reset: []
  }>()

  const dateRange = ref<[string, string] | null>(null)

  const handleDateChange = (dates: [string, string] | null) => {
    if (dates) {
      modelValue.value.startTime = dates[0]
      modelValue.value.endTime = dates[1]
    } else {
      modelValue.value.startTime = undefined
      modelValue.value.endTime = undefined
    }
  }

  const handleSearch = () => {
    emit('search', { ...modelValue.value })
  }

  const handleReset = () => {
    modelValue.value.invoiceNo = undefined
    modelValue.value.customerName = undefined
    modelValue.value.status = undefined
    modelValue.value.startTime = undefined
    modelValue.value.endTime = undefined
    dateRange.value = null
    emit('reset')
  }
</script>
