<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'
import { onShow } from '@dcloudio/uni-app'
import { switchRole } from '@/utils/switchRole'

const services = ref<any[]>([])
const loading = ref(false)

async function fetchServices() {
  loading.value = true
  try {
    const res = await request({ url: '/api/services', method: 'GET' })
    services.value = res.data || []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchServices()
})
onShow(() => {
  fetchServices()
})

function edit(item: any) {
  uni.navigateTo({ url: `/pages/merchant/m-publish?id=${item.id}` })
}
async function up(item: any) {
  try {
    await request({ url: `/api/services/${item.id}/up`, method: 'POST' })
    uni.showToast({ title: '已上架', icon: 'none' })
    fetchServices()
  } catch (e) {}
}
async function down(item: any) {
  try {
    await request({ url: `/api/services/${item.id}/down`, method: 'POST' })
    uni.showToast({ title: '已下架', icon: 'none' })
    fetchServices()
  } catch (e) {}
}
async function remove(item: any) {
  try {
    await request({ url: `/api/services/${item.id}`, method: 'DELETE' })
    uni.showToast({ title: '已删除', icon: 'none' })
    fetchServices()
  } catch (e) {}
}
function goPublish() {
  uni.navigateTo({ url: '/pages/merchant/m-publish' })
}
function goOrders() {
  uni.navigateTo({ url: '/pages/merchant/m-orders' })
}
function goComments() {
  uni.navigateTo({ url: '/pages/merchant/m-comments' })
}
async function switchToClient() {
  const token = uni.getStorageSync('token')
  if (token) {
    try {
      const res = await request({
        url: '/api/user',
        method: 'GET',
        header: { Authorization: token }
      })
      const roles = res.data.roles || (res.data.role ? [res.data.role] : [])
      if (roles.includes('user')) {
        uni.switchTab({ url: '/pages/client/c-home' })
      } else {
        uni.showToast({ title: '当前账号无用户端权限', icon: 'none' })
      }
    } catch (e) {
      uni.removeStorageSync('token')
      uni.reLaunch({ url: '/pages/login' })
    }
  } else {
    uni.reLaunch({ url: '/pages/login' })
  }
}
</script>

<template>
  <view class="m-services-page">
    <view class="top-bar">
      <view class="top-actions">
        <button class="action-btn" @click="goOrders">接单管理</button>
        <button class="action-btn" @click="goComments">评价管理</button>
      </view>
      <button class="switch-btn" @click="switchRole('merchant')">切换到客户端</button>
    </view>
    <view class="title">服务管理</view>
    <view v-if="services.length === 0" class="empty-tip">
      暂无服务，点击下方按钮发布新服务
    </view>
    <view v-for="item in services" :key="item.id" class="service-card">
      <view class="service-header">
        <view class="name">{{ item.title }}</view>
        <view class="status-tag" :class="item.status === 'on' ? 'on' : 'off'">
          <text class="dot"></text>{{ item.status === 'on' ? '已上架' : '已下架' }}
        </view>
      </view>
      <view class="desc">价格：¥{{ item.price }} | 时长：{{ item.duration }}分钟</view>
      <view class="desc">{{ item.desc }}</view>
      <view class="card-actions">
        <button class="mini-btn edit" @click="edit(item)">编辑</button>
        <button v-if="item.status === 'on'" class="mini-btn down" @click="down(item)">下架</button>
        <button v-else class="mini-btn up" @click="up(item)">上架</button>
        <button class="mini-btn remove" @click="remove(item)">删除</button>
      </view>
    </view>
    <button class="publish-btn" @click="goPublish">+ 发布新服务</button>
  </view>
</template>

<style scoped>
.m-services-page {
  padding: 20px;
  background: #f4f6fa;
  min-height: 100vh;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.top-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
}
.action-btn {
  flex: 1;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  height: 40px;
}
.switch-btn {
  background: #f39c12;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  height: 40px;
  padding: 0 18px;
  margin-left: 12px;
  font-weight: 600;
  letter-spacing: 1px;
}
.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}
.empty-tip {
  text-align: center;
  color: #aaa;
  font-size: 15px;
  margin: 40px 0 20px 0;
}
.service-card {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border-radius: 12px;
  padding: 16px 14px 12px 14px;
  margin-bottom: 16px;
  transition: box-shadow 0.2s;
}
.service-card:active {
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
}
.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.name {
  font-size: 17px;
  font-weight: 600;
}
.status-tag {
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 500;
}
.status-tag.on {
  background: #e8f8f2;
  color: #27ae60;
}
.status-tag.off {
  background: #fbeeea;
  color: #e74c3c;
}
.status-tag .dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 6px;
  background: currentColor;
}
.desc {
  color: #666;
  font-size: 14px;
  margin: 2px 0 10px 0;
}
.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}
.mini-btn {
  flex: 1;
  font-size: 14px;
  height: 32px;
  border-radius: 6px;
  border: none;
  color: #fff;
  background: #b2bec3;
}
.mini-btn.edit {
  background: #2980b9;
}
.mini-btn.up {
  background: #27ae60;
}
.mini-btn.down {
  background: #f39c12;
}
.mini-btn.remove {
  background: #e74c3c;
}
.publish-btn {
  width: 100%;
  margin-top: 28px;
  background: #27ae60;
  color: #fff;
  font-size: 17px;
  height: 44px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  letter-spacing: 1px;
}
</style>
