<!-- 产品管理页面 -->
<!-- art-full-height 自动计算出页面剩余高度 -->
<!-- art-table-card 一个符合系统样式的 class，同时自动撑满剩余高度 -->
<!-- 更多 useTable 使用示例请移步至 功能示例 下面的高级表格示例或者查看官方文档 -->
<!-- useTable 文档：https://www.artd.pro/docs/zh/guide/hooks/use-table.html -->
<template>
  <div class="product-page art-full-height">
    <!-- 搜索栏 -->
    <ProductSearch
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></ProductSearch>

    <ElCard class="art-table-card">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton @click="goToForm('add')" v-ripple>新增产品</ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import { fetchGetProductList, fetchDeleteProduct } from '@/api/trade-manage'
  import ProductSearch from './modules/product-search.vue'
  import { ElTag, ElMessageBox, ElMessage, ElImage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { h } from 'vue'

  defineOptions({ name: 'Product' })

  const router = useRouter()

  type ProductListItem = Api.Trade.ProductListItem

  // 选中行
  const selectedRows = ref<ProductListItem[]>([])

  // 搜索表单
  const searchForm = ref({
    keyword: undefined,
    type: undefined,
    grade: undefined,
    material: undefined
  })

  // 产品类型配置
  const PRODUCT_TYPE_CONFIG: Record<string, { type: string; text: string }> = {
    切割片: { type: 'primary', text: '切割片' },
    百叶片: { type: 'success', text: '百叶片' },
    磨光片: { type: 'warning', text: '磨光片' },
    其他: { type: 'info', text: '其他' }
  }

  // 产品等级配置
  const PRODUCT_GRADE_CONFIG: Record<string, { type: string; text: string }> = {
    'A 级': { type: 'success', text: 'A 级' },
    'B 级': { type: 'primary', text: 'B 级' },
    'C 级': { type: 'warning', text: 'C 级' }
  }

  /**
   * 获取产品类型配置
   */
  const getProductTypeConfig = (type: string) => {
    return PRODUCT_TYPE_CONFIG[type] || { type: 'info', text: type }
  }

  /**
   * 获取产品等级配置
   */
  const getProductGradeConfig = (grade: string) => {
    return PRODUCT_GRADE_CONFIG[grade] || { type: 'info', text: grade }
  }

  /**
   * 格式化价格
   */
  const formatPrice = (price: number, currency: string = 'USD') => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      CNY: '¥',
      GBP: '£'
    }
    const symbol = symbols[currency] || currency
    return `${symbol}${price.toFixed(2)}`
  }

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    getData,
    replaceSearchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData,
    refreshRemove
  } = useTable({
    core: {
      apiFn: fetchGetProductList,
      apiParams: {
        current: 1,
        size: 20,
        ...searchForm.value
      },
      columnsFactory: () => {
        return [
          { type: 'selection', width: 50 },
          { type: 'index', width: 60, label: '序号' },
          {
            prop: 'mainImage',
            label: '产品图片',
            width: 110,
            formatter: (row: ProductListItem) => {
              return h('div', { class: 'flex items-center gap-2' }, [
                row.mainImage
                  ? h(ElImage, {
                      src: row.mainImage,
                      class: 'w-12 h-12 rounded object-cover',
                      fit: 'cover'
                    })
                  : h('div', { class: 'w-12 h-12 bg-gray-100 rounded flex-c' }, '无图'),
                row.imageCount
                  ? h('span', { class: 'text-xs text-g-600' }, `(${row.imageCount})`)
                  : null
              ])
            }
          },
          { prop: 'name', label: '产品名称', minWidth: 180, showOverflowTooltip: true },
          { prop: 'spec', label: '规格型号', width: 140, showOverflowTooltip: true },
          {
            prop: 'type',
            label: '产品类型',
            width: 95,
            formatter: (row: ProductListItem) => {
              const config = getProductTypeConfig(row.type)
              return h(ElTag, { type: config.type as any, size: 'small' }, () => config.text)
            }
          },
          {
            prop: 'grade',
            label: '产品等级',
            width: 95,
            formatter: (row: ProductListItem) => {
              const config = getProductGradeConfig(row.grade)
              return h(ElTag, { type: config.type as any, size: 'small' }, () => config.text)
            }
          },
          { prop: 'material', label: '材质', minWidth: 120, showOverflowTooltip: true },
          {
            prop: 'salePrice',
            label: '销售价',
            width: 110,
            align: 'right',
            formatter: (row: ProductListItem) =>
              h(
                'span',
                { class: 'font-medium text-primary' },
                formatPrice(row.salePrice, row.currency)
              )
          },
          {
            prop: 'moq',
            label: 'MOQ',
            width: 85,
            align: 'center',
            formatter: (row: ProductListItem) => h('span', {}, row.moq || '-')
          },
          {
            prop: 'cartonQuantity',
            label: '箱装数量',
            width: 95,
            align: 'center',
            formatter: (row: ProductListItem) => h('span', {}, row.cartonQuantity || '-')
          },
          {
            prop: 'operation',
            label: '操作',
            width: 180,
            fixed: 'right',
            align: 'left',
            formatter: (row: ProductListItem) =>
              h('div', [
                h(ArtButtonTable, {
                  type: 'view',
                  onClick: () => showDetail(row)
                }),
                h(ArtButtonTable, {
                  type: 'edit',
                  onClick: () => goToForm('edit', row)
                }),
                h(ArtButtonTable, {
                  type: 'delete',
                  onClick: () => deleteProduct(row)
                })
              ])
          }
        ]
      }
    }
  })

  /**
   * 搜索处理
   */
  const handleSearch = (params: Api.Trade.ProductSearchParams) => {
    replaceSearchParams(params)
    getData()
  }

  /**
   * 跳转到表单页面
   */
  const goToForm = (type: 'add' | 'edit', row?: ProductListItem): void => {
    if (type === 'edit' && row) {
      router.push(`/trade/product/form/${row.id}`)
    } else {
      router.push('/trade/product/form')
    }
  }

  /**
   * 显示产品详情
   */
  const showDetail = (row: ProductListItem): void => {
    router.push(`/trade/product/detail/${row.id}`)
  }

  /**
   * 删除产品
   */
  const deleteProduct = (row: ProductListItem): void => {
    ElMessageBox.confirm(`确定要删除产品 "${row.name}" 吗？`, '删除产品', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        await fetchDeleteProduct(row.id)
        ElMessage.success('删除成功')
        refreshRemove()
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    })
  }

  /**
   * 处理表格行选择变化
   */
  const handleSelectionChange = (selection: ProductListItem[]): void => {
    selectedRows.value = selection
    console.log('选中行数据:', selectedRows.value)
  }

  // 监听页面激活事件（keepAlive 场景下从其他页面返回时刷新数据）
  onActivated(() => {
    // 从表单页返回时刷新数据
    refreshData()
  })
</script>
