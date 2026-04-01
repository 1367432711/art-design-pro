<!-- 报价详情页面 -->
<template>
  <div class="quotation-detail-page">
    <!-- 头部操作区 -->
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <ElButton type="text" @click="handleBack">
          <Icon icon="ri:arrow-left-line" class="mr-1" />
          返回
        </ElButton>
        <h2 class="text-xl font-semibold">{{ quotationData.quotationNo || '报价详情' }}</h2>
        <ElTag :type="getStatusType(quotationData.status)" size="medium">
          {{ getStatusText(quotationData.status) }}
        </ElTag>
      </div>
      <ElSpace>
        <ElButton @click="handleEdit">
          <Icon icon="ri:pencil-line" class="mr-1" />
          编辑报价
        </ElButton>
        <ElButton type="danger" @click="handleDelete">
          <Icon icon="ri:delete-bin-line" class="mr-1" />
          删除报价
        </ElButton>
        <ElButton type="primary" @click="handlePrint">
          <Icon icon="ri:print-line" class="mr-1" />
          打印
        </ElButton>
      </ElSpace>
    </div>

    <ElRow :gutter="16">
      <!-- 左侧：报价信息 -->
      <ElCol :span="16">
        <!-- 客户信息 -->
        <ElCard class="art-card mb-3">
          <template #header>
            <div class="art-card-header">
              <div class="title">
                <h4>
                  <Icon icon="ri:user-business-line" class="mr-2" />
                  客户信息 / Customer Information
                </h4>
              </div>
            </div>
          </template>
          <ElDescriptions :column="2" border>
            <ElDescriptionsItem label="客户名称">
              <ElLink type="primary" @click="goToCustomerDetail">
                {{ quotationData.customerName || '-' }}
              </ElLink>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="客户 ID">
              {{ quotationData.customerId || '-' }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </ElCard>

        <!-- 产品信息 -->
        <ElCard class="art-card mb-3">
          <template #header>
            <div class="art-card-header">
              <div class="title">
                <h4>
                  <Icon icon="ri:package-line" class="mr-2" />
                  产品信息 / Product Information
                </h4>
              </div>
            </div>
          </template>
          <ElTable :data="productList" border>
            <ElTableColumn prop="name" label="产品名称" min-width="180" />
            <ElTableColumn prop="sku" label="型号/SKU" min-width="150" />
            <ElTableColumn prop="type" label="类型" width="100" align="center" />
            <ElTableColumn prop="grade" label="等级" width="100" align="center" />
            <ElTableColumn prop="qty" label="数量" width="100" align="center" />
            <ElTableColumn prop="unit" label="单位" width="80" align="center" />
            <ElTableColumn prop="price" label="单价" width="120" align="right">
              <template #default="{ row }">
                {{ formatAmount(row.price, row.currency || quotationData.currency) }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="total" label="金额" width="120" align="right">
              <template #default="{ row }">
                <span class="font-medium text-primary">{{
                  formatAmount(row.total || 0, row.currency || quotationData.currency)
                }}</span>
              </template>
            </ElTableColumn>
          </ElTable>

          <!-- 合计 -->
          <div
            class="total-section mt-3 p-3 bg-gray-50 rounded flex justify-end items-center gap-4"
          >
            <span class="text-gray-600">总数量：</span>
            <span class="text-lg font-semibold">{{ totalQuantity }}</span>
            <span class="text-gray-600 ml-4">总金额：</span>
            <span class="text-xl font-bold text-primary">{{
              formatAmount(totalAmount, 'USD')
            }}</span>
          </div>
        </ElCard>

        <!-- 商务条款 -->
        <ElCard class="art-card">
          <template #header>
            <div class="art-card-header">
              <div class="title">
                <h4>
                  <Icon icon="ri:file-text-line" class="mr-2" />
                  商务条款 / Terms & Conditions
                </h4>
              </div>
            </div>
          </template>
          <ElDescriptions :column="2" border>
            <ElDescriptionsItem label="贸易条款">
              <ElTag type="info" size="small">{{ quotationData.tradeTerm || '-' }}</ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="付款方式">
              <ElTag type="info" size="small">{{ quotationData.paymentTerm || '-' }}</ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="报价日期">
              {{ quotationData.quotationDate || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="有效期至">
              <ElTag :type="getValidityType(quotationData.validity)" size="small">
                {{ quotationData.validity || '-' }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="装运港口">
              {{ quotationData.shipmentPort || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="交货期">
              {{ quotationData.leadTime || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="客户 WhatsApp">
              {{ quotationData.clientWhatsapp || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="客户邮箱">
              {{ quotationData.clientEmail || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="币种" :span="2">
              <ElTag type="primary" size="small">{{ quotationData.currency || 'USD' }}</ElTag>
            </ElDescriptionsItem>
          </ElDescriptions>
        </ElCard>

        <!-- 费用汇总 -->
        <ElCard class="art-card mt-3">
          <template #header>
            <div class="art-card-header">
              <div class="title">
                <h4>
                  <Icon icon="ri:calculator-line" class="mr-2" />
                  费用汇总 / Cost Summary
                </h4>
              </div>
            </div>
          </template>
          <ElDescriptions :column="3" border>
            <ElDescriptionsItem label="产品总计">
              <span class="text-gray-600">{{
                formatAmount(
                  quotationData.costSummary?.subtotal || 0,
                  quotationData.currency || 'USD'
                )
              }}</span>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="运费">
              <span class="text-gray-600">{{
                formatAmount(
                  quotationData.costSummary?.freightCharges || 0,
                  quotationData.currency || 'USD'
                )
              }}</span>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="折扣">
              <span class="text-warning"
                >{{
                  formatAmount(
                    quotationData.costSummary?.discountValue || 0,
                    quotationData.currency || 'USD'
                  )
                }}
                ({{ quotationData.costSummary?.discountType === 'percent' ? '%' : '固定金额' }})
              </span>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="税费">
              <span class="text-gray-600">{{
                formatAmount(
                  quotationData.costSummary?.taxValue || 0,
                  quotationData.currency || 'USD'
                )
              }}</span>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="其他费用">
              <span class="text-gray-600">{{
                formatAmount(
                  quotationData.costSummary?.otherCharges || 0,
                  quotationData.currency || 'USD'
                )
              }}</span>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="总计" :span="3">
              <span class="text-xl font-bold text-primary">{{
                formatAmount(
                  quotationData.costSummary?.grandTotal || 0,
                  quotationData.currency || 'USD'
                )
              }}</span>
            </ElDescriptionsItem>
          </ElDescriptions>
        </ElCard>
      </ElCol>

      <!-- 右侧：状态信息 -->
      <ElCol :span="8">
        <ElCard class="art-card">
          <template #header>
            <div class="art-card-header">
              <div class="title">
                <h4>
                  <Icon icon="ri:info-circle-line" class="mr-2" />
                  状态信息 / Status
                </h4>
              </div>
            </div>
          </template>
          <div class="status-info">
            <div class="status-item">
              <span class="label">当前状态</span>
              <ElTag :type="getStatusType(quotationData.status)" size="large">
                {{ getStatusText(quotationData.status) }}
              </ElTag>
            </div>
            <div class="status-item">
              <span class="label">创建时间</span>
              <span class="value">{{ quotationData.createTime || '-' }}</span>
            </div>
            <div class="status-item">
              <span class="label">更新时间</span>
              <span class="value">{{ quotationData.updateTime || '-' }}</span>
            </div>
            <div class="status-item">
              <span class="label">更新人</span>
              <span class="value">{{ quotationData.updateBy || '-' }}</span>
            </div>

            <ElDivider />

            <!-- 快捷操作 -->
            <div class="quick-actions">
              <ElButton type="success" style="width: 100%" @click="handleAccept">
                <Icon icon="ri:check-line" class="mr-1" />
                接受报价
              </ElButton>
              <ElButton type="danger" style="width: 100%" class="mt-2" @click="handleReject">
                <Icon icon="ri:close-line" class="mr-1" />
                拒绝报价
              </ElButton>
            </div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { useRouter, useRoute } from 'vue-router'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { fetchGetQuotationDetail, fetchUpdateQuotation } from '@/api/trade-manage'

  defineOptions({ name: 'QuotationDetail' })

  const router = useRouter()
  const route = useRoute()

  // 报价数据
  const quotationData = ref<Partial<Api.Trade.QuotationListItem>>({})

  // 产品列表（从 products 数组获取）
  const productList = computed(() => {
    if (!quotationData.value) return []
    return quotationData.value.products || []
  })

  // 总数量
  const totalQuantity = computed(() => {
    return productList.value.reduce((sum, item) => sum + (item.qty || 0), 0)
  })

  // 总金额（从 costSummary 获取）
  const totalAmount = computed(() => {
    return quotationData.value.costSummary?.grandTotal || 0
  })

  // 报价状态配置
  const QUOTATION_STATUS_CONFIG = {
    '1': { type: 'warning' as const, text: '待确认' },
    '2': { type: 'success' as const, text: '已接受' },
    '3': { type: 'danger' as const, text: '已拒绝' },
    '4': { type: 'info' as const, text: '已过期' }
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

  // 获取有效期类型
  const getValidityType = (validity: string | undefined) => {
    if (!validity) return 'info'
    const today = new Date().toISOString().slice(0, 10)
    if (validity < today) return 'danger'
    return 'success'
  }

  // 格式化金额
  const formatAmount = (amount: number, currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      CNY: '¥',
      GBP: '£'
    }
    const symbol = symbols[currency] || currency
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // 加载报价详情
  const loadQuotationDetail = async () => {
    const quotationId = route.params.id as string
    if (!quotationId) return

    try {
      const res = await fetchGetQuotationDetail(quotationId)
      quotationData.value = (res as any).data || {}
    } catch (error) {
      console.error('加载报价详情失败:', error)
      ElMessage.error('加载报价详情失败')
    }
  }

  // 返回报价列表
  const handleBack = () => {
    router.push('/trade/quotation')
  }

  // 编辑报价
  const handleEdit = () => {
    router.push(`/trade/quotation/form/${quotationData.value.id}`)
  }

  // 删除报价
  const handleDelete = () => {
    ElMessageBox.confirm(`确定要删除报价单 ${quotationData.value.quotationNo} 吗？`, '删除报价', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        await fetchUpdateQuotation({ ...quotationData.value, status: '3' })
        ElMessage.success('删除成功')
        handleBack()
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    })
  }

  // 打印报价单
  const handlePrint = () => {
    ElMessage.info('打印功能待开发')
  }

  // 接受报价
  const handleAccept = async () => {
    ElMessageBox.confirm('确认接受此报价？', '接受报价', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(async () => {
      try {
        await fetchUpdateQuotation({ ...quotationData.value, status: '2' })
        quotationData.value.status = '2'
        ElMessage.success('已接受报价')
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败')
      }
    })
  }

  // 拒绝报价
  const handleReject = async () => {
    ElMessageBox.confirm('确认拒绝此报价？', '拒绝报价', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        await fetchUpdateQuotation({ ...quotationData.value, status: '3' })
        quotationData.value.status = '3'
        ElMessage.success('已拒绝报价')
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败')
      }
    })
  }

  // 跳转到客户详情
  const goToCustomerDetail = () => {
    if (quotationData.value.customerId) {
      router.push(`/trade/customer/detail/${quotationData.value.customerId}`)
    }
  }

  onMounted(() => {
    loadQuotationDetail()
  })

  // 监听页面激活事件（keepAlive 场景）
  onActivated(() => {
    loadQuotationDetail()
  })
</script>

<style lang="scss" scoped>
  .quotation-detail-page {
    padding-bottom: 20px;

    .total-section {
      border: 1px solid var(--el-border-color-light);
    }

    .status-info {
      .status-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid var(--el-border-color-lighter);

        &:last-child {
          border-bottom: none;
        }

        .label {
          font-size: 14px;
          color: var(--el-text-color-secondary);
        }

        .value {
          font-size: 14px;
          color: var(--el-text-color-primary);
        }
      }

      .quick-actions {
        padding-top: 12px;
      }
    }
  }
</style>
