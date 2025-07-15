<script setup lang="ts">
import { ref } from 'vue'
import { request } from '@/utils/request'
import { onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const orders = ref<any[]>([])
const loading = ref(false)
const statusMap = {
  unpaid: '待支付',
  pending: '待确认',
  confirmed: '已确认',
  finished: '已完成',
  rejected: '已拒绝'
}

async function fetchOrders() {
  loading.value = true
  try {
    const res = await request({ url: '/api/orders', method: 'GET' })
    orders.value = res.data || []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
onShow(() => {
  fetchOrders()
})

async function confirm(item: any) {
  await request({ url: `/api/orders/${item.id}/confirm`, method: 'POST' })
  uni.showToast({ title: '已确认', icon: 'success' })
  fetchOrders()
}
async function finish(item: any) {
  await request({ url: `/api/orders/${item.id}/finish`, method: 'POST' })
  uni.showToast({ title: '服务已完成', icon: 'success' })
  fetchOrders()
}
async function reject(item: any) {
  await request({ url: `/api/orders/${item.id}/reject`, method: 'POST' })
  uni.showToast({ title: '已拒绝', icon: 'none' })
  fetchOrders()
}
</script>

<template>
  <view class="m-orders-page">
    <view class="title">接单管理</view>
    <view v-if="orders.length === 0 && !loading" class="empty-tip">暂无订单</view>
    <view v-for="item in orders" :key="item.id" class="order-card">
      <view class="order-header">
        <view class="order-title">{{ item.service }}</view>
        <view class="status-tag" :class="item.status">{{ statusMap[item.status as keyof typeof statusMap] || item.status }}</view>
      </view>
      <view class="desc">预约时间：{{ item.time }}</view>
      <view class="desc">金额：¥{{ item.price }}</view>
      <view class="card-actions">
        <template v-if="item.status === 'unpaid'">
          <button class="mini-btn gray" disabled>待支付</button>
        </template>
        <template v-else-if="item.status === 'pending'">
          <button class="mini-btn confirm" @click="confirm(item)">确认接单</button>
          <button class="mini-btn reject" @click="reject(item)">拒绝</button>
        </template>
        <template v-else-if="item.status === 'confirmed'">
          <button class="mini-btn finish" @click="finish(item)">完成服务</button>
        </template>
        <template v-else-if="item.status === 'finished'">
          <button class="mini-btn gray" disabled>已完成</button>
        </template>
        <template v-else-if="item.status === 'rejected'">
          <button class="mini-btn gray" disabled>已拒绝</button>
        </template>
      </view>
    </view>
  </view>
</template>

<style scoped>
.m-orders-page { padding: 20px; background: #f4f6fa; min-height: 100vh; }
.title { font-size: 20px; font-weight: bold; margin-bottom: 16px; }
.empty-tip { text-align: center; color: #aaa; font-size: 15px; margin: 40px 0 20px 0; }
.order-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 14px 14px 10px 14px; margin-bottom: 16px; }
.order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.order-title { font-size: 16px; font-weight: 600; }
.status-tag { font-size: 13px; padding: 2px 10px; border-radius: 12px; font-weight: 500; }
.status-tag.unpaid { background: #f5f6fa; color: #888; }
.status-tag.pending { background: #fef9f3; color: #f39c12; }
.status-tag.confirmed { background: #e8f5e8; color: #27ae60; }
.status-tag.finished { background: #e8f8f2; color: #27ae60; }
.status-tag.rejected { background: #fbeeea; color: #e74c3c; }
.desc { color: #666; font-size: 14px; margin: 2px 0 10px 0; }
.card-actions { display: flex; gap: 10px; margin-top: 4px; }
.mini-btn { flex: 1; font-size: 14px; height: 32px; border-radius: 6px; border: none; color: #fff; background: #b2bec3; }
.mini-btn.confirm { background: #27ae60; }
.mini-btn.finish { background: #3498db; }
.mini-btn.reject { background: #e74c3c; }
.mini-btn.gray { background: #b2bec3; color: #fff; }
.mini-btn[disabled] { opacity: 0.7; }
</style>
