<!-- 银行账户管理页面 -->
<template>
  <div class="bank-account-page art-full-height">
    <!-- 搜索栏 -->
    <BankAccountSearch
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></BankAccountSearch>

    <ElCard class="art-table-card">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple>新增银行账户</ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>

      <!-- 银行账户弹窗 -->
      <BankAccountDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :bank-account-data="currentBankAccountData || {}"
        @submit="handleDialogSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import { fetchGetBankAccountList, fetchDeleteBankAccount } from '@/api/trade-manage'
  import BankAccountSearch from './modules/bank-account-search.vue'
  import BankAccountDialog from './modules/bank-account-dialog.vue'
  import { ElTag, ElMessageBox, ElMessage } from 'element-plus'
  import { DialogType } from '@/types'

  defineOptions({ name: 'BankAccount' })

  type BankAccountListItem = Api.Trade.BankAccount

  // 弹窗相关
  const dialogType = ref<DialogType>('add')
  const dialogVisible = ref(false)

  // 选中行
  const selectedRows = ref<BankAccountListItem[]>([])

  // 当前查看的银行账户详情
  const currentBankAccountData = ref<Partial<BankAccountListItem> | null>(null)

  // 搜索表单
  const searchForm = ref<Api.Trade.BankAccountSearchParams>({
    current: 1,
    size: 20,
    bankName: undefined,
    accountName: undefined,
    status: undefined
  })

  // 银行账户状态配置
  const BANK_ACCOUNT_STATUS_CONFIG = {
    active: { type: 'success' as const, text: '启用' },
    inactive: { type: 'info' as const, text: '禁用' }
  } as const

  /**
   * 获取银行账户状态配置
   */
  const getBankAccountStatusConfig = (status: string) => {
    return (
      BANK_ACCOUNT_STATUS_CONFIG[status as keyof typeof BANK_ACCOUNT_STATUS_CONFIG] || {
        type: 'info' as const,
        text: '未知'
      }
    )
  }

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    getData,
    replaceSearchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData,
    refreshCreate,
    refreshRemove
  } = useTable({
    // 核心配置
    core: {
      apiFn: fetchGetBankAccountList,
      apiParams: {
        ...searchForm.value,
        current: 1,
        size: 20
      },
      columnsFactory: () => {
        return [
          { type: 'selection' }, // 勾选列
          { type: 'index', width: 60, label: '序号' }, // 序号
          {
            prop: 'bankName',
            label: '银行名称',
            width: 180,
            formatter: (row: BankAccountListItem) => {
              return h('div', { class: 'font-medium' }, row.bankName)
            }
          },
          {
            prop: 'accountName',
            label: '账户名称',
            width: 150,
            formatter: (row: BankAccountListItem) =>
              h('span', { class: 'text-g-600' }, row.accountName)
          },
          {
            prop: 'accountNumberUSD',
            label: '美元账号',
            width: 160,
            formatter: (row: BankAccountListItem) =>
              h('span', { class: 'text-g-600 font-mono' }, row.accountNumberUSD)
          },
          {
            prop: 'accountNumberRMB',
            label: '人民币账号',
            width: 160,
            formatter: (row: BankAccountListItem) =>
              h('span', { class: 'text-g-600 font-mono' }, row.accountNumberRMB)
          },
          {
            prop: 'swiftCode',
            label: 'SWIFT 代码',
            width: 120,
            formatter: (row: BankAccountListItem) =>
              h('span', { class: 'text-g-600 font-mono' }, row.swiftCode)
          },
          { prop: 'bankCountry', label: '银行国家', width: 120 },
          {
            prop: 'status',
            label: '状态',
            width: 100,
            formatter: (row: BankAccountListItem) => {
              const statusConfig = getBankAccountStatusConfig(row.status)
              return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
            }
          },
          {
            prop: 'isDefault',
            label: '默认账户',
            width: 100,
            align: 'center',
            formatter: (row: BankAccountListItem) => {
              return h(ElTag, { type: row.isDefault ? 'primary' : 'info' }, () =>
                row.isDefault ? '是' : '否'
              )
            }
          },
          {
            prop: 'createTime',
            label: '创建日期',
            width: 160,
            sortable: true
          },
          {
            prop: 'operation',
            label: '操作',
            width: 150,
            fixed: 'right', // 固定列
            formatter: (row: BankAccountListItem) =>
              h('div', [
                h(ArtButtonTable, {
                  type: 'edit',
                  onClick: () => showDialog('edit', row)
                }),
                h(ArtButtonTable, {
                  type: 'delete',
                  onClick: () => deleteBankAccount(row)
                })
              ])
          }
        ]
      }
    }
  })

  /**
   * 搜索处理
   */
  const handleSearch = (params: Api.Trade.BankAccountSearchParams) => {
    replaceSearchParams(params)
    getData()
  }

  /**
   * 显示银行账户弹窗
   */
  const showDialog = (type: DialogType, row?: BankAccountListItem): void => {
    dialogType.value = type
    currentBankAccountData.value = row || {}
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  /**
   * 删除银行账户
   */
  const deleteBankAccount = (row: BankAccountListItem): void => {
    ElMessageBox.confirm(`确定要删除该银行账户吗？`, '删除银行账户', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(async () => {
      try {
        await fetchDeleteBankAccount(row.id)
        ElMessage.success('删除成功')
        refreshRemove()
      } catch {
        ElMessage.error('删除失败')
      }
    })
  }

  /**
   * 处理弹窗提交事件
   */
  const handleDialogSubmit = async () => {
    dialogVisible.value = false
    currentBankAccountData.value = {}
    refreshCreate()
  }

  /**
   * 处理表格行选择变化
   */
  const handleSelectionChange = (selection: BankAccountListItem[]): void => {
    selectedRows.value = selection
  }
</script>
