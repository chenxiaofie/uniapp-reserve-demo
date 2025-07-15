<script setup lang="ts">
import { ref } from 'vue'
import { request } from '@/utils/request'
import { onLoad } from '@dcloudio/uni-app'

const title = ref('')
const desc = ref('')
const price = ref('')
const duration = ref('')
const designer = ref('')
const icon = ref('')
const dates = ref<string[]>([])
const times = ref<string[]>([])
const loading = ref(false)

const dateInput = ref('')
const timeInput = ref('')

function onDateChange(e: any) {
  dateInput.value = e.detail.value
}
function onTimeChange(e: any) {
  timeInput.value = e.detail.value
}
function addDate() {
  if (dateInput.value && !dates.value.includes(dateInput.value)) {
    dates.value.push(dateInput.value)
    dateInput.value = ''
  }
}
function removeDate(idx: number) {
  dates.value.splice(idx, 1)
}
function addTime() {
  if (timeInput.value && !times.value.includes(timeInput.value)) {
    times.value.push(timeInput.value)
    timeInput.value = ''
  }
}
function removeTime(idx: number) {
  times.value.splice(idx, 1)
}

onLoad(async (options: Record<string, any> = {}) => {
  if (options && options.id) {
    const res = await request({ url: `/api/services/${options.id}`, method: 'GET' })
    const data = res.data
    title.value = data.title
    desc.value = data.desc
    price.value = String(data.price)
    duration.value = String(data.duration)
    designer.value = data.designer
    icon.value = data.icon
    dates.value = data.dates || []
    times.value = data.times || []
  }
})

async function submit() {
  if (!title.value || !desc.value || !price.value || !duration.value || !designer.value) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  loading.value = true
  try {
    await request({
      url: '/api/services',
      method: 'POST',
      data: {
        title: title.value,
        desc: desc.value,
        price: Number(price.value),
        duration: Number(duration.value),
        designer: designer.value,
        icon: icon.value || 'https://dummyimage.com/100x100/1aad19/fff&text=新',
        dates: dates.value,
        times: times.value
      }
    })
    uni.showToast({ title: '发布成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 800)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <view class="publish-page">
    <view class="form-card">
      <view class="form-title">发布新服务</view>
      <input v-model="title" class="input" placeholder="服务标题" />
      <textarea v-model="desc" class="textarea" placeholder="服务描述" />
      <input v-model="designer" class="input" placeholder="设计师/服务人员" />
      <input v-model="icon" class="input" placeholder="服务图标URL(可选)" />
      <input v-model="price" class="input" type="number" placeholder="价格(元)" />
      <input v-model="duration" class="input" type="number" placeholder="时长(分钟)" />
      <view class="sub-title">可预约日期</view>
      <view class="row">
        <picker mode="date" :value="dateInput" @change="onDateChange">
          <view class="picker-btn">{{ dateInput || '请选择日期' }}</view>
        </picker>
        <button class="mini-btn add" @click="addDate">添加</button>
      </view>
      <view class="tag-list">
        <view v-for="(d,idx) in dates" :key="d" class="tag">
          {{ d }} <text class="remove" @click="removeDate(idx)">×</text>
        </view>
      </view>
      <view class="sub-title">可预约时间</view>
      <view class="row">
        <picker mode="time" :value="timeInput" @change="onTimeChange">
          <view class="picker-btn">{{ timeInput || '请选择时间' }}</view>
        </picker>
        <button class="mini-btn add" @click="addTime">添加</button>
      </view>
      <view class="tag-list">
        <view v-for="(t,idx) in times" :key="t" class="tag">
          {{ t }} <text class="remove" @click="removeTime(idx)">×</text>
        </view>
      </view>
      <button class="submit-btn" :disabled="loading" @click="submit">{{ loading ? '发布中...' : '发布服务' }}</button>
    </view>
  </view>
</template>

<style scoped>
.publish-page {
  min-height: 100vh;
  background: #f4f6fa;
  padding: 24px 0;
}
.form-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 22px 18px 18px 18px;
  max-width: 420px;
  margin: 0 auto;
}
.form-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 18px;
  text-align: center;
}
.input {
  width: 100%;
  height: 38px;
  border: 1px solid #e0e0e0;
  border-radius: 7px;
  margin-bottom: 14px;
  padding: 0 10px;
  font-size: 15px;
  background: #fafbfc;
}
.textarea {
  width: 100%;
  min-height: 60px;
  border: 1px solid #e0e0e0;
  border-radius: 7px;
  margin-bottom: 14px;
  padding: 8px 10px;
  font-size: 15px;
  background: #fafbfc;
}
.sub-title {
  font-size: 15px;
  color: #888;
  margin: 8px 0 4px 0;
}
.row {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
}
.picker-btn {
  flex: 1;
  height: 32px;
  line-height: 32px;
  background: #fafbfc;
  border: 1px solid #e0e0e0;
  border-radius: 7px;
  padding: 0 10px;
  font-size: 15px;
  color: #666;
  margin-right: 10px;
}
.mini-btn {
  height: 32px;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  color: #fff;
  background: #27ae60;
  padding: 0 14px;
}
.mini-btn.add {
  background: #3498db;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}
.tag {
  background: #e8f8f2;
  color: #27ae60;
  border-radius: 12px;
  padding: 2px 10px;
  font-size: 13px;
  display: flex;
  align-items: center;
}
.tag .remove {
  color: #e74c3c;
  margin-left: 4px;
  cursor: pointer;
}
.submit-btn {
  width: 100%;
  height: 42px;
  background: #27ae60;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  margin-top: 10px;
  font-weight: 600;
  letter-spacing: 1px;
}
.submit-btn:disabled {
  background: #b2bec3;
}
</style>
