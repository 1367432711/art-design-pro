<!-- 报价详情页面 - 只读版本（由 quotation-form.vue 复制并禁用所有输入） -->
<template>
  <div class="quotation-detail-page">
    <!-- 订单状态步骤条 -->
    <ElCard class="art-card mb-4">
      <div class="order-steps-container">
        <div
          class="order-step"
          v-for="(step, index) in orderSteps"
          :key="index"
          :class="{
            'is-active': index === getOrderStep(),
            'is-finished': index < getOrderStep(),
            'is-clickable': isStepClickable(index)
          }"
          @click="handleStepClick(index)"
        >
          <ElTooltip :content="getStepTooltip(index)" placement="top">
            <div class="step-icon-wrapper">
              <Icon :icon="step.icon" class="step-icon" />
            </div>
          </ElTooltip>
          <div class="step-title">{{ step.title }}</div>
          <div class="step-description">{{ getStepDescription(index) }}</div>
          <!-- 快捷操作按钮 -->
          <div class="step-actions" v-if="getStepActions(index).length > 0">
            <ElButton
              v-for="(action, actionIndex) in getStepActions(index)"
              :key="actionIndex"
              :type="action.type as any"
              size="small"
              @click.stop="action.handler"
            >
              {{ action.text }}
            </ElButton>
          </div>
          <!-- 连接线 -->
          <div
            class="step-line"
            v-if="index < orderSteps.length - 1"
            :class="{
              'is-active': index < getOrderStep()
            }"
          ></div>
        </div>
      </div>
    </ElCard>

    <!-- 头部操作区 -->
    <ArtPageHeader
      title="报价单详情"
      :status-text="getStatusText(quotationData.status)"
      :status-type="getStatusType(quotationData.status)"
      @back="handleBack"
    >
      <!-- 业务操作组 -->
      <div class="action-group">
        <ElButton type="primary" size="large" @click="handleCreatePI" :disabled="!canCreatePI">
          <Icon icon="ri:file-add-line" class="mr-1" />
          生成 PI
        </ElButton>
        <ElButton v-if="quotationData.piId" size="large" @click="viewPI" class="view-pi-btn">
          <Icon icon="ri:external-link-line" class="mr-1" />
          查看 PI
        </ElButton>
      </div>

      <!-- 通用操作组 -->
      <div class="action-group">
        <ElButton size="large" @click="handleEdit">
          <Icon icon="ri:pencil-line" class="mr-1" />
          编辑
        </ElButton>
        <ElButton type="primary" size="large" @click="handlePrint">
          <Icon icon="ri:print-line" class="mr-1" />
          打印
        </ElButton>
      </div>

      <!-- 危险操作组 -->
      <div class="action-group danger-group">
        <ElDropdown trigger="click" @command="handleDangerCommand">
          <ElButton type="danger" size="large" plain>
            <Icon icon="ri:more-2-fill" class="mr-1" />
            更多
            <Icon icon="ri:arrow-down-s-line" class="ml-1" />
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem command="confirm" divided>
                <Icon icon="ri:checkbox-circle-line" class="mr-2 text-success" />
                确认报价
              </ElDropdownItem>
              <ElDropdownItem command="reject">
                <Icon icon="ri:close-circle-line" class="mr-2 text-danger" />
                拒绝报价
              </ElDropdownItem>
              <ElDropdownItem command="delete" divided>
                <Icon icon="ri:delete-bin-line" class="mr-2 text-danger" />
                删除报价单
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </div>
    </ArtPageHeader>

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
            <ElImage
              v-if="row.image && getProductImageUrl(row.image)"
              :src="getProductImageUrl(row.image)"
              class="product-image"
              fit="cover"
              :preview-src-list="[getProductImageUrl(row.image)]"
              preview-teleported
            />
            <div v-else class="no-image">No Image</div>
          </template>
        </ElTableColumn>

        <!-- 产品名称 -->
        <ElTableColumn prop="name" label="产品名称" min-width="150">
          <template #default="{ row }">
            <div class="flex items-center gap-1">
              <span>{{ row.name }}</span>
              <ElTag v-if="row._warning === 'product_not_found'" type="danger" size="small">
                产品已下架
              </ElTag>
            </div>
          </template>
        </ElTableColumn>

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
  import ArtPageHeader from '@/components/core/base/art-page-header/index.vue'
  import { useRouter, useRoute } from 'vue-router'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import {
    fetchGetQuotationDetail,
    fetchGetCustomerList,
    fetchUpdateQuotation
  } from '@/api/trade-manage'
  import { ref, h, computed } from 'vue'
  import QuotationPrintTemplate from './quotation-print-template.vue'
  import { getProductList } from '@/utils/storage/db'

  defineOptions({ name: 'QuotationDetail' })

  const router = useRouter()
  const route = useRoute()

  // 打印组件引用
  const printComponentInstance = ref<any>(null)

  // 客户列表
  const customerOptions = ref<Api.Trade.CustomerListItem[]>([])

  // 预加载产品图片（使用 Vite import.meta.glob）
  const productImages = import.meta.glob('/src/assets/images/cover/*.webp', {
    eager: true
  }) as Record<string, any>

  // 获取产品图片真实 URL
  const getProductImageUrl = (imagePath: string): string => {
    if (!imagePath) return ''
    // 如果已经是 http 开头的完整 URL，直接返回
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    // 从 glob 导入的图片中查找
    const fileName = imagePath.split('/').pop()
    if (fileName) {
      const matchPath = Object.keys(productImages).find((key) => key.includes(fileName))
      if (matchPath) {
        return productImages[matchPath]?.default || ''
      }
    }
    // 如果找不到，尝试直接使用路径（可能是 public 目录或外部 URL）
    return imagePath
  }

  // 报价数据
  const quotationData = ref<any>({
    id: '',
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

  // 数据加载中
  const loading = ref(false)

  // 来源页面追踪（用于返回按钮）
  const fromCustomer = ref(false)
  const customerId = ref<string>('')

  // 报价状态配置
  const QUOTATION_STATUS_CONFIG = {
    '1': { type: 'warning', text: '待确认' },
    '2': { type: 'success', text: '已接受' },
    '3': { type: 'danger', text: '已拒绝' },
    '4': { type: 'info', text: '已过期' }
  }

  // 订单步骤配置
  const orderSteps = [
    { title: '报价单', icon: 'ri:file-list-3-line' },
    { title: 'PI 形式发票', icon: 'ri:receipt-line' },
    { title: 'PL 装箱单', icon: 'ri:package-line' },
    { title: '已发货', icon: 'ri:truck-line' }
  ]

  // 获取订单步骤（用于步骤条）
  const getOrderStep = (): number => {
    if (quotationData.value.plId) return 3 // 已发货
    if (quotationData.value.piId) return 2 // 已转 PI
    if (quotationData.value.status === '2') return 1 // 已确认，等待转 PI
    return 0 // 报价单阶段
  }

  // 判断步骤是否可点击
  const isStepClickable = (index: number): boolean => {
    // 已完成的步骤可以点击查看详情
    if (index < getOrderStep()) return true
    // 当前步骤可以点击
    if (index === getOrderStep()) return true
    // 未来步骤不可点击
    return false
  }

  // 获取步骤详情提示
  const getStepTooltip = (index: number): string => {
    const descriptions = [
      `报价单号：${quotationData.value.quotationNo || '待生成'}`,
      `PI 发票号：${quotationData.value.piInvoiceNo || '待生成'}`,
      `PL 编号：${quotationData.value.plNo || '待生成'}`,
      `物流单号：${quotationData.value.shippingNo || '待填写'}`
    ]
    return descriptions[index] || ''
  }

  // 获取步骤操作按钮
  const getStepActions = (
    index: number
  ): Array<{ type: string; text: string; handler: () => void }> => {
    const actions: Array<{ type: string; text: string; handler: () => void }> = []

    // 步骤 0: 报价单 - 待确认状态显示快捷操作
    if (index === 0) {
      if (quotationData.value.status === '1') {
        // 待确认状态：显示确认/拒绝
        actions.push({ type: 'success', text: '确认', handler: handleConfirm })
        actions.push({ type: 'danger', text: '拒绝', handler: handleReject })
      } else if (quotationData.value.status === '2') {
        // 已确认状态：显示生成 PI（如果还没有 PI）
        if (!quotationData.value.piId) {
          actions.push({ type: 'primary', text: '生成 PI', handler: handleCreatePI })
        }
      }
    }
    // 步骤 1: PI - 已转 PI 显示查看按钮
    if (index === 1 && quotationData.value.piId) {
      actions.push({ type: 'primary', text: '查看 PI', handler: viewPI })
    }
    // 步骤 2: PL - 生成 PL 按钮
    if (index === 2 && quotationData.value.piId && !quotationData.value.plId) {
      actions.push({ type: 'primary', text: '生成 PL', handler: handleCreatePL })
    }
    // 步骤 3: 已发货 - 查看物流
    if (index === 3 && quotationData.value.plId) {
      actions.push({ type: 'info', text: '查看物流', handler: handleViewShipping })
    }

    return actions
  }

  // 处理步骤点击
  const handleStepClick = (index: number) => {
    if (!isStepClickable(index)) return

    const currentStep = getOrderStep()

    // 点击已完成的步骤，查看详情
    if (index < currentStep || index === currentStep) {
      switch (index) {
        case 0:
          // 报价单详情（当前页面）
          break
        case 1:
          // 查看 PI 详情
          if (quotationData.value.piId) {
            router.push(`/trade/pi/detail/${quotationData.value.piId}`)
          }
          break
        case 2:
          // 查看 PL 详情
          if (quotationData.value.plId) {
            router.push(`/trade/pl/detail/${quotationData.value.plId}`)
          }
          break
        case 3:
          // 查看物流信息
          if (quotationData.value.plId) {
            handleViewShipping()
          }
          break
      }
    }
  }

  // 生成 PL
  const handleCreatePL = () => {
    ElMessage.info('PL 模块开发中，敬请期待')
  }

  // 查看物流
  const handleViewShipping = () => {
    ElMessage.info('物流跟踪功能开发中')
  }

  // 获取步骤描述
  const getStepDescription = (step: number): string => {
    switch (step) {
      case 0: // 报价单
        return quotationData.value.quotationNo || '待确认'
      case 1: // PI
        return quotationData.value.piInvoiceNo || '待生成'
      case 2: // PL
        return quotationData.value.plNo || '待生成'
      case 3: // 已发货
        return quotationData.value.plNo || '待发货'
      default:
        return '-'
    }
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

    // 读取来源页面信息
    fromCustomer.value = route.query.fromCustomer === 'true'
    if (fromCustomer.value) {
      // 从 URL 参数或报价数据中获取 customerId
      customerId.value = (route.query.customerId as string) || ''
    }

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
        // 基础信息
        id: data.id || '',
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

      // 如果是从客户详情跳转而来，且没有传入 customerId，使用报价数据中的
      if (fromCustomer.value && !customerId.value && data.customerId) {
        customerId.value = data.customerId
      }

      // 补充产品规格型号数据（从产品库获取最新的 spec）
      supplementProductSpecs()

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

  // 补充产品数据（从产品库获取最新的基础属性）
  const supplementProductSpecs = () => {
    const products = quotationData.value.products || []
    // 获取产品库数据
    const allProducts = getProductList()

    products.forEach((product: any) => {
      // 如果有 selectedProductId，从产品库获取最新的基础属性
      if (product.selectedProductId) {
        const sourceProduct = allProducts.find((p) => p.id === product.selectedProductId)
        if (sourceProduct) {
          // 基础属性总是从产品库读取（确保数据最新）
          product.spec = sourceProduct.spec
          product.type = sourceProduct.type
          product.grade = sourceProduct.grade
          product.unit = sourceProduct.unit
          product.cartonQuantity = sourceProduct.cartonQuantity
          product.blisterQuantity = sourceProduct.blisterQuantity
          product.innerBoxQuantity = sourceProduct.innerBoxQuantity

          // 图片：从产品库覆盖（确保使用正确的图片路径）
          if (sourceProduct.mainImage) {
            product.image = sourceProduct.mainImage
          }
        } else {
          // 产品库中找不到，标记警告
          product._warning = 'product_not_found'
        }
      } else {
        // 没有 selectedProductId，尝试根据产品名称匹配
        const matchedProduct = allProducts.find(
          (p) => p.name === product.name && p.spec === product.spec
        )
        if (matchedProduct) {
          product.selectedProductId = matchedProduct.id
          product.spec = matchedProduct.spec
          product.type = matchedProduct.type
          product.grade = matchedProduct.grade
          product.unit = matchedProduct.unit
          if (matchedProduct.mainImage) {
            product.image = matchedProduct.mainImage
          }
        }
      }
    })
  }

  // 加载数据
  const loadData = async () => {
    loading.value = true
    try {
      // 先加载客户选项
      const customerRes = await fetchGetCustomerList({ current: 1, size: 100 })
      customerOptions.value = (customerRes.data as any)?.records || []

      // 再加载报价详情
      await loadQuotationDetail()
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 返回报价列表
  const handleBack = () => {
    // 如果是从客户详情页跳转而来，返回客户详情页
    if (fromCustomer.value && customerId.value) {
      router.push(`/trade/customer/detail/${customerId.value}`)
    } else {
      router.push('/trade/quotation')
    }
  }

  // 编辑报价
  const handleEdit = () => {
    if (!quotationData.value.id) {
      ElMessage.warning('数据加载中，请稍后再试')
      return
    }
    const targetPath = `/trade/quotation/form/${quotationData.value.id}`
    router.push({
      path: targetPath,
      query: {
        fromDetail: 'true',
        quotationId: quotationData.value.id
      }
    })
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
    if (!quotationData.value.id) return

    // 携带报价单 ID 跳转到 PI 表单页
    router.push({
      path: '/trade/pi/form',
      query: {
        fromQuotation: 'true',
        quotationId: quotationData.value.id
      }
    })
  }

  // 查看 PI
  const viewPI = () => {
    if (quotationData.value.piId) {
      router.push(`/trade/pi/detail/${quotationData.value.piId}?fromQuotation=true`)
    }
  }

  // 判断是否可以生成 PI（已确认且未生成 PI）
  const canCreatePI = computed(() => {
    return quotationData.value.status === '2' && !quotationData.value.piId
  })

  // 危险操作下拉菜单处理
  const handleDangerCommand = (command: string) => {
    switch (command) {
      case 'confirm':
        handleConfirm()
        break
      case 'reject':
        handleReject()
        break
      case 'delete':
        handleDelete()
        break
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
    .order-steps-container {
      position: relative;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 20px 10px;
    }

    .order-step {
      position: relative;
      z-index: 1;
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      padding: 0 8px;
      transition: all 0.3s ease;

      // 可点击状态
      &.is-clickable {
        cursor: pointer;

        &:hover {
          .step-icon-wrapper {
            box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
            transform: scale(1.05);
          }

          .step-title {
            color: var(--el-color-primary);
          }
        }
      }

      .step-icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        margin-bottom: 12px;
        background: var(--el-fill-color);
        border: 2px solid var(--el-border-color);
        border-radius: 50%;
        transition: all 0.3s ease;

        .step-icon {
          font-size: 24px;
          color: var(--el-text-color-secondary);
          transition: all 0.3s ease;
        }
      }

      .step-title {
        margin-bottom: 6px;
        font-size: 15px;
        font-weight: 600;
        color: var(--el-text-color-regular);
        transition: all 0.3s ease;
      }

      .step-description {
        margin-bottom: 8px;
        font-size: 12px;
        color: var(--el-text-color-placeholder);
        transition: all 0.3s ease;
      }

      // 快捷操作按钮
      .step-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        justify-content: center;
        margin-top: 4px;
      }

      // 连接线
      .step-line {
        position: absolute;
        top: 26px;
        left: 50%;
        z-index: -1;
        width: 100%;
        height: 2px;
        background: var(--el-border-color-light);
        transition: all 0.3s ease;

        &.is-active {
          background: var(--el-color-success);
        }
      }

      // 激活状态
      &.is-active {
        .step-icon-wrapper {
          background: var(--el-color-primary);
          border-color: var(--el-color-primary);
          box-shadow: 0 4px 12px rgb(0 0 0 / 15%);

          .step-icon {
            color: #fff;
          }
        }

        .step-title {
          font-weight: 700;
          color: var(--el-color-primary);
        }

        .step-description {
          color: var(--el-color-primary-light-3);
        }
      }

      // 完成状态
      &.is-finished {
        .step-icon-wrapper {
          background: var(--el-color-success);
          border-color: var(--el-color-success);

          .step-icon {
            color: #fff;
          }
        }

        .step-title {
          color: var(--el-color-success);
        }
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
