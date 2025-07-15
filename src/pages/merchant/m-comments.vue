<script setup lang="ts">
import { onMounted, ref } from 'vue'

const comments = ref<any[]>([])
onMounted(() => {
  comments.value = [
    { id: 1, service: '女士洗剪吹', customer: '张三', time: '2024-01-12 10:00', stars: '★★★★★', score: 5.0, content: '服务很好，剪得很满意，下次还会来的！' },
    { id: 2, service: '美甲护理', customer: '李四', time: '2024-01-10 14:00', stars: '★★★★☆', score: 4.0, content: '技术不错，但是等待时间有点长。' },
  ]
})
function reply(item: any) {
  uni.showToast({ title: '已回复(模拟)', icon: 'none' })
}
</script>

<template>
  <view class="m-comments-page">
    <view class="title">
      评价管理
    </view>
    <view v-for="item in comments" :key="item.id" class="comment-item">
      <view class="name">
        {{ item.service }}
      </view>
      <view class="desc">
        客户：{{ item.customer }}
      </view>
      <view class="desc">
        服务时间：{{ item.time }}
      </view>
      <view style="margin:8px 0;">
        <text style="color:#f39c12;">
          {{ item.stars }}
        </text>
        <text style="margin-left:5px;color:#666;">
          {{ item.score }}分
        </text>
      </view>
      <view class="content">
        "{{ item.content }}"
      </view>
      <button style="background:#3498db;margin-top:8px;" @click="reply(item)">
        回复
      </button>
    </view>
  </view>
</template>

<style scoped>
.m-comments-page { padding: 20px; }
.title { font-size: 20px; font-weight: bold; margin-bottom: 16px; }
.comment-item { background: #fff; border: 1px solid #e9ecef; padding: 10px; border-radius: 8px; margin-bottom: 12px; }
.name { font-size: 16px; font-weight: 600; }
.desc { color: #666; font-size: 13px; margin: 2px 0; }
.content { background: #f8f9fa; padding: 8px; border-radius: 4px; margin: 5px 0; }
</style>
