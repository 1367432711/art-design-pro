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
      phone: string
      password: string
    }

    /** 登录响应 */
    interface LoginResponse {
      token: string
      refreshToken: string
      userId?: number
    }

    /** 用户信息 */
    interface UserInfo {
      buttons: string[]
      roles: string[]
      userId: number
      userName: string
      email: string
      avatar?: string
      realName?: string
      nickName?: string
      phone?: string
      wechat?: string
      whatsapp?: string
      facebook?: string
      role?: string
      department?: string
      address?: string
      sex?: string
      intro?: string
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
      // 扩展字段（用于个人中心等场景）
      password?: string
      realName?: string
      sex?: string
      intro?: string
      wechat?: string
      whatsapp?: string
      facebook?: string
      role?: string
      department?: string
      address?: string
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

    /** 报价列表项（支持完整数据结构） */
    interface QuotationListItem {
      id: string
      customerId: string // 关联客户 ID
      customerName: string // 客户名称（冗余字段，方便列表展示）
      quotationNo: string // 报价单号
      productName: string // 产品名称（兼容旧版：列表模式下的单个产品名）
      specification: string // 规格型号（兼容旧版）
      quantity: number // 数量（兼容旧版）
      unit: string // 单位（兼容旧版）
      unitPrice: number // 单价（兼容旧版）
      currency: string // 币种
      totalPrice: number // 总金额（兼容旧版）
      tradeTerm: string // 贸易条款 (FOB/CIF/EXW)
      paymentTerm: string // 付款方式
      validity: string // 报价有效期
      remarks: string // 备注
      status: string // 状态：待确认/已接受/已拒绝/已过期
      quotationDate: string // 报价日期
      createTime: string
      updateBy: string
      updateTime: string
      // 扩展字段（用于完整版报价单）
      shipmentPort?: string // 装运港口
      leadTime?: string // 交货期
      shelfLife?: string // 保质期（如：2 Years）
      taxRate?: string // 税率（如：Not included）
      priceUnit?: string // 价格单位（如：RMB）
      quotationUnit?: string // 报价单位（如：Shan Dong Na Ju）
      // 客户联系信息（从客户档案带过来，允许临时覆盖）
      contactPerson?: string // 联系人
      contactPhone?: string // 联系电话
      contactEmail?: string // 联系邮箱
      clientWhatsapp?: string // 客户 WhatsApp
      country?: string // 国家/地区
      address?: string // 详细地址
      customerProducts?: string // 主营产品（客户档案）
      products?: QuotationProduct[] // 产品列表（完整版）
      costSummary?: QuotationCostSummary // 费用汇总
      // 业务流程关联字段（用于步骤条）
      piId?: string // 关联的 PI ID（已转 PI 时填写）
      piInvoiceNo?: string // PI 发票号（已转 PI 时填写）
      plId?: string // 关联的 PL ID（已发货时填写）
      plNo?: string // PL 编号（已发货时填写）
      orderStatus?: 'quotation' | 'pi' | 'pl' | 'shipped' // 订单当前阶段
    }

    /** 产品变体/型号 */
    interface ProductVariant {
      id: string // 变体 ID
      spec: string // 规格型号
      name: string // 产品名称
      type?: string // 产品类型
      grade?: string // 产品等级
      desc: string // 产品描述
      qty: number // 数量
      unit: string // 单位：PCS/SET/KG/BOX 等
      price: number // 单价
      image?: string // 产品图片 (Base64)
      total?: number // 小计 (qty * price)
    }

    /** 报价产品（支持多型号/变体） */
    interface QuotationProduct {
      id: string // 产品 ID
      selectedProductId?: string // 从产品库选择的产品 ID
      variants: ProductVariant[] // 产品变体列表
    }

    /** 公司信息（报价单头部） */
    interface QuotationCompanyInfo {
      companyName: string // 公司名称
      contactName: string // 联系人
      companyAddress: string // 公司地址
      companyEmail: string // 公司邮箱
      companyWhatsapp: string // 公司 WhatsApp
      companyLogo?: string // 公司 Logo (Base64)
    }

    /** 费用汇总 */
    interface QuotationCostSummary {
      freightCharges: number // 运费
      discountValue: number // 折扣值
      discountType: 'percent' | 'fixed' // 折扣类型：百分比/固定金额
      taxValue: number // 税费
      otherCharges: number // 其他费用
      subtotal: number // 产品小计
      grandTotal: number // 总计
    }

    /** 其他信息字段（付款条款、质保等） */
    interface QuotationInfoField {
      id: string // 字段 ID
      label: string // 字段名称
      value: string // 字段值
    }

    /** 报价单详情（完整版，用于表单和详情） */
    interface QuotationDetail extends QuotationListItem {
      // 公司信息
      companyInfo?: QuotationCompanyInfo
      // 客户信息
      clientWhatsapp?: string // 客户 WhatsApp
      clientEmail?: string // 客户邮箱
      // 产品列表（支持多产品多型号）
      products: QuotationProduct[]
      // 费用汇总
      costSummary?: QuotationCostSummary
      // 其他信息字段
      otherInfoFields?: QuotationInfoField[]
      // 货币符号
      currencySymbol?: string
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
      spec: string // 规格型号
      type: string // 产品类型：切割片/百叶片/磨光片/其他
      grade: string // 产品等级：A 级/B 级/C 级
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
      status?: string // 状态：on_sale-上架 off_sale-下架
    } & Api.Common.CommonSearchParams

    /** 跟进记录列表 */
    type FollowupList = Api.Common.PaginatedResponse<FollowupListItem>

    /** 跟进记录列表项 */
    interface FollowupListItem {
      id: string
      customerId: string // 客户 ID
      customerName: string // 客户名称
      followupType: string // 跟进类型：phone/email/wechat/whatsapp/sample/contract/other
      followupTime: string // 跟进时间
      content: string // 跟进内容
      nextPlan: string // 下一步计划
      reminderTime?: string // 提醒时间
      status?: string // 状态：pending-待跟进 completed-已完成 overdue-已逾期
      createTime: string
      updateBy: string
      updateTime: string
    }

    /** 跟进记录搜索参数 */
    type FollowupSearchParams = Partial<
      Pick<FollowupListItem, 'customerId' | 'followupType' | 'status'> & {
        startTime?: string // 开始日期
        endTime?: string // 结束日期
      } & Api.Common.CommonSearchParams
    >

    // ==================== PI/PL 模块类型定义 ====================

    /** 银行账户列表 */
    type BankAccountList = Api.Common.PaginatedResponse<BankAccount>

    /** 银行账户 */
    interface BankAccount {
      id: string
      bankName: string // 银行名称
      accountName: string // 账户名称（受益人）
      accountNumberUSD: string // 美元账号
      accountNumberRMB: string // 人民币账号
      swiftCode: string // SWIFT 代码
      bankAddress: string // 银行地址
      bankCountry: string // 银行所在国家
      isDefault: boolean // 是否默认账户
      status: 'active' | 'inactive' // 状态
      createTime: string
      updateTime: string
    }

    /** 银行账户搜索参数 */
    type BankAccountSearchParams = Partial<
      Pick<BankAccount, 'bankName' | 'accountName' | 'status'>
    > &
      Api.Common.CommonSearchParams

    /** PI 列表 */
    type PIList = Api.Common.PaginatedResponse<PIListItem>

    /** PI 列表项 */
    interface PIListItem {
      id: string
      invoiceNo: string // 发票号（PI-YYYYMMDD-NNN）
      piDate: string // 开票日期
      quotationId: string // 关联的报价单 ID
      customerId: string
      customerName: string

      // 公司信息
      companyName: string
      companyAddress: string
      companyEmail: string
      companyPhone: string

      // 客户信息
      consignee: string // 收货人
      deliveryAddress: string // 收货地址
      contactPhone: string // 联系电话
      contactEmail: string // 联系邮箱

      // 贸易信息
      tradeTerms: string // 贸易条款（FOB/CIF 等）
      tradeCountry: string // 贸易国家
      portOfLoading: string // 装运港
      portOfDestination: string // 目的港
      deliveryDate: string // 交货期

      // 物流信息（从产品自动计算）
      grossWeight: number // 总毛重 (kg)
      netWeight: number // 总净重 (kg)
      totalVolume: number // 总体积 (CBM)
      totalCartons: number // 总箱数

      // 金额信息
      currency: string // 币种
      totalAmount: number // 总金额
      depositAmount: number // 定金金额
      depositPercent: number // 定金比例 (如 30)
      balanceAmount: number // 尾款金额

      // 付款条款
      paymentTerms: string // 付款方式描述
      depositDueDate: string // 定金截止日期
      balanceDueDate: string // 尾款截止日期

      // 银行信息
      bankAccountId: string // 关联的银行账户 ID
      bankInfo?: BankInfo // 冗余存储银行信息

      // 银行账户信息（冗余字段）
      beneficiary?: string // 受益人
      accountNumberUsd?: string // 美元账号
      accountNumberRmb?: string // 人民币账号
      bankName?: string // 银行名称
      bankAddress?: string // 银行地址
      swiftCode?: string // SWIFT 代码

      // 贸易条款信息
      productRequirement?: string // 产品要求
      countryOfOrigin?: string // 原产地
      packageInfo?: string // 包装信息
      deliveryTerm?: string // 交货条款
      paymentTerm?: string // 付款条款
      validityPeriod?: string // 有效期

      // 业务流程关联字段
      plId?: string // 关联的 PL ID
      plNo?: string // PL 编号

      // 状态
      status: '待付款' | '部分付款' | '已付款' | '已取消'
      paidAmount: number // 已付金额

      // 系统字段
      createTime: string
      updateTime: string
      createBy: string
      updateBy: string

      // 产品列表
      products: PIProduct[]
    }

    /** 银行信息（冗余存储） */
    interface BankInfo {
      bankName: string
      accountName: string
      accountNumberUSD: string
      accountNumberRMB: string
      swiftCode: string
      bankAddress: string
      bankCountry: string
    }

    /** PI 产品明细 */
    interface PIProduct {
      id: string // PI 产品 ID
      productId: string // 关联的产品 ID

      // 产品信息（快照）
      productName: string
      spec: string
      type: string
      grade: string
      material: string
      unit: string

      // 报价信息（从报价单复制）
      quantity: number
      unitPrice: number
      totalPrice: number
      currency: string

      // 包装信息（从产品复制）
      cartonQuantity: number // 每箱数量
      singleWeight: string // 单片重量
      blisterQuantity: number // 吸塑数量
      innerBoxQuantity: number // 内盒数量
      cartonSize: string // 外箱尺寸
      grossWeight: number // 每箱毛重
      netWeight: number // 每箱净重

      // 计算字段
      totalCartons: number // 总箱数
      totalGW: number // 总毛重
      totalNW: number // 总净重
      totalCBM: number // 总体积

      // 图片
      mainImage: string

      // 备注
      remark?: string
    }

    /** PI 搜索参数 */
    type PISearchParams = Partial<
      Pick<PIListItem, 'invoiceNo' | 'customerName' | 'status' | 'currency'>
    > & {
      startTime?: string
      endTime?: string
    } & Api.Common.CommonSearchParams

    /** PL 列表 */
    type PLList = Api.Common.PaginatedResponse<PLListItem>

    /** PL 列表项 */
    interface PLListItem {
      id: string
      invoiceNo: string // 关联的 PI 发票号
      plNo: string // PL 编号（PL-YYYYMMDD-NNN）
      plDate: string // 开票日期
      piId: string // 关联的 PI ID
      customerId: string
      customerName: string

      // 公司信息
      companyName: string
      companyAddress: string

      // 客户信息
      consignee: string // 收货人

      // 产品包装明细
      products: PLProduct[]

      // 汇总信息
      totalQuantity: number // 总数量
      totalCartons: number // 总箱数
      totalNW: number // 总净重
      totalGW: number // 总毛重
      totalCBM: number // 总体积

      // 状态
      status: '待发货' | '部分发货' | '已发货'
      shippedQuantity: number // 已发货数量

      // 系统字段
      createTime: string
      updateTime: string
      createBy: string
      updateBy: string
    }

    /** PL 产品明细 */
    interface PLProduct {
      id: string // PL 产品 ID
      piProductId: string // 关联的 PI 产品 ID
      productId: string // 关联的产品 ID

      // 产品信息（快照）
      productName: string
      spec: string
      type: string
      unit: string

      // 数量信息（从 PI 复制）
      quantity: number
      unit: string

      // 包装明细（用户填写/确认）
      cartons: number // 箱数
      nwPerCarton: number // 每箱净重
      gwPerCarton: number // 每箱毛重
      cbmPerCarton: number // 每箱体积

      // 计算字段
      totalNW: number // 总净重
      totalGW: number // 总毛重
      totalCBM: number // 总体积

      // 备注
      remark?: string
    }

    /** PL 搜索参数 */
    type PLSearchParams = Partial<
      Pick<PLListItem, 'plNo' | 'invoiceNo' | 'customerName' | 'status'>
    > & {
      startTime?: string
      endTime?: string
    } & Api.Common.CommonSearchParams
  }
}
