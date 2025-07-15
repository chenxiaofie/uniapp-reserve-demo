<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'

interface ServiceItem {
  id: number;
  title: string;
  desc: string;
  icon: string;
}

const services = ref<ServiceItem[]>([])
const favoriteIds = ref<number[]>([])

onMounted(async () => {
  await fetchServices()
  await fetchFavorites()
  if (uni.$on) {
    uni.$on('favorite-updated', fetchFavorites)
  }
})

async function fetchServices() {
  try {
    const res = await request({ url: '/api/services?status=on' })
    services.value = res.data
  } catch (e) {}
}

async function fetchFavorites() {
  try {
    const res = await request({ url: '/api/favorites' })
    favoriteIds.value = res.data.map((f: any) => f.serviceId)
  } catch (e) {}
}

function goDetail(id: number) {
  uni.navigateTo({
    url: `/pages/client/c-reserve?id=${id}`
  })
}

async function toggleFavorite(item: ServiceItem) {
  if (favoriteIds.value.includes(item.id)) {
    // 取消收藏
    await request({ url: `/api/favorites/${item.id}`, method: 'DELETE' })
    uni.showToast({ title: '已取消收藏', icon: 'none' })
  } else {
    // 收藏
    await request({
      url: '/api/favorites',
      method: 'POST',
      data: {
        serviceId: item.id,
        service: item.title,
        icon: item.icon
      }
    })
    uni.showToast({ title: '已收藏', icon: 'success' })
  }
  await fetchFavorites()
  uni.$emit && uni.$emit('favorite-updated')
}
</script>

<template>
  <view class="home-list-wrap">
    <uni-list>
      <uni-list-item
        v-for="item in services"
        :key="item.id"
        :title="item.title"
        :note="item.desc"
        clickable
        @click="goDetail(item.id)"
      >
        <template #header>
          <image :src="item.icon" class="item-icon" mode="aspectFill" />
        </template>
        <template #footer>
          <uni-icons type="right" size="22" color="#bbb" />
          <button
            class="favorite-btn"
            :class="{ active: favoriteIds.includes(item.id) }"
            @click.stop="toggleFavorite(item)"
          >{{ favoriteIds.includes(item.id) ? '已收藏' : '收藏' }}</button>
        </template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<style>
.home-list-wrap {
  padding: 24rpx 0;
}
.item-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 12rpx;
  margin-right: 24rpx;
  background: #f5f5f5;
}
.favorite-btn {
  margin-left: 16rpx;
  background: #fffbe6;
  color: #ff9900;
  border: 1rpx solid #ff9900;
  border-radius: 8rpx;
  font-size: 26rpx;
  padding: 8rpx 20rpx;
  transition: background 0.2s, color 0.2s;
}
.favorite-btn.active {
  background: #ff9900;
  color: #fff;
}
</style>
