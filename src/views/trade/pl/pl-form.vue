<!-- PL 表单页面 -->
<template>
  <div class="pl-form-page art-full-height">
    <ElCard class="art-card">
      <template #header>
        <ElSpace>
          <ElButton @click="$router.back()">返回</ElButton>
          <span class="text-lg font-medium">{{ isEdit ? '编辑 PL' : '新增 PL' }}</span>
        </ElSpace>
      </template>

      <ElForm
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="left"
      >
        <ElDivider content-position="left">基本信息</ElDivider>

        <ElRow :gutter="24">
          <ElCol :span="12">
            <ElFormItem label="PL 编号" prop="plNo">
              <ElInput v-model="formData.plNo" placeholder="请输入 PL 编号"></ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="PL 日期" prop="plDate">
              <ElDatePicker
                v-model="formData.plDate"
                type="date"
                placeholder="请选择日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              ></ElDatePicker>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="24">
          <ElCol :span="12">
            <ElFormItem label="关联 PI 发票号" prop="invoiceNo">
              <ElInput v-model="formData.invoiceNo" placeholder="请输入关联 PI 发票号"></ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="客户名称" prop="customerName">
              <ElInput v-model="formData.customerName" placeholder="请输入客户名称"></ElInput>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElFormItem label="收货人" prop="consignee">
          <ElInput v-model="formData.consignee" placeholder="请输入收货人"></ElInput>
        </ElFormItem>

        <ElDivider content-position="left">包装信息</ElDivider>

        <ElRow :gutter="24">
          <ElCol :span="12">
            <ElFormItem label="总数量" prop="totalQuantity">
              <ElInputNumber v-model="formData.totalQuantity" :min="0" style="width: 100%" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="总箱数" prop="totalCartons">
              <ElInputNumber v-model="formData.totalCartons" :min="0" style="width: 100%" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="24">
          <ElCol :span="12">
            <ElFormItem label="总净重 (kg)" prop="totalNW">
              <ElInputNumber
                v-model="formData.totalNW"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="总毛重 (kg)" prop="totalGW">
              <ElInputNumber
                v-model="formData.totalGW"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="24">
          <ElCol :span="12">
            <ElFormItem label="总体积 (CBM)" prop="totalCBM">
              <ElInputNumber
                v-model="formData.totalCBM"
                :min="0"
                :precision="3"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="状态" prop="status">
              <ElSelect v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                <ElOption label="待发货" value="待发货"></ElOption>
                <ElOption label="部分发货" value="部分发货"></ElOption>
                <ElOption label="已发货" value="已发货"></ElOption>
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElFormItem>
          <ElSpace>
            <ElButton type="primary" :loading="loading" @click="handleSubmit">保存</ElButton>
            <ElButton @click="$router.back()">取消</ElButton>
          </ElSpace>
        </ElFormItem>
      </ElForm>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { fetchGetPLDetail } from '@/api/trade-manage'

  defineOptions({ name: 'PLForm' })

  const route = useRoute()
  const router = useRouter()

  const isEdit = computed(() => !!route.params.id)

  const formRef = ref<FormInstance>()
  const loading = ref(false)

  const formData = ref<Partial<Api.Trade.PLListItem>>({
    plNo: '',
    invoiceNo: '',
    plDate: new Date().toISOString().slice(0, 10),
    customerName: '',
    consignee: '',
    totalQuantity: 0,
    totalCartons: 0,
    totalNW: 0,
    totalGW: 0,
    totalCBM: 0,
    status: '待发货'
  })

  const formRules: FormRules = {
    plNo: [{ required: true, message: '请输入 PL 编号', trigger: 'blur' }],
    invoiceNo: [{ required: true, message: '请输入关联 PI 发票号', trigger: 'blur' }],
    plDate: [{ required: true, message: '请选择 PL 日期', trigger: 'change' }],
    customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }]
  }

  const loadPLData = async () => {
    if (!isEdit.value) return

    const id = route.params.id as string
    try {
      const res = await fetchGetPLDetail(id)
      formData.value = { ...res.data }
    } catch {
      ElMessage.error('加载 PL 数据失败')
    }
  }

  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (!valid) return

      loading.value = true
      try {
        ElMessage.success('保存成功')
        router.back()
      } catch {
        ElMessage.error('保存失败')
      } finally {
        loading.value = false
      }
    })
  }

  onMounted(() => {
    loadPLData()
  })
</script>
