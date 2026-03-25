import { AppRouteRecord } from '@/types/router'

export const tradeRoutes: AppRouteRecord = {
  path: '/trade',
  name: 'Trade',
  component: '/index/index',
  meta: {
    title: 'menus.trade.title',
    icon: 'ri:global-line',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'customer',
      name: 'Customer',
      component: '/trade/customer',
      meta: {
        title: 'menus.trade.customer',
        icon: 'ri:user-business-line',
        keepAlive: true
      }
    },
    {
      path: 'quotation',
      name: 'Quotation',
      component: '/trade/quotation',
      meta: {
        title: 'menus.trade.quotation',
        icon: 'ri:file-list-3-line',
        keepAlive: true
      }
    }
  ]
}
