<script setup lang="ts">
import { onMounted } from 'vue'
import { useOrderStore } from '@/store/order'

const orderStore = useOrderStore()

onMounted(() => {
  orderStore.fetchOrders()
})

function getStatusColor(status: string) {
  if (status === '待支付') return '#ff9900'
  if (status === '已完成') return '#1aad19'
  if (status === '已取消') return '#ccc'
  return '#888'
}
</script>

<template>
  <view class="orders-list-wrap">
    <uni-list>
      <uni-list-item
        v-for="item in orderStore.orders"
        :key="item.id"
        :title="item.service"
        :note="item.time"
        clickable
      >
        <template #header>
          <view class="order-status" :style="{ color: getStatusColor(item.status) }">
            {{ item.status }}
          </view>
        </template>
        <template #footer>
          <view class="order-price">￥{{ item.price }}</view>
        </template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<style>
.orders-list-wrap {
  padding: 24rpx 0;
}
.order-status {
  font-size: 28rpx;
  font-weight: bold;
  margin-right: 24rpx;
}
.order-price {
  font-size: 30rpx;
  color: #1aad19;
  font-weight: bold;
  margin-left: 16rpx;
}
</style>
 