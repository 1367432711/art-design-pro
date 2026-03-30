/**
 * 产品列表数据 - 基于 LocalStorage 存储
 */
import {
  getProductList,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById
} from '@/utils/storage/db'
import productData from '@/mock/data/productList.json'

// 初始化数据（如果 LocalStorage 为空）
function initProductData() {
  const existing = getProductList()
  if (existing.length === 0) {
    productData.forEach((product) => {
      addProduct(product as Api.Trade.ProductListItem)
    })
  }
}

// 自动初始化
initProductData()

/**
 * 根据分页参数和搜索条件筛选数据
 */
export function getProductListData(params: Api.Trade.ProductSearchParams): Api.Trade.ProductList {
  const { current = 1, size = 10, keyword, type, grade, material, status } = params

  let filteredData = getProductList()

  // 根据关键词搜索（产品名称、SKU、规格型号）
  if (keyword) {
    const keywordLower = keyword.toLowerCase()
    filteredData = filteredData.filter(
      (item) =>
        item.name.toLowerCase().includes(keywordLower) ||
        item.sku.toLowerCase().includes(keywordLower) ||
        item.spec.toLowerCase().includes(keywordLower)
    )
  }

  // 根据类型过滤
  if (type) {
    filteredData = filteredData.filter((item) => item.type === type)
  }

  // 根据等级过滤
  if (grade) {
    filteredData = filteredData.filter((item) => item.grade === grade)
  }

  // 根据材质过滤
  if (material) {
    filteredData = filteredData.filter((item) =>
      item.material.toLowerCase().includes(material.toLowerCase())
    )
  }

  // 根据状态过滤
  if (status) {
    filteredData = filteredData.filter((item) => item.status === status)
  }

  const total = filteredData.length

  // 分页
  const startIndex = (current - 1) * size
  const endIndex = startIndex + size
  const records = filteredData.slice(startIndex, endIndex)

  return {
    records,
    current,
    size,
    total
  }
}

/**
 * 根据 ID 获取产品详情
 * @param id 产品 ID
 */
export function getProductDetailById(id: string): Api.Trade.ProductListItem | null {
  return getProductById(id) || null
}

/**
 * 创建新产品
 */
export function createProductData(
  product: Partial<Api.Trade.ProductListItem>
): Api.Trade.ProductListItem {
  const newProduct = {
    ...product,
    id: String(Date.now()),
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN'),
    updateBy: 'admin'
  } as Api.Trade.ProductListItem

  addProduct(newProduct)
  return newProduct
}

/**
 * 更新产品
 */
export function updateProductData(
  id: string,
  product: Partial<Api.Trade.ProductListItem>
): Api.Trade.ProductListItem | null {
  return updateProduct(id, product)
}

/**
 * 删除产品
 */
export function deleteProductData(id: string): boolean {
  return deleteProduct(id)
}
