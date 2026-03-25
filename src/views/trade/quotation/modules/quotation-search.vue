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
    modelValue: Api.Trade.QuotationSearchParams
  }
  interface Emits {
    (e: 'update:modelValue', value: Api.Trade.QuotationSearchParams): void
    (e: 'search', params: Api.Trade.QuotationSearchParams): void
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

  // 动态 options
  const statusOptions = ref<{ label: string; value: string }[]>([])
  const currencyOptions = ref<{ label: string; value: string }[]>([])

  // 状态选项
  function fetchStatusOptions(): Promise<typeof statusOptions.value> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: '待确认', value: '1' },
          { label: '已接受', value: '2' },
          { label: '已拒绝', value: '3' },
          { label: '已过期', value: '4' }
        ])
      }, 500)
    })
  }

  // 币种选项
  function fetchCurrencyOptions(): Promise<typeof currencyOptions.value> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: 'USD - 美元', value: 'USD' },
          { label: 'EUR - 欧元', value: 'EUR' },
          { label: 'CNY - 人民币', value: 'CNY' },
          { label: 'GBP - 英镑', value: 'GBP' },
          { label: 'JPY - 日元', value: 'JPY' }
        ])
      }, 500)
    })
  }

  onMounted(async () => {
    statusOptions.value = await fetchStatusOptions()
    currencyOptions.value = await fetchCurrencyOptions()
  })

  // 表单配置
  const formItems = computed(() => [
    {
      label: '客户名称',
      key: 'customerName',
      type: 'input',
      placeholder: '请输入客户名称',
      clearable: true
    },
    {
      label: '报价单号',
      key: 'quotationNo',
      type: 'input',
      placeholder: '请输入报价单号',
      clearable: true
    },
    {
      label: '产品名称',
      key: 'productName',
      type: 'input',
      placeholder: '请输入产品名称',
      clearable: true
    },
    {
      label: '状态',
      key: 'status',
      type: 'select',
      props: {
        placeholder: '请选择状态',
        options: statusOptions.value,
        clearable: true
      }
    },
    {
      label: '币种',
      key: 'currency',
      type: 'select',
      props: {
        placeholder: '请选择币种',
        options: currencyOptions.value,
        clearable: true
      }
    },
    {
      label: '报价日期',
      key: 'dateRange',
      type: 'daterange',
      props: {
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD'
      }
    }
  ])

  // 事件
  function handleReset() {
    emit('reset')
  }

  async function handleSearch(params: Api.Trade.QuotationSearchParams) {
    await searchBarRef.value.validate()
    // 处理日期范围
    const { dateRange, ...rest } = params as any
    const searchParams = { ...rest } as Api.Trade.QuotationSearchParams
    if (dateRange && dateRange.length === 2) {
      searchParams.startTime = dateRange[0]
      searchParams.endTime = dateRange[1]
    }
    emit('search', searchParams)
  }
</script>
