<!-- 产品分享卡片组件 - 深色奢华金风格 -->
<template>
  <div ref="shareCardRef" class="product-share-card luxury-dark">
    <!-- 金色边框光晕 -->
    <div class="luxury-glow-border"></div>

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
      <div class="luxury-badge">PREMIUM</div>
    </div>

    <!-- 产品图片区域 -->
    <div class="card-image-section">
      <!-- 背景装饰圆环 -->
      <div class="decorative-ring"></div>
      <div class="decorative-ring ring-2"></div>

      <div class="image-wrapper">
        <ElImage :src="product.image" fit="contain" class="product-image" />
      </div>

      <!-- 产品等级徽章 -->
      <div v-if="product.grade" class="grade-badge">
        <Icon icon="ri:medal-line" class="grade-icon" />
        <span>{{ product.grade }}</span>
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

      <!-- 产品参数网格 -->
      <div class="specs-grid">
        <div v-if="product.cartonQuantity" class="spec-card">
          <div class="spec-icon-wrapper">
            <Icon icon="ri:package-3-line" class="spec-icon" />
          </div>
          <div class="spec-content">
            <span class="spec-label">箱装数量</span>
            <span class="spec-value">{{ product.cartonQuantity }}</span>
          </div>
        </div>

        <div v-if="product.moq" class="spec-card">
          <div class="spec-icon-wrapper">
            <Icon icon="ri:stack-line" class="spec-icon" />
          </div>
          <div class="spec-content">
            <span class="spec-label">最低起订</span>
            <span class="spec-value">{{ product.moq }} {{ product.unit || 'pcs' }}</span>
          </div>
        </div>

        <div v-if="product.type" class="spec-card">
          <div class="spec-icon-wrapper">
            <Icon icon="ri:price-tag-3-line" class="spec-icon" />
          </div>
          <div class="spec-content">
            <span class="spec-label">产品类型</span>
            <span class="spec-value">{{ product.type }}</span>
          </div>
        </div>

        <div v-if="product.material" class="spec-card">
          <div class="spec-icon-wrapper">
            <Icon icon="ri:stack-line" class="spec-icon" />
          </div>
          <div class="spec-content">
            <span class="spec-label">材质</span>
            <span class="spec-value">{{ product.material }}</span>
          </div>
        </div>
      </div>

      <!-- 价格信息 -->
      <div v-if="product.salePrice" class="price-section">
        <div class="price-content">
          <span class="price-currency">{{ formatPriceSymbol(product.currency) }}</span>
          <span class="price-value">{{ formatPriceValue(product.salePrice) }}</span>
        </div>
        <div class="price-label">参考价格</div>
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

  // 格式化货币符号
  const formatPriceSymbol = (currency: string | undefined = 'USD') => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      CNY: '¥',
      GBP: '£',
      JPY: '¥'
    }
    return symbols[currency] || '$'
  }

  // 格式化价格数值
  const formatPriceValue = (price: number | undefined) => {
    if (price === undefined) return '0.00'
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // 暴露卡片引用给父组件用于 html2canvas
  defineExpose({
    shareCardRef
  })
</script>

<style lang="scss" scoped>
  // ==================== 奢华金配色系统 ====================
  $gold-primary: #d4af37;
  $gold-light: #f4df89;
  $gold-dark: #aa892c;
  $gold-muted: #c9a961;

  $bg-dark-primary: #1c1917;
  $bg-dark-secondary: #2a2826;
  $bg-dark-tertiary: #3d3a38;

  $text-primary: #fafaf9;
  $text-secondary: #e7e5e4;
  $text-muted: #a8a29e;

  $card-width: 400px;
  $card-radius: 24px;
  $gold-gradient: linear-gradient(
    135deg,
    $gold-primary 0%,
    $gold-light 25%,
    $gold-primary 50%,
    $gold-dark 75%,
    $gold-primary 100%
  );
  $gold-gradient-subtle: linear-gradient(
    135deg,
    rgb(212 175 55 / 15%) 0%,
    rgb(212 175 55 / 5%) 100%
  );

  // ==================== 主卡片 ====================
  .product-share-card {
    position: relative;
    width: $card-width;
    overflow: hidden;
    background: linear-gradient(180deg, $bg-dark-secondary 0%, $bg-dark-primary 100%);
    border-radius: $card-radius;
    box-shadow:
      0 0 0 1px rgba($gold-primary, 0.2),
      0 20px 60px rgb(0 0 0 / 50%),
      0 0 80px rgba($gold-primary, 0.1);
  }

  // ==================== 金色光晕边框 ====================
  .luxury-glow-border {
    position: absolute;
    inset: 0;
    padding: 1px;
    pointer-events: none;
    background: linear-gradient(
      135deg,
      rgba($gold-primary, 0.6) 0%,
      rgba($gold-primary, 0.2) 25%,
      rgba($gold-primary, 0.2) 50%,
      rgba($gold-primary, 0.2) 75%,
      rgba($gold-primary, 0.6) 100%
    );
    border-radius: $card-radius;
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  // ==================== 顶部品牌区域 ====================
  .card-header-section {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    background: linear-gradient(180deg, rgba($gold-primary, 0.08) 0%, transparent 100%);
    border-bottom: 1px solid rgba($gold-primary, 0.15);
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
    background: linear-gradient(135deg, $bg-dark-tertiary 0%, $bg-dark-secondary 100%);
    border: 1px solid rgba($gold-primary, 0.3);
    border-radius: 12px;
    box-shadow:
      inset 0 1px 0 rgba($gold-light, 0.2),
      0 4px 12px rgb(0 0 0 / 30%);

    .logo-icon {
      font-size: 22px;
      background: $gold-gradient;
      filter: drop-shadow(0 2px 4px rgba($gold-primary, 0.4));
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
    text-shadow: 0 2px 4px rgb(0 0 0 / 50%);
    letter-spacing: 2px;
  }

  .brand-subtitle {
    font-size: 9px;
    font-weight: 500;
    color: $gold-muted;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .luxury-badge {
    padding: 6px 14px;
    font-size: 10px;
    font-weight: 700;
    color: $bg-dark-primary;
    letter-spacing: 1.5px;
    background: $gold-gradient;
    border-radius: 20px;
    box-shadow:
      0 4px 12px rgba($gold-primary, 0.4),
      inset 0 1px 0 rgba($gold-light, 0.5);
  }

  // ==================== 图片区域 ====================
  .card-image-section {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 260px;
    overflow: hidden;
    background: radial-gradient(ellipse at center, $bg-dark-tertiary 0%, $bg-dark-primary 100%);

    // 装饰圆环
    .decorative-ring {
      position: absolute;
      width: 200px;
      height: 200px;
      border: 1px solid rgba($gold-primary, 0.15);
      border-radius: 50%;
      animation: pulse-ring 4s ease-in-out infinite;

      &.ring-2 {
        width: 280px;
        height: 280px;
        animation-delay: 1s;
      }
    }

    @keyframes pulse-ring {
      0%,
      100% {
        opacity: 0.5;
        transform: scale(1);
      }

      50% {
        opacity: 0.8;
        transform: scale(1.05);
      }
    }

    .image-wrapper {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 180px;
      height: 180px;
      padding: 16px;
      background: radial-gradient(circle, rgba($gold-primary, 0.1) 0%, transparent 70%);
      border-radius: 50%;

      .product-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 12px 24px rgb(0 0 0 / 40%));
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
      background: rgba($bg-dark-primary, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba($gold-primary, 0.4);
      border-radius: 20px;
      box-shadow: 0 4px 16px rgb(0 0 0 / 30%);

      .grade-icon {
        font-size: 16px;
        background: $gold-gradient;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      span {
        font-size: 12px;
        font-weight: 600;
        color: $gold-light;
        letter-spacing: 0.5px;
      }
    }
  }

  // ==================== 信息区域 ====================
  .card-info-section {
    padding: 24px;
  }

  .product-title {
    display: -webkit-box;
    min-height: 60px;
    margin: 0 0 16px;
    overflow: hidden;
    font-size: 19px;
    font-weight: 700;
    line-height: 1.5;
    color: $text-primary;
    text-align: center;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    letter-spacing: 0.3px;
  }

  // SKU 标签
  .product-sku {
    display: flex;
    gap: 10px;
    align-items: baseline;
    justify-content: center;
    padding: 10px 20px;
    margin-bottom: 20px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba($gold-primary, 0.08) 50%,
      transparent 100%
    );
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
      color: $gold-light;
      letter-spacing: 1px;
    }
  }

  // 参数网格
  .specs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }

  .spec-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    padding: 16px 12px;
    background: linear-gradient(
      180deg,
      rgba($gold-primary, 0.06) 0%,
      rgba($gold-primary, 0.02) 100%
    );
    border: 1px solid rgba($gold-primary, 0.1);
    border-radius: 14px;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(
        180deg,
        rgba($gold-primary, 0.1) 0%,
        rgba($gold-primary, 0.04) 100%
      );
      border-color: rgba($gold-primary, 0.25);
      box-shadow: 0 4px 16px rgba($gold-primary, 0.1);
    }

    .spec-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: linear-gradient(
        135deg,
        rgba($gold-primary, 0.2) 0%,
        rgba($gold-primary, 0.05) 100%
      );
      border: 1px solid rgba($gold-primary, 0.25);
      border-radius: 10px;
      box-shadow: inset 0 1px 0 rgba($gold-light, 0.2);

      .spec-icon {
        font-size: 20px;
        background: $gold-gradient;
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
        font-size: 10px;
        font-weight: 500;
        color: $text-muted;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .spec-value {
        font-size: 14px;
        font-weight: 600;
        color: $text-primary;
      }
    }
  }

  // ==================== 价格区域 ====================
  .price-section {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    margin-top: 8px;
    background: linear-gradient(
      180deg,
      rgba($gold-primary, 0.12) 0%,
      rgba($gold-primary, 0.04) 100%
    );
    border: 1px solid rgba($gold-primary, 0.25);
    border-radius: 16px;
    box-shadow:
      inset 0 1px 0 rgba($gold-light, 0.1),
      0 4px 16px rgba($gold-primary, 0.15);

    .price-content {
      display: flex;
      gap: 4px;
      align-items: baseline;
      margin-bottom: 4px;
    }

    .price-currency {
      font-size: 20px;
      font-weight: 600;
      color: $gold-primary;
    }

    .price-value {
      font-size: 36px;
      font-weight: 800;
      text-shadow: 0 2px 8px rgba($gold-primary, 0.3);
      letter-spacing: -1px;
      background: $gold-gradient;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .price-label {
      font-size: 11px;
      font-weight: 500;
      color: $text-muted;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }

  // ==================== 底部联系方式 ====================
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    background: linear-gradient(180deg, rgb(0 0 0 / 30%) 0%, rgb(0 0 0 / 40%) 100%);
    border-top: 1px solid rgba($gold-primary, 0.15);
  }

  .footer-left {
    display: flex;
    flex-direction: column;
    gap: 12px;

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
        background: linear-gradient(
          135deg,
          rgba($gold-primary, 0.15) 0%,
          rgba($gold-primary, 0.05) 100%
        );
        border: 1px solid rgba($gold-primary, 0.2);
        border-radius: 8px;

        :deep(svg) {
          font-size: 16px;
        }

        &.wechat {
          background: linear-gradient(135deg, rgb(7 193 96 / 15%) 0%, rgb(7 193 96 / 5%) 100%);
          border-color: rgb(7 193 96 / 40%);

          :deep(svg) {
            color: #07c160;
          }
        }

        &.email {
          background: linear-gradient(
            135deg,
            rgba($gold-primary, 0.15) 0%,
            rgba($gold-primary, 0.05) 100%
          );
          border-color: rgba($gold-primary, 0.4);

          :deep(svg) {
            color: $gold-light;
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
      background: linear-gradient(135deg, $gold-gradient 0%, $gold-muted 100%);
      border-radius: 12px;

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
          color: $bg-dark-primary;
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
