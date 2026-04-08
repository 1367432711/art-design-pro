<!-- 报价管理页面 -->
<template>
  <div class="quotation-page art-full-height">
    <!-- 搜索栏 -->
    <QuotationSearch
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></QuotationSearch>

    <ElCard class="art-table-card">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton type="primary" @click="goToForm('add')" v-ripple>新增报价</ElButton>
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
  import { fetchGetQuotationList, fetchDeleteQuotation } from '@/api/trade-manage'
  import QuotationSearch from './modules/quotation-search.vue'
  import { ElTag, ElMessageBox, ElMessage, ElLink } from 'element-plus'
  import { QUOTATION_STATUS_CONFIG } from '@/mock/temp/quotationList'
  import { useRouter } from 'vue-router'
  import { h } from 'vue'

  defineOptions({ name: 'Quotation' })

  const router = useRouter()

  type QuotationListItem = Api.Trade.QuotationListItem

  // 选中行
  const selectedRows = ref<QuotationListItem[]>([])

  // 搜索表单
  const searchForm = ref({
    customerName: undefined,
    quotationNo: undefined,
    productName: undefined,
    status: undefined,
    currency: undefined
  })

  // 获取状态配置
  const getStatusConfig = (status: string) => {
    return (
      QUOTATION_STATUS_CONFIG[status as keyof typeof QUOTATION_STATUS_CONFIG] || {
        type: 'info' as const,
        text: '未知'
      }
    )
  }

  // 格式化金额
  const formatAmount = (amount: number, currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      CNY: '¥',
      GBP: '£',
      JPY: '¥'
    }
    const symbol = symbols[currency] || currency
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // 获取产品名称（第一个产品）
  const getProductName = (row: QuotationListItem) => {
    if (!row.products || row.products.length === 0) return '-'
    const firstProduct = row.products[0] as Api.Trade.QuotationProduct
    // 使用第一个 variant 的 sku 作为产品名称
    const productName = firstProduct.variants?.[0]?.sku || firstProduct.selectedProductId || '产品'
    return productName + (row.products.length > 1 ? ` 等${row.products.length}个产品` : '')
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
      apiFn: fetchGetQuotationList,
      apiParams: {
        current: 1,
        size: 10,
        ...searchForm.value
      },
      columnsFactory: () => {
        return [
          { type: 'selection' },
          {
            prop: 'quotationNo',
            label: '报价单号',
            width: 150,
            formatter: (row: QuotationListItem) =>
              h(ElLink, { type: 'primary', underline: false }, () => row.quotationNo)
          },
          {
            prop: 'customerName',
            label: '客户名称',
            width: 180,
            formatter: (row: QuotationListItem) =>
              h('span', { class: 'font-medium' }, row.customerName)
          },
          {
            prop: 'products',
            label: '产品名称',
            minWidth: 150,
            formatter: (row: QuotationListItem) => h('span', {}, getProductName(row))
          },
          {
            prop: 'currency',
            label: '币种',
            width: 80,
            formatter: (row: QuotationListItem) => h('span', {}, row.currency || 'USD')
          },
          {
            prop: 'costSummary.subtotal',
            label: '产品总计',
            width: 120,
            formatter: (row: QuotationListItem) =>
              h(
                'span',
                { class: 'text-g-500' },
                formatAmount(row.costSummary?.subtotal || 0, row.currency)
              )
          },
          {
            prop: 'costSummary.grandTotal',
            label: '总计金额',
            width: 130,
            formatter: (row: QuotationListItem) =>
              h(
                'span',
                { class: 'font-medium text-primary' },
                formatAmount(row.costSummary?.grandTotal || 0, row.currency)
              )
          },
          { prop: 'tradeTerm', label: '贸易条款', width: 120 },
          {
            prop: 'status',
            label: '状态',
            width: 100,
            formatter: (row: QuotationListItem) => {
              const statusConfig = getStatusConfig(row.status)
              return h(ElTag, { type: statusConfig.type, size: 'small' }, () => statusConfig.text)
            }
          },
          {
            prop: 'quotationDate',
            label: '报价日期',
            width: 110,
            sortable: true
          },
          {
            prop: 'operation',
            label: '操作',
            width: 180,
            fixed: 'right',
            formatter: (row: QuotationListItem) =>
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
                  onClick: () => deleteQuotation(row)
                })
              ])
          }
        ]
      }
    }
  })

  // 搜索处理
  const handleSearch = (params: Api.Trade.QuotationSearchParams) => {
    replaceSearchParams(params)
    getData()
  }

  // 跳转到表单页
  const goToForm = (type: 'add' | 'edit', row?: QuotationListItem): void => {
    if (type === 'edit' && row) {
      router.push(`/trade/quotation/form/${row.id}`)
    } else {
      router.push('/trade/quotation/form')
    }
  }

  // 显示报价详情
  const showDetail = (row: QuotationListItem): void => {
    router.push(`/trade/quotation/detail/${row.id}`)
  }

  // 删除报价
  const deleteQuotation = (row: QuotationListItem): void => {
    ElMessageBox.confirm(`确定要删除报价单 ${row.quotationNo} 吗？`, '删除报价', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        await fetchDeleteQuotation(row.id)
        ElMessage.success('删除成功')
        refreshRemove()
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    })
  }

  // 处理选中行变化
  const handleSelectionChange = (selection: QuotationListItem[]): void => {
    selectedRows.value = selection
  }

  // 监听页面激活事件（keepAlive 场景）
  onActivated(() => {
    refreshData()
  })
</script>
