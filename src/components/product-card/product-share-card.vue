<!-- 产品分享卡片组件 - 用于生成分享图片 -->
<template>
  <div ref="shareCardRef" class="product-share-card">
    <!-- 顶部装饰条 -->
    <div class="card-top-accent"></div>

    <!-- 产品图片区域 -->
    <div class="card-image-section">
      <div class="image-wrapper">
        <ElImage :src="product.image" fit="contain" class="product-image" />
      </div>
      <!-- 品牌标识 -->
      <div class="brand-badge">
        <Icon icon="ri:package-line" class="brand-icon" />
        <span>ART DESIGN PRO</span>
      </div>
    </div>

    <!-- 产品信息区域 -->
    <div class="card-info-section">
      <h2 class="product-title">{{ product.name || '产品名称' }}</h2>

      <div class="product-sku">
        <Icon icon="ri:barcode-box-line" class="sku-icon" />
        <span class="sku-label">型号：</span>
        <span class="sku-value">{{ product.sku || '-' }}</span>
      </div>

      <!-- 产品参数 -->
      <div class="product-specs">
        <div class="spec-item" v-if="product.cartonQuantity">
          <div class="spec-icon-wrapper">
            <Icon icon="ri:package-3-line" class="spec-icon" />
          </div>
          <div class="spec-content">
            <span class="spec-label">每箱总片数</span>
            <span class="spec-value">{{ product.cartonQuantity }} 片</span>
          </div>
        </div>

        <div class="spec-item" v-if="product.moq">
          <div class="spec-icon-wrapper">
            <Icon icon="ri:stack-line" class="spec-icon" />
          </div>
          <div class="spec-content">
            <span class="spec-label">最低起订量</span>
            <span class="spec-value">{{ product.moq }} {{ product.unit || '片' }}</span>
          </div>
        </div>

        <div class="spec-item" v-if="product.type">
          <div class="spec-icon-wrapper">
            <Icon icon="ri:price-tag-3-line" class="spec-icon" />
          </div>
          <div class="spec-content">
            <span class="spec-label">产品类型</span>
            <span class="spec-value">{{ product.type }}</span>
          </div>
        </div>

        <div class="spec-item" v-if="product.grade">
          <div class="spec-icon-wrapper">
            <Icon icon="ri:medal-line" class="spec-icon" />
          </div>
          <div class="spec-content">
            <span class="spec-label">产品等级</span>
            <span class="spec-value">{{ product.grade }}</span>
          </div>
        </div>
      </div>

      <!-- 价格信息 -->
      <div class="price-section" v-if="product.salePrice">
        <div class="price-label">参考价格</div>
        <div class="price-value">{{ formatPrice(product.salePrice, product.currency) }}</div>
      </div>
    </div>

    <!-- 底部：联系方式 + 二维码 -->
    <div class="card-footer">
      <div class="footer-left">
        <div class="contact-row">
          <Icon icon="ri:wechat-line" class="contact-icon wechat" />
          <span class="contact-text">{{ contact.wechat || 'artdesignpro' }}</span>
        </div>
        <div class="contact-row">
          <Icon icon="ri:mail-line" class="contact-icon email" />
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
  // ==================== 变量定义 ====================
  $card-width: 380px;
  $card-bg: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  $card-border: rgb(255 255 255 / 10%);
  $card-shadow: 0 20px 60px rgb(0 0 0 / 40%);

  $accent-color: #e94560;
  $accent-hover: #ff6b6b;
  $text-primary: #fff;
  $text-secondary: rgb(255 255 255 / 60%);
  $text-muted: rgb(255 255 255 / 70%);

  // ==================== 主卡片 ====================
  .product-share-card {
    width: $card-width;
    overflow: hidden;
    background: $card-bg;
    border: 1px solid $card-border;
    border-radius: 16px;
    box-shadow: $card-shadow;
  }

  // ==================== 顶部装饰条 ====================
  .card-top-accent {
    height: 4px;
    background: linear-gradient(90deg, $accent-color 0%, $accent-hover 50%, $accent-color 100%);
  }

  // ==================== 图片区域 ====================
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
      color: $text-primary;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: linear-gradient(135deg, $accent-color 0%, #dc2626 100%);
      border-radius: 20px;
      box-shadow: 0 4px 12px rgb(233 69 96 / 40%);

      .brand-icon {
        font-size: 14px;
      }
    }
  }

  // ==================== 信息区域 ====================
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
      color: $text-primary;
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
        color: $accent-color;
      }

      .sku-label {
        color: $text-secondary;
      }

      .sku-value {
        font-family: 'Courier New', monospace;
        font-weight: 600;
        color: $text-primary;
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
          background: linear-gradient(135deg, $accent-color 0%, $accent-hover 100%);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgb(233 69 96 / 30%);

          .spec-icon {
            font-size: 18px;
            color: $text-primary;
          }
        }

        .spec-content {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: space-between;

          .spec-label {
            font-size: 12px;
            color: $text-secondary;
          }

          .spec-value {
            font-size: 14px;
            font-weight: 600;
            color: $text-primary;
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
        color: $text-muted;
      }

      .price-value {
        font-size: 22px;
        font-weight: 700;
        color: #ffd700;
        text-shadow: 0 2px 8px rgb(255 215 0 / 30%);
      }
    }
  }

  // ==================== 底部联系方式 ====================
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
            color: $accent-color;
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
        color: $text-muted;
        letter-spacing: 0.5px;
      }
    }
  }
</style>
