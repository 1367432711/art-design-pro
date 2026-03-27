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
        <ElTag :type="getStatusType(customerData.status)">
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

    <!-- 标签页切换 -->
    <ElCard class="art-card mt-3">
      <ElTabs v-model="activeTab" class="detail-tabs">
        <!-- 报价单 -->
        <ElTabPane label="报价单" name="quotation">
          <div class="tab-actions">
            <ElButton type="primary" @click="handleAddQuotation">
              <Icon icon="ri:add-line" class="mr-1" />
              新建报价
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
          <div class="tab-actions">
            <ElButton type="primary" @click="handleAddFollowup">
              <Icon icon="ri:add-line" class="mr-1" />
              添加跟进
            </ElButton>
          </div>
          <ArtTable
            :loading="followupLoading"
            :data="followupList"
            :columns="followupColumns"
            :pagination="followupPagination"
            @pagination:size-change="handleFollowupSizeChange"
            @pagination:current-change="handleFollowupCurrentChange"
          />
        </ElTabPane>

        <!-- 订单 -->
        <ElTabPane label="订单" name="order">
          <div class="tab-actions">
            <ElButton type="primary" @click="handleCreateOrder">
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

    <!-- 添加跟进弹窗 -->
    <FollowupDialog
      v-model:visible="followupDialogVisible"
      :type="followupDialogType"
      :customer-id="customerData.id"
      :customer-name="customerData.customerName"
      :followup-data="currentFollowupData"
      @submit="handleFollowupDialogSubmit"
    />
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { useRouter, useRoute } from 'vue-router'
  import { h } from 'vue'
  import { fetchGetCustomerDetail, fetchDeleteQuotation } from '@/api/trade-manage'
  import CustomerDialog from './modules/customer-dialog.vue'
  import FollowupDialog from './modules/followup-dialog.vue'
  import { QUOTATION_STATUS_CONFIG } from '@/mock/temp/quotationList'
  import {
    ElMessageBox,
    ElMessage,
    ElTag,
    ElLink,
    ElEmpty,
    ElTabs,
    ElTabPane,
    ElButton
  } from 'element-plus'
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

  // 跟进记录弹窗
  const followupDialogVisible = ref(false)
  const followupDialogType = ref<'add' | 'edit'>('add')
  const currentFollowupData = ref<Partial<Api.Trade.FollowupListItem>>({})

  // 跟进记录列表
  const followupList = ref<Api.Trade.FollowupListItem[]>([])
  const followupLoading = ref(false)
  const followupPagination = reactive({
    current: 1,
    size: 10,
    total: 0
  })

  // 跟进类型配置
  const FOLLOWUP_TYPE_CONFIG = {
    phone: { text: '电话跟进', color: '#409EFF' },
    email: { text: '邮件跟进', color: '#67C23A' },
    wechat: { text: '微信沟通', color: '#07C160' },
    whatsapp: { text: 'WhatsApp 沟通', color: '#25D366' },
    sample: { text: '样品寄送', color: '#E6A23C' },
    contract: { text: '合同签订', color: '#F56C6C' },
    other: { text: '其他', color: '#909399' }
  } as const

  // 获取跟进类型文本和颜色
  const getFollowupTypeConfig = (type: string | undefined) => {
    if (!type) return { text: '未知', color: '#909399' }
    const config = FOLLOWUP_TYPE_CONFIG[type as keyof typeof FOLLOWUP_TYPE_CONFIG]
    return config || { text: '未知', color: '#909399' }
  }

  // 跟进表格列配置
  const followupColumns = computed(() => [
    {
      prop: 'followupType',
      label: '跟进类型',
      width: 120,
      align: 'center',
      formatter: (row: Api.Trade.FollowupListItem) => {
        const config = getFollowupTypeConfig(row.followupType)
        return h(
          ElTag,
          {
            type: 'info' as const,
            size: 'small',
            style: { backgroundColor: config.color, borderColor: config.color }
          },
          () => config.text
        )
      }
    },
    { prop: 'followupTime', label: '跟进时间', width: 160, align: 'center', sortable: true },
    { prop: 'content', label: '跟进内容', minWidth: 300, showOverflowTooltip: true },
    { prop: 'nextPlan', label: '下一步计划', minWidth: 200, showOverflowTooltip: true },
    {
      prop: 'operation',
      label: '操作',
      width: 150,
      fixed: 'right' as const,
      align: 'center',
      formatter: (row: Api.Trade.FollowupListItem) =>
        h('div', [
          h(ArtButtonTable, {
            type: 'edit',
            onClick: () => handleEditFollowup(row)
          }),
          h(ArtButtonTable, {
            type: 'delete',
            onClick: () => handleDeleteFollowup(row)
          })
        ])
    }
  ])

  // 报价表格列配置
  const quotationColumns = computed(() => [
    {
      prop: 'quotationNo',
      label: '报价单号',
      minWidth: 140,
      formatter: (row: QuotationListItem) =>
        h(
          ElLink,
          { type: 'primary', underline: false, onClick: () => handleViewQuotation(row) },
          () => row.quotationNo
        )
    },
    {
      prop: 'products',
      label: '产品数量',
      width: 160,
      align: 'center',
      formatter: (row: QuotationListItem) => h('span', {}, `${row.products?.length || 0} 个产品`)
    },
    {
      prop: 'tradeTerm',
      label: '贸易条款',
      width: 200,
      align: 'center'
    },
    {
      prop: 'costSummary.subtotal',
      label: '产品总计',
      width: 140,
      align: 'right',
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
      width: 140,
      align: 'right',
      formatter: (row: QuotationListItem) =>
        h(
          'span',
          { class: 'font-medium text-primary' },
          formatAmount(row.costSummary?.grandTotal || 0, row.currency)
        )
    },
    {
      prop: 'status',
      label: '状态',
      width: 120,
      align: 'center',
      formatter: (row: QuotationListItem) => {
        const statusType = getQuotationStatusType(row.status)
        const statusText = getQuotationStatusText(row.status)
        return h(ElTag, { type: statusType, size: 'small' }, () => statusText)
      }
    },
    { prop: 'quotationDate', label: '报价日期', width: 160, align: 'center', sortable: true },
    {
      prop: 'operation',
      label: '操作',
      width: 260,
      fixed: 'right' as const,
      align: 'center',
      formatter: (row: QuotationListItem) =>
        h('div', { style: 'display: flex; justify-content: center; gap: 8px;' }, [
          h(
            ElButton,
            {
              type: 'primary',
              size: 'small',
              onClick: () => handleEditQuotation(row)
            },
            () => [h(Icon, { icon: 'ri:edit-line' }), ' 编辑']
          ),
          h(
            ElButton,
            {
              type: 'danger',
              size: 'small',
              onClick: () => handleDeleteQuotation(row)
            },
            () => [h(Icon, { icon: 'ri:delete-bin-line' }), ' 删除']
          ),
          h(
            ElButton,
            {
              type: 'info',
              size: 'small',
              onClick: () => handleExportQuotation(row)
            },
            () => [h(Icon, { icon: 'ri:download-line' }), ' 导出']
          )
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
      // 使用模拟数据
      const { QUOTATION_LIST_DATA } = await import('@/mock/temp/quotationList')

      // 根据客户 ID 过滤报价数据
      const filteredData = QUOTATION_LIST_DATA.filter((item) => item.customerId === customerId)

      quotationList.value = filteredData as Api.Trade.QuotationListItem[]
      pagination.total = filteredData.length
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
    followupDialogType.value = 'add'
    currentFollowupData.value = {}
    followupDialogVisible.value = true
  }

  // 编辑跟进
  const handleEditFollowup = (row: Api.Trade.FollowupListItem) => {
    followupDialogType.value = 'edit'
    currentFollowupData.value = row
    followupDialogVisible.value = true
  }

  // 删除跟进
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteFollowup = (_row: Api.Trade.FollowupListItem) => {
    ElMessageBox.confirm('确定要删除这条跟进记录吗？', '删除跟进', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      ElMessage.success('删除成功')
      loadFollowupList()
    })
  }

  // 跟进记录弹窗提交
  const handleFollowupDialogSubmit = () => {
    followupDialogVisible.value = false
    loadFollowupList()
  }

  // 加载跟进记录列表
  const loadFollowupList = async () => {
    const customerId = route.params.id as string
    if (!customerId) return

    followupLoading.value = true
    try {
      // TODO: 调用获取跟进记录的 API
      // const res = await fetchGetCustomerFollowups(customerId, {
      //   current: followupPagination.current,
      //   size: followupPagination.size
      // })
      // followupList.value = res.data?.records || []
      // followupPagination.total = res.data?.total || 0

      // 模拟数据
      followupList.value = [
        {
          id: '1',
          customerId: customerId,
          customerName: customerData.value.customerName || '测试客户',
          followupType: 'phone',
          followupTime: '2026-03-25 10:30:00',
          content:
            '电话联系客户，询问产品样品测试情况。客户反馈样品质量良好，但希望价格能有更多优惠。',
          nextPlan: '准备报价方案，给予 3% 的折扣优惠',
          reminderTime: '2026-03-27 14:00:00',
          status: 'completed',
          createTime: '2026-03-25 10:30:00',
          updateBy: 'admin',
          updateTime: '2026-03-25 10:30:00'
        },
        {
          id: '2',
          customerId: customerId,
          customerName: customerData.value.customerName || '测试客户',
          followupType: 'email',
          followupTime: '2026-03-24 15:00:00',
          content: '发送产品目录和价格表到客户邮箱',
          nextPlan: '等待客户回复，跟进样品需求',
          status: 'completed',
          createTime: '2026-03-24 15:00:00',
          updateBy: 'admin',
          updateTime: '2026-03-24 15:00:00'
        },
        {
          id: '3',
          customerId: customerId,
          customerName: customerData.value.customerName || '测试客户',
          followupType: 'wechat',
          followupTime: '2026-03-22 09:15:00',
          content: '微信初次联系，客户表示对切割片产品有兴趣',
          nextPlan: '安排寄送样品',
          status: 'completed',
          createTime: '2026-03-22 09:15:00',
          updateBy: 'admin',
          updateTime: '2026-03-22 09:15:00'
        }
      ]
      followupPagination.total = followupList.value.length
    } catch (error) {
      console.error('加载跟进记录列表失败:', error)
    } finally {
      followupLoading.value = false
    }
  }

  // 跟进记录分页大小变化
  const handleFollowupSizeChange = (size: number) => {
    followupPagination.size = size
    followupPagination.current = 1
    loadFollowupList()
  }

  // 跟进记录当前页变化
  const handleFollowupCurrentChange = (current: number) => {
    followupPagination.current = current
    loadFollowupList()
  }

  // 创建订单
  const handleCreateOrder = () => {
    ElMessageBox.confirm(
      `确定要为客户 "${customerData.value.customerName}" 创建订单吗？`,
      '创建订单',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    ).then(() => {
      ElMessage.info('订单管理功能开发中，敬请期待...')
      // TODO: 跳转到订单创建页面或打开创建订单弹窗
      // router.push('/trade/order/create?customerId=' + customerData.value.id)
    })
  }

  // 导出报价单
  const handleExportQuotation = (row: Api.Trade.QuotationListItem) => {
    ElMessage.info(`导出报价单 ${row.quotationNo} 的 PDF 功能开发中...`)
    // TODO: 实现单个报价单 PDF 导出功能
  }

  // 编辑报价
  const handleEditQuotation = (row: Api.Trade.QuotationListItem) => {
    router.push(`/trade/quotation/form/${row.id}`)
  }

  // 查看报价详情
  const handleViewQuotation = (row: Api.Trade.QuotationListItem) => {
    router.push(`/trade/quotation/detail/${row.id}`)
  }

  // 删除报价
  const handleDeleteQuotation = async (row: Api.Trade.QuotationListItem) => {
    ElMessageBox.confirm(`确定要删除报价单 ${row.quotationNo} 吗？`, '删除报价', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        await fetchDeleteQuotation(row.id)
        ElMessage.success('删除成功')
        loadQuotationList()
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    })
  }

  // 客户弹窗提交
  const handleDialogSubmit = () => {
    dialogVisible.value = false
    loadCustomerDetail()
  }

  onMounted(() => {
    loadCustomerDetail()
    loadQuotationList()
    loadFollowupList()
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
      justify-content: flex-start;
      margin-bottom: 16px;
    }
  }
</style>
