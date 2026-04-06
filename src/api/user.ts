import { getUserInfoData, updateUserInfoData } from '@/mock/temp/userInfo'

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function fetchGetUserInfo() {
  // 使用模拟数据（开发环境）
  const data = getUserInfoData()
  return Promise.resolve({
    code: 200,
    msg: 'success',
    data
  })

  // 真实 API 请求（生产环境请取消下面的注释并删除上面的模拟数据）
  // return request.get<Api.Auth.UserInfo>({
  //   url: '/api/user/info'
  // })
}

/**
 * 更新用户信息
 * @param data 用户信息数据
 * @returns 更新后的用户信息
 */
export function fetchUpdateUserInfo(data: Partial<Api.Auth.UserInfo>) {
  // 使用模拟数据（开发环境）
  const updatedData = updateUserInfoData(data)
  return Promise.resolve({
    code: 200,
    msg: 'success',
    data: updatedData
  })

  // 真实 API 请求（生产环境请取消下面的注释并删除上面的模拟数据）
  // return request.post<Api.Auth.UserInfo>({
  //   url: '/api/user/update',
  //   data
  // })
}
