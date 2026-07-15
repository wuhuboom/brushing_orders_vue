<template>
  <!-- 顶部悬浮导航，默认隐藏 -->
  <div class="top-nav" :class="{ show: isShowNav }">
    顶部菜单栏
  </div>

  <!-- 页面主体长内容，撑开滚动 -->
  <div class="content"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 是否显示导航
const isShowNav = ref(false)
// 滚动临界值：滚动超过该像素就显示导航
const threshold = 100

// 滚动监听函数
function handleScroll() { 
	console.log(222)
  // document.documentElement.scrollTop 页面滚动距离
  const scrollTop = document.documentElement.scrollTop || window.pageYOffset
  console.log(scrollTop)
  console.log(threshold)
  isShowNav.value = scrollTop > threshold
}

onMounted(() => {
	console.log(8888)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  // 销毁组件必须移除监听，防止内存泄漏
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  z-index: 999;
  /* 默认隐藏 */
  opacity: 0;
  transform: translateY(-100%);
  transition: all 0.3s ease;
}
.top-nav.show {
  opacity: 1;
  transform: translateY(0);
}
.content {
  height: 2000px;
}
</style>