/**
 * 用户信息数据 - 基于 LocalStorage 存储
 *
 * 开发环境下：
 * - 仅在 LocalStorage 为空时从 JSON 文件初始化
 * - 数据修改后自动同步回 JSON 文件（通过 Vite 插件）
 */
import { getUserInfo, saveUserInfo, updateUserInfo } from '@/utils/storage/db'
import userData from '@/mock/data/userInfo.json'

// 初始化数据（仅在 LocalStorage 为空时从 JSON 加载）
function initUserInfo() {
  // 检查 LocalStorage 是否已有数据
  const existing = getUserInfo()

  if (Object.keys(existing).length === 0) {
    // LocalStorage 为空，从 JSON 初始化
    if (userData && Object.keys(userData).length > 0) {
      console.log('[UserInfo] LocalStorage 为空，从 JSON 文件初始化用户信息...')
      saveUserInfo(userData as Partial<Api.Auth.UserInfo>)
    } else {
      console.log('[UserInfo] JSON 文件为空，使用默认数据...')
      // JSON 也为空，使用默认数据
      saveUserInfo({
        userId: 1,
        userName: 'admin',
        realName: '卢致文',
        nickName: 'Arvin',
        email: '1367432711@qq.com',
        phone: '151539331641',
        wechat: 'Lovq_201203',
        whatsapp: '+86 151 5393 3164',
        facebook: 'Arvin XiaLoncut',
        avatar: '/src/assets/images/user/avatar.webp',
        role: '销售经理',
        department: '外贸部',
        address: '山东省临沂市',
        sex: '2',
        intro: '专注于外贸业务跟视觉设计',
        roles: ['R_SUPER', 'R_ADMIN'],
        buttons: ['*:*:*']
      } as Partial<Api.Auth.UserInfo>)
    }
  } else {
    console.log('[UserInfo] LocalStorage 已有用户信息，跳过初始化')
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
