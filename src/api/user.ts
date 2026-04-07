import { useUserStore } from '@/store/modules/user'
import { getUserInfoByUserId, updateUserData } from '@/mock/temp/userList'
import { toUserInfo, toUserListItemUpdates } from '@/utils/user-data-mapper'

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
      msg: 'user not found',
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

/**
 * 更新用户信息
 * @param data 用户信息数据（UserInfo 格式）
 * @returns 更新后的用户信息
 */
export function fetchUpdateUserInfo(data: Partial<Api.Auth.UserInfo>) {
  // 开发环境更新 userList 中的数据
  if (import.meta.env.DEV) {
    const userStore = useUserStore()
    const userId = userStore.info?.userId

    if (userId) {
      // 将 UserInfo 格式转换为 UserListItem 格式
      const updates = toUserListItemUpdates(data)
      const updatedUser = updateUserData(userId, updates)
      if (updatedUser) {
        // 返回时转换回 UserInfo 格式
        const userInfo = toUserInfo(updatedUser)
        return Promise.resolve({
          code: 200,
          msg: 'success',
          data: userInfo
        })
      }
    }

    return Promise.reject(new Error('用户不存在'))
  }

  // 生产环境使用真实 API
  return Promise.resolve({
    code: 200,
    msg: 'success',
    data: {} as Api.Auth.UserInfo
  })
}
