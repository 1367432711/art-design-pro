<!-- 客户详情页面 -->
<template>
  <div class="customer-detail-page art-full-height">
    <!-- 返回头部 -->
    <ElCard class="header-card">
      <div class="header-content">
        <div class="header-left">
          <ElButton type="text" @click="handleBack">
            <Icon icon="ri:arrow-left-line" class="mr-1" />
            返回
          </ElButton>
          <div class="customer-title">
            <h2>{{ customerData.customerName || '客户详情' }}</h2>
            <ElTag :type="getStatusType(customerData.status)" size="large">
              {{ getStatusText(customerData.status) }}
            </ElTag>
          </div>
        </div>
        <div class="header-right">
          <ElSpace>
            <ElButton @click="handleEdit">
              <Icon icon="ri:pencil-line" class="mr-1" />
              编辑客户
            </ElButton>
            <ElButton type="primary" @click="handleAddQuotation">
              <Icon icon="ri:add-line" class="mr-1" />
              新增报价
            </ElButton>
          </ElSpace>
        </div>
      </div>
    </ElCard>

    <!-- 客户基本信息 -->
    <ElRow :gutter="20" class="mt-4">
      <ElCol :span="16">
        <ElCard class="info-card">
          <template #header>
            <div class="card-header">
              <Icon icon="ri:user-business-line" class="mr-2" />
              <span>基本信息</span>
            </div>
          </template>
          <ElDescriptions :column="2" border v-if="customerData">
            <ElDescriptionsItem label="客户名称">
              {{ customerData.customerName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="客户来源">
              {{ customerData.source || '-' }}
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
            <ElDescriptionsItem label="详细地址" :span="2">
              {{ customerData.address || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="主营产品" :span="2">
              {{ customerData.products || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="跟进销售">
              {{ customerData.salesPerson || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="备注信息" :span="2">
              <div class="remarks-text">{{ customerData.remarks || '-' }}</div>
            </ElDescriptionsItem>
          </ElDescriptions>
        </ElCard>
      </ElCol>

      <!-- 统计卡片 -->
      <ElCol :span="8">
        <ElCard class="stats-card">
          <template #header>
            <div class="card-header">
              <Icon icon="ri:bar-chart-box-line" class="mr-2" />
              <span>报价统计</span>
            </div>
          </template>
          <div class="stats-content">
            <div class="stat-item stat-total">
              <div class="stat-icon bg-primary">
                <Icon icon="ri:file-list-3-line" />
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ quotationStats.total }}</div>
                <div class="stat-label">总报价数</div>
              </div>
            </div>
            <div class="stat-item stat-pending">
              <div class="stat-icon bg-warning">
                <Icon icon="ri:time-line" />
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ quotationStats.pending }}</div>
                <div class="stat-label">待确认</div>
              </div>
            </div>
            <div class="stat-item stat-accepted">
              <div class="stat-icon bg-success">
                <Icon icon="ri:checkbox-circle-line" />
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ quotationStats.accepted }}</div>
                <div class="stat-label">已接受</div>
              </div>
            </div>
            <div class="stat-item stat-rejected">
              <div class="stat-icon bg-danger">
                <Icon icon="ri:close-circle-line" />
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ quotationStats.rejected }}</div>
                <div class="stat-label">已拒绝</div>
              </div>
            </div>
            <div class="stat-item stat-expired">
              <div class="stat-icon bg-info">
                <Icon icon="ri:alarm-warning-line" />
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ quotationStats.expired }}</div>
                <div class="stat-label">已过期</div>
              </div>
            </div>
            <ElDivider />
            <div class="stat-item stat-amount">
              <div class="stat-icon bg-success">
                <Icon icon="ri:currency-line" />
              </div>
              <div class="stat-info">
                <div class="stat-value amount-value">{{
                  formatAmount(quotationStats.totalAmount, 'CNY')
                }}</div>
                <div class="stat-label">成交金额</div>
              </div>
            </div>
          </div>
        </ElCard>

        <!-- 快速操作 -->
        <ElCard class="quick-actions-card mt-4">
          <template #header>
            <div class="card-header">
              <Icon icon="ri:quick-service-line" class="mr-2" />
              <span>快速操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <ElButton class="action-btn" @click="handleExportCustomer">
              <Icon icon="ri:download-line" />
              <span>导出客户</span>
            </ElButton>
            <ElButton class="action-btn" @click="handleShareCustomer">
              <Icon icon="ri:share-line" />
              <span>分享客户</span>
            </ElButton>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 报价历史 -->
    <ElCard class="mt-4 quotation-card">
      <template #header>
        <div class="card-header">
          <div class="header-title">
            <Icon icon="ri:file-history-line" class="mr-2" />
            <span>报价历史</span>
          </div>
          <ElButton type="primary" size="small" @click="handleAddQuotation">
            <Icon icon="ri:add-line" class="mr-1" />
            新增报价
          </ElButton>
        </div>
      </template>

      <ElTable
        :data="quotationList"
        :loading="loading"
        style="width: 100%"
        :header-cell-class-name="'table-header-gray'"
        @row-click="handleViewQuotation"
      >
        <ElTableColumn prop="quotationNo" label="报价单号" width="150">
          <template #default="{ row }">
            <ElLink type="primary" :underline="false">{{ row.quotationNo }}</ElLink>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="productName" label="产品名称" min-width="150" show-overflow-tooltip />
        <ElTableColumn
          prop="specification"
          label="规格型号"
          min-width="120"
          show-overflow-tooltip
        />
        <ElTableColumn prop="quantity" label="数量" width="100" align="center">
          <template #default="{ row }">
            <span>{{ row.quantity }} {{ row.unit }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="unitPrice" label="单价" width="120" align="right">
          <template #default="{ row }">
            <span class="text-g-500">{{ formatAmount(row.unitPrice, row.currency) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="totalPrice" label="总金额" width="130" align="right">
          <template #default="{ row }">
            <span class="font-medium text-primary">{{
              formatAmount(row.totalPrice, row.currency)
            }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <ElTag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="quotationDate" label="报价日期" width="110" align="center" sortable />
        <ElTableColumn label="操作" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <ElSpace>
              <ElLink type="primary" :underline="false" @click.stop="handleEditQuotation(row)">
                编辑
              </ElLink>
              <ElLink type="danger" :underline="false" @click.stop="handleDeleteQuotation(row)">
                删除
              </ElLink>
            </ElSpace>
          </template>
        </ElTableColumn>
      </ElTable>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <ElPagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
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
  import { fetchGetCustomerDetail, fetchGetCustomerQuotations } from '@/api/trade-manage'
  import CustomerDialog from './modules/customer-dialog.vue'
  import QuotationDialog from '../quotation/modules/quotation-dialog.vue'
  import { QUOTATION_STATUS_CONFIG } from '@/mock/temp/quotationList'
  import { ElMessageBox } from 'element-plus'

  defineOptions({ name: 'CustomerDetail' })

  const router = useRouter()
  const route = useRoute()

  // 客户数据
  const customerData = ref<Partial<Api.Trade.CustomerListItem>>({})

  // 报价列表
  const quotationList = ref<Api.Trade.QuotationListItem[]>([])
  const loading = ref(false)

  // 报价统计
  const quotationStats = ref({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    expired: 0,
    totalAmount: 0
  })

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

      // 计算统计数据
      calculateStats(quotationList.value)
    } catch (error) {
      console.error('加载报价列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 计算统计数据
  const calculateStats = (list: Api.Trade.QuotationListItem[]) => {
    const stats = {
      total: list.length,
      pending: 0,
      accepted: 0,
      rejected: 0,
      expired: 0,
      totalAmount: 0
    }

    list.forEach((item) => {
      if (item.status === '1') stats.pending++
      else if (item.status === '2') {
        stats.accepted++
        stats.totalAmount += item.totalPrice
      } else if (item.status === '3') stats.rejected++
      else if (item.status === '4') stats.expired++
    })

    quotationStats.value = stats
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

  // 获取状态类型
  const getStatusType = (status: string | undefined) => {
    if (!status) return 'info'
    const config = QUOTATION_STATUS_CONFIG[status as keyof typeof QUOTATION_STATUS_CONFIG]
    return config?.type || 'info'
  }

  // 获取状态文本
  const getStatusText = (status: string | undefined) => {
    if (!status) return '未知'
    const config = QUOTATION_STATUS_CONFIG[status as keyof typeof QUOTATION_STATUS_CONFIG]
    return config?.text || '未知'
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

  // 新增报价
  const handleAddQuotation = () => {
    quotationDialogType.value = 'add'
    currentQuotationData.value = {
      customerId: customerData.value.id || '',
      customerName: customerData.value.customerName || ''
    }
    quotationDialogVisible.value = true
  }

  // 查看报价
  const handleViewQuotation = (row: Api.Trade.QuotationListItem) => {
    // 可以点击行查看详情，这里暂时不处理
    console.log('查看报价:', row)
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

  // 导出客户
  const handleExportCustomer = () => {
    ElMessage.info('导出功能开发中...')
  }

  // 分享客户
  const handleShareCustomer = () => {
    ElMessage.info('分享功能开发中...')
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
    padding: 20px;
    background-color: var(--el-bg-color-page);

    .header-card {
      :deep(.el-card__body) {
        padding: 16px 20px;
      }

      .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .header-left {
          display: flex;
          gap: 16px;
          align-items: center;

          .customer-title {
            display: flex;
            gap: 12px;
            align-items: center;

            h2 {
              margin: 0;
              font-size: 20px;
              font-weight: 600;
              color: var(--el-text-color-primary);
            }
          }
        }
      }
    }

    .info-card,
    .stats-card,
    .quick-actions-card,
    .quotation-card {
      :deep(.el-card__header) {
        background-color: var(--el-bg-color-page);
        border-bottom: 1px solid var(--el-border-color-light);
      }

      .card-header {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }

    .stats-card {
      .stats-content {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .stat-item {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px;
          background-color: var(--el-bg-color-page);
          border-radius: 8px;

          .stat-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            font-size: 24px;
            color: #fff;
            border-radius: 10px;

            &.bg-primary {
              background: linear-gradient(
                135deg,
                var(--el-color-primary-light-8) 0%,
                var(--el-color-primary) 100%
              );
            }

            &.bg-warning {
              background: linear-gradient(
                135deg,
                var(--el-color-warning-light-8) 0%,
                var(--el-color-warning) 100%
              );
            }

            &.bg-success {
              background: linear-gradient(
                135deg,
                var(--el-color-success-light-8) 0%,
                var(--el-color-success) 100%
              );
            }

            &.bg-danger {
              background: linear-gradient(
                135deg,
                var(--el-color-danger-light-8) 0%,
                var(--el-color-danger) 100%
              );
            }

            &.bg-info {
              background: linear-gradient(
                135deg,
                var(--el-color-info-light-8) 0%,
                var(--el-color-info) 100%
              );
            }
          }

          .stat-info {
            flex: 1;

            .stat-value {
              font-size: 24px;
              font-weight: 600;
              color: var(--el-text-color-primary);

              &.amount-value {
                font-size: 20px;
                color: var(--el-color-success);
              }
            }

            .stat-label {
              margin-top: 2px;
              font-size: 13px;
              color: var(--el-text-color-secondary);
            }
          }
        }
      }
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      .action-btn {
        display: flex;
        flex-direction: column;
        gap: 6px;
        align-items: center;
        width: 100%;
        height: auto;
        padding: 12px 8px;

        :deep(.el-button__text) {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      }
    }

    .quotation-card {
      .card-header {
        .header-title {
          display: flex;
          align-items: center;
        }
      }

      .pagination-wrapper {
        display: flex;
        justify-content: flex-end;
        margin-top: 16px;
      }
    }

    .remarks-text {
      line-height: 1.6;
      color: var(--el-text-color-regular);
    }
  }
</style>
