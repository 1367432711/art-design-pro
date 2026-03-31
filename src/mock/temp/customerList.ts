/**
 * 客户列表数据 - 基于 LocalStorage 存储
 */
import {
  getCustomerList,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById
} from '@/utils/storage/db'
import { getQuotationCountByCustomerId } from '@/utils/storage/db'
import customerData from '@/mock/data/customerList.json'

// 初始化数据（如果 LocalStorage 为空）
function initCustomerData() {
  const existing = getCustomerList()
  console.log('[CustomerData] initCustomerData - existing length:', existing.length)
  if (existing.length === 0) {
    console.log('[CustomerData] 初始化客户数据...')
    customerData.forEach((customer) => {
      addCustomer(customer as Api.Trade.CustomerListItem)
    })
    console.log('[CustomerData] 初始化完成，当前数据长度:', getCustomerList().length)
  }
}

// 自动初始化
initCustomerData()

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

  let filteredData = getCustomerList()

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
    quotationCount: getQuotationCountByCustomerId(item.id)
  }))

  return {
    records,
    current,
    size,
    total
  }
}

/**
 * 根据 ID 获取客户详情
 * @param id 客户 ID
 */
export function getCustomerDetailById(id: string): Api.Trade.CustomerListItem | null {
  // 确保数据已初始化
  initCustomerData()

  console.log('[CustomerData] getCustomerDetailById - id:', id)
  const customers = getCustomerList()
  console.log('[CustomerData] 当前客户列表:', customers)

  const customer = getCustomerById(id)
  console.log('[CustomerData] 查找到的客户:', customer)

  if (!customer) return null

  return {
    ...customer,
    quotationCount: getQuotationCountByCustomer(id)
  }
}

/**
 * 创建新客户
 */
export function createCustomer(customer: Api.Trade.CustomerListItem): Api.Trade.CustomerListItem {
  addCustomer(customer)
  return customer
}

/**
 * 更新客户
 */
export function updateCustomerData(
  id: string,
  updates: Partial<Api.Trade.CustomerListItem>
): Api.Trade.CustomerListItem | null {
  return updateCustomer(id, updates)
}

/**
 * 删除客户
 */
export function deleteCustomerData(id: string): boolean {
  return deleteCustomer(id)
}
