<!-- 报价单预览组件 -->
<template>
  <ElDialog
    v-model="dialogVisible"
    width="95%"
    :close-on-click-modal="false"
    class="preview-dialog"
  >
    <template #header>
      <div class="flex-b items-center">
        <span class="text-xl font-semibold">
          <ArtSvgIcon icon="ri:eye-line" class="mr-2 text-primary" />
          报价单预览
        </span>
        <div class="flex items-center gap-2">
          <!-- 翻页控制 -->
          <div
            class="flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded-xl border border-g-200"
          >
            <ElButton
              :disabled="currentPage <= 1"
              @click="prevPage"
              class="w-8 h-8 flex-c rounded-lg border border-g-200 bg-white hover:bg-gray-50 tad-200"
            >
              <ArtSvgIcon icon="ri:arrow-left-s-line" />
            </ElButton>
            <span class="text-sm font-medium text-g-700 min-w-[90px] text-center">
              Page {{ currentPage }} / {{ totalPages }}
            </span>
            <ElButton
              :disabled="currentPage >= totalPages"
              @click="nextPage"
              class="w-8 h-8 flex-c rounded-lg border border-g-200 bg-white hover:bg-gray-50 tad-200"
            >
              <ArtSvgIcon icon="ri:arrow-right-s-line" />
            </ElButton>
          </div>

          <!-- 缩放控制 -->
          <div
            class="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-xl border border-g-200 ml-3"
          >
            <ElButton
              @click="zoomOut"
              class="w-8 h-8 flex-c rounded-lg border border-g-200 bg-white hover:bg-gray-50 tad-200"
            >
              <ArtSvgIcon icon="ri:zoom-out-line" />
            </ElButton>
            <span class="text-sm font-medium text-g-600 min-w-[55px] text-center">
              {{ Math.round(currentZoom * 100) }}%
            </span>
            <ElButton
              @click="zoomIn"
              class="w-8 h-8 flex-c rounded-lg border border-g-200 bg-white hover:bg-gray-50 tad-200"
            >
              <ArtSvgIcon icon="ri:zoom-in-line" />
            </ElButton>
          </div>

          <ElButton @click="resetZoom" class="ml-2">
            <ArtSvgIcon icon="ri:expand-width-line" class="mr-1" />
            自适应
          </ElButton>

          <ElButton type="primary" @click="downloadPDF" :loading="downloading">
            <ArtSvgIcon icon="ri:download-line" class="mr-1" />
            导出 PDF
          </ElButton>

          <ElButton @click="close">
            <ArtSvgIcon icon="ri:close-line" class="mr-1" />
            关闭
          </ElButton>
        </div>
      </div>
    </template>

    <div class="preview-container" ref="previewContainer">
      <div
        class="quote-document-wrapper"
        ref="documentWrapper"
        :style="{ transform: `scale(${currentZoom})` }"
      >
        <div class="quote-document-content">
          <!-- 动态渲染页面 -->
          <div v-for="page in renderedPages" :key="page.pageNum" class="quote-page">
            <!-- 页眉 -->
            <div v-if="page.isFirst" class="page-header">
              <div class="header-top flex justify-between items-start">
                <div class="flex gap-3 items-start">
                  <!-- 公司 Logo -->
                  <div v-if="companyInfo.companyLogo" class="company-logo">
                    <img :src="companyInfo.companyLogo" alt="Logo" />
                  </div>
                  <div v-else class="company-logo-placeholder">
                    <ArtSvgIcon icon="ri:play-fill" class="text-white" />
                  </div>

                  <div class="company-info">
                    <h1 class="company-name">{{ companyInfo.companyName }}</h1>
                    <p class="contact-name">{{ companyInfo.contactName }}</p>
                    <p class="company-address">{{ companyInfo.companyAddress }}</p>
                  </div>
                </div>

                <div class="company-contact text-right">
                  <p class="contact-item"> <strong>Date:</strong> {{ formattedDate }} </p>
                  <p class="contact-item">
                    <ArtSvgIcon icon="ri:mail-line" class="contact-icon" />
                    {{ companyInfo.companyEmail }}
                  </p>
                  <p class="contact-item">
                    <ArtSvgIcon icon="ri:smartphone-line" class="contact-icon" />
                    {{ companyInfo.companyWhatsapp }}
                  </p>
                </div>
              </div>

              <!-- 报价单号 -->
              <div class="quotation-title"> Quote {{ quotationData.quotationNo }} </div>

              <!-- 贸易条款 -->
              <div class="trade-terms">
                <div class="terms-grid">
                  <div class="term-item">
                    <span class="term-label">Valid Until:</span>
                    <span class="term-value">{{ formattedValidity }}</span>
                  </div>
                  <div class="term-item">
                    <span class="term-label">Currency:</span>
                    <span class="term-value">{{ quotationData.currency }}</span>
                  </div>
                  <div class="term-item">
                    <span class="term-label">Trade Term:</span>
                    <span class="term-value">{{ quotationData.tradeTerm }}</span>
                  </div>
                  <div class="term-item">
                    <span class="term-label">Port:</span>
                    <span class="term-value">{{ quotationData.shipmentPort || 'N/A' }}</span>
                  </div>
                  <div class="term-item">
                    <span class="term-label">Payment:</span>
                    <span class="term-value">{{ quotationData.paymentTerm }}</span>
                  </div>
                  <div class="term-item">
                    <span class="term-label">Lead Time:</span>
                    <span class="term-value">{{ quotationData.leadTime || 'N/A' }}</span>
                  </div>
                </div>
              </div>

              <!-- 客户信息 -->
              <div class="client-info">
                <p class="client-item">
                  <strong>Client:</strong>
                  <span class="client-value">{{ quotationData.customerName }}</span>
                </p>
                <p class="client-item">
                  <ArtSvgIcon icon="ri:smartphone-line" class="client-icon" />
                  <strong>WhatsApp:</strong>
                  <span class="client-value">{{ quotationData.clientWhatsapp || 'N/A' }}</span>
                </p>
                <p class="client-item">
                  <ArtSvgIcon icon="ri:mail-line" class="client-icon" />
                  <strong>Email:</strong>
                  <span class="client-value">{{ quotationData.clientEmail || 'N/A' }}</span>
                </p>
              </div>
            </div>

            <!-- 简化页眉（非首页） -->
            <div v-else class="simple-header">
              <div class="flex-b items-center pb-3 border-b-2 border-primary">
                <span class="text-sm text-g-600">
                  <strong>Quote:</strong> {{ quotationData.quotationNo }}
                </span>
                <span class="text-sm text-g-600"> <strong>Date:</strong> {{ formattedDate }} </span>
                <span class="text-sm text-g-600">
                  <strong>Page:</strong> {{ page.pageNum }} / {{ totalPages }}
                </span>
              </div>
            </div>

            <!-- 产品表格标题 -->
            <h3 class="products-title">
              {{ page.isFirst ? 'Products' : 'Products (Continued)' }}
            </h3>

            <!-- 产品表格 -->
            <table class="products-table">
              <colgroup>
                <col style="width: 55px" />
                <col style="width: auto" />
                <col style="width: 65px" />
                <col style="width: 80px" />
                <col style="width: 80px" />
              </colgroup>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Description</th>
                  <th class="text-right">Qty</th>
                  <th class="text-right">Price</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="variant in page.variants" :key="variant.id">
                  <td class="image-cell">
                    <img v-if="variant.image" :src="variant.image" class="variant-image" />
                    <div v-else class="variant-image-placeholder">
                      <ArtSvgIcon icon="ri:image-line" />
                    </div>
                  </td>
                  <td class="desc-cell">
                    <div class="variant-desc">{{ variant.desc || 'No description' }}</div>
                    <div v-if="variant.spec" class="variant-spec">{{ variant.spec }}</div>
                  </td>
                  <td class="text-right qty-cell"> {{ variant.qty }} {{ variant.unit }} </td>
                  <td class="text-right price-cell">
                    {{ formatAmount(variant.price, quotationData.currency) }}
                  </td>
                  <td class="text-right total-cell">
                    {{ formatAmount(variant.total || 0, quotationData.currency) }}
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- 费用汇总（仅末页） -->
            <div v-if="page.isLast" class="cost-summary-section">
              <table class="summary-table">
                <tr>
                  <td class="summary-label">Subtotal:</td>
                  <td class="summary-value">{{
                    formatAmount(costSummary.subtotal, quotationData.currency)
                  }}</td>
                </tr>
                <tr v-if="costSummary.freightCharges > 0">
                  <td class="summary-label">Freight:</td>
                  <td class="summary-value">{{
                    formatAmount(costSummary.freightCharges, quotationData.currency)
                  }}</td>
                </tr>
                <tr v-if="costSummary.discountValue > 0">
                  <td class="summary-label">
                    Discount
                    {{
                      costSummary.discountType === 'percent'
                        ? `(${costSummary.discountValue}%)`
                        : ''
                    }}:
                  </td>
                  <td class="summary-value discount">
                    -{{ formatAmount(getDiscountAmount(), quotationData.currency) }}
                  </td>
                </tr>
                <tr v-if="costSummary.taxValue > 0">
                  <td class="summary-label">Tax:</td>
                  <td class="summary-value">{{
                    formatAmount(costSummary.taxValue, quotationData.currency)
                  }}</td>
                </tr>
                <tr v-if="costSummary.otherCharges > 0">
                  <td class="summary-label">Other Charges:</td>
                  <td class="summary-value">{{
                    formatAmount(costSummary.otherCharges, quotationData.currency)
                  }}</td>
                </tr>
                <tr class="grand-total-row">
                  <td class="summary-label">Grand Total:</td>
                  <td class="summary-value grand-total">
                    {{ formatAmount(costSummary.grandTotal, quotationData.currency) }}
                  </td>
                </tr>
              </table>

              <!-- 其他信息 -->
              <div class="other-info-section">
                <div v-for="field in otherInfoFields" :key="field.id" class="info-block">
                  <h4 class="info-title">{{ field.label }}</h4>
                  <p class="info-content">{{ field.value }}</p>
                </div>
              </div>
            </div>

            <!--  continuation 提示（非末页） -->
            <div v-else class="continuation-hint"> — Continued on next page — </div>

            <!-- 页脚 -->
            <div class="page-footer"> Page {{ page.pageNum }} of {{ totalPages }} </div>
          </div>
        </div>
      </div>
    </div>
  </ElDialog>

  <!-- PDF 导出隐藏容器 -->
  <div id="pdf-export-container" class="hidden"></div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'

  const props = defineProps<{
    modelValue: boolean
    data: Api.Trade.QuotationDetail
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
  }>()

  // 对话框显示状态
  const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  // 报价数据（模板中使用 quotationData 名称）
  const quotationData = computed(() => props.data)

  // 当前页码
  const currentPage = ref(1)
  // 缩放比例
  const currentZoom = ref(1.0)
  // 下载状态
  const downloading = ref(false)
  // 预览容器
  const previewContainer = ref<HTMLDivElement>()
  // 文档包装器
  const documentWrapper = ref<HTMLDivElement>()

  // A4 尺寸
  const A4_WIDTH_PX = 794
  const A4_HEIGHT_PX = 1123

  // 每页行数
  const FIRST_PAGE_ROWS = 9
  const OTHER_PAGE_ROWS = 13

  // 公司数据
  const companyInfo = computed(
    () =>
      props.data.companyInfo || {
        companyName: 'YOUR COMPANY LLC',
        contactName: 'JOHN DOE',
        companyAddress: '123 Business Avenue, City, Country',
        companyEmail: 'contact@yourcompany.com',
        companyWhatsapp: '+1 (234) 567-8900',
        companyLogo: ''
      }
  )

  // 费用汇总
  const costSummary = computed(
    () =>
      props.data.costSummary || {
        freightCharges: 0,
        discountValue: 0,
        discountType: 'percent' as const,
        taxValue: 0,
        otherCharges: 0,
        subtotal: 0,
        grandTotal: 0
      }
  )

  // 其他信息字段
  const otherInfoFields = computed(() => props.data.otherInfoFields || [])

  // 格式化日期
  const formattedDate = computed(() => {
    if (!props.data.quotationDate) return ''
    return new Date(props.data.quotationDate).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  })

  // 格式化有效期
  const formattedValidity = computed(() => {
    if (!props.data.validity) return 'N/A'
    return new Date(props.data.validity).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  })

  // 货币符号
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

  // 获取折扣金额
  const getDiscountAmount = () => {
    const { discountValue, discountType, subtotal } = costSummary.value
    if (discountType === 'percent') {
      return subtotal * (discountValue / 100)
    }
    return discountValue
  }

  // 获取所有变体
  const getAllVariants = () => {
    const variants: Api.Trade.ProductVariant[] = []
    props.data.products.forEach((product) => {
      product.variants.forEach((variant) => {
        variants.push(variant)
      })
    })
    return variants
  }

  // 计算总页数
  const totalPages = computed(() => {
    const totalVariants = getAllVariants().length
    if (totalVariants === 0) return 1

    let remainingRows = totalVariants - FIRST_PAGE_ROWS
    let pages = 1

    while (remainingRows > 0) {
      pages++
      remainingRows -= OTHER_PAGE_ROWS
    }

    return Math.max(1, pages)
  })

  // 渲染的页面
  const renderedPages = computed(() => {
    const allVariants = getAllVariants()
    const pages: {
      pageNum: number
      isFirst: boolean
      isLast: boolean
      variants: Api.Trade.ProductVariant[]
    }[] = []

    let startRowIndex = 0

    for (let pageNum = 1; pageNum <= totalPages.value; pageNum++) {
      const rowsPerPage = pageNum === 1 ? FIRST_PAGE_ROWS : OTHER_PAGE_ROWS
      const pageVariants = allVariants.slice(startRowIndex, startRowIndex + rowsPerPage)

      pages.push({
        pageNum,
        isFirst: pageNum === 1,
        isLast: pageNum === totalPages.value,
        variants: pageVariants
      })

      startRowIndex += rowsPerPage
    }

    return pages
  })

  // 缩放控制
  const zoomIn = () => {
    currentZoom.value = Math.min(currentZoom.value + 0.1, 2)
  }

  const zoomOut = () => {
    currentZoom.value = Math.max(currentZoom.value - 0.1, 0.3)
  }

  const resetZoom = () => {
    if (!previewContainer.value) return

    const availableWidth = previewContainer.value.clientWidth - 80
    const availableHeight = previewContainer.value.clientHeight - 80

    const scaleX = availableWidth / A4_WIDTH_PX
    const scaleY = availableHeight / A4_HEIGHT_PX

    currentZoom.value = Math.min(scaleX, scaleY, 1.5)
  }

  // 翻页
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  // 关闭
  const close = () => {
    emit('update:modelValue', false)
  }

  // 导出 PDF
  const downloadPDF = async () => {
    downloading.value = true

    try {
      // 动态导入 html2canvas 和 jsPDF
      const html2canvasModule = await import('html2canvas')
      const jspdfModule = await import('jspdf')

      const html2canvas = html2canvasModule.default
      const { jsPDF } = jspdfModule

      // 等待图片加载
      await new Promise<void>((resolve) => {
        const images = document.querySelectorAll('img')
        if (images.length === 0) {
          resolve()
          return
        }
        let loaded = 0
        images.forEach((img) => {
          if (img.complete) {
            loaded++
          } else {
            img.onload = () => {
              loaded++
              if (loaded >= images.length) resolve()
            }
            img.onerror = () => {
              loaded++
              if (loaded >= images.length) resolve()
            }
          }
        })
        setTimeout(resolve, 1500)
      })

      const pdfPages = []
      const pages = renderedPages.value

      // 逐页生成
      for (let i = 0; i < pages.length; i++) {
        const pageElement = document.querySelectorAll('.quote-page')[i]
        if (!pageElement) continue

        const canvas = await html2canvas(pageElement as HTMLElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX
        })

        pdfPages.push(canvas)
      }

      // 创建 PDF
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      pdfPages.forEach((canvas, index) => {
        if (index > 0) {
          pdf.addPage()
        }
        const imgData = canvas.toDataURL('image/jpeg', 0.98)
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
      })

      // 保存
      pdf.save(`Quotation_${props.data.quotationNo}.pdf`)

      ElMessage.success('PDF 导出成功')
    } catch (error) {
      console.error('PDF 导出失败:', error)
      ElMessage.error('PDF 导出失败：' + (error as Error).message)
    } finally {
      downloading.value = false
    }
  }

  // 监听 visible 变化
  watch(
    () => props.modelValue,
    (val) => {
      if (val) {
        currentPage.value = 1
        currentZoom.value = 1.0
        nextTick(() => {
          resetZoom()
        })
      }
    }
  )
</script>

<style lang="scss" scoped>
  .preview-dialog {
    :deep(.el-dialog__header) {
      padding: 16px 24px;
      border-bottom: 1px solid var(--el-border-color-light);
    }

    :deep(.el-dialog__body) {
      height: calc(100vh - 150px);
      padding: 0;
      overflow: hidden;
    }
  }

  .preview-container {
    display: flex;
    justify-content: center;
    height: 100%;
    padding: 40px;
    overflow: auto;
    background: linear-gradient(
      135deg,
      var(--el-border-color) 0%,
      var(--el-border-color-light) 100%
    );
  }

  .quote-document-wrapper {
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: top center;
  }

  .quote-document-content {
    display: flex;
    flex-direction: column;
    width: 794px;
  }

  .quote-page {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 794px;
    height: 1123px;
    padding: 57px 76px;
    background: white;

    &:not(:last-child) {
      margin-bottom: 40px;
    }
  }

  // 页眉样式
  .page-header {
    margin-bottom: 20px;

    .header-top {
      margin-bottom: 20px;
    }

    .company-logo {
      flex-shrink: 0;
      width: 70px;
      height: 70px;
      overflow: hidden;
      border-radius: 6px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .company-logo-placeholder {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 70px;
      height: 70px;
      background: var(--el-color-primary);
      border-radius: 6px;

      .ri-play-fill {
        margin-left: 4px;
        font-size: 28px;
        color: white;
      }
    }

    .company-info {
      min-width: 0;

      .company-name {
        margin-bottom: 4px;
        font-size: 16px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        white-space: nowrap;
      }

      .contact-name {
        margin-bottom: 3px;
        font-size: 11px;
        color: var(--el-text-color-secondary);
      }

      .company-address {
        font-size: 11px;
        color: var(--el-text-color-secondary);
      }
    }

    .company-contact {
      flex-shrink: 0;

      .contact-item {
        display: flex;
        gap: 5px;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 6px;
        font-size: 11px;
        color: var(--el-text-color-secondary);

        .contact-icon {
          width: 12px;
          font-size: 12px;
          color: var(--el-border-color);
        }
      }
    }
  }

  .quotation-title {
    padding: 10px 16px;
    margin-bottom: 20px;
    font-size: 13px;
    font-weight: 600;
    color: white;
    text-align: center;
    background: var(--el-color-primary);
    border-radius: 5px;
  }

  .trade-terms {
    padding: 12px 16px;
    margin-bottom: 16px;
    font-size: 11px;
    background: var(--el-fill-color-light);
    border-radius: 6px;

    .terms-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .term-item {
      .term-label {
        color: var(--el-text-color-secondary);
      }

      .term-value {
        margin-left: 6px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
    }
  }

  .client-info {
    padding: 16px 20px;
    margin-bottom: 20px;
    font-size: 12px;
    background: var(--el-fill-color);
    border-radius: 6px;

    .client-item {
      display: flex;
      gap: 5px;
      align-items: center;
      margin: 5px 0;
      color: var(--el-text-color-primary);

      .client-icon {
        width: 12px;
        font-size: 12px;
        color: var(--el-text-color-primary);
      }

      .client-value {
        margin-left: 5px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .simple-header {
    margin-bottom: 16px;
  }

  .products-title {
    padding-bottom: 6px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--el-color-primary);
    border-bottom: 2px solid var(--el-color-primary);
  }

  .products-table {
    width: 100%;
    margin-bottom: 16px;
    font-size: 11px;
    border-collapse: collapse;

    thead tr {
      background: var(--el-fill-color);

      th {
        padding: 8px 6px;
        font-size: 11px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        text-align: left;
        border-bottom: 1px solid var(--el-border-color-lighter);
      }
    }

    tbody tr {
      td {
        padding: 10px 6px;
        vertical-align: top;
        border-bottom: 1px solid var(--el-border-color-lighter);
      }
    }

    .image-cell {
      width: 55px;
      padding-right: 6px;

      .variant-image {
        display: block;
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 4px;
      }

      .variant-image-placeholder {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        font-size: 16px;
        color: var(--el-text-color-placeholder);
        background: var(--el-fill-color);
        border-radius: 4px;
      }
    }

    .desc-cell {
      .variant-desc {
        font-size: 12px;
        line-height: 1.4;
        color: var(--el-text-color-secondary);
        word-break: break-word;
      }

      .variant-spec {
        margin-top: 2px;
        font-size: 10px;
        color: var(--el-text-color-placeholder);
      }
    }

    .qty-cell,
    .price-cell {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }

    .total-cell {
      font-size: 12px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .cost-summary-section {
    margin-top: 16px;
    margin-bottom: 20px;

    .summary-table {
      width: 280px;
      margin-left: auto;
      font-size: 12px;

      tr {
        td {
          padding: 8px 12px;
          color: var(--el-text-color-secondary);
          text-align: right;
        }

        .summary-value {
          font-weight: 500;
          color: var(--el-text-color-primary);
        }

        .discount {
          color: var(--el-color-danger);
        }
      }

      .grand-total-row {
        border-top: 2px solid var(--el-color-primary);

        .summary-label,
        .grand-total {
          font-size: 14px;
          font-weight: 700;
          color: var(--el-color-primary);
        }
      }
    }
  }

  .other-info-section {
    margin-top: 20px;

    .info-block {
      margin-bottom: 12px;

      .info-title {
        padding-bottom: 5px;
        margin-bottom: 6px;
        font-size: 12px;
        font-weight: 600;
        color: var(--el-color-primary);
        border-bottom: 2px solid var(--el-text-color-primary);
      }

      .info-content {
        font-size: 11px;
        line-height: 1.4;
        color: var(--el-text-color-secondary);
        word-break: break-word;
      }
    }
  }

  .continuation-hint {
    margin-top: auto;
    font-size: 11px;
    font-style: italic;
    color: var(--el-text-color-secondary);
    text-align: right;
  }

  .page-footer {
    padding-top: 8px;
    margin-top: auto;
    font-size: 9px;
    color: var(--el-text-color-placeholder);
    text-align: right;
    border-top: 1px solid var(--el-border-color-lighter);
  }

  .hidden {
    position: fixed;
    top: -9999px;
    left: -9999px;
    z-index: 9999;
    width: 794px;
    background: white;
  }
</style>
