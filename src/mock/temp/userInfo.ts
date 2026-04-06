/**
 * 用户信息数据 - 基于 LocalStorage 存储
 *
 * 开发环境下：
 * - 每次页面加载时都会从 JSON 文件重新加载数据
 * - 数据修改后自动同步回 JSON 文件（通过 Vite 插件）
 */
import { getUserInfo, saveUserInfo, updateUserInfo } from '@/utils/storage/db'
import userData from '@/mock/data/userInfo.json'

// 初始化数据（开发环境每次从 JSON 重新加载）
function initUserInfo() {
  // 开发环境：如果 JSON 文件有数据，优先使用 JSON 文件的数据
  if (import.meta.env.DEV && userData && Object.keys(userData).length > 0) {
    console.log('[UserInfo] 从 JSON 文件初始化用户信息...')
    saveUserInfo(userData as Partial<Api.Auth.UserInfo>)
    return
  }

  // 生产环境或 JSON 无数据：检查 LocalStorage
  const existing = getUserInfo()
  if (Object.keys(existing).length === 0) {
    console.log('[UserInfo] LocalStorage 为空，初始化默认数据...')
    saveUserInfo(userData as Partial<Api.Auth.UserInfo>)
  }
}

// 页面加载时自动初始化
initUserInfo()

/**
 * 获取用户信息
 */
export function getUserInfoData(): Partial<Api.Auth.UserInfo> {
  return getUserInfo()
}

/**
 * 更新用户信息
 */
export function updateUserInfoData(
  updates: Partial<Api.Auth.UserInfo>
): Partial<Api.Auth.UserInfo> {
  return updateUserInfo(updates)
}

/**
 * 保存完整用户信息
 */
export function saveUserInfoData(info: Partial<Api.Auth.UserInfo>) {
  saveUserInfo(info)
}
