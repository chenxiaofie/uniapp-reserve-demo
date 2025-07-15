<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { request } from '@/utils/request'
import { useOrderStore } from '@/store/order'

const id = ref('')
const remark = ref('')
const date = ref('')
const time = ref('')
const service = ref({
  title: '',
  designer: '',
  price: 0,
  duration: 0,
  dates: [],
  times: []
})

const orderStore = useOrderStore()

onLoad(async (options) => {
  id.value = options.id
  // 根据id请求服务详情
  try {
    const res = await request({ url: `/api/services/${id.value}` })
    service.value = res.data
  } catch (e) {}
})

function onDateChange(e) {
  date.value = service.value.dates[e.detail.value]
}
function onTimeChange(e) {
  time.value = service.value.times[e.detail.value]
}

async function submit() {
  if (!date.value || !time.value) {
    uni.showToast({ title: '请选择日期和时间', icon: 'none' })
    return
  }
  try {
    await orderStore.addOrder({
      serviceId: id.value,
      service: service.value.title,
      date: date.value,
      time: time.value,
      price: service.value.price,
      remark: remark.value
    })
    uni.showToast({ title: '预约成功', icon: 'success' })
    uni.navigateBack()
  } catch (e) {}
}
</script>

<template>
  <view class="reserve-page">
    <view class="card service-info">
      <view class="service-title">{{ service.title }}</view>
      <view class="service-desc">设计师：{{ service.designer }}</view>
      <view class="service-desc">价格：¥{{ service.price }} | 时长：{{ service.duration }}分钟</view>
    </view>
    <view class="section">
      <view class="section-label">选择日期</view>
      <picker :range="service.dates" @change="onDateChange">
        <view class="picker-view">{{ date || '请选择日期' }}</view>
      </picker>
    </view>
    <view class="section">
      <view class="section-label">选择时间</view>
      <picker :range="service.times" @change="onTimeChange">
        <view class="picker-view">{{ time || '请选择时间' }}</view>
      </picker>
    </view>
    <view class="section">
      <view class="section-label">备注信息</view>
      <uni-easyinput
        v-model="remark"
        placeholder="备注信息（可选）"
        type="textarea"
        :inputBorder="true"
        autoHeight
      />
    </view>
    <button class="reserve-btn" @click="submit">
      确认预约
    </button>
  </view>
</template>

<style>
.reserve-page {
  padding: 32rpx 24rpx;
  background: #f7f8fa;
  min-height: 100vh;
}
.card.service-info {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
  padding: 32rpx 24rpx;
  margin-bottom: 32rpx;
}
.service-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
}
.service-desc {
  font-size: 28rpx;
  color: #888;
  margin-bottom: 6rpx;
}
.section {
  margin-bottom: 32rpx;
}
.section-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
}
.picker-view {
  padding: 24rpx;
  background: #fff;
  border-radius: 8rpx;
  color: #333;
  font-size: 30rpx;
  margin-bottom: 12rpx;
}
.reserve-btn {
  width: 100%;
  height: 88rpx;
  background: #1aad19;
  color: #fff;
  font-size: 32rpx;
  border: none;
  border-radius: 12rpx;
  margin-top: 24rpx;
}
</style>
