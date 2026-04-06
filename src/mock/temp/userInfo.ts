/**
 * 用户信息数据 - 基于 LocalStorage 存储
 */
import { getUserInfo, saveUserInfo, updateUserInfo, initUserInfoFromJson } from '@/utils/storage/db'
import userData from '@/mock/data/userInfo.json'

// 初始化标志，防止重复初始化
let initialized = false

// 初始化数据（如果 LocalStorage 为空）
function initUserInfo() {
  if (initialized) return
  const existing = getUserInfo()
  console.log('[UserInfo] initUserInfo - existing:', existing)
  if (Object.keys(existing).length === 0) {
    console.log('[UserInfo] 初始化用户信息...')
    initUserInfoFromJson(userData as Partial<Api.Auth.UserInfo>)
    console.log('[UserInfo] 初始化完成，当前用户信息:', getUserInfo())
  }
  initialized = true
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
