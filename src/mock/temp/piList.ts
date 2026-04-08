/**
 * PI (Proforma Invoice) Mock 数据逻辑
 */

import piListDataRaw from '../data/pi_list.json'

// 将 JSON 数据转换为可写数组
const piListData = piListDataRaw as any[]

/**
 * 获取 PI 列表
 * @param params 搜索参数
 */
export function getPIListData(params: Api.Trade.PISearchParams) {
  const { current = 1, size = 10, invoiceNo, customerName, status, startTime, endTime } = params

  let list = [...piListData] as any[]

  // 筛选条件
  if (invoiceNo) {
    list = list.filter((item) => item.invoiceNo.includes(invoiceNo))
  }
  if (customerName) {
    list = list.filter((item) => item.customerName.includes(customerName))
  }
  if (status) {
    list = list.filter((item) => item.status === status)
  }
  if (startTime) {
    list = list.filter((item) => item.piDate >= startTime)
  }
  if (endTime) {
    list = list.filter((item) => item.piDate <= endTime)
  }

  const total = list.length

  // 分页
  const startIndex = (current - 1) * size
  const endIndex = startIndex + size
  list = list.slice(startIndex, endIndex)

  return {
    records: list,
    current,
    size,
    total
  }
}

/**
 * 获取 PI 详情
 * @param id PI ID
 */
export function getPIDetailById(id: string): Api.Trade.PIListItem | undefined {
  const result = piListData.find((item) => item.id === id)
  return result as Api.Trade.PIListItem | undefined
}

/**
 * 创建 PI
 * @param data PI 信息
 */
export function createPIData(data: Partial<Api.Trade.PIListItem>) {
  const newPI = {
    ...data,
    id: String(Date.now()),
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  } as Api.Trade.PIListItem
  piListData.push(newPI as any)
  return newPI
}

/**
 * 更新 PI
 * @param data PI 信息
 */
export function updatePIData(data: Partial<Api.Trade.PIListItem>) {
  const index = piListData.findIndex((item) => item.id === data.id)
  if (index === -1) {
    return null
  }
  piListData[index] = {
    ...piListData[index],
    ...data,
    updateTime: new Date().toISOString()
  } as Api.Trade.PIListItem
  return piListData[index]
}

/**
 * 删除 PI
 * @param id PI ID
 */
export function deletePIData(id: string) {
  const index = piListData.findIndex((item) => item.id === id)
  if (index === -1) {
    return false
  }
  piListData.splice(index, 1)
  return true
}

/**
 * 从报价单生成 PI
 * @param quotationId 报价单 ID
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createPIFromQuotationData(_quotationId: string) {
  // TODO: 实现从报价单生成 PI 的逻辑
  return null
}
