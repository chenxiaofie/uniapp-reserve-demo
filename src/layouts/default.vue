<template>
  <view class="layout">
    <!-- #ifdef MP-WEIXIN -->
    <uni-nav-bar 
      title="服务预约平台" 
      :border="false"
      background-color="#fff"
      status-bar
      :fixed="true"
    />
    <!-- #endif -->
    <view class="layout-content">
      <slot />
    </view>
  </view>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  background: #f8f9fa;
}

.layout-content {
  /* #ifdef MP-WEIXIN */
  padding-top: 88px; /* 为固定导航栏预留空间 */
  /* #endif */
  padding: 16px;
}
</style>