import request from '@/utils/http'
import { getUserInfoData } from '@/mock/temp/userInfo'

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(params: Api.Auth.LoginParams) {
  return request.post<Api.Auth.LoginResponse>({
    url: '/api/auth/login',
    params
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

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
