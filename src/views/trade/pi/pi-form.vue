<!-- PI 表单页面 -->
<template>
  <div class="pi-form-page art-full-height">
    <ElCard class="art-card">
      <template #header>
        <ElSpace>
          <ElButton @click="$router.back()">返回</ElButton>
          <span class="text-lg font-medium">{{ isEdit ? '编辑 PI' : '新增 PI' }}</span>
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
            <ElFormItem label="发票号" prop="invoiceNo">
              <ElInput v-model="formData.invoiceNo" placeholder="请输入发票号"></ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="PI 日期" prop="piDate">
              <ElDatePicker
                v-model="formData.piDate"
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
            <ElFormItem label="客户名称" prop="customerName">
              <ElInput v-model="formData.customerName" placeholder="请输入客户名称"></ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="公司名称" prop="companyName">
              <ElInput v-model="formData.companyName" placeholder="请输入公司名称"></ElInput>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElFormItem label="公司地址" prop="companyAddress">
          <ElInput
            v-model="formData.companyAddress"
            type="textarea"
            :rows="2"
            placeholder="请输入公司地址"
          ></ElInput>
        </ElFormItem>

        <ElRow :gutter="24">
          <ElCol :span="12">
            <ElFormItem label="收货人" prop="consignee">
              <ElInput v-model="formData.consignee" placeholder="请输入收货人"></ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="联系电话" prop="contactPhone">
              <ElInput v-model="formData.contactPhone" placeholder="请输入联系电话"></ElInput>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElDivider content-position="left">贸易信息</ElDivider>

        <ElRow :gutter="24">
          <ElCol :span="12">
            <ElFormItem label="贸易条款" prop="tradeTerms">
              <ElSelect
                v-model="formData.tradeTerms"
                placeholder="请选择贸易条款"
                style="width: 100%"
              >
                <ElOption label="FOB" value="FOB"></ElOption>
                <ElOption label="CIF" value="CIF"></ElOption>
                <ElOption label="EXW" value="EXW"></ElOption>
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="贸易国家" prop="tradeCountry">
              <ElInput v-model="formData.tradeCountry" placeholder="请输入贸易国家"></ElInput>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="24">
          <ElCol :span="12">
            <ElFormItem label="装运港" prop="portOfLoading">
              <ElInput v-model="formData.portOfLoading" placeholder="请输入装运港"></ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="目的港" prop="portOfDestination">
              <ElInput v-model="formData.portOfDestination" placeholder="请输入目的港"></ElInput>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="24">
          <ElCol :span="12">
            <ElFormItem label="交货期" prop="deliveryDate">
              <ElDatePicker
                v-model="formData.deliveryDate"
                type="date"
                placeholder="请选择交货期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              ></ElDatePicker>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="状态" prop="status">
              <ElSelect v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                <ElOption label="待付款" value="待付款"></ElOption>
                <ElOption label="部分付款" value="部分付款"></ElOption>
                <ElOption label="已付款" value="已付款"></ElOption>
                <ElOption label="已取消" value="已取消"></ElOption>
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElDivider content-position="left">付款信息</ElDivider>

        <ElRow :gutter="24">
          <ElCol :span="12">
            <ElFormItem label="币种" prop="currency">
              <ElSelect v-model="formData.currency" placeholder="请选择币种" style="width: 100%">
                <ElOption label="USD" value="USD"></ElOption>
                <ElOption label="EUR" value="EUR"></ElOption>
                <ElOption label="RMB" value="RMB"></ElOption>
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="总金额" prop="totalAmount">
              <ElInputNumber
                v-model="formData.totalAmount"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="24">
          <ElCol :span="12">
            <ElFormItem label="定金比例" prop="depositPercent">
              <ElInputNumber
                v-model="formData.depositPercent"
                :min="0"
                :max="100"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="定金金额" prop="depositAmount">
              <ElInputNumber
                v-model="formData.depositAmount"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="24">
          <ElCol :span="12">
            <ElFormItem label="尾款金额" prop="balanceAmount">
              <ElInputNumber
                v-model="formData.balanceAmount"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
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
  import { fetchGetPIDetail } from '@/api/trade-manage'

  defineOptions({ name: 'PIForm' })

  const route = useRoute()
  const router = useRouter()

  const isEdit = computed(() => !!route.params.id)

  const formRef = ref<FormInstance>()
  const loading = ref(false)

  const formData = ref<Partial<Api.Trade.PIListItem>>({
    invoiceNo: '',
    piDate: new Date().toISOString().slice(0, 10),
    customerName: '',
    companyName: '',
    companyAddress: '',
    consignee: '',
    contactPhone: '',
    tradeTerms: 'FOB',
    tradeCountry: '',
    portOfLoading: '',
    portOfDestination: '',
    deliveryDate: '',
    currency: 'USD',
    totalAmount: 0,
    depositPercent: 30,
    depositAmount: 0,
    balanceAmount: 0,
    status: '待付款'
  })

  const formRules: FormRules = {
    invoiceNo: [{ required: true, message: '请输入发票号', trigger: 'blur' }],
    piDate: [{ required: true, message: '请选择 PI 日期', trigger: 'change' }],
    customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
    companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
    tradeTerms: [{ required: true, message: '请选择贸易条款', trigger: 'change' }],
    currency: [{ required: true, message: '请选择币种', trigger: 'change' }]
  }

  const loadPIData = async () => {
    if (!isEdit.value) return

    const id = route.params.id as string
    try {
      const res = await fetchGetPIDetail(id)
      formData.value = { ...res.data }
    } catch {
      ElMessage.error('加载 PI 数据失败')
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
    loadPIData()
  })
</script>
