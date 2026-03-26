<!-- 报价新增/编辑页面 -->
<template>
  <div class="quotation-form-page">
    <!-- 页头 -->
    <ElPageHeader class="mb-3" @back="handleBack">
      <template #content>
        <span class="text-lg font-medium text-g-800">{{ isEdit ? '编辑报价' : '新增报价' }}</span>
      </template>
    </ElPageHeader>

    <ElCard class="art-card-xs">
      <ElForm ref="formRef" :model="formData" label-width="120px" size="default">
        <!-- 1. 公司信息 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium text-g-500">
            <ArtSvgIcon icon="ri:building-line" class="mr-1" />
            公司信息 / Company Information
          </span>
        </ElDivider>

        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElFormItem label="公司 Logo">
              <ElUpload
                :file-list="companyLogoFileList"
                :limit="1"
                accept="image/*"
                :before-upload="handleLogoBeforeUpload"
                :on-change="handleLogoChange"
                :on-remove="handleLogoRemove"
                :show-file-list="false"
              >
                <div
                  v-if="!formData.companyInfo?.companyLogo"
                  class="logo-upload-area w-[120px] h-[120px] border-2 border-dashed border-g-200 rounded-xl flex items-center justify-center cursor-pointer relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 hover:border-primary hover:shadow-md tad-200"
                >
                  <ArtSvgIcon icon="ri:upload-line" class="text-3xl mb-2 block text-g-300" />
                  <span class="text-sm text-g-400">点击上传</span>
                </div>
                <img
                  v-else
                  :src="formData.companyInfo.companyLogo"
                  class="w-[120px] h-[120px] object-contain rounded-xl"
                />
              </ElUpload>
            </ElFormItem>
          </ElCol>
          <ElCol :span="18">
            <ElRow :gutter="16">
              <ElCol :span="8">
                <ElFormItem label="公司名称" prop="companyInfo.companyName">
                  <ElInput
                    v-model="formData.companyInfo!.companyName"
                    placeholder="YOUR COMPANY LLC"
                  />
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem label="联系人" prop="companyInfo.contactName">
                  <ElInput v-model="formData.companyInfo!.contactName" placeholder="JOHN DOE" />
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem label="WhatsApp" prop="companyInfo.companyWhatsapp">
                  <ElInput
                    v-model="formData.companyInfo!.companyWhatsapp"
                    placeholder="+1 (234) 567-8900"
                  />
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow :gutter="16">
              <ElCol :span="8">
                <ElFormItem label="邮箱" prop="companyInfo.companyEmail">
                  <ElInput
                    v-model="formData.companyInfo!.companyEmail"
                    placeholder="contact@yourcompany.com"
                  />
                </ElFormItem>
              </ElCol>
              <ElCol :span="16">
                <ElFormItem label="地址" prop="companyInfo.companyAddress">
                  <ElInput
                    v-model="formData.companyInfo!.companyAddress"
                    placeholder="123 Business Avenue, City, Country"
                  />
                </ElFormItem>
              </ElCol>
            </ElRow>
          </ElCol>
        </ElRow>

        <!-- 2. 报价单信息 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium text-g-500">
            <ArtSvgIcon icon="ri:file-text-line" class="mr-1" />
            报价单信息 / Quotation Information
          </span>
        </ElDivider>

        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElFormItem label="报价单号" prop="quotationNo">
              <ElInput v-model="formData.quotationNo" disabled placeholder="系统自动生成" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="报价日期" prop="quotationDate">
              <ElDatePicker
                v-model="formData.quotationDate"
                type="date"
                placeholder="请选择"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="有效期至" prop="validity">
              <ElDatePicker
                v-model="formData.validity"
                type="date"
                placeholder="请选择"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="币种" prop="currency">
              <ElSelect v-model="formData.currency" placeholder="请选择" style="width: 100%">
                <ElOption label="USD - 美元" value="USD" />
                <ElOption label="EUR - 欧元" value="EUR" />
                <ElOption label="CNY - 人民币" value="CNY" />
                <ElOption label="GBP - 英镑" value="GBP" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElFormItem label="贸易条款" prop="tradeTerm">
              <ElSelect v-model="formData.tradeTerm" placeholder="请选择" style="width: 100%">
                <ElOption label="FOB - 装运港船上交货" value="FOB" />
                <ElOption label="CIF - 成本加保险费加运费" value="CIF" />
                <ElOption label="EXW - 工厂交货" value="EXW" />
                <ElOption label="CNF - 成本加运费" value="CNF" />
                <ElOption label="DDP - 完税后交货" value="DDP" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="装运港/目的地" prop="shipmentPort">
              <ElInput v-model="formData.shipmentPort" placeholder="Shanghai, China" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="付款方式" prop="paymentTerm">
              <ElSelect v-model="formData.paymentTerm" placeholder="请选择" style="width: 100%">
                <ElOption label="T/T - 电汇" value="T/T" />
                <ElOption label="L/C - 信用证" value="L/C" />
                <ElOption label="PayPal" value="PayPal" />
                <ElOption label="Western Union - 西联汇款" value="Western Union" />
                <ElOption
                  label="30% 定金，70% 发货前付清"
                  value="30% Deposit, 70% before shipment"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="交货期" prop="leadTime">
              <ElInput v-model="formData.leadTime" placeholder="15-20 days" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElFormItem label="客户名称" prop="customerName">
              <ElSelect
                v-model="formData.customerName"
                placeholder="请选择客户"
                filterable
                @change="handleCustomerChange"
                style="width: 100%"
              >
                <ElOption
                  v-for="customer in customerOptions"
                  :key="customer.id"
                  :label="customer.customerName"
                  :value="customer.customerName"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="客户 WhatsApp" prop="clientWhatsapp">
              <ElInput v-model="formData.clientWhatsapp" placeholder="+1 (234) 567-8901" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="客户邮箱" prop="clientEmail">
              <ElInput v-model="formData.clientEmail" placeholder="client@example.com" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 3. 产品列表 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium text-g-500">
            <ArtSvgIcon icon="ri:package-line" class="mr-1" />
            产品列表 / Products
          </span>
        </ElDivider>

        <div class="products-container">
          <div
            v-for="(product, pIndex) in formData.products"
            :key="product.id"
            class="product-card"
          >
            <div class="product-header">
              <div class="flex-c gap-3">
                <span class="px-3 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-xl">{{
                  pIndex + 1
                }}</span>
                <span class="font-bold text-g-700">产品</span>
              </div>
              <ElSpace>
                <!-- 从产品库选择 -->
                <ElSelect
                  v-model="product.selectedProductId"
                  placeholder="从产品库选择..."
                  filterable
                  clearable
                  @change="(val) => handleProductSelect(val, pIndex)"
                  style="width: 200px"
                >
                  <ElOption
                    v-for="opt in productOptions"
                    :key="opt.id"
                    :label="opt.name + ' - ' + opt.spec"
                    :value="opt.id"
                  >
                    <span class="font-medium">{{ opt.name }}</span>
                    <span class="text-g-400 ml-2">{{ opt.spec }}</span>
                    <span class="text-primary ml-2">{{
                      formatPrice(opt.salePrice, opt.currency)
                    }}</span>
                  </ElOption>
                </ElSelect>
                <ElButton
                  type="danger"
                  link
                  @click="removeProduct(pIndex)"
                  v-if="formData.products.length > 1"
                >
                  <ArtSvgIcon icon="ri:delete-bin-line" class="mr-1" />
                  删除产品
                </ElButton>
              </ElSpace>
            </div>

            <!-- 产品变体列表 -->
            <div class="product-variants">
              <div
                v-for="(variant, vIndex) in product.variants"
                :key="variant.id"
                class="variant-card"
              >
                <div class="variant-header">
                  <div class="flex-c gap-2">
                    <span
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full"
                    >
                      变体 {{ vIndex + 1 }}
                    </span>
                    <span v-if="variant.sku" class="text-xs text-g-400">|</span>
                    <span v-if="variant.sku" class="text-sm font-medium text-g-600">{{
                      variant.sku
                    }}</span>
                  </div>
                  <ElButton
                    v-if="product.variants.length > 1"
                    type="danger"
                    link
                    @click="removeVariant(pIndex, vIndex)"
                  >
                    <ArtSvgIcon icon="ri:delete-bin-line" />
                  </ElButton>
                </div>

                <div class="variant-content">
                  <!-- 图片上传 -->
                  <ElUpload
                    :file-list="variantImageFileLists[getVariantKey(pIndex, vIndex)] || []"
                    :limit="1"
                    accept="image/*"
                    :show-file-list="false"
                    :before-upload="handleVariantBeforeUpload"
                    :on-change="(uploadFile) => handleVariantChange(uploadFile, pIndex, vIndex)"
                    :on-remove="() => handleVariantRemove(pIndex, vIndex)"
                  >
                    <div
                      v-if="!variant.image"
                      class="variant-image-upload w-[160px] h-[160px] border-2 border-dashed border-g-200 rounded-xl flex items-center justify-center cursor-pointer relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 hover:border-primary hover:shadow-md tad-200 flex-shrink-0"
                    >
                      <ArtSvgIcon icon="ri:upload-2-line" class="text-3xl mb-2 block text-g-300" />
                      <span class="text-sm text-g-400">上传图片</span>
                    </div>
                    <img
                      v-else
                      :src="variant.image"
                      class="w-[160px] h-[160px] object-cover rounded-xl"
                    />
                  </ElUpload>

                  <!-- 变体信息 -->
                  <div class="variant-info flex-1">
                    <ElRow :gutter="12">
                      <ElCol :span="12">
                        <ElFormItem label="SKU / 型号">
                          <ElInput
                            v-model="variant.sku"
                            placeholder="ABC-123"
                            @input="updateVariantTotal(pIndex, vIndex)"
                          />
                        </ElFormItem>
                      </ElCol>
                      <ElCol :span="12">
                        <ElFormItem label="单位">
                          <ElSelect
                            v-model="variant.unit"
                            placeholder="请选择"
                            style="width: 100%"
                            @change="updateVariantTotal(pIndex, vIndex)"
                          >
                            <ElOption label="PCS - 个/件" value="PCS" />
                            <ElOption label="SET - 套" value="SET" />
                            <ElOption label="KG - 千克" value="KG" />
                            <ElOption label="BOX - 箱" value="BOX" />
                            <ElOption label="CTN - 箱" value="CTN" />
                            <ElOption label="PAIR - 双/对" value="PAIR" />
                            <ElOption label="DOZEN - 打" value="DOZEN" />
                          </ElSelect>
                        </ElFormItem>
                      </ElCol>
                    </ElRow>
                    <ElFormItem label="产品描述">
                      <ElInput
                        v-model="variant.desc"
                        type="textarea"
                        :rows="2"
                        placeholder="输入产品规格、颜色、材质等详细描述..."
                        @input="updateVariantTotal(pIndex, vIndex)"
                      />
                    </ElFormItem>
                    <ElRow :gutter="12">
                      <ElCol :span="12">
                        <ElFormItem label="数量">
                          <ElInputNumber
                            v-model="variant.qty"
                            :min="0"
                            :precision="0"
                            placeholder="0"
                            controls-position="right"
                            style="width: 100%"
                            @change="updateVariantTotal(pIndex, vIndex)"
                          />
                        </ElFormItem>
                      </ElCol>
                      <ElCol :span="12">
                        <ElFormItem label="单价">
                          <ElInputNumber
                            v-model="variant.price"
                            :min="0"
                            :precision="2"
                            placeholder="0.00"
                            controls-position="right"
                            style="width: 100%"
                            @change="updateVariantTotal(pIndex, vIndex)"
                          />
                        </ElFormItem>
                      </ElCol>
                    </ElRow>
                    <div class="variant-total">
                      <span class="text-sm text-g-500">小计：</span>
                      <strong class="text-lg font-bold text-g-800">{{
                        formatAmount(variant.total || 0, formData.currency)
                      }}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 添加变体按钮 -->
              <ElButton type="primary" plain @click="addVariant(pIndex)" class="mt-3">
                <ArtSvgIcon icon="ri:add-line" class="mr-1" />
                添加变体
              </ElButton>
            </div>
          </div>

          <!-- 添加产品按钮 -->
          <ElButton type="primary" @click="addProduct" class="mt-4">
            <ArtSvgIcon icon="ri:add-circle-line" class="mr-1" />
            添加产品
          </ElButton>
        </div>

        <!-- 4. 费用汇总 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium text-g-500">
            <ArtSvgIcon icon="ri:calculator-line" class="mr-1" />
            费用汇总 / Cost Summary
          </span>
        </ElDivider>

        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElFormItem label="运费">
              <ElInputNumber
                v-model="formData.costSummary!.freightCharges"
                :min="0"
                :precision="2"
                placeholder="0.00"
                controls-position="right"
                style="width: 100%"
                @change="calculateGrandTotal"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="折扣">
              <div class="flex gap-2">
                <ElInputNumber
                  v-model="formData.costSummary!.discountValue"
                  :min="0"
                  :precision="2"
                  placeholder="0"
                  controls-position="right"
                  style="width: 100%"
                  @change="calculateGrandTotal"
                />
                <ElSelect
                  v-model="formData.costSummary!.discountType"
                  style="width: 80px"
                  @change="calculateGrandTotal"
                >
                  <ElOption label="%" value="percent" />
                  <ElOption label="固定" value="fixed" />
                </ElSelect>
              </div>
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="税费">
              <ElInputNumber
                v-model="formData.costSummary!.taxValue"
                :min="0"
                :precision="2"
                placeholder="0.00"
                controls-position="right"
                style="width: 100%"
                @change="calculateGrandTotal"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="其他费用">
              <ElInputNumber
                v-model="formData.costSummary!.otherCharges"
                :min="0"
                :precision="2"
                placeholder="0.00"
                controls-position="right"
                style="width: 100%"
                @change="calculateGrandTotal"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 总计显示 -->
        <div class="cost-summary-display mt-4 p-3 bg-g-50 rounded-lg border border-g-100">
          <div class="flex-b items-center">
            <div class="flex gap-4">
              <div class="bg-primary-light/50 rounded-lg px-4 py-2">
                <span class="text-xs text-g-500">产品小计：</span>
                <span class="text-base font-bold text-g-800">{{
                  formatAmount(formData.costSummary!.subtotal, formData.currency)
                }}</span>
              </div>
              <div class="bg-red-50 rounded-lg px-4 py-2">
                <span class="text-xs text-g-500">折扣金额：</span>
                <span class="text-base font-bold text-red-500"
                  >-{{ formatAmount(getDiscountAmount(), formData.currency) }}</span
                >
              </div>
            </div>
            <div
              class="text-right bg-gradient-to-r from-primary/10 to-primaryDark/10 rounded-lg px-5 py-2"
            >
              <span class="text-xs text-g-500">总计：</span>
              <span
                class="text-lg font-bold bg-gradient-to-r from-primary to-primaryDark bg-clip-text text-transparent"
                >{{ formatAmount(formData.costSummary!.grandTotal, formData.currency) }}</span
              >
            </div>
          </div>
        </div>

        <!-- 5. 其他信息 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium text-g-500">
            <ArtSvgIcon icon="ri:information-line" class="mr-1" />
            其他信息 / Other Information
          </span>
        </ElDivider>

        <div class="other-info-container">
          <div
            v-for="(field, index) in formData.otherInfoFields"
            :key="field.id"
            class="info-field"
          >
            <div class="flex-b items-center mb-2">
              <ElInput
                v-model="field.label"
                placeholder="字段名称"
                class="w-[180px]"
                @input="saveDraft"
              />
              <ElButton
                v-if="formData.otherInfoFields!.length > 1"
                type="danger"
                link
                @click="removeInfoField(index)"
              >
                <ArtSvgIcon icon="ri:delete-bin-line" />
              </ElButton>
            </div>
            <ElInput
              v-model="field.value"
              type="textarea"
              :rows="2"
              placeholder="输入内容..."
              @input="saveDraft"
            />
          </div>
          <ElButton @click="addInfoField" class="mt-3">
            <ArtSvgIcon icon="ri:add-line" class="mr-1" />
            添加字段
          </ElButton>
        </div>
      </ElForm>
    </ElCard>

    <!-- 悬浮操作栏 -->
    <div class="floating-action-bar">
      <ElSpace>
        <ElButton @click="saveDraft">
          <ArtSvgIcon icon="ri:file-save-line" class="mr-1" />
          保存草稿
        </ElButton>
        <ElButton type="primary" @click="submitQuotation">
          <ArtSvgIcon icon="ri:send-plane-fill" class="mr-1" />
          提交报价
        </ElButton>
        <ElButton @click="openPreview">
          <ArtSvgIcon icon="ri:eye-line" class="mr-1" />
          预览
        </ElButton>
      </ElSpace>
    </div>

    <!-- 预览弹窗 -->
    <QuotationPreview v-model="previewVisible" :data="previewData" />
  </div>
</template>

<script setup lang="ts">
  import type { FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'
  import { useRouter, useRoute } from 'vue-router'
  import { fetchGetCustomerList, fetchGetProductList } from '@/api/trade-manage'
  import { fetchGetQuotationDetail } from '@/api/trade-manage'
  import QuotationPreview from './modules/quotation-preview.vue'

  defineOptions({ name: 'QuotationForm' })

  const router = useRouter()
  const route = useRoute()

  const isEdit = computed(() => !!route.params.id)

  // 表单实例
  const formRef = ref<FormInstance>()

  // 预览弹窗
  const previewVisible = ref(false)

  // 公司 Logo 文件列表
  const companyLogoFileList = ref<any[]>([])

  // 变体图片文件列表 (按 productIndex-variantIndex 映射)
  const variantImageFileLists = ref<Record<string, any[]>>({})

  // 客户列表
  const customerOptions = ref<Api.Trade.CustomerListItem[]>([])

  // 产品列表
  const productOptions = ref<Api.Trade.ProductListItem[]>([])

  // 表单数据
  const formData = ref<Api.Trade.QuotationDetail>({
    id: '',
    customerId: '',
    customerName: '',
    quotationNo: '',
    productName: '',
    specification: '',
    quantity: 0,
    unit: 'PCS',
    unitPrice: 0,
    currency: 'USD',
    totalPrice: 0,
    tradeTerm: '',
    paymentTerm: '',
    validity: '',
    remarks: '',
    status: '1',
    quotationDate: '',
    createTime: '',
    updateBy: '',
    updateTime: '',
    // 公司信息
    companyInfo: {
      companyName: 'YOUR COMPANY LLC',
      contactName: 'JOHN DOE',
      companyAddress: '123 Business Avenue, City, Country',
      companyEmail: 'contact@yourcompany.com',
      companyWhatsapp: '+1 (234) 567-8900',
      companyLogo: ''
    },
    // 客户信息
    clientWhatsapp: '',
    clientEmail: '',
    // 产品列表
    products: [],
    // 费用汇总
    costSummary: {
      freightCharges: 0,
      discountValue: 0,
      discountType: 'percent',
      taxValue: 0,
      otherCharges: 0,
      subtotal: 0,
      grandTotal: 0
    },
    // 其他信息字段
    otherInfoFields: [
      {
        id: 'paymentTerms',
        label: '付款条款',
        value:
          'We accept payments via bank transfer, PayPal, or credit card. 50% deposit required before production.'
      },
      {
        id: 'warrantyInfo',
        label: '质保信息',
        value: 'All products come with 12-month warranty. Quality assurance guaranteed.'
      }
    ]
  })

  // 预览数据（计算属性）
  const previewData = computed(() => formData.value)

  // 货币符号映射
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    CNY: '¥',
    GBP: '£'
  }

  // 格式化金额
  const formatAmount = (amount: number, currency: string) => {
    const symbol = currencySymbols[currency] || currency
    return `${symbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }

  // 格式化价格（用于产品选择下拉框）
  const formatPrice = (price: number, currency: string = 'USD') => {
    const symbol = currencySymbols[currency] || currency
    return `${symbol}${price.toFixed(2)}`
  }

  // 处理产品选择（从产品库）
  const handleProductSelect = (productId: string, productIndex: number) => {
    if (!productId) return
    const product = productOptions.value.find((p) => p.id === productId)
    if (!product) return

    const quotationProduct = formData.value.products[productIndex]
    // 填充产品信息到变体
    quotationProduct.variants = [
      {
        id: Date.now().toString(),
        sku: product.sku || '',
        desc: `${product.name} - ${product.spec}${product.material ? ' - ' + product.material : ''}`,
        qty: product.moq || 1,
        unit: product.unit || 'PCS',
        price: product.salePrice || 0,
        total: (product.moq || 1) * (product.salePrice || 0),
        image: product.mainImage || ''
      }
    ]
    calculateGrandTotal()
    saveDraft()
  }

  // 获取折扣金额
  const getDiscountAmount = () => {
    const { discountValue, discountType, subtotal } = formData.value.costSummary!
    if (discountType === 'percent') {
      return subtotal * (discountValue / 100)
    }
    return discountValue
  }

  // 生成报价单号（用于显示）
  const generateQuotationNo = () => {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 900 + 100)
    return `QT${dateStr}${random}`
  }

  // 加载客户列表
  const loadCustomers = async () => {
    try {
      const res = await fetchGetCustomerList({ current: 1, size: 100 })
      customerOptions.value = (res.data as any)?.records || []
      // 如果是新增模式，生成报价单号
      if (!isEdit.value && !formData.value.quotationNo) {
        formData.value.quotationNo = generateQuotationNo()
      }
    } catch (error) {
      console.error('加载客户列表失败:', error)
    }
  }

  // 加载产品列表
  const loadProducts = async () => {
    try {
      const res = await fetchGetProductList({ current: 1, size: 100 })
      productOptions.value = (res.data as any)?.records || []
    } catch (error) {
      console.error('加载产品列表失败:', error)
    }
  }

  // 获取变体键值
  const getVariantKey = (productIndex: number, variantIndex: number) => {
    return `${productIndex}-${variantIndex}`
  }

  // 处理 Logo 上传前
  const handleLogoBeforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      ElMessage.error('只能上传图片文件')
      return false
    }
    return true
  }

  // 处理 Logo 上传
  const handleLogoChange = (uploadFile: any) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (formData.value.companyInfo) {
        formData.value.companyInfo.companyLogo = event.target?.result as string
      }
      saveDraft()
    }
    reader.readAsDataURL(uploadFile.raw)
  }

  // 处理 Logo 移除
  const handleLogoRemove = () => {
    if (formData.value.companyInfo) {
      formData.value.companyInfo.companyLogo = ''
    }
    companyLogoFileList.value = []
    saveDraft()
  }

  // 处理变体图片上传前
  const handleVariantBeforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      ElMessage.error('只能上传图片文件')
      return false
    }
    return true
  }

  // 处理变体图片上传
  const handleVariantChange = (uploadFile: any, productIndex: number, variantIndex: number) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const product = formData.value.products[productIndex]
      const variant = product.variants[variantIndex]
      variant.image = event.target?.result as string
      saveDraft()
    }
    reader.readAsDataURL(uploadFile.raw)
  }

  // 处理变体图片移除
  const handleVariantRemove = (productIndex: number, variantIndex: number) => {
    const product = formData.value.products[productIndex]
    const variant = product.variants[variantIndex]
    variant.image = ''
    const key = getVariantKey(productIndex, variantIndex)
    variantImageFileLists.value[key] = []
    saveDraft()
  }

  // 处理客户选择
  const handleCustomerChange = (customerName: string) => {
    const customer = customerOptions.value.find((c) => c.customerName === customerName)
    if (customer) {
      formData.value.customerId = customer.id
      // 自动填充客户联系方式
      formData.value.clientWhatsapp = customer.contactPhone || ''
      formData.value.clientEmail = customer.contactEmail || ''
    }
  }

  // 添加产品
  const addProduct = () => {
    const id = Date.now().toString()
    formData.value.products.push({
      id,
      selectedProductId: '', // 用于从产品库选择
      variants: [
        {
          id: Date.now().toString() + '1',
          sku: '',
          desc: '',
          qty: 0,
          unit: 'PCS',
          price: 0,
          total: 0
        }
      ]
    })
    saveDraft()
  }

  // 添加变体
  const addVariant = (productIndex: number) => {
    const product = formData.value.products[productIndex]
    product.variants.push({
      id: Date.now().toString(),
      sku: '',
      desc: '',
      qty: 0,
      unit: 'PCS',
      price: 0,
      total: 0
    })
    saveDraft()
  }

  // 删除产品
  const removeProduct = (index: number) => {
    formData.value.products.splice(index, 1)
    calculateGrandTotal()
    saveDraft()
  }

  // 删除变体
  const removeVariant = (productIndex: number, variantIndex: number) => {
    formData.value.products[productIndex].variants.splice(variantIndex, 1)
    calculateGrandTotal()
    saveDraft()
  }

  // 更新变体小计
  const updateVariantTotal = (productIndex: number, variantIndex: number) => {
    const product = formData.value.products[productIndex]
    const variant = product.variants[variantIndex]
    variant.total = variant.qty * variant.price
    calculateGrandTotal()
    saveDraft()
  }

  // 计算总计
  const calculateGrandTotal = () => {
    // 计算产品小计
    let subtotal = 0
    formData.value.products.forEach((product) => {
      product.variants.forEach((variant) => {
        subtotal += variant.total || 0
      })
    })
    formData.value.costSummary!.subtotal = subtotal

    // 计算折扣
    const discountAmount = getDiscountAmount()

    // 计算总计
    const { freightCharges, taxValue, otherCharges } = formData.value.costSummary!
    formData.value.costSummary!.grandTotal =
      subtotal - discountAmount + freightCharges + taxValue + otherCharges

    saveDraft()
  }

  // 添加信息字段
  const addInfoField = () => {
    formData.value.otherInfoFields!.push({
      id: 'custom_' + Date.now(),
      label: '自定义字段',
      value: ''
    })
    saveDraft()
  }

  // 删除信息字段
  const removeInfoField = (index: number) => {
    formData.value.otherInfoFields!.splice(index, 1)
    saveDraft()
  }

  // 保存草稿
  const saveDraft = () => {
    localStorage.setItem('quotation_form_draft', JSON.stringify(formData.value))
    ElMessage.success('草稿已保存')
  }

  // 提交报价
  const submitQuotation = async () => {
    // TODO: 实现报价提交逻辑
    ElMessage.success('报价单已提交')
  }

  // 加载草稿
  const loadDraft = () => {
    const draft = localStorage.getItem('quotation_form_draft')
    if (draft) {
      try {
        const data = JSON.parse(draft)
        formData.value = { ...formData.value, ...data }
      } catch (error) {
        console.error('加载草稿失败:', error)
      }
    }
  }

  // 打开预览
  const openPreview = () => {
    previewVisible.value = true
  }

  // 加载报价详情（编辑模式）
  const loadQuotationData = async () => {
    if (!isEdit.value) return

    try {
      const res = await fetchGetQuotationDetail(route.params.id as string)
      const data = res.data as Api.Trade.QuotationDetail

      // 填充基础数据
      formData.value = {
        ...formData.value,
        ...data,
        companyInfo: data.companyInfo || formData.value.companyInfo,
        costSummary: data.costSummary || formData.value.costSummary,
        otherInfoFields: data.otherInfoFields || formData.value.otherInfoFields,
        products: data.products || [],
        clientWhatsapp: data.clientWhatsapp || '',
        clientEmail: data.clientEmail || ''
      }
    } catch (error) {
      console.error('加载报价详情失败:', error)
      ElMessage.error('加载报价详情失败')
    }
  }

  // 初始化表单
  const initForm = () => {
    // 检查路由参数（从客户详情页跳转）
    const customerId = route.query.customerId as string
    const customerName = route.query.customerName as string

    if (customerId && customerName) {
      formData.value.customerId = customerId
      formData.value.customerName = decodeURIComponent(customerName)
    }

    // 检查是否有草稿
    if (!isEdit.value) {
      loadDraft()
    }

    // 添加默认产品
    if (!isEdit.value && formData.value.products.length === 0) {
      addProduct()
    }
  }

  // 返回上一页
  const handleBack = () => {
    router.back()
  }

  onMounted(() => {
    loadCustomers()
    loadProducts()
    initForm()
    loadQuotationData()
    calculateGrandTotal()
  })
</script>

<style lang="scss" scoped>
  .quotation-form-page {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding-bottom: 80px;

    // 卡片内容区域允许滚动
    :deep(.art-card.el-card) {
      flex: 1;
      overflow: visible;
    }

    :deep(.el-card__body) {
      overflow: visible;
    }

    // 悬浮操作栏
    .floating-action-bar {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 100;
      padding: 12px 20px;
      background: var(--default-box-color);
      border: 1px solid var(--default-border);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgb(0 0 0 / 12%);
    }

    // 表单布局优化
    :deep(.el-form) {
      max-width: 100%;
    }

    :deep(.el-form-item__label) {
      font-size: 13px;
      color: var(--el-text-color-regular);
    }

    // 统一输入框宽度
    :deep(.el-input__inner),
    :deep(.el-select),
    :deep(.el-date-editor),
    :deep(.el-input-number) {
      width: 100%;
    }

    .logo-upload-area {
      &:hover {
        background: rgba(var(--el-color-primary-rgb), 0.05);
        border-color: var(--el-color-primary);
      }
    }

    .products-container {
      .product-card {
        padding: 20px;
        margin-bottom: 24px;
        background: var(--default-box-color);
        border: 1px solid var(--el-border-color-light);
        border-radius: 12px;

        .product-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--el-border-color-lighter);
        }

        .product-variants {
          .variant-card {
            padding: 16px;
            margin-top: 12px;
            background: var(--default-bg-color);
            border: 1px solid var(--el-border-color-light);
            border-radius: 10px;

            .variant-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 12px;
            }

            .variant-content {
              display: flex;
              gap: 16px;

              .variant-info {
                flex: 1;

                .variant-total {
                  padding-top: 12px;
                  text-align: right;
                  border-top: 1px solid var(--el-border-color-lighter);
                }
              }
            }
          }
        }
      }
    }

    // 费用汇总显示优化
    .cost-summary-display {
      border: 1px solid var(--el-border-color-light);
    }

    .other-info-container {
      .info-field {
        padding: 16px;
        margin-bottom: 16px;
        background: var(--default-bg-color);
        border: 1px solid var(--el-border-color-light);
        border-radius: 8px;
      }
    }

    :deep(.el-input-number) {
      width: 100%;
    }
  }
</style>
