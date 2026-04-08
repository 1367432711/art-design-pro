import { nextTick } from 'vue'
import { useSettingStore } from '@/store/modules/setting'
import { Router, RouteLocationNormalized } from 'vue-router'
import NProgress from 'nprogress'
import { useCommon } from '@/hooks/core/useCommon'
import { loadingService } from '@/utils/ui'
import { getPendingLoading, resetPendingLoading } from './beforeEach'
import { setWorktab } from '@/utils/navigation/worktab'

/** 路由全局后置守卫 */
export function setupAfterEachGuard(router: Router) {
  const { scrollToTop } = useCommon()

  router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    scrollToTop()

    // 设置工作标签页（传入 from 用于自动删除标签）
    setWorktab(to, from)

    // 关闭进度条
    const settingStore = useSettingStore()
    if (settingStore.showNprogress) {
      NProgress.done()
      // 确保进度条完全移除，避免残影
      setTimeout(() => {
        NProgress.remove()
      }, 600)
    }

    // 关闭 loading 效果
    if (getPendingLoading()) {
      nextTick(() => {
        loadingService.hideLoading()
        resetPendingLoading()
      })
    }
  })
}
