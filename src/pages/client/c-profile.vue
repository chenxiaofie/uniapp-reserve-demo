<script setup lang="ts">
import { switchRole } from '@/utils/switchRole'
function goOrders() {
  uni.switchTab({ url: '/pages/client/c-orders' })
}
function goFavorite() {
  uni.switchTab({ url: '/pages/client/c-favorite' })
}
function logout() {
  uni.showToast({ title: '已退出登录', icon: 'success' })
  setTimeout(() => {
    uni.redirectTo({ url: '/pages/login' })
  }, 500)
}
</script>

<template>
  <view class="profile-page">
  
    <view style="text-align:center;margin:20px 0;">
      <view style="width:60px;height:60px;background:#3498db;border-radius:50%;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;color:white;font-size:24px;">
        👤
      </view>
      <strong>张三</strong>
      <view style="color:#666;margin:5px 0;">
        138****8888
      </view>
    </view>
    <view class="feature-list">
      <view class="feature-item" @click="goOrders">
        📱 我的订单
      </view>
      <view class="feature-item" @click="goFavorite">
        ❤️ 我的收藏
      </view>
      <view class="feature-item" @click="logout">
        🚪 退出登录
      </view>
    </view>
    <button class="switch-btn" @click="switchRole('user')">切换到商家端</button>
  </view>
</template>

<style scoped>
.profile-page { padding: 20px; }
.title { font-size: 20px; font-weight: bold; margin-bottom: 16px; }
.feature-list { margin-top: 20px; }
.feature-item { background: #f8f9fa; padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 15px; }
.switch-role-btn {
  width: 80%;
  margin: 40rpx auto 0;
  display: block;
  background: #f5f5f5;
  color: #007aff;
  border: 1rpx solid #007aff;
  border-radius: 12rpx;
  font-size: 30rpx;
  padding: 20rpx 0;
}
.switch-btn {
  background: #f39c12;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  height: 40px;
  padding: 0 18px;
  margin: 20px 0;
  font-weight: 600;
  letter-spacing: 1px;
}
</style>
