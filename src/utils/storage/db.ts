/**
 * LocalStorage 数据管理工具
 * 用于在浏览器本地存储和管理数据
 */

// 存储键名
const STORAGE_KEYS = {
  CUSTOMER_LIST: 'trade_customer_list',
  PRODUCT_LIST: 'trade_product_list',
  QUOTATION_LIST: 'trade_quotation_list',
  USER_INFO: 'user_info'
} as const

/**
 * 从 LocalStorage 获取数据
 */
export function getFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key)
    if (!data) return []
    return JSON.parse(data)
  } catch (error) {
    console.error(`读取 ${key} 失败:`, error)
    return []
  }
}

/**
 * 保存数据到 LocalStorage
 */
export function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`保存 ${key} 失败:`, error)
  }
}

/**
 * 从 JSON 文件初始化数据（如果 LocalStorage 为空）
 */
export function initFromJson<T>(storageKey: string, jsonData: T[]): void {
  const existingData = getFromStorage<T>(storageKey)
  if (existingData.length === 0) {
    saveToStorage(storageKey, jsonData)
  }
}

// ==================== 客户数据操作 ====================

/**
 * 获取客户列表
 */
export function getCustomerList() {
  return getFromStorage<Api.Trade.CustomerListItem>(STORAGE_KEYS.CUSTOMER_LIST)
}

/**
 * 保存客户列表
 */
export function saveCustomerList(customers: Api.Trade.CustomerListItem[]) {
  saveToStorage(STORAGE_KEYS.CUSTOMER_LIST, customers)
}

/**
 * 根据 ID 获取客户
 */
export function getCustomerById(id: string): Api.Trade.CustomerListItem | undefined {
  const customers = getCustomerList()
  return customers.find((c) => c.id === id)
}

/**
 * 添加客户
 */
export function addCustomer(customer: Api.Trade.CustomerListItem) {
  const customers = getCustomerList()
  customers.push(customer)
  saveCustomerList(customers)
}

/**
 * 更新客户
 */
export function updateCustomer(id: string, updates: Partial<Api.Trade.CustomerListItem>) {
  const customers = getCustomerList()
  const index = customers.findIndex((c) => c.id === id)
  if (index !== -1) {
    customers[index] = {
      ...customers[index],
      ...updates,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    saveCustomerList(customers)
    return customers[index]
  }
  return null
}

/**
 * 删除客户
 */
export function deleteCustomer(id: string) {
  const customers = getCustomerList()
  const filtered = customers.filter((c) => c.id !== id)
  if (filtered.length !== customers.length) {
    saveCustomerList(filtered)
    return true
  }
  return false
}

// ==================== 产品数据操作 ====================

/**
 * 获取产品列表
 */
export function getProductList() {
  return getFromStorage<Api.Trade.ProductListItem>(STORAGE_KEYS.PRODUCT_LIST)
}

/**
 * 保存产品列表
 */
export function saveProductList(products: Api.Trade.ProductListItem[]) {
  saveToStorage(STORAGE_KEYS.PRODUCT_LIST, products)
}

/**
 * 根据 ID 获取产品
 */
export function getProductById(id: string): Api.Trade.ProductListItem | undefined {
  const products = getProductList()
  return products.find((p) => p.id === id)
}

/**
 * 添加产品
 */
export function addProduct(product: Api.Trade.ProductListItem) {
  const products = getProductList()
  products.push(product)
  saveProductList(products)
}

/**
 * 更新产品
 */
export function updateProduct(id: string, updates: Partial<Api.Trade.ProductListItem>) {
  const products = getProductList()
  const index = products.findIndex((p) => p.id === id)
  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...updates,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    saveProductList(products)
    return products[index]
  }
  return null
}

/**
 * 删除产品
 */
export function deleteProduct(id: string) {
  const products = getProductList()
  const filtered = products.filter((p) => p.id !== id)
  if (filtered.length !== products.length) {
    saveProductList(filtered)
    return true
  }
  return false
}

// ==================== 报价数据操作 ====================

/**
 * 获取报价列表
 */
export function getQuotationList() {
  return getFromStorage<Api.Trade.QuotationListItem>(STORAGE_KEYS.QUOTATION_LIST)
}

/**
 * 保存报价列表
 */
export function saveQuotationList(quotations: Api.Trade.QuotationListItem[]) {
  saveToStorage(STORAGE_KEYS.QUOTATION_LIST, quotations)
}

/**
 * 根据 ID 获取报价
 */
export function getQuotationById(id: string): Api.Trade.QuotationListItem | undefined {
  const quotations = getQuotationList()
  return quotations.find((q) => q.id === id)
}

/**
 * 根据客户 ID 获取报价数量
 */
export function getQuotationCountByCustomerId(customerId: string): number {
  const quotations = getQuotationList()
  return quotations.filter((q) => q.customerId === customerId).length
}

/**
 * 添加报价
 */
export function addQuotation(quotation: Api.Trade.QuotationListItem) {
  const quotations = getQuotationList()
  quotations.push(quotation)
  saveQuotationList(quotations)
}

/**
 * 更新报价
 */
export function updateQuotation(id: string, updates: Partial<Api.Trade.QuotationListItem>) {
  const quotations = getQuotationList()
  const index = quotations.findIndex((q) => q.id === id)
  if (index !== -1) {
    quotations[index] = {
      ...quotations[index],
      ...updates,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    saveQuotationList(quotations)
    return quotations[index]
  }
  return null
}

/**
 * 删除报价
 */
export function deleteQuotation(id: string) {
  const quotations = getQuotationList()
  const filtered = quotations.filter((q) => q.id !== id)
  if (filtered.length !== quotations.length) {
    saveQuotationList(filtered)
    return true
  }
  return false
}

// ==================== 数据导出/导入 ====================

/**
 * 导出所有数据为 JSON 文件
 */
export function exportAllData(filename: string) {
  const data = {
    customers: getCustomerList(),
    products: getProductList(),
    quotations: getQuotationList(),
    userInfo: getUserInfo()
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * 导出单个模块数据为 JSON 文件
 */
export function exportModuleData(
  module: 'customer' | 'product' | 'quotation' | 'user',
  filename?: string
) {
  let data: any
  let defaultFilename: string

  switch (module) {
    case 'customer':
      data = getCustomerList()
      defaultFilename = 'customerList'
      break
    case 'product':
      data = getProductList()
      defaultFilename = 'productList'
      break
    case 'quotation':
      data = getQuotationList()
      defaultFilename = 'quotationList'
      break
    case 'user':
      data = getUserInfo()
      defaultFilename = 'userInfo'
      break
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename || defaultFilename}-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * 从 JSON 文件导入所有数据
 */
export function importAllData(jsonString: string) {
  try {
    const data = JSON.parse(jsonString)
    if (data.customers) saveCustomerList(data.customers)
    if (data.products) saveProductList(data.products)
    if (data.quotations) saveQuotationList(data.quotations)
    if (data.userInfo) saveUserInfo(data.userInfo)
    return true
  } catch (error) {
    console.error('导入数据失败:', error)
    return false
  }
}

/**
 * 从 JSON 文件导入单个模块数据
 */
export function importModuleData(
  module: 'customer' | 'product' | 'quotation' | 'user',
  jsonString: string
) {
  try {
    const data = JSON.parse(jsonString)
    switch (module) {
      case 'customer':
        if (Array.isArray(data)) {
          data.forEach((item) => addCustomer(item as Api.Trade.CustomerListItem))
        }
        break
      case 'product':
        if (Array.isArray(data)) {
          data.forEach((item) => addProduct(item as Api.Trade.ProductListItem))
        }
        break
      case 'quotation':
        if (Array.isArray(data)) {
          data.forEach((item) => addQuotation(item as Api.Trade.QuotationListItem))
        }
        break
      case 'user':
        saveUserInfo(data as Partial<Api.Auth.UserInfo>)
        break
    }
    return true
  } catch (error) {
    console.error(`导入${module}数据失败:`, error)
    return false
  }
}

/**
 * 清空所有数据
 */
export function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.CUSTOMER_LIST)
  localStorage.removeItem(STORAGE_KEYS.PRODUCT_LIST)
  localStorage.removeItem(STORAGE_KEYS.QUOTATION_LIST)
  localStorage.removeItem(STORAGE_KEYS.USER_INFO)
}

/**
 * 清空单个模块数据
 */
export function clearModuleData(module: 'customer' | 'product' | 'quotation' | 'user') {
  switch (module) {
    case 'customer':
      localStorage.removeItem(STORAGE_KEYS.CUSTOMER_LIST)
      break
    case 'product':
      localStorage.removeItem(STORAGE_KEYS.PRODUCT_LIST)
      break
    case 'quotation':
      localStorage.removeItem(STORAGE_KEYS.QUOTATION_LIST)
      break
    case 'user':
      localStorage.removeItem(STORAGE_KEYS.USER_INFO)
      break
  }
}

// ==================== 用户信息数据操作 ====================

/**
 * 获取用户信息
 */
export function getUserInfo(): Partial<Api.Auth.UserInfo> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_INFO)
    if (!data) return {}
    return JSON.parse(data)
  } catch (error) {
    console.error('读取用户信息失败:', error)
    return {}
  }
}

/**
 * 保存用户信息
 */
export function saveUserInfo(info: Partial<Api.Auth.UserInfo>) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(info))
  } catch (error) {
    console.error('保存用户信息失败:', error)
  }
}

/**
 * 更新用户信息
 */
export function updateUserInfo(updates: Partial<Api.Auth.UserInfo>): Partial<Api.Auth.UserInfo> {
  const current = getUserInfo()
  const updated = { ...current, ...updates }
  saveUserInfo(updated)
  return updated
}

/**
 * 初始化用户信息（从 JSON 文件）
 */
export function initUserInfoFromJson(jsonData: Partial<Api.Auth.UserInfo>) {
  const existing = getUserInfo()
  if (Object.keys(existing).length === 0) {
    saveUserInfo(jsonData)
  }
}
