<!-- PL 表单页面 -->
<template>
  <div class="pl-form-page art-full-height">
    <ArtPageHeader :title="isEdit ? '编辑 PL' : '新增 PL'" @back="handleBack">
      <ElSpace>
        <ElButton type="primary" :loading="loading" size="large" @click="handleSubmit">
          <Icon icon="ri:save-line" class="mr-1" />
          保存
        </ElButton>
        <ElButton size="large" @click="handleBack">
          <Icon icon="ri:close-line" class="mr-1" />
          取消
        </ElButton>
      </ElSpace>
    </ArtPageHeader>

    <ElCard class="art-card mb-4">
      <ElForm
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="left"
      >
        <!-- 基本信息 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium">基本信息 / Basic Information</span>
        </ElDivider>

        <ElRow :gutter="24">
          <ElCol :span="8">
            <ElFormItem label="PL 编号" prop="plNo">
              <ElInput v-model="formData.plNo" placeholder="请输入 PL 编号">
                <template #append>
                  <ElButton @click="generatePLNo">
                    <Icon icon="ri:refresh-line" />
                  </ElButton>
                </template>
              </ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="PL 日期" prop="plDate">
              <ElDatePicker
                v-model="formData.plDate"
                type="date"
                placeholder="请选择日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="关联 PI" prop="piId">
              <ElInput v-model="formData.piId" placeholder="关联的 PI ID" disabled>
                <template #append>
                  <ElButton v-if="formData.piId" @click="viewPI">
                    <Icon icon="ri:eye-line" />
                  </ElButton>
                </template>
              </ElInput>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="24">
          <ElCol :span="8">
            <ElFormItem label="关联 PI 发票号" prop="invoiceNo">
              <ElInput v-model="formData.invoiceNo" placeholder="关联的 PI 发票号" disabled />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="客户名称" prop="customerName">
              <ElInput v-model="formData.customerName" placeholder="请输入客户名称" disabled />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="公司名称" prop="companyName">
              <ElInput v-model="formData.companyName" placeholder="请输入公司名称" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="24">
          <ElCol :span="12">
            <ElFormItem label="收货人" prop="consignee">
              <ElInput v-model="formData.consignee" placeholder="请输入收货人" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="公司地址" prop="companyAddress">
              <ElInput v-model="formData.companyAddress" placeholder="请输入公司地址" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 产品包装明细 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium">产品包装明细 / Packing Details</span>
        </ElDivider>

        <ElTable :data="formData.products" border class="products-table">
          <ElTableColumn type="index" label="序号" width="60" align="center" />
          <ElTableColumn prop="productName" label="产品名称" min-width="150" />
          <ElTableColumn prop="spec" label="规格型号" width="120" />
          <ElTableColumn prop="type" label="类型" width="100" />
          <ElTableColumn prop="unit" label="单位" width="70" align="center" />
          <ElTableColumn prop="quantity" label="数量" width="90" align="center" />
          <ElTableColumn prop="cartons" label="箱数" width="90" align="center">
            <template #default="{ row, $index }">
              <ElInputNumber
                v-model="row.cartons"
                :min="0"
                size="small"
                style="width: 80px"
                @change="calculateProductTotal($index)"
              />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="nwPerCarton" label="每箱净重 (kg)" width="110" align="center">
            <template #default="{ row, $index }">
              <ElInputNumber
                v-model="row.nwPerCarton"
                :min="0"
                :precision="2"
                size="small"
                style="width: 90px"
                @change="calculateProductTotal($index)"
              />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="gwPerCarton" label="每箱毛重 (kg)" width="110" align="center">
            <template #default="{ row, $index }">
              <ElInputNumber
                v-model="row.gwPerCarton"
                :min="0"
                :precision="2"
                size="small"
                style="width: 90px"
                @change="calculateProductTotal($index)"
              />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="cbmPerCarton" label="每箱体积 (CBM)" width="110" align="center">
            <template #default="{ row, $index }">
              <ElInputNumber
                v-model="row.cbmPerCarton"
                :min="0"
                :precision="3"
                size="small"
                style="width: 90px"
                @change="calculateProductTotal($index)"
              />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="totalNW" label="总净重" width="100" align="right">
            <template #default="{ row }">
              {{ row.totalNW?.toFixed(2) || '0.00' }}
            </template>
          </ElTableColumn>
          <ElTableColumn prop="totalGW" label="总毛重" width="100" align="right">
            <template #default="{ row }">
              {{ row.totalGW?.toFixed(2) || '0.00' }}
            </template>
          </ElTableColumn>
          <ElTableColumn prop="totalCBM" label="总体积" width="100" align="right">
            <template #default="{ row }">
              {{ row.totalCBM?.toFixed(3) || '0.000' }}
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="80" align="center" fixed="right">
            <template #default="{ $index }">
              <ElButton type="danger" size="small" @click="removeProduct($index)">
                <Icon icon="ri:delete-bin-line" />
              </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>

        <!-- 汇总信息 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium">汇总信息 / Summary</span>
        </ElDivider>

        <ElRow :gutter="24">
          <ElCol :span="6">
            <ElFormItem label="总数量" prop="totalQuantity">
              <ElInputNumber v-model="formData.totalQuantity" :precision="0" style="width: 100%" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="总箱数" prop="totalCartons">
              <ElInputNumber v-model="formData.totalCartons" :precision="0" style="width: 100%" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="总净重 (kg)" prop="totalNW">
              <ElInputNumber v-model="formData.totalNW" :precision="2" style="width: 100%" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="总毛重 (kg)" prop="totalGW">
              <ElInputNumber v-model="formData.totalGW" :precision="2" style="width: 100%" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="24">
          <ElCol :span="6">
            <ElFormItem label="总体积 (CBM)" prop="totalCBM">
              <ElInputNumber v-model="formData.totalCBM" :precision="3" style="width: 100%" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="已发货数量" prop="shippedQuantity">
              <ElInputNumber
                v-model="formData.shippedQuantity"
                :precision="0"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="状态" prop="status">
              <ElSelect v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                <ElOption label="待发货" value="待发货" />
                <ElOption label="部分发货" value="部分发货" />
                <ElOption label="已发货" value="已发货" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 备注 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium">备注 / Remarks</span>
        </ElDivider>

        <ElFormItem label="包装备注">
          <ElInput
            v-model="packingRemark"
            type="textarea"
            :rows="3"
            placeholder="请输入包装要求和备注"
          />
        </ElFormItem>
      </ElForm>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Icon } from '@iconify/vue'
  import ArtPageHeader from '@/components/core/base/art-page-header/index.vue'
  import { fetchGetPLDetail, fetchGetPIDetail } from '@/api/trade-manage'

  defineOptions({ name: 'PLForm' })

  const route = useRoute()
  const router = useRouter()

  const isEdit = computed(() => !!route.params.id)
  const isFromPI = computed(() => route.query.fromPI === 'true')

  const formRef = ref<FormInstance>()
  const loading = ref(false)
  const packingRemark = ref('')

  const formData = ref<Partial<Api.Trade.PLListItem>>({
    plNo: '',
    plDate: new Date().toISOString().slice(0, 10),
    piId: '',
    invoiceNo: '',
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
    shippedQuantity: 0
  })

  const formRules: FormRules = {
    plNo: [{ required: true, message: '请输入 PL 编号', trigger: 'blur' }],
    plDate: [{ required: true, message: '请选择 PL 日期', trigger: 'change' }],
    piId: [{ required: true, message: '请关联 PI', trigger: 'change' }]
  }

  // 生成 PL 编号
  const generatePLNo = () => {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 900 + 100)
    const plNo = `PL-${dateStr}-${random}`
    formData.value.plNo = plNo
    ElMessage.success('PL 编号已生成')
    return plNo
  }

  // 计算产品总计
  const calculateProductTotal = (index: number) => {
    const product = formData.value.products?.[index]
    if (product) {
      product.totalNW = (product.cartons || 0) * (product.nwPerCarton || 0)
      product.totalGW = (product.cartons || 0) * (product.gwPerCarton || 0)
      product.totalCBM = (product.cartons || 0) * (product.cbmPerCarton || 0)
    }
    calculateSummary()
  }

  // 计算汇总信息
  const calculateSummary = () => {
    const products = formData.value.products || []
    formData.value.totalCartons = products.reduce((sum, p) => sum + (p.cartons || 0), 0)
    formData.value.totalNW = products.reduce((sum, p) => sum + (p.totalNW || 0), 0)
    formData.value.totalGW = products.reduce((sum, p) => sum + (p.totalGW || 0), 0)
    formData.value.totalCBM = products.reduce((sum, p) => sum + (p.totalCBM || 0), 0)
    formData.value.totalQuantity = products.reduce((sum, p) => sum + (p.quantity || 0), 0)
  }

  // 移除产品
  const removeProduct = (index: number) => {
    ElMessageBox.confirm('确定要删除该产品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      formData.value.products?.splice(index, 1)
      calculateSummary()
      ElMessage.success('删除成功')
    })
  }

  // 查看 PI
  const viewPI = () => {
    if (formData.value.piId) {
      router.push(`/trade/pi/detail/${formData.value.piId}`)
    }
  }

  // 从 PI 加载数据
  const loadPIData = async () => {
    const piId = route.query.piId as string
    if (!piId || !isFromPI.value) return

    try {
      const res = await fetchGetPIDetail(piId)
      const pi = res.data

      // 转换 PI 产品为 PL 产品格式
      const plProducts: Api.Trade.PLProduct[] =
        pi.products?.map((piProduct) => ({
          id: Math.random().toString(36).substr(2),
          piProductId: piProduct.id,
          productId: piProduct.productId || '',
          productName: piProduct.productName,
          spec: piProduct.spec,
          type: piProduct.type,
          unit: piProduct.unit || 'PCS',
          quantity: piProduct.quantity || 0,
          cartons: 0,
          nwPerCarton: piProduct.netWeight || 0,
          gwPerCarton: piProduct.grossWeight || 0,
          cbmPerCarton: 0,
          totalNW: 0,
          totalGW: 0,
          totalCBM: 0,
          remark: piProduct.remark || ''
        })) || []

      // 填充 PL 表单数据
      formData.value = {
        ...formData.value,
        plNo: generatePLNo(),
        piId: pi.id,
        invoiceNo: pi.invoiceNo,
        customerId: pi.customerId,
        customerName: pi.customerName,
        companyName: pi.companyName,
        companyAddress: pi.companyAddress,
        consignee: pi.consignee,
        products: plProducts
      }

      ElMessage.success('已从 PI 导入数据，请填写包装明细')
    } catch (error) {
      console.error('加载 PI 数据失败:', error)
      ElMessage.error('加载 PI 数据失败')
    }
  }

  const loadPLData = async () => {
    if (!isEdit.value) return

    const id = route.params.id as string
    try {
      const res = await fetchGetPLDetail(id)
      formData.value = { ...res.data }
    } catch {
      ElMessage.error('加载 PL 数据失败')
    }
  }

  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (!valid) return

      // 验证产品数据
      if (!formData.value.products || formData.value.products.length === 0) {
        ElMessage.warning('请至少添加一个产品')
        return
      }

      loading.value = true
      try {
        // TODO: 调用保存 API
        ElMessage.success('保存成功')
        handleBack()
      } catch {
        ElMessage.error('保存失败')
      } finally {
        loading.value = false
      }
    })
  }

  // 返回列表页或 PI 详情页
  const handleBack = () => {
    const fromPI = route.query.fromPI === 'true'
    if (fromPI) {
      // 从 PI 详情页来，返回 PI 详情页
      router.back()
    } else {
      // 从 PL 列表来，返回 PL 列表
      router.push('/trade/pl')
    }
  }

  onMounted(() => {
    if (isFromPI.value) {
      loadPIData()
    } else if (isEdit.value) {
      loadPLData()
    } else {
      generatePLNo()
    }
  })
</script>

<style lang="scss" scoped>
  .products-table {
    margin-top: 16px;

    :deep(.el-table__header th) {
      font-size: 13px;
      font-weight: 600;
      background: var(--el-fill-color);
    }
  }
</style>
