<!-- PL 详情页面 -->
<template>
  <div class="pl-detail-page art-full-height">
    <ArtPageHeader title="PL 详情" :status-text="plData.status" @back="handleBack">
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
        <ElDescriptionsItem label="PL 编号">{{ plData.plNo }}</ElDescriptionsItem>
        <ElDescriptionsItem label="PL 日期">{{ plData.plDate }}</ElDescriptionsItem>
        <ElDescriptionsItem label="关联 PI">{{ plData.invoiceNo }}</ElDescriptionsItem>
        <ElDescriptionsItem label="客户名称">{{ plData.customerName }}</ElDescriptionsItem>
        <ElDescriptionsItem label="收货人">{{ plData.consignee }}</ElDescriptionsItem>
        <ElDescriptionsItem label="状态">
          <ElTag :type="statusType">{{ plData.status }}</ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="总数量">{{ plData.totalQuantity }}</ElDescriptionsItem>
        <ElDescriptionsItem label="总箱数">{{ plData.totalCartons }}</ElDescriptionsItem>
        <ElDescriptionsItem label="总净重">{{ plData.totalNW }} kg</ElDescriptionsItem>
        <ElDescriptionsItem label="总毛重">{{ plData.totalGW }} kg</ElDescriptionsItem>
        <ElDescriptionsItem label="总体积">{{ plData.totalCBM }} CBM</ElDescriptionsItem>
      </ElDescriptions>

      <ElDivider>产品包装明细</ElDivider>

      <ElTable :data="plData.products" border>
        <ElTableColumn prop="productName" label="产品名称" />
        <ElTableColumn prop="spec" label="规格" />
        <ElTableColumn prop="quantity" label="数量" />
        <ElTableColumn prop="cartons" label="箱数" />
        <ElTableColumn prop="nwPerCarton" label="每箱净重">
          <template #default="{ row }">{{ row.nwPerCarton }} kg</template>
        </ElTableColumn>
        <ElTableColumn prop="gwPerCarton" label="每箱毛重">
          <template #default="{ row }">{{ row.gwPerCarton }} kg</template>
        </ElTableColumn>
        <ElTableColumn prop="cbmPerCarton" label="每箱体积">
          <template #default="{ row }">{{ row.cbmPerCarton }} CBM</template>
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
  import { fetchGetPLDetail } from '@/api/trade-manage'

  defineOptions({ name: 'PLDetail' })

  const route = useRoute()
  const router = useRouter()

  // 返回 PL 列表
  const handleBack = () => {
    router.push('/trade/pl')
  }

  // 编辑 PL
  const handleEdit = () => {
    if (plData.value.id) {
      router.push(`/trade/pl/form/${plData.value.id}`)
    }
  }

  // 打印 PL
  const handlePrint = () => {
    // TODO: 实现打印功能
  }

  const plData = ref<Api.Trade.PLListItem>({
    id: '',
    invoiceNo: '',
    plNo: '',
    plDate: '',
    piId: '',
    customerId: '',
    customerName: '',
    companyName: '',
    companyAddress: '',
    consignee: '',
    products: [],
    totalQuantity: 0,
    totalCartons: 0,
    totalNW: 0,
    totalGW: 0,
    totalCBM: 0,
    status: '待发货',
    shippedQuantity: 0,
    createTime: '',
    updateTime: '',
    createBy: '',
    updateBy: ''
  })

  const statusType = ref<'warning' | 'primary' | 'success'>('warning')

  const loadPLDetail = async () => {
    const id = route.params.id as string
    try {
      const res = await fetchGetPLDetail(id)
      plData.value = res.data
      setStatusType()
    } catch (error) {
      console.error('加载 PL 详情失败:', error)
    }
  }

  const setStatusType = () => {
    const statusMap: Record<string, 'warning' | 'primary' | 'success'> = {
      待发货: 'warning',
      部分发货: 'primary',
      已发货: 'success'
    }
    statusType.value = statusMap[plData.value.status] || 'info'
  }

  onMounted(() => {
    loadPLDetail()
  })
</script>
