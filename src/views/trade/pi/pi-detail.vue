<!-- PI 详情页面 -->
<template>
  <div class="pi-detail-page art-full-height">
    <ElCard class="art-card">
      <template #header>
        <ElSpace>
          <ElButton @click="$router.back()">返回</ElButton>
          <span class="text-lg font-medium">PI 详情</span>
        </ElSpace>
      </template>

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
        <ElTableColumn prop="sku" label="SKU" />
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

      <ElSpace class="mt-4">
        <ElButton type="primary" @click="$router.push(`/trade/pi/edit/${piData.id}`)"
          >编辑</ElButton
        >
        <ElButton type="success">打印 PI</ElButton>
      </ElSpace>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElTag } from 'element-plus'
  import { fetchGetPIDetail } from '@/api/trade-manage'

  defineOptions({ name: 'PIDetail' })

  const route = useRoute()

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
