import request from '@/utils/http'
import { AppRouteRecord } from '@/types/router'
import { routeModules } from '@/router/modules'

/**
 * 模拟用户列表数据
 */
function getMockUserList(params: Api.SystemManage.UserSearchParams) {
  const mockUsers: Api.SystemManage.UserListItem[] = [
    {
      id: 1,
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
      status: '1',
      userName: 'admin',
      userGender: 'male',
      nickName: '超级管理员',
      userPhone: '151539331641',
      userEmail: 'admin@example.com',
      userRoles: ['R_SUPER'],
      createBy: 'system',
      createTime: '2024-01-01 00:00:00',
      updateBy: 'system',
      updateTime: '2024-01-01 00:00:00'
    },
    {
      id: 2,
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
      status: '1',
      userName: 'manager',
      userGender: 'female',
      nickName: '管理员',
      userPhone: '151539331642',
      userEmail: 'manager@example.com',
      userRoles: ['R_ADMIN'],
      createBy: 'system',
      createTime: '2024-01-01 00:00:00',
      updateBy: 'system',
      updateTime: '2024-01-01 00:00:00'
    },
    {
      id: 3,
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
      status: '1',
      userName: 'user123',
      userGender: 'male',
      nickName: '普通用户',
      userPhone: '151539331643',
      userEmail: 'user@example.com',
      userRoles: ['R_USER'],
      createBy: 'system',
      createTime: '2024-01-01 00:00:00',
      updateBy: 'system',
      updateTime: '2024-01-01 00:00:00'
    }
  ]

  // 简单分页
  const { current = 1, size = 10 } = params
  const start = (current - 1) * size
  const end = start + size
  const total = mockUsers.length

  return {
    records: mockUsers.slice(start, end),
    current,
    size,
    total
  }
}

/**
 * 模拟角色列表数据
 */
function getMockRoleList(params: Api.SystemManage.RoleSearchParams) {
  const mockRoles: Api.SystemManage.RoleListItem[] = [
    {
      roleId: 1,
      roleName: '超级管理员',
      roleCode: 'R_SUPER',
      description: '拥有系统全部权限',
      enabled: true,
      createTime: '2024-01-01 00:00:00'
    },
    {
      roleId: 2,
      roleName: '管理员',
      roleCode: 'R_ADMIN',
      description: '拥有大部分管理权限',
      enabled: true,
      createTime: '2024-01-01 00:00:00'
    },
    {
      roleId: 3,
      roleName: '普通用户',
      roleCode: 'R_USER',
      description: '普通用户权限',
      enabled: true,
      createTime: '2024-01-01 00:00:00'
    }
  ]

  // 简单分页
  const { current = 1, size = 10 } = params
  const start = (current - 1) * size
  const end = start + size
  const total = mockRoles.length

  return {
    records: mockRoles.slice(start, end),
    current,
    size,
    total
  }
}

// 获取用户列表
export function fetchGetUserList(params: Api.SystemManage.UserSearchParams) {
  // 开发环境使用 Mock 数据
  if (import.meta.env.DEV) {
    const data = getMockUserList(params)
    return Promise.resolve({
      code: 200,
      msg: 'success',
      data
    })
  }

  // 生产环境使用真实 API
  return request.get<Api.SystemManage.UserList>({
    url: '/api/user/list',
    params
  })
}

// 获取角色列表
export function fetchGetRoleList(params: Api.SystemManage.RoleSearchParams) {
  // 开发环境使用 Mock 数据
  if (import.meta.env.DEV) {
    const data = getMockRoleList(params)
    return Promise.resolve({
      code: 200,
      msg: 'success',
      data
    })
  }

  // 生产环境使用真实 API
  return request.get<Api.SystemManage.RoleList>({
    url: '/api/role/list',
    params
  })
}

// 获取菜单列表 - 前端模式下直接从路由获取
export function fetchGetMenuList() {
  // 开发环境返回 asyncRoutes 数据（用于菜单管理页面展示）
  if (import.meta.env.DEV) {
    // 返回所有模块化路由作为菜单数据
    return Promise.resolve(routeModules)
  }

  // 生产环境使用真实 API
  return request.get<AppRouteRecord[]>({
    url: '/api/v3/system/menus'
  })
}
