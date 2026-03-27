/**
 * 模拟报价数据管理
 * 用于前端演示，替代后端 API
 */
import { QUOTATION_LIST_DATA } from './quotationList'

// 内存中的报价数据存储
const quotationData = [...QUOTATION_LIST_DATA]

// 获取下一个 ID
const getNextId = () => {
  const maxId = quotationData.reduce((max, item) => {
    const id = parseInt(item.id)
    return id > max ? id : max
  }, 0)
  return (maxId + 1).toString()
}

/**
 * 获取报价单列表
 */
export const getQuotationList = (params: { current: number; size: number }) => {
  const { current = 1, size = 10 } = params
  const start = (current - 1) * size
  const end = start + size
  const records = quotationData.slice(start, end)

  return Promise.resolve({
    code: 200,
    msg: 'success',
    data: {
      records,
      total: quotationData.length,
      current,
      size
    }
  })
}

/**
 * 获取报价单详情
 */
export const getQuotationDetail = (id: string) => {
  const quotation = quotationData.find((item) => item.id === id)
  if (!quotation) {
    return Promise.reject(new Error('报价单不存在'))
  }
  return Promise.resolve({
    code: 200,
    msg: 'success',
    data: quotation
  })
}

/**
 * 创建报价单
 */
export const createQuotation = (data: any) => {
  const newQuotation = {
    ...data,
    id: getNextId(),
    status: '1', // 默认待确认
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN'),
    updateBy: 'admin'
  }
  quotationData.push(newQuotation)
  return Promise.resolve({
    code: 200,
    msg: '保存成功',
    data: newQuotation
  })
}

/**
 * 更新报价单
 */
export const updateQuotation = (id: string, data: any) => {
  const index = quotationData.findIndex((item) => item.id === id)
  if (index === -1) {
    return Promise.reject(new Error('报价单不存在'))
  }
  quotationData[index] = {
    ...quotationData[index],
    ...data,
    updateTime: new Date().toLocaleString('zh-CN'),
    updateBy: 'admin'
  }
  return Promise.resolve({
    code: 200,
    msg: '更新成功',
    data: quotationData[index]
  })
}

/**
 * 删除报价单
 */
export const deleteQuotation = (id: string) => {
  const index = quotationData.findIndex((item) => item.id === id)
  if (index === -1) {
    return Promise.reject(new Error('报价单不存在'))
  }
  quotationData.splice(index, 1)
  return Promise.resolve({
    code: 200,
    msg: '删除成功'
  })
}

/**
 * 根据客户 ID 获取报价列表
 */
export const getQuotationsByCustomerId = (
  customerId: string,
  params: { current: number; size: number }
) => {
  const filtered = quotationData.filter((item) => item.customerId === customerId)
  const { current = 1, size = 10 } = params
  const start = (current - 1) * size
  const end = start + size
  const records = filtered.slice(start, end)

  return Promise.resolve({
    code: 200,
    msg: 'success',
    data: {
      records,
      total: filtered.length,
      current,
      size
    }
  })
}
