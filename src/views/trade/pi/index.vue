<!-- PI 管理页面 -->
<template>
  <div class="pi-page art-full-height">
    <!-- 搜索栏 -->
    <PISearch v-model="searchForm" @search="handleSearch" @reset="resetSearchParams"></PISearch>

    <ElCard class="art-table-card">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple>新增 PI</ElButton>
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

      <!-- PI 弹窗 -->
      <PIDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :pi-data="currentPIData || {}"
        @submit="handleDialogSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import { fetchGetPIList, fetchDeletePI } from '@/api/trade-manage'
  import PISearch from './modules/pi-search.vue'
  import PIDialog from './modules/pi-dialog.vue'
  import { ElTag, ElMessageBox, ElMessage } from 'element-plus'
  import { DialogType } from '@/types'
  import { useRouter } from 'vue-router'

  defineOptions({ name: 'PI' })

  const router = useRouter()

  type PIListItem = Api.Trade.PIListItem

  // 弹窗相关
  const dialogType = ref<DialogType>('add')
  const dialogVisible = ref(false)

  // 选中行
  const selectedRows = ref<PIListItem[]>([])

  // 当前查看的 PI 详情
  const currentPIData = ref<Partial<PIListItem> | null>(null)

  // 搜索表单
  const searchForm = ref<Api.Trade.PISearchParams>({
    current: 1,
    size: 20,
    invoiceNo: undefined,
    customerName: undefined,
    status: undefined,
    startTime: undefined,
    endTime: undefined
  })

  // PI 状态配置
  const PI_STATUS_CONFIG = {
    待付款: { type: 'warning' as const, text: '待付款' },
    部分付款: { type: 'primary' as const, text: '部分付款' },
    已付款: { type: 'success' as const, text: '已付款' },
    已取消: { type: 'info' as const, text: '已取消' }
  } as const

  /**
   * 获取 PI 状态配置
   */
  const getPIStatusConfig = (status: string) => {
    return (
      PI_STATUS_CONFIG[status as keyof typeof PI_STATUS_CONFIG] || {
        type: 'info' as const,
        text: '未知'
      }
    )
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
    // 核心配置
    core: {
      apiFn: fetchGetPIList,
      apiParams: {
        ...searchForm.value,
        current: 1,
        size: 20
      },
      columnsFactory: () => {
        return [
          { type: 'selection' }, // 勾选列
          { type: 'index', width: 60, label: '序号' }, // 序号
          {
            prop: 'invoiceNo',
            label: '发票号',
            width: 160,
            formatter: (row: PIListItem) => {
              return h('div', { class: 'font-medium' }, row.invoiceNo)
            }
          },
          {
            prop: 'piDate',
            label: 'PI 日期',
            width: 120,
            sortable: true
          },
          {
            prop: 'customerName',
            label: '客户名称',
            width: 180,
            formatter: (row: PIListItem) => h('span', { class: 'text-g-600' }, row.customerName)
          },
          {
            prop: 'totalAmount',
            label: '总金额',
            width: 120,
            formatter: (row: PIListItem) =>
              h(
                'span',
                { class: 'text-g-600 font-medium' },
                `${row.currency} ${row.totalAmount?.toFixed(2)}`
              )
          },
          {
            prop: 'depositAmount',
            label: '定金',
            width: 100,
            formatter: (row: PIListItem) =>
              h('span', { class: 'text-g-600' }, `${row.depositAmount?.toFixed(2)}`)
          },
          {
            prop: 'status',
            label: '状态',
            width: 100,
            formatter: (row: PIListItem) => {
              const statusConfig = getPIStatusConfig(row.status)
              return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
            }
          },
          {
            prop: 'paidAmount',
            label: '已付金额',
            width: 100,
            formatter: (row: PIListItem) =>
              h('span', { class: 'text-g-600' }, row.paidAmount?.toFixed(2) || '0.00')
          },
          {
            prop: 'createTime',
            label: '创建日期',
            width: 160,
            sortable: true
          },
          {
            prop: 'operation',
            label: '操作',
            width: 200,
            fixed: 'right',
            formatter: (row: PIListItem) =>
              h('div', [
                h(ArtButtonTable, {
                  type: 'view',
                  onClick: () => showDetail(row)
                }),
                h(ArtButtonTable, {
                  type: 'edit',
                  onClick: () => showDialog('edit', row)
                }),
                h(ArtButtonTable, {
                  type: 'delete',
                  onClick: () => deletePI(row)
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
  const handleSearch = (params: Api.Trade.PISearchParams) => {
    replaceSearchParams(params)
    getData()
  }

  /**
   * 显示 PI 弹窗
   */
  const showDialog = (type: DialogType, row?: PIListItem): void => {
    dialogType.value = type
    currentPIData.value = row || {}
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  /**
   * 显示 PI 详情
   */
  const showDetail = (row: PIListItem): void => {
    router.push(`/trade/pi/detail/${row.id}`)
  }

  /**
   * 删除 PI
   */
  const deletePI = (row: PIListItem): void => {
    ElMessageBox.confirm(`确定要删除该 PI 吗？`, '删除 PI', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(async () => {
      try {
        await fetchDeletePI(row.id)
        ElMessage.success('删除成功')
        refreshRemove()
      } catch {
        ElMessage.error('删除失败')
      }
    })
  }

  /**
   * 处理弹窗提交事件
   */
  const handleDialogSubmit = async () => {
    dialogVisible.value = false
    currentPIData.value = {}
    refreshCreate()
  }

  /**
   * 处理表格行选择变化
   */
  const handleSelectionChange = (selection: PIListItem[]): void => {
    selectedRows.value = selection
  }
</script>
