import { useUserStore } from '@/store/modules/user'
import { getUserInfoByUserId, updateUserData } from '@/mock/temp/userList'

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
      msg: 'user not found',
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

/**
 * 更新用户信息
 * @param data 用户信息数据
 * @returns 更新后的用户信息
 */
export function fetchUpdateUserInfo(data: Partial<Api.Auth.UserInfo>) {
  // 开发环境更新 userList 中的数据
  if (import.meta.env.DEV) {
    const userStore = useUserStore()
    const userId = userStore.info?.userId

    if (userId) {
      const updatedData = updateUserData(userId, data)
      if (updatedData) {
        return Promise.resolve({
          code: 200,
          msg: 'success',
          data: updatedData
        })
      }
    }

    return Promise.reject(new Error('用户不存在'))
  }

  // 生产环境使用真实 API
  // return request.post<Api.Auth.UserInfo>({
  //   url: '/api/user/update',
  //   data
  // })
  return Promise.resolve({
    code: 200,
    msg: 'success',
    data: {}
  })
}
