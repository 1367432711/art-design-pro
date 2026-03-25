<!-- 产品详情页面 -->
<template>
  <div class="product-detail-page">
    <!-- 头部操作区 -->
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <ElButton type="text" @click="handleBack">
          <Icon icon="ri:arrow-left-line" class="mr-1" />
          返回
        </ElButton>
        <h2 class="text-xl font-semibold">{{ productData.name || '产品详情' }}</h2>
      </div>
      <ElSpace>
        <ElButton @click="handleEdit">
          <Icon icon="ri:pencil-line" class="mr-1" />
          编辑产品
        </ElButton>
        <ElButton type="danger" @click="handleDelete">
          <Icon icon="ri:delete-bin-line" class="mr-1" />
          删除产品
        </ElButton>
      </ElSpace>
    </div>

    <ElRow :gutter="16">
      <!-- 左侧：产品图片 -->
      <ElCol :span="8">
        <ElCard class="art-card">
          <template #header>
            <div class="card-header">
              <Icon icon="ri:image-line" class="mr-2" />
              <span>产品图片</span>
            </div>
          </template>
          <div class="product-image-section">
            <div v-if="productData.mainImage" class="main-image-wrapper">
              <ElImage
                :src="productData.mainImage"
                :preview-src-list="imageList"
                class="main-image"
                fit="cover"
              />
            </div>
            <ElEmpty v-else description="暂无图片" class="h-64" />

            <!-- 图片列表 -->
            <div
              v-if="productData.imageCount && productData.imageCount > 1"
              class="image-list mt-3"
            >
              <div class="image-list-title mb-2 text-sm text-gray-500">
                共 {{ productData.imageCount }} 张图片
              </div>
              <ElScrollbar max-height="200px">
                <div class="image-thumbnails">
                  <ElImage
                    v-for="index in Math.min(productData.imageCount, 8)"
                    :key="index"
                    :src="productData.mainImage"
                    class="image-thumbnail"
                    fit="cover"
                  />
                </div>
              </ElScrollbar>
            </div>
          </div>
        </ElCard>
      </ElCol>

      <!-- 右侧：产品信息 -->
      <ElCol :span="16">
        <ElCard class="art-card">
          <template #header>
            <div class="card-header">
              <Icon icon="ri:box-3-line" class="mr-2" />
              <span>基本信息 / Product Information</span>
            </div>
          </template>
          <ElDescriptions :column="2" border class="product-info">
            <ElDescriptionsItem label="产品名称 / Product Name" :span="2">
              <span class="product-name">{{ productData.name || '-' }}</span>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="产品类型 / Type">
              <ElTag :type="getTypeConfig(productData.type).type" size="small">
                {{ getTypeConfig(productData.type).text }}
              </ElTag>
            </ElDescriptionsItem>
            <!-- 技术参数 -->
            <ElDescriptionsItem label="规格型号 / Specification">
              {{ productData.spec || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="材质 / Material">
              {{ productData.material || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="产品等级 / Grade">
              <ElTag :type="getGradeConfig(productData.grade).type" size="small">
                {{ getGradeConfig(productData.grade).text }}
              </ElTag>
            </ElDescriptionsItem>
            <!-- 商务信息 -->
            <ElDescriptionsItem label="成本价 / Cost Price">
              <span class="text-gray-500">{{
                formatPrice(productData.costPrice, productData.currency)
              }}</span>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="销售价 / Selling Price">
              <span class="text-primary font-semibold">{{
                formatPrice(productData.salePrice, productData.currency)
              }}</span>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="最低起订量 / MOQ">
              {{ productData.moq ? `${productData.moq} ${productData.unit || '片'}` : '-' }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </ElCard>

        <!-- 包装信息 -->
        <ElCard class="art-card mt-3">
          <template #header>
            <div class="card-header">
              <Icon icon="ri:package-line" class="mr-2" />
              <span>包装信息 / Packaging Information</span>
            </div>
          </template>
          <ElDescriptions :column="2" border>
            <ElDescriptionsItem label="单片重量 / Unit Weight">
              {{ productData.singleWeight || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="吸塑数量 / Blister Qty">
              {{ productData.blisterQuantity || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="内盒数量 / Inner Box Qty">
              {{ productData.innerBoxQuantity || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="每箱数量 / Qty per Carton">
              {{ productData.cartonQuantity || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="外箱尺寸 / Carton Size">
              {{ productData.cartonSize || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="每箱毛重 / G.W. per Carton">
              {{ productData.grossWeight || '-' }} kg
            </ElDescriptionsItem>
            <ElDescriptionsItem label="每箱净重 / N.W. per Carton">
              {{ productData.netWeight || '-' }} kg
            </ElDescriptionsItem>
          </ElDescriptions>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { useRouter, useRoute } from 'vue-router'
  import { fetchGetProductDetail, fetchDeleteProduct } from '@/api/trade-manage'
  import {
    ElMessageBox,
    ElMessage,
    ElTag,
    ElImage,
    ElEmpty,
    ElRow,
    ElCol,
    ElDescriptions,
    ElDescriptionsItem,
    ElScrollbar,
    ElButton,
    ElSpace
  } from 'element-plus'

  defineOptions({ name: 'ProductDetail' })

  const router = useRouter()
  const route = useRoute()

  // 产品类型配置
  const PRODUCT_TYPE_CONFIG = {
    切割片: { type: 'primary' as const, text: '切割片' },
    百叶片: { type: 'success' as const, text: '百叶片' },
    磨光片: { type: 'warning' as const, text: '磨光片' },
    其他: { type: 'info' as const, text: '其他' }
  }

  // 产品等级配置
  const PRODUCT_GRADE_CONFIG = {
    'A 级': { type: 'success' as const, text: 'A 级' },
    'B 级': { type: 'primary' as const, text: 'B 级' },
    'C 级': { type: 'warning' as const, text: 'C 级' }
  }

  // 获取类型配置
  const getTypeConfig = (type: string | undefined) => {
    if (!type) return { type: 'info' as const, text: '未知' }
    const config = PRODUCT_TYPE_CONFIG[type as keyof typeof PRODUCT_TYPE_CONFIG]
    return config || { type: 'info' as const, text: type }
  }

  // 获取等级配置
  const getGradeConfig = (grade: string | undefined) => {
    if (!grade) return { type: 'info' as const, text: '未知' }
    const config = PRODUCT_GRADE_CONFIG[grade as keyof typeof PRODUCT_GRADE_CONFIG]
    return config || { type: 'info' as const, text: grade }
  }

  // 格式化价格
  const formatPrice = (price: number | undefined, currency: string = 'USD') => {
    if (price === undefined) return '-'
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      CNY: '¥',
      GBP: '£'
    }
    const symbol = symbols[currency] || currency
    return `${symbol}${price.toFixed(2)}`
  }

  // 产品数据
  const productData = ref<Partial<Api.Trade.ProductListItem>>({})

  // 图片列表
  const imageList = computed(() => {
    return productData.value.mainImage ? [productData.value.mainImage] : []
  })

  // 加载产品详情
  const loadProductDetail = async () => {
    const productId = route.params.id as string
    if (!productId) return

    try {
      const res = await fetchGetProductDetail(productId)
      productData.value = (res as any).data || {}
    } catch (error) {
      console.error('加载产品详情失败:', error)
      ElMessage.error('加载产品详情失败')
    }
  }

  // 返回产品列表
  const handleBack = () => {
    router.push('/trade/product')
  }

  // 编辑产品 - 跳转到编辑页面
  const handleEdit = () => {
    router.push(`/trade/product/form/${productData.value.id}`)
  }

  // 删除产品
  const handleDelete = () => {
    ElMessageBox.confirm(`确定要删除产品 "${productData.value.name}" 吗？`, '删除产品', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        await fetchDeleteProduct(productData.value.id || '')
        ElMessage.success('删除成功')
        handleBack()
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    })
  }

  onMounted(() => {
    loadProductDetail()
  })

  // 监听页面激活事件（keepAlive 场景下从其他页面返回时刷新数据）
  onActivated(() => {
    loadProductDetail()
  })
</script>

<style lang="scss" scoped>
  .product-detail-page {
    padding-bottom: 20px;

    .card-header {
      display: flex;
      align-items: center;
      font-size: 15px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    // 产品图片区域
    .product-image-section {
      .main-image-wrapper {
        overflow: hidden;
        background-color: var(--el-fill-color-light);
        border: 1px solid var(--el-border-color-light);
        border-radius: 8px;

        .main-image {
          display: block;
          width: 100%;
          height: 320px;
        }
      }

      .image-list {
        .image-list-title {
          color: var(--el-text-color-secondary);
        }

        .image-thumbnails {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;

          .image-thumbnail {
            width: 100%;
            height: 64px;
            cursor: pointer;
            border: 1px solid var(--el-border-color-light);
            border-radius: 4px;
            transition: all 0.2s;

            &:hover {
              border-color: var(--el-color-primary);
              box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
            }
          }
        }
      }
    }

    // 产品信息
    .product-info {
      .product-name {
        font-size: 16px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
    }
  }
</style>
