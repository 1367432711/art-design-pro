<!-- 高级质感产品卡片 - 现代轻奢工业风 -->
<template>
  <div :class="['premium-product-card', themeClass, { 'is-hoverable': hoverable }]">
    <!-- 产品主图区域 -->
    <div class="card-image-section">
      <!-- 角标/标签 -->
      <div class="image-badges">
        <span v-if="badge" :class="['badge', badgeType || 'hot']">
          {{ badge }}
        </span>
        <span v-if="isNew" class="badge new">NEW</span>
      </div>

      <!-- 收藏按钮 -->
      <button class="favorite-btn" @click="handleFavorite">
        <Icon :icon="isFavorite ? 'ri:heart-fill' : 'ri:heart-line'" />
      </button>

      <!-- 产品图片 -->
      <div class="image-wrapper">
        <ElImage :src="image" :alt="name" fit="contain" class="product-image" lazy />
      </div>

      <!-- 快速操作栏（hover 显示） -->
      <div class="quick-actions">
        <ElButton size="small" circle @click="handlePreview">
          <Icon icon="ri:eye-line" />
        </ElButton>
        <ElButton size="small" circle @click="handleCompare">
          <Icon icon="ri:exchange-line" />
        </ElButton>
        <ElButton size="small" circle @click="handleShare">
          <Icon icon="ri:share-line" />
        </ElButton>
      </div>
    </div>

    <!-- 卡片内容区域 -->
    <div class="card-content">
      <!-- 产品名称 -->
      <h3 class="product-name" :title="name">
        {{ name }}
      </h3>

      <!-- 核心卖点标签 -->
      <div class="selling-points">
        <span v-for="(point, index) in sellingPoints" :key="index" class="point-tag">
          {{ point }}
        </span>
      </div>

      <!-- 规格参数栏 -->
      <div class="specs-bar">
        <div class="spec-item" v-if="spec">
          <Icon icon="ri:ruler-line" class="spec-icon" />
          <span class="spec-text">{{ spec }}</span>
        </div>
        <div class="spec-item" v-if="material">
          <Icon icon="ri:stack-line" class="spec-icon" />
          <span class="spec-text">{{ material }}</span>
        </div>
        <div class="spec-item" v-if="model">
          <Icon icon="ri:barcode-box-line" class="spec-icon" />
          <span class="spec-text">{{ model }}</span>
        </div>
      </div>

      <!-- 价格区域 -->
      <div class="price-section">
        <div class="price-row">
          <span class="current-price">
            <span class="currency-symbol">{{ currencySymbol }}</span>
            <span class="price-value">{{ formatPrice(price) }}</span>
          </span>
          <span v-if="originalPrice" class="original-price">
            {{ currencySymbol }}{{ formatPrice(originalPrice) }}
          </span>
        </div>
        <div v-if="discount" class="discount-tag"> -{{ discount }}% </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <ElButton
          type="primary"
          class="btn-inquire"
          @click="handleInquire"
          :loading="inquireLoading"
        >
          <Icon icon="ri:inbox-archive-line" class="mr-1" />
          加入询价
        </ElButton>
        <ElButton class="btn-detail" @click="handleDetail"> 查看详情 </ElButton>
      </div>

      <!-- 底部信息栏 -->
      <div class="card-footer">
        <div class="footer-item" :title="shipFrom">
          <Icon icon="ri:truck-line" class="footer-icon" />
          <span class="footer-text">{{ shipFrom || '上海' }}</span>
        </div>
        <div class="footer-item" :title="warrantyText">
          <Icon icon="ri:shield-check-line" class="footer-icon" />
          <span class="footer-text">{{ warranty || '1 年质保' }}</span>
        </div>
        <div class="footer-item stock-status" :class="stockClass" :title="stockText">
          <Icon :icon="stockIcon" class="footer-icon" />
          <span class="footer-text">{{ stockText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { ElImage, ElButton } from 'element-plus'

  defineOptions({ name: 'PremiumProductCard' })

  // 产品数据接口
  interface ProductCardProps {
    // 基本信息
    image: string
    name: string
    badge?: string
    badgeType?: 'hot' | 'new' | 'sale' | 'custom'
    isNew?: boolean

    // 卖点标签
    sellingPoints?: string[]

    // 规格参数
    spec?: string
    material?: string
    model?: string

    // 价格
    price: number
    originalPrice?: number
    discount?: number
    currency?: string

    // 库存与物流
    shipFrom?: string
    warranty?: string
    stock?: number | 'in_stock' | 'low_stock' | 'out_of_stock'

    // 交互
    hoverable?: boolean
    theme?: 'light' | 'dark'
  }

  const props = withDefaults(defineProps<ProductCardProps>(), {
    badgeType: 'hot',
    isNew: false,
    sellingPoints: () => [],
    currency: 'USD',
    hoverable: true,
    theme: 'light'
  })

  const emit = defineEmits<{
    (e: 'favorite', id: string): void
    (e: 'preview', id: string): void
    (e: 'compare', id: string): void
    (e: 'share', id: string): void
    (e: 'inquire', id: string): void
    (e: 'detail', id: string): void
  }>()

  // 产品 ID（用于事件传递）
  const productId = defineModel<string>('id')

  // 收藏状态
  const isFavorite = ref(false)

  // 询价按钮加载状态
  const inquireLoading = ref(false)

  // 货币符号
  const currencySymbol = computed(() => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      CNY: '¥',
      GBP: '£',
      JPY: '¥'
    }
    return symbols[props.currency] || props.currency
  })

  // 格式化价格
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // 库存状态计算
  const stockClass = computed(() => {
    if (typeof props.stock === 'number') {
      if (props.stock === 0) return 'out-of-stock'
      if (props.stock < 10) return 'low-stock'
      return 'in-stock'
    }
    return props.stock || 'in-stock'
  })

  const stockIcon = computed(() => {
    if (stockClass.value === 'out-of-stock') return 'ri:close-circle-line'
    if (stockClass.value === 'low-stock') return 'ri:alarm-warning-line'
    return 'ri:checkbox-circle-line'
  })

  const stockText = computed(() => {
    if (typeof props.stock === 'number') {
      if (props.stock === 0) return '缺货'
      if (props.stock < 10) return `仅剩 ${props.stock} 件`
      return '现货充足'
    }
    const stockLabels: Record<string, string> = {
      in_stock: '现货',
      low_stock: '库存紧张',
      out_of_stock: '缺货'
    }
    return stockLabels[props.stock as string] || '现货'
  })

  const warrantyText = computed(() => {
    return props.warranty || '1 年质保'
  })

  // 主题 class
  const themeClass = computed(() => {
    return `theme-${props.theme}`
  })

  // 事件处理
  const handleFavorite = () => {
    isFavorite.value = !isFavorite.value
    emit('favorite', productId.value || '')
  }

  const handlePreview = () => {
    emit('preview', productId.value || '')
  }

  const handleCompare = () => {
    emit('compare', productId.value || '')
  }

  const handleShare = () => {
    emit('share', productId.value || '')
  }

  const handleInquire = async () => {
    inquireLoading.value = true
    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 500))
      emit('inquire', productId.value || '')
    } finally {
      inquireLoading.value = false
    }
  }

  const handleDetail = () => {
    emit('detail', productId.value || '')
  }
</script>

<style lang="scss" scoped>
  // ==================== 变量定义 ====================
  $card-width: 320px;
  $card-radius: 16px;
  $transition-base: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // 颜色变量 - 浅色主题
  $light-bg: #fff;
  $light-bg-secondary: #f8fafc;
  $light-text-primary: #1e293b;
  $light-text-secondary: #64748b;
  $light-text-muted: #94a3b8;
  $light-border: #e2e8f0;
  $light-shadow: rgb(0 0 0 / 8%);
  $light-shadow-hover: rgb(0 0 0 / 15%);

  // 颜色变量 - 深色主题
  $dark-bg: #1e293b;
  $dark-bg-secondary: #334155;
  $dark-text-primary: #f1f5f9;
  $dark-text-secondary: #cbd5e1;
  $dark-text-muted: #94a3b8;
  $dark-border: #475569;
  $dark-shadow: rgb(0 0 0 / 30%);
  $dark-shadow-hover: rgb(0 0 0 / 50%);

  // 强调色
  $primary: #3b82f6;
  $primary-hover: #2563eb;
  $accent: #f59e0b;
  $success: #10b981;
  $warning: #f59e0b;
  $danger: #ef4444;

  // ==================== 基础样式 ====================
  .premium-product-card {
    width: $card-width;
    overflow: hidden;
    background: $light-bg;
    border-radius: $card-radius;
    transition: $transition-base;

    // 浅色主题
    &.theme-light {
      background: linear-gradient(145deg, #fff 0%, #f8fafc 100%);
      border: 1px solid $light-border;
      box-shadow:
        0 4px 6px -1px $light-shadow,
        0 2px 4px -1px $light-shadow;
    }

    // 深色主题
    &.theme-dark {
      background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid $dark-border;
      box-shadow:
        0 4px 6px -1px $dark-shadow,
        0 2px 4px -1px $dark-shadow;
    }

    // 悬浮动效
    &.is-hoverable:hover {
      box-shadow:
        0 20px 25px -5px $light-shadow-hover,
        0 8px 10px -6px $light-shadow-hover;
      transform: translateY(-8px);

      &.theme-dark {
        box-shadow:
          0 20px 25px -5px $dark-shadow-hover,
          0 8px 10px -6px $dark-shadow-hover;
      }

      // 图片轻微放大
      .product-image {
        transform: scale(1.08);
      }

      // 快速操作栏显示
      .quick-actions {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  // ==================== 图片区域 ====================
  .card-image-section {
    position: relative;
    height: 240px;
    overflow: hidden;
    background: $light-bg-secondary;

    .theme-dark & {
      background: $dark-bg-secondary;
    }

    // 角标/标签
    .image-badges {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .badge {
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgb(0 0 0 / 15%);

        &.hot {
          color: #fff;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        &.new {
          color: #fff;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        &.sale {
          color: #fff;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        &.custom {
          color: #fff;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }
      }
    }

    // 收藏按钮
    .favorite-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      font-size: 18px;
      color: $light-text-muted;
      cursor: pointer;
      background: rgb(255 255 255 / 95%);
      backdrop-filter: blur(8px);
      border: none;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
      transition: $transition-base;

      .theme-dark & {
        color: $dark-text-muted;
        background: rgb(30 41 59 / 90%);
        box-shadow: 0 2px 8px rgb(0 0 0 / 30%);
      }

      &:hover {
        color: $danger;
        transform: scale(1.1);
      }
    }

    // 图片容器
    .image-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 20px;
    }

    // 产品图片
    .product-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    // 快速操作栏
    .quick-actions {
      position: absolute;
      bottom: 12px;
      left: 50%;
      z-index: 10;
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: $transition-base;
      transform: translateX(-50%) translateY(20px);

      :deep(.el-button) {
        width: 40px;
        height: 40px;
        font-size: 18px;
        color: $light-text-primary;
        background: rgb(255 255 255 / 95%);
        backdrop-filter: blur(8px);
        border: none;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgb(0 0 0 / 15%);

        .theme-dark & {
          color: $dark-text-primary;
          background: rgb(30 41 59 / 95%);
          box-shadow: 0 4px 12px rgb(0 0 0 / 40%);
        }

        &:hover {
          color: #fff;
          background: $primary;
          transform: translateY(-2px);
        }
      }
    }
  }

  // ==================== 内容区域 ====================
  .card-content {
    padding: 16px;
  }

  // 产品名称
  .product-name {
    display: -webkit-box;
    margin: 0 0 12px;
    overflow: hidden;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.5;
    color: $light-text-primary;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    .theme-dark & {
      color: $dark-text-primary;
    }
  }

  // 卖点标签
  .selling-points {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;

    .point-tag {
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 500;
      color: $primary;
      background: rgb(59 130 246 / 10%);
      border: 1px solid rgb(59 130 246 / 20%);
      border-radius: 4px;

      .theme-dark & {
        color: #60a5fa;
        background: rgb(59 130 246 / 15%);
        border-color: rgb(59 130 246 / 30%);
      }
    }
  }

  // 规格参数栏
  .specs-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 10px 12px;
    margin-bottom: 12px;
    background: $light-bg-secondary;
    border-radius: 8px;

    .theme-dark & {
      background: $dark-bg-secondary;
    }

    .spec-item {
      display: flex;
      gap: 6px;
      align-items: center;
      font-size: 12px;
      color: $light-text-secondary;

      .theme-dark & {
        color: $dark-text-secondary;
      }

      .spec-icon {
        font-size: 14px;
        color: $light-text-muted;

        .theme-dark & {
          color: $dark-text-muted;
        }
      }

      .spec-text {
        white-space: nowrap;
      }
    }
  }

  // 价格区域
  .price-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .price-row {
    display: flex;
    gap: 8px;
    align-items: baseline;
  }

  .current-price {
    display: flex;
    align-items: baseline;

    .currency-symbol {
      font-size: 14px;
      font-weight: 600;
      color: $danger;
    }

    .price-value {
      font-size: 24px;
      font-weight: 700;
      color: $danger;
      letter-spacing: -0.5px;
    }
  }

  .original-price {
    font-size: 13px;
    color: $light-text-muted;
    text-decoration: line-through;

    .theme-dark & {
      color: $dark-text-muted;
    }
  }

  .discount-tag {
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border-radius: 4px;
  }

  // 操作按钮
  .action-buttons {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;

    :deep(.el-button) {
      flex: 1;
      height: 40px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 8px;
      transition: $transition-base;
    }

    .btn-inquire {
      color: #fff;
      background: linear-gradient(135deg, $primary 0%, $primary-hover 100%);
      border: none;
      box-shadow: 0 4px 12px rgb(59 130 246 / 30%);

      &:hover {
        box-shadow: 0 6px 16px rgb(59 130 246 / 40%);
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .btn-detail {
      color: $light-text-primary;
      background: transparent;
      border: 1px solid $light-border;

      .theme-dark & {
        color: $dark-text-primary;
        border-color: $dark-border;
      }

      &:hover {
        color: $primary;
        background: rgb(59 130 246 / 5%);
        border-color: $primary;
      }
    }
  }

  // 底部信息栏
  .card-footer {
    display: flex;
    justify-content: space-around;
    padding-top: 12px;
    border-top: 1px solid $light-border;

    .theme-dark & {
      border-top-color: $dark-border;
    }

    .footer-item {
      display: flex;
      gap: 4px;
      align-items: center;
      font-size: 11px;
      color: $light-text-muted;

      .theme-dark & {
        color: $dark-text-muted;
      }

      .footer-icon {
        font-size: 14px;
      }

      .footer-text {
        max-width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      // 库存状态颜色
      &.in-stock,
      &.in-stock .footer-icon {
        color: $success;
      }

      &.low-stock,
      &.low-stock .footer-icon {
        color: $warning;
      }

      &.out-of-stock,
      &.out-of-stock .footer-icon {
        color: $danger;
      }
    }
  }
</style>
