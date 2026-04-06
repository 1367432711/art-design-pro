<!-- 数据管理页面 - 用于管理 Mock 数据 -->
<template>
  <div class="w-full h-full p-0 bg-transparent border-none shadow-none">
    <div class="flex-b mt-2.5 max-md:block max-md:mt-1">
      <!-- 左侧模块列表 -->
      <div class="w-60 mr-5 max-md:w-full max-md:mr-0 max-md:mb-5">
        <div class="art-card-sm p-5">
          <h3 class="text-lg font-medium mb-4">数据模块</h3>
          <ElRadioGroup v-model="selectedModule" class="flex-col items-start" size="large">
            <ElRadioButton label="customer" class="w-full mb-2">客户管理</ElRadioButton>
            <ElRadioButton label="product" class="w-full mb-2">产品管理</ElRadioButton>
            <ElRadioButton label="quotation" class="w-full mb-2">报价管理</ElRadioButton>
            <ElRadioButton label="user" class="w-full">用户信息</ElRadioButton>
          </ElRadioGroup>
        </div>
      </div>

      <!-- 右侧操作面板 -->
      <div class="flex-1 max-md:w-full">
        <div class="art-card-sm p-5">
          <h3 class="text-lg font-medium mb-4"> {{ moduleNames[selectedModule] }} - 数据操作 </h3>

          <ElRow :gutter="20" class="mb-6">
            <ElCol :span="12">
              <div class="p-4 border border-g-300 rounded bg-g-50">
                <h4 class="text-sm font-medium mb-2">数据统计</h4>
                <p class="text-2xl font-bold text-primary">{{ dataCount }} 条记录</p>
              </div>
            </ElCol>
            <ElCol :span="12">
              <div class="p-4 border border-g-300 rounded bg-g-50">
                <h4 class="text-sm font-medium mb-2">最后更新</h4>
                <p class="text-sm text-gray-600">{{ lastUpdateTime || '暂无记录' }}</p>
              </div>
            </ElCol>
          </ElRow>

          <div class="flex flex-wrap gap-3">
            <ElButton type="primary" v-ripple @click="handleExport">
              <ArtSvgIcon icon="ri:download-line" class="mr-1" />
              导出数据
            </ElButton>

            <ElButton v-ripple @click="triggerImport">
              <ArtSvgIcon icon="ri:upload-line" class="mr-1" />
              导入数据
            </ElButton>

            <ElButton type="danger" v-ripple @click="handleClear" :disabled="dataCount === 0">
              <ArtSvgIcon icon="ri:delete-bin-line" class="mr-1" />
              清空数据
            </ElButton>

            <ElButton type="warning" v-ripple @click="handleResetToDefault">
              <ArtSvgIcon icon="ri:refresh-line" class="mr-1" />
              重置为默认数据
            </ElButton>
          </div>

          <!-- 数据预览 -->
          <div class="mt-6">
            <h4 class="text-sm font-medium mb-3">数据预览（前 5 条）</h4>
            <ElTable :data="previewData" style="width: 100%" :max-height="300">
              <template v-for="col in previewColumns" :key="col.prop">
                <ElTableColumn :prop="col.prop" :label="col.label" :min-width="col.minWidth" />
              </template>
            </ElTable>
          </div>

          <!-- 隐藏的文件输入 -->
          <input
            ref="fileInputRef"
            type="file"
            accept=".json"
            class="hidden"
            @change="handleFileImport"
          />
        </div>

        <!-- 使用说明 -->
        <div class="art-card-sm mt-5 p-5">
          <h3 class="text-lg font-medium mb-4">使用说明</h3>
          <ElCollapse>
            <ElCollapseItem title="如何使用数据导出功能？" name="1">
              <div class="text-sm text-gray-600 space-y-2">
                <p>1. 在左侧选择要导出的数据模块</p>
                <p>2. 点击"导出数据"按钮</p>
                <p>3. 浏览器会自动下载 JSON 文件到本地</p>
                <p>4. 导出的文件可以用于备份或分享给团队成员</p>
              </div>
            </ElCollapseItem>
            <ElCollapseItem title="如何使用数据导入功能？" name="2">
              <div class="text-sm text-gray-600 space-y-2">
                <p>1. 在左侧选择要导入的数据模块</p>
                <p>2. 点击"导入数据"按钮</p>
                <p>3. 选择之前导出的 JSON 文件</p>
                <p>4. 导入的数据会追加到现有数据中（不会覆盖）</p>
                <p class="text-warning">注意：请确保导入的文件格式正确，否则可能导致导入失败</p>
              </div>
            </ElCollapseItem>
            <ElCollapseItem title="数据同步机制" name="3">
              <div class="text-sm text-gray-600 space-y-2">
                <p>• 开发环境下，所有数据的增删改操作都会自动同步到 src/mock/data/*.json 文件</p>
                <p>• 每次刷新页面时，会从 JSON 文件重新加载最新数据</p>
                <p>• 这意味着你可以在浏览器中操作数据，然后直接提交 JSON 文件到 git</p>
                <p class="text-warning"
                  >注意：此功能仅在开发环境（pnpm dev）生效，生产环境不受影响</p
                >
              </div>
            </ElCollapseItem>
          </ElCollapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    exportModuleData,
    importModuleData,
    clearModuleData,
    getCustomerList,
    getProductList,
    getQuotationList,
    getUserInfo
  } from '@/utils/storage/db'
  import customerData from '@/mock/data/customerList.json'
  import productData from '@/mock/data/productList.json'
  import quotationData from '@/mock/data/quotationList.json'
  import userData from '@/mock/data/userInfo.json'

  defineOptions({ name: 'DataManage' })

  const selectedModule = ref<'customer' | 'product' | 'quotation' | 'user'>('customer')
  const fileInputRef = ref<HTMLInputElement>()

  const moduleNames: Record<string, string> = {
    customer: '客户管理',
    product: '产品管理',
    quotation: '报价管理',
    user: '用户信息'
  }

  // 获取当前模块的数据
  const getCurrentData = () => {
    switch (selectedModule.value) {
      case 'customer':
        return getCustomerList()
      case 'product':
        return getProductList()
      case 'quotation':
        return getQuotationList()
      case 'user': {
        const info = getUserInfo()
        return info ? [info] : []
      }
    }
  }

  // 获取默认数据
  const getDefaultData = () => {
    switch (selectedModule.value) {
      case 'customer':
        return customerData
      case 'product':
        return productData
      case 'quotation':
        return quotationData
      case 'user':
        return userData ? [userData] : []
    }
  }

  // 数据数量
  const dataCount = computed(() => {
    const data = getCurrentData()
    return Array.isArray(data) ? data.length : data ? 1 : 0
  })

  // 最后更新时间（简单实现，从第一条数据获取）
  const lastUpdateTime = computed(() => {
    const data = getCurrentData()
    if (Array.isArray(data) && data.length > 0 && data[0]?.updateTime) {
      return data[0].updateTime
    }
    return null
  })

  // 预览数据（前 5 条）
  const previewData = computed(() => {
    const data = getCurrentData()
    if (Array.isArray(data)) {
      return data.slice(0, 5)
    }
    return data ? [data] : []
  })

  // 预览表格列配置
  const previewColumns = computed(() => {
    switch (selectedModule.value) {
      case 'customer':
        return [
          { prop: 'customerName', label: '客户名称', minWidth: 150 },
          { prop: 'contactPerson', label: '联系人', minWidth: 100 },
          { prop: 'country', label: '国家', minWidth: 80 },
          { prop: 'status', label: '状态', minWidth: 60 }
        ]
      case 'product':
        return [
          { prop: 'name', label: '产品名称', minWidth: 150 },
          { prop: 'sku', label: 'SKU', minWidth: 100 },
          { prop: 'type', label: '类型', minWidth: 100 },
          { prop: 'status', label: '状态', minWidth: 60 }
        ]
      case 'quotation':
        return [
          { prop: 'quotationNo', label: '报价单号', minWidth: 120 },
          { prop: 'customerName', label: '客户', minWidth: 120 },
          { prop: 'currency', label: '币种', minWidth: 60 },
          { prop: 'status', label: '状态', minWidth: 60 }
        ]
      case 'user':
        return [
          { prop: 'userName', label: '用户名', minWidth: 100 },
          { prop: 'realName', label: '姓名', minWidth: 100 },
          { prop: 'email', label: '邮箱', minWidth: 180 },
          { prop: 'role', label: '角色', minWidth: 100 }
        ]
      default:
        return []
    }
  })

  // 导出数据
  const handleExport = () => {
    exportModuleData(selectedModule.value)
    ElMessage.success(`${moduleNames[selectedModule.value]} 已导出`)
  }

  // 触发文件选择
  const triggerImport = () => {
    fileInputRef.value?.click()
  }

  // 处理文件导入
  const handleFileImport = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const success = importModuleData(selectedModule.value, content)
        if (success) {
          ElMessage.success(`${moduleNames[selectedModule.value]} 导入成功`)
          // 刷新页面以重新加载数据
          setTimeout(() => location.reload(), 1000)
        } else {
          ElMessage.error('导入失败，请检查文件格式')
        }
      } catch (error) {
        console.error('导入失败:', error)
        ElMessage.error('导入失败，请检查文件格式')
      }
    }
    reader.readAsText(file)

    // 清空 input，允许重复选择同一文件
    target.value = ''
  }

  // 清空数据
  const handleClear = () => {
    ElMessageBox.confirm(
      `确定要清空${moduleNames[selectedModule.value]}的所有数据吗？此操作不可恢复！`,
      '警告',
      {
        confirmButtonText: '确定清空',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(() => {
        clearModuleData(selectedModule.value)
        ElMessage.success('数据已清空')
        // 刷新页面
        setTimeout(() => location.reload(), 1000)
      })
      .catch(() => {
        // 用户取消
      })
  }

  // 重置为默认数据
  const handleResetToDefault = () => {
    ElMessageBox.confirm(
      `确定要将${moduleNames[selectedModule.value]}重置为默认数据吗？当前数据将被覆盖！`,
      '确认重置',
      {
        confirmButtonText: '确定重置',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(() => {
        // 先清空再导入默认数据
        clearModuleData(selectedModule.value)
        const defaultData = getDefaultData()
        if (defaultData && Array.isArray(defaultData)) {
          defaultData.forEach((item: any) => {
            importModuleData(selectedModule.value, JSON.stringify(item))
          })
        }
        ElMessage.success('数据已重置为默认值')
        setTimeout(() => location.reload(), 1000)
      })
      .catch(() => {
        // 用户取消
      })
  }
</script>

<style scoped>
  :deep(.el-radio-group.is-large) {
    display: flex;
    flex-direction: column;
  }

  :deep(.el-radio-button__inner) {
    width: 100%;
    text-align: center;
  }
</style>
