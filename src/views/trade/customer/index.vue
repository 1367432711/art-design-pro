<!-- 客户管理页面 -->
<!-- art-full-height 自动计算出页面剩余高度 -->
<!-- art-table-card 一个符合系统样式的 class，同时自动撑满剩余高度 -->
<!-- 更多 useTable 使用示例请移步至 功能示例 下面的高级表格示例或者查看官方文档 -->
<!-- useTable 文档：https://www.artd.pro/docs/zh/guide/hooks/use-table.html -->
<template>
  <div class="customer-page art-full-height">
    <!-- 搜索栏 -->
    <CustomerSearch
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></CustomerSearch>

    <ElCard class="art-table-card">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple>新增客户</ElButton>
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

      <!-- 客户弹窗 -->
      <CustomerDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :customer-data="currentCustomerData || {}"
        @submit="handleDialogSubmit"
      />

      <!-- 客户详情侧边栏 -->
      <CustomerDetail
        v-model:visible="detailVisible"
        :customer-data="currentCustomerData"
        @edit="handleEditFromDetail"
        @add-quotation="handleAddQuotation"
        @view-quotation="handleViewQuotation"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import { fetchGetCustomerList } from '@/api/trade-manage'
  import CustomerSearch from './modules/customer-search.vue'
  import CustomerDialog from './modules/customer-dialog.vue'
  import CustomerDetail from './modules/customer-detail.vue'
  import { ElTag, ElMessageBox } from 'element-plus'
  import { DialogType } from '@/types'
  import { useRouter } from 'vue-router'

  defineOptions({ name: 'Customer' })

  const router = useRouter()

  type CustomerListItem = Api.Trade.CustomerListItem

  // 弹窗相关
  const dialogType = ref<DialogType>('add')
  const dialogVisible = ref(false)

  // 详情侧边栏
  const detailVisible = ref(false)

  // 选中行
  const selectedRows = ref<CustomerListItem[]>([])

  // 当前查看的客户详情（弹窗和侧边栏共用）
  const currentCustomerData = ref<Partial<CustomerListItem> | null>(null)

  // 搜索表单
  const searchForm = ref({
    customerName: undefined,
    contactPerson: undefined,
    contactPhone: undefined,
    contactEmail: undefined,
    country: undefined,
    status: undefined
  })

  // 客户状态配置
  const CUSTOMER_STATUS_CONFIG = {
    '1': { type: 'success' as const, text: '活跃' },
    '2': { type: 'warning' as const, text: '潜在' },
    '3': { type: 'info' as const, text: '流失' }
  } as const

  /**
   * 获取客户状态配置
   */
  const getCustomerStatusConfig = (status: string) => {
    return (
      CUSTOMER_STATUS_CONFIG[status as keyof typeof CUSTOMER_STATUS_CONFIG] || {
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
      apiFn: fetchGetCustomerList,
      apiParams: {
        current: 1,
        size: 20,
        ...searchForm.value
      },
      columnsFactory: () => {
        return [
          { type: 'selection' }, // 勾选列
          { type: 'index', width: 60, label: '序号' }, // 序号
          {
            prop: 'customerName',
            label: '客户名称',
            width: 200,
            formatter: (row: CustomerListItem) => {
              return h('div', { class: 'font-medium' }, row.customerName)
            }
          },
          { prop: 'contactPerson', label: '联系人', width: 120 },
          {
            prop: 'contactPhone',
            label: '联系电话',
            width: 130,
            formatter: (row: CustomerListItem) =>
              h('span', { class: 'text-g-500' }, row.contactPhone)
          },
          {
            prop: 'contactEmail',
            label: '联系邮箱',
            width: 180,
            formatter: (row: CustomerListItem) =>
              h('span', { class: 'text-g-500' }, row.contactEmail)
          },
          { prop: 'country', label: '国家', width: 120 },
          {
            prop: 'status',
            label: '状态',
            width: 100,
            formatter: (row: CustomerListItem) => {
              const statusConfig = getCustomerStatusConfig(row.status)
              return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
            }
          },
          { prop: 'products', label: '主要产品', minWidth: 150 },
          {
            prop: 'quotationCount',
            label: '报价数',
            width: 80,
            align: 'center',
            formatter: (row: CustomerListItem) =>
              h('span', { class: 'text-g-500' }, row.quotationCount || 0)
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
            fixed: 'right', // 固定列
            formatter: (row: CustomerListItem) =>
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
                  onClick: () => deleteCustomer(row)
                })
              ])
          }
        ]
      }
    }
  })

  /**
   * 搜索处理
   * @param params 参数
   */
  const handleSearch = (params: Api.Trade.CustomerSearchParams) => {
    replaceSearchParams(params)
    getData()
  }

  /**
   * 显示客户弹窗
   */
  const showDialog = (type: DialogType, row?: CustomerListItem): void => {
    console.log('打开弹窗:', { type, row })
    dialogType.value = type
    currentCustomerData.value = row || {}
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  /**
   * 显示客户详情侧边栏
   */
  const showDetail = (row: CustomerListItem): void => {
    currentCustomerData.value = row
    nextTick(() => {
      detailVisible.value = true
    })
  }

  /**
   * 从详情页编辑客户
   */
  const handleEditFromDetail = (customer: Partial<CustomerListItem>) => {
    currentCustomerData.value = customer
    detailVisible.value = false
    nextTick(() => {
      showDialog('edit', customer as CustomerListItem)
    })
  }

  /**
   * 新增报价
   */
  const handleAddQuotation = (customerId: string, customerName: string) => {
    // 关闭详情页，跳转到报价页面并打开新增弹窗
    detailVisible.value = false
    // 通过路由传递参数
    router.push({
      path: '/trade/quotation',
      query: { customerId, customerName, action: 'add' }
    })
  }

  /**
   * 查看报价详情
   */
  const handleViewQuotation = (quotation: Api.Trade.QuotationListItem) => {
    // 关闭详情页，跳转到报价页面并打开编辑弹窗
    detailVisible.value = false
    router.push({
      path: '/trade/quotation',
      query: { quotationId: quotation.id, action: 'view' }
    })
  }

  /**
   * 删除客户
   */
  const deleteCustomer = (row: CustomerListItem): void => {
    console.log('删除客户:', row)
    ElMessageBox.confirm(`确定要删除该客户吗？`, '删除客户', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      ElMessage.success('删除成功')
      refreshRemove()
    })
  }

  /**
   * 处理弹窗提交事件
   */
  const handleDialogSubmit = async () => {
    try {
      dialogVisible.value = false
      currentCustomerData.value = {}
      // 根据类型调用不同的 API
      if (dialogType.value === 'add') {
        // await fetchCreateCustomer(...)
      } else {
        // await fetchUpdateCustomer(...)
      }
      refreshCreate()
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  /**
   * 处理表格行选择变化
   */
  const handleSelectionChange = (selection: CustomerListItem[]): void => {
    selectedRows.value = selection
    console.log('选中行数据:', selectedRows.value)
  }
</script>
