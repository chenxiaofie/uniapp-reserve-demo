<script setup lang="ts">
import { ref } from 'vue'

const phone = ref('')
const code = ref('')
function getCode() {
  uni.showToast({ title: '验证码已发送(模拟)', icon: 'none' })
}
function login() {
  uni.showToast({ title: '商家登录成功(模拟)', icon: 'success' })
  setTimeout(() => {
    uni.redirectTo({ url: '/pages/merchant/m-services' })
  }, 500)
}
</script>

<template>
  <view class="m-login-page">
    <view class="title">
      商家登录
    </view>
    <input v-model="phone" placeholder="商家手机号">
    <view style="display:flex;gap:8px;">
      <input v-model="code" placeholder="验证码" style="flex:1;">
      <button @click="getCode">
        获取验证码
      </button>
    </view>
    <button style="width:100%;margin-top:20px;" @click="login">
      登录
    </button>
    <view style="margin:20px 0;text-align:center;">
      <button class="apply-btn">
        申请成为商家
      </button>
    </view>
  </view>
</template>

<style scoped>
.m-login-page { padding: 40px 20px; }
.title { font-size: 20px; font-weight: bold; margin-bottom: 20px; }
input { width: 100%; padding: 8px; margin: 8px 0; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
.apply-btn { background: #27ae60; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; }
</style>
