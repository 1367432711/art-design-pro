/**
 * 模拟客户列表数据
 */
import { getQuotationCountByCustomer } from './quotationList'

export const CUSTOMER_LIST_DATA = [
  {
    id: '1',
    customerName: 'Global Tech Solutions',
    contactPerson: 'John Smith',
    contactPhone: '+1-555-0101',
    contactEmail: 'john.smith@globaltech.com',
    country: '美国',
    address: '123 Tech Avenue, Silicon Valley, CA 94025',
    products: '电子产品、智能设备',
    salesPerson: '销售 -001',
    remarks: '重点客户，年采购量超过 100 万美元',
    status: '1',
    source: '展会',
    createTime: '2025-01-15 10:30:00',
    updateTime: '2025-03-20 14:20:00',
    updateBy: 'admin'
  },
  {
    id: '2',
    customerName: 'European Trade GmbH',
    contactPerson: 'Hans Mueller',
    contactPhone: '+49-30-12345678',
    contactEmail: 'hans.mueller@eurotrade.de',
    country: '德国',
    address: 'Hauptstrasse 45, 10115 Berlin',
    products: '机械设备、工业零件',
    salesPerson: '销售 -002',
    remarks: '德国知名进口商，合作稳定',
    status: '1',
    source: '官网',
    createTime: '2025-02-10 09:15:00',
    updateTime: '2025-03-22 11:30:00',
    updateBy: 'admin'
  },
  {
    id: '3',
    customerName: 'UK Import Ltd',
    contactPerson: 'Emma Wilson',
    contactPhone: '+44-20-7946-0958',
    contactEmail: 'emma.wilson@ukimport.co.uk',
    country: '英国',
    address: '88 Oxford Street, London W1D 1BS',
    products: '纺织品、服装',
    salesPerson: '销售 -001',
    remarks: '主要做服装批发，对价格敏感',
    status: '2',
    source: '推荐',
    createTime: '2025-01-28 16:45:00',
    updateTime: '2025-03-18 09:00:00',
    updateBy: 'sales1'
  },
  {
    id: '4',
    customerName: 'Tokyo Trading Co',
    contactPerson: '田中太郎',
    contactPhone: '+81-3-1234-5678',
    contactEmail: 'tanaka@tokyotrading.jp',
    country: '日本',
    address: '1-2-3 Shibuya, Tokyo 150-0002',
    products: '汽车零部件、精密仪器',
    salesPerson: '销售 -003',
    remarks: '日本大型企业，质量要求严格',
    status: '1',
    source: '阿里国际站',
    createTime: '2025-03-01 08:00:00',
    updateTime: '2025-03-23 15:45:00',
    updateBy: 'admin'
  },
  {
    id: '5',
    customerName: 'Paris Distribution SA',
    contactPerson: 'Pierre Dubois',
    contactPhone: '+33-1-23-45-67-89',
    contactEmail: 'pierre.dubois@parisdist.fr',
    country: '法国',
    address: '25 Avenue Montaigne, 75008 Paris',
    products: '化妆品、奢侈品',
    salesPerson: '销售 -002',
    remarks: '已流失客户，价格竞争激烈',
    status: '3',
    source: '展会',
    createTime: '2024-11-20 14:30:00',
    updateTime: '2025-01-10 10:00:00',
    updateBy: 'sales2'
  },
  {
    id: '6',
    customerName: 'Sydney Imports Pty',
    contactPerson: 'Michael Brown',
    contactPhone: '+61-2-9876-5432',
    contactEmail: 'michael.brown@sydneyimports.com.au',
    country: '澳大利亚',
    address: '100 George Street, Sydney NSW 2000',
    products: '食品、保健品',
    salesPerson: '销售 -004',
    remarks: '澳洲最大进口商之一，潜力巨大',
    status: '1',
    source: '官网',
    createTime: '2025-02-15 11:20:00',
    updateTime: '2025-03-24 08:30:00',
    updateBy: 'admin'
  },
  {
    id: '7',
    customerName: 'Canada North Corp',
    contactPerson: 'Sarah Johnson',
    contactPhone: '+1-416-555-0199',
    contactEmail: 'sarah.johnson@canadanorth.ca',
    country: '加拿大',
    address: '200 Bay Street, Toronto, ON M5J 2J1',
    products: '木材、纸制品',
    salesPerson: '销售 -003',
    remarks: '新客户，正在开发中',
    status: '2',
    source: '推荐',
    createTime: '2025-03-05 13:00:00',
    updateTime: '2025-03-20 16:15:00',
    updateBy: 'sales1'
  },
  {
    id: '8',
    customerName: 'Seoul Commerce Inc',
    contactPerson: '金敏秀',
    contactPhone: '+82-2-1234-5678',
    contactEmail: 'minsoo.kim@seoulcommerce.kr',
    country: '韩国',
    address: '$No. 88 Business Road',
    products: '化妆品、电子产品',
    salesPerson: '$销售-001',
    remarks: '$重要客户，优先处理',
    status: '1',
    source: '阿里国际站',
    createTime: '2025-01-10 10:00:00',
    updateTime: '2025-03-22 14:00:00',
    updateBy: 'admin'
  },
  {
    id: '9',
    customerName: 'Shanghai Export Co',
    contactPerson: '张伟',
    contactPhone: '+86-21-6234-5678',
    contactEmail: 'zhang.wei@shanghaiexport.cn',
    country: '中国',
    address: '$123 Commerce Street',
    products: '家居用品、工艺品',
    salesPerson: '$销售-002',
    remarks: '$稳定合作客户',
    status: '1',
    source: '展会',
    createTime: '2025-02-20 09:30:00',
    updateTime: '2025-03-23 11:00:00',
    updateBy: 'sales2'
  },
  {
    id: '10',
    customerName: 'Dubai Trading LLC',
    contactPerson: 'Ahmed Al-Rashid',
    contactPhone: '+971-4-123-4567',
    contactEmail: 'ahmed@dubaitrading.ae',
    country: '其他',
    address: '$456 Trade Avenue',
    products: '建材、装饰材料',
    salesPerson: '$销售-003',
    remarks: '$新客户，需跟进',
    status: '2',
    source: '官网',
    createTime: '2025-03-10 15:45:00',
    updateTime: '2025-03-21 10:30:00',
    updateBy: 'admin'
  },
  {
    id: '11',
    customerName: 'Milano Fashion SRL',
    contactPerson: 'Marco Rossi',
    contactPhone: '+39-02-1234-5678',
    contactEmail: 'marco.rossi@milanofashion.it',
    country: '意大利',
    address: '$789 Industry Park',
    products: '服装、皮具',
    salesPerson: '$销售-004',
    remarks: '$价格敏感型客户',
    status: '1',
    source: '推荐',
    createTime: '2025-01-05 12:00:00',
    updateTime: '2025-03-24 09:15:00',
    updateBy: 'sales1'
  },
  {
    id: '12',
    customerName: 'Madrid Import SL',
    contactPerson: 'Carlos Garcia',
    contactPhone: '+34-91-123-4567',
    contactEmail: 'carlos.garcia@madridimport.es',
    country: '西班牙',
    address: '$321 Export Zone',
    products: '葡萄酒、食品',
    salesPerson: '$销售-005',
    remarks: '$质量要求高',
    status: '3',
    source: '展会',
    createTime: '2024-12-01 10:30:00',
    updateTime: '2025-02-15 14:00:00',
    updateBy: 'admin'
  },
  {
    id: '13',
    customerName: 'Amsterdam Trade BV',
    contactPerson: 'Jan de Vries',
    contactPhone: '+31-20-123-4567',
    contactEmail: 'jan.devries@amsterdamtrade.nl',
    country: '荷兰',
    address: '$654 Market District',
    products: '花卉、园艺用品',
    salesPerson: '$销售-006',
    remarks: '$长期合作伙伴',
    status: '1',
    source: '阿里国际站',
    createTime: '2025-02-28 08:45:00',
    updateTime: '2025-03-23 16:30:00',
    updateBy: 'sales2'
  },
  {
    id: '14',
    customerName: 'Stockholm Nordic AB',
    contactPerson: 'Lars Andersson',
    contactPhone: '+46-8-123-456',
    contactEmail: 'lars.andersson@stockholmnordic.se',
    country: '瑞典',
    address: '$987 Financial Center',
    products: '家具、家居装饰',
    salesPerson: '$销售-007',
    remarks: '$潜力客户',
    status: '2',
    source: '官网',
    createTime: '2025-03-08 11:15:00',
    updateTime: '2025-03-22 13:45:00',
    updateBy: 'admin'
  },
  {
    id: '15',
    customerName: 'Singapore Global Pte',
    contactPerson: 'Lim Wei Ming',
    contactPhone: '+65-6123-4567',
    contactEmail: 'weiming@singaporeglobal.sg',
    country: '其他',
    address: '$147 Logistics Hub',
    products: '电子元器件、半导体',
    salesPerson: '$销售-008',
    remarks: '$重点维护客户',
    status: '1',
    source: '推荐',
    createTime: '2025-01-20 14:00:00',
    updateTime: '2025-03-24 10:00:00',
    updateBy: 'sales1'
  },
  {
    id: '16',
    customerName: 'Brazil Import Ltda',
    contactPerson: 'Carlos Silva',
    contactPhone: '+55-11-1234-5678',
    contactEmail: 'carlos.silva@brazilimport.br',
    country: '其他',
    address: '$258 Enterprise Plaza',
    products: '咖啡、农产品',
    salesPerson: '$销售-009',
    remarks: '$一般客户',
    status: '2',
    source: '展会',
    createTime: '2025-02-05 16:30:00',
    updateTime: '2025-03-19 11:45:00',
    updateBy: 'admin'
  },
  {
    id: '17',
    customerName: 'Moscow Trading OOO',
    contactPerson: 'Ivan Petrov',
    contactPhone: '+7-495-123-4567',
    contactEmail: 'ivan.petrov@moscowtrading.ru',
    country: '其他',
    address: '$369 Corporate Blvd',
    products: '石油产品、化工原料',
    salesPerson: '$销售-010',
    remarks: '$待开发客户',
    status: '3',
    source: '阿里国际站',
    createTime: '2024-10-15 09:00:00',
    updateTime: '2025-01-20 15:30:00',
    updateBy: 'sales2'
  },
  {
    id: '18',
    customerName: 'Mumbai Export Pvt',
    contactPerson: 'Raj Patel',
    contactPhone: '+91-22-1234-5678',
    contactEmail: 'raj.patel@mumbaiexport.in',
    country: '其他',
    address: '$No. 88 Business Road',
    products: '纺织品、珠宝',
    salesPerson: '$销售-001',
    remarks: '$重要客户，优先处理',
    status: '1',
    source: '官网',
    createTime: '2025-03-12 10:45:00',
    updateTime: '2025-03-24 08:00:00',
    updateBy: 'admin'
  },
  {
    id: '19',
    customerName: 'Bangkok Commerce Co',
    contactPerson: 'Somchai Patel',
    contactPhone: '+66-2-123-4567',
    contactEmail: 'somchai@bangkokcommerce.th',
    country: '其他',
    address: '$123 Commerce Street',
    products: '橡胶制品、塑料制品',
    salesPerson: '$销售-002',
    remarks: '$稳定合作客户',
    status: '2',
    source: '推荐',
    createTime: '2025-02-25 13:30:00',
    updateTime: '2025-03-21 09:30:00',
    updateBy: 'sales1'
  },
  {
    id: '20',
    customerName: 'Vietnam Trade JSC',
    contactPerson: 'Nguyen Van Anh',
    contactPhone: '+84-24-1234-5678',
    contactEmail: 'nguyen.vanh@vietnamtrade.vn',
    country: '其他',
    address: '$456 Trade Avenue',
    products: '鞋类、箱包',
    salesPerson: '$销售-003',
    remarks: '$新客户，需跟进',
    status: '1',
    source: '展会',
    createTime: '2025-01-30 15:00:00',
    updateTime: '2025-03-23 14:15:00',
    updateBy: 'admin'
  }
]

/**
 * 根据分页参数和搜索条件筛选数据
 */
export function getCustomerListData(
  params: Api.Trade.CustomerSearchParams
): Api.Trade.CustomerList {
  const {
    current = 1,
    size = 10,
    customerName,
    contactPerson,
    contactPhone,
    contactEmail,
    country,
    status
  } = params

  let filteredData = [...CUSTOMER_LIST_DATA]

  // 根据搜索条件过滤
  if (customerName) {
    filteredData = filteredData.filter((item) =>
      item.customerName.toLowerCase().includes(customerName.toLowerCase())
    )
  }
  if (contactPerson) {
    filteredData = filteredData.filter((item) =>
      item.contactPerson.toLowerCase().includes(contactPerson.toLowerCase())
    )
  }
  if (contactPhone) {
    filteredData = filteredData.filter((item) => item.contactPhone.includes(contactPhone))
  }
  if (contactEmail) {
    filteredData = filteredData.filter((item) =>
      item.contactEmail.toLowerCase().includes(contactEmail.toLowerCase())
    )
  }
  if (country) {
    filteredData = filteredData.filter((item) => item.country === country)
  }
  if (status) {
    filteredData = filteredData.filter((item) => item.status === status)
  }

  const total = filteredData.length

  // 分页
  const startIndex = (current - 1) * size
  const endIndex = startIndex + size
  const records = filteredData.slice(startIndex, endIndex).map((item) => ({
    ...item,
    quotationCount: getQuotationCountByCustomer(item.id)
  }))

  return {
    records,
    current,
    size,
    total
  }
}
