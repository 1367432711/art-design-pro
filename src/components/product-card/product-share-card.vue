<!-- 产品分享卡片组件 - 完全参考用户资料卡片设计 -->
<template>
  <div ref="shareCardRef" class="product-share-card">
    <!-- 封面图区域（产品图作为封面背景） -->
    <div class="card-cover-section">
      <!-- 产品图作为封面背景 -->
      <div class="cover-product-image">
        <ElImage :src="product.image" fit="cover" class="cover-image" />
      </div>
      <!-- 用户头像（圆形，偏移出封面） -->
      <div class="user-avatar-wrapper">
        <ElImage :src="user.avatar" fit="cover" class="user-avatar" />
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

      <!-- 统计数据区（三列布局）：产品名称、产品型号、装箱数量 -->
      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-label">产品名称</div>
          <div class="stat-value">{{ truncateText(product.name, 8) }}</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-label">产品型号</div>
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
            <ElImage :src="user.qrCode" fit="cover" class="qr-code-image" />
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
  // ==================== 深色毛玻璃配色系统（参考深色财务卡片） ====================
  // 深色背景渐变
  $bg-dark-outer: rgb(15 23 42 / 80%);
  $bg-dark-inner: rgb(30 41 59 / 60%);
  $bg-card: rgb(255 255 255 / 5%);
  $bg-card-hover: rgb(255 255 255 / 8%);

  // 边框色 - 白色半透明
  $border-light: rgb(255 255 255 / 10%);
  $border-lighter: rgb(255 255 255 / 15%);
  $border-bright: rgb(255 255 255 / 20%);

  // 文字色
  $text-primary: #fff;
  $text-secondary: #c1d2e9;
  $text-muted: #94a3b8;
  $text-accent: #10b981;

  // 等级色
  $grade-a: #10b981;
  $grade-b: #3b82f6;
  $grade-c: #f59e0b;

  // 蓝色强调
  $primary-color: #3b82f6;
  $primary-glow: rgb(59 130 246 / 40%);

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
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1e3a8a 100%);
    border-radius: $card-radius;
    box-shadow: 0 4px 24px rgb(0 0 0 / 8%);
  }

  // ==================== 封面图区域（产品图作为封面） ====================
  .card-cover-section {
    position: relative;
    height: $cover-height;
    background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 50%, #bfdbfe 100%);
    border-radius: $card-radius $card-radius 0 0;

    // 产品图作为封面背景
    .cover-product-image {
      position: absolute;
      inset: 0;
      overflow: hidden;
      border-radius: $card-radius $card-radius 0 0;

      // 添加渐变遮罩，让产品图半透明
      &::after {
        position: absolute;
        inset: 0;
        z-index: 1;
        content: '';
        background: linear-gradient(
          to bottom,
          rgb(255 255 255 / 30%) 0%,
          rgb(255 255 255 / 60%) 100%
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
      padding: 4px;
      background: #fff;
      border: 4px solid #fff;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgb(0 0 0 / 10%);

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
    padding: 52px 24px 24px; // 顶部留出头像空间（88px/2 = 44px + 8px 间距）
  }

  // 用户信息区（类似用户名 + 职位）
  .user-info-section {
    padding: 16px;
    background: rgb(255 255 255 / 5%);
    border: 1px solid rgb(255 255 255 / 12%);
    border-radius: 16px;
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 58%),
      0 4px 12px rgb(0 0 0 / 7%);

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
        letter-spacing: 0.3px;
      }

      .role-badge {
        flex-shrink: 0;
        padding: 5px 12px;
        font-size: 12px;
        font-weight: 500;
        color: #93c5fd;
        background: rgb(59 130 246 / 15%);
        border: 1px solid rgb(59 130 246 / 30%);
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
    padding: 18px 16px;
    background: rgb(255 255 255 / 5%);
    border: 1px solid rgb(255 255 255 / 12%);
    border-radius: 16px;
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 58%),
      0 4px 12px rgb(0 0 0 / 7%);

    .stat-item {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 6px;
      align-items: center;
      text-align: center;

      .stat-value {
        font-size: 10px;
        font-weight: 400;
        color: $text-secondary;
        letter-spacing: 0.3px;
      }

      .stat-label {
        font-size: 10px;
        font-weight: 600;
        color: $text-primary;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: linear-gradient(to bottom, transparent, rgb(255 255 255 / 15%), transparent);
    }
  }

  // 联系信息区
  .contact-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    background: rgb(255 255 255 / 5%);
    border: 1px solid rgb(255 255 255 / 12%);
    border-radius: 16px;
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 58%),
      0 4px 12px rgb(0 0 0 / 7%);

    // 标签区域
    .contact-label-wrapper {
      display: flex;
      align-items: center;

      .contact-label {
        font-size: 12px;
        font-weight: 600;
        color: $text-primary;
        text-transform: uppercase;
        letter-spacing: 0.8px;
      }
    }

    // 内容区域（左侧信息 + 右侧二维码）
    .contact-content {
      display: flex;
      gap: 16px;
      align-items: stretch; // 让左右两侧高度一致

      // 左侧联系信息
      .contact-info {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 8px;
        justify-content: space-around;

        .contact-item {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 12px;
          font-weight: 400;
          color: $text-secondary;
          letter-spacing: 0.2px;

          .contact-icon {
            font-size: 16px;
            color: $primary-color;
          }
        }
      }

      // 右侧二维码
      .qr-code-wrapper {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
        justify-content: center; // 垂直居中

        .qr-code-image {
          width: 80px;
          height: 80px;
          border: 2px solid rgb(255 255 255);
          border-radius: 8px;
          box-shadow: 0 2px 8px rgb(0 0 0 / 30%);
        }

        .qr-code-label {
          font-size: 11px;
          font-weight: 400;
          color: $text-muted;
          letter-spacing: 0.5px;
        }
      }
    }
  }
</style>
