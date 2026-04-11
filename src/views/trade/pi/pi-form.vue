<!-- PI 表单页面 -->
<template>
  <div class="pi-form-page">
    <ArtPageHeader :title="isEdit ? '编辑 PI' : '新增 PI'" @back="handleBack">
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
        label-width="110px"
        label-position="left"
        size="default"
      >
        <!-- 基本信息 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium">基本信息 / Basic Information</span>
        </ElDivider>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="发票号" prop="invoiceNo">
              <ElInput v-model="formData.invoiceNo" placeholder="请输入发票号">
                <template #append>
                  <ElButton @click="generatePIInvoiceNo">
                    <Icon icon="ri:refresh-line" />
                  </ElButton>
                </template>
              </ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="PI 日期" prop="piDate">
              <ElDatePicker
                v-model="formData.piDate"
                type="date"
                placeholder="请选择日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="关联报价单" prop="quotationId">
              <ElInput v-model="formData.quotationId" placeholder="请输入关联报价单 ID" disabled>
                <template #append>
                  <ElButton v-if="formData.quotationId" @click="viewQuotation">
                    <Icon icon="ri:eye-line" />
                  </ElButton>
                </template>
              </ElInput>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="客户名称" prop="customerName">
              <ElInput v-model="formData.customerName" placeholder="请输入客户名称" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="公司名称" prop="companyName">
              <ElInput v-model="formData.companyName" placeholder="请输入公司名称" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElFormItem label="公司地址" prop="companyAddress">
          <ElInput
            v-model="formData.companyAddress"
            type="textarea"
            :rows="2"
            placeholder="请输入公司地址"
          />
        </ElFormItem>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="公司邮箱" prop="companyEmail">
              <ElInput v-model="formData.companyEmail" placeholder="请输入公司邮箱" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="公司电话" prop="companyPhone">
              <ElInput v-model="formData.companyPhone" placeholder="请输入公司电话" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="客户邮箱" prop="contactEmail">
              <ElInput v-model="formData.contactEmail" placeholder="请输入客户邮箱" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="收货人" prop="consignee">
              <ElInput v-model="formData.consignee" placeholder="请输入收货人" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="联系电话" prop="contactPhone">
              <ElInput v-model="formData.contactPhone" placeholder="请输入联系电话" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="收货地址" prop="deliveryAddress">
              <ElInput v-model="formData.deliveryAddress" placeholder="请输入收货地址" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 贸易信息 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium">贸易信息 / Trade Information</span>
        </ElDivider>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="贸易条款" prop="tradeTerms">
              <ElSelect
                v-model="formData.tradeTerms"
                placeholder="请选择贸易条款"
                style="width: 100%"
              >
                <ElOption label="FOB" value="FOB" />
                <ElOption label="CIF" value="CIF" />
                <ElOption label="EXW" value="EXW" />
                <ElOption label="DDP" value="DDP" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="贸易国家" prop="tradeCountry">
              <ElInput v-model="formData.tradeCountry" placeholder="请输入贸易国家" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="装运港" prop="portOfLoading">
              <ElInput v-model="formData.portOfLoading" placeholder="请输入装运港" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="目的港" prop="portOfDestination">
              <ElInput v-model="formData.portOfDestination" placeholder="请输入目的港" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="交货期" prop="deliveryDate">
              <ElDatePicker
                v-model="formData.deliveryDate"
                type="date"
                placeholder="请选择交货期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="状态" prop="status">
              <ElSelect v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                <ElOption label="待付款" value="待付款" />
                <ElOption label="部分付款" value="部分付款" />
                <ElOption label="已付款" value="已付款" />
                <ElOption label="已取消" value="已取消" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 产品明细（只读） -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium">产品明细 / Products (只读)</span>
        </ElDivider>

        <ElTable :data="formData.products" border class="products-table" max-height="400">
          <ElTableColumn type="index" label="序号" width="60" align="center" />
          <ElTableColumn
            prop="productName"
            label="产品名称"
            min-width="150"
            show-overflow-tooltip
          />
          <ElTableColumn prop="spec" label="规格型号" width="120" show-overflow-tooltip />
          <ElTableColumn prop="type" label="类型" width="100" />
          <ElTableColumn prop="grade" label="等级" width="80" />
          <ElTableColumn prop="quantity" label="数量" width="90" align="center" />
          <ElTableColumn prop="unit" label="单位" width="70" align="center" />
          <ElTableColumn prop="unitPrice" label="单价" width="110" align="right">
            <template #default="{ row }">
              {{ formData.currency }} {{ row.unitPrice?.toFixed(2) }}
            </template>
          </ElTableColumn>
          <ElTableColumn prop="totalPrice" label="小计" width="110" align="right">
            <template #default="{ row }">
              {{ formData.currency }} {{ row.totalPrice?.toFixed(2) }}
            </template>
          </ElTableColumn>
        </ElTable>

        <!-- 物流信息 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium">物流信息 / Logistics Information</span>
        </ElDivider>

        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElFormItem label="总毛重 (kg)" prop="grossWeight">
              <ElInputNumber
                v-model="formData.grossWeight"
                :precision="2"
                style="width: 100%"
                readonly
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="总净重 (kg)" prop="netWeight">
              <ElInputNumber
                v-model="formData.netWeight"
                :precision="2"
                style="width: 100%"
                readonly
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="总体积 (CBM)" prop="totalVolume">
              <ElInputNumber
                v-model="formData.totalVolume"
                :precision="3"
                style="width: 100%"
                readonly
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="总箱数" prop="totalCartons">
              <ElInputNumber v-model="formData.totalCartons" style="width: 100%" readonly />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 付款信息 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium">付款信息 / Payment Information</span>
        </ElDivider>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="币种" prop="currency">
              <ElSelect v-model="formData.currency" placeholder="请选择币种" style="width: 100%">
                <ElOption label="USD" value="USD" />
                <ElOption label="EUR" value="EUR" />
                <ElOption label="RMB" value="RMB" />
                <ElOption label="GBP" value="GBP" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="总金额" prop="totalAmount">
              <ElInputNumber
                v-model="formData.totalAmount"
                :min="0"
                :precision="2"
                style="width: 100%"
                @change="calculatePayment"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="已付金额" prop="paidAmount">
              <ElInputNumber
                v-model="formData.paidAmount"
                :min="0"
                :precision="2"
                style="width: 100%"
                placeholder="已付金额"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="定金比例 (%)" prop="depositPercent">
              <ElInputNumber
                v-model="formData.depositPercent"
                :min="0"
                :max="100"
                style="width: 100%"
                @change="calculatePayment"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="定金金额" prop="depositAmount">
              <ElInputNumber
                v-model="formData.depositAmount"
                :min="0"
                :precision="2"
                style="width: 100%"
                readonly
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="尾款金额" prop="balanceAmount">
              <ElInputNumber
                v-model="formData.balanceAmount"
                :min="0"
                :precision="2"
                style="width: 100%"
                readonly
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="付款方式" prop="paymentTerms">
              <ElInput
                v-model="formData.paymentTerms"
                type="textarea"
                :rows="2"
                placeholder="30% 定金，70% 见提单副本"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="银行账户" prop="bankAccountId">
              <ElSelect
                v-model="formData.bankAccountId"
                placeholder="请选择银行账户"
                style="width: 100%"
              >
                <ElOption
                  v-for="bank in bankOptions"
                  :key="bank.id"
                  :label="bank.accountName"
                  :value="bank.id"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="定金截止日" prop="depositDueDate">
              <ElDatePicker
                v-model="formData.depositDueDate"
                type="date"
                placeholder="请选择日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="尾款截止日" prop="balanceDueDate">
              <ElDatePicker
                v-model="formData.balanceDueDate"
                type="date"
                placeholder="请选择日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 产品要求 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium">产品要求 / Product Requirement</span>
        </ElDivider>

        <ElRow :gutter="20">
          <ElCol :span="24">
            <ElFormItem label="产品要求" prop="productRequirement">
              <ElInput
                v-model="formData.productRequirement"
                type="textarea"
                :rows="2"
                placeholder="Use XIALONCUT brand"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="原产地" prop="countryOfOrigin">
              <ElInput v-model="formData.countryOfOrigin" placeholder="China" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 交易条款 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium">交易条款 / Terms & Conditions</span>
        </ElDivider>

        <ElRow :gutter="20">
          <ElCol :span="24">
            <ElFormItem label="包装条款" prop="packageInfo">
              <ElInput
                v-model="formData.packageInfo"
                type="textarea"
                :rows="2"
                placeholder="XIALONCUT brand package"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="24">
            <ElFormItem label="交货条款" prop="deliveryTerm">
              <ElInput
                v-model="formData.deliveryTerm"
                type="textarea"
                :rows="2"
                placeholder="3 days after receive 100% payment"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="24">
            <ElFormItem label="付款条款" prop="paymentTerm">
              <ElInput
                v-model="formData.paymentTerm"
                type="textarea"
                :rows="2"
                placeholder="100% T/T in advance"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="24">
            <ElFormItem label="报价有效期" prop="validityPeriod">
              <ElInput
                v-model="formData.validityPeriod"
                type="textarea"
                :rows="2"
                placeholder="This price is available within 7 days"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 银行信息 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium">银行信息 / BANK INFORMATIONS</span>
        </ElDivider>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="受益人" prop="beneficiary">
              <ElInput v-model="formData.beneficiary" placeholder="请输入受益人名称" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="USD 账号" prop="accountNumberUsd">
              <ElInput v-model="formData.accountNumberUsd" placeholder="请输入 USD 账号" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="RMB 账号" prop="accountNumberRmb">
              <ElInput v-model="formData.accountNumberRmb" placeholder="请输入 RMB 账号" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="开户行" prop="bankName">
              <ElInput v-model="formData.bankName" placeholder="请输入开户行名称" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="银行地址" prop="bankAddress">
              <ElInput
                v-model="formData.bankAddress"
                type="textarea"
                :rows="2"
                placeholder="请输入银行地址"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="SWIFT 代码" prop="swiftCode">
              <ElInput v-model="formData.swiftCode" placeholder="请输入 SWIFT 代码" />
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { Icon } from '@iconify/vue'
  import ArtPageHeader from '@/components/core/base/art-page-header/index.vue'
  import {
    fetchGetPIDetail,
    fetchGetQuotationDetail,
    fetchGetBankAccountList
  } from '@/api/trade-manage'
  import { getProductList } from '@/utils/storage/db'

  defineOptions({ name: 'PIForm' })

  const route = useRoute()
  const router = useRouter()

  const isEdit = computed(() => !!route.params.id)
  const isFromQuotation = computed(() => route.query.fromQuotation === 'true')

  const formRef = ref<FormInstance>()
  const loading = ref(false)

  // 银行账户选项
  const bankOptions = ref<Api.Trade.BankAccount[]>([])

  const formData = ref<Partial<Api.Trade.PIListItem>>({
    invoiceNo: '',
    piDate: new Date().toISOString().slice(0, 10),
    quotationId: '',
    customerName: '',
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    companyPhone: '',
    consignee: '',
    contactPhone: '',
    contactEmail: '',
    deliveryAddress: '',
    tradeTerms: 'FOB',
    tradeCountry: '',
    portOfLoading: '',
    portOfDestination: '',
    deliveryDate: '',
    currency: 'USD',
    totalAmount: 0,
    paidAmount: 0,
    depositPercent: 30,
    depositAmount: 0,
    balanceAmount: 0,
    paymentTerms: '',
    bankAccountId: '',
    depositDueDate: '',
    balanceDueDate: '',
    grossWeight: 0,
    netWeight: 0,
    totalVolume: 0,
    totalCartons: 0,
    status: '待付款',
    products: [],
    // 产品要求
    productRequirement: 'Use XIALONCUT brand',
    countryOfOrigin: 'China',
    // 交易条款
    packageInfo: 'XIALONCUT brand package',
    deliveryTerm: '3 days after receive 100% payment',
    paymentTerm: '100% T/T in advance',
    validityPeriod: 'This price is available within 7 days',
    // 银行信息
    beneficiary: '',
    accountNumberUsd: '',
    accountNumberRmb: '',
    bankName: '',
    bankAddress: '',
    swiftCode: ''
  })

  const formRules: FormRules = {
    invoiceNo: [{ required: true, message: '请输入发票号', trigger: 'blur' }],
    piDate: [{ required: true, message: '请选择 PI 日期', trigger: 'change' }],
    customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
    companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
    tradeTerms: [{ required: true, message: '请选择贸易条款', trigger: 'change' }],
    currency: [{ required: true, message: '请选择币种', trigger: 'change' }]
  }

  // 生成 PI 发票号
  const generatePIInvoiceNo = () => {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 900 + 100)
    formData.value.invoiceNo = `PI-${dateStr}-${random}`
    ElMessage.success('发票号已生成')
  }

  // 计算付款金额
  const calculatePayment = () => {
    const total = formData.value.totalAmount || 0
    const percent = formData.value.depositPercent || 0
    formData.value.depositAmount = total * (percent / 100)
    formData.value.balanceAmount = total - formData.value.depositAmount
  }

  // 计算物流信息
  const calculateLogistics = () => {
    const products = formData.value.products || []
    if (!products.length) return

    let totalGrossWeight = 0
    let totalNetWeight = 0
    let totalVolume = 0
    let totalCartons = 0

    products.forEach((product) => {
      // 计算该产品的总箱数
      const quantity = product.quantity || 0
      const cartonQty = product.cartonQuantity || 0
      const productCartons = cartonQty > 0 ? Math.ceil(quantity / cartonQty) : 0

      // 累加总箱数
      totalCartons += productCartons

      // 计算毛重和净重
      // 优先使用每箱毛重/净重，否则用单片重量计算
      if (product.grossWeight && product.grossWeight > 0) {
        // 有每箱毛重数据
        totalGrossWeight += product.grossWeight * productCartons
      } else if (product.singleWeight) {
        // 只有单片重量，尝试解析并计算
        const weightMatch = String(product.singleWeight).match(/([\d.]+)/)
        if (weightMatch) {
          const singleWeight = parseFloat(weightMatch[1]) // 单片重量（克）
          totalGrossWeight += (singleWeight * quantity) / 1000 // 转换为千克
        }
      }

      if (product.netWeight && product.netWeight > 0) {
        // 有每箱净重数据
        totalNetWeight += product.netWeight * productCartons
      } else if (product.singleWeight) {
        // 只有单片重量，尝试解析并计算
        const weightMatch = String(product.singleWeight).match(/([\d.]+)/)
        if (weightMatch) {
          const singleWeight = parseFloat(weightMatch[1]) // 单片重量（克）
          totalNetWeight += (singleWeight * quantity) / 1000 // 转换为千克
        }
      }

      // 计算体积
      if (product.cartonSize && productCartons > 0) {
        // 外箱尺寸格式如 "60x40x30cm" 或 "52×32×28cm"，计算体积
        const sizeMatch = String(product.cartonSize).match(/([\d.]+)[xX×*]([\d.]+)[xX×*]([\d.]+)/)
        if (sizeMatch) {
          const length = parseFloat(sizeMatch[1])
          const width = parseFloat(sizeMatch[2])
          const height = parseFloat(sizeMatch[3])
          // 计算单箱体积（立方米）
          const singleCBM = (length * width * height) / 1000000 // cm³ 转 m³
          totalVolume += singleCBM * productCartons
          console.log(`产品 ${product.productName} 体积计算:`, {
            cartonSize: product.cartonSize,
            productCartons,
            length,
            width,
            height,
            singleCBM,
            totalVolume
          })
        } else {
          console.warn(`无法解析外箱尺寸：${product.cartonSize}`)
        }
      } else if (product.totalCBM) {
        // 直接使用总 CBM
        totalVolume += product.totalCBM
      }
    })

    formData.value.grossWeight = parseFloat(totalGrossWeight.toFixed(2))
    formData.value.netWeight = parseFloat(totalNetWeight.toFixed(2))
    formData.value.totalVolume = parseFloat(totalVolume.toFixed(3))
    formData.value.totalCartons = totalCartons
  }

  // 补充产品数据（从产品库获取物流相关字段）
  const supplementProductSpecs = () => {
    const products = formData.value.products || []
    // 获取产品库数据
    const allProducts = getProductList()

    products.forEach((product: any) => {
      let matchedProduct = null

      // 1. 优先使用 productId/selectedProductId 匹配
      const productId = product.selectedProductId || product.productId
      if (productId) {
        matchedProduct = allProducts.find((p) => p.id === productId)
      }

      // 2. 如果找不到，尝试根据产品名称和规格匹配
      if (!matchedProduct) {
        matchedProduct = allProducts.find(
          (p) => p.name === product.productName && p.spec === product.spec
        )
      }

      // 3. 如果还找不到，尝试只根据规格匹配（产品名称可能不一致）
      if (!matchedProduct) {
        matchedProduct = allProducts.find((p) => p.spec === product.spec)
      }

      // 找到匹配的产品，补充物流相关字段
      if (matchedProduct) {
        product.cartonQuantity = matchedProduct.cartonQuantity
        product.blisterQuantity = matchedProduct.blisterQuantity
        product.innerBoxQuantity = matchedProduct.innerBoxQuantity
        product.singleWeight = matchedProduct.singleWeight
        product.cartonSize = matchedProduct.cartonSize
        product.grossWeight = matchedProduct.grossWeight
        product.netWeight = matchedProduct.netWeight
        console.log(`匹配到产品 ${product.productName}:`, matchedProduct)
      } else {
        console.warn(`未匹配到产品：${product.productName} (${product.spec})`)
      }
    })
  }

  // 查看报价单
  const viewQuotation = () => {
    if (formData.value.quotationId) {
      router.push(`/trade/quotation/detail/${formData.value.quotationId}`)
    }
  }

  // 加载银行账户列表
  const loadBankAccounts = async () => {
    try {
      const res = await fetchGetBankAccountList({ current: 1, size: 100 })
      bankOptions.value = (res.data as any)?.records || []
      // 设置默认账户
      const defaultAccount = bankOptions.value.find((bank) => bank.isDefault)
      if (defaultAccount && !formData.value.bankAccountId) {
        formData.value.bankAccountId = defaultAccount.id
      }
    } catch (error) {
      console.error('加载银行账户失败:', error)
    }
  }

  // 从报价单加载数据
  const loadQuotationData = async () => {
    const quotationId = route.query.quotationId as string
    if (!quotationId || !isFromQuotation.value) return

    try {
      const res = await fetchGetQuotationDetail(quotationId)
      const quotation = res.data

      // 转换报价单产品为 PI 产品格式
      const piProducts: Api.Trade.PIProduct[] = []
      quotation.products?.forEach((qp: any) => {
        piProducts.push({
          id: qp.id || Math.random().toString(36).substring(2),
          productId: qp.selectedProductId || '',
          productName: qp.name || '',
          spec: qp.spec || '',
          type: qp.type || '',
          grade: qp.grade || '',
          material: '',
          unit: qp.unit || 'PCS',
          quantity: qp.qty || 0,
          unitPrice: qp.price || 0,
          totalPrice: qp.total || 0,
          currency: qp.currency || quotation.currency || 'USD',
          cartonQuantity: qp.cartonQuantity || 0,
          singleWeight: qp.singleWeight || '',
          blisterQuantity: qp.blisterQuantity || 0,
          innerBoxQuantity: qp.innerBoxQuantity || 0,
          cartonSize: qp.cartonSize || '',
          grossWeight: qp.grossWeight || 0,
          netWeight: qp.netWeight || 0,
          totalCartons: 0,
          totalGW: 0,
          totalNW: 0,
          totalCBM: 0,
          mainImage: qp.image || '',
          remark: qp.remark || ''
        })
      })

      // 填充 PI 表单数据
      formData.value = {
        ...formData.value,
        // 基本信息
        invoiceNo: `PI-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 900 + 100)}`,
        quotationId: quotation.id,
        piDate: new Date().toISOString().slice(0, 10),

        // 客户信息
        customerId: quotation.customerId,
        customerName: quotation.customerName,
        consignee: quotation.customerName,
        contactPhone: quotation.clientWhatsapp || '',
        contactEmail: quotation.contactEmail || '',
        deliveryAddress: quotation.address || '',

        // 贸易信息
        tradeTerms: quotation.tradeTerm || 'FOB',
        tradeCountry: quotation.country || '',
        portOfLoading: quotation.shipmentPort || '',
        deliveryDate: quotation.leadTime || '',

        // 金额信息
        currency: quotation.currency || 'USD',
        totalAmount: quotation.costSummary?.grandTotal || 0,
        depositPercent: 30,
        status: '待付款',

        // 产品列表
        products: piProducts,

        // 产品要求
        productRequirement: 'Use XIALONCUT brand',
        countryOfOrigin: 'China'
      }

      // 计算付款金额
      calculatePayment()

      // 补充产品数据（从产品库获取物流字段）
      supplementProductSpecs()

      // 计算物流信息
      calculateLogistics()

      console.log('产品数据:', JSON.stringify(piProducts, null, 2))
      console.log('物流信息:', {
        grossWeight: formData.value.grossWeight,
        netWeight: formData.value.netWeight,
        totalVolume: formData.value.totalVolume,
        totalCartons: formData.value.totalCartons
      })

      ElMessage.success('已从报价单导入数据，请补充完整信息')
    } catch (error) {
      console.error('加载报价单数据失败:', error)
      ElMessage.error('加载报价单数据失败')
    }
  }

  const loadPIData = async () => {
    if (!isEdit.value) return

    const id = route.params.id as string
    try {
      const res = await fetchGetPIDetail(id)
      const data = res.data as Api.Trade.PIListItem

      // 扁平化 bankInfo 对象到表单字段
      formData.value = {
        ...data,
        // 从 bankInfo 对象中提取字段
        beneficiary: data.bankInfo?.accountName || data.beneficiary,
        accountNumberUsd: data.bankInfo?.accountNumberUSD || data.accountNumberUsd,
        accountNumberRmb: data.bankInfo?.accountNumberRMB || data.accountNumberRmb,
        bankName: data.bankInfo?.bankName || data.bankName,
        bankAddress: data.bankInfo?.bankAddress || data.bankAddress,
        swiftCode: data.bankInfo?.swiftCode || data.swiftCode
      }
    } catch {
      ElMessage.error('加载 PI 数据失败')
    }
  }

  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (!valid) return

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

  // 返回列表页或报价单详情页
  const handleBack = () => {
    const fromQuotation = route.query.fromQuotation === 'true'
    if (fromQuotation) {
      // 从报价单详情页来，返回报价单详情页
      router.back()
    } else {
      // 从 PI 列表来，返回 PI 列表
      router.push('/trade/pi')
    }
  }

  onMounted(async () => {
    await loadBankAccounts()
    if (isFromQuotation.value) {
      loadQuotationData()
    } else if (isEdit.value) {
      loadPIData()
    } else {
      generatePIInvoiceNo()
    }
  })

  // 监听产品明细变化，自动计算物流信息
  watch(
    () => formData.value.products,
    () => {
      calculateLogistics()
    },
    { deep: true }
  )
</script>

<style lang="scss" scoped>
  .pi-form-page {
    padding: 20px;
    background-color: var(--el-bg-color-page);

    :deep(.art-card) {
      margin-bottom: 20px;
    }
  }

  .products-table {
    margin-top: 16px;

    :deep(.el-table__header th) {
      font-size: 13px;
      font-weight: 600;
      background: var(--el-fill-color);
    }
  }
</style>
