import request from '@/utils/http'
import { AppRouteRecord } from '@/types/router'
import { routeModules } from '@/router/modules'
import { getUserListData } from '@/mock/temp/userList'

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
  // 开发环境使用 Mock 数据（从 LocalStorage 读取）
  if (import.meta.env.DEV) {
    const data = getUserListData(params)
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
