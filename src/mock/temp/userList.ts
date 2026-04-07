/**
 * 用户列表数据 - 基于 LocalStorage 存储
 *
 * 开发环境下：
 * - 仅在 LocalStorage 为空时从 JSON 文件初始化
 * - 数据修改后自动同步回 JSON 文件（通过 Vite 插件）
 */
import { getUserList, saveUserList, updateUser, addUser, deleteUser } from '@/utils/storage/db'
import userListData from '@/mock/data/userList.json'

// 初始化数据（仅在 LocalStorage 为空时从 JSON 加载）
function initUserList() {
  const existing = getUserList()

  if (existing.length === 0) {
    console.log('[UserList] LocalStorage 为空，从 JSON 文件初始化用户列表...')
    if (userListData && userListData.length > 0) {
      saveUserList(userListData as Api.SystemManage.UserListItem[])
    }
  } else {
    console.log('[UserList] LocalStorage 已有用户列表，跳过初始化')
  }
}

// 页面加载时自动初始化
initUserList()

/**
 * 获取用户列表（支持分页和搜索）
 */
export function getUserListData(
  params: Api.SystemManage.UserSearchParams
): Api.SystemManage.UserList {
  const allUsers = getUserList()

  // 搜索过滤
  const filteredUsers = allUsers.filter((user) => {
    if (params.userName && !user.userName.includes(params.userName)) return false
    if (params.userGender && user.userGender !== params.userGender) return false
    if (params.userPhone && !user.userPhone.includes(params.userPhone)) return false
    if (params.userEmail && !user.userEmail.includes(params.userEmail)) return false
    if (params.status && user.status !== params.status) return false
    return true
  })

  // 分页
  const { current = 1, size = 10 } = params
  const total = filteredUsers.length
  const start = (current - 1) * size
  const end = start + size
  const records = filteredUsers.slice(start, end)

  return {
    records,
    current,
    size,
    total
  }
}

/**
 * 根据 ID 获取用户详情
 */
export function getUserDetailById(id: number): Api.SystemManage.UserListItem | undefined {
  const users = getUserList()
  return users.find((u) => u.id === id)
}

/**
 * 根据手机号获取用户（用于登录）
 */
export function getUserByPhone(phone: string): Api.SystemManage.UserListItem | undefined {
  const users = getUserList()
  return users.find((u) => u.userPhone === phone)
}

/**
 * 根据用户 ID 获取用户信息（用于个人中心）
 */
export function getUserInfoByUserId(userId: number): Api.SystemManage.UserListItem | undefined {
  const users = getUserList()
  return users.find((u) => u.id === userId)
}

/**
 * 创建用户
 */
export function createUserData(
  data: Partial<Api.SystemManage.UserListItem>
): Api.SystemManage.UserListItem {
  const users = getUserList()
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1

  const newUser: Api.SystemManage.UserListItem = {
    id: newId,
    avatar: data.avatar || '/src/assets/images/user/avatar.webp',
    status: data.status || '1',
    userName: data.userName || '',
    userGender: data.userGender || 'male',
    nickName: data.nickName || '',
    userPhone: data.userPhone || '',
    userEmail: data.userEmail || '',
    userRoles: data.userRoles || [],
    createBy: 'system',
    createTime: new Date().toLocaleString('zh-CN'),
    updateBy: 'system',
    updateTime: new Date().toLocaleString('zh-CN')
  }

  addUser(newUser)
  return newUser
}

/**
 * 更新用户数据
 */
export function updateUserData(
  id: number,
  updates: Partial<Api.SystemManage.UserListItem>
): Api.SystemManage.UserListItem | null {
  return updateUser(id, updates)
}

/**
 * 删除用户数据
 */
export function deleteUserData(id: number): boolean {
  return deleteUser(id)
}
