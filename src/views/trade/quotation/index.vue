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
            <ElButton type="primary" @click="showDialog('add')" v-ripple>新增报价</ElButton>
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

      <!-- 报价弹窗 -->
      <QuotationDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :quotation-data="currentQuotationData"
        @submit="handleDialogSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import { fetchGetQuotationList } from '@/api/trade-manage'
  import QuotationSearch from './modules/quotation-search.vue'
  import QuotationDialog from './modules/quotation-dialog.vue'
  import { ElTag, ElMessageBox, ElLink } from 'element-plus'
  import { DialogType } from '@/types'
  import { QUOTATION_STATUS_CONFIG } from '@/mock/temp/quotationList'
  import { useRoute, useRouter } from 'vue-router'

  defineOptions({ name: 'Quotation' })

  const route = useRoute()
  const router = useRouter()

  type QuotationListItem = Api.Trade.QuotationListItem

  // 弹窗相关
  const dialogType = ref<DialogType>('add')
  const dialogVisible = ref(false)
  const currentQuotationData = ref<Partial<QuotationListItem>>({})

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
    refreshCreate,
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
            prop: 'productName',
            label: '产品名称',
            minWidth: 150
          },
          {
            prop: 'specification',
            label: '规格型号',
            minWidth: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'quantity',
            label: '数量',
            width: 100,
            formatter: (row: QuotationListItem) => h('span', {}, `${row.quantity} ${row.unit}`)
          },
          {
            prop: 'unitPrice',
            label: '单价',
            width: 120,
            formatter: (row: QuotationListItem) =>
              h('span', { class: 'text-g-500' }, formatAmount(row.unitPrice, row.currency))
          },
          {
            prop: 'totalPrice',
            label: '总金额',
            width: 130,
            formatter: (row: QuotationListItem) =>
              h(
                'span',
                { class: 'font-medium text-primary' },
                formatAmount(row.totalPrice, row.currency)
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
            width: 150,
            fixed: 'right',
            formatter: (row: QuotationListItem) =>
              h('div', [
                h(ArtButtonTable, {
                  type: 'edit',
                  onClick: () => showDialog('edit', row)
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

  // 显示弹窗
  const showDialog = (type: DialogType, row?: QuotationListItem): void => {
    dialogType.value = type
    currentQuotationData.value = row || {}
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  // 删除报价
  const deleteQuotation = (row: QuotationListItem): void => {
    ElMessageBox.confirm(`确定要删除报价单 ${row.quotationNo} 吗？`, '删除报价', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      ElMessage.success('删除成功')
      refreshRemove()
    })
  }

  // 处理弹窗提交
  const handleDialogSubmit = async () => {
    try {
      dialogVisible.value = false
      currentQuotationData.value = {}
      refreshCreate()
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  // 处理选中行变化
  const handleSelectionChange = (selection: QuotationListItem[]): void => {
    selectedRows.value = selection
  }

  // 监听路由参数，处理从客户详情页跳转过来的情况
  watch(
    () => route.query,
    (query) => {
      if (query.action === 'add' && query.customerId && query.customerName) {
        // 新增报价，预填充客户信息
        currentQuotationData.value = {
          customerId: query.customerId as string,
          customerName: query.customerName as string
        }
        dialogType.value = 'add'
        dialogVisible.value = true
        // 清除路由参数
        router.replace({ query: {} })
      }
    },
    { immediate: true }
  )
</script>
