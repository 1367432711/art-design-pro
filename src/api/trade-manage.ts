import request from '@/utils/http'
import { getCustomerListData } from '@/mock/temp/customerList'
import { getQuotationListData, getQuotationCountByCustomer } from '@/mock/temp/quotationList'

// ==================== 客户管理 ====================

/**
 * 获取客户列表
 * @param params 搜索参数
 */
export function fetchGetCustomerList(params: Api.Trade.CustomerSearchParams) {
  // 使用模拟数据（开发环境）
  const data = getCustomerListData(params)
  // 为每个客户添加报价数量
  const records = data.records.map((customer) => ({
    ...customer,
    quotationCount: getQuotationCountByCustomer(customer.id)
  }))
  return Promise.resolve({
    code: 200,
    msg: 'success',
    data: {
      ...data,
      records
    }
  })

  // 真实 API 请求（生产环境请取消下面的注释并删除上面的模拟数据）
  // return request.get<Api.Trade.CustomerList>({
  //   url: '/api/trade/customer/list',
  //   params
  // })
}

/**
 * 获取客户详情
 * @param id 客户 ID
 */
export function fetchGetCustomerDetail(id: string) {
  return request.get<Api.Trade.CustomerListItem>({
    url: `/api/trade/customer/${id}`
  })
}

/**
 * 创建客户
 * @param data 客户信息
 */
export function fetchCreateCustomer(data: Partial<Api.Trade.CustomerListItem>) {
  return request.post({
    url: '/api/trade/customer',
    data
  })
}

/**
 * 更新客户
 * @param data 客户信息
 */
export function fetchUpdateCustomer(data: Partial<Api.Trade.CustomerListItem>) {
  return request.put({
    url: '/api/trade/customer',
    data
  })
}

/**
 * 删除客户
 * @param id 客户 ID
 */
export function fetchDeleteCustomer(id: string) {
  return request.del({
    url: `/api/trade/customer/${id}`
  })
}

// ==================== 报价管理 ====================

/**
 * 获取报价列表
 * @param params 搜索参数
 */
export function fetchGetQuotationList(params: Api.Trade.QuotationSearchParams) {
  // 使用模拟数据（开发环境）
  const data = getQuotationListData(params)
  return Promise.resolve({
    code: 200,
    msg: 'success',
    data
  })

  // 真实 API 请求（生产环境请取消下面的注释并删除上面的模拟数据）
  // return request.get<Api.Trade.QuotationList>({
  //   url: '/api/trade/quotation/list',
  //   params
  // })
}

/**
 * 获取客户报价记录列表
 * @param customerId 客户 ID
 * @param params 分页参数
 */
export function fetchGetCustomerQuotations(
  customerId: string,
  params: Api.Common.CommonSearchParams
) {
  // 使用模拟数据（开发环境）
  const data = getQuotationListData({ ...params, customerId })
  return Promise.resolve({
    code: 200,
    msg: 'success',
    data
  })

  // 真实 API 请求
  // return request.get<Api.Trade.QuotationList>({
  //   url: `/api/trade/customer/${customerId}/quotations`,
  //   params
  // })
}

/**
 * 创建报价
 * @param data 报价信息
 */
export function fetchCreateQuotation(data: Partial<Api.Trade.QuotationListItem>) {
  return request.post({
    url: '/api/trade/quotation',
    data
  })
}

/**
 * 更新报价
 * @param data 报价信息
 */
export function fetchUpdateQuotation(data: Partial<Api.Trade.QuotationListItem>) {
  return request.put({
    url: '/api/trade/quotation',
    data
  })
}

/**
 * 删除报价
 * @param id 报价 ID
 */
export function fetchDeleteQuotation(id: string) {
  return request.del({
    url: `/api/trade/quotation/${id}`
  })
}
