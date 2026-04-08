<!-- PL 管理页面 -->
<template>
  <div class="pl-page art-full-height">
    <!-- 搜索栏 -->
    <PLSearch v-model="searchForm" @search="handleSearch" @reset="resetSearchParams"></PLSearch>

    <ElCard class="art-table-card">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple>新增 PL</ElButton>
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

      <!-- PL 弹窗 -->
      <PLDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :pl-data="currentPLData || {}"
        @submit="handleDialogSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import { fetchGetPLList, fetchDeletePL } from '@/api/trade-manage'
  import PLSearch from './modules/pl-search.vue'
  import PLDialog from './modules/pl-dialog.vue'
  import { ElTag, ElMessageBox, ElMessage } from 'element-plus'
  import { DialogType } from '@/types'
  import { useRouter } from 'vue-router'

  defineOptions({ name: 'PL' })

  const router = useRouter()

  type PLListItem = Api.Trade.PLListItem

  // 弹窗相关
  const dialogType = ref<DialogType>('add')
  const dialogVisible = ref(false)

  // 选中行
  const selectedRows = ref<PLListItem[]>([])

  // 当前查看的 PL 详情
  const currentPLData = ref<Partial<PLListItem> | null>(null)

  // 搜索表单
  const searchForm = ref<Api.Trade.PLSearchParams>({
    current: 1,
    size: 20,
    plNo: undefined,
    invoiceNo: undefined,
    customerName: undefined,
    status: undefined,
    startTime: undefined,
    endTime: undefined
  })

  // PL 状态配置
  const PL_STATUS_CONFIG = {
    待发货: { type: 'warning' as const, text: '待发货' },
    部分发货: { type: 'primary' as const, text: '部分发货' },
    已发货: { type: 'success' as const, text: '已发货' }
  } as const

  /**
   * 获取 PL 状态配置
   */
  const getPLStatusConfig = (status: string) => {
    return (
      PL_STATUS_CONFIG[status as keyof typeof PL_STATUS_CONFIG] || {
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
      apiFn: fetchGetPLList,
      apiParams: {
        ...searchForm.value,
        current: 1,
        size: 20
      },
      columnsFactory: () => {
        return [
          { type: 'selection' },
          { type: 'index', width: 60, label: '序号' },
          {
            prop: 'plNo',
            label: 'PL 编号',
            width: 160,
            formatter: (row: PLListItem) => {
              return h('div', { class: 'font-medium' }, row.plNo)
            }
          },
          {
            prop: 'invoiceNo',
            label: '关联 PI',
            width: 160,
            formatter: (row: PLListItem) => h('span', { class: 'text-g-600' }, row.invoiceNo)
          },
          {
            prop: 'plDate',
            label: 'PL 日期',
            width: 120,
            sortable: true
          },
          {
            prop: 'customerName',
            label: '客户名称',
            width: 180,
            formatter: (row: PLListItem) => h('span', { class: 'text-g-600' }, row.customerName)
          },
          {
            prop: 'totalQuantity',
            label: '总数量',
            width: 100,
            formatter: (row: PLListItem) => h('span', { class: 'text-g-600' }, row.totalQuantity)
          },
          {
            prop: 'totalCartons',
            label: '总箱数',
            width: 100,
            formatter: (row: PLListItem) => h('span', { class: 'text-g-600' }, row.totalCartons)
          },
          {
            prop: 'totalGW',
            label: '总毛重',
            width: 100,
            formatter: (row: PLListItem) => h('span', { class: 'text-g-600' }, `${row.totalGW} kg`)
          },
          {
            prop: 'status',
            label: '状态',
            width: 100,
            formatter: (row: PLListItem) => {
              const statusConfig = getPLStatusConfig(row.status)
              return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
            }
          },
          {
            prop: 'shippedQuantity',
            label: '已发货',
            width: 100,
            formatter: (row: PLListItem) => h('span', { class: 'text-g-600' }, row.shippedQuantity)
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
            formatter: (row: PLListItem) =>
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
                  onClick: () => deletePL(row)
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
  const handleSearch = (params: Api.Trade.PLSearchParams) => {
    replaceSearchParams(params)
    getData()
  }

  /**
   * 显示 PL 弹窗
   */
  const showDialog = (type: DialogType, row?: PLListItem): void => {
    dialogType.value = type
    currentPLData.value = row || {}
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  /**
   * 显示 PL 详情
   */
  const showDetail = (row: PLListItem): void => {
    router.push(`/trade/pl/detail/${row.id}`)
  }

  /**
   * 删除 PL
   */
  const deletePL = (row: PLListItem): void => {
    ElMessageBox.confirm(`确定要删除该 PL 吗？`, '删除 PL', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(async () => {
      try {
        await fetchDeletePL(row.id)
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
    currentPLData.value = {}
    refreshCreate()
  }

  /**
   * 处理表格行选择变化
   */
  const handleSelectionChange = (selection: PLListItem[]): void => {
    selectedRows.value = selection
  }
</script>
