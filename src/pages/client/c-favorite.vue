<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request } from '@/utils/request'

interface FavoriteItem {
  serviceId: number
  service: string
  icon: string
}

const favorites = ref<FavoriteItem[]>([])

async function fetchFavorites() {
  try {
    const res = await request({ url: '/api/favorites' })
    favorites.value = res.data
  } catch (e) {}
}

onMounted(fetchFavorites)
onShow(fetchFavorites)

if (uni.$on) {
  uni.$on('favorite-updated', fetchFavorites)
}

async function removeFavorite(id: number) {
  await request({ url: `/api/favorites/${id}`, method: 'DELETE' })
  await fetchFavorites()
  uni.$emit && uni.$emit('favorite-updated')
  uni.showToast({ title: '已取消收藏', icon: 'none' })
}

function goReserve(id: number) {
  uni.navigateTo({ url: `/pages/client/c-reserve?id=${id}` })
}
</script>

<template>
  <view class="favorite-list-wrap">
    <uni-list>
      <uni-list-item
        v-for="item in favorites"
        :key="item.serviceId"
        :title="item.service"
        clickable
        @click="goReserve(item.serviceId)"
      >
        <template #header>
          <image :src="item.icon" class="item-icon" mode="aspectFill" />
        </template>
        <template #footer>
          <uni-icons type="heart-filled" size="22" color="#ff9900" />
          <button class="remove-btn" @click.stop="removeFavorite(item.serviceId)">取消收藏</button>
        </template>
      </uni-list-item>
    </uni-list>
    <view v-if="favorites.length === 0" class="empty-tip">暂无收藏</view>
  </view>
</template>

<style>
.favorite-list-wrap {
  padding: 24rpx 0;
}
.item-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 12rpx;
  margin-right: 24rpx;
  background: #f5f5f5;
}
.remove-btn {
  margin-left: 16rpx;
  background: #fff0f0;
  color: #e74c3c;
  border: 1rpx solid #e74c3c;
  border-radius: 8rpx;
  font-size: 26rpx;
  padding: 8rpx 20rpx;
}
.empty-tip {
  text-align: center;
  color: #bbb;
  font-size: 30rpx;
  margin-top: 80rpx;
}
</style>
