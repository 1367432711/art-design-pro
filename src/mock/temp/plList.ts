/**
 * PL (Packing List) Mock 数据逻辑
 */

import plListDataRaw from '../data/pl_list.json'

// 将 JSON 数据转换为可写数组
const plListData = plListDataRaw as any[]

/**
 * 获取 PL 列表
 * @param params 搜索参数
 */
export function getPLListData(params: Api.Trade.PLSearchParams) {
  const {
    current = 1,
    size = 10,
    plNo,
    invoiceNo,
    customerName,
    status,
    startTime,
    endTime
  } = params

  let list = [...plListData] as any[]

  // 筛选条件
  if (plNo) {
    list = list.filter((item) => item.plNo.includes(plNo))
  }
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
    list = list.filter((item) => item.plDate >= startTime)
  }
  if (endTime) {
    list = list.filter((item) => item.plDate <= endTime)
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
 * 获取 PL 详情
 * @param id PL ID
 */
export function getPLDetailById(id: string): Api.Trade.PLListItem | undefined {
  const result = plListData.find((item) => item.id === id)
  return result as Api.Trade.PLListItem | undefined
}

/**
 * 创建 PL
 * @param data PL 信息
 */
export function createPLData(data: Partial<Api.Trade.PLListItem>) {
  const newPL = {
    ...data,
    id: String(Date.now()),
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  } as Api.Trade.PLListItem
  plListData.push(newPL as any)
  return newPL
}

/**
 * 更新 PL
 * @param data PL 信息
 */
export function updatePLData(data: Partial<Api.Trade.PLListItem>) {
  const index = plListData.findIndex((item) => item.id === data.id)
  if (index === -1) {
    return null
  }
  plListData[index] = {
    ...plListData[index],
    ...data,
    updateTime: new Date().toISOString()
  } as Api.Trade.PLListItem
  return plListData[index]
}

/**
 * 删除 PL
 * @param id PL ID
 */
export function deletePLData(id: string) {
  const index = plListData.findIndex((item) => item.id === id)
  if (index === -1) {
    return false
  }
  plListData.splice(index, 1)
  return true
}

/**
 * 从 PI 生成 PL
 * @param piId PI ID
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createPLFromPIData(_piId: string) {
  // TODO: 实现从 PI 生成 PL 的逻辑
  return null
}
