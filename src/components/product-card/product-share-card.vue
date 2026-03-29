<!-- 产品分享卡片组件 - 简洁专业风格（参考用户资料卡片设计） -->
<template>
  <div ref="shareCardRef" class="product-share-card">
    <!-- 产品图片区域（类似封面图） -->
    <div class="card-cover-section">
      <div class="cover-background"></div>
      <div class="image-container">
        <ElImage :src="product.image" fit="contain" class="product-image" />
      </div>
      <!-- 产品等级徽章（类似认证徽章） -->
      <div v-if="product.grade" class="grade-badge" :class="gradeClass">
        <Icon icon="ri:medal-line" class="badge-icon" />
        <span>{{ product.grade }}</span>
      </div>
    </div>

    <!-- 卡片内容区域 -->
    <div class="card-content">
      <!-- 产品信息 -->
      <div class="card-info-section">
        <h2 class="product-title">{{ product.name || '产品名称' }}</h2>

        <!-- 产品 SKU -->
        <div class="product-sku">
          <Icon icon="ri:barcode-box-line" class="sku-icon" />
          <span class="sku-label">型号：</span>
          <span class="sku-value">{{ product.sku || 'N/A' }}</span>
        </div>
      </div>

      <!-- 统计数据区（三列布局） -->
      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-value">{{ product.cartonQuantity ?? '-' }}</div>
          <div class="stat-label">装箱数量</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-value">
            {{ product.moq !== undefined && product.moq !== null ? product.moq : '-' }}
          </div>
          <div class="stat-label">最低起订</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-value">{{ formatPrice(product.salePrice, product.currency) }}</div>
          <div class="stat-label">参考价格</div>
        </div>
      </div>

      <!-- 产品类型标签 -->
      <div v-if="product.type" class="type-section">
        <div class="type-badge">
          <Icon icon="ri:price-tag-3-line" class="type-icon" />
          <span>{{ product.type }}</span>
        </div>
      </div>
    </div>

    <!-- 底部 CTA 区域 -->
    <div class="card-footer">
      <div class="contact-info">
        <div class="contact-row">
          <div class="contact-icon wechat">
            <Icon icon="ri:wechat-line" />
          </div>
          <span class="contact-text">{{ contact.wechat || 'artdesignpro' }}</span>
        </div>
        <div class="contact-row">
          <div class="contact-icon email">
            <Icon icon="ri:mail-line" />
          </div>
          <span class="contact-text">{{ contact.email || 'info@artdesignpro.com' }}</span>
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
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { ElImage } from 'element-plus'

  defineOptions({ name: 'ProductShareCard' })

  interface ProductInfo {
    image: string
    name: string
    sku?: string
    spec?: string
    type?: string
    grade?: string
    material?: string
    model?: string
    salePrice?: number
    costPrice?: number
    currency?: string
    moq?: number
    unit?: string
    cartonQuantity?: number
    singleWeight?: string
    grossWeight?: number
    netWeight?: number
    cartonSize?: string
  }

  interface ContactInfo {
    wechat?: string
    email?: string
    phone?: string
    whatsapp?: string
  }

  const props = withDefaults(
    defineProps<{
      product: ProductInfo
      contact?: ContactInfo
    }>(),
    {
      contact: () => ({
        wechat: 'artdesignpro',
        email: 'info@artdesignpro.com'
      })
    }
  )

  const shareCardRef = ref<HTMLElement>()

  // 产品等级样式映射
  const gradeClassMap: Record<string, string> = {
    'A 级': 'grade-a',
    'B 级': 'grade-b',
    'C 级': 'grade-c'
  }

  const gradeClass = computed(() => {
    return gradeClassMap[props.product.grade || ''] || ''
  })

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

  // 暴露卡片引用给父组件用于 html2canvas
  defineExpose({
    shareCardRef
  })
</script>

<style lang="scss" scoped>
  // ==================== 配色系统 ====================
  // 主色调
  $primary-color: #3b82f6;
  $primary-light: #dbeafe;
  $primary-dark: #1d4ed8;

  // 中性色
  $bg-dark: #0f172a;
  $bg-cover: #1e293b;
  $bg-white: #fff;
  $bg-stats: #f8fafc;

  $text-primary: #1e293b;
  $text-secondary: #64748b;
  $text-muted: #94a3b8;
  $text-light: #fff;

  // 等级色
  $grade-a: #10b981;
  $grade-b: #3b82f6;
  $grade-c: #f59e0b;

  // 卡片规格
  $card-width: 400px;
  $card-radius: 28px;
  $cover-height: 220px;

  // ==================== 主卡片 ====================
  .product-share-card {
    position: relative;
    width: $card-width;
    overflow: hidden;
    background: $bg-white;
    border-radius: $card-radius;
    box-shadow: 0 4px 24px rgb(0 0 0 / 8%);
  }

  // ==================== 封面图片区域 ====================
  .card-cover-section {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: $cover-height;
    background: linear-gradient(135deg, $bg-cover 0%, $bg-dark 100%);

    .cover-background {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse at 50% 0%,
        rgba($primary-color, 0.15) 0%,
        transparent 60%
      );
    }

    .image-container {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80%;
      height: 100%;
      padding: 20px;

      .product-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 8px 24px rgb(0 0 0 / 30%));
      }
    }

    // 等级徽章
    .grade-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      display: flex;
      gap: 6px;
      align-items: center;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(135deg, $grade-a 0%, #059669 100%);
      border-radius: 20px;
      box-shadow: 0 4px 12px rgb(16 185 129 / 40%);

      &.grade-b {
        background: linear-gradient(135deg, $grade-b 0%, #2563eb 100%);
        box-shadow: 0 4px 12px rgb(59 130 246 / 40%);
      }

      &.grade-c {
        background: linear-gradient(135deg, $grade-c 0%, #d97706 100%);
        box-shadow: 0 4px 12px rgb(245 158 11 / 40%);
      }

      .badge-icon {
        font-size: 14px;
      }
    }
  }

  // ==================== 内容区域 ====================
  .card-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px 24px;
  }

  // 产品信息区
  .card-info-section {
    text-align: center;

    .product-title {
      display: -webkit-box;
      min-height: 48px;
      margin: 0 0 12px;
      overflow: hidden;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.4;
      color: $text-primary;
      letter-spacing: 0.3px;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    // SKU 标签
    .product-sku {
      display: inline-flex;
      gap: 8px;
      align-items: center;
      padding: 8px 16px;
      background: $bg-stats;
      border-radius: 12px;

      .sku-icon {
        font-size: 16px;
        color: $primary-color;
      }

      .sku-label {
        font-size: 12px;
        font-weight: 500;
        color: $text-secondary;
      }

      .sku-value {
        font-family: 'Courier New', monospace;
        font-size: 14px;
        font-weight: 700;
        color: $text-primary;
      }
    }
  }

  // 统计数据区（三列）
  .stats-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 16px;
    background: $bg-stats;
    border-radius: 16px;

    .stat-item {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 4px;
      align-items: center;
      text-align: center;

      .stat-value {
        font-size: 20px;
        font-weight: 600;
        color: $text-primary;
      }

      .stat-label {
        font-size: 12px;
        font-weight: 400;
        color: $text-muted;
      }
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: #e2e8f0;
    }
  }

  // 产品类型标签
  .type-section {
    display: flex;
    justify-content: center;

    .type-badge {
      display: inline-flex;
      gap: 6px;
      align-items: center;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      color: $primary-color;
      background: $primary-light;
      border-radius: 12px;

      .type-icon {
        font-size: 16px;
      }
    }
  }

  // ==================== 底部 CTA 区域 ====================
  .card-footer {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    margin: 0 16px 16px;
    background: linear-gradient(180deg, $bg-dark 0%, #1e293b 100%);
    border-radius: 16px;

    .contact-info {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 10px;

      .contact-row {
        display: flex;
        gap: 8px;
        align-items: center;

        .contact-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          font-size: 18px;
          color: #fff;
          border-radius: 8px;

          &.wechat {
            color: #07c160;
            background: rgb(255 255 255 / 10%);
          }

          &.email {
            color: #fff;
            background: rgb(255 255 255 / 10%);
          }
        }

        .contact-text {
          font-size: 13px;
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
        width: 56px;
        height: 56px;
        background: #fff;
        border-radius: 12px;

        .qr-icon {
          font-size: 28px;
          color: $bg-dark;
        }
      }

      .qr-label {
        font-size: 10px;
        font-weight: 500;
        color: rgb(255 255 255 / 60%);
        letter-spacing: 0.5px;
      }
    }
  }
</style>
