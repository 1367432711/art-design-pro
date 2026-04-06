import request from '@/utils/http'

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function fetchGetUserInfo() {
  return request.get<Api.Auth.UserInfo>({
    url: '/api/user/info'
  })
}

/**
 * 更新用户信息
 * @param data 用户信息数据
 * @returns 更新后的用户信息
 */
export function fetchUpdateUserInfo(data: Partial<Api.Auth.UserInfo>) {
  return request.post<Api.Auth.UserInfo>({
    url: '/api/user/update',
    data
  })
}
