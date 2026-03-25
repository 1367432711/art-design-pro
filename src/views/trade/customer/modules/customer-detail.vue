<template>
  <ElDrawer
    v-model="drawerVisible"
    title="客户详情"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-if="customerData" class="customer-detail">
      <!-- 客户基本信息 -->
      <ElDescriptions title="基本信息" :column="1" border>
        <ElDescriptionsItem label="客户名称">
          <span class="font-medium">{{ customerData.customerName }}</span>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系人">{{ customerData.contactPerson }}</ElDescriptionsItem>
        <ElDescriptionsItem label="联系电话">{{ customerData.contactPhone }}</ElDescriptionsItem>
        <ElDescriptionsItem label="联系邮箱">{{ customerData.contactEmail }}</ElDescriptionsItem>
        <ElDescriptionsItem label="国家/地区">{{ customerData.country }}</ElDescriptionsItem>
        <ElDescriptionsItem label="地址">{{ customerData.address || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="主营产品">{{ customerData.products }}</ElDescriptionsItem>
        <ElDescriptionsItem label="客户来源">{{ customerData.source }}</ElDescriptionsItem>
        <ElDescriptionsItem label="客户状态">
          <ElTag :type="getStatusType(customerData.status)" size="small">
            {{ getStatusText(customerData.status) }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="跟进销售">{{
          customerData.salesPerson || '-'
        }}</ElDescriptionsItem>
        <ElDescriptionsItem label="备注信息">{{ customerData.remarks || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="创建时间">{{ customerData.createTime }}</ElDescriptionsItem>
        <ElDescriptionsItem label="更新时间">{{ customerData.updateTime }}</ElDescriptionsItem>
      </ElDescriptions>

      <!-- 报价统计 -->
      <ElDivider />
      <div class="quotation-summary">
        <h3 class="section-title">报价统计</h3>
        <ElRow :gutter="16" class="mt-4">
          <ElCol :span="6">
            <div class="stat-card">
              <div class="stat-value">{{ customerData.quotationCount || 0 }}</div>
              <div class="stat-label">总报价数</div>
            </div>
          </ElCol>
          <ElCol :span="6">
            <div class="stat-card">
              <div class="stat-value">{{ quotationStats.pending }}</div>
              <div class="stat-label">待确认</div>
            </div>
          </ElCol>
          <ElCol :span="6">
            <div class="stat-card">
              <div class="stat-value">{{ quotationStats.accepted }}</div>
              <div class="stat-label">已接受</div>
            </div>
          </ElCol>
          <ElCol :span="6">
            <div class="stat-card">
              <div class="stat-value">{{ quotationStats.totalAmount }}</div>
              <div class="stat-label">成交金额</div>
            </div>
          </ElCol>
        </ElRow>
      </div>

      <!-- 报价历史 -->
      <ElDivider />
      <div class="quotation-history">
        <div class="section-header">
          <h3 class="section-title">报价历史</h3>
          <ElButton type="primary" size="small" @click="handleAddQuotation">
            <Icon icon="ri:add-line" class="mr-1" />
            新增报价
          </ElButton>
        </div>

        <ElTable
          :data="quotationList"
          :loading="quotationLoading"
          style="width: 100%"
          :header-cell-class-name="'table-header-gray'"
        >
          <ElTableColumn prop="quotationNo" label="报价单号" width="140">
            <template #default="{ row }">
              <ElLink type="primary" :underline="false">{{ row.quotationNo }}</ElLink>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="productName" label="产品" min-width="120" show-overflow-tooltip />
          <ElTableColumn prop="quantity" label="数量" width="80" align="center">
            <template #default="{ row }">
              <span>{{ row.quantity }} {{ row.unit }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="totalPrice" label="总金额" width="110" align="right">
            <template #default="{ row }">
              <span class="text-primary font-medium">{{
                formatAmount(row.totalPrice, row.currency)
              }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="status" label="状态" width="80" align="center">
            <template #default="{ row }">
              <ElTag :type="getStatusType(row.status)" size="small">
                {{ getStatusText(row.status) }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="quotationDate" label="报价日期" width="100" align="center" />
          <ElTableColumn label="操作" width="100" fixed="right" align="center">
            <template #default="{ row }">
              <ElLink type="primary" :underline="false" @click="handleViewQuotation(row)">
                查看
              </ElLink>
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
            @size-change="handleQuotationSizeChange"
            @current-change="handleQuotationCurrentChange"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <ElSpace>
        <ElButton @click="drawerVisible = false">关闭</ElButton>
        <ElButton type="primary" @click="handleEditCustomer">编辑客户</ElButton>
      </ElSpace>
    </template>
  </ElDrawer>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { fetchGetCustomerQuotations } from '@/api/trade-manage'
  import { QUOTATION_STATUS_CONFIG } from '@/mock/temp/quotationList'

  interface Props {
    visible: boolean
    customerData: Partial<Api.Trade.CustomerListItem> | null
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'edit', customer: Partial<Api.Trade.CustomerListItem>): void
    (e: 'add-quotation', customerId: string, customerName: string): void
    (e: 'view-quotation', quotation: Api.Trade.QuotationListItem): void
  }

  const props = withDefaults(defineProps<Props>(), {
    customerData: null
  })

  const emit = defineEmits<Emits>()

  // 抽屉显示控制
  const drawerVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  // 报价列表数据
  const quotationList = ref<Api.Trade.QuotationListItem[]>([])
  const quotationLoading = ref(false)

  // 报价统计
  const quotationStats = ref({
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

  // 加载报价列表
  const loadQuotationList = async () => {
    if (!props.customerData?.id) return

    quotationLoading.value = true
    try {
      const res = await fetchGetCustomerQuotations(props.customerData.id, {
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
      quotationLoading.value = false
    }
  }

  // 计算统计数据
  const calculateStats = (list: Api.Trade.QuotationListItem[]) => {
    const stats = {
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
  const handleQuotationSizeChange = (size: number) => {
    pagination.size = size
    pagination.current = 1
    loadQuotationList()
  }

  // 当前页变化
  const handleQuotationCurrentChange = (current: number) => {
    pagination.current = current
    loadQuotationList()
  }

  // 关闭抽屉
  const handleClose = () => {
    emit('update:visible', false)
  }

  // 编辑客户
  const handleEditCustomer = () => {
    if (props.customerData) {
      emit('edit', props.customerData)
    }
  }

  // 新增报价
  const handleAddQuotation = () => {
    if (props.customerData) {
      emit('add-quotation', props.customerData.id || '', props.customerData.customerName || '')
    }
  }

  // 查看报价
  const handleViewQuotation = (quotation: Api.Trade.QuotationListItem) => {
    emit('view-quotation', quotation)
  }

  // 监听客户数据变化，加载报价列表
  watch(
    () => props.customerData?.id,
    (customerId) => {
      if (customerId) {
        loadQuotationList()
      }
    },
    { immediate: true }
  )
</script>

<style lang="scss" scoped>
  .customer-detail {
    .section-title {
      margin: 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    // 报价统计卡片
    .stat-card {
      padding: 16px;
      text-align: center;
      background: linear-gradient(
        135deg,
        var(--el-color-primary-light-9) 0%,
        var(--el-color-primary-light-7) 100%
      );
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
        transform: translateY(-2px);
      }

      .stat-value {
        margin-bottom: 4px;
        font-size: 24px;
        font-weight: 600;
        color: var(--el-color-primary);
      }

      .stat-label {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }

    // 分页
    .pagination-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
  }
</style>
