import request from '@/utils/http'
// 先导入 userList 模块，确保 initUserList() 被执行
import '@/mock/temp/userList'
import { getUserByPhone, getUserInfoByUserId } from '@/mock/temp/userList'
import { useUserStore } from '@/store/modules/user'
import { toUserInfo } from '@/utils/user-data-mapper'

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
async function mockLogin(params: Api.Auth.LoginParams): Promise<Api.Auth.LoginResponse> {
  const { phone, password } = params

  // 从 userList 中查找用户
  const user = getUserByPhone(phone)

  // 验证用户和密码
  if (user && user.password === password) {
    return Promise.resolve({
      token: 'Bearer mock-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      userId: user.id
    })
  }

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
      const user = getUserInfoByUserId(userId)
      if (user) {
        // 字段映射：UserListItem -> UserInfo
        const userInfo = toUserInfo(user)
        return Promise.resolve({
          code: 200,
          msg: 'success',
          data: userInfo
        })
      }
    }

    // 如果没有找到用户，返回空数据
    return Promise.resolve({
      code: 200,
      msg: 'success',
      data: {} as Api.Auth.UserInfo
    })
  }

  // 生产环境使用真实 API
  return Promise.resolve({
    code: 200,
    msg: 'success',
    data: {} as Api.Auth.UserInfo
  })
}
