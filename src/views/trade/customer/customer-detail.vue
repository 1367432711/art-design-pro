<!-- 客户详情页面 -->
<template>
  <div class="customer-detail-page">
    <!-- 头部操作区 -->
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <ElButton type="text" @click="handleBack">
          <Icon icon="ri:arrow-left-line" class="mr-1" />
          返回
        </ElButton>
        <h2 class="text-xl font-semibold">{{ customerData.customerName || '客户详情' }}</h2>
        <ElTag :type="getStatusType(customerData.status)" size="medium">
          {{ getStatusText(customerData.status) }}
        </ElTag>
      </div>
      <ElSpace>
        <ElButton @click="handleEdit">
          <Icon icon="ri:pencil-line" class="mr-1" />
          编辑客户
        </ElButton>
        <ElButton @click="handleDelete">
          <Icon icon="ri:delete-bin-line" class="mr-1" />
          删除客户
        </ElButton>
      </ElSpace>
    </div>

    <!-- 客户基本信息 -->
    <ElCard class="art-card">
      <template #header>
        <div class="card-header">
          <Icon icon="ri:user-business-line" class="mr-2" />
          <span>基本信息</span>
        </div>
      </template>
      <ElDescriptions :column="3" border v-if="customerData">
        <ElDescriptionsItem label="客户名称">
          {{ customerData.customerName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="客户来源">
          {{ customerData.source || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="跟进销售">
          {{ customerData.salesPerson || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系人">
          {{ customerData.contactPerson || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系电话">
          <ElLink :href="'tel:' + customerData.contactPhone" type="primary">
            {{ customerData.contactPhone || '-' }}
          </ElLink>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系邮箱">
          <ElLink :href="'mailto:' + customerData.contactEmail" type="primary">
            {{ customerData.contactEmail || '-' }}
          </ElLink>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="国家/地区">
          {{ customerData.country || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="主营产品">
          {{ customerData.products || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="客户状态">
          <ElTag :type="getStatusType(customerData.status)" size="small">
            {{ getStatusText(customerData.status) }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="详细地址" :span="3">
          {{ customerData.address || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="备注信息" :span="3">
          <div class="remarks-text">{{ customerData.remarks || '-' }}</div>
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>

    <!-- 快捷操作栏 -->
    <div class="quick-actions mt-3 flex items-center gap-2">
      <ElButton type="primary" @click="handleAddQuotation">
        <Icon icon="ri:add-line" class="mr-1" />
        新建报价
      </ElButton>
      <ElButton @click="handleAddFollowup">
        <Icon icon="ri:file-text-line" class="mr-1" />
        添加跟进
      </ElButton>
      <ElButton @click="handleCreateOrder">
        <Icon icon="ri:shopping-bag-3-line" class="mr-1" />
        创建订单
      </ElButton>
      <ElButton @click="handleExportPdf">
        <Icon icon="ri:file-pdf-line" class="mr-1" />
        导出 PDF
      </ElButton>
    </div>

    <!-- 标签页切换 -->
    <ElCard class="art-card mt-3">
      <ElTabs v-model="activeTab" class="detail-tabs">
        <!-- 报价单 -->
        <ElTabPane label="报价单" name="quotation">
          <div class="tab-actions mb-3">
            <ElButton type="primary" size="small" @click="handleAddQuotation">
              <Icon icon="ri:add-line" class="mr-1" />
              新增报价
            </ElButton>
          </div>
          <ArtTable
            :loading="loading"
            :data="quotationList"
            :columns="quotationColumns"
            :pagination="pagination"
            @pagination:size-change="handleSizeChange"
            @pagination:current-change="handleCurrentChange"
          >
          </ArtTable>
        </ElTabPane>

        <!-- 跟进记录 -->
        <ElTabPane label="跟进记录" name="followup">
          <div class="tab-actions mb-3">
            <ElButton type="primary" size="small" @click="handleAddFollowup">
              <Icon icon="ri:add-line" class="mr-1" />
              添加跟进
            </ElButton>
          </div>
          <ElEmpty description="暂无跟进记录" />
        </ElTabPane>

        <!-- 订单 -->
        <ElTabPane label="订单" name="order">
          <div class="tab-actions mb-3">
            <ElButton type="primary" size="small" @click="handleCreateOrder">
              <Icon icon="ri:add-line" class="mr-1" />
              创建订单
            </ElButton>
          </div>
          <ElEmpty description="暂无订单" />
        </ElTabPane>
      </ElTabs>
    </ElCard>

    <!-- 编辑客户弹窗 -->
    <CustomerDialog
      v-model:visible="dialogVisible"
      :type="dialogType"
      :customer-data="currentCustomerData"
      @submit="handleDialogSubmit"
    />

    <!-- 编辑报价弹窗 -->
    <QuotationDialog
      v-model:visible="quotationDialogVisible"
      :type="quotationDialogType"
      :quotation-data="currentQuotationData"
      @submit="handleQuotationDialogSubmit"
    />
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { useRouter, useRoute } from 'vue-router'
  import { h } from 'vue'
  import { fetchGetCustomerDetail, fetchGetCustomerQuotations } from '@/api/trade-manage'
  import CustomerDialog from './modules/customer-dialog.vue'
  import QuotationDialog from '../quotation/modules/quotation-dialog.vue'
  import { QUOTATION_STATUS_CONFIG } from '@/mock/temp/quotationList'
  import { ElMessageBox, ElMessage, ElTag, ElLink, ElEmpty, ElTabs, ElTabPane } from 'element-plus'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'

  defineOptions({ name: 'CustomerDetail' })

  const router = useRouter()
  const route = useRoute()

  type QuotationListItem = Api.Trade.QuotationListItem

  // 当前激活的标签页
  const activeTab = ref('quotation')

  // 客户状态配置
  const CUSTOMER_STATUS_CONFIG = {
    '1': { type: 'success' as const, text: '活跃' },
    '2': { type: 'warning' as const, text: '潜在' },
    '3': { type: 'info' as const, text: '流失' }
  } as const

  // 获取客户状态类型
  const getStatusType = (status: string | undefined) => {
    if (!status) return 'info'
    const config = CUSTOMER_STATUS_CONFIG[status as keyof typeof CUSTOMER_STATUS_CONFIG]
    return config?.type || 'info'
  }

  // 获取客户状态文本
  const getStatusText = (status: string | undefined) => {
    if (!status) return '未知'
    const config = CUSTOMER_STATUS_CONFIG[status as keyof typeof CUSTOMER_STATUS_CONFIG]
    return config?.text || '未知'
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

  // 获取报价状态类型
  const getQuotationStatusType = (status: string | undefined) => {
    if (!status) return 'info'
    const config = QUOTATION_STATUS_CONFIG[status as keyof typeof QUOTATION_STATUS_CONFIG]
    return config?.type || 'info'
  }

  // 获取报价状态文本
  const getQuotationStatusText = (status: string | undefined) => {
    if (!status) return '未知'
    const config = QUOTATION_STATUS_CONFIG[status as keyof typeof QUOTATION_STATUS_CONFIG]
    return config?.text || '未知'
  }

  // 客户数据
  const customerData = ref<Partial<Api.Trade.CustomerListItem>>({})

  // 报价列表
  const quotationList = ref<Api.Trade.QuotationListItem[]>([])
  const loading = ref(false)

  // 分页配置
  const pagination = reactive({
    current: 1,
    size: 10,
    total: 0
  })

  // 弹窗相关
  const dialogVisible = ref(false)
  const dialogType = ref<'add' | 'edit'>('edit')
  const currentCustomerData = ref<Partial<Api.Trade.CustomerListItem>>({})

  // 报价弹窗
  const quotationDialogVisible = ref(false)
  const quotationDialogType = ref<'add' | 'edit'>('add')
  const currentQuotationData = ref<Partial<Api.Trade.QuotationListItem>>({})

  // 报价表格列配置
  const quotationColumns = computed(() => [
    {
      prop: 'quotationNo',
      label: '报价单号',
      width: 150,
      formatter: (row: QuotationListItem) =>
        h(ElLink, { type: 'primary', underline: false }, () => row.quotationNo)
    },
    { prop: 'productName', label: '产品名称', minWidth: 150, showOverflowTooltip: true },
    { prop: 'specification', label: '规格型号', minWidth: 120, showOverflowTooltip: true },
    {
      prop: 'quantity',
      label: '数量',
      width: 100,
      align: 'center',
      formatter: (row: QuotationListItem) => h('span', {}, `${row.quantity} ${row.unit}`)
    },
    {
      prop: 'unitPrice',
      label: '单价',
      width: 120,
      align: 'right',
      formatter: (row: QuotationListItem) =>
        h('span', { class: 'text-g-500' }, formatAmount(row.unitPrice, row.currency))
    },
    {
      prop: 'totalPrice',
      label: '总金额',
      width: 130,
      align: 'right',
      formatter: (row: QuotationListItem) =>
        h('span', { class: 'font-medium text-primary' }, formatAmount(row.totalPrice, row.currency))
    },
    {
      prop: 'status',
      label: '状态',
      width: 90,
      align: 'center',
      formatter: (row: QuotationListItem) => {
        const statusType = getQuotationStatusType(row.status)
        const statusText = getQuotationStatusText(row.status)
        return h(ElTag, { type: statusType, size: 'small' }, () => statusText)
      }
    },
    { prop: 'quotationDate', label: '报价日期', width: 110, align: 'center', sortable: true },
    {
      prop: 'operation',
      label: '操作',
      width: 120,
      fixed: 'right',
      align: 'center',
      formatter: (row: QuotationListItem) =>
        h('div', [
          h(ArtButtonTable, {
            type: 'edit',
            onClick: () => handleEditQuotation(row)
          }),
          h(ArtButtonTable, {
            type: 'delete',
            onClick: () => handleDeleteQuotation(row)
          })
        ])
    }
  ])

  // 加载客户详情
  const loadCustomerDetail = async () => {
    const customerId = route.params.id as string
    if (!customerId) return

    try {
      const res = await fetchGetCustomerDetail(customerId)
      customerData.value = (res as any).data || {}
    } catch (error) {
      console.error('加载客户详情失败:', error)
      ElMessage.error('加载客户详情失败')
    }
  }

  // 加载报价列表
  const loadQuotationList = async () => {
    const customerId = route.params.id as string
    if (!customerId) return

    loading.value = true
    try {
      const res = await fetchGetCustomerQuotations(customerId, {
        current: pagination.current,
        size: pagination.size
      })

      quotationList.value = res.data?.records || []
      pagination.total = res.data?.total || 0
    } catch (error) {
      console.error('加载报价列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 分页大小变化
  const handleSizeChange = (size: number) => {
    pagination.size = size
    pagination.current = 1
    loadQuotationList()
  }

  // 当前页变化
  const handleCurrentChange = (current: number) => {
    pagination.current = current
    loadQuotationList()
  }

  // 返回客户列表
  const handleBack = () => {
    router.push('/trade/customer')
  }

  // 编辑客户
  const handleEdit = () => {
    dialogType.value = 'edit'
    currentCustomerData.value = customerData.value
    dialogVisible.value = true
  }

  // 删除客户
  const handleDelete = () => {
    ElMessageBox.confirm(`确定要删除客户 "${customerData.value.customerName}" 吗？`, '删除客户', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      ElMessage.success('删除成功')
      handleBack()
    })
  }

  // 新建报价
  const handleAddQuotation = () => {
    router.push(
      `/trade/quotation/form?customerId=${customerData.value.id}&customerName=${encodeURIComponent(customerData.value.customerName || '')}`
    )
  }

  // 添加跟进
  const handleAddFollowup = () => {
    ElMessage.info('跟进记录功能待开发')
  }

  // 创建订单
  const handleCreateOrder = () => {
    ElMessage.info('订单管理功能待开发')
  }

  // 导出 PDF
  const handleExportPdf = () => {
    ElMessage.info('PDF 导出功能待开发')
  }

  // 编辑报价
  const handleEditQuotation = (row: Api.Trade.QuotationListItem) => {
    quotationDialogType.value = 'edit'
    currentQuotationData.value = row
    quotationDialogVisible.value = true
  }

  // 删除报价
  const handleDeleteQuotation = (row: Api.Trade.QuotationListItem) => {
    ElMessageBox.confirm(`确定要删除报价单 ${row.quotationNo} 吗？`, '删除报价', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      ElMessage.success('删除成功')
      loadQuotationList()
    })
  }

  // 客户弹窗提交
  const handleDialogSubmit = () => {
    dialogVisible.value = false
    loadCustomerDetail()
  }

  // 报价弹窗提交
  const handleQuotationDialogSubmit = () => {
    quotationDialogVisible.value = false
    loadQuotationList()
  }

  onMounted(() => {
    loadCustomerDetail()
    loadQuotationList()
  })
</script>

<style lang="scss" scoped>
  .customer-detail-page {
    padding-bottom: 20px;

    .card-header {
      display: flex;
      align-items: center;
      font-size: 15px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .remarks-text {
      max-width: 600px;
      line-height: 1.6;
      color: var(--el-text-color-regular);
    }

    .quick-actions {
      padding: 12px 0;
    }

    .detail-tabs {
      :deep(.el-tabs__header) {
        margin-bottom: 16px;
      }

      :deep(.el-tabs__content) {
        padding: 0;
      }
    }

    .tab-actions {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
