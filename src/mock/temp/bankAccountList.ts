/**
 * 银行账户 Mock 数据逻辑
 */

import bankAccountListData from '../data/bank_account_list.json'

/**
 * 获取银行账户列表
 * @param params 搜索参数
 */
export function getBankAccountListData(params: Api.Trade.BankAccountSearchParams) {
  const { current = 1, size = 10, bankName, accountName, status } = params

  let list = [...bankAccountListData]

  // 筛选条件
  if (bankName) {
    list = list.filter((item) => item.bankName.includes(bankName))
  }
  if (accountName) {
    list = list.filter((item) => item.accountName.includes(accountName))
  }
  if (status) {
    list = list.filter((item) => item.status === status)
  }

  const total = list.length

  // 分页
  const startIndex = (current - 1) * size
  const endIndex = startIndex + size
  list = list.slice(startIndex, endIndex)

  return {
    records: list,
    current,
    size,
    total
  }
}

/**
 * 获取银行账户详情
 * @param id 账户 ID
 */
export function getBankAccountDetailById(id: string) {
  return bankAccountListData.find((item) => item.id === id)
}

/**
 * 创建银行账户
 * @param data 账户信息
 */
export function createBankAccountData(data: Api.Trade.BankAccount) {
  const newAccount = {
    ...data,
    id: String(Date.now()),
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
  bankAccountListData.push(newAccount)
  return newAccount
}

/**
 * 更新银行账户
 * @param data 账户信息
 */
export function updateBankAccountData(data: Partial<Api.Trade.BankAccount>) {
  const index = bankAccountListData.findIndex((item) => item.id === data.id)
  if (index === -1) {
    return null
  }
  bankAccountListData[index] = {
    ...bankAccountListData[index],
    ...data,
    updateTime: new Date().toISOString()
  }
  return bankAccountListData[index]
}

/**
 * 删除银行账户
 * @param id 账户 ID
 */
export function deleteBankAccountData(id: string) {
  const index = bankAccountListData.findIndex((item) => item.id === id)
  if (index === -1) {
    return false
  }
  bankAccountListData.splice(index, 1)
  return true
}
