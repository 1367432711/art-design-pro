<!-- 产品分享卡片组件 - 参考现代卡片设计 -->
<template>
  <div ref="shareCardRef" class="product-share-card">
    <!-- 封面图区域 - 大图占据主导 -->
    <div class="card-cover-section">
      <!-- 产品图作为封面背景 -->
      <ElImage :src="product.image" fit="cover" class="cover-image" crossorigin="anonymous" />

      <!-- 渐变遮罩 - 从透明到白色 -->
      <div class="cover-overlay"></div>

      <!-- 产品等级徽章（左上角） -->
      <div v-if="product.grade" class="grade-badge" :class="gradeClass">
        <Icon icon="ri:medal-line" class="badge-icon" />
        <span>{{ product.grade }}</span>
      </div>

      <!-- 内容区（覆盖在图片底部） -->
      <div class="cover-content">
        <!-- 产品名称作为主标题 -->
        <h2 class="product-title">{{ product.name || '产品名称' }}</h2>
        <!-- 规格型号作为副标题 -->
        <p class="product-subtitle">{{ product.spec || '规格型号' }}</p>
      </div>
    </div>

    <!-- 卡片内容区域 -->
    <div class="card-content">
      <!-- 用户信息区 -->
      <div class="user-info-section">
        <div class="user-header">
          <!-- 头像 + 用户名 -->
          <div class="user-left">
            <ElImage :src="user.avatar" fit="cover" class="user-avatar" crossorigin="anonymous" />
            <div class="user-details">
              <h3 class="user-name">{{ user.userName || '用户名' }}</h3>
              <p v-if="user.role" class="user-role">{{ user.role }}</p>
            </div>
          </div>
          <!-- 邮箱 -->
          <p class="user-email">{{ user.email || '' }}</p>
        </div>
      </div>

      <!-- 产品数据标签组 -->
      <div class="tags-section">
        <div class="tag-item">
          <Icon icon="ri:box-3-line" class="tag-icon" />
          <span>装箱：{{ product.cartonQuantity ?? '-' }}</span>
        </div>
        <div v-if="product.material" class="tag-item">
          <Icon icon="ri:leaf-line" class="tag-icon" />
          <span>{{ product.material }}</span>
        </div>
        <div v-if="product.salePrice" class="tag-item price-tag">
          <Icon icon="ri:price-tag-line" class="tag-icon" />
          <span>{{ formatPrice(product.salePrice, product.currency) }}</span>
        </div>
      </div>

      <!-- 联系信息 + 二维码 -->
      <div class="contact-section">
        <div class="contact-info">
          <div class="contact-item">
            <Icon icon="ri:wechat-line" class="contact-icon wechat" />
            <span>{{ user.wechat || '微信号' }}</span>
          </div>
          <div v-if="user.phone" class="contact-item">
            <Icon icon="ri:phone-line" class="contact-icon phone" />
            <span>{{ user.phone }}</span>
          </div>
          <div class="contact-item">
            <Icon icon="ri:whatsapp-line" class="contact-icon whatsapp" />
            <span>WhatsApp: {{ user.whatsapp || '+86 151 5393 3164' }}</span>
          </div>
          <div v-if="user.facebook" class="contact-item">
            <Icon icon="ri:facebook-line" class="contact-icon facebook" />
            <span>{{ user.facebook }}</span>
          </div>
        </div>
        <div class="qr-code-wrapper">
          <ElImage :src="user.qrCode" fit="cover" class="qr-code-image" crossorigin="anonymous" />
          <p class="qr-code-label">扫码联系</p>
        </div>
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
    cartonQuantity?: number
    material?: string
    unit?: string
    salePrice?: number
    currency?: string
  }

  interface UserInfo {
    avatar: string
    userName: string
    email?: string
    role?: string
    wechat?: string
    phone?: string
    whatsapp?: string
    facebook?: string
    qrCode?: string
  }

  const props = defineProps<{
    product: ProductInfo
    user: UserInfo
  }>()

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
    if (!price) return '-'
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
  // ==================== 现代简约卡片设计 ====================
  // 配色系统
  $white: #fff;
  $gray-50: #f9fafb;
  $gray-100: #f3f4f6;
  $gray-200: #e5e7eb;
  $gray-300: #d1d5db;
  $gray-400: #9ca3af;
  $gray-500: #6b7280;
  $gray-600: #4b5563;
  $gray-700: #374151;
  $gray-900: #111827;

  $primary: #3b82f6;
  $primary-hover: #2563eb;
  $success: #10b981;
  $warning: #f59e0b;
  $danger: #ef4444;

  // 卡片规格
  $card-width: 400px;
  $card-radius: 16px;
  $cover-height: 220px;
  $avatar-size: 48px;

  // ==================== 主卡片 ====================
  .product-share-card {
    position: relative;
    overflow: hidden;
    background: $white;
    border-radius: $card-radius;
    box-shadow:
      0 1px 3px rgb(0 0 0 / 10%),
      0 8px 24px rgb(0 0 0 / 12%),
      0 16px 48px rgb(0 0 0 / 8%);
  }

  // ==================== 封面图区域 ====================
  .card-cover-section {
    position: relative;
    height: $cover-height;
    background: $gray-100;

    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    // 渐变遮罩 - 从底部向上
    .cover-overlay {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: linear-gradient(
        to bottom,
        transparent 0%,
        transparent 40%,
        rgb(255 255 255 / 60%) 70%,
        $white 100%
      );
    }

    // 产品等级徽章（左上角）
    .grade-badge {
      position: absolute;
      top: 14px;
      left: 14px;
      z-index: 10;
      display: flex;
      gap: 6px;
      align-items: center;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      color: #fff;
      background: rgba(0 0 0 / 60%);
      backdrop-filter: blur(8px);
      border-radius: 20px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 20%);

      &.grade-a {
        background: linear-gradient(135deg, $success 0%, #059669 100%);
      }

      &.grade-b {
        background: linear-gradient(135deg, $primary 0%, #2563eb 100%);
      }

      &.grade-c {
        background: linear-gradient(135deg, $warning 0%, #d97706 100%);
      }

      .badge-icon {
        font-size: 14px;
      }
    }

    // 内容区（覆盖在图片底部）
    .cover-content {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
      padding: 18px 20px 16px;

      .product-title {
        margin: 0 0 6px;
        // 长文本省略
        overflow: hidden;
        font-size: 19px;
        font-weight: 600;
        line-height: 1.35;
        color: $gray-900;
        text-overflow: ellipsis;
        letter-spacing: -0.2px;
        white-space: nowrap;
      }

      .product-subtitle {
        margin: 0;
        // 长文本省略
        overflow: hidden;
        font-size: 13px;
        line-height: 1.5;
        color: $gray-500;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  // ==================== 卡片内容区域 ====================
  .card-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 20px 20px;
  }

  // 用户信息区
  .user-info-section {
    padding-top: 14px;
    padding-bottom: 14px;
    border-bottom: 1px solid $gray-300;

    .user-header {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      justify-content: space-between;

      .user-left {
        display: flex;
        flex: 1;
        gap: 12px;
        align-items: flex-start;
        min-width: 0;
      }

      .user-avatar {
        flex-shrink: 0;
        width: $avatar-size;
        height: $avatar-size;
        object-fit: cover;
        border: 2px solid $white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgb(0 0 0 / 10%);
      }

      .user-details {
        flex: 1;
        min-width: 0;

        .user-name {
          margin: 0 0 3px;
          overflow: hidden;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.3;
          color: $gray-900;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-role {
          margin: 0;
          font-size: 12px;
          color: $gray-500;
        }
      }

      .user-email {
        flex-shrink: 0;
        margin: 0;
        overflow: hidden;
        font-size: 12px;
        color: $gray-400;
        text-align: right;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  // 产品数据标签组
  .tags-section {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .tag-item {
      display: flex;
      gap: 5px;
      align-items: center;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 400;
      color: $gray-600;
      cursor: default;
      background: $gray-50;
      border: 1px solid $gray-200;
      border-radius: 16px;
      transition: all 0.2s;

      .tag-icon {
        font-size: 15px;
        color: $gray-400;
      }

      &:hover {
        background: $gray-100;
        border-color: $gray-300;
      }

      &.price-tag {
        color: $primary;
        background: rgb(59 130 246 / 6%);
        border-color: rgb(59 130 246 / 15%);

        .tag-icon {
          color: $primary;
        }
      }
    }
  }

  // 联系信息 + 二维码
  .contact-section {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    padding-top: 14px;
    border-top: 1px solid $gray-300;

    .contact-info {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 8px;

      .contact-item {
        display: flex;
        gap: 8px;
        align-items: center;
        font-size: 13px;
        color: $gray-600;

        .contact-icon {
          flex-shrink: 0;
          font-size: 17px;

          &.wechat {
            color: #07c160;
          }

          &.phone {
            color: $primary;
          }

          &.whatsapp {
            color: #25d366;
          }

          &.facebook {
            color: #1877f2;
          }
        }
      }
    }

    .qr-code-wrapper {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      gap: 5px;
      align-items: center;

      .qr-code-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        background: #fff;
        border: 2px solid #fff;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgb(0 0 0 / 6%);
      }

      .qr-code-label {
        margin: 0;
        font-size: 11px;
        color: $gray-400;
      }
    }
  }
</style>
