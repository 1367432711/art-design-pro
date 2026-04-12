<!-- PI 详情页面 -->
<template>
  <div class="pi-detail-page">
    <!-- 头部操作区 -->
    <ArtPageHeader
      title="PI 详情"
      :status-text="piData.status"
      :status-type="statusType"
      @back="handleBack"
    >
      <!-- 业务操作组 -->
      <div class="action-group">
        <ElButton type="primary" size="large" @click="handleCreatePL">
          <Icon icon="ri:file-add-line" class="mr-1" />
          生成 PL
        </ElButton>
        <ElButton v-if="piData.plId" size="large" @click="viewPL" class="view-pl-btn">
          <Icon icon="ri:external-link-line" class="mr-1" />
          查看 PL
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
    </ArtPageHeader>

    <!-- 基本信息 -->
    <ElCard class="art-card mb-4">
      <template #header>
        <div class="art-card-header">
          <div class="title">
            <h4>
              <Icon icon="ri:file-text-line" class="mr-2" />
              基本信息 / Basic Information
            </h4>
          </div>
        </div>
      </template>

      <ElDescriptions :column="3" border size="default">
        <ElDescriptionsItem label="发票号">{{ piData.invoiceNo }}</ElDescriptionsItem>
        <ElDescriptionsItem label="PI 日期">{{ piData.piDate }}</ElDescriptionsItem>
        <ElDescriptionsItem label="关联报价单">
          <ElLink v-if="piData.quotationId" type="primary" @click="viewQuotation">
            查看报价单
          </ElLink>
          <span v-else>-</span>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="客户名称">{{ piData.customerName }}</ElDescriptionsItem>
        <ElDescriptionsItem label="公司名称">{{ piData.companyName }}</ElDescriptionsItem>
        <ElDescriptionsItem label="状态">
          <ElTag :type="statusType">{{ piData.status }}</ElTag>
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>

    <!-- 联系信息 -->
    <ElCard class="art-card mb-4">
      <template #header>
        <div class="art-card-header">
          <div class="title">
            <h4>
              <Icon icon="ri:contacts-book-line" class="mr-2" />
              联系信息 / Contact Information
            </h4>
          </div>
        </div>
      </template>

      <ElDescriptions :column="3" border size="default">
        <ElDescriptionsItem label="公司地址" :span="3">
          {{ piData.companyAddress || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="公司邮箱">{{ piData.companyEmail || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="公司电话">{{ piData.companyPhone || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="客户邮箱">{{ piData.contactEmail || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="收货人">{{ piData.consignee || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="联系电话">{{ piData.contactPhone || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="收货地址" :span="3">
          {{ piData.deliveryAddress || '-' }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>

    <!-- 贸易信息 -->
    <ElCard class="art-card mb-4">
      <template #header>
        <div class="art-card-header">
          <div class="title">
            <h4>
              <Icon icon="ri:exchange-dollar-line" class="mr-2" />
              贸易信息 / Trade Information
            </h4>
          </div>
        </div>
      </template>

      <ElDescriptions :column="3" border size="default">
        <ElDescriptionsItem label="贸易条款">{{ piData.tradeTerms }}</ElDescriptionsItem>
        <ElDescriptionsItem label="贸易国家">{{ piData.tradeCountry }}</ElDescriptionsItem>
        <ElDescriptionsItem label="装运港">{{ piData.portOfLoading }}</ElDescriptionsItem>
        <ElDescriptionsItem label="目的港">{{ piData.portOfDestination }}</ElDescriptionsItem>
        <ElDescriptionsItem label="交货期">{{ piData.deliveryDate }}</ElDescriptionsItem>
        <ElDescriptionsItem label="原产地">{{ piData.countryOfOrigin || '-' }}</ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>

    <!-- 物流信息 -->
    <ElCard class="art-card mb-4">
      <template #header>
        <div class="art-card-header">
          <div class="title">
            <h4>
              <Icon icon="ri:truck-line" class="mr-2" />
              物流信息 / Logistics Information
            </h4>
          </div>
        </div>
      </template>

      <ElDescriptions :column="4" border size="default">
        <ElDescriptionsItem label="总毛重">{{ piData.grossWeight }} kg</ElDescriptionsItem>
        <ElDescriptionsItem label="总净重">{{ piData.netWeight }} kg</ElDescriptionsItem>
        <ElDescriptionsItem label="总体积">{{ piData.totalVolume }} CBM</ElDescriptionsItem>
        <ElDescriptionsItem label="总箱数">{{ piData.totalCartons }} 箱</ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>

    <!-- 产品明细 -->
    <ElCard class="art-card mb-4">
      <template #header>
        <div class="art-card-header">
          <div class="title">
            <h4>
              <Icon icon="ri:shopping-bag-3-line" class="mr-2" />
              产品明细 / Products
            </h4>
          </div>
        </div>
      </template>

      <ElTable :data="piData.products" border>
        <ElTableColumn type="index" label="序号" width="60" align="center" />
        <ElTableColumn prop="mainImage" label="图片" width="80" align="center">
          <template #default="{ row }">
            <ElImage
              v-if="row.mainImage"
              :src="row.mainImage"
              :preview-src-list="[row.mainImage]"
              fit="cover"
              style="width: 50px; height: 50px; border-radius: 4px"
              class="product-image"
            />
            <span v-else class="text-gray-400">-</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="productName" label="产品名称" min-width="150" />
        <ElTableColumn prop="spec" label="规格型号" width="120" />
        <ElTableColumn prop="type" label="类型" width="100" />
        <ElTableColumn prop="grade" label="等级" width="80" />
        <ElTableColumn prop="material" label="材质" width="100" />
        <ElTableColumn prop="quantity" label="数量" width="90" align="center" />
        <ElTableColumn prop="unit" label="单位" width="70" align="center" />
        <ElTableColumn prop="unitPrice" label="单价" width="120" align="right">
          <template #default="{ row }">
            {{ row.currency }} {{ row.unitPrice?.toFixed(2) }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="totalPrice" label="总价" width="120" align="right">
          <template #default="{ row }">
            {{ row.currency }} {{ row.totalPrice?.toFixed(2) }}
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>

    <!-- 付款信息 -->
    <ElCard class="art-card mb-4">
      <template #header>
        <div class="art-card-header">
          <div class="title">
            <h4>
              <Icon icon="ri:money-cny-circle-line" class="mr-2" />
              付款信息 / Payment Information
            </h4>
          </div>
        </div>
      </template>

      <ElDescriptions :column="3" border size="default">
        <ElDescriptionsItem label="币种">{{ piData.currency }}</ElDescriptionsItem>
        <ElDescriptionsItem label="总金额">
          <span class="text-primary font-medium">
            {{ piData.currency }} {{ piData.totalAmount?.toFixed(2) }}
          </span>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="已付金额">
          {{ piData.currency }} {{ piData.paidAmount?.toFixed(2) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="定金比例">{{ piData.depositPercent }}%</ElDescriptionsItem>
        <ElDescriptionsItem label="定金金额">
          {{ piData.currency }} {{ piData.depositAmount?.toFixed(2) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="尾款金额">
          {{ piData.currency }} {{ piData.balanceAmount?.toFixed(2) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="付款方式" :span="3">
          {{ piData.paymentTerms || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="定金截止日">{{
          piData.depositDueDate || '-'
        }}</ElDescriptionsItem>
        <ElDescriptionsItem label="尾款截止日">{{
          piData.balanceDueDate || '-'
        }}</ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>

    <!-- 银行信息 -->
    <ElCard class="art-card mb-4">
      <template #header>
        <div class="art-card-header">
          <div class="title">
            <h4>
              <Icon icon="ri:bank-line" class="mr-2" />
              银行信息 / BANK INFORMATIONS
            </h4>
          </div>
        </div>
      </template>

      <ElDescriptions :column="2" border size="default">
        <ElDescriptionsItem label="受益人">{{
          piData.beneficiary || bankInfo?.accountName || '-'
        }}</ElDescriptionsItem>
        <ElDescriptionsItem label="USD 账号">
          {{ piData.accountNumberUsd || bankInfo?.accountNumberUSD || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="RMB 账号">
          {{ piData.accountNumberRmb || bankInfo?.accountNumberRMB || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="开户行">{{
          piData.bankName || bankInfo?.bankName || '-'
        }}</ElDescriptionsItem>
        <ElDescriptionsItem label="银行地址" :span="2">
          {{ piData.bankAddress || bankInfo?.bankAddress || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="SWIFT 代码">{{
          piData.swiftCode || bankInfo?.swiftCode || '-'
        }}</ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>

    <!-- 交易条款 -->
    <ElCard class="art-card mb-4">
      <template #header>
        <div class="art-card-header">
          <div class="title">
            <h4>
              <Icon icon="ri:file-list-3-line" class="mr-2" />
              交易条款 / Terms & Conditions
            </h4>
          </div>
        </div>
      </template>

      <ElDescriptions :column="1" border size="default">
        <ElDescriptionsItem label="产品要求">
          {{ piData.productRequirement || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="包装条款">
          {{ piData.packageInfo || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="交货条款">
          {{ piData.deliveryTerm || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="付款条款">
          {{ piData.paymentTerm || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="报价有效期">
          {{ piData.validityPeriod || '-' }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Icon } from '@iconify/vue'
  import ArtPageHeader from '@/components/core/base/art-page-header/index.vue'
  import { ElImage } from 'element-plus'
  import { fetchGetPIDetail } from '@/api/trade-manage'

  defineOptions({ name: 'PIDetail' })

  const route = useRoute()
  const router = useRouter()

  // 返回 PI 列表或报价单详情页
  const handleBack = () => {
    const fromQuotation = route.query.fromQuotation === 'true'
    if (fromQuotation) {
      router.back()
    } else {
      router.push('/trade/pi')
    }
  }

  // 编辑 PI
  const handleEdit = () => {
    if (piData.value.id) {
      router.push(`/trade/pi/form/${piData.value.id}?fromDetail=true`)
    }
  }

  // 生成 PL
  const handleCreatePL = () => {
    if (!piData.value.id) return
    router.push({
      path: '/trade/pl/form',
      query: {
        fromPI: 'true',
        piId: piData.value.id
      }
    })
  }

  // 查看 PL
  const viewPL = () => {
    if (piData.value.plId) {
      router.push(`/trade/pl/detail/${piData.value.plId}?fromPI=true`)
    }
  }

  // 查看报价单
  const viewQuotation = () => {
    if (piData.value.quotationId) {
      router.push(`/trade/quotation/detail/${piData.value.quotationId}`)
    }
  }

  // 打印 PI
  const handlePrint = () => {
    // TODO: 实现打印功能
  }

  const piData = ref<Partial<Api.Trade.PIListItem>>({
    id: '',
    invoiceNo: '',
    piDate: '',
    quotationId: '',
    customerId: '',
    customerName: '',
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    companyPhone: '',
    consignee: '',
    deliveryAddress: '',
    contactPhone: '',
    contactEmail: '',
    tradeTerms: '',
    tradeCountry: '',
    portOfLoading: '',
    portOfDestination: '',
    deliveryDate: '',
    grossWeight: 0,
    netWeight: 0,
    totalVolume: 0,
    totalCartons: 0,
    products: [],
    currency: 'USD',
    totalAmount: 0,
    depositAmount: 0,
    depositPercent: 0,
    balanceAmount: 0,
    paymentTerms: '',
    depositDueDate: '',
    balanceDueDate: '',
    bankAccountId: '',
    status: '待付款',
    paidAmount: 0,
    countryOfOrigin: '',
    productRequirement: '',
    packageInfo: '',
    deliveryTerm: '',
    paymentTerm: '',
    validityPeriod: '',
    beneficiary: '',
    accountNumberUsd: '',
    accountNumberRmb: '',
    bankName: '',
    bankAddress: '',
    swiftCode: '',
    createTime: '',
    updateTime: '',
    createBy: '',
    updateBy: ''
  })

  const statusType = ref<'warning' | 'primary' | 'success' | 'info' | 'danger'>('warning')

  // 获取 bankInfo（兼容两种数据格式）
  const bankInfo = computed(() => {
    const data = piData.value as any
    return data.bankInfo || null
  })

  const loadPIDetail = async () => {
    const id = route.params.id as string
    try {
      const res = await fetchGetPIDetail(id)
      const data = res.data

      // 扁平化 bankInfo 对象到顶层字段
      piData.value = {
        ...data,
        beneficiary: data.bankInfo?.accountName || data.beneficiary,
        accountNumberUsd: data.bankInfo?.accountNumberUSD || data.accountNumberUsd,
        accountNumberRmb: data.bankInfo?.accountNumberRMB || data.accountNumberRmb,
        bankName: data.bankInfo?.bankName || data.bankName,
        bankAddress: data.bankInfo?.bankAddress || data.bankAddress,
        swiftCode: data.bankInfo?.swiftCode || data.swiftCode
      }
      setStatusType()
    } catch (error) {
      console.error('加载 PI 详情失败:', error)
    }
  }

  const setStatusType = () => {
    const statusMap: Record<string, 'warning' | 'primary' | 'success' | 'info' | 'danger'> = {
      待付款: 'warning',
      部分付款: 'primary',
      已付款: 'success',
      已取消: 'info'
    }
    statusType.value = statusMap[piData.value.status || '待付款'] || 'info'
  }

  onMounted(() => {
    loadPIDetail()
  })
</script>

<style lang="scss" scoped>
  .pi-detail-page {
    padding-bottom: 20px;

    :deep(.art-card-header) {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 600;

        h4 {
          display: flex;
          align-items: center;
          margin: 0;
        }
      }
    }

    :deep(.el-descriptions__label) {
      width: 120px;
      font-weight: 600;
    }

    :deep(.el-table) {
      font-size: 13px;

      th {
        font-weight: 600;
        background: var(--el-fill-color);
      }

      .product-image {
        cursor: pointer;
        transition: transform 0.2s;

        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
</style>
