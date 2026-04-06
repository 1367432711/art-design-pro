<!-- 产品分享卡片组件 - 完全参考用户资料卡片设计 -->
<template>
  <div ref="shareCardRef" class="product-share-card">
    <!-- 封面图区域（产品图作为封面背景） -->
    <div class="card-cover-section">
      <!-- 产品图作为封面背景 -->
      <div class="cover-product-image">
        <ElImage :src="product.image" fit="cover" class="cover-image" crossorigin="anonymous" />
      </div>
      <!-- 用户头像（圆形，偏移出封面） -->
      <div class="user-avatar-wrapper">
        <ElImage :src="user.avatar" fit="cover" class="user-avatar" crossorigin="anonymous" />
      </div>
      <!-- 产品等级徽章（类似认证徽章） -->
      <div v-if="product.grade" class="grade-badge" :class="gradeClass">
        <Icon icon="ri:medal-line" class="badge-icon" />
        <span>{{ product.grade }}</span>
      </div>
    </div>

    <!-- 卡片内容区域 -->
    <div class="card-content">
      <!-- 用户信息区（类似用户名 + 职位） -->
      <div class="user-info-section">
        <div class="user-header">
          <h2 class="user-name">{{ user.userName || '用户名' }}</h2>
          <div v-if="user.role" class="role-badge">{{ user.role }}</div>
        </div>
        <p class="user-email">{{ user.email || '邮箱' }}</p>
      </div>

      <!-- 统计数据区（三列布局）：产品名称、规格型号、装箱数量 -->
      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-label">产品名称</div>
          <div class="stat-value">{{ truncateText(product.name, 8) }}</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-label">规格型号</div>
          <div class="stat-value">{{ product.spec || '-' }}</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-label">装箱数量</div>
          <div class="stat-value">{{ product.cartonQuantity ?? '-' }}</div>
        </div>
      </div>

      <!-- 联系信息区 -->
      <div class="contact-section">
        <!-- 上方：联系方式标签 -->
        <div class="contact-label-wrapper">
          <div class="contact-label">联系方式</div>
        </div>
        <!-- 下方：左侧联系信息，右侧二维码 -->
        <div class="contact-content">
          <div class="contact-info">
            <div class="contact-item">
              <Icon icon="ri:wechat-line" class="contact-icon" />
              <span>{{ user.wechat || '微信：请添加' }}</span>
            </div>
            <div v-if="user.phone" class="contact-item">
              <Icon icon="ri:phone-line" class="contact-icon" />
              <span>{{ user.phone }}</span>
            </div>
            <div v-if="user.facebook" class="contact-item">
              <Icon icon="ri:facebook-line" class="contact-icon" />
              <span>{{ user.facebook }}</span>
            </div>
          </div>
          <div class="qr-code-wrapper">
            <ElImage :src="user.qrCode" fit="cover" class="qr-code-image" crossorigin="anonymous" />
            <div class="qr-code-label">扫一扫加微信</div>
          </div>
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
  // ==================== 高级配色系统 ====================
  // 主色：深邃午夜蓝 + 金属质感
  $primary-dark: #0f172a; // 深蓝黑基底
  $primary-mid: #1e293b; // 中层过渡
  $primary-light: #334155; // 高光区域

  // 渐变配色：午夜蓝 → 深海蓝 → 紫罗兰（微妙过渡）
  $gradient-start: #0f172a; // 午夜蓝黑
  $gradient-mid: #1e3a5f; // 深海蓝
  $gradient-end: #1e293b; // 深岩灰

  // 金色点缀（提升高级感）
  $accent-gold: #fbbf24;
  $accent-gold-light: #fcd34d;

  // 毛玻璃效果
  $glass-bg: rgb(255 255 255 / 6%);
  $glass-border: rgb(255 255 255 / 12%);
  $glass-highlight: rgb(255 255 255 / 8%);

  // 边框色
  $border-subtle: rgb(255 255 255 / 8%);
  $border-bright: rgb(255 255 255 / 16%);

  // 文字色（白色系，带冷暖对比）
  $text-primary: #f8fafc; // 主文字（冷白）
  $text-secondary: #cbd5e1; // 次要文字
  $text-muted: #94a3b8; // 弱化文字
  $text-accent: #7dd3fc; // 强调文字（天空蓝）

  // 等级色（优化饱和度）
  $grade-a: #10b981;
  $grade-b: #3b82f6;
  $grade-c: #f59e0b;

  // 卡片规格
  $card-width: 380px;
  $card-radius: 20px;
  $cover-height: 200px;
  $avatar-size: 88px;

  // ==================== 主卡片 ====================
  .product-share-card {
    position: relative;
    width: $card-width;
    overflow: hidden;
    // 高级渐变背景 + 微妙纹理
    background:
      // 噪点纹理层
      url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
      // 主渐变层
      linear-gradient(135deg, $gradient-start 0%, $gradient-mid 45%, $gradient-end 100%);
    background-blend-mode: overlay;
    border-radius: $card-radius;
    // 多层阴影增强立体感
    box-shadow:
      0 0 0 1px $border-subtle,
      0 4px 24px rgb(0 0 0 / 15%),
      0 8px 48px rgb(0 0 0 / 12%),
      inset 0 1px 0 rgb(255 255 255 / 10%);
  }

  // ==================== 封面图区域（产品图作为封面） ====================
  .card-cover-section {
    position: relative;
    height: $cover-height;
    // 封面区使用浅色渐变，与主体形成对比
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
    border-radius: $card-radius $card-radius 0 0;
    // 封面边框
    box-shadow:
      0 1px 0 rgb(255 255 255 / 20%),
      0 2px 8px rgb(0 0 0 / 8%);

    // 产品图作为封面背景
    .cover-product-image {
      position: absolute;
      inset: 0;
      overflow: hidden;
      border-radius: $card-radius $card-radius 0 0;

      // 渐变遮罩改为更柔和的米白色
      &::after {
        position: absolute;
        inset: 0;
        z-index: 1;
        content: '';
        background: linear-gradient(
          to bottom,
          rgb(248 250 252 / 25%) 0%,
          rgb(248 250 252 / 55%) 100%
        );
      }

      .cover-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    // 用户头像（圆形，向左下偏移）
    .user-avatar-wrapper {
      position: absolute;
      bottom: -44px;
      left: 24px;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: center;
      width: $avatar-size;
      height: $avatar-size;
      padding: 5px;
      // 头像边框：使用金色渐变提升高级感
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border: 2px solid $border-bright;
      border-radius: 50%;
      // 多层阴影增强立体感
      box-shadow:
        0 4px 16px rgb(0 0 0 / 20%),
        0 0 0 1px rgb(255 255 255 / 6%);

      .user-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    // 等级徽章（类似认证徽章）
    .grade-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 20;
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
    padding: 52px 24px 24px;
  }

  // 用户信息区（类似用户名 + 职位）
  .user-info-section {
    padding: 18px 20px;
    // 毛玻璃背景
    background: $glass-bg;
    backdrop-filter: blur(12px);
    // 边框
    border: 1px solid $glass-border;
    border-radius: 16px;
    // 多层阴影 + 内发光
    box-shadow:
      0 4px 24px rgb(0 0 0 / 8%),
      inset 0 1px 0 $glass-highlight;

    .user-header {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;

      .user-name {
        flex: 1;
        font-size: 20px;
        font-weight: 600;
        line-height: 1.4;
        color: $text-primary;
        // 微妙的文字阴影
        text-shadow: 0 1px 2px rgb(0 0 0 / 20%);
        letter-spacing: 0.3px;
      }

      .role-badge {
        flex-shrink: 0;
        padding: 5px 12px;
        font-size: 12px;
        font-weight: 500;
        // 金色主题的角色徽章
        color: $accent-gold;
        background: rgb(251 191 36 / 10%);
        border: 1px solid rgb(251 191 36 / 25%);
        border-radius: 12px;
      }
    }

    .user-email {
      font-size: 14px;
      font-weight: 400;
      line-height: 1.6;
      color: $text-secondary;
      letter-spacing: 0.2px;
    }
  }

  // 统计数据区（三列）
  .stats-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 18px;
    // 毛玻璃背景
    background: $glass-bg;
    backdrop-filter: blur(12px);
    border: 1px solid $glass-border;
    border-radius: 16px;
    box-shadow:
      0 4px 24px rgb(0 0 0 / 8%),
      inset 0 1px 0 $glass-highlight;

    .stat-item {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      text-align: center;

      .stat-value {
        font-size: 11px;
        font-weight: 500;
        color: $text-accent;
        letter-spacing: 0.3px;
      }

      .stat-label {
        font-size: 11px;
        font-weight: 600;
        color: $text-muted;
        text-transform: uppercase;
        letter-spacing: 0.8px;
      }
    }

    .stat-divider {
      width: 1px;
      height: 44px;
      background: linear-gradient(to bottom, transparent, $border-bright, transparent);
    }
  }

  // 联系信息区
  .contact-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 18px 20px;
    // 毛玻璃背景
    background: $glass-bg;
    backdrop-filter: blur(12px);
    border: 1px solid $glass-border;
    border-radius: 16px;
    box-shadow:
      0 4px 24px rgb(0 0 0 / 8%),
      inset 0 1px 0 $glass-highlight;

    // 标签区域
    .contact-label-wrapper {
      display: flex;
      align-items: center;

      .contact-label {
        font-size: 12px;
        font-weight: 600;
        color: $text-primary;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    }

    // 内容区域（左侧信息 + 右侧二维码）
    .contact-content {
      display: flex;
      gap: 16px;
      align-items: stretch;

      // 左侧联系信息
      .contact-info {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 10px;
        justify-content: space-around;

        .contact-item {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 13px;
          font-weight: 400;
          color: $text-secondary;
          letter-spacing: 0.2px;

          .contact-icon {
            font-size: 18px;
            // 使用天空蓝作为图标颜色
            color: $text-accent;
          }
        }
      }

      // 右侧二维码
      .qr-code-wrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        justify-content: center;

        .qr-code-image {
          width: 80px;
          height: 80px;
          padding: 4px;
          background: #fff;
          // 金色边框提升高级感
          border: 2px solid $border-bright;
          border-radius: 10px;
          // 柔和阴影
          box-shadow:
            0 4px 12px rgb(0 0 0 / 20%),
            0 0 0 1px rgb(255 255 255 / 6%);
        }

        .qr-code-label {
          font-size: 11px;
          font-weight: 400;
          color: $text-muted;
          letter-spacing: 0.6px;
        }
      }
    }
  }
</style>
