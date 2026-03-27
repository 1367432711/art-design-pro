/**
 * 模拟报价记录数据（支持多产品结构）
 */
export const QUOTATION_LIST_DATA = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Global Tech Solutions',
    quotationNo: 'QT20250115001',
    quotationDate: '2025-01-15',
    validity: '2025-02-15',
    currency: 'USD',
    tradeTerm: 'FOB Shenzhen',
    paymentTerm: 'T/T 30% deposit',
    shipmentPort: 'Shenzhen',
    leadTime: '30 days',
    clientWhatsapp: '+1 234 567 8900',
    clientEmail: 'contact@globaltech.com',
    status: '1', // 待确认
    products: [
      {
        id: 'p1',
        selectedProductId: '1',
        image: 'https://example.com/image1.jpg',
        sku: 'KS-001',
        name: '切割片 100mm',
        type: '切割片',
        grade: 'A 级',
        qty: 500,
        unit: '片',
        price: 2.5,
        currency: 'USD',
        total: 1250.0,
        remark: '标准款'
      },
      {
        id: 'p2',
        selectedProductId: '2',
        image: 'https://example.com/image2.jpg',
        sku: 'BL-002',
        name: '百叶片 80mm',
        type: '百叶片',
        grade: 'B 级',
        qty: 300,
        unit: '片',
        price: 1.8,
        currency: 'USD',
        total: 540.0,
        remark: ''
      }
    ],
    costSummary: {
      freightCharges: 150.0,
      discountValue: 5,
      discountType: 'percent' as const,
      taxValue: 89.5,
      otherCharges: 20.0,
      subtotal: 1790.0,
      grandTotal: 1939.5
    },
    createTime: '2025-01-15 10:30:00',
    updateBy: 'admin',
    updateTime: '2025-01-15 10:30:00'
  },
  {
    id: '2',
    customerId: '1',
    customerName: 'Global Tech Solutions',
    quotationNo: 'QT20250220001',
    quotationDate: '2025-02-20',
    validity: '2025-03-20',
    currency: 'USD',
    tradeTerm: 'FOB Shenzhen',
    paymentTerm: 'T/T 30% deposit',
    shipmentPort: 'Shenzhen',
    leadTime: '25 days',
    clientWhatsapp: '+1 234 567 8900',
    clientEmail: 'contact@globaltech.com',
    status: '2', // 已接受
    products: [
      {
        id: 'p3',
        selectedProductId: '3',
        image: 'https://example.com/image3.jpg',
        sku: 'MP-003',
        name: '磨光片 125mm',
        type: '磨光片',
        grade: 'A 级',
        qty: 1000,
        unit: '片',
        price: 3.2,
        currency: 'USD',
        total: 3200.0,
        remark: '加厚款'
      }
    ],
    costSummary: {
      freightCharges: 200.0,
      discountValue: 100.0,
      discountType: 'fixed' as const,
      taxValue: 210.0,
      otherCharges: 0,
      subtotal: 3200.0,
      grandTotal: 3510.0
    },
    createTime: '2025-02-20 14:00:00',
    updateBy: 'admin',
    updateTime: '2025-02-22 09:00:00'
  },
  {
    id: '3',
    customerId: '2',
    customerName: 'European Trade GmbH',
    quotationNo: 'QT20250210001',
    quotationDate: '2025-02-10',
    validity: '2025-03-10',
    currency: 'EUR',
    tradeTerm: 'CIF Hamburg',
    paymentTerm: 'T/T 50% advance',
    shipmentPort: 'Shanghai',
    leadTime: '45 days',
    clientWhatsapp: '+49 123 456 7890',
    clientEmail: 'info@eurotrade.de',
    status: '2', // 已接受
    products: [
      {
        id: 'p4',
        selectedProductId: '4',
        image: 'https://example.com/image4.jpg',
        sku: 'KS-004',
        name: '切割片 150mm',
        type: '切割片',
        grade: 'A 级',
        qty: 800,
        unit: '片',
        price: 4.5,
        currency: 'EUR',
        total: 3600.0,
        remark: ''
      }
    ],
    costSummary: {
      freightCharges: 350.0,
      discountValue: 0,
      discountType: 'percent' as const,
      taxValue: 252.0,
      otherCharges: 50.0,
      subtotal: 3600.0,
      grandTotal: 4252.0
    },
    createTime: '2025-02-10 09:15:00',
    updateBy: 'admin',
    updateTime: '2025-02-15 16:00:00'
  },
  {
    id: '4',
    customerId: '3',
    customerName: 'UK Import Ltd',
    quotationNo: 'QT20250128001',
    quotationDate: '2025-01-28',
    validity: '2025-03-28',
    currency: 'GBP',
    tradeTerm: 'FOB Guangzhou',
    paymentTerm: 'T/T 30% deposit',
    shipmentPort: 'Guangzhou',
    leadTime: '35 days',
    clientWhatsapp: '+44 789 012 3456',
    clientEmail: 'sales@ukimport.co.uk',
    status: '3', // 已拒绝
    products: [
      {
        id: 'p5',
        selectedProductId: '5',
        image: 'https://example.com/image5.jpg',
        sku: 'BL-005',
        name: '百叶片 100mm',
        type: '百叶片',
        grade: 'B 级',
        qty: 600,
        unit: '片',
        price: 2.0,
        currency: 'GBP',
        total: 1200.0,
        remark: '经济款'
      }
    ],
    costSummary: {
      freightCharges: 100.0,
      discountValue: 10,
      discountType: 'percent' as const,
      taxValue: 79.2,
      otherCharges: 15.0,
      subtotal: 1200.0,
      grandTotal: 1286.2
    },
    createTime: '2025-01-28 16:45:00',
    updateBy: 'sales1',
    updateTime: '2025-02-05 10:00:00'
  },
  {
    id: '5',
    customerId: '4',
    customerName: 'Tokyo Trading Co',
    quotationNo: 'QT20250301001',
    quotationDate: '2025-03-01',
    validity: '2025-04-01',
    currency: 'USD',
    tradeTerm: 'CIF Tokyo',
    paymentTerm: 'L/C 90 days',
    shipmentPort: 'Shanghai',
    leadTime: '30 days',
    clientWhatsapp: '+81 90 1234 5678',
    clientEmail: 'info@tokyotrading.jp',
    status: '1', // 待确认
    products: [
      {
        id: 'p6',
        selectedProductId: '6',
        image: 'https://example.com/image6.jpg',
        sku: 'MP-006',
        name: '磨光片 180mm',
        type: '磨光片',
        grade: 'A 级',
        qty: 400,
        unit: '片',
        price: 5.5,
        currency: 'USD',
        total: 2200.0,
        remark: '专业级'
      },
      {
        id: 'p7',
        selectedProductId: '1',
        image: 'https://example.com/image1.jpg',
        sku: 'KS-001',
        name: '切割片 100mm',
        type: '切割片',
        grade: 'A 级',
        qty: 200,
        unit: '片',
        price: 2.5,
        currency: 'USD',
        total: 500.0,
        remark: ''
      }
    ],
    costSummary: {
      freightCharges: 280.0,
      discountValue: 0,
      discountType: 'percent' as const,
      taxValue: 169.4,
      otherCharges: 30.0,
      subtotal: 2700.0,
      grandTotal: 3179.4
    },
    createTime: '2025-03-01 08:00:00',
    updateBy: 'admin',
    updateTime: '2025-03-01 08:00:00'
  }
]

/**
 * 报价状态配置
 */
export const QUOTATION_STATUS_CONFIG = {
  '1': { type: 'warning' as const, text: '待确认' },
  '2': { type: 'success' as const, text: '已接受' },
  '3': { type: 'danger' as const, text: '已拒绝' },
  '4': { type: 'info' as const, text: '已过期' }
} as const

/**
 * 根据分页参数和搜索条件筛选数据
 */
export function getQuotationListData(
  params: Api.Trade.QuotationSearchParams
): Api.Trade.QuotationList {
  const {
    current = 1,
    size = 10,
    customerId,
    customerName,
    quotationNo,
    status,
    currency,
    startTime,
    endTime
  } = params

  let filteredData = [...QUOTATION_LIST_DATA]

  // 根据搜索条件过滤
  if (customerId) {
    filteredData = filteredData.filter((item) => item.customerId === customerId)
  }
  if (customerName) {
    filteredData = filteredData.filter((item) =>
      item.customerName.toLowerCase().includes(customerName.toLowerCase())
    )
  }
  if (quotationNo) {
    filteredData = filteredData.filter((item) =>
      item.quotationNo.toLowerCase().includes(quotationNo.toLowerCase())
    )
  }
  if (status) {
    filteredData = filteredData.filter((item) => item.status === status)
  }
  if (currency) {
    filteredData = filteredData.filter((item) => item.currency === currency)
  }
  if (startTime) {
    filteredData = filteredData.filter((item) => item.quotationDate >= startTime)
  }
  if (endTime) {
    filteredData = filteredData.filter((item) => item.quotationDate <= endTime)
  }

  // 按报价日期倒序排列
  filteredData.sort(
    (a, b) => new Date(b.quotationDate).getTime() - new Date(a.quotationDate).getTime()
  )

  const total = filteredData.length

  // 分页
  const startIndex = (current - 1) * size
  const endIndex = startIndex + size
  const records = filteredData.slice(startIndex, endIndex)

  return {
    records,
    current,
    size,
    total
  }
}

/**
 * 获取客户的报价记录数
 */
export function getQuotationCountByCustomer(customerId: string): number {
  return QUOTATION_LIST_DATA.filter((item) => item.customerId === customerId).length
}

/**
 * 根据 ID 获取报价详情
 * @param id 报价 ID
 */
export function getQuotationDetailById(id: string): Api.Trade.QuotationListItem | null {
  const quotation = QUOTATION_LIST_DATA.find((item) => item.id === id)
  if (!quotation) return null
  return { ...quotation }
}

/**
 * 创建新报价
 * @param quotation 报价数据
 */
export function createQuotation(
  quotation: Partial<Api.Trade.QuotationListItem>
): Api.Trade.QuotationListItem {
  const newQuotation = {
    ...quotation,
    id: String(Date.now()),
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN'),
    updateBy: 'admin'
  } as Api.Trade.QuotationListItem

  QUOTATION_LIST_DATA.unshift(newQuotation)
  return newQuotation
}

/**
 * 更新报价
 * @param id 报价 ID
 * @param quotation 报价数据
 */
export function updateQuotation(
  id: string,
  quotation: Partial<Api.Trade.QuotationListItem>
): Api.Trade.QuotationListItem | null {
  const index = QUOTATION_LIST_DATA.findIndex((item) => item.id === id)
  if (index === -1) return null

  const updatedQuotation = {
    ...QUOTATION_LIST_DATA[index],
    ...quotation,
    updateTime: new Date().toLocaleString('zh-CN'),
    updateBy: 'admin'
  }

  QUOTATION_LIST_DATA[index] = updatedQuotation
  return updatedQuotation
}

/**
 * 删除报价
 * @param id 报价 ID
 */
export function deleteQuotation(id: string): boolean {
  const index = QUOTATION_LIST_DATA.findIndex((item) => item.id === id)
  if (index === -1) return false

  QUOTATION_LIST_DATA.splice(index, 1)
  return true
}
