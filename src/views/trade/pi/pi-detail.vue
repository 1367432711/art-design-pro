<!-- PI 详情页面 -->
<template>
  <div class="pi-detail-page art-full-height">
    <ArtPageHeader title="PI 详情" :status-text="piData.status" @back="handleBack">
      <ElSpace>
        <ElButton size="large" @click="handleEdit">
          <Icon icon="ri:pencil-line" class="mr-1" />
          编辑
        </ElButton>
        <ElButton size="large" type="primary" @click="handlePrint">
          <Icon icon="ri:print-line" class="mr-1" />
          打印
        </ElButton>
      </ElSpace>
    </ArtPageHeader>

    <ElCard class="art-card">
      <ElDescriptions :column="2" border>
        <ElDescriptionsItem label="发票号">{{ piData.invoiceNo }}</ElDescriptionsItem>
        <ElDescriptionsItem label="PI 日期">{{ piData.piDate }}</ElDescriptionsItem>
        <ElDescriptionsItem label="客户名称">{{ piData.customerName }}</ElDescriptionsItem>
        <ElDescriptionsItem label="公司名称">{{ piData.companyName }}</ElDescriptionsItem>
        <ElDescriptionsItem label="状态">
          <ElTag :type="statusType">{{ piData.status }}</ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="总金额">
          {{ piData.currency }} {{ piData.totalAmount?.toFixed(2) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="定金金额">
          {{ piData.depositAmount?.toFixed(2) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="尾款金额">
          {{ piData.balanceAmount?.toFixed(2) }}
        </ElDescriptionsItem>
      </ElDescriptions>

      <ElDivider>产品列表</ElDivider>

      <ElTable :data="piData.products" border>
        <ElTableColumn prop="productName" label="产品名称" />
        <ElTableColumn prop="spec" label="规格" />
        <ElTableColumn prop="quantity" label="数量" />
        <ElTableColumn prop="unitPrice" label="单价">
          <template #default="{ row }">
            {{ row.currency }} {{ row.unitPrice?.toFixed(2) }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="totalPrice" label="总价">
          <template #default="{ row }">
            {{ row.currency }} {{ row.totalPrice?.toFixed(2) }}
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Icon } from '@iconify/vue'
  import ArtPageHeader from '@/components/core/base/art-page-header/index.vue'
  import { fetchGetPIDetail } from '@/api/trade-manage'

  defineOptions({ name: 'PIDetail' })

  const route = useRoute()
  const router = useRouter()

  // 返回 PI 列表
  const handleBack = () => {
    router.push('/trade/pi')
  }

  // 编辑 PI
  const handleEdit = () => {
    if (piData.value.id) {
      router.push(`/trade/pi/form/${piData.value.id}`)
    }
  }

  // 打印 PI
  const handlePrint = () => {
    // TODO: 实现打印功能
  }

  const piData = ref<Api.Trade.PIListItem>({
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
    createTime: '',
    updateTime: '',
    createBy: '',
    updateBy: ''
  })

  const statusType = ref<'warning' | 'primary' | 'success' | 'info'>('warning')

  const loadPIDetail = async () => {
    const id = route.params.id as string
    try {
      const res = await fetchGetPIDetail(id)
      piData.value = res.data
      setStatusType()
    } catch (error) {
      console.error('加载 PI 详情失败:', error)
    }
  }

  const setStatusType = () => {
    const statusMap: Record<string, 'warning' | 'primary' | 'success' | 'info'> = {
      待付款: 'warning',
      部分付款: 'primary',
      已付款: 'success',
      已取消: 'info'
    }
    statusType.value = statusMap[piData.value.status] || 'info'
  }

  onMounted(() => {
    loadPIDetail()
  })
</script>
