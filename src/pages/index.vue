<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { request } from '@/utils/request'

onLoad(async () => {
  const token = uni.getStorageSync('token')
  if (token) {
    try {
      const res = await request({
        url: '/api/user',
        method: 'GET',
        header: { Authorization: token }
      })
      const roles = res.data.roles || []
      if (roles.includes('user')) {
        uni.switchTab({ url: '/pages/client/c-home' })
      } else if (roles.includes('merchant')) {
        uni.reLaunch({ url: '/pages/merchant/m-services' })
      } else {
        uni.removeStorageSync('token')
        uni.redirectTo({ url: '/pages/login' })
      }
    } catch (e) {
      uni.removeStorageSync('token')
      uni.redirectTo({ url: '/pages/login' })
    }
  } else {
    uni.redirectTo({ url: '/pages/login' })
  }
})
</script>

<template>
  <view></view>
</template>
