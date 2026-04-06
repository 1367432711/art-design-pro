/**
 * 报价记录数据 - 基于 LocalStorage 存储（支持多产品结构）
 *
 * 开发环境下：
 * - 每次页面加载时都会从 JSON 文件重新加载数据
 * - 数据修改后自动同步回 JSON 文件（通过 Vite 插件）
 */
import {
  getQuotationList,
  addQuotation,
  updateQuotation,
  deleteQuotation,
  getQuotationById,
  getQuotationCountByCustomerId
} from '@/utils/storage/db'
import quotationData from '@/mock/data/quotationList.json'

// 初始化数据（开发环境每次从 JSON 重新加载）
function initQuotationData() {
  // 开发环境：每次从 JSON 文件重新加载
  if (import.meta.env.DEV && quotationData && quotationData.length > 0) {
    // 清空 LocalStorage 中的旧数据，用 JSON 文件的数据替换
    const existing = getQuotationList()
    if (existing.length > 0) {
      existing.forEach((item) => deleteQuotation(item.id))
    }
    console.log('[QuotationData] 从 JSON 文件初始化报价数据...')
    quotationData.forEach((quotation) => {
      addQuotation(quotation as Api.Trade.QuotationListItem)
    })
    console.log('[QuotationData] 初始化完成，当前数据长度:', getQuotationList().length)
    return
  }

  // 生产环境或 JSON 无数据：检查 LocalStorage
  const existing = getQuotationList()
  if (existing.length === 0) {
    quotationData.forEach((quotation) => {
      addQuotation(quotation as Api.Trade.QuotationListItem)
    })
  }
}

// 自动初始化
initQuotationData()

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

  let filteredData = getQuotationList()

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
  return getQuotationCountByCustomerId(customerId)
}

/**
 * 根据 ID 获取报价详情
 * @param id 报价 ID
 */
export function getQuotationDetailById(id: string): Api.Trade.QuotationListItem | null {
  return getQuotationById(id) || null
}

/**
 * 创建新报价
 */
export function createQuotationData(
  quotation: Partial<Api.Trade.QuotationListItem>
): Api.Trade.QuotationListItem {
  const newQuotation = {
    ...quotation,
    id: String(Date.now()),
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN'),
    updateBy: 'admin'
  } as Api.Trade.QuotationListItem

  addQuotation(newQuotation)
  return newQuotation
}

/**
 * 更新报价
 */
export function updateQuotationData(
  id: string,
  quotation: Partial<Api.Trade.QuotationListItem>
): Api.Trade.QuotationListItem | null {
  return updateQuotation(id, quotation)
}

/**
 * 删除报价
 */
export function deleteQuotationData(id: string): boolean {
  return deleteQuotation(id)
}
