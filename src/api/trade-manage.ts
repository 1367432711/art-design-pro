import request from '@/utils/http'

// ==================== 客户管理 ====================

/**
 * 获取客户列表
 * @param params 搜索参数
 */
export function fetchGetCustomerList(params: Api.Trade.CustomerSearchParams) {
  return request.get<Api.Trade.CustomerList>({
    url: '/api/trade/customer/list',
    params
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
  return request.delete({
    url: `/api/trade/customer/${id}`
  })
}
