// 产品分享功能 Hook
import { ElMessage } from 'element-plus'

export interface ShareCardElement {
  shareCardRef?: HTMLElement
}

export function useProductShare() {
  const shareDialogVisible = ref(false)

  /**
   * 生成产品卡片图片
   */
  const generateCardImage = async (
    cardRef: HTMLElement | undefined
  ): Promise<HTMLCanvasElement | null> => {
    if (!cardRef) return null

    try {
      const html2canvas = (await import('html2canvas')).default
      return await html2canvas(cardRef, {
        useCORS: true,
        backgroundColor: '#fff',
        scale: 2,
        logging: false,
        imageTimeout: 0
      })
    } catch (error) {
      console.error('生成图片失败:', error)
      return null
    }
  }

  /**
   * 下载产品卡片图片
   */
  const downloadCard = async (
    cardRef: HTMLElement | undefined,
    productName: string = '产品'
  ): Promise<boolean> => {
    const canvas = await generateCardImage(cardRef)
    if (!canvas) {
      ElMessage.error('生成图片失败，请重试')
      return false
    }

    try {
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            ElMessage.error('图片转换失败')
            resolve(false)
            return
          }

          const link = document.createElement('a')
          link.download = `产品卡片-${productName}.png`
          link.href = URL.createObjectURL(blob)
          link.click()
          URL.revokeObjectURL(link.href)
          ElMessage.success('下载成功')
          resolve(true)
        })
      })
    } catch (error) {
      console.error('下载失败:', error)
      ElMessage.error('下载失败，请重试')
      return false
    }
  }

  /**
   * 复制产品卡片到剪贴板
   */
  const copyCard = async (
    cardRef: HTMLElement | undefined,
    productName: string = '产品'
  ): Promise<boolean> => {
    const canvas = await generateCardImage(cardRef)
    if (!canvas) {
      ElMessage.error('生成图片失败，请重试')
      return false
    }

    try {
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            ElMessage.error('图片转换失败')
            resolve(false)
            return
          }

          try {
            // 尝试使用 Clipboard API
            const item = new ClipboardItem({ 'image/png': blob })
            await navigator.clipboard.write([item])
            ElMessage.success('已复制到剪贴板')
            resolve(true)
          } catch {
            // 降级方案：下载图片
            ElMessage.warning('浏览器不支持直接复制，已改为下载图片')
            const link = document.createElement('a')
            link.download = `产品卡片-${productName}.png`
            link.href = URL.createObjectURL(blob)
            link.click()
            URL.revokeObjectURL(link.href)
            resolve(true)
          }
        })
      })
    } catch (error) {
      console.error('复制失败:', error)
      ElMessage.error('复制失败，请重试')
      return false
    }
  }

  /**
   * 打开分享弹窗
   */
  const openShareDialog = () => {
    shareDialogVisible.value = true
  }

  /**
   * 关闭分享弹窗
   */
  const closeShareDialog = () => {
    shareDialogVisible.value = false
  }

  return {
    shareDialogVisible,
    downloadCard,
    copyCard,
    openShareDialog,
    closeShareDialog
  }
}
