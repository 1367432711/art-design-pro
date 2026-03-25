/**
 * API 接口类型定义模块
 *
 * 提供所有后端接口的类型定义
 *
 * ## 主要功能
 *
 * - 通用类型（分页参数、响应结构等）
 * - 认证类型（登录、用户信息等）
 * - 系统管理类型（用户、角色等）
 * - 全局命名空间声明
 *
 * ## 使用场景
 *
 * - API 请求参数类型约束
 * - API 响应数据类型定义
 * - 接口文档类型同步
 *
 * ## 注意事项
 *
 * - 在 .vue 文件使用需要在 eslint.config.mjs 中配置 globals: { Api: 'readonly' }
 * - 使用全局命名空间，无需导入即可使用
 *
 * ## 使用方式
 *
 * ```typescript
 * const params: Api.Auth.LoginParams = { userName: 'admin', password: '123456' }
 * const response: Api.Auth.UserInfo = await fetchUserInfo()
 * ```
 *
 * @module types/api/api
 * @author Art Design Pro Team
 */

declare namespace Api {
  /** 通用类型 */
  namespace Common {
    /** 分页参数 */
    interface PaginationParams {
      /** 当前页码 */
      current: number
      /** 每页条数 */
      size: number
      /** 总条数 */
      total: number
    }

    /** 通用搜索参数 */
    type CommonSearchParams = Pick<PaginationParams, 'current' | 'size'>

    /** 分页响应基础结构 */
    interface PaginatedResponse<T = any> {
      records: T[]
      current: number
      size: number
      total: number
    }

    /** 启用状态 */
    type EnableStatus = '1' | '2'
  }

  /** 认证类型 */
  namespace Auth {
    /** 登录参数 */
    interface LoginParams {
      userName: string
      password: string
    }

    /** 登录响应 */
    interface LoginResponse {
      token: string
      refreshToken: string
    }

    /** 用户信息 */
    interface UserInfo {
      buttons: string[]
      roles: string[]
      userId: number
      userName: string
      email: string
      avatar?: string
    }
  }

  /** 系统管理类型 */
  namespace SystemManage {
    /** 用户列表 */
    type UserList = Api.Common.PaginatedResponse<UserListItem>

    /** 用户列表项 */
    interface UserListItem {
      id: number
      avatar: string
      status: string
      userName: string
      userGender: string
      nickName: string
      userPhone: string
      userEmail: string
      userRoles: string[]
      createBy: string
      createTime: string
      updateBy: string
      updateTime: string
    }

    /** 用户搜索参数 */
    type UserSearchParams = Partial<
      Pick<UserListItem, 'id' | 'userName' | 'userGender' | 'userPhone' | 'userEmail' | 'status'> &
        Api.Common.CommonSearchParams
    >

    /** 角色列表 */
    type RoleList = Api.Common.PaginatedResponse<RoleListItem>

    /** 角色列表项 */
    interface RoleListItem {
      roleId: number
      roleName: string
      roleCode: string
      description: string
      enabled: boolean
      createTime: string
    }

    /** 角色搜索参数 */
    type RoleSearchParams = Partial<
      Pick<RoleListItem, 'roleId' | 'roleName' | 'roleCode' | 'description' | 'enabled'> &
        Api.Common.CommonSearchParams & {
          startTime: string | null
          endTime: string | null
        }
    >
  }

  /** 外贸管理类型 */
  namespace Trade {
    /** 客户列表 */
    type CustomerList = Api.Common.PaginatedResponse<CustomerListItem>

    /** 客户列表项 */
    interface CustomerListItem {
      id: string
      customerName: string // 客户名称
      contactPerson: string // 联系人
      contactPhone: string // 联系电话
      contactEmail: string // 联系邮箱
      country: string // 国家
      address: string // 详细地址
      products: string // 主要产品/需求
      source: string // 客户来源
      status: string // 状态：1-活跃 2-潜在 3-流失
      salesPerson: string // 负责业务员
      remarks: string // 备注
      quotationCount: number // 报价记录数
      createTime: string // 创建时间
      updateBy: string
      updateTime: string
    }

    /** 客户搜索参数 */
    type CustomerSearchParams = Partial<
      Pick<
        CustomerListItem,
        | 'customerName'
        | 'contactPerson'
        | 'contactPhone'
        | 'contactEmail'
        | 'country'
        | 'status'
        | 'salesPerson'
      > &
        Api.Common.CommonSearchParams
    >

    /** 报价列表 */
    type QuotationList = Api.Common.PaginatedResponse<QuotationListItem>

    /** 报价列表项 */
    interface QuotationListItem {
      id: string
      customerId: string // 关联客户 ID
      customerName: string // 客户名称（冗余字段，方便列表展示）
      quotationNo: string // 报价单号
      productName: string // 产品名称
      specification: string // 规格型号
      quantity: number // 数量
      unit: string // 单位
      unitPrice: number // 单价
      currency: string // 币种
      totalPrice: number // 总金额
      tradeTerm: string // 贸易条款 (FOB/CIF/EXW)
      paymentTerm: string // 付款方式
      validity: string // 报价有效期
      remarks: string // 备注
      status: string // 状态：待确认/已接受/已拒绝/已过期
      quotationDate: string // 报价日期
      createTime: string
      updateBy: string
      updateTime: string
    }

    /** 报价搜索参数 */
    type QuotationSearchParams = Partial<
      Pick<
        QuotationListItem,
        'customerId' | 'customerName' | 'quotationNo' | 'productName' | 'status' | 'currency'
      > & {
        startTime?: string // 开始日期
        endTime?: string // 结束日期
      } & Api.Common.CommonSearchParams
    >

    /** 产品列表 */
    type ProductList = Api.Common.PaginatedResponse<ProductListItem>

    /** 产品列表项 */
    interface ProductListItem {
      id: string
      name: string // 产品名称
      sku: string // 产品编号
      type: string // 产品类型：切割片/百叶片/磨光片/其他
      grade: string // 产品等级：A 级/B 级/C 级
      spec: string // 规格型号
      material: string // 材质
      unit: string // 单位
      costPrice: number // 成本价
      salePrice: number // 销售价
      currency: string // 币种
      moq: number // 最小起订量
      stock: number // 库存数量
      leadTime: string // 交货期
      mainImage: string // 主图
      imageCount: number // 图片数量
      status: string // 状态：on_sale-上架 off_sale-下架
      description: string // 产品描述
      notes: string // 内部备注
      // 包装信息
      singleWeight: string // 单片重量
      blisterQuantity: number // 吸塑数量
      innerBoxQuantity: number // 内盒数量
      cartonQuantity: number // 每箱数量
      cartonSize: string // 外箱尺寸
      grossWeight: number // 每箱毛重
      netWeight: number // 每箱净重
      createTime: string
      updateBy: string
      updateTime: string
    }

    /** 产品搜索参数 */
    type ProductSearchParams = {
      keyword?: string // 关键词：产品名称/SKU/规格型号
      type?: string // 产品类型
      grade?: string // 产品等级
      material?: string // 材质
    } & Api.Common.CommonSearchParams
  }
}
