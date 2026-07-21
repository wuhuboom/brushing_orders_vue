<template>
   <div
      ref="scrollWrap"
      class="text-white font-normal dark:text-[#303133] text-sm w-full hide-scroll overflow-scroll"
      id="router-view"
    >
	  <router-view class="text-white font-normal dark:text-[#303133] text-sm w-full hide-scroll overflow-scroll" id="router-view">
	  </router-view>
      <!-- <router-view v-slot="{ Component }">
        <keep-alive include="My">
          <component :is="Component" />
        </keep-alive>
      </router-view> -->
    </div>
  <!-- <router-view class="text-white font-normal dark:text-[#303133] text-sm w-full hide-scroll overflow-scroll" id="router-view">
  </router-view> -->
</template>

<script setup>
import { useUserStore } from '@/store/modules/user';
import { useCommonStore } from '@/store/modules/common';
import { useI18n } from 'vue-i18n';
import BigNumber from 'bignumber.js';
import { useScrollStore } from '@/util/scroll';
import { useRoute } from 'vue-router'
import { onUnmounted, ref, onMounted, watch } from 'vue';
// 在文件顶部添加BigNumber全局配置
BigNumber.config({
  DECIMAL_PLACES: 10, // 全局设置保留10位小数
  ROUNDING_MODE: BigNumber.ROUND_DOWN, // 设置舍入模式为向下取整
  ERRORS: false, // 禁用错误提示
});



// import webSocket from '@/common/webSocket'; // socket启动
const userStore = useUserStore();
const commonStore = useCommonStore();
// commonStore.getSystemConfig();
const { locale } = useI18n();
if (userStore.token){
  userStore.getUserInfo();
} 
userStore.getZone();
if (commonStore.lang) locale.value = commonStore.lang;

const route = useRoute()
const scrollStore = useScrollStore()
const scrollWrap = ref(null)
let prevPageName = ''

// 安全获取当前页面组件名称（增加多层判空，杜绝报错）
const getCurrentComponentName = () => {
  if (!route.matched || route.matched.length === 0) return ''
  const match = route.matched[0]
  if (!match?.components?.default) return ''
  return match.components.default.name || ''
}

// 监听路由完整路径变化（切换页面触发保存/恢复）
watch(() => route.fullPath, (newPath, oldPath) => {
  // 1. 离开旧页面，保存滚动高度
  const oldPageName = prevPageName
  
  if (oldPageName && scrollWrap.value) {
    scrollStore.setPageScroll(oldPageName, scrollWrap.value.children[0].scrollTop)
  }

  // 2. 获取新页面名称并缓存
  const newPageName = getCurrentComponentName()
  prevPageName = newPageName

  // 3. 延迟恢复滚动位置（等待DOM渲染）
  if (newPageName) {
    setTimeout(() => {
      const saveTop = scrollStore.getPageScroll(newPageName)
	  if(newPath == '/home' || newPath == '/starting' || newPath == '/records'){
		if (scrollWrap.value) scrollWrap.value.scrollTop = saveTop
	  }
      if(newPath == '/my'){
		if (scrollWrap.value) scrollWrap.value.children[0].scrollTop = saveTop
	  }
    }, 30)
  }
}, { immediate: true })
</script>

<style>
.el-divider {
  margin: 0 !important;
}

:deep(.el-input__wrapper) {
  background-color: #ececec !important;
  box-shadow: none !important;
  font-size: 16px;
}

:deep(.el-input__wrapper:focus-visible) {
  outline: none !important;
}

:deep(.is-focus) {
  box-shadow: none !important;
}

.container {
  /* max-width: 1440px; */
}

/* .text-black {
  color: #303133 !important;
} */

.el-drawer {
  border-top-left-radius: 20px !important;
  border-top-right-radius: 20px !important;
}

.el-drawer__body {
  color: #303133 !important;
}

.el-drawer__header {
  color: #303133 !important;
}

.button-bg {
  background-image: url(@/static/images/block-bg.png);
  background-size: 100% auto;
  background-repeat: no-repeat;
}

.box-shadow {
  box-shadow: 0px 3px 8px 0 rgba(0, 0, 0, .16);
}

.hide-scroll::-webkit-scrollbar {
  display: none;
}


</style>
