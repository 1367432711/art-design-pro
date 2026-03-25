<!-- 产品新增/编辑页面 -->
<template>
  <div class="product-form-page">
    <!-- 页头 -->
    <ElPageHeader class="mb-3" @back="handleBack">
      <template #title>
        <span class="text-lg font-semibold">{{ isEdit ? '编辑产品' : '新增产品' }}</span>
      </template>
    </ElPageHeader>

    <ElCard class="art-card">
      <ElForm ref="formRef" :model="formData" :rules="rules" label-width="140px">
        <!-- 产品图片 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium text-gray-500">产品图片 / Product Images</span>
        </ElDivider>

        <ElFormItem label="产品主图" prop="mainImage">
          <div class="image-upload-area">
            <ElUpload
              v-model:file-list="imageFileList"
              :action="uploadUrl"
              :limit="1"
              :show-file-list="true"
              :on-success="handleMainImageSuccess"
              :before-upload="beforeImageUpload"
              list-type="picture-card"
              accept="image/*"
            >
              <ElIcon class="avatar-uploader-icon">
                <Icon icon="ri:upload-line" />
              </ElIcon>
            </ElUpload>
            <div class="image-upload-tip">
              <span>请上传产品主图，支持 JPG/PNG 格式，大小不超过 2MB</span>
            </div>
          </div>
        </ElFormItem>

        <ElRow :gutter="20">
          <!-- 左侧：产品信息 -->
          <ElCol :span="12">
            <ElDivider content-position="left">
              <span class="text-sm font-medium text-gray-500">基本信息</span>
            </ElDivider>

            <ElFormItem label="产品名称" prop="name">
              <ElInput v-model="formData.name" placeholder="请输入产品名称" style="width: 260px" />
            </ElFormItem>

            <ElFormItem label="产品类型" prop="type">
              <ElRadioGroup v-model="formData.type">
                <ElRadio label="切割片">切割片</ElRadio>
                <ElRadio label="百叶片">百叶片</ElRadio>
                <ElRadio label="磨光片">磨光片</ElRadio>
                <ElRadio label="其他">其他</ElRadio>
              </ElRadioGroup>
            </ElFormItem>

            <ElFormItem label="产品等级" prop="grade">
              <ElRadioGroup v-model="formData.grade">
                <ElRadio label="A 级">A 级</ElRadio>
                <ElRadio label="B 级">B 级</ElRadio>
                <ElRadio label="C 级">C 级</ElRadio>
              </ElRadioGroup>
            </ElFormItem>

            <ElFormItem label="规格型号" prop="spec">
              <ElInput v-model="formData.spec" placeholder="如：180×22×2mm" style="width: 260px" />
            </ElFormItem>

            <ElFormItem label="材质" prop="material">
              <ElInput
                v-model="formData.material"
                placeholder="如：树脂/陶瓷/刚玉"
                style="width: 260px"
              />
            </ElFormItem>

            <ElFormItem label="单位" prop="unit">
              <ElSelect v-model="formData.unit" placeholder="请选择单位" style="width: 260px">
                <ElOption label="片" value="片" />
                <ElOption label="个" value="个" />
                <ElOption label="套" value="套" />
                <ElOption label="箱" value="箱" />
              </ElSelect>
            </ElFormItem>
          </ElCol>

          <!-- 右侧：商务信息 -->
          <ElCol :span="12">
            <ElDivider content-position="left">
              <span class="text-sm font-medium text-gray-500">商务信息</span>
            </ElDivider>

            <ElFormItem label="成本价" prop="costPrice">
              <ElInputNumber
                v-model="formData.costPrice"
                :min="0"
                :precision="2"
                placeholder="0"
                controls-position="right"
                style="width: 200px"
              >
                <template #prefix>
                  <span class="text-gray-400">$</span>
                </template>
              </ElInputNumber>
            </ElFormItem>

            <ElFormItem label="销售价" prop="salePrice">
              <ElInputNumber
                v-model="formData.salePrice"
                :min="0"
                :precision="2"
                placeholder="0"
                controls-position="right"
                style="width: 200px"
              >
                <template #prefix>
                  <span class="text-gray-400">$</span>
                </template>
              </ElInputNumber>
            </ElFormItem>

            <ElFormItem label="货币类型" prop="currency">
              <ElSelect v-model="formData.currency" placeholder="请选择" style="width: 200px">
                <ElOption label="USD" value="USD" />
                <ElOption label="EUR" value="EUR" />
                <ElOption label="CNY" value="CNY" />
                <ElOption label="GBP" value="GBP" />
              </ElSelect>
            </ElFormItem>

            <ElFormItem label="最小起订量" prop="moq">
              <ElInputNumber
                v-model="formData.moq"
                :min="1"
                placeholder="1"
                controls-position="right"
                style="width: 200px"
              >
                <template #suffix>
                  <span class="text-gray-400">片</span>
                </template>
              </ElInputNumber>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 包装信息 -->
        <ElDivider content-position="left">
          <span class="text-sm font-medium text-gray-500">包装信息 / Packaging Information</span>
        </ElDivider>

        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="单片重量" prop="singleWeight">
              <ElInput
                v-model="formData.singleWeight"
                placeholder="如：0.05kg"
                style="width: 180px"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="吸塑数量" prop="blisterQuantity">
              <ElInputNumber
                v-model="formData.blisterQuantity"
                :min="1"
                placeholder="1"
                controls-position="right"
                style="width: 180px"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="内盒数量" prop="innerBoxQuantity">
              <ElInputNumber
                v-model="formData.innerBoxQuantity"
                :min="1"
                placeholder="1"
                controls-position="right"
                style="width: 180px"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="每箱数量" prop="cartonQuantity">
              <ElInputNumber
                v-model="formData.cartonQuantity"
                :min="1"
                placeholder="1"
                controls-position="right"
                style="width: 180px"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="外箱尺寸" prop="cartonSize">
              <ElInput
                v-model="formData.cartonSize"
                placeholder="如：50×40×30cm"
                style="width: 180px"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="每箱毛重" prop="grossWeight">
              <ElInputNumber
                v-model="formData.grossWeight"
                :min="0"
                :precision="2"
                placeholder="0"
                controls-position="right"
                style="width: 180px"
              >
                <template #suffix>
                  <span class="text-gray-400">kg</span>
                </template>
              </ElInputNumber>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="每箱净重" prop="netWeight">
              <ElInputNumber
                v-model="formData.netWeight"
                :min="0"
                :precision="2"
                placeholder="0"
                controls-position="right"
                style="width: 180px"
              >
                <template #suffix>
                  <span class="text-gray-400">kg</span>
                </template>
              </ElInputNumber>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 提交按钮 -->
        <ElFormItem class="mt-6">
          <ElSpace>
            <ElButton @click="handleBack">取消</ElButton>
            <ElButton type="primary" :loading="submitLoading" @click="handleSubmit">保存</ElButton>
          </ElSpace>
        </ElFormItem>
      </ElForm>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules, UploadUserFile } from 'element-plus'
  import { ElMessage, ElPageHeader } from 'element-plus'
  import { Icon } from '@iconify/vue'
  import { useRouter, useRoute } from 'vue-router'
  import { fetchGetProductDetail, fetchCreateProduct, fetchUpdateProduct } from '@/api/trade-manage'

  defineOptions({ name: 'ProductForm' })

  const router = useRouter()
  const route = useRoute()

  // 上传地址（使用 picsum 随机图片服务作为 mock）
  const uploadUrl = 'https://picsum.photos/400/400'

  // 是否编辑模式
  const isEdit = computed(() => !!route.params.id)

  // 表单实例
  const formRef = ref<FormInstance>()

  // 图片文件列表
  const imageFileList = ref<UploadUserFile[]>([])

  // 提交状态
  const submitLoading = ref(false)

  // 表单数据
  const formData = reactive({
    name: '',
    type: '切割片',
    grade: 'A 级',
    spec: '',
    material: '',
    unit: '片',
    costPrice: undefined as number | undefined,
    salePrice: undefined as number | undefined,
    currency: 'USD',
    moq: 1,
    mainImage: '',
    imageCount: 0,
    // 包装信息
    singleWeight: '',
    blisterQuantity: undefined as number | undefined,
    innerBoxQuantity: undefined as number | undefined,
    cartonQuantity: undefined as number | undefined,
    cartonSize: '',
    grossWeight: undefined as number | undefined,
    netWeight: undefined as number | undefined
  })

  // 表单验证规则
  const rules: FormRules = {
    name: [
      { required: true, message: '请输入产品名称', trigger: 'blur' },
      { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
    ],
    type: [{ required: true, message: '请选择产品类型', trigger: 'change' }],
    grade: [{ required: true, message: '请选择产品等级', trigger: 'change' }],
    spec: [{ required: true, message: '请输入规格型号', trigger: 'blur' }],
    salePrice: [{ required: true, message: '请输入销售价', trigger: 'blur' }],
    mainImage: [{ required: true, message: '请上传产品主图', trigger: 'change' }]
  }

  /**
   * 加载产品数据（编辑模式）
   */
  const loadProductData = async () => {
    if (!isEdit.value) return

    try {
      const res = await fetchGetProductDetail(route.params.id as string)
      const data = res.data as Api.Trade.ProductListItem
      Object.assign(formData, {
        name: data.name || '',
        type: data.type || '切割片',
        grade: data.grade || 'A 级',
        spec: data.spec || '',
        material: data.material || '',
        unit: data.unit || '片',
        costPrice: data.costPrice,
        salePrice: data.salePrice,
        currency: data.currency || 'USD',
        moq: data.moq || 1,
        mainImage: data.mainImage || '',
        imageCount: data.imageCount || 0,
        singleWeight: data.singleWeight || '',
        blisterQuantity: data.blisterQuantity,
        innerBoxQuantity: data.innerBoxQuantity,
        cartonQuantity: data.cartonQuantity,
        cartonSize: data.cartonSize || '',
        grossWeight: data.grossWeight,
        netWeight: data.netWeight
      })

      // 初始化图片列表
      if (data.mainImage) {
        imageFileList.value = [
          {
            uid: Date.now().toString(),
            name: 'main-image.jpg',
            url: data.mainImage
          }
        ]
      }
    } catch (error) {
      console.error('加载产品数据失败:', error)
      ElMessage.error('加载产品数据失败')
    }
  }

  /**
   * 返回产品列表
   */
  const handleBack = () => {
    router.push('/trade/product')
  }

  /**
   * 上传前验证
   */
  const beforeImageUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isImage) {
      ElMessage.error('只能上传图片文件')
      return false
    }
    if (!isLt2M) {
      ElMessage.error('图片大小不能超过 2MB')
      return false
    }
    return true
  }

  /**
   * 主图上传成功（模拟）
   */
  const handleMainImageSuccess = () => {
    // 模拟上传成功，使用随机图片 URL
    const randomId = Math.floor(Math.random() * 1000)
    formData.mainImage = `https://picsum.photos/400/400?random=${randomId}`
    formData.imageCount = 1
    ElMessage.success('上传成功')
  }

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (!valid) return

      submitLoading.value = true
      try {
        if (isEdit.value) {
          await fetchUpdateProduct({ ...formData, id: route.params.id as string })
          ElMessage.success('更新成功')
        } else {
          await fetchCreateProduct(formData)
          ElMessage.success('添加成功')
        }
        handleBack()
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      } finally {
        submitLoading.value = false
      }
    })
  }

  onMounted(() => {
    loadProductData()
  })
</script>

<style lang="scss" scoped>
  .product-form-page {
    padding-bottom: 20px;

    .image-upload-area {
      display: flex;
      flex-direction: column;
      gap: 12px;

      :deep(.el-upload-list) {
        display: flex;
        gap: 12px;
      }

      :deep(.el-upload--picture-card) {
        width: 100px;
        height: 100px;
      }

      :deep(.el-upload-list__item) {
        width: 100px;
        height: 100px;
      }

      .avatar-uploader-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: 20px;
        color: var(--el-text-color-secondary);
      }

      .image-upload-tip {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
</style>
