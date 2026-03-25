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
      path: 'customer/detail/:id',
      name: 'CustomerDetail',
      component: '/trade/customer/customer-detail',
      meta: {
        title: '客户详情',
        isHide: true,
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
    },
    {
      path: 'quotation/detail/:id',
      name: 'QuotationDetail',
      component: '/trade/quotation/quotation-detail',
      meta: {
        title: '报价详情',
        isHide: true,
        keepAlive: true
      }
    },
    {
      path: 'quotation/form',
      name: 'QuotationForm',
      component: '/trade/quotation/quotation-form',
      meta: {
        title: '新增报价',
        isHide: true,
        keepAlive: true
      }
    },
    {
      path: 'quotation/form/:id',
      name: 'QuotationFormEdit',
      component: '/trade/quotation/quotation-form',
      meta: {
        title: '编辑报价',
        isHide: true,
        keepAlive: true
      }
    },
    {
      path: 'product',
      name: 'Product',
      component: '/trade/product',
      meta: {
        title: 'menus.trade.product',
        icon: 'ri:box-3-line',
        keepAlive: true
      }
    },
    {
      path: 'product/detail/:id',
      name: 'ProductDetail',
      component: '/trade/product/product-detail',
      meta: {
        title: '产品详情',
        isHide: true,
        keepAlive: true
      }
    },
    {
      path: 'product/form',
      name: 'ProductForm',
      component: '/trade/product/product-form',
      meta: {
        title: '新增产品',
        isHide: true,
        keepAlive: true
      }
    },
    {
      path: 'product/form/:id',
      name: 'ProductFormEdit',
      component: '/trade/product/product-form',
      meta: {
        title: '编辑产品',
        isHide: true,
        keepAlive: true
      }
    }
  ]
}
