/**
 * 工作标签页管理模块
 *
 * 提供工作标签页（Worktab）的自动管理功能
 *
 * ## 主要功能
 *
 * - 根据路由导航自动创建和更新工作标签页
 * - iframe 页面标签页特殊处理
 * - 标签页信息提取（标题、路径、缓存状态等）
 * - 固定标签页支持
 * - 根据系统设置控制标签页显示
 * - 首页标签页特殊处理
 *
 * ## 使用场景
 *
 * - 路由守卫中自动创建标签页
 * - 页面切换时更新标签页状态
 * - 多标签页导航系统
 *
 * @module utils/navigation/worktab
 * @author Art Design Pro Team
 */
import { useWorktabStore } from '@/store/modules/worktab'
import { RouteLocationNormalized } from 'vue-router'
import { isIframe } from './route'
import { useSettingStore } from '@/store/modules/setting'
import { IframeRouteManager } from '@/router/core'
import { useCommon } from '@/hooks/core/useCommon'

/**
 * 根据当前路由信息设置工作标签页（worktab）
 * @param to 当前路由对象
 * @param from 来源路由对象
 */
export const setWorktab = (to: RouteLocationNormalized, from?: RouteLocationNormalized): void => {
  const worktabStore = useWorktabStore()
  const { meta, path, name, params, query } = to

  if (!meta.isHideTab) {
    // 如果是 iframe 页面，则特殊处理工作标签页
    if (isIframe(path)) {
      const iframeRoute = IframeRouteManager.getInstance().findByPath(to.path)

      if (iframeRoute?.meta) {
        worktabStore.openTab({
          title: iframeRoute.meta.title,
          icon: meta.icon as string,
          path,
          name: name as string,
          keepAlive: meta.keepAlive as boolean,
          params,
          query
        })
      }
    } else if (useSettingStore().showWorkTab || path === useCommon().homePath.value) {
      // 先打开新标签，再删除旧标签，避免删除时跳转到错误的页面
      worktabStore.openTab({
        title: meta.title as string,
        icon: meta.icon as string,
        path,
        name: name as string,
        keepAlive: meta.keepAlive as boolean,
        params,
        query,
        fixedTab: meta.fixedTab as boolean
      })

      // 自动删除标签逻辑：从表单页/详情页返回列表页时，删除表单页/详情页的标签
      if (from) {
        const fromPath = from.path
        const toPath = to.path

        // 判断是否是返回列表页（从详情/表单页返回）
        if (isDetailOrFormPath(fromPath) && isListPath(toPath, fromPath)) {
          worktabStore.removeTab(fromPath)
        }
      }
    }
  }
}

/**
 * 判断是否是详情页或表单页的路由
 */
function isDetailOrFormPath(path: string): boolean {
  // 客户详情页不自动删除
  if (path.includes('/customer/detail/')) {
    return false
  }
  return path.includes('/detail/') || path.includes('/form/')
}

/**
 * 判断目标路径是否是来源路径的列表页
 */
function isListPath(toPath: string, fromPath: string): boolean {
  // 提取模块路径，如 /trade/customer
  const getModulePath = (path: string): string => {
    const parts = path.split('/').filter(Boolean)
    // 如果是 detail 或 form，返回上级路径
    if (parts.includes('detail') || parts.includes('form')) {
      const index = parts.findIndex((p) => p === 'detail' || p === 'form')
      return '/' + parts.slice(0, index).join('/')
    }
    return path
  }

  return getModulePath(toPath) === getModulePath(fromPath)
}
