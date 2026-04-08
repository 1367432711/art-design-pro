<!-- PI 搜索表单 -->
<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    :rules="rules"
    @reset="handleReset"
    @search="handleSearch"
  >
  </ArtSearchBar>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: Api.Trade.PISearchParams
  }
  interface Emits {
    (e: 'update:modelValue', value: Api.Trade.PISearchParams): void
    (e: 'search', params: Api.Trade.PISearchParams): void
    (e: 'reset'): void
  }
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 表单数据双向绑定
  const searchBarRef = ref()
  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  // 校验规则
  const rules = {}

  // 日期范围临时变量
  const dateRange = ref<[string, string] | null>(null)

  // 表单配置
  const formItems = computed(() => [
    {
      label: '发票号',
      key: 'invoiceNo',
      type: 'input',
      props: { placeholder: '请输入发票号', clearable: true }
    },
    {
      label: '客户名称',
      key: 'customerName',
      type: 'input',
      props: { placeholder: '请输入客户名称', clearable: true }
    },
    {
      label: '状态',
      key: 'status',
      type: 'select',
      props: {
        placeholder: '请选择状态',
        options: [
          { label: '待付款', value: '待付款' },
          { label: '部分付款', value: '部分付款' },
          { label: '已付款', value: '已付款' },
          { label: '已取消', value: '已取消' }
        ],
        clearable: true
      }
    },
    {
      label: '创建日期',
      key: 'dateRange',
      type: 'daterange',
      props: {
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD',
        rangeSeparator: '至'
      }
    }
  ])

  // 事件
  function handleReset() {
    dateRange.value = null
    emit('reset')
  }

  async function handleSearch(params: Api.Trade.PISearchParams) {
    await searchBarRef.value.validate()
    // 将日期范围转换为 startTime 和 endTime
    const searchParams = { ...params }
    if (dateRange.value && dateRange.value.length === 2) {
      searchParams.startTime = dateRange.value[0]
      searchParams.endTime = dateRange.value[1]
    } else {
      searchParams.startTime = undefined
      searchParams.endTime = undefined
    }
    emit('search', searchParams)
  }
</script>
