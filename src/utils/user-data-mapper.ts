/**
 * 用户数据字段映射工具
 *
 * 用于在 Api.Auth.UserInfo 和 Api.SystemManage.UserListItem 之间进行转换
 *
 * 设计说明：
 * - UserInfo: 用于认证和个人中心场景，字段命名简洁（如 phone, email）
 * - UserListItem: 用于用户管理场景，字段带前缀（如 userPhone, userEmail）
 */

/**
 * 将 UserListItem 转换为 UserInfo
 * @param userListItem 用户列表项数据
 * @returns 用户信息数据
 */
export function toUserInfo(userListItem: Api.SystemManage.UserListItem): Api.Auth.UserInfo {
  return {
    userId: userListItem.id,
    userName: userListItem.userName,
    email: userListItem.userEmail,
    phone: userListItem.userPhone,
    sex: userListItem.sex,
    realName: userListItem.realName,
    nickName: userListItem.nickName,
    avatar: userListItem.avatar,
    wechat: userListItem.wechat,
    whatsapp: userListItem.whatsapp,
    facebook: userListItem.facebook,
    role: userListItem.role,
    department: userListItem.department,
    address: userListItem.address,
    intro: userListItem.intro,
    roles: userListItem.userRoles || [],
    buttons: []
  }
}

/**
 * 将 UserInfo 转换为 UserListItem 的部分字段
 * @param userInfo 用户信息数据
 * @returns 用户列表项的部分字段（用于更新）
 */
export function toUserListItemUpdates(
  userInfo: Partial<Api.Auth.UserInfo>
): Partial<Api.SystemManage.UserListItem> {
  const updates: Partial<Api.SystemManage.UserListItem> = {}

  if (userInfo.userId) updates.id = userInfo.userId
  if (userInfo.realName) updates.realName = userInfo.realName
  if (userInfo.nickName) updates.nickName = userInfo.nickName
  if (userInfo.email) updates.userEmail = userInfo.email
  if (userInfo.phone) updates.userPhone = userInfo.phone
  if (userInfo.sex) updates.sex = userInfo.sex
  if (userInfo.intro) updates.intro = userInfo.intro
  if (userInfo.address) updates.address = userInfo.address
  if (userInfo.avatar) updates.avatar = userInfo.avatar
  if (userInfo.wechat) updates.wechat = userInfo.wechat
  if (userInfo.whatsapp) updates.whatsapp = userInfo.whatsapp
  if (userInfo.facebook) updates.facebook = userInfo.facebook
  if (userInfo.role) updates.role = userInfo.role
  if (userInfo.department) updates.department = userInfo.department

  return updates
}

/**
 * 将 UserInfo 完整转换为 UserListItem
 * @param userInfo 用户信息数据
 * @param existingUser 现有的 UserListItem（用于保留额外字段）
 * @returns 完整的 UserListItem
 */
export function toUserListItem(
  userInfo: Api.Auth.UserInfo,
  existingUser?: Api.SystemManage.UserListItem
): Api.SystemManage.UserListItem {
  const base: Api.SystemManage.UserListItem = existingUser || {
    id: userInfo.userId,
    avatar: userInfo.avatar || '',
    status: '1',
    userName: userInfo.userName,
    userGender: userInfo.sex || 'male',
    nickName: userInfo.nickName || '',
    userPhone: userInfo.phone || '',
    userEmail: userInfo.email || '',
    userRoles: userInfo.roles || [],
    createBy: 'system',
    createTime: new Date().toLocaleString('zh-CN'),
    updateBy: 'system',
    updateTime: new Date().toLocaleString('zh-CN')
  }

  return {
    ...base,
    realName: userInfo.realName,
    sex: userInfo.sex,
    intro: userInfo.intro,
    address: userInfo.address,
    wechat: userInfo.wechat,
    whatsapp: userInfo.whatsapp,
    facebook: userInfo.facebook,
    role: userInfo.role,
    department: userInfo.department
  }
}
