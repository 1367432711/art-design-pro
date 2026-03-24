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
    modelValue: Api.Trade.CustomerSearchParams
  }
  interface Emits {
    (e: 'update:modelValue', value: Api.Trade.CustomerSearchParams): void
    (e: 'search', params: Api.Trade.CustomerSearchParams): void
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
  const rules = {
    // customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }]
  }

  // 动态 options
  const statusOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([])
  const countryOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([])

  // 模拟接口返回状态数据
  function fetchStatusOptions(): Promise<typeof statusOptions.value> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: '活跃', value: '1' },
          { label: '潜在', value: '2' },
          { label: '流失', value: '3' }
        ])
      }, 500)
    })
  }

  // 模拟接口返回国家数据
  function fetchCountryOptions(): Promise<typeof countryOptions.value> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: '中国', value: '中国' },
          { label: '美国', value: '美国' },
          { label: '英国', value: '英国' },
          { label: '德国', value: '德国' },
          { label: '法国', value: '法国' },
          { label: '日本', value: '日本' },
          { label: '韩国', value: '韩国' },
          { label: '澳大利亚', value: '澳大利亚' },
          { label: '加拿大', value: '加拿大' },
          { label: '其他', value: '其他' }
        ])
      }, 500)
    })
  }

  onMounted(async () => {
    statusOptions.value = await fetchStatusOptions()
    countryOptions.value = await fetchCountryOptions()
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
      label: '联系人',
      key: 'contactPerson',
      type: 'input',
      placeholder: '请输入联系人',
      clearable: true
    },
    {
      label: '联系电话',
      key: 'contactPhone',
      type: 'input',
      props: { placeholder: '请输入联系电话', maxlength: '20' }
    },
    {
      label: '联系邮箱',
      key: 'contactEmail',
      type: 'input',
      props: { placeholder: '请输入联系邮箱' }
    },
    {
      label: '国家',
      key: 'country',
      type: 'select',
      props: {
        placeholder: '请选择国家',
        options: countryOptions.value,
        clearable: true
      }
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
    }
  ])

  // 事件
  function handleReset() {
    console.log('重置表单')
    emit('reset')
  }

  async function handleSearch(params: Api.Trade.CustomerSearchParams) {
    await searchBarRef.value.validate()
    emit('search', params)
    console.log('表单数据', params)
  }
</script>
