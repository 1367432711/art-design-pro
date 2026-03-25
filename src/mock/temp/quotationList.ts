/**
 * 模拟报价记录数据
 */
export const QUOTATION_LIST_DATA = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Global Tech Solutions',
    quotationNo: 'QT20250115001',
    productName: '智能手表 X1',
    specification: '黑色，42mm, 蓝牙版',
    quantity: 500,
    unit: 'PCS',
    unitPrice: 45.0,
    currency: 'USD',
    totalPrice: 22500.0,
    tradeTerm: 'FOB Shenzhen',
    paymentTerm: 'T/T 30% deposit',
    validity: '2025-02-15',
    remarks: '含定制包装',
    status: '1', // 待确认
    quotationDate: '2025-01-15',
    createTime: '2025-01-15 10:30:00',
    updateBy: 'admin',
    updateTime: '2025-01-15 10:30:00'
  },
  {
    id: '2',
    customerId: '1',
    customerName: 'Global Tech Solutions',
    quotationNo: 'QT20250220001',
    productName: '智能手表 X1',
    specification: '银色，46mm, GPS 版',
    quantity: 300,
    unit: 'PCS',
    unitPrice: 55.0,
    currency: 'USD',
    totalPrice: 16500.0,
    tradeTerm: 'FOB Shenzhen',
    paymentTerm: 'T/T 30% deposit',
    validity: '2025-03-20',
    remarks: '新客户首单优惠 5%',
    status: '2', // 已接受
    quotationDate: '2025-02-20',
    createTime: '2025-02-20 14:00:00',
    updateBy: 'admin',
    updateTime: '2025-02-22 09:00:00'
  },
  {
    id: '3',
    customerId: '1',
    customerName: 'Global Tech Solutions',
    quotationNo: 'QT20250310001',
    productName: '无线耳机 Pro',
    specification: '白色，降噪版',
    quantity: 1000,
    unit: 'PCS',
    unitPrice: 28.0,
    currency: 'USD',
    totalPrice: 28000.0,
    tradeTerm: 'CIF Los Angeles',
    paymentTerm: 'L/C at sight',
    validity: '2025-04-10',
    remarks: '',
    status: '1', // 待确认
    quotationDate: '2025-03-10',
    createTime: '2025-03-10 11:00:00',
    updateBy: 'admin',
    updateTime: '2025-03-10 11:00:00'
  },
  {
    id: '4',
    customerId: '2',
    customerName: 'European Trade GmbH',
    quotationNo: 'QT20250210001',
    productName: '工业机械臂 A3',
    specification: '负载 10kg, 6 轴',
    quantity: 5,
    unit: 'Set',
    unitPrice: 15000.0,
    currency: 'EUR',
    totalPrice: 75000.0,
    tradeTerm: 'CIF Hamburg',
    paymentTerm: 'T/T 50% advance',
    validity: '2025-03-10',
    remarks: '含安装调试',
    status: '2', // 已接受
    quotationDate: '2025-02-10',
    createTime: '2025-02-10 09:15:00',
    updateBy: 'admin',
    updateTime: '2025-02-15 16:00:00'
  },
  {
    id: '5',
    customerId: '2',
    customerName: 'European Trade GmbH',
    quotationNo: 'QT20250305001',
    productName: '精密传感器 S100',
    specification: '精度 0.01mm, IP67',
    quantity: 200,
    unit: 'PCS',
    unitPrice: 85.0,
    currency: 'EUR',
    totalPrice: 17000.0,
    tradeTerm: 'FOB Shanghai',
    paymentTerm: 'T/T 30% deposit',
    validity: '2025-04-05',
    remarks: '批量订购优惠',
    status: '1', // 待确认
    quotationDate: '2025-03-05',
    createTime: '2025-03-05 14:30:00',
    updateBy: 'admin',
    updateTime: '2025-03-05 14:30:00'
  },
  {
    id: '6',
    customerId: '3',
    customerName: 'UK Import Ltd',
    quotationNo: 'QT20250128001',
    productName: '纯棉 T 恤',
    specification: '白色，L/XL/XXL',
    quantity: 5000,
    unit: 'PCS',
    unitPrice: 3.5,
    currency: 'USD',
    totalPrice: 17500.0,
    tradeTerm: 'FOB Guangzhou',
    paymentTerm: 'T/T 30% deposit',
    validity: '2025-03-28',
    remarks: '可定制 Logo',
    status: '3', // 已拒绝
    quotationDate: '2025-01-28',
    createTime: '2025-01-28 16:45:00',
    updateBy: 'sales1',
    updateTime: '2025-02-05 10:00:00'
  },
  {
    id: '7',
    customerId: '4',
    customerName: 'Tokyo Trading Co',
    quotationNo: 'QT20250301001',
    productName: '汽车制动片',
    specification: '陶瓷材质，前轮',
    quantity: 2000,
    unit: 'Set',
    unitPrice: 12.0,
    currency: 'USD',
    totalPrice: 24000.0,
    tradeTerm: 'CIF Tokyo',
    paymentTerm: 'L/C 90 days',
    validity: '2025-04-01',
    remarks: '符合 JIS 标准',
    status: '1', // 待确认
    quotationDate: '2025-03-01',
    createTime: '2025-03-01 08:00:00',
    updateBy: 'admin',
    updateTime: '2025-03-01 08:00:00'
  },
  {
    id: '8',
    customerId: '4',
    customerName: 'Tokyo Trading Co',
    quotationNo: 'QT20250320001',
    productName: '汽车滤清器',
    specification: '机油滤清器，通用型',
    quantity: 3000,
    unit: 'PCS',
    unitPrice: 5.5,
    currency: 'USD',
    totalPrice: 16500.0,
    tradeTerm: 'CIF Tokyo',
    paymentTerm: 'T/T 30% deposit',
    validity: '2025-04-20',
    remarks: '',
    status: '1', // 待确认
    quotationDate: '2025-03-20',
    createTime: '2025-03-20 15:45:00',
    updateBy: 'admin',
    updateTime: '2025-03-20 15:45:00'
  },
  {
    id: '9',
    customerId: '5',
    customerName: 'Paris Distribution SA',
    quotationNo: 'QT20241120001',
    productName: '香水套装',
    specification: '50ml*3 支装',
    quantity: 1000,
    unit: 'Set',
    unitPrice: 25.0,
    currency: 'EUR',
    totalPrice: 25000.0,
    tradeTerm: 'EXW Guangzhou',
    paymentTerm: 'T/T 100% advance',
    validity: '2024-12-20',
    remarks: '礼盒包装',
    status: '4', // 已过期
    quotationDate: '2024-11-20',
    createTime: '2024-11-20 14:30:00',
    updateBy: 'sales2',
    updateTime: '2024-12-21 09:00:00'
  },
  {
    id: '10',
    customerId: '6',
    customerName: 'Sydney Imports Pty',
    quotationNo: 'QT20250215001',
    productName: '有机蜂蜜',
    specification: '500g 玻璃瓶装',
    quantity: 2000,
    unit: 'Bottles',
    unitPrice: 8.0,
    currency: 'USD',
    totalPrice: 16000.0,
    tradeTerm: 'CIF Sydney',
    paymentTerm: 'T/T 30% deposit',
    validity: '2025-03-15',
    remarks: '有机认证',
    status: '2', // 已接受
    quotationDate: '2025-02-15',
    createTime: '2025-02-15 11:20:00',
    updateBy: 'admin',
    updateTime: '2025-02-18 10:00:00'
  },
  {
    id: '11',
    customerId: '6',
    customerName: 'Sydney Imports Pty',
    quotationNo: 'QT20250322001',
    productName: '坚果礼盒',
    specification: '混合装 1kg',
    quantity: 1500,
    unit: 'Boxes',
    unitPrice: 15.0,
    currency: 'USD',
    totalPrice: 22500.0,
    tradeTerm: 'CIF Melbourne',
    paymentTerm: 'T/T 30% deposit',
    validity: '2025-04-22',
    remarks: '春节特惠',
    status: '1', // 待确认
    quotationDate: '2025-03-22',
    createTime: '2025-03-22 08:30:00',
    updateBy: 'admin',
    updateTime: '2025-03-22 08:30:00'
  },
  {
    id: '12',
    customerId: '8',
    customerName: 'Seoul Commerce Inc',
    quotationNo: 'QT20250110001',
    productName: '面膜套装',
    specification: '玻尿酸，10 片/盒',
    quantity: 3000,
    unit: 'Boxes',
    unitPrice: 6.0,
    currency: 'USD',
    totalPrice: 18000.0,
    tradeTerm: 'FOB Busan',
    paymentTerm: 'T/T 30% deposit',
    validity: '2025-02-10',
    remarks: '韩文标签',
    status: '2', // 已接受
    quotationDate: '2025-01-10',
    createTime: '2025-01-10 10:00:00',
    updateBy: 'admin',
    updateTime: '2025-01-15 14:00:00'
  },
  {
    id: '13',
    customerId: '8',
    customerName: 'Seoul Commerce Inc',
    quotationNo: 'QT20250305001',
    productName: '精华液',
    specification: '30ml 美白淡斑',
    quantity: 2000,
    unit: 'PCS',
    unitPrice: 12.0,
    currency: 'USD',
    totalPrice: 24000.0,
    tradeTerm: 'FOB Shanghai',
    paymentTerm: 'L/C at sight',
    validity: '2025-04-05',
    remarks: '',
    status: '1', // 待确认
    quotationDate: '2025-03-05',
    createTime: '2025-03-05 11:00:00',
    updateBy: 'admin',
    updateTime: '2025-03-05 11:00:00'
  },
  {
    id: '14',
    customerId: '9',
    customerName: 'Shanghai Export Co',
    quotationNo: 'QT20250220001',
    productName: '陶瓷餐具套装',
    specification: '56 头骨瓷',
    quantity: 500,
    unit: 'Sets',
    unitPrice: 35.0,
    currency: 'USD',
    totalPrice: 17500.0,
    tradeTerm: 'FOB Jingdezhen',
    paymentTerm: 'T/T 30% deposit',
    validity: '2025-03-20',
    remarks: '可定制花面',
    status: '1', // 待确认
    quotationDate: '2025-02-20',
    createTime: '2025-02-20 09:30:00',
    updateBy: 'sales2',
    updateTime: '2025-02-20 09:30:00'
  },
  {
    id: '15',
    customerId: '11',
    customerName: 'Milano Fashion SRL',
    quotationNo: 'QT20250105001',
    productName: '真皮手提包',
    specification: '头层牛皮，黑色',
    quantity: 200,
    unit: 'PCS',
    unitPrice: 65.0,
    currency: 'EUR',
    totalPrice: 13000.0,
    tradeTerm: 'CIF Milan',
    paymentTerm: 'T/T 50% advance',
    validity: '2025-02-05',
    remarks: '意大利设计',
    status: '2', // 已接受
    quotationDate: '2025-01-05',
    createTime: '2025-01-05 12:00:00',
    updateBy: 'sales1',
    updateTime: '2025-01-10 09:00:00'
  },
  {
    id: '16',
    customerId: '11',
    customerName: 'Milano Fashion SRL',
    quotationNo: 'QT20250315001',
    productName: '羊绒围巾',
    specification: '100% 山羊绒，多色',
    quantity: 500,
    unit: 'PCS',
    unitPrice: 28.0,
    currency: 'EUR',
    totalPrice: 14000.0,
    tradeTerm: 'FOB Shanghai',
    paymentTerm: 'T/T 30% deposit',
    validity: '2025-04-15',
    remarks: '秋冬新款',
    status: '1', // 待确认
    quotationDate: '2025-03-15',
    createTime: '2025-03-15 14:00:00',
    updateBy: 'admin',
    updateTime: '2025-03-15 14:00:00'
  },
  {
    id: '17',
    customerId: '13',
    customerName: 'Amsterdam Trade BV',
    quotationNo: 'QT20250228001',
    productName: 'LED 植物生长灯',
    specification: '300W 全光谱',
    quantity: 100,
    unit: 'PCS',
    unitPrice: 45.0,
    currency: 'EUR',
    totalPrice: 4500.0,
    tradeTerm: 'CIF Rotterdam',
    paymentTerm: 'T/T 30% deposit',
    validity: '2025-03-28',
    remarks: '欧盟 CE 认证',
    status: '1', // 待确认
    quotationDate: '2025-02-28',
    createTime: '2025-02-28 08:45:00',
    updateBy: 'admin',
    updateTime: '2025-02-28 08:45:00'
  },
  {
    id: '18',
    customerId: '15',
    customerName: 'Singapore Global Pte',
    quotationNo: 'QT20250120001',
    productName: 'PCB 电路板',
    specification: '4 层板，10x10cm',
    quantity: 5000,
    unit: 'PCS',
    unitPrice: 2.5,
    currency: 'USD',
    totalPrice: 12500.0,
    tradeTerm: 'FOB Shenzhen',
    paymentTerm: 'T/T 30% deposit',
    validity: '2025-02-20',
    remarks: 'RoHS 合规',
    status: '2', // 已接受
    quotationDate: '2025-01-20',
    createTime: '2025-01-20 14:00:00',
    updateBy: 'sales1',
    updateTime: '2025-01-25 10:00:00'
  },
  {
    id: '19',
    customerId: '15',
    customerName: 'Singapore Global Pte',
    quotationNo: 'QT20250320001',
    productName: 'IC 芯片',
    specification: 'MCU ARM Cortex-M4',
    quantity: 10000,
    unit: 'PCS',
    unitPrice: 1.8,
    currency: 'USD',
    totalPrice: 18000.0,
    tradeTerm: 'FOB Hong Kong',
    paymentTerm: 'T/T 30% deposit',
    validity: '2025-04-20',
    remarks: '原装正品',
    status: '1', // 待确认
    quotationDate: '2025-03-20',
    createTime: '2025-03-20 10:00:00',
    updateBy: 'admin',
    updateTime: '2025-03-20 10:00:00'
  },
  {
    id: '20',
    customerId: '18',
    customerName: 'Mumbai Export Pvt',
    quotationNo: 'QT20250312001',
    productName: '纯棉纱丽',
    specification: '手工刺绣，多色',
    quantity: 1000,
    unit: 'PCS',
    unitPrice: 18.0,
    currency: 'USD',
    totalPrice: 18000.0,
    tradeTerm: 'FOB Mumbai',
    paymentTerm: 'L/C at sight',
    validity: '2025-04-12',
    remarks: '印度传统工艺',
    status: '1', // 待确认
    quotationDate: '2025-03-12',
    createTime: '2025-03-12 10:45:00',
    updateBy: 'admin',
    updateTime: '2025-03-12 10:45:00'
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
    productName,
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
  if (productName) {
    filteredData = filteredData.filter((item) =>
      item.productName.toLowerCase().includes(productName.toLowerCase())
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
