<!-- 报价单打印模板 -->
<template>
  <div class="quotation-print" ref="printContent">
    <!-- 表格头部 -->
    <table class="print-table">
      <thead>
        <tr>
          <th colspan="7" class="main-title">Product Purchase Inquiry(Quotation)-FC</th>
        </tr>
      </thead>
      <tbody>
        <!-- 公司信息 -->
        <tr>
          <td colspan="2" class="label">Price unit:</td>
          <td colspan="5" class="value">{{ quotationData.priceUnit || 'RMB' }}</td>
        </tr>
        <tr>
          <td colspan="2" class="label">Quotation unit:</td>
          <td colspan="5" class="value">{{ quotationData.quotationUnit || 'Shan Dong Na Ju' }}</td>
        </tr>
        <tr>
          <td colspan="2" class="label">Contact:</td>
          <td colspan="5" class="value">{{ quotationData.contactPerson || '-' }}</td>
        </tr>
        <tr>
          <td colspan="2" class="label">Contact information:</td>
          <td colspan="5" class="value">{{ quotationData.contactPhone || '-' }}</td>
        </tr>
        <tr>
          <td colspan="2" class="label">Email:</td>
          <td colspan="5" class="value">{{ quotationData.contactEmail || '-' }}</td>
        </tr>

        <!-- 产品表格表头 -->
        <tr class="product-header">
          <th>Product Name</th>
          <th>Size</th>
          <th>Unit</th>
          <th>MOQ</th>
          <th>Price/RMB</th>
          <th>Remark</th>
          <th>Picture</th>
        </tr>

        <!-- 产品列表 -->
        <tr v-for="(product, index) in productList" :key="index">
          <td>{{ product.name || '-' }}</td>
          <td>{{ product.spec || '-' }}</td>
          <td>{{ product.unit || 'PCS' }}</td>
          <td>{{ product.moq || '-' }}</td>
          <td class="price-cell">
            <div v-if="product.gradePrices">
              <div v-for="(price, grade) in product.gradePrices" :key="grade">
                {{ grade }}: {{ price }}
              </div>
            </div>
            <div v-else>
              {{ formatPrice(product.price) }}
            </div>
          </td>
          <td class="remark-cell">
            <div v-if="product.remark">{{ product.remark }}</div>
            <div v-else>-</div>
          </td>
          <td class="image-cell">
            <img v-if="product.image" :src="product.image" class="product-image" />
            <div v-else class="no-image">No Image</div>
          </td>
        </tr>

        <!-- 总金额 -->
        <tr>
          <td colspan="2" class="label">Total amount</td>
          <td colspan="5" class="value total-amount">
            {{ formatAmount(quotationData.costSummary?.grandTotal || 0) }}
          </td>
        </tr>

        <!-- 底部条款 -->
        <tr>
          <td colspan="7" class="terms-cell">
            <strong>1.Payment method:</strong>
            {{ quotationData.paymentTerm || 'Full payment required before shipment' }}
          </td>
        </tr>
        <tr>
          <td colspan="7" class="terms-cell">
            <strong>2. Tax rate:</strong> {{ quotationData.taxRate || 'Tax not included' }}
          </td>
        </tr>
        <tr>
          <td colspan="7" class="terms-cell">
            <strong>3. freight:</strong>
            {{ quotationData.shipmentPort ? 'Shipping not included' : 'Shipping not included' }}
          </td>
        </tr>
        <tr>
          <td colspan="7" class="terms-cell">
            <strong>4. Delivery time:</strong>
            {{ quotationData.leadTime || 'OEM production cycle: 25 days' }}
          </td>
        </tr>
        <tr>
          <td colspan="7" class="terms-cell">
            <strong>5. Shelf life:</strong> {{ quotationData.shelfLife || '2 Years' }}
          </td>
        </tr>
        <tr>
          <td colspan="7" class="terms-cell">
            <strong>6. Offer is valid for:</strong> {{ quotationData.validity || '60 Days' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'

  const props = defineProps({
    quotationData: {
      type: Object,
      required: true
    }
  })

  const printContent = ref<HTMLDivElement | null>(null)

  // 产品列表
  const productList = computed(() => {
    if (!props.quotationData?.products) return []
    return props.quotationData.products || []
  })

  // 格式化价格
  const formatPrice = (price: number) => {
    if (!price) return '0.00'
    return price.toFixed(2)
  }

  // 格式化金额
  const formatAmount = (amount: number) => {
    if (!amount) return '0.00'
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // 打印
  const print = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('请允许弹出窗口以进行打印')
      return
    }

    const styles = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          padding: 20px;
        }

        .print-table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid #000;
        }

        .print-table th,
        .print-table td {
          border: 1px solid #000;
          padding: 8px;
          text-align: left;
        }

        .main-title {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          padding: 12px;
          border-bottom: 2px solid #000;
        }

        .product-header th {
          background-color: #f0f0f0;
          font-weight: bold;
          text-align: center;
        }

        .label {
          font-weight: bold;
          width: 150px;
        }

        .value {
          font-weight: normal;
        }

        .total-amount {
          font-weight: bold;
          font-size: 14px;
        }

        .terms-cell {
          padding: 6px 8px;
          background-color: #fafafa;
        }

        .price-cell {
          text-align: left;
        }

        .remark-cell {
          max-width: 200px;
          word-wrap: break-word;
          font-size: 11px;
        }

        .image-cell {
          width: 100px;
          text-align: center;
        }

        .product-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border: 1px solid #ddd;
        }

        .no-image {
          color: #999;
          font-size: 11px;
        }

        @media print {
          body {
            padding: 0;
          }

          .print-table {
            width: 100%;
            page-break-inside: avoid;
          }
        }

        @page {
          size: A4;
          margin: 15mm;
        }
      </style>
    `

    const content = printContent.value?.innerHTML || ''

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quotation - ${props.quotationData?.quotationNo || ''}</title>
          ${styles}
        </head>
        <body>
          ${content}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  defineExpose({ print })
</script>

<style lang="scss" scoped>
  .quotation-print {
    padding: 20px;
    background: white;

    .print-table {
      width: 100%;
      border-collapse: collapse;
      border: 2px solid #333;

      th,
      td {
        padding: 8px;
        font-size: 12px;
        border: 1px solid #333;
      }

      .main-title {
        padding: 12px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        border-bottom: 2px solid #333;
      }

      .product-header {
        th {
          font-weight: bold;
          text-align: center;
          background-color: #f5f5f5;
        }
      }

      .label {
        font-weight: bold;
        background-color: #fafafa;
      }

      .total-amount {
        font-size: 14px;
        font-weight: bold;
      }

      .terms-cell {
        padding: 6px 8px;
        font-size: 11px;
        background-color: #fafafa;
      }

      .remark-cell {
        max-width: 200px;
        font-size: 11px;
        word-wrap: break-word;
      }

      .image-cell {
        width: 100px;
        text-align: center;

        .product-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border: 1px solid #ddd;
        }

        .no-image {
          font-size: 11px;
          color: #999;
        }
      }
    }
  }
</style>
