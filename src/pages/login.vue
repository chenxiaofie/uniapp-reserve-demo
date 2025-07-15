<script setup lang="ts">
import { ref } from 'vue'
import { request } from '@/utils/request'

const activeTab = ref('user')
const phone = ref('')
const code = ref('')
const merchantPhone = ref('')
const merchantCode = ref('')
const userVerifyCode = ref('')
const merchantVerifyCode = ref('')

async function getCode(type: 'user' | 'merchant') {
  let phoneVal = type === 'user' ? phone.value : merchantPhone.value
  if (!phoneVal) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  const role = type === 'user' ? 'user' : 'merchant'
  try {
    const res = await request({
      url: '/api/code',
      method: 'POST',
      data: { phone: phoneVal, role }
    })
    if (type === 'user') {
      userVerifyCode.value = res.data.code
    } else {
      merchantVerifyCode.value = res.data.code
    }
    uni.showToast({ title: '验证码已发送', icon: 'none' })
  } catch (e) {
    // 错误提示已在request封装中处理
  }
}

async function login(type: 'user' | 'merchant') {
  let phoneVal = type === 'user' ? phone.value : merchantPhone.value
  let codeVal = type === 'user' ? code.value : merchantCode.value
  const role = type === 'user' ? 'user' : 'merchant'
  if (!phoneVal || !codeVal) {
    uni.showToast({ title: '请输入手机号和验证码', icon: 'none' })
    return
  }

    const res = await request({
      url: '/api/login',
      method: 'POST',
      data: { phone: phoneVal, code: codeVal, role }
    })
    uni.showToast({ title: (type === 'user' ? '用户' : '商家') + '登录成功', icon: 'success' })
    uni.setStorageSync('token', res.data.token)
    // 跳转到不同页面
    if (res.data.role === 'user') {
      uni.switchTab({ url: '/pages/client/c-home' })
    } else if (res.data.role === 'merchant') {
      uni.reLaunch({ url: '/pages/merchant/m-services' })
    }
  
}
</script>

<template>
  <view class="login-container">
    <view class="login-tabs">
      <view :class="['tab', activeTab==='user'?'active':'']" @click="activeTab='user'">用户</view>
      <view :class="['tab', activeTab==='merchant'?'active':'']" @click="activeTab='merchant'">商家</view>
    </view>
    <view v-if="activeTab==='user'">
      <uni-easyinput
        v-model="phone"
        placeholder="请输入手机号"
        type="number"
        class="login-input"
        :inputBorder="true"
        clearable
      />
      <view class="login-code-row">
        <uni-easyinput
          v-model="code"
          placeholder="验证码"
          type="number"
          class="login-input code-input"
          :inputBorder="true"
          clearable
        />
        <button
          class="code-btn"
          type="primary"
          @click="getCode('user')"
        >获取验证码</button>
        <view v-if="userVerifyCode" class="verify-code-show">{{ userVerifyCode }}</view>
      </view>
      <button
        class="login-btn"
        type="primary"
        @click="login('user')"
      >登录/注册</button>
    </view>
    <view v-else>
      <uni-easyinput
        v-model="merchantPhone"
        placeholder="请输入商家手机号"
        type="number"
        class="login-input"
        :inputBorder="true"
        clearable
      />
      <view class="login-code-row">
        <uni-easyinput
          v-model="merchantCode"
          placeholder="验证码"
          type="number"
          class="login-input code-input"
          :inputBorder="true"
          clearable
        />
        <button
          class="code-btn merchant"
          type="primary"
          @click="getCode('merchant')"
        >获取验证码</button>
        <view v-if="merchantVerifyCode" class="verify-code-show">{{ merchantVerifyCode }}</view>
      </view>
      <button
        class="login-btn merchant"
        type="primary"
        @click="login('merchant')"
      >登录/注册</button>
      <!-- <view class="merchant-register-tip">还没有商家账号？<text class="register-link">去注册</text></view> -->
    </view>
  </view>
</template>

<style>
.login-container {
  padding: 60rpx 40rpx;
}
.login-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;
}
.tab {
  flex: 1;
  text-align: center;
  font-size: 36rpx;
  padding: 20rpx 0;
  color: #888;
  border-bottom: 4rpx solid transparent;
  transition: color 0.2s, border-color 0.2s;
}
.tab.active {
  color: #1aad19;
  font-weight: bold;
  border-bottom: 4rpx solid #1aad19;
}
.login-title {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 60rpx;
  text-align: center;
}
.login-input {
  margin-bottom: 30rpx;
}
.login-code-row {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  position: relative;
}
.code-input {
  flex: 1;
  margin-right: 20rpx;
}
.code-btn {
  height: 80rpx;
  font-size: 28rpx;
  background: #1aad19;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  padding: 0 30rpx;
}
.code-btn.merchant {
  background: #007aff;
}
.verify-code-show {
  min-width: 60rpx;
  margin-left: 16rpx;
  color: #ff6600;
  font-size: 28rpx;
  font-weight: bold;
  align-self: center;
}
.login-btn {
  width: 100%;
  height: 80rpx;
  font-size: 32rpx;
  margin-top: 30rpx;
  background: #1aad19;
  color: #fff;
  border: none;
  border-radius: 8rpx;
}
.login-btn.merchant {
  background: #007aff;
}
.merchant-register-tip {
  margin-top: 30rpx;
  text-align: center;
  color: #888;
  font-size: 28rpx;
}
.register-link {
  color: #007aff;
  margin-left: 10rpx;
}
</style>
