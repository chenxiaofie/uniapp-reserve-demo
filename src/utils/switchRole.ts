import { request } from '@/utils/request'

export async function switchRole(current: 'user' | 'merchant') {
  const token = uni.getStorageSync('token')
  if (!token) {
    uni.reLaunch({ url: '/pages/login' })
    return
  }
  try {
    const res = await request({
      url: '/api/user',
      method: 'GET',
      header: { Authorization: token }
    })
    const roles = res.data.roles || []
    if (roles.includes('user') && roles.includes('merchant')) {
      if (current === 'user') {
        uni.reLaunch({ url: '/pages/merchant/m-services' })
      } else {
        uni.switchTab({ url: '/pages/client/c-home' })
      }
    } else {
      uni.showToast({ title: '当前账号无多端权限', icon: 'none' })
    }
  } catch (e) {
    uni.removeStorageSync('token')
    uni.reLaunch({ url: '/pages/login' })
  }
} 