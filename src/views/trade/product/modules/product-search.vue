<!-- 产品搜索组件 -->
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
    modelValue: Api.Trade.ProductSearchParams
  }
  interface Emits {
    (e: 'update:modelValue', value: Api.Trade.ProductSearchParams): void
    (e: 'search', params: Record<string, any>): void
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
    // keyword: [{ required: true, message: '请输入关键词', trigger: 'blur' }]
  }

  // 动态 options
  const typeOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([])
  const gradeOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([])
  const materialOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([])

  // 模拟接口返回状态数据
  function fetchTypeOptions(): Promise<typeof typeOptions.value> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: '切割片', value: '切割片' },
          { label: '百叶片', value: '百叶片' },
          { label: '磨光片', value: '磨光片' },
          { label: '其他', value: '其他' }
        ])
      }, 500)
    })
  }

  function fetchGradeOptions(): Promise<typeof gradeOptions.value> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: 'A 级', value: 'A 级' },
          { label: 'B 级', value: 'B 级' },
          { label: 'C 级', value: 'C 级' }
        ])
      }, 500)
    })
  }

  function fetchMaterialOptions(): Promise<typeof materialOptions.value> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: '树脂', value: '树脂' },
          { label: '陶瓷', value: '陶瓷' },
          { label: '刚玉', value: '刚玉' },
          { label: '其他', value: '其他' }
        ])
      }, 500)
    })
  }

  onMounted(async () => {
    typeOptions.value = await fetchTypeOptions()
    gradeOptions.value = await fetchGradeOptions()
    materialOptions.value = await fetchMaterialOptions()
  })

  // 表单配置
  const formItems = computed(() => [
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      placeholder: '产品名称/SKU/规格型号',
      clearable: true
    },
    {
      label: '产品类型',
      key: 'type',
      type: 'select',
      props: {
        placeholder: '请选择',
        options: typeOptions.value,
        clearable: true
      }
    },
    {
      label: '产品等级',
      key: 'grade',
      type: 'select',
      props: {
        placeholder: '请选择',
        options: gradeOptions.value,
        clearable: true
      }
    },
    {
      label: '材质',
      key: 'material',
      type: 'input',
      props: { placeholder: '请输入材质', clearable: true }
    }
  ])

  // 事件
  function handleReset() {
    console.log('重置表单')
    emit('reset')
  }

  async function handleSearch(params: Record<string, any>) {
    await searchBarRef.value.validate()
    emit('search', params)
    console.log('表单数据', params)
  }
</script>
