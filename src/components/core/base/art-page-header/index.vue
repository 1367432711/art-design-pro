<!-- 页面头部组件 -->
<template>
  <div class="art-page-header" :class="customClass">
    <!-- 左侧：返回按钮 + 标题 + 状态标签 -->
    <div class="art-page-header-left">
      <ElButton v-if="showBack" type="text" @click="handleBack" class="back-btn">
        <Icon icon="ri:arrow-left-line" class="mr-1" />
        {{ backText }}
      </ElButton>
      <div v-if="showBack || showDivider" class="title-divider"></div>
      <h2 class="page-title">{{ title }}</h2>
      <ElTag v-if="statusText" :type="statusType" effect="dark" :size="tagSize">
        {{ statusText }}
      </ElTag>
      <slot name="left"></slot>
    </div>

    <!-- 右侧：操作按钮组 -->
    <div class="art-page-header-right">
      <!-- 默认插槽：直接渲染按钮组 -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'

  defineOptions({ name: 'ArtPageHeader' })

  defineProps({
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 是否显示返回按钮
    showBack: {
      type: Boolean,
      default: true
    },
    // 返回按钮文字
    backText: {
      type: String,
      default: '返回'
    },
    // 是否显示分隔线
    showDivider: {
      type: Boolean,
      default: true
    },
    // 状态标签文字
    statusText: {
      type: String,
      default: ''
    },
    // 状态标签类型
    statusType: {
      type: String as () => 'primary' | 'success' | 'warning' | 'info' | 'danger',
      default: 'primary'
    },
    // 标签尺寸
    tagSize: {
      type: String as () => 'small' | 'default' | 'large',
      default: 'large'
    },
    // 自定义类名
    customClass: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['back'])

  const handleBack = () => {
    // 如果有监听 back 事件，触发事件
    emit('back')
  }
</script>

<style lang="scss" scoped>
  .art-page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    margin-bottom: 16px;
    background: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: 0 2px 12px rgb(0 0 0 / 5%);
    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 4px 16px rgb(0 0 0 / 8%);
    }

    .art-page-header-left {
      display: flex;
      gap: 12px;
      align-items: center;

      .back-btn {
        font-size: 14px;
        color: var(--el-text-color-regular);
        transition: all 0.2s;

        &:hover {
          color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
        }
      }

      .title-divider {
        width: 2px;
        height: 20px;
        background: var(--el-border-color);
        border-radius: 1px;
      }

      .page-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        background: linear-gradient(
          135deg,
          var(--el-text-color-primary) 0%,
          var(--el-color-primary) 100%
        );
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .art-page-header-right {
      display: flex;
      gap: 16px;
      align-items: center;

      .action-group {
        display: flex;
        gap: 8px;
        align-items: center;

        &.danger-group {
          padding-left: 16px;
          margin-left: 8px;
          border-left: 2px solid var(--el-border-color);
          transition: border-left-color 0.3s ease;

          &:hover {
            border-left-color: var(--el-color-danger);
          }
        }

        .view-pi-btn {
          color: var(--el-text-color-regular);
          background: var(--el-fill-color);
          transition: all 0.2s;

          &:hover {
            color: var(--el-color-primary);
            background: var(--el-color-primary-light-9);
            box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
            transform: translateY(-1px);
          }
        }
      }
    }
  }
</style>
