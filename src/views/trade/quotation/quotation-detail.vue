<!-- 报价详情页面 - 只读版本（由 quotation-form.vue 复制并禁用所有输入） -->
<template>
  <div class="quotation-detail-page">
    <!-- 订单状态步骤条 -->
    <ElCard class="art-card mb-4">
      <ElSteps :active="getOrderStep()" align-center class="order-steps">
        <ElStep title="报价单" :description="quotationData.quotationNo || '-'">
          <template #icon>
            <div class="step-icon">
              <Icon icon="ri:file-list-3-line" />
            </div>
          </template>
        </ElStep>
        <ElStep title="PI 形式发票" :description="quotationData.piInvoiceNo || '待生成'">
          <template #icon>
            <div class="step-icon">
              <Icon icon="ri:receipt-line" />
            </div>
          </template>
        </ElStep>
        <ElStep title="PL 装箱单" :description="quotationData.plNo || '待生成'">
          <template #icon>
            <div class="step-icon">
              <Icon icon="ri:package-line" />
            </div>
          </template>
        </ElStep>
        <ElStep title="已发货" :description="getShippedDescription()">
          <template #icon>
            <div class="step-icon">
              <Icon icon="ri:truck-line" />
            </div>
          </template>
        </ElStep>
      </ElSteps>
    </ElCard>

    <!-- 头部操作区 -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <ElButton type="text" @click="handleBack">
          <Icon icon="ri:arrow-left-line" class="mr-1" />
          返回
        </ElButton>
        <h2 class="text-xl font-semibold">报价单详情</h2>
        <ElTag :type="getStatusType(quotationData.status)" effect="dark">
          {{ getStatusText(quotationData.status) }}
        </ElTag>
      </div>
      <ElSpace>
        <!-- 待确认状态 -->
        <template v-if="quotationData.status === '1'">
          <ElButton type="success" @click="handleConfirm">
            <Icon icon="ri:checkbox-circle-line" class="mr-1" />
            确认报价
          </ElButton>
          <ElButton type="danger" @click="handleReject">
            <Icon icon="ri:close-circle-line" class="mr-1" />
            拒绝
          </ElButton>
        </template>
        <!-- 已确认状态 -->
        <template v-if="quotationData.status === '2' && !quotationData.piId">
          <ElButton type="primary" @click="handleCreatePI">
            <Icon icon="ri:add-line" class="mr-1" />
            生成 PI
          </ElButton>
        </template>
        <!-- 已转 PI 状态 -->
        <template v-if="quotationData.piId">
          <ElButton @click="viewPI">
            <Icon icon="ri:file-view-line" class="mr-1" />
            查看 PI
          </ElButton>
        </template>
        <!-- 通用按钮 -->
        <ElButton @click="handleEdit">
          <Icon icon="ri:pencil-line" class="mr-1" />
          编辑
        </ElButton>
        <ElButton type="primary" @click="handlePrint">
          <Icon icon="ri:print-line" class="mr-1" />
          打印
        </ElButton>
        <ElButton type="danger" @click="handleDelete">
          <Icon icon="ri:delete-bin-line" class="mr-1" />
          删除
        </ElButton>
      </ElSpace>
    </div>

    <!-- 客户信息 -->
    <ElCard class="art-card mb-4">
      <template #header>
        <div class="flex-b items-center">
          <span class="font-semibold text-lg">
            <ArtSvgIcon icon="ri:user-star-line" class="mr-2 text-primary" />
            客户信息 / Customer Information
          </span>
          <ElTag type="info" size="small">只读</ElTag>
        </div>
      </template>

      <ElForm :model="quotationData" label-width="120px" class="customer-info-form">
        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElFormItem label="客户名称">
              <ElLink type="primary" @click="goToCustomerDetail">
                {{ quotationData.customerName || '-' }}
              </ElLink>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="联系人">
              <span>{{ quotationData.contactPerson || '-' }}</span>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="联系电话">
              <span>{{ quotationData.contactPhone || '-' }}</span>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="联系邮箱">
              <ElLink :href="'mailto:' + quotationData.contactEmail" type="primary">
                {{ quotationData.contactEmail || '-' }}
              </ElLink>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElFormItem label="WhatsApp">
              <span>{{ quotationData.clientWhatsapp || '-' }}</span>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="国家/地区">
              <span>{{ quotationData.country || '-' }}</span>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="地址">
              <span>{{ quotationData.address || '-' }}</span>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="主营产品">
              <span>{{ quotationData.customerProducts || '-' }}</span>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
    </ElCard>

    <!-- 报价单信息 -->
    <ElCard class="art-card mb-4">
      <template #header>
        <div class="flex-b items-center">
          <span class="font-semibold text-lg">
            <ArtSvgIcon icon="ri:file-list-3-line" class="mr-2 text-primary" />
            报价单信息 / Quotation Information
          </span>
        </div>
      </template>

      <ElForm :model="quotationData" label-width="100px" class="quotation-info-form">
        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElFormItem label="报价单号">
              <span>{{ quotationData.quotationNo || '-' }}</span>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="报价日期">
              <span>{{ quotationData.quotationDate || '-' }}</span>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="有效期至">
              <span>{{ quotationData.validity || '-' }}</span>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="币种">
              <ElTag type="primary" size="small">{{ quotationData.currency || 'USD' }}</ElTag>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElFormItem label="贸易条款">
              <ElTag type="info" size="small">{{ quotationData.tradeTerm || '-' }}</ElTag>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="付款方式">
              <span>{{ quotationData.paymentTerm || '-' }}</span>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="装运港口">
              <span>{{ quotationData.shipmentPort || '-' }}</span>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="交货期">
              <span>{{ quotationData.leadTime || '-' }}</span>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
    </ElCard>

    <!-- 产品列表 -->
    <ElCard class="art-card">
      <template #header>
        <div class="flex-b items-center">
          <span class="font-semibold text-lg">
            <ArtSvgIcon icon="ri:package-line" class="mr-2 text-primary" />
            产品列表 / Products
          </span>
        </div>
      </template>

      <ElTable
        :data="quotationData.products"
        border
        class="products-table"
        header-cell-class-name="table-header-center"
      >
        <!-- 序号 -->
        <ElTableColumn type="index" width="70" align="center" label="序号" />

        <!-- 产品图片 -->
        <ElTableColumn width="100" align="center" label="产品图">
          <template #default="{ row }">
            <img v-if="row.image" :src="row.image" class="product-image" />
            <div v-else class="no-image">No Image</div>
          </template>
        </ElTableColumn>

        <!-- 产品名称 -->
        <ElTableColumn prop="name" label="产品名称" min-width="150" />

        <!-- 规格型号 -->
        <ElTableColumn prop="spec" label="规格型号" min-width="120" />

        <!-- 产品类型 -->
        <ElTableColumn prop="type" label="类型" width="100" align="center">
          <template #default="{ row }">
            <ElTag v-if="row.type" :type="getTypeTagType(row.type)" size="small">
              {{ row.type }}
            </ElTag>
          </template>
        </ElTableColumn>

        <!-- 产品等级 -->
        <ElTableColumn prop="grade" label="等级" width="80" align="center">
          <template #default="{ row }">
            <ElTag v-if="row.grade" :type="getGradeTagType(row.grade)" size="small">
              {{ row.grade }}
            </ElTag>
          </template>
        </ElTableColumn>

        <!-- 数量 -->
        <ElTableColumn prop="qty" label="数量" width="90" align="center" />

        <!-- 单位 -->
        <ElTableColumn prop="unit" label="单位" width="70" align="center" />

        <!-- 单价 -->
        <ElTableColumn prop="price" label="单价" width="110" align="right">
          <template #default="{ row }">
            {{ formatAmount(row.price || 0, row.currency || quotationData.currency) }}
          </template>
        </ElTableColumn>

        <!-- 小计 -->
        <ElTableColumn label="小计" width="110" align="right">
          <template #default="{ row }">
            <span class="font-bold text-primary text-base">
              {{ formatAmount(row.total || 0, row.currency || quotationData.currency) }}
            </span>
          </template>
        </ElTableColumn>

        <!-- 产品备注 -->
        <ElTableColumn
          prop="remark"
          label="备注"
          min-width="100"
          show-overflow-tooltip
          align="center"
        >
          <template #default="{ row }">
            <span>{{ row.remark || '-' }}</span>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>

    <!-- 费用汇总 -->
    <ElCard class="art-card mt-4">
      <template #header>
        <div class="flex-b items-center">
          <span class="font-semibold text-lg">
            <ArtSvgIcon icon="ri:calculator-line" class="mr-2 text-primary" />
            费用汇总 / Cost Summary
          </span>
        </div>
      </template>

      <ElForm :model="quotationData.costSummary" label-width="80px">
        <!-- 费用明细 -->
        <div class="cost-section-title">费用明细 / Charges</div>
        <ElRow :gutter="16" class="costs-row">
          <ElCol :span="5">
            <ElFormItem label="运费">
              <span>{{
                formatAmount(
                  quotationData.costSummary?.freightCharges || 0,
                  quotationData.currency || 'USD'
                )
              }}</span>
            </ElFormItem>
          </ElCol>
          <ElCol :span="5">
            <ElFormItem label="折扣">
              <span class="text-warning">{{
                formatAmount(
                  quotationData.costSummary?.discountValue || 0,
                  quotationData.currency || 'USD'
                )
              }}</span>
              <span class="text-xs text-gray-500 ml-1"
                >({{
                  quotationData.costSummary?.discountType === 'percent' ? '%' : '固定金额'
                }})</span
              >
            </ElFormItem>
          </ElCol>
          <ElCol :span="4">
            <ElFormItem label="折扣类型">
              <span>{{
                quotationData.costSummary?.discountType === 'percent' ? '百分比' : '固定金额'
              }}</span>
            </ElFormItem>
          </ElCol>
          <ElCol :span="5">
            <ElFormItem label="税费">
              <span>{{
                formatAmount(
                  quotationData.costSummary?.taxValue || 0,
                  quotationData.currency || 'USD'
                )
              }}</span>
            </ElFormItem>
          </ElCol>
          <ElCol :span="5">
            <ElFormItem label="其他费用">
              <span>{{
                formatAmount(
                  quotationData.costSummary?.otherCharges || 0,
                  quotationData.currency || 'USD'
                )
              }}</span>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 合计区域 -->
        <div class="cost-section-title">金额汇总 / Summary</div>
        <ElRow :gutter="20" class="summary-row">
          <ElCol :span="8">
            <div class="summary-item">
              <span class="summary-label">产品总计</span>
              <span class="summary-value">{{
                formatAmount(
                  quotationData.costSummary?.subtotal || 0,
                  quotationData.currency || 'USD'
                )
              }}</span>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="summary-item">
              <span class="summary-label">折扣后合计</span>
              <span class="summary-value discount">{{
                formatAmount(calculateDiscountedTotal(), quotationData.currency || 'USD')
              }}</span>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="summary-item grand-total">
              <span class="summary-label">总计</span>
              <span class="summary-value">{{
                formatAmount(
                  quotationData.costSummary?.grandTotal || 0,
                  quotationData.currency || 'USD'
                )
              }}</span>
            </div>
          </ElCol>
        </ElRow>
      </ElForm>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'
  import { useRouter, useRoute } from 'vue-router'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import {
    fetchGetQuotationDetail,
    fetchGetCustomerList,
    fetchUpdateQuotation
  } from '@/api/trade-manage'
  import { ref, h } from 'vue'
  import QuotationPrintTemplate from './quotation-print-template.vue'

  defineOptions({ name: 'QuotationDetail' })

  const router = useRouter()
  const route = useRoute()

  // 打印组件引用
  const printComponentInstance = ref<any>(null)

  // 客户列表
  const customerOptions = ref<Api.Trade.CustomerListItem[]>([])

  // 报价数据
  const quotationData = ref<any>({
    products: [],
    costSummary: {
      freightCharges: 0,
      discountValue: 0,
      discountType: 'percent',
      taxValue: 0,
      otherCharges: 0,
      subtotal: 0,
      grandTotal: 0
    }
  })

  // 报价状态配置
  const QUOTATION_STATUS_CONFIG = {
    '1': { type: 'warning', text: '待确认' },
    '2': { type: 'success', text: '已接受' },
    '3': { type: 'danger', text: '已拒绝' },
    '4': { type: 'info', text: '已过期' }
  }

  // 获取订单步骤（用于步骤条）
  const getOrderStep = (): number => {
    if (quotationData.value.plId) return 3 // 已发货
    if (quotationData.value.piId) return 2 // 已转 PI
    if (quotationData.value.status === '2') return 0 // 已确认，等待转 PI
    return 0 // 报价单阶段
  }

  // 获取已发货描述
  const getShippedDescription = (): string => {
    if (quotationData.value.plNo) {
      return quotationData.value.plNo
    }
    return '待发货'
  }

  // 获取状态类型
  const getStatusType = (
    status: string | undefined
  ): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
    if (!status) return 'info'
    const config = QUOTATION_STATUS_CONFIG[status as keyof typeof QUOTATION_STATUS_CONFIG]
    return (config?.type || 'info') as 'primary' | 'success' | 'warning' | 'info' | 'danger'
  }

  // 获取状态文本
  const getStatusText = (status: string | undefined) => {
    if (!status) return '未知'
    const config = QUOTATION_STATUS_CONFIG[status as keyof typeof QUOTATION_STATUS_CONFIG]
    return config?.text || '未知'
  }

  // 获取等级标签类型
  const getGradeTagType = (grade: string) => {
    const types: Record<string, 'success' | 'primary' | 'warning'> = {
      'A 级': 'success',
      'B 级': 'primary',
      'C 级': 'warning'
    }
    return types[grade] || 'info'
  }

  // 获取类型标签类型
  const getTypeTagType = (type: string) => {
    const types: Record<string, 'primary' | 'success' | 'warning' | 'info'> = {
      切割片: 'primary',
      百叶片: 'success',
      磨光片: 'warning',
      其他: 'info'
    }
    return types[type] || 'info'
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

  // 计算折扣后总计
  const calculateDiscountedTotal = () => {
    const { subtotal, discountValue, discountType } = quotationData.value.costSummary || {}
    const discount =
      discountType === 'percent'
        ? (subtotal || 0) * ((discountValue || 0) / 100)
        : discountValue || 0
    return (subtotal || 0) - discount
  }

  // 加载报价详情
  const loadQuotationDetail = async () => {
    const quotationId = route.params.id as string
    if (!quotationId) return

    try {
      const res = await fetchGetQuotationDetail(quotationId)
      const data = (res as any).data

      if (!data) {
        ElMessage.error('报价单不存在')
        setTimeout(() => {
          router.push('/trade/quotation')
        }, 1000)
        return
      }

      // 先填充报价数据
      quotationData.value = {
        ...quotationData.value,
        // 客户信息（先填充报价单中已保存的）
        customerId: data.customerId || '',
        customerName: data.customerName || '',
        contactPerson: data.contactPerson || '',
        contactPhone: data.contactPhone || '',
        contactEmail: data.contactEmail || '',
        clientWhatsapp: data.clientWhatsapp || '',
        country: data.country || '',
        address: data.address || '',
        customerProducts: typeof data.products === 'string' ? data.products : '',
        // 报价信息
        quotationNo: data.quotationNo || '',
        quotationDate: data.quotationDate || '',
        validity: data.validity || '',
        currency: data.currency || 'USD',
        tradeTerm: data.tradeTerm || '',
        paymentTerm: data.paymentTerm || '',
        shipmentPort: data.shipmentPort || '',
        leadTime: data.leadTime || '',
        // 产品列表和费用汇总
        products: Array.isArray(data.products) ? data.products : [],
        costSummary: data.costSummary || {
          freightCharges: 0,
          discountValue: 0,
          discountType: 'percent',
          taxValue: 0,
          otherCharges: 0,
          subtotal: 0,
          grandTotal: 0
        }
      }

      // 如果报价单中客户信息不完整，从客户档案补充
      if (data.customerId && customerOptions.value.length > 0) {
        const customer = customerOptions.value.find((c) => c.id === data.customerId)
        if (customer) {
          // 只补充报价单中为空的字段
          if (!quotationData.value.contactPerson)
            quotationData.value.contactPerson = customer.contactPerson || ''
          if (!quotationData.value.contactPhone)
            quotationData.value.contactPhone = customer.contactPhone || ''
          if (!quotationData.value.contactEmail)
            quotationData.value.contactEmail = customer.contactEmail || ''
          if (!quotationData.value.clientWhatsapp)
            quotationData.value.clientWhatsapp = customer.contactPhone || ''
          if (!quotationData.value.country) quotationData.value.country = customer.country || ''
          if (!quotationData.value.address) quotationData.value.address = customer.address || ''
          if (!quotationData.value.customerProducts)
            quotationData.value.customerProducts = customer.products || ''
        }
      }
    } catch (error) {
      console.error('加载报价详情失败:', error)
      ElMessage.error('加载报价详情失败')
    }
  }

  // 加载数据
  const loadData = async () => {
    try {
      // 先加载客户选项
      const customerRes = await fetchGetCustomerList({ current: 1, size: 100 })
      customerOptions.value = (customerRes.data as any)?.records || []

      // 再加载报价详情
      await loadQuotationDetail()
    } catch (error) {
      console.error('加载数据失败:', error)
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
    ElMessageBox({
      title: `报价单打印 - ${quotationData.value.quotationNo}`,
      message: h(QuotationPrintTemplate, {
        ref: printComponentInstance,
        quotationData: quotationData.value
      }),
      showConfirmButton: true,
      confirmButtonText: '打印',
      cancelButtonText: '取消',
      showCancelButton: true,
      closeOnClickModal: false,
      customClass: 'print-dialog',
      callback: (action: string) => {
        if (action === 'confirm' && printComponentInstance.value) {
          printComponentInstance.value.print()
        }
      }
    })
  }

  // 跳转到客户详情
  const goToCustomerDetail = () => {
    if (quotationData.value.customerId) {
      router.push(`/trade/customer/detail/${quotationData.value.customerId}`)
    }
  }

  // 确认报价
  const handleConfirm = async () => {
    try {
      await fetchUpdateQuotation({ ...quotationData.value, status: '2' })
      ElMessage.success('报价已确认')
      quotationData.value.status = '2'
    } catch (error) {
      console.error('确认失败:', error)
      ElMessage.error('确认失败')
    }
  }

  // 拒绝报价
  const handleReject = async () => {
    try {
      await fetchUpdateQuotation({ ...quotationData.value, status: '3' })
      ElMessage.success('报价已拒绝')
      quotationData.value.status = '3'
    } catch (error) {
      console.error('拒绝失败:', error)
      ElMessage.error('拒绝失败')
    }
  }

  // 生成 PI
  const handleCreatePI = () => {
    // TODO: PI 模块开发完成后实现
    ElMessage.info('PI 模块开发中，敬请期待')
    // 将来实现：router.push(`/trade/pi/form?quotationId=${quotationData.value.id}`)
  }

  // 查看 PI
  const viewPI = () => {
    // TODO: PI 模块开发完成后实现
    if (quotationData.value.piId) {
      router.push(`/trade/pi/detail/${quotationData.value.piId}`)
    }
  }

  onMounted(() => {
    loadData()
  })

  onActivated(() => {
    loadData()
  })
</script>

<style lang="scss" scoped>
  .quotation-detail-page {
    padding-bottom: 20px;

    // 订单步骤条样式
    .order-steps {
      :deep(.el-step__head) {
        width: 60px;
        height: 60px;
        margin: 0 auto 8px;
      }

      :deep(.el-step__title) {
        font-size: 14px;
        font-weight: 600;
      }

      :deep(.el-step__description) {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }

      .step-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        margin: 0 auto;
        font-size: 20px;
        color: var(--el-color-primary);
      }
    }

    .customer-info-form,
    .quotation-info-form {
      :deep(.el-form-item) {
        padding: 8px 0;
        margin-bottom: 0;

        :deep(.el-form-item__label) {
          font-weight: 500;
        }

        .el-form-item__content {
          color: var(--el-text-color-regular);
        }
      }
    }
  }

  .products-table {
    // 表格头部样式
    :deep(.el-table__header th) {
      font-size: 13px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      background: linear-gradient(to bottom, var(--el-fill-color), var(--el-fill-color-light));
    }

    // 表头居中
    :deep(.table-header-center) {
      text-align: center !important;
    }

    // 表格行样式
    :deep(.el-table__row) {
      &:hover {
        background-color: var(--el-fill-color-lighter);
      }

      .el-table__cell {
        text-align: center;
      }
    }

    // 产品图片
    .product-image {
      width: 60px;
      height: 60px;
      cursor: pointer;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.05);
      }
    }

    .no-image {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      font-size: 12px;
      color: var(--el-text-color-placeholder);
      background: var(--el-fill-color-lighter);
      border-radius: 8px;
    }
  }

  // 费用汇总区域样式
  .cost-section-title {
    padding-left: 12px;
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    border-left: 3px solid var(--el-color-primary);
  }

  .costs-row {
    margin-bottom: 20px;
  }

  .summary-row {
    padding: 20px 16px;
    background: linear-gradient(to right, var(--el-fill-color-light), var(--el-fill-color-lighter));
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
  }

  .summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: 0 1px 3px rgb(0 0 0 / 5%);
    transition: all 0.2s;

    &:hover {
      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
    }

    &.grand-total {
      background: linear-gradient(
        to right,
        var(--el-color-primary-light-9),
        var(--el-color-primary-light-7)
      );
      border: 1px solid var(--el-color-primary-light-5);

      .summary-label {
        color: var(--el-color-primary-dark-2);
      }

      .summary-value {
        font-size: 24px;
        font-weight: bold;
        color: var(--el-color-primary);
      }
    }
  }

  .summary-label {
    margin-bottom: 8px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  .summary-value {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);

    &.discount {
      color: var(--el-color-warning);
    }
  }
</style>
