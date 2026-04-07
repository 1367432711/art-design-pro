import request from '@/utils/http'
import { getUserByPhone, getUserInfoByUserId } from '@/mock/temp/userList'
import { useUserStore } from '@/store/modules/user'

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(params: Api.Auth.LoginParams) {
  // 开发环境使用 Mock 数据
  if (import.meta.env.DEV) {
    return mockLogin(params)
  }

  // 生产环境使用真实 API
  return request.post<Api.Auth.LoginResponse>({
    url: '/api/auth/login',
    params
  })
}

/**
 * Mock 登录实现 - 支持手机号登录
 */
function mockLogin(params: Api.Auth.LoginParams): Promise<Api.Auth.LoginResponse> {
  const { phone, password } = params

  // 从 userList 中查找用户
  const user = getUserByPhone(phone)

  console.log('[Mock Login] 请求登录:', { phone, password })
  console.log('[Mock Login] 查找到的用户:', user)

  // 验证手机号和密码（开发环境宽松验证，只要密码是 123456 就通过）
  if (password === '123456' && user) {
    const result = {
      token: 'Bearer mock-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    }
    console.log('[Mock Login] 登录成功，返回:', result)
    return Promise.resolve(result)
  }

  // 登录失败
  console.error('[Mock Login] 登录失败：手机号或密码错误')
  return Promise.reject(new Error('手机号或密码错误'))
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function fetchGetUserInfo() {
  // 开发环境从 userList 读取当前登录用户
  if (import.meta.env.DEV) {
    const userStore = useUserStore()
    const userId = userStore.info?.userId

    if (userId) {
      const data = getUserInfoByUserId(userId)
      if (data) {
        return Promise.resolve({
          code: 200,
          msg: 'success',
          data
        })
      }
    }

    // 如果没有找到用户，返回空数据
    return Promise.resolve({
      code: 200,
      msg: 'success',
      data: {}
    })
  }

  // 生产环境使用真实 API
  // return request.get<Api.Auth.UserInfo>({
  //   url: '/api/user/info'
  // })
  return Promise.resolve({
    code: 200,
    msg: 'success',
    data: {}
  })
}
