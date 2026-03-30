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

<style lang="scss" scoped>
  .search-form {
    :deep(.el-form-item) {
      margin-bottom: 16px;
    }

    // 移动端适配
    @media screen and (width <= 768px) {
      :deep(.el-row) {
        &:first-child {
          margin-bottom: 0 !important;
        }
      }

      :deep(.el-col) {
        margin-bottom: 8px;
      }

      :deep(.el-form-item__label) {
        width: 70px !important;
        font-size: 13px;
      }

      :deep(.el-input),
      :deep(.el-select) {
        font-size: 13px;
      }

      :deep(.text-right) {
        margin-top: 8px;
        text-align: right !important;
      }

      :deep(.el-button) {
        padding: 8px 16px;
        font-size: 13px;
      }
    }

    // 小屏手机适配
    @media screen and (width <= 480px) {
      :deep(.el-row) {
        flex-direction: column;
      }

      :deep(.el-col) {
        flex: 0 0 100% !important;
        width: 100% !important;
        max-width: 100% !important;
      }

      :deep(.el-form-item__label) {
        width: 60px !important;
        font-size: 12px;
      }

      :deep(.el-button) {
        width: auto;
        min-width: 80px;
      }
    }
  }
</style>
