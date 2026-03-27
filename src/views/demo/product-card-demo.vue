<!-- 高级产品卡片使用示例 -->
<template>
  <div class="product-card-demo">
    <h2 class="demo-title">高级质感产品卡片展示</h2>

    <!-- 浅色主题卡片 -->
    <div class="card-grid">
      <!-- 卡片 1 - 热销产品 -->
      <PremiumProductCard
        id="1"
        theme="light"
        :image="product1.image"
        :name="product1.name"
        badge="热销"
        badge-type="hot"
        :selling-points="product1.sellingPoints"
        :spec="product1.spec"
        :material="product1.material"
        :model="product1.model"
        :price="product1.price"
        :original-price="product1.originalPrice"
        :discount="product1.discount"
        :ship-from="product1.shipFrom"
        :warranty="product1.warranty"
        :stock="product1.stock"
        @favorite="handleFavorite"
        @inquire="handleInquire"
        @detail="handleDetail"
      />

      <!-- 卡片 2 - 新品 -->
      <PremiumProductCard
        id="2"
        theme="light"
        :image="product2.image"
        :name="product2.name"
        badge="新品"
        badge-type="new"
        :is-new="true"
        :selling-points="product2.sellingPoints"
        :spec="product2.spec"
        :material="product2.material"
        :model="product2.model"
        :price="product2.price"
        :ship-from="product2.shipFrom"
        :warranty="product2.warranty"
        :stock="product2.stock"
        @favorite="handleFavorite"
        @inquire="handleInquire"
        @detail="handleDetail"
      />

      <!-- 卡片 3 - 深色主题 -->
      <PremiumProductCard
        id="3"
        theme="dark"
        :image="product3.image"
        :name="product3.name"
        badge="特价"
        badge-type="sale"
        :selling-points="product3.sellingPoints"
        :spec="product3.spec"
        :material="product3.material"
        :model="product3.model"
        :price="product3.price"
        :original-price="product3.originalPrice"
        :discount="product3.discount"
        :ship-from="product3.shipFrom"
        :warranty="product3.warranty"
        :stock="5"
        @favorite="handleFavorite"
        @inquire="handleInquire"
        @detail="handleDetail"
      />

      <!-- 卡片 4 - 深色主题 -->
      <PremiumProductCard
        id="4"
        theme="dark"
        :image="product4.image"
        :name="product4.name"
        :selling-points="product4.sellingPoints"
        :spec="product4.spec"
        :material="product4.material"
        :model="product4.model"
        :price="product4.price"
        :ship-from="product4.shipFrom"
        :warranty="product4.warranty"
        :stock="0"
        @favorite="handleFavorite"
        @inquire="handleInquire"
        @detail="handleDetail"
      />
    </div>

    <!-- 使用说明 -->
    <div class="usage-guide">
      <h3>📋 Props 属性说明</h3>
      <ElTable :data="propsData" border style="margin-top: 12px">
        <ElTableColumn prop="name" label="属性名" width="150" />
        <ElTableColumn prop="type" label="类型" width="180" />
        <ElTableColumn prop="default" label="默认值" width="120" />
        <ElTableColumn prop="desc" label="说明" />
      </ElTable>

      <h3 style="margin-top: 24px">🎯 Events 事件</h3>
      <ElTable :data="eventsData" border style="margin-top: 12px">
        <ElTableColumn prop="name" label="事件名" width="150" />
        <ElTableColumn prop="params" label="参数" width="150" />
        <ElTableColumn prop="desc" label="说明" />
      </ElTable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ElTable, ElTableColumn } from 'element-plus'
  import PremiumProductCard from '@/components/product-card/premium-product-card.vue'

  defineOptions({ name: 'ProductCardDemo' })

  // 示例产品数据
  const product1 = ref({
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
    name: '工业级精密切割片 100mm 金刚石切片 金属不锈钢专用',
    badge: '热销',
    badgeType: 'hot' as const,
    sellingPoints: ['高精度', '长寿命', '耐高温'],
    spec: '100mm x 1.2mm x 16mm',
    material: '金刚石 + 合金钢',
    model: 'KS-100A',
    price: 25.8,
    originalPrice: 35.0,
    discount: 26,
    shipFrom: '上海',
    warranty: '2 年质保',
    stock: 'in_stock' as const
  })

  const product2 = ref({
    image: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=400&h=400&fit=crop',
    name: '百叶片抛光打磨片 100 型角磨机用 氧化锆磨料',
    badge: '新品',
    badgeType: 'new' as const,
    isNew: true,
    sellingPoints: ['锋利', '不掉砂', '抛光效果好'],
    spec: '100mm x 80 目',
    material: '氧化锆',
    model: 'BL-100-80',
    price: 3.5,
    shipFrom: '江苏·苏州',
    warranty: '质量保证',
    stock: 'in_stock' as const
  })

  const product3 = ref({
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&h=400&fit=crop',
    name: '磨光片角磨机抛光片树脂打磨片金属去毛刺',
    badge: '特价',
    badgeType: 'sale' as const,
    sellingPoints: ['去毛刺', '光滑', '耐用'],
    spec: '125mm x 6mm',
    material: '树脂纤维',
    model: 'MG-125',
    price: 8.9,
    originalPrice: 15.0,
    discount: 40,
    shipFrom: '广东·佛山',
    warranty: '1 年质保',
    stock: 'low_stock' as const
  })

  const product4 = ref({
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=400&fit=crop',
    name: '工业级钻头套装 HSS 高速钢麻花钻头 1-13mm 全套',
    sellingPoints: ['高硬度', '耐磨', '套装齐全'],
    spec: '1-13mm (13 支装)',
    material: 'HSS 高速钢',
    model: 'ZT-HSS-13',
    price: 68.0,
    shipFrom: '浙江·温州',
    warranty: '6 个月质保',
    stock: 'out_of_stock' as const
  })

  // Props 说明数据
  const propsData = ref([
    { name: 'image', type: 'string', default: '-', desc: '产品主图 URL' },
    { name: 'name', type: 'string', default: '-', desc: '产品名称' },
    { name: 'badge', type: 'string', default: '-', desc: '角标文字（热销/新品/特价）' },
    { name: 'badgeType', type: 'hot | new | sale | custom', default: 'hot', desc: '角标类型' },
    { name: 'sellingPoints', type: 'string[]', default: '[]', desc: '卖点标签数组' },
    { name: 'spec', type: 'string', default: '-', desc: '规格尺寸' },
    { name: 'material', type: 'string', default: '-', desc: '材质' },
    { name: 'model', type: 'string', default: '-', desc: '型号' },
    { name: 'price', type: 'number', default: '-', desc: '当前价格' },
    { name: 'originalPrice', type: 'number', default: '-', desc: '原价' },
    { name: 'discount', type: 'number', default: '-', desc: '折扣百分比' },
    { name: 'currency', type: 'string', default: 'USD', desc: '货币单位' },
    { name: 'shipFrom', type: 'string', default: '-', desc: '发货地' },
    { name: 'warranty', type: 'string', default: '-', desc: '质保信息' },
    { name: 'stock', type: 'number | string', default: '-', desc: '库存数量或状态' },
    { name: 'theme', type: 'light | dark', default: 'light', desc: '主题风格' },
    { name: 'hoverable', type: 'boolean', default: 'true', desc: '是否启用悬浮动效' }
  ])

  // Events 说明数据
  const eventsData = ref([
    { name: 'favorite', params: '(id: string)', desc: '点击收藏按钮时触发' },
    { name: 'preview', params: '(id: string)', desc: '点击预览按钮时触发' },
    { name: 'compare', params: '(id: string)', desc: '点击对比按钮时触发' },
    { name: 'share', params: '(id: string)', desc: '点击分享按钮时触发' },
    { name: 'inquire', params: '(id: string)', desc: '点击加入询价时触发' },
    { name: 'detail', params: '(id: string)', desc: '点击查看详情时触发' }
  ])

  // 事件处理
  const handleFavorite = (id: string) => {
    console.log('收藏产品:', id)
  }

  const handleInquire = (id: string) => {
    console.log('加入询价:', id)
  }

  const handleDetail = (id: string) => {
    console.log('查看详情:', id)
    // 跳转详情页
    // router.push(`/product/${id}`)
  }
</script>

<style lang="scss" scoped>
  .product-card-demo {
    padding: 24px;

    .demo-title {
      margin-bottom: 32px;
      font-size: 24px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      text-align: center;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      max-width: 1400px;
      padding: 24px;
      margin: 0 auto 48px;
      background: var(--el-bg-color-page);
      border-radius: 16px;
    }

    .usage-guide {
      max-width: 1000px;
      margin: 0 auto;

      h3 {
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
  }
</style>
