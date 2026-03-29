<!-- 产品分享卡片组件 - 完全参考用户资料卡片设计 -->
<template>
  <div ref="shareCardRef" class="product-share-card">
    <!-- 封面图区域（浅蓝白渐变背景） -->
    <div class="card-cover-section">
      <!-- 产品主图（类似头像，圆形，偏移出封面） -->
      <div class="product-image-wrapper">
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
      <!-- 产品信息区（类似用户名 + 职位） -->
      <div class="product-info-section">
        <div class="product-header">
          <h2 class="product-name">{{ product.name || '产品名称' }}</h2>
          <div v-if="product.type" class="type-badge">{{ product.type }}</div>
        </div>
        <p class="product-spec">{{ product.spec || '规格型号' }}</p>
      </div>

      <!-- 统计数据区（三列布局）：产品名称、产品型号、装箱数量 -->
      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-label">产品名称</div>
          <div class="stat-value">{{ truncateText(product.name, 8) }}</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-label">产品型号</div>
          <div class="stat-value">{{ product.sku || '-' }}</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-label">装箱数量</div>
          <div class="stat-value">{{ product.cartonQuantity ?? '-' }}</div>
        </div>
      </div>

      <!-- CTA 按钮（类似 Get in Touch） -->
      <ElButton class="cta-button" type="primary" size="large">
        <Icon icon="ri:wechat-line" class="button-icon" />
        立即咨询
      </ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { ElImage, ElButton } from 'element-plus'

  defineOptions({ name: 'ProductShareCard' })

  interface ProductInfo {
    image: string
    name: string
    sku?: string
    spec?: string
    type?: string
    grade?: string
    cartonQuantity?: number
  }

  const props = defineProps<{
    product: ProductInfo
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

  // 截断文本
  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return '-'
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  // 暴露卡片引用给父组件用于 html2canvas
  defineExpose({
    shareCardRef
  })
</script>

<style lang="scss" scoped>
  // ==================== 配色系统（参考用户资料卡片） ====================
  // 主色调
  $primary-color: #3b82f6;
  $primary-light: #dbeafe;
  $primary-dark: #1d4ed8;

  // 中性色
  $bg-white: #fff;
  $bg-stats: #f3f4f6;
  $bg-button: #1a1a1a;

  $text-primary: #1a1a1a;
  $text-secondary: #6b7280;
  $text-muted: #9ca3af;

  // 等级色
  $grade-a: #10b981;
  $grade-b: #3b82f6;
  $grade-c: #f59e0b;

  // 卡片规格（参考用户资料卡片）
  $card-width: 380px;
  $card-radius: 28px;
  $cover-height: 140px;
  $image-size: 88px;

  // ==================== 主卡片 ====================
  .product-share-card {
    position: relative;
    width: $card-width;
    overflow: hidden;
    background: $bg-white;
    border-radius: $card-radius;
    box-shadow: 0 4px 24px rgb(0 0 0 / 8%);
  }

  // ==================== 封面图区域 ====================
  .card-cover-section {
    position: relative;
    height: $cover-height;
    background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 50%, #bfdbfe 100%);
    border-radius: $card-radius $card-radius 0 0;

    .cover-background {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse 80% 100% at 80% 0%,
        rgba($primary-color, 0.15) 0%,
        transparent 60%
      );
    }

    // 产品主图（类似头像，圆形，向左下偏移）
    .product-image-wrapper {
      position: absolute;
      bottom: -44px; // 一半图片高度，形成偏移效果
      left: 24px;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      width: $image-size;
      height: $image-size;
      padding: 12px;
      background: $bg-white;
      border: 4px solid $bg-white;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgb(0 0 0 / 10%);

      .product-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    // 等级徽章（类似认证徽章）
    .grade-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      display: flex;
      gap: 6px;
      align-items: center;
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(135deg, $grade-a 0%, #059669 100%);
      border-radius: 16px;
      box-shadow: 0 4px 12px rgb(16 185 129 / 30%);

      &.grade-a {
        background: linear-gradient(135deg, $grade-a 0%, #059669 100%);
        box-shadow: 0 4px 12px rgb(16 185 129 / 30%);
      }

      &.grade-b {
        background: linear-gradient(135deg, $grade-b 0%, #2563eb 100%);
        box-shadow: 0 4px 12px rgb(59 130 246 / 30%);
      }

      &.grade-c {
        background: linear-gradient(135deg, $grade-c 0%, #d97706 100%);
        box-shadow: 0 4px 12px rgb(245 158 11 / 30%);
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
    padding: 52px 24px 24px; // 顶部留出头像空间（88px/2 = 44px + 8px 间距）
  }

  // 产品信息区（类似用户名 + 职位）
  .product-info-section {
    .product-header {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;

      .product-name {
        flex: 1;
        font-size: 22px;
        font-weight: 700;
        line-height: 1.3;
        color: $text-primary;
      }

      .type-badge {
        flex-shrink: 0;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 600;
        color: $primary-color;
        background: $primary-light;
        border-radius: 12px;
      }
    }

    .product-spec {
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
      color: $text-secondary;
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
      background: #e5e7eb;
    }
  }

  // CTA 按钮（类似 Get in Touch）
  .cta-button {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 52px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    background: $bg-button !important;
    border: none !important;
    border-radius: 18px;
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 8px 24px rgb(0 0 0 / 16%);
      transform: translateY(-2px);
    }

    .button-icon {
      font-size: 18px;
    }
  }
</style>
