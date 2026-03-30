<!-- 产品搜索组件 -->
<template>
  <ElCard class="mb-3 art-card">
    <ElForm
      :model="modelValue"
      label-width="86px"
      label-position="left"
      class="search-form"
      @keyup.enter="handleSearch"
    >
      <ElRow :gutter="16">
        <ElCol :span="8">
          <ElFormItem label="关键词">
            <ElInput v-model="modelValue.keyword" placeholder="产品名称/SKU/规格型号" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="产品类型">
            <ElSelect v-model="modelValue.type" placeholder="请选择" clearable>
              <ElOption label="切割片" value="切割片" />
              <ElOption label="百叶片" value="百叶片" />
              <ElOption label="磨光片" value="磨光片" />
              <ElOption label="其他" value="其他" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="产品等级">
            <ElSelect v-model="modelValue.grade" placeholder="请选择" clearable>
              <ElOption label="A 级" value="A 级" />
              <ElOption label="B 级" value="B 级" />
              <ElOption label="C 级" value="C 级" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="16">
        <ElCol :span="8">
          <ElFormItem label="材质">
            <ElInput v-model="modelValue.material" placeholder="请输入材质" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="16" class="text-right">
          <ElButton @click="handleReset">重置</ElButton>
          <ElButton type="primary" @click="handleSearch">
            <Icon icon="ri:search-line" class="mr-1" />
            搜索
          </ElButton>
        </ElCol>
      </ElRow>
    </ElForm>
  </ElCard>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'

  interface SearchForm {
    keyword?: string
    type?: string
    grade?: string
    material?: string
  }

  const modelValue = defineModel<SearchForm>({ required: true })
  const emit = defineEmits<{
    search: [params: SearchForm]
    reset: []
  }>()

  /**
   * 搜索
   */
  const handleSearch = () => {
    emit('search', modelValue.value)
  }

  /**
   * 重置
   */
  const handleReset = () => {
    modelValue.value = {
      keyword: undefined,
      type: undefined,
      grade: undefined,
      material: undefined
    }
    emit('reset')
  }
</script>
