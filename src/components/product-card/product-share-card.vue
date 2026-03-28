<!-- 产品分享卡片组件 - 液态玻璃拟态风格 -->
<template>
  <div ref="shareCardRef" class="product-share-card liquid-glass">
    <!-- 液态光晕边框 -->
    <div class="liquid-glow-border"></div>

    <!-- 流动背景 -->
    <div class="liquid-background"></div>

    <!-- 顶部品牌区域 -->
    <div class="card-header-section">
      <div class="brand-logo">
        <div class="logo-icon-wrapper">
          <Icon icon="ri:gemini-line" class="logo-icon" />
        </div>
        <div class="brand-text">
          <span class="brand-name">ART DESIGN</span>
          <span class="brand-subtitle">PROFESSIONAL</span>
        </div>
      </div>
      <div class="liquid-badge">PREMIUM</div>
    </div>

    <!-- 产品图片区域 - 调整高度 -->
    <div class="card-image-section">
      <!-- 装饰液滴 -->
      <div class="liquid-drop drop-1"></div>
      <div class="liquid-drop drop-2"></div>

      <div class="image-wrapper">
        <ElImage :src="product.image" fit="contain" class="product-image" />
      </div>
    </div>

    <!-- 产品信息区域 -->
    <div class="card-info-section">
      <h2 class="product-title">{{ product.name || '产品名称' }}</h2>

      <!-- 产品 SKU -->
      <div class="product-sku">
        <span class="sku-label">产品型号</span>
        <span class="sku-value">{{ product.sku || 'N/A' }}</span>
      </div>

      <!-- 产品参数网格 - 2 列 -->
      <div class="specs-grid">
        <div class="spec-card">
          <div class="spec-icon-wrapper">
            <Icon icon="ri:package-3-line" class="spec-icon" />
          </div>
          <div class="spec-content">
            <span class="spec-label">装箱数量</span>
            <span class="spec-value">{{ product.cartonQuantity ?? '-' }}</span>
          </div>
        </div>

        <div class="spec-card">
          <div class="spec-icon-wrapper">
            <Icon icon="ri:stack-line" class="spec-icon" />
          </div>
          <div class="spec-content">
            <span class="spec-label">最低起订</span>
            <span class="spec-value">{{
              product.moq !== undefined && product.moq !== null
                ? `${product.moq} ${product.unit || 'pcs'}`
                : '-'
            }}</span>
          </div>
        </div>

        <div class="spec-card">
          <div class="spec-icon-wrapper">
            <Icon icon="ri:price-tag-3-line" class="spec-icon" />
          </div>
          <div class="spec-content">
            <span class="spec-label">产品类型</span>
            <span class="spec-value">{{ product.type ?? '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部：联系方式 + 二维码 -->
    <div class="card-footer">
      <div class="footer-left">
        <div class="footer-title">联系我们</div>
        <div class="contact-row">
          <div class="contact-icon-wrapper wechat">
            <Icon icon="ri:wechat-line" />
          </div>
          <span class="contact-text">{{ contact.wechat || 'artdesignpro' }}</span>
        </div>
        <div class="contact-row">
          <div class="contact-icon-wrapper email">
            <Icon icon="ri:mail-line" />
          </div>
          <span class="contact-text">{{ contact.email || 'info@artdesignpro.com' }}</span>
        </div>
      </div>
      <!-- 二维码 -->
      <div class="qr-section">
        <div class="qr-code">
          <div class="qr-inner">
            <Icon icon="ri:qr-code-line" class="qr-icon" />
          </div>
        </div>
        <span class="qr-label">扫码获取详情</span>
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

  withDefaults(
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

  // 暴露卡片引用给父组件用于 html2canvas
  defineExpose({
    shareCardRef
  })
</script>

<style lang="scss" scoped>
  // ==================== 深蓝色调配色系统 ====================
  $bg-dark-start: #0a1628;
  $bg-dark-mid: #1e3a5f;
  $bg-dark-end: #0f2942;

  $card-glass: rgb(255 255 255 / 5%);
  $card-glass-hover: rgb(255 255 255 / 8%);
  $card-border: rgb(100 180 255 / 15%);

  $text-primary: #e0f2ff;
  $text-secondary: rgb(200 230 255 / 75%);
  $text-muted: rgb(150 200 235 / 45%);

  // 蓝色渐变色 (deep blue → cyan → light blue)
  $blue-start: #3b82f6;
  $blue-mid: #06b6d4;
  $blue-end: #60a5fa;

  $card-width: 400px;
  $card-height: 533px; // 3:4 比例
  $card-radius: 24px;

  $blue-gradient: linear-gradient(135deg, $blue-start 0%, $blue-mid 50%, $blue-end 100%);

  $blue-glow: linear-gradient(
    135deg,
    rgba($blue-start, 0.4) 0%,
    rgba($blue-mid, 0.4) 50%,
    rgba($blue-end, 0.4) 100%
  );

  $bg-gradient: linear-gradient(135deg, $bg-dark-start 0%, $bg-dark-mid 50%, $bg-dark-end 100%);

  // ==================== 主卡片 - 3:4 比例 ====================
  .product-share-card {
    position: relative;
    width: $card-width;
    height: $card-height;
    overflow: hidden;
    background: $bg-gradient;
    border-radius: $card-radius;
    box-shadow:
      0 0 0 1px rgb(100 180 255 / 15%),
      0 25px 80px rgb(0 0 0 / 50%),
      0 0 120px rgba($blue-start, 0.2);
  }

  // ==================== 液态光晕边框 ====================
  .liquid-glow-border {
    position: absolute;
    inset: 0;
    padding: 1px;
    pointer-events: none;
    background: $blue-gradient;
    border-radius: $card-radius;
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: liquid-glow 3s ease-in-out infinite;
  }

  @keyframes liquid-glow {
    0%,
    100% {
      opacity: 0.6;
    }

    50% {
      opacity: 1;
    }
  }

  // ==================== 流动背景动画 ====================
  .liquid-background {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      ellipse 80% 50% at 50% -20%,
      rgba($blue-start, 0.25) 0%,
      transparent 60%
    );
    animation: liquid-flow 8s ease-in-out infinite;
  }

  @keyframes liquid-flow {
    0%,
    100% {
      transform: translateY(0) scale(1);
    }

    50% {
      transform: translateY(-10px) scale(1.05);
    }
  }

  // ==================== 顶部品牌区域 ====================
  .card-header-section {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    background: rgb(255 255 255 / 3%);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid $card-border;
  }

  .brand-logo {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .logo-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: $card-glass;
    backdrop-filter: blur(10px);
    border: 1px solid $card-border;
    border-radius: 12px;
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 10%),
      0 4px 12px rgb(0 0 0 / 30%);
    transition: all 0.3s ease;

    &:hover {
      background: $card-glass-hover;
      border-color: rgba($blue-start, 0.6);
      box-shadow:
        inset 0 1px 0 rgb(255 255 255 / 20%),
        0 4px 20px rgba($blue-start, 0.3);
    }

    .logo-icon {
      font-size: 22px;
      background: $blue-gradient;
      filter: drop-shadow(0 2px 4px rgba($blue-start, 0.4));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .brand-name {
    font-size: 14px;
    font-weight: 700;
    color: $text-primary;
    text-shadow: 0 2px 8px rgb(0 0 0 / 30%);
    letter-spacing: 2px;
  }

  .brand-subtitle {
    font-size: 9px;
    font-weight: 500;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .liquid-badge {
    padding: 6px 14px;
    font-size: 10px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 1.5px;
    background: $blue-gradient;
    border-radius: 20px;
    box-shadow:
      0 4px 12px rgba($blue-start, 0.4),
      inset 0 1px 0 rgb(255 255 255 / 30%);
  }

  // ==================== 图片区域 ====================
  .card-image-section {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 280px;
    overflow: hidden;
    background: radial-gradient(ellipse at center, rgba($blue-start, 0.12) 0%, transparent 60%);

    // 装饰液滴
    .liquid-drop {
      position: absolute;
      background: $blue-gradient;
      filter: blur(20px);
      border-radius: 50%;
      opacity: 0.3;
      animation: liquid-drop 6s ease-in-out infinite;

      &.drop-1 {
        top: 20px;
        left: 50%;
        width: 120px;
        height: 120px;
        transform: translateX(-50%);
      }

      &.drop-2 {
        right: 60px;
        bottom: 40px;
        width: 80px;
        height: 80px;
        animation-delay: 2s;
      }
    }

    @keyframes liquid-drop {
      0%,
      100% {
        transform: translateX(-50%) translateY(0) scale(1);
      }

      50% {
        transform: translateX(-50%) translateY(-10px) scale(1.1);
      }
    }

    .image-wrapper {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 280px;
      height: 300px;
      padding: 8px;
      background: $card-glass;
      backdrop-filter: blur(10px);
      border: 1px solid $card-border;
      border-radius: 16px;
      box-shadow:
        inset 0 1px 0 rgb(255 255 255 / 10%),
        0 8px 32px rgb(0 0 0 / 30%);

      .product-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 12px 24px rgb(0 0 0 / 40%));
      }
    }
  }

  // ==================== 信息区域 ====================
  .card-info-section {
    padding: 16px 24px 20px;
    margin-bottom: 80px; // 为底部联系方式预留空间
  }

  .product-title {
    display: -webkit-box;
    min-height: 48px;
    margin: 0 0 12px;
    overflow: hidden;
    font-size: 17px;
    font-weight: 600;
    line-height: 1.4;
    color: $text-primary;
    text-align: center;
    text-shadow: 0 2px 8px rgb(0 0 0 / 30%);
    letter-spacing: 0.3px;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  // SKU 标签
  .product-sku {
    display: flex;
    gap: 10px;
    align-items: baseline;
    justify-content: center;
    padding: 8px 20px;
    margin-bottom: 12px;
    background: rgb(255 255 255 / 3%);
    backdrop-filter: blur(10px);
    border: 1px solid $card-border;
    border-radius: 12px;

    .sku-label {
      font-size: 11px;
      font-weight: 500;
      color: $text-muted;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .sku-value {
      font-family: 'Courier New', monospace;
      font-size: 14px;
      font-weight: 700;
      color: $text-primary;
      text-shadow: 0 0 20px rgba($blue-start, 0.3);
      letter-spacing: 1px;
    }
  }

  // 参数网格
  .specs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .spec-card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    padding: 12px 10px;
    background: $card-glass;
    backdrop-filter: blur(10px);
    border: 1px solid $card-border;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: $card-glass-hover;
      border-color: rgba($blue-start, 0.5);
      box-shadow:
        0 8px 32px rgba($blue-start, 0.2),
        inset 0 1px 0 rgb(255 255 255 / 10%);
      transform: translateY(-2px);
    }

    .spec-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, rgba($blue-start, 0.25) 0%, rgba($blue-end, 0.15) 100%);
      border: 1px solid rgba($blue-start, 0.4);
      border-radius: 10px;
      box-shadow: inset 0 1px 0 rgb(255 255 255 / 10%);

      .spec-icon {
        font-size: 18px;
        background: $blue-gradient;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    .spec-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      align-items: center;
      text-align: center;

      .spec-label {
        font-size: 9px;
        font-weight: 500;
        color: $text-muted;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .spec-value {
        font-size: 13px;
        font-weight: 600;
        color: $text-primary;
      }
    }
  }

  // ==================== 底部联系方式 ====================
  .card-footer {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background: linear-gradient(180deg, transparent 0%, rgb(0 0 0 / 40%) 100%);
    backdrop-filter: blur(20px);
    border-top: 1px solid $card-border;
  }

  .footer-left {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .footer-title {
      font-size: 10px;
      font-weight: 600;
      color: $text-muted;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .contact-row {
      display: flex;
      gap: 10px;
      align-items: center;

      .contact-icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: $card-glass;
        backdrop-filter: blur(10px);
        border: 1px solid $card-border;
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
          background: $card-glass-hover;
          border-color: rgba($blue-start, 0.6);
          box-shadow: 0 4px 16px rgba($blue-start, 0.3);
        }

        :deep(svg) {
          font-size: 16px;
        }

        &.wechat {
          :deep(svg) {
            color: #07c160;
          }
        }

        &.email {
          :deep(svg) {
            color: $text-primary;
          }
        }
      }

      .contact-text {
        font-size: 12px;
        color: $text-secondary;
        letter-spacing: 0.3px;
      }
    }
  }

  // 二维码区域
  .qr-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;

    .qr-code {
      padding: 4px;
      background: $blue-gradient;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba($blue-start, 0.4);

      .qr-inner {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        background: #fff;
        border-radius: 8px;
        box-shadow: inset 0 2px 8px rgb(0 0 0 / 10%);

        .qr-icon {
          font-size: 36px;
          color: $bg-dark-start;
        }
      }
    }

    .qr-label {
      font-size: 9px;
      font-weight: 500;
      color: $text-muted;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }
</style>
