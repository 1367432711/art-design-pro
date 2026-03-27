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
        <ElButton @click="handleShare">
          <Icon icon="ri:share-line" class="mr-1" />
          分享
        </ElButton>
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
              <!-- 轮播图 -->
              <ElCarousel
                ref="carouselRef"
                v-if="imageList.length > 1"
                v-model:active-index="activeIndex"
                trigger="click"
                arrow="always"
                class="image-carousel"
              >
                <ElCarouselItem v-for="(image, index) in imageList" :key="index">
                  <ElImage
                    :src="image"
                    :preview-src-list="imageList"
                    :initial-index="index"
                    preview-teleported
                    class="main-image"
                    fit="cover"
                  />
                </ElCarouselItem>
              </ElCarousel>

              <!-- 单张图片 -->
              <ElImage
                v-else
                :src="productData.mainImage"
                :preview-src-list="imageList"
                preview-teleported
                class="main-image"
                fit="cover"
              />
            </div>
            <ElEmpty v-else description="暂无图片" class="h-64" />

            <!-- 图片列表缩略图 -->
            <div v-if="imageList.length > 1" class="image-list mt-3">
              <div class="image-list-title mb-2 text-sm text-gray-500">
                共 {{ imageList.length }} 张图片
              </div>
              <ElScrollbar max-height="200px">
                <div class="image-thumbnails">
                  <ElImage
                    v-for="(image, index) in imageList"
                    :key="index"
                    :src="image"
                    class="image-thumbnail"
                    fit="cover"
                    @click="switchCarousel(index)"
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

    <!-- 分享弹窗 -->
    <ElDialog
      v-model="shareDialogVisible"
      title="分享产品"
      width="420px"
      :close-on-click-modal="false"
    >
      <div class="share-dialog-content">
        <!-- 产品卡片预览 - 使用高级产品卡片组件 -->
        <div ref="productCardRef" class="premium-card-wrapper">
          <div class="premium-card">
            <!-- 顶部装饰条 -->
            <div class="card-top-accent"></div>

            <!-- 产品图片区域 -->
            <div class="card-image-section">
              <div class="image-wrapper">
                <ElImage :src="productData.mainImage" fit="contain" class="product-image" />
              </div>
              <!-- 品牌标识 -->
              <div class="brand-badge">
                <Icon icon="ri:package-line" class="brand-icon" />
                <span>ART DESIGN PRO</span>
              </div>
            </div>

            <!-- 产品信息区域 -->
            <div class="card-info-section">
              <h2 class="product-title">{{ productData.name || '产品名称' }}</h2>

              <div class="product-sku">
                <Icon icon="ri:barcode-box-line" class="sku-icon" />
                <span class="sku-label">型号：</span>
                <span class="sku-value">{{ productData.sku || '-' }}</span>
              </div>

              <!-- 产品参数 -->
              <div class="product-specs">
                <div class="spec-item">
                  <div class="spec-icon-wrapper">
                    <Icon icon="ri:package-3-line" class="spec-icon" />
                  </div>
                  <div class="spec-content">
                    <span class="spec-label">每箱总片数</span>
                    <span class="spec-value">{{ productData.cartonQuantity || '-' }} 片</span>
                  </div>
                </div>

                <div class="spec-item">
                  <div class="spec-icon-wrapper">
                    <Icon icon="ri:stack-line" class="spec-icon" />
                  </div>
                  <div class="spec-content">
                    <span class="spec-label">最低起订量</span>
                    <span class="spec-value"
                      >{{ productData.moq || '-' }} {{ productData.unit || '片' }}</span
                    >
                  </div>
                </div>

                <div class="spec-item" v-if="productData.type">
                  <div class="spec-icon-wrapper">
                    <Icon icon="ri:price-tag-3-line" class="spec-icon" />
                  </div>
                  <div class="spec-content">
                    <span class="spec-label">产品类型</span>
                    <span class="spec-value">{{ productData.type }}</span>
                  </div>
                </div>

                <div class="spec-item" v-if="productData.grade">
                  <div class="spec-icon-wrapper">
                    <Icon icon="ri:medal-line" class="spec-icon" />
                  </div>
                  <div class="spec-content">
                    <span class="spec-label">产品等级</span>
                    <span class="spec-value">{{ productData.grade }}</span>
                  </div>
                </div>
              </div>

              <!-- 价格信息 -->
              <div class="price-section" v-if="productData.salePrice">
                <div class="price-label">参考价格</div>
                <div class="price-value">
                  {{ formatPrice(productData.salePrice, productData.currency) }}
                </div>
              </div>
            </div>

            <!-- 底部：联系方式 + 二维码 -->
            <div class="card-footer">
              <div class="footer-left">
                <div class="contact-row">
                  <Icon icon="ri:wechat-line" class="contact-icon wechat" />
                  <span class="contact-text">{{ productData.contact || 'artdesignpro' }}</span>
                </div>
                <div class="contact-row">
                  <Icon icon="ri:mail-line" class="contact-icon email" />
                  <span class="contact-text">{{
                    productData.email || 'info@artdesignpro.com'
                  }}</span>
                </div>
              </div>
              <!-- 二维码 -->
              <div class="qr-section">
                <div class="qr-code">
                  <Icon icon="ri:qr-code-line" class="qr-icon" />
                </div>
                <span class="qr-label">扫码咨询</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="share-actions">
          <ElButton type="primary" @click="downloadCard">
            <Icon icon="ri:download-line" class="mr-1" />
            下载图片
          </ElButton>
          <ElButton @click="copyCard">
            <Icon icon="ri:file-copy-line" class="mr-1" />
            复制到剪贴板
          </ElButton>
        </div>
      </div>
    </ElDialog>
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
    ElButton,
    ElSpace,
    ElCarousel,
    ElCarouselItem,
    ElScrollbar,
    ElDialog
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

  // 当前激活的图片索引
  const activeIndex = ref(0)

  // 轮播图引用
  const carouselRef = ref<InstanceType<typeof ElCarousel>>()

  // 分享弹窗
  const shareDialogVisible = ref(false)

  // 产品卡片引用
  const productCardRef = ref<HTMLElement>()

  // 图片列表（用于轮播和预览）
  const imageList = computed(() => {
    if (!productData.value.mainImage) return []

    const images = [productData.value.mainImage]

    // 如果有多个图片，添加模拟图片（实际项目中应该从 API 获取图片列表）
    const imageCount = productData.value.imageCount || 1
    for (let i = 1; i < imageCount; i++) {
      // 模拟其他图片，实际项目中应该是 productData.value.images[i]
      images.push(productData.value.mainImage)
    }

    return images
  })

  // 切换轮播图
  const switchCarousel = (index: number) => {
    activeIndex.value = index
    carouselRef.value?.setActiveItem(index)
  }

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

  // 分享产品
  const handleShare = () => {
    shareDialogVisible.value = true
  }

  // 下载产品卡片
  const downloadCard = async () => {
    if (!productCardRef.value) return

    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(productCardRef.value, {
        useCORS: true,
        backgroundColor: '#fff',
        scale: 2
      })

      canvas.toBlob((blob) => {
        if (!blob) return
        const link = document.createElement('a')
        link.download = `产品卡片-${productData.value.name}.png`
        link.href = URL.createObjectURL(blob)
        link.click()
        URL.revokeObjectURL(link.href)
        ElMessage.success('下载成功')
      })
    } catch (error) {
      console.error('生成图片失败:', error)
      ElMessage.error('生成图片失败，请重试')
    }
  }

  // 复制到剪贴板
  const copyCard = async () => {
    if (!productCardRef.value) return

    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(productCardRef.value, {
        useCORS: true,
        backgroundColor: '#fff',
        scale: 2
      })

      canvas.toBlob(async (blob) => {
        if (!blob) return
        try {
          const item = new ClipboardItem({ 'image/png': blob })
          await navigator.clipboard.write([item])
          ElMessage.success('已复制到剪贴板')
        } catch {
          // 降级方案：下载图片
          ElMessage.warning('浏览器不支持直接复制，已改为下载图片')
          const link = document.createElement('a')
          link.download = `产品卡片-${productData.value.name}.png`
          link.href = URL.createObjectURL(blob)
          link.click()
          URL.revokeObjectURL(link.href)
        }
      })
    } catch (error) {
      console.error('复制失败:', error)
      ElMessage.error('复制失败，请重试')
    }
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
        position: relative;
        background-color: var(--el-fill-color-light);
        border: 1px solid var(--el-border-color-light);
        border-radius: 8px;

        .image-carousel {
          :deep(.el-carousel__container) {
            height: 320px;
          }

          :deep(.el-carousel__item) {
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: visible !important;
            background-color: var(--el-fill-color-light);
          }

          .main-image {
            display: block;
            width: 100%;
            height: 320px;
            cursor: pointer;
          }
        }

        .main-image {
          display: block;
          width: 100%;
          height: 320px;
          cursor: pointer;
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

    // 分享弹窗
    .share-dialog-content {
      .premium-card-wrapper {
        margin: -8px;
      }

      .premium-card {
        width: 100%;
        overflow: hidden;
        background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 16px;
        box-shadow: 0 20px 60px rgb(0 0 0 / 40%);

        // 顶部装饰条
        .card-top-accent {
          height: 4px;
          background: linear-gradient(90deg, #e94560 0%, #ff6b6b 50%, #e94560 100%);
        }

        // 图片区域
        .card-image-section {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 220px;
          background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);

          .image-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            padding: 20px;

            .product-image {
              max-width: 90%;
              max-height: 90%;
              object-fit: contain;
              filter: drop-shadow(0 8px 16px rgb(0 0 0 / 15%));
            }
          }

          // 品牌标识
          .brand-badge {
            position: absolute;
            top: 12px;
            left: 16px;
            display: flex;
            gap: 6px;
            align-items: center;
            padding: 6px 12px;
            font-size: 10px;
            font-weight: 700;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: linear-gradient(135deg, #e94560 0%, #dc2626 100%);
            border-radius: 20px;
            box-shadow: 0 4px 12px rgb(233 69 96 / 40%);

            .brand-icon {
              font-size: 14px;
            }
          }
        }

        // 信息区域
        .card-info-section {
          padding: 20px;

          .product-title {
            display: -webkit-box;
            min-height: 52px;
            margin: 0 0 14px;
            overflow: hidden;
            font-size: 18px;
            font-weight: 700;
            line-height: 1.4;
            color: #fff;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .product-sku {
            display: inline-flex;
            gap: 6px;
            align-items: center;
            padding: 6px 12px;
            margin-bottom: 16px;
            font-size: 12px;
            background: rgb(255 255 255 / 8%);
            border: 1px solid rgb(255 255 255 / 10%);
            border-radius: 16px;

            .sku-icon {
              font-size: 14px;
              color: #e94560;
            }

            .sku-label {
              color: rgb(255 255 255 / 60%);
            }

            .sku-value {
              font-family: 'Courier New', monospace;
              font-weight: 600;
              color: #fff;
            }
          }

          // 产品参数
          .product-specs {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 16px;

            .spec-item {
              display: flex;
              gap: 12px;
              align-items: center;
              padding: 10px 12px;
              background: rgb(255 255 255 / 5%);
              border-radius: 10px;
              transition: all 0.3s ease;

              &:hover {
                background: rgb(255 255 255 / 8%);
              }

              .spec-icon-wrapper {
                display: flex;
                flex-shrink: 0;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
                border-radius: 8px;
                box-shadow: 0 4px 12px rgb(233 69 96 / 30%);

                .spec-icon {
                  font-size: 18px;
                  color: #fff;
                }
              }

              .spec-content {
                display: flex;
                flex: 1;
                align-items: center;
                justify-content: space-between;

                .spec-label {
                  font-size: 12px;
                  color: rgb(255 255 255 / 60%);
                }

                .spec-value {
                  font-size: 14px;
                  font-weight: 600;
                  color: #fff;
                }
              }
            }
          }

          // 价格信息
          .price-section {
            padding: 14px;
            text-align: center;
            background: linear-gradient(135deg, rgb(233 69 96 / 15%) 0%, rgb(233 69 96 / 5%) 100%);
            border: 1px solid rgb(233 69 96 / 20%);
            border-radius: 10px;

            .price-label {
              margin-bottom: 4px;
              font-size: 12px;
              color: rgb(255 255 255 / 70%);
            }

            .price-value {
              font-size: 22px;
              font-weight: 700;
              color: #ffd700;
              text-shadow: 0 2px 8px rgb(255 215 0 / 30%);
            }
          }
        }

        // 底部联系方式
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: rgb(0 0 0 / 30%);
          border-top: 1px solid rgb(255 255 255 / 8%);

          .footer-left {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .contact-row {
              display: flex;
              gap: 8px;
              align-items: center;

              .contact-icon {
                flex-shrink: 0;
                font-size: 16px;

                &.wechat {
                  color: #07c160;
                }

                &.email {
                  color: #e94560;
                }
              }

              .contact-text {
                max-width: 140px;
                font-size: 11px;
                color: rgb(255 255 255 / 85%);
              }
            }
          }

          // 二维码区域
          .qr-section {
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-items: center;

            .qr-code {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 60px;
              height: 60px;
              background: rgb(255 255 255 / 95%);
              border-radius: 8px;
              box-shadow: 0 4px 16px rgb(0 0 0 / 20%);

              .qr-icon {
                font-size: 32px;
                color: #0f172a;
              }
            }

            .qr-label {
              font-size: 10px;
              color: rgb(255 255 255 / 70%);
              letter-spacing: 0.5px;
            }
          }
        }
      }

      .share-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-top: 16px;
      }
    }
  }
</style>
